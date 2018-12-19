import React, { Component } from 'react';
import PasswordStrength from './PasswordStrength';
import CharacterCount from './CharacterCount';
import Fade from '../common/Fade';
import { money } from '../common/utility';

class TextField extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      status: 'idle'
    };
  }

  componentDidMount() {
    const params = Object.assign({}, this.props.params, {
      ref: this.inputRef
    });
    if (params.type === 'hidden') params.required = false;
    if (this.props.createField) this.props.createField(this.props.name, params);
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
      label,
      fixedLabel,
      className,
      error,
      errorType,
      maxLength,
      value,
      strength,
      count,
      symbol,
      money
    } = this.props;
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} textfield-group ${error ? 'error tooltip' : ''} ${type === 'hidden' && 'hidden'} ${money ? 'money-group' : ''}`
    }, React.createElement("div", {
      className: `floating-label ${this.state.status} ${fixedLabel && 'fixed'}`
    }, money && React.createElement("div", {
      className: `moneyAmount ${value ? 'active' : ''}`
    }, React.createElement("span", {
      className: "symbol"
    }, symbol)), React.createElement("input", {
      autoFocus: autoFocus,
      id: id || name,
      ref: this.inputRef,
      name: name,
      type: type,
      placeholder: placeholder,
      required: type === 'hidden' ? false : required,
      readOnly: readOnly,
      onChange: this.props.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      autoComplete: "new-password",
      value: value,
      maxLength: maxLength
    }), label && React.createElement("label", {
      htmlFor: name
    }, label), React.createElement("div", {
      className: `input-bottom ${error ? 'error' : this.state.status}`
    }), this.props.children, strength && React.createElement(PasswordStrength, {
      password: value,
      error: error
    }), count && type !== 'password' && type !== 'hidden' && React.createElement(Fade, {
      in: this.state.status === 'active' && value ? true : false,
      duration: 200
    }, React.createElement(CharacterCount, {
      max: maxLength,
      count: value.length
    }))), React.createElement("div", {
      className: `tooltipTop ${(errorType !== 'tooltip' || strength) && 'displayNone'}`
    }, error, React.createElement("i", null)), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error));
  }

}

TextField.defaultProps = {
  name: 'defaultTextField',
  type: 'text',
  maxlength: 64,
  symbol: '$',
  money: false
};
export default TextField;