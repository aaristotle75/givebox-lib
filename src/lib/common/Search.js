import React, {Component} from 'react';
import { connect } from 'react-redux';
import TextField from '../form/TextField';
import {getAPI} from '../api/actions';
import {toTitleCase, isResourceLoaded} from './utility';


class Search extends Component {

  constructor(props) {
    super(props);
    this.setOptions = this.setOptions.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.getSearch = this.getSearch.bind(this);
    this.state = {
      searchValue: props.query || ''
    }
  }

	componentDidMount() {
		var bindthis = this;
		var input = document.getElementById("search");
		input.addEventListener("keyup", function(e) {
			e.preventDefault();
			if (e.keyCode === 13) {
				bindthis.onSearch(e);
			}
		});
	}

  componentWillUnmount() {
  }

  getSearch(value) {
    var resource = this.props.resource;

    var endpoint = resource.endpoint;
		if (resource.search.page > 1) endpoint = endpoint.replace('page='+resource.search.page, 'page=1');
    if (resource.search.query) endpoint = endpoint.split('&q')[0];;
		endpoint = value ? endpoint + '&q=' + value : endpoint;
    var search = Object.assign(resource.search, {query: value, page: 1});
		this.props.getAPI(this.props.name, endpoint, search, null, true);
  }

  onSearch(e) {
    var value = this.state.searchValue;
    this.getSearch(value);
  }

  onChange(e) {
    this.setState({searchValue: e.currentTarget.value});
  }

  resetSearch() {
    this.getSearch('');
    this.setState({searchValue: ''});
  }

  setOptions() {
    var items = [];
    var records = _.union(this.props.records, [parseInt(this.props.resource.search.max)]);
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
      name,
      placeholder
    } = this.props;

    const {
      searchValue
    } = this.state;

    let searchName = name + 'Search';
    let defaultPlaceholder = 'Search ' + toTitleCase(name);

    return (
      <div style={style} className={`search ${align}`}>
        <div style={{width: '25%', display: 'inline-block'}}>
        <TextField
          id="search"
          name={searchName}
          placeholder={placeholder ? placeholder : defaultPlaceholder}
          onChange={this.onChange}
          value={searchValue}
          autoFocus={searchValue ? true : false}
        >
          <div className="input-button">
            <button className="searchBtn" id="searchBtn" onClick={this.onSearch} type="button"><span className="icon icon-search-input"></span></button>
            <button className={`searchResetBtn ${!searchValue && 'displayNone'}`} onClick={this.resetSearch} type="button"><span className="icon icon-close"></span></button>
          </div>
        </TextField>
        </div>
      </div>
    );
  }
}

Search.defaultProps = {
	align: 'center'
}

function mapStateToProps(state, props) {
	let resource = state.resource[props.name] ? state.resource[props.name] : {};
  let query;
  if (!isResourceLoaded(state.resource, [props.name])) {
    query = resource.search.hasOwnProperty('query') ? resource.search.query : ''
  }

  return {
    resource: resource,
    query: query
  }
}

export default connect(mapStateToProps, {
	getAPI
})(Search)
