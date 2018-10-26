import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';

var Checkbox =
/*#__PURE__*/
function (_Component) {
  _inherits(Checkbox, _Component);

  function Checkbox(props) {
    _classCallCheck(this, Checkbox);

    return _possibleConstructorReturn(this, _getPrototypeOf(Checkbox).call(this, props));
  }

  _createClass(Checkbox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.createField) this.props.createField(this.props.name, this.props.params);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          label = _this$props.label,
          className = _this$props.className,
          style = _this$props.style,
          _onChange = _this$props.onChange,
          checked = _this$props.checked,
          error = _this$props.error,
          errorType = _this$props.errorType;
      var id = "".concat(name, "-checkbox");
      return React.createElement("div", {
        style: style,
        className: "input-group ".concat(className || '', " checkbox-group  ").concat(error ? 'error tooltip' : '')
      }, React.createElement("input", {
        type: "checkbox",
        name: name,
        onChange: function onChange() {
          return _onChange(name);
        },
        checked: checked,
        className: "checkbox",
        id: id
      }), React.createElement("label", {
        htmlFor: id
      }), label && React.createElement("label", {
        onClick: function onClick() {
          return _onChange(name);
        }
      }, label), React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, this.props.error, React.createElement("i", null)), React.createElement("div", {
        className: "errorMsg ".concat(!error || errorType !== 'normal' && 'displayNone')
      }, error));
    }
  }]);

  return Checkbox;
}(Component);

Checkbox.defaultProps = {
  name: 'defaultCheckbox',
  label: 'Checkbox'
};
export default Checkbox;