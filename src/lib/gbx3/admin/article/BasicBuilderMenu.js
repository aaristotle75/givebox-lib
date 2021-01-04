import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import {
  toggleAdminLeftPanel
} from '../../redux/gbx3actions';
import { builderStepsConfig } from './builderStepsConfig';

class AdminMenu extends React.Component {

  constructor(props) {
    super(props);
    this.renderSteps = this.renderSteps.bind(this);
    this.state = {
    };
  }

  renderSteps() {
    const items = [];

    return (
      <ul>
        <li className='listHeader'>Builder Steps</li>
        {items}
      </ul>
    )
  }

  render() {

    return (
      <div className='leftPanelContainer'>
        <div className={`leftPanelScroller`} style={{ marginTop: 0 }}>
          <GBLink className='leftPanelClose link' onClick={() => this.props.toggleAdminLeftPanel()}>
            <span className='icon icon-x'></span>
          </GBLink>
          {this.renderSteps()}
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
})(AdminMenu);
