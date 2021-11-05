import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import * as types from '../../common/types';
import Dropdown from '../../form/Dropdown';
import Choice from '../../form/Choice';
import ModalLink from '../../modal/ModalLink';
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
      showQtyDropdown: [],
      isPublic: this.props.isPublic
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
    const options = [];
    let max = availableQty < maxQuantity ? availableQty : maxQuantity;

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
      isPublic
    } = this.state;

    const items = [];

    if (!util.isEmpty(cartItems)) {
      Object.entries(cartItems).forEach(([key, value]) => {
        items.push(
          <div key={key} className='cartItemRow'>
            <div style={{ width: '10%', verticalAlign: 'middle', paddingRight: 10, whiteSpace: 'nowrap'  }} className='col'>
              <GBLink onClick={() => reloadGBX3(value.articleID)}>
                <Image url={value.thumbnailURL || value.articleImageURL} maxSize={50} size='small' minHeight={50} />
              </GBLink>
            </div>
            <div style={{ width: '60%' }} className='col'>
              <div className='itemName'>{value.name}</div>
              <div className='itemSubTitle'><strong>{value.articleTitle}</strong></div>
              <div className='itemSubTitle'>{value.orgName}</div>
              <div className='itemActions'>
                  {!value.allowQtyChange || value.availableQty <= 0 ?
                    <span style={{ marginRight: 38 }}>Quantity <span style={{ fontSize: 14, marginLeft: 7, display: 'inline-block' }}>{value.quantity}</span></span>
                  :
                    <>
                      Quantity
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
                      />
                    </>
                  }
                  <GBLink style={{ marginLeft: 10 }} allowCustom={true} customColor={primaryColor} onClick={() => this.onChangeQty('quantity', 0, value)}>Delete</GBLink>
              </div>
            </div>
            <div style={{ width: '30%', verticalAlign: 'middle', paddingRight: 10, whiteSpace: 'nowrap' }} className='col right'>
              {util.money(value.amountFormatted)}
              { value.interval ? <span style={{ display: 'block', fontSize: 12 }}>{types.renderRecurringName(value.articleKind, value.interval, value.paymentMax).text}</span> : <></> }
              { value.changeAmount ?
                <GBLink allowCustom={true} customColor={primaryColor} onClick={() => reloadGBX3(value.articleID)}>
                  Change Amount
                </GBLink>
              : '' }
              {/*
              <Choice
                label={`Allow Public to View ${util.toTitleCase(types.kind(value.articleKind).txType)}`}
                value={isPublic}
                checked={isPublic}
                onChange={() => {
                  const isPublic = this.state.isPublic ? false : true;
                  this.setState({ isPublic });
                }}
                color={primaryColor}
                errorType={'tooltip'}
                toggle={false}
              />
              */}
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
      cartTitle,
      shopTitle,
      shopLinkOpensOrgPage,
      shopLinkAsButton,
      browseItems,
      browsePage,
      primaryColor
    } = this.props;

    return (
        <AnimateHeight height={open ? 'auto' : 0}>
          <div className='gbx3Cart'>
            <div className='paymentFormHeaderTitle'>
              {cartTitle || 'Your Cart'}
              {browseItems ?
                <GBLink
                  style={{ right: '60px' }}
                  className={`${shopLinkAsButton ? 'button' : 'link'} closeCart`}
                  onClick={() => {
                    this.props.backToOrg(browsePage);
                  }}
                  allowCustom={true}
                  customColor={primaryColor}>
                  {shopTitle}
                </GBLink>
              : null}
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
  const info = util.getValue(gbx3, 'info', {});
  const stage = util.getValue(info, 'stage', {});
  const preview = util.getValue(info, 'preview', {});
  const cart = stage !== 'admin' && !preview ? util.getValue(gbx3, 'cart', {}) : {};
  const cartItems = util.getValue(cart, 'items', []);
  const cartHasItems = !util.isEmpty(cartItems) ? true : false;
  const total = util.getValue(cart, 'total');
  const open = !cartHasItems ? false : util.getValue(cart, 'open');
  const isPublic = util.getValue(gbx3, 'blocks.article.paymentForm.options.form.isPublic', true);

  return {
    cart,
    cartItems,
    cartHasItems,
    total,
    open,
    isPublic
  }
}

export default connect(mapStateToProps, {
  updateCartItem,
  updateCart,
  updateInfo,
  resetCart,
  toggleModal
})(Cart);
