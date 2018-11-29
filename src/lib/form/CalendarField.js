import React, { Component } from 'react';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import Moment from 'moment';
import { util, _v } from '../';

class CalendarField extends Component {

  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.state = {
      date: this.props.defaultValue ? this.props.defaultValue : '',
      value: this.props.defaultValue ? this.props.defaultValue : '',
      status: 'idle'
    }
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
  }

  onFocus(e) {
    if (!this.props.enableTime) {
      if (e.currentTarget.value) this.onChange('', e.currentTarget.value);
    }
    this.setState({status: 'active'});
  }

  onBlur(e) {
    this.setState({
      date: e.currentTarget.value,
      status: 'idle'
    });
    if (this.props.onBlur) this.props.onBlur(e);
  }

  onOpen() {
    this.setState({status: 'active'});
  }

  onClose() {
    this.setState({status: 'idle'});
    console.log(this.inputRef);
  }

  onChange(selectedDates, dateStr, instance) {
    const dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
    const ts = Moment(dateStr, dateFormat).valueOf();
    this.setState({value: dateStr});
    if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
  }

  onChangeInput(e) {
    const value = _v.formatDate(e.currentTarget.value, this.props.enableTime);
    const dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
    const ts = Moment(value, dateFormat).valueOf();
    this.setState({ value: value });
    if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, this.props.name);
  }

  render() {

    const {
      name,
      style,
      allowInput,
      inline,
      enableTime,
      staticOption,
      clickOpens,
      label,
      fixedLabel,
      customLabel,
      step,
      error,
      errorType
    } = this.props;

    const {
      date
    } = this.state;

    const dateFormat = enableTime ? 'm/d/Y H:i' : 'm/d/Y';
    const labelStyle = util.cloneObj(customLabel);
    return (
      <Flatpickr
        value={date}
        onChange={this.onChange}
        onOpen={this.onOpen}
        onClose={this.onClose}
        options={{
          inline: inline,
          allowInput: allowInput,
          dateFormat: dateFormat,
          enableTime: enableTime,
          minuteIncrement: 1,
          static: staticOption,
          clickOpens: clickOpens,
          wrap: true
        }}
      >
        <div className='flatpickr'>
          <div className={`input-group ${error && 'error tooltip'}`}>
            <div className={`floating-label ${this.state.status} ${fixedLabel && 'fixed'}`}>
              <input
                ref={this.inputRef}
                name={name}
                style={style}
                type='text'
                placeholder={enableTime ? 'mm/dd/yyyy hh:mm' : 'mm/dd/yyyy'}
                data-input
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                step={step}
                onChange={this.onChangeInput}
                value={this.state.value}
                maxLength={16}
              />
              <label htmlFor={name} style={labelStyle} >{label}</label>
              <div className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
            </div>
            <button type='button' className='input-button' title='toggle' data-toggle>
                <i className='icon icon-calendar'></i>
            </button>
            <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
              {this.props.error}
              <i></i>
            </div>
            <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
          </div>
        </div>
      </Flatpickr>
    );
  }
}

CalendarField.defaultProps = {
  name: 'defaultDate',
  allowInput: true,
  inline: false,
  enableTime: false,
  staticOption: false,
  clickOpens: false
}

export default CalendarField;
