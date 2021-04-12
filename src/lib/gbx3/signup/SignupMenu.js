import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import {
  toggleAdminLeftPanel,
  updateOrgSignup,
  setSignupStep
} from '../redux/gbx3actions';
import * as config from './signupConfig';

class SignupMenu extends React.Component {

  constructor(props) {
    super(props);
    this.renderSteps = this.renderSteps.bind(this);
    this.state = {
    };
    this.configSteps = props.signupCompleted ? config.postSignupSteps : config.signupSteps;
  }

  renderSteps() {
    const {
      step,
      completed
    } = this.props;

    const items = [];
    Object.entries(this.configSteps).forEach(([key, value]) => {
      const currentStep = +key === +step ? true : false;
      const completedStep = completed.includes(value.slug) ? true : false;
      const stepNumber = <span className='number'>Step {+key + 1}</span>;
      items.push(
        <li
          onClick={() => this.props.setSignupStep(+key)}
          key={key}
          className={`stepButton ${currentStep ? 'currentStep' : ''}`}
        >
          <div className='stepTitleContainer'>
            <span className={`icon icon-${value.icon}`}></span>
            <div className='stepTitle'>{stepNumber} {value.name}</div>
          </div>
          <span className={`icon icon-${completedStep ? 'check green' : 'chevron-right'}`}></span>
        </li>
      );
    });

    return (
      <ul className='builderMenuSteps'>
        <li className='listHeader'>Create Fundraiser Steps</li>
        {items}
      </ul>
    )
  }

  render() {

    const {
      open
    } = this.props;

    return (
      <div className={`leftPanel ${open ? 'open' : 'close'}`}>
        <div className='leftPanelOpenButton' onClick={this.props.toggleAdminLeftPanel}><span className='icon icon-menu'></span></div>
        <div className='leftPanelContainer'>
          <div className={`leftPanelScroller`} style={{ marginTop: 0 }}>
            <GBLink className='leftPanelClose link' onClick={() => this.props.toggleAdminLeftPanel()}>
              <span className='icon icon-x'></span>
            </GBLink>
            {this.renderSteps()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const open = util.getValue(admin, 'open');
  const step = util.getValue(gbx3, 'orgSignup.step', 0);
  const signupCompleted = util.getValue(gbx3, 'orgSignup.signupCompleted');
  const completed = util.getValue(gbx3, 'orgSignup.completed', []);

  return {
    open,
    step,
    signupCompleted,
    completed
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel,
  updateOrgSignup,
  setSignupStep
})(SignupMenu);
