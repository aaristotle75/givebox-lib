import React, {Component} from 'react';

const ENV = process.env.REACT_APP_ENV;

class ApplePay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canMakePayments: false
    };
  }

  componentDidMount() {
    if (window.ApplePaySession && ENV !== 'local') {
      var merchantIdentifier = 'merchant.com.givebox.gbx';
      var promise = window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
      promise.then(function (canMakePaymentsWithActiveCard) {
        if (canMakePaymentsWithActiveCard) {
          this.setState({ canMakePayments: true });
        }
      });
    }
  }

  render() {

    return (
      <div style={{ padding: '20px 0 0 0', margin: 0 }} className='input-group'>
        <div className='payMethods'>
          <img src='https://cdn.givebox.com/givebox/public/images/applepay.png' height='21' alt='Apple Pay' />
        </div>
        <div className='input-group'>
          {this.state.canMakePayments ?
            <div class="apple-pay-button apple-pay-button-white"></div>
            :
            <div style={{ fontSize: 14 }} className='error'>You have no paymethod in your Apple Wallet.</div>
          }
        </div>
      </div>
    )
  }
};

export default ApplePay;
