import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import { Alert } from '../../common/Alert';
import Icon from '../../common/Icon';
import HelpfulTip from '../../common/HelpfulTip';
import {
  sendResource
} from '../../api/helpers';
import ShareSocial from './ShareSocial';
import { FiCopy } from 'react-icons/fi';
import { TiSocialFacebook } from 'react-icons/ti';
import { MdWeb } from 'react-icons/md';
import { FiPenTool } from 'react-icons/fi';
import ShareLinkCopy from './ShareLinkCopy';
import ShareLinkEdit from './ShareLinkEdit';
import ShareWeb from './ShareWeb';

class Share extends React.Component {

  constructor(props) {
    super(props);
    this.renderShareType = this.renderShareType.bind(this);
    this.renderShareList = this.renderShareList.bind(this);
    this.setShareTypeSelected = this.setShareTypeSelected.bind(this);
    this.state = {
      shareTypeSelected: props.defaultSelected || 'social'
    };
  }

  componentDidMount() {
    /*
    this.props.sendResource('gbxPreview', {
      id: [this.props.articleID],
      method: 'post',
      reload: true,
      data: {},
      callback: (res, err) => {
        console.log('execute gbxPreview', res, err);
      }
    });
    */
  }

  setShareTypeSelected(shareTypeSelected) {
    this.setState({ shareTypeSelected });
  }

  renderShareList() {
    const {
      kind,
      display,
      hideList,
      hasAccessToEdit
    } = this.props;

    const {
      shareTypeSelected
    } = this.state;

    const shareTypes = [
      { type: 'copy', name: 'Copy Share Link', icon: <Icon><FiCopy /></Icon>, imageURL: '' },
      { type: 'edit', name: 'Edit Share Link', icon: <Icon><FiPenTool /></Icon>, imageURL: '', restricted: true },
      { type: 'social', name: 'Share to Social Media', icon: <Icon><TiSocialFacebook /></Icon>, imageURL: '' },
      { type: 'web', name: 'Add to Your Website', icon: <Icon><MdWeb /></Icon>, imageURL: '', org: 'hide' }
    ];

    const items = [];
    const orgDisplay = display === 'org' ? true : false;

    shareTypes.forEach((value, key) => {
      if (!hasAccessToEdit && value.restricted) return;
      if (orgDisplay && value.org === 'hide') return;
      else if (hideList.includes(value.type)) return;
      else {
        items.push(
          <div key={key} className='createKindItem' onClick={() => this.setShareTypeSelected(value.type)}>
            <div className='createIcon'>{value.icon}</div>
            <span style={{ fontSize: '1em' }} className='createKindItemText'>
              {value.name}
            </span>
            <div className='shareIndicator'>{ shareTypeSelected === value.type ? <span className='icon icon-chevron-down'></span> : '' }</div>
          </div>
        );
      }
    });

    return (
      <div className='createKindSection'>
        <span className='intro'>Share {orgDisplay ? 'Profile' : types.kind(kind).name}</span>
        <div className='createKindList'>
          {items}
        </div>
      </div>
    );
  }

  renderShareType() {
    const {
      shareTypeSelected
    } = this.state;

    const {
      display,
      article,
      articleID,
      kind,
      kindID,
      orgID,
      slug,
      hasCustomSlug,
      apiName,
      shareLinkEditCallback,
      share
    } = this.props;

    const item = [];
    const data = util.getValue(article, 'data', null);
    const orgDisplay = display === 'org' ? true : false;

    switch (shareTypeSelected) {

      case 'web': {
        item.push(
          <ShareWeb
            key='shareWeb'
            orgDisplay={orgDisplay}
          />
        );
        break;
      }

      case 'edit': {
        item.push(
          <div key='editLink'>
            <ShareLinkEdit
              display={display}
              kind={kind}
              kindID={kindID}
              articleID={articleID}
              callback={shareLinkEditCallback}
              data={data}
              slug={slug}
              hasCustomSlug={hasCustomSlug}
              apiName={apiName}
              buttonText={'Click Here to Save Your Custom Share Link'}
              buttonGroupStyle={{
                marginTop: 15
              }}
              buttonGroupClassName='flexCenter'
              subText={
                <HelpfulTip
                  headerIcon={<span className='icon icon-link-2'></span>}
                  headerText={`Custom Link`}
                  text={`Enter a custom link below which makes your ${orgDisplay ? 'profile page' : 'fundraiser'} more identifiable to your supporters.`}
                  style={{ marginTop: 0, marginBottom: 10 }}
                />
              }
            />
          </div>
        );
        break;
      }

      case 'copy': {
        item.push(
          <div key='copyLink'>
            <ShareLinkCopy
              display={display}
              kind={kind}
              kindID={kindID}
              articleID={articleID}
              slug={slug}
              hasCustomSlug={hasCustomSlug}
              subText={
                <HelpfulTip
                  headerIcon={<span className='icon icon-copy'></span>}
                  headerText={`Share Link`}
                  text={`Copy and Paste this link anywhere you want to share your ${orgDisplay ? 'profile page' : 'fundraiser'}.`}
                  style={{ marginTop: 0, marginBottom: 30 }}
                />
              }
            />
          </div>
        );
        break;
      }

      case 'social':
      default: {
        item.push(
          <ShareSocial
            key='shareSocial'
            display={display}
            kind={kind}
            orgDisplay={orgDisplay}
            articleID={articleID}
            data={data}
          />
        );
        break;
      }
    }

    return (
      <div>
        {item}
      </div>
    )
  }

  render() {

    const {
      kind,
      webApp,
      display
    } = this.props;


    return (
      <div className='createStep'>
        <div style={{ paddingTop: 0 }} className={`modalWrapper`}>
          <Alert style={{ marginTop: 20 }} alert='error' display={util.getPublishStatus(kind, webApp) === 'private' && display !== 'org' ? true : false} msg={`This ${types.kind(kind).name} is Set to Private`} />
          {this.renderShareList()}
          {this.renderShareType()}
        </div>
      </div>
    )
  }
}

Share.defaultProps = {
  hideList: []
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const hasAccessToEdit = util.getValue(gbx3, 'admin.hasAccessToEdit');
  const info = util.getValue(gbx3, 'info', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const display = props.forceDisplay || util.getValue(info, 'display');
  const kind = props.kind || util.getValue(info, 'kind');
  const articleID = props.articleID || util.getValue(info, 'articleID');
  const webApp = props.webApp || util.getValue(gbx3, 'data.publishedStatus.webApp');
  const hasCustomSlug = display === 'org' ? true : props.hasCustomSlug;

  return {
    display,
    kind,
    articleID,
    webApp,
    hasAccessToEdit,
    hasCustomSlug
  }
}

export default connect(mapStateToProps, {
  sendResource
})(Share);
