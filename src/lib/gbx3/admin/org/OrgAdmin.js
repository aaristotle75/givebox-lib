import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Layout from '../../Layout';
import AdminMenu from './AdminMenu';
import Loader from '../../../common/Loader';
import Icon from '../../../common/Icon';
import {
  toggleAdminLeftPanel,
  checkSignupPhase,
  setSignupStep,
  updateOrgSignup,
  openStep
} from '../../redux/gbx3actions';
import {
  toggleModal,
  openLaunchpad
} from '../../../api/actions';
import ModalLink from '../../../modal/ModalLink';
import HelpDeskButton from '../../../helpdesk/HelpDeskButton';
import OrgModalRoutes from '../../OrgModalRoutes';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { CgMenuGridO } from 'react-icons/cg';

const helpDesk = process.env.REACT_APP_HELP_DESK;
const ENV = process.env.REACT_APP_ENV;

class OrgAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    const {
      signupPhase,
      connectBankSteps,
      transferSteps,
      underwritingStatus,
      completedPhases
    } = this.props;

    const testConfig = {
      /*
      forceStep: 2,
      openModal: null,
      openAdmin: null
      */
    };

    if (connectBankSteps) {
      if (signupPhase !== 'connectBank') {
        const phaseUpdated = await this.props.updateOrgSignup({ signupPhase: 'connectBank' }, 'postSignup');
        if (phaseUpdated) this.props.openStep('connectBank', 'orgConnectBankSteps');
      } else {
        this.props.openStep('connectBank', 'orgConnectBankSteps');
      }
    } else if (transferSteps) {
      if (signupPhase !== 'transferMoney') {
        const phaseUpdated = await this.props.updateOrgSignup({ signupPhase: 'transferMoney' }, 'connectBank');
        if (phaseUpdated) this.props.openStep('identity', 'orgTransferSteps');
      } else {
        this.props.openStep('identity', 'orgTransferSteps');
      }
    } else {
      this.props.checkSignupPhase(ENV !== 'production' ? testConfig : {});
    }
  }

  render() {

    const {
      openAdmin: open,
      launchpad
    } = this.props;

    return (
      <>
        <HelpDeskButton
          showKB={false}
        />
        <OrgModalRoutes />
        <div className={`leftPanelOpenButton ${open ? 'open' : 'close'}`} onClick={this.props.toggleAdminLeftPanel}><span className='icon icon-menu'></span></div>
        <div
          onClick={this.props.openLaunchpad}
          className={`tooltip launchpadButton ${launchpad ? 'open' : 'closed'}`}
        >
          <span className='tooltipTop'><i />Dashboard</span>
          <Icon><CgMenuGridO /></Icon>
        </div>
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
  const launchpad = util.getValue(admin, 'launchpad');
  const signupPhase = util.getValue(gbx3, 'orgSignup.signupPhase');
  const connectBankSteps = util.getValue(gbx3, 'info.connectBankSteps');
  const transferSteps = util.getValue(gbx3, 'info.transferSteps');
  const underwritingStatus = util.getValue(state, 'resource.gbx3Org.data.underwritingStatus');
  const completedPhases = util.getValue(state, 'gbx3.orgSignup.completedPhases', []);

  return {
    orgID,
    openAdmin,
    launchpad,
    signupPhase,
    connectBankSteps,
    transferSteps,
    underwritingStatus,
    completedPhases
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel,
  checkSignupPhase,
  openLaunchpad,
  toggleModal,
  setSignupStep,
  updateOrgSignup,
  openStep
})(OrgAdmin);
