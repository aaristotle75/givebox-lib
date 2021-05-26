import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import Loader from '../common/Loader';
import { launchpadConfig } from './admin/launchpad/launchpadConfig';
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
    this.state = {
    };
  }

  componentDidMount() {
    if (this.props.openApp) {
      const app = launchpadConfig.find(a => a.slug === this.props.openApp);
      console.log('execute auto openapp -> ', app);
    }
    window.addEventListener('message', this.appLoadedMessage, false);
  }

  appLoadedMessage(e) {
    if (e.data === 'givebox-appLoaded') {
      this.props.setProp('appLoading', false);
    }
  }

  onClickApp(path, slug) {
    const {
      accessOrgID,
      masker,
      isSuper,
      currentOrgID
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
              openApp: slug
            });
          }
        });
      } else if (isSuper && masker && accessOrgID && (accessOrgID !== currentOrgID)) {
        this.props.endMasquerade(() => {
          this.props.startMasquerade({
            callback: () => {
              this.props.setAppProps({
                openAppURL,
                openApp: slug
              });
            }
          });
        })
      } else {
        this.props.setAppProps({
          openAppURL,
          openApp: slug
        });
      }
    }
  }

  renderAppList() {
    const items = [];
    Object.entries(launchpadConfig).forEach(([key, value]) => {
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

  renderAppDisplay() {
    const {
      openAppURL,
      appLoading
    } = this.props;

    const app = launchpadConfig.find(a => a.slug === this.props.openApp);

    return (
      <>
        <div className='launchpadScreen'></div>
        { !appLoading ?
        <div className='launchpadActions'>
          <GBLink className='button' onClick={() => this.props.toggleModal('launchpad', false)}>
            Exit {util.getValue(app, 'name')}
          </GBLink>
        </div>
        : null }
        <iframe src={openAppURL} />
      </>
    );
  }

  render() {

    const {
      openAppURL,
      appLoading
    } = this.props;

    console.log('execute render appLoading-> ', appLoading);
    return (
      <>
        { appLoading ? <Loader infinite={true} msg='Loading app...' /> : null }
        { openAppURL ?
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
  const openAppURL = util.getValue(state, 'app.openAppURL', null);
  const appLoading = util.getValue(state, 'app.appLoading');
  const currentOrgID = util.getValue(state, 'gbx3.info.orgID');

  return {
    accessOrgID,
    masker,
    isSuper,
    openApp,
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
