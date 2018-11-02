import React from 'react';

const FormError = ({error, style}) => {
  return (
    <div className={`${error ? 'error' : 'displayNone'}`}>
      <span className='icon icon-error-circle'></span> {error}
    </div>
  )
}

export default FormError
