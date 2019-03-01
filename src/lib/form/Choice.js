import React, { Component } from 'react';
import { cloneObj } from '../common/utility';

class Choice extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let params = cloneObj(this.props.params);
    let value = params.value === params.checked ? params.value : params.checked;
    params = Object.assign(params, {value: value});
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.type === 'checkbox') {
      if (prevProps.params.value !== this.props.params.value) {
        this.props.onChange(this.props.name);
      }
    }
  }

  onChange(name, value) {
    this.props.onChange(name, value);
  }

  render() {

    const {
      name,
      type,
      label,
      className,
      style,
      error,
      errorType,
      value,
      checked
    } = this.props;

    let id = type === 'radio' ? `${value}-${type}` : `${name}-${type}`;

    let isChecked = checked;
    if (type === 'radio') isChecked = checked === value ? true : false;

    return (
      <div style={style} className={`choice-group ${className || ''} ${type}-group  ${error ? 'error tooltip' : ''}`}>
        <input
          type={type}
          name={name}
          onChange={() => this.onChange(name, value)}
          checked={isChecked}
          className={type}
          id={id}
          value={value || checked}
        />
          <label htmlFor={id}></label>
          {label && <label className='label' onClick={() => this.onChange(name, value)}>{label}</label>}
          <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
            {this.props.error}
            <i></i>
          </div>
          <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
      </div>
    );
  }
}

Choice.defaultProps = {
}

export default Choice;
