import React from 'react';
import { connect } from 'react-redux';
import * as config from './signupConfig';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import TextField from '../../form/TextField';
import MediaLibrary from '../../form/MediaLibrary';
import Video from '../../common/Video';
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
  setOrgStyle
} from '../redux/gbx3actions';
import {
  getResource
} from '../../api/helpers';
import { PhotoshopPicker } from 'react-color-aaristotle';
import AnimateHeight from 'react-animate-height';

class SignupStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.saveSignup = this.saveSignup.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.validateTaxID = this.validateTaxID.bind(this);
    this.handleImageSaveCallback = this.handleImageSaveCallback.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.renderVideo = this.renderVideo.bind(this);
    this.videoOnReady = this.videoOnReady.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);

    const videoURL = util.getValue(props.fields, 'gbx3.videoURL');

    this.state = {
      videoURL,
      themeColor: util.getValue(props.fields, 'org.themeColor', '#698df4'),
      editorOpen: false,
      error: false,
      categoryIDError: false,
      saving: false,
      mediaType: util.getValue(props.fields, 'gbx3.mediaType', 'image'),
      videoURLFieldValue: videoURL,
      video: {
        validated: _v.validateURL(videoURL) ? true : false,
        error: false
      },
      videoLoading: false
    };
    this.allowNextStep = false;
    this.totalSignupSteps = +(config.signupSteps.length - 1);
  }

  componentDidMount() {
    this.videoLoading();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.videoURL !== this.state.videoURL && this.state.video.validated && this.state.mediaType === 'video') {
      this.videoLoading();
    }
  }

  videoOnReady() {
    this.setState({ videoLoading: false });
  }

  videoLoading() {
    const {
      video,
      videoURL,
      mediaType
    } = this.state;

    if (mediaType === 'video' && videoURL && video.validated) {
      this.setState({ videoLoading: true });
    }
  }

  onChangeVideo(e) {
    const URL = e.currentTarget.value;
    const videoURLFieldValue = URL;
    const video = this.state.video;
    video.validated = _v.validateURL(URL) ? true : false;
    const videoURL = video.validated ? URL : '';
    if (video.error) video.error = false;
    this.setState({ video, videoURL, videoURLFieldValue });
  }

  callbackAfter(tab) {
    this.setState({ mediaType: tab });
    this.videoLoading();
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

  saveSignup(obj = {}) {
    console.log('execute -> ', obj);
  }

  async saveStep(step, error = false, delay = 1000) {
    const {
      orgSignup
    } = this.props;

    if (error) {
      this.setState({ saving: false });
      return false;
    } else {
      // save to cookie
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

  async processForm(fields, callback, group) {
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

      case 'mission': {
        if (!org.mission || !org.categoryID) {
          if (!org.mission) this.props.fieldProp('mission', { error: 'About Your Organization is Required' });
          if (!org.categoryID) this.setState({ categoryIDError: 'Organization Category is Required' });
          this.props.formProp({ error: true, errorMsg: 'Please fix the errors below in red.' });
          return this.setState({ saving: false });
        } else {
          return this.saveStep(group);
        }
      }

      case 'logo': {
        if (!org.imageURL) {
          this.props.formProp({ error: true, errorMsg: 'Please upload a logo or profile picture to continue.'});
          return this.setState({ saving: false });
        } else {
          return this.saveStep('logo');
        }
      }

      case 'image': {
        if (!gbx3.imageURL) {
          this.props.formProp({ error: true, errorMsg: 'Please upload an image to continue.'});
          return this.setState({ saving: false });
        } else {
          return this.saveStep('image');
        }
      }

      case 'themeColor': {
        if (themeColor) {
          const updated = await this.props.updateOrgSignupField('org', { themeColor });
          if (updated) {
            this.props.setOrgStyle({
              backgroundColor: themeColor
            });
            return this.saveStep('themeColor');
          }
        }
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

  async handleImageSaveCallback(url, name, field) {
    this.props.formProp({ error: false });
    const updated = await this.props.updateOrgSignupField(name, { [field]: url });
    //if (updated) this.saveStep('logo', false, 3000);
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
      mediaType,
      videoURLFieldValue,
      video,
      videoURL
    } = this.state;

    const {
      step,
      open,
      isMobile
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
      imageURL
    } = gbx3;

    const stepConfig = util.getValue(config.signupSteps, step, {});
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

    const library = {
      saveMediaType: 'signup',
      borderRadius: 0
    };

    switch (slug) {
      case 'welcome': {
        item.saveButtonLabel = <span className='buttonAlignText'>Continue to Next Step <span className='icon icon-chevron-right'></span></span>
        item.desc =
          <div>
            <p>You have chosen wisely. You are well on your way to accepting payments and donations through Givebox.</p>
            <p>Simply follow the steps, and in a matter of minutes you will be ready to start raising money immediately!</p>
            <HelpfulTip
              text={`As you go through the steps, remember that almost everything can be changed later, so don't over think it!`}
              style={{ marginTop: 30 }}
            />
          </div>
        ;
        break;
      }

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
                  this.props.updateOrgSignupField('org', { name: value });
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
                if (value) {
                  this.props.updateOrgSignupField('org', { taxID: value });
                }
              }
            })}
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-circle'></span>}
              headerText='Important'
              text={`You must have a valid U.S. Federal Tax ID to use Givebox.`}
              style={{ marginTop: 15 }}
            />
          </div>
        break;
      }

      case 'mission': {
        item.className = 'missionStep';
        item.component =
          <div className='fieldGroup'>
            {this.props.richText('mission', {
              name: 'mission',
              group: slug,
              style: { paddingTop: 0 },
              placeholder:
              <div>
                Click Here to Write About Your Organization, Mission or Purpose
              </div>,
              fixedLabel: false,
              label: '',
              wysiwyg: false,
              autoFocus: false,
              value: mission,
              required: true,
              onBlur: (name, content, hasText) => {
                if (hasText) {
                  this.props.updateOrgSignupField('org', { mission: content });
                }
              }
            })}
            <HelpfulTip
              headerIcon={<span className='icon icon-edit-2'></span>}
              headerText={`Example Mission Statement`}
              style={{ marginTop: 20, marginBottom: 20 }}
              text={
                <span>
                  "Nonprofit helps communities raise money for food in the United States, Canada and Mexico."
                </span>
              }
            />
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
                required={true}
                onChange={(name, value) => {
                  this.setState({ categoryIDError: false });
                  this.props.updateOrgSignupField('org', { categoryID: +value });
                }}
                options={this.categories()}
                showCloseBtn={true}
                error={this.state.categoryIDError}
                value={categoryID}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'logo': {
        item.component =
          <div className='fieldGroup'>
            <MediaLibrary
              image={orgLogo}
              preview={orgLogo}
              handleSaveCallback={(url) => this.handleImageSaveCallback(url, 'org', 'imageURL')}
              handleSave={util.handleFile}
              library={library}
              showBtns={'hide'}
              saveLabel={'close'}
              mobile={isMobile ? true : false }
              uploadOnly={true}
              uploadEditorSaveStyle={{ width: 250 }}
              uploadEditorSaveLabel={'Click Here to Save Image'}
              imageEditorOpenCallback={(editorOpen) => {
                this.setState({ editorOpen })
              }}
              topLabel={'Click to Add Image'}
              bottomLabel={'Drag & Drop Image'}
              labelIcon={<span className='icon icon-instagram'></span>}
            />
          </div>
        ;
        break;
      }

      case 'image': {
        item.desc =
          <div>
            <p>{item.desc}</p>
            <HelpfulTip
              headerIcon={<span className='icon icon-video'></span>}
              headerText={`An Image is Great, but with a Video Your Fundraiser Excels`}
              style={{ marginTop: 20, marginBottom: 20 }}
              text={
                <span>
                  If you have a video link handy we suggest you use it. An image is great, but a video brings your story to life.
                </span>
              }
            />
          </div>
        ;
        item.component =
          <div className='fieldGroup'>
            <Tabs
              default={mediaType}
              className='statsTab'
              callbackAfter={this.callbackAfter}
            >
              <Tab id='image' className='showOnMobile' label={<span className='stepLabel buttonAlignText'>Use an Image <span className='icon icon-instagram'></span></span>}>
                <MediaLibrary
                  image={imageURL}
                  preview={imageURL}
                  handleSaveCallback={(url) => this.handleImageSaveCallback(url, 'gbx3', 'imageURL')}
                  handleSave={util.handleFile}
                  library={library}
                  showBtns={'hide'}
                  saveLabel={'close'}
                  mobile={isMobile ? true : false }
                  uploadOnly={true}
                  uploadEditorSaveStyle={{ width: 250 }}
                  uploadEditorSaveLabel={'Click Here to Save Image'}
                  imageEditorOpenCallback={(editorOpen) => {
                    this.setState({ editorOpen })
                  }}
                  topLabel={'Click to Add Image'}
                  bottomLabel={'Drag & Drop Image'}
                  labelIcon={<span className='icon icon-instagram'></span>}
                />
              </Tab>
              <Tab id='video' className='showOnMobile' label={<span className='stepLabel buttonAlignText'>Use a Video <span className='icon icon-video'></span></span>}>
                <TextField
                  name='video'
                  label='Embed Video URL'
                  fixedLabel={false}
                  placeholder='Click Here to Enter a Video URL'
                  onChange={this.onChangeVideo}
                  value={videoURLFieldValue}
                />
                <div className='fieldContext'>
                  Please enter a YouTube, Vimeo, Facebook Video URL.
                </div>
                <AnimateHeight
                  duration={200}
                  height={video.validated && videoURL ? 'auto' : 0}
                >
                  <div className='input-group'>
                    <label className='label'>Video Preview</label>
                    <div style={{ marginTop: 10 }} className='flexCenter'>
                      {/* Test video: https://vimeo.com/176050010  https://youtu.be/pAj-chxg610 */}
                      {mediaType === 'video' ? this.renderVideo() : <></>}
                    </div>
                  </div>
                </AnimateHeight>
              </Tab>
            </Tabs>
          </div>
        ;
        break;
      }

      case 'themeColor': {
        const style = {
          default: {
            head: {
              background: '#fff',
              backgroundImage: 'none',
              fontSize: '1.5em',
              fontWeight: 300,
              border: 0,
              marginBottom: 0,
              boxShadow: 'none',
              color: '#465965',
              height: 0,
              lineHeight: 0
            },
          }
        };
        item.component =
          <div className='flexCenter'>
            <PhotoshopPicker
              styles={style}
              header={''}
              color={this.state.themeColor}
              onChangeComplete={(color) => {
                this.setState({ themeColor: color.hex })
              }}
            />
          </div>
        ;
        break;
      }

      case 'title': {
        item.component =
          <div className='fieldGroup'>
            <HelpfulTip
              headerIcon={<span className='icon icon-trending-up'></span>}
              headerText='Pro Tip to Increase Conversions'
              style={{ marginTop: 25, marginBottom: 20 }}
              text={
                <span>
                  A good title should not be dull or too general. It should elicit an emotional reponse to get peoples attention.<br /><br />
                  A dull title: "Please Donate to Save the Whales"<br /><br />
                  A better title: "If you Love Whales Here is How You Can Save Them"
                </span>
              }
            />
            {this.props.textField('title', {
              group: slug,
              label: 'Fundraiser Title',
              placeholder: 'Click Here to Enter a Title',
              maxLength: 128,
              count: true,
              required: true,
              value: title,
              onBlur: (name, value) => {
                if (value) {
                  this.props.updateOrgSignupField('gbx3', { title: value });
                }
              }
            })}
          </div>
        ;
        break;
      }

      case 'preview': {
        item.saveButtonLabel = <span className='buttonAlignText'>Looks Good! Continue to Next Step <span className='icon icon-chevron-right'></span></span>;
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
          <GBLink onClick={(e) => this.props.validateForm(e, this.processForm, slug)}>
            <span style={{ marginLeft: 20 }}>{item.saveButtonLabel}</span>
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
              this.props.formProp({ error: false });
              this.previousStep(step);
            }}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step' }</GBLink> : <span>&nbsp;</span> }
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

  renderVideo(preview = false) {
    const {
      video,
      videoURL,
      videoLoading
    } = this.state;

    if (video.validated) {
      return (
        <div className='videoContainer'>
          { videoLoading ?
          <div className='imageLoader'>
            <img src='https://s3-us-west-1.amazonaws.com/givebox/public/images/squareLoader.gif' alt='Loader' />
          </div> : null }
          <Video
            playing={false}
            url={videoURL}
            onReady={this.videoOnReady}
            style={{
              maxWidth: '100%',
              maxHeight: 'auto'
            }}
            maxHeight={'auto'}
            preview={true}
          />
        </div>
      )
    } else {
      return (
        <div className='mediaPlaceholder'>
          <span className='icon icon-video'></span>
          No Preview Available
        </div>
      )
    }
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
    this.props.getResource('categories', {
      search: {
        sort: 'name',
        order: 'asc',
        filter: `kind:!"individual"%3Bname:!"Auto"`
      },
      callback: (res, err) => {
      }
    });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {

    if (util.isLoading(this.props.categories)) {
      return <Loader msg='Loading Categories...' />
    }

    return (
      <div className='gbx3Steps modalWrapper'>
        <div className='flexCenter' style={{ marginBottom: 10 }}>
          <Image size='thumb' maxSize={40} url={'https://cdn.givebox.com/givebox/public/gb-logo5.png'} alt='Givebox' />
        </div>
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
  const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
  const step = util.getValue(orgSignup, 'step', 0);
  const claimOrgID = util.getValue(orgSignup, 'claimOrgID', null);
  const validTaxID = util.getValue(orgSignup, 'validTaxID', null);
  const completed = util.getValue(orgSignup, 'completed', []);
  const fields = util.getValue(orgSignup, 'fields', {});
  const categories = util.getValue(state, 'resource.categories', {});
  const breakpoint = util.getValue(state, 'gbx3.info.breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;

  return {
    open,
    orgSignup,
    step,
    claimOrgID,
    validTaxID,
    completed,
    fields,
    categories,
    isMobile
  }
}

export default connect(mapStateToProps, {
  updateOrgSignup,
  updateOrgSignupField,
  getResource,
  setOrgStyle
})(SignupSteps);
