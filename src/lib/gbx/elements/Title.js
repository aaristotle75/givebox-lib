import React, { Component } from 'react';
import {
  util
} from '../../';


export default class Title extends Component {

  render() {

    const {
      style,
      article
    } = this.props;

    const title = util.getValue(article, 'title');
    const orgName = util.getValue(article, 'orgName');

    const defaultStyle = {
    };

    return (
      <div style={{ ...defaultStyle, ...style }} >
        {title}
        <span className='cardHeaderSubtitle' style={{ display: 'block' }}>{orgName}</span>
      </div>
    )
  }
}
