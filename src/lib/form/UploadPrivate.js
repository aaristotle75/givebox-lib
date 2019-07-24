import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { mime } from '../common/types';
import { sendResource } from '../api/helpers';
import { util, Fade } from '../';
import { Line } from 'rc-progress';

const API_URL = process.env.REACT_APP_API_URL;

class UploadPrivate extends Component {

  constructor(props) {
    super(props);
    this.encodeProgress = this.encodeProgress.bind(this);
    this.handleDropAccepted = this.handleDropAccepted.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.saveToS3 = this.saveToS3.bind(this);
    this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
    this.fileUploadError = this.fileUploadError.bind(this);
    this.state = {
      accepted: [],
      rejected: [],
      loading: false,
      error: this.props.error || false,
      success: this.props.success || false,
      percent: 0,
      document: '',
      confirmation: []
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.error !== this.props.error && prevProps.error !== this.props.error) {
      this.setState({ error: this.props.error });
    }
    if (prevState.success !== this.props.success && prevProps.success !== this.props.success) {
      this.setState({ success: this.props.success });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  handleDrop(files) {
    console.log('drop');
  }

  fileUploadError(filename, ID) {
    if (this.props.fileUploadError) this.props.fileUploadError(filename, ID);
    else this.setState({ error : `Error uploading ${filename} to s3 bucket` });
    this.timeout = setTimeout(() => {
      this.setState({ error: false });
      this.timeout = null;
    }, 2500);
  }

  fileUploadSuccess(filename, ID) {
    if (this.props.fileUploadSuccess) this.props.fileUploadSuccess(filename, ID);
    else this.setState({ success : `File ${filename} uploaded successfully to s3 bucket` });
    this.timeout = setTimeout(() => {
      this.setState({ success: false });
      this.timeout = null;
    }, 2500);
  }

  saveToS3(request, file, ID) {
    const bindthis = this;
	  const formData = new FormData();
  	formData.append('file', file, file.name);
  	const x = new XMLHttpRequest();
    x.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        bindthis.encodeProgress(percentLoaded);
      }
    }
  	x.onload = function() {
      let isUploaded = false;
  		if (this.status !== 200) {
        bindthis.setState({ error: 'Error uploading file to s3 bucket' });
  		} else {
        isUploaded = true
      }
      bindthis.props.sendResource('underwritingDocsConfirm', {
        id: [bindthis.props.id],
        data: [{
          ID: ID, isUploaded
        }],
        callback: (res, err) => {
          if (isUploaded) bindthis.fileUploadSuccess(file.name, ID);
          else bindthis.fileUploadError(file.name, ID);
        },
        sendResponse: false
      });
  	}
  	x.open('put', request.signedURL);
    Object.entries(request.header).forEach(([key, value]) => {
      x.setRequestHeader(key, value);
    });
  	x.send(formData);
  }

  handleDropAccepted(files) {
    this.setState({ loading: 'Uploading...', accepted: files });
    const items = [];
    if (!util.isEmpty(files)) {
      Object.entries(files).forEach(([key, value]) => {
        items.push({
          filename: value.name
        });
      });
    }
    this.props.sendResource('underwritingDocs', {
      id: [this.props.id],
      data: items,
      callback: (res, err) => {
        const itemsToDelete = [];
        if (!err) {
          const docs = util.getValue(res, 'documents', {});
          Object.entries(docs).forEach(([key, value]) => {
            itemsToDelete.push(
              { ID: value.ID, isUploaded: false }
            );
          });
          const requests = util.getValue(res, 'requests', {});
          items.forEach((value, key) => {
            const request = requests[value.filename];
            this.saveToS3(request, files[key], docs[key].ID);
          });
        } else {
          this.setState({ error: 'Error uploading file...' });
        }
      },
      sendResponse: false
    });
  }

  handleDropRejected(files) {
    console.log('rejected');
  }

  encodeProgress(progress) {
    if (progress > 99 && this.state.loading) {
      this.setState({ loading: false });
    }
    this.setState({ percent: progress });
  }

  render() {

    const {
      uploadLabel,
      label,
      labelClass,
      className,
      style
    } = this.props;


    const {
      error,
      success
    } = this.state;

    const mimes = `${mime.image},${mime.text},${mime.applications},${mime.video}`;

    return (
      <div style={style} className={`dropzone-group input-group ${className || ''} textfield-group ${error ? 'error tooltip' : ''}`}>
        {label && <label className={labelClass}>{label}</label>}
        <div className='privateUpload'>
          <div className='dropzoneImageContainer'>
            {this.state.loading &&
            <div className='loadImage'>
              <div className='loadingBarWrap'>
                <span className='loadingText'>{this.state.loading}</span>
                <Line className='loadingBar' percent={this.state.percent} strokeWidth='5' strokeColor='#32dbec' trailWidth='5' trailColor='#253655' strokeLinecap='square' />
              </div>
            </div>
            }
            {this.props.customLink || '' }
            <Dropzone
              className='dropzone'
              onDrop={this.handleDrop}
              onDropAccepted={this.handleDropAccepted}
              onDropRejected={this.handleDropRejected}
              accept={mimes}
            >
              <span className={`icon dropzone-icon icon-${this.props.icon}`}></span>
              <span className='text'>{uploadLabel}</span>
            </Dropzone>
          </div>
        </div>
        <Fade in={error}><div className={`errorMsg`}>{error}</div></Fade>
        <Fade in={success}><div className={`successMsg`}>{success}</div></Fade>
      </div>
    );
  }
}

UploadPrivate.defaultProps = {
  name: 'defaultUpload',
  label: 'Upload',
  labelClass: '',
  uploadLabel: 'Add Document',
  icon: 'file-plus',
  maxSize: '175px'
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  sendResource
})(UploadPrivate);
