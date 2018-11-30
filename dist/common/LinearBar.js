import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';

var LinearBar =
/*#__PURE__*/
function (_Component) {
  _inherits(LinearBar, _Component);

  function LinearBar(props) {
    var _this;

    _classCallCheck(this, LinearBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LinearBar).call(this, props));
    _this.state = {
      completed: 0
    };
    return _this;
  }

  _createClass(LinearBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.timer = setTimeout(function () {
        return _this2.progress(_this2.props.progress);
      }, 100);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (this.props.progress !== nextProps.progress) {
        this.timer = setTimeout(function () {
          return _this3.progress(nextProps.progress);
        }, 100);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.timer);
    }
  }, {
    key: "progress",
    value: function progress(completed) {
      if (completed > 100) {
        this.setState({
          completed: 100
        });
      } else {
        this.setState({
          completed: completed
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          color = _this$props.color,
          style = _this$props.style;
      var finalstyle = {
        style: style,
        width: this.props.progress + '%'
      };
      return React.createElement("div", {
        className: "linearProgress"
      }, React.createElement("div", {
        style: finalstyle,
        className: "linearProgressBarAnimation ".concat(color)
      }), React.createElement("div", {
        style: finalstyle,
        className: "linearProgressBar ".concat(color)
      }));
    }
  }]);

  return LinearBar;
}(Component);

;
export default LinearBar;