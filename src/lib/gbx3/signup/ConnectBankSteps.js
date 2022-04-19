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
  getSignupStep,
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
import {
  removeResource
} from '../../api/actions';
import BankAccount from './connectBank/BankAccount';
import Principal from './connectBank/Principal';
import LegalEntity from './connectBank/LegalEntity';
import Address from './connectBank/Address';
import PlaidConnect from './connectBank/PlaidConnect';
import VerifyBank from './connectBank/VerifyBank';
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
    this.getDocument = this.getDocument.bind(this);
    this.getDcoumentCallback = this.getDcoumentCallback.bind(this);

    this.state = {
      editorOpen: false,
      error: false,
      saving: false,
      loading: true,
      verifyBankUploaded: false
    };
  }

  componentDidMount() {
    const {
      signupStep,
      signupPhase,
      stepsTodo,
      step,
      completed,
      isVantivReady,
      readyToSubmitNoMID
    } = this.props;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    switch (signupPhase) {
      case 'manualConnect': {
        if (readyToSubmitNoMID 
          && signupStep === 4
        ) this.checkConnectStatus();
        if (isVantivReady && !completed.includes('verifyBank')) {
          this.props.setSignupStep('verifyBank');
        }
        break;
      }

      case 'connectBank': {
        if (readyToSubmitNoMID) this.checkConnectStatus();
        if (!completed.includes('connectBank') && slug === 'verifyBank') {
          this.props.previousStep();
        }
        break;
      }

      // no default
    }

    if (this.props.merchantIdentString) this.submerchantCreated();
  }

  componentDidUpdate(prevProps) {
    if (this.props.merchantIdentString !== prevProps.merchantIdentString) {
      this.submerchantCreated();
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }

  connectBankPlaid() {
    this.setState({ saving: false });
  }

  callbackAfter(tab) {
    this.props.formProp({ error: false });
  }

  getDcoumentCallback(slug, value, gotoNextStep) {
    switch (slug) {
      case 'verifyBank': {
        this.setState({ verifyBankUploaded: value }, async () => {
          if (value) {
            const updated = await this.props.stepCompleted(slug);
            if (updated) {
              this.checkConnectStatus();
            }
           }
        });
        break;
      }

      // no default
    }
  }

  async getDocument(slug, showLoading = true, gotoNextStep = false) {
    let filter = '';
    switch (slug) {
      case 'verifyBank': {
        filter = 'tag:"bank_account"';
        break;
      }
    }
    const initLoading = showLoading ? await this.props.setMerchantApp('underwritingDocsLoading', true) : true;
    if (initLoading) {
      this.props.getResource('underwritingDocs', {
        id: [this.props.orgID],
        reload: true,
        search: {
          filter,
          sort: 'createdAt',
          order: 'desc'
        },
        callback: (res, err) => {
          const data = util.getValue(res, 'data', []);
          const item = util.getValue(data, 0, {});
          if (!util.isEmpty(item) && !err) {
            if (this.getDcoumentCallback) this.getDcoumentCallback(slug, true, gotoNextStep);
          } else {
            if (this.getDcoumentCallback) this.getDcoumentCallback(slug, false);
          }
          this.props.setMerchantApp('underwritingDocsLoading', false);
        }
      });
    }
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
      connectLoader,
      readyToSubmitNoMID
    } = this.props;

    if (!connectLoader && readyToSubmitNoMID) this.props.setMerchantApp('connectLoader', true);

    this.setState({ saving: false }, () => {
      this.props.checkSubmitMerchantApp({
        callback: (message, err) => {
          if (message === 'submerchant_created' || message === 'has_mid') {
            if (!completed.includes('connectBank')) this.props.stepCompleted('connectBank');
            if (signupStep !== 4 && signupPhase === 'manualConnect') this.props.setSignupStep('verifyBank');
          } else if (err || message === 'cannot_submit_to_vantiv' || message === 'mid_notcreated') {
            if (signupPhase !== 'manualConnect') this.switchToManualBank();
            this.props.formProp({ error: true, errorMsg: <span>We are unable to connect your bank account with Plaid. Please manually connect a bank account and check that all your information is correct and try again in a few minutes.<br />{util.getValue(err, 'data.message', '')}</span> });
          } else if (message === 'verify_bank_required') {
            this.props.setSignupStep('verifyBank');
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

      // no default
    }
  }

  renderStep() {
    const {
      verifyBankUploaded
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
      completed: completedSteps,
      connectBankCompleted
    } = this.props;

    const connectLoader = this.props.connectLoader;
    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const stepNumber = +step + 1;
    const isStepCompleted = completedSteps.includes(slug) ? true : false;
    const firstStep = step === 0 ? true : false;

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

    switch (slug) {
      case 'connectBank': {
        if (connectBankCompleted) {
          item.desc = '';
        } else {
          item.desc = hasTransacitons ? 'Congratulations, you have received your first donations with Givebox!' : 'Your Merchant Processing Account Requires a Bank Account to Receive Money.';    
          item.component =
            <div>
              { !completedSteps.includes('connectBank') ?            
                <div className='fieldGroup'>
                  {hasTransacitons}
                  We highly recommend you connect with Plaid. 
                  Plaid is a secure service where you simply login to your bank account and connect it to Givebox. 
                  If you cannot find your bank account with Plaid then you will need to manually connect one.
                </div>
              :
                <div className='fieldGroup flexCenter'>
                  You have successfully connected a bank account! 
                  Next step is to upload a photo of your bank statement.
                </div>
              }
              <ConnectBankHelp />
            </div>
          ;
        }
        break;
      }

      case 'verifyBank': {
        item.saveButtonDisabled = !verifyBankUploaded ? true : false;
        item.saveButton =
          <div style={{ marginTop: 0 }} className='button-group'>
            <GBLink
              className='button'
              disabled={item.saveButtonDisabled}
              onClick={() => {
                console.log('Complete verify');
              }}
            >
              Finished
            </GBLink>
          </div>
        ;
        item.desc = 'Please upload a bank statement of the account you connected to Givebox.';
        item.component =
          <div>
            <ConnectBankHelp
              content={{
                linkText: 'Why Do I have to Upload a Bank Statement?',
                title: 'Your Bank Statement Verifies the Bank Account You Connected',
                text: 
                  <span>
                    When you upload a photo of your bank statement and the information matches the bank account you connected to Givebox, this verifies a fraudulent account has not been added.
                    <span style={{ display: 'block', marginTop: 5 }}>
                      We want to make sure you receive the money you collected and not transferred to a fraudulent account. 
                    </span>
                  </span>
              }}
            />
            <div style={{ marginTop: 20 }} className='fieldGroup'>
              <VerifyBank
                {...this.props}
                getDocument={this.getDocument}
              />
            </div>
          </div>
        ;
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

      // no default
    }

    if (connectBankCompleted) {
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
    }

    // All steps completed and ready to submit to Vantiv
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
    // Has MID and just needs to complete connectBank phase
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
            Take Me to My Fundraiser
          </GBLink>
        </div>
      ;
    } else if (connectLoader) {
      item.desc = 'Encyryption Sequence in Progress...';
      item.component = 
        <div className='flexCenter flexColumn'>
          <div className='fieldGroup'>
            Please do not close this overlay, navigate away from this page, or close the browser while in progress. 
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
            {isStepCompleted ?
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
            { slug === 'connectBank' ?
              !connectLoader && !completedSteps.includes('connectBank') ?
                <div style={{ marginTop: 0, paddingTop: 0 }} className='button-group'>
                  <PlaidConnect
                    {...this.props}
                    saveStep={this.saveStep}
                    checkConnectStatus={this.checkConnectStatus}
                  />
                  <GBLink className='button' onClick={this.switchToManualBank}>
                    Manually Connect Bank Account
                  </GBLink>
                </div> 
              :
                !connectLoader && connectBankCompleted ?
                  item.saveButton
                :
                <GBLink 
                  className='button' 
                  onClick={() => {
                    this.props.gotoNextStep();
                  }}
                >
                  Continue to Upload Bank Statement
                </GBLink>
            :
              item.saveButton || this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel, disabled: item.saveButtonDisabled })
            }
          </div>
          <div className='rightSide' style={{ width: 150 }}>
            { signupPhase === 'manualConnect' ?
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

  const orgID = util.getValue(state, 'gbx3.info.orgID');
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
  const readyToSubmitNoMID = isVantivReady && !merchantIdentString && util.getValue(props, 'completed', []).includes('verifyBank') ? true : false;
  const connectBankCompleted = 
  props.completed.includes('connectBank')
  && props.completed.includes('verifyBank') ? true : false;


  return {
    orgID,
    plaidAccountID,
    legalEntity,
    isVantivReady,
    merchantIdentString,
    signupPhase,
    signupStep,
    hasReceivedTransaction,
    instantStatus,
    phaseEndsAt,
    connectLoader,
    readyToSubmitNoMID,
    connectBankCompleted
  }
}

export default connect(mapStateToProps, {
  getSignupStep,
  setSignupStep,
  checkSignupPhase,
  setMerchantApp,
  getLegalEntity,
  savePrincipal,
  saveLegalEntity,
  saveAddress,
  saveBankAccount,
  checkSubmitMerchantApp,
  removeResource
})(ConnectBankSteps);
