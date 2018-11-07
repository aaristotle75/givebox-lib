import React, { Component } from 'react';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import Moment from 'moment';
import { util } from '../';

class CalendarField extends Component {

  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      date: this.props.defaultValue ? this.props.defaultValue : ''
    }
  }

  onFocus() {
  }

  onBlur(e) {
    this.setState({date: e.currentTarget.value});
    if (this.props.onBlur) this.props.onBlur(e);
  }

  onChange(selectedDates, dateStr, instance) {
    let dateFormat = this.props.enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
    var ts = Moment(dateStr, dateFormat).valueOf();
    if (this.props.onChangeCalendar) this.props.onChangeCalendar(ts, dateStr, dateFormat);
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
      customLabel,
      step,
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
        options={{
          inline: inline,
          allowInput: allowInput,
          dateFormat: dateFormat,
          enableTime: enableTime,
          static: staticOption,
          clickOpens: clickOpens,
          wrap: true
        }}
      >
        <div className='flatpickr'>
          <label style={labelStyle} >{label}</label>
          <div className={`input-group ${this.props.error && 'error tooltip'}`}>
            <input
              name={name}
              style={style}
              type='text'
              placeholder='mm/dd/yyyy'
              data-input
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              step={step}
            />
            <button type='button' className='input-button' title='toggle' data-toggle>
                <i className='icon icon-calendar'></i>
            </button>
            <div className='tooltipTop'>
              {this.props.error}
              <i></i>
            </div>
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
