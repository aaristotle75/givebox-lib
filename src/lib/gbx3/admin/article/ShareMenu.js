import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink
} from '../../../';
import {
	updateInfo,
	updateAdmin,
	toggleAdminLeftPanel,
	createFundraiser
} from '../../redux/gbx3actions';

class ShareMenu extends React.Component {

	constructor(props) {
		super(props);
		this.updateSubStep = this.updateSubStep.bind(this);
		this.state = {
		};
	}

	updateSubStep(subStep) {
		this.props.updateAdmin({ subStep });
	}

	render() {

		const {
			openAdmin: open,
			subStep
		} = this.props;

		return (
			<div className='leftPanelContainer'>
				<div className='leftPanelTop'>
					<div className='leftPanelHeader'>
						Share Menu
						<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
					</div>
					<div className='middle centerAlign adminPanelTabs'>
					</div>
				</div>
				<div className={`leftPanelScroller`}>
					<ul>
						<li
							onClick={() =>  this.updateSubStep('social')}
							className='link show'
						>
							Social Media
						</li>
						<li
							onClick={() =>  this.updateSubStep('embed')}
							className='link show'
						>
							Embed Widget
						</li>
						<li
							onClick={() =>  this.updateSubStep('emailBlast')}
							className='link show'
						>
							Email Blast
						</li>
					</ul>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');
	const editable = util.getValue(admin, 'editable');
	const subStep = util.getValue(admin, 'subStep');

	return {
		editable,
		openAdmin
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	updateAdmin,
	toggleAdminLeftPanel,
	createFundraiser
})(ShareMenu);
