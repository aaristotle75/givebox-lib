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

class FormEdit extends Component {

  constructor(props) {
    super(props);
    this.updateForm = this.updateForm.bind(this);
    this.updateMulti = this.updateMulti.bind(this);
    this.infoOptions = this.infoOptions.bind(this);
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
      checkoutDonation,
      checkoutDonationText,
      checkoutDonationAmount,
      checkoutDonationFormID,
      checkoutDonationFormTitle,
      virtualEvent,
      tag
    } = this.props.form;

    const {
      kind,
      orgID
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
            <div className='formSection'>
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
                style={{ paddingTop: 0 }}
              />
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
              { kind === 'fundraiser' && 1===2 ?
              <div>
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
              </div> : '' }
              {this.props.allowP2P ?
                <div>
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
                />
              </AnimateHeight>
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
              />
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
                  style={{ paddingBottom: 0 }}
                />
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
              { kind !== 'fundraiser' ?
              <div>
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
              : '' }
              <div className='formSectionHeader'>Virtual Event</div>
              <Choice
                type='checkbox'
                name='virtualEvent'
                label={'Enable Virtual Event'}
                onChange={(name, value) => {
                  virtualEvent.isEnabled = virtualEvent.isEnabled ? false : true;
                  this.updateForm('virtualEvent', virtualEvent);
                }}
                checked={util.getValue(virtualEvent, 'isEnabled')}
                value={util.getValue(virtualEvent, 'isEnabled')}
                toggle={true}
              />
              <AnimateHeight height={util.getValue(virtualEvent, 'isEnabled') ? 'auto' : 0}>
                <TextField
                  name='virtualEventProviderName'
                  label='Virtual Event Provider'
                  fixedLabel={true}
                  placeholder='Select Virtual Event Provider'
                  value={util.getValue(virtualEvent, 'providerName')}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    console.log('execute virtualEvent Provider -> ', util.getValue(virtualEvent, 'providerName'));
                  }}
                  style={{ paddingBottom: 0 }}
                  readOnly={true}
                  readOnlyText={'Must have a Cinesend Account'}
                />
                <TextField
                  name='virtualEventAPIKey'
                  label='Virtual Event Provider API Key'
                  fixedLabel={true}
                  placeholder='Enter Your API Key (You get this from your Virtual Event Provider)'
                  value={util.getValue(virtualEvent, 'APIKey')}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    virtualEvent.APIKey = value;
                    this.updateForm('virtualEvent', virtualEvent);
                  }}
                  style={{ paddingBottom: 0 }}
                />
                <TextField
                  name='virtualEventVideoID'
                  label='Virtual Event Provider Video ID'
                  fixedLabel={true}
                  placeholder='Enter Your Virtual Event Video ID (You get this from your Virtual Event Provider)'
                  value={util.getValue(virtualEvent, 'videoID')}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    virtualEvent.videoID = value;
                    this.updateForm('virtualEvent', virtualEvent);
                  }}
                  style={{ paddingBottom: 0 }}
                />
              </AnimateHeight>
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

  const allowP2P = util.getValue(state, 'resource.org.data.allowVolunteers', true);

  return {
    allowP2P
  }
}

export default connect(mapStateToProps, {
})(FormEdit);
