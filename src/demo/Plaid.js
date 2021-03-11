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
    this.state = {
      linkToken: null
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

  accessToken(publicToken) {
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
