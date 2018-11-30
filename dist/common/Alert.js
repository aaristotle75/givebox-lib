import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { msgs } from '../form/formValidate';
export var Alert =
/*#__PURE__*/
function (_Component) {
  _inherits(Alert, _Component);

  function Alert(props) {
    var _this;

    _classCallCheck(this, Alert);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Alert).call(this, props));
    _this.renderAlert = _this.renderAlert.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Alert, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "renderAlert",
    value: function renderAlert(alert, msg) {
      switch (alert) {
        case 'error':
          return React.createElement(Error, {
            msg: msg
          });

        case 'success':
          return React.createElement(Success, {
            msg: msg
          });
        // no default
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          alert = _this$props.alert,
          msg = _this$props.msg;
      return React.createElement(CSSTransition, {
        in: msg ? true : false,
        timeout: 300,
        classNames: "alertMsg",
        unmountOnExit: true
      }, React.createElement("div", {
        className: "alertMsg"
      }, this.renderAlert(alert, msg)));
    }
  }]);

  return Alert;
}(Component);
export var Error = function Error(_ref) {
  var msg = _ref.msg;
  return React.createElement("div", {
    className: "error"
  }, React.createElement("span", {
    className: "msgText"
  }, React.createElement("span", {
    className: "icon icon-error-circle"
  }), " ", typeof msg === 'string' ? msg : msgs.error));
};
export var Success = function Success(_ref2) {
  var msg = _ref2.msg;
  return React.createElement("div", {
    className: "success"
  }, React.createElement("span", {
    className: "msgText"
  }, React.createElement("span", {
    className: "icon icon-checkmark-circle"
  }), " ", msg));
};