import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import HelpfulTip from '../../../common/HelpfulTip';
import * as _v from '../../../form/formValidate';
import * as selectOptions from '../../../form/selectOptions';
import AnimateHeight from 'react-animate-height';
import {
  getLegalEntity,
  updateMerchantApp
} from '../../redux/merchantActions';
import Moment from 'moment';

class LegalEntity extends React.Component {

  constructor(props) {
    super(props);
    this.updateField = this.updateField.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.getLegalEntity();
  }

  updateField(field, value) {
    this.props.updateMerchantApp('legalEntity', { [field]: value });
  }

  render() {

    const {
      group,
      legalEntity,
      address
    } = this.props;

    const {
      websiteURL,
      annualCreditCardSalesVolume,
      yearsInBusiness,
      contactPhone
    } = legalEntity;

    const {
      line1,
      line2,
      city,
      state,
      zip,
      country
    } = address;

    return (
      <div className='fieldGroup'>
        {this.props.textField('websiteURL', {
          group,
          fixedLabel: true,
          label: 'Website URL',
          placeholder: 'Enter Website or Social Media URL',
          alidate: 'url',
          maxLength: 128,
          value: websiteURL,
          required: true
        })}
        {this.props.textField('annualCreditCardSalesVolume', {
          group,
          fixedLabel: true,
          label: 'Estimated Annual Online Donations or Sales',
          placeholder: 'Click Here to Enter a Number',
          validate: 'money',
          validateOpts: {
            decimal: false,
            max: 99999999999
          },
          maxLength: 11,
          value: annualCreditCardSalesVolume,
          required: true
        })}
        {this.props.textField('yearsInBusiness', {
          group,
          placeholder: 'Click Here to Enter a Number',
          fixedLabel: true,
          label: 'Age of Nonprofit/Business (In Years, Round Up)',
          maxLength: 3,
          validate: 'number',
          validateOpts: {
            min: 1,
            max: 500
          },
          value: yearsInBusiness,
          required: true
        })}
        {this.props.textField('contactPhone', {
          group,
          placeholder: `Click Here to Add a Contact Phone Number`,
          fixedLabel: true,
          label: 'Contact Phone',
          validate: 'phone',
          required: true,
          value: contactPhone ? _v.formatPhone(contactPhone) : '',
          onBlur: (name, value) => {
            if (value) {
              this.updateField(name, util.prunePhone(value));
            }
          }
        })}
      </div>
    )
  }
}

LegalEntity.defaultProps = {
  group: 'legalEntity'
}

function mapStateToProps(state, props) {

  const legalEntity = util.getValue(state, 'merchantApp.legalEntity', {});
  const address = util.getValue(state, 'merchantApp.address', {});

  return {
    legalEntity,
    address
  }
}

export default connect(mapStateToProps, {
  getLegalEntity,
  updateMerchantApp
})(LegalEntity);
