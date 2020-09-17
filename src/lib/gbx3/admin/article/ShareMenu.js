import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalLink
} from '../../../';
import {
	updateInfo,
	updateAdmin,
	updateData,
	saveGBX3,
	toggleAdminLeftPanel
} from '../../redux/gbx3actions';
import { sendResource } from '../../../api/helpers';
import Publish from '../Publish';

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;

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
			kind,
			webApp,
			openAdmin: open
		} = this.props;

		const {
			publishOpen
		} = this.state;

		return (
			<div className='leftPanelContainer'>
				<div style={{ height: 50 }} className='leftPanelTop'>
					<div className='leftPanelHeader'>
						Share Menu
						<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
					</div>
				</div>
				<div style={{ marginTop: 50 }} className={`leftPanelScroller`}>
					<Publish />
					<ul>
						<li className='listHeader'>Sharing</li>
						<li onClick={() => this.updateSubStep('social')}>
							Social Media
						</li>
						<ModalLink className='link show' id='editShareLink' type='li'>
							Share Link
						</ModalLink>
						<li onClick={() => this.updateSubStep('embed')}>
							Embed Widget
						</li>
						<li onClick={() => this.updateSubStep('iframe')}>
							Embed iFrame
						</li>
						<li onClick={() => window.location.href = `${CLOUD_URL}/email`}>
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
	const publishStatus = util.getValue(gbx3, 'data.publishedStatus', {});
	const webApp = util.getValue(publishStatus, 'webApp');
	const kind = util.getValue(gbx3, 'info.kind');
	const kindID = util.getValue(gbx3, 'info.kindID');
	const orgID = util.getValue(gbx3, 'info.orgID');

	return {
		editable,
		openAdmin,
		publishStatus,
		webApp,
		kind,
		kindID,
		orgID
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	updateAdmin,
	updateData,
	saveGBX3,
	toggleAdminLeftPanel,
	sendResource
})(ShareMenu);
