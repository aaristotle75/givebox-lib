import React, { Component } from 'react';

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
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} checkbox-group  ${error ? 'error tooltip' : ''}`
    }, React.createElement("input", {
      type: "checkbox",
      name: name,
      onChange: () => onChange(name),
      checked: checked,
      className: "checkbox",
      id: id
    }), React.createElement("label", {
      htmlFor: id
    }), label && React.createElement("label", {
      onClick: () => onChange(name)
    }, label), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, this.props.error, React.createElement("i", null)), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error));
  }

}

Checkbox.defaultProps = {
  name: 'defaultCheckbox',
  label: 'Checkbox'
};
export default Checkbox;