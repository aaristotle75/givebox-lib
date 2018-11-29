import React, { Component } from 'react';
import { ModalRoute, ModalLink } from '../lib';

export default class About extends Component {

  render() {

    return (
      <div>
        About
        <ModalRoute  id='loginTest' component={() => this.props.loadComponent('modal/demo/LoginTest', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '40%', textAlign: 'center' }} />
        <ModalLink id='loginTest'>Login Test</ModalLink>
      </div>
    )
  }
}
