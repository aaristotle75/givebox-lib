import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Cart from './Cart';
import Totals from './Totals';
import Choice from '../../form/Choice';
import Button from '../blocks/Button';
import CheckoutDonation from '../blocks/CheckoutDonation';
import { saveCart } from '../redux/gbx3actions';

class CartOrderConfirmation extends Component {

  constructor(props) {
    super(props);
    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.state = {
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cart.lastModified !== this.props.cart.lastModified && this.props.cart.items.length === 0) {
      this.props.toggleModal('cartOrderConfirmation', false);
    }
  }

  async onClickConfirm() {
    const cartSaved = await this.props.saveCart({ cartConfirmed: this.props.cart.items.length });
    if (cartSaved) {
      this.props.toggleModal('cartOrderConfirmation', false);
      this.props.saveButton();
    }
  }

  render() {

    const {
      form,
      button,
      acceptedTerms,
      primaryColor,
      checkoutDonation,
      checkoutDonationFormID,
      kind
    } = this.props;

    return (
      <div className='modalWrapper'>
        <div className='flexColumn flexCenter'>
          <div className='paymentFormHeaderTitle' style={{ marginBottom: 15 }}>Please Review the Items in Your Cart and Click Confirm Order to Pay</div>
          <div style={{ width: '100%'}}>
            <Cart
              {...this.props}
              forceHideShopMoreItems={true}
            />
          </div>
          <div className='formBottomSection' style={{ width: '100%'}}>
            <Totals
              {...this.props}
            />
            <div className='buttonSection'>
              <div style={{ marginBottom: 10 }}>
                { checkoutDonation && checkoutDonationFormID &&  kind !== 'fundraiser' ?
                <CheckoutDonation form={form} />
                : '' }
              </div>
              <div style={{ margin: '20px 0' }}>
                <Button
                  onClick={this.onClickConfirm}
                  button={button}
                  forceButtonTitle={'Confirm Order'}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <Choice
                  label='I Accept the Terms & Conditions'
                  value={acceptedTerms}
                  checked={acceptedTerms}
                  onChange={() => {
                    this.props.setCart('acceptedTerms', acceptedTerms ? false : true)
                  }}
                  labelClick={() => {
                    this.props.toggleModal('terms', true);
                  }}
                  color={primaryColor}
                  error={!acceptedTerms ? 'You Must Accept the Terms & Conditions to Continue' : false}
                  errorType={'tooltip'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  saveCart
})(CartOrderConfirmation);
