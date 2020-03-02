import React, { Component } from 'react';
import {
  util,
	Loader,
	Alert
} from '../';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { handleFile } from './images/ImageHandling';

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
      content: '',
			loading: false,
			error: null
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
		const config = {
			mediaEmbed: {
				previewsInData: true
			},
			giveboxUpload: {
				callback: (file) => {
					this.setState({ loading: true });
					const p = new Promise((resolve, reject) => {
						this.url = null;
						handleFile(file, (url, error) => {
							this.setState({ loading: false });
							resolve(url);
						});
					})
					return p;
				},
				uploadError: () => {
					this.setState({ error: 'Error uploading. Please make sure the image you are uploading is a JPEG, PNG or GIF file.' });
					this.timeout = setTimeout(() => {
						this.setState({ error: null });
						this.timeout = null;
					}, 4000);
				}
			}
		}
		return config;
	}

  onInit(editor) {
    //console.log( 'Editor is ready to use!', editor );
  }

  onBlur(event, editor) {
    const content = editor.getData();
    //console.log( { event, editor, content } );
    this.setState({ content});
  }

  onChange(event, editor) {
    const content = editor.getData();
    //console.log( { event, editor, content } );
    this.setState({ content });
  }

  onFocus(event, editor) {
    //console.log('focus', editor);
  }

  render() {

    return (
      <div className='ck-content'>
				{this.state.loading && <Loader msg='Loading image...' /> }
				<Alert alert='error' display={this.state.error} msg={this.state.error} />
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
