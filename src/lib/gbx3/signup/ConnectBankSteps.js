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
  setSignupStep
} from '../redux/gbx3actions';
import {
  setMerchantApp,
  getLegalEntity,
  savePrincipal,
  saveLegalEntity,
  saveAddress,
  saveBankAccount
} from '../redux/merchantActions';
import BankAccount from './connectBank/BankAccount';
import Principal from './connectBank/Principal';
import LegalEntity from './connectBank/LegalEntity';
import Address from './connectBank/Address';

class ConnectBankStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.connectBankPlaid = this.connectBankPlaid.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.checkRequiredCompleted = this.checkRequiredCompleted.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);

    this.state = {
      editorOpen: false,
      error: false,
      saving: false,
      loading: true
    };
  }

  connectBankPlaid() {
    console.log('execute connectBankPlaid -> ');
    this.setState({ saving: false });
  }

  callbackAfter(tab) {
    this.props.formProp({ error: false });
  }

  checkRequiredCompleted() {
    const {
      completed,
      stepsTodo,
      requiredSteps
    } = this.props;

    const stepsRequiredButNotComplete = [];

    // Check if required steps are completed
    requiredSteps.forEach((value, key) => {
      if (!completed.includes(value.slug)) {
        const step = stepsTodo.findIndex(s => s.slug === value.slug);
        const stepNumber = +step + 1;
        stepsRequiredButNotComplete.push(
          <GBLink
            key={key}
            onClick={() => {
              this.props.formProp({ error: false });
              this.props.updateOrgSignup({ step });
            }}
          >
            Click Here for Step {stepNumber}: {value.name}
          </GBLink>
        )
      }
    });

    if (!util.isEmpty(stepsRequiredButNotComplete)) {
      this.props.formProp({ error: true, errorMsg:
        <div className='stepsNotCompletedButRequired'>
          <span>Please complete the following steps to create your account:</span>
          <div className='stepsNotCompletedList'>
            {stepsRequiredButNotComplete}
          </div>
        </div>
      });
      return false;
    }
    return true;
  }

  async saveStep(slug, error = false, delay = 1000) {

    if (error) {
      this.setState({ saving: false });
      return false;
    }

    const completedStep = await this.props.stepCompleted(slug);
    if (completedStep) {
      this.setState({ saving: false }, () => {
        setTimeout(() => {
          this.props.gotoNextStep();
        }, delay)
      });
    } else {
      this.setState({ saving: false }, this.props.gotoNextStep);
    }
  }

  async processForm(fields, callback, group) {
    util.toTop('modalOverlay-stepsForm');
    this.setState({ saving: true });
    const {
      step,
      stepsTodo,
      formState
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
          callback: (res, err) => {
            if (!err) {
              this.saveStep(group);
            } else {
              if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
              this.setState({ saving: false });
            }
          }
        })
        break;
      }

      case 'principal': {
        this.props.savePrincipal({
          hasBeenUpdated,
          data,
          callback: (res, err) => {
            if (!err) {
              this.saveStep(group);
            } else {
              if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
              this.setState({ saving: false });
            }
          }
        });
        break;
      }

      case 'legalEntity': {
        this.props.saveLegalEntity({
          hasBeenUpdated,
          data,
          callback: (res, err) => {
            if (!err) {
              this.saveStep(group);
            } else {
              if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
              this.setState({ saving: false });
            }
          }
        });
        break;
      }

      case 'address': {
        this.props.saveAddress({
          hasBeenUpdated,
          data,
          callback: (res, err) => {
            if (!err) {
              this.saveStep(group);
            } else {
              if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
              this.setState({ saving: false });
            }
          }
        });
        break;
      }

      case 'checkStatus': {
        this.setState({ saving: false });
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
      plaidAccountID
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
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue to Next Step <span className='icon icon-chevron-right'></span></span>
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
            <p>Congratulations, you have received your first transactions with Givebox!</p>
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
        item.saveButtonLabel = <span className='buttonAlignText'>Check Status <span className='icon icon-chevron-right'></span></span>
        item.saveButtonLabelTop = item.saveButtonLabel;
        item.desc =
          <div>
            <p>Your connections status.</p>
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-circle'></span>}
              headerText={`Important`}
              text={`You will be notified if any additional information is required to complete the connection to your bank account.`}
              style={{ marginTop: 30 }}
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
        <div className='stepStatus'>
          <GBLink onClick={(e) => this.props.validateForm(e, this.processForm, slug)}>
            <span style={{ marginLeft: 20 }}>{item.saveButtonLabelTop}</span>
          </GBLink>
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
            {this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel })}
          </div>
          <div className='button-item' style={{ width: 150 }}>
            { slug === 'connectBank' ?
              plaidAccountID ?
                <GBLink
                  className='link'
                  onClick={() => {
                    this.props.setSignupStep('connectStatus');
                    this.props.formProp({ error: false });
                  }}
                >
                  <span className='buttonAlignText'>Check Status <span className='icon icon-chevron-right'></span></span>
                </GBLink>
              :
                <GBLink
                  className='link'
                  onClick={() => {
                    this.props.toggleModal('orgConnectBankManualConfirm', true, {
                      manualCallback: () => {
                        this.props.toggleModal('orgConnectBankManualConfirm', false);
                        this.setState({ saving: false }, this.props.gotoNextStep);
                      },
                      plaidCallback: () => {
                        this.props.toggleModal('orgConnectBankManualConfirm', false);
                        this.connectBankPlaid();
                      }
                    });
                    this.props.formProp({ error: false });
                  }}
                >
                  <span className='buttonAlignText'>Manually Connect a Bank Account <span className='icon icon-chevron-right'></span></span>
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
        reload: false,
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

  return {
    plaidAccountID,
    legalEntity
  }
}

export default connect(mapStateToProps, {
  setMerchantApp,
  getLegalEntity,
  setSignupStep,
  savePrincipal,
  saveLegalEntity,
  saveAddress,
  saveBankAccount
})(ConnectBankSteps);
