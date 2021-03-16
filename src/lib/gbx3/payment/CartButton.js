import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Icon from '../../common/Icon';
import {
  updateInfo,
  updateCart
} from '../redux/gbx3actions';
import { FiShoppingCart } from 'react-icons/fi';
import Scroll from 'react-scroll';
import history from '../../common/history';

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;
const GBX_URL = process.env.REACT_APP_GBX_URL;

class CartButton extends React.Component {

  constructor(props) {
    super(props);
    this.gotoCart = this.gotoCart.bind(this);
    this.loadGBX = this.loadGBX.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.state = {
    };
  }

  scrollTo(name) {
    const scroller = Scroll.scroller;
    scroller.scrollTo(name, {
      duration: 500,
      delay: 0,
      smooth: true,
      containerId: 'gbx3Layout'
    });
  }

  async gotoCart() {
    const {
      cart,
      articleID,
      display,
      callback
    } = this.props;

    const cartItems = util.getValue(cart, 'items', []);
    const lastItemIndex = cartItems.length - 1;
    const latestItem = util.getValue(cartItems, lastItemIndex, {});
    const lastItemArticleID = util.getValue(latestItem, 'articleID', null);

    if ((lastItemArticleID && lastItemArticleID !== articleID) || display === 'org') {
      history.push(`${GBX_URL}/${lastItemArticleID}`);
      this.loadGBX(lastItemArticleID);
    } else {
      const cartUpdated = await this.props.updateCart({ open: true });
      if (cartUpdated) this.scrollTo('checkout');
    }
    if (callback) callback();
  }

  async loadGBX(ID) {
    const {
      originTemplate
    } = this.props;

    const infoUpdated = await this.props.updateInfo({ originTemplate, checkout: true });
    if (infoUpdated) {
      this.props.reloadGBX3(ID, async () => {
        this.props.updateCart({ open: true });
      });
    }
  }

  render() {

    const {
      stage,
      cart,
      type
    } = this.props;

    const cartItems = util.getValue(cart, 'items', []);

    console.log('execute -> ', stage, cartItems);
    if (stage === 'admin' || util.isEmpty(cartItems)) return null;

    switch (type) {
      case 'avatarLink': {
        return (
          <div onClick={() => this.gotoCart()} className='tooltip avatarLink gbx3CartButton'>
            <span className='tooltipTop'><i />Your Cart</span>
            <div className='editGraphic'>
              <div className='gbx3CartNumItems'>{cartItems.length}</div>
              <Icon><FiShoppingCart /></Icon>
            </div>
          </div>
        )
      }

      case 'avatarMenu': {
        return (
          <li onClick={() => this.gotoCart()}><Icon><FiShoppingCart /></Icon> <span className='text'>My Cart ({cartItems.length})</span></li>
        )
      }

      default: {
        return null;
      }

    }
  }
}

CartButton.defaultProps = {
  type: 'avatarLink'
}

function mapStateToProps(state, props) {

  const stage = util.getValue(state, 'gbx3.info.stage');
  const cart = util.getValue(state, 'gbx3.cart', {});
  const articleID = util.getValue(state, 'gbx3.info.articleID');
  const display = util.getValue(state, 'gbx3.info.display');

  return {
    stage,
    cart,
    articleID,
    display,
    originTemplate: util.getValue(state, 'gbx3.info.originTemplate', 'org')
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateCart
})(CartButton);
