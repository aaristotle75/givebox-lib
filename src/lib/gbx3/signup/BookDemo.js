import React from 'react';
import { connect } from 'react-redux';
import CreateAccount from './CreateAccount';
import Form from '../../form/Form';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import HelpfulTip from '../../common/HelpfulTip';
import {
  loadOrgSignup,
  updateOrgSignup,
  updateOrgSignupField
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import {
  sendResource,
  getResource
} from '../../api/helpers';

class BookDemoForm extends React.Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.saveLead = this.saveLead.bind(this);
    this.checkExistingUser = this.checkExistingUser.bind(this);
    this.setShowBook = this.setShowBook.bind(this);
    this.renderCreateAccount = this.renderCreateAccount.bind(this);
    this.renderBook = this.renderBook.bind(this);
    this.finishBook = this.finishBook.bind(this);

    this.state = {
      error: false,
      saving: false,
      showBook: false
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.props.loadOrgSignup({
      bookDemo: false
    });
  }

  setShowBook(showBook) {
    this.setState({ showBook }, () => {
      this.setState({ saving: false });
    });
  }

  /*
  * If required steps are not completed save the user as a lead
  */
  saveLead() {
    const {
      owner
    } = this.props.fields;

    const data = {
      ...owner,
      password: null,
      scope: 'cloud',
      role: 'admin'
    };

    this.props.sendResource('users', {
      data,
      method: 'post',
      isSending: false,
      callback: (res, err) => {
        this.setShowBook(true);
      }
    });
  }

  async processForm(fields, callback, group) {
    util.toTop('modalOverlay-orgSignupSteps');
    this.setState({ saving: true });
    const {
      acceptedTerms
    } = this.props;

    const {
      owner
    } = this.props.fields;

    const password = util.getValue(fields, 'password.value');
    if (!acceptedTerms) {
      this.props.formProp({ error: true, errorMsg: 'You must agree to Givebox Terms of Service to continue.'});
      this.setState({ saving: false });
    } else {
      this.checkExistingUser(owner.email);
    }
  }

  checkExistingUser(email) {
    this.props.sendResource('userEmailCheck', {
      data: {
        email,
        scope: 'cloud'
      },
      reload: true,
      callback: (res, err) => {
        const hasPassword = util.getValue(res, 'hasPassword');
        const emailExists = util.getValue(res, 'emailExists');
        if (hasPassword && emailExists) {
          this.setShowBook(true);
        } else {
          this.saveLead();
        }
      }
    })
    this.setState({ saving: false });
  }

  renderCreateAccount() {

    const {
      acceptedTerms
    } = this.props;

    const {
      owner
    } = this.props.fields;

    return (
      <div className='stepsWrapper'>
        <div className='stepContainer'>
          { this.state.saving ? <Loader msg='Saving...' /> : null }
          <div className={`step`}>
            <div className='stepTitleContainer'>
              <span className={`icon icon-book-open`}></span>
              <div className='stepTitle'>
                Book a Demo
              </div>
            </div>
            <div className='stepsSubText'>Please enter the information below to book a demo.</div>
            <div className={`stepComponent`}>
              <HelpfulTip
                headerIcon={<span className='icon icon-alert-circle'></span>}
                headerText='We Keep Your Data Private'
                text={`We promise you'll never receive unsolicited calls or spam email.`}
                style={{ marginTop: 15, marginBottom: 20 }}
              />
              <CreateAccount
                {...this.props}
                group={'bookDemo'}
                owner={owner}
                acceptedTerms={acceptedTerms}
                updateOrgSignupField={this.props.updateOrgSignupField}
                updateOrgSignup={this.props.updateOrgSignup}
              />
            </div>
          </div>
          <div className='button-group'>
            <div className='button-item' style={{ width: 150 }}>
            </div>
            <div className='button-item'>
              {this.props.saveButton(this.processForm, { label: <span className='buttonAlignText'>Click Here to Book a Demo <span className='icon icon-chevron-right'></span></span> })}
            </div>
            <div className='button-item' style={{ width: 150 }}>
            </div>
          </div>
        </div>
      </div>
    )
  }

  finishBook() {
    this.props.toggleModal('bookDemo', false);
  }

  renderBook() {

    const buttonLabel = <span className='buttonAlignText'>Click Here When Finished <span className='icon icon-chevron-right'></span></span>;

    return (
      <div className='stepsWrapper bookDemo'>
        <div className='stepContainer'>
          { this.state.saving ? <Loader msg='Saving...' /> : null }
          <div className='stepStatus' style={{ marginBottom: 0 }}>
            <GBLink onClick={this.finishBook}>
              <span style={{ marginLeft: 20 }}>{buttonLabel}</span>
            </GBLink>
          </div>
          <div className={`step`}>
            <div className={`stepComponent`} style={{ marginTop: 0, marginBottom: 0 }}>
              <iframe src='https://crm.zoho.com/bookings/GiveboxDemo?rid=63c828c1059e1f1af7fbe0c178b51d36f400be27648458ceb04b0477d394a5b6gid1dce526f0aa834de054301002762432b865617ba883dc4961e70a00cfed27a66' />
            </div>
          </div>
          <div className='button-group'>
            <div className='button-item' style={{ width: 150 }}>
            </div>
            <div className='button-item'>
              <GBLink
                onClick={this.finishBook}
                className='button'
              >
                {buttonLabel}
              </GBLink>
            </div>
            <div className='button-item' style={{ width: 150 }}>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {

    const {
      showBook
    } = this.state;

    return showBook ? this.renderBook() : this.renderCreateAccount()
  }
}

class BookDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {

    return (
      <div className='gbx3Steps modalWrapper'>
        <div className='flexCenter' style={{ marginBottom: 10 }}>
          <Image size='thumb' maxSize={40} url={'https://cdn.givebox.com/givebox/public/gb-logo5.png'} alt='Givebox' />
        </div>
        <Form id={`bookDemoForm`} name={`bookDemoForm`}>
          <BookDemoForm
            {...this.props}
          />
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
  const step = util.getValue(orgSignup, 'step', 0);
  const acceptedTerms = util.getValue(orgSignup, 'acceptedTerms');
  const fields = util.getValue(orgSignup, 'fields', {});

  return {
    acceptedTerms,
    fields
  }
}

export default connect(mapStateToProps, {
  loadOrgSignup,
  updateOrgSignupField,
  updateOrgSignup,
  toggleModal,
  sendResource,
  getResource
})(BookDemo);
