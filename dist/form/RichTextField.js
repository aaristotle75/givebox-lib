import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import RichTextEditor from './RichTextEditor';
import { ModalRoute, ModalLink } from '../';

var ContentField =
/*#__PURE__*/
function (_Component) {
  _inherits(ContentField, _Component);

  function ContentField() {
    _classCallCheck(this, ContentField);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContentField).apply(this, arguments));
  }

  _createClass(ContentField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.createField) this.props.createField(this.props.name, this.props.params);
    }
  }, {
    key: "renderEditor",
    value: function renderEditor(props) {
      return React.createElement(Editor, props);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          name = _this$props.name,
          style = _this$props.style,
          label = _this$props.label,
          className = _this$props.className,
          error = _this$props.error,
          errorType = _this$props.errorType,
          modal = _this$props.modal,
          modalLabel = _this$props.modalLabel;
      var id = "".concat(name, "-richText");
      return React.createElement("div", {
        style: style,
        className: "input-group ".concat(className || '', " richtext-group ").concat(error ? 'error tooltip' : '')
      }, label && React.createElement("label", null, label), React.createElement("div", {
        className: "errorMsg ".concat((!error || errorType !== 'normal') && 'displayNone')
      }, error), modal ? React.createElement("div", {
        className: "richtext-modal"
      }, React.createElement(ModalRoute, {
        id: id,
        component: function component() {
          return _this.renderEditor(_this.props);
        }
      }), React.createElement(ModalLink, {
        id: id
      }, modalLabel)) : React.createElement("div", {
        className: "richtext-embed"
      }, React.createElement(Editor, this.props)), React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, error, React.createElement("i", null)));
    }
  }]);

  return ContentField;
}(Component);

ContentField.defaultProps = {
  name: 'defaultContentField',
  modalLabel: 'Open Editor'
};
export default ContentField;

var Editor = function Editor(props) {
  return React.createElement(RichTextEditor, {
    onChange: props.onChange,
    placeholder: props.placeholder,
    content: props.value,
    fieldName: props.name
  });
};