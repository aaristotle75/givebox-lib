import React from 'react';
import { connect } from 'react-redux';
import Design from './Design';
import BasicBuilder from './BasicBuilder';
import Create from './Create';
import * as util from '../../../common/utility';
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

  componentDidMount() {
  }

  async toggleBuilder() {
    const advancedBuilder = this.props.advancedBuilder ? false : true;
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
        if (advancedBuilder || kind !== 'fundraiser') {
          return (
            <Design
              reloadGBX3={this.props.reloadGBX3}
              loadGBX3={this.props.loadGBX3}
              toggleBuilder={this.toggleBuilder}
              advancedBuilder={advancedBuilder}
            />
          )
        } else {
          return (
            <BasicBuilder
              reloadGBX3={this.props.reloadGBX3}
              loadGBX3={this.props.loadGBX3}
              toggleBuilder={this.toggleBuilder}
              advancedBuilder={advancedBuilder}
              exitAdmin={this.props.exitAdmin}
            />
          )
        }
      }
    }
  }
}

function mapStateToProps(state, props) {

  const advancedBuilder = util.getValue(state, 'gbx3.helperSteps.advancedBuilder', false);

  return {
    advancedBuilder,
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser')
  }
}

export default connect(mapStateToProps, {
  updateHelperSteps,
  saveGBX3
})(ArticleAdmin);
