import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { util } from '../';

var StatBlock =
/*#__PURE__*/
function (_Component) {
  _inherits(StatBlock, _Component);

  function StatBlock(props) {
    var _this;

    _classCallCheck(this, StatBlock);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StatBlock).call(this, props));
    _this.listOptions = _this.listOptions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(StatBlock, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "listOptions",
    value: function listOptions() {
      var items = []; //const bindthis = this;

      if (!util.isEmpty(this.props.options)) {
        this.props.options.forEach(function (value, key) {
          items.push(React.createElement("li", {
            key: key
          }, value));
        });
      }

      return items;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          style = _this$props.style,
          children = _this$props.children;
      return React.createElement("div", {
        className: "statBlock",
        style: style
      }, children, React.createElement("ul", null, this.listOptions()));
    }
  }]);

  return StatBlock;
}(Component);

export default StatBlock;