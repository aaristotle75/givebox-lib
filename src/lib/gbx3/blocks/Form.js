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
	Choice
} from '../../';
import PaymentForm from '../payment/PaymentForm';
import FormEdit from './FormEdit';
import ButtonEdit from './ButtonEdit';
import Button from './Button';
import Terms from '../payment/Terms';
import Totals from '../payment/Totals';

class Form extends Component {

	constructor(props) {
		super(props);
		this.saveButton = this.saveButton.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.setOrder = this.setOrder.bind(this);
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
			this.setState({
				button,
				form,
				defaultButton: util.deepClone(button),
				defaultForm: util.deepClone(form)
			}, async () => {
				const updated = await this.props.updateData({
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
				});
				if (updated) {
					this.props.saveBlock(null, {
						button,
						form
					});
				}
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

	setOrder(key, value) {
		const order = this.state.order;
		order[key] = value;
		this.setState({ order });
	}

	render() {

		const {
			primaryColor,
			title,
			modalID,
			breakpoint
		} = this.props;

		const {
			button,
			form,
			order
		} = this.state;

		const phoneInfo = this.getInfo('phoneInfo');
		const addressInfo = this.getInfo('addressInfo');
		const workInfo = this.getInfo('workInfo');
		const noteInfo = this.getInfo('noteInfo');
		const passFees = util.getValue(order, 'passFees', false);

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
						setOrder={this.setOrder}
						passFees={passFees}
						primaryColor={primaryColor}
						toggleModal={this.props.toggleModal}
					/>
					<div className='buttonSection'>
						<div style={{ marginBottom: 10 }}>
							<Choice
								label='I Accept the Terms & Conditions'
								value={order.terms}
								checked={order.terms}
								onChange={() => {
									this.setOrder('terms', order.terms ? false : true)
								}}
								color={primaryColor}
								error={!order.terms ? 'You Must Accept the Terms & Conditions to Continue' : false}
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
										setOrder={this.setOrder}
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
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor', {});

	return {
		gbxStyle,
		primaryColor
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	updateData
})(Form);
