import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalLink,
	ModalRoute,
	GBLink
} from '../../';
import {
	updateAdmin,
	resetGBX3
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

		const {
			blockType
		} = this.props;

		this.props.toggleModal('resetConfirmation', false);
		this.props.resetGBX3(blockType);
	}

	render() {

		const {
			outline,
			preventCollision,
			verticalCompact,
			editable,
			blockType
		} = this.props;

		return (
			<div className='layoutMenu'>
				<ModalRoute
					id='resetConfirmation'
					effect='3DFlipVert'
					style={{ width: '60%' }}
					className='gbx3'
					component={(props) =>
						<div className='modalWrapper'>
							<div className='center'>
								<h2 style={{ marginBottom: 10 }}>Please confirm you want to reset.</h2>
								All style, layout and content changes will be reverted to defaults.
							</div>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.props.toggleModal('resetConfirmation', false)}>Cancel</GBLink>
								<GBLink className='button' onClick={this.reset}>Confirm Reset</GBLink>
							</div>
						</div>
					}
				/>
				<ul>
					{<li onClick={() => this.props.updateAdmin({ editable: editable ? false : true }) }>Editable {util.toggle(editable)}</li>}
					<li onClick={() => this.props.updateAdmin({ outline: outline ? false : true })}>Edit Box Outlines {util.toggle(outline, { onText: <span className='icon icon-eye'></span>, offText: <span className='icon icon-eye-off'></span>})}</li>
					<li onClick={() => this.props.updateAdmin({ preventCollision: preventCollision ? false : true })}>Prevent Collision {util.toggle(preventCollision)}</li>
					<li onClick={() => this.props.updateAdmin({ verticalCompact: verticalCompact ? false : true })}>Vertical Compact {util.toggle(verticalCompact)}</li>
					<ModalLink type='li' id='resetConfirmation'>
						<>
							Reset
							<span className='wrap smallText gray'>Caution! This resets everything<br /> including content.</span>
						</>
					</ModalLink>
				</ul>
				{ blockType === 'article' ? <Publish /> : '' }
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
	toggleModal
})(AdminMenuTools);
