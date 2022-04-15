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
  updateOrgSignup,
  openStep
} from '../../redux/gbx3actions';
import {
  savePrefs
} from '../../../api/helpers';
import { builderStepsConfig } from './builderStepsConfig';
import HelpDeskButton from '../../../helpdesk/HelpDeskButton';
import { phases } from '../../signup/signupConfig';

const helpDesk = process.env.REACT_APP_HELP_DESK;
const ENV = process.env.REACT_APP_ENV;

class ArticleAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.toggleBuilder = this.toggleBuilder.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    const {
      share,
      previewMode,
      step,
      completed,
      advancedBuilder
    } = this.props;

    if ( !advancedBuilder && !share && !previewMode && ( step === 'create' || util.isEmpty(completed) ) ) {
      const updated = await this.props.updateHelperSteps({ step: 0 });
      if (updated) this.props.toggleModal('gbx3Builder', true);
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.advancedBuilder && prevProps.step !== this.props.step) {
      this.props.toggleModal('gbx3Builder', true);
    }
  }

  async toggleBuilder() {
    const advancedBuilder = this.props.advancedBuilder ? false : true;
    this.props.toggleModal('gbx3Builder', advancedBuilder ? false : this.props.builderStep === 0 ? true : false);
    const helperUpdated = await this.props.updateHelperSteps({ advancedBuilder });
    this.props.savePrefs({ builderPref: advancedBuilder ? 'advanced' : 'helperSteps' });
    /*
    if (helperUpdated) {
      this.props.saveGBX3('article', {
        updateLayout: false
      });
    }
    */
  }

  render() {

    const {
      step,
      advancedBuilder
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
            />
          </>
        )
      }
    }
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const step = util.getValue(gbx3, 'admin.step');
  const share = util.getValue(gbx3, 'info.share');
  const kind = util.getValue(gbx3, 'info.kind', 'fundraiser');
  const hideSteps = util.getValue(gbx3, 'info.hideSteps', false);
  const previewMode = util.getValue(gbx3, 'admin.previewMode');
  const advancedBuilder = util.getValue(gbx3, 'helperSteps.advancedBuilder', false);

  return {
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
  openLaunchpad,
  openStep,
  savePrefs
})(ArticleAdmin);
