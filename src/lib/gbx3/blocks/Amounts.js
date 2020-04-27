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
		this.customUpdated = this.customUpdated.bind(this);
		this.defaultUpdated = this.defaultUpdated.bind(this);
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
			const customIndex = this.state.customIndex;
			const defaultIndex = this.state.defaultIndex;
			this.props.updateData({
				amountIndexCustom: customIndex,
				amountIndexDefault: defaultIndex,
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
				customID: this.state.customIDDefault,
				defaultIndex: this.state.defaultIndexDefault,
				defaultID: this.state.defaultIDDefault
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
		const {
			article,
			kind
		} = this.props;

		let amountField = this.state.amountField;
		switch(kind) {
			case 'sweepstake':
			case 'event': {
				amountField = 'tickets';
				break;
			}

			case 'membership': {
				amountField = 'subscriptions';
				break;
			}

			case 'fundraiser':
			case 'invoice':
			default: {
				amountField = 'amounts';
				break;
			}
		}
		const amountsObj = util.getValue(article, amountField, {});
		const amountsList = util.getValue(amountsObj, 'list', []);

		let customIndex = null;
		let defaultIndex = null;

		switch (kind) {
			case 'fundraiser':
			case 'invoice': {
				customIndex = util.getValue(article, 'amountIndexCustom', 6);
				defaultIndex = util.getValue(article, 'amountIndexDefault', 6);
				break;
			}

			// no default
		}

		const customAmount = util.getValue(amountsList, customIndex, {});
		const customID = util.getValue(customAmount, 'ID', null);
		const defaultAmount = util.getValue(amountsList, defaultIndex, {});
		const defaultID = util.getValue(defaultAmount, 'ID', null);

		this.setState({
			amountField,
			amountsList,
			customIndex,
			customID,
			defaultIndex,
			defaultID,
			amountsListDefault: amountsList,
			customIndexDefault: customIndex,
			customIDDefault: customID,
			defaultIndexDefault: defaultIndex,
			defaultIDDefault: defaultID
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
			customID,
			defaultIndex,
			defaultID,
			primaryColor,
			button,
			recurring
		} = this.state;

		switch (kind) {
			case 'event':
			case 'membership':
			case 'sweepstake': {
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
			case 'invoice':
			default: {
				return (
					<AmountsList
						embed={embed}
						amountsList={amountsList}
						customIndex={customIndex}
						customID={customID}
						defaultIndex={defaultIndex}
						defaultID={defaultID}
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

	amountsListUpdated(amounts, sort = false, config = {}) {
		const amountsList = amounts;
		if (sort) {
			amountsList.forEach((value, key) => {
				const customField = config.hasCustomField && value.ID === this.state.customID ? true : false;
				const defaultField = config.hasDefaultField && value.ID === this.state.defaultID ? true : false;
				if (customField) this.customUpdated(key, value.ID);
				if (defaultField) this.defaultUpdated(key, value.ID);
				amountsList[key].orderBy = key;
			});
		}
		this.setState({ amountsList });
	}

	customUpdated(index, ID) {
		const customIndex = parseInt(index);
		const customID = parseInt(ID);
		this.setState({
			customIndex,
			customID
		});
	}

	defaultUpdated(index, ID) {
		const defaultIndex = parseInt(index);
		const defaultID = parseInt(ID);
		this.setState({
			defaultIndex,
			defaultID
		});
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
			recurring,
			customIndex,
			customID,
			defaultIndex,
			defaultID
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
												customIndex={customIndex}
												customID={customID}
												customUpdated={this.customUpdated}
												defaultIndex={defaultIndex}
												defaultID={defaultID}
												defaultUpdated={this.defaultUpdated}
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
