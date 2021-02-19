import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import Dropdown from '../../form/Dropdown';
import {
  updateInfo,
  updateAdmin,
  updateData
} from '../redux/gbx3actions';
import { sendResource } from '../../api/helpers';

class Publish extends React.Component {

  constructor(props) {
    super(props);
    this.updatePublishStatus = this.updatePublishStatus.bind(this);
    this.state = {
      publishOpen: false,
      landingPageOpen: false
    };
  }

  async updatePublishStatus(name, value) {
    const {
      kind,
      kindID,
      orgID
    } = this.props;

    const publishStatus = util.deepClone(this.props.publishStatus);

    if (name === 'webApp') {
      switch (kind) {
        case 'fundraiser': {
          if (value === 'public') {
            publishStatus.webApp = true;
            publishStatus.mobileApp = true;
            publishStatus.swipeApp = true;
          } else {
            publishStatus.webApp = false;
            publishStatus.mobileApp = false;
            publishStatus.swipeApp = false;
            publishStatus.givebox = false;
          }
          break;
        }

        default: {
          // all kinds except fundraiser have webApp reversed, so false is actually public and true is private
          if (value === 'public') {
            publishStatus.webApp = false;
            publishStatus.mobileApp = true;
            publishStatus.swipeApp = true;
          } else {
            publishStatus.webApp = true;
            publishStatus.mobileApp = false;
            publishStatus.swipeApp = false;
            publishStatus.givebox = false;
          }
          break;
        }
      }
    }

    if (name === 'landingPage') {
      publishStatus.givebox = value === 'yes' ? true : false;
    }

    const dataUpdated = await this.props.updateData({
      publishedStatus: publishStatus
    });
    if (dataUpdated) {
      this.props.sendResource(types.kind(kind).api.publish, {
        orgID,
        id: [kindID],
        method: 'patch',
        isSending: false,
        data: publishStatus
      });
    }
  }

  render() {

    const {
      kind,
      webApp,
      givebox,
      publishStatus
    } = this.props;

    const {
      publishOpen,
      landingPageOpen
    } = this.state;

    const webAppStatus = util.getPublishStatus(kind, webApp);

    return (
      <ul>
        <li className='listHeader'>Status & Visibility</li>
        <li
          onClick={() => {
            const publishOpen = this.state.publishOpen ? false : true;
            this.setState({ publishOpen });
          }}
          className='stylePanel'
        >
          Visibility
          <Dropdown
            open={publishOpen}
            portalClass={'gbx3'}
            portalID={`leftPanel-publishStatus`}
            portal={true}
            name='webApp'
            contentWidth={175}
            label={''}
            className='leftPanelDropdown'
            fixedLabel={true}
            defaultValue={webAppStatus}
            onChange={(name, value) => {
              this.updatePublishStatus(name, value);
            }}
            options={[
              { primaryText: 'Public', secondaryText: 'Visible to Everyone.', value: 'public' },
              { primaryText: 'Private', secondaryText: 'Only visible to site admins.', value: 'private' }
            ]}
          />
        </li>
        { webAppStatus === 'public' ?
        <li
          onClick={() => {
            const landingPageOpen = this.state.landingPageOpen ? false : true;
            this.setState({ landingPageOpen });
          }}
          className='stylePanel'
        >
          Listed
          <Dropdown
            open={landingPageOpen}
            portalClass={'gbx3'}
            portalID={`leftPanel-publishStatus`}
            portal={true}
            name='landingPage'
            contentWidth={175}
            label={''}
            className='leftPanelDropdown'
            fixedLabel={true}
            defaultValue={givebox ? 'yes' : 'no'}
            onChange={(name, value) => {
              this.updatePublishStatus(name, value);
            }}
            options={[
              { primaryText: 'Yes', secondaryText: 'Listed on Landing Page.', value: 'yes' },
              { primaryText: 'No', secondaryText: 'Not Listed on Landing Page.', value: 'no' }
            ]}
          />
        </li> : null }
      </ul>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const publishStatus = util.getValue(gbx3, 'data.publishedStatus', {});
  const webApp = util.getValue(publishStatus, 'webApp');
  const givebox = util.getValue(publishStatus, 'givebox');
  const kind = util.getValue(gbx3, 'info.kind');
  const kindID = util.getValue(gbx3, 'info.kindID');
  const orgID = util.getValue(gbx3, 'info.orgID');

  return {
    publishStatus,
    webApp,
    givebox,
    kind,
    kindID,
    orgID
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateAdmin,
  updateData,
  sendResource
})(Publish);
