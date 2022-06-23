import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import Icon from '../../common/Icon';
import Loader from '../../common/Loader';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import HelpfulTip from '../../common/HelpfulTip';
import IframeScaled from '../../common/IframeScaled';
import {
  sendResource,
  getResource
} from '../../api/helpers';
import {
  toggleModal
} from '../../api/actions';
import { FiCopy } from 'react-icons/fi';
import { TiSocialFacebook } from 'react-icons/ti';
import { FiPenTool } from 'react-icons/fi';
import { VscMegaphone } from 'react-icons/vsc';
import ShareLinkCopy from '../share/ShareLinkCopy';
import ShareLinkEdit from '../share/ShareLinkEdit';
import Social from '../blocks/Social';
import AnimateHeight from 'react-animate-height';
import { signupPhase as phase } from './signupConfig';

const GBX3_URL = process.env.REACT_APP_ENV === 'local' ? process.env.REACT_APP_GBX_SHARE : process.env.REACT_APP_GBX_URL;

class SignupShare extends React.Component {

  constructor(props) {
    super(props);
    this.renderShareType = this.renderShareType.bind(this);
    this.renderShareList = this.renderShareList.bind(this);
    this.setShareTypeSelected = this.setShareTypeSelected.bind(this);
    this.getArticle = this.getArticle.bind(this);
    this.state = {
      shareTypeSelected: props.defaultSelected || 'copy',
      previewURL: null,
      previewLoading: false,
      previewShareOpen: props.previewShareOpen
    };
  }

  componentDidMount() {
    this.getArticle();
    const articleID = this.props.articleID;
    /*
    this.setState({ previewLoading: true }, () => {
      this.props.sendResource('gbxPreview', {
        id: [articleID],
        reload: true,
        isSending: false,
        callback: (res, err) => {
          const previewURL = util.getValue(res, 'imageURL');
          this.setState({ previewURL, previewLoading: false })
        }
      });
    });
    */
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }

  getArticle() {
    if (this.props.articleID) {
      this.props.getResource('article', {
        customName: 'createdArticle',
        id: [this.props.articleID],
        reload: true
      });
    }
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

    const {
      isArticleForm,
      signupPhase,
      allowToggle,
      hidePreview
    } = this.props;

    const {
      previewURL,
      previewLoading,
      previewShareOpen
    } = this.state;

    if (util.isLoading(this.props.article)) return <Loader msg='Loading Share...' />

    const shareUrl = `${GBX3_URL}/${this.props.articleID}`;

    return (
      <div className='signupShareWrapper flexCenter flexColumn'>
        <GBLink 
          style={{ marginTop: 20, marginBottom: 20 }} 
          onClick={() => this.setState({ previewShareOpen: previewShareOpen && allowToggle ? false : true })}
        >
          {previewShareOpen ?
            previewLoading ?
              <span>Generating preview we appreciate your patience while it loads...</span>
            :
              <span>You might as well share your fundraiser and get your first donation!</span>
          :
            <span>Click Here to Preview Your Fundraiser</span>
          }
        </GBLink>
        <AnimateHeight height={previewShareOpen ? 'auto' : 0 }>
          <div className='flexCenter flexColumn'>
            <div className='createStep'>
              <div style={{ paddingTop: 0, ...this.props.style }} className={`modalWrapper`}>
                {this.renderShareList()}
                {this.renderShareType()}
                { !hidePreview ?
                <div 
                  className='previewWrapper' 
                  style={{ 
                    textAlign: 'center',
                    height: 250,
                    width: 500
                }}>
                  <div style={{ left: '-20px' }} className={`previewMenu ${!previewLoading ? 'previewLoaded' : '' }`}>
                    <GBLink 
                      onClick={() => {
                        if (isArticleForm) {
                          window.location.href = `${shareUrl}?public`;
                        } else {
                          window.open(shareUrl);
                        }
                      }}>
                      <span className='avatarLink editGraphic'>
                        <span className='icon icon-eye'></span>
                      </span>
                      View Public Page
                    </GBLink>
                  </div>
                  <IframeScaled
                    src={`${shareUrl}?preview`}
                    alt='Preview'
                    shieldOnClick={() => {
                      if (isArticleForm) {
                        window.location.href = `${shareUrl}?public`;
                      } else {
                        window.open(shareUrl);
                      }
                    }}
                  />
                  {/*
                  <div className='previewImageOverlay'>
                    <Image url={previewURL} alt='Preview' maxSize='250px' />
                  </div>
                  */}
                  <div style={{ right: '20px' }} className={`previewMenu ${!previewLoading ? 'previewLoaded' : '' }`}>
                    <GBLink 
                      onClick={() => {
                        if (isArticleForm) {
                          const modalName = this.props.modalName || util.getValue(phase, `${signupPhase}.modalName`);
                          if (modalName) this.props.toggleModal(modalName, false);
                        } else {
                          window.open(`${shareUrl}?admin&hideSteps=true`);
                        }
                      }}>
                      <span className='avatarLink editGraphic'>
                        <span className='icon icon-edit'></span>
                      </span>
                      Edit Form
                    </GBLink>
                  </div>
                </div>
                : null }
              </div>
            </div>
          </div>
        </AnimateHeight>
      </div>
    )
  }
}

SignupShare.defaultProps = {
  hideList: [],
  showHelper: true,
  previewShareOpen: false,
  hidePreview: false,
  allowToggle: true,
  style: {},
  modalName: null
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const info = util.getValue(gbx3, 'info', {});
  const display = util.getValue(info, 'display');
  const isArticleForm = display === 'article' ? true : false;
  const kind = 'fundraiser';
  const articleID = props.articleID || util.getValue(gbx3, 'orgSignup.createdArticleID');
  const signupPhase = util.getValue(gbx3, 'orgSignup.signupPhase');
  const article = util.getValue(state, 'resource.createdArticle', {});
  const kindID = util.getValue(article, 'data.kindID');
  const orgID = util.getValue(article, 'data.orgID');
  const slug = util.getValue(article, 'data.slug');
  const hasCustomSlug = util.getValue(article, 'data.hasCustomSlug');
  const hasAccessToEdit = util.getValue(gbx3, 'admin.hasAccessToEdit');
  const apiName = `org${types.kind(kind).api.item}`;

  return {
    isArticleForm,
    kind,
    kindID,
    articleID,
    signupPhase,
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
  sendResource,
  toggleModal
})(SignupShare);
