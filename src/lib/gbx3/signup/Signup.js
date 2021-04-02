import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../common/Loader';
import * as util from '../../common/utility';
import ScrollTop from '../../common/ScrollTop';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import {
  setOrgStyle,
  updateOrgSignup
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import {
  getResource
} from '../../api/helpers';
import OrgModalRoutes from '../OrgModalRoutes';
import SignupMenu from './SignupMenu';
import SignupPage from './SignupPage';
import * as config from './signupConfig';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.saveSignup = this.saveSignup.bind(this);
    this.openStep = this.openStep.bind(this);
    this.openSignupSteps = this.openSignupSteps.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.state = {
    };
    this.totalSignupSteps = +(config.signupSteps.length - 1);
  }

  componentDidMount() {

    const {
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

    this.props.getResource('categories', {
      search: {
        sort: 'name',
        order: 'asc',
        filter: `kind:!"individual"%3Bname:!"Auto"`
      },
      callback: (res, err) => {
        this.openSignupSteps();
      }
    });

    /*
    window.onbeforeunload = function(e) {
      const dialogText = 'Changes that you made may not be saved.';
      e.returnValue = dialogText;
      return dialogText;
    };
    */
  }

  openStep(step) {
    this.props.updateOrgSignup({ step });
    this.openSignupSteps();
  }

  openSignupSteps() {
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

  previousStep(step) {
    const prevStep = step > 0 ? step - 1 : step;
    this.props.updateOrgSignup({ step: prevStep });
  }

  nextStep(step) {
    const nextStep = step < +this.totalSignupSteps ? step + 1 : step;
    return nextStep;
  }

  render() {

    const {
      breakpoint,
      isMobile,
      open
    } = this.props;

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
                    { isMobile ?
                      <Image size='thumb' maxSize={35} url={'https://cdn.givebox.com/givebox/public/gb-logo5.png'} alt='Givebox' />
                    :
                      <Image maxHeight={35} url={'https://cdn.givebox.com/givebox/public/givebox_logo2020-grey-text.png'} alt='Givebox' />
                    }
                  </div>
                </div>
                <SignupPage

                />
                {isMobile ? <div className='bottomOffset'>&nbsp;</div> : <></>}
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
  const open = util.getValue(state, 'gbx3.admin.open', true);
  const categories = util.getValue(state, 'resource.categories', {});

  return {
    breakpoint,
    isMobile,
    open,
    categories
  }
}

export default connect(mapStateToProps, {
  setOrgStyle,
  updateOrgSignup,
  toggleModal,
  getResource
})(Signup);
