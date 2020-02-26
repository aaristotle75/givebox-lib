import React, { Component } from 'react';
import {
  util
} from '../../';
import Editor from 'draft-js-plugins-editor';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import { EditorState } from 'draft-js';

const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();

const plugins = [
  linkifyPlugin,
  hashtagPlugin,
];

export default class GBXEditor extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      editorState: EditorState.createEmpty(),
      content: 'hello'
    };
  }

  onBlur(editorState) {
    console.log('execute onBlur', editorState);
    this.setState({ editorState });
  }

  onChange(editorState) {
    console.log('execute onChange', editorState);
    this.setState({ editorState });
  }

  render() {

    return (
      <>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          onBlur={this.onBlur}
          plugins={plugins}
        />
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
      </>
    )
  }
}
