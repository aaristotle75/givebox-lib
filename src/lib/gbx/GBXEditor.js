import React, { Component } from 'react';
import {
  util
} from '../../';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill.scss';


Quill.register('modules/imageResize', ImageResize);

export default class GBXEditor extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      content: ''
    };
  }

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    ['image', 'video'],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  modules = {
    ImageResize: {
        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
    },
    toolbar: this.toolbarOptions
  };

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'font', 'align'
  ];

  onBlur() {
    const content = this.state.content;
    console.log('execute onBlur', content);
    this.setState({ content});
  }

  onChange(content) {
    console.log('execute onChange', content);
    this.setState({ content });
  }

  render() {

    return (
      <>
        <ReactQuill
          value={this.state.content}
          onChange={this.onChange}
          onBlur={this.onBlur}
          modules={this.modules}
          formats={this.formats}
        />
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
      </>
    )
  }
}
