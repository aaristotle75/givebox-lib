import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Choice from '../../form/Choice';
import TextField from '../../form/TextField';
import Dropdown from '../../form/Dropdown';
import Collapse from '../../common/Collapse';
import ModalLink from '../../modal/ModalLink';
import AnimateHeight from 'react-animate-height';
import CheckoutDonationEdit from './CheckoutDonationEdit';
import Cinesend from './thirdparty/Cinesend';

class FormEdit extends Component {

  constructor(props) {
    super(props);
    this.updateForm = this.updateForm.bind(this);
    this.updateMulti = this.updateMulti.bind(this);
    this.infoOptions = this.infoOptions.bind(this);
    this.pageOptions = this.pageOptions.bind(this);
    this.state = {
      goalError: ''
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  updateForm(name, value) {
    const form = { ...this.props.form };
    form[name] = value;
    this.props.optionsUpdated('form', form);
  }

  updateMulti(obj = {}, callback) {
    const form = {
      ...this.props.form,
      ...obj
    };
    this.props.optionsUpdated('form', form, callback);
  }

  infoOptions(info) {
    return [
      { primaryText: `No`, value: 0 },
      { primaryText: `Yes, but make it optional`, value: 1 },
      { primaryText: `Yes, and make it required`, value: 2 }
    ];
  }

  pageOptions() {
    const {
      orgName,
      orgPages,
      orgSlug
    } = this.props;
    const options = [
      { primaryText: orgName, value: `000landing000`, secondaryText: `https://givebox.com/${orgSlug}`}
    ];
    if (!util.isEmpty(orgPages)) {
      Object.entries(orgPages).forEach(([key, value]) => {
        const url = `https://givebox.com/${orgSlug}?page=${value.slug}`;
        options.push(
          { primaryText: value.name, value: value.slug, secondaryText: url }
        )
      });
    }
    return options;
  }

  render() {

    const {
      echeck,
      feeOption,
      passFees,
      addressInfo,
      phoneInfo,
      workInfo,
      noteInfo,
      notePlaceholder,
      sendEmail,
      allowSelection,
      allowSharing,
      showP2P,
      hasCustomGoal,
      goal,
      cartTitle,
      shopTitle,
      shopLinkOpensOrgPage,
      shopLinkAsButton,
      browsePage,
      checkoutDonation,
      checkoutDonationText,
      checkoutDonationAmount,
      checkoutDonationFormID,
      checkoutDonationFormTitle,
      tag,
      maxDonationEnabled,
      maxDonationAmount
    } = this.props.form;

    const {
      kind,
      orgID,
      orgSlug
    } = this.props;

    return (
      <div>
        <Collapse
          label={`Banking Fee Options`}
          iconPrimary='edit'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <Choice
                type='checkbox'
                name='feeOption'
                label={'Customer Has Option to Pay Credit Card Fee'}
                onChange={(name, value) => {
                  this.updateForm('feeOption', feeOption ? false : true);
                }}
                checked={feeOption}
                value={feeOption}
                toggle={true}
              />
              <div style={{ marginBottom: 20 }} className='fieldContext'>
                The customer can choose to cover the cost of the credit card fee. If they opt out the Nonprofit pays the credit card fee.
              </div>
              <Choice
                type='checkbox'
                name='passFees'
                label={'Customer Pays the Credit Card Fee'}
                onChange={(name, value) => {
                  this.updateForm('passFees', passFees ? false : true);
                }}
                checked={passFees}
                value={passFees}
                toggle={true}
              />
              <div className='fieldContext'>
                The customer covers the cost of the credit card fee unless the option for them choose is provided. If this is toggled off the Nonprofit pays the credit card fee.
              </div>
            </div>
          </div>
        </Collapse>
        <Collapse
          label={`Customer Payment Options`}
          iconPrimary='edit'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <Choice
                type='checkbox'
                name='echeck'
                label={'Enable Direct Debit Payments'}
                onChange={(name, value) => {
                  this.updateForm('echeck', echeck ? false : true);
                }}
                checked={echeck}
                value={echeck}
                toggle={true}
              />
              <div className='fieldContext'>
                Enabling Direct Debit allows customers with qualifying debit cards to pay lower fees.
              </div>
            </div>
          </div>
        </Collapse>
        <Collapse
          label={`Customer Info Options`}
          iconPrimary='edit'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <Dropdown
                name='phoneInfo'
                label={'Collect Customer Phone Number'}
                fixedLabel={true}
                defaultValue={+phoneInfo}
                onChange={(name, value) => {
                  this.updateForm('phoneInfo', +value);
                }}
                options={this.infoOptions()}
                leftBar={true}
                style={{ margin: '0 15px' }}
              />
              <Dropdown
                name='addressInfo'
                label={'Collect Customer Address'}
                fixedLabel={true}
                defaultValue={+addressInfo}
                onChange={(name, value) => {
                  this.updateForm('addressInfo', +value);
                }}
                options={this.infoOptions()}
                leftBar={true}
                style={{ margin: '0 15px' }}
              />
              <Dropdown
                name='workInfo'
                label={'Collect Customer Occupation and Employer Name'}
                fixedLabel={true}
                defaultValue={+workInfo}
                onChange={(name, value) => {
                  this.updateForm('workInfo', +value);
                }}
                options={this.infoOptions()}
                leftBar={true}
                style={{ margin: '0 15px' }}
              />
              <Dropdown
                name='noteInfo'
                label={'Collect Custom Info (Ex. In Memory/Honor of)'}
                fixedLabel={true}
                defaultValue={+noteInfo}
                onChange={(name, value) => {
                  this.updateForm('noteInfo', +value);
                }}
                options={this.infoOptions()}
                leftBar={true}
                style={{ margin: '0 15px' }}
              />
              <AnimateHeight height={noteInfo > 0 ? 'auto' : 0}>
                <TextField
                  name='notePlaceholder'
                  label='Custom Field Label'
                  fixedLabel={true}
                  placeholder='Ex. In Memory/Honor of'
                  value={notePlaceholder}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    this.updateForm('notePlaceholder', value);
                  }}
                  leftBar={true}
                  style={{ margin: '0 15px' }}
                />
              </AnimateHeight>
            </div>
          </div>
        </Collapse>
        <Collapse
          label={`Advanced Options`}
          iconPrimary='edit'
        >
          <div className='formSectionContainer'>
            <div className='formSection' style={{ padding: '10px'}} >
              <div className='formSubSection' style={{ marginTop: 0 }}>
                <div className='formSectionHeader'>Keywords</div>
                <TextField
                  name='tag'
                  label=''
                  fixedLabel={false}
                  placeholder='Add Keywords, Category, Tags, etc.'
                  value={tag}
                  count={true}
                  maxLength={64}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    this.updateForm('tag', value);
                  }}
                  style={{ padding: 0, margin: '0 15px' }}
                  leftBar={true}
                />
              </div>
              <div className='formSubSection'>
                <div className='formSectionHeader'>Share Option</div>
                <Choice
                  type='checkbox'
                  name='allowSharing'
                  label={'Allow Visitors to Share Form'}
                  onChange={(name, value) => {
                    this.updateForm('allowSharing', allowSharing ? false : true);
                  }}
                  checked={allowSharing}
                  value={allowSharing}
                  toggle={true}
                />
              </div>
              { kind === 'fundraiser' && 1===2 ?
              <div className='formSubSection'>
                <div className='formSectionHeader'>On Behalf of Option</div>
                <Choice
                  type='checkbox'
                  name='sendEmail'
                  label={'Allow Customers to Give on Behalf of Others'}
                  onChange={(name, value) => {
                    sendEmail.enabled = sendEmail.enabled ? false : true;
                    this.updateForm('sendEmail', sendEmail);
                  }}
                  checked={sendEmail.enabled}
                  value={sendEmail.enabled}
                  toggle={true}
                />
                <AnimateHeight height={sendEmail.enabled ? 'auto' : 0}>
                  <Choice
                    type='checkbox'
                    name='sendEmailAllowEmail'
                    label={'Give the Customer an Option to Email the Message'}
                    onChange={(name, value) => {
                      sendEmail.allowEmail = sendEmail.allowEmail ? false : true;
                      this.updateForm('sendEmail', sendEmail);
                    }}
                    checked={sendEmail.allowEmail}
                    value={sendEmail.allowEmail}
                    toggle={false}
                    style={{ marginLeft: 10 }}
                  />
                </AnimateHeight>
              </div>
              : '' }
              {this.props.allowP2P ?
                <div className='formSubSection'>
                  <div className='formSectionHeader'>Peer-2-Peer Option</div>
                  <Choice
                    type='checkbox'
                    name='showP2P'
                    label={'Allow Visitors to Create Peer-2-Peer Fundraisers'}
                    onChange={(name, value) => {
                      this.updateForm('showP2P', showP2P ? false : true);
                    }}
                    checked={showP2P}
                    value={showP2P}
                    toggle={true}
                  />
                </div>
              : ''}
              <div className='formSubSection'>
                <div className='formSectionHeader'>Enable Fundraising Thermometer</div>
                <Choice
                  type='checkbox'
                  name='hasCustomGoal'
                  label={'Set Fundraising Goal'}
                  onChange={(name, value) => {
                    this.updateForm('hasCustomGoal', hasCustomGoal ? false : true);
                  }}
                  checked={hasCustomGoal}
                  value={hasCustomGoal}
                  toggle={true}
                />
                <AnimateHeight height={hasCustomGoal ? 'auto' : 0}>
                  <TextField
                    name='goal'
                    label='Goal Amount'
                    fixedLabel={true}
                    placeholder='Enter the Goal Amount'
                    money={true}
                    value={goal ? goal/100 : ''}
                    maxLength={7}
                    onChange={(e) => {
                      const value = +(e.currentTarget.value * 100);
                      this.updateForm('goal', value);
                    }}
                    leftBar={true}
                    style={{ margin: '0 15px' }}
                  />
                </AnimateHeight>
              </div>
              <div className='formSubSection'>
                <div className='formSectionHeader'>Cart Option</div>
                <TextField
                  name='cartTitle'
                  label='Cart Title'
                  fixedLabel={true}
                  placeholder='Enter the title for "Your Cart"'
                  value={cartTitle}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    this.updateForm('cartTitle', value);
                  }}
                  leftBar={true}
                  style={{ margin: '0 15px' }}
                />
              </div>
              <div className='formSubSection'>
                <div className='formSectionHeader'>Browse Items Options { !shopLinkOpensOrgPage ? <ModalLink style={{ marginLeft: 10 }} id='shop'>Edit Browse Items</ModalLink> : null }</div>
                <Choice
                  type='checkbox'
                  name='allowSelection'
                  label={'Connect Your Other Givebox Forms'}
                  onChange={(name, value) => {
                    this.updateForm('allowSelection', allowSelection ? false : true);
                  }}
                  checked={allowSelection}
                  value={allowSelection}
                  toggle={true}
                />
                <div style={{ marginBottom: 20 }} className='fieldContext'>
                  Connecting your other Givebox Forms will allow your visitors to browse more items.
                </div>
                <AnimateHeight height={allowSelection ? 'auto' : 0}>
                  <TextField
                    name='shopTitle'
                    label='Browse Items Title'
                    fixedLabel={true}
                    placeholder='Browse Items Title"'
                    value={shopTitle}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      this.updateForm('shopTitle', value);
                    }}
                    style={{ paddingBottom: 0, margin: '0 15px' }}
                    leftBar={true}
                  />
                  <Choice
                    type='checkbox'
                    name='shopLinkAsButton'
                    label={'Show Browse Items Link as a Button'}
                    onChange={(name, value) => {
                      this.updateForm('shopLinkAsButton', shopLinkAsButton ? false : true);
                    }}
                    checked={shopLinkAsButton}
                    value={shopLinkAsButton}
                    toggle={true}
                  />
                  { !util.isEmpty(this.pageOptions()) ?
                  <Dropdown
                    name='browsePage'
                    label={'Browse Page'}
                    fixedLabel={true}
                    defaultValue={browsePage || `000landing000`}
                    onChange={(name, value) => {
                      this.updateForm('browsePage', value === `000landing000` ? '' : value);
                    }}
                    options={this.pageOptions()}
                    style={{
                      paddingBottom: 0,
                      margin: '0 15px'
                    }}
                    leftBar={true}
                  /> : null }
                  {/*
                  <Choice
                    type='checkbox'
                    name='shopLinkOpensOrgPage'
                    label={'Use Landing Page for Visitors to Browse Items'}
                    onChange={(name, value) => {
                      this.updateForm('shopLinkOpensOrgPage', shopLinkOpensOrgPage ? false : true);
                    }}
                    checked={shopLinkOpensOrgPage}
                    value={shopLinkOpensOrgPage}
                    toggle={true}
                  />
                  */}
                </AnimateHeight>
                {/*
                <Choice
                  type='checkbox'
                  name='sendEmail'
                  label={'Give Users an Option to Send an Email Message'}
                  onChange={(name, value) => {
                    sendEmail.enabled = sendEmail.enabled ? false : true;
                    this.updateForm('sendEmail', sendEmail);
                  }}
                  checked={sendEmail.enabled}
                  value={sendEmail.enabled}
                />
                <AnimateHeight height={sendEmail.enabled ? 'auto' : 0}>
                  <TextField
                    label='Send Email Link Text'
                    fixedLabel={true}
                    placeholder='Enter the Link Text for Users to Send an Email Message'
                    value={sendEmail.linkText}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      sendEmail.linkText = value;
                      this.updateForm('sendEmail', sendEmail);
                    }}
                  />
                </AnimateHeight>
                */}
              </div>
              <div className='formSubSection'>
                <div className='formSectionHeader'>Donation at Checkout Option</div>
                <CheckoutDonationEdit
                  orgID={orgID}
                  updateForm={this.updateForm}
                  updateMulti={this.updateMulti}
                  checkoutDonation={checkoutDonation}
                  checkoutDonationText={checkoutDonationText}
                  checkoutDonationAmount={checkoutDonationAmount}
                  checkoutDonationFormID={checkoutDonationFormID}
                  checkoutDonationFormTitle={checkoutDonationFormTitle}
                />
              </div>
              { kind === 'fundraiser' ?
              <div className='formSubSection'>
                <div className='formSectionHeader'>Max Donation (e.g. For Political Donations)</div>
                <Choice
                  type='checkbox'
                  name='maxDonationEnabled'
                  label={'Enable a Max Donation Amount'}
                  onChange={(name, value) => {
                    this.updateForm('maxDonationEnabled', maxDonationEnabled ? false : true);
                  }}
                  checked={maxDonationEnabled}
                  value={maxDonationEnabled}
                  toggle={true}
                />
                <AnimateHeight height={maxDonationEnabled ? 'auto' : 0}>
                  <TextField
                    name='maxDonationAmount'
                    label='Max Donation Amount'
                    fixedLabel={true}
                    placeholder='Enter the Max Donation Amount'
                    money={true}
                    value={maxDonationAmount ? maxDonationAmount/100 : ''}
                    maxLength={7}
                    onChange={(e) => {
                      const value = +(e.currentTarget.value * 100);
                      this.updateForm('maxDonationAmount', value);
                    }}
                    leftBar={true}
                    style={{ margin: '0 15px' }}
                  />
                </AnimateHeight>                
              </div> : null }
              <div className='formSubSection'>
                <Cinesend
                  form={this.props.form}
                  updateForm={this.updateForm}
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}

FormEdit.defaultProps = {
}

function mapStateToProps(state, props) {

  const orgData = util.getValue(state, 'resource.gbx3Org.data', {});
  const allowP2P = util.getValue(orgData, 'allowVolunteers', true);
  const orgName = util.getValue(orgData, 'name');
  const orgSlug = util.getValue(orgData, 'slug');
  const orgPages = util.getValue(orgData, 'customTemplate.orgPages', {});

  return {
    allowP2P,
    orgName,
    orgSlug,
    orgPages
  }
}

export default connect(mapStateToProps, {
})(FormEdit);
