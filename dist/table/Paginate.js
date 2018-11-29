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

var Paginate =
/*#__PURE__*/
function (_Component) {
  _inherits(Paginate, _Component);

  function Paginate(props) {
    var _this;

    _classCallCheck(this, Paginate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Paginate).call(this, props));
    _this.onPageClick = _this.onPageClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.pagination = _this.pagination.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handlePreviousPage = _this.handlePreviousPage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleNextPage = _this.handleNextPage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.setRecordCount = _this.setRecordCount.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      range1: 0,
      range2: 0,
      count: 0
    };
    return _this;
  }

  _createClass(Paginate, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setRecordCount(this.props);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.activePage !== nextProps.activePage || this.props.max !== nextProps.max || this.props.count !== nextProps.count) {
        this.setRecordCount(nextProps);
      }
    }
  }, {
    key: "onPageClick",
    value: function onPageClick(e) {
      e.preventDefault();
      var getSelectedPage = e.currentTarget.id.split('-', 2);
      var page = getSelectedPage[1];
      this.handlePageSelected(page, e);
    }
  }, {
    key: "handlePreviousPage",
    value: function handlePreviousPage(e) {
      if (this.props.activePage > 1) {
        this.handlePageSelected(this.props.activePage - 1, e);
      }
    }
  }, {
    key: "handleNextPage",
    value: function handleNextPage(e) {
      if (this.props.activePage < this.props.pages) {
        this.handlePageSelected(this.props.activePage + 1, e);
      }
    }
  }, {
    key: "handlePageSelected",
    value: function handlePageSelected(sel, e) {
      e.preventDefault();
      var selected = parseInt(sel);

      if (this.props.activePage !== selected) {
        var resource = this.props.resource;

        var search = _objectSpread({}, resource.search);

        search.page = selected;
        var endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
        this.props.getAPI(this.props.name, endpoint, search, null, true);
      }
    }
  }, {
    key: "pagination",
    value: function pagination() {
      var _this2 = this;

      var items = [];
      var activePage = this.props.activePage;
      var pageRange = this.props.pageRange;
      var marginPages = this.props.marginPages;
      var pages = this.props.pages;
      var id, page, breakView;

      if (this.props.pages <= pageRange) {
        for (var i = 1; i <= pages; i++) {
          id = 'page-' + i;
          page = React.createElement("li", {
            key: id,
            id: id,
            onClick: function onClick(e) {
              return _this2.onPageClick(e);
            },
            className: "".concat(this.props.pageClassName, " ").concat(activePage === i ? this.props.activeClassName : '')
          }, i);
          items.push(page);
        }
      } else {
        var leftSide = pageRange / 2;
        var rightSide = pageRange / 2;

        if (activePage > pages - pageRange / 2) {
          rightSide = pages - activePage;
          leftSide = pageRange - rightSide;
        } else if (activePage < pageRange / 2) {
          leftSide = activePage;
          rightSide = pageRange - leftSide;
        }

        for (var _i = 1; _i <= pages; _i++) {
          id = 'page-' + _i;
          page = React.createElement("li", {
            key: id,
            id: id,
            onClick: function onClick(e) {
              return _this2.onPageClick(e);
            },
            className: "".concat(this.props.pageClassName, " ").concat(activePage === _i ? this.props.activeClassName : '')
          }, _i);

          if (_i <= marginPages) {
            items.push(page);
            continue;
          }

          if (_i > pages - marginPages) {
            items.push(page);
            continue;
          }

          if (_i >= activePage - leftSide && _i <= activePage + rightSide) {
            items.push(page);
            continue;
          }

          var keys = Object.keys(items);
          var breakLabelKey = keys[keys.length - 1];
          var breakLabelValue = items[breakLabelKey];

          if (breakLabelValue !== breakView) {
            var breakId = breakId === 'leftSide' ? breakId = 'rightSide' : 'leftSide';
            breakView = React.createElement("li", {
              onClick: breakId === 'leftSide' ? function (e) {
                return _this2.handlePreviousPage(e);
              } : function (e) {
                return _this2.handleNextPage(e);
              },
              id: breakId,
              key: "breakView-".concat(_i),
              className: this.props.breakClassName
            }, this.props.breakLabel);
            items.push(breakView);
          }
        }
      }

      return items;
    }
  }, {
    key: "setRecordCount",
    value: function setRecordCount(props) {
      var count = props.count;
      var max = props.max;
      var page = props.activePage;
      var range2 = 1;
      var range1 = 1;

      if (max < count) {
        range2 = max;
      } else {
        range2 = count;
      }

      if (page > 1) {
        range1 += max * page - max;

        if (max * page < count) {
          range2 = page * max;
        } else {
          range2 = count;
        }
      }

      this.setState({
        range1: range1,
        range2: range2,
        count: count
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          align = _this$props.align,
          count = _this$props.count,
          pages = _this$props.pages,
          activePage = _this$props.activePage,
          containerClassName = _this$props.containerClassName,
          previousClassName = _this$props.previousClassName,
          nextClassName = _this$props.nextClassName,
          disabledClassName = _this$props.disabledClassName;
      var _this$state = this.state,
          range1 = _this$state.range1,
          range2 = _this$state.range2;

      if (!parseInt(count)) {
        return React.createElement("div", null);
      }

      return React.createElement("div", {
        className: "paginate ".concat(align)
      }, count && React.createElement("div", {
        className: "recordCount"
      }, React.createElement("span", null, "Showing ", range1, "-", range2, " of ", count)), pages > 1 ? React.createElement("div", null, React.createElement("ul", {
        className: containerClassName
      }, React.createElement("li", {
        onClick: function onClick(e) {
          return _this3.handlePreviousPage(e);
        },
        className: "page ".concat(previousClassName, " ").concat(activePage <= 1 ? disabledClassName : '')
      }, React.createElement("span", {
        className: "icon-arrow-left"
      })), this.pagination(), React.createElement("li", {
        onClick: function onClick(e) {
          return _this3.handleNextPage(e);
        },
        className: "page ".concat(nextClassName, " ").concat(activePage >= pages ? disabledClassName : '')
      }, React.createElement("span", {
        className: "icon-arrow-right"
      })))) : React.createElement("div", null));
    }
  }]);

  return Paginate;
}(Component);

;
Paginate.defaultProps = {
  align: 'center',
  previousLabel: '<',
  nextLabel: '>',
  breakLabel: '...',
  breakClassName: 'break',
  pageRange: 3,
  marginPages: 1,
  containerClassName: 'pagination',
  pageClassName: 'page',
  activeClassName: 'active',
  previousClassName: 'previous',
  nextClassName: 'next',
  disabledClassName: 'disabled'
};

function mapStateToProps(state, props) {
  var resource = state.resource[props.name] ? state.resource[props.name] : {};
  var count, max, pages, activePage;

  if (!util.isLoading(resource)) {
    count = parseInt(resource.meta.total);
    max = parseInt(resource.search.max);
    pages = Math.ceil(count / max).toFixed(0);
    activePage = parseInt(resource.search.page);
  }

  return {
    resource: resource,
    count: count,
    max: max,
    pages: pages,
    activePage: activePage
  };
}

export default connect(mapStateToProps, {
  getAPI: getAPI
})(Paginate);