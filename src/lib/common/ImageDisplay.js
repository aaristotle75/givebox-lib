import React, {Component} from 'react';
import {
  Image,
  util,
  ActionsMenu,
  GBLink
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
        <div className='button-group flexCenter'>
          <GBLink className='link' onClick={() => this.props.toggleModal('imageDisplay', false)}>Close</GBLink>
          {!util.isEmpty(actions) ?
            <ActionsMenu
              options={actions}
            />
          :
          ''}
        </div>
      </div>
    )
  }
}

ImageDisplay.defaultProps = {
  size: 'original',
  className: 'noFlex',
  actions: {}
}
