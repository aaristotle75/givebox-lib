import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../common/Loader';
import * as util from '../../common/utility';
import ScrollTop from '../../common/ScrollTop';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import MediaLibrary from '../../form/MediaLibrary';
import ModalLink from '../../modal/ModalLink';
import CreateArticleCard from '../pages/CreateArticleCard';
import {
  setOrgStyle,
  updateOrgSignup,
  updateOrgSignupField
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import {
  getResource
} from '../../api/helpers';
import Footer from '../Footer';
import OrgModalRoutes from '../OrgModalRoutes';
import SignupMenu from './SignupMenu';
import * as config from './signupConfig';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.saveSignup = this.saveSignup.bind(this);
    this.openStep = this.openStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.state = {
    };
    this.totalSignupSteps = +(config.signupSteps.length - 1);
  }

  componentDidMount() {

    const {
      step,
      breakpoint,
      isMobile,
      org
    } = this.props;

    const themeColor = util.getValue(org, 'themeColor');
    if (!themeColor) {
      this.props.setOrgStyle({
        backgroundColor: '#000000'
      });
    }

    this.openStep(step);

    this.props.getResource('categories', { search: {
      sort: 'name',
      order: 'asc',
      filter: `kind:!"individual"%3Bname:!"Auto"`
    }});

    /*
    window.onbeforeunload = function(e) {
      const dialogText = 'Changes that you made may not be saved.';
      e.returnValue = dialogText;
      return dialogText;
    };
    */
  }

  openStep(step) {
    this.props.updateOrgSignup('step', step);
    this.props.toggleModal('orgSignupSteps', true, {
      nextStep: this.nextStep,
      previousStep: this.previousStep,
      saveSignup: this.saveSignup,
      categories: this.props.categories
    });
  }

  saveSignup(obj = {}) {
    console.log('execute -> ', obj);
  }

  previousStep() {
    const {
      step
    } = this.props;
    const prevStep = step > 0 ? step - 1 : step;
    this.props.updateOrgSignup('step', prevStep);
  }

  nextStep() {
    const {
      step
    } = this.props;

    const nextStep = step < +this.totalSignupSteps ? step + 1 : step;
    return nextStep;
  }

  render() {

    const {
      breakpoint,
      isMobile,
      org,
      open
    } = this.props;

    const orgName = util.getValue(org, 'orgName', 'Your Organization Name');
    const coverPhotoUrl = util.getValue(org, 'coverPhoto');
    const profilePictureUrl = util.getValue(org, 'orgLogo');

    const library = {
      saveMediaType: 'signup',
      borderRadius: 0
    };

    if (util.isLoading(this.props.categories)) {
      return <Loader msg='Loading Categories...' />
    }

    return (
      <div className='gbx3AdminLayout orgDisplay editable gbx3OrgSignup'>
        <SignupMenu
          openStep={this.openStep}
        />
        <OrgModalRoutes />
        <div id='GBX3StageAligner' className='stageAligner'>
          <div id='stageContainer' className={`stageContainer ${open ? 'open' : ''}`}>
            <div className='gbx3PageWrapper org admin'>
              <div id='gbx3Layout' className='gbx3Layout org admin'>
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
                        <ModalLink
                          id='orgSignupSteps'
                          type='div'
                          className='profilePictureContainer orgAdminEdit'
                          opts={{
                            stepName: 'orgLogo',
                            saveCallback: (name, url) => {
                              console.log('execute saveCallback -> ', url);
                              this.saveSignup({ url });
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
                              this.saveSignup({ orgName });
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
                {breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
              </div>
            </div>
          </div>
        </div>
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
  const open = util.getValue(state, 'gbx3.admin.open', true);
  const step = util.getValue(state, 'gbx3.orgSignup.step', 0);
  const completed = util.getValue(state, 'gbx3.orgSignup.completed', []);
  const categories = util.getValue(state, 'resource.categories', {});


  return {
    breakpoint,
    isMobile,
    org,
    gbx3,
    open,
    step,
    completed,
    categories
  }
}

export default connect(mapStateToProps, {
  setOrgStyle,
  updateOrgSignup,
  updateOrgSignupField,
  toggleModal,
  getResource
})(Signup);
