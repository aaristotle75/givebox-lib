import React from 'react';
import { connect } from 'react-redux';
import Design from './Design';
import BasicBuilder from './BasicBuilder';
import Create from './Create';
import * as util from '../../../common/utility';

class ArticleAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
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
            />
          )
        } else {
          return (
            <BasicBuilder
              reloadGBX3={this.props.reloadGBX3}
              loadGBX3={this.props.loadGBX3}
            />
          )
        }
      }
    }
  }
}

function mapStateToProps(state, props) {

  const advancedBuilder = util.getValue(state, 'gbx3.admin.advancedBuilder', false);

  return {
    advancedBuilder
  }
}

export default connect(mapStateToProps, {
})(ArticleAdmin);
