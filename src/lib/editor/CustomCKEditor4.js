import React, { Component } from 'react';
import { connect } from 'react-redux';
import CKEditor from 'ckeditor4-react';
import '../styles/editor.scss';

CKEditor.editorUrl = 'https://cdn.ckeditor.com/4.14.0/full-all/ckeditor.js';

class CustomCKEditor4 extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
		this.setConfig = this.setConfig.bind(this);
		this.onBeforeLoad = this.onBeforeLoad.bind(this);

    this.state = {
      content: this.props.content
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

		CKEDITOR.on( 'dialogDefinition', function( e ) {
		    const dialogName = e.data.name;
		    const dialogDefinition = e.data.definition;
				if (dialogName === 'image2') {
					const def = dialogDefinition;
					def.title = 'Add/Edit Image';
					def.width = 400;
					def.height = 200;

					const infoTab = dialogDefinition.getContents( 'info' );
					const els = infoTab.elements;
					const vbox = els[0];
					const children = vbox.children[0].children;
					const hboxInput = children[0];
					hboxInput.label = 'Image URL';
					const hboxBtn = children[1];
					hboxBtn.label = 'Choose';

					const alt = els[1];
					alt.label = `Text if image can't display`;

					const align = els[3];
					align.hidden = true;

					const caption = els[4];
					caption.hidden = true;

					/* debug
					console.log('execute def', def);
					console.log('execute info', info);
					console.log('execute els', els);
					*/
				}
		});
	}

	setConfig() {
		const defaultConfig = {
			width: this.props.width,
			height: this.props.height,
      extraPlugins: 'autoembed,balloontoolbar,image2',
			removePlugins: 'image,elementspath,resize',
			contentsCss: 'https://givebox.s3-us-west-1.amazonaws.com/public/css/contents.css',
			toolbar: [
				[ 'Bold', 'Italic', '-', 'Font', '-', 'FontSize', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Link', 'Unlink', '-', 'Image']
			],
			removeButtons: 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Blockquote,CreateDiv,JustifyBlock,Language,BidiRtl,BidiLtr,Flash,Smiley,PageBreak,Iframe,About,Styles,SpecialChar,Maximize,Source,Scayt,Format,Anchor,Underline',
			image_previewText: ' ',
      image2_disableResizer: false,
      removeDialogTabs: 'image:advanced;link:advanced;link:target',
			disallowedContent: 'img{width,height}',
			on: {
        instanceReady: function(evt) {
          const editor = evt.editor;

          // Register custom context for image widgets on the fly.
          editor.balloonToolbars.create({
            buttons: 'Link,Unlink,Image',
            widgets: 'image'
          });
        }
      },
	    filebrowserImageBrowseUrl: `/upload`,
	    filebrowserWindowWidth: '640',
	    filebrowserWindowHeight: '580'
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

  render() {

		const {
			content
		} = this.state;

    return (
      <div className='ck-content'>
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
    )
  }
}

CustomCKEditor4.defaultProps = {
	config: {},
	ownerType: 'organization',
	height: 'auto',
	width: '100%',
	type: 'classic'
};

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {
})(CustomCKEditor4);
