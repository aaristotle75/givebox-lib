import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import TextField from '../../../form/TextField';
import GBLink from '../../../common/GBLink';
import Collapse from '../../../common/Collapse';
import Choice from '../../../form/Choice';
import {
  updateOrgGlobal,
  updateOrgPage,
  updateOrgPageSlug,
  saveOrg
} from '../../redux/gbx3actions';
import {
  toggleModal
} from '../../../api/actions';
import Form from '../../../form/Form';
import Editor from '../../blocks/Editor';

class EditPageForm extends React.Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      top: util.getValue(props.page, 'top'),
      bottom: util.getValue(props.page, 'bottom'),
      saveTopAsGlobal: props.saveTopAsGlobal,
      saveBottomAsGlobal: props.saveBottomAsGlobal
    };
  }

  componentDidMount() {
  }

  onBlur(content, section) {
    this.setState({ [section]: content });
  }

  onChange(content, section) {
    this.setState({ [section]: content, hasBeenUpdated: true });
  }

  formSavedCallback() {
    if (this.props.callback) {
      this.props.callback(arguments[0]);
    }
  }

  processCallback(res, err) {
    if (!err) {
      this.props.formSaved(this.formSavedCallback);
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  async processForm(fields) {
    const {
      page,
      pages,
      pageSlug,
      customSlug
    } = this.props;

    const {
      top,
      bottom,
      saveTopAsGlobal,
      saveBottomAsGlobal
    } = this.state;

    util.toTop('modalOverlay-orgEditPage');
    const data = {
      top,
      bottom
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });

    const itemsUpdated = [];
    let itemsToWait = 1;
    if (saveTopAsGlobal && saveBottomAsGlobal) {
      itemsToWait = 3;
    } else if (saveTopAsGlobal || saveBottomAsGlobal) {
      itemsToWait = 2;
    }

    if (customSlug !== data.customSlug) {
      itemsToWait = itemsToWait + 1;
      if (await this.props.updateOrgPageSlug(pageSlug, data.customSlug)) {
        itemsUpdated.push('customSlug');
      }
    }

    if (saveTopAsGlobal) {
      if (await this.props.updateOrgGlobal('pageContent', { top: pageSlug })) {
        itemsUpdated.push('topGlobal');
      }
    }

    if (saveBottomAsGlobal) {
      if (await this.props.updateOrgGlobal('pageContent', { bottom: pageSlug })) {
        itemsUpdated.push('bottomGlobal');
      }
    }

    if (await this.props.updateOrgPage(pageSlug, data)) {
      itemsUpdated.push('pageUpdated');
    }

    if (itemsUpdated.length === itemsToWait) {
      this.props.saveOrg({
        isSending: true,
        orgUpdated: true,
        showSaving: false,
        callback: this.processCallback.bind(this)
      });
    }
  }

  render() {

    const {
      pageSlug,
      customSlug,
      page,
      orgID,
      autoFocus
    } = this.props;

    const {
      top,
      bottom,
      saveTopAsGlobal,
      saveBottomAsGlobal
    } = this.state;

    const pageName = util.getValue(page, 'name');
    const navText = util.getValue(page, 'navText', pageName);
    const pageTitle = util.getValue(page, 'pageTitle', pageName);

    return (
      <div className='editPageWrapper'>
        <h2 className='flexCenter'>Edit {util.getValue(page, 'name')}</h2>
        <Collapse
          iconPrimary={'edit'}
          label={'Administrative'}
          id='editPageSystem'
          default='closed'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              {this.props.textField('customSlug', { fixedLabel: true, label: 'URL Value', placeholder: 'Enter URL Value', value: customSlug, style: { paddingBottom: 5 } })}
              <div style={{ marginBottom: 20 }} className='fieldContext'>The URL value is used as a query parameter to directly access a page. Example: Add ?page={customSlug} to the end of the url.</div>
              {this.props.textField('name', {  fixedLabel: true, label: 'Page Label', placeholder: 'Enter Page Label', value: pageName, style: { paddingBottom: 5 } })}
              <div className='fieldContext'>This label is used soley as an Administrator reference.</div>
            </div>
          </div>
        </Collapse>
        <Collapse
          iconPrimary={'edit'}
          label={'Display'}
          id='editPageGeneral'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              {this.props.textField('navText', {  fixedLabel: true, label: 'Navigation Text', placeholder: 'Enter Navigation Text', value: navText })}
              {this.props.textField('pageTitle', {  fixedLabel: true, label: 'Page Title', placeholder: 'Enter Page Title', value: pageTitle })}
            </div>
          </div>
        </Collapse>
        <Collapse
          iconPrimary={'edit'}
          label={'Page Header'}
          id='editPageTopEditor'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <Editor
                orgID={orgID}
                articleID={null}
                content={top}
                onBlur={(content) => this.onBlur(content, 'top')}
                onChange={(content) => this.onChange(content, 'top')}
                type={'classic'}
                subType={'content'}
                acceptedMimes={['image']}
                autoFocus={autoFocus === 'top' ? true : false}
              />
              <Choice
                type='checkbox'
                name='saveTopAsGlobal'
                label={'Make this the Global Page Header'}
                onChange={(name, value) => {
                  this.setState({ saveTopAsGlobal: saveTopAsGlobal ? false : true });
                }}
                checked={saveTopAsGlobal}
                value={saveTopAsGlobal}
                toggle={true}
              />
            </div>
          </div>
        </Collapse>
        <Collapse
          iconPrimary={'edit'}
          label={'Page Footer'}
          id='editPageBottomEditor'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <Editor
                orgID={orgID}
                articleID={null}
                content={bottom}
                onBlur={(content) => this.onBlur(content, 'bottom')}
                onChange={(content) => this.onChange(content, 'bottom')}
                type={'classic'}
                subType={'content'}
                acceptedMimes={['image']}
                autoFocus={autoFocus === 'bottom' ? true : false}
              />
              <Choice
                type='checkbox'
                name='saveBottomAsGlobal'
                label={'Make this the Global Page Footer'}
                onChange={(name, value) => {
                  this.setState({ saveBottomAsGlobal: saveBottomAsGlobal ? false : true });
                }}
                checked={saveBottomAsGlobal}
                value={saveBottomAsGlobal}
                toggle={true}
              />
            </div>
          </div>
        </Collapse>
        <div className='button-group flexCenter'>
          <GBLink className='link secondary' onClick={() => this.props.toggleModal('orgEditPage', false)}>Cancel</GBLink>
          {this.props.saveButton(this.processForm, { style: { width: 150 } })}
        </div>
      </div>
    )
  }
}

class EditPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  componentDidMount() {
  }

  render() {

    return (
      <div className='modalWrapper'>
        <Form
          name='orgEditPage'
          id='orgEditPage'
          options={{
            required: true
          }}
        >
          <EditPageForm
            {...this.props}
          />
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const pageSlug = props.pageSlug;
  const pages = util.getValue(state, 'gbx3.orgPages', {});
  const page = util.getValue(pages, props.pageSlug, {});
  const globalPageContent = util.getValue(state, 'gbx3.orgGlobals.pageContent', {});
  const customSlugs = util.getValue(state, 'gbx3.orgGlobals.customSlugs', []);
  const customSlugObj = customSlugs.find(s => s.slug === pageSlug);
  const customSlug = util.getValue(customSlugObj, 'customSlug', pageSlug);
  const saveTopAsGlobal = util.getValue(globalPageContent, 'top') === pageSlug ? true : false;
  const saveBottomAsGlobal = util.getValue(globalPageContent, 'bottom') === pageSlug ? true : false;

  return {
    pages,
    page,
    globalPageContent,
    customSlug,
    saveTopAsGlobal,
    saveBottomAsGlobal,
    orgID: util.getValue(state, 'gbx3.info.orgID')
  }
}

export default connect(mapStateToProps, {
  updateOrgGlobal,
  updateOrgPage,
  updateOrgPageSlug,
  toggleModal,
  saveOrg
})(EditPage);
