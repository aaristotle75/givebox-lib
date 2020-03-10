import React from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import {
  GBLink,
  util,
  sendResource,
  types,
  Alert
} from '../';
import { initLayout } from './config';

const ResponsiveGridLayout = WidthProvider(Responsive);

class GBXClass extends React.Component {

	constructor(props) {
		super(props);
    this.layoutChange = this.layoutChange.bind(this);
    this.breakpointChange = this.breakpointChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
    this.saveLayout = this.saveLayout.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
		this.addBlock = this.addBlock.bind(this);
		this.removeBlock = this.removeBlock.bind(this);
		this.renderBlocks = this.renderBlocks.bind(this);

    const layouts = {
      desktop: [],
      mobile: [],
    };

    const givebox = props.kind ? util.getValue(props.article, 'giveboxSettings', {}) : util.getValue(props.article, 'givebox', {});
    const customTemplate = util.getValue(givebox, 'customTemplate', {});
    const blocks = { ...initLayout, ...customTemplate };

    Object.entries(blocks).forEach(([key, value]) => {
      layouts.desktop.push(value.grid.desktop);
      layouts.mobile.push(value.grid.mobile);
    });

    this.state = {
			blocks,
			layouts,
      kind: util.getValue(this.props.article, 'kind', props.kind),
      formStyle: {
        maxWidth: '1000px'
      },
      breakpoint: 'desktop',
      success: false,
      error: false,
      editable: true,
      showOutline: false
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

  toggleOutline() {
		const showOutline = this.state.showOutline ? false : true;
		this.setState({ showOutline: showOutline ? false : true })
  }

  resetLayout() {
    console.log('execute resetLayout');
  }

  layoutChange(layout, layouts) {
    const breakpoint = this.state.breakpoint;
    const blocks = this.state.blocks;
    const breakpointLayout = util.getValue(layouts, breakpoint);
		console.log('execute', layouts);
    if (breakpointLayout) {
      breakpointLayout.forEach((value) => {
        const grid = blocks[value.i].grid[breakpoint];
        grid.x = value.x;
        grid.y = value.y;
        grid.w = value.w;
        grid.h = value.h;
      });
      this.setState({ blocks, layouts });
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
              customTemplate: this.state.blocks
            }
          },
          method: 'patch',
          callback: (res, err) => {
            if (this.props.save) this.props.save(this.state.blocks, res, err);
          }
        });
      } else {
        console.error(`No id`);
      }
    } else {
      if (this.props.save) {
        this.props.save(this.state.blocks);
      } else {
        console.error('Not saved: this.props.save not found');
      }
    }
  }

  addBlock(block) {
    const blocks = this.state.blocks;
    const breakpoint = this.state.breakpoint;
    blocks[block].grid[breakpoint].enabled = true;
    this.setState({ blocks });
	}

  removeBlock(block) {
    const blocks = this.state.blocks;
    const breakpoint = this.state.breakpoint;
    blocks[block].grid[breakpoint].enabled = false;
    this.setState({ blocks });
	}

	renderBlocks() {
		const {
			blocks,
			breakpoint,
			showOutline
		} = this.state;

    const items = [];
    Object.entries(blocks).forEach(([key, value]) => {
      if (value.grid[breakpoint].enabled) {
        items.push(
          <div className={`${showOutline ? 'outline' : ''}`} id={`block-${key}`} key={key} data-grid={value.grid[breakpoint]}>
						{value.name}
					</div>
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
			<div className='gbx3'>
				<GBLink onClick={this.toggleEditable}>GBX {editable ? 'Turn Off Editing' : 'Turn On Editing'}</GBLink>
        <div
          ref={this.gridRef}
          style={{ marginBottom: 20 }}
          className={`column dropArea ${editable ? 'editable' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            const block = e.dataTransfer.getData('block');
            e.preventDefault();
            const current = this.gridRef.current;
            if (current.classList.contains('dragOver')) current.classList.remove('dragOver');
            this.addBlock(block);
          }}
        >
          <div className='dragOverText'>Drop Page Element Here</div>
          <ResponsiveGridLayout
            className="layout"
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
            draggableCancel={'.modal'}
            verticalCompact={false}
						preventCollision={true}
          >
						{this.renderBlocks()}
          </ResponsiveGridLayout>
        </div>
			</div>
		)
	}

}

GBXClass.defaultProps = {
  breakpointWidth: 701
}

function mapStateToProps(state) {
  return {
  }
}

const GBXConnect = connect(mapStateToProps, {
  sendResource
})(GBXClass);

export default class GBX extends React.Component {

  render() {
    return (
      <GBXConnect
        {...this.props}
      />
    )
  }
}
