import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getResource, reloadResource, util, Table } from '../lib';

class ItemsList extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.listResource, {id: ['org']});
  }

  formatTableData(data, match) {
    const fdata = {};
    const headers = [];
    const rows = [];
    //let footer = [];

    headers.push(
      { name: 'Since', width: '10%', sort: 'createdAt' },
      { name: 'Account Name', width: '30%', sort: 'name' },
      { name: 'Account Number', width: '15%', sort: 'last4' },
      { name: 'Routing #', width: '15%', sort: 'routingNumber' },
      { name: '', width: '10%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(data)) {
      data.forEach(function(value, key) {
        const createdAt = util.getDate(value.createdAt, 'MM/DD/YYYY');
        const accountNumber = `xxxxxxx${value.last4}`;
        rows.push([createdAt, value.name, accountNumber, value.routingNumber, <ActionsMenu match={match} id={value.ID} />]);
      });
    }
    fdata.rows = rows;

    /*
    footer.push(
      { name: <div style={{textAlign: 'right'}}>Totals</div>, colspan: 3 },
      { name: '$1,123.42', colspan: 1}
    );
    fdata.footer = footer;
    */
    return fdata;
  }

  render() {

    const {
      routeProps,
      listResource,
      list
    } = this.props;

    return (
      <div>
        {this.props.isFetching && this.props.loader(`Loading data`)}
        <Table name={listResource} data={() => this.formatTableData(list, routeProps.match)} />
      </div>
    )
  }
}

ItemsList.defaultProps = {
  listResource: 'bankAccounts'
}

function mapStateToProps(state, props) {
  return {
    list: state.resource.bankAccounts ? state.resource.bankAccounts.data : {},
    isFetching: state.resource.isFetching
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource
})(ItemsList);


const ActionsMenu = ({ match, id }) => {

  return (
    <ul>
      <li><Link to={`${match.url}/${id}/edit`}>Edit</Link></li>
      <li><Link to={`${match.url}/${id}/delete`}>Delete</Link></li>
      <li><Link to={`${match.url}/${id}/detail`}>Detail</Link></li>
    </ul>
  )
};
