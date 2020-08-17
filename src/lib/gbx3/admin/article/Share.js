import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	Alert,
	Image,
	Icon
} from '../../../';
import {
	sendResource
} from '../../../api/helpers';
import {
	updateInfo
} from '../../redux/gbx3actions';
import ShareSocial from './ShareSocial';
import ShareEmailBlast from './ShareEmailBlast';
import { FiCopy } from 'react-icons/fi';
import { TiSocialFacebook } from 'react-icons/ti';
import { MdWeb } from 'react-icons/md';
import { FiPenTool } from 'react-icons/fi';
import ShareLinkCopy from './ShareLinkCopy';
import ShareLinkEdit from './ShareLinkEdit';
import ShareWeb from './ShareWeb';

class Share extends React.Component {

	constructor(props) {
		super(props);
		this.renderShareType = this.renderShareType.bind(this);
		this.renderShareList = this.renderShareList.bind(this);
		this.setShareTypeSelected = this.setShareTypeSelected.bind(this);
		this.state = {
			shareTypeSelected: 'web'
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

	setShareTypeSelected(shareTypeSelected) {
		this.setState({ shareTypeSelected });
	}

	renderShareList() {
		const {
			kind,
			isVolunteer
		} = this.props;

		const shareTypes = [
			{ type: 'copy', name: 'Copy Your Link', icon: <Icon><FiCopy /></Icon>, imageURL: '' },
			{ type: 'edit', name: 'Edit Your Link', icon: <Icon><FiPenTool /></Icon>, imageURL: '', restricted: true },
			{ type: 'social', name: 'Share to Social Media', icon: <Icon><TiSocialFacebook /></Icon>, imageURL: '' },
			{ type: 'web', name: 'Add to Your Website', icon: <Icon><MdWeb /></Icon>, imageURL: '' }
		];

		const items = [];
		shareTypes.forEach((value, key) => {
			items.push(
				<div key={key} className='createKindItem' onClick={() => this.setShareTypeSelected(value.type)}>
					{/*<Image url={`https://s3-us-west-1.amazonaws.com/givebox/public/images/backgrounds/raise-${value}-lg.png`} maxSize={130} alt={types.kind(value).namePlural} />*/}
					{value.icon}
					<span className='createKindItemText'>
						{value.name}
					</span>
				</div>
			);
		});

		return (
			<div className='createKindSection'>
				<span className='intro'>Share Your {types.kind(kind).name}</span>
				<div className='createKindList'>
					{items}
				</div>
			</div>
		);
	}

	renderShareType() {
		const {
			shareTypeSelected
		} = this.state;

		const item = [];
		switch (shareTypeSelected) {

			case 'emailBlast': {
				item.push(
					<ShareEmailBlast key='shareEmailBlast' />
				);
				break;
			}

			case 'web': {
				item.push(
					<ShareWeb key='shareWeb' />
				);
				break;
			}

			case 'edit': {
				item.push(
					<ShareLinkEdit key='shareLinkEdit' />
				);
				break;
			}

			case 'copy': {
				item.push(
					<ShareLinkCopy key='shareLinkCopy' />
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
			kind,
			webApp
		} = this.props;


		return (
			<div className='createStep'>
				<div style={{ paddingTop: 0 }} className={`modalWrapper`}>
					<Alert alert='passive' display={util.getPublishStatus(kind, webApp) === 'private' ? true : false} msg={`Your ${types.kind(kind).name} is Set to Private`} />

					{this.renderShareList()}
					{this.renderShareType()}
				</div>
			</div>
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
	const webApp = util.getValue(gbx3, 'data.publishedStatus.webApp');

	return {
		kind,
		articleID,
		globals,
		subStep,
		webApp
	}
}

export default connect(mapStateToProps, {
	sendResource,
	updateInfo
})(Share);
