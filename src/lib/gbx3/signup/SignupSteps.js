import React from 'react';
import { connect } from 'react-redux';
import CreateAccount from './CreateAccount';
import Form from '../../form/Form';
import Dropdown from '../../form/Dropdown';
import TextField from '../../form/TextField';
import MediaLibrary from '../../form/MediaLibrary';
import Video from '../../common/Video';
import EditVideo from '../admin/common/EditVideo';
import { createData } from '../admin/article/createTemplates';
import * as util from '../../common/utility';
import Tabs, { Tab } from '../../common/Tabs';
import Loader from '../../common/Loader';
import * as _v from '../../form/formValidate';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import HelpfulTip from '../../common/HelpfulTip';
import {
  setOrgStyle,
  loadOrg,
  createFundraiser,
  updateOrgGlobals,
  savingSignup,
  signupGBX3Data
} from '../redux/gbx3actions';
import {
  setAccess
} from '../../api/actions';
import { PhotoshopPicker } from 'react-color-aaristotle';
import {
  primaryColor as defaultPrimaryColor,
  defaultOrgGlobals
} from '../redux/gbx3defaults';

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
    this.checkExistingUser = this.checkExistingUser.bind(this);
    this.setRequirePassword = this.setRequirePassword.bind(this);
    this.validateTaxID = this.validateTaxID.bind(this);
    this.handleMediaSaveCallback = this.handleMediaSaveCallback.bind(this);
    this.callbackAfter = this.callbackAfter.bind(this);

    this.state = {
      themeColor: util.getValue(props.fields, 'org.themeColor', defaultPrimaryColor),
      editorOpen: false,
      error: false,
      categoryIDError: false,
      saving: false,
      mediaType: util.getValue(props.fields, 'gbx3.mediaType', 'image'),
      mediaTypeError: null,
      requirePassword: false
    };
  }

  setRequirePassword(requirePassword) {
    if (requirePassword) {
      this.props.fieldProp('password', { required: true  });
    } else {
      this.props.fieldProp('password', { required: false, error: '', value: '' });
    }
    this.setState({ requirePassword });
  }

  callbackAfter(tab) {
    this.props.formProp({ error: false });
    this.setState({ mediaType: tab, mediaTypeError: null });
    this.props.updateOrgSignupField('gbx3', { mediaType: tab });
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

  createOrgCallback(res, err, orgData = {}) {
    this.props.savingSignup(true);

    const gbx3Data = this.props.signupGBX3Data();

    if (!err) {

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
              const {
                orgID
              } = access;

              this.props.createFundraiser('fundraiser', async (res, err) => {
                const createdArticleID = util.getValue(res, 'articleID');
                const orgID = util.getValue(res, 'orgID');
                const updated = await this.props.updateOrgSignup({
                    createdArticleID,
                    saveCookie: false,
                    signupPhase: 'postSignup'
                  },
                  'signup'
                );
                if (updated) {
                  this.props.saveOrg({
                    orgID,
                    data: orgData,
                    orgUpdated: true,
                    callback: async (res, err) => {
                      localStorage.removeItem('signup');
                      this.props.loadOrg(orgID, (res, err) => {
                        this.props.setOrgStyle();
                        this.props.savingSignup(false);
                      });
                    }
                  });
                }
              }, null, {
                showNewArticle: false,
                data: gbx3Data
              });
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
      claimOrgID,
      fields
    } = this.props;

    const {
      org,
      gbx3
    } = fields;

    const password = util.getValue(this.props.formState, 'fields.password.value', util.randomPassword(8));

    const owner = {
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
          <span>Please complete the following steps to create your account:</span>
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

  async saveStep(slug, error = false, delay = 1000) {

    if (error) {
      this.setState({ saving: false });
      return false;
    }

    const completedStep = await this.props.stepCompleted(slug);
    if (completedStep) {
      this.setState({ saving: false }, () => {
        setTimeout(() => {
          this.props.gotoNextStep();
        }, delay)
      });
    } else {
      this.setState({ saving: false }, this.props.gotoNextStep);
    }
  }

  async processForm(fields, callback, group) {
    util.toTop('modalOverlay-stepsForm');
    this.setState({ saving: true });
    const {
      step,
      gbxStyle,
      button,
      validTaxID,
      acceptedTerms,
      stepsTodo
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

    const stepConfig = util.getValue(stepsTodo, step, {});
    const slug = util.getValue(stepConfig, 'slug');

    switch (group) {
      case 'orgName': {
        if (!validTaxID || validTaxID !== org.taxID) return this.validateTaxID(org.taxID, group);
        else return this.saveStep(group);
      }

      case 'mission': {
        if (!org.mission || !org.categoryID) {
          if (!org.mission) this.props.fieldProp('mission', { error: 'About Your Organization is Required' });
          if (!org.categoryID) this.setState({ categoryIDError: 'Organization Category is Required' });
          this.props.formProp({ error: true, errorMsg: 'Please fix the errors below in red.' });
          return this.setState({ saving: false });
        } else {
          return this.saveStep(group);
        }
      }

      case 'logo': {
        if (!org.imageURL) {
          this.props.formProp({ error: true, errorMsg: 'Please upload a logo or profile picture to continue.'});
          return this.setState({ saving: false });
        } else {
          return this.saveStep('logo');
        }
      }

      case 'themeColor': {
        if (themeColor) {
          const updated = await this.props.updateOrgSignupField('org', { themeColor });
          if (updated) {
            this.props.setOrgStyle({
              backgroundColor: themeColor
            });
            return this.saveStep('themeColor');
          }
        }
      }

      case 'image': {
        switch (mediaType) {
          case 'video': {
            if (!gbx3.videoURL) {
              this.props.formProp({ error: true, errorMsg: 'Please enter a video url to continue.'});
              return this.setState({ saving: false, mediaTypeError: 'video' });
            } else {
              return this.saveStep('image');
            }
          }

          case 'image':
          default: {
            if (!gbx3.imageURL) {
              this.props.formProp({ error: true, errorMsg: 'Please upload an image to continue.'});
              return this.setState({ saving: false, mediaTypeError: 'image' });
            } else {
              return this.saveStep('image');
            }
          }
        }
      }

      case 'account': {
        const password = util.getValue(fields, 'password.value');
        if (!acceptedTerms) {
          this.props.formProp({ error: true, errorMsg: 'You must agree to Givebox Terms of Service to continue.'});
          return this.setState({ saving: false });
        } else {
          return this.determineCreateAccount(owner.email, password);
        }
      }

      default: {
        return this.saveStep(group);
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
            return this.saveStep(group, true);
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
      this.saveStep(slug, false, 3000);
    }
  }

  renderStep() {
    const {
      mediaType,
      mediaTypeError,
      requirePassword
    } = this.state;

    const {
      step,
      open,
      isMobile,
      acceptedTerms,
      stepsTodo
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
      desc: stepConfig.desc,
      component: <div></div>,
      className: '',
      saveButtonLabelTop: <span className='buttonAlignText'>Save & Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>,
      saveButtonLabel: <span className='buttonAlignText'>Save & Continue to Next Step <span className='icon icon-chevron-right'></span></span>
    };

    const library = {
      saveMediaType: 'signup',
      borderRadius: 0
    };

    switch (slug) {
      case 'welcome': {
        item.saveButtonLabelTop = <span className='buttonAlignText'>Continue to Step {nextStepNumber}: {nextStepName} <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabel = <span className='buttonAlignText'>Continue to Next Step <span className='icon icon-chevron-right'></span></span>
        item.desc =
          <div>
            <p>You have chosen wisely. You are well on your way to accepting payments and donations through Givebox.</p>
            <p>Simply follow the steps, and in a matter of minutes you will be ready to start raising money immediately!</p>
            <HelpfulTip
              text={`As you go through the steps, remember that almost everything can be changed later, so don't over think it!`}
              style={{ marginTop: 30 }}
            />
          </div>
        ;
        break;
      }

      case 'orgName': {
        item.component =
          <div className='fieldGroup'>
            {this.props.textField('orgName', {
              group: slug,
              fixedLabel: true,
              label: 'Organization Name',
              placeholder: `Click Here and Enter your Organization's Name`,
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
            {this.props.textField('taxID', {
              group: slug,
              fixedLabel: true,
              label: 'U.S. Federal Tax ID',
              placeholder: `Click Here and Enter Your U.S. Federal Tax ID`,
              required: true,
              value: taxID,
              validate: 'taxID',
              onBlur: (name, value) => {
                if (value) {
                  this.props.updateOrgSignupField('org', { taxID: value });
                }
              }
            })}
            <HelpfulTip
              headerIcon={<span className='icon icon-alert-circle'></span>}
              headerText='Important'
              text={`You must have a valid U.S. Federal Tax ID to use Givebox.`}
              style={{ marginTop: 15 }}
            />
          </div>
        break;
      }

      case 'mission': {
        item.className = 'missionStep';
        item.component =
          <div className='fieldGroup'>
            {this.props.richText('mission', {
              name: 'mission',
              group: slug,
              style: { paddingTop: 0 },
              placeholder:
              <div>
                Click Here to Write About Your Organization, Mission or Purpose
              </div>,
              fixedLabel: false,
              label: '',
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
            <HelpfulTip
              headerIcon={<span className='icon icon-edit-2'></span>}
              headerText={`Example Mission Statement`}
              style={{ marginTop: 20, marginBottom: 20 }}
              text={
                <span>
                  "Nonprofit helps communities raise money for food in the United States, Canada and Mexico."
                </span>
              }
            />
            <div className='input-group'>
              <label className='label'>Organization Category</label>
              <Dropdown
                name='categoryID'
                portalID={`category-dropdown-portal-${slug}`}
                portalClass={'gbx3 articleCardDropdown selectCategory'}
                portalLeftOffset={10}
                className='articleCard'
                contentWidth={400}
                label={''}
                selectLabel='Click Here to Select an Organization Category'
                fixedLabel={true}
                required={true}
                onChange={(name, value) => {
                  this.setState({ categoryIDError: false });
                  this.props.updateOrgSignupField('org', { categoryID: +value });
                }}
                options={this.categories()}
                showCloseBtn={true}
                error={this.state.categoryIDError}
                value={categoryID}
              />
            </div>
          </div>
        ;
        break;
      }

      case 'logo': {
        item.component =
          <div className='fieldGroup'>
            <MediaLibrary
              image={orgLogo}
              preview={orgLogo}
              handleSaveCallback={(url) => this.handleMediaSaveCallback(url, 'org', 'imageURL', slug)}
              handleSave={util.handleFile}
              library={library}
              showBtns={'hide'}
              saveLabel={'close'}
              mobile={isMobile ? true : false }
              uploadOnly={true}
              uploadEditorSaveStyle={{ width: 250 }}
              uploadEditorSaveLabel={'Click Here to Save Image'}
              imageEditorOpenCallback={(editorOpen) => {
                this.setState({ editorOpen })
              }}
              topLabel={'Click to Add Image'}
              bottomLabel={'Drag & Drop Image'}
              labelIcon={<span className='icon icon-instagram'></span>}
            />
          </div>
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
        ;
        break;
      }

      case 'title': {
        item.component =
          <div className='fieldGroup'>
            <HelpfulTip
              headerIcon={<span className='icon icon-trending-up'></span>}
              headerText='Pro Tip to Increase Conversions'
              style={{ marginTop: 25, marginBottom: 20 }}
              text={
                <span>
                  A good title should not be dull or too general. It should elicit an emotional reponse to get peoples attention.<br /><br />
                  A dull title: "Please Donate to Save the Whales"<br /><br />
                  A better title: "If you Love Whales Here is How You Can Save Them"
                </span>
              }
            />
            {this.props.textField('title', {
              group: slug,
              label: 'Fundraiser Title',
              placeholder: 'Click Here to Enter a Title',
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
        ;
        break;
      }

      case 'image': {
        item.desc =
          <div>
            <p>{item.desc}</p>
            <HelpfulTip
              headerIcon={<span className='icon icon-video'></span>}
              headerText={`An Image is Great, but with a Video Your Fundraiser Excels`}
              style={{ marginTop: 20, marginBottom: 20 }}
              text={
                <span>
                  If you have a video link handy we suggest you use it. An image is great, but a video brings your story to life.
                </span>
              }
            />
          </div>
        ;
        item.component =
          <div className='fieldGroup'>
            <Tabs
              default={mediaType}
              className='statsTab'
              callbackAfter={this.callbackAfter}
            >
              <Tab id='image' className='showOnMobile' label={<span className='stepLabel buttonAlignText'>Use an Image <span className='icon icon-instagram'></span></span>}>
                <MediaLibrary
                  image={imageURL}
                  preview={imageURL}
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
                  uploadEditorSaveStyle={{ width: 250 }}
                  uploadEditorSaveLabel={'Click Here to Save Image'}
                  imageEditorOpenCallback={(editorOpen) => {
                    this.setState({ editorOpen })
                  }}
                  topLabel={'Click to Add Image'}
                  bottomLabel={'Drag & Drop Image'}
                  labelIcon={<span className='icon icon-instagram'></span>}
                  formError={mediaTypeError === 'image' ? true : false}
                />
              </Tab>
              <Tab id='video' className='showOnMobile' label={<span className='stepLabel buttonAlignText'>Use a Video <span className='icon icon-video'></span></span>}>
                <EditVideo
                  videoURL={videoURL}
                  onChange={() => {
                    this.setState({ mediaTypeError: null });
                  }}
                  onBlur={(url, validated) => {
                    if (url && validated) {
                      this.handleMediaSaveCallback(url, 'gbx3', 'videoURL', slug);
                    }
                  }}
                  error={mediaTypeError === 'video' ? true : false}
                />
              </Tab>
            </Tabs>
          </div>
        ;
        break;
      }

      case 'account': {
        item.saveButtonLabel = <span className='buttonAlignText'>Save Your Account <span className='icon icon-chevron-right'></span></span>;
        item.saveButtonLabelTop = item.saveButtonLabel;
        item.component =
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
        ;
        break;
      }

      // no default
    }

    return (
      <div className='stepContainer'>
        { this.state.saving ? <Loader msg='Saving...' /> : null }
        <div className='stepStatus'>
          <GBLink onClick={(e) => this.props.validateForm(e, this.processForm, slug)}>
            <span style={{ marginLeft: 20 }}>{item.saveButtonLabelTop}</span>
          </GBLink>
        </div>
        <div className={`step ${item.className} ${open ? 'open' : ''}`}>
          <div className='stepTitleContainer'>
            <span className={`icon icon-${item.icon}`}></span>
            <div className='stepTitle'>
              <div className='numberContainer'>
                <span className='number'>Step {stepNumber}{ completed ? ':' : null}</span>
                {completed ?
                  <div className='completed'>
                    <span className='icon icon-check'></span>Completed
                  </div>
                : null }
              </div>
              {item.title}
            </div>
          </div>
          <div className='stepsSubText'>{item.desc}</div>
          <div className={`stepComponent`}>
            {item.component}
          </div>
        </div>
        { !this.state.editorOpen ?
        <div className='button-group'>
          <div className='button-item' style={{ width: 150 }}>
            { !firstStep ? <GBLink className={`link`} disabled={firstStep} onClick={() => {
              this.props.formProp({ error: false });
              this.props.previousStep(step);
            }}><span style={{ marginRight: '5px' }} className='icon icon-chevron-left'></span> {isMobile ? 'Back' : 'Previous Step' }</GBLink> : <span>&nbsp;</span> }
          </div>
          <div className='button-item'>
            {this.props.saveButton(this.processForm, { group: slug, label: item.saveButtonLabel })}
          </div>
          <div className='button-item' style={{ width: 150 }}>
            { slug !== 'account' ?
              <GBLink
                className='link'
                onClick={() => {
                  const step = stepsTodo.findIndex(s => s.slug === 'account');
                  this.props.updateOrgSignup({ step });
                  this.props.formProp({ error: false });
                }}
              >
                <span className='buttonAlignText'>Skip to Save Account <span className='icon icon-chevron-right'></span></span>
              </GBLink>
            : null }
          </div>
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

    if (util.isLoading(this.props.categories)) {
      return <Loader msg='Loading Categories...' />
    }

    return (
      <Form id={`stepsForm`} name={`stepsForm`}>
        <SignupStepsForm
          {...this.props}
        />
      </Form>
    )
  }
}

function mapStateToProps(state, props) {

  const categories = util.getValue(state, 'resource.categories', {});

  return {
    categories
  }
}

export default connect(mapStateToProps, {
  setOrgStyle,
  setAccess,
  loadOrg,
  updateOrgGlobals,
  createFundraiser,
  savingSignup,
  signupGBX3Data
})(SignupSteps);
