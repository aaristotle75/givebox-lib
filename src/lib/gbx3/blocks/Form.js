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
		this.edit = this.edit.bind(this);
		this.saveButton = this.saveButton.bind(this);

		const button = {...util.getValue(props.globalOptions, 'button', {}), ...util.getValue(props.options, 'button', {}) };
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

	edit() {
		//this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
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
			<div className='block'>
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
					<GBLink allowCustom={true} onClick={() => console.log('onclick callback')}>No, thanks</GBLink>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const modalID = `textBlock-${props.name}`;

	return {
		modalID
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(Form);
