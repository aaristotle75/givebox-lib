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
  getAvatarState
} from '../redux/gbx3actions';
import { 
  savePrefs,
  getResource 
} from '../../api/helpers';
import { CgMenuGridO } from 'react-icons/cg';
import CartButton from '../payment/CartButton';
import { AiOutlineBank } from 'react-icons/ai';
import { MdFingerprint } from 'react-icons/md';
import { BiTransferAlt } from 'react-icons/bi';
import { GoSettings } from 'react-icons/go';
import { ShieldExclamation, ExclamationLg, ArrowLeft } from 'react-bootstrap-icons';
import AvatarSettings from './AvatarSettings';
import ModalRoute from '../../modal/ModalRoute';
import RedirectPref from '../../login/RedirectPref';

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

  componentDidMount() {
    const {
      hasAccessToEdit,
      access,
      orgStats
    } = this.props;

    const {
      transferMoneyEnabled,
      hasReceivedTransaction
    } = this.props.getAvatarState();

    const role = util.getValue(access, 'role');
    const orgID = util.getValue(access, 'orgID'); 

    if (
      ( role === 'admin' || role === 'super')
      && hasAccessToEdit
      && hasReceivedTransaction
    ) {
      this.props.getResource('orgFinanceStats', {
        orgID,
        reload: true,
        isSending: false
      });
    }
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
      project,
      kindName,
      orgStats
    } = this.props;

    const isWallet = util.getValue(access, 'role') === 'user' ? true : false;
    const isSuper = util.getValue(access, 'role') === 'super' ? true : false;
    const isAdmin = util.getValue(access, 'role') === 'admin' ? true : false;
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
      orgSlug,
      identityReview,
      transferMoneyEnabled,
      shareAlert
    } = this.props.getAvatarState(); 
    
    // If an admin user show go to homepage
    if (isAdmin && !hasAccessToEdit) {
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
            <span className='icon icon-home'></span> My Fundraiser
          </div>
        </li>
      );
    }

    // Dashboard
    menuList.push(
      <li key='dashboard' onClick={async () => {
        if (isAdmin || isSuper) {
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

    if (isAdmin) {
      menuList.push(
        <RedirectPref
          type='li'
          key='settings'
          content={
            <div className='text'>
              <Icon><GoSettings /></Icon> User Settings
            </div>
          }
        />
      )
    }

    // Share
    menuList.push(
      <ModalLink type='li' id={'share'} key={'share'}>
        <div className='text'>
          <span className='icon icon-share'></span> 
          Share {`${display === 'org' ? 'Page' : kindName}`}
          { shareAlert ?
            <div className='secondaryText alert'>
              <Icon><ArrowLeft /></Icon>
            </div>
          : null }
        </div>
        <div className={`secondaryText ${shareAlert ? 'alert' : ''}`}>
          {shareAlert ? 'Share and Raise Money' : null}
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
                `${display === 'org' ? 'View Public Page' : `View ${kindName}`}`
              :
                `Exit ${display === 'org' ? 'Page Editor' : `${kindName} Editor` }`       
              }
            </div>
          </li>
        );
      } else {
        menuList.push(
          <li key='edit' onClick={() => this.adminLink({ publicView: false })}>
            <div className='text'>
              <span className='icon icon-edit'></span> {display === 'org' ? 'Edit Page' : `Edit ${kindName}`}
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
              <div className='text'>
                <Icon style={{ fontSize: '20px' }}><AiOutlineBank /></Icon> 
                Connect Bank
                { connectBankAlert ?
                  <div className='secondaryText alert'>
                    <Icon><ArrowLeft /></Icon>
                  </div>
                : null }
              </div>
              <div className={`secondaryText ${bankConnected ? 'completed': ''} ${connectBankAlert ? 'alert' : ''}`}>
                {bankConnected ? 'Connected' : 'Please Connect a Bank Account'}
                {bankConnected ?
                  <span className='icon icon-check'></span>
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
                { verifyIdentityAlert ?
                  <div className='secondaryText alert'>
                    <Icon><ArrowLeft /></Icon>
                  </div>
                : null }
              </div>
              <div className={`secondaryText ${identityVerified ? 'completed': ''} ${identityReview ? 'review': ''} ${verifyIdentityAlert ? 'alert' : ''}`}>          
                {identityVerified ? 
                  'Verified' 
                : verifyIdentityAlert ? 
                  'Please Verify Your Identity' 
                  : identityReview ?
                    'Verification in Progress'
                  : null
                }
                {identityVerified ?
                  <span className='icon icon-check'></span>
                : 
                  identityReview ?
                  <span className='icon icon-clock'></span>
                  : null
                }
              </div>              
          </li>
        );

        const projectedBalance = util.getValue(orgStats, 'balance', 0) + util.getValue(orgStats, 'pendingDeposits', 0);
        const balance = util.numberWithCommas(parseFloat(projectedBalance/100).toFixed(2)).split('.');
        const balance0 = util.getValue(balance, 0, 0);
        const balance1 = util.getValue(balance, 1, 0);
        let dollarAmount = <span className='dollarAmount'>{balance0}</span>;
        let centAmount = `.${balance1}`;
    
        if (balance0.includes(',')) {
          let dollarArr = balance0.split(',');
          const dollarArr0 = util.getValue(dollarArr, 0, 0);
          const dollarArr1 = util.getValue(dollarArr, 1, 0);
          const dollarArr2 = util.getValue(dollarArr, 2, 0);      
          dollarAmount =
            <span className='dollarAmount'>
              {dollarArr0}
              <span><span className='dollarComma'>,</span>{dollarArr1}</span>
              {dollarArr2 && <span><span className='dollarComma'>,</span>{dollarArr2}</span>}
            </span>
        }

        menuList.push(
          <li
            key={'transferMoney'}
            onClick={() => {
              this.props.toggleModal('avatarOverlay', false);              
              if (transferMoneyEnabled) {
                this.props.openLaunchpad({ autoOpenSlug: 'money' });
              } else {
                this.props.checkSignupPhase();
              }
            }}>
              <div className='text'>
                <Icon style={{ fontSize: '20px' }}><BiTransferAlt /></Icon> Transfer Money
              </div>
              { projectedBalance > 0 ?
              <div className='secondaryText'>
                <div className='moneyRaisedContainer'>
                  <div className='moneyRaised'>
                    <span className='moneyRaisedLabel'>Balance</span>
                    <span className='moneyRaisedText moneyAmount'>
                      <span className='symbol'>$</span>{dollarAmount}<span className='centAmount'><span className='centSymbol'></span>{centAmount}</span>
                    </span>
                  </div>
                </div>            
              </div>
              : null }
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
        <ModalRoute
          id='avatarSettings'
          className='gbx3'
          forceShowModalGraphic={false}
          effect='3DFlipVert' style={{ width: '30%' }}
          component={(props) => <AvatarSettings {...props} /> }
        />
        <div className='avatarOverlay'>
          { isAdmin ?
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
          <div style={{ borderTop: isAdmin ? 0 : null }} className='topSection'>
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
            { stage !== 'admin' ?
            <CartButton key='cart' reloadGBX3={this.props.reloadGBX3} type='avatarMenu' callback={() => this.props.toggleModal('avatarOverlay', false)} />
            : null }
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              { isSuper && !masquerade ? <GBLink style={{ marginBottom: 10 }} onClick={() => window.location.href = SUPER_URL}>Go Back to Super Admin</GBLink> : null }
              <GBLink onClick={() => this.props.userLogout()}>{masquerade ? 'End Masquerade' : 'Logout' }</GBLink>
            </div>            
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
  const kindName = util.getValue(state, 'gbx3.info.kindName');
  const orgStats = util.getValue(state, 'resource.orgFinanceStats.data.aggregate', {});

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
    kindName,
    orgStats,
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
  getAvatarState,
  getResource
})(AvatarOverlay);
