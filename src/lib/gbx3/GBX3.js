import React from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import '../styles/gbx3modal.scss';
import {
  util,
  sendResource,
  getResource,
  setCustomProp,
  types,
  Loader,
  toggleModal
} from '../';
import AdminToolbar from './tools/AdminToolbar';
import { defaultOptions, initBlocks } from './config';
import Loadable from 'react-loadable';
import has from 'has';

const ResponsiveGridLayout = WidthProvider(Responsive);

class GBXClass extends React.Component {

  constructor(props) {
    super(props);
    this.layoutChange = this.layoutChange.bind(this);
    this.breakpointChange = this.breakpointChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.toggleOutline = this.toggleOutline.bind(this);
    this.toggleCollision = this.toggleCollision.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
    this.saveLayout = this.saveLayout.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.addBlock = this.addBlock.bind(this);
    this.removeBlock = this.removeBlock.bind(this);
    this.renderBlocks = this.renderBlocks.bind(this);
    this.updateBlock = this.updateBlock.bind(this);
    this.amountsCallback = this.amountsCallback.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.updateData = this.updateData.bind(this);
    this.getData = this.getData.bind(this);
    this.setStyle = this.setStyle.bind(this);

    const layouts = {
      desktop: [],
      mobile: [],
    };

    const givebox = props.kind ? util.getValue(props.article, 'giveboxSettings', {}) : util.getValue(props.article, 'givebox', {});
    const customTemplate = util.getValue(givebox, 'customTemplate', {});
    const customBlocks = util.getValue(customTemplate, 'blocks', []);
    const customOptions = util.getValue(customTemplate, 'options', {});
    const blocks = !util.isEmpty(customBlocks) ? customBlocks : initBlocks[props.kind];
    const options = { ...defaultOptions, ...customOptions };
    const settings = util.getValue(props.article, 'giveboxSettings', {});
    const primaryColor = util.getValue(settings, 'primaryColor');
    options.primaryColor = options.primaryColor || primaryColor;


    Object.entries(blocks).forEach(([key, value]) => {
      layouts.desktop.push(value.grid.desktop);
      layouts.mobile.push(value.grid.mobile);
    });

    this.state = {
      options,
      blocks,
      layouts,
      data: {},
      breakpoint: 'desktop',
      success: false,
      error: false,
      editable: true,
      showOutline: false,
      collision: true,
      collapse: false
    }

    this.gridRef = React.createRef();
    this.blockRefs = {};
  }

  componentDidMount() {
    const gridWidth = this.gridRef.current.clientWidth;
    if (gridWidth < this.props.breakpointWidth) {
      this.setState({ breakpoint: 'mobile' });
    }
    this.setStyle();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  setStyle() {
    const options = this.state.options;
    const color = util.getValue(options, 'primaryColor');
    if (color) {
      const rgb = util.hexToRgb(color);
      const color2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .1)`;
      const styleEl = document.head.appendChild(document.createElement('style'));
      styleEl.innerHTML = `
        .radio:checked + label:after {
          border: 1px solid ${color} !important;
          background: ${color};
        }

        .dropdown .dropdown-content.customColor::-webkit-scrollbar-thumb {
          background-color: ${color};
        }

        .amountsSection ::-webkit-scrollbar-thumb {
          background-color: ${color2};
        }

        .modalContent.gbx3 .ticketAmountRow,
        .modalContent.gbx3 .amountRow {
          border-left: 4px solid ${color} !important;
        }

        .gbx3 button.modalToTop:hover {
          background: ${color};
        }

      `;
    }
  }

  success() {
    this.setState({ success: true });
    this.timeout = setTimeout(() => {
      this.setState({ success: false });
      this.timeout = null;
    }, 2500);
  }

  error() {
    this.setState({ error: true });
    this.timeout = setTimeout(() => {
      this.setState({ error: false });
      this.timeout = null;
    }, 2500);
  }

  breakpointChange(breakpoint, cols) {
    this.setState({ breakpoint });
  }

  widthChange(width, margin, cols) {
    //console.log('execute widthChange', width, margin, cols);
  }

  toggleEditable() {
    const editable = this.state.editable ? false : true;
    const showOutline = !editable ? false : this.state.showOutline;
    this.setState({ editable, showOutline });
  }

  toggleOutline() {
    const showOutline = this.state.showOutline ? false : true;
    this.setState({ showOutline })
  }

  toggleCollision() {
    const collision = this.state.collision ? false : true;
    this.setState({ collision })
  }

  toggleCollapse() {
    const collapse = this.state.collapse ? false : true;
    this.setState({ collapse })
  }

  resetLayout() {
    const blocks = initBlocks[this.props.kind];
    this.setState({ blocks }, this.saveLayout(true));
  }

  layoutChange(layout, layouts) {
    const breakpoint = this.state.breakpoint;
    const blocks = this.state.blocks;
    const breakpointLayout = util.getValue(layouts, breakpoint);
    if (breakpointLayout) {
      breakpointLayout.forEach((value) => {
        const index = blocks.findIndex(b => b.name === value.i);
        if (index !== -1) {
          const block = util.getValue(blocks, index);
          if (!util.isEmpty(block)) {
            const grid = util.getValue(block, 'grid', {});
            const gridBreak = util.getValue(grid, breakpoint);
            if (!util.isEmpty(gridBreak)) {
              gridBreak.x = value.x;
              gridBreak.y = value.y;
              gridBreak.w = value.w;
              gridBreak.h = value.h;
            }
          }
        }
      });
      this.setState({ blocks, layouts });
    }
  }

  saveLayout(reset = false) {
    // Need to handle creating new articles
    const data = this.getData(reset);
    const id = util.getValue(this.props.article, 'ID', null);

    if (this.props.autoSave) {
      this.props.sendResource(this.props.resourceName, {
        id: id ? [id] : null,
        orgID: this.props.orgID,
        data,
        method: id ? 'patch' : 'post',
        callback: (res, err) => {
          if (this.props.save) this.props.save(id, data, this.state.blocks, res, err);
        }
      });
    } else {
      if (this.props.save) {
        this.props.save(id, data, this.state.blocks);
      } else {
        console.error('Not saved: this.props.save not found');
      }
    }
  }

  getData(reset) {
    const {
      options,
      data,
      blocks
    } = this.state;

    data.giveboxSettings = {
      primaryColor: util.getValue(options, 'primaryColor', null),
      customTemplate: {
        options: reset ? {} : options,
        blocks: reset ? {} : blocks
      }
    };
    return data;
  }

  updateData(obj = {}) {
    const data = { ...this.state.data, ...obj };
    console.log('execute', data);
  }

  addBlock(block) {
    const blocks = this.state.blocks;
    const breakpoint = this.state.breakpoint;
    console.log('Add Block', block, breakpoint);
    /*
    blocks[block].grid[breakpoint].enabled = true;
    this.setState({ blocks });
    */
  }

  removeBlock(block) {
    const blocks = this.state.blocks;
    const breakpoint = this.state.breakpoint;
    blocks[block].grid[breakpoint].enabled = false;
    this.setState({ blocks });
  }

  updateBlock(name, info = {}, options = {}, callback, updateSpecificGrid) {
    const blocks = this.state.blocks;
    const index = blocks.findIndex(b => b.name === name);
    if (index !== -1) {
      const block = blocks[index];
      block.options = { ...block.options, ...options };
      const mobile = block.grid.mobile;
      const desktop = block.grid.desktop;
      const current = block.grid[this.state.breakpoint];

      if (!has(mobile, 'info') || !updateSpecificGrid) {
        mobile.info = info;
      }

      if (!has(desktop, 'info') || !updateSpecificGrid) {
        desktop.info = info;
      }

      if (!has(current, 'info')) {
        current.info = info;
      } else {
        current.info = { ...current.info, ...info };
      }
      this.setState({ blocks }, () => {
        if (callback) callback();
      });
    }
  }

  renderBlocks(enabled = true) {
    const {
      blocks,
      breakpoint,
      showOutline,
      editable,
      options
    } = this.state;

    const items = [];
    const article = this.props.article;
    Object.entries(blocks).forEach(([key, value]) => {
      if (value.grid[breakpoint].enabled === enabled) {
        const BlockComponent = Loadable({
          loader: () => import(`./blocks/${value.type}`),
          loading: () => <></>
        });
        const fieldValue = util.getValue(article, value.field);
        const ref = React.createRef();
        items.push(
          <div
            className={`${showOutline ? 'outline' : ''}`}
            id={`block-${value.name}`}
            key={value.name}
            data-grid={value.grid[breakpoint]}
            ref={ref}
          >
            <BlockComponent
              name={value.name}
              title={value.title}
              type={value.type}
              field={value.field}
              content={value.content}
              overflow={value.overflow}
              options={value.options}
              globalOptions={options}
              fieldValue={fieldValue}
              editable={editable}
              toggleEditable={this.toggleEditable}
              updateBlock={this.updateBlock}
              article={this.props.article}
              kind={this.props.kind}
              blockRef={ref}
              info={util.getValue(value.grid[breakpoint], 'info', {})}
              amountsCallback={this.amountsCallback}
              primaryColor={options.primaryColor}
              updateData={this.updateData}
            />
          </div>
        );
      }
    });
    return items;
  }

  amountsCallback(obj) {
    console.log('execute amountsCallback', obj);
  }

  updateOptions(obj = {}) {
    const options = { ...this.state.options, ...obj };
    this.setState({ options });
  }

  render() {

    const {
      layouts,
      editable,
      showOutline,
      options,
      collision,
      collapse
    } = this.state;

    return (
      <div style={util.getValue(options, 'gbxStyle', {})} className='gbx3'>
        <AdminToolbar
          renderBlocks={this.renderBlocks}
          toggleEditable={this.toggleEditable}
          toggleOutline={this.toggleOutline}
          toggleCollision={this.toggleCollision}
          toggleCollapse={this.toggleCollapse}
          editable={editable}
          showOutline={showOutline}
          collision={collision}
          collapse={collapse}
          resetLayout={this.resetLayout}
          saveLayout={this.saveLayout}
          access={this.props.access}
          updateOptions={this.updateOptions}
          options={options}
          toggleModal={this.props.toggleModal}
          setCustomProp={this.props.setCustomProp}
          primaryColor={this.props.primaryColor}
        />
        <div
          ref={this.gridRef}
          style={{ marginBottom: 20 }}
          className={`column dropArea ${editable ? 'editable' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            if (editable) {
              const block = e.dataTransfer.getData('block');
              e.preventDefault();
              const current = this.gridRef.current;
              if (current.classList.contains('dragOver')) current.classList.remove('dragOver');
              this.addBlock(block);
            }
          }}
        >
          <div className='dragOverText'>Drop Page Element Here</div>
          <ResponsiveGridLayout
            id='testGrid'
            className="blockGridLayout"
            layouts={layouts}
            breakpoints={{desktop: 701, mobile: 700 }}
            cols={{desktop: 12, mobile: 6}}
            rowHeight={15}
            onLayoutChange={this.layoutChange}
            onBreakpointChange={this.breakpointChange}
            onWidthChange={this.widthChange}
            isDraggable={editable}
            isResizable={editable}
            isDroppable={false}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            autoSize={true}
            draggableHandle={'.dragHandle'}
            draggableCancel={'.modal'}
            verticalCompact={collapse}
            preventCollision={collision}
          >
            {this.renderBlocks()}
          </ResponsiveGridLayout>
        </div>
      </div>
    )
  }

}

class GBX extends React.Component {

  componentDidMount() {
    if (util.isEmpty(this.props.article) && this.props.kindID) {
      this.props.getResource(this.props.resourceName, {
        id: [this.props.kindID],
        orgID: this.props.orgID,
        callback: (res, err) => {
          if (!err && !util.isEmpty(res)) {
            const settings = util.getValue(res, 'giveboxSettings', {});
            const color = util.getValue(settings, 'primaryColor', '#4775f8');
            this.props.setCustomProp('primaryColor', color);
          }
        }
      });
    }
  }

  render() {

    if (this.props.kindID && util.isEmpty(this.props.article)) return <Loader msg='Loading article resource...' />

    return (
      <GBXClass
        {...this.props}
      />
    )
  }
}

GBX.defaultProps = {
  breakpointWidth: 768
}

function mapStateToProps(state, props) {

  const resourceName = `org${types.kind(props.kind).api.item}`;
  const resource = util.getValue(state.resource, resourceName, {});
  const isFetching = util.getValue(resource, 'isFetching', false);
  const article = util.getValue(resource, 'data', {});
  const primaryColor = util.getValue(state.custom, 'primaryColor');

  return {
    resourceName,
    resource,
    isFetching,
    article,
    access: util.getValue(state.resource, 'access', {}),
    primaryColor
  }
}

export default connect(mapStateToProps, {
  sendResource,
  getResource,
  setCustomProp,
  toggleModal
})(GBX);
