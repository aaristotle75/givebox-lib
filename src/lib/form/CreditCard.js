import React, {Component} from 'react';
import Fade from '../common/Fade';
import * as _v from './formValidate';
import * as util from '../common/utility';
var lookup = require('binlookup')('8e161ba2-5874-40d0-834c-b63cf8468c9f');

class CreditCard extends Component {

  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      status: 'idle',
      cardType: 'default'
    }
  }

  componentDidMount() {
    let params = Object.assign({}, this.props.params, {ref: this.inputRef});
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  onFocus(e) {
    e.preventDefault();
    this.setState({status: 'active'});
    if (this.props.onFocus) this.props.onFocus(e);
  }

  onBlur(e) {
    e.preventDefault();
    this.setState({status: 'idle'});
    if (this.props.onBlur) this.props.onBlur(e);
  }

  onChange(e) {
    e.preventDefault();
    const name = e.target.name;
    const obj = _v.formatCreditCard(e.target.value);
    const length = obj.apiValue.length;
    let doBinLookup = false;
    let cardType = length < 4 ? 'default' : this.state.cardType;
    if (length === 4) doBinLookup = true;
    if (cardType === 'default' && length >= 15) doBinLookup = true;

    if (doBinLookup) {
      lookup(obj.apiValue, (err, data) => {
        const cardType = util.getValue(data, 'scheme', 'default');
        this.setState({ cardType }, this.props.onChange(name, obj.value, cardType));
      });
    } else {
      this.setState({ cardType }, this.props.onChange(name, obj.value, cardType));
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
      maxLength,
      value,
      checked,
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
    };

    const hideCardsAccepted = value ? cardType !== 'default' ? true : false : false;

    return (
        <div style={style} className={`input-group ${className || ''} creditCard ${error ? 'error tooltip' : ''}`}>
          <Fade in={hideCardsAccepted ? false : true}>
            <div className={`cardsAccepted`}></div>
          </Fade>
          <div className={`floating-label ${fixedLabel && 'fixed'}`}>
            <Fade in={cardType ? true : false}><div className={`cardType ${cardType}`}></div></Fade>
            <input
              autoFocus={autoFocus}
              ref={this.inputRef}
              name={name}
              type={'text'}
              readOnly={readOnly}
              required={required}
              placeholder={placeholder}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              autoComplete='new-password'
              value={value}
              maxLength={maxLength}
              inputMode='numeric'
            />
            {!hideLabel && label && <label style={labelStyle} htmlFor={name}>{label}</label>}
            <div style={inputBottomStyle} className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
          </div>
          <Fade duration={200} in={checked ? true : false}>
            <div className={`checkmark`}>
                <i className='icon icon-check'></i>
            </div>
          </Fade>
          <div className={`tooltipTop ${errorType !=='tooltip' && 'displayNone'}`}>
            {error}
            <i></i>
          </div>
          <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
        </div>
    );
  }
}

CreditCard.defaultProps = {
  name: 'defaultCreditCardField',
  type: 'text',
  maxlength: 64,
  checked: false,
  placeholder: 'xxxx xxxx xxxx xxxx',
  hideLabel: false
}

export default CreditCard;
