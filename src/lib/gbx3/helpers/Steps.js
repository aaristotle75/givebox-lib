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

class StepsForm extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.processCallback = this.processCallback.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.donotShowAgain = this.donotShowAgain.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.state = {
      step: 1
    };
  }

  componentDidMount() {
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
  }

  renderStep() {
    const {
      step
    } = this.state;

    const item = [];

    switch (step) {

      case 4: {
        item.push(
          <div key={4} className='step'>
            <h2><span className='number'>Step 2:</span> Upload a Logo</h2>
            <h4>Please upload an image of your logo. The best logos fit nicely in a square.</h4>
          </div>
        );
        break;
      }

      case 3: {
        item.push(
          <div key={3} className='step'>
            <h2><span className='number'>Step 3:</span> Add an Image</h2>
            <h4>A very nice image speaks louder than words. Upload an image that let's your audience feel the urgency.</h4>
          </div>
        );
        break;
      }

      case 2: {
        item.push(
          <div key={2} className='step'>
            <h2><span className='number'>Step 2:</span> Upload a Logo</h2>
            <h4>Please upload an image of your logo. The best logos fit nicely in a square.</h4>
          </div>
        );
        break;
      }

      case 1:
      default: {
        item.push(
          <div key={1} className='step'>
            <h2><span className='number'>Step 1:</span> What are you raising money for?</h2>
            <h4>Please enter a captivating title below to let your audience know what you are raising money for.</h4>
            {this.props.textField('title', {
              group: 'title',
              fixedLabel: false,
              label: 'Title',
              placeholder: 'Click Here and Enter a Title',
              maxLength: 128,
              count: true,
              required: true
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
    console.log('execute previousStep');
  }

  nextStep() {
    console.log('execute nextStep');
  }

  render() {

    const {
    } = this.props;

    return (
      <>
        <div className='formSectionContainer'>
          <div className='formSection'>
            {this.renderStep()}
          </div>
        </div>
        <div className='button-group'>
          <GBLink className='link secondary' onClick={() => this.previousStep()}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> Previous Step</GBLink>
          {this.props.saveButton(this.processForm, { label: `Continue to Next Step` })}
          <GBLink className='donotShowAgain secondary link' onClick={() => this.donotShowAgain()}>{`Don't Show Again`} <span style={{ marginLeft: '5px' }} className='icon icon-x'></span></GBLink>
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

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  sendResource,
  toggleModal
})(Steps)
