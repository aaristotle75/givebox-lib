import React, {Component} from 'react';
import { connect } from 'react-redux';
import Select from '../form/Select';
import {getAPI} from '../api/actions';
import {sortByField, isResourceLoaded} from './utility';

class MaxRecords extends Component {

  constructor(props) {
    super(props);
    this.setOptions = this.setOptions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
  }

  onChange(e) {
    var selected = e.currentTarget.value;
    var resource = this.props.resource;
		var endpoint = resource.endpoint.replace('max='+resource.search.max, 'max='+selected);
    var pages = Math.ceil(resource.meta.total/selected).toFixed(0);
    var page = resource.search.page;
    if (resource.search.page > pages) {
      page = 1;
		  endpoint = endpoint.replace('page='+resource.search.page, 'page='+page);
    }
		var search = Object.assign(resource.search, {max: selected, page: page});
		this.props.getAPI(this.props.name, endpoint, search, null, true);
  }

  setOptions() {
    var items = [];
    var records = _.union(this.props.records, this.props.max && [parseInt(this.props.max)]);
    for (let i=0; i<records.length; i++) {
      items.push(
        { primaryText: records[i], value: records[i] }
      );
    }
    items = sortByField(items, 'value', 'ASC');
    return items;
  }

  render() {

    const {
      resource,
      align,
      style,
      textStyle,
      max,
      count,
      error
    } = this.props;

    if (!count || error) {
      return ( <div></div> );
    }

    return (
      <div style={style} className={`maxRecords ${align}`}>
        <span style={textStyle} className="smallText inline">Records</span> <Select selected={max} onChange={this.onChange} options={this.setOptions()} />
      </div>
    );
  }
}

MaxRecords.defaultProps = {
	align: 'center',
  records: [20, 50, 100, 500],
}

function mapStateToProps(state, props) {
	let resource = state.resource[props.name] ? state.resource[props.name] : {};
  let max, error, count;
  if (!isResourceLoaded(state.resource, [props.name])) {
    max = resource.search.hasOwnProperty('max') ? resource.search.max : '',
    count = resource.meta.hasOwnProperty('total') ? resource.meta.total : ''
    error = resource.error ? true : false
  }

  return {
    resource: resource,
    max: max,
    count: count,
    error: error
  }
}

export default connect(mapStateToProps, {
	getAPI
})(MaxRecords)
