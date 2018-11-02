import React, {Component} from 'react';
import { connect } from 'react-redux';
import { util, Select } from '../';
import { getAPI } from '../actions/actions';
import has from 'has';

class MaxRecords extends Component {

  constructor(props) {
    super(props);
    this.setOptions = this.setOptions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
  }

  onChange(e) {
    const selected = e.currentTarget.value;
    const resource = this.props.resource;
    const pages = Math.ceil(resource.meta.total/selected).toFixed(0);
		let endpoint = resource.endpoint.replace('max='+resource.search.max, 'max='+selected);
    let page = resource.search.page;

    if (resource.search.page > pages) {
      page = 1;
		  endpoint = endpoint.replace('page='+resource.search.page, 'page='+page);
    }

    const merge = { max: selected, page: page };
    const search = { ...resource.search, ...merge };
		this.props.getAPI(this.props.name, endpoint, search, null, true);
  }

  setOptions() {
    let items = [];
    const records = this.props.records;
    const extraRecords = (this.props.max && this.props.max && [parseInt(this.props.max)]) || [];
    extraRecords.forEach(function(val) {
      if (records.indexOf(val) === -1) {
        records.push(val);
      }
    });
    for (let i=0; i<records.length; i++) {
      items.push(
        { primaryText: records[i], value: records[i] }
      );
    }
    items = util.sortByField(items, 'value', 'ASC');
    return items;
  }

  render() {

    const {
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
        <span style={textStyle} className='smallText inline'>Records</span> <Select selected={max} onChange={this.onChange} options={this.setOptions()} />
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
  if (!util.isLoading(resource)) {
    max = has(resource.search, 'max') ? resource.search.max : null;
    count = has(resource.meta, 'total') ? resource.meta.total : null;
    error = !!resource.error;
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
