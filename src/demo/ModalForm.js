import React, { Component } from 'react';
import TestForm from './TestForm';
import { Form, Alert, Tabs, Tab, ModalLink, GBLink, Image } from '../lib';

export default class ModalForm extends Component {

  constructor(props) {
    super(props);
    this.status = this.status.bind(this);
    this.state = {
      msg: '',
      display: false
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

  status() {
  }

  render() {

    return (
      <div>
        <Form name='testForm-testModal'>
          <TestForm {...this.props} />
        </Form>
      </div>
    )
  }
}
