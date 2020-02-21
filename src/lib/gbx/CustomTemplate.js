import React from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx.scss';
import {
  GBLink,
  util,
  sendResource,
  types,
  Alert
} from '../';
import AnimateHeight from 'react-animate-height';
import PageElement from './PageElement';

const ResponsiveGridLayout = WidthProvider(Responsive);

class GBX extends React.Component {

  constructor(props) {
    super(props);
    this.layoutChange = this.layoutChange.bind(this);
    this.breakpointChange = this.breakpointChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.addPageElement = this.addPageElement.bind(this);
    this.removePageElement = this.removePageElement.bind(this);
    this.editPageElement = this.editPageElement.bind(this);
    this.renderPageElementsEnabled = this.renderPageElementsEnabled.bind(this);
    this.renderPageElementsAvailable = this.renderPageElementsAvailable.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
    this.saveLayout = this.saveLayout.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);

    const defaultPageElements = {
      'logo': { name: 'Logo', child: 'Logo', grid: {
        desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 2, enabled: true },
        mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 2, enabled: true }
      }},
      'title': { name: 'Title', child: 'Title', grid: {
        desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true },
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
      'form': { name: 'Form', child: 'PublicForm', overflow: 'visible', irremovable: true,
      grid: {
        desktop: { i: 'form', x: 0, y: 3, w: 12, h: 20, minW: 10, enabled: true },
        mobile: { i: 'form', x: 0, y: 3, w: 6, h: 30, minW: 4, enabled: true }
      }}
    };

    const defaultLayouts = {
      desktop: [],
      mobile: [],
    };

    const givebox = props.kind ? util.getValue(props.article, 'giveboxSettings', {}) : util.getValue(props.article, 'givebox', {});
    const customTemplate = util.getValue(givebox, 'customTemplate', null);
    const pageElements = customTemplate || defaultPageElements;

    Object.entries(pageElements).forEach(([key, value]) => {
      defaultLayouts.desktop.push(value.grid.desktop);
      defaultLayouts.mobile.push(value.grid.mobile);
    });

    this.state = {
      pageElements,
      kind: util.getValue(this.props.article, 'kind', props.kind),
      showOutline: false,
      layouts: defaultLayouts,
      formStyle: {
        maxWidth: '1000px'
      },
      breakpoint: 'desktop',
      pageElementToEdit: null,
      success: false,
      error: false,
      editable: false,
      customizable: this.props.customizable
    }
    this.gridRef = React.createRef();
  }

  componentDidMount() {
    const gridWidth = this.gridRef.current.clientWidth;
    if (gridWidth < this.props.breakpointWidth) {
      this.setState({ breakpoint: 'mobile' });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
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

  addPageElement(element) {
    const pageElements = this.state.pageElements;
    const breakpoint = this.state.breakpoint;
    pageElements[element].grid[breakpoint].enabled = true;
    this.setState({ pageElements });
  }

  removePageElement(element) {
    const pageElements = this.state.pageElements;
    const breakpoint = this.state.breakpoint;
    pageElements[element].grid[breakpoint].enabled = false;
    this.setState({ pageElements });
  }

  editPageElement(element) {
    this.setState({ pageElementToEdit: element });
  }

  resetLayout() {
    console.log('execute resetLayout');
  }

  layoutChange(layout, layouts) {
    const breakpoint = this.state.breakpoint;
    const pageElements = this.state.pageElements;
    const breakpointLayout = util.getValue(layouts, breakpoint);
    if (breakpointLayout) {
      breakpointLayout.forEach((value) => {
        const grid = pageElements[value.i].grid[breakpoint];
        grid.x = value.x;
        grid.y = value.y;
        grid.w = value.w;
        grid.h = value.h;
      });
      this.setState({ pageElements, layouts });
    }
  }

  saveLayout() {
    if (this.props.autoSave) {
      let id = null;
      if (util.getValue(this.props.article, 'articleID')) {
        id = this.props.article.ID;
      } else {
        id = util.getValue(this.props.article, 'kindID');
      }

      if (id) {
        const resource = `org${types.kind(this.state.kind).api.item}`;
        this.props.sendResource(resource, {
          id: [id],
          data: {
            giveboxSettings: {
              customTemplate: this.state.pageElements
            }
          },
          method: 'patch',
          callback: (res, err) => {
            if (this.props.save) this.props.save(this.state.pageElements, res, err);
          }
        });
      } else {
        console.error(`No id`);
      }
    } else {
      if (this.props.save) {
        this.props.save(this.state.pageElements);
      } else {
        console.error('Not saved: this.props.save not found');
      }
    }
  }

  renderPageElementsEnabled() {
    const items = [];
    const pageElements = this.state.pageElements;
    const breakpoint = this.state.breakpoint;
    Object.entries(pageElements).forEach(([key, value]) => {
      if (value.grid[breakpoint].enabled) {
        items.push(
          <div className={`${this.state.showOutline ? 'outline' : ''}`} id={`pageElement-${key}`} key={key} data-grid={value.grid[breakpoint]}>
            <div className='pageElementBar'>
              <div className='button-group'>
                <GBLink className='editBtn' onClick={() => this.editPageElement(key)}><span className='icon icon-edit'></span>Edit</GBLink>
                {!value.irremovable ? <GBLink className='link removeBtn' onClick={() => this.removePageElement(key)}><span className='icon icon-x'></span></GBLink> : ''}
              </div>
            </div>
            <div className='pageElement' style={{ overflow: value.overflow || 'hidden' }}>
              <PageElement editPageElement={this.editPageElement} edit={this.state.pageElementToEdit} {...this.props} element={value.child} />
            </div>
          </div>
        );
      }
    });
    return items;
  }

  renderPageElementsAvailable() {
    const items = [];
    const pageElements = this.state.pageElements;
    const breakpoint = this.state.breakpoint;
    Object.entries(pageElements).forEach(([key, value]) => {
      if (!value.grid[breakpoint].enabled) {
        items.push(
          <div
            draggable={true}
            unselectable={'no'}
            key={key}
            className='pageElementAvailableContainer'
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', '');
              e.dataTransfer.setData('element', key);
              const current = this.gridRef.current;
              current.classList.add('dragOver');
            }}
            onDragEnd={(e) => {
              const current = this.gridRef.current;
              if (current.classList.contains('dragOver')) current.classList.remove('dragOver');
            }}
          >
            <div className='toolBar'>
              <div className='button-group'>
                <GBLink className='editBtn' onClick={() => this.addPageElement(key)}><span className='icon icon-plus-square'></span>Add {value.name}</GBLink>
              </div>
            </div>
            {value.name}
          </div>
        );
      }
    });
    const hasItems = util.isEmpty(items) ? false : true;

    return (
      <div className={`pageElementsAvailable ${hasItems ? 'flexStart' : 'flexCenter'}`}>
        {hasItems ? items : <span className='noRecords'>All page elements enabled</span>}
      </div>
    )
  }

  render() {

    const {
      editable,
      formStyle,
      layouts,
      showOutline,
      pageElementToEdit,
      customizable
    } = this.state;

    const isEditable = pageElementToEdit ? false : editable;

    return (
      <div style={formStyle} className={`gbxFormWrapper ${isEditable ? 'editableForm' : ''}`}>
        {customizable ?
        <div className={`adminCustomArea`}>
          <div style={{ marginBottom: 20 }} className='button-group column'>
            <GBLink className='link show' onClick={this.toggleEditable}>{editable ? 'Turn Editable Off' : 'Turn Editable On'}</GBLink>
            <GBLink onClick={() => this.setState({ showOutline: showOutline ? false : true })}>{showOutline ? 'Hide Outline' : 'Show Outline'}</GBLink>
            <GBLink onClick={this.resetLayout}>Reset Layout</GBLink>
            <GBLink onClick={this.saveLayout}>Save Layout</GBLink>
          </div>
          <AnimateHeight
            duration={500}
            height={editable ? 'auto' : 1}
          >
            {this.renderPageElementsAvailable()}
          </AnimateHeight>
          <div className='alertContainer'>
            <Alert alert='error' display={this.state.error} msg={'Error saving, check console'} />
            <Alert alert='success' display={this.state.success} msg={'Custom Template Saved'} />
          </div>
        </div> : <></>}
        <div
          ref={this.gridRef}
          style={{ marginBottom: 20 }}
          className={`column dropArea`}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            const element = e.dataTransfer.getData('element');
            e.preventDefault();
            const current = this.gridRef.current;
            if (current.classList.contains('dragOver')) current.classList.remove('dragOver');
            this.addPageElement(element);
          }}
        >
          <div className='dragOverText'>Drop Page Element Here</div>
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{desktop: 701, mobile: 700 }}
            cols={{desktop: 12, mobile: 6}}
            rowHeight={31}
            onLayoutChange={this.layoutChange}
            onBreakpointChange={this.breakpointChange}
            onWidthChange={this.widthChange}
            isDraggable={isEditable}
            isResizable={isEditable}
            isDroppable={false}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            autoSize={true}
            draggableCancel={'.modal'}
            verticalCompact={false}
          >
            {this.renderPageElementsEnabled()}
          </ResponsiveGridLayout>
        </div>
      </div>
    )
  }
}

GBX.defaultProps = {
  breakpointWidth: 701
}

function mapStateToProps(state) {
  return {
  }
}

const GBXConnect = connect(mapStateToProps, {
  sendResource
})(GBX);

export default class CustomTemplate extends React.Component {

  render() {
    return (
      <GBXConnect
        {...this.props}
      />
    )
  }
}
