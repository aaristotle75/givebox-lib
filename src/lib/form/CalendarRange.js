import React, {Component} from 'react';
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

  componentWillUnmount() {
  }

  render() {

    const {
      style,
      nameTo,
      labelTo,
      nameFrom,
      labelFrom,
      enableTime,
      range1Value,
      range2Value
    } = this.props;

    const dateFormat = enableTime ? 'm/d/Y H:i' : 'm/d/Y';

    return (
      <div style={style} className={`dateRange`}>
        <div className="col">
          <CalendarField
            enableTime={enableTime}
            label={labelFrom || 'From'}
            error={'Please tell us a valid date (mm/dd/yyyy) or use the calendar to choose a date.'}
            name={nameFrom}
            defaultValue={Moment.unix(range1Value).format(dateFormat)}
            onChangeCalendar={this.onChangeRange1}
          />
        </div>
        <div className="col">
          <CalendarField
            enableTime={enableTime}
            label={labelTo || 'To'}
            name={nameTo}
            defaultValue={Moment.unix(range2Value).format(dateFormat)}
            onChangeCalendar={this.onChangeRange2}
          />
        </div>
      </div>
    );
  }
}

CalendarRange.defaultProps = {
}
