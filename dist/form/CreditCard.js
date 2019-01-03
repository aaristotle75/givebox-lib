import React, { Component } from 'react';
import Fade from '../common/Fade';

class CreditCard extends Component {
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
    let params = Object.assign({}, this.props.params, {
      ref: this.inputRef
    });
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
      name,
      label,
      fixedLabel,
      cardType,
      placeholder,
      autoFocus,
      required,
      readOnly,
      style,
      className,
      error,
      errorType,
      maxLength,
      value,
      checked
    } = this.props;
    const hideCardsAccepted = value ? cardType !== 'noCardType' ? true : false : false;
    return React.createElement("div", {
      style: style,
      className: `input-group ${className || ''} creditCard ${error ? 'error tooltip' : ''}`
    }, React.createElement(Fade, {
      in: hideCardsAccepted ? false : true
    }, React.createElement("div", {
      className: `cardsAccepted`
    })), React.createElement("div", {
      className: `floating-label ${fixedLabel && 'fixed'}`
    }, React.createElement(Fade, {
      in: cardType ? true : false
    }, React.createElement("div", {
      className: `cardType ${cardType}`
    })), React.createElement("input", {
      autoFocus: autoFocus,
      ref: this.inputRef,
      name: name,
      type: 'text',
      readOnly: readOnly,
      required: required,
      placeholder: placeholder,
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
    })), React.createElement(Fade, {
      duration: 200,
      in: checked ? true : false
    }, React.createElement("div", {
      className: `checkmark`
    }, React.createElement("i", {
      className: "icon icon-check"
    }))), React.createElement("div", {
      className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
    }, error, React.createElement("i", null)), React.createElement("div", {
      className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
    }, error));
  }

}

CreditCard.defaultProps = {
  name: 'defaultCreditCardField',
  type: 'text',
  maxlength: 64,
  cardType: 'noCardType',
  checked: false
};
export default CreditCard;