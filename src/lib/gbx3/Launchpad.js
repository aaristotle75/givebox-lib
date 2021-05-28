import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import Loader from '../common/Loader';
import * as launchpadConfig from './admin/launchpad/launchpadConfig';
import Image from '../common/Image';
import GBLink from '../common/GBLink';
import {
  toggleModal,
  setProp,
  setAppProps,
  startMasquerade,
  endMasquerade
} from '../api/actions';

const APP_URL = process.env.REACT_APP_CLOUD_URL;

class Launchpad extends React.Component {

  constructor(props) {
    super(props);
    this.renderAppList = this.renderAppList.bind(this);
    this.renderAppDisplay = this.renderAppDisplay.bind(this);
    this.onClickApp = this.onClickApp.bind(this);
    this.appLoadedMessage = this.appLoadedMessage.bind(this);
    this.launchpadActions = this.launchpadActions.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      autoOpenSlug
    } = this.props;

    if (autoOpenSlug) {
      const app = launchpadConfig.appList.find(a => a.slug === autoOpenSlug);
      if (app) {
        const path = util.getValue(app, 'path');
        this.onClickApp(path, autoOpenSlug);
      }
    }
    window.addEventListener('message', this.appLoadedMessage, false);
  }

  appLoadedMessage(e) {
    if (e.data === 'givebox-appLoaded') {
      this.props.setProp('appLoading', false);
    }
    if (e.data === 'exitLaunchpad') {
      this.props.toggleModal('launchpad', false);
    }
  }

  onClickApp(path, slug) {
    const {
      accessOrgID,
      masker,
      isSuper,
      currentOrgID,
      openAppSlug
    } = this.props;

    if (path === 'backgroundClick') {
      this.props.toggleModal('launchpad', false);
    } else {
      const modalEl = document.getElementById('modalOverlay-launchpad');
      if (modalEl) {
        if (!modalEl.classList.contains('appLoaded')) modalEl.classList.add('appLoaded');
      }
      this.props.setProp('appLoading', true);
      const openAppURL = `${APP_URL}${path}`;
      if (isSuper && !masker) {
        this.props.startMasquerade({
          callback: () => {
            this.props.setAppProps({
              openAppURL,
              openAppSlug: slug,
              openApp: true
            });
          }
        });
      } else if (isSuper && masker && accessOrgID && (accessOrgID !== currentOrgID)) {
        this.props.endMasquerade(() => {
          this.props.startMasquerade({
            callback: () => {
              this.props.setAppProps({
                openAppURL,
                openAppSlug: slug,
                openApp: true
              });
            }
          });
        })
      } else {
        this.props.setAppProps({
          openAppURL,
          openAppSlug: slug,
          openApp: true
        });
      }
    }
  }

  renderAppList() {
    const items = [];
    Object.entries(launchpadConfig.appList).forEach(([key, value]) => {
      items.push(
        <div
          key={key}
          className='launchpadItem'
          onClick={() => {
            this.onClickApp(value.path, value.slug);
          }}
        >
        <Image maxSize={'140px'} url={`https://cdn.givebox.com/givebox/public/images/backgrounds/${value.image}.png`} size='inherit' alt={value.name} />
          <span className='appName'>{value.name}</span>
        </div>
      )
    });

    return (
      <>
        <div className='launchpadScreen'></div>
        <div className='launchpadContent'>
          <div className='launchpadBackgroundClick' onClick={() => this.onClickApp('backgroundClick')}></div>
          <div className='launchpadItems'>
            {items}
          </div>
        </div>
      </>
    );
  }

  launchpadActions() {

    const app = launchpadConfig.appList.find(a => a.slug === this.props.openAppSlug);

    return (
      <div className='launchpadActions'>
        <GBLink className='launchpadActionsButton helpDeskButtonStyle' onClick={() => this.props.toggleModal('launchpad', false)}>
          Exit {util.getValue(app, 'name', 'App')}
        </GBLink>
        <GBLink
          className='launchpadActionsButton helpDeskButtonStyle'
          onClick={() => this.props.setAppProps({
            openApp: false
          })}
        >
          Launchpad
        </GBLink>
      </div>
    )
  }

  renderAppDisplay() {
    const {
      openAppURL,
      appLoading
    } = this.props;

    return (
      <>
        <div className='launchpadScreen'></div>
        <iframe src={openAppURL} />
      </>
    );
  }

  render() {

    const {
      openApp,
      appLoading
    } = this.props;

    return (
      <>
        { appLoading ? <Loader infinite={true} msg='Loading app...' /> : null }
        { openApp ?
          this.renderAppDisplay()
        :
          this.renderAppList()
        }
      </>
    )
  }
}

function mapStateToProps(state, props) {

  const access = util.getValue(state, 'resource.access', {});
  const accessOrgID = util.getValue(access, 'orgID');
  const masker = util.getValue(access, 'masker');
  const isSuper = util.getValue(access, 'role') === 'super' ? true : false;
  const openApp = util.getValue(state, 'app.openApp');
  const openAppSlug = util.getValue(state, 'app.openAppSlug');
  const openAppURL = util.getValue(state, 'app.openAppURL', null);
  const appLoading = util.getValue(state, 'app.appLoading');
  const currentOrgID = util.getValue(state, 'gbx3.info.orgID');

  return {
    accessOrgID,
    masker,
    isSuper,
    openApp,
    openAppSlug,
    openAppURL,
    appLoading,
    currentOrgID
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  setProp,
  setAppProps,
  startMasquerade,
  endMasquerade
})(Launchpad);
