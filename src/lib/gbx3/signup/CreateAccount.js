import React from 'react';
import { connect } from 'react-redux';
import AcceptTerms from '../../common/AcceptTerms';
import * as _v from '../../form/formValidate';
import AnimateHeight from 'react-animate-height';

class CreateAccount extends React.Component {

  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onChangeEmail(name, value) {
    const {
      requirePassword
    } = this.props;

    if (requirePassword) {
      this.props.setRequirePassword(false);
    }
  }

  render() {

    const {
      group,
      owner,
      acceptedTerms,
      requirePassword
    } = this.props;

    const {
      email,
      firstName,
      lastName
    } = owner;

    return (
      <div className='fieldGroup'>
        <div className='column50'>
          {this.props.textField('firstName', {
            group,
            required: true,
            fixedLabel: true,
            label: 'First Name',
            placeholder: 'Click Here to Enter First Name',
            value: firstName,
            onBlur: (name, value) => {
              if (value) {
                this.props.updateOrgSignupField('owner', { firstName: value });
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
            placeholder: 'Click Here to Enter Last Name',
            value: lastName,
            onBlur: (name, value) => {
              if (value) {
                this.props.updateOrgSignupField('owner', { lastName: value });
              }
            }
          })}
        </div>
        {this.props.textField('email', {
          group,
          required: true,
          fixedLabel: true,
          validate: 'email',
          label: 'Email',
          placeholder: 'Click Here to Enter Email',
          value: email,
          onBlur: (name, value) => {
            if (_v.validateEmail(value)) {
              this.props.updateOrgSignupField('owner', { email: value });
            }
          },
          onChange: this.onChangeEmail
        })}
        <AnimateHeight height={requirePassword ? 'auto' : 0}>
          {this.props.textField('password', {
            group,
            type: 'password',
            validate: 'password',
            required: requirePassword ? true : false,
            fixedLabel: true,
            label: 'Current Password',
            placeholder: 'Enter Password'
          })}
        </AnimateHeight>
        <AcceptTerms
          checked={acceptedTerms}
          error={!acceptedTerms ? true : false}
          onChange={(checked) => {
            this.props.updateOrgSignup({ acceptedTerms: checked });
            if (checked) this.props.formProp({ error: false });
          }}
        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(CreateAccount);
