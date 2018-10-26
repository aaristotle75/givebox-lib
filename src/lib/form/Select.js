import React, { Component } from 'react';
import { isEmpty } from '../common/utility';

class Select extends Component {

  constructor(props) {
    super(props);
    this.listOptions = this.listOptions.bind(this);
  }

  listOptions() {
    var items = [];
    const options = this.props.options;
    if (!isEmpty(options)) {
      Object.keys(options).forEach(function(key) {
        items.push(
          <option key={options[key]} value={options[key].value}>{options[key].primaryText}</option>
        );
      });
    }
    return items ? items : <option>None</option>;
  }

  render() {

    const {
      name,
      className,
      style,
      onChange,
      selected,
      required
    } = this.props;

    return (
      <select
        name={name}
        className={className}
        style={style}
        onChange={onChange}
        value={selected}
        required={required}
        autoComplete="off"
      >
        {this.listOptions()}
      </select>
    );
  }
}

Select.defaultProps = {
  name: 'defaultSelect',
  buttonLabel: 'Select One'
}

export default Select;
