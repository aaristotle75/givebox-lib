import React, {Component} from 'react';
import { connect } from 'react-redux';
import Paginate from './Paginate';
import MaxRecords from './MaxRecords';
import Search from './Search';
import NoRecords from './NoRecords';
import ExportLink from './ExportLink';
import { util } from '../';
import { getAPI } from '../redux/actions';
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
    const resource = this.props.resource;
    const currentOrder = resource.search.order;
    const order = currentOrder === 'desc' ? 'asc' : 'desc';
    const sortToReplace = 'sort=' + util.translateSort(currentOrder) + resource.search.sort;
    const replaceSort = 'sort=' + util.translateSort(order) + sort;
    const endpoint = resource.endpoint.replace(sortToReplace, replaceSort);
    const search = Object.assign(resource.search, { sort: sort, order: order });
		this.props.getAPI(this.props.name, endpoint, search, null, true);
    }
    return;
  }

  headerResizer() {
    let thElm;
    let startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll('table th'),
      function (th) {
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
            const xPerc = Math.round((xCord/window.innerWidth)*100);
            const offset = Math.round((th.offsetWidth/window.innerWidth)*100);
            startOffset = offset - xPerc;
        });

        th.appendChild(grip);
      });

    document.addEventListener('mousemove', function (e) {
      if (thElm) {
        const xCord = e.clientX;
        const xPerc = Math.round((xCord/window.innerWidth)*100);
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

    const tableData = data();
    const headers = tableData.headers;
    const rows = tableData.rows;
    const footer = tableData.footer;

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

  const resource = state.resource[props.name] ? state.resource[props.name] : {};
  let sort, order;
  if (!util.isLoading(resource)) {
    sort = has(resource.search, 'sort') ? resource.search.sort : '';
    order = has(resource.search, 'order') ? resource.search.order : '';
  }

  return {
    resource: resource,
    sort: sort,
    order: order
  }
}

export default connect(mapStateToProps, {
  getAPI
})(Table)


const TableHead = ({ headers, sortColumn, sort, order }) => {
  const desc = <span className='icon icon-triangle-down'></span>;
  const asc = <span className='icon icon-triangle-up'></span>;
  const items = [];
  if (!util.isEmpty(headers)) {
    Object.keys(headers).forEach(function(key) {
      items.push(
        <th onClick={() => sortColumn(headers[key].sort)} className={`${headers[key].sort && 'sort'}`} align={headers[key].align || 'left'} style={{width: headers[key].width}} key={key}>{headers[key].name} {sort === headers[key].sort ? order === 'desc' ? desc : asc : ''}</th>
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
  const items = [];
  if (!util.isEmpty(rows)) {
    Object.entries(rows).forEach(([key, value]) => {
      let td = [];
      value.forEach((value, key) => {
        td.push(<td key={key}>{value}</td>);
      });
      let tr = <tr key={key}>{td}</tr>;
      items.push(tr);
    });
  } else {
    items.push(
      <tr key={0}><td colSpan={length || 1} align='center'><NoRecords /></td></tr>
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
    Object.entries(footer).forEach(([key, value]) => {
      items.push(
        <td key={key} align={value.align || 'left'} colSpan={value.colspan || 1}>{value.name}</td>
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
