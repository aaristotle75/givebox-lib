import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { util } from '../';

var ActionBar =
/*#__PURE__*/
function (_Component) {
  _inherits(ActionBar, _Component);

  function ActionBar(props) {
    var _this;

    _classCallCheck(this, ActionBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ActionBar).call(this, props));
    _this.listOptions = _this.listOptions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(ActionBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "listOptions",
    value: function listOptions() {
      var items = []; //const bindthis = this;

      if (!util.isEmpty(this.props.options)) {
        var width = "".concat(parseFloat(100 / this.props.options.length).toFixed(0), "%");
        this.props.options.forEach(function (value, key) {
          items.push(React.createElement("li", {
            style: {
              width: width
            },
            key: key
          }, value));
        });
      }

      return items;
    }
  }, {
    key: "render",
    value: function render() {
      var style = this.props.style;
      return React.createElement("ul", {
        style: style,
        className: "actionBar"
      }, this.listOptions());
    }
  }]);

  return ActionBar;
}(Component);

export default ActionBar;