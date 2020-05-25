import React, {Component} from 'react';
import { Image, GBLink } from '../../';

class ApplePay extends Component {

	constructor(props) {
		super(props);
		this.state = {
			canMakePayments: false
		};
	}

	componentDidMount() {
		if (window.ApplePaySession) {
			var merchantIdentifier = 'merchant.com.givebox.gbx';
			var promise = window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
			promise.then(function (canMakePayments) {
				if (canMakePayments) {
					this.setState({ canMakePayments: true });
				}
			});
		}
	}

	render() {

		return (
			<div style={{ padding: '20px 0 0 0' }} className='input-group'>
				<div className='payMethods'>
					<img src='https://givebox.s3-us-west-1.amazonaws.com/public/images/applepay.png' height='25' alt='eCheck logo' />
				</div>
				<div>
					{this.state.canMakePayments ? <div className='green'>Apple Pay Button</div> : <div className='error'>Cannot make payments</div> }
				</div>
			</div>
		)
	}
};

export default ApplePay;
