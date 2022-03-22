import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as _v from '../../../form/formValidate';
import Loader from '../../../common/Loader';
import AnimateHeight from 'react-animate-height';
import {
  setMerchantApp,
  saveLegalEntity
} from '../../redux/merchantActions';
import {
  getResource,
  sendResource
} from '../../../api/helpers';
import Moment from 'moment';

class Principal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    if (util.isEmpty(this.props.principal)) {
      const initLoading = await this.props.setMerchantApp('principalLoading', true);
      if (initLoading) {
        this.props.getResource('orgPrincipals', {
          reload: true,
          search: {
            sort: 'createdAt',
            order: 'desc'
          },
          callback: (res, err) => {
            this.props.setMerchantApp('principalLoading', false);
          }
        });
      }
    }
  }

  render() {

    const {
      group,
      formState,
      principal,
      loading,
      principalPlaid,
      contactPhone
    } = this.props;

    if (loading) return <Loader msg='Loading Principal...' />

    const ID = util.getValue(principal, 'ID');
    const emailAddress = util.getValue(principal, 'emailAddress', util.getValue(principalPlaid, 'emailAddress'));
    const firstName = util.getValue(principal, 'firstName', util.getValue(principalPlaid, 'firstName'));
    const lastName = util.getValue(principal, 'lastName', util.getValue(principalPlaid, 'lastName'));
    const dataOfBirth = util.getValue(principal, 'dateOfBirth');
    const title = util.getValue(principal, 'title');

    return (
      <div className='fieldGroup'>
        {this.props.textField('ID', {
          group,
          type: 'hidden',
          value: ID,
          required: false
        })}
        <div className='column50'>
          {this.props.textField('firstName', {
            group,
            required: true,
            fixedLabel: true,
            label: 'First Name',
            placeholder: 'Type First Name',
            value: firstName
          })}
        </div>
        <div className='column50'>
          {this.props.textField('lastName', {
            group,
            required: true,
            fixedLabel: true,
            label: 'Last Name',
            placeholder: 'Type Last Name',
            value: lastName
          })}
        </div>
        <div className='column50'>
          {this.props.textField('emailAddress', {
            group,
            required: true,
            fixedLabel: true,
            validate: 'email',
            label: 'Email',
            placeholder: 'Type Email',
            value: emailAddress
          })}
        </div>
        <div className='column50'>
          {this.props.textField('contactPhone', {
            group,
            placeholder: `Type Contact Phone Number`,
            fixedLabel: true,
            label: 'Contact Phone',
            validate: 'phone',
            required: true,
            value: contactPhone ? _v.formatPhone(contactPhone) : ''
          })}
        </div>
        <div className='column50'>
          {this.props.textField('title', {
            group,
            placeholder: `Type Title (e.g. Executive Director)`,
            fixedLabel: true,
            label: 'Title',
            value: title
          })}
        </div>

        {/* this.props.calendarField('dateOfBirth', {
          group,
          label: 'Date of Birth',
          required: true,
          validate: 'date',
          validateOpts: {
            max: Moment().subtract(18, 'years').format('MM/DD/YYYY'),
            errorMsg: `Account holder must be at least 18 years old.`
          },
          value: dateOfBirth,
          onChange: (name, value, fieldOpts) => {
            if (!fieldOpts.error) {
              this.updateField(name, value);
            }
          }
        }) */}

      </div>
    )
  }
}

Principal.defaultProps = {
  group: 'principal'
}

function mapStateToProps(state, props) {

  const legalEntityID = util.getValue(state, 'resource.orgLegalEntity.data.ID');
  const orgPrincipals = util.getValue(state, 'resource.orgPrincipals', {});
  const orgPrincipalsData = util.getValue(orgPrincipals, 'data');
  const principal = util.getValue(orgPrincipalsData, 0, {});
  const loading = util.getValue(state, 'merchantApp.principalLoading', false);
  const extractIdentity = util.getValue(state, 'merchantApp.extractIdentity', {});
  const principalPlaid = util.getValue(extractIdentity, 'principal', {});
  const contactPhone = util.getValue(principal, 'contactPhone', util.getValue(principalPlaid, 'contactPhone'));

  return {
    principal,
    loading,
    principalPlaid,
    legalEntityID,
    contactPhone
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource,
  saveLegalEntity,
  setMerchantApp
})(Principal);
