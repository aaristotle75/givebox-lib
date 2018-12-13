import React from 'react';

const FormError = ({
  error,
  style
}) => {
  return React.createElement("div", {
    className: `${error ? 'error' : 'displayNone'}`
  }, React.createElement("span", {
    className: "icon icon-error-circle"
  }), " ", error);
};

export default FormError;