import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Layout from '../../Layout';
import AdminMenu from './AdminMenu';
import {
  toggleAdminLeftPanel,
  loadPostSignup
} from '../../redux/gbx3actions';
import OrgModalRoutes from '../../OrgModalRoutes';

class OrgAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      signupPhase
    } = this.props;

    switch (signupPhase) {
      case 'postSignup': {
        this.props.loadPostSignup(false, false);
        break;
      }

      // no default
    }
  }

  render() {

    const {
      openAdmin: open
    } = this.props;

    return (
      <>
        <OrgModalRoutes />
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
            id='stageContainer'
          >
            <Layout
              key={'layout'}
              loadGBX3={this.props.loadGBX3}
              reloadGBX3={this.props.reloadGBX3}
              exitAdmin={this.props.exitAdmin}
            />
          </div>
        </div>
      </>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const openAdmin = util.getValue(admin, 'open');
  const signupPhase = util.getValue(gbx3, 'orgSignup.signupPhase');

  return {
    openAdmin,
    signupPhase
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel,
  loadPostSignup
})(OrgAdmin);
