import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { Component } from 'react';
import CalendarField from '../form/CalendarField';

var CalendarRange =
/*#__PURE__*/
function (_Component) {
  _inherits(CalendarRange, _Component);

  function CalendarRange() {
    _classCallCheck(this, CalendarRange);

    return _possibleConstructorReturn(this, _getPrototypeOf(CalendarRange).apply(this, arguments));
  }

  _createClass(CalendarRange, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          style = _this$props.style,
          nameTo = _this$props.nameTo,
          labelTo = _this$props.labelTo,
          nameFrom = _this$props.nameFrom,
          labelFrom = _this$props.labelFrom,
          enableTime = _this$props.enableTime;
      return React.createElement("div", {
        style: style,
        className: "dateRange"
      }, React.createElement("div", {
        className: "col"
      }, React.createElement(CalendarField, {
        enableTime: enableTime,
        label: labelFrom || 'From',
        error: 'Please tell us a valid date (mm/dd/yyyy) or use the calendar to choose a date.',
        name: nameFrom,
        defaultValue: new Date()
      })), React.createElement("div", {
        className: "col"
      }, React.createElement(CalendarField, {
        enableTime: enableTime,
        label: labelTo || 'To',
        name: nameTo,
        defaultValue: new Date()
      })));
    }
  }]);

  return CalendarRange;
}(Component);

export { CalendarRange as default };
CalendarRange.defaultProps = {};