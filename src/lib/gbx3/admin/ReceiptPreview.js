import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
	util
} from '../../';
import Block from '../blocks/Block';

class ReceiptEmailLayout extends React.Component {

	constructor(props) {
		super(props);
		this.renderRelativeBlocks = this.renderRelativeBlocks.bind(this);
		this.gridRef = React.createRef();
	}

	componentDidMount() {
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

		return (
			<>
				<div className='layout-column'>
					{this.renderPreview()}
				</div>
			</>
		)
	}

}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const blockType = 'receipt';
	const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});

	return {
		blockType,
		blocks
	}
}

export default connect(mapStateToProps, {
})(ReceiptEmailLayout);
