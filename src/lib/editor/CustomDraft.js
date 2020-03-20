import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import '../styles/editor.scss';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';


const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const hashtagPlugin = createHashtagPlugin();
const linkifyPlugin = createLinkifyPlugin();
const plugins = [
	inlineToolbarPlugin,
  linkifyPlugin,
  hashtagPlugin,
];

const text = 'In this editor a toolbar shows up once you select part of the text …';

export default class UnicornEditor extends Component {

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.focus = this.focus.bind(this);
		this.state = {
			editorState: createEditorStateWithText(text),
		};
	}

	onChange(editorState) {
		this.setState({editorState});
		const content = editorState.getCurrentContent();
		if (this.props.onChange) this.props.onChange(stateToHTML(content), content.hasText());
	}

	onBlur() {
		const content = this.state.editorState.getCurrentContent();
		if (this.props.onBlur) this.props.onBlur(stateToHTML(content), content.hasText());
	}

  focus() {
		this.editor.focus();
  };

  render() {
    return (
      <div style={{ marginTop: 40 }} className={'editor'} onClick={this.focus}>
	      <Editor
	        editorState={this.state.editorState}
	        onChange={this.onChange}
					onBlur={this.onBlur}
	        plugins={plugins}
 					ref={(element) => { this.editor = element; }}
	      />
        <InlineToolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </div>
            )
          }
        </InlineToolbar>
			</div>
    );
  }
}

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => { window.addEventListener('click', this.onWindowClick); });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) => // eslint-disable-next-line
          <Button key={i} {...this.props} />
        )}
      </div>
    );
  }
}


class HeadlinesButton extends Component {
  // When using a click event inside overridden content, mouse down
  // events needs to be prevented so the focus stays in the editor
  // and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
  onMouseDown = (event) => event.preventDefault()

  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div onMouseDown={this.onMouseDown} className={'headlineButtonWrapper'}>
        <button onClick={this.onClick} className={'headlineButton'}>
          H
        </button>
      </div>
    );
  }
}
