import React, { Component } from 'react';
import Draft from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
const {
  Editor,
  CompositeDecorator,
  EditorState,
  RichUtils
} = Draft;

class ContentEditor extends Component {
  constructor(props) {
    super(props);
    const decorator = new CompositeDecorator([{
      strategy: findLinkEntities,
      component: Link
    }]);
    let contentState = this.props.content ? stateFromHTML(this.props.content) : null;
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.inputRef = /*#__PURE__*/React.createRef();
    this.linkInputRef = /*#__PURE__*/React.createRef();

    this.handleKeyCommand = command => this._handleKeyCommand(command);

    this.onTab = e => this._onTab(e);

    this.toggleBlockType = type => this._toggleBlockType(type);

    this.toggleInlineStyle = style => this._toggleInlineStyle(style);

    this.promptForLink = this._promptForLink.bind(this);

    this.onURLChange = e => this.setState({
      urlValue: e.target.value
    });

    this.confirmLink = this._confirmLink.bind(this);
    this.cancelLink = this.cancelLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
    this.state = {
      editorState: contentState ? EditorState.createWithContent(contentState, decorator) : EditorState.createEmpty(decorator),
      showURLInput: false,
      urlValue: '',
      status: 'idle'
    };
  }

  componentDidMount() {
    if (this.props.autoFocus) this.inputRef.current.focus();
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

  _promptForLink(e) {
    e.preventDefault();
    const {
      editorState
    } = this.state;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
      let url = '';

      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url
      }, () => {
        setTimeout(() => this.linkInputRef.current.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {
      editorState,
      urlValue
    } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
      url: urlValue,
      target: '_blank'
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    this.setState({
      editorState: RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey),
      showURLInput: false,
      urlValue: ''
    }, () => {
      setTimeout(() => this.inputRef.current.focus(), 0);
    });
  }

  cancelLink(e) {
    this.setState({
      showURLInput: false,
      urlValue: ''
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    const {
      editorState
    } = this.state;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null)
      });
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

  onFocus() {
    const content = this.state.editorState.getCurrentContent();
    if (this.props.onFocus) this.props.onFocus(this.props.fieldName, stateToHTML(content), content.hasText());
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
      wysiwyg,
      allowLink,
      color
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

    let urlInput;

    if (this.state.showURLInput) {
      urlInput = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        onChange: this.onURLChange,
        ref: this.linkInputRef,
        type: "text",
        value: this.state.urlValue,
        onKeyDown: this.onLinkInputKeyDown,
        placeholder: 'Enter link URL'
      }), /*#__PURE__*/React.createElement("button", {
        className: "link",
        onMouseDown: this.cancelLink
      }, "Cancel"), /*#__PURE__*/React.createElement("button", {
        style: {
          marginLeft: 10
        },
        className: "link",
        onMouseDown: this.confirmLink
      }, "Confirm"));
    }

    return /*#__PURE__*/React.createElement("div", {
      className: "RichEditor-root"
    }, wysiwyg === 'display' ? /*#__PURE__*/React.createElement("div", {
      className: "wysiwyg"
    }, /*#__PURE__*/React.createElement(BlockStyleControls, {
      editorState: editorState,
      onToggle: this.toggleBlockType,
      color: color
    }), /*#__PURE__*/React.createElement(InlineStyleControls, {
      editorState: editorState,
      onToggle: this.toggleInlineStyle,
      promptForLink: this.promptForLink,
      removeLink: this.removeLink,
      allowLink: allowLink,
      color: color
    })) : '', urlInput, /*#__PURE__*/React.createElement("div", {
      className: className,
      onClick: this.focus
    }, /*#__PURE__*/React.createElement(Editor, {
      blockStyleFn: getBlockStyle,
      customStyleMap: styleMap,
      editorState: editorState,
      handleKeyCommand: this.handleKeyCommand,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onTab: this.onTab,
      placeholder: placeholder ? placeholder : 'Enter text...',
      ref: this.inputRef,
      spellCheck: true
    })));
  }

}

ContentEditor.defaultProps = {
  wysiwyg: 'display'
}; // Custom overrides for 'code' style.

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

    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: this.props.color
      },
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
  return /*#__PURE__*/React.createElement("div", {
    className: "RichEditor-controls"
  }, BLOCK_TYPES.map(type => /*#__PURE__*/React.createElement(StyleButton, {
    key: type.label,
    active: type.style === blockType,
    label: type.label,
    onToggle: props.onToggle,
    style: type.style,
    color: props.color
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
  return /*#__PURE__*/React.createElement("div", {
    className: "RichEditor-controls"
  }, props.allowLink ? /*#__PURE__*/React.createElement("span", {
    onMouseDown: props.promptForLink,
    className: "RichEditor-styleButton"
  }, "Add Link") : '', props.allowLink ? /*#__PURE__*/React.createElement("span", {
    onMouseDown: props.removeLink,
    className: "RichEditor-styleButton"
  }, "Remove Link") : '', INLINE_STYLES.map(type => /*#__PURE__*/React.createElement(StyleButton, {
    key: type.label,
    active: currentStyle.has(type.style),
    label: type.label,
    onToggle: props.onToggle,
    style: type.style,
    color: props.color
  })));
};

export default ContentEditor;

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
}

const Link = props => {
  const {
    url
  } = props.contentState.getEntity(props.entityKey).getData();
  return /*#__PURE__*/React.createElement("a", {
    href: url
  }, props.children);
};