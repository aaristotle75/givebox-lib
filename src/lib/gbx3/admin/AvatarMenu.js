import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import ModalLink from '../../modal/ModalLink';
import Icon from '../../common/Icon';
import GBLink from '../../common/GBLink';
import {
  toggleModal,
  userLogout
} from '../../api/actions';
import {
  updateAdmin,
  updateHelperSteps
} from '../redux/gbx3actions';
import { savePrefs } from '../../api/helpers';
import { AiOutlineNotification, AiOutlineFullscreen } from 'react-icons/ai';
import { GoBeaker, GoChecklist } from 'react-icons/go';
import CartButton from '../payment/CartButton';

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;
const WALLET_URL = process.env.REACT_APP_WALLET_URL;

class AvatarMenu extends React.Component {

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

    this.props.toggleModal('avatarMenu', false);
    window.open(util.getValue(access, 'role') === 'user' ? WALLET_URL : CLOUD_URL);
  }

  directLink(url) {
    this.props.toggleModal('avatarMenu', false);
    window.open(url);
  }

  adminLink(obj = {}) {
    this.props.toggleModal('avatarMenu', false);
    this.props.updateAdmin(obj);
  }

  render() {

    const {
      access,
      hasAccessToEdit,
      step,
      helperPref,
      builderPref,
      stage,
      display
    } = this.props;

    const isWallet = util.getValue(access, 'role') === 'user' ? true : false;
    const masquerade = util.getValue(access, 'masker', null) ? true : false;
    const baseURL = isWallet ? WALLET_URL : CLOUD_URL;
    const myAccountText = isWallet ? 'Go to Your Wallet' : 'Go to Nonprofit Admin';

    const menuList = [];

    menuList.push(
      <li key='myAccount' onClick={() => this.directLink(`${baseURL}/settings/myaccount`)}><span className='icon icon-user'></span> <span className='text'>My Account</span></li>
    );

    if (hasAccessToEdit && step !== 'create') {
      menuList.push(
        <li key='edit' onClick={() => this.adminLink({ publicView: false })}><span className='icon icon-edit'></span> <span className='text'>Edit {display === 'org' ? 'Page' : 'Form' }</span></li>
      );

      menuList.push(
        <ModalLink type='li' id={'share'} key={'share'}><Icon><AiOutlineNotification /></Icon> <span className='text'>Share {display === 'org' ? 'Page' : 'Form'}</span></ModalLink>
      );

      if (stage === 'admin' && display === 'article') {
        menuList.push(
          <li key={'exitBuilder'} onClick={() => {
            this.props.exitAdmin();
            this.props.toggleModal('avatarMenu', false);
          }}>
            <Icon><AiOutlineFullscreen /></Icon> <span className='text'>Exit Editor</span>
          </li>
        );
      }
    }

    if (stage !== 'admin') {
      menuList.push(
        <CartButton key='cart' reloadGBX3={this.props.reloadGBX3} type='avatarMenu' callback={() => this.props.toggleModal('avatarMenu', false)} />
      );
    }

    if (stage === 'admin' && display === 'org') {
      menuList.push(
        <li
          key={'ticker'}
          onClick={() => {
            this.props.savePrefs({ ticker: { open: this.props.tickerDisplay ? false : true } });
          }}
        >
          <span className='icon icon-activity'></span> <span className='text'>{this.props.tickerDisplay ? 'Hide Ticker' : 'Show Ticker'}</span>
        </li>
      )
    }

    return (
      <div className='modalWrapper'>
        <div className='avatarMenu'>
          {access.role === 'admin' ?
          <div className='logoSection'>
            <h3 style={{ marginTop: 0, paddingTop: 0 }}>{access.orgName}</h3>
            {access.orgImage ?
              <GBLink onClick={() => this.directLink(`${baseURL}/settings`)}>
                <div className='orgImage'><img src={util.imageUrlWithStyle(access.orgImage, 'original')} alt='Org Logo' /></div>
              </GBLink>
            :
              ''
            }
          </div> : '' }
          <div style={{ borderTop: access.role !== 'admin' ? 0 : null }} className='topSection'>
            <div className='leftSide'>
              {access.userImage ?
                <GBLink onClick={() => this.directLink(`${baseURL}/settings`)}>
                  <div className='avatarImage'><img src={util.imageUrlWithStyle(access.userImage, 'medium')} alt='Avatar Medium Circle' /></div>
                </GBLink>
              :
                <div className='defaultAvatar'>
                  <GBLink onClick={() => this.directLink(`${baseURL}/settings`)}>
                    <span className='defaultAvatarImage'><span className='icon'>{access.initial}</span></span>
                    <br />{access.masker ? 'Masquerader' : 'Add Avatar'}
                  </GBLink>
                </div>
              }
            </div>
            <div className='rightSide'>
              { masquerade ? <span className='line'>Super User</span> : null }
              <span className='line' style={{fontWeight: 300}}>{access.fullName}</span>
              <span className='line' style={{fontWeight: 300}}>{access.email}</span>
            </div>
          </div>
          <div className='listSection'>
            <ul>
              {menuList}
          </ul>
          </div>
          <div className='bottomSection'>
            <GBLink onClick={() => this.props.userLogout()}>{masquerade ? 'End Masquerade' : 'Logout' }</GBLink>
          </div>
        </div>
      </div>
    )
  }
}

AvatarMenu.defaultProps = {
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


  return {
    access,
    hasAccessToEdit,
    step,
    helperPref,
    builderPref,
    tickerDisplay,
    stage,
    display,
    advancedBuilder: util.getValue(state, 'gbx3.helperSteps.advancedBuilder', false)
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateAdmin,
  updateHelperSteps,
  savePrefs,
  userLogout
})(AvatarMenu);
