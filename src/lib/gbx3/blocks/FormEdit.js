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
      checkoutDonation,
      checkoutDonationText,
      checkoutDonationAmount,
      checkoutDonationFormID,
      checkoutDonationFormTitle
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
                name='passFees'
                label={'Customer Pays the Credit Card Fee'}
                onChange={(name, value) => {
                  this.updateForm('passFees', passFees ? false : true);
                }}
                checked={passFees}
                value={passFees}
                toggle={true}
              />
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
                label={'Enable Electronic Check Payments'}
                onChange={(name, value) => {
                  this.updateForm('echeck', echeck ? false : true);
                }}
                checked={echeck}
                value={echeck}
                toggle={true}
              />
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
                label={'Collect Custom Info'}
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
                  label='Custom Field Placeholder'
                  fixedLabel={true}
                  placeholder='Ex. On Behalf of Jane Doe'
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
              <div>
                <div className='formSectionHeader'>Message Option</div>
                <Choice
                  type='checkbox'
                  name='sendEmail'
                  label={'Give Users an Option to Add a Message at Checkout'}
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
                    label={'Give Users an Option to Email Their Message'}
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
              <div className='formSectionHeader'>Goal Option</div>
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
              <div className='formSectionHeader'>Browse Other Items Option <ModalLink style={{ marginLeft: 10 }} id='shop'>Edit Browse Other Items Overlay</ModalLink></div>
              <Choice
                type='checkbox'
                name='allowSelection'
                label={'Allow Browsing Other Items'}
                onChange={(name, value) => {
                  this.updateForm('allowSelection', allowSelection ? false : true);
                }}
                checked={allowSelection}
                value={allowSelection}
                toggle={true}
              />
              <AnimateHeight height={allowSelection ? 'auto' : 0}>
                <TextField
                  name='shopTitle'
                  label='Browse More Items Title'
                  fixedLabel={true}
                  placeholder='Browse More Items Title"'
                  value={shopTitle}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    this.updateForm('shopTitle', value);
                  }}
                />
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
