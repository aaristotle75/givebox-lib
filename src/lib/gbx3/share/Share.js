import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	Alert,
	Icon
} from '../../';
import {
	sendResource
} from '../../api/helpers';
import {
	updateInfo
} from '../redux/gbx3actions';
import ShareSocial from './ShareSocial';
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
			shareTypeSelected: 'copy'
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
			display
		} = this.props;

		const {
			shareTypeSelected
		} = this.state;

		const shareTypes = [
			{ type: 'copy', name: 'Copy Your Link', icon: <Icon><FiCopy /></Icon>, imageURL: '' },
			{ type: 'edit', name: 'Edit Your Link', icon: <Icon><FiPenTool /></Icon>, imageURL: '', restricted: true },
			{ type: 'social', name: 'Share to Social Media', icon: <Icon><TiSocialFacebook /></Icon>, imageURL: '' },
			{ type: 'web', name: 'Add to Your Website', icon: <Icon><MdWeb /></Icon>, imageURL: '', org: 'hide' }
		];

		const items = [];
		shareTypes.forEach((value, key) => {
			if (display === 'org' && value.org === 'hide') return;
			else {
				items.push(
					<div key={key} className='createKindItem' onClick={() => this.setShareTypeSelected(value.type)}>
						<div className='createIcon'>{value.icon}</div>
						<span style={{ fontSize: '1em' }} className='createKindItemText'>
							{value.name}
						</span>
						<div className='shareIndicator'>{ shareTypeSelected === value.type ? <span className='icon icon-chevron-down'></span> : '' }</div>
					</div>
				);
			}
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

		const {
			display
		} = this.props;

		const item = [];
		const orgDisplay = display === 'org' ? true : false;

		switch (shareTypeSelected) {

			case 'web': {
				if (!orgDisplay) {
					item.push(
						<ShareWeb key='shareWeb' />
					);
				}
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
					<Alert style={{ marginTop: 20 }} alert='error' display={util.getPublishStatus(kind, webApp) === 'private' ? true : false} msg={`Your ${types.kind(kind).name} is Set to Private`} />
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
	const display = util.getValue(info, 'display');
	const kind = util.getValue(info, 'kind');
	const articleID = util.getValue(info, 'articleID');
	const globals = util.getValue(gbx3, 'globals', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const subStep = util.getValue(admin, 'subStep');
	const webApp = util.getValue(gbx3, 'data.publishedStatus.webApp');

	return {
		display,
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
