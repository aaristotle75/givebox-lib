import React, {Component} from 'react';
import { connect } from 'react-redux';
import {getAPI} from '../api/actions';
import {isResourceLoaded} from './utility';
import CalendarRange from '../form/CalendarRange';
import Select from '../form/Select';
import {Error} from 'common/Alerts';

class Export extends Component {

  constructor(props) {
    super(props);
    this.setOptions = this.setOptions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
  }

  onChange(e) {
    console.log(e.currentTarget.value);
  }

  setOptions() {
    var items = [
      { primaryText: 'All Transactions', value: 'all' },
      { primaryText: 'Specific date range', value: 'daterange' }
    ];
    return items;
  }

  render() {

    const {
      style
    } = this.props;

    return (
      <div id="exportRecords" style={style} className={`exportRecords`}>
        <Error msg={'Please fix the following errors to continue.'} />
        <div className="row">
          <div className="col right">
            <label className="side">Time Period</label>
          </div>
          <div  className="col left">
            <Select options={this.setOptions()} onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="side">Date</label>
          </div>
          <div className="col">
            <CalendarRange
              enableTime={false}
              nameFrom="exportRange1"
              labelFrom={'From'}
              nameTo="exportRange2"
              labelTo={'To'}
            />
          </div>
        </div>
      </div>
    );
  }
}

Export.defaultProps = {
}

function mapStateToProps(state, props) {
	let resource = state.resource[props.name] ? state.resource[props.name] : {};
  if (!isResourceLoaded(state.resource, [props.name])) {
  }

  return {
    resource: resource
  }
}

export default connect(mapStateToProps, {
	getAPI
})(Export)
