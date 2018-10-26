import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';

var GBLink =
/*#__PURE__*/
function (_Component) {
  _inherits(GBLink, _Component);

  function GBLink(props) {
    _classCallCheck(this, GBLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(GBLink).call(this, props));
  }

  _createClass(GBLink, [{
    key: "linkStyle",
    value: function linkStyle(primaryColor) {
      var primaryColor = this.props.primaryColor;
      var style = {
        color: "".concat(primaryColor)
      };
      return Object.assign(style, this.props.style);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          onClick = _this$props.onClick,
          href = _this$props.href,
          primaryColor = _this$props.primaryColor,
          target = _this$props.target,
          className = _this$props.className;
      return React.createElement("a", {
        id: id,
        className: className,
        href: href,
        onClick: onClick,
        style: this.linkStyle,
        target: target
      }, this.props.children);
    }
  }]);

  return GBLink;
}(Component);

;
GBLink.defaultProps = {
  primaryColor: "#00BCD4"
};
export default GBLink;