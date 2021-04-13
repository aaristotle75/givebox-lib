import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import AdminMenuLayout from './AdminMenuLayout';
import AdminMenuStyle from './AdminMenuStyle';
import AdminMenuTools from './AdminMenuTools';
import HelperMenuPanel from './HelperMenuPanel';
import {
  toggleAdminLeftPanel
} from '../../redux/gbx3actions';

class AdminMenu extends React.Component {

  constructor(props) {
    super(props);
    this.switchPanelType = this.switchPanelType.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.state = {
      panelType: 'helperMenu'
    };
  }

  componentDidMount() {

  }

  switchPanelType(panelType) {
    this.setState({ panelType });
  }

  renderPanel() {
    const {
      blockType
    } = this.props;

    switch (this.state.panelType) {
      case 'style': {
        return (
          <AdminMenuStyle blockType={blockType} />
        )
      }

      case 'tools': {
        return (
          <AdminMenuTools blockType={blockType} />
        )
      }

      case 'layout': {
        return (
          <AdminMenuLayout blockType={blockType} />
        )
      }

      case 'helperMenu':
      default: {
        return (
          <HelperMenuPanel blockType={blockType} />
        )
      }
    }
  }

  render() {

    const {
      panelType,
      breakpoint
    } = this.state;

    const {
      contentObj,
      createType
    } = this.props;

    const mobile = breakpoint === 'mobile' ? true : false;

    return (
      <div className='leftPanelContainer'>
        <div className='leftPanelTop'>
          <GBLink className='leftPanelClose link' onClick={() => this.props.toggleAdminLeftPanel()}>
            <span className='icon icon-x'></span>
          </GBLink>
          <div className='middle centerAlign adminPanelTabs'>
            {/*
            <GBLink className={`ripple link ${panelType === 'layout' ? 'selected' : ''}`} onClick={() => this.switchPanelType('layout')}>Elements</GBLink>
            */}
            <GBLink className={`ripple link ${panelType === 'helperMenu' ? 'selected' : ''}`} onClick={() => this.switchPanelType('helperMenu')}>Menu</GBLink>
            <GBLink className={`ripple link ${panelType === 'style' ? 'selected' : ''}`} onClick={() => this.switchPanelType('style')}>Style</GBLink>
            <GBLink className={`ripple link ${panelType === 'tools' ? 'selected' : ''}`} onClick={() => this.switchPanelType('tools')}>Settings</GBLink>
          </div>
        </div>
        <div className={`leftPanelScroller`}>
          {this.renderPanel()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const openAdmin = util.getValue(admin, 'open');
  const breakpoint = util.getValue(gbx3, 'info.breakpoint');
  const createType = util.getValue(admin, 'createType');

  return {
    openAdmin,
    breakpoint,
    createType
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel
})(AdminMenu);
