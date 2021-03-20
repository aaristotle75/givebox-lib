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
    this.extractInfo = this.extractInfo.bind(this);
    this.state = {
      linkToken: null,
      account_id: null
    };
    this.bankAccount = {
      kind: 'deposit',
      metaData: {
        plaid: null
      }
    };
    this.principal = {};
    this.legalEntity = {};
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
        this.extractInfo(res, { type: 'account' });
      }
    })
  }

  identity() {
    this.props.getResource('plaidIdentity', {
      method: 'GET',
      callback: (res, err) => {
        this.extractInfo(res, { type: 'identity' });
      }
    })
  }

  accounts() {
    this.props.getResource('plaidAccounts', {
      method: 'GET',
      callback: (res, err) => {
        this.extractInfo(res, { type: 'account' });
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

  extractInfo(res, options = {}) {
    const opts = {
      type: 'account', // account, identity
      ...options
    };

    const account_id = localStorage.getItem('account_id');
    const data = util.getValue(res, 'data', {});

    switch (opts.type) {
      case 'account': {
        return this.extractAccountInfo(account_id, data);
      }

      case 'identity': {
        return this.extractIdentityInfo(account_id, data);
      }

      // no default
    }

    console.error('Error no account_id, data or type defined');
    console.error('account_id: ', account_id);
    console.error('data: ', data);
    console.error('type: ', opts.type);
    return false;
  }

  extractAccountInfo(account_id, data) {
    console.log('execute extractAccountInfo -> ', account_id, data);
    const accounts = util.getValue(data, 'accounts', []);
    const ach = util.getValue(data, 'numbers.ach', []);
    const account = accounts.find(a => a.account_id === account_id);
    const bankInfo = ach.find(a => a.account_id === account_id);

    this.bankAccount.name = util.getValue(account, 'name');
    this.bankAccount.number = util.getValue(bankInfo, 'account');
    this.bankAccount.routingNumber = util.getValue(bankInfo, 'routing');
    this.bankAccount.accountType = util.getValue(account, 'subtype');
    this.bankAccount.metaData.plaid = data;

    console.log('execute this.bankAccount => ', this.bankAccount);
  }

  extractIdentityInfo(account_id, data) {
    console.log('execute extractIdentityInfo -> ', account_id, data);
    const accounts = util.getValue(data, 'accounts', []);
    const account = accounts.find(a => a.account_id === account_id);
    const owners = util.getValue(account, 'owners', []);
    const owner = util.getValue(owners, 0, {});
    const addresses = util.getValue(owner, 'addresses', []);
    const address = util.getValue(addresses, 0, {});
    const names = util.getValue(owner, 'names', []);
    const name = util.getValue(names, 0);
    const emails = util.getValue(owner, 'emails', []);
    const phone_numbers = util.getValue(owner, 'phone_numbers', []);

    console.log('execute owner -> ', owner, address, name, emails, phone_numbers);
    const info = {};
    return info;
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
