import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	Loader,
	Alert,
	sendResource
} from '../../';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { handleFile } from './util';
import '../../styles/ckeditor.scss';

class Editor extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onInit = this.onInit.bind(this);
		this.setConfig = this.setConfig.bind(this);
		this.addImageToMediaLibrary = this.addImageToMediaLibrary.bind(this);
		this.uploadError = this.uploadError.bind(this);
		this.cleanContent = this.cleanContent.bind(this);

    this.state = {
      content: this.props.content,
			loading: false,
			error: null,
			errorMsg: 'Error occurred'
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

	setConfig() {
		const defaultConfig = {
			mediaEmbed: {
				previewsInData: true
			},
			giveboxUpload: {
				callback: (file) => {
					this.setState({ loading: true });
					const p = new Promise((resolve, reject) => {
						this.url = null;
						handleFile(file, (url, error) => {
							this.addImageToMediaLibrary(url, resolve);
						});
					})
					return p;
				},
				uploadError: this.uploadError
			}
		}
		const config = { ...defaultConfig, ...this.props.config };
		return config;
	}

	addImageToMediaLibrary(URL, resolve) {
		this.props.sendResource('orgMediaItems', {
			id: [this.props.orgID],
			method: 'POST',
			data: {
				URL
			},
			callback: (res, err) => {
				let url = null;
				if (!err && !util.isEmpty(res)) {
					url = util.getValue(res, 'URL', '');
					// url = url ? util.imageUrlWithStyle(url, 'large') : null;
				}
				resolve(url);
				this.setState({ loading: false });
			}
		});
	}

	uploadError() {
		this.setState({ error: true, errorMsg: 'Error uploading. Please make sure the image you are uploading is a JPEG, PNG or GIF file.' });
		this.timeout = setTimeout(() => {
			this.setState({ error: null });
			this.timeout = null;
		}, 4000);
	}

  onInit(editor) {
		editor.editing.view.focus();
  }

  onBlur(event, editor) {
    let content = editor.getData();
		content = this.cleanContent(content);
    this.setState({ content});
		if (this.props.onBlur) this.props.onBlur(content);
  }

  onChange(event, editor) {
    let content = editor.getData();
    this.setState({ content });
		if (this.props.onChange) this.props.onChange(content);
  }

  onFocus(event, editor) {
    let content = editor.getData();
		if (this.props.onFocus) this.props.onFocus(content);
  }

	cleanContent(contentToOptimize) {
		let content = contentToOptimize;
		const el = document.createElement('div');
		el.innerHTML = content;
		const images = el.getElementsByTagName('img');
		if (!util.isEmpty(images)) {
			for(var i=0; i < images.length; i++){
				const image = util.getValue(images, i);
				if (!util.isEmpty(image)) {
					image.src = util.imageUrlWithStyle(image.src, 'large');
				  console.log(image.src);
				}
			}
		}
		content = el.innerHTML;
		return content;
	}

  render() {

    return (
      <div className='ck-content'>
				{this.state.loading && <Loader msg='Loading image...' /> }
				<Alert alert='error' display={this.state.error} msg={this.state.error} />
        <CKEditor
					config={this.setConfig()}
          editor={ InlineEditor }
          data={this.state.content}
          onInit={this.onInit}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
      </div>
    )
  }
}

Editor.defaultProps = {
	config: {},
	ownerType: 'organization'
};

function mapStateToProps(state) {
	const resource = util.getValue(state, 'resource', {});
	const orgID = util.getValue(resource, 'orgID', null);
  return {
		orgID
  }
}

export default connect(mapStateToProps, {
  sendResource
})(Editor);
