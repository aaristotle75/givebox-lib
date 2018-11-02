import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';

var TextField =
/*#__PURE__*/
function (_Component) {
  _inherits(TextField, _Component);

  function TextField(props) {
    var _this;

    _classCallCheck(this, TextField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextField).call(this, props));
    _this.inputRef = React.createRef();
    return _this;
  }

  _createClass(TextField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var params = Object.assign({}, this.props.params, {
        ref: this.inputRef
      });
      if (params.type === 'hidden') params.required = false;
      if (this.props.createField) this.props.createField(this.props.name, params);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          name = _this$props.name,
          type = _this$props.type,
          placeholder = _this$props.placeholder,
          autoFocus = _this$props.autoFocus,
          required = _this$props.required,
          readOnly = _this$props.readOnly,
          style = _this$props.style,
          label = _this$props.label,
          className = _this$props.className,
          error = _this$props.error,
          errorType = _this$props.errorType,
          maxLength = _this$props.maxLength,
          value = _this$props.value;
      return React.createElement("div", {
        style: style,
        className: "input-group ".concat(className || '', " textfield-group ").concat(error ? 'error tooltip' : '')
      }, label && React.createElement("label", null, label), React.createElement("input", {
        autoFocus: autoFocus,
        id: id || name,
        ref: this.inputRef,
        name: name,
        type: type,
        placeholder: placeholder,
        required: type === 'hidden' ? false : required,
        readOnly: readOnly,
        onChange: this.props.onChange,
        onBlur: this.props.onBlur,
        onFocus: this.props.onFocus,
        autoComplete: "new-password",
        value: value,
        maxLength: maxLength
      }), this.props.children, React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, error, React.createElement("i", null)), React.createElement("div", {
        className: "errorMsg ".concat((!error || errorType !== 'normal') && 'displayNone')
      }, error));
    }
  }]);

  return TextField;
}(Component);

TextField.defaultProps = {
  name: 'defaultTextField',
  type: 'text',
  maxlength: 64
};
export default TextField;