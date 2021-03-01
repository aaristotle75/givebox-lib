import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import Collapse from '../../../common/Collapse';
import Loader from '../../../common/Loader';
import GBLink from '../../../common/GBLink';
import Tabs, { Tab } from '../../../common/Tabs';
import Form from '../../../form/Form';
import MediaLibrary from '../../../form/MediaLibrary';
import {
  getResource,
  sendResource
} from '../../../api/helpers';
import {
  saveCustomTemplate
} from '../../redux/gbx3actions';

class EditArticleCardForm extends React.Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    const article = util.getValue(props.article, 'data', {});
    const page = props.page;
    const articleCard = util.getValue(article, 'giveboxSettings.customTemplate.articleCard', {});

    const {
      imageURL,
      videoURL
    } = article;

    this.state = {
      imageURL: util.getValue(articleCard, 'imageURL', util.checkImage(imageURL)),
      videoURL: util.getValue(articleCard, 'videoURL', videoURL)
    };
  }

  componentDidMount() {
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
      videoURL
    } = this.state;

    util.toTop('modalOverlay-orgEditCard');

    const data = {
      imageURL,
      videoURL
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });

    this.props.saveCustomTemplate(resourceName, {
      ID,
      orgID,
      data: {
        articleCard: {
          ...data
        }
      },
      isSending: true,
      showSaving: false,
      callback: this.processCallback.bind(this)
    });
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
      videoURL
    } = this.state;

    const article = util.getValue(this.props.article, 'data', {});
    const articleID = util.getValue(article, 'articleID');
    const articleCard = util.getValue(article, 'giveboxSettings.customTemplate.articleCard', {});
    const title = util.getValue(articleCard, 'title', util.getValue(article, 'title'));

    console.log('execute -> ', title);

    const library = {
      saveMediaType: 'org',
      articleID,
      orgID,
      borderRadius: 0
    };

    const buttonGroup =
      <div className='button-group flexCenter'>
        <GBLink className='link secondary' onClick={() => this.props.toggleModal('orgEditArticleCard', false)}>Cancel</GBLink>
        {this.props.saveButton(this.processForm, { style: { width: 150 } })}
      </div>
    ;

    return (
      <div className='editPageWrapper'>
        <h2 className='flexCenter'>Edit {title}</h2>
        {buttonGroup}
        <Collapse
          iconPrimary={'edit'}
          label={'Card Info'}
          id='editCardInfo'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              {this.props.textField('title', { fixedLabel: true, label: 'Card Title', placeholder: 'Enter Card Title', value: title })}
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
                default={tabToDisplay}
                className='statsTab'
              >
                <Tab id='cardImage' label={<span className='stepLabel'><span className='icon icon-image'></span> Image</span>}>
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
                <Tab id='cardVideo' label={<span className='stepLabel'><span className='icon icon-video'></span>Video</span>}>
                  Manage Video
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
    this.changeTab = this.changeTab.bind(this);
    this.state = {
      tabToDisplay: props.tabToDisplay
    };
  }

  componentDidMount() {
    this.getArticle();
  }

  changeTab(tabToDisplay) {
    this.setState({ tabToDisplay });
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
            changeTab={this.changeTab}
            tabToDisplay={this.state.tabToDisplay}
          />
        </Form>
      </div>
    )
  }
}

EditArticleCard.defaultProps = {
  tabToDisplay: 'cardImage'
};

function mapStateToProps(state, props) {

  const {
    item,
    page
  } = props;

  const kind = util.getValue(item, 'kind');
  const resourceName = `org${types.kind(kind).api.item}`;
  const article = util.getValue(state, `resource.${resourceName}`, {});

  return {
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
  saveCustomTemplate
})(EditArticleCard);
