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
import OrgModalRoutes from '../OrgModalRoutes';
import SignupMenu from './SignupMenu';
import SignupPage from './SignupPage';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.openStep = this.openStep.bind(this);
    this.openSignupSteps = this.openSignupSteps.bind(this);
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
    if (!themeColor) {
      this.props.setOrgStyle({
        backgroundColor: '#000000'
      });
    }

    this.openSignupSteps();

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
    this.props.toggleModal('orgSignupSteps', true);
  }

  render() {

    const {
      breakpoint,
      isMobile,
      open
    } = this.props;

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

  return {
    breakpoint,
    isMobile,
    open
  }
}

export default connect(mapStateToProps, {
  setOrgStyle,
  updateOrgSignup,
  toggleModal
})(Signup);
