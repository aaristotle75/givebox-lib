import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import Portal from './Portal';

var Loader =
/*#__PURE__*/
function (_Component) {
  _inherits(Loader, _Component);

  function Loader(props) {
    var _this;

    _classCallCheck(this, Loader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Loader).call(this, props));
    _this.state = {
      end: false,
      rootEl: null
    };
    return _this;
  }

  _createClass(Loader, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        rootEl: document.getElementById('app-root')
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState({
        end: true
      });
    }
  }, {
    key: "createSVG",
    value: function createSVG() {
      var svg = React.createElement("img", {
        alt: "Givebox loader",
        className: "loaderSVG ".concat(this.state.end ? 'fadeOut' : ''),
        src: "https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo3.svg",
        type: "image/svg+xml"
      });
      return svg;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          msg = _this$props.msg,
          textColor = _this$props.textColor,
          forceText = _this$props.forceText;
      if (!this.state.rootEl) return React.createElement("div", null);
      var showMsg = !!forceText;
      return React.createElement(Portal, {
        rootEl: this.state.rootEl
      }, React.createElement("div", {
        className: "loader"
      }), React.createElement("div", {
        className: "loaderContent"
      }, React.createElement("div", {
        className: "loadingText"
      }, React.createElement("div", null, this.createSVG()), React.createElement("span", {
        className: "".concat(showMsg ? '' : 'displayNone'),
        style: {
          color: "".concat(textColor ? textColor : '#fff')
        }
      }, msg))));
    }
  }]);

  return Loader;
}(Component);

export { Loader as default };