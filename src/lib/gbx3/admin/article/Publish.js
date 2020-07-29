import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Dropdown,
	types
} from '../../../';
import {
	updateInfo,
	updateAdmin,
	updateData
} from '../../redux/gbx3actions';
import { sendResource } from '../../../api/helpers';

class Publish extends React.Component {

	constructor(props) {
		super(props);
		this.updatePublishStatus = this.updatePublishStatus.bind(this);
		this.state = {
			publishOpen: false
		};
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
			webApp
		} = this.props;

		const {
			publishOpen
		} = this.state;

		return (
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
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const publishStatus = util.getValue(gbx3, 'data.publishedStatus', {});
	const webApp = util.getValue(publishStatus, 'webApp');
	const kind = util.getValue(gbx3, 'info.kind');
	const kindID = util.getValue(gbx3, 'info.kindID');
	const orgID = util.getValue(gbx3, 'info.orgID');

	return {
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
	sendResource
})(Publish);
