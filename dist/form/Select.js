import React, { Component } from 'react';
import { isEmpty } from '../common/utility';

class Select extends Component {
  constructor(props) {
    super(props);
    this.listOptions = this.listOptions.bind(this);
  }

  listOptions() {
    const items = [];
    const options = this.props.options;

    if (!isEmpty(options)) {
      options.forEach(function (value, key) {
        items.push( /*#__PURE__*/React.createElement("option", {
          key: key,
          value: value.value
        }, value.primaryText));
      });
    }

    return items ? items : /*#__PURE__*/React.createElement("option", null, "None");
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
    return (/*#__PURE__*/React.createElement("select", {
        name: name,
        className: className,
        style: style,
        onChange: onChange,
        value: selected,
        required: required,
        autoComplete: "off"
      }, this.listOptions())
    );
  }

}

Select.defaultProps = {
  name: 'defaultSelect',
  buttonLabel: 'Select One'
};
export default Select;