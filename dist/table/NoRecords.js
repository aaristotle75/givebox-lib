import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import { GBLink } from '../';

var NoRecords =
/*#__PURE__*/
function (_Component) {
  _inherits(NoRecords, _Component);

  function NoRecords() {
    _classCallCheck(this, NoRecords);

    return _possibleConstructorReturn(this, _getPrototypeOf(NoRecords).apply(this, arguments));
  }

  _createClass(NoRecords, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          link = _this$props.link,
          label = _this$props.label,
          align = _this$props.align;
      return React.createElement("div", {
        className: "noRecords ".concat(align)
      }, React.createElement("span", {
        className: "normalText"
      }, "No records found"), link && React.createElement(GBLink, {
        onClick: link
      }, label));
    }
  }]);

  return NoRecords;
}(Component);

export { NoRecords as default };
NoRecords.defaultProps = {
  align: 'center',
  label: 'Reload'
};