import React, { Component } from 'react';
import CalendarField from '../form/CalendarField';
import Moment from 'moment';
export default class CalendarRange extends Component {
  constructor(props) {
    super(props);
    this.onChangeRange1 = this.onChangeRange1.bind(this);
    this.onChangeRange2 = this.onChangeRange2.bind(this);
  }

  onChangeRange1(ts) {
    this.props.onChangeRange1(ts);
  }

  onChangeRange2(ts) {
    this.props.onChangeRange2(ts);
  }

  componentWillUnmount() {}

  render() {
    const {
      style,
      nameTo,
      labelTo,
      nameFrom,
      labelFrom,
      enableTime,
      range1Value,
      range2Value,
      range1Error,
      range2Error
    } = this.props;
    const dateFormat = enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';
    return (/*#__PURE__*/React.createElement("div", {
        style: style,
        className: `field-group`
      }, /*#__PURE__*/React.createElement("div", {
        className: "col"
      }, /*#__PURE__*/React.createElement(CalendarField, {
        enableTime: enableTime,
        label: labelFrom || 'From',
        error: range1Error,
        name: nameFrom,
        defaultValue: Moment.unix(range1Value).format(dateFormat),
        onChangeCalendar: this.onChangeRange1
      })), /*#__PURE__*/React.createElement("div", {
        className: "col"
      }, /*#__PURE__*/React.createElement(CalendarField, {
        enableTime: enableTime,
        label: labelTo || 'To',
        error: range2Error,
        name: nameTo,
        defaultValue: Moment.unix(range2Value).format(dateFormat),
        onChangeCalendar: this.onChangeRange2
      })))
    );
  }

}
CalendarRange.defaultProps = {};