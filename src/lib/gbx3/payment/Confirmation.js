import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateCart
} from '../../';

class Confirmation extends Component {

	constructor(props) {
		super(props);
		this.renderPaymethodText = this.renderPaymethodText.bind(this);
		this.state = {
		};
	}

	componentDidMount() {
	}

	renderPaymethodText() {
		const {
			paymethod,
			confirmation,
			descriptor,
			total
		} = this.props;

		const item = [];

		switch (paymethod) {
			case 'echeck': {
				item.push(
					<span key={paymethod}>
						<span style={{ display: 'block', paddingBottom: 5 }}>Your bank account has been charged in the amount of <strong>{util.money(total)}</strong>.</span>
						The charge will show up in your <strong>{util.getValue(confirmation, 'bankName')}</strong> Transactions with a description similar to "{descriptor}".
					</span>
				);
				break;
			}

			case 'creditcard':
			case 'applepay':
			default: {
				item.push(
					<span key={paymethod}>
						<span style={{ display: 'block', paddingBottom: 5 }}>Your credit card has been charged in the amount of <strong>{util.money(total)}</strong>.</span>
						The charge will show up in your <strong>{util.getValue(confirmation, 'cardType')}</strong> card transactions with a description similar to <strong>{descriptor}</strong>.
					</span>
				);
				break;
			}
		}

		return (
			<div className='successfulText'>
				{item}
			</div>
		)
	}

	render() {

		const {
			confirmation
		} = this.props;

		console.log('execute confirmation', confirmation);

		return (
			<div className='modalWrapper confirmation'>
				<div className='successfulText'>
					<span style={{ display: 'block', fontSize: '1.1em', padding: '5px 0' }} className='green'><span className='icon icon-check'></span> Your transaction has been processed successfully!</span>
					<span style={{ display: 'block' }}>An email receipt has been sent to <strong>{util.getValue(confirmation, 'email')}</strong>.</span>
				</div>
				{this.renderPaymethodText()}
				<div className='share'>
					Share
				</div>
			</div>
		)
	}
};

function mapStateToProps(state, props) {
	const gbx3 = util.getValue(state, 'gbx3', {});
	const cart = util.getValue(gbx3, 'cart', {});
	const paymethod = util.getValue(cart, 'paymethod');
	const total = util.getValue(cart, 'total', 0);
	const confirmation = util.getValue(cart, 'confirmation', {});
	const data = util.getValue(gbx3, 'data', {});
	const descriptor = util.getValue(data, 'orgBillingDescriptor', 'GBX*GIVEBOX');

	return {
		paymethod,
		total,
		confirmation,
		descriptor
	}
}

export default connect(mapStateToProps, {
	updateCart
})(Confirmation);
