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

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;

class CartButton extends React.Component {

  constructor(props) {
    super(props);
    this.gotoCart = this.gotoCart.bind(this);
    this.loadGBX = this.loadGBX.bind(this);
    this.state = {
    };
  }

  gotoCart() {
    const {
      cart
    } = this.props;

    const cartItems = util.getValue(cart, 'items', []);
    const latestItem = util.getValue(cartItems, 0, {});
    const lastItemArticleID = util.getValue(latestItem, 'articleID', null);
    if (lastItemArticleID) {
      this.loadGBX(lastItemArticleID);
    }
  }

  async loadGBX(ID) {
    const infoUpdated = await this.props.updateInfo({ originTemplate: 'org', checkout: true });
    if (infoUpdated) {
      this.props.reloadGBX3(ID, async () => {
        this.props.updateCart({ open: true });
      });
    }
  }

  render() {

    const {
      stage,
      cart
    } = this.props;

    const cartItems = util.getValue(cart, 'items', []);

    if (stage === 'admin' || util.isEmpty(cartItems)) return null;

    return (
      <div onClick={() => this.gotoCart()} className='avatarLink'>
        <div className='editGraphic'>
          <Icon><FiShoppingCart /></Icon>
        </div>
      </div>
    )
  }
}

CartButton.defaultProps = {
}

function mapStateToProps(state, props) {

  const stage = util.getValue(state, 'gbx3.info.stage');
  const cart = util.getValue(state, 'gbx3.cart', {});

  return {
    stage,
    cart
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateCart
})(CartButton);
