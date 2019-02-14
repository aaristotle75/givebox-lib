import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  sendResource,
  getResource,
  removeResource,
  toggleModal,
  Form,
  Tabs,
  Tab  
} from '../lib/';
import has from 'has';

class TestModalForm extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }


  formSavedCallback() {
  }

  processCallback(res, err, callback = null) {
  }

  processForm(fields, callback) {
    console.log(fields);
  }

  render() {


    return (
      <div>
        <h2>Test Modal</h2>
        {this.props.richText('emailList', { label: 'Email List', modalID: '1232321', placeholder: 'Enter emails separated by commas', modal: true, required: true })}
      </div>
    )
  }
}

class TestModal extends Component {


  componentDidMount() {
  }

  componentWillUnmount() {
  }


  render() {

    return (
      <div className='modalFormContainer'>
        <Form id={`TestModalForm`} name={`testModalForm`}>
          <TestModalForm />
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

const TestModalConnect = connect(mapStateToProps, {
  sendResource,
  toggleModal,
  getResource,
  removeResource
})(TestModal);

export default TestModalConnect;
