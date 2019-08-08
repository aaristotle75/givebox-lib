import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

class ContentEditor extends Component {
  constructor(props) {
    super(props);
    let contentState = this.props.content ? stateFromHTML(this.props.content) : null;
    this.state = {
      editorState: contentState ? EditorState.createWithContent(contentState) : EditorState.createEmpty()
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.inputRef = React.createRef();

    this.handleKeyCommand = command => this._handleKeyCommand(command);

    this.onTab = e => this._onTab(e);

    this.toggleBlockType = type => this._toggleBlockType(type);

    this.toggleInlineStyle = style => this._toggleInlineStyle(style);
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.updateContent !== this.props.updateContent) {
      const contentState = this.props.updateContent ? stateFromHTML(this.props.updateContent) : null;
      const editorState = contentState ? EditorState.createWithContent(contentState) : EditorState.createEmpty();
      const content = editorState.getCurrentContent();
      this.setState({
        editorState
      });
      if (this.props.onChange) this.props.onChange(this.props.fieldName, stateToHTML(content), content.hasText());
    }
  }

  onChange(editorState) {
    this.setState({
      editorState
    });
    const content = editorState.getCurrentContent();
    if (this.props.onChange) this.props.onChange(this.props.fieldName, stateToHTML(content), content.hasText());
  }

  onBlur() {
    const content = this.state.editorState.getCurrentContent();
    if (this.props.onBlur) this.props.onBlur(this.props.fieldName, stateToHTML(content), content.hasText());
  }

  _handleKeyCommand(command) {
    const {
      editorState
    } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  render() {
    const {
      placeholder,
      wysiwyg
    } = this.props;
    const {
      editorState
    } = this.state; // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.

    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();

    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return React.createElement("div", {
      className: "RichEditor-root"
    }, wysiwyg === 'display' ? React.createElement("div", {
      className: "wysiwyg"
    }, React.createElement(BlockStyleControls, {
      editorState: editorState,
      onToggle: this.toggleBlockType
    }), React.createElement(InlineStyleControls, {
      editorState: editorState,
      onToggle: this.toggleInlineStyle
    })) : '', React.createElement("div", {
      className: className,
      onClick: this.focus
    }, React.createElement(Editor, {
      blockStyleFn: getBlockStyle,
      customStyleMap: styleMap,
      editorState: editorState,
      handleKeyCommand: this.handleKeyCommand,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onTab: this.onTab,
      placeholder: placeholder ? placeholder : 'Enter text...',
      ref: this.inputRef,
      spellCheck: true
    })));
  }

}

ContentEditor.defaultProps = {
  wysiwyg: 'display' // Custom overrides for 'code' style.

};
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: `'CenturyGothic', 'sans-serif'`,
    fontSize: 14,
    padding: 2
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';

    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();

    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';

    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return React.createElement("span", {
      className: className,
      onMouseDown: this.onToggle
    }, this.props.label);
  }

}

const BLOCK_TYPES = [{
  label: 'H1',
  style: 'header-one'
}, {
  label: 'H2',
  style: 'header-two'
}, {
  label: 'H3',
  style: 'header-three'
}, {
  label: 'H4',
  style: 'header-four'
}];

const BlockStyleControls = props => {
  const {
    editorState
  } = props;
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
  return React.createElement("div", {
    className: "RichEditor-controls"
  }, BLOCK_TYPES.map(type => React.createElement(StyleButton, {
    key: type.label,
    active: type.style === blockType,
    label: type.label,
    onToggle: props.onToggle,
    style: type.style
  })));
};

const INLINE_STYLES = [{
  label: 'Bold',
  style: 'BOLD'
}, {
  label: 'Italic',
  style: 'ITALIC'
}, {
  label: 'Underline',
  style: 'UNDERLINE'
}];

const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return React.createElement("div", {
    className: "RichEditor-controls"
  }, INLINE_STYLES.map(type => React.createElement(StyleButton, {
    key: type.label,
    active: currentStyle.has(type.style),
    label: type.label,
    onToggle: props.onToggle,
    style: type.style
  })));
};

export default ContentEditor;