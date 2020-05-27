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
	saveGBX3,
	Image,
	GBLink
} from '../';
import Block from './blocks/Block';
import Form from './blocks/Form';
import Scroll from 'react-scroll';
import has from 'has';
import Moment from 'moment';

const ResponsiveGridLayout = WidthProvider(Responsive);

class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.renderBlocks = this.renderBlocks.bind(this);
		this.onBreakpointChange = this.onBreakpointChange.bind(this);
		this.widthChange = this.widthChange.bind(this);
		this.layoutChange = this.layoutChange.bind(this);
		this.gridRef = React.createRef();
	}

	componentDidMount() {
	}

	onBreakpointChange(breakpoint, cols) {
		console.log('onBreakpointChange', breakpoint);
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

	scrollTo(name) {
		const scroller = Scroll.scroller;
		scroller.scrollTo(name, {
			duration: 500,
			delay: 0,
			smooth: true,
			containerId: 'gbx3'
		});
	}

	renderBlocks(enabled = true) {
		const {
			breakpoint,
			outline,
			blocks
		} = this.props;

		const items = [];

		Object.entries(blocks).forEach(([key, value]) => {
			if (!util.isEmpty(value.grid)) {
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
								scrollTo={this.scrollTo}
							>
								<BlockComponent />
							</Block>
						</div>
					);
				}
			}
		});
		return items;
	}

	render() {

		const {
			layouts,
			verticalCompact,
			preventCollision,
			editable,
			globals,
			hasAccessToEdit,
			breakpoint
		} = this.props;

		const isEditable = hasAccessToEdit && editable ? true : false;
		const Element = Scroll.Element;

		return (
			<div style={util.getValue(globals, 'gbxStyle', {})} className={`gbx3Container ${isEditable ? 'editable' : ''}`}>
				<div className='layout-column'>
					<div
						ref={this.gridRef}
						className={`column dropArea`}
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
							breakpoints={{desktop: 768, mobile: 767 }}
							cols={{desktop: 12, mobile: 6}}
							rowHeight={10}
							onLayoutChange={this.layoutChange}
							onBreakpointChange={this.onBreakpointChange}
							onWidthChange={this.widthChange}
							isDraggable={editable}
							isResizable={editable}
							isDroppable={false}
							margin={[0, 0]}
							containerPadding={[0, 0]}
							autoSize={true}
							draggableHandle={'.dragHandle'}
							draggableCancel={'.modal'}
							verticalCompact={verticalCompact}
							preventCollision={preventCollision}
						>
							{this.renderBlocks()}
						</ResponsiveGridLayout>
					</div>
				</div>
				<div className='layout-column'>
					<Element name='checkout'>
						<div className='react-grid-item'>
							<Block
								name='paymentForm'
								blockRef={React.createRef()}
								style={{ position: 'relative' }}
							>
								<Form />
							</Block>
						</div>
					</Element>
				</div>
				<div className='layout-column'>
					<div className='gbx3Footer flexCenter flexColumn'>
						<Image url='https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo5.svg' maxSize={'30px'} style={{ minHeight: 30 }} />
						<div className="copyright">
							&copy; {Moment().format('YYYY')} Givebox<br />
							<GBLink allowCustom={true} customColor={this.props.primaryColor} onClick={() => window.open('https://givebox.com')}>www.givebox.com</GBLink>
						</div>
					</div>
				</div>
				{breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
			</div>
		)
	}

}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const layouts = util.getValue(gbx3, 'layouts', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const info = util.getValue(gbx3, 'info', {});
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const editable = util.getValue(admin, 'editable');
	const preventCollision = util.getValue(admin, 'preventCollision');
	const verticalCompact = util.getValue(admin, 'verticalCompact');
	const outline = util.getValue(admin, 'outline');
	const breakpoint = util.getValue(info, 'breakpoint');

	return {
		hasAccessToEdit,
		layouts,
		editable,
		preventCollision,
		verticalCompact,
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
