import React from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../../';
import GBLink from '../../../common/GBLink';
import ReceiptMenuLayout from './ReceiptMenuLayout';
import ReceiptMenuStyle from './ReceiptMenuStyle';
import ReceiptMenuTools from './ReceiptMenuTools';
import {
  toggleAdminLeftPanel
} from '../../redux/gbx3actions';

class ReceiptMenu extends React.Component {

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
    switch (this.state.panelType) {
      case 'style': {
        return (
          <ReceiptMenuStyle />
        )
      }

      case 'tools': {
        return (
          <ReceiptMenuTools />
        )
      }

      case 'layout':
      default: {
        return (
          <ReceiptMenuLayout />
        )
      }
    }
  }

  render() {

    const {
      panelType
    } = this.state;

    return (
      <div className='leftPanelContainer'>
        <div className='leftPanelTop'>
          <div className='middle centerAlign adminPanelTabs'>
            <GBLink className={`ripple link ${panelType === 'layout' ? 'selected' : ''}`} onClick={() => this.switchPanelType('layout')}>Elements</GBLink>
            <GBLink className={`ripple link ${panelType === 'tools' ? 'selected' : ''}`} onClick={() => this.switchPanelType('tools')}>Preferences</GBLink>
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

  return {
    openAdmin
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel
})(ReceiptMenu);
