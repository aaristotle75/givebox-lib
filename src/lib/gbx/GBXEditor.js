import React, { Component } from 'react';
import {
  util
} from '../../';
import '../styles/quill.scss';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import EmbedContainer from 'react-oembed-container';

export default class GBXEditor extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onInit = this.onInit.bind(this);
		this.setConfig = this.setConfig.bind(this);

    const testContent = `<p>Test</p><p>&nbsp;</p><figure class="media"><oembed url="https://youtu.be/bxY4lpc207Q"></oembed></figure>`;
    this.state = {
      content: ''
    };
  }

  componentDidMount() {
  }

	setConfig() {
		const config = {
			giveboxUpload: {
				callback: (file) => {
					console.log('execute callback', file);
					return 'https://givebox.s3.amazonaws.com/gbx%2Ff666b47e325591a76ff4e6af3bb17c12%2F2019-05-23%2F1xqql7zxxj8bnihnk4rp-jpg%2Foriginal';
				}
			}
		}
		return config;
	}

  onInit(editor) {
    console.log( 'Editor is ready to use!', editor );
  }

  onBlur(event, editor) {
    const content = editor.getData();
    console.log( { event, editor, content } );
    this.setState({ content});
  }

  onChange(event, editor) {
    const content = editor.getData();
    console.log( { event, editor, content } );
    this.setState({ content });
  }

  onFocus(event, editor) {
    console.log('focus', editor);
  }

  render() {

    return (
      <div className='ck-content'>
        <CKEditor
						config={this.setConfig()}
            editor={ ClassicEditor }
            data={this.state.content}
            onInit={this.onInit}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
        />
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
        {/*
        <figure className='media'>
          <oembed url="https://youtu.be/T7ep3FBF3Is"></oembed>
        </figure>
        */}
      </div>
    )
  }
}
