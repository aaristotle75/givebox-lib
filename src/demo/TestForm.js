import React, {Component} from 'react';
import { selectOptions } from '../lib';

export default class TestForm extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
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

  render() {

    return (
      <div>
        <h2>Form Elements</h2>
        <div className='formWrapper'>
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
        {this.props.dropdown('status', {options: [{primaryText: 'Active', value: 'active'}, {primaryText: 'Deactivated', value: 'deactivated'}, {primaryText: 'Suspended', value: 'suspended'}], defaultLabel: 'Select Status'})}
        {this.props.textField('amount1', { label: 'Enter Amount', placeholder: '0.00', validate: 'money' })}
        {this.props.choice('amount1-enabled', { parent: 'amount1', label: 'Amount 1 enabled', checked: true })}
        {this.props.richText('amount1-desc', { parent: 'amount1', label: 'Amount 1 Description', modal: true, modalLabel: 'Edit Description'})}
        {this.props.choice('amount-default', { label: 'Amount 1 Default', type: 'radio', value: 'amount1' })}
        {this.props.textField('amount2', { label: 'Enter Amount', placeholder: '0.00', validate: 'money'  })}
        {this.props.choice('amount2-enabled', { parent: 'amount2', label: 'Amount 2 enabled', checked: true })}
        {this.props.richText('amount2-desc', { parent: 'amount2', label: 'Amount 2 Description', modal: true})}
        {this.props.choice('amount-default', { label: 'Amount 2 Default', type: 'radio', value: 'amount2'})}
        {this.props.choice('enabled', {label: 'Enable this resource', checked: true, errorType: 'custom', style: {marginBottom: 0}, debug: false})}
        {this.props.fieldError('enabled', 'You must enable to continue.')}
        {this.props.textField('taxID', {placeholder: 'Enter Tax ID', validate: 'taxID', maxLength: 10})}
        {this.props.textField('ssn', {placeholder: 'Enter Social Security Number', validate: 'ssn', maxLength: 11})}
        {this.props.textField('phone', {placeholder: 'Enter Phone', validate: 'phone'})}
        {this.props.textField('descriptor', {placeholder: 'Enter Billing Descriptor', validate: 'descriptor', maxLength:21})}
        {this.props.dropdown('states', {options: selectOptions.states, value: 'CA'})}
        {this.props.dropdown('status', {options: [{primaryText: 'Active', value: 'active'}, {primaryText: 'Deactivated', value: 'deactivated'}, {primaryText: 'Suspended', value: 'suspended'}], defaultLabel: 'Select Status'})}
        {this.props.saveButton(this.processForm)}
        </div>
      </div>
    )
  }
}
