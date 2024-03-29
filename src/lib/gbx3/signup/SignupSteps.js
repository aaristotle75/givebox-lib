/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import CreateAccount from './CreateAccount';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import TextField from '../../form/TextField';
import MediaLibrary from '../../form/MediaLibrary';
import { Alert } from '../../common/Alert';
import Video from '../../common/Video';
import EditVideo from '../admin/common/EditVideo';
import { createData } from '../admin/article/createTemplates';
import * as util from '../../common/utility';
import Tabs, { Tab } from '../../common/Tabs';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import Icon from '../../common/Icon';
import {
  setOrgStyle,
  loadOrg,
  createFundraiser,
  updateOrgGlobals,
  savingSignup,
  signupGBX3Data,
  getGBX3SaveData,
  checkSignupPhase
} from '../redux/gbx3actions';
import {
  saveLegalEntity
} from '../redux/merchantActions';
import {
  setAccess
} from '../../api/actions';
import { PhotoshopPicker } from 'react-color-aaristotle';
import {
  primaryColor as defaultPrimaryColor,
  defaultOrgGlobals
} from '../redux/gbx3defaults';
import { MdCheckCircle } from 'react-icons/md';
import SignupShare from './SignupShare';
import SignupStepsHelp from './SignupStepsHelp';

const defaultReceiptTemplate = require('html-loader!../admin/receipt/receiptEmailDefaultContent.html');
const GBX3_URL = process.env.REACT_APP_ENV === 'local' ? process.env.REACT_APP_GBX_URL : process.env.REACT_APP_GBX_URL;

const ENTRY_URL = process.env.REACT_APP_ENTRY_URL;

class SignupStepsForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderStep = this.renderStep.bind(this);
    this.processForm = this.processForm.bind(this);
    this.createOrg = this.createOrg.bind(this);
    this.createOrgCallback = this.createOrgCallback.bind(this);
    this.saveLead = this.saveLead.bind(this);
    this.determineCreateAccount = this.determineCreateAccount.bind(this);
    this.checkRequiredCompleted = this.checkRequiredCompleted.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.handlePostSignupSave = this.handlePostSignupSave.bind(this);
    this.checkExistingUser = this.checkExistingUser.bind(this);
    this.setRequirePassword = this.setRequirePassword.bind(this);
    this.validateTaxID = this.validateTaxID.bind(this);
    this.handleMediaSaveCallback = this.handleMediaSaveCallback.bind(this);
    this.gbx3message = this.gbx3message.bind(this);
    this.finishedSteps = this.finishedSteps.bind(this);

    this.state = {
      themeColor: util.getValue(props.fields, 'org.themeColor', defaultPrimaryColor),
      editorOpen: false,
      error: false,
      categoryIDError: false,
      saving: false,
      mediaType: util.getValue(props.fields, 'gbx3.mediaType', 'image'),
      mediaTypeError: null,
      requirePassword: false,
      editPreview: false,
      iframeHeight: 0
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.gbx3message, false);
    new Image().src = 'https://cdn.givebox.com/givebox/public/images/step-loader.png';
  }

  componentDidUpdate(prevProps) {
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }

  gbx3message(e) {
    const {
      step
    } = this.props;

    const str = e.data.toString();
    const strArr = str.split('-');
    if (strArr[0] === 'gbx3Height') {
      if (strArr[1]) {
        const iframeHeight = +strArr[1] + 50;
        this.setState({ iframeHeight });
      }
    }
  }

  setRequirePassword(requirePassword) {
    if (requirePassword) {
      this.props.fieldProp('password', { required: true  });
    } else {
      this.props.fieldProp('password', { required: false, error: '', value: '' });
    }
    this.setState({ requirePassword });
  }

  categories() {
    const categories = util.getValue(this.props.categories, 'data', []);

    const items = [];
    Object.entries(categories).forEach(([key, value]) => {
      items.push({
        primaryText: value.name,
        value: value.ID
      });
    });
    return items;
  }

  /*
  * If required steps are not completed save the user as a lead
  */
  saveLead() {
    const {
      owner
    } = this.props.fields;

    const data = {
      ...owner,
      password: null,
      scope: 'cloud',
      role: 'admin'
    };

    this.props.sendResource('users', {
      data,
      method: 'post',
      isSending: false
    });
    this.setState({ saving: false });
  }

  async createOrgCallback(res, err, orgData = {}) {

    const {
      modal
    } = this.props;
          
    if (!err) {

      const name = util.getValue(res, 'name', null);
      const taxID = util.getValue(res, 'taxID', null);
      const orgID = util.getValue(res, 'ID', null);

      // Authenticate and open Org profile page with next Steps Preview, Share
      // This also sets session access, loads the org, and creates the fundraiser...
      this.props.getResource('session', {
        reload: true,
        callback: (res, err) => {
          if (err) {
            console.error('No session created');
            this.setState({ saving: false });
          } else {
            this.props.setAccess(res, async (access) => {
 
              const completedStep = await this.props.stepCompleted('account', false);
              const stepUpdated = await this.props.updateOrgSignup({
                  saveCookie: false,
                  signupPhase: 'postSignup'
                },
                'signup'
              );
              if (stepUpdated && completedStep) {

                this.props.savingSignup(true, () => {

                  const gbx3Data = this.props.signupGBX3Data();

                  this.props.createFundraiser('fundraiser', async (res, err) => {
                    const fundraiserID = util.getValue(res, 'ID');
                    const createdArticleID = util.getValue(res, 'articleID');

                    const {
                      fields
                    } = this.props;

                    const {
                      org,
                      gbx3
                    } = fields;

                    const tokens = {
                      '<<color>>': util.getValue(org, 'themeColor'),
                      '{{link}}': `${GBX3_URL}/${createdArticleID}`,
                      '{{orgname}}': util.getValue(org, 'name'),
                      '{{orgimage}}': util.getValue(org, 'imageURL'),
                      '{{articletitle}}': util.getValue(gbx3, 'title'),
                      '{{articleimage}}': util.getValue(gbx3, 'imageURL'),
                      '{{message}}': ''
                    };

                    const receiptHTML = util.replaceAll(defaultReceiptTemplate, tokens);
                    this.props.sendResource(`orgFundraiser`, {
                      orgID,
                      id: [fundraiserID],
                      isSending: false,
                      method: 'patch',
                      data: {
                        receiptHTML
                      }
                    });

                    const updated = await this.props.updateOrgSignup({
                      createdArticleID,
                      step: 5
                    });
                    if (updated) {
                      this.props.saveOrg({
                        orgID,
                        data: orgData,
                        orgUpdated: true,
                        callback: async (res, err) => {
                          this.props.saveLegalEntity({
                            isSending: false,
                            hasBeenUpdated: true,
                            data: {
                              name,
                              taxID
                            }
                          });
                          localStorage.removeItem('signup');
                          if (modal || 1===1) {
                            window.parent.location.replace(`${GBX3_URL}/${createdArticleID}`);
                          } else {
                            this.props.loadGBX3(createdArticleID, () => {
                              this.props.savingSignup(false);
                            });
                          }
                        }
                      });
                    }
                  }, null, {
                    showNewArticle: false,
                    data: gbx3Data
                  });
                });
              }
            })
          }
        }
      });
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
      this.setState({ saving: false });
    }
  }

  async createOrg() {
    const {
      validTaxID,
      affiliateID,
      claimOrgID,
      fields
    } = this.props;

    const {
      org,
      gbx3
    } = fields;

    const password = util.getValue(this.props.formState, 'fields.password.value', util.randomPassword(8));

    const owner = {
      affiliateID,
      ...fields.owner,
      password,
      orgTaxID: validTaxID
    };

    const primaryColor = org.themeColor || defaultPrimaryColor;

    const orgGlobals = {
      ...defaultOrgGlobals,
      globalStyles: {
        ...defaultOrgGlobals.globalStyles,
        backgroundColor: primaryColor,
        primaryColor: primaryColor
      },
      pagesEnabled: [
        'featured'
      ],
      profilePicture: {
        url: org.imageURL
      },
      coverPhoto: {
        url: org.coverPhotoURL
      },
      title: {
        content: `
          <p style="text-align:center;">
            <span style="font-weight:400;font-size:22px;">
              ${org.name}
            </span>
          </p>
        `
      }
    };

    const globalsUpdated = await this.props.updateOrgGlobals(orgGlobals);

    if (globalsUpdated) {
      const orgData = {
        ...org,
        affiliateID,
        owner,
        kind: '501c3',
        mission: org.mission,
        description: org.mission,
        isVerified: true,
        sendVerification: false,
        notifyOwner: true,
        scope: 'cloud',
        inapp: {
          packageLabel: 'unlimited-legacy'
        }
      };

      // If has claimOrgID then claim org, otherwise create a new org
      if (claimOrgID) {
        orgData.owner.password = null;
        this.props.sendResource('claimOrg', {
          id: [claimOrgID],
          method: 'post',
          data: {
            ...owner
          },
          callback: (res, err) => {
            this.createOrgCallback(res, err, orgData);
          }
        });
      } else {
        this.props.sendResource('orgs', {
          method: 'post',
          data: orgData,
          callback: this.createOrgCallback
        });
      }
    }
  }

  checkRequiredCompleted() {
    const {
      fields,
      completed,
      stepsTodo,
      requiredSteps
    } = this.props;

    const {
      org,
      gbx3,
      owner
    } = fields;

    const stepsRequiredButNotComplete = [];

    // Check if required steps are completed
    requiredSteps.forEach((value, key) => {
      if (!completed.includes(value.slug)) {
        const step = stepsTodo.findIndex(s => s.slug === value.slug);
        const stepNumber = +step + 1;
        stepsRequiredButNotComplete.push(
          <GBLink
            key={key}
            onClick={() => {
              this.props.formProp({ error: false });
              this.props.updateOrgSignup({ step });
            }}
          >
            Click Here for Step {stepNumber}: {value.name}
          </GBLink>
        )
      }
    });

    if (!util.isEmpty(stepsRequiredButNotComplete)) {
      this.props.formProp({ error: true, errorMsg:
        <div className='stepsNotCompletedButRequired'>
          <span>Please complete the following steps to continue:</span>
          <div className='stepsNotCompletedList'>
            {stepsRequiredButNotComplete}
          </div>
        </div>
      });
      return false;
    }
    return true;
  }

  determineCreateAccount(email, password) {

    if (this.checkRequiredCompleted()) {
      if (!password) {
        this.checkExistingUser(email);
      } else {
        this.createOrg();
      }
    } else {
      this.saveLead();
    }
  }

  async finishedSteps(modal) {
    this.setState({ saving: true });
    const completedStep = await this.props.stepCompleted('previewShare');
    if (completedStep) {
      setTimeout(async () => {
        const updated = await this.props.updateOrgSignup({
          signupPhase: 'connectBank',
          step: 0
        }, 'postSignup');
        if (updated) {
          //this.props.checkSignupPhase();
          this.props.saveOrg({
            orgUpdated: true,
            isSending: false,
            callback: () => {
              this.setState({ saving: false }, () => {
              });
            }
          });
          this.props.toggleModal('orgPostSignupSteps', false);
          if (modal === 'share') this.props.toggleModal('share', true);
          if (modal === 'connect') {
            this.props.checkSignupPhase({
              forceStep: 0,
              openAdmin: true,
              openModal: true
            });
          }     
        }
      }, 1000);
    } else {
      this.setState({ saving: false });
    }
  }

  async handlePostSignupSave(slug) {
    const {
      validTaxID,
      createdArticle,
      createdArticleID,
      hasCreatedArticle
    } = this.props;

    const {
      themeColor,
      mediaType
    } = this.state;

    const {
      org,
      owner,
      gbx3
    } = this.props.fields;

    const customTemplate = util.getValue(createdArticle, 'givebox.customTemplate', {});
    const tokens = {
      '<<color>>': util.getValue(org, 'themeColor'),
      '{{link}}': `${GBX3_URL}/${createdArticleID}`,
      '{{orgname}}': util.getValue(org, 'name'),
      '{{orgimage}}': util.getValue(org, 'imageURL'),
      '{{articletitle}}': util.getValue(gbx3, 'title'),
      '{{articleimage}}': util.getValue(gbx3, 'imageURL'),
      '{{message}}': ''
    };
    const receiptHTML = util.replaceAll(defaultReceiptTemplate, tokens);

    switch (slug) {
      case 'orgName': {
        const orgGlobals = {
          ...this.props.orgGlobals,
          title: {
            content: `
              <p style="text-align:center;">
                <span style="font-weight:400;font-size:22px;">
                  ${org.name}
                </span>
              </p>
            `
          }
        }
        const globalsUpdated = await this.props.updateOrgGlobals(orgGlobals);
        if (globalsUpdated) {
          this.props.saveOrg({
            data: {
              name: org.name || null,
              categoryID: org.categoryID || null,
              taxID: validTaxID || null
            }
          });
        }
        break;
      }

      case 'mission': {
        const orgGlobals = {
          ...this.props.orgGlobals,
          profilePicture: {
            url: org.imageURL
          }
        }
        const globalsUpdated = await this.props.updateOrgGlobals(orgGlobals);
        if (globalsUpdated) {
          this.props.saveOrg({
            orgUpdated: true,
            data: {
              mission: org.mission || null,
              imageURL: org.imageURL || null
            }
          });
        }
        break;
      }

      case 'title':
      case 'themeColor': {
        const orgGlobals = {
          ...this.props.orgGlobals,
          globalStyles: {
            ...util.getValue(this.props.orgGlobals, 'globalStyles', {}),
            backgroundColor: org.themeColor,
            primaryColor: org.themeColor
          }
        };
        const globalsUpdated = await this.props.updateOrgGlobals(orgGlobals);
        if (globalsUpdated) {
          this.props.saveOrg({
            orgUpdated: true
          });
        }
        const data = this.props.getGBX3SaveData({
          customTemplate
        });
        this.props.sendResource(`orgFundraiser`, {
          orgID: util.getValue(createdArticle, 'orgID'),
          id: [util.getValue(createdArticle, 'kindID')],
          isSending: false,
          method: 'patch',
          data
        });
        break;
      }

      // no default
    }
    this.setState({ saving: false }, this.props.gotoNextStep);
  }

  async saveStep(slug, delay = 1000, error = false) {

    const {
      signupPhase
    } = this.props;

    if (error) {
      this.setState({ saving: false });
      return false;
    }

    if (signupPhase === 'postSignup') {
      this.handlePostSignupSave(slug);
    } else {
      const completedStep = await this.props.stepCompleted(slug, false);

      if (completedStep) {
        setTimeout(() => {
          this.setState({ saving: false }, this.props.gotoNextStep);
        }, delay);
      } else {
        this.setState({ saving: false }, this.props.gotoNextStep);
      }
    }
  }

  async processForm(fields, callback, group) {
    this.setState({ saving: true });
    const {
      step,
      validTaxID,
      acceptedTerms,
      stepsTodo,
      signupPhase
    } = this.props;
    util.toTop(`modalOverlay-${signupPhase === 'postSignup' ? 'orgPostSignupSteps' : 'orgSignupSteps'}`);

    const {
      themeColor,
      mediaType
    } = this.state;

    const {
      org,
      owner,
      gbx3
    } = this.props.fields;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    switch (group) {
      case 'orgName': {
        if ((!validTaxID || validTaxID !== org.taxID) && org.categoryID) return this.validateTaxID(org.taxID, group);
        if (!org.categoryID) {
          this.props.formProp({ error: true, errorMsg: 'Please fix the errors below in red.' });
          return this.setState({ saving: false, categoryIDError: 'Organization Category is Required' });
        }
        return this.saveStep(group);
      }

      case 'mission': {
        if (!org.mission) {
          if (!org.mission) this.props.fieldProp('mission', { error: 'About Your Organization is Required' });
          this.props.formProp({ error: true, errorMsg: 'Please fix the errors below in red.' });
          this.setState({ saving: false });
        } else {
          this.saveStep(group);
        }
        break;
      }

      case 'themeColor': {
        if (themeColor) {
          const updated = await this.props.updateOrgSignupField('org', { themeColor });
          if (updated) {
            this.props.setOrgStyle({
              backgroundColor: themeColor
            });
            this.saveStep('themeColor');
          }
        }
        break;
      }

      case 'account': {
        if (signupPhase === 'postSignup') {
          this.props.gotoNextStep();
          return this.setState({ saving: false });
        } else {
          const password = util.getValue(fields, 'password.value');
          if (!acceptedTerms) {
            this.props.formProp({ error: true, errorMsg: 'You must agree to Givebox Terms of Service to continue.'});
            this.setState({ saving: false });
          } else {
            this.determineCreateAccount(owner.email, password);
          }
        }
        break;
      }

      case 'previewShare': {
        if (signupPhase === 'signup') {
          this.props.previousStep(step);
          return this.setState({ saving: false });
        } else {
          return this.finishedSteps();
        }
      }

      default: {
        this.saveStep(group);
        break;
      }
    }
  }

  checkExistingUser(email) {
    this.props.sendResource('userEmailCheck', {
      data: {
        email,
        scope: 'cloud'
      },
      reload: true,
      callback: (res, err) => {
        const hasPassword = util.getValue(res, 'hasPassword');
        const emailExists = util.getValue(res, 'emailExists');
        if (hasPassword && emailExists) {
          this.props.formProp({
            error: true,
            errorMsg:
              <div>
                The email you entered is already associated with a Givebox account.<br />
                Please enter your current password below.<br />
                Or use a different email to create a new account.
              </div>
          })
          this.setRequirePassword(true);
        } else {
          this.setRequirePassword(false);
          this.createOrg();
        }
      }
    })
    this.setState({ saving: false });
  }

  async validateTaxID(taxID, group) {
    this.validation = false;
    this.props.getResource('orgs', {
      customName: 'existingOrgs',
      search: {
        filter: `taxID:"${taxID}"`
      },
      reload: true,
      callback: (res, err) => {
        const data = util.getValue(res, 'data', []);
        if (!util.isEmpty(data)) {
          const existingOrg = util.getValue(data, 0, {});
          const isOwned = util.getValue(existingOrg, 'isOwned', false);
          const isAutoCreated = util.getValue(existingOrg, 'isAutoCreated', false);
          if (!isOwned && isAutoCreated) {
            this.props.updateOrgSignup({
              claimOrgID: existingOrg.ID,
              validTaxID: taxID
            });
            return this.saveStep(group);
          } else {
            this.props.formProp({ error: true, errorMsg: <div>The Tax ID you entered is taken by another user.<span style={{ marginTop: 5, display: 'block', fontSize: 12, fontStyle: 'italic' }}>To dispute this claim:<br/>Contact support@givebox.com with your Organization Name, Tax ID and explain your dispute.</span></div> });
            this.props.fieldProp('taxID', { error: 'This Tax ID is taken by another user.' });
            return this.saveStep(group, 0, true);
          }
        } else {
          this.props.updateOrgSignup({ validTaxID: taxID });
          return this.saveStep(group);
        }
      }
    });
  }

  async handleMediaSaveCallback(url, name, field, slug) {
    this.props.formProp({ error: false });
    const updated = await this.props.updateOrgSignupField(name, { [field]: url });
    if (updated) {
      //this.saveStep(slug, 2000);
      if (name === 'gbx3' && field === 'videoURL') {
        this.props.updateOrgSignupField('gbx3', { mediaType: url ? 'video' : 'image' });
      }
    }
  }

  renderStep() {
    const {
      mediaType,
      mediaTypeError,
      requirePassword,
      editPreview,
      iframeHeight
    } = this.state;

    const {
      step,
      open,
      isMobile,
      acceptedTerms,
      stepsTodo,
      createdArticleID,
      signupPhase,
      affiliateID
    } = this.props;

    const {
      org,
      owner,
      gbx3
    } = this.props.fields;

    const {
      name: orgName,
      taxID,
      categoryID,
      mission,
      imageURL: orgLogo,
      defaultTheme,
      themeColor
    } = org;

    const {
      title,
      imageURL,
      videoURL
    } = gbx3;

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');
    const stepNumber = +step + 1;
    const completed = this.props.completed.includes(slug) ? true : false;
    const firstStep = step === 0 ? true : false;
    const lastStep = step === this.props.steps ? true : false;
    const nextStepName = this.props.getNextStep();
    const nextStepNumber = this.props.nextStep(step) + 1;

    const item = {
      title: stepConfig.title,
      icon: stepConfig.icon,
      customIcon: stepConfig.customIcon,
      desc: stepConfig.desc,
      component: <div></div>,
      className: '',
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue</span>,
      customSaveButton: null,
      hidePrevious: false
    };

    const library = {
      saveMediaType: 'signup',
      borderRadius: 0
    };

    switch (slug) {

      case 'orgName': {
        item.desc = affiliateID ?
          <div className='center'>
            Thank you for using the promo link and welcome to Givebox! <br />Start a fundraiser and raise money in a few short steps.
          </div>
        : item.desc;

        item.component =
          <>
            <div className='flexCenter flexColumn'>
              Starting a fundraiser and using Givebox is FREE. We will not ask you for a credit card.
            </div>
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              <SignupStepsHelp
                content={{
                  linkText: 'Why Do I Have to Enter a Tax ID?',
                  title: 'You Need a Tax ID to Collect Money',
                  text: 
                    <span>
                      To be able to accept donations and collect money from others you are required by law to have a federally issued tax ID.
                      If you are a 501c_ Organization you may be tax exempt, however you still need to declare money raised on your 990.
                      <span style={{ display: 'block', marginTop: 5 }}>
                        Currently Givebox only supports a U.S. Federal Tax ID. We plan to expand to Canada, Mexico and internationally in the near future.
                      </span>
                    </span>
                }}
              />
            </div>
            <div className='fieldGroup'>
              <div className='column50'>
                {this.props.textField('orgName', {
                  group: slug,
                  fixedLabel: true,
                  label: 'Organization Name',
                  placeholder: `Type Organization Name`,
                  maxLength: 128,
                  count: true,
                  required: true,
                  value: orgName,
                  onBlur: (name, value) => {
                    if (value) {
                     this.props.updateOrgSignupField('org', { name: value });
                    }
                  }
                })}
              </div>
              <div className='column50'>
                {this.props.textField('taxID', {
                  group: slug,
                  fixedLabel: true,
                  label: 'U.S. Federal Tax ID',
                  placeholder: `Type Tax ID`,
                  required: true,
                  value: taxID,
                  validate: 'taxID',
                  onBlur: (name, value) => {
                    if (value) {
                      this.props.updateOrgSignupField('org', { taxID: value });
                    }
                  }
                })}
              </div>
              <div className='column50'>
                <Dropdown
                  name='categoryID'
                  portalID={`category-dropdown-portal-${slug}`}
                  portalClass={'gbx3 articleCardDropdown selectCategory gbx3Steps'}
                  portalLeftOffset={10}
                  className='articleCard'
                  contentWidth={400}
                  label={'Organization Category'}
                  selectLabel='Choose an Organization Category'
                  fixedLabel={true}
                  fixedLabelHasValue={true}
                  required={true}
                  onChange={(name, value) => {
                    this.setState({ categoryIDError: false });
                    this.props.updateOrgSignupField('org', { categoryID: +value });
                  }}
                  options={this.categories()}
                  showCloseBtn={true}
                  error={this.state.categoryIDError}
                  value={categoryID}
                  leftBar={true}
                />
              </div>
            </div>
          </>
        break;
      }

      case 'mission': {
        item.className = 'missionStep';
        item.component =
          <>
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              <SignupStepsHelp
                content={{
                  linkText: 'Why Do I Have to Upload a Logo?',
                  title: 'A Logo Identifies the Fundraiser as Belonging to Your Organization',
                  text: 
                    <span>
                      You can skip uploading a logo and add one later. However, we strongly encourage you to upload a logo 
                      now because it gives confidence to your audience that the fundraiser belongs to your Organization.
                    </span>
                }}
              />
            </div>
            <div className='fieldGroup'>
              <MediaLibrary
                image={orgLogo}
                preview={orgLogo}
                quickUpload={true}
                singlePreview={true}
                removePreview={() => {
                  console.log('execute removePreview');
                }}
                handleSaveCallback={(url) => this.handleMediaSaveCallback(url, 'org', 'imageURL', slug)}
                handleSave={util.handleFile}
                library={library}
                showBtns={'hide'}
                saveLabel={'close'}
                mobile={isMobile ? true : false }
                uploadOnly={true}
                uploadEditorSaveStyle={{ width: 250 }}
                uploadEditorSaveLabel={'Click Here to Use Image'}
                imageEditorOpenCallback={(editorOpen) => {
                  this.setState({ editorOpen })
                }}
                editorResizerStyle={{ marginTop: -150 }}
              />
              {this.props.richText('mission', {
                name: 'mission',
                group: slug,
                style: { paddingTop: 20 },
                placeholder:
                <div>
                  Type About Your Organization, Mission or Purpose
                </div>,
                fixedLabel: false,
                label: 'About Your Organization, Mission or Purpose',
                wysiwyg: false,
                autoFocus: false,
                value: mission,
                required: true,
                onBlur: (name, content, hasText) => {
                  if (hasText) {
                    this.props.updateOrgSignupField('org', { mission: content });
                  }
                }
              })}
            </div>
          </>
        ;
        break;
      }

      case 'title': {
        item.component =
          <>
            <div style={{ marginBottom: 20 }} className='fieldGroup'>
              <SignupStepsHelp
                content={{
                  linkText: 'Why Do I Have to Upload an Image?',
                  title: 'An Image Greatly Enhances Your Fundraisers Appeal',
                  text: 
                    <span>
                      You can skip uploading an image and add one later. However, we strongly encourage you to upload an image 
                      now because it greatly enhances your fundraisers appeal.
                    </span>
                }}
              />
            </div>          
            <div className='fieldGroup'>
              <MediaLibrary
                image={imageURL}
                preview={imageURL}
                quickUpload={true}
                singlePreview={true}
                handleSaveCallback={(url) => {
                  this.setState({ mediaTypeError: null });
                  this.handleMediaSaveCallback(url, 'gbx3', 'imageURL', slug);
                }}
                handleSave={util.handleFile}
                library={library}
                showBtns={'hide'}
                saveLabel={'close'}
                mobile={isMobile ? true : false }
                uploadOnly={true}
                imageEditorOpenCallback={(editorOpen) => {
                  this.setState({ editorOpen })
                }}
                formError={mediaTypeError === 'image' ? true : false}
                editorResizerStyle={{ marginTop: -150 }}
              />
              {this.props.textField('title', {
                group: slug,
                style: { paddingTop: 20 },
                fixedLabel: true,
                label: 'Fundraiser Title',
                placeholder: 'Type Fundraiser Title',
                maxLength: 128,
                count: true,
                required: true,
                value: title,
                onBlur: (name, value) => {
                  if (value) {
                    this.props.updateOrgSignupField('gbx3', { title: value });
                  }
                }
              })}
          </div>     
          </>
        ;
        break;
      }

      case 'themeColor': {
        const style = {
          default: {
            head: {
              background: '#fff',
              backgroundImage: 'none',
              fontSize: '1.5em',
              fontWeight: 300,
              border: 0,
              marginBottom: 0,
              boxShadow: 'none',
              color: '#465965',
              height: 0,
              lineHeight: 0
            },
          }
        };
        item.component =
          <div className='fieldGroup'>
            <div className='column50'>
              <Dropdown
                name='defaultTheme'
                portalID={`category-dropdown-portal-${slug}`}
                portalClass={'gbx3 articleCardDropdown gbx3Steps'}
                portalLeftOffset={10}
                className='articleCard'
                contentWidth={400}
                label={'Theme Style'}
                selectLabel='Choose Theme'
                fixedLabel={false}
                fixedLabelHasValue={true}
                required={true}
                onChange={(name, value) => {
                  this.props.updateOrgSignupField('org', { defaultTheme: value });
                }}
                options={[
                  { primaryText: 'Light', value: 'light' },
                  { primaryText: 'Dark', value: 'dark' }
                ]}
                showCloseBtn={true}
                value={defaultTheme || ''}
                style={{ paddingBottom: 20 }}
                leftBar={true}
                hideIcons={true}
              />
            <div className='input-group'>
              <div className='fieldFauxInput'>
                <div className='inputLeftBar'></div>
                <div className='placeholder'>Choose Accent Color</div>
                <div className='fieldContext'>
                  Button and link color.
                </div>
              </div>
              <div className='flexCenter'>
                <PhotoshopPicker
                  styles={style}
                  header={''}
                  color={this.state.themeColor}
                  onChangeComplete={(color) => {
                    this.setState({ themeColor: color.hex })
                  }}
                />
              </div>
            </div>
            </div>
            <div className='column50'>
              <EditVideo
                videoURL={videoURL}
                onChange={() => {
                  this.setState({ mediaTypeError: null });
                }}
                onBlur={(url, validated) => {
                  if (url && validated) {
                    this.handleMediaSaveCallback(url, 'gbx3', 'videoURL', slug);
                  } else if (!url) {
                    this.handleMediaSaveCallback('', 'gbx3', 'videoURL', slug);
                  }
                }}
                error={mediaTypeError === 'video' ? true : false}
                leftBar={true}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'account': {
        if (signupPhase === 'signup') {
          item.saveButtonLabel = <span className='buttonAlignText'>Create Account & Continue <span className='icon icon-chevron-right'></span></span>;
          item.saveButtonLabelTop = item.saveButtonLabel;
          item.component =
            <>
              <div className='flexCenter'>
                After you create your free account you will be able to share your fundraiser.
              </div>
              <div style={{ marginBottom: 20 }} className='fieldGroup'>
                <SignupStepsHelp
                  content={{
                    linkText: 'Why Do I Have to Create a Free Account?',
                    title: 'Your Free Givebox Account is How You Manage Your Fundraiser and Money',
                    text: 
                      <span>
                        Your free Givebox account is where you can view your fundraisers, manage the money you receive, and view your donors and customers.
                        <span style={{ display: 'block', marginTop: 5 }}>
                          You can also do a ton more with your free Givebox account like sending email blasts, selling event tickets, offering membership subscriptions, and even running sweepstakes.
                        </span>
                      </span>
                  }}
                />
              </div>
              <CreateAccount
                  {...this.props}
                  group={slug}
                  owner={owner}
                  setRequirePassword={this.setRequirePassword}
                  requirePassword={requirePassword}
                  acceptedTerms={acceptedTerms}
                  updateOrgSignupField={this.props.updateOrgSignupField}
                  updateOrgSignup={this.props.updateOrgSignup}
                />
            </>
          ;
        } else {
          item.saveButtonLabel = <span className='buttonAlignText'>Continue to Accept Donations</span>;
          item.desc = 'Congratulations, you have created a FREE Givebox Account!';
          item.component = null;
        }
        break;
      }

      case 'previewShare': {
        if (signupPhase === 'signup') {
          item.saveButtonLabel = <span className='buttonAlignText'>Complete Previous Steps</span>;
          item.desc = 'Please complete the previous steps to continue.';
          item.component = 
            <>
              <div className='flexCenter'>
                The previous steps are required to start a fundraiser and accept donations.
              </div>
              <div style={{ marginBottom: 20 }} className='fieldGroup'>
                <SignupStepsHelp
                  content={{
                    linkText: 'Why Do I Have to Complete the Previous Steps?',
                    title: 'Starting a Fundraiser Requires You to Enter a Few Details',
                    text: 
                      <span>
                        Starting a fundraiser and raising money requires you to enter a few details about your Organization and fundraiser. 
                        We try to keep the steps minimal and you can always add more details and customizations to your fundraiser later.
                      </span>
                  }}
                />
              </div>              
            </>
          ;
        } else {
          item.hidePrevious = true;
          //item.saveButtonLabel = <span className='buttonAlignText'>Take Me to My Fundraiser</span>;
          item.className = 'preview';
          item.desc = 'Congratulations, you have just opened a Merchant Processing Account!';
          item.customSaveButton =
            <div style={{ marginTop: 0 }} className='button-group'>
              <GBLink 
                className='button' 
                onClick={() => {
                  this.finishedSteps('share');
                }}
              >
                Share My Fundraiser
              </GBLink>
              <GBLink 
                className='button' 
                onClick={() => {
                  this.finishedSteps('connect');
                }}
              >
                Continue to Next Step
              </GBLink>
            </div>
          ;
          item.component =
            <div style={{ marginTop: 20 }} className='flexCenter flexColumn'>
              Please continue to the next step and connect a bank account to receive money.
              {/*
              You can now accept donations. Go to your fundraiser, share it and start raising money.              
              <SignupShare 
                style={{
                  marginBottom: 0,
                  paddingBottom: 0
                }}
                showHelper={false} 
              />
              */}              
            </div>
          ;
        }
        break;
      }

      // no default
    }

    return (
      <div className='stepContainer'>
        { this.state.saving ? <Loader msg='Saving...' /> : null }
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            {completed ?
              <div className='completed'>
                <Icon><MdCheckCircle /></Icon> <span className='completedText'>Step {stepNumber} Completed</span>
              </div>
            :
            <div className='stepTitle'>
              {item.desc}
            </div>
            }
          </div>
          <div className={`stepComponent`}>
            {item.component}
          </div>
        </div>
        { !this.state.editorOpen ?
        <div className='button-group'>
          <div className='leftSide' style={{ width: 150 }}>
            { !firstStep && !item.hidePrevious ? <GBLink className={`link`} disabled={firstStep} onClick={() => {
              this.props.formProp({ error: false });
              this.props.previousStep(step);
            }}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step' }</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            {item.customSaveButton || this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel })}
          </div>
          <div className='rightSide'>
            <Image className='pulsate' url={isMobile ? 'https://cdn.givebox.com/givebox/public/gb-logo5.png' : 'https://cdn.givebox.com/givebox/public/givebox-logo_white.png'} alt='Givebox Logo' maxHeight={30} />
          </div>
        </div> : null }
        { slug === 'orgName' ?
        <div className='flexCenter'>
          <GBLink onClick={() => window.location.replace(ENTRY_URL)}>
            Already have an account, click here to login.
          </GBLink>
        </div> : null }
      </div>
    );
  }

  render() {

    return (
      <div className='stepsWrapper'>
        {this.renderStep()}
      </div>
    )
  }
}

class SignupSteps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      createdArticleID
    } = this.props;

    if (createdArticleID) {
      this.props.getResource('article', {
        customName: 'createdArticle',
        id: [createdArticleID]
      });
    }

    this.props.getResource('categories', {
      search: {
        sort: 'name',
        order: 'asc',
        filter: `kind:!"individual"%3Bname:!"Auto"`
      },
      callback: (res, err) => {
      }
    });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {

    if (util.isLoading(this.props.categories)
    || util.isEmpty(util.getValue(this.props.categories, 'data', {}))) {
      return <Loader msg='Loading Categories...' />
    }

    return (
      <Form id={`stepsForm`} name={`stepsForm`} options={{ leftBar: true }} >
        <SignupStepsForm
          {...this.props}
        />
      </Form>
    )
  }
}

function mapStateToProps(state, props) {

  const orgGlobals = util.getValue(state, 'resource.gbx3Org.data.customTemplate.orgGlobals', {});
  const categories = util.getValue(state, 'resource.categories', {});
  const createdArticle = util.getValue(state, 'resource.createdArticle.data', {});
  const hasCreatedArticle = !util.isEmpty(createdArticle) ? true : false;
  const modal = util.getValue(state, 'gbx3.info.modal', false);

  return {
    orgGlobals,
    categories,
    createdArticle,
    hasCreatedArticle,
    modal
  }
}

export default connect(mapStateToProps, {
  setOrgStyle,
  setAccess,
  loadOrg,
  updateOrgGlobals,
  createFundraiser,
  savingSignup,
  signupGBX3Data,
  getGBX3SaveData,
  checkSignupPhase,
  saveLegalEntity
})(SignupSteps);
