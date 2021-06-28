import React, { Component } from 'react';
import { imageUrlWithStyle } from './utility';

export default class Image extends Component {

  constructor(props) {
    super(props);
    this.imageOnLoad = this.imageOnLoad.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      imageLoading: true,
      error: false,
      hoverStyle: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.setState({ imageLoading: true });
    }
  }

  imageOnLoad() {
    this.setState({ imageLoading: false });
    if (this.props.onLoad) this.props.onLoad();
  }

  onError(e) {
    const {
      url,
      size
    } = this.props;
    if (!this.state.error) {
      const src = url.replace(size, 'original');;
      e.target.src = src;
    }
    this.setState({ imageLoading: false, error: true });
    if (this.props.onError) this.props.onError();
  }

  onMouseEnter() {
    if (this.props.hoverStyle) this.setState({ hoverStyle: this.props.hoverStyle });
  }

  onMouseLeave() {
    if (this.props.hoverStyle) this.setState({ hoverStyle: {} });
  }

  render() {

    const {
      imageLoading
    } = this.state;

    const {
      imgID,
      size,
      url,
      alt,
      className,
      imgStyle,
      style,
      maxWidth,
      maxHeight,
      minHeight,
      minWidth,
      draggable,
      debug
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
    const mergeStyle = {
      visibility: imageLoading ? 'hidden' : 'visible',
      maxWidth: maxWidth || maxSize,
      maxHeight: maxHeight || maxSize,
      ...imgStyle
    };
    const src = size === 'inherit' ? url : imageUrlWithStyle(url, size)

    if (debug) console.log('execute render src', src);

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ minWidth, minHeight, width: maxSize, height: 'auto',  ...style, ...this.state.hoverStyle  }} className={`imageComponent ${className || ''}`}>
        {imageLoading  &&
          <div className='imageLoader'>
            <img src='https://cdn.givebox.com/givebox/public/images/tiny-loader.png' alt='Loader' />
          </div>
        }
        <img id={imgID} style={mergeStyle} src={src} alt={alt || url} onLoad={this.imageOnLoad} onError={this.onError} draggable={draggable} />
      </div>
    )
  }
}

Image.defaultProps = {
  size: 'original',
  minWidth: 10,
  minHeight: 10,
  maxSize: '100%',
  maxHeight: null,
  maxWidth: null,
  draggable: false,
  debug: false
}
