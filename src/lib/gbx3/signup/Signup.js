import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import ScrollTop from '../../common/ScrollTop';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import Dropdown from '../../form/Dropdown';
import ModalLink from '../../modal/ModalLink';
import {
  setOrgStyle,
  updateSignup
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import Footer from '../Footer';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

    const {
      breakpoint,
      isMobile,
      org
    } = this.props;

    const themeColor = util.getValue(org, 'themeColor');
    if (themeColor) {
      this.props.setOrgStyle({
        backgroundColor: '#000000'
      });
    }
  }

  render() {

    const {
      breakpoint,
      isMobile,
      org
    } = this.props;

    const orgName = util.getValue(org, 'orgName', 'Your Organization Name');
    const coverPhotoUrl = util.getValue(org, 'coverPhoto');
    const profilePictureUrl = util.getValue(org, 'orgLogo');

    return (
      <div className='gbx3Org gbx3Signup'>
        <ScrollTop elementID={'gbx3Layout'} />
        <div className='gbx3OrgHeader'>
          <div className={'gbx3OrgLogoContainer'} onClick={() => console.log('logo clicked!')}>
            <Image size='thumb' maxSize={35} url={'https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png'} alt='Givebox' />
          </div>
        </div>
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
                {/* Edit Profile Pic Stuff */}
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
                    <div className='listContainer'>
                      <div className='articleCard'>
                        <div className='articleCardContainer'>
                          <div className='cardPhotoContainer'>
                            <div className='cardPhotoImage'>
                              <Image imgID='cardPhoto' url={'https://cdn.givebox.com/givebox/public/images/backgrounds/raise-fundraiser-lg.png'} maxWidth='325px' size='medium' alt='Card Photo' />
                            </div>
                          </div>
                          <div className='cardInfoContainer'>
                            <div className='cardArticleTag'>
                              How do I raise money?
                            </div>
                            <div className='cardInfo'>
                            </div>
                          </div>
                          <div className='cardTitleContainer'>
                            <h2>Create Your First Fundraiser <span className='icon icon-chevron-right'></span></h2>
                          </div>
                          <div className='cardKindSpecificContainer'>
                            <div className={`cardKindSpecific cardKindEventWhere`}>
                              Get your first donation today!
                            </div>
                          </div>
                          <div className='cardButtonContainer'>
                            <div className='cardButton'>
                              Click Here to Create Fundraiser
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
        {breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const breakpoint = util.getValue(state, 'gbx3.info.breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const orgSignup = util.getValue(state, 'gbx3.orgSignup', {});
  const org = util.getValue(orgSignup, 'org', {});
  const gbx3 = util.getValue(orgSignup, 'gbx3', {});

  return {
    breakpoint,
    isMobile,
    org,
    gbx3
  }
}

export default connect(mapStateToProps, {
  setOrgStyle,
  updateSignup,
  toggleModal
})(Signup);
