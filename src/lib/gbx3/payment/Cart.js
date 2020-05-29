import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	updateCart
} from '../../';
import AnimateHeight from 'react-animate-height';

class Cart extends Component {

	constructor(props) {
		super(props);
		this.renderItemsInCart = this.renderItemsInCart.bind(this);
		this.state = {
		};
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	renderItemsInCart() {
		const {
			cartItems,
			primaryColor
		} = this.props;

		const items = [];

		if (!util.isEmpty(cartItems)) {
			const numCartItems = cartItems.length;
			Object.entries(cartItems).forEach(([key, value]) => {
				items.push(
					<div key={key} className='cartItemRow'>
						<div style={{ width: '80%' }} className='col'>
							<div className='itemName'>{value.name}</div>
							<div className='itemSubTitle'>{value.orgName}</div>
							<div className='itemActions'>
								Quantity {value.quantity}
								<GBLink style={{ marginLeft: 5 }} allowCustom={true} customColor={primaryColor} onClick={() => console.log('change quantity')}>Change</GBLink>
								<GBLink style={{ marginLeft: 10 }} allowCustom={true} customColor={primaryColor} onClick={() => console.log('remove item')}>Remove</GBLink>
							</div>
						</div>
						<div style={{ width: '20%', verticalAlign: 'middle' }} className='col center'>
							{util.money(value.amountFormatted)}
						</div>
					</div>
				);
			});
		}

		return (
			<div className='itemsInCart'>
				{ !util.isEmpty(items) ? items : <span className='flexCenter noRecords'>No Items in Cart</span> }
			</div>
		);
	}

	render() {

		const {
			open,
			primaryColor
		} = this.props;

		return (
			<div className='gbx3Cart'>
				<AnimateHeight height={open ? 'auto' : 0}>
					<div style={{ background: primaryColor }} className='paymentFormHeaderTitle'>
						Your Cart
						<GBLink className='link closeCart' onClick={() => this.props.updateCart({ open: false })}><span className='icon icon-x'></span></GBLink>
					</div>
					{this.renderItemsInCart()}
				</AnimateHeight>
			</div>
		)
	}
}

Cart.defaultProps = {
};

function mapStateToProps(state, props) {
	const gbx3 = util.getValue(state, 'gbx3', {});
	const cart = util.getValue(gbx3, 'cart', {});
	const total = util.getValue(cart, 'total');
	const open = util.getValue(cart, 'open');
	const cartItems = util.getValue(cart, 'items', []);

	return {
		cart,
		total,
		open,
		cartItems
	}
}

export default connect(mapStateToProps, {
	updateCart
})(Cart);
