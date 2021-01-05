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
    const {
      config,
      step,
      completed
    } = this.props;

    const items = [];
    Object.entries(config).forEach(([key, value]) => {
      const currentStep = +key === +step ? true : false;
      const completedStep = completed.includes(+key) ? true : false;
      const stepNumber = <span className='number'>Step {+key + 1}</span>;
      items.push(
        <li
          onClick={() => this.props.gotoStep(+key)}
          key={key}
          className={`stepButton ${currentStep ? 'currentStep' : ''}`}
        >
          <div className='stepTitle'>{stepNumber} {value.name}</div>
          <span className={`icon icon-${completedStep ? 'check green' : 'chevron-right'}`}></span>
        </li>
      );
    });

    return (
      <ul className='builderMenuSteps'>
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
