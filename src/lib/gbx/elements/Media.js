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
      display: 'inline-block',
      borderRadius: '20px',
      maxWidth: '300px',
      maxHeight: '300px',
      height: 'auto'
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
