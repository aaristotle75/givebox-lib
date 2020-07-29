import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	Alert
} from '../../../';
import ShareMenu from './ShareMenu';
import ShareLink from './ShareLink';
import {
	sendResource
} from '../../../api/helpers';
import {
	updateInfo
} from '../../redux/gbx3actions';
import ShareSocial from './ShareSocial';
import ShareEmbed from './ShareEmbed';
import ShareIframe from './ShareIframe';
import ShareEmailBlast from './ShareEmailBlast';

class Share extends React.Component {

	constructor(props) {
		super(props);
		this.renderSubStep = this.renderSubStep.bind(this);
		this.state = {
		};
	}

	componentDidMount() {
		/*
		this.props.sendResource('gbxPreview', {
			id: [this.props.articleID],
			method: 'post',
			reload: true,
			data: {},
			callback: (res, err) => {
				console.log('execute gbxPreview', res, err);
			}
		});
		*/
	}

	renderSubStep() {
		const {
			subStep
		} = this.props;

		const item = [];
		switch (subStep) {

			case 'emailBlast': {
				item.push(
					<ShareEmailBlast key='shareEmailBlast' />
				);
				break;
			}

			case 'embed': {
				item.push(
					<ShareEmbed key='shareEmbed' />
				);
				break;
			}

			case 'iframe': {
				item.push(
					<ShareIframe key='shareIframe' />
				);
				break;
			}

			case 'social':
			default: {
				item.push(
					<ShareSocial key='shareSocial' />
				);
				break;
			}

		}


		return (
			<div>
				{item}
			</div>
		)
	}

	render() {

		const {
			openAdmin: open,
			hasAccessToEdit,
			kind,
			webApp
		} = this.props;


		if (!hasAccessToEdit) {
			return (
				<div className='flexCenter flexColumn centeritems'>You do not have access.</div>
			)
		}

		return (
			<>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					<ShareMenu />
				</div>
				<div className={`stageContainer ${open ? 'open' : 'close'}`}>
					<Alert alert='passive' display={util.getPublishStatus(kind, webApp) === 'private' ? true : false} msg={`Your ${types.kind(kind).name} is Set to Private`} />
					<div className='stageAligner'>
						{this.renderSubStep()}
					</div>
				</div>
				<div className={`bottomPanel ${open ? 'open' : 'close'}`}>
					<div className='centerAlign adminPanelTabs'>
						<ShareLink />
					</div>
				</div>
			</>
		)
	}
}

Share.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');
	const articleID = util.getValue(info, 'articleID');
	const globals = util.getValue(gbx3, 'globals', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const subStep = util.getValue(admin, 'subStep');
	const openAdmin = util.getValue(admin, 'open');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const webApp = util.getValue(gbx3, 'data.publishedStatus.webApp');

	return {
		kind,
		articleID,
		globals,
		subStep,
		openAdmin,
		hasAccessToEdit,
		webApp
	}
}

export default connect(mapStateToProps, {
	sendResource,
	updateInfo
})(Share);
