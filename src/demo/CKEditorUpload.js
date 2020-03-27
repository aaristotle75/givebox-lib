import React, { Component } from 'react';
import {
  util,
	MediaLibrary
} from '../lib';


export default class ckeditorUpload extends Component {

  constructor(props) {
    super(props);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.handleImageSize = this.handleImageSize.bind(this);
		this.getMeta = this.getMeta.bind(this);
		this.handleAspectRatio = this.handleAspectRatio.bind(this);
    this.state = {
			url: ''
    };
  }

	componentDidMount() {
		const container = document.getElementById('contentContainer');
		if (container) container.style.top = '0px';
		if (container) container.style.left = '0px';

		const header = document.getElementById('header');
		if (header) header.style.display = 'none';

		const sideBar = document.getElementById('sideBar');
		if (sideBar) sideBar.style.display = 'none';

	}

	closeModalAndSave(modalID) {
		const {
			url,
			width,
			height
		} = this.state;

		const CKEDITOR = window.opener.CKEDITOR;
		if (url) {
			const funcNum = this.props.queryParams.CKEditorFuncNum;
			CKEDITOR.tools.callFunction( funcNum, url );
			this.handleImageSize(width, height);
		}
		const button = CKEDITOR.dialog.getCurrent().getButton('ok');
		if (button) CKEDITOR.tools.setTimeout(button.click, 0, button);
		window.close();
	}

	closeModalAndCancel(modalID) {
		window.close();
		window.opener.CKEDITOR.dialog.getCurrent().hide();
	}

	handleSaveCallback(value) {
		const url = util.imageUrlWithStyle(value, 'large');
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
		const maxWidth = 600;
		const maxHeight = 600;
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
		});
	}

	handleImageSize(width, height) {
		const CKEDITOR = window.opener.CKEDITOR;
		const dialog = CKEDITOR.dialog.getCurrent();
		const width_field = dialog.getContentElement('info', 'width');
		const height_field = dialog.getContentElement('info', 'height');
		width_field.setValue(width);
		height_field.setValue(height);
		console.log('execute dialog', width_field, height_field);
	}

  render() {

		const {
			url
		} = this.state;

		const library = {
			borderRadius: 0
		}

    return (
			<div>
	      <MediaLibrary
					image={url}
					preview={url}
	        handleSaveCallback={this.handleSaveCallback}
	        handleSave={util.handleFile}
	        library={library}
	        closeModalAndSave={this.closeModalAndSave}
	        closeModalAndCancel={this.closeModalAndCancel}
	      />
			</div>
    )
  }
}
