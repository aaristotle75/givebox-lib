import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	Form,
	util,
	Loader,
	Alert,
	Fade,
	GBLink
} from '../';
import { loadReCaptcha } from 'react-recaptcha-v3';
import Attachment from './Attachment';
import { searchContact, createAccount, createContact, createTicket, createAttachment } from './zohoDeskAPI';

const RECAPTCHA_KEY = '6Lddf3wUAAAAADzJFZ9siQeegVC_PNHBIBQivCJ_';

class TicketFormClass extends Component {

	constructor(props) {
		super(props);
		this.processForm = this.processForm.bind(this);
		this.attachmentCallback = this.attachmentCallback.bind(this);
		this.setSuccess = this.setSuccess.bind(this);
		this.state = {
			loading: false,
			attachment: {},
			error: null,
			success: null
		};
		this.uploadImageRef = React.createRef();
	}

	componentDidMount() {
		//loadReCaptcha(RECAPTCHA_KEY, () => console.log('callback'));
	}

	async processForm(fields) {
		this.setState({ loading: true });
		const data = {};
		Object.entries(fields).forEach(([key, value]) => {
			if (value.autoReturn) data[key] = value.value;
			if (key === 'name') {
				data.firstName = util.splitName(value.value).first;
				data.lastName = util.splitName(value.value).last;
			}
			if (key === 'description') {
				data.description = util.stripHtml(value.value);
			}
		});

		const zohoContact = await this.zohoGetContact(data.email);
		let contactId = null;
		if (zohoContact) {
			contactId = util.getValue(zohoContact, 'id', null);
		} else {
			const newContact = {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email
			};
			if (this.props.role !== 'super') {
				const zohoAccount = await this.zohoCreateAccount({
					accountName: this.props.orgName,
					cf: {
						cf_givebox_org_id: this.props.orgID
					}
				});
				newContact.accountId = util.getValue(zohoAccount, 'id', null);
			}

			const newZohoContact = await this.zohoCreateContact(newContact);
			contactId = util.getValue(newZohoContact, 'id', null);
		}

		const newTicket = {
			contactId,
			teamId : this.props.teamId,
			departmentId : this.props.departmentId,
			subject: data.subject,
			description: data.description,
			channel: data.channel,
			email: data.email
		};

		if (this.props.orgName && this.props.orgID) {
			newTicket.cf = {
				cf_givebox_org_id: this.props.orgID,
				cf_givebox_org_name: this.props.orgName
			};
		}

		const zohoNewTicket = await this.zohoCreateTicket(newTicket);
		if (zohoNewTicket) {
			if (!util.isEmpty(this.state.attachment)) {
				if (await this.zohoCreateAttachment({ ...this.state.attachment, ticketId: util.getValue(zohoNewTicket, 'id') })) {
					this.setSuccess();
				}
			} else {
				this.setSuccess();
			}
		}
		/*
		const csrf_token = document.getElementById('givebox_csrf_token') ? document.getElementById('givebox_csrf_token').value :  Cookies.get('csrf_token') || '';
		const grecaptcha = window.grecaptcha;
		grecaptcha.ready(function() {
			try {
				grecaptcha.execute(RECAPTCHA_KEY, {action: 'helpdesk'})
				.then(function(token) {
					console.log('execute grecaptcha', token);
					console.log('execute csrf_token', csrf_token);
					bindthis.setState({ loading: false });
				});
			} catch (error) {
				console.log('catch error', error);
				bindthis.setState({ loading: false });
			}
		});
		*/
		this.setState({ loading: false });
	}

	setSuccess() {
		this.setState({ success: true, attachment: {}});
		this.props.fieldProp('subject', { value: '' });
		this.props.fieldProp('description', { value: '' });
	}

	async zohoGetContact(email) {
		return new Promise((resolve, reject) => {
			searchContact(email, (data, error) => {
				resolve(data);
			});
		});
	}

	async zohoCreateAccount(body) {
		return new Promise((resolve, reject) => {
			createAccount(body, (data, error) => {
				resolve(data);
			});
		});
	}

	async zohoCreateContact(body) {
		return new Promise((resolve, reject) => {
			createContact(body, (data, error) => {
				resolve(data);
			});
		});
	}

	async zohoCreateTicket(body) {
		return new Promise((resolve, reject) => {
			createTicket(body, (data, error) => {
				resolve(data);
			});
		});
	}

	async zohoCreateAttachment(body) {
		return new Promise((resolve, reject) => {
			createAttachment(body, (data, error) => {
				resolve(data);
			});
		});
	}

	attachmentCallback(file, base64) {
		const attachment = {};
		if (file && base64) {
			attachment.fileName = file.name;
			attachment.base64 = base64;
		}
		this.setState({ attachment });
	}

	render() {

		const {
			loading,
			success
		} = this.state;

		const name = this.props.firstName || this.props.lastName ? `${this.props.firstName} ${this.props.lastName}` : '';

		return (
			<div>
				{loading && <Loader msg={`Processing...`} />}
				{ success ?
					<div className='flexColumn flexCenter'>
						<Alert display={success} msg='Your ticket has been received. A Givebox representative will respond to your request within 1-3 business days.' alert='success'/>
						<Fade in={success}>
							<GBLink onClick={() => this.setState({ success: null })} className='flexCenter button'>Submit another ticket</GBLink>
						</Fade>
					</div>
				:
					<div>
						{this.props.textField('channel', { type: 'hidden', value: this.props.channel })}
						<div className='column50'>
							{this.props.textField('name', { placeholder: 'Enter your name', label: 'Your Name', fixedLabel: true, value: name })}
						</div>
						<div className='column50'>
							{this.props.textField('email', { placeholder: 'Enter your email', label: 'Your Email', fixedLabel: true, validate: 'email', value: this.props.email })}
						</div>
						{this.props.textField('subject', { placeholder: 'A short description of your question or issue', label: 'Subject', fixedLabel: true, required: true })}
						{this.props.richText('description', { placeholder: 'Please describe the reason for contacting Givebox Help Desk...', label: 'Description', wysiwyg: false, hideCloseModalAndSaveButtons: true, required: true })}
						<Attachment
							callback={this.attachmentCallback}
						/>
						<div className='button-group center'>
							{this.props.saveButton(this.processForm, { label: 'Submit Ticket', style: { width: 150 } })}
						</div>
					</div>
				}
			</div>
		)
	}
}

TicketFormClass.defaultProps = {
	firstName: '',
	lastName: '',
	email: '',
	orgName: '',
	orgID: ''
}

function mapStateToProps(state, props) {

	return {
	}
}

const TicketFormConnect = connect(mapStateToProps, {
})(TicketFormClass);


export default class TicketForm extends Component {

	render() {

		return (
			<div className='formSectionContainer'>
				<div className=' formSection'>
					<div style={{ height: this.props.scrollHeight + 100 }} className='scrollContainer'>
						<Form neverSubmitOnEnter={true} id='ticketForm' name='ticketForm' options={{ required: true }}>
							<TicketFormConnect
								{...this.props}
							/>
						</Form>
					</div>
				</div>
			</div>
		)
	}
}
