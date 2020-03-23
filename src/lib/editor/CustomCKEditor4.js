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

	setConfig() {
		const defaultConfig = {
			width: this.props.width,
			height: this.props.height,
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
      image2_disableResizer: false,
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
      }
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

    return (
      <div className='ck-content'>
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
  return {
  }
}

export default connect(mapStateToProps, {
})(CustomCKEditor4);
