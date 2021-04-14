import React from 'react';
import { connect } from 'react-redux';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import TextField from '../../form/TextField';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import HelpfulTip from '../../common/HelpfulTip';
import SignupShare from './SignupShare';

const GBX3_URL = process.env.REACT_APP_ENV === 'local' ? process.env.REACT_APP_GBX_SHARE : process.env.REACT_APP_GBX_URL;

class PostSignupSteps extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.gbx3message = this.gbx3message.bind(this);
    this.state = {
      error: false,
      saving: false,
      previewLoaded: false,
      editPreview: false,
      iframeHeight: 0
    };
    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('message', this.gbx3message, false);
  }

  gbx3message(e) {
    const {
      step
    } = this.props;

    const stepConfig = util.getValue(this.props.stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    if (e.data === 'gbx3Initialized') {
      if (slug === 'preview') {
        this.setState({ previewLoaded: true }, () => {
          this.props.stepCompleted(slug);
        });
      }
    }

    if (e.data === 'gbx3Shared') {
      if (slug === 'share') {
        this.props.stepCompleted(slug);
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

  async saveStep(slug, error = false, delay = 1000, closeWhenAllStepsCompleted = true) {

    if (error) {
      this.setState({ saving: false });
      return false;
    }

    const completedStep = await this.props.stepCompleted(slug);
    if (completedStep) {
      this.setState({ saving: false }, async () => {
        if (slug === 'share' && closeWhenAllStepsCompleted) {
          const updated = await this.props.updateOrgSignup({}, 'postSignup');
          if (updated) {
            this.props.saveOrg({
              orgUpdated: true,
              isSending: true,
              callback: () => {
                this.props.updateAdmin({ open: false });
                this.props.toggleModal('orgPostSignupSteps', false);
              }
            })
          }
        } else {
          setTimeout(() => {
            this.props.gotoNextStep();
          }, delay);
        }
      });
    } else {
      this.setState({ saving: false }, this.props.gotoNextStep);
      if (slug === 'share') {
        this.props.toggleModal('orgPostSignupSteps', false);
      }
    }
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

    const stepConfig = util.getValue(this.props.stepsTodo, step, {});
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
      desc: stepConfig.desc,
      component: <div></div>,
      className: '',
      saveButtonLabelTop: <span className='buttonAlignText'>Save & Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>,
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue to Next Step <span className='icon icon-chevron-right'></span></span>
    };

    switch (slug) {
      case 'createSuccess': {
        item.saveButtonLabelTop = <span className='buttonAlignText'>Continue to Step {nextStepNumber}: Preview Your Fundraiser <span className='icon icon-chevron-right'></span></span>;
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
        item.saveButtonLabelTop = <span className='buttonAlignText'>Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabel = <span className='buttonAlignText'>Looks Good! I'm Ready to Share <span className='icon icon-chevron-right'></span></span>;
        item.className = 'preview';
        item.desc = !previewLoaded ?
          `${editPreview ? 'Loading editable fundraiser,' : 'Generating preview,'} we appreciate your patience while it loads...`
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
                <img src='https://cdn.givebox.com/givebox/public/images/block-loader.svg' alt='Loader' />
              </div>
            : null }
            <iframe style={{ height: iframeHeight }} ref={this.iframeRef} id='previewIframe' src={`${GBX3_URL}/${createdArticleID}${this.state.editPreview ? '?admin&editFormOnly' : '?public&preview'}`} title={`Preview`} />
          </div>
        ;
        break;
      }

      case 'share': {
        item.saveButtonLabel = <span className='buttonAlignText'>All Finished! Take Me to My Profile <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabelTop = item.saveButtonLabel;
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
            <span style={{ marginLeft: 20 }}>{item.saveButtonLabelTop}</span>
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
            { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => {
              this.props.previousStep(step);
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
                  const step = this.props.stepsTodo.findIndex(s => s.slug === 'share');
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
      <div className='stepsWrapper'>
        {this.renderStep()}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(PostSignupSteps);
