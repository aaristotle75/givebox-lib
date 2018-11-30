import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import PasswordStrength from './PasswordStrength';
import CharacterCount from './CharacterCount';
import Fade from '../common/Fade';

var TextField =
/*#__PURE__*/
function (_Component) {
  _inherits(TextField, _Component);

  function TextField(props) {
    var _this;

    _classCallCheck(this, TextField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextField).call(this, props));
    _this.onFocus = _this.onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.inputRef = React.createRef();
    _this.state = {
      status: 'idle'
    };
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
    key: "onFocus",
    value: function onFocus(e) {
      e.preventDefault();
      this.setState({
        status: 'active'
      });
      if (this.props.onFocus) this.props.onFocus(e);
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      e.preventDefault();
      this.setState({
        status: 'idle'
      });
      if (this.props.onBlur) this.props.onBlur(e);
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
          fixedLabel = _this$props.fixedLabel,
          className = _this$props.className,
          error = _this$props.error,
          errorType = _this$props.errorType,
          maxLength = _this$props.maxLength,
          value = _this$props.value,
          strength = _this$props.strength,
          count = _this$props.count;
      return React.createElement("div", {
        style: style,
        className: "input-group ".concat(className || '', " textfield-group ").concat(error ? 'error tooltip' : '', " ").concat(type === 'hidden' && 'hidden')
      }, React.createElement("div", {
        className: "floating-label ".concat(this.state.status, " ").concat(fixedLabel && 'fixed')
      }, React.createElement("input", {
        autoFocus: autoFocus,
        id: id || name,
        ref: this.inputRef,
        name: name,
        type: type,
        placeholder: placeholder,
        required: type === 'hidden' ? false : required,
        readOnly: readOnly,
        onChange: this.props.onChange,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        autoComplete: "new-password",
        value: value,
        maxLength: maxLength
      }), label && React.createElement("label", {
        htmlFor: name
      }, label), React.createElement("div", {
        className: "input-bottom ".concat(error ? 'error' : this.state.status)
      }), this.props.children, strength && React.createElement(PasswordStrength, {
        password: value,
        error: error
      }), count && type !== 'password' && type !== 'hidden' && React.createElement(Fade, {
        in: this.state.status === 'active' && value ? true : false,
        duration: 200
      }, React.createElement(CharacterCount, {
        max: maxLength,
        count: value.length
      }))), React.createElement("div", {
        className: "tooltipTop ".concat((errorType !== 'tooltip' || strength) && 'displayNone')
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