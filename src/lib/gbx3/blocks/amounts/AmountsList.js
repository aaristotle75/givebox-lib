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
	GBLink,
	updateCartItem,
	types
} from '../../../';
import Recurring from './Recurring';
import { amountInputStyle, amountInputMoneyStyle, amountInputHeights } from './amountsStyle';
import '../../../styles/gbx3amounts.scss';
import AnimateHeight from 'react-animate-height';

class AmountsList extends Component {

	constructor(props) {
		super(props);
		this.checkCart = this.checkCart.bind(this);
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
		this.updateCart = this.updateCart.bind(this);
		this.setUnitID = this.setUnitID.bind(this);

		const defaultAmount = props.defaultAmount;
		const amountForAPI = util.getValue(defaultAmount, 'price', 0);
		const defaultPrice = amountForAPI/100;

		this.state = {
			amountForAPI,
			unitID: props.defaultID,
			customAmount: props.customIndex === props.defaultIndex ? true : false,
			amountRadioSelected: null,
			amountEntered: defaultPrice || '',
			recurring: {
				interval: 'once',
				paymentMax: '',
				frequency: 1
			},
			showDetails: []
		};
		this.amountInputRef = React.createRef();
	}

	componentDidMount() {
		this.checkCart();
	}

	componentDidUpdate(prevProps) {
		if ( (prevProps.numCartItems !== this.props.numCartItems) && this.props.numCartItems === 0) {
			this.setState({
				amountRadioSelected: this.props.customID,
				amountEntered: ''
			});
		}
	}

	checkCart() {
		const {
			cartItems,
			article
		} = this.props;

		const {
			recurring
		} = this.state;

		const index = cartItems.findIndex(i => i.articleID === article.articleID);
		if (index !== -1) {
			// init from cart
			const obj = util.getValue(cartItems, index, {});
			const ID = util.getValue(obj, 'unitID', null);
			const amount = util.getValue(obj, 'amountFormatted', 0);
			const customAmount = util.getValue(obj, 'customAmount');
			const interval = util.getValue(obj, 'interval');
			const paymentMax = util.getValue(obj, 'paymentMax');
			this.setState({
				customAmount,
				amountRadioSelected: ID,
				recurring: {
					...recurring,
					interval,
					paymentMax
				}
			}, () => {
				this.setUnitID(ID, () => this.setAmounts(amount, customAmount));
			});
		} else {
			// Use defaults set in contructor
			this.updateCart();
		}
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
		const recurringDisplay = types.renderRecurringName(kind, interval, paymentMax);

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

	getNameIfBlank(kind) {
		switch (kind) {
			case 'invoice': {
				return 'Invoice Payment';
			}

			case 'fundraiser':
			default: {
				return 'Donation';
			}
		}
	}

	updateCart(obj = {}) {
		const {
			amountsList,
			kind,
			article
		} = this.props;

		const {
			amountForAPI: priceper,
			unitID,
			customAmount,
			recurring
		} = this.state;

		const quantity = 1;
		const articleTitle = util.getValue(article, 'title');
		const maxQuantity = util.getValue(article, 'maxQuantity', 10);
		const articleImageURL = util.getValue(article, 'imageURL');
		const allowQtyChange = false;
		const allowMultiItems = false;

		let name = 'Item';
		let availableQty = 1;
		if (!util.isEmpty(amountsList)) {
			const index = amountsList.findIndex(x => x.ID === unitID);
			if (index !== -1) {
				const selectedItem = util.getValue(amountsList, index, {});
				name = customAmount ? `Custom ${types.kind(kind).amountDesc}` : util.getValue(selectedItem, 'name', this.getNameIfBlank(kind));
				availableQty = allowQtyChange ? util.getValue(selectedItem, 'max', maxQuantity) - util.getValue(selectedItem, 'sold', 0) + quantity : quantity;
			}
		}

		availableQty = 10;

		const item = {
			unitID,
			articleTitle,
			articleImageURL,
			name,
			priceper,
			customAmount,
			quantity,
			availableQty,
			maxQuantity,
			allowQtyChange,
			allowMultiItems,
			...recurring,
			...obj
		};

		this.props.updateCartItem(unitID, item);
	}

	setUnitID(unitID, callback) {
		this.setState({ unitID }, () => {
			if (callback) callback();
		});
	}

	setRecurring(obj = {}) {
		const recurring = { ...this.state.recurring, ...obj };
		this.setState({ recurring }, () => {
			this.updateCart();
		});
	}

	setCustomSelected(ID) {
		const amountInputRef = this.amountInputRef.current;
		const customSelected = parseInt(this.props.customID) === parseInt(ID) ? true : false;
		if (amountInputRef && this.props.breakpoint !== 'mobile' && customSelected && !this.props.editable) amountInputRef.focus();
		return customSelected;
	}

	setAmounts(amount, customAmount) {
		const amountEntered = customAmount && !amount ? '' : _v.formatNumber(amount);
		const amountForAPI =  util.formatMoneyForAPI(amount);
		this.setState({ amountEntered, amountForAPI, customAmount }, () => {
			this.updateCart();
		});
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
				this.setState({ customSelected, amountRadioSelected: value}, () => {
					this.setUnitID(ID, () => this.setAmounts(amount, customSelected));
				});
			}
		}
	}

	onChangeEnteredAmount(e) {
		const amount = e.currentTarget.value;
		this.setAmounts(amount, this.state.customAmount);
	}

	onBlurEnteredAmount(e) {
		//const amount = e.currentTarget.value;
		//this.setAmounts(amount);
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
			customID,
			defaultID,
			embed,
			color,
			noFocus,
			editable
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
					autoFocus={noFocus || editable ? false : true}
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
			embed
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

	const gbx3 = util.getValue(state, 'gbx3', {});
	const cart = util.getValue(gbx3, 'cart', []);
	const cartItems = util.getValue(cart, 'items', []);
	const numCartItems = cartItems.length;
	const info = util.getValue(gbx3, 'info', {});
	const noFocus = util.getValue(info, 'noFocus');
	const admin = util.getValue(gbx3, 'admin', {});
	const editable = util.getValue(admin, 'editable');

	return {
		noFocus,
		cart,
		cartItems,
		numCartItems,
		editable
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	updateCartItem
})(AmountsList);
