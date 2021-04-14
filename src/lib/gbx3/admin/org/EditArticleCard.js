import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import Collapse from '../../../common/Collapse';
import Loader from '../../../common/Loader';
import GBLink from '../../../common/GBLink';
import Tabs, { Tab } from '../../../common/Tabs';
import Video from '../../../common/Video';
import Form from '../../../form/Form';
import TextField from '../../../form/TextField';
import Choice from '../../../form/Choice';
import MediaLibrary from '../../../form/MediaLibrary';
import * as _v from '../../../form/formValidate';
import {
  toggleModal,
  removeResource
} from '../../../api/actions';
import {
  getResource,
  sendResource
} from '../../../api/helpers';
import {
  saveCustomTemplate
} from '../../redux/gbx3actions';
import AnimateHeight from 'react-animate-height';

class EditArticleCardForm extends React.Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.renderVideo = this.renderVideo.bind(this);
    this.videoOnReady = this.videoOnReady.bind(this);
    const article = util.getValue(props.article, 'data', {});
    const page = props.page;
    const articleCard = util.getValue(article, 'giveboxSettings.customTemplate.articleCard', {});

    const imageURL = util.getValue(articleCard, 'imageURL', util.checkImage(util.getValue(article, 'imageURL')));
    const videoURL = util.getValue(articleCard, 'videoURL', util.getValue(article, 'videoURL'));
    const hideViewCount = util.getValue(articleCard, 'hideViewCount', false);

    this.state = {
      hideViewCount,
      imageURL,
      videoURL,
      videoURLFieldValue: videoURL,
      mediaType: util.getValue(articleCard, 'mediaType', 'image'),
      videoLoading: false,
      video: {
        validated: _v.validateURL(videoURL) ? true : false,
        error: false
      },
      updateMainTitle: false
    };
  }

  componentDidMount() {
    this.videoLoading();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.videoURL !== this.state.videoURL && this.state.video.validated && this.state.mediaType === 'video') {
      this.videoLoading();
    }
  }

  handleSaveCallback(url) {
    this.setState({
      imageURL: url
    })
  }

  formSavedCallback() {
    if (this.props.callback) {
      this.props.callback(arguments[0]);
    }
  }

  processCallback(res, err) {
    if (!err) {
      this.props.reloadGetArticles();
      this.props.formSaved(this.formSavedCallback);
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  async processForm(fields) {
    const {
      ID,
      orgID,
      page,
      pageSlug,
      resourceName,
      resourcesToLoad
    } = this.props;

    const {
      imageURL,
      videoURL,
      mediaType,
      hideViewCount
    } = this.state;

    util.toTop('modalOverlay-orgEditCard');

    const data = {
      imageURL,
      videoURL,
      mediaType,
      hideViewCount
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });

    this.props.saveCustomTemplate(resourceName, {
      ID,
      orgID,
      customTemplate: {
        articleCard: {
          ...data
        }
      },
      isSending: true,
      showSaving: false,
      callback: this.processCallback.bind(this)
    });
  }

  callbackAfter(tab) {
    this.setState({ mediaType: tab });
    this.videoLoading();
  }

  videoOnReady() {
    this.setState({ videoLoading: false });
  }

  videoLoading() {
    const {
      video,
      videoURL,
      mediaType
    } = this.state;

    if (mediaType === 'video' && videoURL && video.validated) {
      this.setState({ videoLoading: true });
    }
  }

  onChangeVideo(e) {
    const URL = e.currentTarget.value;
    const videoURLFieldValue = URL;
    const video = this.state.video;
    video.validated = _v.validateURL(URL) ? true : false;
    const videoURL = video.validated ? URL : '';
    if (video.error) video.error = false;
    this.setState({ video, videoURL, videoURLFieldValue });
  }

  renderVideo(preview = false) {
    const {
      video,
      videoURL,
      videoLoading
    } = this.state;

    if (video.validated) {
      return (
        <div className='videoContainer'>
          { videoLoading ?
          <div className='imageLoader'>
            <img src='https://cdn.givebox.com/givebox/public/images/spinner-loader.svg' alt='Loader' />
          </div> : null }
          <Video
            playing={false}
            url={videoURL}
            onReady={this.videoOnReady}
            style={{
              maxWidth: '100%',
              maxHeight: 'auto'
            }}
            maxHeight={'auto'}
            preview={true}
          />
        </div>
      )
    } else {
      return (
        <div className='mediaPlaceholder'>
          <span className='icon icon-video'></span>
          No Preview Available
        </div>
      )
    }
  }

  render() {

    const {
      page,
      tabToDisplay,
      orgID,
      breakpoint
    } = this.props;

    const {
      imageURL,
      videoURL,
      videoURLFieldValue,
      video,
      mediaType,
      hideViewCount
    } = this.state;

    const article = util.getValue(this.props.article, 'data', {});
    const articleID = util.getValue(article, 'articleID');
    const articleCard = util.getValue(article, 'giveboxSettings.customTemplate.articleCard', {});
    const title = util.getValue(articleCard, 'title', article.title);

    const library = {
      saveMediaType: 'org',
      articleID,
      orgID,
      borderRadius: 0
    };

    const buttonGroup =
      <div className='button-group flexCenter'>
        <GBLink className='link secondary' onClick={() => this.props.toggleModal('orgEditCard', false)}>Cancel</GBLink>
        {this.props.saveButton(this.processForm, { style: { width: 150 } })}
      </div>
    ;

    return (
      <div className='editPageWrapper'>
        <h2 className='flexCenter'>
          {title}
        </h2>
        {buttonGroup}
        <Collapse
          iconPrimary={'edit'}
          label={'Card Info'}
          id='editCardInfo'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              {this.props.textField('title', { fixedLabel: true, label: 'Card Title', placeholder: 'Enter Card Title', value: title })}
              <Choice
                type='checkbox'
                name='hideViewCount'
                label={'Hide View Count'}
                onChange={(name, value) => {
                  this.setState({ hideViewCount: hideViewCount ? false : true });
                }}
                checked={hideViewCount}
                value={hideViewCount}
                toggle={true}
              />
            </div>
          </div>
        </Collapse>
        <Collapse
          iconPrimary={'camera'}
          label={'Card Media'}
          id='editCardMedia'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <Tabs
                default={mediaType}
                className='statsTab'
                callbackAfter={this.callbackAfter}
              >
                <Tab id='image' className='showOnMobile' label={<span className='stepLabel'><span className='icon icon-image'></span> Image</span>}>
                  <MediaLibrary
                    blockType={'article'}
                    image={imageURL}
                    preview={imageURL}
                    handleSaveCallback={(url) => this.handleSaveCallback(url)}
                    handleSave={util.handleFile}
                    library={library}
                    showBtns={'hide'}
                    saveLabel={'close'}
                    mobile={breakpoint === 'mobile' ? true : false }
                    uploadOnly={false}
                    uploadEditorSaveStyle={{ width: 250 }}
                    uploadEditorSaveLabel={'Click Here to Save Image'}
                    imageEditorOpenCallback={(editorOpen) => {
                      this.setState({ editorOpen })
                    }}
                  />
                </Tab>
                <Tab id='video' className='showOnMobile' label={<span className='stepLabel'><span className='icon icon-video'></span>Video Preview</span>}>
                  <TextField
                    name='video'
                    label='Embed Video URL'
                    fixedLabel={true}
                    placeholder='Enter Embed Video URL'
                    onChange={this.onChangeVideo}
                    value={videoURLFieldValue}
                  />
                  <div className='fieldContext'>
                    We recommend embedding a video that is no longer than 10 seconds. The video will autoplay when the user hovers the card.
                  </div>
                  <AnimateHeight
                    duration={200}
                    height={video.validated && videoURL ? 'auto' : 0}
                  >
                    <div className='input-group'>
                      <label className='label'>Video Preview</label>
                      <div style={{ marginTop: 10 }} className='flexCenter'>
                        {mediaType === 'video' ? this.renderVideo() : <></>}
                      </div>
                    </div>
                  </AnimateHeight>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Collapse>
        {buttonGroup}
      </div>
    )
  }
}

class EditArticleCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.getArticle();
  }

  componentWillUnmount() {
    const {
      resourceName
    } = this.props;
    this.props.removeResource(resourceName);
  }

  getArticle() {
    const {
      orgID,
      ID,
      resourceName
    } = this.props;

    this.props.getResource(resourceName, {
      orgID,
      id: [ID],
      reload: true
    })
  }

  render() {

    if (util.isLoading(this.props.article)) return <Loader msg='Loading Article...' />

    return (
      <div className='modalWrapper'>
        <Form
          name='orgEditArticleCard'
          id='orgEditArticleCard'
          neverSubmitOnEnter={false}
          options={{
            required: false
          }}
        >
          <EditArticleCardForm
            {...this.props}
          />
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const {
    item,
    page
  } = props;

  const kind = util.getValue(item, 'kind');
  const articleID = util.getValue(item, 'articleID');
  const resourceName = `org${types.kind(kind).api.item}`;
  const article = util.getValue(state, `resource.${resourceName}`, {});

  return {
    articleID,
    kind,
    page,
    resourceName,
    article,
    ID: util.getValue(item, 'kindID'),
    orgID: util.getValue(state, 'gbx3.info.orgID'),
    breakpoint: util.getValue(state, 'gbx3.info.breakpoint')
  }
}

export default connect(mapStateToProps, {
  getResource,
  sendResource,
  saveCustomTemplate,
  toggleModal,
  removeResource
})(EditArticleCard);
