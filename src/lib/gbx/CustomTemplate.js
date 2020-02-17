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
    this.droppingItem = this.droppingItem.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.addTool = this.addTool.bind(this);
    this.removeTool = this.removeTool.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
    this.saveLayout = this.saveLayout.bind(this);
    this.renderToolsEnabled = this.renderToolsEnabled.bind(this);
    this.renderToolsAvailable = this.renderToolsAvailable.bind(this);

    const tools = {
      'logo': { name: 'Logo', child: 'Logo', grid: {
        desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 2 },
        mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 2 }
      }},
      'title': { name: 'Title', child: 'Title', grid: {
        desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2 },
        mobile: { i: 'title', x: 1, y: 0, w: 5, h: 2 }
      }},
      'media': { name: 'Media', child: 'Media', grid: {
        desktop: { i: 'media', x: 6, y: 0, w: 6, h: 10 },
        mobile: { i: 'media', x: 0, y: 2, w: 6, h: 10 }
      }},
      'summary': { name: 'Summary', child: 'Summary', grid: {
        desktop: { i: 'summary', x: 0, y: 2, w: 6, h: 3 },
        mobile: { i: 'summary', x: 0, y: 2, w: 6, h: 3 }
      }},
      'form': { name: 'Form', child: 'PublicForm', grid: {
        desktop: { i: 'form', x: 0, y: 3, w: 12, h: 20, minW: 10 },
        mobile: { i: 'form', x: 0, y: 3, w: 6, h: 30, minW: 4 }
      }}
    };

    const defaultLayouts = {
      desktop: [
        tools.logo.grid.desktop,
        tools.title.grid.desktop,
        tools.summary.grid.desktop,
        tools.media.grid.desktop,
        tools.form.grid.desktop
      ],
      mobile: [
        tools.logo.grid.mobile,
        tools.title.grid.mobile,
        tools.summary.grid.mobile,
        tools.media.grid.mobile,
        tools.form.grid.mobile
      ],
    };

    const defaultToolsEnabled = [
      'logo',
      'title',
      'media',
      'summary',
      'form'
    ];

    this.state = {
      tools,
      defaultLayouts,
      editable: true,
      toolsEnabled: defaultToolsEnabled,
      layouts: defaultLayouts,
      savedLayouts: defaultLayouts,
      formStyle: {
        maxWidth: '1000px'
      },
      breakpoint: 'desktop'
    }
    this.gridRef = React.createRef();
    this.tools = tools;
    this.defaultLayouts = defaultLayouts;
  }

  componentDidMount() {
    const gridWidth = this.gridRef.current.clientWidth;
    if (gridWidth < this.props.breakpointWidth) {
      this.setState({ breakpoint: 'mobile' });
    }
  }

  resetLayout() {
    console.log('execute', this.state.layouts, this.defaultLayouts);
    this.setState({ layouts: this.defaultLayouts });
  }

  layoutChange(layout) {
    const layouts = this.state.layouts;
    layouts[this.state.breakpoint] = layout;
    this.setState({ layouts });
  }

  saveLayout() {
    console.log('execute save layout');
  }

  breakpointChange(breakpoint, cols) {
    this.setState({ breakpoint });
    console.log('execute breakpointChange', breakpoint, cols);
  }

  widthChange(width, margin, cols) {
    console.log('execute widthChange', width, margin, cols);
  }

  droppingItem(i, w, h) {
    console.log('droppingItem', i, w, h);
  }

  toggleEditable() {
    console.log('toggleEditable', this.state.editable);
    this.setState({ editable: this.state.editable ? false : true });
  }

  addTool(tool) {
    const layouts = this.state.layouts;
    const desktopGrid = this.tools[tool].grid.desktop;
    const mobileGrid = this.tools[tool].grid.mobile;
    const newDesktopItem = {
      i: tool,
      x: desktopGrid.x,
      y: desktopGrid.y,
      w: desktopGrid.w,
      h: desktopGrid.h
    };
    const newMobileItem = {
      i: tool,
      x: mobileGrid.x,
      y: mobileGrid.y,
      w: mobileGrid.w,
      h: mobileGrid.h
    };
    layouts.desktop.push(newDesktopItem);
    layouts.mobile.push(newMobileItem);
    console.log('execute addTool', layouts);
    const toolsEnabled = this.state.toolsEnabled.concat(tool);
    this.setState({ layouts, toolsEnabled });
  }

  removeTool(tool) {
    const layouts = this.state.layouts;
    const toolsEnabled = this.state.toolsEnabled;
    const desktopIndex = layouts.desktop.findIndex(t => t.i === tool);
    const mobileIndex = layouts.mobile.findIndex(t => t.i === tool);
    const enabledIndex = toolsEnabled.indexOf(tool);
    layouts.desktop.splice(desktopIndex, 1);
    layouts.mobile.splice(mobileIndex, 1);
    toolsEnabled.splice(enabledIndex, 1);
    this.setState({ layouts, toolsEnabled });
  }

  renderToolsEnabled() {
    const items = [];
    const tools = this.state.tools;
    this.state.toolsEnabled.forEach((value) => {
      items.push(
        <div id={`pageElement-${value}`} key={value}>
          <div className='editableTools'>
            <GBLink onClick={() => this.removeTool(value)}>Remove</GBLink>
          </div>
          <div className='pageElement'>
            <PageElement {...this.props} element={tools[value].child} />
          </div>
        </div>
      );
    });
    return items;
  }

  renderToolsAvailable() {
    const items = [];
    const tools = this.state.tools;
    Object.entries(tools).forEach(([key, value]) => {
      if (!this.state.toolsEnabled.includes(key)) {
        items.push(
          <Tool
            key={key}
            name={key}
          >
            {value.name}
          </Tool>
        );
      }
    });
    return items;
  }

  render() {

    const {
      layouts,
      editable,
      formStyle
    } = this.state;

    console.log('execute render', layouts);

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
          <div style={{ marginBottom: 20 }} className='toolContainer'>
            <h2>Toolbar</h2>
            <div className='tools'>
              {this.renderToolsAvailable()}
            </div>
          </div>
        </AnimateHeight>
        <Board
          addTool={this.addTool}
        >
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
              onDrop={this.droppingItem}
              isDraggable={editable}
              isDroppable={true}
              isResizable={editable}
              margin={[0, 0]}
              containerPadding={[0, 0]}
              autoSize={true}
              draggableCancel={'.modal'}
            >
              {this.renderToolsEnabled()}
            </ResponsiveGridLayout>
          </div>
        </Board>
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
      <DndProvider
        backend={Backend}
      >
        <GBX
          {...this.props}
        />
      </DndProvider>
    )
  }
}
