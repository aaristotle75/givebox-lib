import React, { Component } from 'react';

class TextField extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const params = Object.assign({}, this.props.params, { ref: this.inputRef });
    if (params.type === 'hidden') params.required = false;
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  render() {

    const {
      id,
      name,
      type,
      placeholder,
      autoFocus,
      required,
      readOnly,
      style,
      label,
      className,
      error,
      errorType,
      maxLength,
      value
    } = this.props;

    return (
        <div style={style} className={`input-group ${className || ''} textfield-group ${error ? 'error tooltip' : ''}`}>
          {label && <label>{label}</label>}
          <input
            autoFocus={autoFocus}
            id={id || name}
            ref={this.inputRef}
            name={name}
            type={type}
            placeholder={placeholder}
            required={type === 'hidden' ? false : required}
            readOnly={readOnly}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
            autoComplete='new-password'
            value={value}
            maxLength={maxLength}
          />
          {this.props.children}
          <div className={`tooltipTop ${errorType !=='tooltip' && 'displayNone'}`}>
            {error}
            <i></i>
          </div>
          <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
        </div>
    );
  }
}

TextField.defaultProps = {
  name: 'defaultTextField',
  type: 'text',
  maxlength: 64
}

export default TextField;
