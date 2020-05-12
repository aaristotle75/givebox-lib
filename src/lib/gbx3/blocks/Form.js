import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	toggleModal
} from '../../';
import PaymentForm from '../payment/PaymentForm';
import Button from './Button';

class Form extends Component {

	constructor(props) {
		super(props);
		this.saveButton = this.saveButton.bind(this);

		const options = props.options;
		const button = util.getValue(options, 'button', {});

		this.state = {
			button,
			defaultButton: { ...button },
			edit: false
		};
	}

	componentDidMount() {
	}

	saveButton() {
		const form = document.getElementById(`gbxForm-form-saveButton`);
		if (form) form.click();
	}

	remove() {
		console.log('execute remove');
	}

	render() {

		const {
			article,
			primaryColor
		} = this.props;

		const {
			button
		} = this.state;

		return (
			<div className='formBlock'>
				<PaymentForm
					primaryColor={primaryColor}
					article={article}
					phone={{ enabled: true, required: false }}
					address={{ enabled: true, required: false }}
					work={{ enabled: true, required: false }}
					custom={{ enabled: true, required: false, placeholder: 'My custom note placeholder' }}
					editable={this.props.editable}
				/>
				<div className='button-group'>
					<Button
						onClick={this.saveButton}
						button={button}
					/>
					<GBLink allowCustom={true} customColor={primaryColor} onClick={() => console.log('onclick callback')}>No, thanks</GBLink>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const modalID = `textBlock-${props.name}`;
	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor', {});

	return {
		modalID,
		gbxStyle,
		primaryColor
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(Form);
