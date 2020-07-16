import React, { Component } from 'react';
import PasswordStrength from './PasswordStrength';
import CharacterCount from './CharacterCount';
import Fade from '../common/Fade';

class TextField extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.inputRef = /*#__PURE__*/React.createRef();
    this.state = {
      status: 'idle',
      color: props.color,
      maxLength: props.maxLength
    };
  }

  componentDidMount() {
    const params = Object.assign({}, this.props.params, {
      ref: this.props.inputRef || this.inputRef
    });
    if (params.type === 'hidden') params.required = false;
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.color !== this.props.color) {
      this.setState({
        color: this.props.color
      });
    }

    if (prevProps.maxLength !== this.props.maxLength) {
      this.setState({
        maxLength: this.props.maxLength
      });
    }
  }

  onFocus(e) {
    e.preventDefault();
    this.setState({
      status: 'active'
    });
    if (this.props.onFocus) this.props.onFocus(e);
  }

  onBlur(e) {
    e.preventDefault();
    this.setState({
      status: 'idle'
    });
    if (this.props.onBlur) this.props.onBlur(e);
  }

  render() {
    const {
      id,
      name,
      type,
      placeholder,
      autoFocus,
      required,
      readOnly,
      style,
      inputStyle,
      label,
      customLabel,
      fixedLabel,
      className,
      error,
      errorType,
      value,
      strength,
      count,
      symbol,
      money,
      inputRef,
      inputMode,
      moneyStyle,
      autoComplete
    } = this.props;
    const {
      status,
      color,
      maxLength
    } = this.state;
    const labelStyle = {
      color: status === 'active' ? color : ''
    };
    const inputBottomStyle = {
      background: status === 'active' ? color : ''
    };
    const readOnlyText = this.props.readOnlyText || `${label} is not editable`;
    return /*#__PURE__*/React.createElement("div", {
      style: style,
      className: `input-group ${type === 'hidden' ? 'input-hidden' : ''} ${className || ''} textfield-group ${readOnly ? 'readOnly tooltip' : ''} ${error ? 'error tooltip' : ''} ${type === 'hidden' && 'hidden'} ${money ? 'money-group' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `floating-label ${this.state.status} ${fixedLabel && 'fixed'}`
    }, money && /*#__PURE__*/React.createElement("div", {
      style: moneyStyle,
      className: `moneyAmount ${value ? 'active' : 'noValue'}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "symbol"
    }, symbol)), /*#__PURE__*/React.createElement("input", {
      autoFocus: autoFocus,
      id: id || name,
      ref: inputRef || this.inputRef,
      name: name,
      type: type,
      placeholder: placeholder,
      required: type === 'hidden' ? false : required,
      readOnly: readOnly,
      onChange: this.props.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      autoComplete: autoComplete,
      value: value,
      maxLength: maxLength,
      style: inputStyle,
      inputMode: inputMode
    }), (customLabel || label) && /*#__PURE__*/React.createElement("label", {
      style: labelStyle,
      htmlFor: name
    }, customLabel || label), /*#__PURE__*/React.createElement("div", {
      style: inputBottomStyle,
      className: `input-bottom ${error ? 'error' : this.state.status}`
    }), this.props.children, strength && /*#__PURE__*/React.createElement(PasswordStrength, {
      password: value,
      error: error
    }), /*#__PURE__*/React.createElement("div", {
      className: "customLink"
    }, this.props.customLink) || '', count && type !== 'password' && type !== 'hidden' && /*#__PURE__*/React.createElement(Fade, {
      in: this.state.status === 'active' && value ? true : false,
      duration: 200
    }, /*#__PURE__*/React.createElement(CharacterCount, {
      max: maxLength,
      count: value.length
    }))), /*#__PURE__*/React.createElement("div", {
      className: `tooltipTop ${(errorType !== 'tooltip' || strength) && 'displayNone'}`
    }, error, readOnly ? readOnlyText : '', /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error));
  }

}

TextField.defaultProps = {
  name: 'defaultTextField',
  type: 'text',
  maxLength: 64,
  symbol: '$',
  money: false,
  inputRef: null,
  inputStyle: {},
  moneyStyle: {},
  autoComplete: 'nope'
};
export default TextField;