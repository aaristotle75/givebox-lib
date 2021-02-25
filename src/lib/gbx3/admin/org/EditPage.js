import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import TextField from '../../../form/TextField';
import GBLink from '../../../common/GBLink';
import Collapse from '../../../common/Collapse';
import {
  updateOrgPage,
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
      content: util.getValue(props.title, 'content')
    };
  }

  componentDidMount() {
  }

  onBlur(content) {
    this.setState({ content });
    if (this.props.onBlur) this.props.onBlur(this.props.name, content);
  }

  onChange(content) {
    this.setState({ content, hasBeenUpdated: true });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
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
      pageSlug
    } = this.props;

    util.toTop('modalOverlay-orgEditPage');
    const data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });

    const pageUpdated = await this.props.updateOrgPage(pageSlug, data);
    if (pageUpdated) {
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
      page,
      orgID
    } = this.props;

    const pageName = util.getValue(page, 'name');
    const navText = util.getValue(page, 'navText', pageName);
    const pageTitle = util.getValue(page, 'pageTitle', pageName);
    const content = this.state.content;

    return (
      <div className='editPageWrapper'>
        <h2 className='flexCenter'>Edit {util.getValue(page, 'name')}</h2>
        <Collapse
          iconPrimary={'edit'}
          label={'General'}
          id='editPageGeneral'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              {this.props.textField('name', {  fixedLabel: true, label: 'Page Label', placeholder: 'Enter Page Label', value: pageName })}
              {this.props.textField('navText', {  fixedLabel: true, label: 'Navigation Text', placeholder: 'Enter Navigation Text', value: navText })}
              {this.props.textField('pageTitle', {  fixedLabel: true, label: 'Page Title', placeholder: 'Enter Page Title', value: pageTitle })}
            </div>
          </div>
        </Collapse>
        <Collapse
          iconPrimary={'edit'}
          label={'Top Content (Above List)'}
          id='editPageEditor'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <Editor
                orgID={orgID}
                articleID={null}
                content={content}
                onBlur={this.onBlur}
                onChange={this.onChange}
                type={'classic'}
                subType={'content'}
                acceptedMimes={['image']}
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

  const pages = util.getValue(state, 'gbx3.orgPages', {});
  const page = util.getValue(pages, props.pageSlug, {});

  return {
    pages,
    page,
    orgID: util.getValue(state, 'gbx3.info.orgID')
  }
}

export default connect(mapStateToProps, {
  updateOrgPage,
  toggleModal,
  saveOrg
})(EditPage);
