import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink
} from '../../';
import { toggleModal } from '../../api/actions';

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;

class AvatarMenu extends React.Component {

	constructor(props) {
		super(props);
		this.myAccountLink = this.myAccountLink.bind(this);
		this.state = {
		};
	}

	myAccountLink(link) {
		this.props.toggleModal('avatarMenu', false);
		console.log('execute myAccountLink', link);
		//this.props.history.push(link);
	}

	render() {

		const {
			access
		} = this.props;

		return (
			<div className='modalWrapper'>
				<div className='avatarMenu'>
					<div className='logoSection'>
						<h3 style={{ marginTop: 0, paddingTop: 0 }}>{access.orgName}</h3>
						{access.orgImage ?
							<GBLink onClick={() => this.myAccountLink()}>
								<div className='orgImage'><img src={util.imageUrlWithStyle(access.orgImage, 'original')} alt='Org Logo' /></div>
							</GBLink>
						:
							<div className='defaultOrg'>
								<GBLink onClick={() => this.myAccountLink()}>
									<span className='defaultOrgImage'><span className='icon icon-instagram'></span></span>
									<br />Add Logo
								</GBLink>
							</div>
						}
					</div>
					<div className='topSection'>
						<div className='leftSide'>
							{access.userImage ?
								<GBLink onClick={() => this.myAccountLink()}>
									<div className='avatarImage'><img src={util.imageUrlWithStyle(access.userImage, 'medium')} alt='Avatar Medium Circle' /></div>
								</GBLink>
							:
								<div className='defaultAvatar'>
									<GBLink onClick={() => this.myAccountLink()}>
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
							<li onClick={() => this.myAccountLink()}><span className='icon icon-user'></span> <span className='text'>My Account</span></li>
						</ul>
					</div>
					<div className='bottomSection'>
						<GBLink onClick={() => console.log('End Builder')}>Exit Builder</GBLink>
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

	return {
		access
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(AvatarMenu);
