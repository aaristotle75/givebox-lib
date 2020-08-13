import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink
} from '../../';
import { toggleModal } from '../../api/actions';
import {
	updateAdmin
} from '../redux/gbx3actions';

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;
const WALLET_URL = process.env.REACT_APP_WALLET_URL;

class AvatarMenu extends React.Component {

	constructor(props) {
		super(props);
		this.myAccountLink = this.myAccountLink.bind(this);
		this.directLink = this.directLink.bind(this);
		this.adminLink = this.adminLink.bind(this);
		this.state = {
		};
	}

	myAccountLink() {
		const {
			access
		} = this.props;

		this.props.toggleModal('avatarMenu', false);
		window.location.href = util.getValue(access, 'role') === 'user' ? WALLET_URL : CLOUD_URL;
	}

	directLink(url) {
		this.props.toggleModal('avatarMenu', false);
		window.location.href = url;
	}

	adminLink(obj = {}) {
		this.props.toggleModal('avatarMenu', false);
		this.props.updateAdmin(obj);
	}

	render() {

		const {
			access,
			hasAccessToEdit,
			step
		} = this.props;

		const isWallet = util.getValue(access, 'role') === 'user' ? true : false;
		const baseURL = isWallet ? WALLET_URL : CLOUD_URL;
		const myAccountText = isWallet ? 'Go to Your Wallet' : 'Got to Nonprofit Admin';

		const menuList = [];

		menuList.push(
			<li key='myAccount' onClick={() => this.directLink(`${baseURL}/settings`)}><span className='icon icon-user'></span> <span className='text'>My Account</span></li>
		)
		if (hasAccessToEdit && step !== 'create') {
			menuList.push(
				<li key='edit' onClick={() => this.adminLink({ publicView: false })}><span className='icon icon-edit'></span> <span className='text'>Edit Form</span></li>
			);

			menuList.push(
				<li key='share' onClick={() => this.adminLink({ publicView: false })}><span className='icon icon-share'></span> <span className='text'>Share Form</span></li>
			);
		}

		return (
			<div className='modalWrapper'>
				<div className='avatarMenu'>
					<div className='logoSection'>
						<h3 style={{ marginTop: 0, paddingTop: 0 }}>{access.orgName}</h3>
						{access.orgImage ?
							<GBLink onClick={() => this.directLink(`${baseURL}/settings`)}>
								<div className='orgImage'><img src={util.imageUrlWithStyle(access.orgImage, 'original')} alt='Org Logo' /></div>
							</GBLink>
						:
							''
						}
					</div>
					<div className='topSection'>
						<div className='leftSide'>
							{access.userImage ?
								<GBLink onClick={() => this.directLink(`${baseURL}/settings`)}>
									<div className='avatarImage'><img src={util.imageUrlWithStyle(access.userImage, 'medium')} alt='Avatar Medium Circle' /></div>
								</GBLink>
							:
								<div className='defaultAvatar'>
									<GBLink onClick={() => this.directLink(`${baseURL}/settings`)}>
										<span className='defaultAvatarImage'><span className='icon'>{access.initial}</span></span>
										<br />{access.masker ? 'Masquerader' : 'Add Avatar'}
									</GBLink>
								</div>
							}
						</div>
						<div className='rightSide'>
							<span className='line' style={{fontWeight: 300}}>{access.fullName}</span>
							<span className='line' style={{fontWeight: 300}}>{access.email}</span>
						</div>
					</div>
					<div className='listSection'>
						<ul>
							{menuList}
					</ul>
					</div>
					<div className='bottomSection'>
						<GBLink onClick={() => this.myAccountLink()}>{myAccountText}</GBLink>
					</div>
				</div>
			</div>
		)
	}
}

AvatarMenu.defaultProps = {
}

function mapStateToProps(state, props) {

	const access = util.getValue(state.resource, 'access');
	const hasAccessToEdit = util.getValue(state, 'gbx3.admin.hasAccessToEdit');
	const step = util.getValue(state, 'gbx3.admin.step');

	return {
		access,
		hasAccessToEdit,
		step
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	updateAdmin
})(AvatarMenu);
