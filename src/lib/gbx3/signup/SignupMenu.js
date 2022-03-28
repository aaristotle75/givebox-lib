import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import {
  toggleAdminLeftPanel,
  updateOrgSignup,
  setSignupStep
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import * as config from './signupConfig';

class SignupMenu extends React.Component {

  constructor(props) {
    super(props);
    this.renderSteps = this.renderSteps.bind(this);
    const configStep = config.signupPhase[props.signupPhase];
    this.state = {
      configStep,
      stepsTodo: configStep.stepsTodo,
      showStepNumber: configStep.showStepNumber,
      menuHeader: configStep.menuHeader,
      modalName: configStep.modalName
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.signupPhase !== this.props.signupPhase) {
      const configStep = config.signupPhase[this.props.signupPhase];
      this.setState({
        configStep,
        stepsTodo: configStep.stepsTodo,
        showStepNumber: configStep.showStepNumber,
        menuHeader: configStep.menuHeader,
        modalName: configStep.modalName
      });
    }
  }

  renderSteps() {
    const {
      step,
      completed,
      formBuilderSpecific,
      signupPhase
    } = this.props;

    const {
      stepsTodo,
      modalName,
      showStepNumber,
      menuHeader
    } = this.state;

    const items = [];
    Object.entries(stepsTodo).forEach(([key, value]) => {
      const currentStep = +key === +step ? true : false;
      const completedStep = completed.includes(value.slug) ? true : false;

      let stepNumber = <span className='number'>Step {+key + 1}</span>;
      let hideStep = false;

      if (signupPhase === 'postSignup') {
        if (formBuilderSpecific && value.slug === 'previewShare') {
          stepNumber = <span className='number'>Next Step</span>;
        }
        if (formBuilderSpecific && value.slug !== 'previewShare') {
          hideStep = true;
        }
      }

      if (!hideStep) {
        items.push(
          <li
            onClick={() => {
              this.props.setSignupStep(+key, () => {
                this.props.toggleModal(modalName, true);
              });
            }}
            key={key}
            className={`stepButton ${currentStep ? 'currentStep' : ''}`}
          >
            <div className='stepTitleContainer'>
              { value.icon ? <span className={`icon icon-${value.icon}`}></span> : value.customIcon }
              <div className='stepTitle'>{showStepNumber ? stepNumber : null}{value.name}</div>
            </div>
            <span className={`icon icon-${completedStep ? 'check green' : 'chevron-right'}`}></span>
          </li>
        );
      }
    });

    return (
      <ul className='builderMenuSteps'>
        <li 
          style={{ marginTop: formBuilderSpecific ? 0 : null }} 
          className='listHeader'
        >
          {menuHeader}
        </li>
        {items}
      </ul>
    )
  }

  render() {

    const {
      open,
      stepsOnly
    } = this.props;

    if (stepsOnly) return this.renderSteps();

    return (
      <>
        <div className={`leftPanelOpenButton ${open ? 'open' : 'close'}`} onClick={this.props.toggleAdminLeftPanel}><span className='icon icon-menu'></span></div>
        <div className={`leftPanel ${open ? 'open' : 'close'}`}>
          <div className='leftPanelContainer'>
            <div className={`leftPanelScroller`} style={{ marginTop: 0 }}>
              <GBLink className='leftPanelClose link' onClick={() => this.props.toggleAdminLeftPanel()}>
                <span className='icon icon-x'></span>
              </GBLink>
              {this.renderSteps()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

SignupMenu.defaultProps = {
  stepsOnly: false
};

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const open = util.getValue(admin, 'open');
  const step = util.getValue(gbx3, 'orgSignup.step', 0);
  const completed = util.getValue(gbx3, 'orgSignup.completed', []);
  const signupPhase = util.getValue(gbx3, 'orgSignup.signupPhase');

  return {
    open,
    step,
    completed,
    signupPhase
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel,
  updateOrgSignup,
  setSignupStep,
  toggleModal
})(SignupMenu);
