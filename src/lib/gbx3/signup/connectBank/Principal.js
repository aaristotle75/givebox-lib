import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as _v from '../../../form/formValidate';
import Loader from '../../../common/Loader';
import AnimateHeight from 'react-animate-height';
import {
  setMerchantApp
} from '../../redux/merchantActions';
import {
  getResource
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
      const initLoading = await this.props.setMerchantApp('loading', true);
      if (initLoading) {
        this.props.getResource('orgPrincipals', {
          reload: false,
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

  render() {

    const {
      group,
      formState,
      principal,
      loading
    } = this.props;

    if (loading) return <Loader msg='Loading Principal...' />

    const ID = util.getValue(principal, 'ID');
    const emailAddress = util.getValue(principal, 'emailAddress');
    const firstName = util.getValue(principal, 'firstName');
    const lastName = util.getValue(principal, 'lastName');
    const dataOfBirth = util.getValue(principal, 'dateOfBirth');
    const title = util.getValue(principal, 'title');
    const contactPhone = util.getValue(principal, 'contactPhone');

    /* Auto set birthday
    const minDate = Moment().subtract(18, 'years');
    const minDateFormat = minDate.format('MM/DD/YYYY');
    const minDateTS = parseInt(minDate.valueOf()/1000);

    const maxDate = Moment().subtract(60, 'years');
    const maxDateFormat = maxDate.format('MM/DD/YYYY');
    const maxDateTS = parseInt(maxDate.valueOf()/1000);

    const randomTS = util.getRand(minDateTS, maxDateTS);
    */

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
            placeholder: 'Enter First Name',
            value: firstName
          })}
        </div>
        <div className='column50'>
          {this.props.textField('lastName', {
            group,
            required: true,
            fixedLabel: true,
            label: 'Last Name',
            placeholder: 'Enter Last Name',
            value: lastName
          })}
        </div>
        {this.props.textField('emailAddress', {
          group,
          required: true,
          fixedLabel: true,
          validate: 'email',
          label: 'Email',
          placeholder: 'Enter Email',
          value: emailAddress
        })}
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
        {this.props.textField('title', {
          group,
          placeholder: `Enter Title (e.g. Executive Director)`,
          fixedLabel: true,
          label: 'Title',
          value: title
        })}
        {this.props.textField('contactPhone', {
          group,
          placeholder: `Add a Contact Phone Number`,
          fixedLabel: true,
          label: 'Contact Phone',
          validate: 'phone',
          required: true,
          value: contactPhone ? _v.formatPhone(contactPhone) : ''
        })}
      </div>
    )
  }
}

Principal.defaultProps = {
  group: 'principal'
}

function mapStateToProps(state, props) {

  const orgPrincipals = util.getValue(state, 'resource.orgPrincipals', {});
  const orgPrincipalsData = util.getValue(orgPrincipals, 'data');
  const principal = util.getValue(orgPrincipalsData, 0, {});
  const loading = util.getValue(state, 'merchantApp.loading', false);

  return {
    principal,
    loading
  }
}

export default connect(mapStateToProps, {
  getResource,
  setMerchantApp
})(Principal);
