import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

var ContentEditor =
/*#__PURE__*/
function (_Component) {
  _inherits(ContentEditor, _Component);

  function ContentEditor(props) {
    var _this;

    _classCallCheck(this, ContentEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentEditor).call(this, props));
    var contentState = _this.props.content ? stateFromHTML(_this.props.content) : null;
    _this.state = {
      editorState: contentState ? EditorState.createWithContent(contentState) : EditorState.createEmpty()
    };
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.inputRef = React.createRef();

    _this.handleKeyCommand = function (command) {
      return _this._handleKeyCommand(command);
    };

    _this.onTab = function (e) {
      return _this._onTab(e);
    };

    _this.toggleBlockType = function (type) {
      return _this._toggleBlockType(type);
    };

    _this.toggleInlineStyle = function (style) {
      return _this._toggleInlineStyle(style);
    };

    return _this;
  }

  _createClass(ContentEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.inputRef.current.focus();
    }
  }, {
    key: "onChange",
    value: function onChange(editorState) {
      this.setState({
        editorState: editorState
      });
      var content = editorState.getCurrentContent();
      this.props.onChange(this.props.fieldName, stateToHTML(content), content.hasText());
    }
  }, {
    key: "_handleKeyCommand",
    value: function _handleKeyCommand(command) {
      var editorState = this.state.editorState;
      var newState = RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        this.onChange(newState);
        return true;
      }

      return false;
    }
  }, {
    key: "_onTab",
    value: function _onTab(e) {
      var maxDepth = 4;
      this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }
  }, {
    key: "_toggleBlockType",
    value: function _toggleBlockType(blockType) {
      this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }
  }, {
    key: "_toggleInlineStyle",
    value: function _toggleInlineStyle(inlineStyle) {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }
  }, {
    key: "render",
    value: function render() {
      var placeholder = this.props.placeholder;
      var editorState = this.state.editorState; // If the user changes block type before entering any text, we can
      // either style the placeholder or hide it. Let's just hide it now.

      var className = 'RichEditor-editor';
      var contentState = editorState.getCurrentContent();

      if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
          className += ' RichEditor-hidePlaceholder';
        }
      }

      return React.createElement("div", {
        className: "RichEditor-root"
      }, React.createElement(BlockStyleControls, {
        editorState: editorState,
        onToggle: this.toggleBlockType
      }), React.createElement(InlineStyleControls, {
        editorState: editorState,
        onToggle: this.toggleInlineStyle
      }), React.createElement("div", {
        className: className,
        onClick: this.focus
      }, React.createElement(Editor, {
        blockStyleFn: getBlockStyle,
        customStyleMap: styleMap,
        editorState: editorState,
        handleKeyCommand: this.handleKeyCommand,
        onChange: this.onChange,
        onTab: this.onTab,
        placeholder: placeholder ? placeholder : 'Enter text...',
        ref: this.inputRef,
        spellCheck: true
      })));
    }
  }]);

  return ContentEditor;
}(Component); // Custom overrides for "code" style.


var styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"CenturyGothic", "sans-serif"',
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

var StyleButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StyleButton, _React$Component);

  function StyleButton() {
    var _this2;

    _classCallCheck(this, StyleButton);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(StyleButton).call(this));

    _this2.onToggle = function (e) {
      e.preventDefault();

      _this2.props.onToggle(_this2.props.style);
    };

    return _this2;
  }

  _createClass(StyleButton, [{
    key: "render",
    value: function render() {
      var className = 'RichEditor-styleButton';

      if (this.props.active) {
        className += ' RichEditor-activeButton';
      }

      return React.createElement("span", {
        className: className,
        onMouseDown: this.onToggle
      }, this.props.label);
    }
  }]);

  return StyleButton;
}(React.Component);

var BLOCK_TYPES = [{
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

var BlockStyleControls = function BlockStyleControls(props) {
  var editorState = props.editorState;
  var selection = editorState.getSelection();
  var blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
  return React.createElement("div", {
    className: "RichEditor-controls"
  }, BLOCK_TYPES.map(function (type) {
    return React.createElement(StyleButton, {
      key: type.label,
      active: type.style === blockType,
      label: type.label,
      onToggle: props.onToggle,
      style: type.style
    });
  }));
};

var INLINE_STYLES = [{
  label: 'Bold',
  style: 'BOLD'
}, {
  label: 'Italic',
  style: 'ITALIC'
}, {
  label: 'Underline',
  style: 'UNDERLINE'
}];

var InlineStyleControls = function InlineStyleControls(props) {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return React.createElement("div", {
    className: "RichEditor-controls"
  }, INLINE_STYLES.map(function (type) {
    return React.createElement(StyleButton, {
      key: type.label,
      active: currentStyle.has(type.style),
      label: type.label,
      onToggle: props.onToggle,
      style: type.style
    });
  }));
};

export default ContentEditor;