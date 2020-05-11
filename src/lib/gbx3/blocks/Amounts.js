import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalRoute,
	Collapse,
	Tabs,
	Tab,
	types,
	sendResource,
	updateData,
	saveGBX3,
	Fade
} from '../../';
import AmountsEdit from './amounts/AmountsEdit';
import AmountsList from './amounts/AmountsList';
import TicketsList from './amounts/TicketsList';
import Button from './Button';
import ButtonEdit from './ButtonEdit';
import RecurringEdit from './amounts/RecurringEdit';
import { amountFieldsConfig } from './amounts/amountFieldsConfig';
import AnimateHeight from 'react-animate-height';

class Amounts extends Component {

	constructor(props) {
		super(props);
		this.getAmounts = this.getAmounts.bind(this);
		this.amountsListUpdated = this.amountsListUpdated.bind(this);
		this.customUpdated = this.customUpdated.bind(this);
		this.defaultUpdated = this.defaultUpdated.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.renderAmountsList = this.renderAmountsList.bind(this);
		this.closeModalAmountsList = this.closeModalAmountsList.bind(this);
		this.closeModalAmountsEdit = this.closeModalAmountsEdit.bind(this);
		this.validateAmountsBeforeSave = this.validateAmountsBeforeSave.bind(this);
		this.resetToDefaults = this.resetToDefaults.bind(this);
		this.saveEditedAmounts = this.saveEditedAmounts.bind(this);
		this.callbackBeforeStep = this.callbackBeforeStep.bind(this);
		this.callbackAfterStep = this.callbackAfterStep.bind(this);
		this.setTab = this.setTab.bind(this);

		const primaryColor = this.props.primaryColor;
		const options = props.options;

		const recurring = util.getValue(options, 'recurring', {});
		const button = util.getValue(options, 'button', {});

		this.state = {
			primaryColor,
			button,
			recurring,
			defaultButton: util.deepClone(button),
			defaultRecurring: util.deepClone(recurring),
			amountsList: [],
			amountsListEditable: [],
			customIndex: 6,
			defaultIndex: 6,
			formError: [],
			tab: 'edit'
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

	closeModalAmountsEdit(type = 'save') {
		util.toTop(`modalOverlay-${this.props.modalID}`);
		this.setTab('edit');
		const {
			formError
		} = this.state;
		if (type !== 'cancel') {
			if (util.isEmpty(formError)) {
				this.saveEditedAmounts(true);
			} else {
				if (type === 'ok') this.resetToDefaults(this.props.closeEditModal);
			}
		} else {
			this.resetToDefaults(this.props.closeEditModal);
		}
	}

	saveEditedAmounts(saveBlock) {
		const button = { ...this.state.button };
		const recurring = { ...this.state.recurring };
		const amountsList = [ ...this.state.amountsListEditable ];
		const customIndex = this.state.customIndex;
		const customID = this.state.customID;
		const defaultIndex = this.state.defaultIndex;
		const defaultID = this.state.defaultID;

		this.setState({
			button,
			recurring,
			amountsList,
			customIndex,
			customID,
			defaultIndex,
			defaultID,
			defaultButton: util.deepClone(button),
			defaultRecurring: util.deepClone(recurring),
			amountsListDefault: util.deepClone(amountsList),
			customIndexDefault: customIndex,
			customIDDefault: customID,
			defaultIndexDefault: defaultIndex,
			defaultIDDefault: defaultID
		}, () => {
			this.props.updateData({
				amountIndexCustom: customIndex,
				amountIndexDefault: defaultIndex,
				[types.kind(this.props.kind).amountField]: {
					list: amountsList
				}
			});

			if (saveBlock) {
				this.props.saveBlock(null, {
					button,
					recurring
				});
			}
		});
	}

	resetToDefaults(callback = () => {}) {
		this.setState({
			button: util.deepClone(this.state.defaultButton),
			recurring: util.deepClone(this.state.defaultRecurring),
			amountsList: util.deepClone(this.state.amountsListDefault),
			amountsListEditable: util.deepClone(this.state.amountsListDefault),
			customIndex: this.state.customIndexDefault,
			customID: this.state.customIDDefault,
			defaultIndex: this.state.defaultIndexDefault,
			defaultID: this.state.defaultIDDefault,
			formError: []
		}, callback);
	}

	amountsListUpdated(amounts, sort = false, save = false) {
		const config = util.getValue(amountFieldsConfig, this.props.kind, {});
		const data = {};
		const amountsList = amounts;
		if (sort || save) {
			let customIndex = null;
			let defaultIndex = null;
			amountsList.forEach((value, key) => {
				customIndex = config.hasCustomField && value.ID === this.state.customID ? key : false;
				defaultIndex = config.hasDefaultField && value.ID === this.state.defaultID ? key : false;
				if (customIndex || customIndex === 0) this.customUpdated(key, value.ID);
				if (defaultIndex || defaultIndex === 0) this.defaultUpdated(key, value.ID);
				amountsList[key].orderBy = key;
			});
			data.amountIndexCustom = customIndex;
			data.amountIndexDefault = defaultIndex;
			data[types.kind(this.props.kind).amountField] = {
				list: amountsList
			};
		}
		this.setState({ amountsListEditable: amountsList }, () => {
			if (save) this.props.saveGBX3(data, false, (res, err) => {
				if (!err && !util.isEmpty(res)) {
					this.saveEditedAmounts();
				}
			});
		});
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

	validateAmountsBeforeSave(formErrorID, error, callback) {
		const formError = this.state.formError;
		if (error) {
			if (!formError.includes(formErrorID)) formError.push(formErrorID);
		} else {
			const index = formError.indexOf(formErrorID);
			if (index !== -1) formError.splice(index, 1);
		}
		this.setState({ formError }, callback)
	}

	closeModalAmountsList() {
		console.log('execute closeModalAmountsList');
	}

	getAmounts() {
		const {
			data,
			kind
		} = this.props;

		const amountsObj = util.getValue(data, types.kind(kind).amountField, {});
		const amountsList = util.getValue(amountsObj, 'list', []);

		let customIndex = null;
		let defaultIndex = null;

		switch (kind) {
			case 'fundraiser':
			case 'invoice': {
				customIndex = util.getValue(data, 'amountIndexCustom', 6);
				defaultIndex = util.getValue(data, 'amountIndexDefault', 6);
				break;
			}

			// no default
		}

		const customAmount = util.getValue(amountsList, customIndex, {});
		const customID = util.getValue(customAmount, 'ID', null);
		const defaultAmount = util.getValue(amountsList, defaultIndex, {});
		const defaultID = util.getValue(defaultAmount, 'ID', null);

		this.setState({
			amountsList,
			amountsListEditable: util.deepClone(amountsList),
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
			data,
			kind,
			primaryColor
		} = this.props;

		const {
			amountsList,
			customIndex,
			customID,
			defaultIndex,
			defaultID,
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
						article={data}
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

	setTab(tab) {
		this.setState({ tab });
	}

	async callbackBeforeStep(key) {
		let validate = true;
		if (!util.isEmpty(this.state.formError)) validate = false;
		return validate;
	}

	callbackAfterStep(tab) {
	}

	render() {

		const {
			modalID,
			data,
			kind,
			primaryColor
		} = this.props;

		const {
			amountsList,
			amountsListEditable,
			button,
			recurring,
			customIndex,
			customID,
			defaultIndex,
			defaultID,
			formError,
			tab
		} = this.state;

		if (util.isEmpty(amountsList)) return <></>

		return (
			<div className={`block ${util.getValue(button, 'enabled', false) ? 'flexCenter' : ''}`}>
				<ModalRoute
					id={modalID}
					className='gbx3 gbx3amountsEdit'
					optsProps={{ closeCallback: this.closeModalAmountsEdit }}
					effect='3DFlipVert' style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Editing Amounts`}
					closeCallback={this.closeModalAmountsEdit}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Tabs
								default={tab}
								className='statsTab'
								callbackBefore={this.callbackBeforeStep}
							>
								<Tab id='edit' label={<span className='stepLabel'>Edit Amounts</span>}>
									<>
										<AnimateHeight
											duration={200}
											height={!util.isEmpty(formError) ? 'auto' : 0}
										>
										<Fade in={!util.isEmpty(formError) ? true : false}>
											<div className={`flexCenter error`}>You must fix the issues below in red before you can save or switch tabs.</div>
										</Fade>
										</AnimateHeight>
										<Collapse
											label={'Edit Amounts'}
											iconPrimary='edit'
											id={'gbx3-amounts-edit'}
										>
											<div className='formSectionContainer'>
												<div className='formSection'>
													<AmountsEdit
														article={data}
														amountsList={amountsListEditable}
														kind={kind}
														modalID={modalID}
														amountsListUpdated={this.amountsListUpdated}
														customIndex={customIndex}
														customID={customID}
														customUpdated={this.customUpdated}
														defaultIndex={defaultIndex}
														defaultID={defaultID}
														defaultUpdated={this.defaultUpdated}
														sendResource={this.props.sendResource}
														validateAmountsBeforeSave={this.validateAmountsBeforeSave}
														formError={this.state.formError}
													/>
												</div>
											</div>
										</Collapse>
									</>
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
													modalID={'amountsList'}
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
													article={data}
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
							effect='3DFlipVert' style={{ width: '60%' }}
							draggable={false}
							closeCallback={this.closeModalAmountsList}
							disallowBgClose={false}
							component={() =>
								<div className='modalContainers'>
									<div className='topContainer'>
										<h3 style={{ padding: 0, margin: 0 }}>{util.getValue(button, 'text', 'Select Amount')}</h3>
										<span style={{ fontWeight: 300 }} className='center'>{util.getValue(data, 'title')}</span>
									</div>
									<div className='middleContainer'>
										{this.renderAmountsList()}
									</div>
									<div className='bottomContainer'>
										<div className='cartInfo'>
											<GBLink allowCustom={true} customColor={primaryColor} onClick={() => console.log('items in cart')}><span style={{ display: 'block', fontSize: 12 }}>Items in Cart (8)</span></GBLink>
											<span style={{ display: 'block' }}><span style={{ fontSize: 12 }}>Sub Total:</span> <span className='strong'>{util.money(300)}</span></span>
										</div>
										<div className='button-group'>
											<GBLink allowCustom={true} customColor={primaryColor} onClick={() => console.log('Show more items')}>SHOP MORE ITEMS</GBLink>
											<GBLink className='button' allowCustom={true} customColor={primaryColor} solidColor={true} onClick={() => console.log('checkout')}>CHECKOUT</GBLink>
										</div>
									</div>
								</div>
							}
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

	const gbx3 = util.getValue(state, 'gbx3', {});
	const data = util.getValue(gbx3, 'data', {});

	return {
		data
	}
}

export default connect(mapStateToProps, {
	sendResource,
	saveGBX3,
	updateData
})(Amounts);
