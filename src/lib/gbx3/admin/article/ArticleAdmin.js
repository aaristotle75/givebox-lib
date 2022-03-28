import React from 'react';
import { connect } from 'react-redux';
import Design from './Design';
import BasicBuilder from './BasicBuilder';
import Create from './Create';
import * as util from '../../../common/utility';
import ModalRoute from '../../../modal/ModalRoute';
import {
  toggleModal,
  openLaunchpad  
} from '../../../api/actions';
import {
  updateHelperSteps,
  saveGBX3,
  toggleAdminLeftPanel,
  checkSignupPhase,
  setSignupStep,
  updateOrgSignup  
} from '../../redux/gbx3actions';
import { builderStepsConfig } from './builderStepsConfig';
import HelpDeskButton from '../../../helpdesk/HelpDeskButton';
import OrgModalRoutes from '../../OrgModalRoutes';
import { phases } from '../../signup/signupConfig';

const helpDesk = process.env.REACT_APP_HELP_DESK;
const ENV = process.env.REACT_APP_ENV;

class ArticleAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.toggleBuilder = this.toggleBuilder.bind(this);
    this.openStep = this.openStep.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    const {
      completed,
      share,
      kind,
      previewMode,
      hideSteps,
      signupPhase,
      connectBankSteps,
      transferSteps
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
        if (phaseUpdated) this.openStep('connectBank', 'orgConnectBankSteps');
      } else {
        this.openStep('connectBank', 'orgConnectBankSteps');
      }
    } else if (transferSteps) {
      if (signupPhase !== 'transferMoney') {
        const phaseUpdated = await this.props.updateOrgSignup({ signupPhase: 'transferMoney' }, 'connectBank');
        if (phaseUpdated) this.openStep('identity', 'orgTransferSteps');
      } else {
        this.openStep('identity', 'orgTransferSteps');
      }
    } else {
      this.props.checkSignupPhase(ENV !== 'production' ? testConfig : {});
    }

    /*
    const minStepNotCompleted = this.getMinStepNotCompleted();
    if (!this.props.advancedBuilder && this.props.step !== 'create' && (minStepNotCompleted || minStepNotCompleted === 0) && !share && !previewMode) {
      const updated = await this.props.updateHelperSteps({ step: minStepNotCompleted });
      if (updated && !hideSteps) this.props.toggleModal('gbx3Builder', true);
    }
    */
  }

  componentDidUpdate(prevProps) {
    if (!this.props.advancedBuilder && prevProps.step !== this.props.step) {
      this.props.toggleModal('gbx3Builder', true);
    }
  }

  openStep(value, modalName) {
    this.props.setSignupStep(value, () => {
      this.props.toggleModal(modalName, true);
    });
  }

  getMinStepNotCompleted(forceStep = null) {
    const {
      kind,
      completed
    } = this.props;

    if (forceStep) return forceStep;
    const config = util.getValue(builderStepsConfig, kind, []);
    const notCompleted = [];
    Object.entries(config).forEach(([key, value]) => {
      if (!completed.includes(value.slug) && value.required) {
        notCompleted.push(+key);
      }
    });
    return !util.isEmpty(notCompleted) ? Math.min(...notCompleted) : null;
  }

  async toggleBuilder() {
    const advancedBuilder = this.props.advancedBuilder ? false : true;
    this.props.toggleModal('gbx3Builder', advancedBuilder ? false : true);
    const helperUpdated = await this.props.updateHelperSteps({ advancedBuilder });
    if (helperUpdated) {
      this.props.saveGBX3('article', {
        updateLayout: false
      });
    }
  }

  render() {

    const {
      step,
      advancedBuilder,
      signupStepsDisplay,
      kind
    } = this.props;

    switch (step) {
      case 'create': {
        return (
          <Create />
        )
      }

      case 'design':
      default: {
        return (
          <>
            <HelpDeskButton
              showKB={false}
            />
            <OrgModalRoutes />  
            <ModalRoute
              className='gbx3'
              id={'gbx3Builder'}
              effect='3DFlipVert' style={{ width: '85%' }}
              disallowBgClose={true}
              closeBtnShow={false}
              component={(props) =>
                <BasicBuilder
                  {...props}
                  reloadGBX3={this.props.reloadGBX3}
                  loadGBX3={this.props.loadGBX3}
                  toggleBuilder={this.toggleBuilder}
                  advancedBuilder={advancedBuilder}
                  exitAdmin={this.props.exitAdmin}
                />
              }
            />
            <Design
              reloadGBX3={this.props.reloadGBX3}
              loadGBX3={this.props.loadGBX3}
              toggleBuilder={this.toggleBuilder}
              advancedBuilder={advancedBuilder}
              signupStepsDisplay={signupStepsDisplay}
            />
          </>
        )
      }
    }
  }
}

function mapStateToProps(state, props) {

  // Org Signup Stuff
  const gbx3 = util.getValue(state, 'gbx3', {});
  const orgID = util.getValue(gbx3, 'info.orgID');
  const admin = util.getValue(gbx3, 'admin', {});
  const openAdmin = util.getValue(admin, 'open');
  const launchpad = util.getValue(admin, 'launchpad');
  const signupPhase = util.getValue(gbx3, 'orgSignup.signupPhase');
  const connectBankSteps = util.getValue(gbx3, 'info.connectBankSteps');
  const transferSteps = util.getValue(gbx3, 'info.transferSteps');
  const completedPhases = util.getValue(gbx3, 'orgSignup.completedPhases', []);  
  const underwritingStatus = util.getValue(state, 'resource.gbx3Org.data.underwritingStatus');
  const signupStepsDisplay = ( signupPhase && completedPhases.length < phases.length && !completedPhases.includes('transferMoney') && ( underwritingStatus !== 'approved') ) ? true : false;

  // GBX3 Specific
  const step = util.getValue(gbx3, 'admin.step');
  const share = util.getValue(gbx3, 'info.share');
  const kind = util.getValue(gbx3, 'info.kind', 'fundraiser');
  const hideSteps = util.getValue(gbx3, 'info.hideSteps', false);
  const previewMode = util.getValue(gbx3, 'admin.previewMode');
  const advancedBuilder = util.getValue(gbx3, 'helperSteps.advancedBuilder', false);

  return {
    orgID,
    openAdmin,
    launchpad,
    signupPhase,
    connectBankSteps,
    transferSteps,
    completedPhases,
    signupStepsDisplay,
    step,
    share,
    kind,
    hideSteps,
    previewMode,
    advancedBuilder,
    completed: util.getValue(state, 'gbx3.helperSteps.completed', [])
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateHelperSteps,
  saveGBX3,
  setSignupStep,
  updateOrgSignup,
  toggleAdminLeftPanel,
  checkSignupPhase,
  openLaunchpad  
})(ArticleAdmin);
