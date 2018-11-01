import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { isEmpty } from '../common/utility';

var Select =
/*#__PURE__*/
function (_Component) {
  _inherits(Select, _Component);

  function Select(props) {
    var _this;

    _classCallCheck(this, Select);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, props));
    _this.listOptions = _this.listOptions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Select, [{
    key: "listOptions",
    value: function listOptions() {
      var items = [];
      var options = this.props.options;

      if (!isEmpty(options)) {
        options.forEach(function (value, key) {
          console.log(key, value);
          items.push(React.createElement("option", {
            key: key,
            value: value.value
          }, value.primaryText));
        });
      }

      return items ? items : React.createElement("option", null, "None");
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          className = _this$props.className,
          style = _this$props.style,
          onChange = _this$props.onChange,
          selected = _this$props.selected,
          required = _this$props.required;
      return React.createElement("select", {
        name: name,
        className: className,
        style: style,
        onChange: onChange,
        value: selected,
        required: required,
        autoComplete: "off"
      }, this.listOptions());
    }
  }]);

  return Select;
}(Component);

Select.defaultProps = {
  name: 'defaultSelect',
  buttonLabel: 'Select One'
};
export default Select;