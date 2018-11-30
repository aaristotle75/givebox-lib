import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';

var CharacterCount =
/*#__PURE__*/
function (_Component) {
  _inherits(CharacterCount, _Component);

  function CharacterCount() {
    _classCallCheck(this, CharacterCount);

    return _possibleConstructorReturn(this, _getPrototypeOf(CharacterCount).apply(this, arguments));
  }

  _createClass(CharacterCount, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          max = _this$props.max,
          count = _this$props.count,
          style = _this$props.style;
      return React.createElement("div", {
        style: style,
        className: "characterCount"
      }, React.createElement("span", {
        className: "text"
      }, "Max characters ", React.createElement("strong", null, count, "/", max)));
    }
  }]);

  return CharacterCount;
}(Component);

;
export default CharacterCount;