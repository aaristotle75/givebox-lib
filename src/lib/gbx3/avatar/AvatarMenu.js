import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Icon from '../../common/Icon';
import ModalLink from '../../modal/ModalLink';
import { toggleModal } from '../../api/actions';
import {
  updateAdmin,
  updateInfo,
  getAvatarState
} from '../redux/gbx3actions';
import CartButton from '../payment/CartButton';
import { ExclamationLg, ShieldFillExclamation, ShieldExclamation } from 'react-bootstrap-icons';
import { MdNotificationsActive } from 'react-icons/md';

const ENV = process.env.REACT_APP_ENV;
const ENTRY_URL = process.env.REACT_APP_ENTRY_URL;
const GBX_URL = process.env.REACT_APP_GBX_URL;
const SHARE_URL = process.env.REACT_APP_GBX_SHARE;
const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;

class AvatarMenu extends React.Component {

  constructor(props) {
    super(props);
    this.myAccountLink = this.myAccountLink.bind(this);
    this.state = {
    };
  }

  myAccountLink() {
    this.props.toggleModal('avatarOverlay', false);
    window.location.href = CLOUD_URL;
  }

  render() {

    const {
      access,
      stage,
      display,
      browse,
      hasAccessToEdit,
      hideMenu,
      preview,
      kindName
    } = this.props;

    if (util.isEmpty(access) || preview) return <></>;

    const startFundraiserLink = ENV === 'local' ? `${SHARE_URL}/4?template=signup&orgID=null` : `${GBX_URL}/signup`;
    const {
      connectBankAlert,
      verifyIdentityAlert,
      shareAlert
    } = this.props.getAvatarState();

    const avatarAlert = connectBankAlert || verifyIdentityAlert ? true : false;
    const avatarButton =
      <div className={`avatarLink ${stage === 'public' ? 'tooltip' : ''}`}>
        <ModalLink id='avatarOverlay' className={`link ${avatarAlert ? 'alert' : ''}`}>
          { stage === 'public' ? <span className='tooltipTop'><i />Avatar Menu</span> : null }
          { avatarAlert || shareAlert ?
            <div className='avatarAlert'><Icon><MdNotificationsActive /></Icon></div>
          : null }
          {stage === 'admin' && access.role === 'admin' && display !== 'org' ? <span className='orgName'>{util.getValue(access, 'orgName')}</span> : null}
          {access.userImage ? 
            <div className='avatarImage'>
              <img src={util.imageUrlWithStyle(access.userImage, 'small')} alt='Avatar Small Circle' />
            </div> 
          :
            <div className='defaultAvatarImage'>{access.initial}</div>
          }
        </ModalLink>
      </div>
    ;

    switch (stage) {
      case 'admin': {
        if (!hideMenu) {
          if (display === 'org') {
            return (
              <div className='hasAccessToEditPublic'>
                {avatarButton}
                { !browse ?
                <ModalLink type='div' id={'share'} className='avatarLink tooltip hideOnMobile'>
                  <span className='tooltipTop'><i />Share Page</span>
                  <div className='editGraphic'>
                    <span className='icon icon-share'></span>
                  </div>
                </ModalLink> 
                : null}
                { hasAccessToEdit && !browse ?
                <div
                  className='avatarLink tooltip hideOnMobile'
                  onClick={() => {
                    this.props.updateAdmin({ publicView: true });
                    this.props.updateInfo({ stage: 'public' });
                  }}
                >
                  <span className='tooltipTop'><i />View Public Page</span>
                  <div className='editGraphic'>
                    <span className='icon icon-eye'></span>
                  </div>
                </div> 
                : null}                
              </div>
            )
          } else {
            return avatarButton;
          }
        }
        return null;
      }

      default: {
        return (
          <div className='hasAccessToEditPublic'>
            { display !== 'signup' ?
              avatarButton
            : null }
            { !browse && display !== 'signup' ?
            <ModalLink type='div' id={'share'} className={`avatarLink tooltip hideOnMobile`}>
              <span className='tooltipTop'><i />Share {kindName}</span>
              <div className='editGraphic'>
                <span className='icon icon-share'></span>
              </div>
            </ModalLink> : null}
            { hasAccessToEdit && !browse && display !== 'signup' ?
            <div onClick={() => this.props.updateAdmin({ publicView: false })} className='avatarLink tooltip hideOnMobile'>
              <span className='tooltipTop'><i />{ display === 'org' ? 'Edit Page' : `Edit ${kindName}` }</span>
              <div className='editGraphic'>
                <span className='icon icon-edit'></span>
              </div>
            </div> : null}
            { !hasAccessToEdit ?
            <CartButton 
              reloadGBX3={this.props.reloadGBX3} 
              type='avatarLink' 
            />
            : null }
            { (display === 'org' || display === 'browse') && !hasAccessToEdit ?
            <div className='avatarLoginActions'>
              <GBLink className='button' onClick={() => window.location.replace(startFundraiserLink)}>Start a Fundraiser</GBLink>
              <GBLink className='button' onClick={() => window.location.replace(ENTRY_URL)}>Login</GBLink>
            </div>
            : null }                
          </div>
        )
      }
    }
  }
}

AvatarMenu.defaultProps = {
  hideMenu: false
}

function mapStateToProps(state, props) {

  const access = util.getValue(state.resource, 'access');
  const browse = util.getValue(state, 'gbx3.browse');
  const stage = util.getValue(state, 'gbx3.info.stage');
  const display = util.getValue(state, `gbx3.info.display`);
  const kindName = util.getValue(state, 'gbx3.info.kindName');
  const hasAccessToEdit = util.getValue(state, 'gbx3.admin.hasAccessToEdit');
  const preview = util.getValue(state, 'gbx3.info.preview');

  return {
    access,
    browse,
    stage,
    display,
    kindName,
    hasAccessToEdit,
    preview
  }
}

export default connect(mapStateToProps, {
  updateAdmin,
  updateInfo,  
  toggleModal,
  getAvatarState
})(AvatarMenu);
