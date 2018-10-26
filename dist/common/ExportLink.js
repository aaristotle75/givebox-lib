import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import ModalLink from "./ModalLink";

var ExportLink =
/*#__PURE__*/
function (_Component) {
  _inherits(ExportLink, _Component);

  function ExportLink(props) {
    _classCallCheck(this, ExportLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(ExportLink).call(this, props));
  }

  _createClass(ExportLink, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          style = _this$props.style,
          align = _this$props.align;
      return React.createElement("div", {
        style: style,
        className: "exportRecordsLink ".concat(align)
      }, React.createElement(ModalLink, {
        id: "exportRecords"
      }, "Export Report ", React.createElement("span", {
        className: "icon icon-download"
      })));
    }
  }]);

  return ExportLink;
}(Component);

export { ExportLink as default };
ExportLink.defaultProps = {
  align: 'center'
};