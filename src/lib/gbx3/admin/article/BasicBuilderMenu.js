import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import {
  toggleModal
} from '../../../api/actions';
import {
  toggleAdminLeftPanel,
  updateHelperSteps
} from '../../redux/gbx3actions';
import { builderStepsConfig } from './builderStepsConfig';

class AdminMenu extends React.Component {

  constructor(props) {
    super(props);
    this.renderSteps = this.renderSteps.bind(this);
    this.openStep = this.openStep.bind(this);
    this.state = {
    };
    this.config = util.getValue(builderStepsConfig, props.kind, []);
    this.steps = this.config.length - 1;
  }

  async openStep(step) {
    const updated = await this.props.updateHelperSteps({ step: +step });
    if (updated) this.props.toggleModal('gbx3Builder', true);
  }

  renderSteps() {
    const {
      step,
      completed
    } = this.props;

    const items = [];
    Object.entries(this.config).forEach(([key, value]) => {
      const currentStep = +key === +step ? true : false;
      const completedStep = completed.includes(+key) ? true : false;
      const stepNumber = <span className='number'>Step {+key + 1}</span>;
      items.push(
        <li
          onClick={() => this.openStep(+key)}
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
        <li className='listHeader'>Fundraiser Steps</li>
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
    openAdmin,
    completed: util.getValue(state, 'gbx3.helperSteps.completed', []),
    step: util.getValue(state, 'gbx3.helperSteps.step', 0),
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser')
  }
}

export default connect(mapStateToProps, {
  toggleAdminLeftPanel,
  updateHelperSteps,
  toggleModal
})(AdminMenu);
