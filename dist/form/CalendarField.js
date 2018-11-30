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
import { util, _v } from '../';

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
    _this.onOpen = _this.onOpen.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onClose = _this.onClose.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeInput = _this.onChangeInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      date: _this.props.defaultValue ? _this.props.defaultValue : '',
      value: _this.props.defaultValue ? _this.props.defaultValue : '',
      status: 'idle'
    };
    _this.inputRef = React.createRef();
    return _this;
  }

  _createClass(CalendarField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.createField) this.props.createField(this.props.name, this.props.params);
    }
  }, {
    key: "onFocus",
    value: function onFocus(e) {
      if (!this.props.enableTime) {
        if (e.currentTarget.value) this.onChange('', e.currentTarget.value);
      }

      this.setState({
        status: 'active'
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      this.setState({
        date: e.currentTarget.value,
        status: 'idle'
      });
      if (this.props.onBlur) this.props.onBlur(e);
    }
  }, {
    key: "onOpen",
    value: function onOpen() {
      this.setState({
        status: 'active'
      });
    }
  }, {
    key: "onClose",
    value: function onClose() {
      this.setState({
        status: 'idle'
      });
    }
  }, {
    key: "onChange",
    value: function onChange(selectedDates, dateStr, instance) {
      var dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
      var ts = Moment(dateStr, dateFormat).valueOf();
      this.setState({
        value: dateStr
      });
      if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
    }
  }, {
    key: "onChangeInput",
    value: function onChangeInput(e) {
      var value = _v.formatDate(e.currentTarget.value, this.props.enableTime);

      var dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
      var ts = Moment(value, dateFormat).valueOf();
      this.setState({
        value: value
      });
      if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
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
          fixedLabel = _this$props.fixedLabel,
          customLabel = _this$props.customLabel,
          step = _this$props.step,
          error = _this$props.error,
          errorType = _this$props.errorType;
      var date = this.state.date;
      var dateFormat = enableTime ? 'm/d/Y H:i' : 'm/d/Y';
      var labelStyle = util.cloneObj(customLabel);
      return React.createElement(Flatpickr, {
        value: date,
        onChange: this.onChange,
        onOpen: this.onOpen,
        onClose: this.onClose,
        options: {
          inline: inline,
          allowInput: allowInput,
          dateFormat: dateFormat,
          enableTime: enableTime,
          minuteIncrement: 1,
          static: staticOption,
          clickOpens: clickOpens,
          wrap: true
        }
      }, React.createElement("div", {
        className: "flatpickr"
      }, React.createElement("div", {
        className: "input-group ".concat(error && 'error tooltip')
      }, React.createElement("div", {
        className: "floating-label ".concat(this.state.status, " ").concat(fixedLabel && 'fixed')
      }, React.createElement("input", {
        ref: this.inputRef,
        name: name,
        style: style,
        type: "text",
        placeholder: enableTime ? 'mm/dd/yyyy hh:mm' : 'mm/dd/yyyy',
        "data-input": true,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        step: step,
        onChange: this.onChangeInput,
        value: this.state.value,
        maxLength: 16
      }), React.createElement("label", {
        htmlFor: name,
        style: labelStyle
      }, label), React.createElement("div", {
        className: "input-bottom ".concat(error ? 'error' : this.state.status)
      })), React.createElement("button", {
        type: "button",
        className: "input-button",
        title: "toggle",
        "data-toggle": true
      }, React.createElement("i", {
        className: "icon icon-calendar"
      })), React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, this.props.error, React.createElement("i", null)), React.createElement("div", {
        className: "errorMsg ".concat((!error || errorType !== 'normal') && 'displayNone')
      }, error))));
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