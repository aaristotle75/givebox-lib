import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util, TextField } from '../';
import { getAPI } from '../api/actions';
import has from 'has';

class Search extends Component {
  constructor(props) {
    super(props);
    this.setOptions = this.setOptions.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.getSearch = this.getSearch.bind(this);
    this.onEnterKeypress = this.onEnterKeypress.bind(this);
    this.state = {
      searchValue: props.query || '',
      resetSearch: false
    };
  }

  componentDidMount() {
    const searchID = this.props.id || `${this.props.name}Search`;
    const input = document.getElementById(searchID);
    input.addEventListener('keyup', this.onEnterKeypress);
  }

  onEnterKeypress(e) {
    e.preventDefault();

    if (e.keyCode === 13) {
      this.onSearch(e);
    }
  }

  getSearch(value) {
    const resource = this.props.resource;

    if (has(resource, 'endpoint')) {
      const search = { ...resource.search
      };
      search.query = value;
      search.page = 1;
      const endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
      this.props.getAPI(this.props.name, endpoint, search, null, true, this.props.customName || null);
    } else {
      console.error('No resource to search');
    }
  }

  onSearch(e) {
    const value = this.state.searchValue;
    if (this.props.getSearch) this.props.getSearch(value);else this.getSearch(value);
    this.setState({
      resetSearch: true
    });
  }

  onChange(e) {
    const searchValue = e.currentTarget.value;
    this.setState({
      searchValue
    });
    if (this.props.onChange) this.props.onChange(searchValue);
  }

  resetSearch() {
    if (this.props.resetSearch) this.props.resetSearch();else this.getSearch('');
    this.setState({
      searchValue: '',
      resetSearch: false
    });
  }

  setOptions() {
    let items = [];
    const records = this.props.records;
    const extraRecords = [parseInt(this.props.resource.search.max)];
    extraRecords.forEach(function (val) {
      if (records.indexOf(val) === -1) {
        records.push(val);
      }
    });

    for (let i = 0; i < records.length; i++) {
      items.push({
        primaryText: records[i],
        value: records[i]
      });
    }

    items = util.sortByField(items, 'value', 'ASC');
    return items;
  }

  render() {
    const {
      align,
      style,
      name,
      placeholder,
      id,
      iconSearch,
      iconClose
    } = this.props;
    const {
      searchValue
    } = this.state;
    const searchName = `${name}Search`;
    const defaultPlaceholder = 'Search';
    return (/*#__PURE__*/React.createElement("div", {
        style: style,
        className: `search ${align}`
      }, /*#__PURE__*/React.createElement(TextField, {
        id: id || searchName,
        name: searchName,
        placeholder: placeholder ? placeholder : defaultPlaceholder,
        onChange: this.onChange,
        value: searchValue,
        autoFocus: searchValue ? true : false
      }, /*#__PURE__*/React.createElement("div", {
        className: "input-button"
      }, /*#__PURE__*/React.createElement("button", {
        className: "searchBtn",
        id: "searchBtn",
        onClick: this.onSearch,
        type: "button"
      }, iconSearch), /*#__PURE__*/React.createElement("button", {
        className: `searchResetBtn ${!this.state.resetSearch && 'displayNone'}`,
        onClick: this.resetSearch,
        type: "button"
      }, iconClose))))
    );
  }

}

Search.defaultProps = {
  id: null,
  align: 'center',
  iconSearch: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-search"
  }),
  iconClose: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-x"
  })
};

function mapStateToProps(state, props) {
  const resource = state.resource[props.customName || props.name] ? state.resource[props.customName || props.name] : {};
  let query;

  if (!util.isLoading(resource)) {
    query = has(resource.search, 'query') ? resource.search.query : '';
  }

  return {
    resource: resource,
    query: query
  };
}

export default connect(mapStateToProps, {
  getAPI
})(Search);