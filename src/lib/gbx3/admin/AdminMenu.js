import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import AdminMenuLayout from './AdminMenuLayout';
import AdminMenuStyle from './AdminMenuStyle';
import AdminMenuTools from './AdminMenuTools';
import {
  toggleAdminLeftPanel
} from '../redux/gbx3actions';
import SignupMenu from '../signup/SignupMenu';

class AdminMenu extends React.Component {

  constructor(props) {
    super(props);
    this.switchPanelType = this.switchPanelType.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.state = {
      panelType: 'layout'
    };
  }

  switchPanelType(panelType) {
    this.setState({ panelType });
  }

  renderPanel() {
    const {
      blockType,
      signupStepsDisplay
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

      case 'layout':
      default: {
        return (
          <AdminMenuLayout 
            signupStepsDisplay={signupStepsDisplay}
            blockType={blockType} 
          />
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
      signupStepsDisplay
    } = this.props;

    const mobile = breakpoint === 'mobile' ? true : false;

    return (
      <div className={`leftPanelContainer ${signupStepsDisplay ? 'signupSteps' : ''}`}>
        { signupStepsDisplay ?
          <SignupMenu 
            stepsOnly={true}
            formBuilderSpecific={true}
          />
        : null }
        <div className={`leftPanelTop`}>
          <GBLink className='leftPanelClose link' onClick={() => this.props.toggleAdminLeftPanel()}>
            <span className='icon icon-x'></span>
          </GBLink>
          <div className='middle centerAlign adminPanelTabs'>
            <GBLink className={`ripple link ${panelType === 'layout' ? 'selected' : ''}`} onClick={() => this.switchPanelType('layout')}>Edit</GBLink>
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
  const signupStepsDisplay = util.getValue(gbx3, 'admin.signupStepsDisplay');

  return {
    openAdmin,
    breakpoint,
    signupStepsDisplay
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel
})(AdminMenu);
