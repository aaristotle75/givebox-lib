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
  }

  async componentDidMount() {
    if (util.isEmpty(this.props.bankAccount)) {
      const initLoading = await this.props.setMerchantApp('loading', true);
      if (initLoading) {
        this.props.getResource('orgBankAccounts', {
          reload: true,
          search: {
            sort: 'createdAt',
            order: 'desc'
          },
          callback: (res, err) => {
            this.props.setMerchantApp('loading', false);
          }
        });
      }
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
      loading
    } = this.props;

    if (loading) return <Loader msg='Loading Bank Account...' />

    const ID = util.getValue(bankAccount, 'ID');
    const kind = util.getValue(bankAccount, 'kind', 'deposit');
    const name = util.getValue(bankAccount, 'name');
    const bankName = util.getValue(formState, 'fields.bankName.value', util.getValue(bankAccount, 'bankName'));
    const number = util.getValue(bankAccount, 'number');
    const last4 = util.getValue(bankAccount, 'last4');
    const routingNumber = util.getValue(bankAccount, 'routingNumber');
    const accountType = util.getValue(bankAccount, 'accountType');
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
        {this.props.textField('name', {
          group,
          readOnly,
          fixedLabel: true,
          label: 'Name on Account',
          placeholder: 'Enter Name on Account',
          required: true,
          value: name
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
          defaultValue: 'checking',
          options: [
            { primaryText: 'Checking', value: 'checking' },
            { primaryText: 'Savings', value: 'savings' }
          ],
          direction: 'top'
        })}
        {this.props.textField('number', {
          group,
          readOnly,
          fixedLabel: true,
          label: 'Account Number',
          placeholder: last4 ? `********${last4}` : 'Enter Account Number',
          required: last4 ? false : true,
          meta: { last4 },
          maxLength: 32
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
          readOnly: false
        })}
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
  const loading = util.getValue(state, 'merchantApp.loading', false);

  return {
    bankAccount,
    bankName,
    loading
  }
}

export default connect(mapStateToProps, {
  getResource,
  setMerchantApp
})(BankAccount);
