import React, {Component} from 'react';

class Checkbox extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      checked: this.props.checked
    };
  }

  componentDidMount() {
    if (this.props.createField) this.props.createField(this.props.name, this.props.params);
  }

  onChange() {
    const checked = this.state.checked ? false : true;
    this.setState({ checked });
    this.props.onChange(checked, this.props.name);
  }

  render() {

    const {
      name,
      label,
      className,
      style,
      error,
      errorType
    } = this.props;

    const {
      checked
    } = this.state;

    let id = `${name}-checkbox`;

    return (
      <div style={style} className={`input-group ${className || ''} checkbox-group  ${error ? 'error tooltip' : ''}`}>
        <input
          type='checkbox'
          name={name}
          onChange={this.onChange}
          checked={checked}
          className='checkbox'
          id={id}
        />
          <label htmlFor={id}></label>
          {label && <label className='label' onClick={this.onChange}>{label}</label>}
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
