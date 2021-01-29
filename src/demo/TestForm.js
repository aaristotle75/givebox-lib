import React, {Component} from 'react';
import GBLink from '../lib/common/GBLink';
import ModalLink from '../lib/modal/ModalLink';
import Collapse from '../lib/common/Collapse';
import UploadPrivate from '../lib/form/UploadPrivate';
import * as util from '../lib/common/utility';
import Image from '../lib/common/Image';
import Choice from '../lib/form/Choice';
import * as selectOptions from '../lib/form/selectOptions';
import Moment from 'moment';
import Capture from '../lib/form/Capture';

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
    this.toggleWebcam = this.toggleWebcam.bind(this);
    this.getCapture = this.getCapture.bind(this);
    this.onChangeReadonly = this.onChangeReadonly.bind(this);
    this.testFunc = this.testFunc.bind(this);
    this.state = {
      checked: false,
      success: false,
      webcam: true,
      capture: null,
      readOnly: false,
      value: 5
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

  getCapture(capture) {
    this.setState({ capture });
  }

  toggleWebcam() {
    this.setState({ webcam: this.state.webcam ? false : true });
  }

  onChangeReadonly(name, value) {
    this.props.fieldProp('taxID', { readOnly: value });
    this.setState({ readOnly: value });
  }

  testFunc(value) {
    this.setState({ value });
  }

  render() {

    const {
      formState
    } = this.props;

    const list = [
      { value: 1, primaryText: 'First Bank Account', secondaryText: 'xxxxx1234', rightText: 'Verified' },
      { value: 2, primaryText: 'Second Bank Account', secondaryText: 'xxxxx2222' },
      { value: 3, primaryText: 'Third Bank Account', secondaryText: 'xxxxx3333', disabled: true },
      { value: 4, primaryText: 'Fourth Bank Account', secondaryText: 'xxxxx4444' }
    ];

    const fields = util.getValue(formState, 'fields', {});
    const content = util.getValue(fields, 'content', {});

    const {
      passFees
    } = this.state;

    const now = Moment().utc().format('MM/DD/YYYY H:mmA z');

    return (
      <div>
        <h2>Form Elements</h2>
        <div className='formWrapper'>
            {this.props.textField('address', {label: 'Address', placeholder: 'Enter Address', validate: 'address'})}
            {/*
            {this.props.calendarField('testdate', { label: 'Test Date', enableTime: true, enableTimeOption: false, required: true, validate: 'date', validateOpts: { min: now } })}
            {this.props.dropdown('states', {label: 'States', options: selectOptions.states, value: 'CA'})}
            <Choice
              type='checkbox'
              toggle={true}
              name='passFees'
              label={'Customer Pays the Credit Card Fee'}
              onChange={(name, value) => {
                this.setState({ passFees: passFees ? false : true });
              }}
              checked={passFees}
              value={passFees}
            />
            <Image url={'https://givebox-staging.s3.amazonaws.com/gbx%2F693a664e591131ad047eea8a3bc3e128%2F2020-04-09%2Fimage-png%2Foriginal'} alt={'test image aspect'}  maxSize={'500px'}  />

            {this.props.dropdown('bankAccounts', {
              options: list,
              label: 'Bank Accounts',
              selectLabel: 'Select the Bank Account',
              required: true,
              readOnly: false
            })}
            {this.props.richText('content', { required: false, label: 'Rich Text', placeholder: 'Please write something...', modal: false, wysiwyg: false, autoFocus: false, modalLabel: 'Open content editor', allowLink: true })}
          {this.props.richText('emailList', { label: 'Email List', placeholder: 'Enter emails separated by commas', modal: false, required: false, allowLink: true })}
          {this.props.richText('content', { required: false, label: 'Rich Text', placeholder: 'Please write something...', modal: true, modalLabel: 'Open content editor', allowLink: true })}
          <div style={{ margin: '100px 0px' }}>
            <div dangerouslySetInnerHTML={{ __html: util.getValue(content, 'value') }}></div>
          </div>
          {this.props.choice('readOnly', { type: 'checkbox', onChange: this.onChangeReadonly, label: 'Change Read Only.', checked: false })}
          {this.props.textField('taxID', { readOnly: this.state.readOnly, readOnlyText: 'You cannot edit this field', placeholder: 'Enter federal Tax ID', label: 'Tax ID', validate: 'taxID', value: '10-1010101' })}
          <GBLink onClick={() => this.testFunc(100)}>Test Func</GBLink>
          {this.props.textField('amount', { value: '', label: 'Amount', fixedLabel: false, required: true })}
          {this.props.uploadField('imageURL', { parent: 'user', label: 'Image', debug: true })}

          {!this.state.webcam || 1===1 ?
            <div>
              {this.state.capture ? <img src={this.state.capture} alt='capture' /> : <span>No Capture</span>}<br />
            </div>
          : <Capture
              callback={this.getCapture}
            />
          }
          <button onClick={this.toggleWebcam}>Toggle Webcam</button>
          {this.props.creditCardGroup({ required: false, debug: false})}
          {this.props.textField('address', {label: 'Address', placeholder: 'Enter Address', validate: 'address'})}
          {this.props.saveButton(this.processForm, { id: '-second' })}
          {this.props.textField('taxID', { readOnly: true,readOnlyText: 'You cannot edit this field', placeholder: 'Enter federal Tax ID', label: 'Tax ID', validate: 'taxID', value: '10-1010101' })}
          {this.props.choice('enabled', { label: 'Enabled', checked: this.state.checked, value: this.state.checked })}
          {this.props.textField('amounts', { type: 'hidden', useChildren: true })}
          {this.props.uploadField('imageURL', { parent: 'user', label: 'Image', library: { borderRadius: 20, type: 'avatar' }, debug: true })}
          {this.props.modalField('testModal', { id: 'feesGlossary', label: 'Test Modal', modalLabel: 'Click the modal' } )}
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
        {this.props.calendarField('dob', { label: 'Date of Birth', enableTime: false, enableTimeOption: true, required: true, validate: 'date', validateOpts: { }})}
        {this.props.calendarRange('event range', { rangeRequired: false, debug: true, enableTimeOption: true, enableTimeOptionLabel: 'Show time', range1Label: 'Event Start Date', range2Label: 'Event End Date', range1Name: 'when', range2Name: 'endsAt', range1Value: 1552006980, range1EnableTime: false, range2EnableTime: true })}
        {this.props.textField('amounts', { type: 'hidden', useChildren: true })}
        {this.props.textField('amount1', { parent: 'amounts', label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.choice('amount1Enabled', { parent: 'amounts', label: '1 Enabled' })}
        {this.props.textField('amount2', { parent: 'amounts', label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.choice('amount2Enabled', { parent: 'amounts', label: '2 Enabled' })}
        {this.props.textField('amount3', { parent: 'amounts', label: 'Enter Amount', placeholder: '0.00', validate: 'number' })}
        {this.props.choice('amount3Enabled', { parent: 'amounts', label: '3 Enabled' })}
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
        */}
        {this.props.saveButton(this.processForm)}
        </div>
      </div>
    )
  }
}
