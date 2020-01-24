import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  GBLink
} from '../';
import Dropzone from 'react-dropzone';
import { mime } from '../common/types';
import Image from '../common/Image';

class Attachment extends Component {

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.clearImage = this.clearImage.bind(this);
    this.imageOnLoad = this.imageOnLoad.bind(this);
    this.handleDropAccepted = this.handleDropAccepted.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.readFile = this.readFile.bind(this);
    this.setPreview = this.setPreview.bind(this);
    this.state = {
      file: null,
      preview: this.props.value || null,
      original: this.props.value || null,
      imageLoading: true,
      error: false
    };
    this.uploadImageRef = React.createRef();
  }

  onDrop(accepted, rejected) {
  }

  clearImage() {
    this.setState({ file: null, preview: null, imageLoading: false, percent: 0 });
    if (this.props.callback) this.props.callback();
  }

  imageOnLoad() {
    this.setState({ imageLoading: false });
  }

  setPreview(URL, file) {
    this.setState({ preview: URL, imageLoading: false, percent: 100 });
    if (this.props.callback) this.props.callback(file, URL);
  }

  readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result, file);
    };
    reader.readAsDataURL(file);
  }

  handleDropAccepted(files) {
    this.setState({ imageLoading: 'Accepting file...', file: files[0] });
    this.readFile(files[0], this.setPreview);
  }

  handleDropRejected(files) {
    console.log('rejected');
  }

  render() {

    const {
      preview
    } = this.state;

    const mimes = mime.image + ',' + mime.text + ',' + mime.applications;

    return (
      <div className='attachment'>
        {preview ?
          <div className='dropzoneImageContainer'>
            <Image maxSize='125px' url={preview} alt={preview} className='dropzoneImage' onLoad={this.imageOnLoad} />
            {!this.state.imageLoading &&
              <GBLink onClick={this.clearImage} className='link'>Remove Image</GBLink>
            }
          </div>
        :
          <div className='dropzoneImageContainer'>
            <Dropzone
              className='dropzone'
              onDrop={this.handleDrop}
              onDropAccepted={this.handleDropAccepted}
              onDropRejected={this.handleDropRejected}
              accept={mimes}
            >
              <span className='text'><span className='icon icon-instagram'></span> Attach or drag a file here</span>
            </Dropzone>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(Attachment);
