import React, { Component } from 'react';
import { Loader, util } from '../lib';

export default class LoginTest extends Component {

  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.state = {
      iframeLoaded: false
    };
  }

  componentDidMount() {
    const bindthis = this;
    this.iframeRef.current.onload = function() {
      bindthis.setState({iframeLoaded: true});
    }
    window.addEventListener('message', (e) => util.setHeight(e, 'givebox-login'), false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', util.setHeight);
  }

  render() {

    return (
      <div>
        {!this.state.iframeLoaded && <Loader />}
        <iframe ref={this.iframeRef} title='givebox-login' id='givebox-login' width='100%' src='http://localhost:4010/login' />
      </div>
    )
  }
}
