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
import Confirmation from './payment/Confirmation';
import {
	updateAdmin
} from './redux/gbx3actions';
import AvatarMenuButton from './admin/AvatarMenuButton';
import { AiOutlineNotification } from 'react-icons/ai';

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
			access,
			preview,
			stage,
			hasAccessToEdit,
			publishStatus,
			display,
			orgName,
			primaryColor,
			modal
		} = this.props;

		const style = { maxWidth: '850px' };

		console.log('execute stage', stage);
		let gbx3BackgroundHeight = 'auto';
		if (stage === 'admin') {
			const el = document.getElementById('GBX3StageAligner');
			if (el) {
				const height = el.clientHeight + 100;
				gbx3BackgroundHeight = `${height}px`;
			}
		}

		const avatarMenu =
			<div className='hasAccessToEditPublic'>
				<AvatarMenuButton />
				{ hasAccessToEdit ?
				<div onClick={() => this.props.updateAdmin({ publicView: false })} className='avatarLink'>
					<div className='editGraphic'>
						<span className='icon icon-edit'></span>
					</div>
				</div> : ''}
				{ hasAccessToEdit ?
				<ModalLink type='div' id='share' className='avatarLink'>
					<div className='editGraphic'>
						<Icon><AiOutlineNotification /></Icon>
					</div>
				</ModalLink> : ''}
			</div>
		;

		const showAvatarMenu = (stage !== 'admin') && !preview && !util.isEmpty(access) ? true : false;

		const noAccess = (!hasAccessToEdit || (hasAccessToEdit && !preview && stage === 'public' )) && (publishStatus === 'private') && (display === 'article') ? true : false;

		return (
			<>
			{ noAccess ?
				<div className='noAccessToGBX'>
					<span style={{ fontSize: 30, margin: '10px 0' }} className='icon icon-lock'></span>
					<span>This page is set to private.</span>
					{hasAccessToEdit ?
						<GBLink onClick={() => this.props.updateAdmin({ publicView: false })}>
							<span className='icon icon-chevron-left'></span> Go back to Form Builder
						</GBLink>
					:
						<GBLink onClick={() => console.log('shop')}>
							Click here to visit<br /><span style={{ fontWeight: 400 }}>{orgName}</span><br />
						</GBLink>
					}
				</div>
			: ''}
			<div style={{ height: gbx3BackgroundHeight }} className='gbx3LayoutBackground'></div>
			<div id='gbx3Layout' className={`gbx3Layout ${noAccess ? 'noAccess' : ''}`}>
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
						disallowBgClose={true}
						component={(props) => <Shop {...props} reloadGBX3={this.props.reloadGBX3} />}
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
	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const modal = util.getValue(info, 'modal');
	const stage = util.getValue(info, 'stage');
	const preview = util.getValue(info, 'preview');
	const display = util.getValue(info, 'display');
	const hasAccessToEdit = util.getValue(gbx3, 'admin.hasAccessToEdit');
	const publishStatus = util.getValue(info, 'publishStatus');
	const orgName = util.getValue(info, 'orgName');

	return {
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
