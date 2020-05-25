import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	_v,
	ModalLink,
	ModalRoute,
	toggleModal,
	Choice,
	TextField,
	GBLink
} from '../../../';
import Recurring, { renderRecurringName } from './Recurring';
import { amountInputStyle, amountInputMoneyStyle, amountInputHeights } from './amountsStyle';
import '../../../styles/gbx3amounts.scss';
import AnimateHeight from 'react-animate-height';

class AmountsList extends Component {

	constructor(props) {
		super(props);
		this.renderAmounts = this.renderAmounts.bind(this);
		this.onChangeAmountRadio = this.onChangeAmountRadio.bind(this);
		this.onChangeEnteredAmount = this.onChangeEnteredAmount.bind(this);
		this.onBlurEnteredAmount = this.onBlurEnteredAmount.bind(this);
		this.handleAmountChanges = this.handleAmountChanges.bind(this);
		this.setAmounts = this.setAmounts.bind(this);
		this.setCustomSelected = this.setCustomSelected.bind(this);
		this.setRecurring = this.setRecurring.bind(this);
		this.onCloseRecurringOptions = this.onCloseRecurringOptions.bind(this);
		this.toggleShowDetails = this.toggleShowDetails.bind(this);
		this.state = {
			amountRadioSelected: null,
			amountEntered: '',
			recurring: {
				interval: 'once',
				paymentMax: ''
			},
			showDetails: []
		};
		this.amountInputRef = React.createRef();
	}

	componentDidMount() {
	}

	toggleShowDetails(id) {
		const showDetails = this.state.showDetails;
		const index = showDetails.findIndex((el) => {
			return el === id;
		});
		if (index === -1) showDetails.push(id);
		else showDetails.splice(index, 1);
		this.setState({ showDetails });
	}

	onCloseRecurringOptions(modalID) {
		this.props.toggleModal(modalID, false);
	}

	renderRecurringOption(amountEntered) {
		const {
			kind,
			allowRecurring,
			color,
			breakpoint
		} = this.props;

		const {
			recurring
		} = this.state;

		const interval = util.getValue(recurring, 'interval');
		const paymentMax = util.getValue(recurring, 'paymentMax');
		const recurringDisplay = renderRecurringName(kind, interval, paymentMax);

		return (
			<div className='recurringLink'>
				<ModalRoute
					id='recurringOption'
					className='gbx3 givebox-paymentform recurringOption'
					style={{ width: '50%' }}
					component={() =>
						<Recurring
							breakpoint={breakpoint}
							recurringText={`How often would you like to donate this amount?`}
							topText='donation'
							typeText='donate'
							modalID='recurringOption'
							interval={interval}
							paymentMax={paymentMax}
							setRecurring={this.setRecurring}
							amount={(amountEntered && parseFloat(amountEntered) !== 0.00 ? amountEntered : '')}
							color={color}
							onCloseRecurringOptions={this.onCloseRecurringOptions}
						/>
					}
				/>
				<span style={{ display: 'block' }}>{recurringDisplay.text}</span>
				{allowRecurring ?
				<ModalLink id='recurringOption' allowCustom={true} customColor={color}>{interval === 'once' ? `Click Here for Recurring ${recurringDisplay.name} Options` : `Edit Your Recurring ${recurringDisplay.name}`}</ModalLink> : <></>}
			</div>
		)
	}

	setRecurring(obj = {}) {
		const recurring = { ...this.state.recurring, ...obj };
		this.setState({ recurring });
	}

	setCustomSelected(ID) {
		const amountInputRef = this.amountInputRef.current;
		if (amountInputRef && this.props.breakpoint !== 'mobile') amountInputRef.focus();
		const customSelected = parseInt(this.props.customID) === parseInt(ID) ? true : false;
		return customSelected;
	}

	setAmounts(amount) {
		const amountEntered = _v.formatNumber(amount);
		const amountForAPI =  util.formatMoneyForAPI(amount);
		this.setState({ amountEntered, amountForAPI });
	}

	onChangeAmountRadio(name, value) {
		const {
			amountsList
		} = this.props;
		if (!util.isEmpty(amountsList)) {
			const index = amountsList.findIndex(x => x.ID === value);
			if (index !== -1) {
				const obj = util.getValue(amountsList, index, {});
				const ID = util.getValue(obj, 'ID', null);
				const price = util.getValue(obj, 'price', 0);
				const customSelected = this.setCustomSelected(ID);
				const amount = customSelected ? '' : price/100;
				this.setState({ customSelected, amountRadioSelected: value}, this.setAmounts(amount));
			}
		}
	}

	onChangeEnteredAmount(e) {
		const amount = e.currentTarget.value;
		this.setAmounts(amount);
	}

	onBlurEnteredAmount(e) {
		const amount = e.currentTarget.value;
		this.setAmounts(amount);
	}

	handleAmountChanges() {
		const obj = {
			amount: this.state.amountAPIValue,
			recurring: {
				interval: null,
				frequency: null,
				paymentMax: null
			}
		};
		this.props.amountsCallback(obj);
	}

	renderAmounts() {
		const {
			amountsList,
			buttonEnabled,
			customID,
			defaultID,
			embed,
			color
		} = this.props;

		const {
			showDetails
		} = this.state;

		const items = [];

		let amountRadioSelected = this.state.amountRadioSelected;
		let amountEntered = this.state.amountEntered;
		let length = 0;

		if (!util.isEmpty(amountsList)) {
			Object.entries(amountsList).forEach(([key, value]) => {
				const isCustom = customID === value.ID ? true : false;
				const isDefault = defaultID === value.ID ? true : false;

				if (value.enabled) {
					length++;

					/*
					*	If the current row is the default amount
					* and no amount radio has been selected
					* set the amount radio to the default ID
					*/
					if (isDefault && !amountRadioSelected) {
						amountRadioSelected = value.ID;

						// If no amount is entered and the current row is not the custom amount
						// set the amount entered to the price
						if (!amountEntered && !isCustom) {
							amountEntered = value.price/100;
						}
					}

					const label = embed ?
						<span>
							{!isCustom ?
								<span className='amountRadioPrice'>{util.money(value.price/100)}{`${value.name ? ' ' : ''}`}</span>
							: <></>}
							{isCustom && !value.name ? 'Enter any amount' : value.name}
						</span>
					:
						<div className='amountDescText'>
							{isCustom && !value.name ? 'Enter any amount' : value.name}
							<span className='amountDescAmount'>
								{!isCustom ? util.money(value.price/100) : <></>}
							</span>
						</div>
					;

					items.push(
						<div key={key} className='amountRow'>
							<div className='amountDescRow'>
								<div className='amountDesc'>
									<Choice
										name={`ID`}
										value={value.ID}
										onChange={this.onChangeAmountRadio}
										type='radio'
										label={label}
										checked={amountRadioSelected}
									/>
								</div>
								{!this.props.embed && value.description ?
								<div className='amountDescMore'>
									<GBLink style={{ fontSize: 12, margin: '5px 0 5px 10px' }} allowCustom={true} customColor={color} className='link amountShowDetailsLink' onClick={() => this.toggleShowDetails(value.ID)}>{showDetails.includes(value.ID) ? 'Less Info' : 'More Info'} <span className={`icon icon-${showDetails.includes(value.ID) ? 'minus' : 'plus'}`}></span></GBLink>
								</div> : <></>}
							</div>
							<AnimateHeight
								duration={200}
								height={showDetails.includes(value.ID) ? 'auto' : 0}
							>
								<div className='amountDetails'>
									<div className='amountDetailsContainer' dangerouslySetInnerHTML={{ __html: value.description }} />
								</div>
							</AnimateHeight>
						</div>
					);
				}
			});
		}

		const style = this.getAmountInputStyle(length);
		const customIsDefaultOnlyAmount = customID === defaultID && items.length === 1 ? true : false;
		const amountInput =
			<div key={'amountInput'} className='amountInput'>
				<TextField
					autoFocus={true}
					inputRef={this.amountInputRef}
					name='amountInput'
					inputMode='decimal'
					placeholder={0}
					color={this.props.color}
					onChange={this.onChangeEnteredAmount}
					onBlur={this.onBlurEnteredAmount}
					maxLength={8}
					money={true}
					style={style.inputStyle}
					moneyStyle={style.moneyStyle}
					value={amountEntered}
					readOnly={amountRadioSelected === customID ? false : true}
					autoComplete={'new-password'}
				/>
			</div>
		;

		return (
			<>
				{amountInput}
				{this.renderRecurringOption(amountEntered)}
				{!util.isEmpty(items) && !customIsDefaultOnlyAmount ?
					<div className='amountsList'>{items}</div>
				: <></>
				}
			</>
		)
	}

	getAmountInputStyle(length = 1) {
		const index = length > 4 ? 4 : length;
		const style = {};
		style.inputStyle = amountInputStyle[index];
		style.moneyStyle = amountInputMoneyStyle[index];
		style.height = amountInputHeights[index].height;
		return style;
	}

	render() {

		const {
			embed,
			buttonEnabled
		} = this.props;

		//const height = embed && !buttonEnabled ? `${this.props.height}px` : 'auto';

		return (
			<div className={`${embed ? 'embed' : ''}`}>
				<div className='amountsSection'>
					{this.renderAmounts()}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(AmountsList);
