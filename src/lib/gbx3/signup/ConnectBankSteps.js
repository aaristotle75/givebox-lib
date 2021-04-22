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
  savePrincipal,
  saveLegalEntity
} from '../redux/merchantActions';
import Principal from './connectBank/Principal';
import LegalEntity from './connectBank/LegalEntity';

class ConnectBankStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.checkRequiredCompleted = this.checkRequiredCompleted.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);

    this.state = {
      editorOpen: false,
      error: false,
      saving: false
    };
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
      stepsTodo
    } = this.props;

    const {
    } = this.state;

    const {
    } = this.props.fields;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    switch (group) {
      case 'bankAccount': {
        return this.saveStep(group);
      }

      case 'principal': {
        return this.props.savePrincipal({
          callback: (res, err) => {
            if (!err) {
              this.saveStep(group);
            } else {
              if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
              this.setState({ saving: false });
            }
          }
        })
      }

      case 'legalEntity': {
        return this.props.saveLegalEntity({
          callback: (res, err) => {
            if (!err) {
              this.saveStep(group);
            } else {
              if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
              this.setState({ saving: false });
            }
          }
        })
      }

      default: {
        return this.saveStep(group);
      }
    }
  }

  renderStep() {
    const {
    } = this.state;

    const {
      step,
      open,
      isMobile,
      stepsTodo
    } = this.props;

    const {
    } = this.props.fields;

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
      case 'addBank': {
        item.saveButtonLabelTop = <span className='buttonAlignText'>Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabel = <span className='buttonAlignText'>Continue to Next Step <span className='icon icon-chevron-right'></span></span>
        item.desc =
          <div>
            <p>Congratulations, you have received your first transactions with Givebox!</p>
            <p></p>
            <p>Simply connect your bank, and in a matter of minutes you will have a bank account connected and can continue to accept payments and donations.</p>
            <HelpfulTip
              headerIcon={<span className='icon icon-meh'></span>}
              headerText={`Manually Entering Bank Account`}
              text={`Manually entering your bank account will require many additional steps and documentation that you must submit for review and can take up to 7 days to approve.`}
              style={{ marginTop: 30 }}
            />
          </div>
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
        item.saveButtonLabelTop = <span className='buttonAlignText'>Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabel = <span className='buttonAlignText'>Continue to Next Step <span className='icon icon-chevron-right'></span></span>
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
        item.saveButtonLabelTop = <span className='buttonAlignText'>Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabel = <span className='buttonAlignText'>Continue to Next Step <span className='icon icon-chevron-right'></span></span>
        item.desc =
          <div>
            <p>This can be your Organization's physical address or an address of the primary account holder.</p>
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-circle'></span>}
              headerText={`Important`}
              text={`P.O. Boxes and PMB's CANNOT be used.`}
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
            { slug !== 'account' ?
              <GBLink
                className='link'
                onClick={() => {
                  const step = stepsTodo.findIndex(s => s.slug === 'account');
                  this.props.updateOrgSignup({ step });
                  this.props.formProp({ error: false });
                }}
              >
                <span className='buttonAlignText'>Skip to Save Account <span className='icon icon-chevron-right'></span></span>
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
      <Form id={`stepsForm`} name={`stepsForm`}>
        <ConnectBankStepsForm
          {...this.props}
        />
      </Form>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  savePrincipal,
  saveLegalEntity
})(ConnectBankSteps);
