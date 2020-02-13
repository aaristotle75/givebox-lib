import React, { Component } from 'react';
import {
  util,
  Image
} from '../../';


export default class Media extends Component {

  render() {

    const {
      style,
      article
    } = this.props;

    const url = util.getValue(article, 'imageURL');
    const imgStyle = {
      borderRadius: '20px'
    };

    const defaultStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    };

    const maxSize = '360px';

    return (
      <Image style={{ ...defaultStyle, ...style }} imgStyle={{ ...imgStyle }} url={url} size='medium' maxSize={maxSize} />
    )
  }
}
