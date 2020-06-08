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

class Table extends Component {
  constructor(props) {
    super(props);
    this.renderSearch = this.renderSearch.bind(this);
    this.renderMaxRecords = this.renderMaxRecords.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.renderExport = this.renderExport.bind(this);
    this.sortColumn = this.sortColumn.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.headerResizer();
  }

  sortColumn(sort) {
    if (sort) {
      const resource = this.props.resource;
      const search = { ...resource.search
      };
      search.order = resource.search.order === 'desc' ? 'asc' : 'desc';
      search.sort = sort;
      const endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
      this.props.getAPI(this.props.name, endpoint, search, null, true, this.props.customName || null);
    }
  }

  headerResizer() {
    let thElm;
    let startOffset;
    Array.prototype.forEach.call(document.querySelectorAll('table th'), function (th) {
      th.style.position = 'relative';
      const grip = document.createElement('div');
      grip.innerHTML = '&nbsp;';
      grip.style.top = '0';
      grip.style.right = 0;
      grip.style.bottom = 0;
      grip.style.width = '5px';
      grip.style.position = 'absolute';
      grip.style.cursor = 'col-resize';
      grip.addEventListener('mousedown', function (e) {
        thElm = th;
        const xCord = e.clientX;
        const xPerc = Math.round(xCord / window.innerWidth * 100);
        const offset = Math.round(th.offsetWidth / window.innerWidth * 100);
        startOffset = offset - xPerc;
      });
      th.appendChild(grip);
    });
    document.addEventListener('mousemove', function (e) {
      if (thElm) {
        const xCord = e.clientX;
        const xPerc = Math.round(xCord / window.innerWidth * 100);
        thElm.style.width = startOffset + xPerc + '%';
      }
    });
    document.addEventListener('mouseup', function () {
      thElm = undefined;
    });
  }

  renderSearch() {
    return (/*#__PURE__*/React.createElement(Search, {
        name: this.props.name,
        customName: this.props.customName,
        placeholder: this.props.searchPlaceholder,
        align: this.props.searchAlign,
        style: this.props.searchStyle
      })
    );
  }

  renderMaxRecords(direction) {
    return (/*#__PURE__*/React.createElement(MaxRecords, {
        name: this.props.name,
        customName: this.props.customName,
        style: this.props.maxRecordsStyle,
        textStyle: this.props.maxRecordsTextStyle,
        align: this.props.maxRecordsAlign,
        records: this.props.maxRecords,
        direction: direction
      })
    );
  }

  renderPagination() {
    return (/*#__PURE__*/React.createElement(Paginate, {
        name: this.props.name,
        customName: this.props.customName,
        align: this.props.paginateAlign,
        nextIcon: this.props.nextIcon,
        previousIcon: this.props.previousIcon
      })
    );
  }

  renderExport() {
    return (/*#__PURE__*/React.createElement(Export, {
        name: this.props.name,
        customName: this.props.customName,
        align: this.props.exportAlign,
        desc: this.props.exportDesc
      })
    );
  }

  render() {
    const {
      className,
      searchDisplay,
      exportDisplay,
      maxRecordsDisplay,
      paginationDisplay,
      data,
      sort,
      order,
      name,
      filters,
      iconSortAsc,
      iconSortDesc,
      iconDetailsExpand,
      iconDetailsCollapse,
      detailsTitle,
      showHeader,
      showFooter,
      defaultOpen
    } = this.props;
    const tableData = data();
    const headers = tableData.headers;
    const rows = tableData.rows;
    const footer = tableData.footer;
    return (/*#__PURE__*/React.createElement("div", {
        className: `givebox-lib-table ${className || ''}`
      }, (searchDisplay === 'top' || searchDisplay === 'both') && this.renderSearch(), (exportDisplay === 'top' || exportDisplay === 'both') && this.renderExport(), filters && /*#__PURE__*/React.createElement(Filter, {
        name: name,
        options: filters
      }), (paginationDisplay === 'top' || paginationDisplay === 'both') && this.renderPagination(), (maxRecordsDisplay === 'top' || maxRecordsDisplay === 'both') && this.renderMaxRecords(), /*#__PURE__*/React.createElement("table", {
        style: this.props.tableStyle
      }, showHeader && /*#__PURE__*/React.createElement(TableHead, {
        headers: headers,
        sortColumn: this.sortColumn,
        sort: sort,
        iconSortAsc: iconSortAsc,
        iconSortDesc: iconSortDesc,
        order: order
      }), /*#__PURE__*/React.createElement(TableBody, {
        rows: rows,
        length: headers.length,
        detailsLink: this.detailsLink,
        iconDetailsExpand: iconDetailsExpand,
        iconDetailsCollapse: iconDetailsCollapse,
        detailsTitle: detailsTitle,
        defaultOpen: defaultOpen,
        noRecordsText: this.props.noRecordsText
      }), showFooter && /*#__PURE__*/React.createElement(TableFoot, {
        footer: footer
      })), (searchDisplay === 'bottom' || searchDisplay === 'both') && this.renderSearch(), (exportDisplay === 'bottom' || exportDisplay === 'both') && this.renderExport(), (paginationDisplay === 'bottom' || paginationDisplay === 'both') && this.renderPagination(), (maxRecordsDisplay === 'bottom' || maxRecordsDisplay === 'both') && this.renderMaxRecords('top'))
    );
  }

}

Table.defaultProps = {
  defaultOpen: false,
  showHeader: true,
  showFooter: true,
  searchDisplay: 'none',
  exportDisplay: 'none',
  maxRecordsDisplay: 'bottom',
  paginationDisplay: 'bottom',
  iconSortAsc: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-chevron-up"
  }),
  iconSortDesc: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-chevron-down"
  }),
  iconDetailsExpand: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-plus-circle"
  }),
  iconDetailsCollapse: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-minus-circle"
  }),
  detailsTitle: ''
};

function mapStateToProps(state, props) {
  const resource = state.resource[props.customName || props.name] ? state.resource[props.customName || props.name] : {};
  let sort, order;

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
  getAPI
})(Table);

const TableHead = ({
  headers,
  sortColumn,
  sort,
  order,
  iconSortAsc,
  iconSortDesc
}) => {
  const items = [];

  if (!util.isEmpty(headers)) {
    Object.entries(headers).forEach(([key, value]) => {
      if (value.name === '*details') {
        items.push( /*#__PURE__*/React.createElement("th", {
          key: key,
          style: {
            width: value.width
          }
        }));
      } else {
        items.push( /*#__PURE__*/React.createElement("th", {
          colSpan: value.colspan,
          onClick: () => sortColumn(value.sort),
          className: `${value.sort && 'sort'}`,
          align: value.align || 'left',
          style: {
            width: value.width
          },
          key: key
        }, value.name, " ", value.sort && sort === value.sort ? order === 'desc' ? iconSortDesc : iconSortAsc : ''));
      }
    });
  }

  return (/*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, items))
  );
};

class TableBody extends Component {
  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
    this.detailsLink = this.detailsLink.bind(this);
    this.state = {
      details: []
    };
  }

  componentDidMount() {
    if (this.props.defaultOpen) {
      const id = `0-${this.props.defaultOpen}-details`;
      this.setState({
        details: [id]
      });
    }
  }

  detailsLink(ref) {
    const current = ref.current;
    const selected = current.id;
    const details = this.state.details;
    const index = details.findIndex(function (el) {
      return el === selected;
    });
    if (index === -1) details.push(selected);else details.splice(index, 1);
    this.setState({ ...this.state,
      ...details
    });
  }

  test(ref) {
    console.log('clicked', ref.current.id);
  }

  renderItems() {
    const {
      rows,
      length,
      iconDetailsCollapse,
      iconDetailsExpand,
      detailsTitle
    } = this.props;
    const bindthis = this;
    const items = [];

    if (!util.isEmpty(rows)) {
      Object.entries(rows).forEach(([key, value]) => {
        const td = [];
        const details = [];
        const length = value.length;
        const passkey = key;
        let options = {};
        let ref, id;
        value.forEach((value, key) => {
          if (has(value, 'details')) {
            if (!has(value, 'key')) console.error('Add a key property for proper handling');
            id = `${passkey}-${value.key}-details`;
            ref = /*#__PURE__*/React.createRef();
            const icon = bindthis.state.details.includes(id) ? iconDetailsCollapse : iconDetailsExpand;
            td.push( /*#__PURE__*/React.createElement("td", {
              onClick: () => ref ? bindthis.detailsLink(ref) : '',
              className: 'detailsIcon hasDetails',
              key: key
            }, icon));
            details.push( /*#__PURE__*/React.createElement("tr", {
              ref: ref,
              className: `${bindthis.state.details.includes(id) ? 'detailsOpen' : ''} detailsRow`,
              id: id,
              key: id
            }, /*#__PURE__*/React.createElement("td", {
              className: "detailsRow",
              colSpan: length
            }, /*#__PURE__*/React.createElement(AnimateHeight, {
              duration: 500,
              height: bindthis.state.details.includes(id) ? 'auto' : 0
            }, /*#__PURE__*/React.createElement("div", {
              className: "details",
              style: {
                paddingRight: has(value, 'width') ? value.width : '',
                paddingLeft: has(value, 'width') ? value.width : 0
              }
            }, /*#__PURE__*/React.createElement("div", {
              className: "detailsTitle"
            }, detailsTitle), /*#__PURE__*/React.createElement("div", {
              className: "detailsContent"
            }, value.details))))));
          } else {
            if (has(value, 'options')) {
              options = value.options;
            } else {
              if (has(value, 'actions')) td.push( /*#__PURE__*/React.createElement("td", {
                className: "actionsRow",
                key: key
              }, /*#__PURE__*/React.createElement("span", {
                className: ` ${has(value, 'secondary') && bindthis.state.details.includes(id) ? 'hidden' : ''}`
              }, value.actions)));else td.push( /*#__PURE__*/React.createElement("td", {
                onClick: () => ref ? bindthis.detailsLink(ref) : '',
                className: `${ref ? 'hasDetails' : ''} ${value.primary ? 'primaryRow' : ''}`,
                key: key
              }, /*#__PURE__*/React.createElement("span", {
                className: `${!value.primary && !has(value, 'actions') && !has(value, 'always') && bindthis.state.details.includes(id) ? 'hidden' : ''}`
              }, value.value)));
            }
          }
        });
        const tr = /*#__PURE__*/React.createElement("tr", {
          className: `${bindthis.state.details.includes(id) ? 'detailsOpen' : ''} ${key % 2 === 0 ? '' : 'altRow'} ${options.grayout ? 'grayout' : ''}`,
          key: key
        }, td);
        items.push(tr);
        if (!util.isEmpty(details)) items.push(details);
      });
    } else {
      items.push( /*#__PURE__*/React.createElement("tr", {
        key: 0
      }, /*#__PURE__*/React.createElement("td", {
        className: "noRecordsRow",
        colSpan: length || 1,
        align: "center"
      }, /*#__PURE__*/React.createElement(NoRecords, {
        text: this.props.noRecordsText
      }))));
    }

    return items;
  }

  render() {
    return (/*#__PURE__*/React.createElement("tbody", null, this.renderItems())
    );
  }

}

const TableFoot = ({
  footer
}) => {
  const items = [];

  if (!util.isEmpty(footer)) {
    footer.forEach((value, key) => {
      const item = [];
      Object.entries(value).forEach(([key, value]) => {
        item.push( /*#__PURE__*/React.createElement("td", {
          key: key,
          align: value.align || 'left',
          colSpan: value.colspan || 1
        }, value.value));
      });
      items.push( /*#__PURE__*/React.createElement("tr", {
        key: key
      }, item));
    });
  }

  return (/*#__PURE__*/React.createElement("tfoot", null, items)
  );
};