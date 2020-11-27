import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import Collapse from '../../common/Collapse';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import { toggleModal } from '../../api/actions';
import Moment from 'moment-timezone';
import AnimateHeight from 'react-animate-height';

class CoundownEditForm extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.setTimezone = this.setTimezone.bind(this);
    this.state = {
      tab: 'edit'
    }
  }

  onChange(name, value, field) {

    const {
      content
    } = this.props;

    const {
      timezone
    } = content;

    this.props.fieldProp('endsAt', { error: false });

    const offset = 0; //(Moment.tz(Moment.utc(), timezone).utcOffset() * 60);
    const enableTime = util.getValue(field, 'enableTime');
    const current = (Date.now() / 1000) + offset;

    let ts = value + offset;
    let status = null;
    if (ts > current) {
      status = 'open';
    } else {
      status = 'closed';
    }

    this.props.contentUpdated({
      status,
      [name]: ts,
      [`${name}Time`]: enableTime,
      timezone: timezone || ''
    });
  }

  timezoneOptions() {
    const options = [
      { primaryText: 'US Eastern Time Zone', value: 'America/New_York' },
      { primaryText: 'US Central Time Zone', value: 'America/Chicago' },
      { primaryText: 'US Mountain Time Zone', value: 'America/Denver' },
      { primaryText: 'US Pacific Time Zone', value: 'America/Los_Angeles' },
      { primaryText: 'US Alaska Time Zone', value: 'America/Anchorage' },
      { primaryText: 'US Hawaii Time Zone', value: 'America/Honolulu' },
      { primaryText: 'UTC Coordinated Universal Time', value: 'utc' }
    ];
    return options;
  }

  setTimezone(timezone) {
    this.props.contentUpdated({
      timezone
    });
  }

  render() {

    const {
      content
    } = this.props;

    const {
      endsAt,
      endsAtTime
    } = content;

    const dateFormat = 'MMMM Do, YYYY h:mmA z';
    const timezone = util.getValue(content, 'timezone', 'utc');
    const dateDisplay = Moment(Moment.unix(endsAt)).tz(timezone).format(dateFormat);

    return (
      <div className='modalWrapper'>
      <Collapse
        label={`When Does the Sweepstakes End`}
        iconPrimary='edit'
      >
        <div className='formSectionContainer'>
          <div className='formSection'>
            <div style={{ fontWeight: 300, margin: '20px 0' }}>
              The Date/Time is in the UTC timezone. Change the timezone below to see the Date/Time in a specific timezone.
            </div>
            <AnimateHeight height={endsAt ? 'auto' : 0}>
              <div className='input-group'>
                <div style={{ marginBottom: 5 }} className='label'>Sweepstakes Will End on this Date/Time in the Timezone Specified Below.</div>
                <span style={{ fontWeight: 300 }}>{dateDisplay}</span>
              </div>
            </AnimateHeight>
            <Dropdown
              portalID={`countdown-timezone`}
              portal={true}
              portalClass={'dropdown-left-portal'}
              name='timezone'
              portalLeftOffset={10}
              contentWidth={300}
              label={'Timezone'}
              fixedLabel={true}
              defaultValue={timezone || 'utc'}
              onChange={(name, value) => {
                this.setTimezone(value);
              }}
              options={this.timezoneOptions()}
            />
            {this.props.calendarField('endsAt', {
              label: 'Sweepstakes End Date/Time in UTC',
              fixedLabel: true,
              enableTime: true,
              enableTimeOption: false,
              enableTimeOptionLabel: 'Show Time',
              onChange: this.onChange,
              value: endsAt,
              validate: 'date',
              utc: true
            })}
            <div className='fieldContext'>
              The Date/Time is based on UTC (Coordinated Universal Time). Adjust the Date/Time accordingly to match your timezone.
            </div>
          </div>
        </div>
      </Collapse>
      </div>
    )
  }
}

class CountdownEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    const {
      modalID
    } = this.props;

    return (
      <Form id={`${modalID}-form`}>
        <CoundownEditForm {...this.props} />
      </Form>
    )
  }
}

function mapStateToProps(state, props) {

  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

  return {
    primaryColor
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(CountdownEdit);
