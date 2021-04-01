import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import CreateArticleCard from '../pages/CreateArticleCard';
import ModalLink from '../../modal/ModalLink';
import Footer from '../Footer';

class SignupPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      org
    } = this.props;

    const orgName = util.getValue(org, 'orgName', 'Your Organization Name');
    const coverPhotoUrl = util.getValue(org, 'coverPhoto');
    const profilePictureUrl = util.getValue(org, 'orgLogo');

    const library = {
      saveMediaType: 'signup',
      borderRadius: 0
    };

    return (
      <div className='gbx3OrgContentContainer'>
        {/* Header */}
        <div className='gbx3OrgContentHeader gbx3OrgContentOuterContainer'>
          <div className='gbx3OrgContentInnerContainer'>
            <div id='coverPhoto' className='coverPhotoContainer'>
              <div className='coverPhotoImageDropdown orgAdminDropdown'>
                {/* Edit Cover Photo Stuff */}
              </div>
              <div className='coverPhotoImage'>
                { coverPhotoUrl ?
                  <Image imgID='coverPhoto' size='large' url={coverPhotoUrl} maxSize='950px' alt='Cover Photo' />
                : null }
              </div>
              <ModalLink
                id='orgSignupSteps'
                type='div'
                className='profilePictureContainer orgAdminEdit'
                opts={{
                  stepName: 'orgLogo',
                  saveCallback: (name, url) => {
                    console.log('execute saveCallback -> ', url);
                  },
                  saveMediaType: 'signup'
                }}
              >
                <button className='tooltip blockEditButton'>
                  <span className='tooltipTop'><i />Click to { profilePictureUrl ? 'EDIT' : 'ADD' } Profile Picture</span>
                  <span className='icon icon-camera'></span>
                </button>
              </ModalLink>
              <div className='profilePictureContainer'>
                { profilePictureUrl ?
                  <Image url={profilePictureUrl} size='medium' maxSize='160px' alt='Profile Picture' imgStyle={{ minWidth: 160, borderRadius: '50%' }}/>
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
              <ModalLink
                id='orgSignupSteps'
                type='div'
                className='nameSectionContainer orgAdminEdit'
                opts={{
                  stepName: 'orgName',
                  saveCallback: (name, orgName) => {
                    console.log('execute saveCallback -> ', orgName);
                  }
                }}
              >
                <button className='tooltip blockEditButton' id='orgEditTitle'>
                  <span className='tooltipTop'><i />Click to EDIT Name</span>
                  <span className='icon icon-edit'></span>
                </button>
              </ModalLink>
              <div className='nameSectionContainer'>
                <div className='nameText flexCenter'>
                  {orgName}
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
                  {/*
                  <div className='flexCenter flexColumn'>
                    <h2>Welcome to your Givebox Profile.</h2>
                    <span>Complete your profile, start a fundraiser, and share it.</span>
                    <span>You could receive your first donation today if you follow our simple steps!</span>
                  </div>
                  */}
                </div>
                <div className='pageListWrapper'>
                  <CreateArticleCard
                    signup={true}
                    noOrgIDCallback={() => {
                      console.log('execute -> no org id callback');
                    }}
                  />
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

  const org = util.getValue(state, 'gbx3.orgSignup.org', {});

  return {
    org
  }
}

export default connect(mapStateToProps, {
})(SignupPage);
