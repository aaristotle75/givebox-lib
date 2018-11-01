import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from '../form/Select';
import { getAPI } from '../actions/actions';
import { sortByField, isResourceLoaded } from './utility';

var MaxRecords =
/*#__PURE__*/
function (_Component) {
  _inherits(MaxRecords, _Component);

  function MaxRecords(props) {
    var _this;

    _classCallCheck(this, MaxRecords);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MaxRecords).call(this, props));
    _this.setOptions = _this.setOptions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(MaxRecords, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "onChange",
    value: function onChange(e) {
      var selected = e.currentTarget.value;
      var resource = this.props.resource;
      var endpoint = resource.endpoint.replace('max=' + resource.search.max, 'max=' + selected);
      var pages = Math.ceil(resource.meta.total / selected).toFixed(0);
      var page = resource.search.page;

      if (resource.search.page > pages) {
        page = 1;
        endpoint = endpoint.replace('page=' + resource.search.page, 'page=' + page);
      }

      var search = Object.assign({}, resource.search, {
        max: selected,
        page: page
      });
      this.props.getAPI(this.props.name, endpoint, search, null, true);
    }
  }, {
    key: "setOptions",
    value: function setOptions() {
      var items = [];
      var records = this.props.records;
      var extraRecords = this.props.max && this.props.max && [parseInt(this.props.max)] || [];
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

      items = sortByField(items, 'value', 'ASC');
      return items;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          align = _this$props.align,
          style = _this$props.style,
          textStyle = _this$props.textStyle,
          max = _this$props.max,
          count = _this$props.count,
          error = _this$props.error;

      if (!count || error) {
        return React.createElement("div", null);
      }

      return React.createElement("div", {
        style: style,
        className: "maxRecords ".concat(align)
      }, React.createElement("span", {
        style: textStyle,
        className: "smallText inline"
      }, "Records"), " ", React.createElement(Select, {
        selected: max,
        onChange: this.onChange,
        options: this.setOptions()
      }));
    }
  }]);

  return MaxRecords;
}(Component);

MaxRecords.defaultProps = {
  align: 'center',
  records: [20, 50, 100, 500]
};

function mapStateToProps(state, props) {
  var resource = state.resource[props.name] ? state.resource[props.name] : {};
  var max, error, count;

  if (!isResourceLoaded(state.resource, [props.name])) {
    max = resource.search.hasOwnProperty('max') ? resource.search.max : null;
    count = resource.meta.hasOwnProperty('total') ? resource.meta.total : null;
    error = !!resource.error;
  }

  return {
    resource: resource,
    max: max,
    count: count,
    error: error
  };
}

export default connect(mapStateToProps, {
  getAPI: getAPI
})(MaxRecords);