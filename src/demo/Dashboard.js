import React, { Component } from 'react';
import TestForm from './TestForm';
import { Form } from '../lib';

export default class Dashboard extends Component {

  render() {

    return (
      <div>
        Dashboard
        <Form name="testForm" options={{ required: true }}>
          <TestForm />
        </Form>
      </div>
    )
  }
}
