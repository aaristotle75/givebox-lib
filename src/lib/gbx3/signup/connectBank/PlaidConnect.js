import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../../common/Loader';
import * as util from '../../../common/utility';
import { PlaidLink } from 'react-plaid-link';
import {
  getLinkToken,
  accessToken
} from '../../redux/merchantActions';
import {
  checkSignupPhase,
  saveOrg
} from '../../redux/gbx3actions';

class PlaidConnect extends React.Component {

  constructor(props) {
    super(props);
    this.exitPlaid = this.exitPlaid.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    if (!this.props.hasPlaidToken) {
      this.props.getLinkToken();
    }
  }

  async exitPlaid(token, metaData) {
    const status = util.getValue(metaData, 'status');
    if (status === 'institution_not_found') {
      console.log('execute -> institution_not_found - do manual connect bank');
      const updated = await this.props.updateOrgSignup({ signupPhase: 'manualConnect' });
      if (updated) {
        this.props.saveOrg({ orgUpdated: true });
        this.props.checkSignupPhase({
          forceStep: 0,
          openAdmin: true,
          openModal: true
        });
      }
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
          onExit={this.exitPlaid}
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
  accessToken,
  checkSignupPhase,
  saveOrg
})(PlaidConnect);
