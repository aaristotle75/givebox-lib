import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import ModalLink from '../../../modal/ModalLink';
import Icon from '../../../common/Icon';
import Layout from '../../Layout';
import AdminMenu from '../AdminMenu';
import ReceiptEmail from '../receipt/ReceiptEmail';
import ReceiptMenu from '../receipt/ReceiptMenu';
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
import { FiPenTool } from 'react-icons/fi';
import { AiOutlineNotification } from 'react-icons/ai';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class Design extends React.Component {

  constructor(props) {
    super(props);
    this.switchCreateType = this.switchCreateType.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.renderTopPanel = this.renderTopPanel.bind(this);
    this.changePreviewDevice = this.changePreviewDevice.bind(this);
    this.previewReceipt = this.previewReceipt.bind(this);
    this.previewArticle = this.previewArticle.bind(this);
    this.state = {
    };
    this.iframePreviewRef = React.createRef();
    const mobile = props.breakpoint === 'mobile' ? true : false;
    this.contentObj = {
      layout: {
        menuText: !mobile ? 'Design Form' : 'Design',
        icon: <Icon><FaPalette /></Icon>
      },
      receipt: {
        menuText: !mobile ? 'Customize Receipt' : 'Receipt',
        icon: <Icon><FiPenTool /></Icon>
      },
      share: {
        menuText: !mobile ? 'Share Form' : 'Share',
        icon: <Icon><AiOutlineNotification /></Icon>
      }
    };
  }

  renderTopPanel() {
    const {
      createType,
      breakpoint,
      previewMode,
      previewDevice,
      advancedBuilder,
      kind,
      openAdmin: open
    } = this.props;

    const mobile = breakpoint === 'mobile' ? true : false;
    const leftSide = [];
    const middle = [];
    const rightSide = [];

    if (!previewMode && !mobile && kind === 'fundraiser') {
      leftSide.push(
        <div
          className='leftSide'
          key='leftSide'
        >
          <Toggle
            icons={false}
            checked={advancedBuilder}
            onChange={this.props.toggleBuilder}
          />
          <GBLink className='link side' style={{ marginRight: 10 }} onClick={this.props.toggleBuilder}>{ mobile ? <Icon><GoBeaker /></Icon> : <span>Advanced Builder</span> }</GBLink>
        </div>
      );
      {/*
      if (open) {
        leftSide.push(
          <GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}>{!mobile ? contentObj[createType].icon : <span className='icon icon-x'></span>}{!mobile ? <span className='flexCenter centerItems'>{contentObj[createType].menuText} Menu <span className='leftPanelClose icon icon-x'></span></span> : ''}</GBLink>
        );
      } else {
        leftSide.push(
          <GBLink key={'leftSide'} className='link side' onClick={() => this.props.toggleAdminLeftPanel()}><Icon><GoBeaker /></Icon>{!mobile ? 'Advanced Menu' : ''}</GBLink>
        );
      }
      */}
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
          <GBLink className={`ripple link ${previewDevice === 'phone' ? 'selected' : ''}`} onClick={() => this.previewArticle('phone')}><span className='icon icon-smartphone'></span><span className='iconText'>Mobile</span></GBLink>
          <GBLink className={`ripple link ${previewDevice === 'desktop' ? 'selected' : ''}`} onClick={() => this.previewArticle('desktop')}><span className='icon icon-monitor'></span><span className='iconText'>Desktop</span></GBLink>
          <GBLink className={`ripple link ${previewDevice === 'receipt' ? 'selected' : ''}`} onClick={() => this.previewReceipt()}><span className='icon icon-mail'></span><span className='iconText'>Receipt</span></GBLink>
        </div>
      );
    } else {
      middle.push(
        <div key={'middle'} className='button-group'>
          <GBLink className={`ripple link ${createType === 'layout' ? 'selected' : ''}`} onClick={() => this.switchCreateType('layout')}><span className='centered'>{this.contentObj.layout.icon}<span className='menuText'>{this.contentObj.layout.menuText}</span></span></GBLink>
          <GBLink className={`ripple link ${createType === 'receipt' ? 'selected' : ''}`} onClick={() => this.switchCreateType('receipt')}><span className='centered'>{this.contentObj.receipt.icon}<span className='menuText'>{this.contentObj.receipt.menuText}</span></span></GBLink>
          <ModalLink id='share' className={`ripple link ${createType === 'share' ? 'selected' : ''}`}><span className='centered'>{this.contentObj.share.icon}<span id='helper-share' className='menuText'>{this.contentObj.share.menuText}</span></span></ModalLink>
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

    const {
      createType
    } = this.props;

    const previewMode = this.props.previewMode ? false : true;
    let previewDevice = 'desktop';

    if (createType === 'receipt') {
      previewDevice = 'receipt';
      if (this.props.previewMode) {
        const iframeEl = document.getElementById('emailIframePreview');
        if (iframeEl) {
          iframeEl.contentWindow.location.replace('about:blank');
        }
      }
    }
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

  previewReceipt() {
    this.props.updateAdmin({ createType: 'receipt', previewDevice: 'receipt' });
  }

  async previewArticle(previewDevice) {
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
      articleID
    } = this.props;

    const items = [];

    switch(createType) {
      case 'receipt': {
        if (previewMode) {
          items.push(
            <div key='receipt' className='gbx3ReceiptLayout'>
              <div className='gbx3ReceiptContainer'>
                <div className='block'>
                  <iframe id='emailIframePreview' className='emailIframe' style={{ height: previewMode ? '100vh' : 0 }} ref={this.iframePreviewRef} title='Email iFrame Preview'></iframe>
                  <ReceiptEmail iframePreviewRef={this.iframePreviewRef} />
                </div>
              </div>
            </div>
          );
        } else {
          items.push(
            <ReceiptEmail
              key={'receipt'}
            />
          );
        }
        break;
      }

      case 'layout':
      default: {
        if (previewMode) {
          items.push(
            <div
              key={'layout'}
              className={`deviceLayoutWrapper ${previewDevice}Wrapper` }>
              <div className='stagePreview'>
                <iframe src={`${GBX3_URL}/${articleID}/?public&preview`} title={`${util.toTitleCase(previewDevice)} Preview`} />
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
      createType,
      openAdmin: open
    } = this.props;

    return (
      <>
        <div className={`topPanel`}>
          {this.renderTopPanel()}
        </div>
        <div className={`leftPanel ${open ? 'open' : 'close'}`}>
          <div className='leftPanelOpenButton' onClick={this.props.toggleAdminLeftPanel}><span className='icon icon-menu'></span></div>
          { createType === 'layout' ?
            <AdminMenu
              blockType={'article'}
              contentObj={this.contentObj}
            />
          :
            <ReceiptMenu
              contentObj={this.contentObj}
            />
          }
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

  return {
    breakpoint,
    articleID,
    previewMode,
    previewDevice,
    openAdmin,
    createType,
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser')
  }
}

export default connect(mapStateToProps, {
  updateAdmin,
  updateInfo,
  toggleAdminLeftPanel,
  setLoading,
  closeHelper
})(Design);
