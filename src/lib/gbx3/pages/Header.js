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
    this.coverPhotoOptions = this.coverPhotoOptions.bind(this);
    this.state = {

    };
  }

  componentDidMount() {
  }

  onClickEditProfilePicture() {
    console.log('execute onClickEditProfilePicture');
  }

  coverPhotoOptions() {
    const options = [];
    options.push({
      primaryText: <span className='labelIcon'><span className='icon icon-upload-cloud'></span> Upload Photo</span>, value: 'upload'
    });

    /*
    options.push({
      primaryText: <span className='labelIcon'><span className='icon icon-move'></span> Reposition</span>, value: 'move'
    });
    */

    options.push({
      primaryText: <span className='labelIcon'><span className='icon icon-trash-2'></span> Remove</span>, value: 'remove'
    });

    return options;
  }

  render() {

    const {
      coverPhoto,
      profilePicture,
      stage
    } = this.props;

    const isPublic = stage === 'public' ? true : false;
    const coverPhotoUrl = util.getValue(coverPhoto, 'url');
    const profilePictureUrl = util.checkImage(util.getValue(profilePicture, 'url'));

    return (
      <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
        <div className='gbx3OrgContentInnerContainer'>
          <div id='coverPhoto' className='coverPhotoContainer'>
            <div className='coverPhotoImageDropdown orgAdminDropdown'>
              { coverPhotoUrl ?
                <Dropdown
                  name='coverPhoto'
                  label={''}
                  selectLabel={<span className='labelIcon'><span className='icon icon-camera'></span> Edit Cover Photo</span>}
                  fixedLabel={false}
                  onChange={(name, value) => {
                    if (value === 'upload') {
                      this.props.toggleModal('orgEditCoverPhoto', true, {
                        saveGlobal: this.props.saveGlobal
                      });
                    }
                    if (value === 'remove') {
                      this.props.toggleModal('orgRemove', true, {
                        desc: 'Remove Cover Photo',
                        subDesc: 'Are you sure you want to remove your cover photo?',
                        callback: () => {
                          this.props.saveGlobal('coverPhoto', { url: '' }, () => this.props.toggleModal('orgRemove', false));
                        }
                      })
                    }
                  }}
                  options={this.coverPhotoOptions()}
                />
              :
                <ModalLink className='button addCoverPhoto' id='orgEditCoverPhoto' opts={{ saveGlobal: this.props.saveGlobal }}>
                  <span className='labelIcon'><span className='icon icon-camera'></span> Add Cover Photo</span>
                </ModalLink>
              }
            </div>
            <div className='coverPhotoImage'>
              { coverPhotoUrl ?
                <Image imgID='coverPhoto' size='large' url={coverPhotoUrl} maxSize='950px' alt='Cover Photo' />
              : null }
            </div>
            <ModalLink
              id='orgEditProfilePic'
              type='div'
              className='profilePictureContainer orgAdminEdit'
              opts={{
                saveGlobal: this.props.saveGlobal
              }}
            >
              <button className='tooltip blockEditButton'>
                <span className='tooltipTop'><i />Click Icon to { profilePictureUrl ? 'EDIT' : 'ADD' } Profile Picture</span>
                <span className='icon icon-camera'></span>
              </button>
            </ModalLink>
            <div className='profilePictureContainer'>
              { profilePictureUrl ?
                <Image url={profilePictureUrl} size='medium' maxSize='160px' alt='Profile Picture' imgStyle={{ minWidth: 160, borderRadius: '50%' }}/>
              :
                <div className='defaultProfilePicture'><span className={`icon icon-${isPublic ? 'shield' : 'camera'}`}></span></div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  const globals = util.getValue(state, 'gbx3.orgGlobals', {});

  return {
    coverPhoto: util.getValue(globals, 'coverPhoto', {}),
    profilePicture: util.getValue(globals, 'profilePicture', {}),
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
