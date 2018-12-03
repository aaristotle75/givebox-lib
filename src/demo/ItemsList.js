import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getResource, reloadResource, util, Table, ModalRoute, ModalLink, ActionsMenu } from '../lib';

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
      loadComponent,
      resourceName
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

        // Actions Menu Options
        const modalID = `${resourceName}-delete-${value.ID}`;
        const desc= `Bank account ${value.name} (xxxxxx${value.last4})`;
        const options = [];
        options.push(<Link to={`${routeProps.match.url}/${value.ID}/edit`}>Edit</Link>);
        options.push(
          <div>
            <ModalRoute  id={modalID} component={() => loadComponent('modal/lib/common/Delete', { useProjectRoot: false, props: { id: value.ID, resource: 'orgBankAccount', desc: desc, modalID: modalID, match: routeProps.match } })} effect='3DFlipVert' style={{ width: '50%' }} />
            <ModalLink id={modalID}>Delete</ModalLink>
          </div>
        );
        options.push(<Link to={`${routeProps.match.url}/${value.ID}/detail`}>Detail</Link>);

        rows.push([
          createdAt,
          value.name,
          accountNumber,
          value.routingNumber,
          value.kind,
          <ActionsMenu
            options={options}
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
        <Table
          name={resourceName}
          data={() => this.formatTableData()}
          exportDisplay='None'
        />
      </div>
    )
  }
}

ItemsList.defaultProps = {
  resourceName: 'orgBankAccounts'
}

function mapStateToProps(state, props) {

  return {
    data: state.resource.orgBankAccounts ? state.resource.orgBankAccounts.data : {},
    isFetching: state.resource.isFetching
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource
})(ItemsList);
