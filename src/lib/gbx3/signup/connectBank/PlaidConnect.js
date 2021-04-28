import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../../common/Loader';
import * as util from '../../../common/utility';
import { PlaidLink } from 'react-plaid-link';
import {
  getLinkToken,
  accessToken
} from '../../redux/merchantActions';

class PlaidConnect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (!this.props.hasPlaidToken) {
      this.props.getLinkToken();
    }
  }

  render() {

    const {
      linkToken,
      hasPlaidToken
    } = this.props;

    if (!linkToken && !hasPlaidToken) return <Loader msg='Getting Plaid Token...' />;

    return (
      <div>
        <PlaidLink
          className='button'
          style={{
            padding: null,
            outline: null,
            background: null,
            border: null,
            borderRadius: null
          }}
          token={linkToken}
          onSuccess={this.props.accessToken}
          onExit={(token, metaData) => {
            const status = util.getValue(metaData, 'status');
            if (status === 'institution_not_found') {
              console.log('execute -> institution_not_found - do manual connect bank');
            }
          }}
        >
          <span className='buttonAlignText'>Connect a Bank Account <span className='icon icon-chevron-right'></span></span>
        </PlaidLink>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const hasPlaidToken = util.getValue(state, 'resource.org.data.hasPlaidToken');
  const linkToken = util.getValue(state, 'merchantApp.plaid.linkToken', null);

  return {
    hasPlaidToken,
    linkToken
  }
}

export default connect(mapStateToProps, {
  getLinkToken,
  accessToken
})(PlaidConnect);
