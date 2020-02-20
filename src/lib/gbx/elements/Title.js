import React, { Component } from 'react';
import {
  util
} from '../../';
import PropertyBar from '../PropertyBar';


export default class Title extends Component {

  render() {

    const {
      style,
      article,
      edit
    } = this.props;

    const title = util.getValue(article, 'title');
    const orgName = util.getValue(article, 'orgName');

    const defaultStyle = {
    };

    console.log('execute edit', edit);

    return (
      <>
        {edit === 'title' ?
          <PropertyBar>
            <h2>{title}</h2>
          </PropertyBar>
        : <></>}
        <div style={{ ...defaultStyle, ...style }} >
          {title}
          <span className='cardHeaderSubtitle' style={{ display: 'block' }}>{orgName}</span>
        </div>
      </>
    )
  }
}
