import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import Moment from 'moment';

var CalendarField =
/*#__PURE__*/
function (_Component) {
  _inherits(CalendarField, _Component);

  function CalendarField(props) {
    var _this;

    _classCallCheck(this, CalendarField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CalendarField).call(this, props));
    _this.onFocus = _this.onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      date: _this.props.defaultValue ? _this.props.defaultValue : ''
    };
    return _this;
  }

  _createClass(CalendarField, [{
    key: "onFocus",
    value: function onFocus() {}
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      this.setState({
        date: e.currentTarget.value
      });
      if (this.props.onBlur) this.props.onBlur(e);
    }
  }, {
    key: "onChange",
    value: function onChange(selectedDates, dateStr, instance) {
      var dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
      var ts = Moment(dateStr, dateFormat).valueOf();
      if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          style = _this$props.style,
          allowInput = _this$props.allowInput,
          inline = _this$props.inline,
          enableTime = _this$props.enableTime,
          staticOption = _this$props.staticOption,
          clickOpens = _this$props.clickOpens,
          label = _this$props.label,
          customLabel = _this$props.customLabel,
          step = _this$props.step;
      var date = this.state.date;
      var dateFormat = enableTime ? 'm/d/Y H:i' : 'm/d/Y';
      var labelStyle = Object.assign({}, customLabel);
      return React.createElement(Flatpickr, {
        value: date,
        onChange: this.onChange,
        options: {
          inline: inline,
          allowInput: allowInput,
          dateFormat: dateFormat,
          enableTime: enableTime,
          static: staticOption,
          clickOpens: clickOpens,
          wrap: true
        }
      }, React.createElement("div", {
        className: "flatpickr"
      }, React.createElement("label", {
        className: "top",
        style: labelStyle
      }, label), React.createElement("div", {
        className: "input-group ".concat(this.props.error && 'error tooltip')
      }, React.createElement("input", {
        name: name,
        style: style,
        type: "text",
        placeholder: "mm/dd/yyyy",
        "data-input": true,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        step: step
      }), React.createElement("a", {
        className: "input-button",
        title: "toggle",
        "data-toggle": true
      }, React.createElement("i", {
        className: "icon icon-calendar"
      })), React.createElement("div", {
        className: "tooltipTop"
      }, this.props.error, React.createElement("i", null)))));
    }
  }]);

  return CalendarField;
}(Component);

CalendarField.defaultProps = {
  name: 'defaultDate',
  allowInput: true,
  inline: false,
  enableTime: false,
  staticOption: false,
  clickOpens: false
};
export default CalendarField;