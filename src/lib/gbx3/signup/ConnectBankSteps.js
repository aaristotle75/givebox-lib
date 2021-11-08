import React from 'react';
import { connect } from 'react-redux';
import Form from '../../form/Form';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import Icon from '../../common/Icon';
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
import Moment from 'moment';
import { MdCheckCircle } from 'react-icons/md';

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
    //if (this.props.signupPhase === 'manualConnect' && this.props.isVantivReady) this.checkConnectStatus();
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

    const {
      signupStep,
      signupPhase
    } = this.props;

    this.setState({ checkingStatus: true }, () => {

      this.props.checkSubmitMerchantApp({
        callback: (message, err) => {
          if (message === 'submerchant_created') {
            this.submerchantCreated();
          } else if (message === 'has_mid') {
            this.submerchantCreated(0);
          } else if (err || message === 'cannot_submit_to_vantiv' || message === 'mid_notcreated') {
            if (signupPhase !== 'manualConnect') this.switchToManualBank();
            if (signupStep === 4) this.props.formProp({ error: true, errorMsg: 'We are unable to connect your bank account. Please check that all your information is correct and try again in a few minutes.' });
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
      merchantIdentString,
      isVantivReady
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
        if (!isVantivReady) {
          this.props.previousStep(step);
          return this.setState({ saving: false });
        } else {
          if (merchantIdentString) {
            if (!this.props.completed.includes(group)) {
              this.submerchantCreated(1000);
            } else {
              this.props.toggleModal('orgConnectBankSteps', false);
            }
          } else {
            this.checkConnectStatus();
          }
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
      hasReceivedTransaction,
      instantStatus,
      phaseEndsAt
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
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue</span>,
      saveButtonDisabled: false
    };

    const phaseEnds = phaseEndsAt; // 1622719816
    //const now = Math.floor(Date.now() /1000);
    const endsAt = Moment.unix(phaseEnds).utc();
    const now = Moment.utc();
    const diff = endsAt.diff(now, 'days');
    const lastDay = diff === 0 ? true : false;
    const diffDisplay = lastDay ? 'This is the Last Day' : `You Have ${diff} Day${diff > 1 ? 's' : ''}`;
    const daysLeftDisplay = `${diffDisplay} to Connect a Bank Account or the Money You Received will be Refunded.`;

    switch (slug) {
      case 'connectBank': {
        item.saveButtonLabel = <span className='buttonAlignText'>Connect Bank Account</span>;
        item.desc = 'Connect your bank account to continue to process and transfer money.';
        item.component =
          <div className='fieldGroup'>
            { hasReceivedTransaction ? <p>Congratulations, you have received your first transactions with Givebox!</p> : null }
            { hasReceivedTransaction && phaseEndsAt ? <p style={{ fontWeight: 500, color: lastDay ? 'red' : null }}>{daysLeftDisplay}</p> : null }
          </div>
        ;
        break;
      }

      case 'addBank': {
        item.desc = 'Manually connect a bank account to continue to process and transfer money.';
        item.component =
          <div className='fieldGroup'>
            { hasReceivedTransaction ? <p>Congratulations, you have received your first transactions with Givebox!</p> : null }
            { hasReceivedTransaction && phaseEndsAt ? <p style={{ fontWeight: 500, color: lastDay ? 'red' : null }}>{daysLeftDisplay}</p> : null }
            <BankAccount
              {...this.props}
            />
          </div>
        ;
        break;
      }

      case 'principal': {
        item.desc = 'The primary account holder is a person on the bank account or someone with authority to manage the organization and handle the money.';
        item.component =
          <Principal
            {...this.props}
          />
        ;
        break;
      }

      case 'legalEntity': {
        item.desc = 'Please enter the following details about your Nonprofit/Business.';
        item.component =
          <LegalEntity
            {...this.props}
          />
        ;
        break;
      }

      case 'address': {
        item.desc = `This can be your organization's physical address or an address of the primary account holder.`;
        item.component =
          <div className='fieldGroup'>
            <Address
              {...this.props}
            />
          </div>
        ;
        break;
      }

      case 'connectStatus': {
        item.saveButtonLabel = <span className='buttonAlignText'>{merchantIdentString ? 'All Finished! Take Me to My Profile' : isVantivReady ? 'Check Status' : 'Complete Previous Steps' }</span>;
        item.desc = '';
        item.component =
          <div className='fieldGroup'>
            <ConnectStatus
              {...this.props}
            />
          </div>
        ;
        break;
      }

      // no default
    }

    return (
      <div className='stepContainer'>
        { this.state.saving || this.state.checkingStatus ? <Loader msg='Saving...' /> : null }
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            {completed ?
              <div className='completed'>
                <Icon><MdCheckCircle /></Icon> <span className='completedText'>Step {stepNumber} Completed</span>
              </div>
            :
            <div className='stepTitle'>
              {item.desc}
            </div>
            }
          </div>
          <div className={`stepComponent`}>
            {item.component}
          </div>
        </div>
        { !this.state.editorOpen ?
        <div className='button-group'>
          <div className='leftSide' style={{ width: 150 }}>
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
          <div className='rightSide' style={{ width: 150 }}>
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
      <Form id={`stepsForm`} name={`stepsForm`} options={{ leftBar: true }}>
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
  const signupStep = util.getValue(state, 'gbx3.orgSignup.step', 0);
  const instant = util.getValue(state, 'resource.gbx3Org.data.instantFundraising', {});
  const instantPhase = util.getValue(instant, 'phase');
  const instantStatus = instantPhase === 1 ? util.getValue(instant, 'status', null) : null;
  const phaseEndsAt = instantPhase == 1 && instantStatus === 'enabled' ? util.getValue(instant, 'phaseEndsAt', null) : null;

  return {
    plaidAccountID,
    legalEntity,
    isVantivReady,
    merchantIdentString,
    signupPhase,
    signupStep,
    hasReceivedTransaction,
    instantStatus,
    phaseEndsAt
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
