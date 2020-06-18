import React from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	toggleModal,
	updateBlock,
	removeBlock,
	updateData,
	saveGBX3,
	updateLayouts
} from '../../';

class Block extends React.Component {

	constructor(props) {
		super(props);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.renderChildren = this.renderChildren.bind(this);
		this.onClickRemove = this.onClickRemove.bind(this);
		this.onClickEdit = this.onClickEdit.bind(this);
		this.saveBlock = this.saveBlock.bind(this);
		this.getBlockContent = this.getBlockContent.bind(this);
		this.setDisplayHeight = this.setDisplayHeight.bind(this);
		this.state = {
			editModalOpen: false
		};
		this.height = null;
	}

	setDisplayHeight(ref) {
		if (ref) {
			if (ref.current) {
				this.height = ref.current.clientHeight;
			}
		}
	}

	onClickEdit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ editModalOpen: true });
	}

	async onClickRemove() {
		const blockRemoved = await this.props.removeBlock(this.props.name);
		if (blockRemoved) this.setState({ editModalOpen: false }, this.props.toggleModal(this.props.modalID, false));
	}

	closeEditModal() {
		this.props.toggleModal(this.props.modalID, false);
		this.setState({ editModalOpen: false });
	}

	async saveBlock(params = {}) {
		const {
			name,
			block
		} = this.props;

		const opts = {
			content: {},
			options: {},
			data: {},
			autoHeight: true,
			saveGBX3: true,
			callback: this.closeEditModal,
			...params
		};

		const content = { ...opts.content };
		const options = { ...opts.options };
		const data = { ...opts.data };
		const saveGBX3 = opts.saveGBX3;
		const callback = opts.callback;

		const grid = {};
		if (opts.autoHeight) {
			if (this.height) grid.h = Math.ceil(parseFloat(this.height / 10));
			const addHeight = parseInt(grid.h * .1);
			if (grid.h) grid.h = grid.h + addHeight;
		}

		const mobileContent = content || this.getBlockContent('mobile');
		const mobileGrid = !util.isEmpty(block.grid) ? { ...block.grid.mobile, ...grid } : {};

		const desktopContent = content || this.getBlockContent('desktop');
		const desktopGrid = !util.isEmpty(block.grid) ? { ...block.grid.desktop, ...grid } : {};

		const blockGrid = !util.isEmpty(block.grid) ? {
			mobile: {
				...mobileGrid,
				content: {
					...util.getValue(block.grid.mobile, 'content', {}),
					...mobileContent
				}
			},
			desktop: {
				...desktopGrid,
				content: {
					...util.getValue(block.grid.desktop, 'content', {}),
					...desktopContent
				}
			}
		} : {};

		const updated = [];
		const checkForUpdatesCount = !util.isEmpty(data) ? 2 : 1;

		const blocksUpdated = await this.props.updateBlock(name, Object.assign({}, block, {
			grid: blockGrid,
			options: {
				...block.options,
				...options
			}
		}));
		if (blocksUpdated) updated.push('blocksUpdated');

		if (!util.isEmpty(data)) {
			const dataUpdated = await this.props.updateData(data);
			if (dataUpdated) updated.push('dataUpdated');
		}

		const saveCallback = () => {
			callback();
		};

		if (updated.length === checkForUpdatesCount) {
			if (saveGBX3) this.props.saveGBX3(null, false, saveCallback, !util.isEmpty(grid) ? true : false);
			else saveCallback();
		}
	}

	getBlockContent(breakpoint) {
		const {
			block
		} = this.props;

		const grid = util.getValue(block, 'grid', {});
		const gridBreakpoint = util.getValue(grid, breakpoint, {});
		return util.getValue(gridBreakpoint, 'content', {});
	}

	renderChildren() {
		const {
			kind,
			breakpoint,
			articleID,
			orgID,
			name,
			block,
			blockRef,
			modalID,
			options,
			fieldValue,
			gbxStyle,
			globalButton,
			globalButtonStyle,
			primaryColor,
			scrollTo
		} = this.props;

		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				kind,
				articleID,
				orgID,
				name,
				block,
				blockRef,
				modalID,
				options,
				fieldValue,
				gbxStyle,
				globalButton,
				globalButtonStyle,
				primaryColor,
				breakpoint,
				scrollTo,
				blockContent: this.getBlockContent(breakpoint),
				saveBlock: this.saveBlock,
				title: util.getValue(block, 'title', name),
				closeEditModal: this.closeEditModal,
				setDisplayHeight: this.setDisplayHeight,
				editModalOpen: this.state.editModalOpen,
				onClickRemove: this.onClickRemove
			})
		);
		return childrenWithProps;
	}

	render() {

		const {
			name,
			style
		} = this.props;

		const {
			editModalOpen
		} = this.state;

		return (
			<div style={style} className={`block ${name}Block`}>
				<div className={`dragHandle blockOptions ${editModalOpen ? 'displayNone' : ''}`}>
					<GBLink className='blockEdit' onClick={this.onClickEdit}><span className='icon icon-edit'></span>Edit</GBLink>
				</div>
				{this.renderChildren()}
			</div>
		)
	}

}

Block.defaultProps = {
	style: {}
}

function mapStateToProps(state, props) {

	const modalID = `modalBlock-${props.name}`;
	const gbx3 = util.getValue(state, 'gbx3', {});
	const layouts = util.getValue(gbx3, 'layouts', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const gbxPrimaryColor = util.getValue(gbxStyle, 'primaryColor');
	const globalButton = util.getValue(globals, 'button', {});
	const globalButtonStyle = util.getValue(globalButton, 'style', {});
	const primaryColor = util.getValue(globalButtonStyle, 'bgColor', gbxPrimaryColor);
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');
	const articleID = util.getValue(info, 'articleID');
	const orgID = util.getValue(info, 'orgID');
	const blocks = util.getValue(gbx3, 'blocks', {});
	const block = util.getValue(blocks, props.name, {});
	const dataField = util.getValue(block, 'field');
	const options = util.getValue(block, 'options', {});
	const data = util.getValue(gbx3, 'data', {});
	const fieldValue = util.getValue(data, dataField);

	return {
		kind,
		articleID,
		orgID,
		modalID,
		layouts,
		block,
		options,
		fieldValue,
		gbxStyle,
		globalButtonStyle,
		globalButton,
		primaryColor,
		breakpoint: util.getValue(info, 'breakpoint')
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	updateBlock,
	removeBlock,
	updateData,
	updateLayouts,
	saveGBX3
})(Block);
