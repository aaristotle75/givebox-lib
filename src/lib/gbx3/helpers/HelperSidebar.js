import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Fade from '../../common/Fade';
import GBLink from '../../common/GBLink';
import Icon from '../../common/Icon';
import '../../styles/gbx3Helper.scss';
import {
  checkForHelper
} from '../redux/gbx3actions';
import { GoChecklist } from 'react-icons/go';

class HelperSidebar extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
    }
  }

  componentDidMount() {
  }

  onClick() {
    const {
      blockType,
      isLastStep
    } = this.props;

    this.props.checkForHelper(blockType, isLastStep ? 0 : null);
  }

  render() {

    const {
      helperSidebarShow,
      helperOpen
    } = this.props;

    if (helperSidebarShow && !helperOpen) {
      return (
        <div onClick={this.onClick} className='helperSidebar'>
          <Icon><GoChecklist /></Icon>
        </div>
      )
    } else {
      return <></>;
    }
  }
}

function mapStateToProps(state, props) {

  const blockType = props.blockType;
  const helperBlocks = util.getValue(state, `gbx3.helperBlocks.${blockType}`, {});
  const helperOpen = util.getValue(helperBlocks, 'helperOpen');
  const helperSidebarShow = util.getValue(helperBlocks, `helperSidebarShow`);
  const helperStep = +util.getValue(helperBlocks, 'helperStep', 0);
  const helpersAvailable = util.getValue(helperBlocks, 'helpersAvailable', []);
  const isLastStep = ( helpersAvailable.length - 1 ) === helperStep ? true : false;

  return {
    helperOpen,
    helperSidebarShow,
    isLastStep
  }
}

export default connect(mapStateToProps, {
  checkForHelper
})(HelperSidebar);
