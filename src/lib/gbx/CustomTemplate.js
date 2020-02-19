import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx.scss';
import {
  Collapse,
  GBLink
} from '../';
import AnimateHeight from 'react-animate-height';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Tool, Board } from './DragBoard.js';
import PageElement from './PageElement';

const ResponsiveGridLayout = WidthProvider(Responsive);

class GBX extends React.Component {

  constructor(props) {
    super(props);
    this.layoutChange = this.layoutChange.bind(this);
    this.breakpointChange = this.breakpointChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.addTool = this.addTool.bind(this);
    this.removeTool = this.removeTool.bind(this);
    this.editTool = this.editTool.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
    this.saveLayout = this.saveLayout.bind(this);
    this.renderToolsEnabled = this.renderToolsEnabled.bind(this);
    this.renderToolsAvailable = this.renderToolsAvailable.bind(this);

    const tools = {
      'logo': { name: 'Logo', child: 'Logo', grid: {
        desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 2, enabled: true },
        mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 2, enabled: true }
      }},
      'title': { name: 'Title', child: 'Title', grid: {
        desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: false },
        mobile: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true }
      }},
      'media': { name: 'Media', child: 'Media', grid: {
        desktop: { i: 'media', x: 6, y: 0, w: 6, h: 10, enabled: true },
        mobile: { i: 'media', x: 0, y: 2, w: 6, h: 10, enabled: true }
      }},
      'summary': { name: 'Summary', child: 'Summary', grid: {
        desktop: { i: 'summary', x: 0, y: 2, w: 6, h: 3, enabled: true },
        mobile: { i: 'summary', x: 0, y: 2, w: 6, h: 3, enabled: true }
      }},
      'form': { name: 'Form', child: 'PublicForm', overflow: 'visible', grid: {
        desktop: { i: 'form', x: 0, y: 3, w: 12, h: 20, minW: 10, enabled: true },
        mobile: { i: 'form', x: 0, y: 3, w: 6, h: 30, minW: 4, enabled: true }
      }}
    };

    const defaultLayouts = {
      desktop: [],
      mobile: [],
    };

    Object.entries(tools).forEach(([key, value]) => {
      defaultLayouts.desktop.push(value.grid.desktop);
      defaultLayouts.mobile.push(value.grid.mobile);
    });


    this.state = {
      tools,
      editable: true,
      layouts: defaultLayouts,
      formStyle: {
        maxWidth: '1000px'
      },
      breakpoint: 'desktop'
    }
    this.gridRef = React.createRef();
  }

  componentDidMount() {
    const gridWidth = this.gridRef.current.clientWidth;
    if (gridWidth < this.props.breakpointWidth) {
      this.setState({ breakpoint: 'mobile' });
    }
  }

  breakpointChange(breakpoint, cols) {
    this.setState({ breakpoint });
  }

  widthChange(width, margin, cols) {
    //console.log('execute widthChange', width, margin, cols);
  }

  onDrop(i, w, h) {
    console.log('onDrop', i, w, h);
  }

  toggleEditable() {
    this.setState({ editable: this.state.editable ? false : true });
  }

  addTool(tool) {
    const tools = this.state.tools;
    const breakpoint = this.state.breakpoint;
    tools[tool].grid[breakpoint].enabled = true;
    this.setState({ tools });
  }

  removeTool(tool) {
    const tools = this.state.tools;
    const breakpoint = this.state.breakpoint;
    tools[tool].grid[breakpoint].enabled = false;
    this.setState({ tools });
  }

  editTool(tool) {
    console.log('execute editTool', tool);
  }


  resetLayout() {
    console.log('execute resetLayout');
  }

  layoutChange(layout, layouts) {
    const breakpoint = this.state.breakpoint;
    const tools = this.state.tools;
    const breakpointLayout = layouts[breakpoint];
    console.log('execute layoutChange', breakpoint, layouts, breakpointLayout);
    breakpointLayout.forEach((value) => {
      const grid = tools[value.i].grid[breakpoint];
      grid.x = value.x;
      grid.y = value.y;
      grid.w = value.w;
      grid.h = value.h;
    });
    this.setState({ tools, layouts });
  }

  saveLayout() {
    console.log('execute save layout');
  }

  renderToolsEnabled() {
    const items = [];
    const tools = this.state.tools;
    const breakpoint = this.state.breakpoint;
    Object.entries(tools).forEach(([key, value]) => {
      if (value.grid[breakpoint].enabled) {
        items.push(
          <div id={`pageElement-${key}`} key={key} data-grid={value.grid[breakpoint]}>
            <div className='pageElementBar'>
              <div className='button-group'>
                <GBLink onClick={() => this.editTool(key)}>Edit</GBLink>
                <GBLink onClick={() => this.removeTool(key)}>Remove</GBLink>
              </div>
            </div>
            <div className='pageElement' style={{ overflow: value.overflow || 'hidden' }}>
              <PageElement {...this.props} element={value.child} />
            </div>
          </div>
        );
      }
    });
    return items;
  }

  renderToolsAvailable() {
    const items = [];
    const tools = this.state.tools;
    const breakpoint = this.state.breakpoint;
    Object.entries(tools).forEach(([key, value]) => {
      if (!value.grid[breakpoint].enabled) {
        items.push(
          <div key={key} className='toolContainer'>
            <div className='toolBar'>
              <div className='button-group'>
                <GBLink onClick={() => this.addTool(key)}>Add {value.name}</GBLink>
              </div>
            </div>
            <div
              className='tool'
            >
              {value.name}
            </div>
          </div>
        );
      }
    });
    return items;
  }

  render() {

    const {
      editable,
      formStyle,
      layouts
    } = this.state;

    return (
      <div style={formStyle} className={`gbxFormWrapper ${editable ? 'editableForm' : ''}`}>
        <div style={{ marginBottom: 20 }} className='button-group column'>
          <GBLink onClick={this.toggleEditable}>Editable {editable ? 'On' : 'False'}</GBLink>
          <GBLink onClick={this.resetLayout}>Reset Layout</GBLink>
        </div>
        <AnimateHeight
          duration={500}
          height={editable ? 'auto' : 1}
        >
          <div style={{ marginBottom: 20 }} className='column'>
            <h2>Toolbar</h2>
            <div className='tools'>
              {this.renderToolsAvailable()}
            </div>
          </div>
        </AnimateHeight>
        <div ref={this.gridRef} style={{ marginBottom: 20 }} className='column'>
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{desktop: 701, mobile: 700 }}
            cols={{desktop: 12, mobile: 6}}
            rowHeight={31}
            onLayoutChange={this.layoutChange}
            onBreakpointChange={this.breakpointChange}
            onWidthChange={this.widthChange}
            onDrop={this.onDrop}
            isDraggable={editable}
            isDroppable={true}
            isResizable={editable}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            autoSize={true}
            draggableCancel={'.modal'}
            verticalCompact={false}
          >
            {this.renderToolsEnabled()}
          </ResponsiveGridLayout>
        </div>
      </div>
    )
  }
}

GBX.defaultProps = {
  breakpointWidth: 701
}

export default class CustomTemplate extends React.Component {

  render() {
    return (
      <GBX
        {...this.props}
      />
    )
  }
}
