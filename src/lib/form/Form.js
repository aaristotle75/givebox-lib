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
import { cloneObj, isEmpty, numberWithCommas } from '../common/utility';
import has from 'has';

class Form extends Component {

  constructor(props) {
    super(props);
    this.onEnterKeypress = this.onEnterKeypress.bind(this);
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
      errorMsg: '',
      saved: false,
      savedMsg: '',
      updated: false,
      fields: {}
    }
    this.defaultOptions = {
      parent: false,
      label: '',
      fixedLabel: false,
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
      validateOpts: {
        decimal: true
      },
      maxLength: 64,
      error: false,
      errorType: 'tooltip', // choices: tooltip, normal, none
      checked: false,
      options: [],
      selectLabel: 'Select One',
      modal: false,
      debug: false,
      strength: false,
      count: false,
      meta: {}
    }
    this.defaults = { ...this.defaultOptions, ...props.options };
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onEnterKeypress);
  }

  componentWillUnmount() {
    if (this.formSavedTimeout) {
      clearTimeout(this.formSavedTimeout);
      this.formSavedTimeout = null;
    }
    window.removeEventListener('keyup', this.onEnterKeypress);
  }

  onEnterKeypress(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      document.getElementById(`${this.props.id}-saveButton`).click();
    }
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
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (!field) {
      this.createField(name, args);
    }
  }

  fieldProp(name, args) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (field) {
      const params = Object.assign(this.state.fields[name], args);
      this.setState(Object.assign(this.state, {
        ...this.state,
        fields: {
          ...this.state.fields,
          [name]: params
        }
      }));
      if (field.parent) {
        if (has(params, 'value')) this.fieldProp(field.parent, {[name]: params.value});
      }
    } else {
      console.error(`Error in fieldProp: ${name}`);
    }
  }

  formProp(args) {
    this.setState(Object.assign(this.state, args));
  }

  onChangeCalendar(ts, name) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (field) {
      this.fieldProp(name, { value: ts/field.reduceTS, error: false });
      this.formProp({ error: false, errorMsg: '', updated: true });
      if (has(field, 'rangeStartField')) {
        let required = ts ? true : false;
        this.fieldProp(field.rangeStartField, {error: false, required: required});
      }
      if (has(field, 'rangeEndField')) {
        let required = ts ? true : false;
        this.fieldProp(field.rangeEndField, {error: false, required: required});
      }
      if (field.debug) console.log('onChangeCalendar', name, field);
    }
  }

  onChange(e) {
    e.preventDefault();
    const name = e.target.name;
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (field) {
      let value = e.target.value;
      if (field.validate === 'taxID') value = _v.formatTaxID(value);
      if (field.validate === 'ssn') value = _v.formatSSN(value);
      if (field.validate === 'phone') value = _v.formatPhone(value);
      if (field.validate === 'ccexpire') value = _v.formatCCExpire(value);
      if ((field.validate === 'money' || field.validate === 'number') && field.validateOpts.decimal) value = _v.formatDecimal(value);
      if ((field.validate === 'money' || field.validate === 'number') && !field.validateOpts.decimal) value = _v.formatNumber(value);
      this.fieldProp(name, {value: value, error: false});
      this.formProp({error: false, updated: true});
      if (field.onChange) field.onChange(name, value, field, this.state.fields);
      if (field.debug) console.log('onChange', name, field);
    }
  }

  onChangeDropdown(name, value) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (field) {
      const arr = [];
      if (field.multi) {
        if (Array.isArray(field.value)) {
          arr.push(...field.value);
        } else {
          if (field.value) arr.push(field.value);
        }
        if (arr.includes(value)) {
          arr.splice(arr.indexOf(value), 1);
        } else {
          arr.push(value);
        }
      }
      this.fieldProp(name, {value: field.multi ? arr : value, error: false});
      this.formProp({error: false, updated: true});
      if (field.onChange) field.onChange(name, value, field, this.state.fields);
      if (field.debug) console.log('onChangeDropdown', name, field);
    }
  }

  onChangeCheckbox(name) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (field) {
      const checked = field.checked ? false : true;
      this.fieldProp(name, {checked: checked, value: checked, error: false});
      this.formProp({error: false, updated: true});
      if (field.debug) console.log('onChangeCheckbox', name, field);
    }
  }

  onChangeRadio(name, value) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (field) {
      this.fieldProp(name, {checked: value, value: value, error: false});
      this.formProp({error: false, updated: true});
      if (field.debug) console.log('onChangeRadio', name, field);
    }
  }

  onChangeRichText(name, val, hasText) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    if (field) {
      const value = hasText ? val : _v.clearRichTextIfShouldBeEmpty(val);
      this.fieldProp(name, {value: value, error: false});
      this.formProp({error: false, updated: true});
      if (field.debug) console.log('onChangeRichText', name, field);
    }
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
  }

  onFocus(e) {
    e.preventDefault();
    const name = e.target.name;
    const field = this.state.fields[name];
    if (field.debug) console.log('onFocus', name, field);
  }

  calendarField(name, opts) {
    const field = has(this.state.fields, name) ? this.state.fields[name] : null;
    const defaults = cloneObj(this.defaults);
    const params = Object.assign({}, defaults, {
      enableTime: false,
      reduceTS: 1000,
      fixedLabel: true
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
        fixedLabel={params.fixedLabel}
        style={params.style}
        className={params.className}
        error={field ? field.error : params.error }
        errorType={params.errorType}
        createField={this.createField}
        params={params}
        overlay={params.overlay}
        overlayDuration={params.overlayDuration}
      />
    )
  }

  calendarRange(name, opts) {
    const defaults = cloneObj(this.defaults);
    const params = Object.assign({}, defaults, {
      className: '',
      enableTime: false,
      range1Name: 'range1',
      range1Label: 'Start Date',
      range1Value: '',
      range2Name: 'range2',
      range2Label: 'End Date',
      range2Value: '',
      colWidth: '50%',
      overlay: true
    }, opts);

    return (
      <div style={params.style} className={`field-group`}>
        <div style={{width: params.colWidth}} className='col'>
          {this.calendarField(params.range1Name, { enableTime: params.enableTime, value: params.range1Value, label: params.range1Label, range: 'start', rangeEndField: params.range2Name, debug: params.debug, filter: name, validate: 'calendarRange', overlay: params.overlay, overlayDuration: params.overlayDuration })}
        </div>
        <div style={{width: params.colWidth}} className='col'>
          {this.calendarField(params.range2Name, { enableTime: params.enableTime, value: params.range2Value, label: params.range2Label, range: 'end', rangeStartField: params.range1Name, debug: params.debug, filter: name, validate: 'calendarRange', overlay: params.overlay, overlayDuration: params.overlayDuration })}
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
      case 'checkbox': {
        onChange = this.onChangeCheckbox;
        createField = this.createField;
        break;
      }

      case 'radio': {
        onChange = this.onChangeRadio;
        createField = this.createRadioField;
        break;
      }

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
      floatingLabel: true,
      overlay: true
    }, opts);

    const defaultValue = field ? field.value : params.value;

    return (
      <Dropdown
        name={name}
        options={params.options}
        required={field ? field.required : params.required}
        group={field ? field.group : params.group}
        readOnly={field ? field.readOnly : params.readOnly}
        onChange={this.onChangeDropdown}
        defaultValue={defaultValue}
        selectLabel={params.selectLabel}
        label={params.label}
        floatingLabel={params.floatingLabel}
        style={params.style}
        contentStyle={params.contentStyle}
        className={params.className}
        error={field ? field.error : params.error}
        errorType={params.errorType}
        createField={this.createField}
        multi={field ? field.multi : params.multi}
        value={field ? field.value : ''}
        params={params}
        overlay={params.overlay}
        overlayDuration={params.overlayDuration}
        direction={params.direction}
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
        fixedLabel={params.fixedLabel}
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
        strength={params.strength}
        count={params.count}
        meta={params.meta}
        symbol={params.validateOpts.symbol}
        money={params.validate === 'money' ? true : false}
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
      validate: 'creditCard',
      maxLength: 19
    }, opts);

    return (
      <CreditCard
        name={name}
        className={params.className}
        cardType={field ? field.cardType : params.cardType}
        checked={field ? field.checked : params.checked}
        label={params.label}
        fixedLabel={params.fixedLabel}
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
    const params = Object.assign({}, defaults, {
      className: '',
      required: true
    }, opts);

    return (

      <div style={params.style} className={`field-group creditCard-group`}>
        <div style={{width: '75%'}} className='col'>
          {this.creditCard('ccnumber', {label: params.ccnumberLabel || 'Credit Card', fixedLabel: params.ccnumberfixedLabel || true, required: params.required, debug: params.debug})}
        </div>
        <div style={{width: '25%'}} className='col'>
          {this.textField('ccexpire', {label: params.ccxpireLabel || 'Expiration', fixedLabel: params.ccexpirefixedLabel || true, placeholder: 'MM/YY', required: params.required, validate: 'ccexpire', maxLength: 5, count: false, debug: params.debug})}
        </div>
        <div className='clear'></div>
      </div>
    )
  }

  checkForErrors(fields, group) {
    let error = false;
    Object.entries(fields).forEach(([key, value]) => {
      if (value.group === group || value.group === 'all' || group === 'submitAll') {
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

    // Make sure the err has response prop before continuing
    if (has(err, 'response')) {

      // Make sure the response has data prop before continuing
      if (has(err.response, 'data')) {

        // Handle single error
        if (has(err.response.data, 'message')) {
          if (err.response.data.code === 'vantiv_payfac' && this.props.hideVantivErrors) {
            // Show the hideVantivErrors message
            this.formProp({ error: true, errorMsg: `${this.props.hideVantivErrors}` });
            error = this.props.hideVantivErrors;
          } else {
            this.formProp({ error: true, errorMsg: `${err.response.data.message}` });
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
          this.formProp({ error: true, errorMsg: `Error saving: ${error}` });
        }
      }
    }
    if (!error && (typeof err === 'string')) error = err;
    return error;
  }

  formSaved(callback, msg = '', timeout = 2500) {
    this.formProp({saved: true, savedMsg: msg || _v.msgs.success, updated: false });
    if (timeout) {
      this.formSavedTimeout = setTimeout(() => {
        if (callback) callback();
        this.formProp({saved: false, savedMsg: this.state.savedMsg});
        this.formSavedTimeout = null;
      }, timeout);
    }
    return;
  }

  saveButton(callback, opts = {}) {
    const defaults = {
      label: 'Save',
      style: {},
      className: '',
      allowDisabled: false,
      group: 'submitAll'
    }
    const options = { ...defaults, ...opts };
    return (
      <button id={`${this.props.id}-saveButton`} className={`button ${options.className}`} style={options.style} type='button' disabled={!this.state.updated && options.allowDisabled ? true : false} onClick={(e) => this.validateForm(e, callback, options.group)}>{options.label}</button>
    )
  }

  errorAlert() {
    return (
      <Alert alert='error' display={this.state.error} msg={this.state.errorMsg} />
    );
  }

  successAlert() {
    return (
      <Alert alert='success' display={this.state.saved} msg={this.state.savedMsg} />
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
		e.preventDefault();
    let bindthis = this;
    let fields = this.state.fields;
    const groupFields = {};
    Object.entries(fields).forEach(([key, value]) => {
      if ((value.group === group || value.group === 'all' || group === 'submitAll') && value.autoReturn) {
        groupFields[key] = value;
        if (value.required && !value.value) {
          bindthis.fieldProp(key, {error: _v.msgs.required});
        } else {
          if (value.value) bindthis.validateField(key, value.validate, value.value, value.validateOpts);
        }
      }
    });
    this.checkForErrors(fields, group);
    if (!this.state.error) {
      if (callback) callback(groupFields);
    }
  }

  validateField(key, validate, value, opts = {}) {
    let min, max, errorMsg, format;
    switch (validate) {
      case 'date':
        format = opts.format || null;
        min = opts.min || null;
        max = opts.max || null;
        errorMsg = min && max ? `Please enter a date between ${min} and ${max}.`
        : min && !max ? `Please enter a date after ${min}.`
        : !min && max ? `Please enter a date before ${max}.`
        : `default error`;
        if (!_v.validateDate(value, { min: min, max: max, format: format })) this.fieldProp(key, {error: opts.errorMsg || errorMsg});
        break;
      case 'email':
        if (!_v.validateEmail(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.email});
        break;
      case 'password':
        if (!_v.validatePassword(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.password});
        break;
      case 'taxID':
        if (!_v.validateTaxID(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.taxID});
        break;
      case 'ssn':
        if (!_v.validateTaxID(value)) this.fieldProp(key, {error:opts.errorMsg ||  _v.msgs.ssn});
        break;
      case 'phone':
        if (!_v.validatePhone(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.phone});
        break;
      case 'descriptor':
        if (!_v.validateDescriptor(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.descriptor});
        break;
      case 'url':
        if (!_v.validateURL(value)) this.fieldProp(key, {error: opts.errorMsg || _v.msgs.url});
        break;
      case 'number':
      case 'money':
        const decimal = opts.decimal || true;
        min = opts.min || _v.limits.txMin;
        max = opts.max || _v.limits.txMax;
        errorMsg = opts.errorMsg || `Please enter a valid ${validate === 'money' ? 'amount' : 'number'} between ${numberWithCommas(min)} to ${numberWithCommas(max)}`;
        const error = decimal ? errorMsg : `${errorMsg} with no decimal point.`;
        if (!_v.validateNumber(value, min, max, decimal )) this.fieldProp(key, {error: error});
        break;
      case 'calendarRange':
        if (!_v.validateCalendarRange(key, this.state.fields)) this.fieldProp(key, {error: _v.msgs.calendarRange});
        break;
      case 'creditCard':
        if (!_v.validateCardTypes(value)) this.fieldProp(key, {error: _v.msgs.creditCard});
        break;

      // no default
    }
  }

  renderChildren() {
    const childrenWithProps = React.Children.map(this.props.children,
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
