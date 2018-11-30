import _slicedToArray from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
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

var Form =
/*#__PURE__*/
function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    var _this;

    _classCallCheck(this, Form);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Form).call(this, props));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeCalendar = _this.onChangeCalendar.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeDropdown = _this.onChangeDropdown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeCheckbox = _this.onChangeCheckbox.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeRadio = _this.onChangeRadio.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeRichText = _this.onChangeRichText.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeCreditCard = _this.onChangeCreditCard.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onFocus = _this.onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.validateForm = _this.validateForm.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.validateField = _this.validateField.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.calendarField = _this.calendarField.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.textField = _this.textField.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.dropdown = _this.dropdown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.choice = _this.choice.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.richText = _this.richText.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.creditCard = _this.creditCard.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.creditCardGroup = _this.creditCardGroup.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.createField = _this.createField.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.createRadioField = _this.createRadioField.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.fieldProp = _this.fieldProp.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.formProp = _this.formProp.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getErrors = _this.getErrors.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.saveButton = _this.saveButton.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.formSaved = _this.formSaved.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.successAlert = _this.successAlert.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.errorAlert = _this.errorAlert.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.fieldError = _this.fieldError.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      error: false,
      saved: false,
      updated: false,
      fields: {}
    };
    _this.defaultOptions = {
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
      maxLength: 64,
      error: false,
      errorType: 'tooltip',
      // choices: tooltip, normal, none
      checked: false,
      options: [],
      selectLabel: 'Select One',
      modal: false,
      debug: false,
      strength: false,
      count: false
    };
    _this.defaults = _objectSpread({}, _this.defaultOptions, props.options);
    return _this;
  }

  _createClass(Form, [{
    key: "focusInput",
    value: function focusInput(ref) {
      ref.current.focus();
    }
  }, {
    key: "createField",
    value: function createField(name, args) {
      if (args.parent) args.autoReturn = false;

      var merge = _objectSpread({}, this.state.fields, _defineProperty({}, name, args));

      this.setState(Object.assign(this.state, _objectSpread({}, this.state, {
        fields: merge
      })));
      if (args.parent) this.fieldProp(args.parent, _defineProperty({}, name, args.value));
    }
  }, {
    key: "createRadioField",
    value: function createRadioField(name, args) {
      var field = has(this.state.fields, name);

      if (!field) {
        this.createField(name, args);
      }
    }
  }, {
    key: "fieldProp",
    value: function fieldProp(name, args) {
      var field = has.call(this.state.fields, name);
      var params = Object.assign(this.state.fields[name], args);
      this.setState(Object.assign(this.state, _objectSpread({}, this.state, {
        fields: _objectSpread({}, this.state.fields, _defineProperty({}, name, params))
      })));

      if (field.parent) {
        if (params.hasOwnProperty('value')) this.fieldProp(field.parent, _defineProperty({}, name, params.value));
      }
    }
  }, {
    key: "formProp",
    value: function formProp(args) {
      this.setState(Object.assign(this.state, args));
    }
  }, {
    key: "onChangeCalendar",
    value: function onChangeCalendar(ts, name) {
      var field = this.state.fields[name];
      this.fieldProp(name, {
        value: ts / field.reduceTS,
        error: false
      });
      this.formProp({
        error: false,
        updated: true
      });

      if (has(field, 'rangeStartField')) {
        var required = ts ? true : false;
        this.fieldProp(field.rangeStartField, {
          error: false,
          required: required
        });
      }

      if (has(field, 'rangeEndField')) {
        var _required = ts ? true : false;

        this.fieldProp(field.rangeEndField, {
          error: false,
          required: _required
        });
      }

      if (field.debug) console.log('onChange', name, field);
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      e.preventDefault();
      var name = e.target.name;
      var field = this.state.fields[name];
      var value = e.target.value;
      if (field.validate === 'taxID') value = _v.formatTaxID(value);
      if (field.validate === 'ssn') value = _v.formatSSN(value);
      if (field.validate === 'phone') value = _v.formatPhone(value);
      if (field.validate === 'ccexpire') value = _v.formatCCExpire(value);
      this.fieldProp(name, {
        value: value,
        error: false
      });
      this.formProp({
        error: false,
        updated: true
      });
      if (field.debug) console.log('onChange', name, field);
    }
  }, {
    key: "onChangeDropdown",
    value: function onChangeDropdown(name, value) {
      var field = this.state.fields[name];
      var arr = [];

      if (field.multi) {
        if (Array.isArray(field.value)) {
          arr.push.apply(arr, _toConsumableArray(field.value));
        } else {
          if (field.value) arr.push(field.value);
        }

        if (arr.includes(value)) {
          arr.splice(arr.indexOf(value), 1);
        } else {
          arr.push(value);
        }
      }

      this.fieldProp(name, {
        value: field.multi ? arr : value,
        error: false
      });
      this.formProp({
        error: false,
        updated: true
      });
      if (field.debug) console.log('onChangeDropdown', name, field);
    }
  }, {
    key: "onChangeCheckbox",
    value: function onChangeCheckbox(name) {
      var field = this.state.fields[name];
      var checked = field.checked ? false : true;
      this.fieldProp(name, {
        checked: checked,
        value: checked,
        error: false
      });
      this.formProp({
        error: false,
        updated: true
      });
      if (field.debug) console.log('onChangeCheckbox', name, field);
    }
  }, {
    key: "onChangeRadio",
    value: function onChangeRadio(name, value) {
      var field = this.state.fields[name];
      this.fieldProp(name, {
        checked: value,
        value: value,
        error: false
      });
      this.formProp({
        error: false,
        updated: true
      });
      if (field.debug) console.log('onChangeRadio', name, field);
    }
  }, {
    key: "onChangeRichText",
    value: function onChangeRichText(name, val, hasText) {
      var value = hasText ? val : _v.clearRichTextIfShouldBeEmpty(val);
      var field = this.state.fields[name];
      this.fieldProp(name, {
        value: value,
        error: false
      });
      this.formProp({
        error: false,
        updated: true
      });
      if (field.debug) console.log('onChange', name, field);
    }
  }, {
    key: "onChangeCreditCard",
    value: function onChangeCreditCard(e) {
      e.preventDefault();

      var obj = _v.formatCreditCard(e.target.value);

      var name = e.target.name;
      var field = this.state.fields[name];
      var value = obj.value;
      var apiValue = obj.apiValue;
      this.fieldProp(name, {
        value: value,
        apiValue: apiValue,
        error: false
      });

      if (apiValue.length <= 4) {
        var cardType = _v.identifyCardTypes(apiValue);

        if (cardType === 'amex') this.fieldProp(name, {
          maxLength: 18
        });else this.fieldProp(name, {
          maxLength: 19
        });
        this.fieldProp(name, {
          cardType: cardType
        });
      }

      this.formProp({
        error: false,
        updated: true
      });

      if (field.cardType === 'amex' && apiValue.length === 15 || field.cardType !== 'noCardType' && apiValue.length === 16) {
        this.fieldProp(name, {
          checked: true
        });
        this.focusInput(this.state.fields.ccexpire.ref);
      } else {
        this.fieldProp(name, {
          checked: false
        });
      }

      if (field.debug) console.log('onChangeCreditCard', name, field);
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      e.preventDefault();
      var name = e.target.name;
      var field = this.state.fields[name];
      var value = e.target.value;
      if (field.validate === 'url') this.fieldProp(name, {
        value: _v.checkHTTP(value)
      });
      if (field.debug) console.log('onBlur', name, field);
    }
  }, {
    key: "onFocus",
    value: function onFocus(e) {
      e.preventDefault();
      var name = e.target.name;
      var field = this.state.fields[name];
      if (field.debug) console.log('onFocus', name, field);
    }
  }, {
    key: "calendarField",
    value: function calendarField(name, opts) {
      var field = has(this.state.fields, name) ? this.state.fields[name] : null;
      var defaults = cloneObj(this.defaults);
      var params = Object.assign({}, defaults, {
        enableTime: false,
        reduceTS: 1000,
        fixedLabel: true
      }, opts);
      return React.createElement(CalendarField, {
        name: name,
        required: field ? field.required : params.required,
        enableTime: field ? field.enableTime : params.enableTime,
        group: field ? field.group : params.group,
        readOnly: field ? field.readOnly : params.readOnly,
        onChangeCalendar: this.onChangeCalendar,
        defaultValue: params.value,
        label: params.label,
        fixedLabel: params.fixedLabel,
        style: params.style,
        className: params.className,
        error: field ? field.error : params.error,
        errorType: params.errorType,
        createField: this.createField,
        params: params
      });
    }
  }, {
    key: "calendarRange",
    value: function calendarRange(name, opts) {
      var defaults = cloneObj(this.defaults);
      var params = Object.assign({}, defaults, {
        className: '',
        enableTime: false,
        range1Name: 'range1',
        range1Label: 'Start Date',
        range1Value: '',
        range2Name: 'range2',
        range2Label: 'End Date',
        range2Value: '',
        colWidth: '50%'
      }, opts);
      return React.createElement("div", {
        style: params.style,
        className: "field-group"
      }, React.createElement("div", {
        style: {
          width: params.colWidth
        },
        className: "col"
      }, this.calendarField(params.range1Name, {
        enableTime: params.enableTime,
        value: params.range1Value,
        label: params.range1Label,
        range: 'start',
        rangeEndField: params.range2Name,
        debug: params.debug,
        filter: name,
        validate: 'calendarRange'
      })), React.createElement("div", {
        style: {
          width: params.colWidth
        },
        className: "col"
      }, this.calendarField(params.range2Name, {
        enableTime: params.enableTime,
        value: params.range2Value,
        label: params.range2Label,
        range: 'end',
        rangeStartField: params.range1Name,
        debug: params.debug,
        filter: name,
        validate: 'calendarRange'
      })), React.createElement("div", {
        className: "clear"
      }));
    }
  }, {
    key: "choice",
    value: function choice(name, opts) {
      var field = has(this.state.fields, name) ? this.state.fields[name] : null;
      var defaults = cloneObj(this.defaults);
      var params = Object.assign({}, defaults, {
        type: 'checkbox',
        value: '',
        className: ''
      }, opts);
      var onChange, createField;

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

      return React.createElement(Choice, {
        name: name,
        type: params.type,
        checked: field ? field.checked : params.checked,
        value: params.value,
        group: field ? field.group : params.group,
        readOnly: field ? field.readOnly : params.readOnly,
        onChange: onChange,
        className: params.className,
        style: params.style,
        label: params.label,
        error: field ? field.error : params.error,
        errorType: params.errorType,
        createField: createField,
        params: params
      });
    }
  }, {
    key: "dropdown",
    value: function dropdown(name, opts) {
      var field = has(this.state.fields, name) ? this.state.fields[name] : null;
      var defaults = cloneObj(this.defaults);
      var params = Object.assign({}, defaults, {}, opts);
      return React.createElement(Dropdown, {
        name: name,
        options: params.options,
        required: field ? field.required : params.required,
        group: field ? field.group : params.group,
        readOnly: field ? field.readOnly : params.readOnly,
        onChange: this.onChangeDropdown,
        defaultValue: params.value,
        selectLabel: params.selectLabel,
        label: params.label,
        style: params.style,
        className: params.className,
        error: field ? field.error : params.error,
        errorType: params.errorType,
        createField: this.createField,
        multi: field ? field.multi : params.multi,
        value: field ? field.value : '',
        params: params
      });
    }
  }, {
    key: "textField",
    value: function textField(name, opts) {
      var field = has(this.state.fields, name) ? this.state.fields[name] : null;
      var params = Object.assign({}, cloneObj(this.defaults), {
        className: '',
        type: 'text'
      }, opts);
      return React.createElement(TextField, {
        name: name,
        className: params.className,
        label: params.label,
        fixedLabel: params.fixedLabel,
        style: params.style,
        placeholder: field ? field.placeholder : params.placeholder,
        type: field ? field.type : params.type,
        required: field ? field.required : params.required,
        group: field ? field.group : params.group,
        readOnly: field ? field.readOnly : params.readOnly,
        autoFocus: field ? field.autoFocus : params.autoFocus,
        onChange: this.onChange,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        value: field ? field.value : params.value,
        error: field ? field.error : params.error,
        errorType: params.errorType,
        maxLength: field ? field.maxLength : params.maxLength,
        createField: this.createField,
        params: params,
        strength: params.strength,
        count: params.count
      });
    }
  }, {
    key: "richText",
    value: function richText(name, opts) {
      var field = has(this.state.fields, name) ? this.state.fields[name] : null;
      var defaultParams = cloneObj(this.defaults);
      var params = Object.assign({}, defaultParams, {
        className: '',
        type: 'richText',
        errorType: 'normal'
      }, opts);
      return React.createElement(RichTextField, {
        name: name,
        className: params.className,
        label: params.label,
        modal: params.modal,
        modalLabel: params.modalLabel,
        style: params.style,
        placeholder: field ? field.placeholder : params.placeholder,
        required: field ? field.required : params.required,
        group: field ? field.group : params.group,
        autoFocus: field ? field.autoFocus : params.autoFocus,
        onChange: this.onChangeRichText,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        value: field ? field.value : params.value,
        error: field ? field.error : params.error,
        errorType: params.errorType,
        createField: this.createField,
        params: params
      });
    }
  }, {
    key: "creditCard",
    value: function creditCard(name, opts) {
      var field = has(this.state.fields, name) ? this.state.fields[name] : null;
      var defaultParams = cloneObj(this.defaults);
      var params = Object.assign({}, defaultParams, {
        className: '',
        type: 'text',
        cardType: 'noCardType',
        placeholder: 'xxxx xxxx xxxx xxxx',
        validate: 'creditCard',
        maxLength: 19
      }, opts);
      return React.createElement(CreditCard, {
        name: name,
        className: params.className,
        cardType: field ? field.cardType : params.cardType,
        checked: field ? field.checked : params.checked,
        label: params.label,
        fixedLabel: params.fixedLabel,
        style: params.style,
        placeholder: field ? field.placeholder : params.placeholder,
        type: field ? field.type : params.type,
        required: field ? field.required : params.required,
        group: field ? field.group : params.group,
        readOnly: field ? field.readOnly : params.readOnly,
        autoFocus: field ? field.autoFocus : params.autoFocus,
        onChange: this.onChangeCreditCard,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        value: field ? field.value : params.value,
        error: field ? field.error : params.error,
        errorType: params.errorType,
        maxLength: field ? field.maxLength : params.maxLength,
        createField: this.createField,
        params: params
      });
    }
  }, {
    key: "creditCardGroup",
    value: function creditCardGroup(opts) {
      var defaults = cloneObj(this.defaults);
      var params = Object.assign({}, defaults, {
        className: '',
        required: true
      }, opts);
      return React.createElement("div", {
        style: params.style,
        className: "field-group creditCard-group"
      }, React.createElement("div", {
        style: {
          width: '75%'
        },
        className: "col"
      }, this.creditCard('ccnumber', {
        label: params.ccnumberLabel || 'Credit Card',
        fixedLabel: params.ccnumberfixedLabel || true,
        required: params.required,
        debug: params.debug
      })), React.createElement("div", {
        style: {
          width: '25%'
        },
        className: "col"
      }, this.textField('ccexpire', {
        label: params.ccxpireLabel || 'Expiration',
        fixedLabel: params.ccexpirefixedLabel || true,
        placeholder: 'MM/YY',
        required: params.required,
        validate: 'ccexpire',
        maxLength: 5,
        count: false,
        debug: params.debug
      })), React.createElement("div", {
        className: "clear"
      }));
    }
  }, {
    key: "checkForErrors",
    value: function checkForErrors(fields, group) {
      var error = false;
      Object.entries(fields).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (value.group === group || value.group === 'all') {
          if (value.error) error = true;
        }
      });
      this.formProp({
        error: error
      });
      return error;
    }
    /**
    * Get Errors returned from the API
    * @param {object} err Error response returned
    *
    * TODO: get this cleaned up on the API side to have consistent responses
    */

  }, {
    key: "getErrors",
    value: function getErrors(err) {
      var error = false;

      if (has(err, 'response')) {
        // Make sure the err has response prop before continuing
        if (has(err.response, 'data')) {
          // Make sure the response has data prop before continuing
          // Handle single error
          if (has(err.response.data, 'message')) {
            if (err.response.data.code === 'vantiv_payfac' && this.props.hideVantivErrors) {
              // Show the hideVantivErrors message
              this.formProp({
                error: "".concat(this.props.hideVantivErrors)
              });
              error = this.props.hideVantivErrors;
            } else {
              this.formProp({
                error: "".concat(err.response.data.message)
              });
              error = err.response.data.message;
            }
          }

          if (has(err.response.data, 'errors')) {
            // Handle multiple errors
            var errors = err.response.data.errors;

            for (var i = 0; i <= errors.length; i++) {
              if (!isEmpty(errors[i])) {
                if (has(errors[i], 'field')) {
                  if (has(this.state.fields, errors[i].field)) {
                    this.fieldProp(errors[i].field, {
                      error: "The following error occurred while saving, ".concat(errors[i].message)
                    });
                  }
                }

                if (has(errors[i], 'message')) {
                  error = i === 0 ? errors[0].message : "".concat(error, ", ").concat(errors[i].message);
                }
              }
            }

            this.formProp({
              error: "Error saving: ".concat(error)
            });
          }
        }
      }

      return error;
    }
  }, {
    key: "formSaved",
    value: function formSaved(callback) {
      var _this2 = this;

      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2500;
      this.formProp({
        saved: true,
        updated: false
      });

      if (timeout) {
        setTimeout(function () {
          _this2.formProp({
            saved: false
          });

          if (callback) callback();
        }, timeout);
      }

      return;
    }
  }, {
    key: "saveButton",
    value: function saveButton(callback) {
      var _this3 = this;

      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Save';
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return React.createElement("button", {
        className: "button",
        style: style,
        type: "button",
        disabled: this.state.updated ? false : true,
        onClick: function onClick(e) {
          return _this3.validateForm(e, callback);
        }
      }, label);
    }
  }, {
    key: "errorAlert",
    value: function errorAlert() {
      return React.createElement(Alert, {
        alert: "error",
        msg: this.state.error
      });
    }
  }, {
    key: "successAlert",
    value: function successAlert() {
      return React.createElement(Alert, {
        alert: "success",
        msg: this.state.saved
      });
    }
  }, {
    key: "fieldError",
    value: function fieldError(name, msg) {
      var error = false;

      if (has(this.state.fields, name)) {
        if (this.state.fields[name].error) error = this.state.fields[name].error;
      }

      return React.createElement("div", {
        className: "error ".concat(!error && 'displayNone')
      }, msg ? msg : error);
    }
  }, {
    key: "validateForm",
    value: function validateForm(e, callback) {
      var group = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';
      var bindthis = this;
      e.preventDefault();
      var fields = this.state.fields;
      var groupFields = {};
      Object.entries(fields).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        if ((value.group === group || value.group === 'all') && value.autoReturn) {
          groupFields[key] = value;

          if (value.required && !value.value) {
            bindthis.fieldProp(key, {
              error: _v.msgs.required
            });
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
  }, {
    key: "validateField",
    value: function validateField(key, validate, value) {
      switch (validate) {
        case 'email':
          if (!_v.validateEmail(value)) this.fieldProp(key, {
            error: _v.msgs.email
          });
          break;

        case 'password':
          if (!_v.validatePassword(value)) this.fieldProp(key, {
            error: _v.msgs.password
          });
          break;

        case 'taxID':
          if (!_v.validateTaxID(value)) this.fieldProp(key, {
            error: _v.msgs.taxID
          });
          break;

        case 'ssn':
          if (!_v.validateTaxID(value)) this.fieldProp(key, {
            error: _v.msgs.ssn
          });
          break;

        case 'phone':
          if (!_v.validatePhone(value)) this.fieldProp(key, {
            error: _v.msgs.phone
          });
          break;

        case 'descriptor':
          if (!_v.validateDescriptor(value)) this.fieldProp(key, {
            error: _v.msgs.descriptor
          });
          break;

        case 'url':
          if (!_v.validateURL(value)) this.fieldProp(key, {
            error: _v.msgs.url
          });
          break;

        case 'money':
          if (!_v.validateMoney(value, _v.limits.txMin, _v.limits.txMax)) this.fieldProp(key, {
            error: _v.msgs.money
          });
          break;

        case 'calendarRange':
          if (!_v.validateCalendarRange(key, this.state.fields)) this.fieldProp(key, {
            error: _v.msgs.calendarRange
          });
          break;

        case 'creditCard':
          if (!_v.validateCardTypes(value)) this.fieldProp(key, {
            error: _v.msgs.creditCard
          });
          break;
        // no default
      }

      return;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var _this4 = this;

      var childrenWithProps = React.Children.map(this.props.children, function (child) {
        return React.cloneElement(child, {
          validateForm: _this4.validateForm,
          formProp: _this4.formProp,
          fieldProp: _this4.fieldProp,
          formSaved: _this4.formSaved,
          saveButton: _this4.saveButton,
          getErrors: _this4.getErrors,
          formState: _this4.state,
          textField: _this4.textField,
          richText: _this4.richText,
          creditCardGroup: _this4.creditCardGroup,
          dropdown: _this4.dropdown,
          choice: _this4.choice,
          calendarField: _this4.calendarField,
          calendarRange: _this4.calendarRange,
          savingErrorMsg: _v.msgs.savingError,
          responseData: _this4.props.responseData,
          fieldError: _this4.fieldError,
          errorAlert: _this4.errorAlert,
          successAlert: _this4.successAlert,
          name: _this4.props.name
        });
      });
      return childrenWithProps;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          name = _this$props.name,
          className = _this$props.className,
          errorMsg = _this$props.errorMsg,
          successMsg = _this$props.successMsg;
      return React.createElement("form", {
        autoComplete: "new-password",
        name: name,
        id: id,
        className: "".concat(id, " ").concat(className || ''),
        onSubmit: this.validateForm,
        noValidate: true
      }, this.props.isSending && React.createElement(Loader, {
        msg: 'Sending data'
      }), errorMsg && this.errorAlert(), successMsg && this.successAlert(), this.renderChildren());
    }
  }]);

  return Form;
}(Component);

Form.defaultProps = {
  errorMsg: true,
  successMsg: true,
  hideVantivErrors: false
};

function mapStateToProps(state, props) {
  var id = props.name + '-form';
  var responseData;
  if (has(state.send, props.name)) responseData = state.send[props.name].response;
  return {
    id: id,
    isSending: state.send.isSending,
    responseData: responseData
  };
}

export default connect(mapStateToProps, {})(Form);