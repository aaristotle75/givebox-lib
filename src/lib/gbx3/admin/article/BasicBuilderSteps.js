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
  updateGlobals
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
    this.state = {
      themeColor: util.getValue(props.data, 'giveboxSettings.primaryColor'),
      error: false,
      previewLoaded: false
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.gbx3message, false);
  }

  gbx3message(e) {
    const {
      step
    } = this.props;

    if (e.data === 'gbx3Initialized') {
      const stepConfig = util.getValue(this.props.config, step, {});
      const slug = util.getValue(stepConfig, 'slug');
      if (slug === 'preview') {
        this.setState({ previewLoaded: true }, () => this.props.stepCompleted(+step));
      }
    }
  }

  async saveStep(data) {
    const {
      step
    } = this.props;
    const updated = [];
    const completedStep = await this.props.stepCompleted(+step);
    const dataUpdated = await this.props.updateData(data);
    if (completedStep) updated.push('completedStep');
    if (dataUpdated) updated.push('dataUpdated');
    if (updated.length === 2) {
      this.props.saveGBX3('article', {
        updateLayout: false
      });
    }
  }

  handleSaveCallback(url, field) {
    const {
      data
    } = this.props;
    if (url && url !== util.getValue(data, field)) this.saveStep({ [field]: url });
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

    if (slug === 'themeColor') {
      if (util.getValue(data, 'giveboxSettings.primaryColor') !== themeColor && themeColor) {
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
        if (globalsUpdated) this.saveStep({ giveboxSettings: { primaryColor: themeColor }});
      }
    }
    this.props.updateHelperSteps({ step: this.props.nextStep() });
  }

  renderStep() {
    const {
      step,
      breakpoint,
      articleID,
      orgID,
      data,
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
        item.desc = !this.state.previewLoaded ? 'Please wait while the preview loads...' : 'This is how your form will look to your customers.';
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
        const imageURL = this.props.checkHelperIfHasDefaultValue('article', { field: 'imageURL', defaultCheck: 'image' }) ? '' : util.getValue(data, 'imageURL');
        item.title = 'Add an Image';
        item.desc = 'A very nice image speaks louder than words. Upload an image that lets your audience feel the urgency to give.';
        item.component =
          <MediaLibrary
            blockType={'article'}
            image={imageURL}
            preview={imageURL}
            handleSaveCallback={(url) => this.handleSaveCallback(url, 'imageURL')}
            handleSave={util.handleFile}
            library={library}
            showBtns={'hide'}
            saveLabel={'close'}
            mobile={breakpoint === 'mobile' ? true : false }
            uploadOnly={true}
          />
        ;
        break;
      }

      case 'logo': {
        const orgImageURL = this.props.checkHelperIfHasDefaultValue('article', { field: 'orgImageURL', defaultCheck: 'logo' }) ? '' : util.getValue(data, 'orgImageURL');
        item.title = 'Upload a Logo';
        item.desc = 'Please upload an image of your logo. The best logos fit nicely in a square.';
        item.component =
          <MediaLibrary
            blockType={'article'}
            image={orgImageURL}
            preview={orgImageURL}
            handleSaveCallback={(url) => this.handleSaveCallback(url, 'orgImageURL')}
            handleSave={util.handleFile}
            library={library}
            showBtns={'hide'}
            saveLabel={'close'}
            mobile={breakpoint === 'mobile' ? true : false }
            uploadOnly={true}
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
              if (value && value !== title) this.saveStep({ title: value });
            }
          })
        ;
        break;
      }
    }
    return (
      <div className='stepContainer'>
        <div className='stepStatus'>{completed ? <span className='green'><span className='icon icon-check'></span> Step {stepNumber} Completed</span> : <span className='gray'><span className='icon icon-alert-circle'></span> Step {stepNumber} Not Completed</span> }</div>
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            <span className={`icon icon-${item.icon}`}></span>
            <div className='stepTitle'>
              <span className='number'>Step {stepNumber}</span>
              {item.title}
            </div>
          </div>
          <div className='stepsSubText'>{item.desc}</div>
          <div className={`stepComponent`}>
            {item.component}
          </div>
        </div>
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
        </div>
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
    button: util.getValue(state, 'gbx3.globals.button', {})
  }
}

export default connect(mapStateToProps, {
  sendResource,
  toggleModal,
  updateHelperSteps,
  checkHelperIfHasDefaultValue,
  saveGBX3,
  updateData,
  updateGlobals
})(BasicBuilderSteps)
