import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getResource, reloadResource, util, Table, ModalRoute, ModalLink } from '../lib';

class ItemsList extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.resourceName);
  }

  formatTableData() {
    const {
      data,
      routeProps,
      loadComponent
    } = this.props;

    const fdata = {};
    const headers = [];
    const rows = [];
    //let footer = [];

    headers.push(
      { name: 'Since', width: '10%', sort: 'createdAt' },
      { name: 'Account Name', width: '30%', sort: 'name' },
      { name: 'Account Number', width: '15%', sort: 'last4' },
      { name: 'Routing #', width: '15%', sort: 'routingNumber' },
      { name: 'Kind', width: '10%', sort: 'kind' },
      { name: '', width: '10%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(data)) {
      data.forEach(function(value, key) {
        const createdAt = util.getDate(value.createdAt, 'MM/DD/YYYY');
        const accountNumber = `xxxxxxx${value.last4}`;
        rows.push([
          createdAt,
          value.name,
          accountNumber,
          value.routingNumber,
          value.kind,
          <ActionsMenu
            loadComponent={loadComponent}
            match={routeProps.match}
            id={value.ID}
            desc={`Bank account ${value.name} (xxxxxx${value.last4})`}
          />
        ]);
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
      resourceName
    } = this.props;

    return (
      <div>
        {this.props.isFetching && this.props.loader(`Loading data`)}
        <Link to="/list/new/add">New Item</Link>
        <Table name={resourceName} data={() => this.formatTableData()} />
      </div>
    )
  }
}

ItemsList.defaultProps = {
  resourceName: 'bankAccounts'
}

function mapStateToProps(state, props) {
  return {
    data: state.resource.bankAccounts ? state.resource.bankAccounts.data : {},
    isFetching: state.resource.isFetching
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource
})(ItemsList);


const ActionsMenu = (props) => {

  const {
    match,
    id,
    loadComponent,
    desc
  } = props;

  const modalID = `bankaccount-delete-${id}`;

  return (
    <ul>
      <li><Link to={`${match.url}/${id}/edit`}>Edit</Link></li>
      <li>
        <ModalRoute  id={modalID} component={() => loadComponent('modal/lib/common/Delete', { useProjectRoot: false, props: { id, resource: 'bankAccount', desc: desc, modalID: modalID, match: match } })} effect='3DFlipVert' style={{ width: '50%' }} />
        <ModalLink id={modalID}>Delete</ModalLink>
      </li>
      <li><Link to={`${match.url}/${id}/detail`}>Detail</Link></li>
    </ul>
  )
};
