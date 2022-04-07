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
import ConnectBankHelp from './ConnectBankHelp';

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
    this.hasMerchantIdentStringSave = this.hasMerchantIdentStringSave.bind(this);

    this.state = {
      editorOpen: false,
      error: false,
      saving: false,
      loading: true
    };
  }

  componentDidMount() {
    if (!this.props.merchantIdentString && this.props.signupPhase === 'manualConnect' && this.props.isVantivReady && this.props.signupStep === 4) this.checkConnectStatus();

    if (this.props.merchantIdentString) this.submerchantCreated();
  }

  componentDidUpdate(prevProps) {
    if (this.props.merchantIdentString !== prevProps.merchantIdentString) {
      this.submerchantCreated();
    }
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
    this.props.formProp({ error: false });
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
      signupPhase,
      completed,
      isVantivReady,
      connectLoader
    } = this.props;

    if (!connectLoader && isVantivReady) this.props.setMerchantApp('connectLoader', true);

    this.setState({ saving: false }, () => {
      this.props.checkSubmitMerchantApp({
        callback: (message, err) => {
          if (message === 'submerchant_created' || message === 'has_mid') {
            if (!completed.includes('connectBank')) this.props.stepCompleted('connectBank');
            if (signupStep !== 4 && signupPhase === 'manualConnect') this.props.setSignupStep('connectStatus');
          } else if (err || message === 'cannot_submit_to_vantiv' || message === 'mid_notcreated') {
            if (signupPhase !== 'manualConnect') this.switchToManualBank();
            this.props.formProp({ error: true, errorMsg: <span>We are unable to connect your bank account with Plaid. Please manually connect a bank account and check that all your information is correct and try again in a few minutes.<br />{util.getValue(err, 'data.message', '')}</span> });
          }
          this.props.setMerchantApp('connectLoader', false);
        }
      });
    });
  }

  async submerchantCreated(delay = 5000) {
    if (!this.props.completed.includes('connectBank') && this.props.merchantIdentString) {
      this.props.stepCompleted('connectBank');
    }
    const completed = await this.props.stepCompleted('connectStatus', false);
    if (completed) {
      setTimeout(async () => {
        /*
        const updated = await this.props.updateOrgSignup({ signupPhase: 'transferMoney' }, 'connectBank');
        if (updated) {
          this.props.toggleModal('orgConnectBankSteps', false);
          this.props.checkSignupPhase({
            forceStep: 0,
            openAdmin: true,
            openModal: true
          });
          this.props.saveOrg({
            orgUpdated: true,
            isSending: true,
            callback: () => {
            }
          });
        }
        */
      }, delay);
    }
  }

  async hasMerchantIdentStringSave(stepCompleted = 'connectStatus', openModal = true) {
    this.setState({ saving: false });
    const completed = await this.props.stepCompleted(stepCompleted, false);
    if (completed) {
      const updated = await this.props.updateOrgSignup({ signupPhase: 'transferMoney' }, 'connectBank');
      if (updated) {
        this.props.toggleModal('orgConnectBankSteps', false);
        this.props.checkSignupPhase({
          forceStep: 0,
          openAdmin: true,
          openModal
        });
        this.props.saveOrg({
          orgUpdated: true,
          isSending: true,
          callback: () => {
          }
        });
      }
    }
  }

  async saveStep(slug, delay = 1000, error = false) {
    this.setState({ saving: false });
    if (error) {
      return false;
    }

    const completedStep = await this.props.stepCompleted(slug);
    if (completedStep) {
      setTimeout(() => {
        this.props.gotoNextStep();
      }, delay);
    } else {
      this.props.gotoNextStep();
    }
  }

  saveCallback(res, err, group) {
    const {
      formState
    } = this.props;

    const hasBeenUpdated = util.getValue(formState, 'updated');

    if (!err) {
      this.checkConnectStatus();
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
            this.hasMerchantIdentStringSave();
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
      phaseEndsAt,
      completed: completedSteps
    } = this.props;

    const connectLoader = this.props.connectLoader;
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
      saveButtonDisabled: false,
      customSaveButton: null
    };

    const diff = Moment.unix(phaseEndsAt).utc().diff(Moment.utc(), 'days');
    const numberDaysLeft = diff > 5 ? 5 : diff < 0 ? 0 : diff;
    const lastDay = diff === 0 ? true : false;
    const diffDisplay = lastDay ? 'This is the Last Day' : `You Have ${numberDaysLeft} Day${numberDaysLeft > 1 ? 's' : ''}`;
    const daysLeftDisplay = `${diffDisplay} to Connect a Bank Account or the Money You Received will be Refunded.`;
    const hasTransacitons = 
      hasReceivedTransaction
      && diff >= 0
      && ( instantStatus === 'enabled' ) ?
        <div style={{ marginBottom: 20 }} className='flexCenter flexColumn'>
          { phaseEndsAt ? <span style={{ fontWeight: 500, color: lastDay ? 'red' : null }}>{daysLeftDisplay}</span> : null }
        </div>
      : null
    ;

    const connectBankCompleted = this.props.completed.includes('connectBank') ? true : false;    

    switch (slug) {
      case 'connectBank': {
        if (connectBankCompleted) {
          item.desc = '';
          item.component =
            <div>
              <div className='fieldGroup'>
                <ConnectStatus
                  {...this.props}
                  previousStepMessage={' '}
                />
              </div>         
            </div>
          ;
        } else {
          item.desc = hasTransacitons ? 'Congratulations, you have received your first donations with Givebox!' : 'Your Merchant Processing Account Requires a Bank Account to Receive Money.';    
          item.component =
            <div>
              { !this.props.completed.includes('connectBank') ?            
                <div className='fieldGroup'>
                  {hasTransacitons}
                  We highly recommend you connect with Plaid. 
                  Plaid is a secure service where you simply login to your bank account and connect it to Givebox. 
                  If you cannot find your bank account with Plaid then you will need to manually connect one.
                </div>
              :
                <div className='fieldGroup flexCenter'>
                  You have successfully connected a bank account! 
                  Please continue to check the status of it being connected to Givebox.
                </div>
              }
              <ConnectBankHelp />
            </div>
          ;
        }
        break;
      }

      case 'addBank': {
        item.desc = 'Please enter your Organizations bank account information.';
        item.component =
          <div>
            {hasTransacitons}
            <ConnectBankHelp />
            <div style={{ marginTop: 20 }} className='fieldGroup'>
              <BankAccount
                {...this.props}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'principal': {
        item.desc = 'Please enter the primary account holders information.';
        item.component =
          <div>
            <div className='flexCenter fieldGroup'>
              The person with authority to manage your organization and handle the money.
            </div>
            <ConnectBankHelp />
            <div style={{ marginTop: 20 }} className='fieldGroup'>
              <Principal
                {...this.props}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'legalEntity': {
        item.desc = 'Please enter details about your Organization/Nonprofit.';
        item.component =
          <div>
            <ConnectBankHelp />
            <div style={{ marginTop: 20 }} className='fieldGroup'>       
              <LegalEntity
                {...this.props}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'address': {
        item.desc = `Please enter a physical address for your Organization.`;
        item.component =
          <div>
            <div className='flexCenter fieldGroup'>
              This can be your organization's physical address or an address of the primary account holder.
            </div>
            <ConnectBankHelp />
            <div style={{ marginTop: 20 }} className='fieldGroup'>
              <Address
                {...this.props}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'connectStatus': {
        item.saveButtonLabel = <span className='buttonAlignText'>{merchantIdentString ? 'Continue to Secure Your Account' : isVantivReady ? 'Check Connection Status' : 'Complete Previous Steps' }</span>;
        item.desc = '';
        item.component =
          <div>
            <div className='fieldGroup'>
              <ConnectStatus
                {...this.props}
              />
            </div>         
          </div>
        ;
        break;
      }

      // no default
    }

    if (isVantivReady && !merchantIdentString && connectBankCompleted && !connectLoader) {
      item.saveButton =
        <GBLink 
          className='button' 
          onClick={() => {
            this.props.setMerchantApp('connectLoader', true);
            this.checkConnectStatus();
          }}
        >
          Check Your Bank Account Connection to Givebox
        </GBLink>
      ;
    } else if (merchantIdentString && connectBankCompleted && !connectLoader) {
      item.saveButton =
        <div style={{ marginTop: 0 }} className='button-group'>
          <GBLink 
            className='button' 
            onClick={() => {
              this.hasMerchantIdentStringSave('connectBank', false);
            }}
          >
            Close
          </GBLink>
          <GBLink 
            className='button' 
            onClick={() => {
              this.hasMerchantIdentStringSave('connectBank', false);
            }}
          >
            Take Me to My Fundraiser Page
          </GBLink>
        </div>
      ;
    } else if (connectLoader) {
      item.desc = 'Please wait while we connect your bank account to Givebox...';    
      item.component = 
        <div className='flexCenter flexColumn'>
          <div className='fieldGroup'>
            Please do not close this overlay, navigate away from the page, or close the browser while it connects. 
          </div>
          <Image
            url={'https://cdn.givebox.com/givebox/public/images/step-loader.png'}
            maxSize={250}
            alt='Saving Progress'
            className='stepLoader'
          />
        </div>
      ;
    }

    return (
      <div className='stepContainer'>
        { this.state.saving ? <Loader msg='Saving step checking...' /> : null }
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
            { !firstStep && !connectBankCompleted ? <GBLink className={`link`} disabled={firstStep} onClick={() => {
              this.props.formProp({ error: false });
              this.props.previousStep(step);
            }}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step' }</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            { slug === 'connectBank'  || slug === 'connectStatus' ?
              !connectLoader && !connectBankCompleted ?
                <div style={{ marginTop: 0, paddingTop: 0 }} className='button-group'>
                  <PlaidConnect
                    {...this.props}
                    checkConnectStatus={this.checkConnectStatus}
                  />
                  <GBLink className='button' onClick={this.switchToManualBank}>
                    Manually Connect Bank Account
                  </GBLink>
                </div> 
              :
                !connectLoader && connectBankCompleted ?
                  item.saveButton
                :  null
            :
              this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel, disabled: item.saveButtonDisabled })
            }
          </div>
          <div className='rightSide' style={{ width: 150 }}>
            { signupPhase === 'manualConnect' && !this.props.completed.includes('connectStatus') ?
              <GBLink onClick={this.switchToConnectBank}>
                <span className='buttonAlignText'>Quick Connect with Plaid<span className='icon icon-chevron-right'></span></span>
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
  const phaseEndsAt = instantPhase === 1 && instantStatus === 'enabled' ? util.getValue(instant, 'phaseEndsAt', null) : null;
  const connectLoader = util.getValue(state, 'merchantApp.connectLoader', false);

  return {
    plaidAccountID,
    legalEntity,
    isVantivReady,
    merchantIdentString,
    signupPhase,
    signupStep,
    hasReceivedTransaction,
    instantStatus,
    phaseEndsAt,
    connectLoader
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
