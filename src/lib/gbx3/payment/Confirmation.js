import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import {
  updateCart,
  resetConfirmation
} from '../redux/gbx3actions';
import Social from '../blocks/Social';
import ReactGA from 'react-ga';

const ENV = process.env.REACT_APP_ENV;

class Confirmation extends Component {

  constructor(props) {
    super(props);
    this.renderPaymethodText = this.renderPaymethodText.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      cartTotal,
      orgName,
      orgID,
      preview,
      receipt
    } = this.props;

    localStorage.removeItem('cart');

    if (ENV === 'production' && !preview && !receipt) {
      ReactGA.modalview('/confirmation', ['orgTracker']);
      ReactGA.event({
        category: 'Purchase',
        action: 'Approved Transaction'
      });

      ReactGA.plugin.require('ecommerce');
      ReactGA.plugin.execute('ecommerce', 'addTransaction', {
        id: orgID,
        name: orgName,
        revenue: cartTotal
      });
    }
  }

  componentWillUnmount() {
    this.props.resetConfirmation();
  }

  renderPaymethodText() {
    const {
      paymethod,
      email,
      bankName,
      cardType,
      orgName,
      cartTotal
    } = this.props;

    const item = [];
    const descriptor = this.props.descriptor ? `GBX*${this.props.descriptor}` : util.makeDescriptor(orgName);
    const echeckDescriptor = util.makeDescriptor(orgName, '');

    item.push(
      <span key={'receiptEmailed'} className='group'>
        <span className='icon icon-check'></span>
        <span className='inlineText'>An email receipt has been sent to <strong>{email}</strong>.</span>
      </span>
    );
    switch (paymethod) {
      case 'echeck': {
        item.push(
          <span key={paymethod}>
            <span className='group'>
              <span className='icon icon-check'></span>
              <span className='inlineText'>Your <strong>{bankName}</strong> bank account has been charged in the amount of <strong>{util.money(cartTotal)}</strong>.</span>
            </span>
            <span className='group'>
              <span className='icon icon-check'></span>
              <span className='inlineText'>The charge will show in your bank statement with the description {echeckDescriptor}.</span>
            </span>
          </span>
        );
        break;
      }

      case 'creditcard':
      case 'applepay':
      default: {
        item.push(
          <span key={paymethod}>
            <span className='group'>
              <span className='icon icon-check'></span>
              <span className='inlineText'>Your <strong>{cardType}</strong> card has been charged in the amount of <strong>{util.money(cartTotal)}</strong>.</span>
            </span>
            <span className='group'>
              <span className='icon icon-check'></span>
              <span className='inlineText'>The charge will show up in your credit card or bank statement with the description <strong>{descriptor}</strong>.</span>
            </span>
          </span>
        );
        break;
      }
    }

    item.push(
      <span key={'thankyou'} className='group'>
        <span className='icon icon-check'></span>
        <span className='inlineText'>Thank you for your support!</span>
      </span>
    );

    return (
      <div className='successfulText'>
        {item}
      </div>
    )
  }

  render() {

    const {
      confirmationContent,
      confirmationLink,
      allowSharing,
      primaryColor,
      firstname
    } = this.props;

    return (
      <div className='modalWrapper confirmation'>
        <div className='successfulText'>
          <span className='titleText' style={{ color: primaryColor }}>
            <span className='icon icon-check-circle'></span>
            {firstname}, your transaction has been processed successfully!
          </span>
        </div>
        {this.renderPaymethodText()}
        { confirmationContent ?
          <div style={{ margin: '10px 0' }} dangerouslySetInnerHTML={{ __html: confirmationContent }} />
        :
          <div className='successfulText'>
            <div className='subText'>
              <span style={{ marginBottom: 20 }} className='line'>Have a Nonprofit or know someone who does?</span>
              <GBLink
                className='button'
                customColor={primaryColor}
                allowCustom={true}
                solidColor={true}
                onClick={() => window.open('https://www.givebox.com')}
              >
                Learn About Givebox
              </GBLink>
            </div>
          </div>
        }
        { allowSharing ?
          <Social
            subText={
              <div className='subText'>
                {firstname}, please help us grow our community by sharing below.
              </div>
            }
          />
        : <></> }        
      </div>
    )
  }
};

function mapStateToProps(state, props) {
  const gbx3 = util.getValue(state, 'gbx3', {});
  const confirmation = util.getValue(gbx3, 'confirmation', {});
  const blockType = 'article';
  const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
  const paymentFormBlock = util.getValue(blocks, 'paymentForm', {});
  const paymentFormOptions = util.getValue(paymentFormBlock, 'options', {});
  const form = util.getValue(paymentFormOptions, 'form', {});
  const confirmationContent = util.getValue(form, 'confirmationContent');
  const allowSharing = util.getValue(form, 'allowSharing');
  const firstname = util.getValue(confirmation, 'firstname');
  const email = util.getValue(confirmation, 'email');
  const bankName = util.getValue(confirmation, 'bankName');
  const cardType = util.getValue(confirmation, 'cardType');
  const paymethod = util.getValue(confirmation, 'paymethod');
  const cartTotal = util.getValue(confirmation, 'cartTotal', 0);
  const data = util.getValue(gbx3, 'data', {});
  const orgName = util.getValue(data, 'orgName');
  const orgID = util.getValue(data, 'orgID');
  const descriptor = util.getValue(data, 'orgBillingDescriptor');
  const preview = util.getValue(gbx3, 'info.preview');
  const receipt = util.getValue(gbx3, 'info.receipt', false);

  return {
    orgID,
    orgName,
    firstname,
    email,
    bankName,
    cardType,
    paymethod,
    cartTotal,
    descriptor,
    confirmationContent,
    allowSharing,
    preview,
    receipt
  }
}

export default connect(mapStateToProps, {
  updateCart,
  resetConfirmation
})(Confirmation);
