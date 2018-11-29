import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import CalendarField from '../form/CalendarField';
import Moment from 'moment';

var CalendarRange =
/*#__PURE__*/
function (_Component) {
  _inherits(CalendarRange, _Component);

  function CalendarRange(props) {
    var _this;

    _classCallCheck(this, CalendarRange);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CalendarRange).call(this, props));
    _this.onChangeRange1 = _this.onChangeRange1.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeRange2 = _this.onChangeRange2.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(CalendarRange, [{
    key: "onChangeRange1",
    value: function onChangeRange1(ts) {
      this.props.onChangeRange1(ts);
    }
  }, {
    key: "onChangeRange2",
    value: function onChangeRange2(ts) {
      this.props.onChangeRange2(ts);
    }
  }, {
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
          enableTime = _this$props.enableTime,
          range1Value = _this$props.range1Value,
          range2Value = _this$props.range2Value,
          range1Error = _this$props.range1Error,
          range2Error = _this$props.range2Error;
      var dateFormat = enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
      return React.createElement("div", {
        style: style,
        className: "field-group"
      }, React.createElement("div", {
        className: "col"
      }, React.createElement(CalendarField, {
        enableTime: enableTime,
        label: labelFrom || 'From',
        error: range1Error,
        name: nameFrom,
        defaultValue: Moment.unix(range1Value).format(dateFormat),
        onChangeCalendar: this.onChangeRange1
      })), React.createElement("div", {
        className: "col"
      }, React.createElement(CalendarField, {
        enableTime: enableTime,
        label: labelTo || 'To',
        error: range2Error,
        name: nameTo,
        defaultValue: Moment.unix(range2Value).format(dateFormat),
        onChangeCalendar: this.onChangeRange2
      })));
    }
  }]);

  return CalendarRange;
}(Component);

export { CalendarRange as default };
CalendarRange.defaultProps = {};