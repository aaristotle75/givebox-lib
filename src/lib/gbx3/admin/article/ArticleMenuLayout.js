import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	toggleModal,
	updateAdmin,
	addBlock
} from '../../../';
import blockTemplates from '../../blocks/blockTemplates';

class ArticleMenuLayout extends React.Component {

	constructor(props) {
		super(props);
		this.renderActiveBlocks = this.renderActiveBlocks.bind(this);
		this.renderAvailableBlocks = this.renderAvailableBlocks.bind(this);
		this.editBlock = this.editBlock.bind(this);
		this.state = {
		};
	}

	editBlock(name) {
		const {
			blockType
		} = this.props;
		const modalID = `modalBlock-${blockType}-${name}`;
		this.props.toggleModal(modalID, true);
		this.props.updateAdmin({ editBlock: `${blockType}-${name}` });
	}

	renderActiveBlocks() {
		const {
			blocks
		} = this.props;
		const items = [];
		const orderedBlocks = [];

		Object.entries(blocks).forEach(([key, value]) => {
			if (!util.getValue(value, 'multiple')) {
				orderedBlocks.push(value);
			}
		});
		util.sortByField(orderedBlocks, 'order', 'ASC');

		Object.entries(orderedBlocks).forEach(([key, value]) => {
			items.push(
				<li
					key={key}
					onClick={() => this.editBlock(value.name)}
				>
					{value.title}
				</li>
			);
		});

		return (
			<ul>
				{items}
			</ul>
		);
	}

	renderAvailableBlocks() {
		const {
			availableBlocks
		} = this.props;

		const items = [];

		availableBlocks.forEach((value) => {
			const block = util.getValue(blockTemplates.article, value, {});
			items.push(
				<li
					key={value}
					className='draggableBlock'
					onMouseUp={() => {
						const dropArea = document.getElementById('gbx3DropArea');
						const paymentForm = document.getElementById('block-paymentForm');
						if (dropArea && paymentForm) {
							const dropAreaheight = dropArea.clientHeight;
							const paymentFormHeight = paymentForm.clientHeight;
							const height = dropAreaheight - paymentFormHeight;
							this.props.addBlock('article', value, 0, height);
						}
					}}
					draggable={true}
					onDragStart={(e) => {
						e.dataTransfer.setData('text/plain', value);
						const el = document.getElementById('gbx3DropArea');
						if (el) {
							if (!el.classList.contains('dragOver')) el.classList.add('dragOver');
						}
					}}
					onDragEnd={(e) => {
						const el = document.getElementById('gbx3DropArea');
						if (el) {
							if (el.classList.contains('dragOver')) el.classList.remove('dragOver');
						}
					}}
				>
					Add {block.title}
				</li>
			);
		});

		return (
			<ul>
				<li className='listHeader'>Add Page Elements</li>
				{items}
			</ul>
		)
	}

	render() {

		return (
			<div className='layoutMenu'>
				{this.renderActiveBlocks()}
				{this.renderAvailableBlocks()}
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const blockType = 'article';
	const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
	const admin = util.getValue(gbx3, 'admin', {});
	const availableBlocks = util.getValue(admin, `availableBlocks.${blockType}`, []);

	return {
		blockType,
		blocks,
		availableBlocks
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	updateAdmin,
	addBlock
})(ArticleMenuLayout);
