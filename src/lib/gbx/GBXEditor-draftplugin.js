import React, { Component } from 'react';
import {
  util
} from '../../';
import Editor from 'draft-js-plugins-editor';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import { EditorState } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import createToolbarPlugin from "draft-js-static-toolbar-plugin";
import '../../../node_modules/draft-js-static-toolbar-plugin/lib/plugin.css';

const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();
const toolbarPlugin = createInlineToolbarPlugin();
const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;


const plugins = [
  linkifyPlugin,
  hashtagPlugin,
  toolbarPlugin
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

  onBlur() {
		const currentContent = this.state.editorState.getCurrentContent();
    const content = stateToHTML(currentContent);
    console.log('execute onBlur', content);
    this.setState({ content});
  }

  onChange(editorState) {
		const currentContent = editorState.getCurrentContent();
    const content = stateToHTML(currentContent);

    console.log('execute onChange', content);
    this.setState({ editorState, content });
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
        <Toolbar />
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
      </>
    )
  }
}
