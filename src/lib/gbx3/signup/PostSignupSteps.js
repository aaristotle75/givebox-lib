import React from 'react';
import { connect } from 'react-redux';
import * as config from './signupConfig';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import TextField from '../../form/TextField';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import HelpfulTip from '../../common/HelpfulTip';
import {
  updateOrgSignup,
  updateOrgSignupField,
  saveOrg
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import {
  getResource,
  sendResource
} from '../../api/helpers';
import AnimateHeight from 'react-animate-height';
import SignupShare from './SignupShare';

const GBX3_URL = process.env.REACT_APP_ENV === 'local' ? process.env.REACT_APP_GBX_SHARE : process.env.REACT_APP_GBX_URL;

class PostSignupSteps extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.gbx3message = this.gbx3message.bind(this);
    this.state = {
      error: false,
      saving: false,
      previewLoaded: false,
      editPreview: false,
      iframeHeight: 0
    };

    this.configSteps = config.postSignupSteps;
    this.allowNextStep = false;
    this.totalSignupSteps = +(this.configSteps.length - 1);
    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('message', this.gbx3message, false);
  }

  gbx3message(e) {
    const {
      step
    } = this.props;

    const stepConfig = util.getValue(this.configSteps, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    if (e.data === 'gbx3Initialized') {
      if (slug === 'preview') {
        this.setState({ previewLoaded: true });
      }
    }

    if (e.data === 'gbx3Shared') {
      if (slug === 'share') {
        this.saveStep('share', false, 1000, false);
      }
    }

    const str = e.data.toString();
    const strArr = str.split('-');
    if (strArr[0] === 'gbx3Height') {
      if (strArr[1]) {
        const iframeHeight = +strArr[1] + 50;
        this.setState({ iframeHeight });
      }
    }
  }

  async saveStep(step, error = false, delay = 1000, closeWhenAllStepsCompleted = true) {
    const {
      orgSignup
    } = this.props;

    if (error) {
      this.setState({ saving: false });
      return false;
    }

    const completedStep = await this.stepCompleted(step);
    if (completedStep) {
      this.setState({ saving: false }, async () => {
        if (step === 'share' && closeWhenAllStepsCompleted) {
          const updated = await this.props.updateOrgSignup({ postsignupCompleted: true });
          if (updated) {
            this.props.saveOrg({
              orgUpdated: true,
              isSending: true,
              callback: () => {
                this.props.toggleModal('orgPostSignupSteps', false);
              }
            })
          }
        } else {
          setTimeout(() => {
            this.gotoNextStep();
          }, delay);
        }
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
      editPreview,
      previewLoaded,
      iframeHeight
    } = this.state;

    const {
      step,
      open,
      isMobile,
      createdArticleID
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
        item.desc = !previewLoaded ?
          `Please wait while the ${editPreview ? 'editable fundraiser' : 'public preview'} loads...`
          :
          <div>
            <GBLink
              style={{ fontSize: 14, display: 'inline' }}
              onClick={() => {
                this.setState({ editPreview: editPreview ? false : true, previewLoaded: false, iframeHeight: 0 })
              }}
            >
              <span className='buttonAlignText'>{editPreview ? 'Click Here for Public Preview' : 'Click Here to Edit Your Fundraiser'} <span className='icon icon-chevron-right'></span></span>
            </GBLink>
            <HelpfulTip
              headerIcon={<span className={`icon icon-${editPreview ? 'edit' : 'eye'}`}></span>}
              headerText={editPreview ? 'Edit Fundraiser' : 'Public Preview'}
              text={editPreview ? 'You can hover over any page element and change it by clicking the edit icon.' : 'This is how your fundraiser will look to your supporters.'}
              style={{ marginTop: 30 }}
            />
          </div>
        ;
        item.component =
          <div className='stagePreview flexCenter flexColumn'>
            { !previewLoaded ?
              <div className='imageLoader'>
                <img src='https://cdn.givebox.com/givebox/public/images/squareLoader.gif' alt='Loader' />
              </div>
            : null }
            <iframe style={{ height: iframeHeight }} ref={this.iframeRef} id='previewIframe' src={`${GBX3_URL}/${createdArticleID}${this.state.editPreview ? '?admin&editFormOnly' : '?public&preview'}`} title={`Preview`} />
          </div>
        ;
        break;
      }

      case 'share': {
        item.saveButtonLabel = <span className='buttonAlignText'>All Finished! Take Me to My Profile <span className='icon icon-chevron-right'></span></span>;
        item.component =
          <SignupShare />
        ;
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
  saveOrg,
  toggleModal
})(PostSignupSteps);
