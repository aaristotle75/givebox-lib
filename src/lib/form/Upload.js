import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { mime } from '../common/types';
import Loader from '../common/Loader';
import GBLink from '../common/GBLink';
import Image from '../common/Image';
import ModalRoute from '../modal/ModalRoute';
import ModalLink from '../modal/ModalLink';
import UploadLibrary from './UploadLibrary';
import * as util from '../common/utility';

const API_URL = process.env.REACT_APP_API_URL;

class Upload extends Component {

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.clearImage = this.clearImage.bind(this);
    this.restoreImage = this.restoreImage.bind(this);
    this.imageOnLoad = this.imageOnLoad.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      accepted: [],
      rejected: [],
      loading: false,
      preview: this.props.value || null,
      original: this.props.value || null,
      imageLoading: true,
      error: false
    }
  }

  componentDidMount() {
    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
  }

  componentDidUpdate(prev) {
    if (!prev.clear && this.props.clear === 'reset') {
      this.reset();
    }
    if (prev.value !== this.props.value) {
      this.setState({ preview: this.props.value });
    }
  }

  reset() {
    this.setState({
      original: null,
      preview: null
    });
    this.props.fieldProp(this.props.name, { value: '', clear: null });
  }

  onDrop(accepted, rejected) {
    this.setState({
      loading: true ,
      imageLoading: true
    });
    handleSave(accepted[0], this.handleSaveCallback);
  }

  handleSaveCallback(url, callback = null) {
    if (url) {
      this.setState({ loading: false });
      if (!this.props.noPreview) {
        this.setState({ preview: url });
        this.props.onChange(this.props.name, url);
        this.props.fieldProp(this.props.name, { value: url });
      }
      if (this.props.saveCallback) this.props.saveCallback(url);
      if (callback) callback(url);
    } else {
      this.setState({ error: true });
    }
  }

  clearImage() {
    this.setState({ preview: null });
    this.props.fieldProp(this.props.name, { value: '' });
  }

  restoreImage() {
    this.setState({ preview: this.state.original });
    this.props.fieldProp(this.props.name, { value: this.state.original });
  }

  imageOnLoad() {
    this.setState({ imageLoading: false });
  }

  render() {

    const {
      uploadLabel,
      label,
      labelClass,
      className,
      style,
      error,
      errorType,
      library,
      articleID,
      disallowModalBgClose
    } = this.props;

    const {
      preview
    } = this.state;

    const mimes = mime.image + ',' + mime.text + ',' + mime.applications;

    return (
      <div style={style} className={`dropzone-group input-group ${className || ''} textfield-group ${error ? 'error tooltip' : ''}`}>
        {label && <label className={labelClass}>{label}</label>}
        {this.state.loading && <Loader className={'uploadLoader'} msg={'Uploading'} />}
        {util.isEmpty(library) ?
          <div className='directUpload'>
            {preview ?
              <div className='dropzoneImageContainer'>
                {!this.state.imageLoading && (this.props.customLink || '')}
                <Image maxSize='175px' url={preview} alt={preview} className='dropzoneImage' onLoad={this.imageOnLoad} />
                {!this.state.imageLoading &&
                  <GBLink onClick={this.clearImage} className='link'>Remove Image</GBLink>
                }
              </div>
            :
              <div className='dropzoneImageContainer'>
                {this.props.customLink || '' }
                <Dropzone
                  className='dropzone'
                  onDrop={this.onDrop}
                  accept={mimes}
                >
                  <span className='icon dropzone-icon icon-instagram'></span>
                  <span className='text'>{uploadLabel}</span>
                </Dropzone>
                {this.state.original && <GBLink onClick={this.restoreImage} className='link'>Restore Original</GBLink>}
              </div>
            }
          </div>
        :
          <div className='libraryUpload'>
            <ModalRoute id={'uploadLibrary'} component={() =>
              <UploadLibrary
                image={preview}
                preview={preview}
                test='test'
                handleSaveCallback={this.handleSaveCallback}
                handleSave={handleSave}
                articleID={articleID}
                library={library}
                closeModalAndSave={this.props.closeModalAndSave}
              />}
            />
            {preview ?
              <div className='dropzoneImageContainer'>
                {!this.state.imageLoading && (this.props.customLink || '')}
                <div className='image'>
                  <Image maxSize={this.props.maxSize} url={preview} alt={preview} onLoad={this.imageOnLoad} />
                  <ModalLink opts={{ disallowBgClose: disallowModalBgClose }} style={{ margin: 0 }} className='imageCover' id={'uploadLibrary'}>
                    <div className='imageLink'>Manage</div>
                  </ModalLink>
                </div>
              </div>
            :
            <div className='dropzoneImageContainer'>
              <ModalLink type='div' className='dropzone' id={'uploadLibrary'}>
                <span className='icon dropzone-icon icon-instagram'></span>
                <span className='text'>{uploadLabel}</span>
              </ModalLink>
            </div>
            }
          </div>
        }
        <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
          {error}
          <i></i>
        </div>
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
      </div>
    );
  }
}

Upload.defaultProps = {
  name: 'defaultUpload',
  label: 'Upload',
  labelClass: '',
  uploadLabel: 'Add Photo',
  maxSize: '175px'
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(Upload);


export function handleSave(file, callback, progressCallback) {

  const x = new XMLHttpRequest();
  x.onload = function() {
    if (this.status !== 200 || !this.response) {
      return;
    }
    const s3 = JSON.parse(this.response);
    blob2S3(file, s3, file.name, callback, progressCallback);
  }
  const endpoint = `${API_URL}s3/upload-form?name=${file.name}&mime=${file.type}`
  x.open('GET', endpoint);
  x.withCredentials = true;
  x.send();
}

export function blob2S3(
  file,
  s3,
  fileName,
  callback,
  progressCallback
) {
  const formData = new FormData();
  for (var name in s3.fields) {
    formData.append(name, s3.fields[name]);
  }
  formData.append('file', file, fileName);
  var x = new XMLHttpRequest();

  if (progressCallback) {
    x.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        progressCallback(percentLoaded);
      }
    }
  }

  x.onload = function() {
    if (this.status !== 204) {
      if (callback) {
        callback(null);
      }
      return;
    }
    if (callback) {
      callback(x.getResponseHeader('Location'));
    }
  }
  x.open(s3.method, s3.action);
  x.send(formData);
}
