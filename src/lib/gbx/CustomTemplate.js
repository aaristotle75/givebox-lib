import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  Collapse,
  GBLink
} from '../';
import AnimateHeight from 'react-animate-height';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
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
        { i: 'a', x: 0, y: 0, w: 1, h: 1 },
        { i: 'b', x: 1, y: 0, w: 1, h: 1 },
        { i: 'c', x: 2, y: 0, w: 1, h: 1 }
      ],
      mobile: [
        { i: 'a', x: 0, y: 0, w: 1, h: 1 },
        { i: 'b', x: 1, y: 0, w: 1, h: 1 },
        { i: 'c', x: 2, y: 0, w: 1, h: 1 }
      ]
    };

    const defaultToolsEnabled = [
      'orgName',
      'summary',
      'c'
    ];

    this.state = {
      editable: true,
      tools: {
        'orgName': { name: 'Organization Name', child: 'OrgName' },
        'summary': { name: 'Summary', child: 'Summary' },
        'c': { name: 'C', child: 'OrgName' },
        'd': { name: 'D', child: 'OrgName' },
        'e': { name: 'E', child: 'OrgName' },
        'f': { name: 'F', child: 'OrgName' },
        'g': { name: 'G', child: 'OrgName' }
      },
      toolsEnabled: defaultToolsEnabled,
      layouts: defaultLayouts
    }
  }

  componentDidMount() {
  }

  layoutChange(layout) {
    //console.log('execute updateLayout', layout);
  }

  breakpointChange(breakpoint, cols) {
    //console.log('execute breakpointChange', breakpoint, cols);
  }

  widthChange(width, margin, cols) {
    //console.log('execute widthChange', width, margin, cols);
  }

  droppingItem(i, w, h) {
    //console.log('droppingItem', i, w, h);
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
      w: 1,
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
          {this.state.editable ?
          <div className='editableTools'>
            <GBLink onClick={() => this.removeTool(value)}>Remove</GBLink>
          </div> : ''}
          <PageElement {...this.props} element={tools[value].child} />
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
      editable
    } = this.state;

    return (
      <div>
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
              breakpoints={{desktop: 801, mobile: 800 }}
              cols={{desktop: 12, mobile: 4}}
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

const Tool = ({ name, style = {}, children }) => {
  const [{isDragging}, drag] = useDrag({
    item: { name, type: 'tool' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const toolStyle = {
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    ...style
  };

  return (
    <div
      ref={drag}
      style={toolStyle}
      className='tool'
    >
      {children}
    </div>
  )
}

const Board = ({ addTool, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'tool',
    drop: (item, monitor) => {
      const getItem = monitor.getItem();
      addTool(getItem.name);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      className='board'
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
      {isOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'yellow',
          }}
        />
      )}
    </div>
  )
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
