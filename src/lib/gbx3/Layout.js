import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalRoute,
	GBLink
} from '../';
import Shop from './Shop';
import Article from './Article';
import Confirmation from './payment/Confirmation';
import {
	updateAdmin
} from './redux/gbx3actions';

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

		const avatar =
			<div className='hasAccessToEditPublic'>
				<div onClick={() => this.props.updateAdmin({ publicView: false })} className='avatarLink'>
					{access.userImage ? <div className='avatarImage'><img src={util.imageUrlWithStyle(access.userImage, 'small')} alt='Avatar Small Circle' /></div> :
						<div className='defaultAvatarImage'>{access.initial}</div>
					}
				</div>
			</div>
		;

		const showAvatar = (stage !== 'admin') && !preview && hasAccessToEdit ? true : false;

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
			<div className='gbx3LayoutBackground'></div>
			<div id='gbx3Layout' className={`gbx3Layout ${noAccess ? 'noAccess' : ''}`}>
				{showAvatar ? avatar : '' }
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
