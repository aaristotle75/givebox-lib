import React from 'react';
import { connect } from 'react-redux';
import * as config from './signupConfig';
import * as util from '../../common/utility';
import Loader from '../../common/Loader';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import {
  updateOrgSignup,
  updateOrgSignupField,
  saveOrg,
  updateAdmin
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import {
  getResource,
  sendResource
} from '../../api/helpers';
import LinearBar from '../../common/LinearBar';

const GBX3_URL = process.env.REACT_APP_ENV === 'local' ? process.env.REACT_APP_GBX_SHARE : process.env.REACT_APP_GBX_URL;

class StepsWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.renderChildren = this.renderChildren.bind(this);
    this.gotoNextStep = this.gotoNextStep.bind(this);
    this.getNextStep = this.getNextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.stepCompleted = this.stepCompleted.bind(this);
    this.getNumStepsCompleted = this.getNumStepsCompleted.bind(this);
    this.state = {
      error: false,
      saving: false
    };

    const configStep = config.signupPhase[props.signupPhase];
    this.stepsTodo = configStep.stepsTodo;
    this.numStepsTodo = this.stepsTodo.length;
    this.requiredSteps = configStep.requiredSteps;
    this.stepModalName = configStep.modalName;
    this.showStepNumber = configStep.showStepNumber;
    this.menuHeader = configStep.menuHeader;
  }

  gotoNextStep() {
    const {
      step
    } = this.props;
    this.props.updateOrgSignup({ step: this.nextStep(step) });
  }

  getNextStep() {
    const {
      step
    } = this.props;

    const nextStep = this.nextStep(step);
    return util.getValue(this.stepsTodo[nextStep], 'name');
  }

  previousStep(step) {
    const prevStep = step > 0 ? step - 1 : step;
    this.props.updateOrgSignup({ step: prevStep });
  }

  nextStep(step) {
    const numSteps = +(this.numStepsTodo - 1);
    const nextStep = step < numSteps ? step + 1 : step;
    return nextStep;
  }

  async stepCompleted(step, saveOrg = true) {
    let updated = false;
    const completed = [ ...this.props.completed ];
    if (!completed.includes(step)) {
      completed.push(step);
      updated = await this.props.updateOrgSignup({ completed });
      if (updated && saveOrg) this.props.saveOrg({ orgUpdated: true });
    } else {
      updated = true;
    }
    return updated;
  }

  renderChildren() {
    const {
      open,
      breakpoint,
      isMobile,
      step,
      acceptedTerms,
      claimOrgID,
      validTaxID,
      completed,
      fields,
      createdArticleID,
      signupPhase,
      completedPhases
    } = this.props;

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        // Step Config
        stepsTodo: this.stepsTodo,
        numStepsTodo: this.numStepsTodo,
        requiredSteps: this.requiredSteps,
        stepModalName: this.stepModalName,
        showStepNumber: this.showStepNumber,
        menuHeader: this.menuHeader,

        // Functions
        gotoNextStep: this.gotoNextStep,
        getNextStep: this.getNextStep,
        previousStep: this.previousStep,
        nextStep: this.nextStep,
        stepCompleted: this.stepCompleted,

        // Dispatch actions
        updateOrgSignup: this.props.updateOrgSignup,
        updateOrgSignupField: this.props.updateOrgSignupField,
        getResource: this.props.getResource,
        sendResource: this.props.sendResource,
        saveOrg: this.props.saveOrg,
        toggleModal: this.props.toggleModal,
        updateAdmin: this.props.updateAdmin,

        // Props
        open,
        breakpoint,
        isMobile,
        step,
        acceptedTerms,
        claimOrgID,
        validTaxID,
        completed,
        fields,
        createdArticleID,
        signupPhase,
        completedPhases
      })
    );
    return childrenWithProps;
  }

  getNumStepsCompleted() {
    const {
      completed
    } = this.props;

    let num = 0;
    Object.entries(this.stepsTodo).forEach(([key, value]) => {
      if (completed.includes(value.slug)) {
        num = num + 1;
      }
    })
    return num;
  }

  render() {

    const numCompleted = this.getNumStepsCompleted();
    const stepProgress = parseInt((numCompleted / this.numStepsTodo) * 100);

    return (
      <div className='gbx3Steps modalWrapper'>
        <div className='flexCenter' style={{ marginBottom: 10 }}>
          <Image size='thumb' maxSize={40} url={'https://cdn.givebox.com/givebox/public/gb-logo5.png'} alt='Givebox' />
        </div>
        <div className='progressWrapper'>
          <LinearBar
            progress={stepProgress}
          />
          <div className='progressStatusText'>
            {this.menuHeader} - {numCompleted} of {this.numStepsTodo} Completed
          </div>
        </div>
        {this.renderChildren()}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const open = util.getValue(state, 'gbx3.admin.open');
  const breakpoint = util.getValue(state, 'gbx3.info.breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
  const step = util.getValue(orgSignup, 'step', 0);
  const acceptedTerms = util.getValue(orgSignup, 'acceptedTerms');
  const claimOrgID = util.getValue(orgSignup, 'claimOrgID', null);
  const validTaxID = util.getValue(orgSignup, 'validTaxID', null);
  const completed = util.getValue(orgSignup, 'completed', []);
  const fields = util.getValue(orgSignup, 'fields', {});
  const createdArticleID = util.getValue(orgSignup, 'createdArticleID');
  const signupPhase = util.getValue(orgSignup, 'signupPhase');
  const completedPhases = util.getValue(orgSignup, 'completedPhases', []);

  return {
    open,
    breakpoint,
    isMobile,
    step,
    acceptedTerms,
    claimOrgID,
    validTaxID,
    completed,
    fields,
    createdArticleID,
    signupPhase,
    completedPhases
  }
}

export default connect(mapStateToProps, {
  updateOrgSignup,
  updateOrgSignupField,
  getResource,
  sendResource,
  saveOrg,
  toggleModal,
  updateAdmin
})(StepsWrapper);
