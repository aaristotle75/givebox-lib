import React from 'react';
import { connect } from 'react-redux';
import Admin from './Admin';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Loadable from 'react-loadable';
import {
	util
} from '../';
import Block from './blocks/Block';
import has from 'has';

const ResponsiveGridLayout = WidthProvider(Responsive);

class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.setBreakpoint = this.setBreakpoint;
		this.renderBlocks = this.renderBlocks.bind(this);
		this.breakpointChange = this.breakpointChange.bind(this);
		this.widthChange = this.widthChange.bind(this);
		this.layoutChange = this.layoutChange.bind(this);
		const layouts = {
			desktop: [],
			mobile: []
		};

		Object.entries(props.blocks).forEach(([key, value]) => {
			layouts.desktop.push(value.grid.desktop);
			layouts.mobile.push(value.grid.mobile);
		});

		this.state = {
			layouts
		};

		this.gridRef = React.createRef();
	}

	componentDidMount() {
		this.setBreakpoint();
	}

	setBreakpoint() {
		let breakpoint = 'desktop';
		const gridWidth = this.gridRef.current.clientWidth;
		if (gridWidth < this.props.breakpointWidth) {
			breakpoint = 'mobile';
		}
		this.props.updateInfo({ breakpoint });
	}

	breakpointChange(breakpoint, cols) {
		this.props.updateInfo({ breakpoint });
	}

	widthChange(width, margin, cols) {
		//console.log('execute widthChange', width, margin, cols);
	}

	layoutChange(layout, layouts) {
		const {
			breakpoint
		} = this.props;

		const blocks = util.cloneObj(this.props.blocks);
		const breakpointLayout = util.getValue(layouts, breakpoint);
		if (breakpointLayout) {
			breakpointLayout.forEach((value) => {
				const block = value.i;
				if (has(blocks, block)) {
					if (has(blocks[block], 'grid')) {
						if (has(blocks[block].grid, breakpoint)) {
							blocks[block].grid[breakpoint].x = value.x;
							blocks[block].grid[breakpoint].y = value.y;
							blocks[block].grid[breakpoint].w = value.w;
							blocks[block].grid[breakpoint].h = value.h;
						}
					}
				}
			});
			this.props.updateBlocks(blocks);
		}
	}

	renderBlocks(enabled = true) {
		const {
			breakpoint,
			outline,
			blocks
		} = this.props;

		const items = [];

		Object.entries(blocks).forEach(([key, value]) => {
			if (value.grid[breakpoint].enabled === enabled) {
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
						>
							<BlockComponent />
						</Block>
					</div>
				);
			}
		});
		return items;
	}

	render() {

		const {
			collapse,
			collision,
			editable,
			globals
		} = this.props;

		const {
			layouts
		} = this.state;

		return (
			<div style={util.getValue(globals, 'gbxStyle', {})} className='gbx3'>
				<Admin
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

Layout.defaultProps = {
	breakpointWidth: 768
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const info = util.getValue(gbx3, 'info', {});
	const editable = util.getValue(admin, 'editable');
	const collision = util.getValue(admin, 'collision');
	const collapse = util.getValue(admin, 'collapse');
	const breakpoint = util.getValue(info, 'breakpoint');

	return {
		editable,
		collision,
		collapse,
		breakpoint,
		blocks: util.getValue(gbx3, 'blocks', {}),
		globals: util.getValue(gbx3, 'globals', {})
	}
}

export default connect(mapStateToProps, {
})(Layout);
