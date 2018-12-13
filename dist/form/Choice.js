import React, { Component } from 'react';
import { cloneObj } from '../common/utility';

class Choice extends Component {
  componentDidMount() {
    let params = cloneObj(this.props.params);
    let value = params.value === params.checked ? params.value : params.checked;
    params = Object.assign(params, {
      value: value
    });
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  render() {
    const {
      name,
      type,
      label,
      className,
      style,
      onChange,
      checked,
      value,
      error,
      errorType
    } = this.props;
    let id = type === 'radio' ? `${value}-${type}` : `${name}-${type}`;
    let isChecked = checked;
    if (type === 'radio') isChecked = checked === value ? true : false;
    return React.createElement("div", {
      style: style,
      className: `choice-group ${className || ''} ${type}-group  ${error ? 'error tooltip' : ''}`
    }, React.createElement("input", {
      type: type,
      name: name,
      onChange: () => onChange(name, value),
      checked: isChecked,
      className: type,
      id: id,
      value: value || checked
    }), React.createElement("label", {
      htmlFor: id
    }), label && React.createElement("label", {
      className: "label",
      onClick: () => onChange(name, value)
    }, label), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, this.props.error, React.createElement("i", null)), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error));
  }

}

Choice.defaultProps = {};
export default Choice;