import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Layout from '../../Layout';
import AdminMenu from './AdminMenu';
import Loader from '../../../common/Loader';
import {
  toggleAdminLeftPanel,
  checkSignupPhase
} from '../../redux/gbx3actions';
import {
  getMerchantVitals
} from '../../redux/merchantActions';
import OrgModalRoutes from '../../OrgModalRoutes';

const ENV = process.env.REACT_APP_ENV;

class OrgAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const testConfig = {
      forceStep: null,
      openModal: true,
      openAdmin: true
    };

    this.props.checkSignupPhase(ENV !== 'production' ? testConfig : {});
    if (util.isEmpty(this.props.merchantVitals)) {
      this.props.getMerchantVitals();
    }
  }

  render() {

    const {
      openAdmin: open
    } = this.props;

    if (util.isEmpty(this.props.merchantVitals)) return <Loader msg='Org Admin Loading Merchant Vitals...' />;

    return (
      <>
        <OrgModalRoutes />
        <div className={`leftPanelOpenButton ${open ? 'open' : 'close'}`} onClick={this.props.toggleAdminLeftPanel}><span className='icon icon-menu'></span></div>
        <div className={`leftPanel ${open ? 'open' : 'close'}`}>
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
  const orgID = util.getValue(gbx3, 'info.orgID');
  const admin = util.getValue(gbx3, 'admin', {});
  const openAdmin = util.getValue(admin, 'open');
  const merchantVitals = util.getValue(state, 'merchantVitals', {});

  return {
    orgID,
    openAdmin,
    merchantVitals
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel,
  checkSignupPhase,
  getMerchantVitals
})(OrgAdmin);
