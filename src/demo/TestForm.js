import React, {Component} from 'react';
import { selectOptions } from '../lib';

export default class TestForm extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.selectAccount = this.selectAccount.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  formSavedCallback() {
    //this.props.fieldProp('custID', {value: 122});
  }

  processForm(fields) {
    console.log(fields);
  }

  onTypeChange(name, value, field, fields) {
    console.log('ontypeChange', name, value, field);
    this.props.fieldProp('selectedAccount', { value: '' });
  }

  selectAccount(name, value, field) {
    console.log('selectAccount', name, value, field);
  }

  render() {

    return (
      <div>
        <h2>Form Elements</h2>
        <div className='formWrapper'>
        {/*
        {this.props.calendarRange({debug: true, enableTime: true })}
        {this.props.textField('custID', { type: 'hidden' })}
        <div className='row'>
          <div className='col' style={{width: '50%'}}>
            {this.props.textField('name', { placeholder: 'Enter Name', label: 'Name', fixedLabel: true, count: true })}
          </div>
          <div className='col' style={{width: '50%'}}>
            {this.props.textField('email', {placeholder: 'Enter Email', label: 'Email', validate: 'email'})}
          </div>
        </div>
        {this.props.textField('password', {label: 'Password', placeholder: 'Enter password', validate: 'password', type: 'password', maxLength:32, strength: true})}
        {this.props.textField('website', {label: 'Website URL', placeholder: 'Enter Website URL', validate: 'url', maxLength:128})}
        {this.props.creditCardGroup({ required: false, debug: false})}
        {this.props.richText('contentabc', { required: false, label: 'Rich Text', placeholder: 'Please write something...', modal: false, modalLabel: 'Open content editor' })}
        {this.props.choice('choice', { label: 'Choice 1', value: 'choice1', type: 'radio', checked: 'choice2', debug: false })}
        {this.props.choice('choice', { label: 'Choice 2', value: 'choice2', type: 'radio' })}
        {this.props.choice('choice', { label: 'Choice 3', value: 'choice3', type: 'radio' })}
        {this.props.dropdown('status', {options: [{primaryText: 'Active', value: 'active'}, {primaryText: 'Deactivated', value: 'deactivated'}, {primaryText: 'Suspended', value: 'suspended'}], selectLabel: 'Select Status'})}
        {this.props.textField('amount1', { label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.choice('amount1-enabled', { parent: 'amount1', label: 'Amount 1 enabled', checked: true })}
        {this.props.richText('amount1-desc', { parent: 'amount1', label: 'Amount 1 Description', modal: true, modalLabel: 'Edit Description'})}
        {this.props.choice('amount-default', { label: 'Amount 1 Default', type: 'radio', value: 'amount1' })}
        {this.props.textField('amount2', { label: 'Enter Amount', placeholder: '0.00', validate: 'number'  })}
        {this.props.choice('amount2-enabled', { parent: 'amount2', label: 'Amount 2 enabled', checked: true })}
        {this.props.richText('amount2-desc', { parent: 'amount2', label: 'Amount 2 Description', modal: true})}
        {this.props.choice('amount-default', { label: 'Amount 2 Default', type: 'radio', value: 'amount2'})}
        {this.props.choice('enabled', {label: 'Enable this resource', checked: true, errorType: 'custom', style: {marginBottom: 0}, debug: false})}
        {this.props.fieldError('enabled', 'You must enable to continue.')}
        {this.props.textField('taxID', {placeholder: 'Enter Tax ID', validate: 'taxID', maxLength: 10})}
        {this.props.textField('phone', {placeholder: 'Enter Phone', validate: 'phone'})}
        {this.props.textField('descriptor', {placeholder: 'Enter Billing Descriptor', validate: 'descriptor', maxLength:21})}
        {this.props.dropdown('states', {label: 'States', options: selectOptions.states, value: 'CA'})}
        {this.props.dropdown('status', {options: [{primaryText: 'Active', secondaryText: 'active status does so and so', value: 'active'}, {primaryText: 'Deactivated', value: 'deactivated'}, {primaryText: 'Suspended', value: 'suspended'}], selectLabel: 'Select Status'})}
        */}
        {this.props.textField('ssn', {label: 'Social Security Number', placeholder: 'Enter Social Security Number', validate: 'ssn'})}
        {this.props.calendarField('dob', { label: 'Date of Birth', required: true, validate: 'date', validateOpts: { }})}
        {this.props.richText('emailList', { label: 'Email List', placeholder: 'Enter emails separated by commas', modal: true, required: true })}
        {this.props.modalField('testModal', { id: 'feesGlossary', label: 'Test Modal', modalLabel: 'Click the modal' } )}
        {this.props.dropdown('states', {label: 'States', options: selectOptions.states, value: 'CA'})}
        {/*
        {this.props.dropdown('bankAccountType', { className: 'column50', label: 'What kind of transfer do you want to make?', value: 'deposit', onChange: this.onTypeChange, options: [{primaryText: 'Withdrawal', value: 'deposit' }, {primaryText: 'Send Payment', value: 'payee'}] })}
        {this.props.dropdown('selectedAccount', { className: 'column50', label: `account`, selectLabel: `Select account to make withdrawal to`, onChange: this.selectAccount, options: [{primaryText: 'Account1', value: 1}, {primaryText: 'Account2', value: 2}, { bottom: <span>Add Account</span>, style: {textAlign: 'center'} }] })}
        {this.props.textField('amount', { required: true, label: 'Enter Amount', placeholder: '0.00', validate: 'money', validateOpts: { decimal: true, min: 1, max: 2999.87, errorMsg: `You can't transfer more than your available balance of 2999.87` }  })}
        */}
        {this.props.saveButton(this.processForm)}
        </div>
      </div>
    )
  }
}
