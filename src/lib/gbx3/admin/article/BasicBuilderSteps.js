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
  updateData
} from '../../redux/gbx3actions';
import MediaLibrary from '../../../form/MediaLibrary';
import Share from '../../share/Share';
import LinearBar from '../../../common/LinearBar';
import { PhotoshopPicker } from 'react-color-aaristotle';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class BasicBuilderStepsForm extends Component {

  constructor(props) {
    super(props);
    this.gbx3message = this.gbx3message.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.processForm = this.processForm.bind(this);
    this.processCallback = this.processCallback.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.state = {
      imageURL: null,
      orgImageURL: null,
      themeColor: util.getValue(props.data, 'giveboxSettings.primaryColor'),
      error: false,
      previewLoaded: false
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.gbx3message, false);
  }

  gbx3message(e) {
    if (e.data === 'gbx3Initialized') {
      this.setState({ previewLoaded: true });
    }
  }

  handleSaveCallback(url, field) {
    console.log('execute handleSaveCallback', url, field);
    this.setState({ [field]: url })
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

  processForm(fields) {
    util.toTop('modalOverlay-stepsForm');
    const {
      themeColor,
      imageURL,
      orgImageURL
    } = this.state;

    const data = {
      imageURL,
      orgImageURL
    };
    const giveboxSettings = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) {
        data[key] = value.value;
      }
    });
    if (themeColor) giveboxSettings.primaryColor = themeColor;

    if (!util.isEmpty(giveboxSettings)) {
      data.giveboxSettings = {
        ...giveboxSettings
      }
    }
    console.log('execute processForm', data);
    this.props.nextStep();
  }

  renderStep() {
    const {
      step,
      breakpoint,
      articleID,
      orgID,
      data
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
    const stepNumber = `Step ${+step + 1}:`;
    const item = {
      title: '',
      desc: '',
      component: null
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
        item.title = 'Choose a Theme Color'
        item.desc = 'Pick a color that matches your brand or messaging.';
        item.component =
          <div className='flexCenter'>
            <PhotoshopPicker
              styles={style}
              header={''}
              color={this.state.themeColor}
              onChangeComplete={(color) => {
                this.setState({ themeColor: color.hex })
                console.log('execute onChangeComplete', color);
              }}
            />
          </div>
        ;
        break;
      }

      case 'preview': {
        item.title = 'Preview your Form';
        item.desc = `This is how your form will look to your customers. ${!this.state.previewLoaded ? 'Please wait while preview loads...' : ''}`;
        item.component =
          <div className='stagePreview'>
            <iframe src={`${GBX3_URL}/${articleID}/?public&preview`} title={`Preview`} />
          </div>
        ;
        break;
      }

      case 'share': {
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
        console.log('execute imageURL', imageURL);
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
        console.log('execute orgImageURL', orgImageURL);
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
            value: title
          })
        ;
        break;
      }
    }
    return (
      <div className='step'>
        <h2><span className='number'>{stepNumber}</span> {item.title}</h2>
        <div className='stepsSubText'>{item.desc}</div>
        {item.component}
      </div>
    );
  }

  render() {

    const {
      step
    } = this.props;

    const firstStep = step === 0 ? true : false;
    const lastStep = step === this.props.steps ? true : false;
    let saveButtonLabel = 'Continue to Next Step';
    if (lastStep) {
      saveButtonLabel = 'Click Here After Sharing to Finish';
    }

    return (
      <div>
        {this.renderStep()}
        <div className='button-group'>
          <div className='button-item' style={{ width: 150 }}>
            { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => this.props.previousStep()}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> Previous Step</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            {this.props.saveButton(this.processForm, { label: saveButtonLabel })}
          </div>
          <div className='button-item' style={{ width: 150 }}>
            &nbsp;
          </div>
        </div>
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
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser')
  }
}

export default connect(mapStateToProps, {
  sendResource,
  toggleModal,
  updateHelperSteps,
  checkHelperIfHasDefaultValue,
  saveGBX3,
  updateData
})(BasicBuilderSteps)
