import React, {Component} from 'react';
import CalendarField from '../form/CalendarField';

export default class CalendarRange extends Component {

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
  }

  render() {

    const {
      style,
      className,
      nameTo,
      labelTo,
      nameFrom,
      labelFrom,
      enableTime
    } = this.props;

    return (
      <div style={style} className={`dateRange`}>
        <div className="col">
          <CalendarField
            enableTime={enableTime}
            label={labelFrom || 'From'}
            error={'Please tell us a valid date (mm/dd/yyyy) or use the calendar to choose a date.'}
            name={nameFrom}
            defaultValue={new Date}
          />
        </div>
        <div className="col">
          <CalendarField
            enableTime={enableTime}
            label={labelTo || 'To'}
            name={nameTo}
            defaultValue={new Date}            
          />
        </div>
      </div>
    );
  }
}

CalendarRange.defaultProps = {
}
