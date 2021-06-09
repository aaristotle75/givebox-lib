import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../common/Loader';
import * as util from '../../common/utility';
import ScrollTop from '../../common/ScrollTop';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import {
  loadOrgSignup,
  setOrgStyle,
  updateOrgSignup,
  setSignupStep
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import SignupMenu from './SignupMenu';
import SignupPage from './SignupPage';
import { signupSteps } from './signupConfig';
import HelpfulTip from '../../common/HelpfulTip';
import OrgModalRoutes from '../OrgModalRoutes';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.openStep = this.openStep.bind(this);
    this.resizer = this.resizer.bind(this);
    this.state = {
      isMobile: window.innerWidth <= 736 ? true : false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizer);
  }

  resizer(e) {
    if (window.innerWidth <= 736) {
      this.setState({ isMobile: true });
    } else if (this.state.isMobile) {
      this.setState({ isMobile: false})
    }
  }

  openStep(value) {
    this.props.setSignupStep(value, () => {
      this.props.toggleModal('orgSignupSteps', true);
    });
  }

  render() {

    const {
      open
    } = this.props;

    const {
      isMobile
    } = this.state;

    return (
      <div className='gbx3AdminLayout orgDisplay editable gbx3OrgSignup'>
        <OrgModalRoutes />
        <SignupMenu />
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
                  <div className='moneyRaisedContainer'>
                    <GBLink style={{ marginRight: 10 }} className='button' onClick={() => this.props.loadOrgSignup({ bookDemo: true })}>
                      <span className='buttonAlignText'>Book Demo <span className='icon icon-book-open'></span></span>
                    </GBLink>
                    <GBLink className='button' onClick={() => this.openStep('account')}>
                      <span className='buttonAlignText'>Save Account <span className='icon icon-save'></span></span>
                    </GBLink>
                    <div className='tooltip moneyRaised'>
                      <div className='tooltipTop'>
                        <HelpfulTip
                          headerIcon={<span className='icon icon-trending-up'></span>}
                          headerText={'How do I Raise Money?'}
                          text={
                            <div className='moneyRaisedTooltipContent'>
                              Complete the quick and easy create fundraiser steps, and then preview and share your fundraiser.
                              <span style={{ marginTop: 10, display: 'block' }}>
                                After you get your first transaction you can connect a bank account to transfer your money.
                              </span>
                              <div className='flexCenter button-group'>
                                <GBLink className='button' onClick={() => this.openStep('orgName')}>
                                  Create Fundraiser Steps
                                </GBLink>
                              </div>
                            </div>
                          }
                          style={{ marginTop: 0 }}
                        />
                      </div>
                      <span className='moneyRaisedLabel'>Money Raised</span>
                      <span className='moneyRaisedText moneyAmount'>
                        <span className='symbol'>$</span>0.00
                      </span>
                    </div>
                  </div>
                </div>
                <SignupPage
                  openStep={this.openStep}
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

  const open = util.getValue(state, 'gbx3.admin.open', true);

  return {
    open
  }
}

export default connect(mapStateToProps, {
  loadOrgSignup,
  setOrgStyle,
  updateOrgSignup,
  setSignupStep,
  toggleModal
})(Signup);
