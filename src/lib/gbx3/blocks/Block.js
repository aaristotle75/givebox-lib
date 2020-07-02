import React from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	toggleModal,
	updateAdmin,
	updateBlock,
	removeBlock,
	updateData,
	saveGBX3,
	updateLayouts
} from '../../';
import has from 'has';

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
		this.height = null;
	}

	componentDidMount() {
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
		this.props.updateAdmin({ editBlock: this.props.name });
	}

	async onClickRemove() {
		const blockRemoved = await this.props.removeBlock(this.props.name);
		if (blockRemoved) {
			this.props.updateAdmin({ editBlock: '' });
			this.props.toggleModal(this.props.modalID, false);
		}
	}

	closeEditModal() {
		this.props.toggleModal(this.props.modalID, false);
		this.props.updateAdmin({ editBlock: '' });
	}

	async saveBlock(params = {}) {
		const {
			name,
			block,
			breakpoint,
			blockType
		} = this.props;

		const opts = {
			content: {},
			options: {},
			data: {},
			hasBeenUpdated: false,
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
			///const addHeight = parseInt(grid.h * .1);
			//if (grid.h) grid.h = grid.h + addHeight;
		}

		const mobileContent = content || this.getBlockContent('mobile');
		const mobileGrid = has(block.grid, 'mobile') ? { ...block.grid.mobile } : {};
		const desktopContent = content || this.getBlockContent('desktop');
		const desktopGrid = breakpoint === 'desktop' ? { ...block.grid.desktop, ...grid } : { ...block.grid.desktop };

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

		const saveCallback = () => {
			callback();
		};

		if (opts.hasBeenUpdated) {
			const updated = [];
			const checkForUpdatesCount = !util.isEmpty(data) ? 2 : 1;

			const blockToUpdate = {
				...block,
				grid: blockGrid,
				options: {
					...block.options,
					...options
				}
			}

			const blocksUpdated = await this.props.updateBlock(blockType, name, blockToUpdate);
			if (blocksUpdated) updated.push('blocksUpdated');

			if (!util.isEmpty(data)) {
				const dataUpdated = await this.props.updateData(data);
				if (dataUpdated) updated.push('dataUpdated');
			}

			if (updated.length === checkForUpdatesCount) {
				if (saveGBX3 && opts.hasBeenUpdated) {
					this.props.saveGBX3({
						callback: saveCallback,
						updateLayout: !util.isEmpty(grid) ? true : false
					});
				}
				else saveCallback();
			}
		} else {
			saveCallback();
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
			scrollTo,
			reloadGBX3
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
				reloadGBX3,
				blockContent: this.getBlockContent(breakpoint),
				saveBlock: this.saveBlock,
				title: util.getValue(block, 'title', name),
				closeEditModal: this.closeEditModal,
				setDisplayHeight: this.setDisplayHeight,
				onClickRemove: this.onClickRemove
			})
		);
		return childrenWithProps;
	}

	render() {

		const {
			name,
			style,
			editBlock,
			nonremovable
		} = this.props;

		return (
			<div style={style} className={`block ${name}Block`}>
				<div className={`dragHandle blockOptions ${editBlock === name ? 'displayNone' : ''}`}>
					<div className='blockEdit'>
						{!nonremovable ? <GBLink className='blockRemoveButton' onClick={() => this.onClickRemove()}><span className='icon icon-trash-2'></span></GBLink> : <></>}
						<GBLink className='blockEditButton' onClick={this.onClickEdit}><span className='icon icon-edit'></span></GBLink>
					</div>
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
	const admin = util.getValue(gbx3, 'admin', {});
	const editBlock = util.getValue(admin, 'editBlock');
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
	const blockType = util.getValue(info, 'blockType');
	const layouts = util.getValue(gbx3, `layouts.${blockType}`, {});
	const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
	const block = util.getValue(blocks, props.name, {});
	const nonremovable = util.getValue(block, 'nonremovable');
	const dataField = util.getValue(block, 'field');
	const options = util.getValue(block, 'options', {});
	const data = util.getValue(gbx3, 'data', {});
	const fieldValue = util.getValue(data, dataField);

	return {
		editBlock,
		kind,
		articleID,
		orgID,
		modalID,
		layouts,
		blockType,
		block,
		nonremovable,
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
	updateAdmin,
	toggleModal,
	updateBlock,
	removeBlock,
	updateData,
	updateLayouts,
	saveGBX3
})(Block);
