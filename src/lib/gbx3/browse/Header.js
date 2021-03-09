import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import Dropdown from '../../form/Dropdown';
import ModalLink from '../../modal/ModalLink';
import {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.onClickEditProfilePicture = this.onClickEditProfilePicture.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onClickEditProfilePicture() {
    console.log('execute onClickEditProfilePicture');
  }

  render() {

    const {
      coverPhoto,
      profilePicture,
      stage
    } = this.props;

    const isPublic = stage === 'public' ? true : false;
    const coverPhotoUrl = 'https://s3-us-west-1.amazonaws.com/givebox-marketing/images/2020/03/27060433/13-Jimmy-Miller-option-1.jpg';
    const profilePictureUrl = 'https://givebox-marketing.s3.us-west-1.amazonaws.com/images/2020/01/19210256/givebox_logo2020_white-text.svg';

    return (
      <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
        <div className='gbx3OrgContentInnerContainer'>
          <div id='coverPhoto' className='coverPhotoContainer'>
            <div className='coverPhotoInfoContainer'>
              Hello World
            </div>
            <div className='coverPhotoImage'>
              { coverPhotoUrl ?
                <Image imgID='coverPhoto' size='large' url={coverPhotoUrl} maxSize='950px' alt='Cover Photo' />
              : null }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  return {
    stage: util.getValue(state, 'gbx3.info.stage'),
  }
}

export default connect(mapStateToProps, {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  toggleModal
})(Header);
