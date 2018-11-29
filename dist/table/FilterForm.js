import _slicedToArray from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/slicedToArray";
import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';
import { getAPI } from '../api/actions';
import has from 'has';
import Moment from 'moment';

var Filter =
/*#__PURE__*/
function (_Component) {
  _inherits(Filter, _Component);

  function Filter(props) {
    var _this;

    _classCallCheck(this, Filter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Filter).call(this, props));
    _this.processForm = _this.processForm.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getField = _this.getField.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.ignoreFilters = _this.ignoreFilters.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Filter, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "makeFilter",
    value: function makeFilter(field) {
      var filter = '';

      if (field.multi && Array.isArray(field.value)) {
        var filters = '';
        field.value.forEach(function (value) {
          if (value && !field.value.includes('all')) {
            filter = "".concat(field.filter, ":").concat(isNaN(value) ? "\"".concat(value, "\"") : value);
          }

          filters = filter ? !filters ? filter : "".concat(filters, "%2C").concat(filter) : filters;
        });
        filter = filters;
      } else {
        var value = field.value && field.value !== 'all' ? field.value : '';

        if (value) {
          if (field.range) {
            switch (field.range) {
              case 'start':
                {
                  value = Moment.unix(value).startOf('day').unix();
                  value = ">d".concat(value);
                  break;
                }

              case 'end':
                {
                  value = Moment.unix(value).endOf('day').unix();
                  value = "<d".concat(value);
                  break;
                }
              // no default
            }
          }

          filter = "".concat(field.filter, ":").concat(isNaN(value) ? "\"".concat(value, "\"") : value);
        }
      }

      return filter;
    }
  }, {
    key: "ignoreFilters",
    value: function ignoreFilters() {
      var resource = this.props.resource;
      var endpoint = resource.search.filter ? resource.endpoint.replace("filter=".concat(resource.search.filter), '') : resource.endpoint;
      var merge = {
        filter: ''
      };

      var search = _objectSpread({}, resource.search, merge);

      this.props.getAPI(this.props.name, endpoint, search, null, true);
    }
  }, {
    key: "processForm",
    value: function processForm(fields) {
      var bindthis = this;
      var resource = this.props.resource;
      var filters = '';
      Object.entries(fields).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (value.autoReturn) {
          var filter = bindthis.makeFilter(value);
          filters = filter ? !filters ? filter : "".concat(filters, "%3B").concat(filter) : filters;
        }
      });

      var search = _objectSpread({}, resource.search);

      search.filter = filters || '';
      if (resource.search.page > 1) search.page = 1;
      var endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
      this.props.getAPI(this.props.name, endpoint, search, null, true);
    }
  }, {
    key: "getField",
    value: function getField(key, value) {
      switch (value.field) {
        case 'calendarRange':
          {
            return React.createElement("div", {
              key: key,
              className: "col",
              style: {
                width: '100%',
                margin: 5
              }
            }, this.props.calendarRange(value.name, {
              options: value.options
            }));
          }

        case 'dropdown':
          {
            return React.createElement("div", {
              key: key,
              className: "col",
              style: {
                width: '45%',
                margin: 5
              }
            }, this.props.dropdown(value.name, {
              options: value.options,
              selectLabel: value.selectLabel,
              filter: value.name,
              value: value.value,
              multi: value.multi,
              debug: value.debug
            }));
          }

        case 'filler':
          {
            return React.createElement("div", {
              key: key,
              className: "col",
              style: {
                width: '45%',
                margin: 5
              }
            });
          }
        // no default
      }
    }
  }, {
    key: "listOptions",
    value: function listOptions() {
      var items = [];
      var bindthis = this;

      if (!util.isEmpty(this.props.options)) {
        this.props.options.forEach(function (value, key) {
          items.push(bindthis.getField(key, value));
        });
      }

      return items;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "filter-content center"
      }, this.listOptions(), React.createElement("div", {
        className: "clear"
      }), React.createElement("div", {
        className: "button-group"
      }, React.createElement("button", {
        className: "button secondary",
        type: "button",
        onClick: this.ignoreFilters
      }, "Ignore Filters"), this.props.saveButton(this.processForm, 'Apply')));
    }
  }]);

  return Filter;
}(Component);

function mapStateToProps(state, props) {
  var resource = state.resource[props.name] ? state.resource[props.name] : {};
  var sort, order;

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
  getAPI: getAPI
})(Filter);