import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	selectOptions,
	ModalLink,
	Form,
	ModalRoute,
	Tab,
	Tabs,
	updateCart,
	GBLink,
	Loader,
	toggleModal,
	processTransaction,
	resetCart,
	updateConfirmation
} from '../../';
import Moment from 'moment';
import SendEmail from './SendEmail';
import ApplePay from './ApplePay';
import Echeck from './Echeck';
import AnimateHeight from 'react-animate-height';

class PaymentFormClass extends Component {

	constructor(props) {
		super(props);
		this.paymentOptions = this.paymentOptions.bind(this);
		this.fieldLayout = this.fieldLayout.bind(this);
		this.renderFields = this.renderFields.bind(this);
		this.customOnChange = this.customOnChange.bind(this);
		this.processForm = this.processForm.bind(this);
		this.processCallback = this.processCallback.bind(this);
		this.formSavedCallback = this.formSavedCallback.bind(this);
		this.sendEmailCallback = this.sendEmailCallback.bind(this);
		this.onCreditCardChange = this.onCreditCardChange.bind(this);
		this.onPaymethodTabBefore = this.onPaymethodTabBefore.bind(this);
		this.onPaymethodTabAfter = this.onPaymethodTabAfter.bind(this);
		this.setPaymethod = this.setPaymethod.bind(this);
		this.onCustomerChange = this.onCustomerChange.bind(this);
		this.state = {
			processingPayment: false,
			sendEmail: {
				recipients: '',
				message: util.getValue(this.props.sendEmail, 'defaultMsg', '')
			},
			applepay: false,
			paymethod: 'creditcard',
			amountError: false
		}
	}

	componentDidMount() {
		if (window.ApplePaySession) {
			this.setState({ applepay: true });
		}
		this.setPaymethod(this.state.paymethod);
	}

	componentDidUpdate(prevProps) {
		const itemsChange = prevProps.cartItems.length !== this.props.cartItems.length ? true : false;
		const amountChange = prevProps.amount !== this.props.amount ? true : false;
		if (itemsChange || amountChange) {
			if (this.props.formState.error) this.props.formProp({ error: false });
		}
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	formSavedCallback() {
		this.props.toggleModal('paymentConfirmation', true);
		this.props.resetCart();
	}

	processCallback(res, err) {
		if (!err) {
			this.formSavedCallback();
		} else {
			if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
		}
	}

	async processForm(fields) {
		const {
			cardType,
			paymethod,
			cartTotal,
			cartItems: items,
			amount,
			zeroAmountAllowed,
			emailBlastToken,
			emailBlastEmail
		} = this.props;

		const {
			sendEmail
		} = this.state;

		const data = {
			items: [],
			paymethod: {},
			emailBlastToken,
			emailBlastEmail
		};

		let error = false;

		if ( util.isEmpty(items) || ( !zeroAmountAllowed && (!amount || parseInt(amount) === 0) ) ) {
			this.props.formProp({ error: true, errorMsg: <span>The amount to process cannot be {util.money(0)}. Please select an amount.</span> });
		} else {

			// Get notes and sendemail
			const noteValue = util.getValue(fields.note, 'value');
			const message = util.getValue(sendEmail, 'message');
			const emails = !util.isEmpty(sendEmail.recipients) ? sendEmail.recipients.split(/,/) : [];

			const note = noteValue || message || !util.isEmpty(emails) ? {
				message,
				emails,
				value: noteValue
			} : null;

			// Get the last item and add the note
			const [lastItem] = items.slice(-1);

			Object.entries(items).forEach(([key, value]) => {
				data.items.push({
					unitID: value.unitID,
					articleID: value.articleID,
					articleKind: value.articleKind,
					sourceType: value.sourceType || null,
					sourceLocation: value.sourceLocation || null,
					amount: value.amount,
					customAmount: value.customAmount,
					quantity: value.quantity,
					passFees: value.passFees,
					interval: value.interval || null,
					frequency: value.frequency || null,
					paymentMax: parseInt(value.paymentMax) || null,
					note: ( lastItem.unitID === value.unitID ) && note ? note : null
				});
			});

			const nameField = util.getValue(fields, 'name');
			const name = util.splitName(util.getValue(nameField, 'value'));
			const firstname = name.first;
			const lastname = name.last;
			const fullName = `${firstname} ${lastname}`;
			const email = util.getValue(fields.email, 'value', null);

			data.customer = {
				firstname,
				lastname,
				email,
				occupation: util.getValue(fields.occupation, 'value', null),
				employer: util.getValue(fields.employer, 'value', null),
				phone: util.getValue(fields.phone, 'value', null),
				address: {
					line1: util.getValue(fields.line1, 'value', null),
					city: util.getValue(fields.city, 'value', null),
					state: util.getValue(fields.state, 'value', null),
					zip: util.getValue(fields.zip, 'value', null)
				}
			}

			switch (paymethod) {
				case 'creditcard': {
					const ccexpire = util.getSplitStr(util.getValue(fields.ccexpire, 'value'), '/', 2, -1);
					const type = cardType ? cardType.toUpperCase() : null;
					const cvv = util.getValue(fields.cvv, 'value', null);
					const cvvValidDigits = cardType === 'amex' ? 4 : 3;
					if (cvv.length < cvvValidDigits) {
						this.props.formProp({ error: true, errorMsg: 'CVV is invalid.' });
						this.props.fieldProp('cvv', { error: `CVV must be ${cvvValidDigits} digits` });
						error = true;
					}
					const binData = util.getValue(fields.ccnumber, 'binData', {});
					const number = util.getValue(fields.ccnumber, 'apiValue', null);
					const expMonth = parseInt(ccexpire[0]);
					const expYear = parseInt(`${Moment().format('YYYY').slice(0, 2)}${ccexpire[1]}`);

					data.paymethod.name = fullName;
					data.paymethod.cvv = cvv;
					data.paymethod.type = type;
					data.paymethod.binData = binData;
					data.paymethod.number = number;
					data.paymethod.expMonth = expMonth;
					data.paymethod.expYear = expYear;

					/*
					data.paymethod.creditcard = {
						cvv,
						type,
						binData: util.getValue(fields.ccnumber, 'binData', {}),
						name: fullName,
						number: util.getValue(fields.ccnumber, 'apiValue', null),
						expMonth: parseInt(ccexpire[0]),
						expYear: parseInt(`${Moment().format('YYYY').slice(0, 2)}${ccexpire[1]}`)
					};
					*/
					break;
				}

				case 'echeck': {
					data.paymethod.echeck = {
						number: util.getValue(fields.accountNumber, 'value', null),
						name: fullName,
						bankName: util.getValue(fields.bankName, 'value', null),
						type: 'checking',
						routingNumber: util.getValue(fields.routingNumber, 'value', null),
						zip: util.getValue(fields.zip, 'value', null)
					}
					break;
				}

				case 'applepay': {
					break;
				}

				default: {
					console.error('no paymethod specified');
				}
			}

			if (!error) {
				const confirmationUpdated = await this.props.updateConfirmation({
					email,
					firstname,
					lastname,
					paymethod,
					cartTotal,
					bankName: util.getValue(fields.bankName, 'value', null),
					cardType: cardType ? cardType.toUpperCase() : null
				});
				if (confirmationUpdated) this.props.processTransaction(data, this.processCallback);
			}
		}

	}

	onCreditCardChange(name, value, cardType, field) {
		if (this.props.cardType !== cardType) this.props.updateCart({ cardType });
	}

	onPaymethodTabBefore(key) {
		this.setPaymethod(key);
		return true;
	}

	onPaymethodTabAfter(key) {
	}

	setPaymethod(paymethod) {

		switch (paymethod) {
			case 'echeck': {
				this.props.fieldProp('accountNumber', { required: true });
				this.props.fieldProp('routingNumber', { required: true });
				this.props.fieldProp('ccnumber', { required: false, error: false });
				this.props.fieldProp('ccexpire', { required: false, error: false });
				this.props.fieldProp('cvv', { required: false, error: false });
				break;
			}

			case 'applepay': {
				this.props.fieldProp('accountNumber', { required: false, error: false });
				this.props.fieldProp('routingNumber', { required: false, error: false });
				this.props.fieldProp('ccnumber', { required: false, error: false });
				this.props.fieldProp('ccexpire', { required: false, error: false });
				this.props.fieldProp('cvv', { required: false, error: false });
				break;
			}

			case 'creditcard': {
				this.props.fieldProp('ccnumber', { required: true });
				this.props.fieldProp('ccexpire', { required: true });
				this.props.fieldProp('cvv', { required: true });
				this.props.fieldProp('accountNumber', { required: false, error: false });
				this.props.fieldProp('routingNumber', { required: false, error: false });
				break;
			}

			// no default
		}
		this.setState({ paymethod });
		if (this.props.paymethod !== paymethod) this.props.updateCart({ paymethod });
	}

	customOnChange(name, value) {
		console.log('customOnChange', name, value);
		//this.props.fieldProp(name, { value });
	}

	onCustomerChange(name, value) {
		const customer = { ...this.props.cartCustomer, [name]: value };
		if (value) this.props.updateCart({ customer });
	}

	sendEmailCallback(recipients, message) {
		this.setState({
			sendEmail: {
				recipients,
				message
			}
		});
	}

	paymentOptions() {

		const {
			primaryColor,
			echeck,
			breakpoint
		} = this.props;

		const tabs = [];
		const mobile = breakpoint === 'mobile' ? true : false;

		tabs.push(
			<Tab key={'creditcard'} id={'creditcard'} label={<span className='tabLabel'>{mobile ? 'Credit Card' : 'Pay by Credit Card'}</span>}>
				{this.props.creditCardGroup({
					group: 'paymethod',
					required: false,
					placeholder: 'xxxx xxxx xxxx xxxx',
					debug: false,
					cvvModalRootClass: 'gbxModal',
					onChange: this.onCreditCardChange
				})}
			</Tab>
		);

		if (echeck) {
			tabs.push(
				<Tab key={'echeck'} id={'echeck'} label={<span className='tabLabel'>{mobile ? 'eCheck' : 'Pay by eCheck'}</span>}>
					<Echeck primaryColor={primaryColor} textField={this.props.textField} fieldProp={this.props.fieldProp} />
				</Tab>
			);
		}

		if (this.state.applepay) {
			tabs.push(
				<Tab key={'applepay'} id={'applepay'} label={<span className='tabLabel'>{mobile ? 'Apple Pay' : 'Pay using Apple Pay'}</span>}>
					<ApplePay />
				</Tab>
			);
		}

		return (
			<Tabs
				default={this.state.paymethod}
				className='paymentFormTabs'
				allowCustom={true}
				customColor={primaryColor}
				borderSize={'1px'}
				callbackBefore={this.onPaymethodTabBefore}
				callbackAfter={this.onPaymethodTabAfter}
			>
				{tabs}
			</Tabs>
		)

	}

	fieldLayout() {
		const {
			phone,
			address,
			work,
			custom,
			sendEmail,
			breakpoint
		} = this.props;

		const mobile = breakpoint === 'mobile' ? true : false;
		const layout = [];

		// Phone enabled
		if (!address.enabled & phone.enabled) {
			layout.push(
				{ width: '50%', field: 'name', order: mobile ? 2 : 1 },
				{ width: '50%', field: 'payment', order: mobile ? 1 : 2 },
				{ width: '50%', field: 'email' },
				{ width: '25%', field: 'phone' },
				{ width: '25%', field: 'zip' }
			);

		// Address enabled
	} else if (address.enabled & !phone.enabled) {
			layout.push(
				{ width: '25%', field: 'name', order: mobile ? 2 : 1 },
				{ width: '25%', field: 'email', order: mobile ? 2 : 1 },
				{ width: '50%', field: 'payment', order: mobile ? 1 : 2 },
				{ width: '50%', field: 'address' },
				{ width: '20%', field: 'city' },
				{ width: '20%', field: 'state' },
				{ width: '10%', field: 'zip' }
			);

		// Address and Phone enabled
	} else if (address.enabled && phone.enabled) {
			layout.push(
				{ width: '50%', field: 'name', order: mobile ? 2 : 1 },
				{ width: '50%', field: 'payment', order: mobile ? 1 : 2 },
				{ width: '50%', field: 'email' },
				{ width: '50%', field: 'phone' },
				{ width: '50%', field: 'address' },
				{ width: '20%', field: 'city' },
				{ width: '20%', field: 'state' },
				{ width: '10%', field: 'zip' }
			);

		// Basic
		} else {
			layout.push(
				{ width: '50%', field: 'name', order: mobile ? 2 : 1 },
				{ width: '50%', field: 'payment', order: mobile ? 1 : 2 },
				{ width: '50%', field: 'email' },
				{ width: '50%', field: 'zip' }
			);
		}

		if (work.enabled) {
			layout.push(
				{ width: '50%', field: 'employer' },
				{ width: '50%', field: 'occupation' }
			);
		}

		if (custom.enabled) {
			layout.push(
				{ width: '100%', field: 'custom' }
			);
		}

		if (sendEmail.enabled) {
			layout.push(
				{ width: '100%', field: 'sendEmail' }
			);
		}

		return layout;
	}

	renderFields() {

		const {
			phone,
			address,
			work,
			custom,
			sendEmail,
			primaryColor,
			breakpoint,
			openCart,
			cartCustomer
		} = this.props;

		const mobile = breakpoint === 'mobile' ? true : false;

		const headerText =
			<div className='paymentFormHeader'>
				<span className='paymentFormHeaderTitle'>Payment Info</span>
				<div className='paymentFormHeaderText'>
					<AnimateHeight height={openCart ? 0 : 'auto'}>
						<GBLink
							allowCustom={true}
							customColor={primaryColor}
							onClick={() => {
							const open = openCart ? false : true;
							this.props.updateCart({ open });
						}}>
							{openCart ? 'Hide' : 'View'} the items in your cart.
						</GBLink>
					</AnimateHeight>
					<span style={{ display: 'block' }}>Please enter your payment information.</span>
				</div>
			</div>
		;
		const fields = {};

		fields.payment =
			<div className='column'>
				{mobile ? headerText : ''}
				{this.paymentOptions()}
			</div>
		;
		fields.name =
			<div className='column'>
				{mobile ? '' : headerText}
				{this.props.textField('name', { placeholder: 'Your Name',  label: 'Name', required: true, onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'name') })}
			</div>
		;
		fields.email = this.props.textField('email', { group: 'customer', required: true, placeholder: 'Your Email Address', label: 'Email', validate: 'email', inputMode: 'email', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'email') });
		fields.phone = this.props.textField('phone', { group: 'customer', required: phone.required, label: 'Phone', placeholder: 'Phone Number', validate: 'phone', inputMode: 'tel', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'phone') });
		fields.address = this.props.textField('line1', { group: 'address', required: address.required, label: 'Address', placeholder: 'Street Address', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'line1') });
		fields.city = this.props.textField('city', { group: 'address', required: address.required, label: 'City', placeholder: 'City', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'city') });
		fields.state = this.props.dropdown('state', { group: 'address', label: 'State', fixedLabel: false, selectLabel: 'State', options: selectOptions.states, required: address.required, onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'state') })
		fields.zip = this.props.textField('zip', { group: 'address', required: true, label: 'Zip Code', placeholder: 'Zip Code', maxLength: 5, inputMode: 'numeric', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'zip') });
		fields.employer = this.props.textField('employer', { group: 'customer', required: work.required, label: 'Employer', placeholder: 'Employer', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'employer') });
		fields.occupation = this.props.textField('occupation', { group: 'customer', required: work.required, label: 'Occupation', placeholder: 'Occupation', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'occupation') });
		fields.custom = this.props.textField('note', { required: custom.required, label: custom.placeholder, hideLabel: true, placeholder: custom.placeholder });


		const linkText = sendEmail.linkText || 'Send an Email Message';

		fields.sendEmail =
			<div style={{ marginLeft: 8 }}>
				<ModalLink id='sendEmail' allowCustom={true} customColor={primaryColor} opts={{ sendEmailCallback: this.sendEmailCallback, sendEmail: this.state.sendEmail, headerText: linkText }}>{linkText}</ModalLink>
			</div>
		;

		const items = [];
		const fieldLayout = util.sortByField(this.fieldLayout(), 'order', 'ASC');

		Object.entries(fieldLayout).forEach(([key, value]) => {
			items.push(
				<div
					key={key}
					className='column'
					style={{ width: this.props.breakpoint === 'mobile' ? '100%' : util.getValue(value, 'width', '50%') }}
				>
					{util.getValue(fields, value.field)}
				</div>
			);
		});

		return items;
	}

	render() {

		const {
			processingPayment
		} = this.state;

		return (
			<>
				<ModalRoute
					className='gbx3 givebox-paymentform'
					id='sendEmail'
					modalRootClass='sendEmail gbxModal'
					component={(props) =>
						<SendEmail {...props} {...this.props} />
					}
					effect='3DFlipVert'
					style={{ width: '50%' }}
				/>
				<>
					{ processingPayment ? <Loader msg='Please wait while transaction is processed...' forceText={true} /> : <></> }
					{this.renderFields()}
					{this.props.saveButton(this.processForm, { style: { margin: 0, padding: 0, height: 0, width: 0, visibility: 'hidden' } })}
				</>
			</>
		)
	}
}

class PaymentForm extends Component {

	constructor(props){
		super(props);
		this.formStateCallback = this.formStateCallback.bind(this);
		this.state = {
			formState: {}
		}
		this.formRef = React.createRef();
	}

	formStateCallback(formState) {
		this.setState({ formState });
	}

	render() {

		const {
			formState
		} = this.state;

		const {
			breakpoint,
			primaryColor
		} = this.props;

		return (
			<div ref={this.formRef} className='givebox-paymentform'>
				<AnimateHeight
					height={util.getValue(formState, 'error', false) ? 'auto' : 0}
				>
					<div className='mainError error'>{util.getValue(formState, 'errorMsg', 'Please fix field errors in red below')}</div>
				</AnimateHeight>
				<Form
					id='gbxForm'
					className='clean'
					name={'gbxForm'}
					errorMsg={false}
					successMsg={false}
					formPropCallback={this.formStateCallback}
					neverSubmitOnEnter={this.props.editable ? true : false}
					primaryColor={primaryColor}
				>
					<PaymentFormClass
						{...this.props}
						breakpoint={breakpoint}
					/>
				</Form>
			</div>
		)
	}
}

PaymentForm.defaultProps = {
	breakpointSize: 700,
	phone: {
		enabled: false,
		required: false
	},
	address: {
		enabled: false,
		required: false
	},
	work: {
		enabled: false,
		required: false
	},
	custom: {
		enabled: false,
		required: false,
		placeholder: 'Custom placeholder'
	},
	sendEmail: {
		enabled: true,
		linkText: 'Tell your friends link',
		headerText: 'Tell your friends header!',
		defaultMsg: ''
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const emailBlastToken = util.getValue(info, 'ebToken', null);
	const emailBlastEmail = util.getValue(info, 'ebEmail', null);
	const cart = util.getValue(gbx3, 'cart', {});
	const cartTotal = util.getValue(cart, 'total', 0);
	const zeroAmountAllowed = util.getValue(cart, 'zeroAmountAllowed', false);
	const cartCustomer = util.getValue(cart, 'customer', {});
	const cartItems = util.getValue(cart, 'items');
	const openCart = util.getValue(cart, 'open');
	const paymethod = util.getValue(cart, 'paymethod');
	const cardType = util.getValue(cart, 'cardType');
	const amount = util.getValue(cart, 'subTotal', 0);

	return {
		emailBlastToken,
		emailBlastEmail,
		zeroAmountAllowed,
		cartCustomer,
		cartItems,
		cartTotal,
		openCart,
		paymethod,
		cardType,
		amount
	}
}

export default connect(mapStateToProps, {
	updateCart,
	toggleModal,
	processTransaction,
	resetCart,
	updateConfirmation
})(PaymentForm)
