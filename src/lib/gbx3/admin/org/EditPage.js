import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import TextField from '../../../form/TextField';
import GBLink from '../../../common/GBLink';
import Collapse from '../../../common/Collapse';
import Choice from '../../../form/Choice';
import Tabs, { Tab } from '../../../common/Tabs';
import EditCustomList from './EditCustomList';
import {
  updateOrgGlobal,
  updateOrgPage,
  updateOrgPageSlug,
  saveOrg,
  setPageState
} from '../../redux/gbx3actions';
import {
  toggleModal
} from '../../../api/actions';
import {
  sendResource,
  reloadResource
} from '../../../api/helpers';
import Form from '../../../form/Form';
import Editor from '../../blocks/Editor';
import AnimateHeight from 'react-animate-height';

class EditPageForm extends React.Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.processCallback = this.processCallback.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateCustomList = this.updateCustomList.bind(this);
    this.updateOrderby = this.updateOrderby.bind(this);
    this.state = {
      top: util.getValue(props.page, 'top'),
      bottom: util.getValue(props.page, 'bottom'),
      saveTopAsGlobal: props.saveTopAsGlobal,
      saveBottomAsGlobal: props.saveBottomAsGlobal,
      hideList: util.getValue(props.page, 'hideList', false),
      useCustomList: util.getValue(props.page, 'useCustomList', false),
      customList: [ ...util.getValue(props.page, 'customList', []) ],
      wasSorted: false
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  updateCustomList(ID, list = [], wasSorted = false) {
    const customList = !util.isEmpty(list) ? [ ...list ] : [ ...this.state.customList ];
    if (ID) {
      if (customList.includes(ID)) customList.splice(customList.findIndex(l => l === ID), 1);
      else customList.unshift(ID);
    }
    this.setState({ customList, wasSorted });
    //this.props.updateOrgPage(pageSlug, { customList });
  }

  onBlur(content, section) {
    this.setState({ [section]: content });
  }

  onChange(content, section) {
    this.setState({ [section]: content, hasBeenUpdated: true });
  }

  updateOrderby() {
    const {
      orgID,
      resourceName,
      pageSlug
    } = this.props;

    const {
      customList
    } = this.state;

    const data = [];
    customList.forEach((articleID, orderBy) => {
      data.push(
        { articleID, orderBy }
      );
    });

    this.props.sendResource('orgArticlesOrder', {
      orgID,
      data,
      method: 'patch',
      callback: async (res, err) => {
        this.props.reloadGetArticles();
      }
    })
  }

  formSavedCallback() {
    if (this.props.callback) {
      this.props.callback(arguments[0]);
    }
  }

  processCallback(res, err) {

    const {
      wasSorted
    } = this.state;

    if (!err) {
      if (wasSorted) this.updateOrderby();
      else this.props.reloadGetArticles();
      this.props.formSaved(this.formSavedCallback);
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  async processForm(fields) {
    const {
      orgID,
      page,
      pages,
      pageSlug,
      customSlug
    } = this.props;

    const {
      top,
      bottom,
      saveTopAsGlobal,
      saveBottomAsGlobal,
      hideList,
      useCustomList,
      customList
    } = this.state;

    util.toTop('modalOverlay-orgEditPage');
    const data = {
      top,
      bottom,
      hideList,
      useCustomList,
      customList
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
        orgID,
        isSending: true,
        orgUpdated: true,
        showSaving: false,
        callback: (res, err) => {
          this.processCallback(res, err);
        }
      });
    }
  }

  render() {

    const {
      pageSlug,
      customSlug,
      page,
      orgID,
      autoFocus,
      tabToDisplay
    } = this.props;

    const {
      top,
      bottom,
      saveTopAsGlobal,
      saveBottomAsGlobal,
      useCustomList,
      hideList
    } = this.state;

    const pageName = util.getValue(page, 'name');
    const pageTitle = util.getValue(page, 'pageTitle', pageName);
    const kind = util.getValue(page, 'kind');

    const buttonGroup =
      <div className='button-group flexCenter'>
        <GBLink className='link secondary' onClick={() => this.props.toggleModal('orgEditPage', false)}>Cancel</GBLink>
        {this.props.saveButton(this.processForm, { style: { width: 150 } })}
      </div>
    ;

    return (
      <div className='editPageWrapper'>
        <h2 className='flexCenter'>Edit {util.getValue(page, 'name')}</h2>
        {buttonGroup}
        <Tabs
          default={tabToDisplay}
          className='statsTab'
        >
          <Tab id='editPage' label={<span className='stepLabel'>Page Content</span>}>
            <Collapse
              iconPrimary={'edit'}
              label={'Page Name'}
              id='editPageGeneral'
            >
              <div className='formSectionContainer'>
                <div className='formSection'>
                  {this.props.textField('name', { fixedLabel: false, label: '', placeholder: 'Add Page Name', value: pageName })}

                  {/* this.props.textField('pageTitle', { fixedLabel: true, label: 'Page Title', placeholder: 'Enter Page Title', value: pageTitle }) */}
                </div>
              </div>
            </Collapse>
            <Collapse
              iconPrimary={'edit'}
              label={'Add Header'}
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
              label={'Add Footer'}
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
            <Collapse
              iconPrimary={'sliders'}
              label={'Settings'}
              id='editPageSystem'
              default='closed'
            >
              <div className='formSectionContainer'>
                <div className='formSection'>
                  {this.props.textField('customSlug', {
                    fixedLabel: true,
                    label: 'Customize Page URL',
                    placeholder: 'Add Custom URL Name',
                    value: customSlug,
                    style: { paddingBottom: 5 },
                    validate: 'custom',
                    validateOpts: {
                      custom: (key, value, parent) => {
                        let validate = true;
                        const match = /^[a-zA-Z0-9!@#%*_+-]*$/
                        if (!match.exec(value)) validate = false;
                        const existingSlug = this.props.customSlugs.find(s => s.customSlug === value);
                        if (util.getValue(existingSlug, 'slug') && (util.getValue(existingSlug, 'slug') !== pageSlug)) {
                          validate = false;
                        }
                        return validate;
                      },
                      errorMsg: 'URL name can only contain alphanumeric and !@#%*_+- characters AND/OR a duplicate slug already exists.'
                    }
                  })}
                  {/*
                  <div style={{ marginBottom: 20 }} className='fieldContext'>The URL value is used as a query parameter to directly access a page. Example: Add ?page={customSlug} to the end of the url.</div>
                  */}
                </div>
              </div>
            </Collapse>
          </Tab>
          <Tab id='editList' label={<span className='stepLabel'>Page Form List</span>}>
            <Collapse
              iconPrimary={'list'}
              label={'Page List'}
              id='editPageList'
            >
              <div className='formSectionContainer'>
                <div className='formSection' style={{ paddingBottom: useCustomList ? 20 : 150 }}>
                  <Choice
                    type='checkbox'
                    name='hideList'
                    label={'Hide Page List from Displaying'}
                    onChange={(name, value) => {
                      this.setState({ hideList: hideList ? false : true });
                    }}
                    checked={hideList}
                    value={hideList}
                    toggle={true}
                  />
                  <AnimateHeight height={!hideList ? 'auto' : 0}>
                    <Choice
                      type='checkbox'
                      name='useCustomList'
                      label={'Use a Custom List'}
                      onChange={(name, value) => {
                        this.setState({ useCustomList: useCustomList ? false : true });
                      }}
                      checked={useCustomList}
                      value={useCustomList}
                      toggle={true}
                    />
                    <div className='fieldContext'>The Custom List will replace the List Type ( {types.kind(kind, 'All Types').namePlural} ) selected below.</div>
                    <AnimateHeight height={useCustomList ? 'auto' : 0}>
                      <EditCustomList
                        updateCustomList={this.updateCustomList}
                        customList={this.state.customList}
                        pageSlug={pageSlug}
                      />
                    </AnimateHeight>
                    <AnimateHeight height={!useCustomList ? 'auto' : 0}>
                      <div className='orgPageCustomList'>
                        <div className='articleGroupTitle'>Page List Type</div>
                        {this.props.dropdown('kind', {label: 'List Type', options: types.kindOptions(true, 'All Types'), value: kind, style: { paddingTop: 40 } })}
                      </div>
                    </AnimateHeight>
                  </AnimateHeight>
                </div>
              </div>
            </Collapse>
          </Tab>
        </Tabs>
        {buttonGroup}
      </div>
    )
  }
}

class EditPage extends React.Component {

  constructor(props) {
    super(props);
    this.changeTab = this.changeTab.bind(this);
    this.state = {
      error: false,
      tabToDisplay: props.tabToDisplay
    };
  }

  componentDidMount() {
  }

  changeTab(tabToDisplay) {
    this.setState({ tabToDisplay });
  }

  render() {

    return (
      <div className='modalWrapper'>
        <Form
          name='orgEditPage'
          id='orgEditPage'
          neverSubmitOnEnter={true}
          options={{
            required: true
          }}
        >
          <EditPageForm
            {...this.props}
            changeTab={this.changeTab}
            tabToDisplay={this.state.tabToDisplay}
          />
        </Form>
      </div>
    )
  }
}

EditPage.defaultProps = {
  tabToDisplay: 'editPage'
};

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
    customSlugs,
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
  saveOrg,
  sendResource,
  reloadResource,
  setPageState
})(EditPage);
