import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../../../api/actions';
import {
  savePrefs,
  sendResource
} from '../../../api/helpers';
import Form from '../../../form/Form';
import {
  util,
  GBLink,
  Fade
} from '../../../';
import {
  updateHelperSteps,
  checkHelperIfHasDefaultValue,
  saveGBX3,
  updateData,
  updateGlobals,
  updateBlock
} from '../../redux/gbx3actions';
import MediaLibrary from '../../../form/MediaLibrary';
import Share from '../../share/Share';
import LinearBar from '../../../common/LinearBar';
import Tabs, { Tab } from '../../../common/Tabs';
import Video from '../../../common/Video';
import Dropdown from '../../../form/Dropdown';
import HelpfulTip from '../../../common/HelpfulTip';
import EditVideo from '../../admin/common/EditVideo';
import { PhotoshopPicker } from 'react-color-aaristotle';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class BasicBuilderStepsForm extends Component {

  constructor(props) {
    super(props);
    this.saveStep = this.saveStep.bind(this);
    this.gbx3message = this.gbx3message.bind(this);
    this.handleImageSaveCallback = this.handleImageSaveCallback.bind(this);
    this.handleVideoSaveCallback = this.handleVideoSaveCallback.bind(this);
    this.processForm = this.processForm.bind(this);
    this.processCallback = this.processCallback.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);

    const mediaBlock = util.getValue(props.blocks, 'media', {});
    const mediaType = util.getValue(mediaBlock, 'options.mediaType', 'image');

    this.state = {
      defaultTheme: 'dark',
      mediaType,
      mediaTypeError: null,
      themeColor: util.getValue(props.data, 'giveboxSettings.primaryColor'),
      error: false,
      previewLoaded: false,
      editorOpen: false,
      iframeHeight: 0
    };
  }

  componentDidMount() {
    //this.props.updateHelperSteps({ step: 2 });
    window.addEventListener('message', this.gbx3message, false);
  }

  callbackAfter(tab) {
    this.props.formProp({ error: false });
    this.setState({ mediaType: tab, mediaTypeError: null });
  }

  gbx3message(e) {
    const {
      step
    } = this.props;

    const stepConfig = util.getValue(this.props.config, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    if (e.data === 'gbx3Initialized') {
      if (slug === 'preview') {
        this.setState({ previewLoaded: true }, () => this.saveStep());
      }
    }
    if (e.data === 'gbx3Shared') {
      if (slug === 'share') {
        this.saveStep();
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

  async saveStep(data, block, completed = true, callback) {
    const {
      step
    } = this.props;
    const updated = [];
    const completedStep = completed ? await this.props.stepCompleted(+step) : true;
    const dataUpdated = data ? await this.props.updateData(data) : true;
    const blockUpdated = block ? await this.props.updateBlock('article', block.name, block) : true;

    if (completedStep) updated.push('completedStep');
    if (dataUpdated) updated.push('dataUpdated');
    if (blockUpdated) updated.push('blockUpdated');
    if (updated.length === 3) {
      this.props.saveGBX3('article', {
        callback,
        updateLayout: false
      });
    }
  }

  handleImageSaveCallback(url, field, blockName) {
    const {
      data,
      blocks
    } = this.props;
    if (url && url !== util.getValue(data, field)) {
      const block = util.getValue(blocks, blockName, {});
      const content = util.getValue(block, 'content', {});
      const options = util.getValue(block, 'options', {});
      const image = util.getValue(options, 'image', {});
      image.URL = util.imageUrlWithStyle(url, image.size);
      const blockObj = {
        ...block,
        options: {
          ...options,
          mediaType: this.state.mediaType
        },
        content: {
          ...content,
          image
        }
      };
      this.saveStep({ [field]: url }, blockObj);
    }
  }

  handleVideoSaveCallback(url, field, blockName) {
    const {
      data,
      blocks
    } = this.props;
    if (url && url !== util.getValue(data, field)) {
      const block = util.getValue(blocks, blockName, {});
      const content = util.getValue(block, 'content', {});
      const options = util.getValue(block, 'options', {});
      const blockObj = {
        ...block,
        options: {
          ...options,
          mediaType: this.state.mediaType
        },
        content: {
          ...content,
          video: {
            URL: url,
            auto: false,
            validatedURL: url
          }
        }
      };
      this.saveStep({ [field]: url }, blockObj);
    }
  }

  formSavedCallback() {
    const fields = this.props.formState.fields;
    this.props.toggleModal('stepsForm', false);
    if (this.props.callback) {
      this.props.callback(arguments[0]);
    }
  }

  processCallback(res, err) {
    if (!err) {
      this.props.formSaved(() => this.formSavedCallback());
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  async processForm(fields) {
    util.toTop('modalOverlay-stepsForm');
    const {
      step,
      data,
      gbxStyle,
      button,
      blocks
    } = this.props;

    const {
      themeColor
    } = this.state;

    const stepConfig = util.getValue(this.props.config, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    if (slug === 'themeColor') {
      const globals = {
        gbxStyle: {
          ...gbxStyle,
          backgroundColor: themeColor,
          primaryColor: themeColor
        },
        button: {
          ...button,
          style: {
            ...button.style,
            bgColor: themeColor
          }
        }
      };
      const globalsUpdated = await this.props.updateGlobals(globals);
      if (globalsUpdated) this.saveStep({ giveboxSettings: { primaryColor: themeColor }}, null, true, this.gotoNextStep);
    } else if (slug === 'share') {
      this.saveStep(null, null, true, () => {
        this.props.toggleModal('gbx3Builder', false);
      });
    } else if (slug === 'image') {
      const block = util.getValue(blocks, 'media', {});
      const options = util.getValue(block, 'options', {});
      const blockObj = {
        ...block,
        options: {
          ...options,
          mediaType: this.state.mediaType
        }
      };
      this.saveStep(null, blockObj, false, this.gotoNextStep);
    } else {
      this.saveStep(null, null, false, this.gotoNextStep);
    }
  }

  gotoNextStep() {
    this.props.updateHelperSteps({ step: this.props.nextStep() });
  }

  renderStep() {

    const {
      previewLoaded,
      iframeHeight,
      mediaType,
      mediaTypeError,
      defaultTheme
    } = this.state;

    const {
      step,
      breakpoint,
      articleID,
      orgID,
      data,
      blocks,
      isVolunteer,
      isMobile,
      openAdmin: open
    } = this.props;

    const library = {
      saveMediaType: isVolunteer ? 'article' : 'org',
      articleID,
      orgID,
      type: 'article',
      borderRadius: 0
    };

    const stepConfig = util.getValue(this.props.config, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const stepNumber = +step + 1;
    const completed = this.props.completed.includes(step) ? true : false;
    const firstStep = step === 0 ? true : false;
    const lastStep = step === this.props.steps ? true : false;
    const nextStepName = this.props.getNextStep();
    const nextStepNumber = this.props.nextStep(step) + 1;

    const item = {
      title: '',
      icon: stepConfig.icon,
      desc: '',
      component: null,
      className: '',
      saveButtonLabelTop: <span className='buttonAlignText'>Save & Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>,
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue to Next Step <span className='icon icon-chevron-right'></span></span>
    };

    switch (slug) {

      case 'title': {
        const title = this.props.checkHelperIfHasDefaultValue('article', { field: 'title', defaultCheck: 'text' }) ? '' : util.getValue(data, 'title');

        item.title = 'Title of Your Fundraiser';
        item.desc = 'Please enter a captivating title below to let your supporters know what you are raising money for.';
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
              group: 'title',
              fixedLabel: false,
              label: 'Title',
              placeholder: 'Click Here and Enter a Title',
              maxLength: 128,
              count: true,
              required: false,
              value: title,
              onBlur: (name, value) => {
                if (value && value !== title) {
                  const block = util.getValue(blocks, 'title', {});
                  const defaultFormat = util.getValue(block, 'options.defaultFormat', '');
                  const saveValue = defaultFormat.replace('{{TOKEN}}', value);
                  const blockObj = {
                    ...block,
                    content: {
                      html: saveValue
                    }
                  };
                  this.saveStep({ title: value }, blockObj, true, (res, err) => {
                    if (!util.isEmpty(res) && !err) {
                      const isVolunteer = util.getValue(res, 'volunteer');
                      const volunteerID = util.getValue(res, 'volunteerID');

                      if (isVolunteer && volunteerID) {
                        this.props.sendResource('volunteerNotify', {
                          orgID,
                          id: [volunteerID],
                          method: 'POST',
                          data: {
                            articleID
                          }
                        })
                      };
                    }
                  });
                }
              }
            })}
          </div>
        ;
        break;
      }

      case 'logo': {
        const logoBlock = util.getValue(blocks, 'logo', {});
        const logoURL = util.getValue(logoBlock, 'content.image.URL', util.getValue(data, 'orgImageURL')).replace(/small$/i, 'original');
        const orgImageURL = (!util.checkImage(logoURL) || !logoURL) ? '' : logoURL;
        item.title = 'Upload a Logo';
        item.desc = 'A nice logo makes you easily identifiable to your supporters.';
        item.component =
          <MediaLibrary
            blockType={'article'}
            image={orgImageURL}
            preview={orgImageURL}
            handleSaveCallback={(url) => this.handleImageSaveCallback(url, 'orgImageURL', 'logo')}
            handleSave={util.handleFile}
            library={library}
            showBtns={'hide'}
            saveLabel={'close'}
            mobile={breakpoint === 'mobile' ? true : false }
            uploadOnly={true}
            uploadEditorSaveStyle={{ width: 250 }}
            uploadEditorSaveLabel={'Click Here to Save Logo'}
            imageEditorOpenCallback={(editorOpen) => {
              this.setState({ editorOpen })
            }}
          />
        ;
        break;
      }

      case 'image': {
        const mediaBlock = util.getValue(blocks, 'media', {});
        const mediaURL = util.getValue(mediaBlock, 'content.image.URL', '').replace(/medium$/i, 'original');
        const imageURL = (!util.checkImage(mediaURL) || !mediaURL) ? '' : mediaURL;
        const videoURL = util.getValue(mediaBlock, 'content.video.URL');

        item.title = 'Add an Image or Video for Your Fundraiser';
        item.desc =
          <div>
            <p>A picture speaks a thousand words. Upload an image that inspires people to support your fundraiser.</p>
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
                handleSaveCallback={(url) => {
                  this.setState({ mediaTypeError: null });
                  this.handleImageSaveCallback(url, 'imageURL', 'media');
                }}
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
                formError={mediaTypeError === 'image' ? true : false}
              />
            </Tab>
            <Tab id='video' className='showOnMobile' label={<span className='stepLabel buttonAlignText'>Use a Video <span className='icon icon-video'></span></span>}>
              <EditVideo
                videoURL={videoURL}
                onChange={() => {
                  this.setState({ mediaTypeError: null });
                }}
                onBlur={(url, validated) => {
                  if (url && validated) {
                    this.handleVideoSaveCallback(url, 'videoURL', 'media');
                  }
                }}
                error={mediaTypeError === 'video' ? true : false}
              />
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
              marginBottom: 20,
              boxShadow: 'none',
              color: '#465965'
            },
          }
        };
        item.title = 'Pick a Theme';
        item.desc = 'Choose a color that compliments your Organization logo and/or branding.';
        item.component =
          <div className='fieldGroup'>
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
            <Dropdown
              name='defaultTheme'
              portalID={`category-dropdown-portal-${slug}`}
              portalClass={'gbx3 articleCardDropdown'}
              portalLeftOffset={10}
              className='articleCard'
              contentWidth={400}
              label={'Select a Theme'}
              selectLabel='Select a Theme'
              fixedLabel={true}
              required={true}
              onChange={(name, value) => {
                console.log('execute -> ', value);
              }}
              options={[
                { primaryText: 'Light', value: 'light' },
                { primaryText: 'Dark', value: 'dark' }
              ]}
              showCloseBtn={true}
              value={defaultTheme || 'dark'}
              style={{ paddingTop: 40 }}
            />
          </div>
        ;
        break;
      }

      case 'preview': {
        item.saveButtonLabelTop = <span className='buttonAlignText'>Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabel = <span className='buttonAlignText'>Looks Good! I'm Ready to Share <span className='icon icon-chevron-right'></span></span>;
        item.className = 'preview';
        item.title = 'Preview your Form';
        item.desc = !previewLoaded ?
          'Please wait while the preview loads...'
          :
          <div>
            <span>This is how your fundraiser will look to your supporters.</span>
            {/*
            <span style={{ marginTop: 10, display: 'block' }}>If you really want to roll up your sleeves, try the Givebox <GBLink style={{ fontSize: 14, display: 'inline' }} onClick={() => this.props.toggleBuilder()}>Advanced Builder</GBLink>, where you can customize pretty much everything!</span>
            */}
          </div>
        ;
        item.component =
          <div className='stagePreview flexCenter flexColumn'>
            { !previewLoaded ?
              <div className='imageLoader'>
                <img src='https://cdn.givebox.com/givebox/public/images/block-loader.svg' alt='Loader' />
              </div>
            : null }
            <iframe style={{ height: iframeHeight }} id='previewIframe' src={`${GBX3_URL}/${articleID}/?public&preview`} title={`Preview`} />
          </div>
        ;
        break;
      }

      case 'share': {
        item.saveButtonLabel = <span className='buttonAlignText'>All Finished! <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabelTop = item.saveButtonLabel;
        item.title = 'Share Your Fundraiser!';
        item.desc = 'Customize your share link, copy and paste into an email, and/or click a social media icon below to share your fundraising form and start raising money!';
        item.component =
          <Share
            hideList={['web']}
          />
        ;
        break;
      }

      // no default
    }
    return (
      <div className='stepContainer'>
        <div className='stepStatus'>
          <GBLink onClick={() => this.processForm()}>
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
            { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => this.props.previousStep()}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step'}</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            {this.props.saveButton(this.processForm, { label: item.saveButtonLabel })}
          </div>
          <div className='button-item' style={{ width: 150 }}>
            &nbsp;
          </div>
        </div> : null }
      </div>
    );
  }

  render() {

    return (
      <div>
        {this.renderStep()}
      </div>
    )
  }
}

class BasicBuilderSteps extends Component {

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
      <div className='gbx3Steps'>
        <Form id={`stepsForm`} name={`stepsForm`}>
          <BasicBuilderStepsForm
            {...this.props}
          />
        </Form>
      </div>
    )
  }
}

BasicBuilderSteps.defaultProps = {
}

function mapStateToProps(state, props) {

  const helperSteps = util.getValue(state, 'gbx3.helperSteps', {});
  const isVolunteer = util.getValue(state, 'gbx3.admin.isVolunteer');
  const volunteerID = util.getValue(state, 'gbx3.admin.volunteerID');
  const breakpoint = util.getValue(state, 'gbx3.info.breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;

  return {
    isVolunteer,
    volunteerID,
    step: util.getValue(helperSteps, 'step', 0),
    breakpoint: util.getValue(state, 'gbx3.info.breakpoint'),
    articleID: util.getValue(state, 'gbx3.info.articleID'),
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    data: util.getValue(state, 'gbx3.data', {}),
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser'),
    gbxStyle: util.getValue(state, 'gbx3.globals.gbxStyle', {}),
    button: util.getValue(state, 'gbx3.globals.button', {}),
    blocks: util.getValue(state, 'gbx3.blocks.article', {}),
    isMobile
  }
}

export default connect(mapStateToProps, {
  sendResource,
  toggleModal,
  updateHelperSteps,
  checkHelperIfHasDefaultValue,
  saveGBX3,
  updateData,
  updateGlobals,
  updateBlock
})(BasicBuilderSteps)
