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
import Paginate from './Paginate';
import MaxRecords from './MaxRecords';
import Search from './Search';
import NoRecords from './NoRecords';
import Export from './Export';
import Filter from './Filter';
import { util } from '../';
import { getAPI } from '../api/actions';
import AnimateHeight from 'react-animate-height';
import has from 'has';

var Table =
/*#__PURE__*/
function (_Component) {
  _inherits(Table, _Component);

  function Table(props) {
    var _this;

    _classCallCheck(this, Table);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Table).call(this, props));
    _this.renderSearch = _this.renderSearch.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderMaxRecords = _this.renderMaxRecords.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderPagination = _this.renderPagination.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderExport = _this.renderExport.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.sortColumn = _this.sortColumn.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {};
    return _this;
  }

  _createClass(Table, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.headerResizer();
    }
  }, {
    key: "sortColumn",
    value: function sortColumn(sort) {
      if (sort) {
        var resource = this.props.resource;

        var search = _objectSpread({}, resource.search);

        search.order = resource.search.order === 'desc' ? 'asc' : 'desc';
        search.sort = sort;
        var endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
        this.props.getAPI(this.props.name, endpoint, search, null, true);
      }
    }
  }, {
    key: "headerResizer",
    value: function headerResizer() {
      var thElm;
      var startOffset;
      Array.prototype.forEach.call(document.querySelectorAll('table th'), function (th) {
        th.style.position = 'relative';
        var grip = document.createElement('div');
        grip.innerHTML = '&nbsp;';
        grip.style.top = '0';
        grip.style.right = 0;
        grip.style.bottom = 0;
        grip.style.width = '5px';
        grip.style.position = 'absolute';
        grip.style.cursor = 'col-resize';
        grip.addEventListener('mousedown', function (e) {
          thElm = th;
          var xCord = e.clientX;
          var xPerc = Math.round(xCord / window.innerWidth * 100);
          var offset = Math.round(th.offsetWidth / window.innerWidth * 100);
          startOffset = offset - xPerc;
        });
        th.appendChild(grip);
      });
      document.addEventListener('mousemove', function (e) {
        if (thElm) {
          var xCord = e.clientX;
          var xPerc = Math.round(xCord / window.innerWidth * 100);
          thElm.style.width = startOffset + xPerc + '%';
        }
      });
      document.addEventListener('mouseup', function () {
        thElm = undefined;
      });
    }
  }, {
    key: "renderSearch",
    value: function renderSearch() {
      return React.createElement(Search, {
        name: this.props.name,
        placeholder: this.props.searchPlaceholder,
        align: this.props.searchAlign,
        style: this.props.searchStyle
      });
    }
  }, {
    key: "renderMaxRecords",
    value: function renderMaxRecords() {
      return React.createElement(MaxRecords, {
        name: this.props.name,
        style: this.props.maxRecordsStyle,
        textStyle: this.props.maxRecordsTextStyle,
        align: this.props.maxRecordsAlign,
        records: this.props.maxRecords
      });
    }
  }, {
    key: "renderPagination",
    value: function renderPagination() {
      return React.createElement(Paginate, {
        name: this.props.name,
        align: this.props.paginateAlign
      });
    }
  }, {
    key: "renderExport",
    value: function renderExport() {
      return React.createElement(Export, {
        name: this.props.name,
        align: this.props.exportAlign,
        desc: this.props.exportDesc
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          searchDisplay = _this$props.searchDisplay,
          exportDisplay = _this$props.exportDisplay,
          maxRecordsDisplay = _this$props.maxRecordsDisplay,
          paginationDisplay = _this$props.paginationDisplay,
          data = _this$props.data,
          sort = _this$props.sort,
          order = _this$props.order,
          name = _this$props.name,
          filters = _this$props.filters;
      var tableData = data();
      var headers = tableData.headers;
      var rows = tableData.rows;
      var footer = tableData.footer;
      return React.createElement("div", {
        className: className
      }, (searchDisplay === 'top' || searchDisplay === 'both') && this.renderSearch(), (exportDisplay === 'top' || exportDisplay === 'both') && this.renderExport(), filters && React.createElement(Filter, {
        name: name,
        options: filters
      }), (maxRecordsDisplay === 'top' || maxRecordsDisplay === 'both') && this.renderMaxRecords(), (paginationDisplay === 'top' || paginationDisplay === 'both') && this.renderPagination(), React.createElement("table", {
        style: this.props.tableStyle
      }, React.createElement(TableHead, {
        headers: headers,
        sortColumn: this.sortColumn,
        sort: sort,
        order: order
      }), React.createElement(TableBody, {
        rows: rows,
        length: headers.length,
        detailsLink: this.detailsLink
      }), React.createElement(TableFoot, {
        footer: footer
      })), (searchDisplay === 'bottom' || searchDisplay === 'both') && this.renderSearch(), (exportDisplay === 'bottom' || exportDisplay === 'both') && this.renderExport(), (maxRecordsDisplay === 'bottom' || maxRecordsDisplay === 'both') && this.renderMaxRecords(), (paginationDisplay === 'bottom' || paginationDisplay === 'both') && this.renderPagination());
    }
  }]);

  return Table;
}(Component);

Table.defaultProps = {
  searchDisplay: 'top',
  exportDisplay: 'top',
  maxRecordsDisplay: 'top',
  paginationDisplay: 'bottom'
};

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
})(Table);

var TableHead = function TableHead(_ref) {
  var headers = _ref.headers,
      sortColumn = _ref.sortColumn,
      sort = _ref.sort,
      order = _ref.order;
  var desc = React.createElement("span", {
    className: "icon icon-triangle-down"
  });
  var asc = React.createElement("span", {
    className: "icon icon-triangle-up"
  });
  var items = [];

  if (!util.isEmpty(headers)) {
    Object.entries(headers).forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          value = _ref3[1];

      if (value.name === '*details') {
        items.push(React.createElement("th", {
          key: key,
          style: {
            width: value.width
          }
        }));
      } else {
        items.push(React.createElement("th", {
          onClick: function onClick() {
            return sortColumn(value.sort);
          },
          className: "".concat(value.sort && 'sort'),
          align: value.align || 'left',
          style: {
            width: value.width
          },
          key: key
        }, value.name, " ", sort === value.sort ? order === 'desc' ? desc : asc : ''));
      }
    });
  }

  return React.createElement("thead", null, React.createElement("tr", null, items));
};

var TableBody =
/*#__PURE__*/
function (_Component2) {
  _inherits(TableBody, _Component2);

  function TableBody(props) {
    var _this2;

    _classCallCheck(this, TableBody);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TableBody).call(this, props));
    _this2.renderItems = _this2.renderItems.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    _this2.detailsLink = _this2.detailsLink.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    _this2.state = {
      details: []
    };
    return _this2;
  }

  _createClass(TableBody, [{
    key: "detailsLink",
    value: function detailsLink(ref) {
      var current = ref.current;
      var selected = current.id;
      var details = this.state.details;
      var index = details.findIndex(function (el) {
        return el === selected;
      });
      if (index === -1) details.push(selected);else details.splice(index, 1);
      this.setState(_objectSpread({}, this.state, details));
    }
  }, {
    key: "test",
    value: function test(ref) {
      console.log('clicked', ref.current.id);
    }
  }, {
    key: "renderItems",
    value: function renderItems() {
      var _this$props2 = this.props,
          rows = _this$props2.rows,
          length = _this$props2.length;
      var bindthis = this;
      var items = [];

      if (!util.isEmpty(rows)) {
        Object.entries(rows).forEach(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
              key = _ref5[0],
              value = _ref5[1];

          var td = [];
          var details = [];
          var length = value.length;
          var passkey = key;
          var options = {};
          var ref, id;
          value.forEach(function (value, key) {
            if (has(value, 'details')) {
              if (!has(value, 'key')) console.error('Add a key property for proper handling');
              id = "".concat(passkey, "-").concat(value.key, "-details");
              ref = React.createRef();
              var icon = React.createElement("span", {
                className: "icon ".concat(bindthis.state.details.includes(id) ? 'icon-minus-circle-fill' : 'icon-plus-circle-fill')
              });
              td.push(React.createElement("td", {
                onClick: function onClick() {
                  return ref ? bindthis.detailsLink(ref) : '';
                },
                className: 'hasDetails',
                key: key
              }, icon));
              details.push(React.createElement("tr", {
                ref: ref,
                className: "detailsRow",
                id: id,
                key: id
              }, React.createElement("td", {
                colSpan: length
              }, React.createElement(AnimateHeight, {
                duration: 500,
                height: bindthis.state.details.includes(id) ? 'auto' : 0
              }, React.createElement("div", {
                className: "details",
                style: {
                  paddingRight: has(value, 'width') ? value.width : '',
                  paddingLeft: has(value, 'width') ? value.width : 0
                }
              }, React.createElement("div", {
                className: "detailsTitle"
              }, "Details"), React.createElement("div", {
                className: "detailsContent"
              }, value.details))))));
            } else {
              if (has(value, 'options')) {
                options = value.options;
              } else {
                if (has(value, 'actions')) td.push(React.createElement("td", {
                  key: key
                }, value.actions.component));else td.push(React.createElement("td", {
                  onClick: function onClick() {
                    return ref ? bindthis.detailsLink(ref) : '';
                  },
                  className: "".concat(ref && 'hasDetails'),
                  key: key
                }, value));
              }
            }
          });
          var tr = React.createElement("tr", {
            className: "".concat(key % 2 === 0 ? '' : 'altRow', " ").concat(options.grayout && 'grayout'),
            key: key
          }, td);
          items.push(tr);
          if (!util.isEmpty(details)) items.push(details);
        });
      } else {
        items.push(React.createElement("tr", {
          key: 0
        }, React.createElement("td", {
          colSpan: length || 1,
          align: "center"
        }, React.createElement(NoRecords, null))));
      }

      return items;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("tbody", null, this.renderItems());
    }
  }]);

  return TableBody;
}(Component);

var TableFoot = function TableFoot(_ref6) {
  var footer = _ref6.footer;
  var items = [];

  if (!util.isEmpty(footer)) {
    Object.entries(footer).forEach(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          key = _ref8[0],
          value = _ref8[1];

      items.push(React.createElement("td", {
        key: key,
        align: value.align || 'left',
        colSpan: value.colspan || 1
      }, value.name));
    });
  }

  return React.createElement("tfoot", null, React.createElement("tr", null, items));
};