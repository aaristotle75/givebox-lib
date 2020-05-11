import React from 'react';
import { connect } from 'react-redux';
import {
	GBLink,
	util,
	toggleModal,
	updateBlock,
	saveGBX3
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
		this.state = {
			editModalOpen: false
		};
	}

	componentDidMount() {
	}

	onClickEdit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ editModalOpen: true });
	}

	onClickRemove() {
		console.log('execute onClickRemove', this.props.name);
	}

	closeEditModal() {
		this.props.toggleModal(this.props.modalID, false);
		this.setState({ editModalOpen: false });
	}

	async saveBlock(content = {}, options = {}, saveGBX3 = true, callback = this.closeEditModal, updateSpecificGrid = false) {
		const {
			name,
			block,
			breakpoint
		} = this.props;

		const mobileContent = updateSpecificGrid && breakpoint === 'mobile' ? content : !updateSpecificGrid ? content : this.getBlockContent('mobile');

		const desktopContent = updateSpecificGrid && breakpoint === 'desktop' ? content : !updateSpecificGrid ? content : this.getBlockContent('desktop');

		const updated = await this.props.updateBlock(name, Object.assign({}, block, {
			grid: {
				mobile: {
					...block.grid.mobile,
					content: {
						...util.getValue(block.grid.mobile, 'content', {}),
						...mobileContent
					}
				},
				desktop: {
					...block.grid.desktop,
					content: {
						...util.getValue(block.grid.desktop, 'content', {}),
						...desktopContent
					}
				}
			},
			options: {
				...block.options,
				...options
			}
		}));
		if (updated) {
			if (saveGBX3) this.props.saveGBX3(null, false, callback);
			else callback();
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
			primaryColor
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
				blockContent: this.getBlockContent(breakpoint),
				saveBlock: this.saveBlock,
				title: util.getValue(block, 'title', name),
				closeEditModal: this.closeEditModal
			})
		);
		return childrenWithProps;
	}

	render() {

		const {
			name,
			block
		} = this.props;

		const {
			editModalOpen
		} = this.state;

		return (
			<div className={`block ${name}Block`}>
				<div className={`blockOptions ${editModalOpen ? 'displayNone' : ''}`}>
					<GBLink className='blockEdit' onClick={this.onClickEdit}><span className='icon icon-edit'></span>Edit</GBLink>
					<div className='dragHandle blockEdit'><span className='icon icon-move'></span></div>
					{util.getValue(block, 'remove', true) ? <GBLink className='link blockRemove' onClick={this.onClickRemove}><span className='icon icon-x'></span></GBLink> : ''}
				</div>
				{this.renderChildren()}
			</div>
		)
	}

}

Block.defaultProps = {
}

function mapStateToProps(state, props) {

	const modalID = `modalBlock-${props.name}`;
	const gbx3 = util.getValue(state, 'gbx3', {});
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
	saveGBX3
})(Block);
