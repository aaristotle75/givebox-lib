import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Dropdown
} from '../../../';
import '../../../styles/gbx3amounts.scss';
import AnimateHeight from 'react-animate-height';
import {
	updateCartItem
} from '../../redux/gbx3actions';
import { toggleModal } from '../../../api/actions';

class TicketsList extends Component {

	constructor(props) {
		super(props);
		this.checkCart = this.checkCart.bind(this);
		this.renderAmounts = this.renderAmounts.bind(this);
		this.onChangeQty = this.onChangeQty.bind(this);
		this.toggleShowDetails = this.toggleShowDetails.bind(this);
		this.updateCart = this.updateCart.bind(this);
		this.getCartItems = this.getCartItems.bind(this);
		this.state = {
			showDetails: []
		};
		this.amountInputRef = React.createRef();
	}

	componentDidMount() {
		this.checkCart();
	}

	checkCart() {
		const {
			cartItems,
			article
		} = this.props;

		const {
			recurring
		} = this.state;
	}

	getNameIfBlank(kind) {
		switch (kind) {
			case 'membership': {
				return 'Membership Subscription';
			}
			case 'sweepstake': {
				return 'Sweepstakes Entry';
			}

			case 'event':
			default: {
				return 'Event Ticket';
			}
		}
	}

	updateCart(selectedItem, quantity, obj = {}) {
		const {
			kind,
			article
		} = this.props;

		const articleTitle = util.getValue(article, 'title');
		const maxQuantity = util.getValue(article, 'maxQuantity', 10);
		const articleImageURL = util.getValue(article, 'imageURL');
		const allowQtyChange = true;
		const allowMultiItems = true;

		const unitID = +selectedItem.ID;
		const name = util.getValue(selectedItem, 'name', this.getNameIfBlank(kind));
		const availableQty = allowQtyChange ? util.getValue(selectedItem, 'max', maxQuantity) - util.getValue(selectedItem, 'sold', 0) + quantity : quantity;

		const item = {
			unitID,
			articleTitle,
			articleImageURL,
			name,
			quantity,
			availableQty,
			maxQuantity,
			allowQtyChange,
			allowMultiItems,
			priceper: selectedItem.price,
			...obj
		};

		this.props.updateCartItem(unitID, item);
	}

	toggleShowDetails(id) {
		const showDetails = this.state.showDetails;
		const index = showDetails.findIndex((el) => {
			return el === id;
		});
		if (index === -1) showDetails.push(id);
		else showDetails.splice(index, 1);
		this.setState({ showDetails });
	}

	getCartItems() {
		const {
			cartItems,
			article
		} = this.props;

		const items = cartItems.filter(i => i.articleID === article.articleID);
		return items;
	}

	onChangeQty(name, value, ticket) {
		this.updateCart(ticket, +value);
	}

	renderAmounts() {
		const {
			amountsList,
			article
		} = this.props;

		const {
			showDetails
		} = this.state;

		const cartItems = this.getCartItems();
		const items = [];
		const options = [];
		for ( let i = 0; i < util.getValue(article, 'maxQuantity', 1); i++) {
			options.push({
				primaryText: i === 0 ? 'None' : i,
				value: i
			});
		}

		if (!util.isEmpty(amountsList)) {
			Object.entries(amountsList).forEach(([key, value]) => {
				if (value.enabled) {
					const selected = cartItems.find(x => x.unitID === value.ID);
					const qty = util.getValue(selected, 'quantity', 0);
					items.push(
						<div key={key} className='ticketAmountRow'>
							<div className='ticketDescRow'>
								<div className='ticketDesc'>
									{value.name}
									<span className='ticketDescAmount'>{util.money(value.price/100)}</span>
									{value.description ? <GBLink allowCustom={true} className='link ticketShowDetailsLink' onClick={() => this.toggleShowDetails(value.ID)}>{showDetails.includes(value.ID) ? 'Hide Info' : 'Show Info'}</GBLink> : <></>}
								</div>
								<div className='ticketQty'>
									<Dropdown
										portalID={`amountQty-dropdown-portal-${value.ID}`}
										portal={true}
										portalClass={'gbx3 dropdown-portal'}
										className='dropdown-quantity'
										contentWidth={100}
										name='unitQty'
										defaultValue={qty}
										color={this.props.color}
										onChange={(name, val) => this.onChangeQty(name, val, value)}
										options={options}
										selectLabel={0}
										value={qty}
									/>
								</div>
							</div>
							<AnimateHeight
								duration={200}
								height={showDetails.includes(value.ID) ? 'auto' : 0}
							>
								<div className='ticketDetails'>
									<div className='ticketDetailsContainer' dangerouslySetInnerHTML={{ __html: value.description }} />
								</div>
							</AnimateHeight>
						</div>
					);
				}
			});
		}

		return (
			<div className='ticketsList'>
				{items}
			</div>
		)
	}

	render() {

		const {
			embed,
			buttonEnabled
		} = this.props;

		const height = embed && !buttonEnabled ? `${this.props.height}px` : 'auto';

		return (
			<div className={`${embed ? 'embed' : ''}`}>
				<div style={{ height: height }} className='amountsSection'>
					{this.renderAmounts()}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const cart = util.getValue(gbx3, 'cart', []);
	const cartItems = util.getValue(cart, 'items', []);
	const numCartItems = cartItems.length;
	const info = util.getValue(gbx3, 'info', {});
	const noFocus = util.getValue(info, 'noFocus');
	const admin = util.getValue(gbx3, 'admin', {});
	const editable = util.getValue(admin, 'editable');

	return {
		noFocus,
		cart,
		cartItems,
		numCartItems,
		editable
	}
}

export default connect(mapStateToProps, {
	updateCartItem,
	toggleModal
})(TicketsList);
