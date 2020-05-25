import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	selectOptions,
	ModalLink,
	Form,
	ModalRoute,
	Tab,
	Tabs
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
		this.formSavedCallback = this.formSavedCallback.bind(this);
		this.sendEmailCallback = this.sendEmailCallback.bind(this);
		this.state = {
			loading: false,
			sendEmail: {
				recipients: '',
				message: util.getValue(this.props.sendEmail, 'defaultMsg', '')
			},
			applepay: false
		}
	}

	componentDidMount() {
		if (window.ApplePaySession) {
			this.setState({ applepay: true });
		}
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	formSavedCallback() {
		if (this.props.callback) {
			this.props.callback(arguments[0]);
		}
	}

	processCallback(res, err) {
		if (!err) {
			this.props.formSaved(() => this.formSavedCallback(res.ID));
		} else {
			if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
		}
		return;
	}

	processForm(fields) {
		const data = {};
		Object.entries(fields).forEach(([key, value]) => {
			if (value.autoReturn) data[key] = value.value;
			if (key === 'name') {
				const name = util.splitName(value.value);
				data.firstname = name.first;
				data.lastname = name.last;
			}
			if (key === 'ccnumber') data.number = value.apiValue;
			if (key === 'ccexpire') {
				const ccexpire = util.getSplitStr(value.value, '/', 2, -1);
				data.expMonth = parseInt(ccexpire[0]);
				data.expYear = parseInt(`${Moment().format('YYYY').slice(0, 2)}${ccexpire[1]}`);
			}
		});

		console.log('processForm', data);
		/*
		this.props.sendResource(
			this.props.resource,
			{
				id: [this.props.id],
				method: 'patch',
				data: data,
				callback: this.processCallback.bind(this),
			});
		*/
	}

	customOnChange(name, value) {
		console.log('customOnChange', name, value);
		//this.props.fieldProp(name, { value });
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
			echeck
		} = this.props;

		const tabs = [];
		tabs.push(
			<Tab key={'creditcard'} id={'creditcard'} label={<span className='tabLabel'>Pay by Credit Card</span>}>
				{this.props.creditCardGroup({ required: true, placeholder: 'xxxx xxxx xxxx xxxx', debug: false, cvvModalRootClass: 'gbxModal' })}
			</Tab>
		);

		if (echeck) {
			tabs.push(
				<Tab key={'echeck'} id={'echeck'} label={<span className='tabLabel'>Pay by eCheck</span>}>
					<Echeck primaryColor={primaryColor} textField={this.props.textField} />
				</Tab>
			);
		}

		if (this.state.applepay) {
			tabs.push(
				<Tab key={'applepay'} id={'applepay'} label={<span className='tabLabel'>Pay using Apple Pay</span>}>
					<ApplePay />
				</Tab>
			);
		}

		return (
			<Tabs
				default='echeck'
				className='paymentFormTabs'
				allowCustom={true}
				customColor={primaryColor}
				borderSize={'1px'}
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
			sendEmail
		} = this.props;

		const headerText =
			<div className='paymentFormHeader'>
				<span className='paymentFormHeaderTitle'>Payment Info</span>
				<span className='paymentFormHeaderText'>
					Please enter your payment information.
				</span>
			</div>
		;
		const fields = {};

		fields.payment = this.paymentOptions();
		fields.name =
			<div className='column'>
				{headerText}
				{this.props.textField('name', { placeholder: 'Your Name',  label: 'Name', required: true })}
			</div>
		;
		fields.email = this.props.textField('email', {required: true, placeholder: 'Your Email Address', label: 'Email', validate: 'email', inputMode: 'email' });
		fields.phone = this.props.textField('phone', {required: phone.required, label: 'Phone', placeholder: 'Phone Number', validate: 'phone', inputMode: 'tel' });
		fields.address = this.props.textField('address', { required: address.required, label: 'Address', placeholder: 'Street Address' });
		fields.city = this.props.textField('city', { required: address.required, label: 'City', placeholder: 'City' });
		fields.zip = this.props.textField('zip', { required: true, label: 'Zip Code', placeholder: 'Zip Code', maxLength: 5, inputMode: 'numeric' });
		fields.state = this.props.dropdown('state', {label: 'State', fixedLabel: false, selectLabel: 'State', options: selectOptions.states, required: address.required })
		fields.employer = this.props.textField('employer', { required: work.required, label: 'Employer', placeholder: 'Employer' });
		fields.occupation = this.props.textField('occupation', { required: work.required, label: 'Occupation', placeholder: 'Occupation' });
		fields.custom = this.props.textField('note', { required: custom.required, label: custom.placeholder, hideLabel: true, placeholder: custom.placeholder });


		const linkText = sendEmail.linkText || 'Send an Email Message';

		fields.sendEmail =
			<ModalLink id='sendEmail' allowCustom={true} customColor={this.props.primaryColor} opts={{ sendEmailCallback: this.sendEmailCallback, sendEmail: this.state.sendEmail, headerText: linkText }}>{linkText}</ModalLink>
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

		return (
			<>
				<ModalRoute className='gbx3 givebox-paymentform' id='sendEmail' modalRootClass='sendEmail gbxModal' component={(props) => <SendEmail {...props} {...this.props} /> } effect='3DFlipVert' style={{ width: '50%' }} />
				<>
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
	return {
	}
}

export default connect(mapStateToProps, {
})(PaymentForm)
