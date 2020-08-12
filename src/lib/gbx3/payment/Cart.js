import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Dropdown,
	types,
	Image
} from '../../';
import AnimateHeight from 'react-animate-height';
import {
	updateCart,
	updateCartItem,
	updateInfo,
	resetCart
} from '../redux/gbx3actions';
import { toggleModal } from '../../api/actions';

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
		const availableQty = +util.getValue(item, 'availableQty', 1);
		const maxQuantity = +util.getValue(item, 'maxQuantity', 99);
		const hasMax = util.getValue(item, 'hasMax');
		const options = [];
		let max = availableQty < maxQuantity && hasMax ? availableQty : maxQuantity;

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
			primaryColor,
			reloadGBX3
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
						<div style={{ width: '10%', verticalAlign: 'middle', paddingRight: 10, whiteSpace: 'nowrap'  }} className='col'>
							<GBLink onClick={() => reloadGBX3(value.articleID)}><Image url={value.articleImageURL} maxSize={50} size='small' minHeight={50} /></GBLink>
						</div>
						<div style={{ width: '60%' }} className='col'>
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
												portalClass={'gbx3 dropdown-portal'}
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
			open,
			showCart,
			cartTitle,
			shopTitle
		} = this.props;

		return (
				<AnimateHeight height={open ? 'auto' : 0}>
					<div className='gbx3Cart'>
						<div className='paymentFormHeaderTitle'>
							{cartTitle || 'Your Cart'}
							{showCart ?
							<GBLink
								style={{ right: '60px' }}
								className='link closeCart'
								onClick={() => {
									this.props.updateInfo({ display: 'shop' });
								}}>
									{shopTitle || 'Shop More Items'}
								</GBLink> : <></>}
							<GBLink className='link closeCart' onClick={() => this.props.updateCart({ open: false })}><span className='icon icon-x'></span></GBLink>
						</div>
						{this.renderItemsInCart()}
					</div>
				</AnimateHeight>
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
