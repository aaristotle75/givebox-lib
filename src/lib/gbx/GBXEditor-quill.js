import React, { Component } from 'react';
import {
  util
} from '../../';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill.scss';

Quill.register('modules/imageResize', ImageResize);

const Block = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block);

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

    [{ 'header': [1, 2, 3, 4, false] }],

    ['image', 'video'],

    ['color', { 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  modules = {
    imageResize: {
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
