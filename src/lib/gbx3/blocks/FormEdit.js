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
					label={`Payment Options`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<Choice
								type='checkbox'
								name='passFees'
								label={'Customer Pays the Credit Card Fee by Default'}
								onChange={(name, value) => {
									this.updateForm('passFees', passFees ? false : true);
								}}
								checked={passFees}
								value={passFees}
							/>
							<Choice
								type='checkbox'
								name='feeOption'
								label={'Customer has the Option to Pay the Credit Card Fee'}
								onChange={(name, value) => {
									this.updateForm('feeOption', feeOption ? false : true);
								}}
								checked={feeOption}
								value={feeOption}
							/>
							<Choice
								type='checkbox'
								name='echeck'
								label={'Allow customers to Pay by eCheck'}
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
					label={`Additional Customer Fields`}
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
								label={'Collect Customer Occupation and Employer'}
								fixedLabel={true}
								defaultValue={+workInfo}
								onChange={(name, value) => {
									this.updateForm('workInfo', +value);
								}}
								options={this.infoOptions()}
							/>
							<Dropdown
								name='noteInfo'
								label={'Collect a Custom Field'}
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
									placeholder='Enter a Custom Placeholder'
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
					label={`Cart Options`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
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
							<Choice
								type='checkbox'
								name='allowSelection'
								label={'Give Users an Option to Shop other Items'}
								onChange={(name, value) => {
									this.updateForm('allowSelection', allowSelection ? false : true);
								}}
								checked={allowSelection}
								value={allowSelection}
							/>
							<TextField
								label='Shop More Items Title'
								fixedLabel={true}
								placeholder='Enter the title for "Shop More Items"'
								value={shopTitle}
								onChange={(e) => {
									const value = e.currentTarget.value;
									this.updateForm('shopTitle', value);
								}}
							/>
						</div>
					</div>
				</Collapse>
				<Collapse
					label={`Other Options`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<Choice
								type='checkbox'
								name='allowShare'
								label={'Allow this form to be shared'}
								onChange={(name, value) => {
									this.updateForm('allowShare', allowShare ? false : true);
								}}
								checked={allowShare}
								value={allowShare}
							/>
							<Choice
								type='checkbox'
								name='hasCustomGoal'
								label={'Do You Want to Set a Goal?'}
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
