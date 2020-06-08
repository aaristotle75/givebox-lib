import React, { Component } from 'react';
import Fade from '../common/Fade';
import * as _v from './formValidate';
import * as util from '../common/utility';

const lookup = require('binlookup')('8e161ba2-5874-40d0-834c-b63cf8468c9f');

class CreditCard extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.inputRef = /*#__PURE__*/React.createRef();
    this.state = {
      status: 'idle',
      cardType: 'default'
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

  onChange(e) {
    e.preventDefault();
    const name = e.target.name;

    const obj = _v.formatCreditCard(e.target.value);

    const length = obj.apiValue.length;
    let doBinLookup = false;
    let cardType = length < 4 ? 'default' : this.state.cardType;

    if (length === 4) {
      cardType = _v.identifyCardTypes(obj.apiValue.slice(0, 4));
    }

    if ((cardType === 'amex' || cardType === 'default') && length === 15 || (cardType !== 'amex' || cardType === 'default') && length === 16) doBinLookup = true;

    if (doBinLookup) {
      lookup(obj.apiValue.slice(0, 9), (err, data) => {
        const cardType = util.getValue(data, 'scheme', 'default');
        this.setState({
          cardType
        }, () => {
          this.props.onChange(name, obj.value, cardType);
          this.props.fieldProp('ccnumber', {
            binData: data
          });
        });
      });
    } else {
      this.setState({
        cardType
      }, this.props.onChange(name, obj.value, cardType));
    }
  }

  render() {
    const {
      name,
      label,
      fixedLabel,
      placeholder,
      autoFocus,
      required,
      readOnly,
      style,
      className,
      error,
      errorType,
      value,
      hideLabel,
      color
    } = this.props;
    const {
      cardType,
      status
    } = this.state;
    const labelStyle = {
      color: status === 'active' ? color : ''
    };
    const inputBottomStyle = {
      background: status === 'active' ? color : ''
    }; //const hideCardsAccepted = value ? cardType !== 'default' ? true : false : false;

    return (/*#__PURE__*/React.createElement("div", {
        style: style,
        className: `input-group ${className || ''} creditCard ${error ? 'error tooltip' : ''}`
      }, /*#__PURE__*/React.createElement(Fade, {
        in: true
      }, /*#__PURE__*/React.createElement("div", {
        className: `cardsAccepted`
      })), /*#__PURE__*/React.createElement("div", {
        className: `floating-label ${fixedLabel && 'fixed'}`
      }, /*#__PURE__*/React.createElement(Fade, {
        in: cardType ? true : false
      }, /*#__PURE__*/React.createElement("div", {
        className: `cardType ${cardType}`
      })), /*#__PURE__*/React.createElement("input", {
        autoFocus: autoFocus,
        ref: this.inputRef,
        name: name,
        type: 'text',
        readOnly: readOnly,
        required: required,
        placeholder: placeholder,
        onChange: this.onChange,
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        autoComplete: "new-password",
        value: value,
        maxLength: 19,
        inputMode: "numeric"
      }), !hideLabel && label && /*#__PURE__*/React.createElement("label", {
        style: labelStyle,
        htmlFor: name
      }, label), /*#__PURE__*/React.createElement("div", {
        style: inputBottomStyle,
        className: `input-bottom ${error ? 'error' : this.state.status}`
      })), /*#__PURE__*/React.createElement("div", {
        className: `tooltipTop ${errorType !== 'tooltip' && 'displayNone'}`
      }, error, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
        className: `errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`
      }, error))
    );
  }

}

CreditCard.defaultProps = {
  name: 'defaultCreditCardField',
  type: 'text',
  checked: false,
  placeholder: 'xxxx xxxx xxxx xxxx',
  hideLabel: false
};
export default CreditCard;