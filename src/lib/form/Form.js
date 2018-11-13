import React, {Component} from 'react';
import { connect } from 'react-redux';
import TextField from './TextField';
import Dropdown from './Dropdown';
import Choice from './Choice';
import RichTextField from './RichTextField';
import CreditCard from './CreditCard';
import CalendarField from './CalendarField';
import * as _v from './formValidate';
import Loader from '../common/Loader';
import { Alert } from '../common/Alert';
import { cloneObj, isEmpty } from '../common/utility';
import has from 'has';

class Form extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeCalendar = this.onChangeCalendar.bind(this);
    this.onChangeDropdown = this.onChangeDropdown.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.onChangeRichText = this.onChangeRichText.bind(this);
    this.onChangeCreditCard = this.onChangeCreditCard.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.calendarField = this.calendarField.bind(this);
    this.textField = this.textField.bind(this);
    this.dropdown = this.dropdown.bind(this);
    this.choice = this.choice.bind(this);
    this.richText = this.richText.bind(this);
    this.creditCard = this.creditCard.bind(this);
    this.creditCardGroup = this.creditCardGroup.bind(this);
    this.createField = this.createField.bind(this);
    this.createRadioField = this.createRadioField.bind(this);
    this.fieldProp = this.fieldProp.bind(this);
    this.formProp = this.formProp.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.saveButton = this.saveButton.bind(this);
    this.formSaved = this.formSaved.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.fieldError = this.fieldError.bind(this);
    this.state = {
      error: false,
      saved: false,
      updated: false,
      fields: {}
    }
    this.defaultOptions = {
      parent: false,
      label: '',
      className: '',
      style: {},
      required: false,
      value: '',
      placeholder: '',
      group: 'default',
      readOnly: false,
      autoFocus: false,
      type: '',
      autoReturn: true,
      validate: '',
      maxLength: 64,
      error: false,
      errorType: 'tooltip', // choices: tooltip, normal, none
      checked: false,
      options: [],
      selectLabel: 'Select One',
      modal: false,
      debug: false
    }
    this.defaults = { ...this.defaultOptions, ...props.options };
  }

	focusInput(ref) {
		ref.current.focus();
	}

  createField(name, args) {
    if (args.parent) args.autoReturn = false;
    const merge = { ...this.state.fields, [name]: args };
    this.setState(Object.assign(this.state, {
      ...this.state,
      fields: merge
    }));
    if (args.parent) this.fieldProp(args.parent, {[name]: args.value});
  }

  createRadioField(name, args) {
    const field = has(this.state.fields, name);
    if (!field) {
      this.createField(name, args);
    }
  }

  fieldProp(name, args) {
    const field = has.call(this.state.fields, name);
    const params = Object.assign(this.state.fields[name], args);
    this.setState(Object.assign(this.state, {
      ...this.state,
      fields: {
        ...this.state.fields,
        [name]: params
      }
    }));
    if (field.parent) {
      if (params.hasOwnProperty('value')) this.fieldProp(field.parent, {[name]: params.value});
    }
  }

  formProp(args) {
    this.setState(Object.assign(this.state, args));
    return;
  }

  onChangeCalendar(ts, name) {
    const field = this.state.fields[name];
    this.fieldProp(name, { value: ts, error: false });
    this.formProp({ error: false, updated: true });
    if (field.debug) console.log('onChange', name, field);
    return;
  }

  onChange(e) {
    e.preventDefault();
    const name = e.target.name;
    const field = this.state.fields[name];
    let value = e.target.value;
    if (field.validate === 'taxID') value = _v.formatTaxID(value);
    if (field.validate === 'ssn') value = _v.formatSSN(value);
    if (field.validate === 'phone') value = _v.formatPhone(value);
    if (field.validate === 'ccexpire') value = _v.formatCCExpire(value);

    this.fieldProp(name, {value: value, error: false});
    this.formProp({error: false, updated: true});
    if (field.debug) console.log('onChange', name, field);
    return;
  }

  onChangeDropdown(name, value) {
    const field = this.state.fields[name];
    this.fieldProp(name, {value: value, error: false});
    this.formProp({error: false, updated: true});
    if (field.debug) console.log('onChangeDropdown', name, field);
    return;
  }

  onChangeCheckbox(name) {
    const field = this.state.fields[name];
    const checked = field.checked ? false : true;
    this.fieldProp(name, {checked: checked, value: checked, error: false});
    this.formProp({error: false, updated: true});
    if (field.debug) console.log('onChangeCheckbox', name, field);
  }

  onChangeRadio(name, value) {
    const field = this.state.fields[name];
    this.fieldProp(name, {checked: value, value: value, error: false});
    this.formProp({error: false, updated: true});
    if (field.debug) console.log('onChangeRadio', name, field);
  }

  onChangeRichText(name, val, hasText) {
    const value = hasText ? val : _v.clearRichTextIfShouldBeEmpty(val);
    const field = this.state.fields[name];
    this.fieldProp(name, {value: value, error: false});
    this.formProp({error: false, updated: true});
    if (field.debug) console.log('onChange', name, field);
    return;
  }

  onChangeCreditCard(e) {
    e.preventDefault();
    const obj = _v.formatCreditCard(e.target.value);
    const name = e.target.name;
    const field = this.state.fields[name];
    const value = obj.value;
    const apiValue = obj.apiValue;
    this.fieldProp(name, {value: value, apiValue: apiValue, error: false});

    if (apiValue.length <= 4) {
      let cardType = _v.identifyCardTypes(apiValue);
      if (cardType === 'amex') this.fieldProp(name, {maxLength: 18});
      else this.fieldProp(name, {maxLength: 19});
      this.fieldProp(name, {cardType: cardType});
    }
    this.formProp({error: false, updated: true});

    if ((field.cardType === 'amex' && apiValue.length === 15)
       || (field.cardType !== 'noCardType' && apiValue.length === 16)) {
        this.fieldProp(name, {checked: true});
        this.focusInput(this.state.fields.ccexpire.ref);
    } else {
      this.fieldProp(name, {checked: false});
    }

    if (field.debug) console.log('onChangeCreditCard', name, field);
  }

  onBlur(e) {
    e.preventDefault();
    const name = e.target.name;
    const field = this.state.fields[name];
    let value = e.target.value;
    if (field.validate === 'url') this.fieldProp(name, {value: _v.checkHTTP(value)});
    if (field.debug) console.log('onBlur', name, field);
    return;
  }

  onFocus(e) {
    e.preventDefault();
    const name = e.target.name;
    const field = this.state.fields[name];
    if (field.debug) console.log('onFocus', name, field);
    return;
  }

  calendarField(name, opts) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    const defaults = cloneObj(this.defaults);
    const params = Object.assign({}, defaults, {
      enableTime: false
    }, opts);

    return (
      <CalendarField
        name={name}
        required={field ? field.required : params.required}
        enableTime={field ? field.enableTime : params.enableTime}
        group={field ? field.group : params.group}
        readOnly={field ? field.readOnly : params.readOnly}
        onChangeCalendar={this.onChangeCalendar}
        defaultValue={params.value}
        label={params.label}
        style={params.style}
        className={params.className}
        error={field ? field.error : params.error }
        errorType={params.errorType}
        createField={this.createField}
        params={params}
      />
    )
  }

  calendarRange(name, opts) {
    const defaults = cloneObj(this.defaults);
    const params = Object.assign({}, defaults, {
      className: '',
      enableTime: false,
      range1Name: 'range1',
      range1Label: 'Range 1',
      range1Value: '',
      range2Name: 'range2',
      range2Label: 'Range 2',
      range2Value: '',
      colWidth: '45%'
    }, opts);

    return (
      <div style={params.style} className={`dateRange`}>
        <div style={{width: params.colWidth}} className='col'>
          {this.calendarField(params.range1Name, { enableTime: params.enableTime, value: params.range1Value, label: params.range1Label, range: 'start', rangeEndField: params.range2Name, debug: params.debug, filter: name })}
        </div>
        <div style={{width: params.colWidth}} className='col'>
          {this.calendarField(params.range2Name, { enableTime: params.enableTime, value: params.range2Value, label: params.range2Label, range: 'end', rangeStartField: params.range1Name, debug: params.debug, filter: name })}
        </div>
        <div className='clear'></div>
      </div>
    )
  }

  choice(name, opts) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    const defaults = cloneObj(this.defaults);
    const params = Object.assign({}, defaults, {
      type: 'checkbox',
      value: '',
      className: ''
    }, opts);

    let onChange, createField;
    switch (params.type) {
      case 'checkbox':
        onChange = this.onChangeCheckbox;
        createField = this.createField;
        break;
      case 'radio':
        onChange = this.onChangeRadio;
        createField = this.createRadioField;
        break;

        // no default
    }

    return (
      <Choice
        name={name}
        type={params.type}
        checked={field ? field.checked : params.checked}
        value={params.value}
        group={field ? field.group : params.group}
        readOnly={field ? field.readOnly : params.readOnly}
        onChange={onChange}
        className={params.className}
        style={params.style}
        label={params.label}
        error={field ? field.error : params.error }
        errorType={params.errorType}
        createField={createField}
        params={params}
      />
    )
  }

  dropdown(name, opts) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    const defaults = cloneObj(this.defaults);
    const params = Object.assign({}, defaults, {
    }, opts);

    return (
      <Dropdown
        name={name}
        options={params.options}
        required={field ? field.required : params.required}
        group={field ? field.group : params.group}
        readOnly={field ? field.readOnly : params.readOnly}
        onChange={this.onChangeDropdown}
        defaultValue={params.value}
        selectLabel={params.selectLabel}
        label={params.label}
        style={params.style}
        className={params.className}
        error={field ? field.error : params.error }
        errorType={params.errorType}
        createField={this.createField}
        params={params}
      />
    )
  }

  textField(name, opts) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    const params = Object.assign({}, cloneObj(this.defaults), {
      className: '',
      type: 'text'
    }, opts);

    return (
      <TextField
        name={name}
        className={params.className}
        label={params.label}
        style={params.style}
        placeholder={field ? field.placeholder : params.placeholder}
        type={field ? field.type : params.type}
        required={field ? field.required : params.required}
        group={field ? field.group : params.group}
        readOnly={field ? field.readOnly : params.readOnly}
        autoFocus={field ? field.autoFocus : params.autoFocus}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        value={field ? field.value : params.value}
        error={field ? field.error : params.error }
        errorType={params.errorType}
        maxLength={field ? field.maxLength : params.maxLength}
        createField={this.createField}
        params={params}
      />
    )
  }

  richText(name, opts) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    const defaultParams = cloneObj(this.defaults);
    const params = Object.assign({}, defaultParams, {
      className: '',
      type: 'richText',
      errorType: 'normal'
    }, opts);

    return (
      <RichTextField
        name={name}
        className={params.className}
        label={params.label}
        modal={params.modal}
        modalLabel={params.modalLabel}
        style={params.style}
        placeholder={field ? field.placeholder : params.placeholder}
        required={field ? field.required : params.required}
        group={field ? field.group : params.group}
        autoFocus={field ? field.autoFocus : params.autoFocus}
        onChange={this.onChangeRichText}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        value={field ? field.value : params.value}
        error={field ? field.error : params.error }
        errorType={params.errorType}
        createField={this.createField}
        params={params}
      />
    )
  }

  creditCard(name, opts) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    const defaultParams = cloneObj(this.defaults);
    const params = Object.assign({}, defaultParams, {
      className: '',
      type: 'text',
      cardType: 'noCardType',
      placeholder: 'xxxx xxxx xxxx xxxx',
      validate: 'creditcard',
      maxLength: 19
    }, opts);

    return (
      <CreditCard
        name={name}
        className={params.className}
        cardType={field ? field.cardType : params.cardType}
        checked={field ? field.checked : params.checked}
        label={params.label}
        style={params.style}
        placeholder={field ? field.placeholder : params.placeholder}
        type={field ? field.type : params.type}
        required={field ? field.required : params.required}
        group={field ? field.group : params.group}
        readOnly={field ? field.readOnly : params.readOnly}
        autoFocus={field ? field.autoFocus : params.autoFocus}
        onChange={this.onChangeCreditCard}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        value={field ? field.value : params.value}
        error={field ? field.error : params.error }
        errorType={params.errorType}
        maxLength={field ? field.maxLength : params.maxLength}
        createField={this.createField}
        params={params}
      />
    )
  }

  creditCardGroup(opts) {
    const defaults = cloneObj(this.defaults);
    const ccnumberField = has(this.state.fields, 'ccnumber') ? this.state.fields.ccnumber : null;
    const hideCardsAccepted = ccnumberField ? ccnumberField.cardType !== 'noCardType' ? true : false : false;
    const params = Object.assign({}, defaults, {
      className: '',
      required: true
    }, opts);

    return (
      <div className='creditCard-group'>
        <div className={`cardsAccepted ${hideCardsAccepted && 'displayNone'}`}></div>
        {this.creditCard('ccnumber', {required: params.required, debug: params.debug})}
        {this.textField('ccexpire', {placeholder: 'MM/YY', className: 'ccexpire', required: params.required, validate: 'ccexpire', maxLength: 5,  debug: params.debug})}
      </div>
    )
  }

  checkForErrors(fields, group) {
    var error = false;
    Object.entries(fields).forEach(([key, value]) => {
      if (value.group === group || value.group === 'all') {
        if (value.error) error = true;
      }
    });
    this.formProp({error: error});
    return error;
  }

  /**
  * Get Errors returned from the API
  * @param {object} err Error response returned
  *
  * TODO: get this cleaned up on the API side to have consistent responses
  */
  getErrors(err) {
    let error = false;
    if (has(err, 'response')) {
      // Make sure the err has response prop before continuing

      if (has(err.response, 'data')) {
        // Make sure the response has data prop before continuing

        // Handle single error
        if (has(err.response.data, 'message')) {
          if (err.response.data.code === 'vantiv_payfac' && this.props.hideVantivErrors) {
            // Show the hideVantivErrors message
            this.formProp({ error: `${this.props.hideVantivErrors}` });
            error = this.props.hideVantivErrors;
          } else {
            this.formProp({ error: `${err.response.data.message}` });
            error = err.response.data.message;
          }
        }

        if (has(err.response.data, 'errors')) {
          // Handle multiple errors
          const errors = err.response.data.errors;
          for (let i=0; i <= errors.length; i++) {
            if (!isEmpty(errors[i])) {
              if (has(errors[i], 'field')) {
                if (has(this.state.fields, errors[i].field)) {
                  this.fieldProp(errors[i].field, { error: `The following error occurred while saving, ${errors[i].message}` });
                }
              }
              if (has(errors[i], 'message')) {
                error = i === 0 ? errors[0].message : `${error}, ${errors[i].message}`;
              }
            }
          }
          this.formProp({ error: `Error saving: ${error}` });
        }
      }
    }
    return error;
  }

  formSaved(callback, timeout = 2500) {
    this.formProp({saved: true, updated: false });
    if (timeout) {
      setTimeout(() => {
        this.formProp({saved: false});
        if (callback) callback();
      }, timeout);
    }
    return;
  }

  saveButton(callback, label = 'Save', style = {}) {
    return (
      <button className='button' style={style} type='button' disabled={this.state.updated ? false : true} onClick={(e) => this.validateForm(e, callback)}>{label}</button>
    )
  }

  errorAlert() {
    return (
      <Alert alert='error' msg={this.state.error} />
    );
  }

  successAlert() {
    return (
      <Alert alert='success' msg={this.state.saved} />
    );
  }

  fieldError(name, msg) {
    let error = false;
    if (has(this.state.fields, name)) {
      if (this.state.fields[name].error) error = this.state.fields[name].error;
    }
    return (
      <div className={`error ${!error && 'displayNone'}`}>{msg ? msg : error}</div>
    )
  }

  validateForm(e, callback, group = 'default') {
    let bindthis = this;
		e.preventDefault();
    let fields = this.state.fields;
    var groupFields = {};
    Object.entries(fields).forEach(([key, value]) => {
      if ((value.group === group || value.group === 'all') && value.autoReturn) {
        groupFields[key] = value;
        if (value.required && !value.value) {
          bindthis.fieldProp(key, {error: _v.msgs.required});
        } else {
          if (value.value) bindthis.validateField(key, value.validate, value.value);
        }
      }
    });
    this.checkForErrors(fields, group);
    if (!this.state.error) {
      if (callback) callback(groupFields);
    }
  }

  validateField(key, validate, value) {
    switch (validate) {
      case 'email':
        if (!_v.validateEmail(value)) this.fieldProp(key, {error: _v.msgs.email});
        break;
      case 'taxID':
        if (!_v.validateTaxID(value)) this.fieldProp(key, {error: _v.msgs.taxID});
        break;
      case 'ssn':
        if (!_v.validateTaxID(value)) this.fieldProp(key, {error: _v.msgs.ssn});
        break;
      case 'phone':
        if (!_v.validatePhone(value)) this.fieldProp(key, {error: _v.msgs.phone});
        break;
      case 'descriptor':
        if (!_v.validateDescriptor(value)) this.fieldProp(key, {error: _v.msgs.descriptor});
        break;
      case 'url':
        if (!_v.validateURL(value)) this.fieldProp(key, {error: _v.msgs.url});
        break;
      case 'money':
        if (!_v.validateMoney(value, _v.limits.txMin, _v.limits.txMax)) this.fieldProp(key, {error: _v.msgs.money});
        break;

      // no default
    }
    return;
  }

  renderChildren() {
    var childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        validateForm: this.validateForm,
        formProp: this.formProp,
        fieldProp: this.fieldProp,
        formSaved: this.formSaved,
        saveButton: this.saveButton,
        getErrors: this.getErrors,
        formState: this.state,
        textField: this.textField,
        richText: this.richText,
        creditCardGroup: this.creditCardGroup,
        dropdown: this.dropdown,
        choice: this.choice,
        calendarField: this.calendarField,
        calendarRange: this.calendarRange,
        savingErrorMsg: _v.msgs.savingError,
        responseData: this.props.responseData,
        fieldError: this.fieldError,
        errorAlert: this.errorAlert,
        successAlert: this.successAlert,
        name: this.props.name
      })
    );
    return childrenWithProps;
  }

  render() {

    const {
      id,
      name,
      className,
      errorMsg,
      successMsg
    } = this.props;

    return (
      <form
        autoComplete='new-password'
        name={name}
        id={id}
        className={`${id} ${className || ''}`}
        onSubmit={this.validateForm}
        noValidate={true}
      >
        {this.props.isSending && <Loader msg={'Sending data'} />}
        {errorMsg && this.errorAlert()}
        {successMsg && this.successAlert()}
        {this.renderChildren()}
      </form>
    );
  }
}

Form.defaultProps = {
  errorMsg: true,
  successMsg: true,
  hideVantivErrors: false
}

function mapStateToProps(state, props) {
  let id = props.name + '-form';
  let responseData;
  if (has(state.send, props.name)) responseData = state.send[props.name].response;
  return {
    id: id,
    isSending: state.send.isSending,
    responseData: responseData
  }
}


export default connect(mapStateToProps, {
})(Form)
