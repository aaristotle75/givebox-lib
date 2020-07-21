import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalRoute,
	ModalLink,
	Collapse,
	Tabs,
	Tab,
	Choice
} from '../../';
import PaymentForm from '../payment/PaymentForm';
import FormEdit from './FormEdit';
import ButtonEdit from './ButtonEdit';
import Button from './Button';
import Terms from '../payment/Terms';
import Totals from '../payment/Totals';
import Cart from '../payment/Cart';
import { toggleModal } from '../../api/actions';
import {
	updateData,
	updateCart
} from '../redux/gbx3actions';

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
			},
			hasBeenUpdated: false
		};
	}

	componentDidMount() {
		if (this.props.receipt) this.props.toggleModal('paymentConfirmation', true);
	}

	closeEditModal(type = 'save') {

		const {
			button,
			defaultButton,
			form,
			defaultForm,
			hasBeenUpdated
		} = this.state;

		const {
			passFees,
			feeOption,
			addressInfo,
			phoneInfo,
			workInfo,
			noteInfo,
			notePlaceholder,
			allowSelection,
			hasCustomGoal,
			goal
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
					hasCustomGoal: !goal ? false : hasCustomGoal,
					goal,
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
					hasBeenUpdated,
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
		this.setState({ [name]: { ...obj }, hasBeenUpdated: true });
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
			acceptedTerms,
			reloadGBX3
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
				<Cart
					primaryColor={primaryColor}
					showShop={util.getValue(form, 'allowSelection', true)}
					reloadGBX3={reloadGBX3}
					cartTitle={util.getValue(form, 'cartTitle', null)}
					shopTitle={util.getValue(form, 'shopTitle', null)}
				/>
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
						block={this.props.block}
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
	const info = util.getValue(gbx3, 'info', {});
	const receipt = util.getValue(info, 'receipt', false);

	return {
		cart,
		passFees,
		acceptedTerms,
		gbxStyle,
		primaryColor,
		receipt
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	updateData,
	updateCart
})(Form);
