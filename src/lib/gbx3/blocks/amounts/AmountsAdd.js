import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import * as _v from '../../../form/formValidate';
import { Alert } from '../../../common/Alert';
import GBLink from '../../../common/GBLink';
import TextField from '../../../form/TextField';
import { amountFieldsConfig } from './amountFieldsConfig';
import {
  sendResource
} from '../../../api/helpers';

class AmountsAdd extends React.Component {

  constructor(props) {
    super(props);
    this.addAmount = this.addAmount.bind(this);
    this.addNewAmountValue = this.addNewAmountValue.bind(this);
    this.hasThirdColumnField = ( props.kind !== 'invoice' && props.kind !== 'fundraiser' ) ? true : false;
    this.thirdColumnFieldName = props.kind === 'sweepstake' ? 'entries' : 'max';
    this.thirdColumnDefaultValue = props.kind === 'sweepstake' ? 1 : 100;
    this.amountLabel = amountFieldsConfig[props.kind].label;
    this.state = {
      priceError: [],
      nameError: [],
      thirdColumnFieldError: [],
      addAmountError: false,
      addAmountErrorMsg: '',
      addAmountSuccess: false,
      newAmountValues: {
        price: '',
        name: '',
        max: 100,
        entries: 1,
        enabled: true,
        description: '',
      }
    };
  }

  componentDidMount() {
  }

  addAmount() {

    const {
      priceError,
      nameError,
      thirdColumnFieldError,
      newAmountValues
    } = this.state;

    if (priceError.includes('new')
      || nameError.includes('new')
      || thirdColumnFieldError.includes('new')
      || !newAmountValues.price
      || !newAmountValues.name
      || !newAmountValues[this.thirdColumnFieldName]
    ) {
      if (!priceError.includes('new') && !newAmountValues.price) priceError.push('new');
      if (!nameError.includes('new') && !newAmountValues.name) nameError.push('new');
      if (!thirdColumnFieldError.includes('new') && !newAmountValues[this.thirdColumnFieldName]) thirdColumnFieldError.push('new');

      this.setState({
        priceError,
        nameError,
        thirdColumnFieldError,
        addAmountError: true,
        addAmountErrorMsg: `Please fix errors below to add a ${this.amountLabel}.` }, () => {
        setTimeout(() => {
          this.setState({ addAmountError: false });
        }, 3000);
      });
    } else {
      const data = {
        ...newAmountValues
      };

      this.props.addAmount(data, (res, err) => {
        console.log('execute -> addAmount', res, err);
        if (!err && !util.isEmpty(res)) {
          this.setState({ addAmountSuccess: true, newAmountValues: { price: '', name: '', [this.thirdColumnFieldName]: '' } }, () => {
            setTimeout(() => {
              this.setState({ addAmountSuccess: false });
            }, 3000)
          });
        } else {
          this.setState({ addAmountError: true, addAmountErrorMsg: `Sorry, an error occurred adding ${this.amountLabel}. Please refresh browser and try again.` });
        }
      });
    }
  }

  addNewAmountValue(name, value) {
    this.setState({
      newAmountValues: {
        ...this.state.newAmountValues,
        [name]: value
      }
    })
  }

  render() {

    const {
      kind
    } = this.props;

    const {
      newAmountValues,
      addAmountError,
      addAmountErrorMsg,
      addAmountSuccess,
      priceError,
      nameError,
      thirdColumnFieldError
    } = this.state;

    const priceDisplay = newAmountValues.price && newAmountValues.price !== 0 ? newAmountValues.price/100 : '';
    const sold = +util.getValue(newAmountValues, 'sold', 0);
    const max = +util.getValue(newAmountValues, 'max', 0);
    const inStock = max - sold;
    const entries = +util.getValue(newAmountValues, 'entries', 0);

    return (
      <div style={{ marginBottom: '30px' }} className='amountsEditList amountsAdd'>
        <Alert alert='error' display={addAmountError} msg={addAmountErrorMsg} />
        <Alert alert='success' display={addAmountSuccess} msg={`${util.toTitleCase(this.amountLabel)} Added! You can edit it below.`} />
        <div className='amountsEditRow'>
          <div className='inputLeftBar'></div>
          <div className='fieldItems'>
            <div className='column' style={{ width: '10%' }}>
              <TextField
                name='price'
                fixedLabel={true}
                label='Price'
                placeholder='0.00'
                fixedLabel={true}
                maxLength={8}
                money={true}
                value={priceDisplay}
                error={priceError.includes('new') ? `Price must be between $${_v.limits.txMin} and $${util.numberWithCommas(_v.limits.txMax)}.` : ''}
                errorType={'tooltip'}
                onBlur={(e) => {
                  const priceValue = e.currentTarget.value;
                  const priceDisplay = _v.formatNumber(priceValue);
                  const price = util.formatMoneyForAPI(priceValue);
                  if (!_v.validateNumber(priceValue, _v.limits.txMin, _v.limits.txMax)) {
                    if (!priceError.includes('new')) {
                      priceError.push('new');
                      this.setState({ priceError });
                    }
                  } else {
                    this.addNewAmountValue('price', price);
                  }
                }}
                onChange={(e) => {
                  if (priceError.includes('new')) {
                    priceError.splice(priceError.indexOf('new', 1));
                    this.setState({ priceError });
                  }
                }}
              />
            </div>
            <div className='column' style={{ width: '60%' }}>
              <TextField
                name={'name'}
                label={`${util.toTitleCase(this.amountLabel)} Name`}
                fixedLabel={true}
                placeholder={`Type a ${util.toTitleCase(this.amountLabel)} Short Description`}
                onChange={(e) => {
                }}
                onBlur={(e) => {
                  const name = e.currentTarget.value;
                  if (!name) {
                    if (!nameError.includes('new')) {
                      nameError.push('new');
                      this.setState({ nameError });
                    }
                  } else {
                    this.addNewAmountValue('name', name);
                  }
                }}
                onChange={(e) => {
                  if (nameError.includes('new')) {
                    nameError.splice(nameError.indexOf('new', 1));
                    this.setState({ nameError });
                  }
                }}
                value={newAmountValues.name}
                count={true}
                maxLength={60}
                error={nameError.includes('new') ? `A ${this.amountLabel.toLowerCase()} name is required.` : ''}
                errorType={'tooltip'}
              />
            </div>
            { this.hasThirdColumnField ?
            <div className='column' style={{ width: '10%' }}>
              { kind === 'sweepstake' ?
                <TextField
                  name={'entries'}
                  label={'Entries Per Ticket'}
                  fixedLabel={true}
                  placeholder={'0'}
                  onChange={(e) => {
                    if (thirdColumnFieldError.includes('new')) {
                      thirdColumnFieldError.splice(thirdColumnFieldError.indexOf('new', 1));
                      this.setState({ thirdColumnFieldError });
                    }
                  }}
                  onBlur={(e) => {
                    const entries = +e.currentTarget.value;
                    if (!entries && !thirdColumnFieldError.includes('new')) {
                      thirdColumnFieldError.push('new');
                      this.setState({ thirdColumnFieldError });
                    } else {
                      this.addNewAmountValue('entries', entries);
                    }
                  }}
                  maxLength={7}
                  value={entries || 1}
                  error={thirdColumnFieldError.includes('new') ? `You must have a least 1 entry per ticket.` : ''}
                  errorType={'tooltip'}
                />
              :
                <TextField
                  name={'max'}
                  label={'In Stock'}
                  fixedLabel={true}
                  placeholder={'0'}
                  onChange={(e) => {
                    if (thirdColumnFieldError.includes('new')) {
                      thirdColumnFieldError.splice(thirdColumnFieldError.indexOf('new', 1));
                      this.setState({ thirdColumnFieldError });
                    }
                  }}
                  onBlur={(e) => {
                    const inStock = +e.currentTarget.value;
                    const max = +(inStock + sold);
                    if (!inStock && !thirdColumnFieldError.includes('new')) {
                      thirdColumnFieldError.push('new');
                      this.setState({ thirdColumnFieldError });
                    } else {
                      this.addNewAmountValue('max', max);
                    }
                  }}
                  maxLength={7}
                  value={inStock || 100}
                  error={thirdColumnFieldError.includes('new') ? `You must have 1 ticket available for purchase.` : ''}
                  errorType={'tooltip'}
                />
              }
            </div>
            : null }
            <div className='column' style={{ width: '20%' }}>
              <div className='amountsRightSideButtonGroup flexCenter'>
                <GBLink style={{ opacity: 1 }} className='button' onClick={() => this.addAmount()}>Add {util.toTitleCase(this.amountLabel)}</GBLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const data = util.getValue(state, 'gbx3.data', {});
  const orgID = util.getValue(data, 'orgID');
  const ID = util.getValue(data, 'ID');

  return {
    orgID,
    ID
  }
}

export default connect(mapStateToProps, {
  sendResource
})(AmountsAdd);
