import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
	util,
	updateAdmin,
	updateBlock,
	saveReceipt
} from '../../';
import Block from '../blocks/Block';

class ReceiptEmailLayout extends React.Component {

	constructor(props) {
		super(props);
		this.renderRelativeBlocks = this.renderRelativeBlocks.bind(this);
		this.saveBlock = this.saveBlock.bind(this);
		this.gridRef = React.createRef();
	}

	componentDidMount() {
	}

	async saveBlock(args) {
		const {
			name,
			block,
			opts
		} = args;

		const {
			content,
			options,
			hasBeenUpdated,
			callback
		} = opts;

		if (hasBeenUpdated) {

			const blockToUpdate = {
				...block,
				content,
				options: {
					...block.options,
					...options
				}
			}
			const blocksUpdated = await this.props.updateBlock('receipt', name, blockToUpdate);
			if (blocksUpdated) {
				this.props.saveReceipt({
					callback
				});
			}
		} else {
			callback();
		}
	}

	renderRelativeBlocks() {
		const {
			outline,
			blocks
		} = this.props;

		const items = [];

		if (!util.isEmpty(blocks)) {
			const relativeBlocks = [];
			Object.entries(blocks).forEach(([key, value]) => {
				relativeBlocks.push(value);
			});
			util.sortByField(relativeBlocks, 'mobileRelativeBlock', 'ASC');
			if (!util.isEmpty(relativeBlocks)) {
				Object.entries(relativeBlocks).forEach(([key, value]) => {
					const BlockComponent = Loadable({
						loader: () => import(`../blocks/${value.type}`),
						loading: () => <></>
					});
					const ref = React.createRef();
					items.push(
						<div
							className={`react-grid-item ${util.getValue(value, 'mobileClassName', 'mobileRelativeBlock')} ${outline ? 'outline' : ''}`}
							id={`block-${value.name}`}
							key={value.name}
							ref={ref}
						>
							<Block
								name={value.name}
								blockRef={React.createRef()}
								style={{ position: 'relative' }}
								blockType={'receipt'}
								saveBlock={this.saveBlock}
							>
								<BlockComponent />
							</Block>
						</div>
					);
				});
			}
		}

		return items;
	}

	render() {

		const {
			editable,
			hasAccessToEdit,
		} = this.props;

		const isEditable = hasAccessToEdit && editable ? true : false;

		return (
			<>
				<div className='layout-column'>
					<div
						id='gbx3DropArea'
						ref={this.gridRef}
						className={`dropArea`}
						onDragOver={(e) => {
							e.preventDefault();
						}}
						onDrop={(e) => {
							e.preventDefault();
							if (isEditable) {
								const w = e.clientX;
								const h = e.clientY;
								const block = e.dataTransfer.getData('text');
								const current = this.gridRef.current;
								if (current.classList.contains('dragOver')) current.classList.remove('dragOver');
								this.props.addBlock('receipt', block, w, h, this.gridRef);
							}
						}}
					>
						<div className='dragOverText'>Drop Page Element Here</div>
						{this.renderRelativeBlocks()}
					</div>
				</div>
			</>
		)
	}

}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const blockType = 'receipt';
	const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
	const breakpoint = util.getValue(info, 'breakpoint');
	const admin = util.getValue(gbx3, 'admin', {});
	const editable = util.getValue(admin, 'editable');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');

	return {
		breakpoint,
		blockType,
		blocks,
		editable,
		hasAccessToEdit,
		globals: util.getValue(gbx3, 'globals', {})
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	updateBlock,
	saveReceipt
})(ReceiptEmailLayout);
