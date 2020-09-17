import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	Icon
} from '../../../';
import ShareSocial from './ShareSocial';
import { FiCopy } from 'react-icons/fi';
import { TiSocialFacebook } from 'react-icons/ti';
import { FiPenTool } from 'react-icons/fi';
import ShareLinkCopy from './ShareLinkCopy';
import ShareLinkEdit from './ShareLinkEdit';

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
	}

	setShareTypeSelected(shareTypeSelected) {
		this.setState({ shareTypeSelected });
	}

	renderShareList() {

		const {
			shareTypeSelected
		} = this.state;

		const shareTypes = [
			{ type: 'copy', name: 'Copy Your Link', icon: <Icon><FiCopy /></Icon>, imageURL: '' },
			{ type: 'edit', name: 'Edit Your Link', icon: <Icon><FiPenTool /></Icon>, imageURL: '', restricted: true },
			{ type: 'social', name: 'Share to Social Media', icon: <Icon><TiSocialFacebook /></Icon>, imageURL: '' }
		];

		const items = [];
		shareTypes.forEach((value, key) => {
			items.push(
				<div key={key} className='createKindItem' onClick={() => this.setShareTypeSelected(value.type)}>
					<div className='createIcon'>{value.icon}</div>
					<span style={{ fontSize: '1em' }} className='createKindItemText'>
						{value.name}
					</span>
					<div className='shareIndicator'>{ shareTypeSelected === value.type ? <span className='icon icon-chevron-down'></span> : '' }</div>
				</div>
			);
		});

		return (
			<div className='createKindSection'>
				<span className='intro'>Share Your Page</span>
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

		return (
			<div className='createStep'>
				<div style={{ paddingTop: 0 }} className={`modalWrapper`}>
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
	const globals = util.getValue(gbx3, 'globals', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const subStep = util.getValue(admin, 'subStep');

	return {
		globals,
		subStep
	}
}

export default connect(mapStateToProps, {
})(Share);
