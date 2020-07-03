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
		this.width = null;
	}

	setDisplayHeight(ref) {
		if (ref) {
			if (ref.current) {
				this.height = ref.current.clientHeight;
				this.width = ref.current.clientWidth;
			}
		}
	}

	onClickEdit() {
		const {
			blockType
		} = this.props;

		this.props.toggleModal(this.props.modalID, true);
		this.props.updateAdmin({ editBlock: `${blockType}-${this.props.name}` });
	}

	async onClickRemove() {
		const {
			blockType
		} = this.props;

		const blockRemoved = await this.props.removeBlock(blockType, this.props.name);
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

		const desktopGrid = !util.getValue(block, 'mobileNoUpdateDesktopGrid') ? { ...util.getValue(block, 'grid.desktop', {}), ...grid } : { ...util.getValue(block, 'grid.desktop', {}) };

		const saveCallback = () => {
			callback();
		};

		if (opts.hasBeenUpdated) {
			const updated = [];
			const checkForUpdatesCount = !util.isEmpty(data) ? 2 : 1;

			const blockToUpdate = {
				...block,
				content: content || this.getBlockContent(),
				grid: {
					...util.getValue(block, 'grid', {}),
					desktop: {
					...util.getValue(block, 'grid.desktop', {}),
					...desktopGrid
					}
				},
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
					this.props.saveGBX3(blockType, {
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

	getBlockContent() {
		const {
			block
		} = this.props;

		return util.getValue(block, 'content', {});
	}

	renderChildren() {
		const {
			kind,
			breakpoint,
			articleID,
			orgID,
			name,
			blockType,
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
				blockType,
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
				blockContent: this.getBlockContent(),
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
			nonremovable,
			block,
			blockType
		} = this.props;

		const scrollableBlock = util.getValue(block, 'scrollable');

		return (
			<div className='block'>
				<div className={`dragHandle blockOptions ${editBlock === `${blockType}-${name}` ? 'displayNone' : ''}`}>
					<div className='blockEdit'>
						{!nonremovable ? <GBLink className='blockRemoveButton' onClick={() => this.onClickRemove()}><span className='icon icon-trash-2'></span></GBLink> : <></>}
						<GBLink className='blockEditButton' onClick={this.onClickEdit}><span className='icon icon-edit'></span></GBLink>
					</div>
				</div>
				<div style={style} className={`block ${name}Block ${scrollableBlock ? 'scrollableBlock' : ''}`}>
					{this.renderChildren()}
				</div>
			</div>
		)
	}

}

Block.defaultProps = {
	style: {}
}

function mapStateToProps(state, props) {

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
	const blockType = props.blockType;
	const layouts = util.getValue(gbx3, `layouts.${blockType}`, {});
	const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
	const block = util.getValue(blocks, props.name, {});
	const nonremovable = util.getValue(block, 'nonremovable');
	const dataField = util.getValue(block, 'field');
	const options = util.getValue(block, 'options', {});
	const data = util.getValue(gbx3, 'data', {});
	const fieldValue = util.getValue(data, dataField);
	const modalID = `modalBlock-${blockType}-${props.name}`;


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
