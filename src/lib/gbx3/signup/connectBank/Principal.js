import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as _v from '../../../form/formValidate';
import Loader from '../../../common/Loader';
import AnimateHeight from 'react-animate-height';
import {
  getPrincipal,
  updateMerchantApp
} from '../../redux/merchantActions';
import Moment from 'moment';

class Principal extends React.Component {

  constructor(props) {
    super(props);
    this.updateField = this.updateField.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.getPrincipal({
      reload: false,
      callback: () => {
        this.setState({ loading: false });
      }
    });
  }

  updateField(field, value) {
    this.props.updateMerchantApp('principal', { [field]: value, hasBeenUpdated: true });
  }

  render() {

    const {
      group,
      principal
    } = this.props;

    const {
      emailAddress,
      firstName,
      lastName,
      dateOfBirth,
      title,
      contactPhone
    } = principal;

    if (this.state.loading) return <Loader msg='Loading Principal...' />

    const minDate = Moment().subtract(18, 'years');
    const minDateFormat = minDate.format('MM/DD/YYYY');
    const minDateTS = parseInt(minDate.valueOf()/1000);

    const maxDate = Moment().subtract(60, 'years');
    const maxDateFormat = maxDate.format('MM/DD/YYYY');
    const maxDateTS = parseInt(maxDate.valueOf()/1000);

    const randomTS = util.getRand(minDateTS, maxDateTS);

    return (
      <div className='fieldGroup'>
        <div className='column50'>
          {this.props.textField('firstName', {
            group,
            required: true,
            fixedLabel: true,
            label: 'First Name',
            placeholder: 'Enter First Name',
            value: firstName,
            onBlur: (name, value) => {
              if (value) {
                this.updateField(name, value);
              }
            }
          })}
        </div>
        <div className='column50'>
          {this.props.textField('lastName', {
            group,
            required: true,
            fixedLabel: true,
            label: 'Last Name',
            placeholder: 'Enter Last Name',
            value: lastName,
            onBlur: (name, value) => {
              if (value) {
                this.updateField(name, value);
              }
            }
          })}
        </div>
        {this.props.textField('emailAddress', {
          group,
          required: true,
          fixedLabel: true,
          validate: 'email',
          label: 'Email',
          placeholder: 'Enter Email',
          value: emailAddress,
          onBlur: (name, value, fieldOpts) => {
            if (_v.validateEmail(value)) {
              this.updateField(name, value);
            }
          }
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
          value: title,
          onBlur: (name, value) => {
            if (value) {
              this.updateField(name, value);
            }
          }
        })}
        {this.props.textField('contactPhone', {
          group,
          placeholder: `Add a Contact Phone Number`,
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

Principal.defaultProps = {
  group: 'principal'
}

function mapStateToProps(state, props) {

  const principal = util.getValue(state, 'merchantApp.principal', {});

  return {
    principal
  }
}

export default connect(mapStateToProps, {
  getPrincipal,
  updateMerchantApp
})(Principal);
