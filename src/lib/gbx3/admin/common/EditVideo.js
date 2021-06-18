import React from 'react';
import { connect } from 'react-redux';
import * as _v from '../../../form/formValidate';
import TextField from '../../../form/TextField';
import Video from '../../../common/Video';
import AnimateHeight from 'react-animate-height';

class EditVideo extends React.Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.renderVideo = this.renderVideo.bind(this);
    this.videoOnReady = this.videoOnReady.bind(this);
    const videoURL = props.videoURL || '';
    this.state = {
      videoURL,
      videoURLFieldValue: videoURL,
      video: {
        validated: _v.validateURL(videoURL) ? true : false,
        error: false
      },
      videoLoading: false
    };
  }

  componentDidMount() {
    this.videoLoading();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.videoURL !== this.state.videoURL && this.state.video.validated) {
      this.videoLoading();
    }
  }

  videoOnReady() {
    this.setState({ videoLoading: false });
  }

  videoLoading() {
    const {
      video,
      videoURL,
      mediaType
    } = this.state;

    if (mediaType === 'video' && videoURL && video.validated) {
      this.setState({ videoLoading: true });
    }
  }

  onBlur(e) {
    const {
      videoURL,
      video
    } = this.state;
    if (this.props.onBlur) this.props.onBlur(videoURL, video.validated);
  }

  onChangeVideo(e) {
    const URL = e.currentTarget.value;
    const videoURLFieldValue = URL;
    const video = this.state.video;
    video.validated = _v.validateURL(URL) ? true : false;
    const videoURL = video.validated ? URL : '';
    if (video.error) video.error = false;
    this.setState({ video, videoURL, videoURLFieldValue });
    if (this.props.onChange) this.props.onChange(videoURL, video.validated);
  }

  renderVideo(preview = false) {
    const {
      video,
      videoURL,
      videoLoading
    } = this.state;

    if (video.validated) {
      return (
        <div className='videoContainer'>
          { videoLoading ?
          <div className='imageLoader'>
            <img src='https://cdn.givebox.com/givebox/public/images/spinner-loader.svg' alt='Loader' />
          </div> : null }
          <Video
            playing={false}
            url={videoURL}
            onReady={this.videoOnReady}
            style={{
              maxWidth: '100%',
              maxHeight: 'auto'
            }}
            maxHeight={'auto'}
            preview={true}
          />
        </div>
      )
    } else {
      return (
        <div className='mediaPlaceholder'>
          <span className='icon icon-video'></span>
          No Preview Available
        </div>
      )
    }
  }

  render() {

    const {
      fieldContext,
      error,
      leftBar
    } = this.props;

    const {
      videoURL,
      video,
      videoURLFieldValue
    } = this.state;

    return (
      <div className='editVideoWrapper'>
        <TextField
          name='video'
          label='Embed Video URL'
          fixedLabel={false}
          placeholder='Click Here to Enter a Video URL'
          onChange={this.onChangeVideo}
          onBlur={this.onBlur}
          value={videoURLFieldValue}
          error={error ? 'Video URL is required' : ''}
          leftBar={leftBar}
        />
        { fieldContext ?
          <div className='fieldContext'>
            {fieldContext}
          </div>
        : null }
        <AnimateHeight
          duration={200}
          height={video.validated && videoURL ? 'auto' : 0}
        >
          <div className='input-group'>
            <label className='label'>Video Preview</label>
            <div style={{ marginTop: 10 }} className='flexCenter'>
              {/* Test video: https://vimeo.com/176050010  https://youtu.be/pAj-chxg610 */}
              {this.renderVideo()}
            </div>
          </div>
        </AnimateHeight>
      </div>
    )
  }
}

EditVideo.defaultProps = {
  fieldContext: 'Please enter a YouTube, Vimeo, Facebook Video URL.'
};

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(EditVideo);
