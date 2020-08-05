import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalLink
} from '../../';
import { toggleModal } from '../../api/actions';

const CLOUD_URL = process.env.REACT_APP_CLOUD_URL;

class AvatarMenuButton extends React.Component {

	constructor(props) {
		super(props);
		this.myAccountLink = this.myAccountLink.bind(this);
		this.state = {
		};
	}

	myAccountLink() {
		this.props.toggleModal('avatarMenu', false);
		window.location.href = CLOUD_URL;
	}

	render() {

		const {
			access
		} = this.props;

		return (
			<div className='avatarLink'>
				<ModalLink id='avatarMenu' className='link'>
					<span className='orgName'>{util.getValue(access, 'orgName')}</span>
					{access.userImage ? <div className='avatarImage'><img src={util.imageUrlWithStyle(access.userImage, 'small')} alt='Avatar Small Circle' /></div> :
						<div className='defaultAvatarImage'>{access.initial}</div>
					}
				</ModalLink>
			</div>
		)
	}
}

AvatarMenuButton.defaultProps = {
}

function mapStateToProps(state, props) {
	const access = util.getValue(state.resource, 'access');

	return {
		access
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(AvatarMenuButton);
