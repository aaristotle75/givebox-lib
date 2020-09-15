import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	Choice
} from '../../';
import {
	updateCartItem,
	updateCart
} from '../redux/gbx3actions';

class CheckoutDonation extends Component {

	constructor(props){
		super(props);
		this.toggleChecked = this.toggleChecked.bind(this);
		this.state = {
			checked: false
		};
	}

	componentDidMount() {
	}

	toggleChecked() {
		const checked = this.state.checked ? false : true;
		this.setState({ checked });
	}

	render() {

		const {
			checkoutDonationText
		} = this.props.form;

		const {
			checked
		} = this.state;

		return (
			<div className='checkoutDonation'>
				<Choice
					type='checkbox'
					name='checkoutDonation'
					label={checkoutDonationText || 'Click here to make a donation at checkout'}
					onChange={this.toggleChecked}
					checked={checked}
					value={checked}
					toggle={true}
				/>
			</div>
		)
	}
};

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
	updateCartItem,
	updateCart
})(CheckoutDonation);
