import React, {Component} from 'react';
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
      searchValue: props.query || ''
    }
  }

	componentDidMount() {
    const searchID =`${this.props.name}Search`;
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
    const search = { ...resource.search };
    search.query = value;
		if (resource.search.page > 1) search.page = 1;
    const endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
		this.props.getAPI(this.props.name, endpoint, search, null, true);
  }

  onSearch(e) {
    const value = this.state.searchValue;
    this.getSearch(value);
  }

  onChange(e) {
    this.setState({ searchValue: e.currentTarget.value });
  }

  resetSearch() {
    this.getSearch('');
    this.setState({ searchValue: '' });
  }

  setOptions() {
    let items = [];
    const records = this.props.records;
    const extraRecords = [parseInt(this.props.resource.search.max)];
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
      name,
      placeholder
    } = this.props;

    const {
      searchValue
    } = this.state;

    const searchName =`${name}Search`;
    const defaultPlaceholder = 'Search';

    return (
      <div style={style} className={`search ${align}`}>
        <TextField
          id={searchName}
          name={searchName}
          placeholder={placeholder ? placeholder : defaultPlaceholder}
          onChange={this.onChange}
          value={searchValue}
          autoFocus={searchValue ? true : false}
        >
          <div className='input-button'>
            <button className='searchBtn' id='searchBtn' onClick={this.onSearch} type='button'><span className='icon icon-search-input'></span></button>
            <button className={`searchResetBtn ${!searchValue && 'displayNone'}`} onClick={this.resetSearch} type='button'><span className='icon icon-close'></span></button>
          </div>
        </TextField>
      </div>
    );
  }
}

Search.defaultProps = {
	align: 'center'
}

function mapStateToProps(state, props) {
	const resource = state.resource[props.name] ? state.resource[props.name] : {};
  let query;
  if (!util.isLoading(resource)) {
    query = has(resource.search, 'query') ? resource.search.query : ''
  }

  return {
    resource: resource,
    query: query
  }
}

export default connect(mapStateToProps, {
	getAPI
})(Search)
