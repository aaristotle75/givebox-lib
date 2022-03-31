import React from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Loadable from 'react-loadable';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import Video from '../../common/Video';
import Block from '../blocks/Block';
import Form from '../blocks/Form';
import Scroll from 'react-scroll';
import has from 'has';
import {
  updateInfo,
  updateLayouts,
  updateOrgSignupField
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import { blockTemplates, defaultBlocks } from '../blocks/blockTemplates';
import Footer from '../Footer';

const ResponsiveGridLayout = WidthProvider(Responsive);

class SignupPageGBX extends React.Component {

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
    };
  }

  componentDidMount() {
  }

  saveBlock(args) {
    console.log('execute saveBlock -> ', args);
  }

  onBreakpointChange(breakpoint, cols) {
    console.log('execute breakpoint -> ', breakpoint);
    this.props.updateInfo({ breakpoint });
  }

  widthChange(width, margin, cols) {
    //console.log('execute widthChange', width, margin, cols);
  }

  async layoutChange(layout, layouts) {
    const {
      breakpoint
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
      this.props.updateLayouts('article', layouts);
    }
  }

  renderGridBlocks() {
    const {
      breakpoint,
      blocks
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
              id={`block-${value.name}`}
              key={value.name}
              data-grid={value.grid[breakpoint]}
              ref={ref}
            >
              <Block
                name={value.name}
                blockRef={ref}
                scrollTo={this.props.scrollTo}
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
      blocks
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
            loader: () => import(`../blocks/${value.type}`),
            loading: () => <></>
          });
          const ref = React.createRef();
          items.push(
            <div
              className={`react-grid-item ${util.getValue(value, 'mobileClassName', 'mobileRelativeBlock')}`}
              id={`block-${value.name}`}
              key={value.name}
              ref={ref}
            >
              <Block
                name={value.name}
                blockRef={React.createRef()}
                scrollTo={this.props.scrollTo}
                style={{ position: 'relative' }}
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
          className={`react-grid-item`}
          id='block-paymentForm'
          ref={React.createRef()}
        >
          <Block
            name='paymentForm'
            blockRef={React.createRef()}
            style={{ position: 'relative' }}
            blockType={'article'}
            saveBlock={this.saveBlock}
            backToOrg={this.props.backToOrg}
          >
            <Form />
          </Block>
        </div>
      </Element>
    );

    console.log('execute items -> ', items);
    return items;

  }

  render() {

    const {
      org,
      gbx3,
      completed,
      layouts,
      blocks,
      breakpoint
    } = this.props;

    return (
      <div style={{ maxWidth: '850px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.6)' }} className='gbx3Container'>
        <div>
          <div className='layout-column'>
            <div className='dropArea'>
              {/*
              <ResponsiveGridLayout
                layouts={layouts}
                id='testGrid'
                className="blockGridLayout"
                breakpoints={{desktop: 731, mobile: 730 }}
                cols={{desktop: 12, mobile: 6}}
                rowHeight={10}
                onLayoutChange={this.layoutChange}
                onDragStart={() => {
                  //this.props.updateAdmin({ allowLayoutSave: true });
                }}
                onResizeStart={() => {
                  //this.props.updateAdmin({ allowLayoutSave: true });
                }}
                onBreakpointChange={this.onBreakpointChange}
                onWidthChange={this.widthChange}
                isDraggable={false}
                isResizable={false}
                margin={{desktop: [0, 0], mobile: [0, 0]}}
                containerPadding={{desktop: [0, 0], mobile: [0, 0]}}
                autoSize={true}
                draggableHandle={'.dragHandle'}
                draggableCancel={'.modal'}
                compactType={'vertical'}
                preventCollision={true}
                isDroppable={false}
                resizeHandles={['sw', 'se']}
              >
                {this.renderGridBlocks()}
              </ResponsiveGridLayout>
              */}
              {this.renderRelativeBlocks()}
            </div>
          </div>
          <div className='layout-column'>
            <Footer
              onClickVolunteerFundraiser={false}
            />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
  const org = util.getValue(orgSignup, 'fields.org', {});
  const gbx3 = util.getValue(orgSignup, 'fields.gbx3', {});
  const completed = util.getValue(orgSignup, 'completed', []);
  const breakpoint = util.getValue(state, 'gbx3.info.breakpoint');  
  const blocks = util.getValue(blockTemplates, `article.fundraiser`, {});
  const layouts = {
    desktop: [],
    mobile: []
  };

  Object.entries(blocks).forEach(([key, value]) => {
    const grid = util.getValue(value, 'grid', {});
    if (!util.isEmpty(grid)) {
      if (!util.isEmpty(util.getValue(grid, 'desktop'))) layouts.desktop.push(value.grid.desktop);
      if (!util.isEmpty(util.getValue(grid, 'mobile'))) layouts.mobile.push(value.grid.mobile);
    }
  });

  return {
    org,
    gbx3,
    completed,
    breakpoint,
    blocks,
    layouts
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateLayouts,
  updateOrgSignupField,
  toggleModal
})(SignupPageGBX);
