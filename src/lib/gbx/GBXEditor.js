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
    this.state = {
      content: `<p>Test</p><p>&nbsp;</p><figure class="media"><oembed url="https://youtu.be/bxY4lpc207Q"></oembed></figure>`
    };
  }

  componentDidMount() {
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
      <>
        <CKEditor
            editor={ ClassicEditor }
            data={this.state.content}
            onInit={this.onInit}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
        />
        <EmbedContainer markup={this.state.content}>
          <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
        </EmbedContainer>
        {/*
        <figure className='media'>
          <oembed url="https://youtu.be/T7ep3FBF3Is"></oembed>
        </figure>
        */}
      </>
    )
  }
}
