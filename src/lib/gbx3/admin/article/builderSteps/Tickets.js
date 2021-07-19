import React from 'react';
import { connect } from 'react-redux';
import { Alert } from '../../../../common/Alert';
import GBLink from '../../../../common/GBLink';
import * as types from '../../../../common/types';
import * as util from '../../../../common/utility';
import * as _v from '../../../../form/formValidate';
import { amountFieldsConfig } from '../../../blocks/amounts/amountFieldsConfig';
import TextField from '../../../../form/TextField';
import {
  sendResource
} from '../../../../api/helpers';

class Tickets extends React.Component {

  constructor(props) {
    super(props);
    this.renderAddTicket = this.renderAddTicket.bind(this);
    this.renderList = this.renderList.bind(this);
    this.updateTicket = this.updateTicket.bind(this);
    this.addTicket = this.addTicket.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
    this.priceField = this.priceField.bind(this);
    this.nameField = this.nameField.bind(this);
    this.inStockField = this.inStockField.bind(this);
    this.addNewTicketValue = this.addNewTicketValue.bind(this);
    this.config = util.getValue(amountFieldsConfig, this.props.kind, {});
    this.state = {
      ticketList: props.ticketList,
      priceError: [],
      nameError: [],
      inStockError: [],
      showAddTicket: true,
      addTicketError: false,
      addTicketErrorMsg: '',
      addTicketErrors: {
        price: false,
        name: false
      },
      newTicketValues: {
        price: '',
        name: '',
        max: ''
      },
      newTicketSuccess: false
    };
  }

  componentDidMount() {
    console.log('execute ticket config -> ', this.config);
  }

  updateTicket(ID, data = {}) {

  }

  deleteTicket(ticketID) {
    const {
      ID,
      orgID,
      kind
    } = this.props;

    const {
      ticketList
    } = this.state;

    this.props.sendResource(`${types.kind(kind).api.amount}`, {
      orgID,
      id: [ID, ticketID],
      method: 'delete',
      reload: false,
      callback: (res, err) => {
        ticketList.splice(ticketList.findIndex(t => t.ID === ticketID), 1);
        this.setState({ ticketList });
      }
    });
  }

  addTicket() {

    const {
      kind,
      orgID,
      ID
    } = this.props;

    const {
      ticketList,
      priceError,
      nameError,
      inStockError,
      newTicketValues
    } = this.state;

    const length = ticketList.length;

    if (priceError.includes('new')
      || nameError.includes('new')
      || inStockError.includes('new')
      || !newTicketValues.price
      || !newTicketValues.name
      || !newTicketValues.max
    ) {
      if (!priceError.includes('new') && !newTicketValues.price) priceError.push('new');
      if (!nameError.includes('new') && !newTicketValues.name) nameError.push('new');
      if (!inStockError.includes('new') && !newTicketValues.max) inStockError.push('new');

      this.setState({
        priceError,
        nameError,
        inStockError,
        addTicketError: true,
        addTicketErrorMsg: 'Please fix errors below to add a ticket.' }, () => {
        setTimeout(() => {
          this.setState({ addTicketError: false });
        }, 3000);
      });
    } else {
      const data = {
        ...newTicketValues,
        description: '',
        enabled: true,
        orderBy: length
      };

      this.props.sendResource(`${types.kind(this.props.kind).api.amount}s`, {
        data,
        orgID,
        id: [ID],
        method: 'post',
        reload: false,
        callback: (res, err) => {
          if (!err && !util.isEmpty(res)) {
            ticketList.push(res);
            this.setState({ newTicketSuccess: true, newTicketValues: { price: '', name: '', max: '' } }, () => {
              setTimeout(() => {
                this.setState({ newTicketSuccess: false });
              }, 3000)
            });
          } else {
            this.setState({ addTicketError: true, addTicketErrorMsg: 'Sorry, an error occurred adding ticket. Please refresh browser and try again.' });
          }
        }
      });
    }
  }

  addNewTicketValue(name, value) {
    this.setState({
      newTicketValues: {
        ...this.state.newTicketValues,
        [name]: value
      }
    })
  }

  priceField(value = {}) {

    const {
      priceError
    } = this.state;

    const priceDisplay = value.price && value.price !== 0 ? value.price/100 : '';

    return (
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
          error={priceError.includes(value.ID) ? `Price must be between $${_v.limits.txMin} and $${util.numberWithCommas(_v.limits.txMax)}.` : ''}
          errorType={'tooltip'}
          onBlur={(e) => {
            const priceValue = e.currentTarget.value;
            const priceDisplay = _v.formatNumber(priceValue);
            const price = util.formatMoneyForAPI(priceValue);
            if (!_v.validateNumber(priceValue, _v.limits.txMin, _v.limits.txMax)) {
              if (!priceError.includes(value.ID)) {
                priceError.push(value.ID);
                this.setState({ priceError });
              }
            } else {
              if (value.ID === 'new') this.addNewTicketValue('price', price);
              console.log('execute update price -> ', value.ID, price);
            }
          }}
          onChange={(e) => {
            if (priceError.includes(value.ID)) {
              priceError.splice(priceError.indexOf(value.ID, 1));
              this.setState({ priceError });
            }
          }}
        />
      </div>
    )
  }

  nameField(value = {}) {

    const {
      nameError
    } = this.state;

    return (
      <div className='column' style={{ width: '65%' }}>
        <TextField
          name={'name'}
          label={'Ticket Name'}
          fixedLabel={true}
          placeholder={'Type a Ticket Short Description'}
          onChange={(e) => {
          }}
          onBlur={(e) => {
            const name = e.currentTarget.value;
            if (!name) {
              if (!nameError.includes(value.ID)) {
                nameError.push(value.ID);
                this.setState({ nameError });
              }
            } else {
              if (value.ID === 'new') this.addNewTicketValue('name', name);
              console.log('execute update name -> ', value.ID, name);
            }
          }}
          onChange={(e) => {
            if (nameError.includes(value.ID)) {
              nameError.splice(nameError.indexOf(value.ID, 1));
              this.setState({ nameError });
            }
          }}
          value={value.name}
          count={true}
          maxLength={60}
          error={nameError.includes(value.ID) ? `A ticket name is required.` : ''}
          errorType={'tooltip'}
        />
      </div>
    )
  }

  inStockField(value = {}) {

    const {
      inStockError
    } = this.state;

    const sold = +util.getValue(value, 'sold', 0);
    const max = +util.getValue(value, 'max', 0);
    const inStock = max - sold;

    return (
      <div className='column' style={{ width: '10%' }}>
        <TextField
          name={'max'}
          label={'In Stock'}
          fixedLabel={true}
          placeholder={'0'}
          onChange={(e) => {
            if (inStockError.includes(value.ID)) {
              inStockError.splice(inStockError.indexOf(value.ID, 1));
              this.setState({ inStockError });
            }
          }}
          onBlur={(e) => {
            const inStock = +e.currentTarget.value;
            const max = +(inStock + sold);
            if (value.ID === 'new') {
              if (!inStock && !inStockError.includes('new')) {
                inStockError.push('new');
                this.setState({ inStockError });
              } else {
                this.addNewTicketValue('max', max);
              }
            } else {
              console.log('execute instock (aka max) -> ', max);
            }
          }}
          maxLength={7}
          value={inStock || ''}
          error={inStockError.includes(value.ID) ? `You must have a least 1 ticket in stock.` : ''}
          errorType={'tooltip'}
        />
      </div>
    )
  }

  renderAddTicket() {

    const {
      showAddTicket,
      addTicketError,
      addTicketErrorMsg,
      newTicketSuccess,
      newTicketValues
    } = this.state;

    return (
      <div style={{ marginBottom: '30px' }} className='amountsEditList'>
        <Alert alert='error' display={addTicketError} msg={addTicketErrorMsg} />
        <Alert alert='success' display={newTicketSuccess} msg={'Ticket Added! You can edit it below.'} />
        <div className='amountsEditRow'>
          <div className='inputLeftBar'></div>
          <div className='fieldItems'>
            {this.priceField({ ID: 'new', price: newTicketValues.price })}
            {this.nameField({ ID: 'new', name: newTicketValues.name })}
            {this.inStockField({ ID: 'new', max: newTicketValues.max })}
            <div className='column' style={{ width: '15%' }}>
              <div className='amountsRightSideButtonGroup flexCenter'>
                <GBLink style={{ opacity: 1 }} className='button' onClick={() => this.addTicket()}>Add Ticket</GBLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderList() {
    const {
      ticketList
    } = this.state;

    const items= [];

    Object.entries(ticketList).forEach(([key, value]) => {

      if (value.enabled) {

        items.push(
          <div className='amountsEditRow' key={key}>
            <div className='inputLeftBar'></div>
            <div className='fieldItems'>
              {this.priceField(value)}
              {this.nameField(value)}
              {this.inStockField(value)}
              <div className='column' style={{ width: '15%' }}>
                <div className='amountsRightSideButtonGroup flexCenter'>
                  {/*
                  <GBLink className='button' onClick={() => console.log('execute update -> ', value.ID)}>Update</GBLink>
                  */}
                  <GBLink onClick={() => this.deleteTicket(value.ID)}>Delete</GBLink>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });

    return (
      <div className='amountsEditList'>
        {!util.isEmpty(items) ?
          <>
            <div className='previewTitleContainer flexCenter'>
              <div className='previewTitleText'>
               Current Ticket List
              </div>
            </div>
            {items}
          </>
        : null }
      </div>
    )
  }

  render() {

    const {
      leftSide,
      rightSide
    } = this.props;

    return (
      <div className='fieldGroup gbx3amountsEdit'>
        {this.renderAddTicket()}
        {this.renderList()}
        <div className='button-group'>
          {leftSide}
          <div className='button-itme'>
            <GBLink className='button' onClick={() => console.log('execute save tickets')}>
              Save & Continue
            </GBLink>
          </div>
          {rightSide}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const data = util.getValue(state, 'gbx3.data', {});
  const orgID = util.getValue(data, 'orgID');
  const ID = util.getValue(data, 'ID');
  const kind = util.getValue(state, 'gbx3.info.kind', 'fundraiser');
  const ticketList = util.getValue(data, `${types.kind(kind).amountField}.list`, []);

  return {
    orgID,
    ID,
    kind,
    ticketList
  }
}

export default connect(mapStateToProps, {
  sendResource
})(Tickets);
