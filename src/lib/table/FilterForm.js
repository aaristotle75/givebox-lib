import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';
import { getAPI } from '../api/actions';
import has from 'has';
import Moment from 'moment';

class Filter extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.getField = this.getField.bind(this);
    this.ignoreFilters = this.ignoreFilters.bind(this);
  }

  componentDidMount() {
  }

  makeFilter(field) {
    let filter = '';
    if (field.multi && Array.isArray(field.value)) {
      let filters = '';
      field.value.forEach(function(value) {
        if (value && !field.value.includes('all')) {
          filter = `${field.filter}:${isNaN(value) ? `"${value}"` : value}`;
        }
        filters = filter ? !filters ? filter : `${filters}%2C${filter}` : filters;
      });
      filter = filters;
    } else {
      let value = field.value && field.value !== 'all' ? field.value : '';
      if (value) {
        if (field.range) {
          switch (field.range) {
            case 'start': {
              value = Moment.unix(value).startOf('day').unix();
              value = `>d${value}`;
              break;
            }
            case 'end': {
              value = Moment.unix(value).endOf('day').unix();
              value = `<d${value}`;
              break;
            }

            // no default
          }
        }
        filter = `${field.filter}:${isNaN(value) ? `"${value}"` : value}`;
      }
    }
    return filter;
  }

  ignoreFilters() {
    const resource = this.props.resource;
    let endpoint = resource.search.filter ? resource.endpoint.replace(`filter=${resource.search.filter}`, '') : resource.endpoint;
    const merge = { filter: '' };
    const search = { ...resource.search, ...merge };
		this.props.getAPI(this.props.name, endpoint, search, null, true);
  }

  processForm(fields) {
    const bindthis = this;
    const resource = this.props.resource;
    let filters = '';
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) {
        let filter = bindthis.makeFilter(value);
        filters = filter ? !filters ? filter : `${filters}%3B${filter}` : filters;
      }
    });
    const search = { ...resource.search };
    search.filter = filters || '';
		if (resource.search.page > 1) search.page = 1;
    const endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
		this.props.getAPI(this.props.name, endpoint, search, null, true);
  }

  getField(key, value) {
    switch (value.field) {
      case 'calendarRange': {
        return <div key={key} className='col' style={{ width: '100%', margin: 5}}>{this.props.calendarRange(value.name, { options: value.options })}</div>;
      }

      case 'dropdown': {
        return <div key={key} className='col' style={{ width: '45%', margin: 5}}>
          {this.props.dropdown(
            value.name, {
              options: value.options,
              selectLabel: value.selectLabel,
              filter: value.name,
              value: value.value,
              multi: value.multi,
              debug: value.debug
          })}
          </div>;
      }

      case 'filler': {
        return <div key={key} className='col' style={{ width: '45%', margin: 5}}></div>;
      }

      // no default
    }
  }

  listOptions() {
    const items = [];
    const bindthis = this;
    if (!util.isEmpty(this.props.options)) {
      this.props.options.forEach(function(value, key) {
        items.push(bindthis.getField(key, value));
      });
    }

    return items;
  }

  render() {

    return (
      <div className={`filter-content center`}>
        {this.listOptions()}
        <div className='clear'></div>
        <div className='button-group'>
          <button className='button secondary' type='button' onClick={this.ignoreFilters}>Ignore Filters</button>
          {this.props.saveButton(this.processForm, 'Apply')}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {

  const resource = state.resource[props.name] ? state.resource[props.name] : {};
  let sort, order;
  if (!util.isLoading(resource)) {
    sort = has(resource.search, 'sort') ? resource.search.sort : '';
    order = has(resource.search, 'order') ? resource.search.order : '';
  }

  return {
    resource: resource,
    sort: sort,
    order: order
  }
}

export default connect(mapStateToProps, {
  getAPI
})(Filter)
