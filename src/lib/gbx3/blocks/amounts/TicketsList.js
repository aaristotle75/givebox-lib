import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import Image from '../../../common/Image';
import Dropdown from '../../../form/Dropdown';
import TextField from '../../../form/TextField';
import '../../../styles/gbx3amounts.scss';
import AnimateHeight from 'react-animate-height';
import {
  updateCartItem
} from '../../redux/gbx3actions';
import { toggleModal } from '../../../api/actions';
import has from 'has';

class TicketsList extends Component {

  constructor(props) {
    super(props);
    this.renderAmounts = this.renderAmounts.bind(this);
    this.onChangeQty = this.onChangeQty.bind(this);
    this.toggleShowDetails = this.toggleShowDetails.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.quantityOptions = this.quantityOptions.bind(this);
    this.state = {
      showDetails: []
    };
    this.amountInputRef = React.createRef();
  }

  componentDidMount() {
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
    const maxQuantity = util.getValue(article, 'maxQuantity', 99);
    const articleImageURL = util.getValue(article, 'imageURL');
    const hasMax = has(article, 'maxQuantity') ? true : false;
    const allowQtyChange = true;
    const allowMultiItems = true;

    const unitID = +selectedItem.ID;
    let name = util.getValue(selectedItem, 'name', this.getNameIfBlank(kind));
    if (kind === 'sweepstake') {
      if (!selectedItem.name) {
        const entries = +selectedItem.entries || 1;
        name = <span>{entries} {entries > 1 ? 'Entries' : 'Entry'} for {util.money(selectedItem.price/100)}</span>;
      }
    }

    const max = +util.getValue(selectedItem, 'max', 0);
    const sold =  +util.getValue(selectedItem, 'sold', 0);
    const customData = util.getValue(selectedItem, 'customData', {});
    const thumbnailURL = util.getValue(customData, 'thumbnailURL');
    const inStock = max - sold
    const availableQty = inStock < maxQuantity && hasMax ? inStock : maxQuantity;

    const item = {
      unitID,
      articleTitle,
      articleImageURL,
      name,
      hasMax,
      quantity,
      availableQty,
      maxQuantity,
      allowQtyChange,
      allowMultiItems,
      thumbnailURL,
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

  quantityOptions(max) {
    const options = [];
    for ( let i = 0; i <= max; i++) {
      const selectedText = i === 0 ? 0 : null;
      options.push({
        selectedText,
        primaryText: i === 0 ? 'None' : i,
        value: i
      });
    }

    return options;
  }

  renderAmounts() {
    const {
      article,
      amountsList,
      color,
      showInStock,
      kind,
      breakpoint
    } = this.props;

    const {
      showDetails
    } = this.state;

    const recurringIntervals = util.getValue(article, 'recurringIntervals');
    const recurringOptions = [];

    const recurringDefaultOptions = {
      once: { selectedText: 'One-Time', primaryText: 'Pay One-Time', value: 'once' },
      monthly: { selectedText: 'Monthly', primaryText: 'Auto-Pay Monthly', value: 'monthly' },
      quarterly: 	{ selectedText: 'Quarterly', primaryText: 'Auto-Pay Quarterly', value: 'quarterly' },
      annually: { selectedText: 'Yearly', primaryText: 'Auto-Pay Yearly', value: 'annually' }
    };

    if (!util.isEmpty(recurringIntervals)) {
      recurringIntervals.forEach((value) => {
        recurringOptions.push(recurringDefaultOptions[value]);
      });
    }

    const maxQuantity = util.getValue(article, 'maxQuantity', 99);
    const hasMax = has(article, 'maxQuantity') ? true : false;
    const cartItems = this.getCartItems();
    const items = [];
    const defaultOptions = this.quantityOptions(maxQuantity);

    if (!util.isEmpty(amountsList)) {
      Object.entries(amountsList).forEach(([key, value]) => {
        const price = util.money(value.price/100);
        const customData = util.getValue(value, 'customData', {});
        const thumbnailURL = util.getValue(customData, 'thumbnailURL');

        let name = value.name;
        let priceDesc = '';
        if (kind === 'sweepstake') {
          const entries = +value.entries || 1;
          if (!value.name) {
            name = <span>{entries} {entries > 1 ? 'Entries' : 'Entry'} for {price}</span>;
          }
          priceDesc = `per ${entries} ${entries > 1 ? 'Entries' : 'Entry'}`
        }
        const inStock = util.getValue(value, 'max', 0) - util.getValue(value, 'sold', 0);
        if (value.enabled && ( inStock > 0 || !hasMax || showInStock )) {
          const options = inStock < maxQuantity && hasMax ? this.quantityOptions(inStock) : defaultOptions;
          const selected = cartItems.find(x => x.unitID === value.ID);
          const qty = util.getValue(selected, 'quantity', 0);
          const recurringIntervalValue = util.getValue(selected, 'interval', util.getValue(article, 'recurringDefaultInterval', 'once'));

          items.push(
            <div key={key} className='ticketAmountRow'>
              <div className='ticketDescRow'>
                { thumbnailURL ?
                <div style={{ width: '10%' }} className='ticketDescThumb'>
                  <Image url={thumbnailURL} size={'thumb'} maxSize={60} title={name} />
                </div> : '' }
                <div style={{ width: thumbnailURL && breakpoint !== 'mobile' ? '75%' : '85%' }} className='ticketDesc'>
                  {name}
                  <span className='ticketDescAmount'>{price} {priceDesc}</span>
                  {showInStock ? <span className='ticketDescInStock'>{inStock ? `${inStock} Available` : `Sold Out`}</span> : <></> }
                  {value.description ? <GBLink allowCustom={true} customColor={color} className='link ticketShowDetailsLink' onClick={() => this.toggleShowDetails(value.ID)}>{showDetails.includes(value.ID) ? 'Hide Info' : 'More Info'}</GBLink> : <></>}
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
                    onChange={(name, val) => {
                      this.updateCart(value, +val, {
                        interval: !util.isEmpty(recurringIntervals) ? recurringIntervalValue : null,
                        paymentMax: '',
                        frequency: 1
                      });
                    }}
                    options={options}
                    selectLabel={0}
                    value={qty}
                  />
                  <AnimateHeight
                    duration={200}
                    height={!util.isEmpty(recurringIntervals) && qty ? 'auto' : 0}
                  >
                    <Dropdown
                      portalID={`amountRecurring-dropdown-portal-${value.ID}`}
                      portal={true}
                      portalClass={'gbx3 dropdown-portal'}
                      className='dropdown-recurring'
                      contentWidth={200}
                      name='recurringInterval'
                      defaultValue={recurringIntervalValue}
                      color={this.props.color}
                      onChange={(name, val) => {
                        this.updateCart(value, +qty, {
                          interval: val,
                          paymentMax: '',
                          frequency: 1
                        });
                      }}
                      options={recurringOptions}
                      value={recurringIntervalValue}
                    />
                  </AnimateHeight>
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
