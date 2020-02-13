import React, { Component } from 'react';
import {
  util
} from '../../';

export default class Summary extends Component {

  render() {

    const {
      style,
      article
    } = this.props;

    const summary = util.getValue(article, 'summary');

    return (
      <div style={style}>{summary}</div>
    )
  }
}
