import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import ModalLink from '../../../modal/ModalLink';
import Icon from '../../../common/Icon';
import Layout from '../../Layout';
import AdminMenu from '../AdminMenu';
import {
  updateAdmin,
  updateInfo,
  toggleAdminLeftPanel,
  setLoading,
  closeHelper
} from '../../redux/gbx3actions';
import Toggle from 'react-toggle';
import { FaPalette } from 'react-icons/fa';
import { GoBeaker } from 'react-icons/go';
import { AiOutlineNotification } from 'react-icons/ai';

const GBX3_URL = process.env.REACT_APP_GBX_URL;
const ENV = process.env.REACT_APP_ENV;

class Design extends React.Component {

  constructor(props) {
    super(props);
    this.switchCreateType = this.switchCreateType.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.renderTopPanel = this.renderTopPanel.bind(this);
    this.changePreviewDevice = this.changePreviewDevice.bind(this);
    this.previewPage = this.previewPage.bind(this);
    this.state = {
    };
    this.iframePreviewRef = React.createRef();
  }

  renderTopPanel() {
    const {
      createType,
      breakpoint,
      previewMode,
      previewDevice,
      openAdmin: open
    } = this.props;

    const mobile = breakpoint === 'mobile' ? true : false;
    const leftSide = [];
    const middle = [];
    const rightSide = [];

    const contentObj = {
      layout: {
        menuText: !mobile ? 'Design Page' : 'Design',
        icon: <Icon><FaPalette /></Icon>
      },
      share: {
        menuText: !mobile ? 'Share Page' : 'Share',
        icon: <Icon><AiOutlineNotification /></Icon>
      }
    };

    if (!previewMode) {
      /*
      if (open) {
        leftSide.push(
          <GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}>{!mobile ? contentObj[createType].icon : <span className='icon icon-x'></span>}{!mobile ? <span className='flexCenter centerItems'>{contentObj[createType].menuText} Menu <span className='leftPanelClose icon icon-x'></span></span> : ''}</GBLink>
        );
      } else {
        leftSide.push(
          <GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}><Icon><GoBeaker /></Icon>{!mobile ? 'Advanced Menu' : ''}</GBLink>
        );
      }
      */
    }

    if (!mobile) {
      rightSide.push(
        <div
          className='rightSide'
          key='rightSide'
        >
          <GBLink className='link side' style={{ marginRight: 10 }} onClick={this.togglePreview}>{ mobile ? <span className='icon icon-eye'></span> : <span>Preview Mode</span> }</GBLink>
          <Toggle
            icons={false}
            checked={previewMode}
            onChange={this.togglePreview}
          />
        </div>
      );
    } else {
      rightSide.push(<div className='rightSide' key='rightSide'>&nbsp;</div>)
    }

    if (previewMode) {
      middle.push(
        <div key={'middle'} className='button-group middle'>
          <GBLink className={`ripple link ${previewDevice === 'phone' ? 'selected' : ''}`} onClick={() => this.previewPage('phone')}><span className='icon icon-smartphone'></span><span className='iconText'>Mobile</span></GBLink>
          <GBLink className={`ripple link ${previewDevice === 'desktop' ? 'selected' : ''}`} onClick={() => this.previewPage('desktop')}><span className='icon icon-monitor'></span><span className='iconText'>Desktop</span></GBLink>
        </div>
      );
    } else {
      middle.push(
        <div key={'middle'} className='button-group'>
          <GBLink className={`ripple link ${createType === 'layout' ? 'selected' : ''}`} onClick={() => this.switchCreateType('layout')}><span className='centered'>{contentObj.layout.icon}<span className='menuText'>{contentObj.layout.menuText}</span></span></GBLink>
          <ModalLink id='share' className={`ripple link ${createType === 'share' ? 'selected' : ''}`}><span className='centered'>{contentObj.share.icon}<span id='helper-share' className='menuText'>{contentObj.share.menuText}</span></span></ModalLink>
        </div>
      );
    }

    return (
      <div id='topPanelContainer' className='topPanelContainer'>
        <div className='leftSide'>
          {leftSide}
        </div>
        <div className='middle centerAlign adminPanelTabs'>
          {middle}
        </div>
        {rightSide}
      </div>
    )
  }

  togglePreview() {

    const previewMode = this.props.previewMode ? false : true;
    let previewDevice = 'desktop';
    this.props.closeHelper();
    this.props.updateAdmin({ previewDevice, previewMode, editable: previewMode ? false : true });
  }

  async changePreviewDevice(previewDevice) {
    this.props.setLoading(true);
    const adminUpdated = await this.props.updateAdmin({ previewDevice });
    if (adminUpdated) {
      this.timeout = setTimeout(() => {
        this.props.setLoading(false);
        this.timeout = null;
      }, 0);
    }
  }

  async previewPage(previewDevice) {
    const createTypeUpdated = await this.props.updateAdmin({ createType: 'layout' });
    if (createTypeUpdated) {
      this.changePreviewDevice(previewDevice);
    }
  }

  async switchCreateType(createType) {
    this.props.updateAdmin({ createType });
  }

  renderDisplay() {
    const {
      createType,
      previewDevice,
      previewMode,
      orgSlug,
      orgID
    } = this.props;

    const items = [];

    let url = `${GBX3_URL}/${orgSlug}?public&preview`;
    if (ENV === 'local') {
      url = `${GBX3_URL}/${orgSlug}?orgID=${orgID}&template=org&public&preview`;
    }

    switch(createType) {
      case 'layout':
      default: {
        if (previewMode) {
          items.push(
            <div
              key={'layout'}
              className={`deviceLayoutWrapper ${previewDevice}Wrapper` }>
              <div className='stagePreview'>
                <iframe src={url} title={`${util.toTitleCase(previewDevice)} Preview`} />
              </div>
            </div>
          );
        } else {
          items.push(
            <Layout
              key={'layout'}
              loadGBX3={this.props.loadGBX3}
              reloadGBX3={this.props.reloadGBX3}
            />
          );
        }
        break;
      }
    }
    return items;
  }

  render() {

    const {
      openAdmin: open
    } = this.props;

    return (
      <>
        <div className={`topPanel`}>
          {this.renderTopPanel()}
        </div>
        <div className={`leftPanel ${open ? 'open' : 'close'}`}>
          <div className='leftPanelOpenButton' onClick={this.props.toggleAdminLeftPanel}><span className='icon icon-menu'></span></div>
          <AdminMenu
            blockType={'org'}
          />
        </div>
        <div
          id='GBX3StageAligner'
          className='stageAligner'
        >
          <div
            key={'form'}
            className={`stageContainer ${open ? 'open' : 'close'}`}
          >
            {this.renderDisplay()}
          </div>
        </div>
      </>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const breakpoint = util.getValue(gbx3, 'info.breakpoint');
  const admin = util.getValue(gbx3, 'admin', {});
  const articleID = util.getValue(gbx3, 'info.articleID');
  const previewMode = util.getValue(admin, 'previewMode');
  const previewDevice = util.getValue(admin, 'previewDevice');
  const openAdmin = util.getValue(admin, 'open');
  const createType = util.getValue(admin, 'createType');
  const orgSlug = util.getValue(gbx3, 'orgData.slug');
  const orgID = util.getValue(gbx3, 'orgData.ID');

  return {
    breakpoint,
    articleID,
    previewMode,
    previewDevice,
    openAdmin,
    createType,
    orgSlug,
    orgID
  }
}

export default connect(mapStateToProps, {
  updateAdmin,
  updateInfo,
  toggleAdminLeftPanel,
  setLoading,
  closeHelper
})(Design);
