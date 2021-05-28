import React from 'react';
import { connect } from 'react-redux';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import TextField from '../../form/TextField';
import * as util from '../../common/utility';
import Tabs, { Tab } from '../../common/Tabs';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import HelpfulTip from '../../common/HelpfulTip';
import {
  setSignupStep,
  checkSignupPhase
} from '../redux/gbx3actions';
import {
  setMerchantApp,
  getLegalEntity,
  savePrincipal,
  saveLegalEntity,
  saveAddress,
  saveBankAccount,
  checkSubmitMerchantApp
} from '../redux/merchantActions';
import BankAccount from './connectBank/BankAccount';
import Principal from './connectBank/Principal';
import LegalEntity from './connectBank/LegalEntity';
import Address from './connectBank/Address';
import PlaidConnect from './connectBank/PlaidConnect';
import ConnectStatus from './connectBank/ConnectStatus';

class ConnectBankStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.connectBankPlaid = this.connectBankPlaid.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.saveCallback = this.saveCallback.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);
    this.submerchantCreated = this.submerchantCreated.bind(this);
    this.checkConnectStatus = this.checkConnectStatus.bind(this);
    this.switchToConnectBank = this.switchToConnectBank.bind(this);
    this.switchToManualBank = this.switchToManualBank.bind(this);

    this.state = {
      editorOpen: false,
      error: false,
      saving: false,
      checkingStatus: false,
      loading: true
    };
  }

  componentDidMount() {
    this.checkConnectStatus();
  }

  connectBankPlaid() {
    this.setState({ saving: false });
  }

  callbackAfter(tab) {
    this.props.formProp({ error: false });
  }

  async switchToManualBank() {
    const updated = await this.props.updateOrgSignup({ signupPhase: 'manualConnect' });
    if (updated) {
      this.props.saveOrg({ orgUpdated: true });
      this.props.checkSignupPhase({
        forceStep: 0,
        openAdmin: true,
        openModal: true
      });
    }
  }


  async switchToConnectBank() {
    const updated = await this.props.updateOrgSignup({ signupPhase: 'connectBank' });
    if (updated) {
      this.props.saveOrg({ orgUpdated: true });
      this.props.checkSignupPhase({
        forceStep: 0,
        openAdmin: true,
        openModal: true
      });
    }
  }

  checkConnectStatus() {

    this.setState({ checkingStatus: true }, () => {

      this.props.checkSubmitMerchantApp({
        callback: (message, err) => {
          if (message === 'submerchant_created') {
            this.submerchantCreated();
          } else if (message === 'has_mid') {
            this.submerchantCreated(0);
          } else if (err) {
            this.switchToManualBank();
            this.props.formProp({ error: true, errorMsg: 'We are unable to connect your bank account. Please check that all your information is correct and try again in a few minutes.' });
            this.setState({ checkingStatus: false });
          } else {
            this.setState({ checkingStatus: false });
          }
        }
      });
    });
  }

  async submerchantCreated(delay = 5000) {
    const completed = await this.props.stepCompleted('connectStatus', false);
    if (completed) {
      this.setState({ checkingStatus: false });
      setTimeout(async () => {
        const updated = await this.props.updateOrgSignup({ signupPhase: 'transferMoney' }, 'connectBank');
        if (updated) {
          this.props.updateAdmin({ open: false });
          this.props.toggleModal('orgConnectBankSteps', false);
          this.props.checkSignupPhase({
            openModal: false,
            openAdmin: false
          });
          this.props.saveOrg({
            orgUpdated: true,
            isSending: true,
            callback: () => {
            }
          });
        }
      }, delay);
    }
  }

  async saveStep(slug, delay = 1000, error = false) {

    if (error) {
      this.setState({ saving: false });
      return false;
    }

    const completedStep = await this.props.stepCompleted(slug);
    if (completedStep) {
      setTimeout(() => {
        this.setState({ saving: false }, this.props.gotoNextStep);
      }, delay);
    } else {
      this.setState({ saving: false }, this.props.gotoNextStep);
    }

    this.checkConnectStatus();
  }

  saveCallback(res, err, group) {
    const {
      formState
    } = this.props;

    const hasBeenUpdated = util.getValue(formState, 'updated');

    if (!err) {
      this.saveStep(group, hasBeenUpdated ? 1000 : 0);
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
      this.setState({ saving: false });
    }
    this.props.formProp({ updated: false });
  }

  async processForm(fields, callback, group) {
    util.toTop('modalOverlay-orgConnectBankSteps');
    this.setState({ saving: true });
    const {
      step,
      stepsTodo,
      formState,
      merchantIdentString
    } = this.props;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const hasBeenUpdated = util.getValue(formState, 'updated');
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) {
          data[key] = value.value;
      }
    });

    switch (group) {
      case 'connectBank': {
        return this.connectBankPlaid();
      }

      case 'addBank': {
        this.props.saveBankAccount({
          hasBeenUpdated,
          data,
          callback: (res, err) => this.saveCallback(res, err, group)
        })
        break;
      }

      case 'principal': {
        this.props.savePrincipal({
          hasBeenUpdated,
          data,
          callback: (res, err) => this.saveCallback(res, err, group)
        });
        break;
      }

      case 'legalEntity': {
        this.props.saveLegalEntity({
          hasBeenUpdated,
          data,
          callback: (res, err) => this.saveCallback(res, err, group)
        });
        break;
      }

      case 'address': {
        this.props.saveAddress({
          hasBeenUpdated,
          data,
          callback: (res, err) => this.saveCallback(res, err, group)
        });
        break;
      }

      case 'connectStatus': {
        if (merchantIdentString) {
          if (!this.props.completed.includes(group)) {
            this.submerchantCreated(1000);
          } else {
            this.props.toggleModal('orgConnectBankSteps', false);
          }
        } else {
          this.checkConnectStatus();
        }
        break;
      }

      /*
      default: {
        return this.saveStep(group);
      }
      */
      // no default
    }
  }

  renderStep() {
    const {
      loading
    } = this.state;

    const {
      step,
      open,
      isMobile,
      stepsTodo,
      plaidAccountID,
      isVantivReady,
      merchantIdentString,
      signupPhase,
      hasReceivedTransaction
    } = this.props;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const stepNumber = +step + 1;
    const completed = this.props.completed.includes(slug) ? true : false;
    const firstStep = step === 0 ? true : false;
    const lastStep = step === this.props.steps ? true : false;
    const nextStepName = this.props.getNextStep();
    const nextStepNumber = this.props.nextStep(step) + 1;

    const item = {
      title: stepConfig.title,
      icon: stepConfig.icon,
      customIcon: stepConfig.customIcon,
      desc: stepConfig.desc,
      component: <div></div>,
      className: '',
      saveButtonLabelTop: <span className='buttonAlignText'>Save & Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>,
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue to Next Step <span className='icon icon-chevron-right'></span></span>,
      saveButtonDisabled: false
    };

    const library = {
      saveMediaType: 'org',
      borderRadius: 0
    };

    switch (slug) {
      case 'connectBank': {
        item.saveButtonLabelTop = <span className='buttonAlignText'>Click Here to Connect Your Bank Account<span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabel = <span className='buttonAlignText'>Connect Your Bank Account <span className='icon icon-chevron-right'></span></span>;
        item.desc =
          <div>
            { hasReceivedTransaction ? <p>Congratulations, you have received your first transactions with Givebox!</p> : null }
            <p></p>
            <p>Simply connect your bank, and in a matter of minutes you will have a bank account connected and can continue to accept payments and donations.</p>
            <HelpfulTip
              headerIcon={<span className='icon icon-external-link'></span>}
              headerText={`Connect Your Bank Account with Plaid`}
              text={`When you click Connect Bank Account below it will open an overlay that will ask you to choose your bank and prompt you to login to your account. This is the easiest and quickest way to connect a bank account.`}
              style={{ marginTop: 30 }}
            />
          </div>
        ;
        item.component = <div></div>;
        break;
      }

      case 'addBank': {
        item.desc =
          <div>
            <p></p>
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-triangle'></span>}
              headerText={`Manually Entering a Bank Account`}
              text={`Manually entering your bank account will require you to complete extra steps and additional documentation that you must submit for review, and can take up to 7 days to approve.`}
              style={{ marginTop: 30 }}
            />
          </div>
        ;
        item.component =
          <BankAccount
            {...this.props}
          />
        ;
        break;
      }

      case 'principal': {
        item.desc =
          <div>
            <p>The primary account holder is usually a person on the bank account or someone with authority to manage the Organization and handle the money.</p>
            {/*
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-circle'></span>}
              headerText={`Tax Identification Number`}
              text={`If you don't have the account holders Social Security Number (SSN) use the Organization's U.S. Federal Tax ID instead.`}
              style={{ marginTop: 30 }}
            />
            */}
          </div>
        ;
        item.component =
          <Principal
            {...this.props}
          />
        ;
        break;
      }

      case 'legalEntity': {
        item.desc =
          <div>
            <p>This information is required to process and accept payments.</p>
          </div>
        ;
        item.component =
          <LegalEntity
            {...this.props}
          />
        ;
        break;
      }

      case 'address': {
        item.desc =
          <div>
            <p>This can be your organization's physical address or an address of the primary account holder.</p>
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-circle'></span>}
              headerText={`Important`}
              text={`P.O. Boxes and PMB's CANNOT be used.`}
              style={{ marginTop: 30 }}
            />
          </div>
        ;

        item.component =
          <Address
            {...this.props}
          />
        ;
        break;
      }

      case 'connectStatus': {
        item.saveButtonLabel = <span className='buttonAlignText'>{merchantIdentString ? 'All Finished! Take Me to My Profile' : 'Check Status'} <span className='icon icon-chevron-right'></span></span>
        item.saveButtonLabelTop = item.saveButtonLabel;
        item.desc =
          <div>
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-circle'></span>}
              headerText={`Important`}
              text={`You will be notified if any additional information is required to complete the connection to your bank account.`}
              style={{ marginTop: 30 }}
            />
          </div>
        ;
        item.component =
          <ConnectStatus
            {...this.props}
          />
        ;
        item.saveButtonDisabled = !isVantivReady ? true : false;
        break;
      }

      // no default
    }

    return (
      <div className='stepContainer'>
        { this.state.saving || this.state.checkingStatus ? <Loader msg='Saving...' /> : null }
        <div className='stepStatus'>
          { !item.saveButtonDisabled ?
          <GBLink onClick={(e) => this.props.validateForm(e, this.processForm, slug)}>
            <span style={{ marginLeft: 20 }}>{item.saveButtonLabelTop}</span>
          </GBLink>
          : null }
        </div>
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            { item.icon ? <span className={`icon icon-${item.icon}`}></span> : item.customIcon }
            <div className='stepTitle'>
              <div className='numberContainer'>
                <span className='number'>Step {stepNumber}{ completed ? ':' : null}</span>
                {completed ?
                  <div className='completed'>
                    <span className='icon icon-check'></span>Completed
                  </div>
                : null }
              </div>
              {item.title}
            </div>
          </div>
          <div className='stepsSubText'>{item.desc}</div>
          <div className={`stepComponent`}>
            {item.component}
          </div>
        </div>
        { !this.state.editorOpen ?
        <div className='button-group'>
          <div className='button-item' style={{ width: 150 }}>
            { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => {
              this.props.formProp({ error: false });
              this.props.previousStep(step);
            }}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step' }</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            { slug === 'connectBank' ?
              <PlaidConnect
                {...this.props}
                checkConnectStatus={this.checkConnectStatus}
              />
            :
              this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel, disabled: item.saveButtonDisabled })
            }
          </div>
          <div className='button-item' style={{ width: 150 }}>
            { signupPhase === 'manualConnect' ?
              <GBLink onClick={this.switchToConnectBank}>
                <span className='buttonAlignText'>Connect a Bank Account<span className='icon icon-chevron-right'></span></span>
              </GBLink>
            : null }
          </div>
        </div> : null }
      </div>
    );
  }

  render() {

    return (
      <div className='stepsWrapper'>
        {this.renderStep()}
      </div>
    )
  }
}

class ConnectBankSteps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    if (util.isEmpty(this.props.legalEntity)) {
      this.props.setMerchantApp('loading', true);
      this.props.getLegalEntity({
        reload: true,
        callback: () => {
          this.props.setMerchantApp('loading', false);
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {

    const {
      legalEntity
    } = this.props;

    if (util.isLoading(legalEntity) || this.state.loading) return <Loader msg='Loading Legal Entity...' />;

    return (
      <Form id={`stepsForm`} name={`stepsForm`}>
        <ConnectBankStepsForm
          {...this.props}
        />
      </Form>
    )
  }
}

function mapStateToProps(state, props) {

  const merchantApp = util.getValue(state, 'merchantApp', {});
  const plaidAccountID = util.getValue(merchantApp, 'plaid.accountID', null);
  const legalEntity = util.getValue(state, 'resource.orgLegalEntity', {});
  const isVantivReady = util.getValue(state, 'resource.gbx3Org.data.vantiv.isVantivReady');
  const merchantIdentString = util.getValue(state, 'resource.gbx3Org.data.vantiv.merchantIdentString');
  const hasReceivedTransaction = util.getValue(state, 'resource.gbx3Org.data.hasReceivedTransaction');
  const signupPhase = util.getValue(state, 'gbx3.orgSignup.signupPhase');

  return {
    plaidAccountID,
    legalEntity,
    isVantivReady,
    merchantIdentString,
    signupPhase,
    hasReceivedTransaction
  }
}

export default connect(mapStateToProps, {
  setSignupStep,
  checkSignupPhase,
  setMerchantApp,
  getLegalEntity,
  savePrincipal,
  saveLegalEntity,
  saveAddress,
  saveBankAccount,
  checkSubmitMerchantApp
})(ConnectBankSteps);
