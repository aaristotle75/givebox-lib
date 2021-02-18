import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import Dropdown from '../../form/Dropdown';
import {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin
} from '../redux/gbx3actions';

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
    } = this.props;

    return (
      <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
        <div className='gbx3OrgContentInnerContainer'>
          <div id='coverPhoto' className='coverPhotoContainer'>
            <div className='coverPhotoImageEditButton'>
              <span className='icon icon-camera'></span> Edit Cover Photo
            </div>
            <div className='coverPhotoImage'>
              <Image imgID='coverPhoto' url='https://scontent.fbts5-1.fna.fbcdn.net/v/t1.0-9/146458272_1594146030775580_1681237268117440186_n.jpg?_nc_cat=107&ccb=2&_nc_sid=e3f864&_nc_ohc=RiyM11oq7s4AX_Ogn0b&_nc_ht=scontent.fbts5-1.fna&oh=8523127a27556559d511cabd31f142ff&oe=604298EB' maxSize='950px' alt='Cover Photo' />
            </div>
            <div className='profilePictureContainer orgAdminEdit'>
              <GBLink className='tooltip blockEditButton' onClick={this.onClickEditProfilePicture}>
                <span className='tooltipTop'><i />Click Icon to EDIT Profile Picture</span>
                <span className='icon icon-camera'></span>
              </GBLink>
            </div>
            <div className='profilePictureContainer'>
              <Image url='https://scontent.fbts5-1.fna.fbcdn.net/v/t1.0-1/p200x200/60898531_1092468567609998_4827187149260455936_o.jpg?_nc_cat=111&ccb=2&_nc_sid=7206a8&_nc_ohc=3p90oFEZeOEAX84huL6&_nc_ht=scontent.fbts5-1.fna&tp=6&oh=bebd0f2bacec213fe8165a8799e1f4c7&oe=6040E930' maxSize='160px' alt='Profile Picture' imgStyle={{ borderRadius: '50%' }}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  updateData,
  updateInfo,
  setStyle,
  updateAdmin
})(Header);
