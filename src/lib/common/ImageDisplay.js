import React, {Component} from 'react';
import {
  Image,
  util
} from '../';

export default class ImageDisplay extends Component {

  render() {

    const {
      width,
      height,
      url,
      alt,
      className,
      maxSize,
      size,
      onLoad,
      actions
    } = this.props;

    return (
      <div style={{ padding: '40px 10px 10px 10px' }}>
        <Image
          url={url}
          width={width}
          height={height}
          alt={alt}
          className={className}
          maxSize={maxSize}
          onLoad={onLoad}
          size={size}
        />
        {!util.isEmpty(actions) ?
          actions : ''}
      </div>
    )
  }
}

ImageDisplay.defaultProps = {
  size: 'original',
  className: 'noFlex',
  actions: {}
}
