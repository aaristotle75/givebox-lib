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
  getResource,
  sendResource
} from '../../../api/helpers';
import Moment from 'moment';

class LegalEntity extends React.Component {

  constructor(props) {
    super(props);
    this.onBlurWebsiteURL = this.onBlurWebsiteURL.bind(this);
    this.state = {
    };
  }

  onBlurWebsiteURL(name, value) {
    const {
      websiteURL
    } = this.props;

    if (_v.validateWebsiteURL(value)) {
      this.props.sendResource('org', {
        method: 'patch',
        data: {
          websiteURL: value
        },
        resourcesToLoad: ['gbx3Org'],
        isSending: false
      });
    } else {
      this.props.fieldProp('websiteURL', { error: _v.msgs.url });
    }
  }

  render() {

    const {
      group,
      legalEntity,
      websiteURL,
      loading
    } = this.props;

    if (loading) return <Loader msg='Loading Legal Entity...' />

    const ID = util.getValue(legalEntity, 'ID');
    const annualCreditCardSalesVolume = util.getValue(legalEntity, 'annualCreditCardSalesVolume');
    const yearsInBusiness = util.getValue(legalEntity, 'yearsInBusiness');
    const contactPhone = util.getValue(legalEntity, 'contactPhone');

    return (
      <div className='fieldGroup'>
        {this.props.textField('ID', {
          group,
          type: 'hidden',
          value: ID,
          required: false
        })}
        {this.props.textField('websiteURL', {
          group,
          fixedLabel: false,
          label: 'Website URL',
          placeholder: 'Type Website or Social Media URL',
          alidate: 'url',
          maxLength: 128,
          value: websiteURL,
          required: true,
          onBlur: this.onBlurWebsiteURL
        })}
        {this.props.textField('annualCreditCardSalesVolume', {
          group,
          fixedLabel: false,
          label: 'Estimated Annual Online Donations or Sales',
          placeholder: 'Type a Number',
          validate: 'money',
          validateOpts: {
            decimal: false,
            max: 99999999999
          },
          maxLength: 11,
          value: annualCreditCardSalesVolume || '',
          required: true
        })}
        {this.props.textField('yearsInBusiness', {
          group,
          placeholder: 'Type a Number',
          fixedLabel: false,
          label: 'Age of Nonprofit/Business (In Years, Round Up)',
          maxLength: 3,
          validate: 'number',
          validateOpts: {
            min: 1,
            max: 500
          },
          value: yearsInBusiness || '',
          required: true
        })}
        {this.props.textField('contactPhone', {
          group,
          placeholder: `Type Phone Number`,
          fixedLabel: false,
          label: 'Business Contact Phone',
          validate: 'phone',
          required: true,
          value: contactPhone ? _v.formatPhone(contactPhone) : ''
        })}
      </div>
    )
  }
}

LegalEntity.defaultProps = {
  group: 'legalEntity'
}

function mapStateToProps(state, props) {

  const websiteURL = util.getValue(state, 'resource.gbx3Org.data.websiteURL');
  const legalEntity = util.getValue(state, 'resource.orgLegalEntity.data', {});
  const loading = util.getValue(state, 'merchantApp.loading', false);

  return {
    websiteURL,
    legalEntity,
    loading
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource,
  setMerchantApp
})(LegalEntity);
