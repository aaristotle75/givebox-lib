import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import Choice from '../../form/Choice';
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

    const {
      checkoutDonationAmount,
      checkoutDonationFormID,
      checkoutDonationArticleID,
      checkoutDonationFormTitle,
      checkoutAmountID,
      checkoutDonationImageURL
    } = this.props.form;

    const opts = {
      articleIDOverride: checkoutDonationArticleID,
      kindOverride: 'fundraiser',
      kindIDOverride: checkoutDonationFormID
    };

    const item = {
      customAmount: true,
      name: 'Donation at Checkout',
      unitID: checkoutAmountID,
      articleID: checkoutDonationArticleID,
      articleTitle: checkoutDonationFormTitle,
      articleImageURL: checkoutDonationImageURL,
      priceper: checkoutDonationAmount || 500,
      allowQtyChange: false,
      allowMultiItems: true,
      interval: 'once',
      frequency: 1,
      removedCallback: () => {
        this.setState({ checked: false })
      },
      changeAmount: true
    };
    const checked = this.state.checked ? false : true;
    if (checked) {
      item.quantity = 1;
    } else {
      item.quantity = 0;
    }

    this.props.updateCartItem(checkoutAmountID, item, opts, true);
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
          label={checkoutDonationText || 'Click here to add a donation at checkout'}
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
