import React, { Component } from 'react';
import ReactPlayer from 'react-player';

export default class Video extends Component {

  constructor(props) {
    super(props);
    this.onReady = this.onReady.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      loading: props.playing && !props.preview ? true : false,
      error: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      if (this.state.error) this.setState({ error: false });
    }
  }

  onReady() {
    this.setState({ loading: false });
    if (this.props.onReady) this.props.onReady();
  }

  onError() {
    this.setState({ error: true });
    if (this.props.onError) this.props.onError();
  }

  render() {

    const {
      url,
      className,
      style,
      maxWidth,
      maxHeight,
      minHeight,
      maxSize,
      playing,
      preview,
      light,
      ID,
      muted,
      loop,
      controls,
      videoRef
    } = this.props;

    const mergeStyle = { maxWidth: maxWidth || maxSize, maxHeight: maxHeight || maxSize, ...style };

    return (
      <div style={{ minHeight, width: maxSize, height: 'auto',  ...style }} className={`imageComponent ${className || ''}`}>
        {this.state.loading  &&
        <div className='imageLoader'>
          <img src='https://s3-us-west-1.amazonaws.com/givebox/public/images/squareLoader.gif' alt='Loader' />
        </div>}
        {this.state.error ?
          <div className='errorMsg'>
            Sorry, an error occurred trying to play the video.<br />
            The video is either set to private or the embed URL is incorrect or not valid.
          </div>
        :
          <ReactPlayer
            playing={playing}
            url={url}
            onReady={this.onReady}
            onError={this.onError}
            style={mergeStyle}
            width='100%'
            light={light}
            muted={muted}
            loop={loop}
            controls={controls}
            ref={videoRef}
          />
        }
      </div>
    )
  }
}

Video.defaultProps = {
  maxSize: '100%',
  maxHeight: null,
  minHeight: '100px',
  maxWidth: null,
  playing: false,
  preview: false,
  light: false,
  muted: false,
  loop: false,
  controls: true,
  videoRef: null
}
