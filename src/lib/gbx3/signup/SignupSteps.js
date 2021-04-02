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
import {
  getResource
} from '../../api/helpers';

class SignupStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.validateTaxID = this.validateTaxID.bind(this);
    this.state = {
      themeColor: '',
      editorOpen: false,
      error: false,
      saving: false
    };
    this.allowNextStep = false;
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

  async saveStep(group, error = false) {
    const {
      step
    } = this.props;

    if (error) {
      this.setState({ saving: false });
      return false;
    }
    const completedStep = await this.stepCompleted(step);
    if (completedStep) {
      this.setState({ saving: false }, () => {
        setTimeout(() => {
          this.gotoNextStep();
        }, 1500)
      });
    } else {
      this.setState({ saving: false }, this.gotoNextStep);
    }
  }

  processForm(fields, callback, group) {
    util.toTop('modalOverlay-stepsForm');
    this.setState({ saving: true });
    const {
      step,
      gbxStyle,
      button,
      validTaxID
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

    switch (group) {
      case 'orgName': {
        if (!validTaxID || validTaxID !== org.taxID) return this.validateTaxID(org.taxID, group);
        else return this.saveStep(group);
      }

      default: {
        return this.saveStep(group);
      }
    }
  }

  async validateTaxID(taxID, group) {
    this.validation = false;
    this.props.getResource('orgs', {
      search: {
        filter: `taxID:"${taxID}"`
      },
      reload: true,
      callback: (res, err) => {
        const data = util.getValue(res, 'data', []);
        if (!util.isEmpty(data)) {
          const existingOrg = util.getValue(data, 0, {});
          const isOwned = util.getValue(existingOrg, 'isOwned', false);
          const isAutoCreated = util.getValue(existingOrg, 'isAutoCreated', false);
          if (!isOwned && isAutoCreated) {
            this.props.updateOrgSignup({
              claimOrgID: existingOrg.ID,
              validTaxID: taxID
            });
            return this.saveStep(group);
          } else {
            this.props.formProp({ error: true, errorMsg: <div>The Tax ID you entered is taken by another user.<span style={{ marginTop: 5, display: 'block', fontSize: 12, fontStyle: 'italic' }}>To dispute this claim:<br/>Contact support@givebox.com with your Organization Name, Tax ID and explain your dispute.</span></div> });
            this.props.fieldProp('taxID', { error: 'This Tax ID is taken by another user.' });
            return this.saveStep(group, true);
          }
        } else {
          this.props.updateOrgSignup({ validTaxID: taxID });
          return this.saveStep(group);
        }
      }
    });
  }

  gotoNextStep() {
    const {
      step
    } = this.props;
    this.props.updateOrgSignup({ step: this.props.nextStep(step) });
  }

  async stepCompleted(step) {
    let updated = false;
    const completed = [ ...this.props.completed ];
    if (!completed.includes(step)) {
      completed.push(step);
      updated = await this.props.updateOrgSignup({ completed });
    }
    return updated;
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
              required: true,
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
              required: true,
              value: taxID,
              validate: 'taxID',
              onBlur: (name, value) => {
                console.log('execute taxID -> ', value, taxID);
                if (value) {
                  this.props.updateOrgSignupField('org', { taxID: value })
                }
              }
            })}
          </div>
        break;
      }

      case 'mission': {
        item.className = 'missionStep';
        item.component =
          <div className='fieldGroup'>
            {this.props.richText('mission', {
              group: item.name,
              style: { paddingTop: 0 },
              placeholder:
              <div>
                Click Here to Enter About Your Organization, Mission or Purpose<br /><br />
                For example: "Nonprofit helps communities raise money for food in the United States, Canada and Mexico."
              </div>,
              fixedLabel: false,
              label: '',
              wysiwyg: false,
              autoFocus: false,
              value: mission,
              required: true,
              onBlur: (name, content, hasText) => {
                console.log('execute onBlur -> ', name, content, hasText);
              }
            })}
            <div className='input-group'>
              <label className='label'>Organization Category</label>
              <Dropdown
                name='categoryID'
                portalID={`category-dropdown-portal-${slug}`}
                portalClass={'gbx3 articleCardDropdown selectCategory'}
                portalLeftOffset={10}
                className='articleCard'
                contentWidth={400}
                label={''}
                selectLabel='Click Here to Select an Organization Category'
                fixedLabel={true}
                onChange={(name, value) => {
                  console.log('execute categoryID -> ', value);
                }}
                options={this.categories()}
                showCloseBtn={true}
              />
            </div>
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
        { this.state.saving ? <Loader msg='Saving...' /> : null }
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
  const claimOrgID = util.getValue(state, 'gbx3.orgSignup.claimOrgID', null);
  const validTaxID = util.getValue(state, 'gbx3.orgSignup.validTaxID', null);
  const completed = util.getValue(state, 'gbx3.orgSignup.completed', []);
  const fields = util.getValue(state, 'gbx3.orgSignup.fields', {});

  return {
    open,
    step,
    claimOrgID,
    validTaxID,
    completed,
    fields
  }
}

export default connect(mapStateToProps, {
  updateOrgSignup,
  updateOrgSignupField,
  getResource
})(SignupSteps);
