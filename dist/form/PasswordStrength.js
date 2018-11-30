import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { LinearBar } from '../';

var PasswordStrength =
/*#__PURE__*/
function (_Component) {
  _inherits(PasswordStrength, _Component);

  function PasswordStrength(props) {
    var _this;

    _classCallCheck(this, PasswordStrength);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PasswordStrength).call(this, props));
    _this.checkStrength = _this.checkStrength.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      strength: '',
      progress: 0,
      color: ''
    };
    return _this;
  }

  _createClass(PasswordStrength, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.password !== nextProps.password) {
        this.checkStrength(nextProps.password);
      }
    }
  }, {
    key: "checkStrength",
    value: function checkStrength(password) {
      var strength = 0;
      var progress = 0;
      var text = '';
      var color = '';
      var validate = false;
      if (password.length > 7) validate = true;
      strength += validate ? 1 : 0;
      strength += /[A-Z]/.test(password) && validate ? 1 : 0;
      strength += /[0-9]/.test(password) && validate ? 1 : 0;
      strength += /[!@#$&*]/.test(password) && validate ? 1 : 0;

      switch (strength) {
        case 1:
          progress = 25;
          text = 'Weak';
          color = 'yellow';
          break;

        case 2:
          progress = 50;
          text = 'Moderate';
          color = 'orange';
          break;

        case 3:
          progress = 75;
          text = 'Strong';
          color = 'green';
          break;

        case 4:
          progress = 100;
          text = 'Very Strong';
          color = 'green';
          break;

        default:
          if (password.length > 0) {
            var needed = 8 - parseInt(password.length);
            progress += password.length * 3;
            color = 'red';
            text = 'enter ' + needed + ' more characters';
          }

          break;
      }

      this.setState({
        strength: text,
        progress: progress,
        color: color
      });
    }
  }, {
    key: "render",
    value: function render() {
      var error = this.props.error;
      var _this$state = this.state,
          strength = _this$state.strength,
          progress = _this$state.progress,
          color = _this$state.color;
      return React.createElement("div", {
        className: "passwordStrength"
      }, React.createElement("div", {
        className: "indicator"
      }, React.createElement(LinearBar, {
        progress: progress,
        style: {
          backgroundColor: 'rgb(189, 189, 189)'
        },
        color: color
      })), React.createElement("div", null, React.createElement("div", {
        className: "".concat(error && 'error', " label tooltip")
      }, "Password strength ", strength, React.createElement("div", {
        className: "tooltipTop"
      }, "Passwords must be at least 8 characters long. The stongest passwords have at least one upper case letter, at least one number and one of these special characters !@#$&*", React.createElement("i", null)))));
    }
  }]);

  return PasswordStrength;
}(Component);

;
export default PasswordStrength;