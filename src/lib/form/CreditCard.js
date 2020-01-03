import React, {Component} from 'react';
import Fade from '../common/Fade';

class CreditCard extends Component {

  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.inputRef = React.createRef();
    this.state = {
      status: 'idle'
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
      checked,
      hideLabel
    } = this.props;

    const hideCardsAccepted = value ? cardType !== 'noCardType' ? true : false : false;

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
              onChange={this.props.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              autoComplete='new-password'
              value={value}
              maxLength={maxLength}
              inputmode='numeric'
            />
            {!hideLabel && label && <label htmlFor={name}>{label}</label>}
            <div className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
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
  cardType: 'noCardType',
  checked: false,
  placeholder: 'xxxx xxxx xxxx xxxx',
  hideLabel: false
}

export default CreditCard;
