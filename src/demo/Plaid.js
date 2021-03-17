import React from 'react';
import { connect } from 'react-redux';
import {
  sendResource,
  getResource
} from '../lib/api/helpers';
import GBLink from '../lib/common/GBLink';
import * as util from '../lib/common/utility';
import { PlaidLink } from 'react-plaid-link';

class Plaid extends React.Component {

  constructor(props) {
    super(props);
    this.getLinkToken = this.getLinkToken.bind(this);
    this.accessToken = this.accessToken.bind(this);
    this.auth = this.auth.bind(this);
    this.identity = this.identity.bind(this);
    this.delete = this.delete.bind(this);
    this.accounts = this.accounts.bind(this);
    this.state = {
      linkToken: null,
      account_id: null
    };
  }

  componentDidMount() {
  }

  getLinkToken() {
    this.props.sendResource('plaidLink', {
      method: 'POST',
      callback: (res, err) => {
        if (!util.isEmpty(res) && !err) {
          const linkToken = util.getValue(res, 'linkToken');
          this.setState({ linkToken });
        }
      }
    })
  }

  accessToken(publicToken, metaData) {
    console.log('execute -> ', metaData);
    const account_id = util.getValue(metaData, 'account_id');
    if (localStorage.getItem('account_id')) {
      localStorage.removeItem('account_id');
    }
    if (account_id) localStorage.setItem('account_id', account_id);
    this.setState({ account_id });

    this.props.sendResource('plaidAccess', {
      data: {
        publicToken
      },
      method: 'POST',
      callback: (res, err) => {
        console.log('execute plaidAccess -> ', res, err);
      }
    })
  }

  auth() {
    this.props.getResource('plaidAuth', {
      method: 'GET',
      callback: (res, err) => {
        console.log('execute plaidAuth -> ', res, err);
      }
    })
  }

  identity() {
    this.props.getResource('plaidIdentity', {
      method: 'GET',
      callback: (res, err) => {
        console.log('execute plaidIdentity -> ', res, err);
      }
    })
  }

  accounts() {
    this.props.getResource('plaidAccounts', {
      method: 'GET',
      callback: (res, err) => {
        console.log('execute plaidAccounts -> ', res, err);
      }
    })
  }

  delete() {
    this.props.sendResource('plaidAccess', {
      method: 'DELETE',
      callback: (res, err) => {
        console.log('execute plaidAccess DELETE -> ', res, err);
      }
    })
  }

  render() {

    const {
    } = this.props;

    const {
      linkToken
    } = this.state;

    return (
      <div>
        <h2>Plaid</h2>
        <GBLink onClick={() => this.getLinkToken()}>Create Link Token</GBLink>
        <br /><br />
        { linkToken ?
          <div>
            <PlaidLink
              token={linkToken}
              onSuccess={this.accessToken}
            >
              Connect a bank account
            </PlaidLink>
          </div>
        : null }
        <GBLink onClick={() => this.auth()}>Get AUTH</GBLink>
        <br /><br />
        <GBLink onClick={() => this.identity()}>Get Identity</GBLink>
        <br /><br />
        <GBLink onClick={() => this.accounts()}>Get Accounts</GBLink>
        <br /><br />
        <GBLink onClick={() => this.delete()}>Delete Token</GBLink>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  sendResource,
  getResource
})(Plaid);
