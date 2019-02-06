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
      className,
      maxSize
    } = this.props;

    return (
      <div className={`imageComponent ${className || ''}`}>
        {this.state.imageLoading &&
        <div className='imageLoader'>
          <img src='https://s3-us-west-1.amazonaws.com/givebox/public/images/squareLoader.gif' alt='Loader' />
        </div>}
        <img style={{ maxWidth: maxSize, maxHeight: maxSize }} src={imageUrlWithStyle(url, size)} alt={alt || url} onLoad={this.imageOnLoad} />
      </div>
    )
  }
}

Image.defaultProps = {
  size: 'original',
  maxSize: '175px'
}
