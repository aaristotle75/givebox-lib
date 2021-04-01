import React from 'react';
import { connect } from 'react-redux';
import * as config from './signupConfig';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import {
  updateOrgSignup,
  updateOrgSignupField
} from '../redux/gbx3actions';

class SignupStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.validateTaxID = this.validateTaxID.bind(this);
    this.state = {
      themeColor: '',
      editorOpen: false,
      error: false
    };
    this.allowNextStep = true;
  }

  componentDidMount() {
  }

  categories() {
    const categories = util.getValue(this.props.categories, 'data', []);

    const items = [];
    Object.entries(categories).forEach(([key, value]) => {
      items.push({
        primaryText: value.name,
        value: value.ID
      });
    });
    return items;
  }

  processForm(fields) {
    util.toTop('modalOverlay-stepsForm');
    const {
      step,
      gbxStyle,
      button
    } = this.props;

    const {
      themeColor
    } = this.state;

    const {
      org,
      owner,
      gbx3
    } = this.props.fields;

    const stepConfig = util.getValue(config.signupSteps, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    Object.entries(fields).forEach(([key, value]) => {
      switch (value.group) {
        case 'orgName': {
          if (key === 'taxID') {
            //const validatedTaxID = await this.validateTaxID(value.value);
          }
          break;
        }

        // no default
      }
    });

    if (slug === 'themeColor') {
    }

    if (this.allowNextStep) this.gotoNextStep();
    else {
      this.props.formProp({ error: true, errorMessage: 'Please fix errors below to continue.' })
    }
  }

  gotoNextStep() {
    const {
      step
    } = this.props;
    this.props.updateOrgSignup('step', this.props.nextStep(step));
  }

  validateTaxID(taxID) {
    console.log('execute validateTaxID -> ', taxID);
    return true;
  }

  renderStep() {
    const {
      step,
      open
    } = this.props;

    const {
      org,
      owner,
      gbx3
    } = this.props.fields;

    const {
      name: orgName,
      taxID,
      categoryID,
      mission,
      imageURL: orgLogo,
      themeColor
    } = org;

    const {
      email,
      firstName,
      lastName,
      password
    } = owner;

    const {
      title,
      imageURL,
      videoURL,
      mediaType
    } = gbx3;

    const library = {
      saveMediaType: 'signup',
      borderRadius: 0
    };
    const stepConfig = util.getValue(config.signupSteps, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const stepNumber = +step + 1;
    const completed = this.props.completed.includes(step) ? true : false;
    const firstStep = step === 0 ? true : false;
    const lastStep = step === this.props.steps ? true : false;

    const item = {
      title: stepConfig.title,
      icon: stepConfig.icon,
      desc: stepConfig.desc,
      component: <div></div>,
      className: '',
      saveButtonLabel: 'Save & Continue to Next Step'
    };

    switch (slug) {
      case 'orgName': {
        item.component =
          <div className='fieldGroup'>
            {this.props.textField('orgName', {
              group: slug,
              fixedLabel: true,
              label: 'Organization Name',
              placeholder: `Click Here and Enter your Organization's Name`,
              maxLength: 128,
              count: true,
              required: false,
              value: orgName,
              onBlur: (name, value) => {
                if (value && value !== orgName) {
                  this.props.updateOrgSignupField('org', { name: value })
                }
              }
            })}
            {this.props.textField('taxID', {
              group: slug,
              fixedLabel: true,
              label: 'U.S. Federal Tax ID',
              placeholder: `Click Here and Enter Your U.S. Federal Tax ID`,
              required: false,
              value: taxID,
              validate: 'taxID',
              onBlur: (name, value) => {
                if (value && value !== taxID) {
                  this.props.updateOrgSignupField('org', { taxID: value })
                }
              }
            })}
          </div>
        break;
      }

      case 'mission': {
        item.component =
          <div className='fieldGroup'>
            <Dropdown
              name='categoryID'
              portalID={`category-dropdown-portal-${slug}`}
              portalClass={'gbx3 articleCardDropdown selectCategory'}
              portalLeftOffset={10}
              className='articleCard'
              contentWidth={400}
              label={''}
              selectLabel='Click Here to Select an Organization Category'
              fixedLabel={false}
              onChange={(name, value) => {
                console.log('execute categoryID -> ', value);
              }}
              options={this.categories()}
              showCloseBtn={true}
            />
          </div>
        ;
        break;
      }

      case 'logo': {

        break;
      }

      case 'themeColor': {

        break;
      }

      case 'title': {

        break;
      }

      case 'image': {

        break;
      }

      case 'save': {

        break;
      }

      // no default
    }

    return (
      <div className='stepContainer'>
        <div className='stepStatus'>
          <GBLink onClick={(e) => this.props.validateForm(e, this.processForm, slug)}>
            <span style={{ marginLeft: 20 }}>{item.saveButtonLabel} <span className='icon icon-chevron-right'></span></span>
          </GBLink>
        </div>
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            <span className={`icon icon-${item.icon}`}></span>
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
            { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => this.props.previousStep(step)}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> Previous Step</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            {this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel })}
          </div>
          <div className='button-item' style={{ width: 150 }}>
            &nbsp;
          </div>
        </div> : null }
      </div>
    );
  }

  render() {

    const {
    } = this.props;

    return (
      <div className='stepsWrapper'>
        {this.renderStep()}
      </div>
    )
  }
}

class SignupSteps extends React.Component {

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
        <Form id={`stepsForm`} name={`stepsForm`}>
          <SignupStepsForm
            {...this.props}
          />
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const open = util.getValue(state, 'gbx3.admin.open');
  const step = util.getValue(state, 'gbx3.orgSignup.step', 0);
  const completed = util.getValue(state, 'gbx3.orgSignup.completed', []);
  const fields = util.getValue(state, 'gbx3.orgSignup.fields', {});

  return {
    open,
    step,
    completed,
    fields
  }
}

export default connect(mapStateToProps, {
  updateOrgSignup,
  updateOrgSignupField
})(SignupSteps);
