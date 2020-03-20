import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	Loader,
	Alert,
	sendResource,
	UploadLibrary,
	ModalRoute,
	toggleModal
} from '../';
import CKEditor from 'ckeditor4-react';

CKEditor.editorUrl = 'https://cdn.ckeditor.com/4.14.0/full-all/ckeditor.js';

class CustomCKEditor4 extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
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
      extraPlugins: 'autoembed,balloontoolbar,image2,uploadimage',
			toolbarGroups: [
					{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
					{ name: 'forms', groups: [ 'forms' ] },
					{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
					{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
					{ name: 'links', groups: [ 'links' ] },
					{ name: 'insert', groups: [ 'insert' ] },
					{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
					{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
					'/',
					{ name: 'styles', groups: [ 'styles' ] },
					{ name: 'colors', groups: [ 'colors' ] },
					{ name: 'tools', groups: [ 'tools' ] },
					{ name: 'others', groups: [ 'others' ] },
					{ name: 'about', groups: [ 'about' ] }
			],
			removeButtons: 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,JustifyBlock,Language,BidiRtl,BidiLtr,Flash,Smiley,PageBreak,Iframe,About,Styles,SpecialChar',
			image_previewText: ' ',
      image2_disableResizer: true,
			on: {
        instanceReady: function(evt) {
          var editor = evt.editor;

          // Register custom context for image widgets on the fly.
          editor.balloonToolbars.create({
            buttons: 'Link,Unlink,Image',
            widgets: 'image'
          });

					editor.on('fileUploadRequest', function(evt) {
						console.log('execute on fileUploadRequest', evt);
						evt.stop();
					});
        }
      },
			height: 500
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

  onBlur(e) {
    let content = e.editor.getData();
		content = this.cleanContent(content);
    this.setState({ content});
		if (this.props.onBlur) this.props.onBlur(content);
  }

  onChange(e) {
    let content = e.editor.getData();
    this.setState({ content });
		if (this.props.onChange) this.props.onChange(content);
  }

  onFocus(e) {
    let content = e.editor.getData();
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
          data={this.state.content}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
        />
      </div>
    )
  }
}

CustomCKEditor4.defaultProps = {
	config: {},
	ownerType: 'organization',
	height: 'auto',
	width: '100%'
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
})(CustomCKEditor4);
