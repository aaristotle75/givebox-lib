import React, {Component} from 'react';

class Select extends Component {

  constructor(props) {
    super(props);
    this.listOptions = this.listOptions.bind(this);
  }

  listOptions() {
    var items = [];
    if (!_.isEmpty(this.props.options)) {
      _.each(this.props.options, function(value, key) {
        items.push(
          <option key={key} value={value.value}>{value.primaryText}</option>
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
      buttonLabel,
      onChange,
      selected,
      required,
      value
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
