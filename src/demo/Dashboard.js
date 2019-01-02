import React, { Component } from 'react';
import TestForm from './TestForm';
import { Form, Alert } from '../lib';

export default class Dashboard extends Component {

  render() {

    return (
      <div>
        Dashboard
        <Alert alert='warning' display={true} msg={'Warning status'} />
        <Form name='testForm'>
          <TestForm />
        </Form>
      </div>
    )
  }
}
