import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../../common/Loader';
import GBLink from '../../../common/GBLink';
import * as util from '../../../common/utility';
import { PlaidLink } from 'react-plaid-link';
import {
  getLinkToken,
  accessToken,
  getPlaidInfo,
  setMerchantApp
} from '../../redux/merchantActions';
import {
  getSignupStep,
  checkSignupPhase,
  saveOrg
} from '../../redux/gbx3actions';

class PlaidConnect extends React.Component {

  constructor(props) {
    super(props);
    this.exitPlaid = this.exitPlaid.bind(this);
    this.alreadyHasPlaidToken = this.alreadyHasPlaidToken.bind(this);
    this.savePlaidInfoCallback = this.savePlaidInfoCallback.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    if (!this.props.hasPlaidToken) {
      this.props.getLinkToken();
    }
  }

  async savePlaidInfoCallback(message, slug = 'addBank') {

    const {
      extractAuth,
      extractIdentity
    } = this.props;

    switch (message) {
      case 'error': {
        const updated = await this.props.updateOrgSignup({ signupPhase: 'manualConnect' });
        if (updated) {
          const forceStep = this.props.getSignupStep(slug, 'manualConnect');
          //this.props.saveOrg({ orgUpdated: true });
          this.props.checkSignupPhase({
            forceStep,
            openAdmin: true,
            openModal: true
          });
          this.props.formProp({ error: true, errorMsg: 'We are unable to connect your bank account through Plaid. Please manually connect your bank account.' });
        }
        this.props.setMerchantApp('connectLoader', false);
        break;
      }

      case 'success': {
        this.props.checkConnectStatus();
        break;
      }

      // no default
    }
  }

  alreadyHasPlaidToken() {
    this.props.getPlaidInfo(this.savePlaidInfoCallback);
  }

  async exitPlaid(token, metaData, test = false) {
    const status = util.getValue(metaData, 'status');
    if (status === 'institution_not_found' || test) {
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

    const plaidButtonText =
      <span className='buttonAlignText'>Quick Connect with Plaid</span>
    ;

    return (
      <div>
        {/* <GBLink onClick={() => this.exitPlaid(null, null, true)}>Test Manual</GBLink> */}
        { hasPlaidToken ?
          <GBLink
            onClick={this.alreadyHasPlaidToken}
            className={this.props.className}
          >
            {plaidButtonText}
          </GBLink>
        :
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
            onSuccess={(token, meta) => this.props.accessToken(token, meta, {
              callback: this.savePlaidInfoCallback
            })}
            onExit={this.exitPlaid}
          >
            {plaidButtonText}
          </PlaidLink>
        }
      </div>
    )
  }
}

PlaidConnect.defaultProps = {
  className: 'button'
};

function mapStateToProps(state, props) {

  const hasPlaidToken = util.getValue(state, 'resource.gbx3Org.data.hasPlaidToken');
  const linkToken = util.getValue(state, 'merchantApp.plaid.linkToken', null);
  const connectLoader = util.getValue(state, 'merchantApp.connectLoader', false);
  const merchantApp = util.getValue(state, 'merchantApp', {});
  const extractAuth = util.getValue(merchantApp, 'extractAuth', {});
  const extractIdentity = util.getValue(merchantApp, 'extractIdentity', {});

  return {
    hasPlaidToken,
    linkToken,
    connectLoader,
    extractAuth,
    extractIdentity
  }
}

export default connect(mapStateToProps, {
  getLinkToken,
  accessToken,
  getPlaidInfo,
  setMerchantApp,
  getSignupStep,
  checkSignupPhase,
  saveOrg
})(PlaidConnect);
