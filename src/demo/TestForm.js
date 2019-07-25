import React, {Component} from 'react';
import { selectOptions, GBLink, ModalLink, Collapse, UploadPrivate, util } from '../lib';
import Moment from 'moment';

export default class TestForm extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.selectAccount = this.selectAccount.bind(this);
    this.testFieldProp = this.testFieldProp.bind(this);
    this.toggleRequired = this.toggleRequired.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
    this.state = {
      checked: false,
      success: false
    }
    this.roleRef = React.createRef();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  fileUploadSuccess(name, ID) {
    this.setState({ success: `File ${name} uploaded successfully - CALLBACK` });
  }

  formSavedCallback() {
    //this.props.fieldProp('custID', {value: 122});
  }

  processForm(fields) {
    console.log(fields);
  }

  toggleChecked() {
    this.setState({ checked: this.state.checked ? false : true });
  }

  focusInput() {
    const ref = this.props.fieldRef('role');
    if (ref) ref.focus();
  }

  onTypeChange(name, value, field, fields) {
    console.log('ontypeChange', name, value, field);
    this.props.fieldProp('selectedAccount', { value: '' });
  }

  selectAccount(name, value, field) {
    console.log('selectAccount', name, value, field);
  }

  testFieldProp() {
    this.props.fieldProp('emailList', { updateContent: '111' });
  }

  toggleRequired(name, field, fieldProp, fields) {
    console.log('toggleRequired', field);
    fieldProp('phoneInfo', { checked: true });
  }

  render() {

    const where = {
      address: '2010 Canal St',
      city: 'Venice',
      state: 'CA',
      zip: '90291',
      country: 'USA',
      coordinates: {
        lat: 123.12223,
        long: 44.1242
      }
    }

    const customLink = <GBLink onClick={this.focusInput}>Focus Input</GBLink>;

    const loading = true;
    /*
    if (loading) return (
      <div>
        {this.props.loader('Loading data...')}
        {this.props.loader('Loading data2...')}
      </div>
    )
    */

    const ts = 1563883654;

    return (
      <div>
        <h2>Form Elements</h2>
        <div className='formWrapper'>
          {util.getDate(ts)}
          {this.props.calendarField('dateOfBirth', { label: 'Date of Birth', validate: 'date', validateOpts: { }, value: 164332800 })}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <UploadPrivate
              id={185}
              fileUploadSuccess={this.fileUploadSuccess}
              success={this.state.success}
              alt={true}
            />
          </div>
          {this.props.uploadField('imageURL', { label: 'Image', library: { borderRadius: 20, type: 'avatar' }, debug: true })}
          {/*
          {this.props.saveButton(this.processForm, { id: '-second' })}
          {this.props.textField('taxID', { readOnly: true,readOnlyText: 'You cannot edit this field', placeholder: 'Enter federal Tax ID', label: 'Tax ID', validate: 'taxID', value: '10-1010101' })}
          {this.props.choice('enabled', { label: 'Enabled', checked: this.state.checked, value: this.state.checked })}
          {this.props.textField('amounts', { type: 'hidden', useChildren: true })}
          {this.props.uploadField('imageURL', { parent: 'user', label: 'Image', library: { borderRadius: 20, type: 'avatar' }, debug: true })}
          {this.props.richText('emailList', { label: 'Email List', placeholder: 'Enter emails separated by commas', modal: true, required: false })}
          {this.props.modalField('testModal', { id: 'feesGlossary', label: 'Test Modal', modalLabel: 'Click the modal' } )}
          {this.props.whereField('where', { where: where, label: 'Where is the event', modalLabel: 'Add location' })}
          {this.props.colorPicker('primaryColor', { label: 'Pick a theme color' })}
          {this.props.creditCardGroup({ required: false, debug: false})}
          {this.props.textField('taxID', {placeholder: 'Enter Tax ID', validate: 'taxID', maxLength: 10})}
          <Collapse
            id='testForm'
            label='Calendar'
          >
          {this.props.choice('enabled', { label: 'Enabled', checked: this.state.checked, value: this.state.checked })}
          {this.props.textField('amount', {
            required: true,
            className: 'column',
            label: 'Amount',
            placeholder: '0.00',
            fixedLabel: true,
            validate: 'money',
            validateOpts: { decimal: true, min: 1, max: 25000, errorMsg: `You can transfer a minimum of $1 up to your available balance of 25000` },
            debug: true
          })}
          {this.props.calendarField('dob', { label: 'Date of Birth', enableTime: false, enableTimeOption: false, required: true, validate: 'date', validateOpts: { }, utc: false })}
          </Collapse>
        {customLink}
        {this.props.textField('role', { required: true, label: 'Role', customLink: customLink })}
        {this.props.dropdown('recurringDefaultInterval', {
          options: [
            { primaryText: 'None', value: 'once' },
            { primaryText: 'Monthly', value: 'monthly' },
            { primaryText: 'Quarterly', value: 'quarterly' },
            { primaryText: 'Yearly', value: 'annually' }
          ],
          label: 'Default Recurring Option',
          selectLabel: 'Select the Default Recurring Option offered',
          className: 'recurringOption',
          required: true
        })}
        <GBLink onClick={this.toggleChecked}>Toggle Checked</GBLink>
        {this.props.choice('enabled', { label: 'Enabled', checked: this.state.checked, value: this.state.checked })}
        {this.props.choice('choice', { label: 'Choice 1', value: 'choice1', checked: 'choice2', type: 'radio' })}
        {this.props.choice('choice', { label: 'Choice 2', value: 'choice2', type: 'radio' })}
        {this.props.choice('choice', { label: 'Choice 3', value: 'choice3', type: 'radio' })}
        {this.props.textField('user', { useChildren: true })}
        {this.props.textField('test', {label: 'Test', parent: 'user', placeholder: 'Enter test', maxLength:128})}
        {this.props.uploadField('imageURL', { parent: 'user', label: 'Image', debug: true })}
        {this.props.textField('newPassword', {label: 'New Password', placeholder: 'Enter new password', validate: 'password', type: 'password', maxLength:32, strength: true})}
        <Collapse>
          {this.props.colorPicker('primaryColor', { label: 'Pick a theme color' })}
        </Collapse>
        <Collapse>
          {this.props.richText('emailList', { label: 'Email List', placeholder: 'Enter emails separated by commas', modal: true, required: true })}
          {this.props.calendarField('dob', { label: 'Date of Birth', enableTime: false, enableTimeOption: true, required: true, validate: 'date', validateOpts: { }, utc: false })}
        </Collapse>
        {this.props.dropdown('recurringDefaultInterval', {
          options: [
            { primaryText: 'None', value: 'once' },
            { primaryText: 'Monthly', value: 'monthly' },
            { primaryText: 'Quarterly', value: 'quarterly' },
            { primaryText: 'Yearly', value: 'annually' }
          ],
          label: 'Default Recurring Option',
          selectLabel: 'Select the Default Recurring Option offered',
          className: 'recurringOption'
        })}
        {this.props.whereField('where', { where: where, label: 'Where is the event', modalLabel: 'Add location' })}
        {this.props.calendarField('dob', { label: 'Date of Birth', enableTime: false, enableTimeOption: true, required: true, validate: 'date', validateOpts: { }})}
        {this.props.calendarRange('event range', { rangeRequired: false, debug: true, enableTimeOption: true, enableTimeOptionLabel: 'Show time', range1Label: 'Event Start Date', range2Label: 'Event End Date', range1Name: 'when', range2Name: 'endsAt', range1Value: 1552006980, range1EnableTime: false, range2EnableTime: true })}
        {this.props.textField('amounts', { type: 'hidden', useChildren: true })}
        {this.props.textField('amount1', { parent: 'amounts', label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.choice('amount1Enabled', { parent: 'amounts', label: '1 Enabled' })}
        {this.props.textField('amount2', { parent: 'amounts', label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.choice('amount2Enabled', { parent: 'amounts', label: '2 Enabled' })}
        {this.props.textField('amount3', { parent: 'amounts', label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.choice('amount3Enabled', { parent: 'amounts', label: '3 Enabled' })}
        {this.props.uploadField('imageURL', { customLink: customLink, label: 'Image', debug: true, value: 'https://givebox-staging.s3.amazonaws.com/gbx%2F9b28b33157275cf5c8fa036633a3b33d%2F2018-11-09%2Fwesome1-jpg-original-jpg%2Foriginal' })}
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
        {this.props.choice('choice', { label: 'Choice 1', value: 'choice1', checked: 'choice2', type: 'radio' })}
        {this.props.choice('choice', { label: 'Choice 2', value: 'choice2', type: 'radio' })}
        {this.props.choice('choice', { label: 'Choice 3', value: 'choice3', type: 'radio' })}

        {this.props.choice('phoneInfo', { group: 'options', label: 'Add phone number to form.' })}
        {this.props.choice('phoneInfoRequired', { parent: 'phoneInfo', group: 'options', label: 'Make phone number required', onChange: this.toggleRequired })}
        {this.props.dropdown('status', {options: [{primaryText: 'Active', value: 'active'}, {primaryText: 'Deactivated', value: 'deactivated'}, {primaryText: 'Suspended', value: 'suspended'}], selectLabel: 'Select Status'})}
        {this.props.textField('amount1', { label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.richText('amount1-desc', { parent: 'amount1', label: 'Amount 1 Description', modal: true, modalLabel: 'Edit Description'})}
        {this.props.textField('amount2', { label: 'Enter Amount', placeholder: '0.00', validate: 'number'  })}
        {this.props.richText('amount2-desc', { parent: 'amount2', label: 'Amount 2 Description', modal: true})}
        {this.props.fieldError('enabled', 'You must enable to continue.')}
        {this.props.textField('taxID', {placeholder: 'Enter Tax ID', validate: 'taxID', maxLength: 10})}
        {this.props.textField('phone', {placeholder: 'Enter Phone', validate: 'phone'})}
        {this.props.textField('descriptor', {placeholder: 'Enter Billing Descriptor', validate: 'descriptor', maxLength:21})}
        {this.props.dropdown('states', {label: 'States', options: selectOptions.states, value: 'CA'})}
        {this.props.dropdown('status', {options: [{primaryText: 'Active', secondaryText: 'active status does so and so', value: 'active'}, {primaryText: 'Deactivated', value: 'deactivated'}, {primaryText: 'Suspended', value: 'suspended'}], selectLabel: 'Select Status'})}
        {this.props.textField('ssn', {label: 'Social Security Number', placeholder: 'Enter Social Security Number', validate: 'ssn'})}
        {this.props.calendarField('dob', { label: 'Date of Birth', required: true, validate: 'date', validateOpts: { }})}
        {this.props.richText('emailList', { label: 'Email List', placeholder: 'Enter emails separated by commas', modal: false, required: true, wysiwyg: 'show' })}
        {this.props.modalField('testModal', { id: 'feesGlossary', label: 'Test Modal', modalLabel: 'Click the modal' } )}
        {this.props.dropdown('states', {label: 'States', options: selectOptions.states, value: 'CA'})}
        {this.props.dropdown('bankAccountType', { className: 'column50', label: 'What kind of transfer do you want to make?', value: 'deposit', onChange: this.onTypeChange, options: [{primaryText: 'Withdrawal', value: 'deposit' }, {primaryText: 'Send Payment', value: 'payee'}] })}
        {this.props.dropdown('selectedAccount', { className: 'column50', label: `account`, selectLabel: `Select account to make withdrawal to`, onChange: this.selectAccount, options: [{primaryText: 'Account1', value: 1}, {primaryText: 'Account2', value: 2}, { bottom: <span>Add Account</span>, style: {textAlign: 'center'} }] })}
        {this.props.textField('amount', { required: true, label: 'Enter Amount', placeholder: '0.00', validate: 'money', validateOpts: { decimal: true, min: 1, max: 2999.87, errorMsg: `You can't transfer more than your available balance of 2999.87` }  })}
        {this.props.choice('phoneInfo', { group: 'options', label: 'Add phone number to form.' })}
        {this.props.choice('phoneInfoRequired', { parent: 'phoneInfo', group: 'options', label: 'Make phone number required', onChange: this.toggleRequired })}
        {this.props.saveButton(this.processForm)}
        */}
        </div>
      </div>
    )
  }
}
