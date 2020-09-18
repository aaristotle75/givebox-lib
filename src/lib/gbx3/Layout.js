import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalRoute,
	ModalLink,
	GBLink,
	Icon
} from '../';
import Shop from './Shop';
import Article from './Article';
import Org from './Org';
import Confirmation from './payment/Confirmation';
import {
	updateAdmin
} from './redux/gbx3actions';
import AvatarMenuButton from './admin/AvatarMenuButton';
import { AiOutlineNotification, AiOutlineTrophy } from 'react-icons/ai';

const SHARE_URL = process.env.REACT_APP_GBX_SHARE;

class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.closeGBXModal = this.closeGBXModal.bind(this);
		this.state = {
		}
	}

	componentDidMount() {
	}

	closeGBXModal() {
		window.postMessage('closeGivebox', '*');
		window.parent.postMessage('closeGivebox', '*');
	}

	renderDisplay() {
		const {
			display
		} = this.props;

		const items = [];

		switch (display) {
			case 'shop': {
				items.push(
					<Shop
						key={'shop'}
						reloadGBX3={this.props.reloadGBX3}
					/>
				)
				break;
			}

			case 'org': {
				items.push(
					<Org
						key={'org'}
						reloadGBX3={this.props.reloadGBX3}
						loadGBX3={this.props.loadGBX3}
						primaryColor={this.props.primaryColor}
						onClickVolunteerFundraiser={this.props.onClickVolunteerFundraiser}
					/>
				)
				break;
			}

			case 'article':
			default: {
				items.push(
					<Article
						key={'article'}
						reloadGBX3={this.props.reloadGBX3}
						loadGBX3={this.props.loadGBX3}
						primaryColor={this.props.primaryColor}
						onClickVolunteerFundraiser={this.props.onClickVolunteerFundraiser}
					/>
				)
				break;
			}
		}
		return items;
	}

	render() {

		const {
			orgSlug,
			access,
			preview,
			stage,
			hasAccessToEdit,
			publishStatus,
			display,
			orgName,
			primaryColor,
			modal,
			kind,
			status
		} = this.props;

		const style = { maxWidth: display === 'org' ? '1000px' : '850px' };

		let gbx3BackgroundHeight = 'auto';
		const el = document.getElementById('GBX3StageAligner');
		if (el) {
			const height = el.clientHeight + 100;
			gbx3BackgroundHeight = `${height}px`;
		}

		const avatarMenu =
			<div className='hasAccessToEditPublic'>
				<AvatarMenuButton />
				{ hasAccessToEdit ?
				<div onClick={() => this.props.updateAdmin({ publicView: false })} className='avatarLink hideOnMobile'>
					<div className='editGraphic'>
						<span className='icon icon-edit'></span>
					</div>
				</div> : ''}
				{ hasAccessToEdit ?
				<ModalLink type='div' id={'share'} className='avatarLink hideOnMobile'>
					<div className='editGraphic'>
						<Icon><AiOutlineNotification /></Icon>
					</div>
				</ModalLink> : ''}
			</div>
		;

		const showAvatarMenu = (stage !== 'admin') && !preview && !util.isEmpty(access) ? true : false;

		// This is article display specific
		const noAccess = (!hasAccessToEdit || (hasAccessToEdit && !preview && stage === 'public' )) && (publishStatus === 'private') && (display === 'article') ? true : false;

		// This is article sweepstakes specific
		const done = kind === 'sweepstake' && status === 'done' ? true : false;

		const publicOnly = (stage !== 'admin') && !preview ? true : false;

		return (
			<>
			{ done ?
				<div className='noAccessToGBX'>
					<Icon><AiOutlineTrophy /></Icon>
					<span className='center'>The Sweepstakes has Ended and the Winner Chosen</span>
					{!hasAccessToEdit ?
						<GBLink onClick={() => window.location.href = `${SHARE_URL}/${orgSlug}`}>
							Click Here to Visit<br /><span style={{ fontWeight: 400 }}>{orgName}</span><br />
						</GBLink>
					:
						''
					}
				</div>
			: ''}

			{ noAccess ?
				<div className='noAccessToGBX'>
					<span className='icon icon-lock'></span>
					<span className='center'>The Page is Set to Private</span>
					{hasAccessToEdit ?
						<GBLink onClick={() => this.props.updateAdmin({ publicView: false })}>
							<span className='icon icon-chevron-left'></span> Go Back to Form Builder
						</GBLink>
					:
						<GBLink onClick={() => window.location.href = `${SHARE_URL}/${orgSlug}`}>
							Click here to visit<br /><span style={{ fontWeight: 400 }}>{orgName}</span><br />
						</GBLink>
					}
				</div>
			: ''}

			{ publicOnly && this.props.backToOrgCallback ?
				<div onClick={() => this.props.backToOrgCallback('org')} className='backToOrgPage avatarLink'>
					<div className='editGraphic'>
						<span className='icon icon-chevron-left'></span>
					</div>
				</div>
			:'' }

			<div style={{ height: gbx3BackgroundHeight }} className='gbx3LayoutBackground'></div>
			<div id='gbx3Layout' className={`gbx3Layout ${display} ${noAccess ? 'noAccess' : ''}`}>
				{showAvatarMenu ? avatarMenu : '' }
				<div
					style={{
						...style
					}}
					className={`gbx3Container`}
				>
					{modal ? <GBLink customColor={primaryColor} allowCustom={true} className='closeGBXModalButton' onClick={() => this.closeGBXModal()}><span className='icon icon-x'></span></GBLink> : <></>}
					{this.renderDisplay()}
					<ModalRoute
						id='shop'
						className='gbx3 givebox-paymentform'
						effect='3DFlipVert'
						style={{ width: '70%' }}
						disallowBgClose={false}
						component={(props) => <Shop {...props} hideGoBack={true} reloadGBX3={this.props.reloadGBX3} />}
					/>
					<ModalRoute
						id='paymentConfirmation'
						effect='scaleUp'
						style={{ width: '60%' }}
						className='gbx3'
						component={() =>
							<Confirmation primaryColor={this.props.primaryColor} />
						}
					/>
				</div>
			</div>
			</>
		)
	}

}

function mapStateToProps(state, props) {

	const access = util.getValue(state, 'resource.access');
	const orgSlug = util.getValue(state, 'resource.article.data.orgSlug');
	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');
	const status = util.getValue(gbx3, 'data.status');
	const modal = util.getValue(info, 'modal');
	const stage = util.getValue(info, 'stage');
	const preview = util.getValue(info, 'preview');
	const display = util.getValue(info, 'display');
	const hasAccessToEdit = util.getValue(gbx3, 'admin.hasAccessToEdit');
	const publishStatus = util.getValue(info, 'publishStatus');
	const orgName = util.getValue(info, 'orgName');

	return {
		orgSlug,
		kind,
		status,
		modal,
		access,
		display,
		stage,
		preview,
		hasAccessToEdit,
		publishStatus,
		orgName,
		globals: util.getValue(gbx3, 'globals', {})
	}
}

export default connect(mapStateToProps, {
	updateAdmin
})(Layout);
