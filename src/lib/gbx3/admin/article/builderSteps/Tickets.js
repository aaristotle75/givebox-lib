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
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

const arrayMove = require('array-move');

const DragHandle = SortableHandle(() => {
  return (
    <GBLink ripple={false} className='tooltip sortable link right'>
      <span className='tooltipTop'><i />Drag & Drop to Change Order</span>
      <span className='icon icon-move'></span>
    </GBLink>
  )
});

const SortableItem = SortableElement(({value}) => {
  return (
    <div className='gbx3amountsEdit sortableElement' >
      {value}
    </div>
  )
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div style={{ width: '100%' }}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

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
    this.maxField = this.maxField.bind(this);
    this.entriesField = this.entriesField.bind(this);
    this.addNewTicketValue = this.addNewTicketValue.bind(this);
    this.saveTickets = this.saveTickets.bind(this);
    this.config = util.getValue(amountFieldsConfig, this.props.kind, {});
    this.thirdColumnFieldName = props.kind === 'sweepstake' ? 'entries' : 'max';
    this.thirdColumnDefaultValue = props.kind === 'sweepstake' ? 1 : 100;
    this.ticketLabel = props.kind === 'membership' ? 'subscription' : 'ticket';
    this.state = {
      ticketList: [],
      ticketListUpdated: false,
      priceError: [],
      nameError: [],
      thirdColumnFieldError: [],
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
        [this.thirdColumnFieldName]: this.thirdColumnDefaultValue
      },
      newTicketSuccess: false
    };
  }

  componentDidMount() {
    this.setTickets();
  }

  setTickets() {
    const ticketList = this.state.ticketList;
    if (!util.isEmpty(this.props.ticketList)) {
      Object.entries(this.props.ticketList).forEach(([key, value]) => {
        if (value.enabled && !value.freeSingleEntry && !value.isDeleted) {
          ticketList.push(value);
        }
      });
    }
    this.setState({ ticketList });
  }

  onSortStart(e) {
    util.noSelection();
  }

  onSortMove(e) {
    util.noSelection();
  }

  onSortEnd = ({oldIndex, newIndex, collection}) => {
    const ticketList = arrayMove(this.state.ticketList, oldIndex, newIndex);
    Object.entries(ticketList).forEach(([key, value]) => {
      ticketList[key].orderBy = +key;
    });
    this.setState({
      ticketList,
      ticketListUpdated: true
    });
  };

  async saveTickets() {

    const {
      ID,
      orgID,
      kind
    } = this.props;

    const {
      ticketList,
      ticketListUpdated
    } = this.state;

    util.toTop('modalOverlay-gbx3Builder');

    if (!util.isEmpty(ticketList)) {
      if (ticketListUpdated) {
        const data = {
          [types.kind(kind).amountField]: {
            list: [
              ...ticketList
            ],
          }
        };

        const dataUpdated = await this.props.updateData(data);
        if (dataUpdated) {
          this.props.sendResource(`org${types.kind(kind).api.item}`, {
            data,
            orgID,
            id: [ID],
            method: 'patch',
            callback: (res, err) => {
              this.setState({ ticketListUpdated: false });
              this.props.processCallback(res, err, () => {
                this.props.processForm();
              });
            }
          });
        }
      } else {
        this.props.processForm();
      }
    } else {
      this.props.formProp({ error: true, errorMsg: 'You must add at least 1 ticket to Save & Continue.' });
      setTimeout(() => {
        this.props.formProp({ error: false });
      }, 3000);
    }
  }

  updateTicket(ID, data = {}) {
    const {
      ticketList
    } = this.state;

    const ticketToUpdateIndex = ticketList.findIndex(t => t.ID === ID);

    ticketList[ticketToUpdateIndex] = {
      ...ticketList[ticketToUpdateIndex],
      ...data
    };

    this.setState({ ticketList, ticketListUpdated: true });
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
      thirdColumnFieldError,
      newTicketValues
    } = this.state;

    const length = ticketList.length;

    if (priceError.includes('new')
      || nameError.includes('new')
      || thirdColumnFieldError.includes('new')
      || !newTicketValues.price
      || !newTicketValues.name
      || !newTicketValues[this.thirdColumnFieldName]
    ) {
      if (!priceError.includes('new') && !newTicketValues.price) priceError.push('new');
      if (!nameError.includes('new') && !newTicketValues.name) nameError.push('new');
      if (!thirdColumnFieldError.includes('new') && !newTicketValues[this.thirdColumnFieldName]) thirdColumnFieldError.push('new');

      this.setState({
        priceError,
        nameError,
        thirdColumnFieldError,
        addTicketError: true,
        addTicketErrorMsg: `Please fix errors below to add a ${this.ticketLabel}.` }, () => {
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
            this.setState({ ticketListUpdated: true, newTicketSuccess: true, newTicketValues: { price: '', name: '', [this.thirdColumnFieldName]: '' } }, () => {
              setTimeout(() => {
                this.setState({ newTicketSuccess: false });
              }, 3000)
            });
          } else {
            this.setState({ addTicketError: true, addTicketErrorMsg: `Sorry, an error occurred adding ${this.ticketLabel}. Please refresh browser and try again.` });
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

  priceField(value = {}, width = '10%') {

    const {
      priceError
    } = this.state;

    const priceDisplay = value.price && value.price !== 0 ? value.price/100 : '';

    return (
      <div className='column' style={{ width }}>
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
              else this.updateTicket(value.ID, { price });
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

  nameField(value = {}, width = '60%') {

    const {
      nameError
    } = this.state;

    return (
      <div className='column' style={{ width }}>
        <TextField
          name={'name'}
          label={`${util.toTitleCase(this.ticketLabel)} Name`}
          fixedLabel={true}
          placeholder={`Type a ${util.toTitleCase(this.ticketLabel)} Short Description`}
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
              else this.updateTicket(value.ID, { name });

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
          error={nameError.includes(value.ID) ? `A ${this.ticketLabel} name is required.` : ''}
          errorType={'tooltip'}
        />
      </div>
    )
  }

  maxField(value = {}, width = '10%') {

    const {
      thirdColumnFieldError
    } = this.state;

    const sold = +util.getValue(value, 'sold', 0);
    const max = +util.getValue(value, 'max', 0);
    const inStock = max - sold;

    return (
      <div className='column' style={{ width }}>
        <TextField
          name={'max'}
          label={'In Stock'}
          fixedLabel={true}
          placeholder={'0'}
          onChange={(e) => {
            if (thirdColumnFieldError.includes(value.ID)) {
              thirdColumnFieldError.splice(thirdColumnFieldError.indexOf(value.ID, 1));
              this.setState({ thirdColumnFieldError });
            }
          }}
          onBlur={(e) => {
            const inStock = +e.currentTarget.value;
            const max = +(inStock + sold);
            if (value.ID === 'new') {
              if (!inStock && !thirdColumnFieldError.includes('new')) {
                thirdColumnFieldError.push('new');
                this.setState({ thirdColumnFieldError });
              } else {
                this.addNewTicketValue('max', max);
              }
            } else {
              this.updateTicket(value.ID, { max });
            }
          }}
          maxLength={7}
          value={inStock || 100}
          error={thirdColumnFieldError.includes(value.ID) ? `You must have a least 1 ticket available for purchase.` : ''}
          errorType={'tooltip'}
        />
      </div>
    )
  }

  entriesField(value = {}, width = '10%') {

    const {
      thirdColumnFieldError
    } = this.state;

    const entries = +util.getValue(value, 'entries', 0);

    return (
      <div className='column' style={{ width }}>
        <TextField
          name={'entries'}
          label={'Entries Per Ticket'}
          fixedLabel={true}
          placeholder={'0'}
          onChange={(e) => {
            if (thirdColumnFieldError.includes(value.ID)) {
              thirdColumnFieldError.splice(thirdColumnFieldError.indexOf(value.ID, 1));
              this.setState({ thirdColumnFieldError });
            }
          }}
          onBlur={(e) => {
            const entries = +e.currentTarget.value;
            if (value.ID === 'new') {
              if (!entries && !thirdColumnFieldError.includes('new')) {
                thirdColumnFieldError.push('new');
                this.setState({ thirdColumnFieldError });
              } else {
                this.addNewTicketValue('entries', entries);
              }
            } else {
              this.updateTicket(value.ID, { entries });
            }
          }}
          maxLength={7}
          value={entries || 1}
          error={thirdColumnFieldError.includes(value.ID) ? `You must have a least 1 entry per ticket.` : ''}
          errorType={'tooltip'}
        />
      </div>
    )
  }

  renderAddTicket() {

    const {
      kind
    } = this.props;

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
        <Alert alert='success' display={newTicketSuccess} msg={`${util.toTitleCase(this.ticketLabel)} Added! You can edit it below.`} />
        <div className='amountsEditRow'>
          <div className='inputLeftBar'></div>
          <div className='fieldItems'>
            {this.priceField({ ID: 'new', price: newTicketValues.price })}
            {this.nameField({ ID: 'new', name: newTicketValues.name }, '60%')}
            { kind === 'sweepstake' ? this.entriesField({ ID: 'new', entries: newTicketValues.entries }) : this.maxField({ ID: 'new', max: newTicketValues.max }) }
            <div className='column' style={{ width: '20%' }}>
              <div className='amountsRightSideButtonGroup flexCenter'>
                <GBLink style={{ opacity: 1 }} className='button' onClick={() => this.addTicket()}>Add {util.toTitleCase(this.ticketLabel)}</GBLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderList() {

    const {
      kind
    } = this.props;

    const {
      ticketList
    } = this.state;

    const items= [];

    Object.entries(ticketList).forEach(([key, value]) => {

      if (value.enabled) {

        items.push(
          <div className='amountsEditRow sortableListItem' key={key}>
            <div className='fieldItems'>
              {this.priceField(value)}
              {this.nameField(value)}
              { kind === 'sweepstake' ? this.entriesField(value) : this.maxField(value) }
              <div className='column' style={{ width: '20%' }}>
                <div className='amountsRightSideButtonGroup flexCenter'>
                  {/*
                  <GBLink className='button' onClick={() => console.log('execute update -> ', value.ID)}>Update</GBLink>
                  */}
                  <DragHandle />
                  <GBLink className='tooltip link right' onClick={() => this.deleteTicket(value.ID)}>
                    <span className='tooltipTop'><i />Delete {util.toTitleCase(this.ticketLabel)}</span>
                    <span className='icon icon-x'></span>
                  </GBLink>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });

    const rows = <SortableList onSortStart={this.onSortStart} onSortMove={this.onSortMove} helperClass='sortableHelper' hideSortableGhost={true} useDragHandle={true} items={items} onSortEnd={this.onSortEnd} />;

    return (
      <div className='amountsEditList'>
        { !util.isEmpty(items) ?
          <div>
            <div className='previewTitleContainer flexCenter'>
              <div className='previewTitleText'>
                Current {util.toTitleCase(this.ticketLabel)} List
              </div>
            </div>
            <div className='sectionContainer'>
              <div className='section'>
                {rows}
              </div>
            </div>
          </div>
        : null }
      </div>
    )
  }

  render() {

    const {
      leftSide,
      rightSide
    } = this.props;

    const {
      ticketList
    } = this.state;

    return (
      <div className='fieldGroup gbx3amountsEdit'>
        {this.renderAddTicket()}
        {this.renderList()}
        <div className='button-group'>
          {leftSide}
          <div className='button-itme'>
            <GBLink className='button' onClick={() => this.saveTickets()}>
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
