import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalRoute,
	toggleModal,
	Collapse,
	Tabs,
	Tab
} from '../../';
import AmountsEdit from './amounts/AmountsEdit';
import AmountsList from './amounts/AmountsList';
import TicketsList from './amounts/TicketsList';
import Button from './Button';
import ButtonEdit from './ButtonEdit';
import RecurringEdit from './amounts/RecurringEdit';
import { BlockOption } from './Block';

class Amounts extends Component {

	constructor(props) {
		super(props);
		this.getAmounts = this.getAmounts.bind(this);
		this.edit = this.edit.bind(this);
		this.amountsListUpdated = this.amountsListUpdated.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.renderAmountsList = this.renderAmountsList.bind(this);
		this.closeModalAmountsList = this.closeModalAmountsList.bind(this);
		this.closeModalAmountsEdit = this.closeModalAmountsEdit.bind(this);
		this.validateAmountsBeforeSave = this.validateAmountsBeforeSave.bind(this);

		const button = {...util.getValue(props.globalOptions, 'button', {}), ...util.getValue(props.options, 'button', {}) };
		const recurring = util.getValue(props.options, 'recurring', {});

		this.state = {
			button,
			defaultButton: { ...button },
			recurring,
			defaultRecurring: { ...recurring },
			amountsList: [],
			customIndex: 6,
			defaultIndex: 6,
			edit: false,
			primaryColor: this.props.primaryColor,
			validateAmounts: true,
			amountField: 'amounts'
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
		this.getAmounts();
	}

	edit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
	}

	closeModalAmountsEdit(type = 'save') {
		if (type !== 'cancel') {
			const button = { ...this.state.button };
			const recurring = { ...this.state.recurring };
			const amountsList = [ ...this.state.amountsList ];
			const customIndex = this.state.customIndexDefault;
			const defaultIndex = this.state.defaultIndexDefault;
			this.props.updateData({
				customIndex,
				defaultIndex,
				[this.state.amountField]: {
					list: amountsList
				}
			}, true);

			this.props.updateBlock(this.props.name, null, {
				button,
				recurring,
				amountsList,
				customIndex,
				defaultIndex
			});
			this.setState({ edit: false });
		} else {
			this.setState({
				edit: false,
				button: { ...this.state.defaultButton },
				recurring: { ...this.state.defaultRecurring },
				amountsList: [ ...this.state.amountsListDefault ],
				customIndex: this.state.customIndexDefault,
				defaultIndex: this.state.defaultIndexDefault
			});
		}
		this.props.toggleModal(this.props.modalID, false)
	}

	validateAmountsBeforeSave(validateAmounts, callback) {
		this.setState({ validateAmounts }, callback)
	}

	closeModalAmountsList() {
		console.log('execute closeModalAmountsList');
	}

	remove() {
		console.log('execute remove');
	}

	getAmounts() {
		const article = this.props.article;
		let amountField = this.state.amountField;
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
			amountField,
			amountsList,
			amountsListDefault: amountsList,
			customIndex: util.getValue(article, 'amountIndexCustom', 6),
			customIndexDefault: util.getValue(article, 'amountIndexCustom', 6),
			defaultIndex: util.getValue(article, 'amountIndexDefault', 6),
			defaultIndexDefault: util.getValue(article, 'amountIndexDefault', 6)
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
			button,
			recurring
		} = this.state;

		switch (kind) {
			case 'event':
			case 'membership':
			case 'sweepstakes': {
				return (
					<TicketsList
						embed={false}
						amountsList={amountsList}
						customIndex={customIndex}
						defaultIndex={defaultIndex}
						width={this.width}
						height={this.height}
						amountsCallback={this.props.amountsCallback}
						color={primaryColor}
						kind={this.props.kind}
						buttonEnabled={util.getValue(button, 'enabled', false)}
						article={article}
					/>
				)
			}

			case 'fundraiser':
			case 'invoices':
			default: {
				return (
					<AmountsList
						embed={embed}
						amountsList={amountsList}
						customIndex={customIndex}
						defaultIndex={defaultIndex}
						width={this.width}
						height={this.height}
						amountsCallback={this.props.amountsCallback}
						color={primaryColor}
						kind={this.props.kind}
						allowRecurring={util.getValue(recurring, 'enabled', true)}
						buttonEnabled={util.getValue(button, 'enabled', false)}
					/>
				)
			}
		}

	}

	amountsListUpdated(amountsList) {
		this.setState({ amountsList });
	}

	optionsUpdated(name, obj) {
		this.setState({ [name]: { ...obj } });
	}

	render() {

		const {
			modalID,
			noRemove,
			article,
			kind
		} = this.props;

		const {
			edit,
			amountsList,
			button,
			recurring
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
					id={modalID}
					className='gbx3amountsEdit'
					optsProps={{ closeCallback: this.closeModalAmountsEdit }}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing Amounts`}
					closeCallback={this.closeModalAmountsEdit}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Tabs
								default={'edit'}
								className='statsTab'
							>
								<Tab id='edit' label={<span className='stepLabel'>Edit Amounts</span>}>
								<Collapse
									label={'Edit Amounts'}
									iconPrimary='edit'
									id={'gbx3-amounts-edit'}
								>
									<div className='formSectionContainer'>
										<div className='formSection'>
											<AmountsEdit
												article={article}
												amountsList={amountsList}
												kind={kind}
												modalID={modalID}
												amountsListUpdated={this.amountsListUpdated}
											/>
										</div>
									</div>
								</Collapse>
								</Tab>
								<Tab id='buttonOption' label={<span className='stepLabel'>Customize Button</span>}>
									<Collapse
										label={'Customize Button'}
										iconPrimary='link-2'
										id={'gbx3-amounts-button'}
									>
										<div className='formSectionContainer'>
											<div className='formSection'>
												<ButtonEdit
													label={'Enable Amounts Button'}
													button={button}
													optionsUpdated={this.optionsUpdated}
												/>
											</div>
										</div>
									</Collapse>
								</Tab>
								{util.getValue(recurring, 'allowed', false) ?
								<Tab id='recurringOption' label={<span className='stepLabel'>Recurring Options</span>}>
									<Collapse
										label={'Recurring Options'}
										iconPrimary='repeat'
										id={'gbx3-amounts-recurring'}
									>
										<div className='formSectionContainer'>
											<div className='formSection'>
												<RecurringEdit
													recurring={recurring}
													article={article}
													kind={kind}
													updateData={this.props.updateData}
													optionsUpdated={this.optionsUpdated}
												/>
											</div>
										</div>
									</Collapse>
								</Tab> : <></>}
							</Tabs>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.closeModalAmountsEdit('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeModalAmountsEdit}>Save</GBLink>
							</div>
						</div>
					}
				/>
				{util.getValue(button, 'enabled', false) ?
					<>
						<ModalRoute
							className='gbx3'
							id='amountsList'
							component={() =>
								<div className='modalContainers'>
									<div className='topContainer'>
										<h3 style={{ padding: 0, margin: 0 }}>{util.getValue(button, 'text', 'Select Amount')}</h3>
										<span style={{ fontWeight: 300 }} className='center'>{util.getValue(article, 'title')}</span>
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
							closeCallback={this.closeModalAmountsList}
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
