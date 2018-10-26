import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paginate from "./Paginate";
import MaxRecords from "./MaxRecords";
import Search from "./Search";
import NoRecords from "./NoRecords";
import ExportLink from "./ExportLink";
import { getAPI } from '../actions/actions';
import { translateSort, isResourceLoaded, isEmpty } from './utility';

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
        var currentOrder = resource.search.order;
        var order = currentOrder === 'desc' ? 'asc' : 'desc';
        var sortToReplace = 'sort=' + translateSort(currentOrder) + resource.search.sort;
        var replaceSort = 'sort=' + translateSort(order) + sort;
        var endpoint = resource.endpoint.replace(sortToReplace, replaceSort);
        var search = Object.assign(resource.search, {
          sort: sort,
          order: order
        });
        this.props.getAPI(this.props.name, endpoint, search, null, true);
      }

      return;
    }
  }, {
    key: "headerResizer",
    value: function headerResizer() {
      var thElm;
      var startOffset;
      Array.prototype.forEach.call(document.querySelectorAll("table th"), function (th) {
        th.style.position = 'relative';
        var grip = document.createElement('div');
        grip.innerHTML = "&nbsp;";
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
      return React.createElement(ExportLink, {
        name: this.props.name,
        align: this.props.exportAlign
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          searchAbove = _this$props.searchAbove,
          searchBelow = _this$props.searchBelow,
          exportAbove = _this$props.exportAbove,
          exportBelow = _this$props.exportBelow,
          maxRecordsAbove = _this$props.maxRecordsAbove,
          maxRecordsBelow = _this$props.maxRecordsBelow,
          paginationAbove = _this$props.paginationAbove,
          paginationBelow = _this$props.paginationBelow,
          data = _this$props.data,
          sort = _this$props.sort,
          order = _this$props.order;
      /*
      if (!search.sort || !seach.order) {
        return ( <div></div> );
      }
      */

      var tableData = data();
      var headers = tableData.headers;
      var rows = tableData.rows;
      var footer = tableData.footer;
      return React.createElement("div", {
        className: className
      }, searchAbove && this.renderSearch(), exportAbove && this.renderExport(), maxRecordsAbove && this.renderMaxRecords(), paginationAbove && this.renderPagination(), React.createElement("table", {
        style: this.props.tableStyle
      }, React.createElement(TableHead, {
        headers: headers,
        sortColumn: this.sortColumn,
        sort: sort,
        order: order
      }), React.createElement(TableBody, {
        rows: rows,
        length: headers.length
      }), React.createElement(TableFoot, {
        footer: footer
      })), searchBelow && this.renderSearch(), exportBelow && this.renderExport(), maxRecordsBelow && this.renderMaxRecords(), paginationBelow && this.renderPagination());
    }
  }]);

  return Table;
}(Component);

Table.defaultProps = {
  searchAbove: true,
  searchBelow: false,
  paginationAbove: true,
  paginationBelow: true,
  maxRecordsAbove: true,
  maxRecordsBelow: true,
  exportAbove: true,
  exportBelow: false
};

function mapStateToProps(state, props) {
  var resource = state.resource[props.name] ? state.resource[props.name] : {};
  var endpoint, sort, order;

  if (!isResourceLoaded(state.resource, [props.name])) {
    sort = resource.search.hasOwnProperty('sort') ? resource.search.sort : '';
    order = resource.search.hasOwnProperty('order') ? resource.search.order : '';
  }

  return {
    resource: resource,
    endpoint: endpoint,
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

  if (!isEmpty(headers)) {
    Object.keys(headers).forEach(function (key) {
      items.push(React.createElement("th", {
        onClick: function onClick() {
          return sortColumn(headers[key].sort);
        },
        className: "".concat(headers[key].sort && 'sort'),
        align: headers[key].align || "left",
        style: {
          width: headers[key].width
        },
        key: key
      }, headers[key].name, " ", sort === headers[key].sort ? order === 'desc' ? desc : asc : ''));
    });
  }

  return React.createElement("thead", null, React.createElement("tr", null, items));
};

var TableBody = function TableBody(_ref2) {
  var rows = _ref2.rows,
      length = _ref2.length;
  var items = [];

  if (!isEmpty(rows)) {
    Object.keys(rows).forEach(function (key) {
      var td = [];

      for (var i = 0; i < rows[key].length; i++) {
        td.push(React.createElement("td", {
          key: i
        }, rows[key][i]));
      }

      var tr = React.createElement("tr", {
        key: key
      }, td);
      items.push(tr);
    });
  } else {
    items.push(React.createElement("tr", {
      key: 0
    }, React.createElement("td", {
      colSpan: length || 1,
      align: "center"
    }, React.createElement(NoRecords, null))));
  }

  return React.createElement("tbody", null, items);
};

var TableFoot = function TableFoot(_ref3) {
  var footer = _ref3.footer;
  var items = [];

  if (!isEmpty(footer)) {
    Object.keys(footer).forEach(function (key) {
      items.push(React.createElement("td", {
        key: key,
        align: footer[key].align || "left",
        colSpan: footer[key].colspan || 1
      }, footer[key].name));
    });
  }

  return React.createElement("tfoot", null, React.createElement("tr", null, items));
};