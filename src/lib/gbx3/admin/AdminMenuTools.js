import React from 'react';
import { connect } from 'react-redux';
import {
	util
} from '../../';
import {
	updateAdmin,
	resetGBX3,
	saveGBX3
} from '../redux/gbx3actions';
import { toggleModal } from '../../api/actions';
import Publish from './Publish';

class AdminMenuTools extends React.Component {

	constructor(props) {
		super(props);
		this.reset = this.reset.bind(this);
		this.state = {
		};
	}

	reset() {
		this.props.resetGBX3();
	}

	render() {

		const {
			outline,
			preventCollision,
			verticalCompact,
			editable
		} = this.props;

		return (
			<div className='layoutMenu'>
				<ul>
					{<li onClick={() => this.props.updateAdmin({ editable: editable ? false : true }) }>Editable {util.toggle(editable)}</li>}
					<li onClick={() => this.props.updateAdmin({ outline: outline ? false : true })}>Edit Box Outlines {util.toggle(outline, { onText: <span className='icon icon-eye'></span>, offText: <span className='icon icon-eye-off'></span>})}</li>
					<li onClick={() => this.props.updateAdmin({ preventCollision: preventCollision ? false : true })}>Prevent Collision {util.toggle(preventCollision)}</li>
					<li onClick={() => this.props.updateAdmin({ verticalCompact: verticalCompact ? false : true })}>Vertical Compact {util.toggle(verticalCompact)}</li>
					<li onClick={this.reset}>Reset Layout</li>
				</ul>
				<Publish />
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const blockType = props.blockType;
	const availableBlocks = util.getValue(admin, `availableBlocks.${blockType}`, []);
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const editable = util.getValue(admin, 'editable');
	const preventCollision = util.getValue(admin, 'preventCollision');
	const verticalCompact = util.getValue(admin, 'verticalCompact');
	const outline = util.getValue(admin, 'outline');

	return {
		availableBlocks,
		globals,
		gbxStyle,
		editable,
		preventCollision,
		verticalCompact,
		outline
	}
}

export default connect(mapStateToProps, {
	updateAdmin,
	resetGBX3,
	saveGBX3,
	toggleModal
})(AdminMenuTools);
