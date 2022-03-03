import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as selectOptions from '../../form/selectOptions';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import Tabs, { Tab } from '../../common/Tabs';
import ModalLink from '../../modal/ModalLink';
import ModalRoute from '../../modal/ModalRoute';
import Form from '../../form/Form';
import Moment from 'moment';
import Note from './Note';
import ApplePay from './ApplePay';
import Echeck from './Echeck';
import AnimateHeight from 'react-animate-height';
import { toggleModal } from '../../api/actions';
import {
  processTransaction,
  resetCart,
  updateConfirmation,
  updateInfo,
  updateCart,
  updateCartItem
} from '../redux/gbx3actions';

const ENV = process.env.REACT_APP_ENV;

class PaymentFormClass extends Component {

  constructor(props) {
    super(props);
    this.paymentOptions = this.paymentOptions.bind(this);
    this.fieldLayout = this.fieldLayout.bind(this);
    this.renderFields = this.renderFields.bind(this);
    this.customOnChange = this.customOnChange.bind(this);
    this.processForm = this.processForm.bind(this);
    this.processCallback = this.processCallback.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.sendEmailCallback = this.sendEmailCallback.bind(this);
    this.onCreditCardChange = this.onCreditCardChange.bind(this);
    this.onPaymethodTabBefore = this.onPaymethodTabBefore.bind(this);
    this.onPaymethodTabAfter = this.onPaymethodTabAfter.bind(this);
    this.setPaymethod = this.setPaymethod.bind(this);
    this.onCustomerChange = this.onCustomerChange.bind(this);
    this.state = {
      processingPayment: false,
      showMessage: false,
      sendEmail: {
        recipients: '',
        message: util.getValue(this.props.sendEmail, 'defaultMsg', '')
      },
      isPublic: this.props.isPublic,
      applepay: false,
      paymethod: 'creditcard',
      amountError: false
    }
  }

  componentDidMount() {
    if (window.ApplePaySession && ENV !== 'local') {
      this.setState({ applepay: false });
    }
    this.setPaymethod(this.state.paymethod);
  }

  componentDidUpdate(prevProps) {
    const itemsChange = prevProps.cartItems.length !== this.props.cartItems.length ? true : false;
    const amountChange = prevProps.amount !== this.props.amount ? true : false;
    if (itemsChange || amountChange) {
      if (this.props.formState.error) this.props.formProp({ error: false });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  formSavedCallback() {
    this.props.toggleModal('paymentConfirmation', true, { closeCallback: async () => {
      const cartReset = await this.props.resetCart();
      if (cartReset) {
        this.props.backToOrg(null, true);
      }
    }});
  }

  processCallback(res, err) {
    const errorMsg = 'Sorry, credit card was declined. Please make sure the information you entered is correct or try another card.'
    if (!err) {
      this.formSavedCallback();
    } else {
      this.props.formProp({error: true, errorMsg });
      /*
      if (util.getValue(err, 'data.code') === 'no_authorization' && util.getValue(err, 'data.message') === 'declined') {
        //console.log('execute no_authorization and declined');
      } else {
        if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
      }
      */
    }
  }

  async processForm(fields) {

    const {
      isDebit,
      cardType,
      paymethod,
      cartTotal,
      cartConfirmed,
      cartItems: items,
      amount,
      zeroAmountAllowed,
      emailBlastToken,
      emailBlastEmail,
      sourceLocation
    } = this.props;

    const {
      sendEmail
    } = this.state;

    const data = {
      items: [],
      paymethod: {},
      emailBlastToken,
      emailBlastEmail
    };

    let error = false;
    let cartError = false;

    if ( util.isEmpty(items) || ( !zeroAmountAllowed && (!amount || parseInt(amount) === 0) ) ) {
      this.props.formProp({ error: true, errorMsg: <span>The amount to process cannot be {util.money(0)}. Please select an amount.</span> });
    } else {

      // Get notes and sendemail
      const noteValue = util.getValue(fields.note, 'value');
      const message = util.getValue(sendEmail, 'message');
      const emails = !util.isEmpty(sendEmail.recipients) ? sendEmail.recipients.split(/,/) : [];

      const note = noteValue || message || !util.isEmpty(emails) ? {
        message,
        emails,
        value: noteValue
      } : null;

      // Get the last item and add the note
      const [lastItem] = items.slice(-1);

      Object.entries(items).forEach(([key, value]) => {
        if (value.error) cartError = true;        
        /*
        if (util.getValue(value, 'maxDonationEnabled')) {
          const maxDonationAmount = util.getValue(value, 'maxDonationAmount', 0);
          if (value.amount > maxDonationAmount) {
            cartError = true;
            const errorMsg = `exceeds the max donation amount of $${util.numberWithCommas((maxDonationAmount/100).toFixed(2))}.`;
            this.props.updateCartItem(value.unitID, {
              ...value,
              errorMsg,
              error: true
            });
          }
        }
        */

        data.items.push({
          unitID: value.unitID,
          articleID: value.articleID,
          articleKind: value.articleKind,
          sourceType: 'embed',
          sourceLocation,
          amount: value.amount,
          customAmount: value.customAmount,
          quantity: value.quantity,
          passFees: value.passFees,
          interval: value.interval || null,
          frequency: value.frequency || null,
          paymentMax: parseInt(value.paymentMax) || null,
          note: ( lastItem.unitID === value.unitID ) && note ? note : null,
          isPublic: value.isPublic
        });
      });

      if (cartError) {
        this.props.formProp({ error: true, errorMsg: 'Please fix an error in your cart.' });
      }

      const nameField = util.getValue(fields, 'name');
      const name = util.splitName(util.getValue(nameField, 'value'));
      const firstname = name.first;
      const lastname = name.last;
      const fullName = `${firstname} ${lastname}`;
      const email = util.getValue(fields.email, 'value', null);

      data.customer = {
        firstname,
        lastname: lastname || null,
        email,
        occupation: util.getValue(fields.occupation, 'value', null),
        employer: util.getValue(fields.employer, 'value', null),
        phone: util.getValue(fields.phone, 'value', null),
        address: {
          line1: util.getValue(fields.line1, 'value', null),
          city: util.getValue(fields.city, 'value', null),
          state: util.getValue(fields.state, 'value', null),
          zip: util.getValue(fields.zip, 'value', null)
        }
      }

      switch (paymethod) {
        case 'echeck':
        case 'creditcard': {
          const ccexpire = util.getSplitStr(util.getValue(fields.ccexpire, 'value'), '/', 2, -1);
          const type = cardType ? cardType.toUpperCase() : null;
          const cvv = util.getValue(fields.cvv, 'value', null);
          const cvvValidDigits = cardType === 'amex' ? 4 : 3;
          if (cvv.length < cvvValidDigits) {
            this.props.formProp({ error: true, errorMsg: 'CVV is invalid.' });
            this.props.fieldProp('cvv', { error: `CVV must be ${cvvValidDigits} digits` });
            error = true;
          }
          const binData = util.getValue(fields.ccnumber, 'binData', {});
          const number = util.getValue(fields.ccnumber, 'apiValue', null);
          const expMonth = parseInt(ccexpire[0]);
          const expYear = parseInt(`${Moment().format('YYYY').slice(0, 2)}${ccexpire[1]}`);

          data.paymethod.card = {
            cvv,
            type,
            binData,
            number,
            expMonth,
            expYear,
            isDebit: paymethod === 'echeck' ? isDebit : false,
            name: fullName
          };
          break;
        }

        /*
        case 'echeck': {
          data.paymethod.echeck = {
            number: util.getValue(fields.accountNumber, 'value', null),
            name: fullName,
            bankName: util.getValue(fields.bankName, 'value', null),
            type: 'checking',
            routingNumber: util.getValue(fields.routingNumber, 'value', null),
            zip: util.getValue(fields.zip, 'value', null)
          }
          break;
        }
        */

        case 'applepay': {
          break;
        }

        default: {
          console.error('no paymethod specified');
        }
      }

      let proceedToProcess = false;

      if (items.length > 1 && ( cartConfirmed !== items.length) )  {
        this.props.toggleModal('cartOrderConfirmation', true);
      } else {
        proceedToProcess = true;
      }

      if (!error && proceedToProcess && !cartError) {
        const confirmationUpdated = await this.props.updateConfirmation({
          email,
          firstname,
          lastname,
          paymethod,
          cartTotal,
          bankName: util.getValue(fields.bankName, 'value', null),
          cardType: cardType ? cardType.toUpperCase() : null
        });
        if (confirmationUpdated) this.props.processTransaction(data, this.processCallback);
      }
    }
  }

  onCreditCardChange(name, value, cardType, field, fields, isDebit) {
    const realCardValue = util.getValue(field, 'apiValue');
    const cardLength = realCardValue.length;
    if (this.props.isDebit !== isDebit) this.props.updateCart({ isDebit, cardLength });
    if (this.props.cardType !== cardType) this.props.updateCart({ cardType, cardLength });
  }

  onPaymethodTabBefore(key) {
    this.setPaymethod(key);
    return true;
  }

  onPaymethodTabAfter(key) {
  }

  setPaymethod(paymethod) {

    switch (paymethod) {
      /*
      case 'echeck': {
        this.props.fieldProp('accountNumber', { required: true });
        this.props.fieldProp('routingNumber', { required: true });
        this.props.fieldProp('ccnumber', { required: false, error: false });
        this.props.fieldProp('ccexpire', { required: false, error: false });
        this.props.fieldProp('cvv', { required: false, error: false });
        break;
      }
      */

      case 'applepay': {
        this.props.fieldProp('accountNumber', { required: false, error: false });
        this.props.fieldProp('routingNumber', { required: false, error: false });
        this.props.fieldProp('ccnumber', { required: false, error: false });
        this.props.fieldProp('ccexpire', { required: false, error: false });
        this.props.fieldProp('cvv', { required: false, error: false });
        break;
      }

      case 'echeck':
      case 'creditcard': {
        this.props.fieldProp('ccnumber', { required: true });
        this.props.fieldProp('ccexpire', { required: true });
        this.props.fieldProp('cvv', { required: true });
        this.props.fieldProp('accountNumber', { required: false, error: false });
        this.props.fieldProp('routingNumber', { required: false, error: false });
        break;
      }

      // no default
    }
    this.setState({ paymethod });
    if (this.props.paymethod !== paymethod) this.props.updateCart({ paymethod, cardType: 'default', cardLength: 0 });
  }

  customOnChange(name, value) {
    console.log('customOnChange', name, value);
    //this.props.fieldProp(name, { value });
  }

  onCustomerChange(name, value) {
    const {
      formState
    } = this.props;

    const fields = util.getValue(formState, 'fields', {});
    const nameValue = util.getValue(fields, 'name.value');
    const emailValue = util.getValue(fields, 'email.value');
    const zipValue = util.getValue(fields, 'zip.value');
    const ccexpireValue = util.getValue(fields, 'ccexpire.value');
    const ccnumberValue = util.getValue(fields, 'ccnumber.value');
    const cvvValue = util.getValue(fields, 'cvv.value');
    const customer = { ...this.props.cartCustomer, [name]: value };

    if (nameValue && emailValue && ccexpireValue && ccnumberValue && cvvValue) {
      this.setState({ showMessage: true });
    }

    if (value) this.props.updateCart({ customer });
  }

  sendEmailCallback(opts = {}) {
    const {
      recipients,
      message
    } = opts;

    this.setState({
      sendEmail: {
        recipients,
        message
      }
    });
  }

  paymentOptions() {

    const {
      primaryColor,
      breakpoint,
      org
    } = this.props;

    const {
      paymethod
    } = this.state;

    const instantFundraising = util.getValue(org, 'instantFundraising');
    const underwritingStatus = util.getValue(org, 'underwritingStatus');
    //const echeck = !util.isEmpty(instantFundraising) && underwritingStatus !== 'approved' ? false : this.props.echeck;
    const echeck = this.props.echeck;

    const creditCard = this.props.creditCardGroup({
      group: 'paymethod',
      ccnumberLabel: 'Credit Card Number',
      required: true,
      placeholder: 'xxxx xxxx xxxx xxxx',
      debug: false,
      cvvModalRootClass: 'gbxModal',
      onChange: this.onCreditCardChange
    });

    const debitCard = this.props.creditCardGroup({
      group: 'paymethod',
      ccnumberLabel: 'Debit Card Number',
      required: true,
      placeholder: 'xxxx xxxx xxxx xxxx',
      debug: false,
      cvvModalRootClass: 'gbxModal',
      onChange: this.onCreditCardChange,
      paybyDebitCard: true
    });

    let showCreditCardTabLabel = false;
    if (echeck || this.state.applepay) showCreditCardTabLabel = true;

    const tabs = [];
    const mobile = breakpoint === 'mobile' ? true : false;

    tabs.push(
      <Tab key={'creditcard'} id={'creditcard'} label={showCreditCardTabLabel ? <span className='tabLabel'>{mobile ? 'Credit Card' : 'Pay by Credit Card'}</span> : ''}>
        {paymethod === 'creditcard' ? creditCard : null}
      </Tab>
    );


    if (echeck) {
      tabs.push(
        <Tab key={'echeck'} id={'echeck'} label={<span className='tabLabel'>{mobile ? 'Direct Debit' : 'Pay by Direct Debit'}</span>}>
          {paymethod === 'echeck' ? debitCard : null}
        </Tab>
      );
    }
    /*
    if (echeck) {
      tabs.push(
        <Tab key={'echeck'} id={'echeck'} label={<span className='tabLabel'>{mobile ? 'eCheck' : 'Pay by eCheck'}</span>}>
          <Echeck primaryColor={primaryColor} textField={this.props.textField} fieldProp={this.props.fieldProp} />
        </Tab>
      );
    }
    */

    if (this.state.applepay) {
      tabs.push(
        <Tab key={'applepay'} id={'applepay'} label={<span className='tabLabel'>{mobile ? 'Apple Pay' : 'Pay using Apple Pay'}</span>}>
          <ApplePay />
        </Tab>
      );
    }

    return (
      <Tabs
        default={this.state.paymethod}
        className={`paymentFormTabs ${showCreditCardTabLabel ? '' : 'hideTabLabel'}`}
        allowCustom={true}
        customColor={primaryColor}
        borderSize={'1px'}
        callbackBefore={this.onPaymethodTabBefore}
        callbackAfter={this.onPaymethodTabAfter}
      >
        {tabs}
      </Tabs>
    )

  }

  fieldLayout() {
    const {
      phone,
      address,
      work,
      custom,
      sendEmail,
      breakpoint
    } = this.props;

    const mobile = breakpoint === 'mobile' ? true : false;
    const layout = [];

    // Phone enabled
    if (!address.enabled & phone.enabled) {
      layout.push(
        { width: '50%', field: 'name', order: mobile ? 2 : 1 },
        { width: '50%', field: 'payment', order: mobile ? 1 : 2 },
        { width: '50%', field: 'email' },
        { width: '25%', field: 'phone' },
        { width: '25%', field: 'zip' }
      );

    // Address enabled
  } else if (address.enabled & !phone.enabled) {
      layout.push(
        { width: '25%', field: 'name', order: mobile ? 2 : 1 },
        { width: '25%', field: 'email', order: mobile ? 2 : 1 },
        { width: '50%', field: 'payment', order: mobile ? 1 : 2 },
        { width: '50%', field: 'address' },
        { width: '20%', field: 'city' },
        { width: '20%', field: 'state' },
        { width: '10%', field: 'zip' }
      );

    // Address and Phone enabled
  } else if (address.enabled && phone.enabled) {
      layout.push(
        { width: '50%', field: 'name', order: mobile ? 2 : 1 },
        { width: '50%', field: 'payment', order: mobile ? 1 : 2 },
        { width: '50%', field: 'email' },
        { width: '50%', field: 'phone' },
        { width: '50%', field: 'address' },
        { width: '20%', field: 'city' },
        { width: '20%', field: 'state' },
        { width: '10%', field: 'zip' }
      );

    // Basic
    } else {
      layout.push(
        { width: '50%', field: 'name', order: mobile ? 2 : 1 },
        { width: '50%', field: 'payment', order: mobile ? 1 : 2 },
        { width: '50%', field: 'email' },
        { width: '50%', field: 'zip' }
      );
    }

    if (work.enabled) {
      layout.push(
        { width: '50%', field: 'employer' },
        { width: '50%', field: 'occupation' }
      );
    }

    if (custom.enabled) {
      layout.push(
        { width: '100%', field: 'custom' }
      );
    }

    if (sendEmail.enabled) {
      layout.push(
        { width: '100%', field: 'sendEmail' }
      );
    }

    return layout;
  }

  renderFields() {

    const {
      kind,
      phone,
      address,
      work,
      custom,
      sendEmail,
      primaryColor,
      breakpoint,
      openCart,
      numCartItems,
      cartCustomer
    } = this.props;

    const mobile = breakpoint === 'mobile' ? true : false;

    const headerText =
      <div className='paymentFormHeader'>
        <span className='paymentFormHeaderTitle'>Payment Info</span>
        <div className='paymentFormHeaderText'>
          <AnimateHeight height={numCartItems < 1  ? 0 : 'auto'}>
            <GBLink
              allowCustom={true}
              customColor={primaryColor}
              onClick={() => {
              const open = openCart ? false : true;
              this.props.updateCart({ open });
            }}>
              {openCart ? 'Hide' : 'View'} the items in your cart.
            </GBLink>
          </AnimateHeight>
          <span style={{ display: 'block' }}>Please enter your payment information.</span>
        </div>
      </div>
    ;
    const fields = {};

    fields.payment =
      <div className='column'>
        {mobile ? headerText : ''}
        {this.paymentOptions()}
      </div>
    ;
    fields.name =
      <div className='column'>
        {mobile ? '' : headerText}
        {this.props.textField('name', { placeholder: 'Your Name', fixedLabel: true, label: 'Name', required: true, onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'name') })}
      </div>
    ;
    fields.email = this.props.textField('email', { group: 'customer', required: true, placeholder: 'Your Email Address', label: 'Email', fixedLabel: true, validate: 'email', inputMode: 'email', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'email') });

    fields.phone = this.props.textField('phone', { group: 'customer', required: phone.required, label: 'Phone', fixedLabel: true, placeholder: 'Phone Number', validate: 'phone', inputMode: 'tel', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'phone') });

    fields.address = this.props.textField('line1', { group: 'address', required: address.required, label: 'Address', fixedLabel: true, placeholder: 'Street Address', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'line1') });

    fields.city = this.props.textField('city', { group: 'address', required: address.required, label: 'City', fixedLabel: true, placeholder: 'City', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'city') });

    fields.state = this.props.dropdown('state', {
      group: 'address',
      label: 'State',
      fixedLabel: true,
      selectLabel: 'State',
      options: selectOptions.states,
      required: address.required,
      onBlur: this.onCustomerChange,
      value: util.getValue(cartCustomer, 'state'),
      onChange: (name, value, field, fields) => {
        if (value === 'NON_USA') {
          this.props.fieldProp('zip', { value: '00000', readOnly: true, readOnlyText: 'Outside USA: ZIP cannot be edited.' });
        } else {
          const zipValue = util.getValue(fields, 'zip.value');
          this.props.fieldProp('zip', { readOnly: false, value: zipValue === '00000' ? '' : zipValue || null });
        }
      },
    });

    fields.zip = this.props.textField('zip', {
      group: 'address',
      required: true,
      label: 'Zip Code',
      fixedLabel: true,
      placeholder: 'Zip Code',
      maxLength: 5,
      inputMode: 'numeric',
      onBlur: this.onCustomerChange,
      value: util.getValue(cartCustomer, 'zip'),
      tooltipTopStyle: {
        minWidth: 100
      }
    });

    fields.employer = this.props.textField('employer', { group: 'customer', required: work.required, label: 'Employer', fixedLabel: true, placeholder: 'Employer', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'employer') });

    fields.occupation = this.props.textField('occupation', { group: 'customer', required: work.required, label: 'Occupation', fixedLabel: true, placeholder: 'Occupation', onBlur: this.onCustomerChange, value: util.getValue(cartCustomer, 'occupation') });

    fields.custom = this.props.textField('note', { required: custom.required, label: custom.placeholder, fixedLabel: false, hideLabel: true, placeholder: custom.placeholder });


    const linkText = sendEmail.linkText || 'Share via Email';

    if (kind === 'fundraiser' && 1===2) {
      fields.sendEmail =
        <Note
          showMessage={this.state.showMessage}
          primaryColor={primaryColor}
          sendEmailCallback={this.sendEmailCallback}
          sendEmail={this.state.sendEmail}
          allowEmail={sendEmail.allowEmail}
          linkText={sendEmail.linkText}
          messageText={sendEmail.messageText}
        />
      ;
    }

    const items = [];
    const fieldLayout = util.sortByField(this.fieldLayout(), 'order', 'ASC');

    Object.entries(fieldLayout).forEach(([key, value]) => {
      items.push(
        <div
          key={key}
          className='column'
          style={{ width: this.props.breakpoint === 'mobile' ? '100%' : util.getValue(value, 'width', '50%') }}
        >
          {util.getValue(fields, value.field)}
        </div>
      );
    });

    return items;
  }

  render() {

    const {
      processingPayment
    } = this.state;

    return (
      <div>
        { processingPayment ? <Loader msg='Please wait while transaction is processed...' forceText={true} /> : <></> }
        {this.renderFields()}
        {this.props.saveButton(this.processForm, { style: { margin: 0, padding: 0, height: 0, width: 0, visibility: 'hidden' } })}
      </div>
    )
  }
}

class PaymentForm extends Component {

  constructor(props){
    super(props);
    this.formStateCallback = this.formStateCallback.bind(this);
    this.state = {
      formState: {}
    }
    this.formRef = React.createRef();
  }

  formStateCallback(formState) {
    this.setState({ formState });
  }

  render() {

    const {
      formState
    } = this.state;

    const {
      breakpoint,
      primaryColor
    } = this.props;

    return (
      <div ref={this.formRef} className='givebox-paymentform'>
        {/*
        <div className='offline'>
          <div className='offlineText'>
            <span className='icon icon-alert-circle'></span>
            We are experiencing a major network outage with Amazon, Digital Ocean and other Service providers, and are unable to route the payment requests.<br /><br />
            Please check back in 1-2 hours. We appreciate your patience!
          </div>
        </div>
        */}
        <AnimateHeight
          height={util.getValue(formState, 'error', false) ? 'auto' : 0}
        >
          <div className='mainError error'>{util.getValue(formState, 'errorMsg', 'Please fix field errors in red below')}</div>
        </AnimateHeight>
        <Form
          id='gbxForm'
          className='clean'
          name={'gbxForm'}
          errorMsg={false}
          successMsg={false}
          formPropCallback={this.formStateCallback}
          neverSubmitOnEnter={true}
          primaryColor={primaryColor}
        >
          <PaymentFormClass
            {...this.props}
            breakpoint={breakpoint}
          />
        </Form>
      </div>
    )
  }
}

PaymentForm.defaultProps = {
  breakpointSize: 700,
  phone: {
    enabled: false,
    required: false
  },
  address: {
    enabled: false,
    required: false
  },
  work: {
    enabled: false,
    required: false
  },
  custom: {
    enabled: false,
    required: false,
    placeholder: 'Custom placeholder'
  },
  sendEmail: {
    enabled: true,
    allowEmail: false,
    linkText: 'Email Your Message',
    messageText: 'Add a Message',
    defaultMsg: ''
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const stage = util.getValue(info, 'stage', {});
  const preview = util.getValue(info, 'preview', {});
  const sourceLocation = util.getValue(info, 'sourceLocation');
  const sourceType = util.getValue(info, 'sourceType');
  const emailBlastToken = util.getValue(info, 'ebToken', null);
  const emailBlastEmail = util.getValue(info, 'ebEmail', null);
  const cart = stage !== 'admin' && !preview ? util.getValue(gbx3, 'cart', {}) : {};
  const cartTotal = util.getValue(cart, 'total', 0);
  const zeroAmountAllowed = util.getValue(cart, 'zeroAmountAllowed', false);
  const cartCustomer = util.getValue(cart, 'customer', {});
  const cartConfirmed = util.getValue(cart, 'cartConfirmed', false);
  const cartItems = util.getValue(cart, 'items', []);
  const numCartItems = cartItems.length;
  const openCart = util.getValue(cart, 'open');
  const paymethod = util.getValue(cart, 'paymethod');
  const cardType = util.getValue(cart, 'cardType');
  const isDebit = util.getValue(cart, 'isDebit');
  const amount = util.getValue(cart, 'subTotal', 0);
  const org = util.getValue(state, 'resource.gbx3Org.data', {});

  return {
    sourceLocation,
    sourceType,
    emailBlastToken,
    emailBlastEmail,
    zeroAmountAllowed,
    cartCustomer,
    cartConfirmed,
    cartItems,
    numCartItems,
    cartTotal,
    openCart,
    paymethod,
    cardType,
    isDebit,
    amount,
    org
  }
}

export default connect(mapStateToProps, {
  updateCart,
  toggleModal,
  processTransaction,
  resetCart,
  updateConfirmation,
  updateInfo,
  updateCartItem
})(PaymentForm)
