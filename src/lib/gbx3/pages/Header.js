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
    } = this.props;

    return (
      <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
        <div className='gbx3OrgContentInnerContainer'>
          <div id='coverPhoto' className='coverPhotoContainer'>
            <div className='coverPhotoImageDropdown orgAdminDropdown'>
              <Dropdown
                name='coverPhoto'
                label={''}
                selectLabel={<span className='labelIcon'><span className='icon icon-camera'></span> Edit Cover Photo</span>}
                fixedLabel={false}
                onChange={(name, value) => {
                  if (value === 'upload') {
                    this.props.toggleModal('orgEditCoverPhoto', true);
                  }
                  if (value === 'remove') {
                    this.props.toggleModal('orgRemove', true, { desc: 'Remove Cover Photo', subDesc: 'Are you sure you want to remove your cover photo?'})
                  }
                }}
                options={[
                  { primaryText: <span className='labelIcon'><span className='icon icon-upload-cloud'></span> Upload Photo</span>, value: 'upload' },
                  { primaryText: <span className='labelIcon'><span className='icon icon-move'></span> Reposition</span>, value: 'move' },
                  { primaryText: <span className='labelIcon'><span className='icon icon-trash-2'></span> Remove</span>, value: 'remove' },
                ]}
              />
            </div>
            <div className='coverPhotoImage'>
              <Image imgID='coverPhoto' url='https://scontent.fbts5-1.fna.fbcdn.net/v/t1.0-9/146458272_1594146030775580_1681237268117440186_n.jpg?_nc_cat=107&ccb=2&_nc_sid=e3f864&_nc_ohc=RiyM11oq7s4AX_Ogn0b&_nc_ht=scontent.fbts5-1.fna&oh=8523127a27556559d511cabd31f142ff&oe=604298EB' maxSize='950px' alt='Cover Photo' />
            </div>
            <ModalLink id='orgEditProfilePic' type='div' className='profilePictureContainer orgAdminEdit'>
              <button className='tooltip blockEditButton'>
                <span className='tooltipTop'><i />Click Icon to EDIT Profile Picture</span>
                <span className='icon icon-camera'></span>
              </button>
            </ModalLink>
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
  updateAdmin,
  toggleModal
})(Header);
