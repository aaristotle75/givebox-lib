import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import HelpfulTip from '../../../common/HelpfulTip';
import Loader from '../../../common/Loader';
import * as _v from '../../../form/formValidate';
import * as selectOptions from '../../../form/selectOptions';
import AnimateHeight from 'react-animate-height';
import {
  setMerchantApp
} from '../../redux/merchantActions';
import {
  getResource
} from '../../../api/helpers';
import Moment from 'moment';

class BankAccount extends React.Component {

  constructor(props) {
    super(props);
    this.getBankName = this.getBankName.bind(this);
    this.state = {
    };
    this.hasTriedToGetBankNameFromPlaidRoutingNumber = false;
  }

  async componentDidMount() {
    if (util.isEmpty(this.props.bankAccount)) {
      const initLoading = await this.props.setMerchantApp('bankLoading', true);
      if (initLoading) {
        this.props.getResource('orgBankAccounts', {
          reload: true,
          search: {
            sort: 'createdAt',
            order: 'desc'
          },
          callback: (res, err) => {
            this.props.setMerchantApp('bankLoading', false);
          }
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const routingNumber = util.getValue(this.props, 'bankAccountPlaid.routingNumber');

    if (routingNumber && !this.props.bankName && !this.hasTriedToGetBankNameFromPlaidRoutingNumber) {
      this.getBankName('routingNumber', routingNumber);
      this.hasTriedToGetBankNameFromPlaidRoutingNumber = true;
    }
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
          bindthis.props.fieldProp('bankName', { value: util.getValue(json, 'name')});
        }
      };
      x.open('GET', url);
      x.send();
    } else if (newRoutingNumber.length === 9 && (newRoutingNumber === currentRoutingNumber)) {
      this.props.fieldProp('bankName', { value: this.props.bankName });
    } else {
      this.props.fieldProp('bankName', { value: '' });
    }
  }

  render() {

    const {
      group,
      formState,
      bankAccount,
      bankAccountPlaid,
      loading
    } = this.props;

    if (loading) return <Loader msg='Loading Bank Account...' />

    const ID = util.getValue(bankAccount, 'ID');
    const kind = util.getValue(bankAccount, 'kind', 'deposit');
    const name = util.getValue(bankAccount, 'name', util.getValue(bankAccountPlaid, 'name'));
    const bankName = util.getValue(formState, 'fields.bankName.value', util.getValue(bankAccount, 'bankName'));
    const number = util.getValue(bankAccount, 'number', util.getValue(bankAccountPlaid, 'number'));
    const last4 = util.getValue(bankAccount, 'last4');
    const routingNumber = util.getValue(bankAccount, 'routingNumber', util.getValue(bankAccountPlaid, 'routingNumber'));
    const accountType = util.getValue(bankAccount, 'accountType', util.getValue(bankAccountPlaid, 'accountType'));
    const notes = util.getValue(bankAccount, 'notes');
    const status = util.getValue(bankAccount, 'status');
    const readOnly = status === 'approved' ? true : false;

    return (
      <div className='fieldGroup'>
        {this.props.textField('ID', {
          group,
          type: 'hidden',
          value: ID,
          required: false
        })}
        {this.props.textField('kind', {
          group,
          type: 'hidden',
          value: kind,
          required: false
        })}
        {this.props.textField('bankName', {
          group,
          type: 'hidden',
          value: bankName,
          required: false
        })}
        <div className='column50'>
          {this.props.textField('name', {
            group,
            readOnly,
            fixedLabel: true,
            label: 'Name on Bank Account',
            placeholder: 'Type the Name on Bank Account',
            required: true,
            value: name
          })}
        </div>
        <div className='column50'>
          {this.props.dropdown('accountType', {
            group,
            readOnly,
            required: true,
            dropdownClass: 'articleCardDropdown',
            fixedLabel: true,
            label: `Bank Account Type`,
            selectLabel: `Choose Bank Account Type`,
            value: accountType,
            defaultValue: 'checking',
            options: [
              { primaryText: 'Checking', value: 'checking' },
              { primaryText: 'Savings', value: 'savings' }
            ],
            direction: 'top'
          })}
        </div>
        <div className='column50'>
          {this.props.textField('number', {
            group,
            readOnly,
            fixedLabel: true,
            label: 'Bank Account Number',
            placeholder: last4 ? `********${last4}` : 'Type Bank Account Number',
            required: last4 ? false : true,
            meta: { last4 },
            maxLength: 32,
            value: !last4 && number ? number : ''
          })}
        </div>
        <div className='column50'>
          {bankName ? <span className='green date'>{bankName}</span> : null}
          {this.props.textField('routingNumber', {
            group,
            fixedLabel: true,
            label: 'Bank Routing Number',
            placeholder: 'Type Bank Routing Number',
            required: true,
            value: routingNumber,
            maxLength: 9,
            onChange: this.getBankName,
            readOnly: false
          })}
        </div>
      </div>
    )
  }
}

BankAccount.defaultProps = {
  group: 'addBank'
}

function mapStateToProps(state, props) {

  const orgBankAccounts = util.getValue(state, 'resource.orgBankAccounts', {});
  const orgBankAccountsData = util.getValue(orgBankAccounts, 'data');
  const bankAccount = util.getValue(orgBankAccountsData, 0, {});
  const bankName = util.getValue(bankAccount, 'bankName');
  const loading = util.getValue(state, 'merchantApp.bankLoading', false);
  const extractAuth = util.getValue(state, 'merchantApp.extractAuth', {});
  const bankAccountPlaid = util.getValue(extractAuth, 'bankAccount', {});

  return {
    bankAccount,
    bankName,
    loading,
    bankAccountPlaid
  }
}

export default connect(mapStateToProps, {
  getResource,
  setMerchantApp
})(BankAccount);
