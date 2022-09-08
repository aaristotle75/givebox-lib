import React, {Component} from 'react';
import { connect } from 'react-redux';
import Fade from '../common/Fade';
import * as _v from './formValidate';
import * as util from '../common/utility';
import {
  getResource
} from '../api/helpers';

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
    if (length === 4) {
      cardType = _v.identifyCardTypes(obj.apiValue.slice(0, 4));
    }
    if ( ( (cardType === 'amex' || cardType === 'default') && length === 15 )
      || ( (cardType !== 'amex' || cardType === 'default') && length === 16) ) doBinLookup = true;

    if (doBinLookup) {
      this.props.getResource('binlookup', {
        reload: true,
        id: [obj.apiValue],
        callback: (res, err) => {
          if (!err) {
            let cardType = util.getValue(res, 'card-brand', 'default').toLowerCase();
            if (cardType === 'american express') cardType = 'amex';
            const type = util.getValue(res, 'card-type');
            const isDebit = type === 'DEBIT' ? true : false;
            this.setState({ cardType }, () => {
              this.props.onChange(name, obj.value, cardType, isDebit);
              this.props.fieldProp('ccnumber', { binData: res, isDebit });
            });
          } else {
            const cardType = _v.identifyCardTypes(obj.apiValue.slice(0, 4));
            const isDebit = false;
            this.setState({ cardType }, () => {
              this.props.onChange(name, obj.value, cardType, isDebit);
              this.props.fieldProp('ccnumber', { binData: {}, isDebit });
            });
          }
        }
      })
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
      value,
      hideLabel,
      color,
      paybyDebitCard
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

    //const hideCardsAccepted = value ? cardType !== 'default' ? true : false : false;

    return (
        <div style={style} className={`input-group ${className || ''} creditCard ${error ? 'error tooltip' : ''}`}>
          <Fade in={true}>
            <div className={`cardsAccepted ${paybyDebitCard ? 'debitCardsAccepted' : ''}`}></div>
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
              maxLength={19}
              inputMode='numeric'
            />
            {!hideLabel && label && <label style={labelStyle} htmlFor={name}>{label}</label>}
            <div style={inputBottomStyle} className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
          </div>
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
  checked: false,
  placeholder: 'xxxx xxxx xxxx xxxx',
  hideLabel: false,
  paybyDebitCard: false
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  getResource
})(CreditCard);
