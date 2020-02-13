import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextField,
  RichTextField,
  util,
  GBLink,
  toggleModal
} from '../';

class SendEmail extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onRecipientChange = this.onRecipientChange.bind(this);
    this.onRecipientBlur = this.onRecipientBlur.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      recipients: util.getValue(props.sendEmail, 'recipients', ''),
      message: util.getValue(props.sendEmail, 'message', '')
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

    return (
      <div>
        <h3 className='center'>{this.props.headerText}</h3>
        <TextField
          name='recipients'
          label='Email Recipients'
          fixedLabel={true}
          placeholder='Add email addresses, separate multiple emails by commas'
          required={false}
          onChange={this.onRecipientChange}
          onBlur={this.onRecipientBlur}
          value={this.state.recipients}
          color={this.props.primaryColor}
        />
        <RichTextField
          label='Message to recipients'
          placeholder='Please write something...'
          modal={false}
          required={false}
          onBlurEditor={this.onBlur}
          value={this.state.message}
          color={this.props.primaryColor}
        />
        <div className='button-group center'>
          <GBLink onClick={this.cancel}>Cancel</GBLink>
          <GBLink className='button' onClick={() => this.props.toggleModal('sendEmail', false)}>Save & Close</GBLink>
        </div>
      </div>
    )
  }
}

SendEmail.defaultProps = {
}

function mapStateToProps(state, props) {
  return {
    primaryColor: state.custom.primaryColor
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(SendEmail)
