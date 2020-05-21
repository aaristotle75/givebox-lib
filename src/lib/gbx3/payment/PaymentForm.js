import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	selectOptions,
	ModalLink,
	Form,
	Fade,
	ModalRoute,
	Tab,
	Tabs
} from '../../';
import Moment from 'moment';
import SendEmail from './SendEmail';

class PaymentFormClass extends Component {

	constructor(props) {
		super(props);
		this.paymentOptions = this.paymentOptions.bind(this);
		this.renderFields = this.renderFields.bind(this);
		this.customOnChange = this.customOnChange.bind(this);
		this.processForm = this.processForm.bind(this);
		this.formSavedCallback = this.formSavedCallback.bind(this);
		this.sendEmailCallback = this.sendEmailCallback.bind(this);
		this.getBankName = this.getBankName.bind(this);
		this.state = {
			loading: false,
			sendEmail: {
				recipients: '',
				message: util.getValue(this.props.sendEmail, 'defaultMsg', '')
			},
			bankName: ''
		}
	}

	componentDidMount() {
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

	getBankName(name, value) {
		const bindthis = this;
		const routingNumber = value;
		const url = `https://www.routingnumbers.info/api/name.json?rn=${routingNumber}`;
		if (value.length === 9 && (value !== util.getValue(this.props.item, 'routingNumber'))) {
			const x = new XMLHttpRequest();
			x.onload = function() {
				if (!util.isEmpty(this.response)) {
					const json = JSON.parse(this.response);
					bindthis.setState({ bankName: util.getValue(json, 'name') });
				}
			};
			x.open('GET', url);
			x.send();
		} else if (value.length === 9 && (value === util.getValue(this.props.item, 'routingNumber'))) {
			this.setState({ bankName: util.getValue(this.props.item, 'bankName') });
		} else {
			this.setState({ bankName: '' });
		}
	}

	paymentOptions() {

		const {
			bankName
		} = this.state;

		const {
			primaryColor
		} = this.props;

		return (
			<Tabs
				default='creditCard'
				className='paymentFormTabs'
				allowCustom={true}
				customColor={primaryColor}
			>
				<Tab id='creditCard' label={<span className='tabLabel'>Pay by Credit Card</span>}>
					{this.props.creditCardGroup({ required: true, placeholder: 'xxxx xxxx xxxx xxxx', debug: false, cvvModalRootClass: 'gbxModal' })}
				</Tab>
				<Tab id='echeck' label={<span className='tabLabel'>Pay by eCheck</span>}>
					<Fade
						in={bankName ? true : false}
					>
						<span className='green date'>{this.state.bankName}</span>
					</Fade>
					<div>
						<div className='column' style={{ width: '50%' }}>{this.props.textField('accountNumber', { placeholder: 'Account Number',  label: 'Account Number', required: true })}</div>
						<div className='column' style={{ width: '50%' }}>{this.props.textField('routingNumber', { placeholder: 'Routing Number',  label: 'Routing Number', required: true, maxLength: 9, onChange: this.getBankName })}</div>
					</div>
				</Tab>
				<Tab id='applepay' label={<span className='tabLabel'>Pay by Apple Pay</span>}>

				</Tab>
			</Tabs>
		)

	}

	renderFields() {

		const {
			phone,
			address,
			work,
			custom,
			sendEmail
		} = this.props;

		const name = this.props.textField('name', { placeholder: 'Your Name',  label: 'Name', required: true });
		const email = this.props.textField('email', {required: true, placeholder: 'Your Email Address', label: 'Email', validate: 'email', inputMode: 'email' });
		const phoneField = this.props.textField('phone', {required: phone.required, label: 'Phone', placeholder: 'Phone Number', validate: 'phone', inputMode: 'tel' });
		const addressField = this.props.textField('address', { required: address.required, label: 'Address', placeholder: 'Street Address' });
		const city = this.props.textField('city', { required: address.required, label: 'City', placeholder: 'City' });
		const zip = this.props.textField('zip', { required: true, label: 'Zip Code', placeholder: 'Zip Code', maxLength: 5, inputMode: 'numeric' });
		const state = this.props.dropdown('state', {label: 'State', fixedLabel: false, selectLabel: 'State', options: selectOptions.states, required: address.required })
		const employer = this.props.textField('employer', { required: work.required, label: 'Employer', placeholder: 'Employer' });
		const occupation = this.props.textField('occupation', { required: work.required, label: 'Occupation', placeholder: 'Occupation' });
		const customField = this.props.textField('note', { required: custom.required, label: custom.placeholder, hideLabel: true, placeholder: custom.placeholder });

		const cityStateZipGroup =
			<div>
				<div className='column' style={{ width: '40%' }}>{city}</div>
				<div className='column' style={{ width: '40%' }}>{state}</div>
				<div className='column' style={{ width: '20%' }}>{zip}</div>
			</div>
		;

		const linkText = sendEmail.linkText || 'Send an Email Message';

		const sendEmailLink =
			<ModalLink id='sendEmail' allowCustom={true} customColor={this.props.primaryColor} opts={{ sendEmailCallback: this.sendEmailCallback, sendEmail: this.state.sendEmail, headerText: linkText }}>{linkText}</ModalLink>
		;

		const fields = [
			{ name: 'name', field: name, enabled: true, order: 1 },
			{ name: 'email', field: email, enabled: true, order: 2 },
			{ name: 'phone', field: phoneField, enabled: phone.enabled, order: 3 },
			{ name: 'address', field: addressField, enabled: address.enabled, order: 4, width: '100%' },
			{ name: 'zip', field: address.enabled ? cityStateZipGroup : zip, enabled: true, order: 5, width: address.enabled ? '100%' : '50%' },
			{ name: 'employer', field: employer, enabled: work.enabled, order: 6 },
			{ name: 'occupation', field: occupation, enabled: work.enabled, order: 7 },
			{ name: 'custom', field: customField, enabled: custom.enabled, order: 8, width: '100%' },
			{ name: 'sendEmail', field: sendEmailLink, enabled: sendEmail.enabled, order: 9, width: '100%' }
		];

		util.sortByField(fields, 'order', 'ASC');

		const items = [];

		items.push(
			<div className='column' key='paymentOptions'>
				{this.paymentOptions()}
			</div>
		);
		Object.entries(fields).forEach(([key, value]) => {
			if (value.enabled) {
				items.push(
					<div
						key={key}
						className='column'
						style={{ width: this.props.breakpoint === 'mobile' ? '100%' : util.getValue(value, 'width', '50%') }}
					>
						{value.field}
					</div>
				);
			}
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
		this.handleResize = this.handleResize.bind(this);
		this.formStateCallback = this.formStateCallback.bind(this);
		this.state = {
			windowWidthChange: window.innerWidth,
			breakpoint: window.innerWidth > props.breakpointSize ? 'desktop' : 'mobile',
			formState: {}
		}
		this._isMounted = false;
		this.formRef = React.createRef();
	}

	componentDidMount() {
		const current = this.formRef.current;
		const width = current.clientWidth;
		this.setState({
			windowWidthChange: width,
			breakpoint: width > this.props.breakpointSize ? 'desktop' : 'mobile'
		});
		this._isMounted = true;
		if (this._isMounted) {
			window.addEventListener('resize', this.handleResize.bind(this));
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		window.removeEventListener('resize', this.handleResize.bind(this));
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	handleResize(e) {
		if (this._isMounted) {
			const current = this.formRef.current;
			const width = current.clientWidth;
			this.setState({
				windowWidthChange: width
			});
			const breakpoint = width > this.props.breakpointSize ? 'desktop' : 'mobile';
			if (breakpoint !== this.state.breakpoint) {
				this.setState({ breakpoint });
			}
		}
	}

	formStateCallback(formState) {
		this.setState({ formState });
	}

	render() {

		const {
			breakpoint,
			formState
		} = this.state;

		const {
			primaryColor
		} = this.props;

		return (
			<div ref={this.formRef} className='givebox-paymentform'>
				<Fade
					in={util.getValue(formState, 'error', false)}
					duration={100}
				>
					<div className='mainError error'>{util.getValue(formState, 'errorMsg', 'Please fix field errors in red below')}</div>
				</Fade>
				<Form
					id='gbxForm'
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
