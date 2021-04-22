import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import HelpfulTip from '../../../common/HelpfulTip';
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
    this.state = {
    };
  }

  componentDidMount() {
    this.props.getBankAccount();
  }

  updateField(field, value) {
    this.props.updateMerchantApp('address', { [field]: value });
  }

  render() {

    const {
      group,
      bankAccount
    } = this.props;

    const {
      number,
      routingNumber,
      accountType,
      bankName,
      notes
    } = bankAccount;

    return (
      <div className='fieldGroup'>
        Bank Account Fields
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
