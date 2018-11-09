import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';
import { getAPI } from '../api/actions';
import has from 'has';

class Filter extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.getField = this.getField.bind(this);
  }

  componentDidMount() {
  }

  processForm(fields) {
    let data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });
    console.log(data);
  }

  getField(key, value) {
    switch (value.field) {
      case 'calendarRange': {
        return <div key={key} className='col' style={{ width: '100%', margin: 5}}>{this.props.calendarRange()}</div>;
      }

      case 'dropdown': {
        return <div key={key} className='col' style={{width: '45%', margin: 5}}>{this.props.dropdown(value.name, { options: value.options, selectLabel: value.selectLabel })}</div>;
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
        {this.props.saveButton(this.processForm)}
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
