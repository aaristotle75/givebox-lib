import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Choice,
	TextField,
	Dropdown,
	Collapse,
	_v
} from '../../';
import AnimateHeight from 'react-animate-height';

class FormEdit extends Component {

	constructor(props) {
		super(props);
		this.updateForm = this.updateForm.bind(this);
		this.infoOptions = this.infoOptions.bind(this);
		this.state = {
			goalError: ''
		};
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	updateForm(name, value) {
		const form = { ...this.props.form };
		form[name] = value;
		this.props.optionsUpdated('form', form);
	}

	infoOptions(info) {
		return [
			{ primaryText: `No`, value: 0 },
			{ primaryText: `Yes, but make it optional`, value: 1 },
			{ primaryText: `Yes, and make it required`, value: 2 }
		];
	}

	render() {

		const {
			echeck,
			feeOption,
			passFees,
			addressInfo,
			phoneInfo,
			workInfo,
			noteInfo,
			notePlaceholder,
			sendEmail,
			allowSelection,
			allowShare,
			hasCustomGoal,
			goal,
			cartTitle,
			shopTitle
		} = this.props.form;

		return (
			<>
				<Collapse
					label={`Banking Fee Options`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<Choice
								type='checkbox'
								name='passFees'
								label={'Customer Pays the Credit Card Fee'}
								onChange={(name, value) => {
									this.updateForm('passFees', passFees ? false : true);
								}}
								checked={passFees}
								value={passFees}
							/>
							<Choice
								type='checkbox'
								name='feeOption'
								label={'Customer Has Option to Pay Credit Card Fee'}
								onChange={(name, value) => {
									this.updateForm('feeOption', feeOption ? false : true);
								}}
								checked={feeOption}
								value={feeOption}
							/>
							<Choice
								type='checkbox'
								name='echeck'
								label={'Allow Customers to Pay by eCheck'}
								onChange={(name, value) => {
									this.updateForm('echeck', echeck ? false : true);
								}}
								checked={echeck}
								value={echeck}
							/>
						</div>
					</div>
				</Collapse>
				<Collapse
					label={`Customer Payment Options`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<Choice
								type='checkbox'
								name='echeck'
								label={'Enable Electronic Check Payments'}
								onChange={(name, value) => {
									this.updateForm('echeck', echeck ? false : true);
								}}
								checked={echeck}
								value={echeck}
							/>
						</div>
					</div>
				</Collapse>
				<Collapse
					label={`Customer Info Options`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<Dropdown
								name='phoneInfo'
								label={'Collect Customer Phone Number'}
								fixedLabel={true}
								defaultValue={+phoneInfo}
								onChange={(name, value) => {
									this.updateForm('phoneInfo', +value);
								}}
								options={this.infoOptions()}
							/>
							<Dropdown
								name='addressInfo'
								label={'Collect Customer Address'}
								fixedLabel={true}
								defaultValue={+addressInfo}
								onChange={(name, value) => {
									this.updateForm('addressInfo', +value);
								}}
								options={this.infoOptions()}
							/>
							<Dropdown
								name='workInfo'
								label={'Collect Customer Occupation and Employer Name'}
								fixedLabel={true}
								defaultValue={+workInfo}
								onChange={(name, value) => {
									this.updateForm('workInfo', +value);
								}}
								options={this.infoOptions()}
							/>
							<Dropdown
								name='noteInfo'
								label={'Collect Custom Info'}
								fixedLabel={true}
								defaultValue={+noteInfo}
								onChange={(name, value) => {
									this.updateForm('noteInfo', +value);
								}}
								options={this.infoOptions()}
							/>
							<AnimateHeight height={noteInfo > 0 ? 'auto' : 0}>
								<TextField
									label='Custom Field Placeholder'
									fixedLabel={true}
									placeholder='Ex. On Behalf of Jane Doe'
									value={notePlaceholder}
									onChange={(e) => {
										const value = e.currentTarget.value;
										this.updateForm('notePlaceholder', value);
									}}
								/>
							</AnimateHeight>
						</div>
					</div>
				</Collapse>
				<Collapse
					label={`Advanced Options`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<Choice
								type='checkbox'
								name='allowShare'
								label={'Allow Customers to Share Form'}
								onChange={(name, value) => {
									this.updateForm('allowShare', allowShare ? false : true);
								}}
								checked={allowShare}
								value={allowShare}
							/>
							<Choice
								type='checkbox'
								name='hasCustomGoal'
								label={'Set Fundraising Goal'}
								onChange={(name, value) => {
									this.updateForm('hasCustomGoal', hasCustomGoal ? false : true);
								}}
								checked={hasCustomGoal}
								value={hasCustomGoal}
							/>
							<AnimateHeight height={hasCustomGoal ? 'auto' : 0}>
								<TextField
									label='Goal Amount'
									fixedLabel={true}
									placeholder='Enter the Goal Amount'
									money={true}
									value={goal ? goal/100 : ''}
									maxLength={7}
									onChange={(e) => {
										const value = +(e.currentTarget.value * 100);
										this.updateForm('goal', value);
									}}
								/>
							</AnimateHeight>
							<Choice
								type='checkbox'
								name='sendEmail'
								label={'Give Users an Option to Send an Email Message'}
								onChange={(name, value) => {
									sendEmail.enabled = sendEmail.enabled ? false : true;
									this.updateForm('sendEmail', sendEmail);
								}}
								checked={sendEmail.enabled}
								value={sendEmail.enabled}
							/>
							<Choice
								type='checkbox'
								name='allowSelection'
								label={'Enable Cart'}
								onChange={(name, value) => {
									this.updateForm('allowSelection', allowSelection ? false : true);
								}}
								checked={allowSelection}
								value={allowSelection}
							/>
							<AnimateHeight height={allowSelection ? 'auto' : 0}>
								<TextField
									label='Cart Title'
									fixedLabel={true}
									placeholder='Enter the title for "Your Cart"'
									value={cartTitle}
									onChange={(e) => {
										const value = e.currentTarget.value;
										this.updateForm('cartTitle', value);
									}}
								/>
								<TextField
									label='Browse More Items Title'
									fixedLabel={true}
									placeholder='Browse More Items Title"'
									value={shopTitle}
									onChange={(e) => {
										const value = e.currentTarget.value;
										this.updateForm('shopTitle', value);
									}}
								/>
							</AnimateHeight>
							{/*
							<Choice
								type='checkbox'
								name='sendEmail'
								label={'Give Users an Option to Send an Email Message'}
								onChange={(name, value) => {
									sendEmail.enabled = sendEmail.enabled ? false : true;
									this.updateForm('sendEmail', sendEmail);
								}}
								checked={sendEmail.enabled}
								value={sendEmail.enabled}
							/>
							<AnimateHeight height={sendEmail.enabled ? 'auto' : 0}>
								<TextField
									label='Send Email Link Text'
									fixedLabel={true}
									placeholder='Enter the Link Text for Users to Send an Email Message'
									value={sendEmail.linkText}
									onChange={(e) => {
										const value = e.currentTarget.value;
										sendEmail.linkText = value;
										this.updateForm('sendEmail', sendEmail);
									}}
								/>
							</AnimateHeight>
							*/}
						</div>
					</div>
				</Collapse>
			</>
		)
	}
}

FormEdit.defaultProps = {
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
})(FormEdit);
