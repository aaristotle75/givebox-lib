import React, {Component} from 'react';

class CreditCard extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    let params = Object.assign({}, this.props.params, {ref: this.inputRef});
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  render() {

    const {
      name,
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

    return (
        <div style={style} className={`input-group ${className || ''} creditCard ${error ? 'error tooltip' : ''}`}>
          <div className={`cardType ${cardType}`}></div>
          <input
            autoFocus={autoFocus}
            ref={this.inputRef}
            name={name}
            type={'text'}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
            autoComplete='new-password'
            value={value}
            maxLength={maxLength}
          />
          <div className={`checkmark ${!checked && 'displayNone'}`}>
              <i className='icon icon-checkmark'></i>
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
  maxlength: 64,
  cardType: 'noCardType',
  checked: false
}

export default CreditCard;
