import React, {Component} from 'react';
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
    this.state = {
    };
  }

  componentDidMount() {
    this.headerResizer();
  }

  sortColumn(sort) {
    if (sort) {
      const resource = this.props.resource;
      const search = { ...resource.search };
      search.order = resource.search.order === 'desc' ? 'asc' : 'desc';
      search.sort = sort;
      const endpoint = resource.endpoint.split('?')[0] + util.makeAPIQuery(search);
  		this.props.getAPI(this.props.name, endpoint, search, null, true);
    }
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
      <Export
        name={this.props.name}
        align={this.props.exportAlign}
        desc={this.props.exportDesc}
      />
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
      filters
    } = this.props;

    const tableData = data();
    const headers = tableData.headers;
    const rows = tableData.rows;
    const footer = tableData.footer;

    return (
      <div className={className}>
        {(searchDisplay === 'top' || searchDisplay === 'both') && this.renderSearch()}
        {(exportDisplay === 'top' || exportDisplay === 'both') &&  this.renderExport()}
        {filters && <Filter
          name={name}
          options={filters}
        />}
        {(maxRecordsDisplay === 'top' || maxRecordsDisplay === 'both') && this.renderMaxRecords()}
        {(paginationDisplay === 'top' || paginationDisplay === 'both') && this.renderPagination()}
        <table style={this.props.tableStyle}>
          <TableHead headers={headers} sortColumn={this.sortColumn} sort={sort} order={order} />
          <TableBody rows={rows} length={headers.length} detailsLink={this.detailsLink} />
          <TableFoot footer={footer} />
        </table>
        {(searchDisplay === 'bottom' || searchDisplay === 'both') && this.renderSearch()}
        {(exportDisplay === 'bottom' || exportDisplay === 'both') &&  this.renderExport()}
        {(maxRecordsDisplay === 'bottom' || maxRecordsDisplay === 'both') && this.renderMaxRecords()}
        {(paginationDisplay === 'bottom' || paginationDisplay === 'both') && this.renderPagination()}
      </div>
    )
  }
}

Table.defaultProps = {
  searchDisplay: 'top',
  exportDisplay: 'top',
  maxRecordsDisplay: 'top',
  paginationDisplay: 'bottom'
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
    Object.entries(headers).forEach(([key, value]) => {
      if (value.name === '*details') {
        items.push(<th key={key} style={{width: value.width}}></th>);
      } else {
        items.push(
          <th onClick={() => sortColumn(value.sort)} className={`${value.sort && 'sort'}`} align={value.align || 'left'} style={{width: value.width}} key={key}>{value.name} {sort === value.sort ? order === 'desc' ? desc : asc : ''}</th>
        );
      }
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

class TableBody extends Component {

  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
    this.detailsLink = this.detailsLink.bind(this);
    this.state = {
      details: []
    }
  }

  detailsLink(ref) {
    const current = ref.current;
    const selected = current.id;
    const details = this.state.details;
    const index = details.findIndex(function(el) {
      return el === selected;
    });
    if (index === -1) details.push(selected);
    else details.splice(index, 1);
    this.setState({ ...this.state, ...details });
  }

  renderItems() {
    const {
      rows,
      length
    } = this.props;

    const bindthis = this;
    const items = [];

    if (!util.isEmpty(rows)) {
      Object.entries(rows).forEach(([key, value]) => {
        const td = [];
        const details = [];
        const length = value.length;
        const passkey = key;
        value.forEach((value, key) => {
          if (has(value, 'details')) {
            if (!has(value, 'key')) console.error('Add a key property for proper handling');
            const id = `${passkey}-${value.key}-details`;
            const ref = React.createRef();
            const link = <button id={id} onClick={() => bindthis.detailsLink(ref)} className='link'><span className={`icon ${bindthis.state.details.includes(id) ? 'icon-minus-circle-fill' : 'icon-plus-circle-fill'}`}></span></button>;
            td.push(<td key={key}>{link}</td>);
            details.push(
              <tr ref={ref} className={`detailsRow`} id={id} key={id}>
                <td colSpan={length}>
                  <AnimateHeight
                    duration={500}
                    height={bindthis.state.details.includes(id) ? 'auto' : 0}
                  >
                    <div className="details" style={{paddingRight: has(value, 'width') ? value.width : '', paddingLeft: has(value, 'width') ? value.width : 0}}>
                      <div className="detailsTitle">Details</div>
                      <div className="detailsContent">{value.details}</div>
                    </div>
                  </AnimateHeight>
                </td>
              </tr>
            );
          } else {
            td.push(<td key={key}>{value}</td>);
          }
        });
        const tr = <tr className={`${key%2===0 ? '' : 'altRow'}`} key={key}>{td}</tr>;
        items.push(tr);
        if (!util.isEmpty(details)) items.push(details);

      });
    } else {
      items.push(
        <tr key={0}><td colSpan={length || 1} align='center'><NoRecords /></td></tr>
      );
    }

    return items;
  }

  render() {
    return (
      <tbody>
        {this.renderItems()}
      </tbody>
    )
  }

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
