import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import Loader from '../common/Loader';
import { launchpadConfig } from './admin/launchpad/launchpadConfig';
import Image from '../common/Image';
import {
  toggleModal,
  setProp,
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
    document.addEventListener('message', this.appLoadedMessage, false);
  }

  appLoadedMessage(e) {
    if (e.data === 'givebox-appLoaded') {
      this.props.setProp('appLoading', false);
    }
  }

  onClickApp(path) {
    const {
      accessOrgID,
      masker,
      isSuper,
      currentOrgID
    } = this.props;

    if (path === 'backgroundClick') {
      this.props.toggleModal('launchpad', false);
    } else {
      this.props.setProp('appLoading', true);
      const appURL = `${APP_URL}${path}`;
      if (isSuper && !masker) {
        this.props.startMasquerade({
          callback: () => {
            this.props.setProp('openAppURL', appURL);
          }
        });
      } else if (isSuper && masker && accessOrgID && (accessOrgID !== currentOrgID)) {
        this.props.endMasquerade(() => {
          this.props.startMasquerade({
            callback: () => {
              this.props.setProp('openAppURL', appURL);
            }
          });
        })
      } else {
        this.props.setProp('openAppURL', appURL);
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
            this.onClickApp(value.path);
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
      openAppURL
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
      openAppURL,
      appLoading
    } = this.props;

    return (
      <>
        { !appLoading ? <Loader msg='Loading app...' /> : null }
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
  const openAppURL = util.getValue(state, 'app.openAppURL', null);
  const appLoading = util.getValue(state, 'app.appLoading');
  const currentOrgID = util.getValue(state, 'gbx3.info.orgID');

  return {
    accessOrgID,
    masker,
    isSuper,
    openAppURL,
    appLoading,
    currentOrgID
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  setProp,
  startMasquerade,
  endMasquerade
})(Launchpad);
