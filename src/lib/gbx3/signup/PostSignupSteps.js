import React from 'react';
import { connect } from 'react-redux';
import * as config from './signupConfig';
import CreateAccount from './CreateAccount';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import TextField from '../../form/TextField';
import MediaLibrary from '../../form/MediaLibrary';
import Video from '../../common/Video';
import EditVideo from '../admin/common/EditVideo';
import { createData } from '../admin/article/createTemplates';
import * as util from '../../common/utility';
import Tabs, { Tab } from '../../common/Tabs';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import HelpfulTip from '../../common/HelpfulTip';
import {
  updateOrgSignup,
  updateOrgSignupField,
  setOrgStyle,
  loadOrg,
  createFundraiser,
  saveOrg,
  updateOrgGlobals,
  savingSignup,
  signupGBX3Data
} from '../redux/gbx3actions';
import {
  setAccess,
  toggleModal
} from '../../api/actions';
import {
  getResource,
  sendResource
} from '../../api/helpers';
import { PhotoshopPicker } from 'react-color-aaristotle';
import AnimateHeight from 'react-animate-height';
import {
  primaryColor as defaultPrimaryColor,
  defaultOrgGlobals
} from '../redux/gbx3defaults';
import { blockTemplates, defaultBlocks } from '../blocks/blockTemplates';

class PostSignupSteps extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);

    this.state = {
      error: false,
      saving: false
    };

    this.configSteps = config.postSignupSteps;
    this.allowNextStep = false;
    this.totalSignupSteps = +(this.configSteps.length - 1);
  }

  async saveStep(step, error = false, delay = 1000) {
    const {
      orgSignup
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
        }, delay)
      });
    } else {
      this.setState({ saving: false }, this.gotoNextStep);
    }
  }

  gotoNextStep() {
    const {
      step
    } = this.props;
    this.props.updateOrgSignup({ step: this.nextStep(step) });
  }

  previousStep(step) {
    const prevStep = step > 0 ? step - 1 : step;
    this.props.updateOrgSignup({ step: prevStep });
  }

  nextStep(step) {
    const nextStep = step < +this.totalSignupSteps ? step + 1 : step;
    return nextStep;
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
    } = this.state;

    const {
      step,
      open,
      isMobile
    } = this.props;

    const stepConfig = util.getValue(this.configSteps, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const stepNumber = +step + 1;
    const completed = this.props.completed.includes(slug) ? true : false;
    const firstStep = step === 0 ? true : false;
    const lastStep = step === this.props.steps ? true : false;

    const item = {
      title: stepConfig.title,
      icon: stepConfig.icon,
      desc: stepConfig.desc,
      component: <div></div>,
      className: '',
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue to Next Step <span className='icon icon-chevron-right'></span></span>
    };

    switch (slug) {
      case 'createSuccess': {
        item.saveButtonLabel = <span className='buttonAlignText'>Continue to Preview Your Fundraiser <span className='icon icon-chevron-right'></span></span>
        item.desc =
          <div>
            <p>You can now start taking donations.</p>
            <p>You just need to preview your fundraiser and share it. Simple as that.</p>
            <HelpfulTip
              headerText={`Don't quit now!`}
              text={`It's all easy sailing from here! Just preview and share to make your first donation with Givebox!`}
              style={{ marginTop: 30 }}
            />
          </div>
        ;
        break;
      }

      case 'preview': {
        item.saveButtonLabel = <span className='buttonAlignText'>Looks Good! I'm Ready to Share <span className='icon icon-chevron-right'></span></span>;
        item.className = 'preview';
        item.desc = !this.state.previewLoaded ?
          'Please wait while the preview loads...'
          :
          <div>
            <span>This is how the form will look to your supporters.</span>
            <span style={{ marginTop: 10, display: 'block' }}><GBLink style={{ fontSize: 14, display: 'inline' }} onClick={() => console.log('execute edit')}>Edit Form</GBLink></span>
          </div>
        ;
        item.component =
          <div className='stagePreview flexCenter'>
            Show Preview
          </div>
        ;
        break;
      }

      case 'share': {
        item.saveButtonLabel = <span className='buttonAlignText'>Share Your Fundraiser <span className='icon icon-chevron-right'></span></span>
        break;
      }

      // no default
    }

    return (
      <div className='stepContainer'>
        { this.state.saving ? <Loader msg='Saving...' /> : null }
        <div className='stepStatus'>
          <GBLink onClick={() => this.saveStep(slug)}>
            <span style={{ marginLeft: 20 }}>{item.saveButtonLabel}</span>
          </GBLink>
        </div>
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            <span className={`icon icon-${item.icon}`}></span>
            <div className='stepTitle'>
              <div className='numberContainer'>
                <span className='number'>{/* Step {stepNumber}{ completed ? ':' : null} */}</span>
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
              this.previousStep(step);
            }}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> Back</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            <GBLink className='button' onClick={() => this.saveStep(slug)}>
              {item.saveButtonLabel}
            </GBLink>
          </div>
          <div className='button-item' style={{ width: 150 }}>
            { slug !== 'preview' && slug !== 'share' ?
              <GBLink
                className='link'
                onClick={() => {
                  const step = this.configSteps.findIndex(s => s.slug === 'share');
                  this.props.updateOrgSignup({ step });
                }}
              >
                <span className='buttonAlignText'>Skip to Share <span className='icon icon-chevron-right'></span></span>
              </GBLink>
            : null }
          </div>
        </div> : null }
      </div>
    );
  }

  render() {

    const {
    } = this.props;

    return (
      <div className='gbx3Steps modalWrapper'>
        <div className='flexCenter' style={{ marginBottom: 10 }}>
          <Image size='thumb' maxSize={40} url={'https://cdn.givebox.com/givebox/public/gb-logo5.png'} alt='Givebox' />
        </div>
        <div className='stepsWrapper'>
          {this.renderStep()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const open = util.getValue(state, 'gbx3.admin.open');
  const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
  const step = util.getValue(orgSignup, 'step', 0);
  const completed = util.getValue(orgSignup, 'completed', []);
  const createdArticleID = util.getValue(orgSignup, 'createdArticleID');
  const breakpoint = util.getValue(state, 'gbx3.info.breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;

  return {
    open,
    orgSignup,
    step,
    createdArticleID,
    completed,
    isMobile
  }
}

export default connect(mapStateToProps, {
  updateOrgSignup,
  updateOrgSignupField,
  getResource,
  sendResource,
  setOrgStyle,
  setAccess,
  loadOrg,
  updateOrgGlobals,
  createFundraiser,
  saveOrg,
  toggleModal,
  savingSignup,
  signupGBX3Data
})(PostSignupSteps);
