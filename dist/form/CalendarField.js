import React, { Component } from 'react';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import Moment from 'moment';
import { util, _v, Fade, Choice } from '../';

class CalendarField extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.toggleEnableTime = this.toggleEnableTime.bind(this);
    this.state = {
      date: '',
      value: '',
      status: 'idle',
      open: false,
      display: false,
      enableTime: this.props.enableTime
    };
    this.flatpickrRef = /*#__PURE__*/React.createRef();
    this.inputRef = /*#__PURE__*/React.createRef();
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      const dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
      const dateStr = util.getDate(this.props.defaultValue, dateFormat, {
        tz: false
      });
      this.setState({
        value: dateStr,
        date: dateStr
      });
    }

    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  onFocus(e) {
    if (!this.state.enableTime) {
      if (e.currentTarget.value) this.onChange('', e.currentTarget.value);
    }

    this.setState({
      status: 'active'
    });
  }

  onBlur(e) {
    this.setState({
      date: e.currentTarget.value,
      status: 'idle'
    });
    if (this.props.onBlur) this.props.onBlur(e);
  }

  onOpen() {
    this.setState({
      status: 'active',
      open: true,
      display: true
    });
  }

  closeCalendar() {
    this.flatpickrRef.current.flatpickr.close();
  }

  onClose() {
    this.setState({
      status: 'idle',
      open: false
    });
    this.timeout = setTimeout(() => {
      this.setState({
        display: false
      });
      this.timeout = null;
    }, this.props.overlayDuration);
  }

  onChange(selectedDates, dateStr, instance) {
    const dateFormat = this.state.enableTime ? 'MM/DD/YYYY h:mmA' : 'MM/DD/YYYY';
    const ts = this.props.utc ? Moment.utc(dateStr, dateFormat).valueOf() : Moment(dateStr, dateFormat).valueOf();
    this.setState({
      value: dateStr,
      date: dateStr
    });
    if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
  }

  onChangeInput(e) {
    const val = e.currentTarget.value;

    const value = _v.formatDate(val, this.state.enableTime);

    const dateFormat = this.state.enableTime ? 'MM/DD/YYYY h:mmA' : 'MM/DD/YYYY';
    const ts = this.props.utc ? Moment.utc(value, dateFormat).valueOf() : Moment(value, dateFormat).valueOf();
    this.setState({
      value: value,
      date: value
    });
    if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
  }

  toggleEnableTime(enableTime, name) {
    this.setState({
      enableTime
    });
    const dateFormat = enableTime ? 'MM/DD/YYYY h:mmA' : 'MM/DD/YYYY';
    this.props.fieldProp(this.props.name, {
      enableTime
    });

    if (this.state.value) {
      const ts = this.props.utc ? Moment.utc(this.state.date, dateFormat).valueOf() : Moment(this.state.date, dateFormat).valueOf();
      const dateStr = util.getDate(ts / 1000, dateFormat, {
        tz: false
      });
      this.setState({
        value: dateStr
      });
      if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
    }
  }

  render() {
    const {
      name,
      className,
      style,
      allowInput,
      inline,
      enableTimeOption,
      enableTimeOptionLabel,
      staticOption,
      label,
      fixedLabel,
      customLabel,
      step,
      error,
      errorType,
      icon,
      overlay,
      overlayDuration,
      utc,
      placeholder
    } = this.props;
    const {
      date,
      open,
      display,
      enableTime
    } = this.state;
    const dateFormat = enableTime ? 'm/d/Y h:iK' : 'm/d/Y';
    const momentFormat = enableTime ? 'MM/DD/YYYY h:mmA' : 'MM/DD/YYYY';
    const labelStyle = util.cloneObj(customLabel);
    const modalEl = document.getElementById('calendar-root');
    const minDate = this.props.minDate ? util.getDate(this.props.minDate, momentFormat) : null;
    return /*#__PURE__*/React.createElement(Flatpickr, {
      className: `${enableTimeOption ? 'enableTimeOption' : ''} ${className || ''}`,
      ref: this.flatpickrRef,
      value: date,
      onChange: this.onChange,
      onOpen: this.onOpen,
      onClose: this.onClose,
      options: {
        inline: inline,
        allowInput: allowInput,
        dateFormat: dateFormat,
        enableTime: enableTimeOption ? true : enableTime,
        minuteIncrement: 1,
        minDate: minDate,
        static: staticOption,
        clickOpens: allowInput ? false : true,
        wrap: true,
        appendTo: modalEl,
        utc: utc ? true : false
      }
    }, /*#__PURE__*/React.createElement("div", {
      id: `flatpickr-${name}`,
      className: `flatpickr ${enableTimeOption ? 'enableTimeOption' : ''}`
    }, /*#__PURE__*/React.createElement(Fade, {
      in: open && overlay,
      duration: overlayDuration
    }, /*#__PURE__*/React.createElement("div", {
      onClick: this.closeCalendar,
      className: `dropdown-cover ${display ? '' : 'displayNone'}`
    })), /*#__PURE__*/React.createElement("div", {
      className: `input-group ${error && 'error tooltip'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `floating-label ${this.state.status} ${fixedLabel && 'fixed'}`
    }, allowInput ? /*#__PURE__*/React.createElement("input", {
      name: name,
      style: style,
      type: "text",
      placeholder: placeholder || enableTime ? 'mm/dd/yyyy h:mmA' : 'mm/dd/yyyy',
      "data-input": true,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      step: step,
      onChange: this.onChangeInput,
      value: this.state.value,
      maxLength: 16,
      ref: this.inputRef
    }) : /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: placeholder || enableTime ? 'mm/dd/yyyy h:mmA' : 'mm/dd/yyyy',
      "data-input": true
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: name,
      style: labelStyle
    }, label), /*#__PURE__*/React.createElement("div", {
      className: `input-bottom ${error ? 'error' : this.state.status}`
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "input-button",
      title: "toggle",
      "data-toggle": true
    }, icon), /*#__PURE__*/React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, this.props.error, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error)), enableTimeOption && /*#__PURE__*/React.createElement(Choice, {
      name: `enableTime-${name}`,
      label: enableTimeOptionLabel,
      checked: enableTime,
      onChange: this.toggleEnableTime
    })));
  }

}

CalendarField.defaultProps = {
  name: 'defaultDate',
  allowInput: false,
  inline: false,
  enableTime: false,
  enableTimeOption: false,
  enableTimeOptionLabel: 'Enable time',
  minDate: null,
  staticOption: false,
  icon: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-calendar"
  }),
  overlayDuration: 200,
  overlay: true,
  utc: false
};
export default CalendarField;