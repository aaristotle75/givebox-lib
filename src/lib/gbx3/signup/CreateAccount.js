import React from 'react';
import { connect } from 'react-redux';
import AcceptTerms from '../../common/AcceptTerms';
import Dropdown from '../../form/Dropdown';
import * as _v from '../../form/formValidate';
import AnimateHeight from 'react-animate-height';

class CreateAccount extends React.Component {

  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.state = {
      giveboxAccount: ''
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
      requirePassword,
      hideSelectAccount
    } = this.props;

    const {
      email,
      firstName,
      lastName
    } = owner;

    const secondaryText =
      <span>
        No contracts, no hidden fees and no credit card required.
      </span>
    ;

    const bottom =
      <div className='flexCenter' style={{ fontSize: 12, marginTop: 10 }}>
        Yep, they are all the same, FREE.
      </div>
    ;

    return (
      <div className='fieldGroup'>
        <div className='column50'>
          {this.props.textField('firstName', {
            group,
            required: true,
            fixedLabel: false,
            label: 'First Name',
            placeholder: 'Type First Name',
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
            fixedLabel: false,
            label: 'Last Name',
            placeholder: 'Type Last Name',
            value: lastName,
            onBlur: (name, value) => {
              if (value) {
                this.props.updateOrgSignupField('owner', { lastName: value });
              }
            }
          })}
        </div>
        <div className='column50'>
          {this.props.textField('email', {
            group,
            required: true,
            fixedLabel: false,
            validate: 'email',
            label: 'Email',
            placeholder: 'Type Email Address',
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
        </div>
        { !hideSelectAccount ?
          <div className='column50'>
            <Dropdown
              name='giveboxAccount'
              portalID={`category-dropdown-portal-givebox-account`}
              portalClass={'gbx3 articleCardDropdown gbx3Steps'}
              portalLeftOffset={10}
              className='articleCard'
              contentWidth={400}
              label={'Givebox'}
              selectLabel='Select Free Account'
              fixedLabel={false}
              fixedLabelHasValue={true}
              required={false}
              onChange={(name, value) => {
                this.setState({ giveboxAccount: value });
              }}
              options={[
                { secondaryText, primaryText: 'Free Account', value: 'free1' },
                { secondaryText, primaryText: 'Totally Free Account', value: 'free2' },
                { secondaryText, primaryText: 'Absolutely Free Account', value: 'free3' },
                { secondaryText, primaryText: `Seriously, it's a Free Account`, value: 'free4' },
                { bottom }
              ]}
              showCloseBtn={true}
              value={this.state.giveboxAccount}
              style={{ paddingBottom: 20 }}
              leftBar={true}
            />
          </div>
        : null }
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

CreateAccount.defaultProps = {
  hideSelectAccount: false
};

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(CreateAccount);
