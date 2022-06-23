import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../../../api/actions';
import {
  sendResource
} from '../../../api/helpers';
import Form from '../../../form/Form';
import {
  util,
  types,
  GBLink,
  Icon,
  Image
} from '../../../';
import {
  updateHelperSteps,
  checkHelperIfHasDefaultValue,
  saveGBX3,
  updateData,
  updateGlobals,
  updateBlock,
  setStyle,
  resetBlock
} from '../../redux/gbx3actions';
import {
  defaultStyle
} from '../../redux/gbx3defaults';
import MediaLibrary from '../../../form/MediaLibrary';
import Share from '../../share/Share';
import SignupShare from '../../signup/SignupShare';
import Dropdown from '../../../form/Dropdown';
import EditVideo from '../../admin/common/EditVideo';
import { PhotoshopPicker } from 'react-color-aaristotle';
import { MdCheckCircle } from 'react-icons/md';
import Tickets from './builderSteps/Tickets';
import Where from './builderSteps/Where';
import When from './builderSteps/When';
import SweepstakesEnds from './builderSteps/SweepstakesEnds';
import { blockTemplates } from '../../blocks/blockTemplates';

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
    this.updateTheme = this.updateTheme.bind(this);

    const mediaBlock = util.getValue(props.blocks, 'media', {});
    const mediaType = util.getValue(mediaBlock, 'options.mediaType', 'image');

    this.state = {
      defaultTheme: util.getValue(props.globals, 'theme'),
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

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }

  callbackAfter(tab) {
    this.props.formProp({ error: false });
    this.setState({ mediaType: tab, mediaTypeError: null });
  }

  gbx3message(e) {

    const {
      step,
      kind
    } = this.props;

    const stepConfig = util.getValue(this.props.config, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    if (e.data === 'gbx3Initialized') {
      if (slug === 'previewShare') {
        this.setState({ previewLoaded: true });
      }
    }

    if (e.data === 'gbx3Shared') {
      if (slug === 'previewShare') {
        this.props.formSaved(() => {
          // Do something here...
        }, `Congratulations, your ${types.kind(kind).name} has been SHARED!`, 4000);
        //this.saveStep();
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

  async updateTheme(theme) {
    const {
      themeColor
    } = this.state;

    const imageURL = util.getValue(this.props.blocks, 'media.content.image.URL');
    const globals = {
      ...this.props.globals,
      theme,
      gbxStyle: {
        ...defaultStyle[theme],
        backgroundImage: imageURL,
        //backgroundColor: themeColor,
        primaryColor: themeColor
      }
    };

    const updated = await this.props.updateGlobals(globals);
    if (updated) {
      this.props.saveGBX3('article', {
        callback: (res, err) => {
          this.props.setStyle();
        },
        updateLayout: false
      });
    }
  }

  async saveStep(data, block, completed = true, callback) {
    const {
      step
    } = this.props;
    const updated = [];
    const stepConfig = util.getValue(this.props.config, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const completedStep = completed ? await this.props.stepCompleted(slug) : true;
    const dataUpdated = data ? await this.props.updateData(data) : true;
    const blockUpdated = block ? await this.props.updateBlock('article', block.name, block) : true;

    if (completedStep) updated.push('completedStep');
    if (dataUpdated) updated.push('dataUpdated');
    if (blockUpdated) updated.push('blockUpdated');
    if (updated.length === 3) {
      this.props.saveGBX3('article', {
        callback: () => {
          if (callback) callback();
        },
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
    if (url !== util.getValue(data, field)) {
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

  processCallback(res, err, callback = this.formSavedCallback) {
    if (!err) {
      this.props.formSaved(() => { if (callback) callback(); });
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  async processForm(fields) {
    util.toTop('modalOverlay-gbx3Builder');
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
      if (globalsUpdated) this.saveStep({ giveboxSettings: { primaryColor: themeColor }}, null, true, () => {
        this.gotoNextStep();
      });
    } else if (slug === 'previewShare') {
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
    } else if (slug === 'tickets') {
      this.saveStep(null, null, true, this.gotoNextStep);
    } else if (slug === 'when') {
      const blockReset = await this.props.resetBlock('article', 'when');
      if (blockReset) {
        const whenValue = util.getValue(fields, 'when.value');
        const whenShowTime = util.getValue(fields, 'when.enableTime', false);
        const data = {
          whenShowTime,
          when: whenValue,
          endsAt: null
        };

        const whenBlock = util.getValue(blockTemplates, 'article.event.when', {});
        const blockObj = {
          ...whenBlock,
          content: {
            ...util.getValue(whenBlock, 'content', {}),
            range1: whenValue,
            range1Time: whenShowTime
          }
        };
        this.saveStep(data, blockObj, true, this.gotoNextStep);
      }
    } else if (slug === 'where') {
      const where = util.getValue(fields, 'where.where', {});
      const data = {
        where
      };
      const block = util.getValue(blocks, 'where', {});
      const blockObj = {
        ...block,
        content: {
          where,
          htmlTemplate: ''
        }
      };
      this.saveStep(data, blockObj, true, this.gotoNextStep);
    } else if (slug === 'sweepstakesEnds') {
      const endsAt = util.getValue(fields, 'endsAt.value', null);
      const data = {
        endsAt: endsAt
      };
      const block = util.getValue(blocks, 'countdown', {});
      const blockObj = {
        ...block,
        content: {
          endsAt,
          endsAtTime: false
        }
      };
      this.saveStep(data, blockObj, true, this.gotoNextStep);
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
    const completed = this.props.completed.includes(slug) ? true : false;
    const firstStep = step === 0 ? true : false;
    const lastStep = step === this.props.steps ? true : false;
    const nextStepName = this.props.getNextStep();
    const nextStepNumber = this.props.nextStep(step) + 1;

    const item = {
      title: '',
      icon: stepConfig.icon,
      customIcon: stepConfig.customIcon,
      desc: stepConfig.desc,
      component: null,
      className: '',
      defaultButtonGroup: true,
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue</span>
    };

    const mediaBlock = util.getValue(blocks, 'media', {});
    const mediaURL = util.getValue(mediaBlock, 'content.image.URL', util.getValue(data, 'imageURL', '')).replace(/medium$/i, 'original');
    const imageURL = (!util.checkImage(mediaURL) || !mediaURL) ? '' : mediaURL;
    const videoURL = util.getValue(mediaBlock, 'content.video.URL', util.getValue(data, 'videoURL', ''));

    const leftSide =
      <div className='leftSide' style={{ width: 150 }}>
        { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => this.props.previousStep()}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step'}</GBLink> : <span>&nbsp;</span> }
      </div>
    ;

    const rightSide =
      <div className='rightSide' style={{ width: 150 }}>
        <Image className='pulsate' url={isMobile ? 'https://cdn.givebox.com/givebox/public/gb-logo5.png' : 'https://cdn.givebox.com/givebox/public/givebox-logo_white.png'} alt='Givebox Logo' maxHeight={30} />
      </div>
    ;

    switch (slug) {

      case 'tickets': {
        item.className = 'stepAmounts';
        item.defaultButtonGroup = false;
        item.component =
          <Tickets
            {...this.props}
            leftSide={leftSide}
            rightSide={rightSide}
            saveStep={this.saveStep}
            gotoNextStep={this.gotoNextStep}
            updateData={this.props.updateData}
            processForm={this.processForm}
            processCallback={this.processCallback}
          />
        ;
        break;
      }

      case 'where': {
        item.component =
          <Where
            {...this.props}
          />
        ;
        break;
      }

      case 'when': {
        item.component =
          <When
            {...this.props}
          />
        ;
        break;
      }

      case 'sweepstakesEnds': {
        item.component =
          <SweepstakesEnds
            {...this.props}
          />
        ;
        break;
      }

      case 'title': {
        const title = this.props.checkHelperIfHasDefaultValue('article', { field: 'title', defaultCheck: 'text' }) ? '' : util.getValue(data, 'title');

        item.component =
          <div className='fieldGroup'>
            <MediaLibrary
              image={imageURL}
              preview={imageURL}
              quickUpload={true}
              singlePreview={true}
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
              imageEditorOpenCallback={(editorOpen) => {
                this.setState({ editorOpen });
              }}
              editorResizerStyle={{ marginTop: -150 }}
              formError={mediaTypeError === 'image' ? true : false}
            />
            {this.props.textField('title', {
              group: 'title',
              style: { paddingTop: 20 },
              fixedLabel: false,
              label: 'Title',
              placeholder: 'Click Here and Enter a Title',
              maxLength: 128,
              count: true,
              required: false,
              value: title,
              leftBar: true,
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

        item.component =
          <div className='fieldGroup'>
            <div className='column50'>
              <Dropdown
                name='defaultTheme'
                portalID={`category-dropdown-portal-${slug}`}
                portalClass={'gbx3 articleCardDropdown gbx3Steps'}
                portalLeftOffset={10}
                className='articleCard'
                contentWidth={400}
                label={'Theme Style'}
                selectLabel='Choose Theme'
                fixedLabel={false}
                required={true}
                onChange={(name, value) => {
                  this.updateTheme(value);
                }}
                options={[
                  { primaryText: 'Light', value: 'light' },
                  { primaryText: 'Dark', value: 'dark' }
                ]}
                showCloseBtn={true}
                value={defaultTheme || 'light'}
                style={{ paddingBottom: 20 }}
                leftBar={true}
                hideIcons={true}
              />
              <div className='input-group'>
                <div className='fieldFauxInput'>
                  <div className='inputLeftBar'></div>
                  <div className='placeholder'>Choose Accent Color</div>
                  <div className='fieldContext'>
                    Button and link color.
                  </div>
                </div>
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
              </div>
            </div>
            <div className='column50'>
              <EditVideo
                videoURL={videoURL}
                onChange={() => {
                  this.setState({ mediaTypeError: null });
                }}
                onBlur={(url, validated) => {
                  if (url && validated) {
                    this.setState({ mediaType: 'video'}, () => {
                      this.handleVideoSaveCallback(url, 'videoURL', 'media');
                    });
                  } else if (!url) {
                    this.setState({ mediaType: 'image'}, () => {
                      this.handleVideoSaveCallback('', 'videoURL', 'media');
                    });
                  }
                }}
                error={mediaTypeError === 'video' ? true : false}
                leftBar={true}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'previewShare': {
        item.saveButtonLabel = <span className='buttonAlignText'>Finished! Take Me to My Form</span>;
        item.className = 'preview';
        item.component =
          <div className='stagePreview flexCenter flexColumn'>
            <SignupShare 
              style={{
                marginBottom: 0,
                paddingBottom: 0
              }}
              showHelper={false}
              previewShareOpen={true}
              allowToggle={false}
              hidePreview={true}
              modalName={'gbx3Builder'}
              articleID={articleID}
            />
          </div>
        ;
        break;
      }

      // no default
    }
    return (
      <div className='stepContainer'>
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            {completed ?
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
        { !this.state.editorOpen  && item.defaultButtonGroup ?
        <div className='button-group'>
          {leftSide}
          <div className='button-item'>
            {this.props.saveButton(this.processForm, { label: item.saveButtonLabel })}
          </div>
          {rightSide}
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
      <Form id={`stepsForm`} name={`stepsForm`}>
        <BasicBuilderStepsForm
          {...this.props}
        />
      </Form>
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
    globals: util.getValue(state, 'gbx3.globals', {}),
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
  updateBlock,
  setStyle,
  resetBlock
})(BasicBuilderSteps)
