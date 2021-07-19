import React from 'react';
import { connect } from 'react-redux';
import Design from './Design';
import BasicBuilder from './BasicBuilder';
import Create from './Create';
import * as util from '../../../common/utility';
import ModalRoute from '../../../modal/ModalRoute';
import {
  toggleModal
} from '../../../api/actions';
import {
  updateHelperSteps,
  saveGBX3
} from '../../redux/gbx3actions';

class ArticleAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.toggleBuilder = this.toggleBuilder.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    const {
      completed,
      share
    } = this.props;

    const checkIfTheseAreCompleted = ['title', 'themeColor', 'previewShare'];
    const mainStepsCompleted = checkIfTheseAreCompleted.every(c => completed.includes(c));

    if (!this.props.advancedBuilder && this.props.step !== 'create' && !mainStepsCompleted && !share) {
      //const updated = await this.props.updateHelperSteps({ step: !completed.includes('title') ? 0 : 2 });
      const updated = await this.props.updateHelperSteps({ step: 1 });
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

  const step = util.getValue(state, 'gbx3.admin.step');
  const share = util.getValue(state, 'gbx3.info.share');
  const kind = util.getValue(state, 'gbx3.info.kind', 'fundraiser');
  //const advancedBuilder = kind === 'fundraiser' ? util.getValue(state, 'gbx3.helperSteps.advancedBuilder', false) : true;
  const advancedBuilder = util.getValue(state, 'gbx3.helperSteps.advancedBuilder', false);

  return {
    step,
    share,
    kind,
    advancedBuilder,
    completed: util.getValue(state, 'gbx3.helperSteps.completed', [])
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateHelperSteps,
  saveGBX3
})(ArticleAdmin);
