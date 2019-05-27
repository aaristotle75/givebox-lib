import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import ModalRoute from '../modal/ModalRoute';
import ModalLink from '../modal/ModalLink';
import UploadEditor from './UploadEditor';
import GBLink from '../common/GBLink';
import { mime } from '../common/types';
import * as util from '../common/utility';
import Fade from '../common/Fade';
import { post } from 'axios';
import { Line } from 'rc-progress';

class UploadLibrary extends Component {

  constructor(props) {
    super(props);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropAccepted = this.handleDropAccepted.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.imageLoaded = this.imageLoaded.bind(this);
    this.progress = this.progress.bind(this);
    this.state = {
      image: this.props.image || '',
      preview: this.props.preview || '',
      editor: false,
      error: false,
      loading: false,
      percent: 0
    }
    this.uploadImageRef = React.createRef();
  }

  componentDidMount() {
  }

  componentDidUpdate(prev) {
  }

  imageLoaded() {
    console.log('image loaded');
  }

  /*
  handleDrop = acceptedFiles => {
    //this.setState({ image: acceptedFiles[0] })
  }
  */

  handleDrop(files) {
    console.log('drop');
  }

  progress(url) {
    const data = new FormData();
    data.append('files[]', this.state.image, this.state.image.name);
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onDownloadProgress: progressEvent => {
        var percent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
        if (percent >= 100) {
          this.setState({ percent: 100 }, () => {
            setTimeout(() => {
              this.setState({ loading: false, editor: true }, () => this.setState({ percent: 0 }));
            }, 1000);
          });
        } else {
          this.setState({ percent });
        }
      }
    }
    post(url, data, config)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
        this.setState({ percent: 0 });
      });
  }

  handleDropAccepted(files) {
    this.setState({ image: files[0], loading: true }, () => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = function(e) {
          this.progress(e.target.result);
          this.setState({ preview: e.target.result });
        }.bind(this);
        reader.readAsDataURL(files[0]);
      }, 100);
    });
  }

  handleDropRejected(files) {
    console.log('rejected');
  }

  render() {

    const {
      preview
    } = this.props;

    const mimes = mime.image + ',' + mime.text + ',' + mime.applications;

    return (
      <div>
        { this.state.loading &&
        <div className='loadImage'>
          <div className='loadingBarWrap'>
            <span className='loadingText'>Uploading...</span>
            <Line className='loadingBar' percent={this.state.percent} strokeWidth='5' strokeColor='#32dbec' trailWidth='5' trailColor='#253655' strokeLinecap='square' />
          </div>
        </div>
        }
        <div className={`uploadLibraryContainer ${this.state.loading ? 'blur' : ''}`}>
          Upload Library
          <GBLink onClick={() => { this.setState({ editor: this.state.editor ? false : true }) }}>{this.state.editor ? 'Hide' : 'Show'} Editor</GBLink>
          <Dropzone
            className='dropzone'
            onDrop={this.handleDrop}
            onDropAccepted={this.handleDropAccepted}
            onDropRejected={this.handleDropRejected}
            accept={mimes}
          >
            <span className='text'><span className='icon icon-plus'></span> Upload Photo</span>
          </Dropzone>
          <div className='photoSection'>
            <h3>Selected Photo(s)</h3>
            <ul>
              <li>{this.state.preview && <img src={this.state.preview} alt={'Preview'} />}</li>
            </ul>
          </div>
          <div className='photoSection'>
            <h3>Media Library</h3>
            <ul>
              <li>Image 1</li>
              <li>Image 2</li>
            </ul>
          </div>
          {this.state.editor &&
          <div className={`uploadEditorFixed ${this.state.editor ? '' : 'displayNone'}`}>
            <UploadEditor
              image={this.state.image}
            />
          </div>
          }
        </div>
      </div>
    );
  }
}

UploadLibrary.defaultProps = {
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(UploadLibrary);
