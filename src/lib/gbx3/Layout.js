import React from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Loadable from 'react-loadable';
import {
	util,
	updateLayouts,
	updateBlocks,
	updateData,
	updateInfo,
	saveGBX3
} from '../';
import Block from './blocks/Block';
import Form from './blocks/Form';
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

	async layoutChange(layout, layouts) {
		const {
			breakpoint,
			editable
		} = this.props;

		const blocks = util.deepClone(this.props.blocks);
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

			if (editable) {
				const updated = [];
				const layoutsUpdated = await this.props.updateLayouts(layouts);
				const blocksUpdated = await this.props.updateBlocks(blocks);
				if (layoutsUpdated) updated.push('layoutsUpdated');
				if (blocksUpdated) updated.push('blocksUpdated');
				if (updated.length === 2) this.props.saveGBX3();
			} else {
				this.props.updateLayouts(layouts);
			}
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
			layouts,
			collapse,
			collision,
			editable,
			globals,
			hasAccessToEdit
		} = this.props;

		const isEditable = hasAccessToEdit && editable ? true : false;

		return (
			<div style={util.getValue(globals, 'gbxStyle', {})} className='gbx3Container'>
				<div className='layout-column'>
					<div
						ref={this.gridRef}
						style={{ marginBottom: 20 }}
						className={`column dropArea ${isEditable ? 'editable' : ''}`}
						onDragOver={(e) => {
							e.preventDefault();
						}}
						onDrop={(e) => {
							if (isEditable) {
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
				<div className='layout-column'>
					<Block
						name='paymentForm'
						ref={React.createRef()}
					>
						<Form />
					</Block>
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
	const layouts = util.getValue(gbx3, 'layouts', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const info = util.getValue(gbx3, 'info', {});
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');
	const collision = util.getValue(admin, 'collision');
	const collapse = util.getValue(admin, 'collapse');
	const outline = util.getValue(admin, 'outline');
	const breakpoint = util.getValue(info, 'breakpoint');

	return {
		hasAccessToEdit,
		layouts,
		editable,
		collision,
		collapse,
		outline,
		breakpoint,
		blocks: util.getValue(gbx3, 'blocks', {}),
		globals: util.getValue(gbx3, 'globals', {})
	}
}

export default connect(mapStateToProps, {
	updateLayouts,
	updateBlocks,
	updateData,
	updateInfo,
	saveGBX3
})(Layout);
