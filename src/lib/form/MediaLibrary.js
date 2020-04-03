import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import {
  ModalLink,
  ModalRoute,
  GBLink,
  types,
  util,
  Loader,
  Image,
  Paginate,
  MaxRecords,
  ImageDisplay
} from '../';
import { getResource, sendResource } from '../api/helpers';
import { removeResource, toggleModal } from '../api/actions';
import UploadEditorResizer from './UploadEditorResizer';
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
    this.listSelected = this.listSelected.bind(this);
    this.selectEditorCallback = this.selectEditorCallback.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
    this.encodeProgress = this.encodeProgress.bind(this);
    this.readFile = this.readFile.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.setPreview = this.setPreview.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
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
    const library = this.props.library;
    const orgID = util.getValue(library, 'orgID');
    this.props.getResource(this.props.resourceName, {
      id: orgID ? [orgID] : null
    });
    if (util.getValue(this.props.library, 'articleID')) this.props.getResource('articleMediaItems', { id: [this.props.library.articleID], reload: true });
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

  setLoading(loading) {
    this.setState({ loading });
  }

  selectEditor(URL, callback = null) {
    this.setState({ loading: 'Loading image...' });
    let imageUrl = URL;
		if (URL.substr(0, 4) !== 'blob') imageUrl = imageUrl + '?' + util.makeHash(10);
    if (callback) callback();
    util.encodeDataURI(imageUrl, this.selectEditorCallback, this.encodeProgress);
  }

  selectEditorCallback(data) {
    const file = util.dataURLtoFile(data, `image.png`);
    this.readFile(file, this.editPhoto);
  }

  setSelected(URL, ID, callback = null, justUploaded = false) {
    this.setPreview(URL);
    this.props.handleSaveCallback(URL, justUploaded);
    if (callback) callback();
  }

  setPreview(URL) {
    this.setState({ preview: URL });
  }

  readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result, file);
    };
    reader.readAsDataURL(file);
  }

  editPhoto(url) {
    this.setState({ image: url}, () => this.toggleEditor(true));
  }

  encodeProgress(progress) {
    this.setState({ percent: progress });
  }

  handleDrop(files) {
    console.log('drop');
  }

  newUploadProgressCallback(url) {
    this.editPhoto(url);
  }

  newUploadProgress(url, file, callback = this.newUploadProgressCallback) {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        this.encodeProgress(percentLoaded);
      }
    }.bind(this);
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer'
    xhr.onload = function() {
      if (xhr.status === 200) {
        callback(url);
      }
    };
    xhr.send();
  }

  handleDropAccepted(files) {
    this.setState({ loading: 'Accepting file...' });
    this.readFile(files[0], this.newUploadProgress);
  }

  handleDropRejected(files) {
    console.log('rejected');
  }

	closeModalAndCancel() {
		const modalID = this.props.modalID;
		if (this.props.closeModalAndSave && !this.props.closeModalAndCancel) this.props.closeModalAndSave(modalID, false);
		if (this.props.closeModalAndCancel) this.props.closeModalAndCancel(modalID, false);
	}

  listSelected() {
    const items = [];
    if (this.state.preview) {
      const actions = [];

      actions.push(
        <GBLink className='button' onClick={() => this.selectEditor(this.state.preview, () => this.props.toggleModal('imageDisplay', false))}>Edit</GBLink>
      );

      items.push(
        <li key={0} className='ripple'>
          <ModalLink id='imageDisplay' opts={{ url: this.state.preview, actions: actions }}><Image url={this.state.preview} size='original' maxWidth='100px' maxHeight='auto' alt='Media Item' /></ModalLink>
          <div className='buttons'>
            <GBLink className='select' onClick={() => this.selectEditor(this.state.preview)}>Edit</GBLink>
          </div>
        </li>
      );
    } else {
      items.push(
        <li key={'noPhoto'} className={`noPhoto ${!this.state.preview ? 'center' : ''}`}>Please upload {!util.isEmpty(this.props.items) ? 'or select' : ''} a photo.</li>
      );
    }

    return (
      <div className='photoSection PhotoList SelectedPhoto'>
        {this.state.preview ? <h4>{util.getValue(this.props.library, 'selectedLabel', 'Selected Photo')}</h4> : ''}
        <ul>
          {items}
        </ul>
      </div>
    )
  }

  listMedia() {
    const items = [];
    let paginate = false;
    if (!util.isEmpty(this.props.items)) {
      Object.entries(this.props.items).forEach(([key, value]) => {
        const actions = [];

        actions.push(
          <GBLink className='button' onClick={() => this.selectEditor(value.URL, () => this.props.toggleModal('imageDisplay', false))}>Edit</GBLink>
        );

        actions.push(
          <GBLink className='button' onClick={() => this.setSelected(value.URL, value.ID, () => this.props.toggleModal('imageDisplay', false))}>Select</GBLink>
        );

        actions.push(
          <ModalLink className='button' id='delete' opts={{ callback: () => this.props.toggleModal('imageDisplay', false), id: value.ID, resource: 'orgMediaItem', resourcesToLoad: ['orgMediaItems'], desc: <div style={{display: 'inline-block', width: 'auto', textAlign: 'center', margin: '10px 0'}}><Image url={value.URL} maxSize='75px' alt='Media Item' /></div>, showLoader: 'no'  }}>Delete</ModalLink>
        );

        items.push(
          <li className='ripple' key={key}>
            <ModalLink id='imageDisplay' opts={{ url: value.URL, id: value.ID, toggleModal: this.props.toggleModal, setSelected: this.setSelected, actions: actions }}><Image url={value.URL} size={this.state.preview === value.URL ? 'original' : 'small'} maxWidth='100px' maxHeight='auto' alt='Media Item' /></ModalLink>
            <div className='buttons'>
            	<GBLink className='select' onClick={() => this.selectEditor(value.URL)}><span className='icon icon-edit'></span></GBLink>
              <GBLink className='select' onClick={() => this.setSelected(value.URL, value.ID)}>Select</GBLink>
            </div>
          </li>
        );
      });
      paginate = true;
    }
    return (
      <div className='photoSection PhotoList'>
        {!util.isEmpty(items) ?
        <div>
          <h4>Your Photos</h4>
          <ul>{items}</ul>
          {paginate ?
            <div className='flexCenter flexColumn'>
              <Paginate
                name={this.props.resourceName}
              />
              <MaxRecords
                name={this.props.resourceName}
              />
            </div>
          : ''}
        </div>
        : ''}
      </div>
    );
  }

  render() {

    const {
      isFetching,
      library,
			modalID
    } = this.props;

    const mimes = types.mime.image + ',' + types.mime.text + ',' + types.mime.applications;

    return (
      <div className='mediaLibrary'>
        <ModalRoute optsProps={{ customOverlay: { zIndex: 10000001 } }} id='imageDisplay' component={(props) =>
          <ImageDisplay {...props} />
        } className='flexWrapper centerItems' effect='3DFlipVert' style={{ width: '60%' }} />
        { this.state.loading &&
        <div className='loadImage'>
          <div className='loadingBarWrap'>
            <span className='loadingText'>{this.state.loading}</span>
            <Line className='loadingBar' percent={this.state.percent} strokeWidth='5' strokeColor='#32dbec' trailWidth='5' trailColor='#253655' strokeLinecap='square' />
          </div>
        </div>
        }
        <div className={`uploadContainer ${this.state.loading ? 'blur' : ''}`}>
          {!this.state.editor ?
          <div className='uploadLibraryContainer'>
            {isFetching && <Loader className='uploadLoader' msg={'Loading...'} />}
            <div className='menu'>
              <div className='menu-group'>
                <Dropzone
                  className='dropzone'
                  onDrop={this.handleDrop}
                  onDropAccepted={this.handleDropAccepted}
                  onDropRejected={this.handleDropRejected}
                  accept={mimes}
                >
                  <span className='text'>
										<span>Drag & Drop</span>
										<span className='icon icon-plus'></span>
										<span>Browse File</span>
									</span>
                </Dropzone>
              	{this.listSelected()}
              </div>
            </div>
            <div className='content'>
              {this.listMedia()}
            </div>
          </div>
          :
            <UploadEditorResizer
              {...this.props}
              image={this.state.image}
              toggleEditor={this.toggleEditor}
              encodeProgress={this.encodeProgress}
              setLoading={this.setLoading}
              setPreview={this.setPreview}
              setSelected={this.setSelected}
              borderRadius={util.getValue(library, 'borderRadius')}
              super={util.getValue(library, 'super', false)}
              orgID={util.getValue(library, 'orgID', null)}
            />
          }
        </div>
        {!this.state.editor ?
        <div style={{ marginBottom: 0 }} className='uploadBottom center button-group'>
          <GBLink className='link' onClick={() => this.closeModalAndCancel()}>{this.props.cancelLabel}</GBLink>
          <GBLink style={{ width: '150px' }} className='button' onClick={() => this.props.closeModalAndSave(modalID)}>{this.props.saveLabel}</GBLink>
        </div>
        : ''}
      </div>
    );
  }
}

UploadLibrary.defaultProps = {
  selectedLabel: 'Selected Photo',
	modalID: 'uploadLibrary',
	showButtons: 'all',
	cancelLabel: 'Cancel',
	saveLabel: 'Save'
}

function mapStateToProps(state, props) {

  const library = props.library;
  const resourceName = util.getValue(library, 'super') ? 'superOrgMediaItems' : 'orgMediaItems';
  const items = state.resource[resourceName] ? state.resource[resourceName] : {};
  const articleItems = state.resource.articleMediaItems ? state.resource.articleMediaItems : {};

  return {
    resourceName,
    items: has(items, 'data') ? items.data : {},
    articleItems: has(articleItems, 'data') ? articleItems.data : {},
    articleIsFetching: has(articleItems, 'isFetching') ? articleItems.isFetching : false,
    isFetching: has(items, 'isFetching') ? items.isFetching : false
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource,
  removeResource,
  toggleModal
})(UploadLibrary);
