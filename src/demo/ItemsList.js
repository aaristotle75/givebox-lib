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
    let fdata = {};
    let headers = [];
    let rows = [];
    //let footer = [];

    headers.push(
      { name: 'Since', width: '10%', sort: 'createdAt' },
      { name: 'First Name', width: '15%', sort: 'firstName' },
      { name: 'Last Name', width: '15%', sort: 'lastName' },
      { name: 'Email', width: '30%', sort: 'email' },
      { name: '', width: '10%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(data)) {
      data.forEach(function(value, key) {
        let createdAt = util.getDate(value.createdAt, 'MM/DD/YYYY');
        rows.push([createdAt, value.firstName, value.lastName, value.email ? value.email : 'n/a', <ActionsMenu match={match} id={value.ID} />]);
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
        {this.props.isFetching && this.props.loader(`Loading Customers data`)}
        <Table name={listResource} data={() => this.formatTableData(list, routeProps.match)} />
      </div>
    )
  }
}

ItemsList.defaultProps = {
  listResource: 'orgCustomers'
}

function mapStateToProps(state, props) {
  return {
    list: state.resource.orgCustomers ? state.resource.orgCustomers.data : {},
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
