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
	getResource,
	resourceProp,
  types,
  Alert,
	Loader
} from '../';
import AdminToolbar from './tools/AdminToolbar';
import { initBlocks } from './config';
import Loadable from 'react-loadable';

const ResponsiveGridLayout = WidthProvider(Responsive);

class GBXClass extends React.Component {

	constructor(props) {
		super(props);
    this.layoutChange = this.layoutChange.bind(this);
    this.breakpointChange = this.breakpointChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
		this.toggleOutline = this.toggleOutline.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
    this.saveLayout = this.saveLayout.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
		this.addBlock = this.addBlock.bind(this);
		this.removeBlock = this.removeBlock.bind(this);
		this.renderBlocks = this.renderBlocks.bind(this);
		this.getData = this.getData.bind(this);
		this.updateBlock = this.updateBlock.bind(this);

    const layouts = {
      desktop: [],
      mobile: [],
    };

    const givebox = props.kind ? util.getValue(props.article, 'giveboxSettings', {}) : util.getValue(props.article, 'givebox', {});
    const customTemplate = util.getValue(givebox, 'customTemplate', {});
		const customBlocks = util.getValue(customTemplate, 'blocks', []);

    const blocks = [ ...initBlocks[props.kind], ...customBlocks ];

    Object.entries(blocks).forEach(([key, value]) => {
      layouts.desktop.push(value.grid.desktop);
      layouts.mobile.push(value.grid.mobile);
    });

    this.state = {
			blocks,
			layouts,
			data: {},
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
		this.blockRefs = {};
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
		this.setState({ showOutline })
  }

  resetLayout() {
    console.log('execute resetLayout');
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

  saveLayout() {
		// Need to handle creating new articles
		const data = this.getData();
    const id = util.getValue(this.props.article, 'ID', null);

    if (this.props.autoSave) {
      this.props.sendResource(this.props.resourceName, {
        id: id ? [id] : null,
				orgID: this.props.orgID,
        data: {
          giveboxSettings: {
            customTemplate: {
							blocks: this.state.blocks
						}
          }
        },
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

	getData() {
		const data = this.state.data;
		data.giveboxSettings = {
			customTemplate: {
				blocks: this.state.blocks
			}
		};
		return data;
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

	updateBlock(name, obj = {}) {
		const blocks = this.state.blocks;
		const index = blocks.findIndex(b => b.name === name);
		if (index !== -1) {
			blocks[index] = { ...blocks[index], ...obj };
			console.log(blocks[index], blocks);
			this.setState({ blocks });
		}
	}

	renderBlocks(enabled = true) {
		const {
			blocks,
			breakpoint,
			showOutline,
			editable
		} = this.state;

    const items = [];
		const article = this.props.article;
    Object.entries(blocks).forEach(([key, value]) => {
      if (value.grid[breakpoint].enabled === enabled) {
			  const Block = Loadable({
			    loader: () => import(`./blocks/${value.type}`),
			    loading: () => <></>
			  });
				const fieldValue = util.getValue(article, value.field);
	      items.push(
	        <div
						className={`${showOutline ? 'outline' : ''}`}
						id={`block-${value.name}`}
						key={value.name}
						data-grid={value.grid[breakpoint]}
					>
						<Block
							name={value.name}
							type={value.type}
							field={value.field}
							fieldValue={fieldValue}
							content={value.content}
							editable={editable}
							toggleEditable={this.toggleEditable}
							overflow={value.overflow}
							defaultFormat={value.defaultFormat}
							updateBlock={this.updateBlock}
						/>
					</div>
	      );
      }
    });
    return items;
	}

	render() {

		const {
			layouts,
			editable,
			showOutline,
			formStyle
		} = this.state;

		return (
			<div style={formStyle} className='gbx3'>
				<AdminToolbar
					renderBlocks={this.renderBlocks}
					toggleEditable={this.toggleEditable}
					toggleOutline={this.toggleOutline}
					editable={editable}
					showOutline={showOutline}
					resetLayout={this.resetLayout}
					saveLayout={this.saveLayout}
					access={this.props.access}
				/>
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
						id='testGrid'
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
						draggableHandle={'.dragHandle'}
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

class GBX extends React.Component {

	componentDidMount() {
		if (util.isEmpty(this.props.article) && this.props.kindID) {
			this.props.getResource(this.props.resourceName, {
				id: [this.props.kindID],
				orgID: this.props.orgID
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
  breakpointWidth: 701
}

function mapStateToProps(state, props) {

	const resourceName = `org${types.kind(props.kind).api.item}`;
  const resource = util.getValue(state.resource, resourceName, {});
  const isFetching = util.getValue(resource, 'isFetching', false);
  const article = util.getValue(resource, 'data', {});

  return {
		resourceName,
    resource,
    isFetching,
    article,
    access: util.getValue(state.resource, 'access', {})
  }
}

export default connect(mapStateToProps, {
  sendResource,
	getResource
})(GBX);
