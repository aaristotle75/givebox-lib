import React from 'react';
import { connect } from 'react-redux';
import {
  sendResource,
  getResource
} from '../lib/api/helpers';
import GBLink from '../lib/common/GBLink';

class Plaid extends React.Component {

  constructor(props) {
    super(props);
    this.linkToken = this.linkToken.bind(this);
    this.accessToken = this.accessToken.bind(this);
    this.auth = this.auth.bind(this);
    this.identity = this.identity.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  linkToken() {
    this.props.sendResource('plaidLink', {
      method: 'POST',
      callback: (res, err) => {
        console.log('execute plaidLink -> ', res, err);
      }
    })
  }

  accessToken() {
    this.props.sendResource('plaidAccess', {
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

  render() {

    const {
    } = this.props;

    return (
      <div>
        <h2>Plaid</h2>
        <GBLink onClick={() => this.linkToken()}>Create Link Token</GBLink>
        <br /><br />
        <GBLink onClick={() => this.accessToken()}>Create Access Token</GBLink>
        <br /><br />
        <GBLink onClick={() => this.auth()}>Get AUTH</GBLink>
        <br /><br />
        <GBLink onClick={() => this.identity()}>Get Identity</GBLink>
        <br /><br />
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
