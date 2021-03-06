import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import TextField from '../../form/TextField';
import RichTextField from '../../form/RichTextField';

import { toggleModal } from '../../api/actions';

class SendEmail extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onRecipientChange = this.onRecipientChange.bind(this);
    this.onRecipientBlur = this.onRecipientBlur.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      recipients: util.getValue(props.sendEmail, 'recipients', ''),
      message: util.getValue(props.sendEmail, 'message', `I support ${props.orgName} and wanted to share their efforts with you.`)
    };
  }

  componentDidMount() {
  }

  onRecipientChange(e) {
    const target = e.currentTarget;
    const value = target.value;
    this.setState({ recipients: value });
  }

  onRecipientBlur() {
    if (this.props.sendEmailCallback) this.props.sendEmailCallback(this.state.recipients, this.state.message);
  }

  onBlur(name, value, hasText) {
    const message = hasText ? value : '';
    this.setState({ message });
    if (this.props.sendEmailCallback) this.props.sendEmailCallback(this.state.recipients, hasText ? value : '');
  }

  cancel() {
    this.setState({
      recipients: util.getValue(this.props.sendEmail, 'recipients', ''),
      message: util.getValue(this.props.sendEmail, 'message', '')
    }, () => {
      if (this.props.sendEmailCallback) this.props.sendEmailCallback(this.state.recipients, this.state.message);
      this.props.toggleModal('sendEmail', false);
    });
  }

  render() {

    const {
      primaryColor
    } = this.props;

    return (
      <div className='modalWrapper'>
        <h3 style={{ marginBottom: 20 }} className='center'>
          {this.props.headerText}<br />
          <span style={{ fontSize: 14 }}>This Email Will be Sent When Your Transaction is Made</span>
        </h3>
        <TextField
          name='recipients'
          label='Email Recipients'
          fixedLabel={true}
          placeholder='Add email addresses, separate multiple emails by commas'
          required={false}
          onChange={this.onRecipientChange}
          onBlur={this.onRecipientBlur}
          value={this.state.recipients}
          color={primaryColor}
        />
        <RichTextField
          label='Message to recipients'
          placeholder='Please write something...'
          modal={false}
          required={false}
          onBlurEditor={this.onBlur}
          value={this.state.message}
          color={primaryColor}
        />
        <div className='button-group center'>
          <GBLink customColor={primaryColor} solidColor={false} allowCustom={true} onClick={this.cancel}>Cancel</GBLink>
          <GBLink customColor={primaryColor} solidColor={true} allowCustom={true} className='button' onClick={() => this.props.toggleModal('sendEmail', false)}>Confirm</GBLink>
        </div>
      </div>
    )
  }
}

SendEmail.defaultProps = {
  headerText: 'Compose Email'
}

function mapStateToProps(state, props) {

  const orgName = util.getValue(state, 'gbx3.data.orgName', 'organization');

  return {
    orgName
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(SendEmail)
