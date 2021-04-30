import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import { Alert } from '../../common/Alert';
import Loader from '../../common/Loader';
import Icon from '../../common/Icon';
import HelpfulTip from '../../common/HelpfulTip';
import {
  getResource,
  sendResource
} from '../../api/helpers';
import {
  removeResource
} from '../../api/actions';
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
    this.getShareArticle = this.getShareArticle.bind(this);
    this.renderShareType = this.renderShareType.bind(this);
    this.renderShareList = this.renderShareList.bind(this);
    this.setShareTypeSelected = this.setShareTypeSelected.bind(this);
    this.state = {
      shareTypeSelected: props.defaultSelected || 'social'
    };
  }

  componentDidMount() {
    this.getShareArticle();
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

  componentWillUnmount() {
    this.props.removeResource('shareArticle');
  }

  getShareArticle() {
    if (this.props.getArticleID) {
      this.props.getResource('article', {
        id: [this.props.getArticleID],
        customName: 'shareArticle',
        reload: true
      });
    };
  }

  setShareTypeSelected(shareTypeSelected) {
    this.setState({ shareTypeSelected });
  }

  renderShareList() {
    const {
      kind,
      display,
      hideList,
      hasAccessToEdit,
      title
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
        <div className='intro' style={{ marginBottom: 20 }}>
          <span className='smallText'>
            Share {orgDisplay ? 'Profile Page' : types.kind(kind).name}
          </span>
          {title}
        </div>
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
      articleID,
      kind,
      orgID,
      hasCustomSlug,
      apiName,
      shareArticle,
      shareLinkEditCallback
    } = this.props;

    const item = [];
    const orgDisplay = display === 'org' ? true : false;
    const data = util.getValue(shareArticle, 'data', null);
    const slug = util.getValue(shareArticle, 'data.slug');
    const kindID = util.getValue(shareArticle, 'data.kindID');

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
              callback={() => {
                if (this.props.getArticleID) {
                  this.getShareArticle();
                }
                if (this.props.shareLinkEditCallback) this.props.shareLinkEditCallback();
              }}
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

    if (this.props.getArticleID && util.isLoading(this.props.shareArticle)) return <Loader msg='Loading Share Article...' />

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
  const articleID = props.getArticleID || util.getValue(info, 'articleID');
  const shareArticle = util.getValue(state, 'resource.shareArticle', {});

  let kind = util.getValue(info, 'kind');
  let kindID = util.getValue(info, 'kindID');
  let title = display === 'org' ? util.getValue(state, 'resource.gbx3Org.data.name') : util.getValue(gbx3, 'data.title');
  let webApp = util.getValue(gbx3, 'data.publishedStatus.webApp');
  let hasCustomSlug = display === 'org' ? true : util.getValue(gbx3, 'data.hasCustomSlug');
  let apiName = null;

  // if getArticleID is passed use values from the get article info
  if (props.getArticleID) {
    kind = util.getValue(shareArticle, 'data.kind');
    kindID = util.getValue(shareArticle, 'data.kindID');
    title = util.getValue(shareArticle, 'data.title');
    webApp = util.getValue(shareArticle, 'data.publishedStatus.webApp');
    hasCustomSlug = util.getValue(shareArticle, 'data.hasCustomSlug');
    apiName = `org${types.kind(kind).api.item}`;
  }

  return {
    hasAccessToEdit,
    display,
    shareArticle,
    kind,
    kindID,
    title,
    articleID,
    webApp,
    hasCustomSlug,
    apiName
  }
}

export default connect(mapStateToProps, {
  removeResource,
  getResource,
  sendResource
})(Share);
