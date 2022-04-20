import React from 'react';
import { connect } from 'react-redux';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import Icon from '../../common/Icon';
import Identity from './transferMoney/Identity';
import VerifyBusiness from './transferMoney/VerifyBusiness';
import TwoFA from '../../common/TwoFA';
import TransferStatus from './transferMoney/TransferStatus';
import {
  setSignupStep,
  updateOrgSignup
} from '../redux/gbx3actions';
import {
  setMerchantApp
} from '../redux/merchantActions';
import {
  getResource,
  sendResource
} from '../../api/helpers';
import {
  openLaunchpad,
  removeResource
} from '../../api/actions';
import AnimateHeight from 'react-animate-height';
import { MdCheckCircle } from 'react-icons/md';
import SecureAccountHelp from './SecureAccountHelp';

class TransferMoneyStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);
    this.getDocument = this.getDocument.bind(this);
    this.getDcoumentCallback = this.getDcoumentCallback.bind(this);
    this.set2FAVerified = this.set2FAVerified.bind(this);
    this.checkApprovalStatus = this.checkApprovalStatus.bind(this);
    this.approvedForTransfersFinish = this.approvedForTransfersFinish.bind(this);
    this.gotoLastStep = this.gotoLastStep.bind(this);

    this.state = {
      editorOpen: false,
      error: false,
      saving: false,
      loading: true,
      identityUploaded: false,
      verifyBankUploaded: false,
      verifyBusinessUploaded: false,
      is2FAVerified: props.is2FAVerified,
      isCheckingStatus: false,
      checkingStatusNotApprovedYetMessage: false,
      missionCountriesShow: props.missionCountries ? 2 : 1,
      readyToCheckApproval: props.readyToCheckApproval,
      approvedForTransfers: props.approvedForTransfers
    };
  }

  componentDidMount() {
    const {
      completed,
      step,
      stepsTodo
    } = this.props;

    const {
      readyToCheckApproval,
      approvedForTransfers
    } = this.state;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    if (slug === 'protect'
    && completed.includes('protect')
    && !completed.includes('identity')) {
      this.props.setSignupStep('identity');
    }

    if (readyToCheckApproval && !approvedForTransfers) {
      this.props.setHideCloseBtn(true);
      this.gotoLastStep();
      this.checkApprovalStatus();
    } else if (approvedForTransfers) {
      this.props.setHideCloseBtn(true);
      this.gotoLastStep();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.requiredSteps.every(c => prevProps.completed.includes(c))
    && this.props.requiredSteps.every(c => this.props.completed.includes(c))) {
      this.setState({ readyToCheckApproval: true });
      this.props.setHideCloseBtn(true);
      this.gotoLastStep();
      this.checkApprovalStatus();
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }

  callbackAfter(tab) {
    this.props.formProp({ error: false });
  }

  gotoLastStep() {
    this.props.updateOrgSignup({ step: this.props.numStepsTodo - 1 });
  }

  set2FAVerified(is2FAVerified) {
    this.setState({ is2FAVerified }, () => {
      if (is2FAVerified) this.props.stepCompleted('protect');
    });
  }

  getDcoumentCallback(slug, value, gotoNextStep) {
    switch (slug) {
      case 'identity': {
        this.setState({ identityUploaded: value }, async () => {
          if (value) {
           const updated = await this.props.stepCompleted(slug);
           if (updated && gotoNextStep) this.props.gotoNextStep();
          }
        });
        break;
      }

      case 'verifyBank': {
        this.setState({ verifyBankUploaded: value }, async () => {
          if (value) {
            const updated = await this.props.stepCompleted(slug);
            if (updated && gotoNextStep) this.props.gotoNextStep();
           }
        });
        break;
      }

      case 'verifyBusiness': {
        this.setState({ verifyBusinessUploaded: value }, async () => {
          if (value) {
            const updated = await this.props.stepCompleted(slug);
            if (updated && gotoNextStep) this.props.gotoNextStep();
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
      case 'identity': {
        filter = 'tag:"proof_of_id"';
        break;
      }

      case 'verifyBank': {
        filter = 'tag:"bank_account"';
        break;
      }

      case 'verifyBusiness': {
        filter = 'tag:"proof_of_taxID"'
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

  checkApprovalStatus() {
    this.setState({ isCheckingStatus: true }, () => {
      this.props.getResource('org', {
        customName: 'gbx3Org',
        reload: true,
        callback: async (res, err) => {
          const underwritingStatus = util.getValue(res, 'underwritingStatus');
          const hasBankInfo = util.getValue(res, 'hasBankInfo');
          if (underwritingStatus === 'approved' && hasBankInfo) {
            this.setState({ saving: false, isCheckingStatus: false, approvedForTransfers: true });
          } else {
            this.setState({ saving: false });
            setTimeout(() => {
              this.setState({ isCheckingStatus: false }, () => {
                this.setState({ checkingStatusNotApprovedYetMessage: true }, () => {
                  setTimeout(() => {
                    this.setState({ checkingStatusNotApprovedYetMessage: false });
                  }, 8000);                  
                });
              });
            }, 10000);
          }
        }
      });
    });
  }

  async approvedForTransfersFinish(manageMoney = false) {
    const {
      approvedForTransfers
    } = this.state;

    if (approvedForTransfers) {
      this.setState({ saving: false }, async () => {
        const updated = await this.props.updateOrgSignup({}, 'transferMoney');
        if (updated) {
          this.props.stepCompleted('transferMoney');
          this.props.toggleModal('orgTransferSteps', false);
          if (manageMoney) this.props.openLaunchpad({ autoOpenSlug: 'money' });
        }
      });
    } else {
      this.checkApprovalStatus();
    }
  }

  async saveStep(slug, delay = 1000, data, test) {
    const completedStep = await this.props.stepCompleted(slug, true, data, test);
    if (completedStep) {
      setTimeout(() => {
        this.setState({ saving: false }, () => {
          this.props.gotoNextStep();
        });
      }, delay);
    } else {
      this.setState({ saving: false }, this.props.gotoNextStep);
    }
  }

  async processForm(fields, callback, group) {
    util.toTop('modalOverlay-orgTransferSteps');
    this.setState({ saving: true });

    const {
      step,
      stepsTodo,
      formState,
      approvedForTransfers,
      orgID
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

      case 'transferStatus': {
        break;
      }

      case 'verifyWeb': {
        this.setState({ saving: true }, () => {
          this.props.sendResource('org', {
            data,
            method: 'patch',
            isSending: false,
            callback: async (res, err) => {
              const updated = await this.props.stepCompleted(slug, true, data);
              if (updated) {
                this.props.gotoNextStep();
                this.props.getResource('org', {
                  orgID,
                  reload: true,
                  customName: 'gbx3Org'
                });
              }
            }
          });
        });
        break;
      }

      case 'missionCountries': {
        this.setState({ saving: true }, () => {
          this.props.sendResource('org', {
            data,
            method: 'patch',
            isSending: false,
            callback: async (res, err) => {
              const updated = await this.props.stepCompleted(slug, true, data);
              if (updated) {
                this.props.gotoNextStep();
                this.props.getResource('org', {
                  orgID,
                  reload: true,
                  customName: 'gbx3Org'
                });
              }
            }
          });
        });

        break;
      }

      default: {
        return this.saveStep(group);
      }
    }
  }

  renderStep() {
    const {
      loading,
      identityUploaded,
      verifyBankUploaded,
      verifyBusinessUploaded,
      is2FAVerified,
      isCheckingStatus,
      checkingStatusNotApprovedYetMessage,
      missionCountriesShow,
      readyToCheckApproval,
      approvedForTransfers
    } = this.state;

    const {
      step,
      open,
      isMobile,
      stepsTodo,
      completedPhases,
      websiteURL,
      missionCountries,
      completed: completedSteps
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

    const library = {
      saveMediaType: 'org',
      borderRadius: 0
    };

    switch (slug) {
      case 'identity': {
        item.saveButtonDisabled = !identityUploaded ? true : false;
        item.desc = `Please upload a photo ID of the account holder.`;
        item.component =
          <div>
            <SecureAccountHelp 
              content={{
                linkText: 'Why Do I have to Upload a Photo ID?',
                title: 'A Photo ID Protects You Against Identity Theft',
                text: 
                  <span>
                    When you upload a photo identification and the information matches the primary account holder, this protects you against identity theft.
                    <span style={{ display: 'block', marginTop: 5 }}>
                      We want to make sure you and not someone else created your Givebox account. 
                    </span>
                  </span>
              }}
            />              
            <div style={{ marginTop: 20 }} className='fieldGroup'>
              <Identity
                {...this.props}
                getDocument={this.getDocument}
              />
            </div>         
          </div>
        ;
        break;
      }

      case 'verifyBank': {
        item.saveButtonDisabled = !verifyBankUploaded ? true : false;
        item.desc = 'Please upload a bank statement of the account you connected to Givebox.';
        item.component =
          <div>
            <SecureAccountHelp 
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
              Verify Bank Step (Deprecated)
            </div>
          </div>
        ;
        break;
      }

      case 'verifyBusiness': {
        item.saveButtonDisabled = !verifyBusinessUploaded ? true : false;
        item.desc = 'Please upload proof of the formation of your Organization.';
        item.component =
          <div>
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              <VerifyBusiness
                {...this.props}
                getDocument={this.getDocument}
              />
            </div>
            <SecureAccountHelp 
              content={{
                linkText: 'Why Do I have to Upload Proof of Organization?',
                title: 'Proof of Formation Protects Against Tax ID Highjacking',
                text: 
                  <span>
                    Uploading proof of formation of your Organization protects you against someone else using your Tax ID to collect money.
                    <span style={{ display: 'block', marginTop: 5 }}>
                      We want to make sure your Tax ID was not highjacked by someone else for fraud.
                    </span>
                  </span>
              }}
            />
          </div>
        ;
        break;
      }

      case 'verifyWeb': {
        item.component =
          <div>
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              {this.props.textField('websiteURL', {
                group: 'verifyWeb',
                fixedLabel: true,
                label: 'Website URL',
                placeholder: 'Type Website or Social Media URL',
                validate: 'url',
                maxLength: 128,
                value: websiteURL || '',
                required: true,
                leftBar: true
              })}
            </div>
            <SecureAccountHelp 
              content={{
                linkText: 'Why Do I have to Add a Website Link?',
                title: 'Most Valid Organizations Have a Web Presence',
                text: 
                  <span>
                    Having a public web presence can help verify the legitimacy of your Organization.
                  </span>
              }}
            />           
          </div>
        ;
        break;
      }

      case 'missionCountries': {

        item.desc = 'Does your Organization/Nonprofit service countries outside of the USA?';
        item.component =
          <div>
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              <Dropdown
                name='missionCountriesShow'
                className='articleCard'
                label={'Service countries outside the USA/Canada'}
                fixedLabel={false}
                fixedLabelHasValue={true}
                defaultValue={missionCountriesShow}
                onChange={(name, value) => {
                  const missionCountriesShow = parseInt(value);
                  if (missionCountriesShow === 2) this.props.fieldProp('missionCountries', { required: true, error: false });
                  else this.props.fieldProp('missionCountries', { required: false, error: false });
                  this.setState({ missionCountriesShow });
                }}
                options={[
                  { primaryText: 'No', value: 1 },
                  { primaryText: 'Yes', value: 2 }
                ]}
                showCloseBtn={false}
                leftBar={true}
              />
              <AnimateHeight height={missionCountriesShow === 2 || missionCountries ? 'auto' : 0}>
                {this.props.richText('missionCountries', {
                  group: 'missionCountries',
                  required: missionCountriesShow === 2 ? true : false,
                  fixedLabel: false,
                  label: 'Countries Serviced Outside USA/Canada',
                  placeholder: 'Type the countries your Business/Nonprofit services that are outside the USA/Canada.',
                  wysiwyg: false,
                  autoFocus: false,
                  value: missionCountries
                })}
              </AnimateHeight>
            </div>
            <SecureAccountHelp 
              content={{
                linkText: 'Why Are You Asking Me About Using Funds Outside the USA?',
                title: `Givebox's Legal Obligation To Protect Against the Funding of Terrorist Organizations`,
                text: 
                  <span>
                    All US financial institutions such as banks, credit card issuers and transaction processors such as Givebox are required by law to 
                    know where funds are being used outside the USA behind any and all Accounts into which money is collected.      
                 </span>
              }}
            />
          </div>
        ;
        break;
      }

      case 'protect': {
        item.saveButtonDisabled = !is2FAVerified ? true : false;
        item.saveButtonLabel = null;
        item.desc = 'To protect your account we use two-factor authentication.';
        item.component =
          <div>
            <div style={{ marginBottom: 20 }}>
              <SecureAccountHelp
                content={{
                  linkText: 'Why Do I Need Two Factor Authentication?',
                  title: 'Two Factor Authentication Protects Your Account From Fraudulent Access',
                  text: 
                    <span>
                      Using two factor authentication with your mobile number prevents a fraudulent user from accessing your account.
                    </span>
                }}
              />
            </div>
            <div style={{ marginBottom: 0 }} className='flexCenter flexColumn'>
              { !is2FAVerified ?
                <TwoFA
                  hideRadio={true}
                  set2FAVerified={this.set2FAVerified}
                  successCallback={async () => {
                    this.setState({ is2FAVerified: true }, async () => {
                      const updated = await this.props.stepCompleted(slug);
                      if (updated && !completedSteps.includes('identity')) this.props.setSignupStep('identity');
                    });
                  }}
                />
              :
                <span>
                  Your account is protected with two-factor authentication.
                </span>
              }  
            </div>
          </div>
        ;
        break;
      }

      // no default
    }

    if (readyToCheckApproval) {
      item.desc = isCheckingStatus ? 
        'We are verifying everything you submitted.' 
      : 
        checkingStatusNotApprovedYetMessage ?
          'We apologize but your identity is still being verified...'
        :
          'Your identity is being verified and can take up to 5 business days.'
      ;
      item.component = 
        <div>
          <div className='flexCenter'>
            { isCheckingStatus ?
              <div className='flexCenter flexColumn'>
                <span className='green'>Please wait while we check verification status...</span>
                <Image
                  url={'https://cdn.givebox.com/givebox/public/images/step-loader.png'}
                  maxSize={250}
                  alt='Checking Status...'
                  className='stepLoader'
                  style={{ marginTop: 10 }}
                />  
              </div>
            :
              !checkingStatusNotApprovedYetMessage ? 
                <span>In the meantime we suggest you share your fundraiser and raise money.</span>
              : 
                <span>You will recevie an email notification when verification is complete.</span>
            }
          </div>
          <TransferStatus
            {...this.props}
          />
        </div>
      ;      
    }

    if (approvedForTransfers) {
      item.desc = 'Congratulations your identity has been verified!';
      item.component = 
        <div>
          <div className='flexCenter'>
            You are enabled to transfer money and your Givebox merchant processing account is fully approved.
          </div>
        </div>
      ;
    }

    return (
      <div className='stepContainer'>
        { this.state.saving ? <Loader msg='Saving...' /> : null }
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            {completed && !readyToCheckApproval && !approvedForTransfers ?
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
            { !firstStep && !readyToCheckApproval && !approvedForTransfers ? <GBLink className={`link`} disabled={firstStep} onClick={() => {
              this.props.formProp({ error: false });
              this.props.previousStep(step);
            }}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step' }</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            { !approvedForTransfers && !readyToCheckApproval && item.saveButtonLabel ? 
              this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel, disabled: item.saveButtonDisabled })
            : null }
            { readyToCheckApproval && !approvedForTransfers && is2FAVerified ?
              <div style={{ marginTop: 0, paddingTop: 0 }} className='button-group'>
                {/*
                <GBLink 
                  disabled={isCheckingStatus} 
                  className={`button ${isCheckingStatus ? 'readOnly tooltip' : ''}`} 
                  onClick={() => {
                    this.setState({ saving: true }, () => {
                      this.checkApprovalStatus();
                    });
                  }}>
                  {isCheckingStatus ? <div className='tooltipTop'><i></i>Please wait while we check status for you...</div> : null }
                  Check Review Status
                </GBLink>
                */}
                <GBLink className='button' onClick={() => this.props.toggleModal('orgTransferSteps', false)}>
                  Take Me to My Fundraiser
                </GBLink>
              </div>
            : null }
            { approvedForTransfers ?
              <div style={{ marginTop: 0, paddingTop: 0 }} className='button-group'>
                <GBLink className='button' onClick={this.approvedForTransfersFinish}>
                  Take Me to My Fundraiser
                </GBLink>
              </div>  
            : null }            
          </div>
          <div className='rightSide' style={{ width: 150 }}>
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

class TransferMoneySteps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
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

    const {
    } = this.props;

    if (this.state.loading) return <Loader msg='Loading Transfer Money Steps...' />;

    return (
      <Form id={`stepsForm`} name={`stepsForm`} options={{ leftBar: true }}>
        <TransferMoneyStepsForm
          {...this.props}
        />
      </Form>
    )
  }
}

function mapStateToProps(state, props) {

  const orgID = util.getValue(state, 'gbx3.info.orgID');
  const websiteURL = util.getValue(state, 'resource.gbx3Org.data.websiteURL');
  const missionCountries = util.getValue(state, 'resource.gbx3Org.data.missionCountries');
  const underwritingStatus = util.getValue(state, 'resource.gbx3Org.data.underwritingStatus');
  const hasBankInfo = util.getValue(state, 'resource.gbx3Org.data.hasBankInfo');
  const completedPhases = util.getValue(state, 'gbx3.orgSignup.completedPhases', []);
  const completed = util.getValue(state, 'gbx3.orgSignup.completed', []);
  const approvedForTransfers = underwritingStatus === 'approved' && hasBankInfo ? true : false;
  const readyToCheckApproval = props.requiredSteps.every(c => completed.includes(c));
  const is2FAVerified = util.getValue(state, 'resource.session.data.user.is2FAVerified');

  return {
    orgID,
    websiteURL,
    missionCountries,
    completedPhases,
    completed,
    approvedForTransfers,    
    readyToCheckApproval,
    is2FAVerified
  }
}

export default connect(mapStateToProps, {
  setSignupStep,
  updateOrgSignup,
  setMerchantApp,
  getResource,
  sendResource,
  openLaunchpad,
  removeResource
})(TransferMoneySteps);
