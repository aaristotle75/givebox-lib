import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as util from '../common/utility';
import ModalLink from '../modal/ModalLink';
import ModalRoute from '../modal/ModalRoute';
import GBLink from '../common/GBLink';
import * as types from '../common/types';
import Loader from '../common/Loader';
import Image from '../common/Image';
import Icon from '../common/Icon';
import ImageDisplay from '../common/ImageDisplay';
import Paginate from '../table/Paginate';
import MaxRecords from '../table/MaxRecords';
import { getResource, sendResource } from '../api/helpers';
import { removeResource, toggleModal } from '../api/actions';
import UploadEditorResizer from './UploadEditorResizer';
import { Line } from 'rc-progress';
import LinearBar from '../common/LinearBar';
import has from 'has';
import { ImCamera } from 'react-icons/im';

class MediaLibrary extends Component {

  constructor(props) {
    super(props);
    this.getMimes = this.getMimes.bind(this);
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
    this.removeImage = this.removeImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.state = {
      image: this.props.image || '',
      preview: this.props.preview || '',
      editor: false,
      error: false,
      loading: false,
      percent: 0,
      file: {}
    }
    this.uploadImageRef = React.createRef();
  }

  componentDidMount() {
    const {
      articleID,
      orgID,
      saveMediaType,
      blockType,
      recordsPerPage
    } = this.props;

    if (saveMediaType === 'article' && articleID) {
      this.props.getResource('articleMediaItems', {
        id: [articleID],
        reload: true,
        search: {
          max: recordsPerPage
        }
      });
    } else if (saveMediaType === 'org' && orgID) {
      this.props.getResource(this.props.resourceName, {
        id: orgID ? [orgID] : null,
        reload: true,
        search: {
          max: recordsPerPage
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.image !== this.props.image) || (prevProps.preview !== this.props.preview)) {
      this.setState({
        image: this.props.image,
        preview: this.props.preview
      })
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    //this.props.removeResource(this.props.resourceName);
  }

  removeImage() {
    this.setState({ preview: '' });
    if (this.props.removePreview) this.props.removePreview();
  }

  deleteImage(ID) {
    const {
      orgID
    } = this.props;

    this.props.sendResource('orgMediaItem', {
      orgID,
      id: [ID],
      method: 'delete',
      resourcesToLoad: ['orgMediaItems', 'articleMediaItems'],
      callback: (res, err) => {
        this.props.toggleModal('imageDisplay', false);
      }
    });
  }

  toggleEditor(bool) {
    this.setState({ editor: bool, loading: false, percent: 0 });
    if (this.props.imageEditorOpenCallback) this.props.imageEditorOpenCallback(bool);
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  selectEditor(URL, callback = null) {
    this.setState({ loading: 'Loading Image...' });
    let imageUrl = URL;
    if (URL.substr(0, 4) !== 'blob') imageUrl = imageUrl + '?' + util.makeHash(10);
    if (callback) callback();
    util.encodeDataURI(imageUrl, this.selectEditorCallback, this.encodeProgress);
  }

  selectEditorCallback(data, imageUrl) {
    const fileName = imageUrl.split('\\').pop().split('/').pop();
    const file = util.dataURLtoFile(data, fileName);
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

  editPhoto(url, file) {
    this.setState({ image: url, file }, () => this.toggleEditor(true));
  }

  encodeProgress(progress) {
    this.setState({ percent: progress });
  }

  handleDrop(files) {
    console.log('drop');
  }

  newUploadProgressCallback(url, file) {
    this.editPhoto(url, file);
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
        callback(url, file);
      }
    };
    xhr.send();
  }

  handleDropAccepted(files) {
    this.setState({ error: false, loading: 'Accepting file...' });
    this.readFile(files[0], this.newUploadProgress);
  }

  handleDropRejected(files) {
    this.setState({ error: true });
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
        <li key={'selectedImage'}>
          <div style={{ width: 120, height: 120 }} className='singleImagePreview'>
            <div className='preview-buttons'>
              <GBLink onClick={() => this.selectEditor(this.state.preview, () => this.props.toggleModal('imageDisplay', false))}>Edit</GBLink>
            </div>
            <ModalLink
              id='imageDisplay'
              opts={{ url: this.state.preview, actions: actions
            }}>
              <Image
                onLoad={this.props.previewOnLoad}
                url={this.state.preview}
                size='small'
                maxWidth='120px'
                maxHeight='auto'
                alt='Media Item'
              />
            </ModalLink>
          </div>
        </li>
      );
    } else {
      items.push(
        <li key={'noPhoto'} className={`noPhoto ${!this.state.preview ? 'center' : ''}`}>Please upload {!util.isEmpty(this.props.items) ? 'or select' : ''} an image.</li>
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
    let maxRecords = false;
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
          <GBLink className='button' onClick={() => this.deleteImage(value.ID)}>
            Delete
          </GBLink>
          /*
          <ModalLink className='button' id='delete' opts={{ callback: () => this.props.toggleModal('imageDisplay', false), id: value.ID, resource: 'orgMediaItem', resourcesToLoad: ['orgMediaItems', 'articleMediaItems'], desc: <div style={{display: 'inline-block', width: 'auto', textAlign: 'center', margin: '10px 0'}}><Image url={value.URL} size='small' maxSize='75px' alt='Media Item' /></div>, showLoader: 'no'  }}>Delete</ModalLink>
          */
        );

        items.push(
          <li key={key}>
            <div style={{ width: 120, height: 120 }} className='singleImagePreview'>
              <div className='preview-buttons'>
                <GBLink onClick={() => this.selectEditor(value.URL)}>Edit</GBLink>
                <GBLink onClick={() => this.setSelected(value.URL, value.ID)}>Select</GBLink>
              </div>
              <ModalLink id='imageDisplay' opts={{ url: value.URL, id: value.ID, toggleModal: this.props.toggleModal, setSelected: this.setSelected, actions: actions }}>
              <Image url={value.URL} size={this.state.preview === value.URL ? 'small' : 'small'} maxWidth='120px' maxHeight='auto' alt='Media Item' /></ModalLink>
            </div>
          </li>
        );
      });
      paginate = true;
      maxRecords = true;
    }
    return (
      <div className='photoSection PhotoList'>
        {!util.isEmpty(items) ?
        <div>
          <ul>{items}</ul>
          {paginate ?
            <div className='flexCenter flexColumn'>
              <Paginate
                name={this.props.resourceName}
              />
            </div>
          : null}
          {maxRecords ?
            <div className='flexCenter flexColumn'>
              <MaxRecords
                name={this.props.resourceName}
                direction={'top'}
              />
            </div>
          : null}
        </div>
        : <div className='noRecords flexCenter'>No Photos Uploaded</div>}
      </div>
    );
  }

  getMimes() {
    const {
      acceptedMimes
    } = this.props;

    const mimes = {
      format: '',
      readable: ''
    };
    acceptedMimes.forEach((value, key) => {
      mimes.format = mimes.format + `${types.mime[value]},`;
      mimes.readable = mimes.readable + `${types.mimeReadable[value]},`;
      if (acceptedMimes.length !== (key + 1)) {
        mimes.readable = mimes.readable + ' ';
      }
    });
    if (mimes.format.charAt( mimes.format.length - 1 ) === ',') {
      mimes.format = mimes.format.slice(0, -1);
    }
    if (mimes.readable.charAt( mimes.readable.length - 1 ) === ',') {
      mimes.readable = mimes.readable.slice(0, -1);
    }
    return mimes;
  }

  render() {

    const {
      isFetching,
      library,
      modalID,
      showBtns,
      mobile,
      uploadOnly,
      topLabel,
      labelIcon,
      bottomLabel,
      className,
      formError,
      singlePreview,
      previewMaxSize
    } = this.props;

    const {
      error,
      preview
    } = this.state;

    const mimes = this.getMimes();
    const hasPhotos = !util.isEmpty(this.props.items) ? true : false;

    return (
      <div className={`mediaLibrary ${className}`}>
        <ModalRoute optsProps={{ customOverlay: { zIndex: 10000001 } }} id='imageDisplay' component={(props) =>
          <ImageDisplay {...props} size='large' />
        } className='flexWrapper centerItems' effect='3DFlipVert' style={{ width: '60%' }} />
        { this.state.loading &&
        <div className='loadImage'>
          <div className='loadingBarWrap'>
            <span className='loadingText'>{this.state.loading}</span>
            <LinearBar
              progress={this.state.percent}
            />
            {/*
            <Line className='loadingBar' percent={this.state.percent} strokeWidth='5' strokeColor='#32dbec' trailWidth='5' trailColor='#253655' strokeLinecap='square' />
            */}
          </div>
        </div>
        }
        <div className={`uploadContainer ${this.state.loading ? 'blur' : ''}`}>
          {!this.state.editor ?
          <div className='uploadLibraryContainer'>
            {isFetching && <Loader className='uploadLoader' msg={'Loading...'} />}
            <div className='menu'>
              <div className='menu-group'>
                { singlePreview && this.state.preview ?
                null :
                <Dropzone
                  className={`dropzone ${error || formError ? 'error' : ''}`}
                  onDrop={this.handleDrop}
                  onDropAccepted={this.handleDropAccepted}
                  onDropRejected={this.handleDropRejected}
                  accept={mimes.format}
                >
                  <span className='text'>
                    {!mobile ? <span>{topLabel}</span> : null}
                    {labelIcon}
                    {!mobile ? <span>{bottomLabel}</span> : <span>Add File</span>}
                  </span>
                </Dropzone> }
                {this.props.children}
                {this.state.preview ?
                  singlePreview ?
                  <div style={{ width: previewMaxSize, height: previewMaxSize }} className='singleImagePreview'>
                    <div className='preview-buttons'>
                      <GBLink onClick={() => this.removeImage()}>New Image</GBLink>
                      <GBLink onClick={() => this.selectEditor(this.state.preview)}>Edit Image</GBLink>
                    </div>
                    <Image url={this.state.preview} maxSize={previewMaxSize} alt={'Editor Preview'} />
                  </div>
                  :
                  this.listSelected()
                : null}
              </div>
              { error ?
                <div className='errorMsg'>
                  <strong>File format not supported. Please upload one of the following formats.</strong><br />
                  {mimes.readable}
                </div>
              : <></> }
              { !uploadOnly && hasPhotos ?
              <div className='yourphotos'>
                <h4>Your Photos</h4>
              </div> : null }
            </div>
            { !uploadOnly && hasPhotos ?
            <div className='content'>
              {this.listMedia()}
            </div> : null }
          </div>
          :
            /*
            <UploadCropper
              {...this.props}
              image={this.state.image}
              file={this.state.file}
              toggleEditor={this.toggleEditor}
              encodeProgress={this.encodeProgress}
              setLoading={this.setLoading}
              setPreview={this.setPreview}
              setSelected={this.setSelected}
              borderRadius={util.getValue(library, 'borderRadius')}
              super={util.getValue(library, 'super', false)}
              orgID={util.getValue(library, 'orgID', null)}
              articleID={util.getValue(library, 'articleID', null)}
              saveMediaType={util.getValue(library, 'saveMediaType')}
              uploadEditorSaveLabel={this.props.uploadEditorSaveLabel}
              uploadEditorSaveStyle={this.props.uploadEditorSaveStyle}
            />
            */
            <UploadEditorResizer
              {...this.props}
              image={this.state.image}
              file={this.state.file}
              toggleEditor={this.toggleEditor}
              encodeProgress={this.encodeProgress}
              setLoading={this.setLoading}
              setPreview={this.setPreview}
              setSelected={this.setSelected}
              borderRadius={util.getValue(library, 'borderRadius')}
              super={util.getValue(library, 'super', false)}
              orgID={util.getValue(library, 'orgID', null)}
              articleID={util.getValue(library, 'articleID', null)}
              saveMediaType={util.getValue(library, 'saveMediaType')}
              uploadEditorSaveLabel={this.props.uploadEditorSaveLabel}
              uploadEditorSaveStyle={this.props.uploadEditorSaveStyle}
            />
          }
        </div>
        {!this.state.editor && showBtns !== 'hide' ?
        <div style={{ marginBottom: 0 }} className='uploadBottom center button-group'>
          {showBtns === 'all' || showBtns === 'cancel' ? <GBLink className='link' onClick={() => this.closeModalAndCancel()}>{this.props.cancelLabel}</GBLink> : <></>}
          {showBtns === 'all' || showBtns === 'save' ? <GBLink style={{ width: '150px' }} className='button' onClick={() => this.props.closeModalAndSave(modalID)}>{this.props.saveLabel}</GBLink> : <></>}
        </div>
        : ''}
      </div>
    );
  }
}

MediaLibrary.defaultProps = {
  editorResizerStyle: {},
  className: '',
  selectedLabel: 'Selected Image',
  modalID: 'uploadLibrary',
  showButtons: 'all',
  cancelLabel: 'Cancel',
  saveLabel: 'Update',
  uploadEditorSaveLabel: 'Click Here to Use Image',
  uploadEditorSaveStyle: {
    width: 250
  },
  showBtns: 'all',
  mobile: false,
  acceptedMimes: ['image', 'text', 'applications'],
  uploadOnly: false,
  topLabel: 'Drag Image Here',
  labelIcon:
    <div className='labelIcon'>
      <div className='orText'>or</div>
      <Icon><ImCamera /></Icon>
    </div>
  ,
  bottomLabel: 'Click to Add Image',
  recordsPerPage: 20,
  previewMaxSize: 170
}

function mapStateToProps(state, props) {

  const library = props.library;
  const saveMediaType = util.getValue(library, 'saveMediaType');
  const orgID = util.getValue(library, 'orgID');
  const articleID = util.getValue(library, 'articleID');
  const resourceName = util.getValue(library, 'super') ? 'superOrgMediaItems' : saveMediaType === 'article' ? 'articleMediaItems' : 'orgMediaItems';
  const items = state.resource[resourceName] ? state.resource[resourceName] : {};
  const articleItems = state.resource.articleMediaItems ? state.resource.articleMediaItems : {};

  return {
    saveMediaType,
    orgID,
    articleID,
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
})(MediaLibrary);
