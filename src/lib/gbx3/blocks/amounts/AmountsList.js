import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	_v,
	ModalLink,
	ModalRoute,
	toggleModal,
	Choice,
	TextField
} from '../../../';
import Recurring, { renderRecurringName } from './Recurring';
import { amountInputStyle, amountInputMoneyStyle, amountInputHeights } from './amountsStyle';
import '../../../styles/gbx3amounts.scss';

class AmountsList extends Component {

  constructor(props) {
    super(props);
		this.renderEmbedAmounts = this.renderEmbedAmounts.bind(this);
		this.renderModalAmounts = this.renderModalAmounts.bind(this);
		this.onChangeAmountRadio = this.onChangeAmountRadio.bind(this);
		this.onChangeEnteredAmount = this.onChangeEnteredAmount.bind(this);
		this.onBlurEnteredAmount = this.onBlurEnteredAmount.bind(this);
		this.handleAmountChanges = this.handleAmountChanges.bind(this);
		this.setDefaultIDs = this.setDefaultIDs.bind(this);
		this.setAmounts = this.setAmounts.bind(this);
		this.setCustomSelected = this.setCustomSelected.bind(this);
		this.setRecurring = this.setRecurring.bind(this);
		this.onCloseRecurringOptions = this.onCloseRecurringOptions.bind(this);
    this.state = {
			amountRadioSelected: null,
			amountEntered: '',
			recurring: {
				interval: 'once',
				paymentMax: ''
			}
    };
		this.amountInputRef = React.createRef();
  }

	componentDidMount() {
		this.setDefaultIDs();
	}

	onCloseRecurringOptions(modalID) {
		this.props.toggleModal(modalID, false);
	}

	renderRecurringOption(amountEntered) {
		const {
			kind
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
					className='gbx3 recurringOption'
					id='recurringOption'
					style={{ width: '50%' }}
					optsProps={{
						closeCallback: this.onCloseRecurringOptions
					}}
					component={() =>
						<Recurring
							recurringText={`How often would you like to donate this amount?`}
							topText='donation'
							typeText='donate'
							modalID='recurringOption'
							interval={interval}
							paymentMax={paymentMax}
							setRecurring={this.setRecurring}
							amount={(amountEntered && parseFloat(amountEntered) !== 0.00 ? amountEntered : '')}
							color={this.props.color}
							onCloseRecurringOptions={this.onCloseRecurringOptions}
						/>
					}
				/>
				<span style={{ display: 'block' }}>{recurringDisplay.text}</span>
				<ModalLink id='recurringOption' allowCustom={true}>{interval === 'once' ? `Click Here for Recurring ${recurringDisplay.name} Options` : `Edit Your Recurring ${recurringDisplay.name}`}</ModalLink>
			</div>
		)
	}

	setRecurring(obj = {}) {
		const recurring = { ...this.state.recurring, ...obj };
		this.setState({ recurring });
	}

	setDefaultIDs() {
		const {
			list
		} = this.props;
		if (!util.isEmpty(list)) {
			const customAmount = util.getValue(this.props.list, this.props.customIndex, {});
			const customID = util.getValue(customAmount, 'ID', null);
			const defaultAmount = util.getValue(this.props.list, this.props.defaultIndex, {});
			const defaultID = util.getValue(defaultAmount, 'ID', null);
			this.setState({ customID, defaultID });
		}
	}

	setCustomSelected(ID) {
		const amountInputRef = this.amountInputRef.current;
		if (amountInputRef) amountInputRef.focus();
		const customSelected = parseInt(this.state.customID) === parseInt(ID) ? true : false;
		return customSelected;
	}

	setAmounts(amount) {
		const amountEntered = _v.formatNumber(amount);
		const amountForAPI =  util.formatMoneyForAPI(amount);
		this.setState({ amountEntered, amountForAPI });
	}

	onChangeAmountRadio(name, value) {
		const {
			list
		} = this.props;
		if (!util.isEmpty(list)) {
			const index = this.props.list.findIndex(x => x.ID === value);
			if (index !== -1) {
				const obj = util.getValue(list, index, {});
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

	renderEmbedAmounts() {
		const {
			list,
			allowRecurring
		} = this.props;

		const {
			customID,
			defaultID
		} = this.state;

		const items = [];

		let amountRadioSelected = this.state.amountRadioSelected;
		let amountEntered = this.state.amountEntered;
		let length = 0;

		if (!util.isEmpty(list)) {
			Object.entries(list).forEach(([key, value]) => {
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

					items.push(
						<div key={key} className='amountRow'>
							<div className='amountDesc'>
								<Choice
									name={`ID`}
									value={value.ID}
									onChange={this.onChangeAmountRadio}
									type='radio'
									label={<span>{!isCustom ? <span className='amountRadioPrice'>{util.money(value.price/100)}{`${value.name ? ' ' : ''}`}</span> : <></>}{value.name}</span>}
									checked={amountRadioSelected}
								/>
							</div>
						</div>
					);
				}
			});
		}

		const style = this.getAmountInputStyle(length);
		const recurringLinkHeight = 35;
		const amountsListHeight = this.props.height - (style.height + recurringLinkHeight);
		const customIsDefaultOnlyAmount = customID === defaultID && items.length === 1 ? true : false;
		const amountInput =
			<div key={'amountInput'} className='amountInput'>
				<TextField
					autoFocus={true}
					inputRef={this.amountInputRef}
					name='amountInput'
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
				/>
			</div>
		;

		return (
			<>
				{amountInput}
				{allowRecurring ? this.renderRecurringOption(amountEntered) : <></>}
				{!util.isEmpty(items) && !customIsDefaultOnlyAmount ?
					<div style={{ maxHeight: amountsListHeight }} className='amountsList'>{items}</div>
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

	renderModalAmounts() {
		const {
			list
		} = this.props;
		const items = [];

		Object.entries(list).forEach(([key, value]) => {
			items.push(
				<div key={key} className='amountRow'>
					<div className='amountDesc'>
						{value.name}
					</div>
					<div className='amountQty'>
						<Choice
							name={value.ID}
							onChange={this.onChangeQty}
							type='radio'
							label={value.name}
						/>
					</div>
				</div>
			);
		});

		return items;
	}

  render() {

		const {
			embed
		} = this.props;

		const height = embed ? `${this.props.height}px` : 'auto';

    return (
			<div className={`${embed ? 'embed' : ''}`}>
	      <div style={{ height: height }} className='amountsSection'>
					{embed ? this.renderEmbedAmounts() : this.renderModalAmounts()}
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
