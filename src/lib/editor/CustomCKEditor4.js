import React, { Component } from 'react';
import { connect } from 'react-redux';
import CKEditor from 'ckeditor4-react';
import '../styles/editor.scss';
import {
	ModalRoute,
	Loader
} from '../';
import { toggleModal } from '../api/actions';
import CKEditor4Upload from './CKEditor4UploadModal';

CKEditor.editorUrl = 'https://cdn.ckeditor.com/4.14.0/full-all/ckeditor.js';

class CustomCKEditor4 extends Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.setConfig = this.setConfig.bind(this);
		this.onBeforeLoad = this.onBeforeLoad.bind(this);
		this.onCloseUploadEditor = this.onCloseUploadEditor.bind(this);

		this.state = {
			content: this.props.content,
			loading: true
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

	onBeforeLoad(CKEDITOR) {
		const bindthis = this;

		CKEDITOR.on( 'dialogDefinition', function( e ) {
				const dialogName = e.data.name;
				const dialogDefinition = e.data.definition;
				const def = dialogDefinition;
				const dialog = def.dialog;

				if (dialogName === 'link') {
					def.width = 400;
					def.minHeight = 75;
					def.height = 75;
					const infoTab = dialogDefinition.getContents( 'info' );
					const els = infoTab.elements;
					els[0].hidden = true;
					els[1].hidden = true;
				}

				if (dialogName === 'image2') {

					def.title = 'Add/Edit Image';
					def.width = 300;
					def.minHeight = 75;
					def.height = 75;

					dialog.on('show', function() {
						bindthis.props.toggleModal('editorUpload', true);
					});

					const infoTab = dialogDefinition.getContents( 'info' );
					const els = infoTab.elements;

					const vbox = els[0];
					const children = vbox.children[0].children;
					const hboxInput = children[0];
					hboxInput.hidden = true;
					hboxInput.label = 'Image URL';
					const hboxBtn = children[1];
					hboxBtn.label = 'Click here to Upload Image';
					hboxBtn.style = 'display:flex;justify-content:center;align-items:center;height:40px;margin-top:50px;width:90%;';

					const alt = els[1];
					alt.hidden = true;
					alt.label = `Text if image can't display`;

					const size = els[2];
					size.hidden = true;

					const align = els[3];
					align.hidden = true;

					const caption = els[4];
					caption.hidden = true;
				}
		});
	}

	setConfig() {
		const bindthis = this;
		const removeButtons = 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Blockquote,CreateDiv,JustifyBlock,Language,BidiRtl,BidiLtr,Flash,Smiley,PageBreak,Iframe,About,Styles,SpecialChar,Maximize,Source,Scayt,Format,Anchor,Underline' + this.props.removeButtons;

		const defaultConfig = {
			width: this.props.width,
			height: this.props.height,
			extraPlugins: 'autoembed,balloontoolbar,image2',
			removePlugins: this.props.removePlugins,
			contentsCss: this.props.contentCss,
			toolbar: this.props.toolbar,
			removeButtons,
			image_previewText: ' ',
			image2_disableResizer: false,
			removeDialogTabs: 'image:advanced;link:advanced;link:target',
			disallowedContent: 'img{width,height}',
			on: {
				instanceReady: function(evt) {
					const editor = evt.editor;
					bindthis.setState({ loading: false });
					if (bindthis.props.initCallback) bindthis.props.initCallback(editor);
					// Register custom context for image widgets on the fly.
					editor.balloonToolbars.create({
						buttons: bindthis.props.balloonButtons,
						widgets: bindthis.props.widgets
					});
				}
			},
			filebrowserImageBrowseUrl: `/upload?articleID=${this.props.articleID}`,
			filebrowserWindowWidth: '640',
			filebrowserWindowHeight: '600'
		}
		const config = { ...defaultConfig, ...this.props.config };
		return config;
	}

	onBlur(e) {
		let content = e.editor.getData();
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

	onCloseUploadEditor() {
		const CKEDITOR = window.CKEDITOR;
		if (CKEDITOR) CKEDITOR.dialog.getCurrent().hide();
	}

	render() {

		const {
			content,
			loading
		} = this.state;

		const {
			acceptedMimes
		} = this.props;

		return (
			<>
				<ModalRoute
					optsProps={{
						closeCallback: this.onCloseUploadEditor,
						customOverlay: { zIndex: 10000000 }
					}}
					id='editorUpload'
					component={() =>
						<CKEditor4Upload
							articleID={4}
							acceptedMimes={acceptedMimes}
						/>
					}
					effect='3DFlipVert'
					style={{ width: '60%' }}
					draggable={true}
					draggableTitle={'Media Library'}
				/>
				<div className='ck-content'>
					{loading ? <Loader className={`ckeditor4 ${this.props.loaderClass}`} msg='Loading editor...' /> : <></>}
					<CKEditor
						config={this.setConfig()}
						data={content}
						onChange={this.onChange}
						onBlur={this.onBlur}
						onFocus={this.onFocus}
						type={this.props.type}
						onBeforeLoad={this.onBeforeLoad}
					/>
				</div>
			</>
		)
	}
}

CustomCKEditor4.defaultProps = {
	config: {},
	ownerType: 'organization',
	height: 'auto',
	width: '100%',
	type: 'classic',
	widgets: 'image',
	toolbar: [
		[ 'Bold', 'Italic', '-', 'Font', '-', 'FontSize', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Link', 'Unlink', '-', 'Image']
	],
	contentCss: 'https://givebox.s3-us-west-1.amazonaws.com/public/css/contents.css',
	removePlugins: 'image,elementspath,resize',
	removeButtons: '',
	loaderClass: '',
	balloonButtons: 'Link,Unlink,Image'
};

function mapStateToProps(state) {
	return {
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(CustomCKEditor4);
