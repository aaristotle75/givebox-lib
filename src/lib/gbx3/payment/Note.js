import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextField,
  RichTextField,
  Choice,
  util,
  GBLink,
  Collapse
} from '../../';
import { toggleModal } from '../../api/actions';
import AnimateHeight from 'react-animate-height';

class Note extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onRecipientChange = this.onRecipientChange.bind(this);
    this.onRecipientBlur = this.onRecipientBlur.bind(this);
    this.state = {
      userToSendEmail: false,
      recipients: util.getValue(props.sendEmail, 'recipients', ''),
      message: util.getValue(props.sendEmail, 'message'),
      showMessage: false
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showMessage !== this.props.showMessage) {
      this.setState({ showMessage: this.props.showMessage });
    }
  }

  onRecipientChange(e) {
    const target = e.currentTarget;
    const value = target.value;
    this.setState({ recipients: value });
  }

  onRecipientBlur() {
    const {
      recipients,
      message
    } = this.state;

    if (this.props.sendEmailCallback) this.props.sendEmailCallback({ recipients, message });
  }

  onBlur(name, value, hasText) {
    const {
      recipients
    } = this.state;

    const message = hasText ? value : '';
    this.setState({ message });
    if (this.props.sendEmailCallback) this.props.sendEmailCallback({ recipients, message: hasText ? value : '' });
  }

  render() {

    const {
      primaryColor,
      allowEmail,
      messageText,
      linkText
    } = this.props;

    const {
      showMessage,
      message,
      userToSendEmail,
      receipients
    } = this.state;

    return (
      <div className='sendEmailNote'>
        <span className='optionalMessageTitle'>Optional Message</span>
        <GBLink
          style={{ display: 'block'}}
          allowCustom={true}
          customColor={primaryColor}
          onClick={() => {
              this.setState({ showMessage: this.state.showMessage ? false : true })
          }}
        >
          {showMessage ? 'Hide' : 'Show' } Optional Message
        </GBLink>
        <AnimateHeight
          height={showMessage ? 'auto' : 0}
        >
          <div>
            <RichTextField
              label={messageText}
              placeholder='Please write something...'
              modal={false}
              required={false}
              onBlurEditor={this.onBlur}
              value={message}
              color={primaryColor}
              wysiwyg={false}
              autoFocus={false}
            />
            { allowEmail ?
              <div>
                <Choice
                  label={`Email Your Message`}
                  value={userToSendEmail}
                  checked={userToSendEmail}
                  onChange={() => {
                    const userToSendEmail = this.state.userToSendEmail ? false : true;
                    this.setState({ userToSendEmail });
                    if (!util.isEmpty(this.state.recipients) && !userToSendEmail) {
                      this.setState({ recipients: [] });
                      if (this.props.sendEmailCallback) this.props.sendEmailCallback({ recipients: [] });
                    }
                  }}
                  color={primaryColor}
                  errorType={'tooltip'}
                  toggle={true}
                />
                <AnimateHeight height={userToSendEmail ? 'auto' : 0}>
                  <TextField
                    name='recipients'
                    label='Add Emails'
                    fixedLabel={true}
                    placeholder='Add Emails, Separate Multiple Emails by Commas'
                    required={false}
                    onChange={this.onRecipientChange}
                    onBlur={this.onRecipientBlur}
                    value={this.state.recipients}
                    color={primaryColor}
                  />
                </AnimateHeight>
              </div>
            : '' }
          </div>
        </AnimateHeight>
      </div>
    )
  }
}

Note.defaultProps = {
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
})(Note)
