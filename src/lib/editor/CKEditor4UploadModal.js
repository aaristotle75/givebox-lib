import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../';
import MediaLibrary from '../form/MediaLibrary';
import Loader from '../common/Loader';
import { toggleModal } from '../api/actions';

class CKEditor4Upload extends Component {

  constructor(props) {
    super(props);
    this.closeModalAndSave = this.closeModalAndSave.bind(this);
    this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.setImage = this.setImage.bind(this);
    this.getMeta = this.getMeta.bind(this);
    this.handleAspectRatio = this.handleAspectRatio.bind(this);
    this.state = {
      url: '',
      loading: false
    };
    this.CKEDITOR = window.CKEDITOR;
  }

  componentDidMount() {
  }

  componentWillUmount() {
    this.timeout = null;
  }

  closeModalAndSave() {
    const {
      url,
      width,
      height
    } = this.state;

    const CKEDITOR = this.CKEDITOR;

    const button = CKEDITOR.dialog.getCurrent().getButton('ok');
    this.timeout = setTimeout(() => {
      if (url) {
        this.setImage(util.imageUrlWithStyle(url, 'large'), width, height);
      }
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          if (button) CKEDITOR.tools.setTimeout(button.click, 0, button);
          this.props.toggleModal('editorUpload', false);
        }, 0);
      });
    }, 2000);
  }

  closeModalAndCancel(modalID) {
    this.props.toggleModal(modalID, false);
    this.CKEDITOR.dialog.getCurrent().hide();
  }

  handleSaveCallback(url) {
    this.setState({ loading: true });
    this.getMeta(url);
  }

  getMeta(url) {
    const bindthis = this;
    const img = new Image();
    img.onload = function() {
      bindthis.handleAspectRatio(this.src, this.width, this.height);
    };
    img.src = url;
  }

  handleAspectRatio(url, w, h) {
    const maxWidth = 550;
    const maxHeight = 550;
    let ratio = 0;
    let width = w;
    let height = h;

    if (width > maxWidth) {
      ratio = maxWidth / width;
      height = parseInt(height * ratio);
      width = parseInt(width * ratio);
    }

    if (height > maxHeight) {
      ratio = maxHeight / height;
      width = parseInt(width * ratio);
      height = parseInt(height * ratio);
    }

    this.setState({
      url,
      width,
      height
    }, this.closeModalAndSave);
  }

  setImage(url, width, height) {
    const CKEDITOR = this.CKEDITOR;
    const dialog = CKEDITOR.dialog.getCurrent();
    const width_field = dialog.getContentElement('info', 'width');
    const height_field = dialog.getContentElement('info', 'height');
    const url_field = dialog.getContentElement('info', 'src');
    width_field.setValue(width);
    height_field.setValue(height);
    url_field.setValue(url);
  }

  render() {

    const {
      url,
      loading
    } = this.state;

    const {
      acceptedMimes
    } = this.props;

    const articleID = util.getValue(this.props.queryParams, 'articleID');
    const library = {
      articleID,
      type: 'article',
      borderRadius: 0
    }

    return (
      <div className='modalWrapper'>
        {loading ? <Loader msg='Saving...' /> : <></>}
        <MediaLibrary
          modalID='editorUpload'
          image={url}
          preview={url}
          handleSaveCallback={this.handleSaveCallback}
          handleSave={util.handleFile}
          library={library}
          closeModalAndSave={this.closeModalAndSave}
          closeModalAndCancel={this.closeModalAndCancel}
          acceptedMimes={acceptedMimes}
        />
      </div>
    )
  }
}

CKEditor4Upload.defaultProps = {
  acceptedMimes: ['image']
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(CKEditor4Upload);
