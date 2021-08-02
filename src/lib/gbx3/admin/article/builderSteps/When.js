import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../../common/utility';

class When extends React.Component {

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
        { this.props.calendarField('when', {
          group: 'when',
          label: 'When is the Event',
          placeholder: 'Choose Date',
          fixedLabel: true,
          enableTime: true,
          enableTimeOption: true,
          enableTimeOptionLabel: 'Show Time',
          value: util.getValue(data, 'when'),
          hideIcon: true,
          leftBar: true
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
})(When);
