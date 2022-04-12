import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import ModalLink from '../../modal/ModalLink';
import Icon from '../../common/Icon';
import GBLink from '../../common/GBLink';
import {
  toggleModal,
  userLogout,
  openLaunchpad,
  getDefaultArticle
} from '../../api/actions';
import {
  updateAdmin,
  updateInfo,
  updateHelperSteps,
  checkSignupPhase,
  getSignupState
} from '../redux/gbx3actions';
import { savePrefs } from '../../api/helpers';
import { CgMenuGridO } from 'react-icons/cg';
import CartButton from '../payment/CartButton';
import { AiOutlineBank } from 'react-icons/ai';
import { MdFingerprint } from 'react-icons/md';
import { BiTransferAlt } from 'react-icons/bi';
import { ShieldExclamation, ExclamationLg } from 'react-bootstrap-icons';

const ENTRY_URL = process.env.REACT_APP_ENTRY_URL;
const GBX_URL = process.env.REACT_APP_GBX_URL;
const SUPER_URL = process.env.REACT_APP_SUPER_URL;
const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;
const WALLET_URL = process.env.REACT_APP_WALLET_URL;

class AvatarOverlay extends React.Component {

  constructor(props) {
    super(props);
    this.myAccountLink = this.myAccountLink.bind(this);
    this.directLink = this.directLink.bind(this);
    this.adminLink = this.adminLink.bind(this);
    this.state = {
    };
  }

  myAccountLink() {
    const {
      access
    } = this.props;

    this.props.toggleModal('avatarOverlay', false);
    window.open(util.getValue(access, 'role') === 'user' ? WALLET_URL : CLOUD_URL);
  }

  directLink(url) {
    this.props.toggleModal('avatarOverlay', false);
    window.location.href = url;
  }

  adminLink(obj = {}) {
    this.props.toggleModal('avatarOverlay', false);
    this.props.updateAdmin(obj);
  }

  render() {

    const {
      access,
      hasAccessToEdit,
      step,
      stage,
      display,
      project
    } = this.props;

    const isWallet = util.getValue(access, 'role') === 'user' ? true : false;
    const isSuper = util.getValue(access, 'role') === 'super' ? true : false;
    const role = util.getValue(access, 'role');
    const masquerade = util.getValue(access, 'masker', null) ? true : false;
    const baseURL = isWallet ? WALLET_URL : CLOUD_URL;
    const orgImage = util.checkImage(util.getValue(access, 'orgImage')) ? access.orgImage : null;
    const menuList = [];
    
    const {
      bankConnected,
      connectBankAlert,
      identityVerified,
      verifyIdentityAlert,
      defaultArticleID,
      orgSlug
    } = this.props.getSignupState();

    // If an admin user show go to homepage
    if (role === 'admin' && !hasAccessToEdit) {
      // Home Page
      menuList.push(
        <li 
          key={'homePage'}
          onClick={() => {
            if (defaultArticleID) {
              this.props.history.push(`/${defaultArticleID}`);
              this.props.loadGBX3(defaultArticleID, null, { checkSignup: true });
            } else {
              window.location.replace(`${GBX_URL}/${orgSlug}`);
            }
          }}
        >
          <div className='text'>
            <span className='icon icon-home'></span> Your Fundraiser Page
          </div>
        </li>
      );
    }

    // Dashboard
    menuList.push(
      <li key='dashboard' onClick={async () => {
        if (role === 'admin' || role === 'super') {
          this.props.toggleModal('avatarOverlay', false);
          this.props.openLaunchpad();
        } else {
          window.location.replace(ENTRY_URL);
        }
      }}>
        <div className='text'>
          <Icon><CgMenuGridO /></Icon> Dashboard
        </div>
      </li>
    );

    // Share
    menuList.push(
      <ModalLink type='li' id={'share'} key={'share'}>
        <div className='text'>
          <span className='icon icon-share'></span> Share Page
        </div>
      </ModalLink>
    );

    // Edit or Public 
    if (hasAccessToEdit && step !== 'create') {
      if (stage === 'admin') {
        menuList.push(
          <li key='edit' onClick={() => {
            if (project === 'share') {
              this.props.updateAdmin({ publicView: true });
              this.props.updateInfo({ stage: 'public' });
              this.props.toggleModal('avatarOverlay', false);
            } else {
              this.props.exitAdmin();
            }
          }}>
            <div className='text'>
              <span className='icon icon-eye'></span>
              { project === 'share' ?
                `Public Page`
              :
                `Exit ${display === 'org' ? 'Page Editor' : 'Form Editor' }`       
              }
            </div>
          </li>
        );
      } else {
        menuList.push(
          <li key='edit' onClick={() => this.adminLink({ publicView: false })}>
            <div className='text'>
              <span className='icon icon-edit'></span> Edit Page
            </div>
          </li>
        );
      }
    }    

    // Ticker Display
    if (stage === 'admin' && display === 'org') {
      menuList.push(
        <li
          key={'ticker'}
          onClick={() => {
            this.props.savePrefs({ ticker: { open: this.props.tickerDisplay ? false : true } });
          }}
        >
          <div className='text'>
            <span className='icon icon-activity'></span>`${this.props.tickerDisplay ? 'Hide Ticker' : 'Show Ticker'}`
          </div>
        </li>
      )
    }

    // Show Admin/Super Roles
    switch (role) {
      case 'super': 
      case 'admin': {

        menuList.push(
          <li
            key={'connectBank'}
            onClick={() => {
              this.props.toggleModal('avatarOverlay', false);           
              if (bankConnected) {
                this.props.openLaunchpad({ autoOpenSlug: 'money' });
              } else {
                this.props.checkSignupPhase();
              }
            }}>
              <div className='text'> <Icon style={{ fontSize: '20px' }}><AiOutlineBank /></Icon> Connect Bank</div>
              <div className={`secondaryText ${bankConnected ? 'completed': ''} ${connectBankAlert ? 'alert' : ''}`}>
                {bankConnected ? 'Connected' : 'Please Connect a Bank Account'}
                { bankConnected ? 
                  <span className={`icon icon-${bankConnected ? 'check' : ''}`}></span>
                : null }
                { connectBankAlert ?
                  <Icon><ExclamationLg /></Icon>
                : null }
              </div>
          </li>
        );
        menuList.push(
          <li
            key={'verifyIdentity'}
            onClick={() => {
              this.props.toggleModal('avatarOverlay', false);           
              if (identityVerified) {
                this.props.openLaunchpad({ autoOpenSlug: 'money' });
              } else {
                if (hasAccessToEdit) {
                  this.props.checkSignupPhase();
                } else {
                  if (defaultArticleID) {
                    this.props.history.push(`/${defaultArticleID}`);
                    this.props.loadGBX3(defaultArticleID, null, { checkSignup: true });
                  } else {
                    window.location.replace(`${GBX_URL}/${orgSlug}`);
                  }
                }
              }
            }}>
              <div className='text'>
                <Icon style={{ fontSize: '25px' }}><MdFingerprint /></Icon> Verify Identity
              </div>
              <div className={`secondaryText ${bankConnected ? 'completed': ''} ${verifyIdentityAlert ? 'alert' : ''}`}>
                {identityVerified ? 'Verified' : 'Please Verify Your Identity'}
                { identityVerified ? 
                  <span className={`icon icon-check`}></span>
                : null }
                { verifyIdentityAlert ?
                  <Icon><ExclamationLg /></Icon>
                : null }
              </div>              
          </li>
        );
        menuList.push(
          <li
            key={'transferMoney'}
            onClick={() => {
              console.log('Transfer Money');
            }}>
              <div className='text'>
                <Icon style={{ fontSize: '20px' }}><BiTransferAlt /></Icon> Transfer Money
              </div>
          </li>
        );
        break;
      }

      case 'user': {
        break;
      }

      // default
    }

    return (
      <div className='modalWrapper'>
        <div className='avatarOverlay'>
          {access.role === 'admin' ?
          <div className='logoSection'>
            <h3 style={{ marginTop: 0, paddingTop: 0 }}>{access.orgName}</h3>
            <GBLink className='tooltip' onClick={() => this.directLink(`${baseURL}/settings/details`)}>
              {orgImage ?
                <div className='orgImage'>
                  <img src={util.imageUrlWithStyle(orgImage, 'original')} alt='Org Logo' />
                </div>
              :
                <div className='defaultProfilePicture'>
                  <span className='icon icon-camera'></span>
                </div>
              }
              <span className='tooltipTop'><i />Click Icon to {orgImage ? 'Edit' : 'Add'} Logo</span>
            </GBLink>
          </div> : '' }
          <div style={{ borderTop: access.role !== 'admin' ? 0 : null }} className='topSection'>
            <div className='leftSide'>
              <GBLink className='tooltip' onClick={() => this.directLink(`${baseURL}/settings/myaccount`)}>
                { access.userImage ?
                  <div className='avatarImage'>
                    <img src={util.imageUrlWithStyle(access.userImage, 'medium')} alt='Avatar Medium Circle' />
                  </div>
                :
                  <div className='defaultAvatar'>
                    <div className='defaultAvatarImage'>
                      <span className='icon'>{access.initial}</span>
                    </div>
                  </div>
                }
                <span className='tooltipTop'><i />Click Icon to {access.userImage ? 'Edit' : 'Add'} Avatar Image</span>
              </GBLink>
            </div>
            <div className='rightSide'>
              { isSuper ? <span className='gray smallText line'>Super User</span> : null }
              <span className='line' style={{fontWeight: 400}}>{access.fullName}</span>
              <span className='line' style={{fontWeight: 300}}>{access.email}</span>
            </div>
          </div>
          <div className='listSection'>
            <ul>
              {menuList}
          </ul>
          </div>
          <div className='bottomSection'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              { isSuper && !masquerade ? <GBLink style={{ marginBottom: 10 }} onClick={() => window.location.href = SUPER_URL}>Go Back to Super Admin</GBLink> : null }
              <GBLink onClick={() => this.props.userLogout()}>{masquerade ? 'End Masquerade' : 'Logout' }</GBLink>
            </div>
            { stage !== 'admin' ?
            <CartButton key='cart' reloadGBX3={this.props.reloadGBX3} type='avatarMenu' callback={() => this.props.toggleModal('avatarOverlay', false)} />
            : null }
          </div>
        </div>
      </div>
    )
  }
}

AvatarOverlay.defaultProps = {
}

function mapStateToProps(state, props) {

  const access = util.getValue(state.resource, 'access');
  const hasAccessToEdit = util.getValue(state, 'gbx3.admin.hasAccessToEdit');
  const step = util.getValue(state, 'gbx3.admin.step');
  const helperPref = util.getValue(state, 'preferences.gbx3Helpers');
  const builderPref = util.getValue(state, 'preferences.builderPref');
  const tickerPref = util.getValue(state, 'preferences.ticker', {});
  const tickerDisplay = util.getValue(tickerPref, 'open', true);
  const stage = util.getValue(state, 'gbx3.info.stage');
  const display = util.getValue(state, `gbx3.info.display`);
  const project = util.getValue(state, 'gbx3.info.project');

  return {
    access,
    hasAccessToEdit,
    step,
    helperPref,
    builderPref,
    tickerDisplay,
    stage,
    display,
    project,
    advancedBuilder: util.getValue(state, 'gbx3.helperSteps.advancedBuilder', false)
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateAdmin,
  updateInfo,
  updateHelperSteps,
  savePrefs,
  userLogout,
  openLaunchpad,
  checkSignupPhase,
  getDefaultArticle,
  getSignupState
})(AvatarOverlay);
