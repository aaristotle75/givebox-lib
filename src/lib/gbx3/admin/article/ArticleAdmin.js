import React from 'react';
import { connect } from 'react-redux';
import Design from './Design';
import BasicBuilder from './BasicBuilder';
import Create from './Create';
import * as util from '../../../common/utility';
import {
  updateHelperSteps
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

  toggleBuilder() {
    const advancedBuilder = this.props.advancedBuilder ? false : true;
    this.props.updateHelperSteps({ advancedBuilder });
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
        if (advancedBuilder) {
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
    advancedBuilder
  }
}

export default connect(mapStateToProps, {
  updateHelperSteps
})(ArticleAdmin);
