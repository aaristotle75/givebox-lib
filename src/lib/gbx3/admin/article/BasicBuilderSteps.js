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
import { PhotoshopPicker } from 'react-color-aaristotle';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class BasicBuilderStepsForm extends Component {

  constructor(props) {
    super(props);
    this.saveStep = this.saveStep.bind(this);
    this.gbx3message = this.gbx3message.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.processForm = this.processForm.bind(this);
    this.processCallback = this.processCallback.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.state = {
      themeColor: util.getValue(props.data, 'giveboxSettings.primaryColor'),
      error: false,
      previewLoaded: false,
      editorOpen: false
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.gbx3message, false);
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

  handleSaveCallback(url, field, blockName) {
    const {
      data,
      blocks
    } = this.props;
    if (url && url !== util.getValue(data, field)) {
      const block = util.getValue(blocks, blockName, {});
      const options = util.getValue(block, 'options', {});
      const image = util.getValue(options, 'image', {});
      image.URL = util.imageUrlWithStyle(url, image.size);
      const blockObj = {
        ...block,
        content: {
          image
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
      button
    } = this.props;

    const {
      themeColor
    } = this.state;

    const stepConfig = util.getValue(this.props.config, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    if (slug === 'themeColor' && themeColor && (util.getValue(data, 'giveboxSettings.primaryColor') !== themeColor)) {
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
    } else if (this.props.steps === step) {
      this.props.exitAdmin();
    } else {
      this.saveStep(null, null, false, this.gotoNextStep);
    }
  }

  gotoNextStep() {
    this.props.updateHelperSteps({ step: this.props.nextStep() });
  }

  renderStep() {
    const {
      step,
      breakpoint,
      articleID,
      orgID,
      data,
      blocks,
      openAdmin: open
    } = this.props;

    const library = {
      saveMediaType: 'org',
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
    const item = {
      title: '',
      icon: stepConfig.icon,
      desc: '',
      component: null,
      className: '',
      saveButtonLabel: 'Save & Continue to Next Step'
    };

    switch (slug) {
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
        item.title = 'Choose a Theme Color';
        item.desc = 'Pick a color that matches your brand or messaging.';
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

      case 'preview': {
        item.saveButtonLabel = 'Looks Good! Continue to Next Step';
        item.className = 'preview';
        item.title = 'Preview your Form';
        item.desc = !this.state.previewLoaded ?
          'Please wait while the preview loads...'
          :
          <div>
            <span>This is how your form will look to your customers.</span>
            <span style={{ marginTop: 10, display: 'block' }}>If you really want to roll up your sleeves, try our <GBLink style={{ fontSize: 14, display: 'inline' }} onClick={() => this.props.toggleBuilder()}>Advanced Builder</GBLink>, where you can customize pretty much everything!</span>
          </div>
        ;
        item.component =
          <div className='stagePreview flexCenter'>
            <iframe src={`${GBX3_URL}/${articleID}/?public&preview`} title={`Preview`} />
          </div>
        ;
        break;
      }

      case 'share': {
        item.saveButtonLabel = 'All Finished! Take Me to My Dashboard';
        item.title = 'Share It!';
        item.desc = 'Click a social icon below to share your fundraiser to start raising money.';
        item.component =
          <Share
            hideList={['web']}
          />
        ;
        break;
      }

      case 'image': {
        const mediaBlock = util.getValue(blocks, 'media', {});
        const mediaURL = util.getValue(mediaBlock, 'content.image.URL', '').replace(/medium$/i, 'original');
        const imageURL = (!util.checkImage(mediaURL) || !mediaURL) ? '' : mediaURL;

        item.saveButtonLabel = 'Continue to Next Step';
        item.title = 'Add an Image';
        item.desc = 'A very nice image speaks louder than words. Upload an image that lets your audience feel the urgency to give.';
        item.component =
          <MediaLibrary
            blockType={'article'}
            image={imageURL}
            preview={imageURL}
            handleSaveCallback={(url) => this.handleSaveCallback(url, 'imageURL', 'media')}
            handleSave={util.handleFile}
            library={library}
            showBtns={'hide'}
            saveLabel={'close'}
            mobile={breakpoint === 'mobile' ? true : false }
            uploadOnly={true}
            uploadEditorSaveStyle={{ width: 250 }}
            uploadEditorSaveLabel={'Click Here to Save Image'}
            imageEditorOpenCallback={(editorOpen) => {
              this.setState({ editorOpen })
            }}
          />
        ;
        break;
      }

      case 'logo': {
        const logoBlock = util.getValue(blocks, 'logo', {});
        const logoURL = util.getValue(logoBlock, 'content.image.URL', util.getValue(data, 'orgImageURL')).replace(/small$/i, 'original');
        const orgImageURL = (!util.checkImage(logoURL) || !logoURL) ? '' : logoURL;
        item.saveButtonLabel = 'Continue to Next Step';
        item.title = 'Upload a Logo';
        item.desc = 'Please upload an image of your logo. The best logos fit nicely in a square.';
        item.component =
          <MediaLibrary
            blockType={'article'}
            image={orgImageURL}
            preview={orgImageURL}
            handleSaveCallback={(url) => this.handleSaveCallback(url, 'orgImageURL', 'logo')}
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

      case 'title':
      default: {
        const title = this.props.checkHelperIfHasDefaultValue('article', { field: 'title', defaultCheck: 'text' }) ? '' : util.getValue(data, 'title');

        item.title = 'What are you raising money for?';
        item.desc = 'Please enter a captivating title below to let your audience know what you are raising money for.';
        item.component =
          this.props.textField('title', {
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
                this.saveStep({ title: value }, blockObj);
              }
            }
          })
        ;
        break;
      }
    }
    return (
      <div className='stepContainer'>
        <div className='stepStatus'>
          <GBLink onClick={() => this.processForm()}>
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
            { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => this.props.previousStep()}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> Previous Step</GBLink> : <span>&nbsp;</span> }
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

  return {
    step: util.getValue(helperSteps, 'step', 0),
    breakpoint: util.getValue(state, 'gbx3.info.breakpoint'),
    articleID: util.getValue(state, 'gbx3.info.articleID'),
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    data: util.getValue(state, 'gbx3.data', {}),
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser'),
    gbxStyle: util.getValue(state, 'gbx3.globals.gbxStyle', {}),
    button: util.getValue(state, 'gbx3.globals.button', {}),
    blocks: util.getValue(state, 'gbx3.blocks.article', {})
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
