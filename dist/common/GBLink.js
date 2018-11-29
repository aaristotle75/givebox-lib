import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
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

  function GBLink() {
    _classCallCheck(this, GBLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(GBLink).apply(this, arguments));
  }

  _createClass(GBLink, [{
    key: "linkStyle",
    value: function linkStyle() {
      var style = {
        color: "".concat(this.props.primaryColor)
      };
      return _objectSpread({}, style, this.props.style);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          onClick = _this$props.onClick,
          className = _this$props.className,
          style = _this$props.style,
          primaryColor = _this$props.primaryColor;
      var color = primaryColor ? {
        color: primaryColor
      } : {};

      var mergeStyle = _objectSpread({}, style, color);

      return React.createElement("button", {
        type: "button",
        id: id,
        className: className || 'link',
        onClick: onClick,
        style: mergeStyle
      }, this.props.children);
    }
  }]);

  return GBLink;
}(Component);

;
GBLink.defaultProps = {
  primaryColor: '',
  style: {}
};
export default GBLink;