import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  sendResource,
  getResource
} from '../api/helpers';
import {
  resourceProp,
  removeResource,
  toggleModal
} from '../api/actions';
import Form from '../form/Form';
import TextField from '../form/TextField';
import Choice from '../form/Choice';
import * as _v from '../form/formValidate';
import * as util from './utility';
import GBLink from './GBLink';
import has from 'has';
import AnimateHeight from 'react-animate-height';

class TwoFAClass extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  formSavedCallback() {
    this.props.getResource('session', {
      reload: true,
      callback: () => {
        if (this.props.successCallback) this.props.successCallback();
      }
    });
    this.props.toggleModal('transferMoney', false);
  }

  processCallback(res, err) {
    if (!err) {
      const access = this.props.access;
      access.is2FAVerified = true;
      this.props.resourceProp('access', access);
      this.props.formSaved(() => this.formSavedCallback(res.ID), 'Identity has been verified.');
    } else {
      const errCode = has(err, 'data') ? util.getValue(err.data, 'code') : null;
      if (errCode === 'no_entity') {
        this.props.formProp({error: true, errorMsg: 'Code is not valid. It may be expired, you requested another code, or you entered the wrong numbers. Check your email and copy and paste the latest code sent or request a new code.'});
      } else {
        if (!this.props.getErrors(err)) this.props.formProp({error: true, errorMsg: this.props.savingErrorMsg});
      }
    }
    return;
  }

  processForm(fields) {
    util.toTop('modalOverlay-twoFA');
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });
    this.props.sendResource('2fauth', {
      method: 'post',
      data: data,
      callback: this.processCallback.bind(this),
    });
  }

  cancel() {
    this.props.toggleModal('twoFA', false);
    this.props.toggleModal('transferMoney', false);
    if (this.props.cancel2FA) this.props.cancel2FA();
  }

  render() {

    const {
      showCancel,
      linkStyle
    } = this.props;

    return (
      <div className='column'>
        {this.props.textField('code', { required: true, maxLength: 6, placeholder: 'Type Verification Code', label: '', style: { paddingTop: 0, paddingBottom: 0 } })}
        <div className='fieldContext' style={{ marginTop: 5 }}>
          Verification code is valid for up to 60 minutes.
        </div>
        <div className='flexColumn flexCenter'>
          {this.props.saveButton(this.processForm, { style: { width: 150 }, label: 'Verify' })}
          <GBLink style={linkStyle} onClick={() => this.props.toggleVerify(false)}>Click here to request a new verification code.</GBLink>
        </div>
      </div>
    )
  }
}

class TwoFA extends Component {

  constructor(props) {
    super(props);
    this.onClickSendCode = this.onClickSendCode.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.toggleVerify = this.toggleVerify.bind(this);
    this.setMode = this.setMode.bind(this);
    this.state = {
      mode: 'sms',
      email: util.getValue(props.access, 'email'),
      phone: util.getValue(props.access, 'phone'),
      codeSent: false,
      sending: false,
      error: false
    };
  }

  componentDidMount() {
    const {
      access
    } = this.props;

    if (this.props.set2FAVerified) this.props.set2FAVerified(util.getValue(access, 'is2FAVerified'));
  }

  setMode(mode) {
    this.setState({ mode, error: false });
  }

  onClickSendCode() {
    const {
      mode,
      phone
    } = this.state;

    const access = this.props.access;

    let error = false;
    let sendCode = true;

    if (mode === 'sms') {
      if (!_v.validatePhone(phone)) {
        error = 'Please enter a valid mobile number.';
      } else if (!util.getValue(access, 'phone')) {
        sendCode = false;
        this.props.sendResource('singleUser', {
          id: [util.getValue(access, 'userID', null)],
          data: {
            phone: util.prunePhone(phone)
          },
          method: 'patch',
          callback: (res, err) => {
            if (!err) {
              access.phone = util.prunePhone(phone);
              this.props.resourceProp('access', access);
              this.sendCode();
            } else {
              this.setState({ error: 'Unable to update mobile number.' });
            }
          }
        });
      }
    }

    this.setState({ error }, () => {
      if (!error && sendCode) {
        this.sendCode();
      }
    })
  }

  sendCode() {

    const {
      mode
    } = this.state;

    const data = {
      kind: 'bank_transfer',
      medium: mode
    };

    this.props.sendResource('2fauth', {
      data,
      method: 'put',
      callback: () => {
        this.setState({
          sending: false,
          codeSent: true
        });
      },
    });
  }

  toggleVerify(codeSent) {
    this.setState({ codeSent });
  }

  getObfuscationXs(length) {
    let xs = '';
    for (let i=0; i <= length; i++) {
      xs = xs + 'x';
    }
    return xs;
  }

  render() {

    const {
      mode,
      email,
      phone,
      error
    } = this.state;

    const {
      access,
      allowEmail,
      hideRadio,
      linkStyle
    } = this.props;

    const hasPhone = util.getValue(access, 'phone');
    const obfuscatePhone = <span><span style={{ fontWeigth: 300 }}>(xxx) xxx-</span>{phone.substr(phone.length - 4)}</span>;
    const obfuscateEmail = <span>{email.substring(0, 4)}<span style={{ fontWeight: 300 }}>{this.getObfuscationXs(email.length - 12)}</span>{email.substr(email.length - 8)}</span>;

    return (
      <div className='twoFA'>
        {this.state.sending && this.props.loader('Sending Code...')}
        {this.state.codeSent ?
          <div>
            <div className='stepsSubText' style={{ marginLeft: 0, marginRight: 0 }}>
              <span style={{ display: 'block' }}>
                Verification code was sent to: <span className='strong'>{mode === 'email' ? obfuscateEmail : obfuscatePhone }</span>
              </span>
            </div>
            <Form
              noFormTag={true}
              name={'twoFA'}
            >
              <TwoFAClass
                {...this.props}
                toggleVerify={this.toggleVerify}
              />
            </Form>
          </div>
          :
          <div>
            <div className='modeSelection flexColumn'>
              { !hideRadio ?
                <div className='2fa-radio-group'>
                  { allowEmail ?
                    <Choice
                      type='radio'
                      name='email'
                      label={<span style={{fontSize: 14}}>Send Code via Email to <span style={{ fontWeight: 500 }}>{obfuscateEmail}</span></span>}
                      onChange={(name, value) => {
                        this.setMode(value);
                      }}
                      checked={mode}
                      value={'email'}
                    />
                  : null }
                  <Choice
                    type='radio'
                    name='sms'
                    label={<span style={{fontSize: 14}}>Send Code via Text Message to {hasPhone ? <span style={{ fontWeight: 500 }}>{obfuscatePhone}</span> : 'a Mobile Number' }</span>}
                    onChange={(name, value) => {
                      this.setMode(value);
                    }}
                    checked={mode}
                    value={'sms'}
                  />
                </div>
              : null }
              <AnimateHeight height={!hasPhone && mode === 'sms' ? 'auto' : 0}>
                <TextField
                  name='phone'
                  label='Mobile Number'
                  fixedLabel={false}
                  placeholder='Type Mobile Number'
                  value={phone}
                  onChange={(e) => {
                    const phone = _v.formatPhone(e.currentTarget.value);
                    this.setState({ phone, error: false })
                  }}
                  error={error}
                  leftBar={true}
                />
              </AnimateHeight>
            </div>
            <div className='flexColumn flexCenter'>
              <GBLink className='button' onClick={this.onClickSendCode}>Get Verification Code</GBLink>
              {hasPhone ? <GBLink style={linkStyle} onClick={() => this.toggleVerify(true)}>Already have a code, click here.</GBLink> : null }
            </div>
          </div>
        }
      </div>
    )
  }

}

TwoFA.defaultProps = {
  allowEmail: false,
  showCancel: false,
  hideRadio: false,
  linkStyle: {
    marginTop: 20,
    fontWeight: 500,
    fontSize: 12
  }
}

function mapStateToProps(state, props) {
  return {
    access: state.resource.access ? state.resource.access : {}
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource,
  removeResource,
  toggleModal,
  resourceProp
})(TwoFA)
