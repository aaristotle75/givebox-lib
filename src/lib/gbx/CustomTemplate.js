import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx.scss';
import '../styles/gbxForm.scss';
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
    this.renderToolsEnabled = this.renderToolsEnabled.bind(this);
    this.renderToolsAvailable = this.renderToolsAvailable.bind(this);

    const defaultLayouts = {
      desktop: [
        { i: 'logo', x: 0, y: 0, w: 1, h: 2 },
        { i: 'title', x: 1, y: 0, w: 5, h: 2 },
        { i: 'summary', x: 0, y: 2, w: 6, h: 3 },
        { i: 'media', x: 6, y: 0, w: 6, h: 12 },
        { i: 'form', x: 0, y: 3, w: 12, h: 40 }
      ],
      mobile: [
        { i: 'logo', x: 0, y: 0, w: 1, h: 2 },
        { i: 'title', x: 1, y: 0, w: 5, h: 2 },
        { i: 'media', x: 0, y: 2, w: 6, h: 12 },
        { i: 'summary', x: 0, y: 2, w: 6, h: 3 },
        { i: 'form', x: 0, y: 3, w: 6, h: 70 }
      ]
    };

    const defaultToolsEnabled = [
      'logo',
      'title',
      'media',
      'summary',
      'form'
    ];

    this.state = {
      editable: true,
      tools: {
        'logo': { name: 'Logo', child: 'Logo' },
        'title': { name: 'Title', child: 'Title' },
        'media': { name: 'Media', child: 'Media' },
        'summary': { name: 'Summary', child: 'Summary' },
        'form': { name: 'Form', child: 'PublicForm' }
      },
      toolsEnabled: defaultToolsEnabled,
      layouts: defaultLayouts,
      formStyle: {
        maxWidth: '1000px'
      }
    }
  }

  componentDidMount() {
  }

  layoutChange(layout) {
    console.log('execute updateLayout', layout);
  }

  breakpointChange(breakpoint, cols) {
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
    console.log('execute addTool', tool);
    const layouts = this.state.layouts;
    const newItem = {
      i: tool,
      x: 0,
      y: Infinity,
      w: 6,
      h: 1
    };
    layouts.desktop.push(newItem);
    layouts.mobile.push(newItem);
    const toolsEnabled = this.state.toolsEnabled.concat(tool);
    this.setState({ layouts, toolsEnabled });
  }

  removeTool(tool) {
    console.log('execute removeTool', tool);
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
        <div key={value}>
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

    console.log('execute', layouts);

    return (
      <div style={formStyle} className={`gbxFormWrapper ${editable ? 'editableForm' : ''}`}>
        <div style={{ marginBottom: 20 }} className='column'>
          <GBLink onClick={this.toggleEditable}>Editable {editable ? 'On' : 'False'}</GBLink>
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
          <div style={{ marginBottom: 20 }} className='column'>
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{desktop: 701, mobile: 700 }}
              cols={{desktop: 12, mobile: 6}}
              rowHeight={30}
              onLayoutChange={this.layoutChange}
              onBreakpointChange={this.breakpointChange}
              onWidthChange={this.widthChange}
              onDrop={this.droppingItem}
              isDraggable={editable}
              isResizable={editable}
              margin={[0, 0]}
              containerPadding={[0, 0]}
              autoSize={true}
            >
              {this.renderToolsEnabled()}
            </ResponsiveGridLayout>
          </div>
        </Board>
      </div>
    )
  }
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
