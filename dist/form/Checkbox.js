import React, { Component } from 'react';

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
    this.setState({
      checked
    });
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
    return (/*#__PURE__*/React.createElement("div", {
        style: style,
        className: `input-group ${className || ''} checkbox-group  ${error ? 'error tooltip' : ''}`
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        name: name,
        onChange: this.onChange,
        checked: checked,
        className: "checkbox",
        id: id
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: id
      }), label && /*#__PURE__*/React.createElement("label", {
        className: "label",
        onClick: this.onChange
      }, label), /*#__PURE__*/React.createElement("div", {
        className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
      }, this.props.error, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
        className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
      }, error))
    );
  }

}

Checkbox.defaultProps = {
  name: 'defaultCheckbox',
  label: 'Checkbox'
};
export default Checkbox;