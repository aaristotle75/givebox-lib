import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util, TextField } from '../';
import { getAPI } from '../api/actions';
import has from 'has';

var Search =
/*#__PURE__*/
function (_Component) {
  _inherits(Search, _Component);

  function Search(props) {
    var _this;

    _classCallCheck(this, Search);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Search).call(this, props));
    _this.setOptions = _this.setOptions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onSearch = _this.onSearch.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.resetSearch = _this.resetSearch.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getSearch = _this.getSearch.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      searchValue: props.query || ''
    };
    return _this;
  }

  _createClass(Search, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var bindthis = this;
      var input = document.getElementById('search');
      input.addEventListener('keyup', function (e) {
        e.preventDefault();

        if (e.keyCode === 13) {
          bindthis.onSearch(e);
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "getSearch",
    value: function getSearch(value) {
      var resource = this.props.resource;

      var search = _objectSpread({}, resource.search);

      search.query = value;
      if (resource.search.page > 1) search.page = 1;
      var endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
      this.props.getAPI(this.props.name, endpoint, search, null, true);
    }
  }, {
    key: "onSearch",
    value: function onSearch(e) {
      var value = this.state.searchValue;
      this.getSearch(value);
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      this.setState({
        searchValue: e.currentTarget.value
      });
    }
  }, {
    key: "resetSearch",
    value: function resetSearch() {
      this.getSearch('');
      this.setState({
        searchValue: ''
      });
    }
  }, {
    key: "setOptions",
    value: function setOptions() {
      var items = [];
      var records = this.props.records;
      var extraRecords = [parseInt(this.props.resource.search.max)];
      extraRecords.forEach(function (val) {
        if (records.indexOf(val) === -1) {
          records.push(val);
        }
      });

      for (var i = 0; i < records.length; i++) {
        items.push({
          primaryText: records[i],
          value: records[i]
        });
      }

      items = util.sortByField(items, 'value', 'ASC');
      return items;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          align = _this$props.align,
          style = _this$props.style,
          name = _this$props.name,
          placeholder = _this$props.placeholder;
      var searchValue = this.state.searchValue;
      var searchName = name + 'Search';
      var defaultPlaceholder = 'Search';
      return React.createElement("div", {
        style: style,
        className: "search ".concat(align)
      }, React.createElement(TextField, {
        id: "search",
        name: searchName,
        placeholder: placeholder ? placeholder : defaultPlaceholder,
        onChange: this.onChange,
        value: searchValue,
        autoFocus: searchValue ? true : false
      }, React.createElement("div", {
        className: "input-button"
      }, React.createElement("button", {
        className: "searchBtn",
        id: "searchBtn",
        onClick: this.onSearch,
        type: "button"
      }, React.createElement("span", {
        className: "icon icon-search-input"
      })), React.createElement("button", {
        className: "searchResetBtn ".concat(!searchValue && 'displayNone'),
        onClick: this.resetSearch,
        type: "button"
      }, React.createElement("span", {
        className: "icon icon-close"
      })))));
    }
  }]);

  return Search;
}(Component);

Search.defaultProps = {
  align: 'center'
};

function mapStateToProps(state, props) {
  var resource = state.resource[props.name] ? state.resource[props.name] : {};
  var query;

  if (!util.isLoading(resource)) {
    query = has(resource.search, 'query') ? resource.search.query : '';
  }

  return {
    resource: resource,
    query: query
  };
}

export default connect(mapStateToProps, {
  getAPI: getAPI
})(Search);