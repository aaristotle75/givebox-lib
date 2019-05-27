import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import {
  ModalRoute,
  ModalLink,
  GBLink,
  types,
  util,
  Loader,
  Image,
  Paginate,
  MaxRecords
} from '../';
import { getResource } from '../api/helpers';
import { removeResource } from '../api/actions';
import UploadEditor from './UploadEditor';
import { post } from 'axios';
import { Line } from 'rc-progress';
import has from 'has';

class UploadLibrary extends Component {

  constructor(props) {
    super(props);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropAccepted = this.handleDropAccepted.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.newUploadProgress = this.newUploadProgress.bind(this);
    this.newUploadProgressCallback = this.newUploadProgressCallback.bind(this);
    this.editPhoto = this.editPhoto.bind(this);
    this.listMedia = this.listMedia.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.selectImageCallback = this.selectImageCallback.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
    this.encodeProgress = this.encodeProgress.bind(this);
    this.readFile = this.readFile.bind(this);
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
    this.props.getResource(this.props.resourceName);
  }

  componentDidUpdate(prev) {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.props.removeResource(this.props.resourceName);
  }

  toggleEditor(bool) {
    this.setState({ editor: bool, loading: false, percent: 0 });
  }

  /*
  handleDrop = acceptedFiles => {
    //this.setState({ image: acceptedFiles[0] })
  }
  */

  deleteImage(ID) {
    console.log('deleteImage', ID);
  }

  selectImage(URL, ID) {
    this.setState({ loading: true });
    let imageUrl = URL;
		if (URL.substr(0, 4) !== 'blob') imageUrl = imageUrl + '?' + util.makeHash(10);
    util.encodeDataURI(imageUrl, this.selectImageCallback, this.encodeProgress);
  }

  encodeProgress(progress) {
    console.log('encodeprogress', progress);
    this.setState({ percent: progress });
  }

  selectImageCallback(data) {
    const file = util.dataURLtoFile(data, `image.png`);
    this.readFile(file, this.editPhoto);
  }

  readFile(file, callback, preview = false) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result, file);
      if (preview) this.setState({ preview: e.target.result });
    }.bind(this);
    reader.readAsDataURL(file);
  }

  editPhoto(url) {
    this.setState({ image: url}, () => this.toggleEditor(true));
  }

  handleDrop(files) {
    console.log('drop');
  }

  newUploadProgressCallback(url) {
    this.editPhoto(url);
  }

  newUploadProgress(url, file) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('progress', function(e) {
    	var percent_complete = (e.loaded / e.total)*100;
    	this.encodeProgress(percent_complete);
    }.bind(this));
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer'
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.newUploadProgressCallback(url);
      }
    }.bind(this);
    xhr.send();
  }

  handleDropAccepted(files) {
    this.setState({ loading: true });
    this.readFile(files[0], this.newUploadProgress, true);
  }

  handleDropRejected(files) {
    console.log('rejected');
  }


  listMedia() {
    const items = [];
    Object.entries(this.props.items).forEach(([key, value]) => {
      items.push(
        <li className='ripple' key={key}>
          <GBLink onClick={() => this.selectImage(value.URL)}><Image url={value.URL} maxSize='75px' alt='Media Item' /></GBLink>
          {/*
          <ModalLink id='image' opts={{ url: value.URL }}><Image url={value.URL} maxSize='75px' alt='Media Item' /></ModalLink>
          <div className='buttons'>
            <GBLink className='select' onClick={() => this.selectImage(value.URL, value.ID)}>Select</GBLink>
            <ModalLink id='delete' className='delete' opts={{ id: value.ID, resource: 'orgMediaItem', resourcesToLoad: ['orgMediaItems'], desc: <div style={{display: 'inline-block', width: 'auto', textAlign: 'center', margin: '10px 0'}}><Image url={value.URL} maxSize='75px' alt='Media Item' /></div>, showLoader: 'no'  }}><span className='icon icon-trash-2'></span></ModalLink>
          </div>
          */}
        </li>
      );
    });
    return <ul>{items}</ul>
  }


  render() {

    const {
      isFetching
    } = this.props;

    const mimes = types.mime.image + ',' + types.mime.text + ',' + types.mime.applications;

    return (
      <div>
        { this.state.loading &&
        <div className='loadImage'>
          <div className='loadingBarWrap'>
            <span className='loadingText'>Loading image...</span>
            <Line className='loadingBar' percent={this.state.percent} strokeWidth='5' strokeColor='#32dbec' trailWidth='5' trailColor='#253655' strokeLinecap='square' />
          </div>
        </div>
        }
        <div className={`uploadContainer ${this.state.loading ? 'blur' : ''}`}>
          {!this.state.editor ?
          <div className='uploadLibraryContainer'>
            {isFetching && <Loader className='uploadLoader' msg={'Loading...'} />}
            <div className='menu'>
              <Dropzone
                className='dropzone'
                onDrop={this.handleDrop}
                onDropAccepted={this.handleDropAccepted}
                onDropRejected={this.handleDropRejected}
                accept={mimes}
              >
                <span className='text'><span className='icon icon-plus'></span> Upload Photo</span>
              </Dropzone>
            </div>
            <div className='content'>
              <div className='photoSection'>
                <h3>Selected Photo(s)</h3>
                <ul>
                  {this.state.preview ? <li onClick={() => this.editPhoto(this.state.preview)}><img src={this.state.preview} alt={'Preview'} /></li>
                  : <li className='noPhoto'>No Photos</li>}
                </ul>
              </div>
              <div className='photoSection mediaList'>
                <h3>Media Library</h3>
                {this.listMedia()}
                <div className='flexCenter flexColumn'>
                  <Paginate
                    name={this.props.resourceName}
                  />
                  <MaxRecords
                    name={this.props.resourceName}
                  />
                </div>
              </div>
            </div>
          </div>
          :
            <UploadEditor
              image={this.state.image}
              toggleEditor={this.toggleEditor}
            />
          }
        </div>
      </div>
    );
  }
}

UploadLibrary.defaultProps = {
}

function mapStateToProps(state, props) {

  const resourceName = 'orgMediaItems';
  const items = state.resource[resourceName] ? state.resource[resourceName] : {};

  return {
    resourceName,
    items: has(items, 'data') ? items.data : {},
    isFetching: has(items, 'isFetching') ? items.isFetching : false
  }
}

export default connect(mapStateToProps, {
  getResource,
  removeResource
})(UploadLibrary);
