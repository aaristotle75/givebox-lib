import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	toggleModal,
	ModalRoute,
	Collapse,
	Tabs,
	Tab,
	updateData
} from '../../';
import PaymentForm from '../payment/PaymentForm';
import FormEdit from './FormEdit';
import ButtonEdit from './ButtonEdit';
import Button from './Button';

class Form extends Component {

	constructor(props) {
		super(props);
		this.saveButton = this.saveButton.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.getInfo = this.getInfo.bind(this);
		const options = props.options;
		const button = util.getValue(options, 'button', {});
		const form = util.getValue(options, 'form', {});

		this.state = {
			button,
			form,
			defaultForm: util.deepClone(form),
			defaultButton: util.deepClone(button)
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

	render() {

		const {
			primaryColor,
			title,
			modalID,
			breakpoint
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
				<div className='button-group'>
					<Button
						onClick={this.saveButton}
						button={button}
					/>
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
