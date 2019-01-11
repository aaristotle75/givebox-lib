import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';
import { getAPI } from '../api/actions';
import has from 'has';
import Moment from 'moment';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.ignoreFiltersCallback = this.ignoreFiltersCallback.bind(this);
    this.processFormCallback = this.processFormCallback.bind(this);
    this.processForm = this.processForm.bind(this);
    this.getField = this.getField.bind(this);
    this.ignoreFilters = this.ignoreFilters.bind(this);
    this.checkFilter = this.checkFilter.bind(this);
  }

  componentDidMount() {}

  checkFilter(field) {
    let filters = '';
    let arr = [];

    if (isNaN(field.value)) {
      if (field.value.indexOf(',') !== -1) {
        arr = field.value.split(',');
      }
    }

    if (!util.isEmpty(arr) && !field.multi) {
      arr.forEach(value => {
        let filter = `${field.filter}:${isNaN(value) ? `"${value}"` : value}`;
        filters = filter ? !filters ? filter : `${filters}%2C${filter}` : filters;
      });
      filters = `(${filters})`;
    } else {
      filters = this.makeFilter(field);
    }

    return filters;
  }

  makeFilter(field, splitValue) {
    let filter = '';

    if (field.multi && Array.isArray(field.value)) {
      let filters = '';
      field.value.forEach(function (value) {
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
            case 'start':
              {
                value = Moment.unix(value).startOf('day').unix();
                value = `>d${value}`;
                break;
              }

            case 'end':
              {
                value = Moment.unix(value).endOf('day').unix();
                value = `<d${value}`;
                break;
              }
            // no default
          }
        }

        filter = `${field.filter}:${isNaN(value) && !field.range ? `"${value}"` : value}`;
      }
    }

    return filter;
  }

  ignoreFilters() {
    const resource = this.props.resource;
    let endpoint = resource.search.filter ? resource.endpoint.replace(`filter=${resource.search.filter}`, '') : resource.endpoint;
    const merge = {
      filter: ''
    };
    const search = { ...resource.search,
      ...merge
    };
    this.props.getAPI(this.props.name, endpoint, search, this.ignoreFiltersCallback, true);
  }

  ignoreFiltersCallback(res, err) {
    if (!err) {
      this.props.closeMenu();
      if (this.props.callback) this.props.callback('ignore');
    }
  }

  processFormCallback(res, err) {
    if (!err) {
      this.props.closeMenu();
      if (this.props.callback) this.props.callback('apply');
    }
  }

  processForm(fields) {
    const bindthis = this;
    const resource = this.props.resource;
    let filters = '';
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) {
        let filter = bindthis.checkFilter(value);
        filters = filter ? !filters ? filter : `${filters}%3B${filter}` : filters;
      }
    });
    const search = { ...resource.search
    };
    search.filter = filters ? this.props.alwaysFilter ? `${this.props.alwaysFilter}%3B${filters}` : filters : '';
    if (resource.search.page > 1) search.page = 1;
    const endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
    this.props.getAPI(this.props.name, endpoint, search, this.processFormCallback, true);
  }

  getField(key, value) {
    switch (value.field) {
      case 'calendarRange':
        {
          return React.createElement("div", {
            key: key,
            className: "col rangeCol"
          }, this.props.calendarRange(value.name, {
            options: value.options,
            colWidth: '50%',
            enableTime: value.enableTime,
            overlay: value.overlay,
            overlayDuration: value.overlayDuration
          }));
        }

      case 'dropdown':
        {
          return React.createElement("div", {
            key: key,
            className: "col dropdownCol"
          }, this.props.dropdown(value.name, {
            options: value.options,
            selectLabel: value.selectLabel,
            filter: value.name,
            value: value.value,
            multi: value.multi,
            debug: value.debug,
            direction: value.direction,
            onChange: value.onChange
          }));
        }

      case 'filler':
        {
          return React.createElement("div", {
            key: key,
            className: "col fillerCol"
          });
        }
      // no default
    }
  }

  listOptions() {
    const items = [];
    const bindthis = this;

    if (!util.isEmpty(this.props.options)) {
      this.props.options.forEach(function (value, key) {
        items.push(bindthis.getField(key, value));
      });
    }

    return items;
  }

  render() {
    const {
      allowDisabled
    } = this.props;
    return React.createElement("div", {
      className: `filter-content center`
    }, this.listOptions(), React.createElement("div", {
      className: "clear"
    }), React.createElement("div", {
      className: "button-group"
    }, React.createElement("button", {
      className: "button",
      type: "button",
      onClick: this.ignoreFilters
    }, "Ignore Filters"), this.props.saveButton(this.processForm, {
      label: 'Apply',
      allowDisabled: allowDisabled
    })));
  }

}

Filter.defaultProps = {
  allowDisabled: true,
  alwaysFilter: ''
};

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
  };
}

export default connect(mapStateToProps, {
  getAPI
})(Filter);