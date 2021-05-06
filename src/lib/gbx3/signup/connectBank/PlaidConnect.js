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
        const forceStep = this.props.getSignupStep(slug, 'manualConnect');
        const updated = await this.props.updateOrgSignup({ signupPhase: 'manualConnect' });
        if (updated) {
          //this.props.saveOrg({ orgUpdated: true });
          this.props.checkSignupPhase({
            forceStep,
            openAdmin: true,
            openModal: true
          });
          this.props.formProp({ error: true, errorMsg: 'We are unable to connect your bank account. Please manually enter your information in the following steps.' });
        }
        break;
      }

      case 'success': {
        this.props.checkConnectStatus();
        break;
      }

      // no default
    }
    this.props.setMerchantApp('gettingInfoFromPlaid', false);
    this.props.setMerchantApp('savingInfoFromPlaid', false);
  }

  alreadyHasPlaidToken() {
    console.log('execute alreadyHasPlaidToken');
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
      hasPlaidToken,
      gettingInfoFromPlaid,
      savingInfoFromPlaid
    } = this.props;

    if (!linkToken && !hasPlaidToken) return <Loader msg='Getting Plaid Token...' />;

    return (
      <div>
        <GBLink onClick={() => this.exitPlaid(null, null, true)}>Test Manual</GBLink>
        { gettingInfoFromPlaid || savingInfoFromPlaid ? <Loader msg={`${savingInfoFromPlaid ? 'Saving' : 'Getting'} info from Plaid`} /> : null }
        { hasPlaidToken ?
          <GBLink
            onClick={this.alreadyHasPlaidToken}
            className='button'
          >
            <span className='buttonAlignText'>Connect a Bank Account <span className='icon icon-chevron-right'></span></span>
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
            <span className='buttonAlignText'>Connect a Bank Account <span className='icon icon-chevron-right'></span></span>
          </PlaidLink>
        }
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const hasPlaidToken = util.getValue(state, 'resource.gbx3Org.data.hasPlaidToken');
  const linkToken = util.getValue(state, 'merchantApp.plaid.linkToken', null);
  const gettingInfoFromPlaid = util.getValue(state, 'merchantApp.gettingInfoFromPlaid', false);
  const savingInfoFromPlaid = util.getValue(state, 'merchantApp.savingInfoFromPlaid', false);
  const merchantApp = util.getValue(state, 'merchantApp', {});
  const extractAuth = util.getValue(merchantApp, 'extractAuth', {});
  const extractIdentity = util.getValue(merchantApp, 'extractIdentity', {});

  return {
    hasPlaidToken,
    linkToken,
    gettingInfoFromPlaid,
    savingInfoFromPlaid,
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
