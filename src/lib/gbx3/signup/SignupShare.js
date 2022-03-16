import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import Icon from '../../common/Icon';
import Loader from '../../common/Loader';
import HelpfulTip from '../../common/HelpfulTip';
import {
  sendResource,
  getResource
} from '../../api/helpers';
import { FiCopy } from 'react-icons/fi';
import { TiSocialFacebook } from 'react-icons/ti';
import { FiPenTool } from 'react-icons/fi';
import { VscMegaphone } from 'react-icons/vsc';
import ShareLinkCopy from '../share/ShareLinkCopy';
import ShareLinkEdit from '../share/ShareLinkEdit';
import Social from '../blocks/Social';

class SignupShare extends React.Component {

  constructor(props) {
    super(props);
    this.renderShareType = this.renderShareType.bind(this);
    this.renderShareList = this.renderShareList.bind(this);
    this.setShareTypeSelected = this.setShareTypeSelected.bind(this);
    this.getArticle = this.getArticle.bind(this);
    this.state = {
      shareTypeSelected: props.defaultSelected || 'copy',
      previewURL: null
    };
  }

  componentDidMount() {
    this.getArticle();
    this.props.sendResource('gbxPreview', {
      id: [this.props.articleID],
      reload: true,
      callback: (res, err) => {
        console.log('execute gbxPreview -> ', res, err);
      }
    });
  }

  getArticle() {
    this.props.getResource('article', {
      customName: 'createdArticle',
      id: [this.props.articleID],
      reload: true
    });
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
      { type: 'edit', name: 'Customize Share Link', icon: <Icon><FiPenTool /></Icon>, imageURL: '', restricted: true },
      { type: 'social', name: 'Share to Social Media', icon: <Icon><TiSocialFacebook /></Icon>, imageURL: '' }
    ];

    const items = [];

    shareTypes.forEach((value, key) => {
      if (!hasAccessToEdit && value.restricted) return;
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
      <div className='createKindSection' style={{ marginTop: 0 }}>
        <span className='intro'>Share {types.kind(kind).name}</span>
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
      article,
      articleID,
      kind,
      kindID,
      orgID,
      slug,
      hasCustomSlug,
      apiName,
      showHelper
    } = this.props;

    const data = util.getValue(article, 'data', {});

    const item = [];

    switch (shareTypeSelected) {

      case 'edit': {
        item.push(
          <div key='editLink'>
            <ShareLinkEdit
              display='article'
              kind={kind}
              kindID={kindID}
              articleID={articleID}
              callback={this.getArticle}
              data={data}
              slug={slug}
              hasCustomSlug={hasCustomSlug}
              apiName={apiName}
              buttonText={'Click Here to Update Your Custom Share Link'}
              buttonGroupStyle={{
                marginTop: 15
              }}
              buttonGroupClassName='flexCenter'
              subText={
                showHelper ?
                  <HelpfulTip
                    headerIcon={<span className='icon icon-link-2'></span>}
                    headerText={`Custom Link`}
                    text={`Enter a custom link below which makes your fundraiser more identifiable to your supporters.`}
                    style={{ marginTop: 0, marginBottom: 10 }}
                  />
                : null
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
              display='article'
              kind={kind}
              kindID={kindID}
              articleID={articleID}
              slug={slug}
              hasCustomSlug={hasCustomSlug}
              subText={
                showHelper ?
                  <HelpfulTip
                    headerIcon={<span className='icon icon-copy'></span>}
                    headerText={`Share Link`}
                    text={`Copy and Paste this link anywhere you want to share your fundraiser.`}
                    style={{ marginTop: 0, marginBottom: 30 }}
                  />
                : null
              }
            />
          </div>
        );
        break;
      }

      case 'social':
      default: {
        item.push(
          <div key='social'>
            <Social
              data={data}
              articleID={articleID}
              shareIconSize={40}
              subText={
                showHelper ?
                  <HelpfulTip
                    headerIcon={<Icon><VscMegaphone /></Icon>}
                    headerText={`Don't be shy!`}
                    text={`The quickest way to start raising money is to share your fundraiser on the social media sites. Click a social media icon below.`}
                    style={{ marginTop: 0, marginBottom: 30 }}
                  />
                : null
              }
            />
          </div>
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

    if (util.isLoading(this.props.article)) return <Loader msg='Loading Share...' />

    return (
      <div className='createStep'>
        <div style={{ paddingTop: 0, ...this.props.style }} className={`modalWrapper`}>
          {this.renderShareList()}
          {this.renderShareType()}
        </div>
      </div>
    )
  }
}

SignupShare.defaultProps = {
  hideList: [],
  showHelper: true,
  style: {}
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const kind = 'fundraiser';
  const articleID = util.getValue(gbx3, 'orgSignup.createdArticleID');
  const article = util.getValue(state, 'resource.createdArticle', {});
  const kindID = util.getValue(article, 'data.kindID');
  const orgID = util.getValue(article, 'data.orgID');
  const slug = util.getValue(article, 'data.slug');
  const hasCustomSlug = util.getValue(article, 'data.hasCustomSlug');
  const hasAccessToEdit = util.getValue(gbx3, 'admin.hasAccessToEdit');
  const apiName = `org${types.kind(kind).api.item}`;

  return {
    kind,
    kindID,
    articleID,
    article,
    orgID,
    slug,
    hasCustomSlug,
    apiName,
    hasAccessToEdit
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource
})(SignupShare);
