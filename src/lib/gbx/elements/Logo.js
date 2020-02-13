import React, { Component } from 'react';
import {
  util,
  Image
} from '../../';


export default class Logo extends Component {

  render() {

    const {
      style,
      article
    } = this.props;

    const defaultStyle = {
      borderRadius: '15%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    const url = util.getValue(article, 'orgImageURL');

    return (
      <Image imgStyle={{ ...defaultStyle, ...style }} url={url} size='small' maxSize={55} />
    )
  }
}
