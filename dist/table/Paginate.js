import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';
import { getAPI } from '../api/actions';

class Paginate extends Component {
  constructor(props) {
    super(props);
    this.onPageClick = this.onPageClick.bind(this);
    this.pagination = this.pagination.bind(this);
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.setRecordCount = this.setRecordCount.bind(this);
    this.state = {
      range1: 0,
      range2: 0,
      count: 0
    };
  }

  componentDidMount() {
    this.setRecordCount(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activePage !== nextProps.activePage || this.props.max !== nextProps.max || this.props.count !== nextProps.count) {
      this.setRecordCount(nextProps);
    }
  }

  onPageClick(e) {
    e.preventDefault();
    const getSelectedPage = e.currentTarget.id.split('-', 2);
    const page = getSelectedPage[1];
    this.handlePageSelected(page, e);
  }

  handlePreviousPage(e) {
    if (this.props.activePage > 1) {
      this.handlePageSelected(this.props.activePage - 1, e);
    }
  }

  handleNextPage(e) {
    if (this.props.activePage < this.props.pages) {
      this.handlePageSelected(this.props.activePage + 1, e);
    }
  }

  handlePageSelected(sel, e) {
    e.preventDefault();
    const selected = parseInt(sel);

    if (this.props.activePage !== selected) {
      const resource = this.props.resource;
      const search = { ...resource.search
      };
      search.page = selected;
      const endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
      this.props.getAPI(this.props.name, endpoint, search, this.props.callback, true, this.props.customName || null);
    }
  }

  pagination() {
    const items = [];
    const activePage = this.props.activePage;
    const pageRange = this.props.pageRange;
    const marginPages = this.props.marginPages;
    let pages = this.props.pages;
    let id, page, breakView;

    if (this.props.pages <= pageRange) {
      for (let i = 1; i <= pages; i++) {
        id = 'page-' + i;
        page = /*#__PURE__*/React.createElement("li", {
          key: id,
          id: id,
          onClick: e => this.onPageClick(e),
          className: `${this.props.pageClassName} ${activePage === i ? this.props.activeClassName : ''}`
        }, i);
        items.push(page);
      }
    } else {
      let leftSide = pageRange / 2;
      let rightSide = pageRange / 2;

      if (activePage > pages - pageRange / 2) {
        rightSide = pages - activePage;
        leftSide = pageRange - rightSide;
      } else if (activePage < pageRange / 2) {
        leftSide = activePage;
        rightSide = pageRange - leftSide;
      }

      for (let i = 1; i <= pages; i++) {
        id = 'page-' + i;
        page = /*#__PURE__*/React.createElement("li", {
          key: id,
          id: id,
          onClick: e => this.onPageClick(e),
          className: `${this.props.pageClassName} ${activePage === i ? this.props.activeClassName : ''}`
        }, i);

        if (i <= marginPages) {
          items.push(page);
          continue;
        }

        if (i > pages - marginPages) {
          items.push(page);
          continue;
        }

        if (i >= activePage - leftSide && i <= activePage + rightSide) {
          items.push(page);
          continue;
        }

        let keys = Object.keys(items);
        let breakLabelKey = keys[keys.length - 1];
        let breakLabelValue = items[breakLabelKey];

        if (breakLabelValue !== breakView) {
          var breakId = breakId === 'leftSide' ? breakId = 'rightSide' : 'leftSide';
          breakView = /*#__PURE__*/React.createElement("li", {
            onClick: breakId === 'leftSide' ? e => this.handlePreviousPage(e) : e => this.handleNextPage(e),
            id: breakId,
            key: `breakView-${i}`,
            className: this.props.breakClassName
          }, this.props.breakLabel);
          items.push(breakView);
        }
      }
    }

    return items;
  }

  setRecordCount(props) {
    const count = props.count;
    const max = props.max;
    const page = props.activePage;
    let range2 = 1;
    let range1 = 1;

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

  render() {
    const {
      align,
      count,
      pages,
      activePage,
      containerClassName,
      previousClassName,
      nextClassName,
      disabledClassName,
      iconPrevious,
      iconNext
    } = this.props;
    const {
      range1,
      range2
    } = this.state;

    if (!parseInt(count)) {
      return /*#__PURE__*/React.createElement("div", null);
    }

    return /*#__PURE__*/React.createElement("div", {
      className: `paginate ${align}`
    }, count && /*#__PURE__*/React.createElement("div", {
      className: "recordCount"
    }, /*#__PURE__*/React.createElement("span", null, "Showing ", range1, "-", range2, " of ", count)), pages > 1 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
      className: containerClassName
    }, /*#__PURE__*/React.createElement("li", {
      onClick: e => this.handlePreviousPage(e),
      className: `page ${previousClassName} ${activePage <= 1 ? disabledClassName : ''}`
    }, iconPrevious), this.pagination(), /*#__PURE__*/React.createElement("li", {
      onClick: e => this.handleNextPage(e),
      className: `page ${nextClassName} ${activePage >= pages ? disabledClassName : ''}`
    }, iconNext))) : /*#__PURE__*/React.createElement("div", null));
  }

}

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
  iconPrevious: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-arrow-left"
  }),
  iconNext: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-arrow-right"
  }),
  nextClassName: 'next',
  disabledClassName: 'disabled',
  callback: null
};

function mapStateToProps(state, props) {
  const resource = state.resource[props.customName || props.name] ? state.resource[props.customName || props.name] : {};
  let count, max, pages, activePage;

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
  getAPI
})(Paginate);