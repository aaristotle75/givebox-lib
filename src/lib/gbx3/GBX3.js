import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import Admin from './admin/Admin';
import * as util from '../common/utility';
import Loader from '../common/Loader';
import ModalRoute from '../modal/ModalRoute';
import { getResource, sendResource } from '../api/helpers';
import { setAccess } from '../api/actions';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import '../styles/gbx3org.scss';
import '../styles/gbx3orgadmin.scss';
import '../styles/gbx3modal.scss';
import reactReferer from 'react-referer';
import { loadReCaptcha } from 'react-recaptcha-v3';
import has from 'has';
import {
  setLoading,
  updateGBX3,
  clearGBX3,
  updateInfo,
  updateAdmin,
  loadGBX3,
  loadOrg,
  setStyle,
  setOrgStyle,
  setCartOnLoad
} from './redux/gbx3actions';
import {
  setCustomProp,
  toggleModal
} from '../api/actions';
import GBXEntry from '../common/GBXEntry';
import AvatarMenu from './admin/AvatarMenu';
import Share from './share/Share';
import Steps from './helpers/Steps';
import history from '../common/history';

const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
const ENV = process.env.REACT_APP_ENV;
const ENTRY_URL = process.env.REACT_APP_ENTRY_URL;
const GBX_URL = process.env.REACT_APP_GBX_URL;

class GBX3 extends React.Component {

  constructor(props) {
    super(props);
    this.setInfo = this.setInfo.bind(this);
    this.loadCreateNew = this.loadCreateNew.bind(this);
    this.loadBrowse = this.loadBrowse.bind(this);
    this.loadOrg = this.loadOrg.bind(this);
    this.loadSignup = this.loadSignup.bind(this);
    this.loadGBX3 = this.loadGBX3.bind(this);
    this.reloadGBX3 = this.reloadGBX3.bind(this);
    this.setTracking = this.setTracking.bind(this);
    this.setRecaptcha = this.setRecaptcha.bind(this);
    this.renderStage = this.renderStage.bind(this);
    this.onClickVolunteerFundraiser = this.onClickVolunteerFundraiser.bind(this);
    this.signupCallback = this.signupCallback.bind(this);
    this.authenticateVolunteer = this.authenticateVolunteer.bind(this);
    this.exitAdmin = this.exitAdmin.bind(this);
    this.state = {
    };
  }

  async componentDidMount() {
    const {
      articleID,
      editable,
      access,
      hasAccessToEdit,
      isVolunteer,
      orgName,
      blockType,
      step,
      browse,
      signup
    } = this.props;

    this.props.setLoading(true);
    window.parent.postMessage('gbx3Initialized', '*');
    if ((editable && hasAccessToEdit) || hasAccessToEdit) {
      this.props.updateAdmin({ editable });
    } else {
      this.props.updateAdmin({ editable: false });
    }

    const orgID = this.props.orgID || util.getValue(access, 'orgID');
    const setInfo = await this.setInfo();

    if (setInfo) {
      if (browse) {
        this.loadBrowse();
      } else if (signup && !orgID) {
        this.loadSignup();
      } else {
        switch (blockType) {
          case 'org': {
            if (!orgID) {
              console.error('No Org ID so Load Signup');
              this.loadSignup();
            } else if (step === 'create') {
              this.loadCreateNew();
            } else {
              this.loadOrg(orgID);
            }
            break;
          }

          case 'article':
          default: {
            switch (step) {
              case 'create': {
                this.loadCreateNew();
                break;
              }

              case 'design':
              default: {
                if (isVolunteer) {
                  const infoUpdated = await this.props.updateInfo({
                    orgID: orgID || ENV === 'production' ? 585 : 185,
                    orgName: orgName || ENV === 'production' ? 'Givebox' : 'Service Dogs of America'
                  });
                  if (infoUpdated) this.onClickVolunteerFundraiser();
                } else {
                  if (articleID) this.loadGBX3(articleID);
                  else {
                    // autocreate
                    this.loadCreateNew();
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }
    }
    window.addEventListener('scroll',() => {
      window.scrollTop = Math.max(1, Math.min(window.scrollTop,
      window.scrollHeight - window.clientHeight - 1));
      }
    );
  }

  async componentDidUpdate(prevProps) {
    const {
      articleID,
      primaryColor
    } = this.props;

    if (prevProps.primaryColor !== this.props.primaryColor) {
      this.props.setStyle({ primaryColor });
    }

    const articleIDChanged = prevProps.articleID !== this.props.articleID ? true : false;
    if (articleIDChanged) {
      const setInfo = await this.setInfo();
      if (setInfo) {
        this.loadGBX3(articleID);
      }
    }
  }

  loadSignup() {
    this.props.setLoading(false);
    this.props.updateInfo({ display: 'signup', originTemplate: 'signup' });
  }

  loadBrowse(setCart = true) {
    if (setCart) this.props.setCartOnLoad();
    this.props.setLoading(false);
    this.props.updateGBX3('browse', true);
    this.props.updateInfo({ display: 'org', originTemplate: 'browse' });
  }

  async exitAdmin(backToAdmin = false) {
    const {
      project,
      articleID,
      orgID,
      orgSlug,
      originTemplate,
      isVolunteer,
      stage
    } = this.props;

    const display = !articleID || originTemplate === 'org' ? 'org' : this.props.display;
    let backToOrgAdmin = false;
    if (originTemplate === 'org' && stage === 'admin') {
      backToOrgAdmin = true;
    }

    if ((project === 'share' || isVolunteer) && !backToOrgAdmin) {
      const infoUpdated = await this.props.updateInfo({ display, stage: 'public' });
      if (infoUpdated) this.props.updateAdmin({ project: 'share', publicView: true });
    } else {
      const infoUpdated = await this.props.updateInfo({ display });
    }

    if (originTemplate === 'browse') {
      history.push(`${GBX_URL}/discover`);
      this.loadBrowse();
    } else {
      switch (display) {
        case 'org': {
          history.push(`${GBX_URL}/${orgSlug}`);
          this.loadOrg(orgID);
          break;
        }

        case 'article':
        default: {
          history.push(`${GBX_URL}/${articleID}`);
          this.loadGBX3(articleID);
          break;
        }
      }
    }

    window.parent.postMessage('gbx3ExitCallback', '*');
  }

  authenticateVolunteer(res, err) {
    if (!util.isEmpty(res) && !err) {
      this.props.setAccess(res, async () => {
        const infoUpdated = await this.props.updateInfo({ autoCreate: 'fundraiser' });
        if (infoUpdated) this.loadCreateNew(true);
        this.loadCreateNew(true);
      });
    }
  }

  signupCallback(e) {
    if (e.data === 'signupCallback') {
      this.props.getResource('session', {
        reload: true,
        callback: (res, err) => {
          this.authenticateVolunteer(res, err);
        }
      });
    }
  }

  async onClickVolunteerFundraiser() {
    const {
      access
    } = this.props;

    const referer = reactReferer.referer() || window.location.href;
    const entryURL = `${ENTRY_URL}/signup/wallet?modal=true&callback=true`;

    let isRemoteReferer = false;
    if (!referer || !referer.includes('givebox')) {
      isRemoteReferer = true;
    }

    if (util.isEmpty(access)) {
      // open signup
      window.addEventListener('message', this.signupCallback, false);
      if (isRemoteReferer) {
        window.open(entryURL, '_blank');
      } else {
        GBXEntry.init([{ env: ENV, url: entryURL, auto: true }]);
      }
    } else {
      // proceed to create fundraiser
      const infoUpdated = await this.props.updateInfo({ autoCreate: 'fundraiser' });
      if (infoUpdated) this.loadCreateNew(true);
    }
  }

  loadCreateNew(isVolunteer) {
    const {
      access,
      kind,
      orgID
    } = this.props;

    const obj = {
      step: 'create',
      publicView: false,
      hasAccessToCreate: isVolunteer ? true : util.getAuthorizedAccess(access, orgID),
      hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
    };

    if (isVolunteer) {
      obj.isVolunteer = true;
      obj.volunteerID = util.getValue(access, 'userID', null);
    }

    this.props.updateAdmin(obj);
    this.props.updateInfo({ kind, stage: 'admin', display: 'article' });
    this.props.setLoading(false);
  }

  async setInfo() {
    const {
      queryParams,
      info,
      orgID,
      articleID,
      template,
      modal
    } = this.props;

    info.queryParams = queryParams;
    info.template = template;
    info.articleID = articleID;
    info.orgID = orgID;
    info.modal = has(queryParams, 'modal') || modal ? true : false;
    info.preview = has(queryParams, 'preview') ? true : false;
    info.signup = has(queryParams, 'signup') ? true : false;
    info.locked = has(queryParams, 'locked') ? true : false;
    info.noFocus = has(queryParams, 'noFocus') ? true : false;
    info.receipt = has(queryParams, 'receipt') ? true : false;
    info.noloaderbg = has(queryParams, 'noloaderbg') ? true : false;
    info.deactivated = has(queryParams, 'deactivated') ? true : false;
    info.ebToken = util.getValue(queryParams, 'eb', null);
    info.ebEmail = util.getValue(queryParams, 'm', null);
    info.autoCreate = util.getValue(queryParams, 'autoCreate');
    info.clone = util.getValue(queryParams, 'clone');
    info.cameFromNonprofitAdmin = has(queryParams, 'nonprofitAdmin') ? true : false;

    const loc = util.getValue(queryParams, 'loc', reactReferer.referer());
    const sourceLocation = loc || window.location.href;
    info.sourceLocation = this.props.sourceLocation || sourceLocation;
    info.project = util.getValue(queryParams, 'project', this.props.project || null);

    if (this.props.backToOrgCallback) info.originTemplate = 'org';
    if (this.props.exitURL) info.exitURL = this.props.exitURL;

    if (has(queryParams, 'public') || this.props.public) {
      this.props.updateAdmin({ publicView: true });
    }

    const infoUpdated = await this.props.updateInfo(info);
    if (infoUpdated) return true;
  }

  setRecaptcha() {
    const {
      preview
    } = this.props.info;

    const bodyEl = document.getElementsByTagName('body')[0];
    if (!preview) {
      bodyEl.classList.add('live');
      loadReCaptcha(RECAPTCHA_KEY);
    } else {
      bodyEl.classList.add('preview');
    }
  }

  setTracking() {
    const {
      info,
      articleID
    } = this.props;

    const {
      preview,
      ebToken,
      ebEmail
    } = info;

    if (!preview && articleID) {
      const data = {
        type: 'details',
        articleID,
        ebToken,
        ebEmail
      };
      this.props.sendResource('articleView', {
        data,
        id: [articleID],
        isSending: false
      });
    }
  }

  async reloadGBX3(articleID, callback) {
    this.props.setLoading(true);
    const gbx3Cleared = await this.props.clearGBX3(true);
    let loaded = false;
    if (gbx3Cleared) {
      this.loadGBX3(articleID, callback);
      loaded = true;
    }
    if (loaded) return true;
  }

  async loadOrg(orgID, page) {
    const {
      queryParams,
      stage
    } = this.props;

    const share = has(queryParams, 'share') ? true : false;
    const previewMode = has(queryParams, 'previewMode') ? true : false;
    const activePageUpdated = page ? await this.props.updateInfo({ 'activePageSlug': page }) : true;

    if (activePageUpdated) {
      this.props.loadOrg(orgID, (res, err) => {
        if (!err && !util.isEmpty(res)) {
          this.props.setOrgStyle();
          if (stage === 'admin') this.props.updateInfo({ stage });
          if (share) this.props.toggleModal('share', true);
          if (previewMode) this.props.updateAdmin({ previewDevice: 'desktop', previewMode: true });
        }
      });
    }
  }


  async loadGBX3(articleID, callback) {

    const {
      queryParams
    } = this.props;

    const share = has(queryParams, 'share') ? true : false;
    const steps = has(queryParams, 'steps') ? true : false;
    const previewMode = has(queryParams, 'previewMode') ? true : false;

    var loaded = false;
    this.props.loadGBX3(articleID, (res, err) => {
      if (!err && !util.isEmpty(res)) {
        this.props.setStyle();
        this.setRecaptcha();
        this.setTracking();
        if (steps) this.props.toggleModal('stepsForm', true);
        if (share) this.props.toggleModal('share', true);
        if (previewMode) this.props.updateAdmin({ previewDevice: 'desktop', previewMode: true });
        if (callback) callback();
      }
      loaded = true;
    });
    if (loaded) {
      return true;
    }
  }

  renderStage() {
    const {
      hasAccessToCreate,
      hasAccessToEdit,
      publicView,
      display
    } = this.props;

    const items = [];

    if ((hasAccessToCreate || hasAccessToEdit) && !publicView && display !== 'signup') {
      items.push(
        <Admin
          key={'admin'}
          loadGBX3={this.loadGBX3}
          reloadGBX3={this.reloadGBX3}
          exitCallback={this.props.exitCallback}
          loadCreateNew={this.loadCreateNew}
          exitAdmin={this.exitAdmin}
        />
      )
    } else {
      items.push(
        <Layout
          key={'public'}
          loadOrg={this.loadOrg}
          loadGBX3={this.loadGBX3}
          reloadGBX3={this.reloadGBX3}
          loadBrowse={this.loadBrowse}
          primaryColor={this.props.primaryColor}
          onClickVolunteerFundraiser={this.onClickVolunteerFundraiser}
          backToOrgCallback={this.props.backToOrgCallback}
          exitAdmin={this.exitAdmin}
        />
      )
    }

    return items;
  }

  render() {

    const {
      browse,
      orgID
    } = this.props;

    if (this.props.loading
      || (util.isLoading(this.props.gbx3Org) && orgID)
      && this.props.step !== 'create'
      && !browse) return <Loader msg='Initiating GBX3' />;

    return (
      <div id='gbx3MainWrapper' className='gbx3'>
        {this.renderStage()}
        <ModalRoute
          className='gbx3'
          id='avatarMenu'
          effect='3DFlipVert'
          style={{ width: '40%' }}
          disallowBgClose={false}
          component={(props) => <AvatarMenu exitAdmin={this.exitAdmin} reloadGBX3={this.reloadGBX3} />}
        />
        <ModalRoute
          className='gbx3'
          id='share'
          effect='3DFlipVert'
          style={{ width: '80%' }}
          disallowBgClose={false}
          draggable={false}
          draggableTitle={``}
          component={(props) => <Share />}
        />
        <ModalRoute
          className='gbx3'
          id='stepsForm'
          effect='3DFlipVert'
          style={{ width: '70%' }}
          disallowBgClose={true}
          component={(props) => <Steps />}
        />
      </div>
    )
  }
}

GBX3.defaultProps = {
  kind: 'fundraiser',
  sourceLocation: null
}

function mapStateToProps(state, props) {

  const queryParams = util.getValue(props, 'queryParams', {});
  const gbx3 = util.getValue(state, 'gbx3', {});
  const loading = util.getValue(gbx3, 'loading');
  const globals = util.getValue(gbx3, 'globals', {});
  const info = util.getValue(gbx3, 'info', {});
  const stage = util.getValue(info, 'stage');
  const originTemplate = util.getValue(info, 'originTemplate');
  const display = util.getValue(info, 'display');
  const sourceLocation = util.getValue(info, 'sourceLocation');
  const gbxStyle = util.getValue(globals, 'gbxStyle', {});
  const primaryColor = util.getValue(gbxStyle, 'primaryColor');
  const admin = util.getValue(gbx3, 'admin', {});
  const step = util.getValue(admin, 'step');
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const hasAccessToCreate = util.getValue(admin, 'hasAccessToCreate');
  const isVolunteer = util.getValue(admin, 'isVolunteer');
  const publicView = util.getValue(admin, 'publicView');
  const gbx3Org = util.getValue(state, 'resource.gbx3Org', {});
  const orgSlug = util.getValue(gbx3Org, 'data.slug');
  const browse = has(queryParams, 'browse') ? true : props.browse;
  const signup = has(queryParams, 'signup') ? true : props.signup;

  return {
    globals,
    loading,
    info,
    stage,
    originTemplate,
    display,
    primaryColor,
    sourceLocation,
    hasAccessToEdit,
    hasAccessToCreate,
    isVolunteer,
    publicView,
    gbx3Org,
    orgSlug,
    step,
    browse,
    signup,
    access: util.getValue(state.resource, 'access', {})
  }
}

export default connect(mapStateToProps, {
  loadGBX3,
  loadOrg,
  setStyle,
  setAccess,
  getResource,
  sendResource,
  setCustomProp,
  setLoading,
  updateGBX3,
  clearGBX3,
  updateInfo,
  updateAdmin,
  toggleModal,
  setOrgStyle,
  setCartOnLoad
})(GBX3);
