import React, { Component } from 'react';
import {
  util
} from '../../';


export default class OrgName extends Component {

  render() {

    const {
      text,
      style,
      article
    } = this.props;

    console.log('execute', this.props);

    return (
      <div style={style}>{text}</div>
    )
  }
}
