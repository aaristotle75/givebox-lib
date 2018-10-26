import React from 'react';

var FormError = function FormError(_ref) {
  var error = _ref.error,
      style = _ref.style;
  return React.createElement("div", {
    className: "".concat(error ? 'error' : 'displayNone')
  }, React.createElement("span", {
    className: "icon icon-error-circle"
  }), " ", error);
};

export default FormError;