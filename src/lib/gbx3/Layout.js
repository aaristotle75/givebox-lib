import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import GBLink from '../common/GBLink';
import Icon from '../common/Icon';
import ModalRoute from '../modal/ModalRoute';
import ModalLink from '../modal/ModalLink';
import Shop from './Shop';
import Article from './Article';
import Org from './Org';
import Browse from './browse/Browse';
import Confirmation from './payment/Confirmation';
import {
  updateAdmin,
  updateInfo
} from './redux/gbx3actions';
import AvatarMenuButton from './admin/AvatarMenuButton';
import CartButton from './payment/CartButton';
import { AiOutlineNotification, AiOutlineTrophy } from 'react-icons/ai';
import ReactGA from 'react-ga';
import Scroll from 'react-scroll';
import history from '../common/history';

const GBX_URL = process.env.REACT_APP_GBX_URL;
const SHARE_URL = process.env.REACT_APP_GBX_SHARE;
const ENV = process.env.REACT_APP_ENV;

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.closeGBXModal = this.closeGBXModal.bind(this);
    this.backToOrg = this.backToOrg.bind(this);
    this.gaInitialize = this.gaInitialize.bind(this);
    this.gaPageTracking = this.gaPageTracking.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.state = {
    }
    this.gbx3Container = React.createRef();
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (util.isEmpty(prevProps.orgData) && !util.isEmpty(this.props.orgData)) {
      this.gaInitialize();
      this.gaPageTracking();
    }
  }

  scrollTo(name, containerId = 'gbx3Layout') {
    const scroller = Scroll.scroller;
    scroller.scrollTo(name, {
      containerId,
      duration: 500,
      delay: 0,
      smooth: true
    });
  }

  gaInitialize() {
    const {
      orgData
    } = this.props;

    const gaPropertyID = util.getValue(orgData, 'gaPropertyID', null);
    ReactGA.initialize('UA-75269457-5', {
      debug: true
    });

    if (gaPropertyID) {
      ReactGA.initialize([
        {
          trackingId: gaPropertyID,
          gaOptions: {
            name: 'orgTracker'
          }
        },
      ]);
    }
  }

  gaPageTracking(page) {
    const {
      preview
    } = this.props;

    const pageView = page || window.location.pathname + window.location.search;
    if (!preview && ENV === 'production') {
      ReactGA.pageview(pageView, ['orgTracker']);
    }
  }

  backToOrg(page, allowBackToBrowse = false) {
    const {
      orgID,
      orgSlug,
      originTemplate,
      cart
    } = this.props;

    if (originTemplate === 'browse' && allowBackToBrowse) {
      this.props.loadBrowse(false);
        history.push(`${GBX_URL}/discover`);
    } else {
      if (this.props.backToOrgCallback) this.props.backToOrgCallback('org', page);
      else {
        history.push(`${GBX_URL}/${orgSlug}`);
        this.props.loadOrg(orgID, page);
      }
    }
  }

  closeGBXModal() {
    window.postMessage('closeGivebox', '*');
    window.parent.postMessage('closeGivebox', '*');
  }

  renderDisplay() {
    const {
      display,
      browse
    } = this.props;

    const items = [];

    if (browse) {
      items.push(
        <Browse
          key={'browse'}
          reloadGBX3={this.props.reloadGBX3}
          loadGBX3={this.props.loadGBX3}
          loadOrg={this.props.loadOrg}
        />
      );
    } else {
      switch (display) {
        case 'shop': {
          items.push(
            <Shop
              key={'shop'}
              reloadGBX3={this.props.reloadGBX3}
            />
          )
          break;
        }

        case 'org': {
          items.push(
            <Org
              key={'org'}
              reloadGBX3={this.props.reloadGBX3}
              loadGBX3={this.props.loadGBX3}
              primaryColor={this.props.primaryColor}
              onClickVolunteerFundraiser={this.props.onClickVolunteerFundraiser}
              scrollTo={this.scrollTo}
              exitAdmin={this.props.exitAdmin}
            />
          )
          break;
        }

        case 'article':
        default: {
          items.push(
            <Article
              key={'article'}
              reloadGBX3={this.props.reloadGBX3}
              loadGBX3={this.props.loadGBX3}
              primaryColor={this.props.primaryColor}
              onClickVolunteerFundraiser={this.props.onClickVolunteerFundraiser}
              backToOrg={this.backToOrg}
              scrollTo={this.scrollTo}
            />
          )
          break;
        }
      }
    }

    return items;
  }

  render() {

    const {
      orgSlug,
      access,
      preview,
      stage,
      hasAccessToEdit,
      publishStatus,
      display,
      orgName,
      primaryColor,
      modal,
      kind,
      status,
      originTemplate,
      browse
    } = this.props;

    const style = { maxWidth: display === 'org' ? '1000px' : '850px' };

    let gbx3BackgroundHeight = 'auto';
    const el = document.getElementById('GBX3StageAligner');
    if (el) {
      const height = el.clientHeight + 100;
      gbx3BackgroundHeight = `${height}px`;
    }

    const avatarMenu =
      <div className='hasAccessToEditPublic'>
        <AvatarMenuButton />
        { !browse ?
        <ModalLink type='div' id={'share'} className='avatarLink tooltip hideOnMobile'>
          <span className='tooltipTop'><i />Share</span>
          <div className='editGraphic'>
            <span className='icon icon-share'></span>
          </div>
        </ModalLink> : null}
        { hasAccessToEdit && stage !== 'admin' && !browse ?
        <div onClick={() => this.props.updateAdmin({ publicView: false })} className='avatarLink tooltip hideOnMobile'>
          <span className='tooltipTop'><i />{ display === 'org' ? 'Edit Page' : 'Edit Form' }</span>
          <div className='editGraphic'>
            <span className='icon icon-edit'></span>
          </div>
        </div> : null}
        { hasAccessToEdit && stage === 'admin' && display === 'org' && !browse ?
        <div
          className='avatarLink tooltip hideOnMobile'
          onClick={() => {
            this.props.updateAdmin({ publicView: true });
            this.props.updateInfo({ stage: 'public' });
          }}
        >
          <span className='tooltipTop'><i />Public View</span>
          <div className='editGraphic'>
            <span className='icon icon-eye'></span>
          </div>
        </div> : null}
        <CartButton reloadGBX3={this.props.reloadGBX3} type='avatarLink' />
      </div>
    ;

    const showAvatarMenu = (stage !== 'admin' || (stage === 'admin' && display === 'org')) && !preview ? true : false;

    // This is article display specific
    const noAccess = (!hasAccessToEdit || (hasAccessToEdit && !preview && stage === 'public' )) && (publishStatus === 'private') && (display === 'article') ? true : false;

    // This is article sweepstakes specific
    const done = kind === 'sweepstake' && status === 'done' && display !== 'org' ? true : false;

    const publicOnly = (stage !== 'admin') && !preview ? true : false;

    return (
      <div className={`gbx3PageWrapper ${display} ${stage}`}>
        { done ?
          <div className='noAccessToGBX'>
            <Icon><AiOutlineTrophy /></Icon>
            <span className='center'>The Sweepstakes has Ended and the Winner Chosen</span>
            {!hasAccessToEdit ?
              <GBLink onClick={() => window.location.href = `${SHARE_URL}/${orgSlug}`}>
                Click Here to Visit<br /><span style={{ fontWeight: 400 }}>{orgName}</span><br />
              </GBLink>
            :
              ''
            }
          </div>
        : ''}

        { noAccess ?
          <div className='noAccessToGBX'>
            <span className='icon icon-lock'></span>
            <span className='center'>The Page is Set to Private</span>
            {hasAccessToEdit ?
              <GBLink onClick={() => this.props.updateAdmin({ publicView: false })}>
                <span className='icon icon-chevron-left'></span> Go Back to Form Builder
              </GBLink>
            :
              <GBLink onClick={() => window.location.href = `${SHARE_URL}/${orgSlug}`}>
                Click here to visit<br /><span style={{ fontWeight: 400 }}>{orgName}</span><br />
              </GBLink>
            }
          </div>
        : ''}

        { publicOnly && display !== 'org' ?
          <div onClick={() => this.backToOrg(null, true)} className='backToOrgPage avatarLink'>
            <div className='editGraphic'>
              <span className='icon icon-chevron-left'></span>
            </div>
          </div>
        :'' }

        <div style={{ height: gbx3BackgroundHeight }} className='gbx3LayoutBackground'></div>
        {showAvatarMenu ? avatarMenu : '' }
        <div id='gbx3Layout' className={`gbx3Layout ${display} ${stage} ${noAccess ? 'noAccess' : ''}`}>
          <div
            style={{
              ...style
            }}
            className={`gbx3Container`}
            ref={this.gbx3Container}
          >
            {modal ? <GBLink customColor={primaryColor} allowCustom={true} className='closeGBXModalButton' onClick={() => this.closeGBXModal()}><span className='icon icon-x'></span></GBLink> : <></>}
            {this.renderDisplay()}
            <ModalRoute
              id='shop'
              className='gbx3 givebox-paymentform'
              effect='3DFlipVert'
              style={{ width: '70%' }}
              disallowBgClose={false}
              component={(props) => <Shop {...props} hideGoBack={true} reloadGBX3={this.props.reloadGBX3} />}
            />
            <ModalRoute
              id='paymentConfirmation'
              effect='scaleUp'
              style={{ width: '60%' }}
              className='gbx3'
              component={() =>
                <Confirmation primaryColor={this.props.primaryColor} />
              }
            />
          </div>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  const access = util.getValue(state, 'resource.access');
  const orgSlug = util.getValue(state, 'resource.article.data.orgSlug');
  const orgID = util.getValue(state, 'resource.article.data.orgID');
  const gbx3 = util.getValue(state, 'gbx3', {});
  const browse = util.getValue(gbx3, 'browse');
  const info = util.getValue(gbx3, 'info', {});
  const originTemplate = util.getValue(info, 'originTemplate');
  const kind = util.getValue(info, 'kind');
  const status = util.getValue(gbx3, 'data.status');
  const modal = util.getValue(info, 'modal');
  const stage = util.getValue(info, 'stage');
  const preview = util.getValue(info, 'preview');
  const display = util.getValue(info, 'display');
  const hasAccessToEdit = util.getValue(gbx3, 'admin.hasAccessToEdit');
  const publishStatus = util.getValue(info, 'publishStatus');
  const orgName = util.getValue(info, 'orgName');
  const orgData = util.getValue(gbx3, 'orgData', {});

  return {
    browse,
    orgData,
    orgSlug,
    orgID,
    originTemplate,
    kind,
    status,
    modal,
    access,
    display,
    stage,
    preview,
    hasAccessToEdit,
    publishStatus,
    orgName,
    globals: util.getValue(gbx3, 'globals', {}),
    cart: util.getValue(gbx3, 'cart', {})
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateAdmin
})(Layout);
