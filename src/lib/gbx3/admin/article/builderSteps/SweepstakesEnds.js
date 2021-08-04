import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../../common/utility';

class SweepstakesEnds extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      data
    } = this.props;

    return (
      <div className='fieldGroup'>
        { this.props.calendarField('endsAt', {
          group: 'endsAt',
          label: 'When Does the Sweepstakes End',
          fixedLabel: true,
          enableTime: false,
          enableTimeOption: false,
          enableTimeOptionLabel: 'Show Time',
          value: util.getValue(data, 'endsAt'),
          hideIcon: true,
          leftBar: true,
          required: true
        })}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(SweepstakesEnds);
