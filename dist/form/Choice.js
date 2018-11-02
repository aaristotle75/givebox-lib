import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import { cloneObj } from '../common/utility';

var Choice =
/*#__PURE__*/
function (_Component) {
  _inherits(Choice, _Component);

  function Choice() {
    _classCallCheck(this, Choice);

    return _possibleConstructorReturn(this, _getPrototypeOf(Choice).apply(this, arguments));
  }

  _createClass(Choice, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var params = cloneObj(this.props.params);
      var value = params.value === params.checked ? params.value : params.checked;
      params = Object.assign(params, {
        value: value
      });
      if (this.props.createField) this.props.createField(this.props.name, params);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          type = _this$props.type,
          label = _this$props.label,
          className = _this$props.className,
          style = _this$props.style,
          _onChange = _this$props.onChange,
          checked = _this$props.checked,
          value = _this$props.value,
          error = _this$props.error,
          errorType = _this$props.errorType;
      var id = type === 'radio' ? "".concat(value, "-").concat(type) : "".concat(name, "-").concat(type);
      var isChecked = checked;
      if (type === 'radio') isChecked = checked === value ? true : false;
      return React.createElement("div", {
        style: style,
        className: "input-group ".concat(className || '', " ").concat(type, "-group  ").concat(error ? 'error tooltip' : '')
      }, React.createElement("input", {
        type: type,
        name: name,
        onChange: function onChange() {
          return _onChange(name, value);
        },
        checked: isChecked,
        className: type,
        id: id,
        value: value || checked
      }), React.createElement("label", {
        htmlFor: id
      }), label && React.createElement("label", {
        onClick: function onClick() {
          return _onChange(name, value);
        }
      }, label), React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, this.props.error, React.createElement("i", null)), React.createElement("div", {
        className: "errorMsg ".concat((!error || errorType !== 'normal') && 'displayNone')
      }, error));
    }
  }]);

  return Choice;
}(Component);

Choice.defaultProps = {};
export default Choice;