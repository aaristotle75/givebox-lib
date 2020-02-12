import React, { Component } from 'react';
import {
  util
} from '../../';

export default class Summary extends Component {

  render() {

    const {
      text,
      style
    } = this.props;

    return (
      <div style={style}>{text}</div>
    )
  }
}
