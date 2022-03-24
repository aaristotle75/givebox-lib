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
import Icon from '../../common/Icon';
import HelpfulTip from '../../common/HelpfulTip';
import Identity from './transferMoney/Identity';
import VerifyBank from './transferMoney/VerifyBank';
import VerifyBusiness from './transferMoney/VerifyBusiness';
import TwoFA from '../../common/TwoFA';
import TransferStatus from './transferMoney/TransferStatus';
import {
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

    this.state = {
      editorOpen: false,
      error: false,
      saving: false,
      loading: true,
      identityUploaded: false,
      verifyBankUploaded: false,
      verifyBusinessUploaded: false,
      is2FAVerified: false,
      checkingStatusDisableButton: false,
      missionCountriesShow: props.missionCountries ? 2 : 1
    };
  }

  componentDidMount() {
    const {
      completed
    } = this.props;

    const readyToCheckApproval = this.props.requiredSteps.every(c => completed.includes(c));
    if (readyToCheckApproval && !completed.includes('transferStatus')) {
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
    this.setState({ checkingStatusDisableButton: true }, () => {
      this.props.getResource('org', {
        customName: 'gbx3Org',
        reload: true,
        callback: async (res, err) => {
          const underwritingStatus = util.getValue(res, 'underwritingStatus');
          const hasBankInfo = util.getValue(res, 'hasBankInfo');
          if (underwritingStatus === 'approved' && hasBankInfo) {
            if (!this.props.completed.includes('transferStatus')) {
              this.props.stepCompleted('transferStatus');
            }
            this.setState({ saving: false, checkingStatusDisableButton: false });
          } else {
            this.setState({ saving: false });
            setTimeout(() => {
              this.setState({ checkingStatusDisableButton: false });
            }, 10000)
          }
        }
      });
    });
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
        if (approvedForTransfers) {
          this.setState({ saving: false }, async () => {
            const updated = await this.props.updateOrgSignup({}, 'transferMoney');
            if (updated) {
              this.props.stepCompleted('transferMoney');
              this.props.toggleModal('orgTransferSteps', false);
              this.props.openLaunchpad({ autoOpenSlug: 'money' });
            }
          });
        } else {
          this.checkApprovalStatus();
        }
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
      checkingStatusDisableButton,
      missionCountriesShow
    } = this.state;

    const {
      step,
      open,
      isMobile,
      stepsTodo,
      approvedForTransfers,
      completedPhases,
      websiteURL,
      missionCountries
    } = this.props;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const stepsForApprovalCompleted = this.props.completed.length >= stepsTodo.length - 1 ? true : false;
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
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              <Identity
                {...this.props}
                getDocument={this.getDocument}
              />
            </div>
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
          </div>
        ;
        break;
      }

      case 'verifyBank': {
        item.saveButtonDisabled = !verifyBankUploaded ? true : false;
        item.desc = 'Please upload a bank statement of the account you connected to Givebox.';
        item.component =
          <div>
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              <VerifyBank
                {...this.props}
                getDocument={this.getDocument}
              />
            </div>
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
        item.saveButtonLabel = <span className='buttonAlignText'>Continue to Next Step</span>;
        item.desc = 'To protect your account we use two-factor authentication.';
        item.component =
          !is2FAVerified ?
          <div>
            <div style={{ marginBottom: 0 }} className='fieldGroup'>
              <TwoFA
                hideRadio={true}
                set2FAVerified={this.set2FAVerified}
                successCallback={async () => {
                  const updated = await this.props.stepCompleted(slug);
                  if (updated) this.props.gotoNextStep();                
                }}
              />
            </div>
            <div style={{ marginTop: 30 }}>
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
          </div>
          : null 
        ;
        break;
      }

      case 'transferStatus': {
        const check = [
          'identity',
          'verifyBank',
          'verifyBusiness',
          'protect'
        ];
        const isCompleted = check.every((val) => this.props.completed.includes(val));

        item.saveButtonDisabled = isCompleted ? false : true;
        item.saveButtonDisabled = checkingStatusDisableButton ? true : item.saveButtonDisabled;
        item.saveButtonLabel = <span className='buttonAlignText'>{approvedForTransfers ? 'Manage Money' : 'Check Status'}</span>;
        let secondaryDesc = 'You can still collect donations and raise money while you wait.';

        if (approvedForTransfers) {
          item.desc = 'Your account is secure and you are enabled to transfer money!';
          secondaryDesc = 'Click the Manage Money button below to view your available balance and transfer money.';
        } else if (isCompleted) {
          item.desc = 'We are reviewing your account. You should be enabled for money transfers in the next 3-5 business days.';
        } else {
          item.desc = 'You must complete all the previous steps to secure your account and enable money transfers.';
        }

        item.component =
          <div>
            <div className='flexCenter'>
              {secondaryDesc}
            </div>
            <TransferStatus
              {...this.props}
              isCompleted={isCompleted}
              approvedForTransfers={approvedForTransfers}
              completedPhases={completedPhases}
            />
          </div>
        ;
        break;
      }

      // no default
    }
    return (
      <div className='stepContainer'>
        { this.state.saving ? <Loader msg='Saving...' /> : null }
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            {completed && !this.props.completed.includes('transferStatus') ?
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
            {this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel, disabled: item.saveButtonDisabled })}
          </div>
          <div className='rightSide' style={{ width: 150 }}>
            { slug !== 'transferStatus' && stepsForApprovalCompleted ?
              <GBLink
                className='link'
                onClick={() => {
                  const step = stepsTodo.findIndex(s => s.slug === 'transferStatus');
                  this.props.updateOrgSignup({ step });
                  this.props.formProp({ error: false });
                }}
              >
                <span className='buttonAlignText'>Skip to Approval Status <span className='icon icon-chevron-right'></span></span>
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
  const approvedForTransfers = underwritingStatus === 'approved' && hasBankInfo ? true : false;
  const completedPhases = util.getValue(state, 'gbx3.orgSignup.completedPhases', []);
  const completed = util.getValue(state, 'gbx3.orgSignup.completed', []);

  return {
    orgID,
    websiteURL,
    missionCountries,
    approvedForTransfers,
    completedPhases,
    completed
  }
}

export default connect(mapStateToProps, {
  updateOrgSignup,
  setMerchantApp,
  getResource,
  sendResource,
  openLaunchpad,
  removeResource
})(TransferMoneySteps);
