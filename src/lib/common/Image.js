import React, { Component } from 'react';
import { imageUrlWithStyle } from './utility';

export default class Image extends Component {

  constructor(props) {
    super(props);
    this.imageOnLoad = this.imageOnLoad.bind(this);
    this.state = {
      imageLoading: true
    }
  }

  imageOnLoad() {
    this.setState({ imageLoading: false });
    if (this.props.onLoad) this.props.onLoad();
  }

  render() {

    const {
      url,
      size,
      alt,
      className
    } = this.props;

    let defaultSize = '175px';
    switch (size) {
      case 'thumb': {
        defaultSize = '80px';
        break;
      }

      case 'small': {
        defaultSize = '175px';
        break;
      }

      case 'medium': {
        defaultSize = '400px';
        break;
      }

      case 'large': {
        defaultSize = '1200px';
        break;
      }

      case 'original': {
        defaultSize = '100%';
        break;
      }

      // no default
    }
    const maxSize = this.props.maxSize || defaultSize;

    return (
      <div style={{ width: maxSize, height: 'auto' }} className={`imageComponent ${className || ''}`}>
        {this.state.imageLoading  &&
        <div className='imageLoader'>
          <img src='https://s3-us-west-1.amazonaws.com/givebox/public/images/squareLoader.gif' alt='Loader' />
        </div>}
        <img style={{ maxWidth: maxSize, maxHeight: maxSize }} src={size === 'inherit' ? url : imageUrlWithStyle(url, size)} alt={alt || url} onLoad={this.imageOnLoad} />
      </div>
    )
  }
}

Image.defaultProps = {
  size: 'original',
  maxSize: '100%'
}
