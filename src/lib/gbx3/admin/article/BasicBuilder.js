import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import Image from '../../../common/Image';
import LinearBar from '../../../common/LinearBar';
import {
  updateHelperSteps
} from '../../redux/gbx3actions';
import Toggle from 'react-toggle';
import BasicBuilderSteps from './BasicBuilderSteps';
import { builderStepsConfig } from './builderStepsConfig';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class BasicBuilder extends React.Component {

  constructor(props) {
    super(props);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.stepCompleted = this.stepCompleted.bind(this);
    this.state = {
    };
    this.config = util.getValue(builderStepsConfig, props.kind, []);
    this.steps = this.config.length - 1;
    const mobile = props.breakpoint === 'mobile' ? true : false;
  }

  previousStep() {
    const {
      step
    } = this.props;
    const prevStep = step > 0 ? step - 1 : step;
    this.props.updateHelperSteps({ step: prevStep });
  }

  nextStep() {
    const {
      step
    } = this.props;
    const nextStep = step < +this.steps ? step + 1 : step;
    return nextStep;
  }

  async stepCompleted(step) {
    let updated = false;
    const completed = [ ...this.props.completed ];
    if (!completed.includes(step)) {
      completed.push(step);
      updated = await this.props.updateHelperSteps({ completed });
    } else {
      updated = true;
    }
    return updated;
  }

  render() {

    const {
      step,
      completed,
      openAdmin
    } = this.props;

    const stepProgress = 20; //parseInt((numCompleted / numStepsTodo) * 100);

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
            Step Name 1 of 5 Completed
          </div>
        </div>
        <BasicBuilderSteps
          key={'basicBuilder'}
          nextStep={this.nextStep}
          previousStep={this.previousStep}
          stepCompleted={this.stepCompleted}
          config={this.config}
          steps={this.steps}
          completed={completed}
          openAdmin={openAdmin}
          exitAdmin={this.props.exitAdmin}
          toggleBuilder={this.props.toggleBuilder}
        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const breakpoint = util.getValue(gbx3, 'info.breakpoint');
  const admin = util.getValue(gbx3, 'admin', {});
  const articleID = util.getValue(gbx3, 'info.articleID');
  const previewMode = util.getValue(admin, 'previewMode');
  const previewDevice = util.getValue(admin, 'previewDevice');
  const openAdmin = util.getValue(admin, 'open');
  const createType = util.getValue(admin, 'createType');

  return {
    breakpoint,
    articleID,
    previewMode,
    previewDevice,
    openAdmin,
    createType,
    completed: util.getValue(state, 'gbx3.helperSteps.completed', []),
    step: util.getValue(state, 'gbx3.helperSteps.step', 0),
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser')
  }
}

export default connect(mapStateToProps, {
  updateHelperSteps
})(BasicBuilder);
