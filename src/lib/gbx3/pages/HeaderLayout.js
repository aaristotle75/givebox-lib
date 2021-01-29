import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Loadable from 'react-loadable';
import * as util from '../../common/utility';
import Block from '../blocks/Block';
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
} from '../redux/gbx3actions';

const ResponsiveGridLayout = WidthProvider(Responsive);

class HeaderLayout extends Component {
  constructor(props){
    super(props);
    this.saveBlock = this.saveBlock.bind(this);
    this.renderGridBlocks = this.renderGridBlocks.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.layoutChange = this.layoutChange.bind(this);
    this.gridRef = React.createRef();
    this.state = {
    };
  }

  componentDidMount() {
  }

  async saveBlock(args) {

    const {
      breakpoint
    } = this.props;

    const {
      name,
      blockType,
      block,
      helperBlocks,
      grid,
      opts
    } = args;

    const {
      data,
      content,
      callback,
      options,
      hasBeenUpdated,
      saveGBX3
    } = opts;

    const desktopGrid = breakpoint === 'mobile' && util.getValue(block, 'mobileNoUpdateDesktopGrid') ? { ...util.getValue(block, 'grid.desktop', {}) } :  { ...util.getValue(block, 'grid.desktop', {}), ...grid };

    if (opts.hasBeenUpdated) {
      let checkForUpdatesCount = 1;

      const updated = [];
      const blockToUpdate = {
        ...block,
        content,
        grid: {
          ...util.getValue(block, 'grid', {}),
          desktop: {
          ...util.getValue(block, 'grid.desktop', {}),
          ...desktopGrid
          }
        },
        options: {
          ...block.options,
          ...options
        }
      }
      const blocksUpdated = await this.props.updateBlock(blockType, name, blockToUpdate);
      if (blocksUpdated) updated.push('blocksUpdated');


      if (!util.isEmpty(data)) {
        checkForUpdatesCount = checkForUpdatesCount + 1;
        const dataUpdated = await this.props.updateData(data, 'org');
        if (dataUpdated) updated.push('dataUpdated');
      }

      const helpersAvailable = util.getValue(helperBlocks, 'helpersAvailable', []);
      const helpersCompleted = util.getValue(helperBlocks, 'completed', []);
      const helperIndex = helpersAvailable.findIndex(h => h.blockName === name);

      /*
      if (helperIndex > -1 && !helpersCompleted.includes(name)) {
        checkForUpdatesCount = checkForUpdatesCount + 1;
        helpersCompleted.push(name);
        const helperBlocksUpdated = await this.props.updateHelperBlocks(blockType, { completed: helpersCompleted });
        if (helperBlocksUpdated) updated.push('helpersUpdated');
      }
      */

      if (updated.length === checkForUpdatesCount) {
        if (saveGBX3 && hasBeenUpdated) {
          this.props.saveGBX3(blockType, {
            callback: () => {
              callback(hasBeenUpdated);
              if (helperIndex > -1) {
                this.props.nextHelperStep(blockType);
              }
            },
            updateLayout: !util.isEmpty(grid) ? true : false
          });
        }
        else callback(hasBeenUpdated);
      }
    } else {
      callback(hasBeenUpdated);
    }
  }

  async onBreakpointChange(breakpoint, cols) {
    const {
      editable,
      stage
    } = this.props;
    const infoUpdated = await this.props.updateInfo({ breakpoint });
    if (editable) this.props.updateAdmin({ editBlock: '' });
    if (infoUpdated) this.props.setStyle();
  }

  widthChange(width, margin, cols) {
    //console.log('execute widthChange', width, margin, cols);
  }

  async layoutChange(layout, layouts) {
    const {
      breakpoint,
      editable,
      blockType
    } = this.props;

    const blocks = util.deepClone(this.props.blocks);
    const breakpointLayout = util.getValue(layouts, breakpoint);
    if (breakpointLayout) {
      breakpointLayout.forEach((value) => {
        const block = value.i;
        if (has(blocks, block)) {
          if (has(blocks[block], 'grid')) {
            if (has(blocks[block].grid, breakpoint)) {
              if (!util.isEmpty(blocks[block].grid[breakpoint])) {
                if (has(blocks[block].grid[breakpoint], 'x')) blocks[block].grid[breakpoint].x = value.x;
                if (has(blocks[block].grid[breakpoint], 'y')) blocks[block].grid[breakpoint].y = value.y;
                if (has(blocks[block].grid[breakpoint], 'w')) blocks[block].grid[breakpoint].w = value.w;
                if (has(blocks[block].grid[breakpoint], 'h')) blocks[block].grid[breakpoint].h = value.h;
              }
            }
          }
        }
      });
      if (editable) {
        const updated = [];
        const layoutsUpdated = await this.props.updateLayouts(blockType, layouts);
        const blocksUpdated = await this.props.updateBlocks(blockType, blocks);
        if (layoutsUpdated) updated.push('layoutsUpdated');
        if (blocksUpdated) updated.push('blocksUpdated');
        if (updated.length === 2) this.props.saveGBX3(blockType, {
          callback: () => {
            //this.props.setStyle();
          }
        });
      } else {
        this.props.updateLayouts(blockType, layouts);
      }
    }
  }

  renderGridBlocks() {
    const {
      breakpoint,
      outline,
      blocks,
      loadGBX3,
      reloadGBX3,
      blockType
    } = this.props;

    const items = [];

    Object.entries(blocks).forEach(([key, value]) => {
      if (!util.getValue(value, 'noGrid')) {
        if (util.getValue(value, `grid.${breakpoint}.enabled`)) {
          const BlockComponent = Loadable({
            loader: () => import(`../blocks/${value.type}`),
            loading: () => <></>
          });
          const ref = React.createRef();
          items.push(
            <div
              className={`${outline ? 'outline' : ''}`}
              id={`block-${value.name}`}
              key={value.name}
              data-grid={value.grid[breakpoint]}
              ref={ref}
            >
              <Block
                name={value.name}
                blockRef={ref}
                scrollTo={this.scrollTo}
                loadGBX3={loadGBX3}
                reloadGBX3={reloadGBX3}
                blockType={blockType}
                saveBlock={this.saveBlock}
              >
                <BlockComponent />
              </Block>
            </div>
          );
        }
      }
    });
    return items;
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
      <div>
        <ResponsiveGridLayout
          layouts={layouts}
          id='testGrid'
          className="blockGridLayout"
          breakpoints={{desktop: 736, mobile: 735 }}
          cols={{desktop: 12, mobile: 6}}
          rowHeight={10}
          onLayoutChange={this.layoutChange}
          onBreakpointChange={this.onBreakpointChange}
          onWidthChange={this.widthChange}
          isDraggable={editable}
          isResizable={editable}
          margin={{desktop: [0, 0], mobile: [0, 0]}}
          containerPadding={{desktop: [0, 0], mobile: [0, 0]}}
          autoSize={true}
          draggableHandle={'.dragHandle'}
          draggableCancel={'.modal'}
          compactType={verticalCompact ? 'vertical' : null}
          preventCollision={preventCollision}
          isDroppable={false}
          resizeHandles={['sw', 'se']}
        >
          {this.renderGridBlocks()}
        </ResponsiveGridLayout>
      </div>
    )
  }
};

HeaderLayout.defaultProps = {
  style: {}
};

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const info = util.getValue(gbx3, 'info', {});
  const stage = util.getValue(info, 'stage');
  const blockType = 'header';
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
})(HeaderLayout);
