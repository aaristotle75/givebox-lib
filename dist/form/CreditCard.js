import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import Fade from '../common/Fade';

var CreditCard =
/*#__PURE__*/
function (_Component) {
  _inherits(CreditCard, _Component);

  function CreditCard(props) {
    var _this;

    _classCallCheck(this, CreditCard);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreditCard).call(this, props));
    _this.onFocus = _this.onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.inputRef = React.createRef();
    _this.state = {
      status: 'idle'
    };
    return _this;
  }

  _createClass(CreditCard, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var params = Object.assign({}, this.props.params, {
        ref: this.inputRef
      });
      if (this.props.createField) this.props.createField(this.props.name, params);
    }
  }, {
    key: "onFocus",
    value: function onFocus(e) {
      e.preventDefault();
      this.setState({
        status: 'active'
      });
      if (this.props.onFocus) this.props.onFocus(e);
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      e.preventDefault();
      this.setState({
        status: 'idle'
      });
      if (this.props.onBlur) this.props.onBlur(e);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          label = _this$props.label,
          fixedLabel = _this$props.fixedLabel,
          cardType = _this$props.cardType,
          placeholder = _this$props.placeholder,
          autoFocus = _this$props.autoFocus,
          required = _this$props.required,
          readOnly = _this$props.readOnly,
          style = _this$props.style,
          className = _this$props.className,
          error = _this$props.error,
          errorType = _this$props.errorType,
          maxLength = _this$props.maxLength,
          value = _this$props.value,
          checked = _this$props.checked;
      var hideCardsAccepted = value ? cardType !== 'noCardType' ? true : false : false;
      return React.createElement("div", {
        style: style,
        className: "input-group ".concat(className || '', " creditCard ").concat(error ? 'error tooltip' : '')
      }, React.createElement(Fade, {
        in: hideCardsAccepted ? false : true
      }, React.createElement("div", {
        className: "cardsAccepted"
      })), React.createElement("div", {
        className: "floating-label ".concat(fixedLabel && 'fixed')
      }, React.createElement(Fade, {
        in: cardType ? true : false
      }, React.createElement("div", {
        className: "cardType ".concat(cardType)
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
        className: "input-bottom ".concat(error ? 'error' : this.state.status)
      })), React.createElement(Fade, {
        duration: 200,
        in: checked ? true : false
      }, React.createElement("div", {
        className: "checkmark"
      }, React.createElement("i", {
        className: "icon icon-checkmark"
      }))), React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, error, React.createElement("i", null)), React.createElement("div", {
        className: "errorMsg ".concat((!error || errorType !== 'normal') && 'displayNone')
      }, error));
    }
  }]);

  return CreditCard;
}(Component);

CreditCard.defaultProps = {
  name: 'defaultCreditCardField',
  type: 'text',
  maxlength: 64,
  cardType: 'noCardType',
  checked: false
};
export default CreditCard;