import React, { Component } from 'react';
import {
  util
} from '../../';

export default class Amounts extends Component {

  render() {

    const {
      style,
      article
    } = this.props;

    const amounts = util.getValue(article, 'amounts', []);
    console.log('execute', amounts);

    return (
      <div style={style}>Amounts</div>
    )
  }
}
