import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../../api/actions';
import {
  savePrefs,
  sendResource
} from '../../api/helpers';
import Form from '../../form/Form';
import {
  util,
  GBLink,
  Fade
} from '../../';
import {
  updateHelperSteps
} from '../redux/gbx3actions';
import MediaLibrary from '../../form/MediaLibrary';
import ShareSocial from '../share/ShareSocial';
import ShareLinkCopy from '../share/ShareLinkCopy';

class StepsForm extends Component {

  constructor(props) {
    super(props);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.processForm = this.processForm.bind(this);
    this.processCallback = this.processCallback.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.donotShowAgain = this.donotShowAgain.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    const {
      data
    } = props;
    this.state = {
      imageURL: util.getValue(data, 'imageURL'),
      orgImageURL: util.getValue(data, 'orgImageURL')
    };
  }

  componentDidMount() {
  }

  handleSaveCallback(url, field) {
    console.log('execute handleSaveCallback', url, field);
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
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) {
        data[key] = value.value;
      }
    });
    console.log('execute processForm', data);
    this.nextStep();
  }

  renderStep() {
    const {
      step,
      breakpoint,
      articleID,
      orgID,
      data
    } = this.props;

    const {
      imageURL,
      orgImageURL
    } = this.state;

    const item = [];
    const library = {
      saveMediaType: 'org',
      articleID,
      orgID,
      type: 'article',
      borderRadius: 0
    };

    switch (step) {
      case 4: {
        item.push(
          <div key={4} className='step'>
            <h2><span className='number'>Step 4:</span> Share It!</h2>
            <div className='stepsSubText'>Share your fundraiser on social media.</div>
            <ShareLinkCopy />
            <ShareSocial />
          </div>
        );
        break;
      }

      case 3: {
        item.push(
          <div key={3} className='step'>
            <h2><span className='number'>Step 3:</span> Add an Image</h2>
            <div className='stepsSubText'>A very nice image speaks louder than words. Upload an image that let's your audience feel the urgency to give.</div>
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
          </div>
        );
        break;
      }

      case 2: {
        item.push(
          <div key={2} className='step'>
            <h2><span className='number'>Step 2:</span> Upload a Logo</h2>
            <div className='stepsSubText'>Please upload an image of your logo. The best logos fit nicely in a square.</div>
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
          </div>
        );
        break;
      }

      case 1:
      default: {
        item.push(
          <div key={1} className='step'>
            <h2><span className='number'>Step 1:</span> What are you raising money for?</h2>
            <div className='stepsSubText'>Please enter a captivating title below to let your audience know what you are raising money for.</div>
            {this.props.textField('title', {
              group: 'title',
              fixedLabel: false,
              label: 'Title',
              placeholder: 'Click Here and Enter a Title',
              maxLength: 128,
              count: true,
              required: true,
              value: util.getValue(data, 'title')
            })}
          </div>
        );
        break;
      }
    }
    return item;
  }

  donotShowAgain() {
    console.log('execute donotShowAgain');
  }

  previousStep() {
    const {
      step,
      steps
    } = this.props;
    const prevStep = step > 1 ? step - 1 : step;
    this.props.updateHelperSteps({ step: prevStep });
  }

  nextStep() {
    const {
      step,
      steps
    } = this.props;
    const nextStep = step < steps ? step + 1 : step;
    this.props.updateHelperSteps({ step: nextStep });
  }

  render() {

    const {
      steps,
      step
    } = this.props;

    const firstStep = step === 1 ? true : false;
    const lastStep = step === steps ? true : false;
    let saveButtonLabel = 'Continue to Next Step';
    if (lastStep) {
      saveButtonLabel = 'Continue to Share';
    }

    return (
      <>
        <div className='formSectionContainer'>
          <div className='formSection'>
            {this.renderStep()}
          </div>
        </div>
        <div className='button-group'>
          <div className='button-item' style={{ width: 150 }}>
            { !firstStep ? <GBLink className={`link secondary`} disabled={firstStep} onClick={() => this.previousStep()}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> Previous Step</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            {this.props.saveButton(this.processForm, { label: saveButtonLabel })}
          </div>
          <div className='button-item' style={{ width: 150 }}>
            <GBLink className='donotShowAgain secondary link' onClick={() => this.donotShowAgain()}>{`Don't Show Again`} <span style={{ marginLeft: '5px' }} className='icon icon-x'></span></GBLink>
          </div>
        </div>
      </>
    )
  }
}

class Steps extends Component {

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
      <div className='modalFormContainer gbx3Steps'>
        <Form id={`stepsForm`} name={`stepsForm`}>
          <StepsForm
            {...this.props}
          />
        </Form>
      </div>
    )
  }
}

Steps.defaultProps = {
  steps: 4
}

function mapStateToProps(state, props) {

  const helperSteps = util.getValue(state, 'gbx3.helperSteps', {});

  return {
    step: util.getValue(helperSteps, 'step', 1),
    completed: util.getValue(helperSteps, 'completed', false),
    breakpoint: util.getValue(state, 'gbx3.info.breakpoint'),
    articleID: util.getValue(state, 'gbx3.info.articleID'),
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    data: util.getValue(state, 'gbx3.data', {})
  }
}

export default connect(mapStateToProps, {
  sendResource,
  toggleModal,
  updateHelperSteps
})(Steps)
