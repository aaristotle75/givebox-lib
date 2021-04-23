import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import HelpfulTip from '../../../common/HelpfulTip';
import Loader from '../../../common/Loader';
import * as _v from '../../../form/formValidate';
import * as selectOptions from '../../../form/selectOptions';
import AnimateHeight from 'react-animate-height';
import {
  getBankAccount,
  updateMerchantApp
} from '../../redux/merchantActions';
import Moment from 'moment';

class BankAccount extends React.Component {

  constructor(props) {
    super(props);
    this.updateField = this.updateField.bind(this);
    this.getBankName = this.getBankName.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.getBankAccount({
      callback: () => {
        this.setState({ loading: false });
      }
    });
  }

  updateField(field, value) {
    this.props.updateMerchantApp('bankAccount', { [field]: value, hasBeenUpdated: true });
  }

  getBankName(name, value) {
    const bindthis = this;
    const currentRoutingNumber = util.getValue(this.props.bankAccount, 'routingNumber');
    const newRoutingNumber = value;
    const url = `https://www.routingnumbers.info/api/name.json?rn=${value}`;
    if (newRoutingNumber.length === 9 && (newRoutingNumber !== currentRoutingNumber)) {
      const x = new XMLHttpRequest();
      x.onload = function() {
        if (!util.isEmpty(this.response)) {
          const json = JSON.parse(this.response);
          bindthis.updateField('bankName', util.getValue(json, 'name'));
        }
      };
      x.open('GET', url);
      x.send();
    } else if (newRoutingNumber.length === 9 && (newRoutingNumber === currentRoutingNumber)) {
      this.updateField('bankName', currentRoutingNumber);
    } else {
      this.updateField('bankName', '');
    }
  }

  render() {

    const {
      group,
      bankAccount,
      orgBankAccounts
    } = this.props;

    const {
      name,
      number,
      last4,
      routingNumber,
      accountType,
      bankName,
      notes,
      status
    } = bankAccount;

    if (this.state.loading) return <Loader msg='Loading Bank Account...' />

    const readOnly = status === 'approved' ? true : false;

    return (
      <div className='fieldGroup'>
        {this.props.textField('name', {
          group,
          readOnly,
          fixedLabel: true,
          label: 'Name on Account',
          placeholder: 'Enter Name on Account',
          required: true,
          value: name,
          onBlur: (name, value) => {
            if (value) {
              this.updateField(name, value);
            }
          }
        })}
        {this.props.dropdown('accountType', {
          group,
          readOnly,
          required: true,
          dropdownClass: 'articleCardDropdown',
          fixedLabel: true,
          label: `Account Type`,
          selectLabel: `Select Account Type`,
          value: accountType,
          options: [
            { primaryText: 'Checking', value: 'checking' },
            { primaryText: 'Savings', value: 'savings' }
          ],
          direction: 'top',
          onChange: (name, value) => {
            this.updateField(name, value);
          }
        })}
        {this.props.textField('number', {
          group,
          readOnly,
          fixedLabel: true,
          label: 'Account Number',
          placeholder: last4 ? `********${last4}` : 'Enter Account Number',
          required: last4 ? false : true,
          meta: { last4 },
          maxLength: 32,
          onBlur: (name, value) => {
            if (value) {
              this.updateField(name, value);
            }
          }
        })}
        {bankName ? <span className='green date'>{bankName}</span> : null}
        {this.props.textField('routingNumber', {
          group,
          fixedLabel: true,
          label: 'Routing Number',
          placeholder: 'Enter Routing Number',
          required: true,
          value: routingNumber,
          maxLength: 9,
          onChange: this.getBankName,
          readOnly: false,
          onBlur: (name, value) => {
            if (value) {
              this.updateField(name, value);
            }
          }
        })}
      </div>
    )
  }
}

BankAccount.defaultProps = {
  group: 'addBank'
}

function mapStateToProps(state, props) {

  const bankAccount = util.getValue(state, 'merchantApp.bankAccount', {});

  return {
    bankAccount
  }
}

export default connect(mapStateToProps, {
  getBankAccount,
  updateMerchantApp
})(BankAccount);
