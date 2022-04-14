import React, { Component } from 'react';
import { cloneObj } from '../common/utility';
import GBLink from '../common/GBLink';
import Toggle from 'react-toggle';
import has from 'has';

class Choice extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeLink = this.onChangeLink.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    let params = cloneObj(this.props.params);
    let value = params.value === params.checked ? params.value : params.checked;
    params = Object.assign(params, {value: value});
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.type === 'checkbox') {
      if (has(this.props, 'params')) {
        if (prevProps.params.value !== this.props.params.value) {
          this.props.onChange(this.props.name);
        }
      }
    }
  }

  onBlur() {
    if (this.props.onBlur) this.props.onBlur();
  }

  onChange(name, value) {
    if (this.props.onChange) this.props.onChange(name, value);
    else console.error('No props onChange');
  }

  onChangeLink(name, value) {
    if (this.props.onChange) this.props.onChange(name, value);
    else console.error('No props onChange');
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
      checked,
      useIcon,
      color,
      toggle
    } = this.props;

    let id = type === 'radio' ? `${value}-${type}` : `${name}-${type}`;

    let isChecked = checked;
    if (type === 'radio') isChecked = checked === value ? true : false;
    isChecked = isChecked ? true : false;

    return (
      <div style={style} className={`choice-group ${className || ''} ${type}-group  ${error ? 'error tooltip' : ''}`}>
        {(useIcon || toggle) && type !== 'radio' ?
          toggle ?
            <Toggle
              icons={false}
              checked={isChecked}
              onChange={() => this.onChange(name, value)}
            />
          :
            <GBLink style={{ color: !error ? color : '' }} onClick={() => this.onChangeLink(name, value)}>
              {isChecked ? <span className='icon icon-check-square'></span> : <span className='icon icon-square'></span>}
            </GBLink>
        :
        <input
          type={type}
          name={name}
          onChange={() => this.onChange(name, value)}
          checked={isChecked}
          className={type}
          id={id}
          value={value || checked}
        />
        }
        <label htmlFor={id}></label>
        {label && <label className='label' onClick={() => {
          this.onChange(name, value);
          if (this.props.labelClick) this.props.labelClick();
        }}>{label}</label>}
        {!error ? this.props.children : null}
        {error ?
        <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
          {this.props.error}
          <i></i>
        </div> : null }
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
      </div>
    );
  }
}

Choice.defaultProps = {
  errorType: 'tooltip',
  type: 'checkbox',
  useIcon: true,
  toggle: false
}

export default Choice;
