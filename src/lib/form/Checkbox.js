import React, {Component} from 'react';

class Checkbox extends Component {

  componentDidMount() {
    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
  }

  render() {

    const {
      name,
      label,
      className,
      style,
      onChange,
      checked,
      error,
      errorType
    } = this.props;

    let id = `${name}-checkbox`;

    return (
      <div style={style} className={`input-group ${className || ''} checkbox-group  ${error ? 'error tooltip' : ''}`}>
        <input
          type='checkbox'
          name={name}
          onChange={() => onChange(name)}
          checked={checked}
          className='checkbox'
          id={id}
        />
          <label htmlFor={id}></label>
          {label && <label onClick={() => onChange(name)}>{label}</label>}
          <div className={`tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`}>
            {this.props.error}
            <i></i>
          </div>
          <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
      </div>
    );
  }
}

Checkbox.defaultProps = {
  name: 'defaultCheckbox',
  label: 'Checkbox'
}

export default Checkbox;
