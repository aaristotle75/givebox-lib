import React, { Component } from 'react';
import { util } from '../lib';

export default class LoginTest extends Component {

  componentDidMount() {
    window.addEventListener('message', (e) => util.setHeight(e, 'givebox-login'), false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', util.setHeight);
  }

  render() {

    return (
      <iframe title='givebox-login' id='givebox-login' width='100%' src='http://localhost:4010/login' />
    )
  }
}
