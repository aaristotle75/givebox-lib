import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	ModalRoute,
	toggleModal
} from '../../';
import AmountsEdit from './amounts/AmountsEdit';
import AmountsList from './amounts/AmountsList';
import { BlockOption } from './Block';

class Amounts extends Component {

  constructor(props) {
    super(props);
		this.getAmounts = this.getAmounts.bind(this);
		this.edit = this.edit.bind(this);
		this.closeModalCallback = this.closeModalCallback.bind(this);
		this.closeModalButtons = this.closeModalButtons.bind(this);
    this.state = {
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
		`;
	}

	edit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
	}

	closeModalCallback() {
		//this.props.updateBlock(this.props.name, { content: this.state.content });
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

  render() {

		const {
			modalID,
			noRemove,
			article
		} = this.props;

		const {
			edit,
			amountsList,
			customIndex,
			defaultIndex,
			primaryColor
		} = this.state;

		if (util.isEmpty(amountsList)) return <></>

    return (
      <div className='block'>
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
							<AmountsEdit
								article={article}
							/>
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
				<AmountsList
					embed={true}
					list={amountsList}
					customIndex={customIndex}
					defaultIndex={defaultIndex}
					width={this.width}
					height={this.height}
					amountsCallback={this.props.amountsCallback}
					color={primaryColor}
					kind={this.props.kind}
					allowRecurring={util.getValue(article, 'allowRecurring')}
				/>
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
