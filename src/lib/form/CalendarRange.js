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
    if (this.props.onChangeRange1) this.props.onChangeRange1(ts);
  }

  onChangeRange2(ts) {
    if (this.props.onChangeRange2) this.props.onChangeRange2(ts);
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
      range2Value,
      range1Error,
      range2Error,
      placeholder1,
      placeholder2
    } = this.props;

    const dateFormat = enableTime ? 'MM/DD/YYYY H:mm' : 'MM/DD/YYYY';

    return (
      <div style={style} className={`field-group`}>
        <div className="col">
          <CalendarField
            enableTime={enableTime}
            label={labelFrom || 'From'}
            error={range1Error}
            name={nameFrom}
            defaultValue={Moment.unix(range1Value).format(dateFormat)}
            onChangeCalendar={this.onChangeRange1}
            placeholder={placeholder1}
          />
        </div>
        <div className="col">
          <CalendarField
            enableTime={enableTime}
            label={labelTo || 'To'}
            error={range2Error}
            name={nameTo}
            defaultValue={Moment.unix(range2Value).format(dateFormat)}
            onChangeCalendar={this.onChangeRange2}
            placeholder={placeholder2}
          />
        </div>
      </div>
    );
  }
}

CalendarRange.defaultProps = {
}
