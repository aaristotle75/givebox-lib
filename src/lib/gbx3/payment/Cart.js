import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	updateCart,
	updateCartItem,
	updateInfo,
	resetCart,
	toggleModal,
	Dropdown,
	types
} from '../../';
import AnimateHeight from 'react-animate-height';

class Cart extends Component {

	constructor(props) {
		super(props);
		this.renderItemsInCart = this.renderItemsInCart.bind(this);
		this.onChangeQty = this.onChangeQty.bind(this);
		this.toggleShowQtyDropdown = this.toggleShowQtyDropdown.bind(this);
		this.state = {
			showQtyDropdown: []
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

	toggleShowQtyDropdown(ID) {
		const showQtyDropdown = this.state.showQtyDropdown;
		if (showQtyDropdown.includes(ID)) {
			const index = showQtyDropdown.indexOf(ID);
			showQtyDropdown.splice(index, 1);
		} else {
			showQtyDropdown.push(ID);
		}
		this.setState({ showQtyDropdown });
	}

	onChangeQty(name, value, item = {}) {
		item.quantity = parseInt(value);
		this.props.updateCartItem(item.unitID, item);
	}

	getQuantityOptions(item = {}) {
		const opts = {
			maxQuantity: 20,
			availableQty: 20,
			...item
		};

		const options = [];
		let max = opts.availableQty < opts.maxQuantity ? opts.availableQty : opts.maxQuantity;
		for (let i = 1; i <= max; i++) {
			options.push(
				{ primaryText: i, value: i }
			);
		}
		return options;
	}

	renderItemsInCart() {
		const {
			cartItems,
			primaryColor
		} = this.props;

		const {
			showQtyDropdown
		} = this.state;

		const items = [];

		if (!util.isEmpty(cartItems)) {
			const numCartItems = cartItems.length;
			Object.entries(cartItems).forEach(([key, value]) => {
				items.push(
					<div key={key} className='cartItemRow'>
						<div style={{ width: '70%' }} className='col'>
							<div className='itemName'>{value.name}</div>
							<div className='itemSubTitle'><strong>{value.articleTitle}</strong></div>
							<div className='itemSubTitle'>{value.orgName}</div>
							<div className='itemActions'>
									Quantity {
										!showQtyDropdown.includes(value.unitID)
										|| ( showQtyDropdown.includes(value.unitID) && !value.allowQtyChange)
										|| (showQtyDropdown.includes(value.unitID) && value.availableQty <= 0)
									?
										<span style={{ marginLeft: 7, display: 'inline-block' }}>{value.quantity}</span>
									:
										<></>
									}
									{ showQtyDropdown.includes(value.unitID) ?
										<span>
											{ value.allowQtyChange && value.availableQty > 0 ?
											<Dropdown
												portalID={`itemQty-dropdown-portal-${value.unitID}`}
												portal={true}
												className='dropdown-quantity'
												contentWidth={100}
												name='qunatity'
												color={primaryColor}
												onChange={(name, val) => this.onChangeQty(name, val, value)}
												options={this.getQuantityOptions(value)}
												selectLabel={0}
												defaultValue={value.quantity}
												value={value.quantity}
											/> : <></> }
											{ numCartItems > 1 ?
												<GBLink style={{ marginLeft: 10 }} allowCustom={true} customColor={primaryColor} onClick={() =>this.onChangeQty('quantity', 0, value)}>Delete</GBLink>
											: <></> }
										</span>
									:
										( numCartItems > 1) || ( value.allowQtyChange && value.availableQty > 0 ) ?
										<GBLink style={{ marginLeft: 10 }} onClick={() => this.toggleShowQtyDropdown(value.unitID)} customColor={primaryColor} allowCustom={true}>
											Change
										</GBLink> : <></>
									}
							</div>
						</div>
						<div style={{ width: '30%', verticalAlign: 'middle', paddingRight: 10, whiteSpace: 'nowrap' }} className='col right'>
							{util.money(value.amountFormatted)}
							{ value.interval ? <span style={{ display: 'block', fontSize: 12 }}>{types.renderRecurringName(value.articleKind, value.interval, value.paymentMax).text}</span> : <></> }
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
			open
		} = this.props;

		return (
			<div className='gbx3Cart'>
				<AnimateHeight height={open ? 'auto' : 0}>
					<div className='paymentFormHeaderTitle'>
						Your Cart
						<GBLink
							style={{ right: '60px' }}
							className='link closeCart'
							onClick={() => {
								this.props.updateInfo({ display: 'shop' });
							}}>
								Shop
							</GBLink>
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
	const cartItems = util.getValue(cart, 'items', []);
	const cartHasItems = !util.isEmpty(cartItems) ? true : false;
	const total = util.getValue(cart, 'total');
	const open = !cartHasItems ? false : util.getValue(cart, 'open');

	return {
		cart,
		cartItems,
		cartHasItems,
		total,
		open
	}
}

export default connect(mapStateToProps, {
	updateCartItem,
	updateCart,
	updateInfo,
	resetCart,
	toggleModal
})(Cart);
