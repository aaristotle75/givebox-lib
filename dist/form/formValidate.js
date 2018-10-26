export function validateEmail(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}
export function validateMoney(value, min, max) {
  var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var validate = true;
  if (!value) value = 0;
  var moneyRegex = /^\$?(([1-9]{1}[0-9]*(?:,[0-9]{3})*)|(?:0))(?:\.[0-9]{1,2})?$/;

  if (!decimal) {
    moneyRegex = /^\$?(([1-9]{1}[0-9]*(?:,[0-9]{3})*)|(?:0))$/;
  }

  var match = moneyRegex.exec(value);

  if (match === null) {
    validate = false;
  }

  if (match) {
    var amount = parseFloat(match[0].replace(/,/g, ''));

    if (amount < min || amount > max) {
      validate = false;
    }
  }

  return validate;
} // identify by the first 4 digits

export function identifyCardTypes(ccnumber) {
  if (/^4[0-9]{3}$/.test(ccnumber)) {
    return 'visa';
  } else if (/^5[1-5][0-9]{2}$/.test(ccnumber)) {
    return 'mastercard';
  } else if (/^3[47][0-9]{2}$/.test(ccnumber)) {
    return 'amex';
  } else if (/^6(?:011|5[0-9]{2})$/.test(ccnumber)) {
    return 'discover';
  } else {
    return 'noCardType';
  }
} // validate the full length card number

export function validateCardTypes(ccnumber) {
  // Check VISA
  if (/^4[0-9]{12}(?:[0-9]{3})$/.test(ccnumber)) {
    return true; // Check Mastercard
  } else if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(ccnumber)) {
    return true; // Check AMEX
  } else if (/^3[47][0-9]{13}$/.test(ccnumber)) {
    return true; // Check Discover
  } else if (/ ^6(?:011|5[0-9]{2})[0-9]{12}$ /.test(ccnumber)) {
    return true; // Default to no checkmark
  } else {
    return false;
  }
}
export function formatCreditCard(value) {
  var obj = {
    value: value.replace(/[^0-9]/g, '').replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim(),
    apiValue: value.split(' ').join('')
  };
  return obj;
}
export function formatCCExpire(value) {
  var ccexpirevalue = value.replace(/[^0-9]/g, '').replace(/\//g, '').replace(/(\d{2})/g, '$1\/').replace(/\/$/, '');
  return ccexpirevalue;
}
export function validateEmailList(value) {
  var optional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var validate = true;

  if (optional && !value) {
    return validate;
  }

  var arr = value.split(/,/);

  for (var i = 0; i < arr.length; i++) {
    if (!validateEmail(arr[i].trim())) {
      validate = false;
    }
  }

  return validate;
}
export function validateURL(url) {
  var validate = true;
  var regex = /^((https?|s?ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  validate = regex.test(url);
  if (url.substr(0, 7) !== 'http://' && url.substr(0, 8) !== 'https://') validate = false;
  return validate;
}
export function validateTaxID(value) {
  var regex = /^(?:\d{3}-\d{2}-\d{4}|\d{2}-\d{7})$/;
  return regex.test(value);
}
export function formatTaxID(value) {
  var length = value.length;
  if (length > 10) return '';
  var val = value.replace(/\D/g, '');
  var newVal = '';

  if (val.length > 2) {
    this.value = val;
  }

  if (val.length > 2 && val.length < 10) {
    newVal += val.substr(0, 2) + '-';
    val = val.substr(2);
  }

  newVal += val;
  value = newVal.substring(0, 10);
  return value;
}
export function formatSSN(value) {
  var length = value.length;
  if (length > 11) return '';
  var val = value.replace(/\D/g, '');
  var newVal = '';

  if (val.length > 4) {
    this.value = val;
  }

  if (val.length > 3 && val.length < 6) {
    newVal += val.substr(0, 3) + '-';
    val = val.substr(3);
  }

  if (val.length > 5) {
    newVal += val.substr(0, 3) + '-';
    newVal += val.substr(3, 2) + '-';
    val = val.substr(5);
  }

  newVal += val;
  value = newVal.substring(0, 11);
  return value;
}
export function validateDescriptor(value) {
  var regex = /^([a-zA-Z0-9,-.]){3,21}$/;
  return regex.test(value);
}
export function validateDL(value) {
  var regex = /^([a-zA-Z0-9]){6,25}$/;
  return regex.test(value);
}
export function validatePhone(value) {
  value = value.replace("(", "");
  value = value.replace(")", "");
  value = value.replace(" ", "");
  value = value.replace("-", "");
  var regex = /\d{10}/g;
  return regex.test(value);
}
export function formatPhone(value) {
  var x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  return value;
}
export function checkHTTP(value) {
  if (value.indexOf("http://") === 0) return value;
  if (value.indexOf("https://") === 0) return value;
  return value ? 'http://' + value : value;
}
export function validateRichText(value) {
  return value;
}
export function clearRichTextIfShouldBeEmpty(value) {
  if (typeof value === 'string') value = value.replace('<p><br></p>', '');
  return value;
}
export var msgs = {
  required: 'Field is required.',
  email: 'Please enter a valid email address.',
  taxID: 'Please enter a valid Tax ID. It should be in the format of xx-xxxxxxx and have 9 digits.',
  ssn: 'Please enter a valid Social Security Number. It should be in the format xxx-xx-xxxx and have 9 digits.',
  phone: 'Please enter a valid Phone Number. It should be in the format (xxx) xxx-xxxx and have 10 digits.',
  descriptor: 'Please enter a valid Descriptor. It should be between 3 - 21 characters long and contain only letters, numbers, commas, periods or dashes.',
  url: 'Please enter a valid URL. It should begin with either http:// or https:// and end in .com, .co or any other valid Top Level Domain (TLD).',
  money: 'Please enter a valid amount between 1 to 25,000 with or without a comma and decimal point.',
  success: 'Saved successfully.',
  error: 'Please fix the following errors to continue.',
  savingError: 'There was a system error trying to save. Please contact support@givebox.com if this error persists.'
};
export var limits = {
  txMin: 1,
  txMax: 25000
};