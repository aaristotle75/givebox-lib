import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	updateAdmin,
	updateGlobals,
	resetGBX3,
	saveGBX3,
	toggleModal
} from '../../';
import blockTemplates from '../blocks/blockTemplates';

class DesignMenuLayout extends React.Component {

	constructor(props) {
		super(props);
		this.renderActiveBlocks = this.renderActiveBlocks.bind(this);
		this.renderAvailableBlocks = this.renderAvailableBlocks.bind(this);
		this.state = {
		};
	}

	renderActiveBlocks() {
		const {
			blocks
		} = this.props;
		const items = [];

		return items;
	}

	renderAvailableBlocks() {
		const {
			availableBlocks
		} = this.props;

		const items = [];

		availableBlocks.forEach((value) => {
			items.push(
				<li
					key={value}
					className='draggableBlock'
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
					Add {blockTemplates[value].title}
				</li>
			);
		});

		return (
			<ul>
				{items}
			</ul>
		)
	}

	render() {

		const {
			editable
		} = this.props;

		return (
			<div className='layoutMenu'>
				<ul>
					<li className='link show' onClick={() => this.props.updateAdmin({ editable: editable ? false : true }) }>{editable ? 'Turn Editable Off' : 'Turn Editable On'}</li>
				</ul>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const availableBlocks = util.getValue(admin, 'availableBlocks', []);
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const editable = util.getValue(admin, 'editable');

	return {
		availableBlocks,
		globals,
		gbxStyle,
		editable
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	updateGlobals,
	resetGBX3,
	saveGBX3,
	toggleModal
})(DesignMenuLayout);
