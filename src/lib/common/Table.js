import React, {Component} from 'react';
import { connect } from 'react-redux';
import Paginate from "./Paginate";
import MaxRecords from "./MaxRecords";
import Search from "./Search";
import NoRecords from "./NoRecords";
import ExportLink from "./ExportLink";
import { util } from '../';
import { getAPI } from '../actions/actions';
import has from 'has';

class Table extends Component {

  constructor(props) {
    super(props);
    this.renderSearch = this.renderSearch.bind(this);
    this.renderMaxRecords = this.renderMaxRecords.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.renderExport = this.renderExport.bind(this);
    this.sortColumn = this.sortColumn.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.headerResizer();
  }

  sortColumn(sort) {
    if (sort) {
    var resource = this.props.resource;
    var currentOrder = resource.search.order;
    var order = currentOrder === 'desc' ? 'asc' : 'desc';
    var sortToReplace = 'sort=' + util.translateSort(currentOrder) + resource.search.sort;
    var replaceSort = 'sort=' + util.translateSort(order) + sort;
    var endpoint = resource.endpoint.replace(sortToReplace, replaceSort);
    var search = Object.assign(resource.search, {sort: sort, order: order});
		this.props.getAPI(this.props.name, endpoint, search, null, true);
    }
    return;
  }

  headerResizer() {
    var thElm;
    var startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll("table th"),
      function (th) {
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
            let xCord = e.clientX;
            let xPerc = Math.round((xCord/window.innerWidth)*100);
            let offset = Math.round((th.offsetWidth/window.innerWidth)*100);
            startOffset = offset - xPerc;
        });

        th.appendChild(grip);
      });

    document.addEventListener('mousemove', function (e) {
      if (thElm) {
        let xCord = e.clientX;
        let xPerc = Math.round((xCord/window.innerWidth)*100);
        thElm.style.width = startOffset + xPerc + '%';
      }
    });

    document.addEventListener('mouseup', function () {
        thElm = undefined;
    });
  }

  renderSearch() {
    return (
      <Search
        name={this.props.name}
        placeholder={this.props.searchPlaceholder}
        align={this.props.searchAlign}
        style={this.props.searchStyle}
      />
    )
  }

  renderMaxRecords() {
    return (
      <MaxRecords
        name={this.props.name}
        style={this.props.maxRecordsStyle}
        textStyle={this.props.maxRecordsTextStyle}
        align={this.props.maxRecordsAlign}
        records={this.props.maxRecords}
      />
    )
  }

  renderPagination() {
    return (
      <Paginate
        name={this.props.name}
        align={this.props.paginateAlign}
      />
    );
  }

  renderExport() {
    return (
      <ExportLink
        name={this.props.name}
        align={this.props.exportAlign}
      />
    );
  }

  render() {

    const {
      className,
      searchAbove,
      searchBelow,
      exportAbove,
      exportBelow,
      maxRecordsAbove,
      maxRecordsBelow,
      paginationAbove,
      paginationBelow,
      data,
      sort,
      order

    } = this.props;

    /*
    if (!search.sort || !seach.order) {
      return ( <div></div> );
    }
    */

    let tableData = data();
    let headers = tableData.headers;
    let rows = tableData.rows;
    let footer = tableData.footer;

    return (
      <div className={className}>
        {searchAbove && this.renderSearch()}
        {exportAbove && this.renderExport()}
        {maxRecordsAbove && this.renderMaxRecords()}
        {paginationAbove && this.renderPagination()}
        <table style={this.props.tableStyle}>
          <TableHead headers={headers} sortColumn={this.sortColumn} sort={sort} order={order} />
          <TableBody rows={rows} length={headers.length} />
          <TableFoot footer={footer} />
        </table>
        {searchBelow && this.renderSearch()}
        {exportBelow && this.renderExport()}
        {maxRecordsBelow && this.renderMaxRecords()}
        {paginationBelow && this.renderPagination()}
      </div>
    )
  }
}

Table.defaultProps = {
  searchAbove: true,
  searchBelow: false,
  paginationAbove: true,
  paginationBelow: true,
  maxRecordsAbove: true,
  maxRecordsBelow: true,
  exportAbove: true,
  exportBelow: false
}

function mapStateToProps(state, props) {

	let resource = state.resource[props.name] ? state.resource[props.name] : {};
  let endpoint, sort, order;
  if (!util.isLoading(resource)) {
    sort = has(resource.search, 'sort') ? resource.search.sort : '';
    order = has(resource.search, 'order') ? resource.search.order : '';
  }

  return {
    resource: resource,
    endpoint: endpoint,
    sort: sort,
    order: order
  }
}

export default connect(mapStateToProps, {
	getAPI
})(Table)


const TableHead = ({ headers, sortColumn, sort, order }) => {
  let desc = <span className="icon icon-triangle-down"></span>;
  let asc = <span className="icon icon-triangle-up"></span>;
  let items = [];
  if (!util.isEmpty(headers)) {
    Object.keys(headers).forEach(function(key) {
      items.push(
        <th onClick={() => sortColumn(headers[key].sort)} className={`${headers[key].sort && 'sort'}`} align={headers[key].align || "left"} style={{width: headers[key].width}} key={key}>{headers[key].name} {sort === headers[key].sort ? order === 'desc' ? desc : asc : ''}</th>
      );
    });
  }
  return (
    <thead>
      <tr>
        {items}
      </tr>
    </thead>
  );
}

const TableBody = ({ rows, length }) => {
  let items = [];
  if (!util.isEmpty(rows)) {
    Object.keys(rows).forEach(function(key) {
      var td = [];
      for (let i=0; i<rows[key].length; i++) {
        td.push(<td key={i}>{rows[key][i]}</td>);
      }
      var tr = <tr key={key}>{td}</tr>;
      items.push(tr);
    });
  } else {
    items.push(
      <tr key={0}><td colSpan={length || 1} align="center"><NoRecords /></td></tr>
    );
  }
  return (
    <tbody>
      {items}
    </tbody>
  );
}

const TableFoot = ({ footer }) => {
  let items = [];
  if (!util.isEmpty(footer)) {
    Object.keys(footer).forEach(function(key) {
      items.push(
        <td key={key} align={footer[key].align || "left"} colSpan={footer[key].colspan || 1}>{footer[key].name}</td>
      );
    });
  }
  return (
    <tfoot>
      <tr>
        {items}
      </tr>
    </tfoot>
  )
}
