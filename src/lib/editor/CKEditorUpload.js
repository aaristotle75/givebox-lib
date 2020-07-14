import React, { Component } from 'react';
import {
	util,
	MediaLibrary,
	Loader
} from '../';

export default class CKEditorUpload extends Component {

	constructor(props) {
		super(props);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.handleImageSize = this.handleImageSize.bind(this);
		this.getMeta = this.getMeta.bind(this);
		this.handleAspectRatio = this.handleAspectRatio.bind(this);
		this.state = {
			url: '',
			loading: false
		};
		this.CKEDITOR = window.opener.CKEDITOR;
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

		const CKEDITOR = this.CKEDITOR;
		this.setState({ loading: true });

		const button = CKEDITOR.dialog.getCurrent().getButton('ok');
		this.timeout = setTimeout(() => {
			if (url) {
				const funcNum = this.props.queryParams.CKEditorFuncNum;
				CKEDITOR.tools.callFunction( funcNum, util.imageUrlWithStyle(url, 'large') );
				this.handleImageSize(width, height);
			}
			this.setState({ loading: false }, () => {
				setTimeout(() => {
					if (button) CKEDITOR.tools.setTimeout(button.click, 0, button);
					window.close();
				}, 0);
			});
		}, 2000);
	}

	closeModalAndCancel(modalID) {
		window.close();
		window.opener.CKEDITOR.dialog.getCurrent().hide();
	}

	handleSaveCallback(url) {
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

	handleImageSize(width, height) {
		const CKEDITOR = window.opener.CKEDITOR;
		const dialog = CKEDITOR.dialog.getCurrent();
		const width_field = dialog.getContentElement('info', 'width');
		const height_field = dialog.getContentElement('info', 'height');
		width_field.setValue(width);
		height_field.setValue(height);
	}

	render() {

		const {
			url,
			loading
		} = this.state;

		const articleID = util.getValue(this.props.queryParams, 'articleID');
		const library = {
			articleID,
			type: 'article',
			borderRadius: 0
		}

		return (
			<div>
				{loading ? <Loader msg='Saving...' /> : <></>}
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
