import React, { Component } from 'react';
import {
  Form
} from '../lib/';
import TestForm from './TestForm';

export default class Contact extends Component {

  render() {

    return (
      <div>
        <Form id={`testForm`} name={`testForm`}>
          <TestForm {...this.props} />
        </Form>
      </div>
    )
  }
}
