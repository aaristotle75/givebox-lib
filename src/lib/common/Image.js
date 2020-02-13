import React, { Component } from 'react';
import { imageUrlWithStyle, getValue } from './utility';

export default class Image extends Component {

  constructor(props) {
    super(props);
    this.imageOnLoad = this.imageOnLoad.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      imageLoading: true,
      hoverStyle: {}
    }
  }

  imageOnLoad() {
    this.setState({ imageLoading: false });
    if (this.props.onLoad) this.props.onLoad();
  }

	onMouseEnter() {
		if (this.props.hoverStyle) this.setState({ hoverStyle: this.props.hoverStyle });
	}

	onMouseLeave() {
		if (this.props.hoverStyle) this.setState({ hoverStyle: {} });
	}

  render() {

    const {
      url,
      size,
      alt,
      className,
      imgStyle,
      style,
      maxWidth,
      maxHeight,
      draggable
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
    const mergeStyle = { ...imgStyle, maxWidth: maxWidth || maxSize, maxHeight: maxHeight || maxSize };

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: maxSize, height: 'auto',  ...style, ...this.state.hoverStyle  }} className={`imageComponent ${className || ''}`}>
        {this.state.imageLoading  &&
        <div className='imageLoader'>
          <img src='https://s3-us-west-1.amazonaws.com/givebox/public/images/squareLoader.gif' alt='Loader' />
        </div>}
        <img style={mergeStyle} src={size === 'inherit' ? url : imageUrlWithStyle(url, size)} alt={alt || url} onLoad={this.imageOnLoad} draggable={draggable} />
      </div>
    )
  }
}

Image.defaultProps = {
  size: 'original',
  maxSize: '100%',
  maxHeight: null,
  maxWidth: null,
  draggable: false
}
