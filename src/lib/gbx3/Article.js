import React from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Loadable from 'react-loadable';
import * as util from '../common/utility';
import Block from './blocks/Block';
import Form from './blocks/Form';
import Scroll from 'react-scroll';
import has from 'has';
import {
  addBlock,
  setStyle,
  updateAdmin,
  updateLayouts,
  updateBlocks,
  updateBlock,
  updateData,
  updateInfo,
  saveGBX3,
  saveReceipt
} from './redux/gbx3actions';
import OrgModalRoutes from './OrgModalRoutes';
import Footer from './Footer';

const ResponsiveGridLayout = WidthProvider(Responsive);

class Article extends React.Component {

  constructor(props) {
    super(props);
    this.saveBlock = this.saveBlock.bind(this);
    this.renderGridBlocks = this.renderGridBlocks.bind(this);
    this.renderRelativeBlocks = this.renderRelativeBlocks.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.layoutChange = this.layoutChange.bind(this);
    this.gridRef = React.createRef();
    this.state = {
      allowLayoutSave: false
    };
  }

  componentDidMount() {
    const {
      checkout
    } = this.props;
    if (checkout) {
      this.props.updateInfo({ checkout: false });
      this.props.scrollTo('checkout');
    } else {
      util.toTop('gbx3Layout');
    }
  }

  async saveBlock(args) {

    const {
      breakpoint
    } = this.props;

    const {
      name,
      blockType,
      block,
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
        const dataUpdated = await this.props.updateData(data);
        if (dataUpdated) updated.push('dataUpdated');
      }

      if (updated.length === checkForUpdatesCount) {
        if (saveGBX3 && hasBeenUpdated) {
          this.props.saveGBX3(blockType, {
            callback: () => {
              callback(hasBeenUpdated, content);
              this.props.saveReceipt();
            },
            updateLayout: !util.isEmpty(grid) ? true : false
          });
        }
        else callback(hasBeenUpdated, content);
      }
    } else {
      callback(hasBeenUpdated, content);
    }
  }

  async onBreakpointChange(breakpoint, cols) {
    const {
      editable
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
      allowLayoutSave,
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
      if (editable && allowLayoutSave) {
        const updated = [];
        const layoutsUpdated = await this.props.updateLayouts(blockType, layouts);
        const blocksUpdated = await this.props.updateBlocks(blockType, blocks);
        if (layoutsUpdated) updated.push('layoutsUpdated');
        if (blocksUpdated) updated.push('blocksUpdated');
        if (updated.length === 2) {
          this.props.saveGBX3(blockType, {
            callback: () => {
              //this.props.setStyle();
            }
          });
        }
        this.props.updateAdmin({ allowLayoutSave: false });
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
      reloadGBX3
    } = this.props;

    const items = [];

    Object.entries(blocks).forEach(([key, value]) => {
      if (!util.getValue(value, 'noGrid')) {
        if (util.getValue(value, `grid.${breakpoint}.enabled`)) {
          const BlockComponent = Loadable({
            loader: () => import(`./blocks/${value.type}`),
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
                scrollTo={this.props.scrollTo}
                reloadGBX3={reloadGBX3}
                blockType={'article'}
                saveBlock={this.saveBlock}
                backToOrg={this.props.backToOrg}
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

  renderRelativeBlocks() {
    const {
      breakpoint,
      outline,
      blocks,
      reloadGBX3
    } = this.props;

    const items = [];
    const Element = Scroll.Element;

    if (!util.isEmpty(blocks) && breakpoint === 'mobile') {
      const relativeBlocks = [];
      Object.entries(blocks).forEach(([key, value]) => {
        if (util.getValue(value, 'mobileRelativeBlock')) {
          relativeBlocks.push(value);
        }
      });
      util.sortByField(relativeBlocks, 'mobileRelativeBlock', 'ASC');
      if (!util.isEmpty(relativeBlocks)) {
        Object.entries(relativeBlocks).forEach(([key, value]) => {
          const BlockComponent = Loadable({
            loader: () => import(`./blocks/${value.type}`),
            loading: () => <></>
          });
          const ref = React.createRef();
          items.push(
            <div
              className={`react-grid-item ${util.getValue(value, 'mobileClassName', 'mobileRelativeBlock')} ${outline ? 'outline' : ''}`}
              id={`block-${value.name}`}
              key={value.name}
              ref={ref}
            >
              <Block
                name={value.name}
                blockRef={React.createRef()}
                scrollTo={this.props.scrollTo}
                style={{ position: 'relative' }}
                reloadGBX3={reloadGBX3}
                blockType={'article'}
                saveBlock={this.saveBlock}
                backToOrg={this.props.backToOrg}
              >
                <BlockComponent />
              </Block>
            </div>
          );
        });
      }
    }

    items.push(
      <Element key='paymentForm' name='checkout'>
        <div
          className={`react-grid-item ${outline ? 'outline' : ''}`}
          id='block-paymentForm'
          ref={React.createRef()}
        >
          <Block
            name='paymentForm'
            blockRef={React.createRef()}
            style={{ position: 'relative' }}
            reloadGBX3={reloadGBX3}
            blockType={'article'}
            saveBlock={this.saveBlock}
            backToOrg={this.props.backToOrg}
          >
            <Form />
          </Block>
        </div>
      </Element>
    );

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

    const isEditable = hasAccessToEdit && editable ? true : false;

    return (
      <div>
        <OrgModalRoutes loadGBX3={this.props.loadGBX3} />
        <div className='layout-column'>
          <div
            id='gbx3DropArea'
            ref={this.gridRef}
            className={`dropArea`}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (isEditable) {
                const w = e.clientX;
                const h = e.clientY;
                const block = e.dataTransfer.getData('text');
                const current = this.gridRef.current;
                if (current.classList.contains('dragOver')) current.classList.remove('dragOver');
                this.props.addBlock('article', block, w, h, this.gridRef);
              }
            }}
          >
            <div className='dragOverText'>Drop Page Element Here</div>
            <ResponsiveGridLayout
              layouts={layouts}
              id='testGrid'
              className="blockGridLayout"
              breakpoints={{desktop: 731, mobile: 730 }}
              cols={{desktop: 12, mobile: 6}}
              rowHeight={10}
              onLayoutChange={this.layoutChange}
              onDragStart={() => {
                this.props.updateAdmin({ allowLayoutSave: true });
              }}
              onResizeStart={() => {
                this.props.updateAdmin({ allowLayoutSave: true });
              }}
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
            {this.renderRelativeBlocks()}
          </div>
        </div>
        <div className='layout-column'>
          <Footer
            onClickVolunteerFundraiser={this.props.onClickVolunteerFundraiser}
          />
        </div>
        {breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const info = util.getValue(gbx3, 'info', {});
  const checkout = util.getValue(info, 'checkout');
  const stage = util.getValue(info, 'stage');
  const blockType = 'article';
  const layouts = util.getValue(gbx3, `layouts.${blockType}`, {});
  const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const allowLayoutSave = util.getValue(admin, 'allowLayoutSave');
  const preventCollision = util.getValue(admin, 'preventCollision');
  const verticalCompact = util.getValue(admin, 'verticalCompact');
  const outline = util.getValue(admin, 'outline');
  const breakpoint = util.getValue(info, 'breakpoint');

  return {
    stage,
    checkout,
    hasAccessToEdit,
    layouts,
    editable,
    allowLayoutSave,
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
  updateBlocks,
  updateBlock,
  updateData,
  updateInfo,
  saveGBX3,
  saveReceipt,
  addBlock,
  setStyle,
  updateAdmin
})(Article);
