import React, {Component} from 'react';
import {
	ModalRoute,
	ModalLink,
	Fade,
	util
} from '../../';
import EcheckHowModal from './EcheckHowModal';

class Echeck extends Component {

	constructor(props) {
		super(props);
		this.getBankName = this.getBankName.bind(this);
		this.state = {
			bankName: ''
		}
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
					const bankName = util.getValue(json, 'name');
					bindthis.setState({ bankName });
					bindthis.props.fieldProp('bankName', { value: bankName });
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

	render() {

		const {
			primaryColor
		} = this.props;

		const {
			bankName
		} = this.state;

		const echeckHowModal =
			<div className='cvvModal'>
				<span style={{ marginRight: 10 }}>Account Number</span>
				<ModalLink id='echeckHow' customColor={primaryColor} allowCustom={true}>What is eCheck?</ModalLink>
			</div>
		;

		return (
			<div style={{ padding: '20px 0 0 0', margin: 0 }} className='input-group'>
				<ModalRoute
					id='echeckHow'
					className='gbx3'
					effect='3DFlipVert'
					style={{ width: '60%' }}
					component={() => (
						<EcheckHowModal />
					)}
				/>
				<div className='payMethods'>
					<img src='https://givebox.s3-us-west-1.amazonaws.com/public/images/card-echeck.png' width='31' height='21' alt='eCheck logo' />
					<div className='bankname'>
						<Fade
							in={bankName ? true : false}
						>
							<span className='date'>{this.state.bankName}</span>
						</Fade>
					</div>
				</div>
				<div>
					{this.props.textField('bankName', { type: 'hidden', value: this.state.bankName })}
					<div className='col echeckCol'>{this.props.textField('accountNumber', { group: 'paymethod', placeholder: 'Bank Account Number', label: 'Bank Account Number', fixedLabel: true, customLabel: echeckHowModal, required: false, maxLength: 16, inputMode: 'numeric' })}</div>
					<div className='col echeckCol'>{this.props.textField('routingNumber', { group: 'paymethod', placeholder: 'Bank Routing Number', fixedLabel: true, label: 'Routing Number', required: false, maxLength: 9, onChange: this.getBankName, inputMode: 'numeric' })}</div>
				</div>
			</div>
		)
	}
};

export default Echeck;
