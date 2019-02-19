import React, { Component } from 'react';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import Moment from 'moment';
import { util, _v, Fade, Checkbox } from '../';

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
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      const dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
      const dateStr = util.getDate(this.props.defaultValue, dateFormat);
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
    this.inputRef.current.flatpickr.close();
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
    const dateFormat = this.state.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
    const ts = Moment(dateStr, dateFormat).valueOf();
    this.setState({
      value: dateStr,
      date: dateStr
    });
    if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
  }

  onChangeInput(e) {
    const value = _v.formatDate(e.currentTarget.value, this.state.enableTime);

    const dateFormat = this.state.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
    const ts = Moment(value, dateFormat).valueOf();
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
    const dateFormat = enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
    this.props.fieldProp(this.props.name, {
      enableTime
    });

    if (this.state.value) {
      const ts = Moment(this.state.date, dateFormat).valueOf();
      const dateStr = util.getDate(ts / 1000, dateFormat);
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
      clickOpens,
      label,
      fixedLabel,
      customLabel,
      step,
      error,
      errorType,
      icon,
      overlay,
      overlayDuration
    } = this.props;
    const {
      date,
      open,
      display,
      enableTime
    } = this.state;
    const dateFormat = enableTime ? 'm/d/Y H:i' : 'm/d/Y';
    const labelStyle = util.cloneObj(customLabel);
    const modalEl = document.getElementById('modal-root');
    return React.createElement(Flatpickr, {
      className: `${enableTimeOption ? 'enableTimeOption' : ''} ${className || ''}`,
      ref: this.inputRef,
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
        static: staticOption,
        clickOpens: clickOpens,
        wrap: true,
        appendTo: modalEl
      }
    }, React.createElement("div", {
      id: `flatpickr-${name}`,
      className: `flatpickr ${enableTimeOption ? 'enableTimeOption' : ''}`
    }, React.createElement(Fade, {
      in: open && overlay,
      duration: overlayDuration
    }, React.createElement("div", {
      onClick: this.closeCalendar,
      className: `dropdown-cover ${display ? '' : 'displayNone'}`
    })), React.createElement("div", {
      className: `input-group ${error && 'error tooltip'}`
    }, React.createElement("div", {
      className: `floating-label ${this.state.status} ${fixedLabel && 'fixed'}`
    }, React.createElement("input", {
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
      className: `input-bottom ${error ? 'error' : this.state.status}`
    })), React.createElement("button", {
      type: "button",
      className: "input-button",
      title: "toggle",
      "data-toggle": true
    }, icon), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, this.props.error, React.createElement("i", null)), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error)), enableTimeOption && React.createElement(Checkbox, {
      name: `enableTime-${name}`,
      label: enableTimeOptionLabel,
      checked: enableTime,
      onChange: this.toggleEnableTime
    })));
  }

}

CalendarField.defaultProps = {
  name: 'defaultDate',
  allowInput: true,
  inline: false,
  enableTime: false,
  enableTimeOption: false,
  enableTimeOptionLabel: 'Enable time',
  staticOption: false,
  clickOpens: false,
  icon: React.createElement("span", {
    className: "icon icon-calendar"
  }),
  overlayDuration: 200,
  overlay: true
};
export default CalendarField;