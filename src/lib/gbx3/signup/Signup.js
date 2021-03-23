import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import ScrollTop from '../../common/ScrollTop';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import Dropdown from '../../form/Dropdown';
import ModalLink from '../../modal/ModalLink';
import {
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
  }

  render() {

    const {
      breakpoint,
      isMobile,
      title
    } = this.props;

    const coverPhotoUrl = null;
    const profilePictureUrl = null;

    return (
      <div className='gbx3Org'>
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
                  <div className='nameText'>
                    <div dangerouslySetInnerHTML={{ __html: util.cleanHtml(title) }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className='gbx3OrgContent gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              {/* Pages */}
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

  return {
    breakpoint,
    isMobile,
    title: 'Enter Title'
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Signup);
