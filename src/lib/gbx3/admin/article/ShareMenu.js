import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalLink,
	Dropdown,
	types
} from '../../../';
import {
	updateInfo,
	updateAdmin,
	updateData,
	saveGBX3,
	toggleAdminLeftPanel
} from '../../redux/gbx3actions';
import { sendResource } from '../../../api/helpers';

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;

class ShareMenu extends React.Component {

	constructor(props) {
		super(props);
		this.updateSubStep = this.updateSubStep.bind(this);
		this.updatePublishStatus = this.updatePublishStatus.bind(this);
		this.state = {
			publishOpen: false
		};
	}

	updateSubStep(subStep) {
		this.props.updateAdmin({ subStep });
	}

	async updatePublishStatus(value) {
		const {
			kind,
			kindID,
			orgID
		} = this.props;

		const publishStatus = util.deepClone(this.props.publishStatus);
		switch (kind) {
			case 'fundraiser': {
				if (value === 'public') {
					publishStatus.webApp = true;
					publishStatus.mobileApp = true;
					publishStatus.swipeApp = true;
				} else {
					publishStatus.webApp = false;
					publishStatus.mobileApp = false;
					publishStatus.swipeApp = true;
				}
				break;
			}

			default: {
				if (value === 'public') {
					publishStatus.webApp = false;
					publishStatus.mobileApp = false;
					publishStatus.swipeApp = true;
				} else {
					publishStatus.webApp = true;
					publishStatus.mobileApp = true;
					publishStatus.swipeApp = true;
				}
				break;
			}
		}
		const dataUpdated = await this.props.updateData({
			publishedStatus: publishStatus
		});
		if (dataUpdated) {
			this.props.sendResource(types.kind(kind).api.publish, {
				orgID,
				id: [kindID],
				method: 'patch',
				isSending: false,
				data: publishStatus
			});
		}
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
					<ul>
						<li className='listHeader'>Status & Visibility</li>
						<li
							onClick={() => {
								const publishOpen = this.state.publishOpen ? false : true;
								this.setState({ publishOpen });
							}}
							className='stylePanel'
						>
							Visibility
							<Dropdown
								open={publishOpen}
								portalClass={'gbx3'}
								portalID={`leftPanel-publishStatus`}
								portal={true}
								name='publishStatus'
								contentWidth={175}
								label={''}
								className='leftPanelDropdown'
								fixedLabel={true}
								defaultValue={util.getPublishStatus(kind, webApp)}
								onChange={(name, value) => {
									this.updatePublishStatus(value);
								}}
								options={[
									{ primaryText: 'Public', secondaryText: 'Visible to Everyone.', value: 'public' },
									{ primaryText: 'Private', secondaryText: 'Only visible to site admins.', value: 'private' }
								]}
							/>
						</li>
					</ul>
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
