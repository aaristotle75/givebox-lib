import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import Video from '../../common/Video';
import Dropdown from '../../form/Dropdown';
import ModalLink from '../../modal/ModalLink';
import {
  updateOrgSignupField
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import Footer from '../Footer';
import Lottie from 'lottie-react';
import * as coverPlaceholder from '../pages/coverPlaceholder.json';

class SignupPage extends React.Component {

  constructor(props) {
    super(props);
    this.coverPhotoOptions = this.coverPhotoOptions.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  coverPhotoOptions() {
    const options = [];
    options.push({
      primaryText: <span className='labelIcon'><span className='icon icon-upload-cloud'></span> Upload Photo</span>, value: 'upload'
    });

    options.push({
      primaryText: <span className='labelIcon'><span className='icon icon-trash-2'></span> Remove</span>, value: 'remove'
    });

    return options;
  }

  render() {

    const {
      org,
      gbx3,
      completed,
    } = this.props;

    const orgName = util.getValue(org, 'name', 'Your Organization Name');
    const profilePictureUrl = util.getValue(org, 'imageURL');
    const coverPhotoURL = util.getValue(org, 'coverPhotoURL');

    const library = {
      saveMediaType: 'signup',
      borderRadius: 0
    };

    const title = util.getValue(gbx3, 'title');
    let titleText = title || 'Create Your First Fundraiser';

    const tag = title ? 'Donate' : `How do I raise money?`;
    const imageURL = util.getValue(gbx3, 'imageURL', 'https://cdn.givebox.com/givebox/public/images/backgrounds/raise-fundraiser-lg.png');
    const videoURL = util.getValue(gbx3, 'videoURL');
    const mediaType = util.getValue(gbx3, 'mediaType', 'image');
    const buttonText = title && imageURL ? 'Edit' : completed.includes('title') ? 'Add an Image/Video' : 'Add a Fundraiser Title';
    const ctaButtonText = title ? 'Donate Now' : 'Click to Edit Fundraiser';

    const media = videoURL && mediaType === 'video' ?
      <Video
        playing={false}
        url={videoURL}
        style={{
          maxWidth: '100%',
          maxHeight: 'auto'
        }}
        maxHeight={'auto'}
        light={true}
      />
    :
      <Image imgID='cardPhoto' url={imageURL} maxWidth='325px' alt='Card Photo' />
    ;

    return (
      <div className='gbx3OrgContentContainer'>
        {/* Header */}
        <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
          <div className='gbx3OrgContentInnerContainer'>
            <div id='coverPhoto' className='coverPhotoContainer'>
              <div className='coverPhotoImageDropdown orgAdminDropdown'>
                { coverPhotoURL ?
                  <Dropdown
                    name='coverPhoto'
                    label={''}
                    selectLabel={<span className='labelIcon'><span className='icon icon-camera'></span> Edit Cover Photo</span>}
                    fixedLabel={false}
                    onChange={(name, value) => {
                      if (value === 'upload') {
                        this.props.toggleModal('orgEditCoverPhoto', true, {
                          uploadOnly: true,
                          saveGlobal: (name, obj) => {
                            const url = util.getValue(obj, 'url');
                            if (url) this.props.updateOrgSignupField('org', { coverPhotoURL: url });
                          }
                        });
                      }
                      if (value === 'remove') {
                        this.props.toggleModal('orgRemove', true, {
                          desc: 'Remove Cover Photo',
                          subDesc: 'Are you sure you want to remove your cover photo?',
                          callback: async () => {
                            const updated = await this.props.updateOrgSignupField('org', { coverPhotoURL: '' });
                            if (updated) this.props.toggleModal('orgRemove', false);
                          }
                        })
                      }
                    }}
                    options={this.coverPhotoOptions()}
                  />
                :
                  <ModalLink
                    className='button addCoverPhoto'
                    id='orgEditCoverPhoto'
                    opts={{
                      uploadOnly: true,
                      saveGlobal: (name, obj) => {
                        const url = util.getValue(obj, 'url');
                        if (url) this.props.updateOrgSignupField('org', { coverPhotoURL: url });
                      }
                    }}
                  >
                    <span className='labelIcon'><span className='icon icon-camera'></span> Add Cover Photo</span>
                  </ModalLink>
                }
              </div>
              <div className='coverPhotoImage'>
                { coverPhotoURL ?
                  <Image imgID='coverPhoto' url={coverPhotoURL} maxSize='950px' alt='Cover Photo' />
                :
                  <Lottie
                    animationData={coverPlaceholder.default}
                  />
                }
              </div>
              <div
                className='profilePictureContainer orgAdminEdit'
                onClick={() => {
                  this.props.openStep('mission');
                }}
              >
                <button className='tooltip blockEditButton'>
                  <span className='tooltipTop'><i />Click to { profilePictureUrl ? 'EDIT' : 'ADD' } Logo</span>
                  <span className='icon icon-camera'></span>
                </button>
              </div>
              <div className='profilePictureContainer'>
                { profilePictureUrl ?
                  <Image url={profilePictureUrl} maxSize='160px' alt='Profile Picture' imgStyle={{ minWidth: 160, minHeight: 160, borderRadius: '50%' }}/>
                :
                  <div className='defaultProfilePicture'><span className={`icon icon-camera`}></span></div>
                }
              </div>
            </div>
          </div>
        </div>
        {/* END Header */}
        <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
          <div className='gbx3OrgContentInnerContainer'>
            <div className='nameSection'>
              <div
                className='nameSectionContainer orgAdminEdit'
                onClick={() => {
                  this.props.openStep('orgName');
                }}
              >
                <button className='tooltip blockEditButton' id='orgEditTitle'>
                  <span className='tooltipTop'><i />Click to EDIT Organization Name</span>
                  <span className='icon icon-edit'></span>
                </button>
              </div>
              <div className='nameSectionContainer'>
                <div className='nameText'>
                  <p style={{
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontWeight: 400,
                      fontSize: '22px'
                    }}>
                      {orgName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <main className='gbx3OrgContent gbx3OrgContentOuterContainer'>
          <div className='gbx3OrgContentInnerContainer'>
            <div className='gbx3OrgPages'>
              <div className='pageContentWrapper'>
                <div className={`pageContentSection top`}>
                  {/* Top Page Content */}
                </div>
                <div className='pageListWrapper'>
                  <div className={`listItem createArticleCard`}>
                    <div className='articleCard'>
                      <div
                        onClick={() => {
                          this.props.openStep('title');
                        }}
                        className='articleCardEdit orgAdminEdit'
                      >
                        <button className='tooltip blockEditButton'>
                          <span className='tooltipTop'><i />Click to {buttonText}</span>
                          <span className='icon icon-plus'></span>
                        </button>
                      </div>
                      <div className='articleCardContainer'>
                        <div className='cardPhotoContainer'>
                          <div className='cardPhotoImage'>
                            {media}
                          </div>
                        </div>
                        <div className='cardInfoContainer'>
                          <div className='cardArticleTag'>
                            {tag}
                          </div>
                          <div className='cardInfo'>
                          </div>
                        </div>
                        <div className='cardTitleContainer'>
                          <h2>{titleText}</h2>
                        </div>
                        <div className='cardKindSpecificContainer'>
                          <div className={`cardKindSpecific cardKindEventWhere`}>
                            {/* extra context */}
                          </div>
                        </div>
                        <div className='cardButtonContainer'>
                          <div className='cardButton'>
                            {ctaButtonText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className='gbx3OrgFooter gbx3OrgContentOuterContainer'>
          <div className='gbx3OrgContentInnerContainer'>
            <Footer
              showP2P={false}
            />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
  const org = util.getValue(orgSignup, 'fields.org', {});
  const gbx3 = util.getValue(orgSignup, 'fields.gbx3', {});
  const completed = util.getValue(orgSignup, 'completed', []);

  return {
    org,
    gbx3,
    completed
  }
}

export default connect(mapStateToProps, {
  updateOrgSignupField,
  toggleModal
})(SignupPage);
