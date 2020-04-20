import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	ModalRoute,
	toggleModal,
	Collapse
} from '../../';
import AmountsEdit from './amounts/AmountsEdit';
import AmountsList from './amounts/AmountsList';
import TicketsList from './amounts/TicketsList';
import Button from './Button';
import ButtonEdit from './ButtonEdit';
import { BlockOption } from './Block';

class Amounts extends Component {

  constructor(props) {
    super(props);
		this.getAmounts = this.getAmounts.bind(this);
		this.edit = this.edit.bind(this);
		this.buttonUpdated = this.buttonUpdated.bind(this);
		this.closeModalCallback = this.closeModalCallback.bind(this);
		this.closeModalButtons = this.closeModalButtons.bind(this);
		this.renderAmountsList = this.renderAmountsList.bind(this);
		this.closeModalAmountsListCallback = this.closeModalAmountsListCallback.bind(this);

		const button = {...util.getValue(props.globalOptions, 'button', {}), ...util.getValue(props.options, 'button', {}) };

    this.state = {
			button,
			newButtonChanges: {},
			amountsList: [],
			customIndex: 6,
			defaultIndex: 6,
			edit: false,
			primaryColor: this.props.primaryColor
    };
		this.blockRef = null;
		this.width = null;
		this.height = null;
  }

	componentDidMount() {
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.width = this.blockRef.clientWidth;
			this.height = this.blockRef.clientHeight;
		}
		this.setStyle();
		this.getAmounts();
	}

	setStyle() {
		const color = this.state.primaryColor;
		const rgb = util.hexToRgb(color);
		const color2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .1)`;
		const styleEl = document.head.appendChild(document.createElement('style'));
		styleEl.innerHTML = `
			.radio:checked + label:after {
				border: 1px solid ${color} !important;
				background: ${color};
			}

			.amountsSection ::-webkit-scrollbar-thumb {
			  background-color: ${color2};
			}

			.modalContent.gbx3 .amountRow {
				border-left: 4px solid ${color};
			}
		`;
	}

	edit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
	}

	closeModalCallback() {
		const button = { ...this.state.button };
		this.props.updateBlock(this.props.name, null, { button });
		this.setState({ edit: false });
	}

	closeModalButtons(type = 'save') {
		if (type === 'save') {
			this.closeModalCallback();
		} else {
			this.setState({ edit: false });
		}
		this.props.toggleModal(this.props.modalID, false);
	}

	closeModalAmountsListCallback() {
		console.log('execute closeModalAmountsListCallback');
	}

	remove() {
		console.log('execute remove');
	}

	getAmounts() {
		const article = this.props.article;
		let amountField = '';
		switch(this.props.kind) {
			case 'sweepstakes':
			case 'event': {
				amountField = 'tickets';
				break;
			}

			case 'memberships': {
				amountField = 'subscriptions';
				break;
			}

			case 'fundraisers':
			case 'invoices':
			default: {
				amountField = 'amounts';
				break;
			}
		}
		const amountsObj = util.getValue(article, amountField, {});
		const amountsList = util.getValue(amountsObj, 'list', []);
		this.setState({
			amountsList,
			customIndex: util.getValue(article, 'amountIndexCustom', 6),
			defaultIndex: util.getValue(article, 'amountIndexDefault', 6)
		});
	}

	renderAmountsList(embed = false) {

		const {
			article,
			kind
		} = this.props;

		const {
			amountsList,
			customIndex,
			defaultIndex,
			primaryColor,
			button
		} = this.state;

		switch (kind) {
			case 'event':
			case 'membership':
			case 'sweepstakes': {
				return (
					<TicketsList
						embed={false}
						list={amountsList}
						customIndex={customIndex}
						defaultIndex={defaultIndex}
						width={this.width}
						height={this.height}
						amountsCallback={this.props.amountsCallback}
						color={primaryColor}
						kind={this.props.kind}
						buttonEnabled={util.getValue(button, 'enabled', false)}
					/>
				)
			}

			case 'fundraiser':
			case 'invoices':
			default: {
				return (
					<AmountsList
						embed={embed}
						list={amountsList}
						customIndex={customIndex}
						defaultIndex={defaultIndex}
						width={this.width}
						height={this.height}
						amountsCallback={this.props.amountsCallback}
						color={primaryColor}
						kind={this.props.kind}
						allowRecurring={util.getValue(article, 'allowRecurring')}
						buttonEnabled={util.getValue(button, 'enabled', false)}
					/>
				)
			}
		}

	}

	buttonUpdated(button) {
		this.setState({ button });
	}

  render() {

		const {
			modalID,
			noRemove,
			article
		} = this.props;

		const {
			edit,
			amountsList,
			button
		} = this.state;

		if (util.isEmpty(amountsList)) return <></>

    return (
      <div className={`block ${util.getValue(button, 'enabled', false) ? 'flexCenter' : ''}`}>
				<BlockOption
					edit={edit}
					noRemove={noRemove}
					editOnClick={this.edit}
					removeOnClick={this.remove}
				/>
        <ModalRoute
					optsProps={{ closeCallback: this.closeModalCallback }}
					id={modalID}
					component={() =>
						<div className='modalWrapper'>
							<Collapse
								label={'Options'}
								iconPrimary='sliders'
								id={'gbx3-options'}
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
										<ButtonEdit
											label={'Enable Amounts Button'}
											button={button}
											update={this.buttonUpdated}
										/>
									</div>
								</div>
							</Collapse>
							<Collapse
								label={'Edit Amounts'}
								iconPrimary='edit'
								id={'gbx3-amounts'}
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
										<AmountsEdit
											article={article}
										/>
									</div>
								</div>
							</Collapse>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.closeModalButtons('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeModalButtons}>Save</GBLink>
							</div>
						</div>
					}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing Amounts`}
					closeCallback={this.closeModalCallback}
					disallowBgClose={true}
				/>
				{util.getValue(button, 'enabled', false) ?
					<>
						<ModalRoute
							className='gbx3'
							id='amountsList'
							component={() =>
								<div className='modalContainers'>
									<div className='topContainer'>
										<h3 className='center'>{util.getValue(button, 'text', 'Select Amount')}</h3>
									</div>
									<div className='middleContainer'>
										{this.renderAmountsList()}
									</div>
									<div className='bottomContainer'>
										<div className='cartInfo'>
											<GBLink allowCustom={true} onClick={() => console.log('items in cart')}><span style={{ display: 'block', fontSize: 12 }}>Items in Cart (8)</span></GBLink>
											<span style={{ display: 'block' }}><span style={{ fontSize: 12 }}>Sub Total:</span> <span className='strong'>{util.money(300)}</span></span>
										</div>
										<div className='button-group'>
											<GBLink allowCustom={true} onClick={() => console.log('Show more items')}>SHOP MORE ITEMS</GBLink>
											<GBLink className='button' allowCustom={true} onClick={() => console.log('checkout')}>CHECKOUT</GBLink>
										</div>
									</div>
								</div>
							}
							effect='3DFlipVert' style={{ width: '60%' }}
							draggable={false}
							closeCallback={this.closeModalAmountsListCallback}
							disallowBgClose={false}
						/>
						<Button
							modalID={`amountsList`}
							button={button}
						/>
					</>
				:
					this.renderAmountsList(true)
				}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

	const modalID = `amountBlock-${props.name}`;

  return {
		modalID
  }
}

export default connect(mapStateToProps, {
	toggleModal
})(Amounts);
