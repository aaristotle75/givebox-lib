import React from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Loadable from 'react-loadable';
import * as util from '../common/utility';
import Block from './blocks/Block';
import Scroll from 'react-scroll';
import has from 'has';
import {
  addBlock,
  setStyle,
  updateAdmin,
  updateLayouts,
  updateHelperBlocks,
  nextHelperStep,
  updateBlocks,
  updateBlock,
  updateData,
  updateInfo,
  saveGBX3
} from './redux/gbx3actions';
import Header from './pages/Header';
import Pages from './pages/Pages';
import Footer from './pages/Footer';

class Org extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {

    const {
      layouts,
      verticalCompact,
      preventCollision,
      editable,
      hasAccessToEdit,
      breakpoint,
      stage
    } = this.props;

    return (
      <div className='gbx3Org'>
        <Header />
        <main className='gbx3OrgContent'>
          <Pages />
        </main>
        <Footer />
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const info = util.getValue(gbx3, 'info', {});
  const stage = util.getValue(info, 'stage');
  const blockType = 'org';
  const layouts = util.getValue(gbx3, `layouts.${blockType}`, {});
  const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const preventCollision = util.getValue(admin, 'preventCollision');
  const verticalCompact = util.getValue(admin, 'verticalCompact');
  const outline = util.getValue(admin, 'outline');
  const breakpoint = util.getValue(info, 'breakpoint');

  return {
    stage,
    hasAccessToEdit,
    layouts,
    editable,
    preventCollision,
    verticalCompact,
    outline,
    breakpoint,
    blockType,
    blocks,
    globals: util.getValue(gbx3, 'globals', {})
  }
}

export default connect(mapStateToProps, {
  updateLayouts,
  updateHelperBlocks,
  nextHelperStep,
  updateBlocks,
  updateBlock,
  updateData,
  updateInfo,
  saveGBX3,
  addBlock,
  setStyle,
  updateAdmin
})(Org);
