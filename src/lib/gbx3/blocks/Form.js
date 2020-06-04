import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	toggleModal,
	ModalRoute,
	ModalLink,
	Collapse,
	Tabs,
	Tab,
	updateData,
	updateCart,
	Choice
} from '../../';
import PaymentForm from '../payment/PaymentForm';
import FormEdit from './FormEdit';
import ButtonEdit from './ButtonEdit';
import Button from './Button';
import Terms from '../payment/Terms';
import Totals from '../payment/Totals';
import Cart from '../payment/Cart';
import Confirmation from '../payment/Confirmation';

class Form extends Component {

	constructor(props) {
		super(props);
		this.saveButton = this.saveButton.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.setCart = this.setCart.bind(this);
		const options = props.options;
		const button = util.getValue(options, 'button', {});
		const form = util.getValue(options, 'form', {});

		this.state = {
			button,
			form,
			defaultForm: util.deepClone(form),
			defaultButton: util.deepClone(button),
			order: {
				terms: true,
				passFees: true
			}
		};
	}

	componentDidMount() {
	}

	closeEditModal(type = 'save') {

		const {
			button,
			defaultButton,
			form,
			defaultForm
		} = this.state;

		const {
			passFees,
			feeOption,
			addressInfo,
			phoneInfo,
			workInfo,
			noteInfo,
			notePlaceholder,
			allowSelection
		} = form;

		if (type !== 'cancel') {
			// Check if cart should be updated
			if (this.props.passFees !== passFees) {
				this.props.updateCart({ passFees });
			}

			this.setState({
				button,
				form,
				defaultButton: util.deepClone(button),
				defaultForm: util.deepClone(form)
			}, () => {
				const data = {
					passFees,
					giveboxSettings: {
						feeOption,
						addressInfo,
						phoneInfo,
						workInfo,
						noteInfo,
						notePlaceholder,
						allowSelection
					}
				};
				this.props.saveBlock({
					data,
					options: {
						button,
						form
					}
				});
			});
		} else {
			this.setState({
				defaultButton,
				defaultForm,
				button: util.deepClone(defaultButton),
				form: util.deepClone(defaultForm)
			}, () => {
				this.props.closeEditModal();
			});
		}
	}

	saveButton() {
		//this.props.toggleModal('paymentConfirmation', true);
		const form = document.getElementById(`gbxForm-form-saveButton`);
		if (form) form.click();
	}

	remove() {
		console.log('execute remove');
	}

	optionsUpdated(name, obj) {
		this.setState({ [name]: { ...obj } });
	}

	getInfo(info) {
		const value = util.getValue(this.state.form, info, 0);
		return {
			enabled: value > 0,
			required: value > 1
		}
	}

	setCart(key, value) {
		const cart = this.props.cart;
		cart[key] = value;
		this.props.updateCart(cart);
	}

	render() {

		const {
			primaryColor,
			title,
			modalID,
			breakpoint,
			acceptedTerms
		} = this.props;

		const {
			button,
			form
		} = this.state;

		const phoneInfo = this.getInfo('phoneInfo');
		const addressInfo = this.getInfo('addressInfo');
		const workInfo = this.getInfo('workInfo');
		const noteInfo = this.getInfo('noteInfo');

		return (
			<div className='formBlock'>
				<ModalRoute
					className='gbx3'
					id={modalID}
					effect='3DFlipVert' style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Tabs
								default={'edit'}
								className='statsTab'
							>
								<Tab id='edit' label={<span className='stepLabel'>Edit Form Options</span>}>
									<FormEdit
										form={form}
										optionsUpdated={this.optionsUpdated}
									/>
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
													globalOption={true}
													button={button}
													optionsUpdated={this.optionsUpdated}
													onClick={() => console.log('Test form submit')}
												/>
											</div>
										</div>
									</Collapse>
								</Tab>
							</Tabs>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
							</div>
						</div>
					}
				/>
				<Cart primaryColor={primaryColor} />
				<PaymentForm
					primaryColor={primaryColor}
					echeck={util.getValue(form, 'echeck', true)}
					phone={{ enabled: phoneInfo.enabled, required: phoneInfo.required }}
					address={{ enabled: addressInfo.enabled, required: addressInfo.required }}
					work={{ enabled: workInfo.enabled, required: workInfo.required }}
					custom={{ enabled: noteInfo.enabled, required: noteInfo.required, placeholder: util.getValue(form, 'notePlaceholder', 'Enter a Note') }}
					sendEmail={util.getValue(form, 'sendEmail', true)}
					editable={this.props.editable}
					breakpoint={breakpoint}
				/>
				<div className='formBottomSection'>
					<Totals
						setCart={this.setCart}
						primaryColor={primaryColor}
						toggleModal={this.props.toggleModal}
					/>
					<div className='buttonSection'>
						<div style={{ marginBottom: 10 }}>
							<Choice
								label='I Accept the Terms & Conditions'
								value={acceptedTerms}
								checked={acceptedTerms}
								onChange={() => {
									this.setCart('acceptedTerms', acceptedTerms ? false : true)
								}}
								color={primaryColor}
								error={!acceptedTerms ? 'You Must Accept the Terms & Conditions to Continue' : false}
								errorType={'tooltip'}
							/>
						</div>
						<div style={{ margin: '20px 0' }}>
							<Button
								onClick={this.saveButton}
								button={button}
							/>
						</div>
						<ModalRoute
							id='terms'
							effect='3DFlipVert'
							style={{ width: '60%' }}
							className='gbx3'
							component={() =>
								<Terms
									setCart={this.setCart}
									primaryColor={primaryColor}
									toggleModal={this.props.toggleModal}
								/>
							}
						/>
						<ModalLink style={{ marginTop: 10 }} allowCustom={true} customColor={primaryColor} id='terms'>Read Terms and Conditions</ModalLink>
					</div>
				</div>
				<ModalRoute
					id='paymentConfirmation'
					effect='scaleUp'
					style={{ width: '60%' }}
					className='gbx3'
					component={() =>
						<Confirmation
							form={form}
							primaryColor={primaryColor}
						/>
					}
				/>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const cart = util.getValue(gbx3, 'cart', {});
	const passFees = util.getValue(cart, 'passFees');
	const acceptedTerms = util.getValue(cart, 'acceptedTerms');
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor', {});

	return {
		cart,
		passFees,
		acceptedTerms,
		gbxStyle,
		primaryColor
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	updateData,
	updateCart
})(Form);
