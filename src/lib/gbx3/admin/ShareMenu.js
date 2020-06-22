import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	GBLink,
	updateInfo,
	toggleAdminLeftPanel,
	createFundraiser
} from '../../';

class ShareMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		const {
			editable,
			openAdmin: open
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
							onClick={() =>  console.log('')}
							className='link show'
						>
							Embed Widget
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

	return {
		editable,
		openAdmin
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	toggleAdminLeftPanel,
	createFundraiser
})(ShareMenu);
