import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getResource, reloadResource, util, Table, ModalRoute, ModalLink, ActionsMenu, types } from '../lib';

class Transactions extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.resourceName);
  }

  /**
  * Set Description, Details, Credit and Debit Amounts
  * @param {string} txType credit or debit
  * @param {object} data
  */
  setDesc(txType, txData) {
    const data = txData[txType];
    const item = {
      desc: [],
      details: [],
      debit: (0).toFixed(2),
      credit: (0).toFixed(2)
    };
    switch (txType) {
      case 'credit': {
        const amountText = txData.txAccount === 'donation' ? 'Donation' : 'Sale';
        let feeText = data.passFees ? 'Customer paid bank fee' : `Bank fee deducted from ${amountText}`;
        let status = data.state.toUpperCase();
        let returnAmount;
        item.credit = util.calcAmount(data.amount, data.fee, data.passFees);

        switch (data.state) {
          case 'refunded': {
            feeText = data.freeRefund ? 'Transaction VOIDED and no fee debited' : 'Bank fee debited from available balance';
            status = data.freeRefund ? 'VOIDED' : status;
            item.debit = util.calcAmount(data.amount, data.fee, data.passFees, data.freeRefund ? false : true);
            returnAmount = util.money(util.calcAmount(data.amount, data.fee, data.passFees, true));
            break;
          }

          case 'chargeback': {
            feeText = 'Bank fee debited from available balance';
            item.debit = util.calcAmount(data.amount, data.fee, data.passFees, true);
            returnAmount = util.money(util.calcAmount(data.amount, data.fee, data.passFees, true));
            break;
          }

          // no default
        }

        item.desc.push(
          <div key={`${txType}-${data.ID}`} className='description'>
            <span className='line'>{data.cardName || `${data.cusFirstName} ${data.cusLastName}`}{data.cardType ? `, ${data.cardType.toUpperCase()} ${data.cardLast4} ${data.state !== 'approved' ? ` - ${status}` : ''}` : ''}</span>
          </div>
        );

        let commerceDesc = '';
        if (txData.txAccount === 'commerce') commerceDesc = `${data.articleUnitDescription ? `${data.articleUnitDescription} x ` : ''}Qty ${data.articleUnitQuantity}`;
        item.details.push(
          <div key={`${txType}-${data.ID}-details`} className='description'>
            <div className='leftCol'>
              <span className='line'>ID: {data.transactionID}</span>
              <span className='line'>Type: {types.txAccount(txData.txAccount)}</span>
              <span className='line'>{data.articleTitle.toUpperCase()}</span>
              <span className='line'>{types.kind(data.articleKind).txName} from {types.source(data.sourceType)}</span>
              {commerceDesc && <span className='line'>{commerceDesc} @ {util.money(parseFloat(data.articleUnitPrice/100).toFixed(2))} each</span>}
              {data.cusFirstName && <span className='line'>{`${data.cusFirstName} ${data.cusLastName}`}</span>}
              <span className='line'>{data.cusEmail}</span>
              {data.cardName && <span className='line'>Name on Card: {data.cardName}</span>}              
            </div>
            <div className='rightCol'>
              <span className='line'>Status: {status}</span>
              <span className='line'>{data.cardType.toUpperCase()}</span>
              {data.cardLast4 && <span className='line'>xxxxxxxxxxxx{data.cardLast4}</span>}
              <span className='line'>{amountText}: {util.money(util.calcAmount(data.amount, data.fee, data.passFees))}</span>
              <span className='line'><ModalLink id='feesGlossary'>Interchange/Bank Fee:</ModalLink> {util.money(parseFloat(data.fee/100).toFixed(2))}*</span>
              <span className='line'>Processed: {util.money(util.calcAmount(data.amount, data.fee, data.passFees, true))}</span>
              {returnAmount && <span className='line'>Returned: {returnAmount}</span>}
              <span style={{marginTop: 5}} className='link smallText'>*{feeText}</span>
            </div>
            <div className='clear'></div>
          </div>
        );
        break;
      }

      case 'debit': {
        switch (data.kind) {
          case 'payee':
          case 'deposit': {
            item.desc.push(
              <div key={`${txType}-${data.ID}`} className='description'>
                <span className='line'>{data.kind === 'deposit' ? 'WITHDRAWAL' : 'PAYMENT'} to xxxxxx{data.dstAccount.last4} {data.status !== 'approved' ? `- ${data.status.toUpperCase()}` : ''}</span>
              </div>
            );
            item.details.push(
              <div key={`${txType}-${data.ID}-details`} className='description'>
                <div className='leftCol'>
                  <span className='line'>{data.dstAccount.name}</span>
                  <span className='line'>Account: xxxxxx{data.dstAccount.last4}</span>
                  <span className='line'>Routing: {data.dstAccount.routingNumber}</span>
                </div>
                <div className='rightCol'>
                  <span className='line'>Status: {data.status.toUpperCase()}</span>
                  <span className='line'>Request Amount: {util.money(parseFloat(data.amount/100).toFixed(2))}</span>
                  <span className='line'>Amount Transferred: {util.money(parseFloat(data.status === 'approved' ? data.amount/100 : 0).toFixed(2))}</span>
                  <span className='line'><ModalLink id='feesGlossary'>Interchange/Bank Fee:</ModalLink> {util.money(parseFloat(0).toFixed(2))}</span>
                </div>
                <div className='clear'></div>
              </div>
            );
            if (data.status !== 'canceled' && data.status !== 'error') item.debit = parseFloat(data.amount/100).toFixed(2);
            break;
          }

          case 'Subscription': {
            item.desc.push(
              <div key={`${txType}-${data.ID}`} className='description'>
                <span className='line'>IN APP PURCHASE</span>
              </div>
            );
            item.details.push(
              <div key={`${txType}-${data.ID}-details`} className='description'>
              </div>
            );
            item.debit = parseFloat(data.amount/100).toFixed(2);
            break;
          }

          // no default
        }
        break;
      }

      // no default
    }
    return item;
  }

  formatTableData() {
    const {
      data
    } = this.props;

    const bindthis = this;
    const fdata = {};
    const headers = [];
    const rows = [];
    //const footer = [];

    headers.push(
      { name: '*details', width: '5%', sort: '' },
      { name: 'Date', width: '20%', sort: 'createdAt' },
      { name: 'Description', width: '45%', sort: 'cardName' },
      { name: 'Deposits/Credits', width: '10%', sort: 'net%2CtxType' },
      { name: 'Withdrawals/Debits', width: '10%', sort: 'kind' },
      { name: '', width: '10%', sort: '' }
    );
    fdata.headers = headers;

    if (!util.isEmpty(data)) {
      data.forEach(function(value, key) {
        const data = value[value.txType];
        const createdAt = util.getDate(data.createdAt, 'MM/DD/YYYY H:mm');
        const desc = bindthis.setDesc(value.txType, value);

        // Actions Menu Options
        //const modalID = `${resourceName}-delete-${data.ID}`;
        const options = [];
        if (value.txType === 'credit') {
          options.push(<div>Refund</div>);
          options.push(<div>Send Receipt</div>);
          options.push(<div>Recurring</div>);
        }

        rows.push([
          { details: desc.details, width: '6%', key: data.ID },
          createdAt,
          desc.desc,
          desc.credit !== '0.00' || value.txType === 'credit' ? util.money(desc.credit) : '',
          desc.debit !== '0.00' || value.txType === 'debit' ? util.money(desc.debit) : '',
          <ActionsMenu
            options={options}
          />
        ]);
      });
    }
    fdata.rows = rows;

    /*
    footer.push(
      { name: <div style={{textAlign: 'right'}}>Totals</div>, colspan: 3 },
      { name: '$1,123.42', colspan: 1}
    );
    fdata.footer = footer;
    */
    return fdata;
  }

  render() {

    const {
      resourceName
    } = this.props;

    const filters = [
      { field: 'calendarRange', name: 'createdAt' },
      {
        field: 'dropdown',
        name: 'txAccount',
        options: [
          {
            primaryText: 'All Types',
            value: 'all'
          },
          {
            primaryText: 'Charitable Donations',
            value: 'donation'
          },
          {
            primaryText: 'Sales',
            value: 'commerce'
          }
        ],
        value: 'all'
      },
      {
        field: 'dropdown',
        name: 'txType',
        options: [
          {
            primaryText: 'All Transactions',
            value: 'all'
          },
          {
            primaryText: 'Deposits/Credits',
            value: 'credit'
          },
          {
            primaryText: 'Withdrawals/Debits',
            value: 'debit'
          }
        ],
        value: 'all'
      },
      {
        field: 'dropdown',
        name: 'state',
        options: [
          {
            primaryText: 'All Status',
            value: 'all'
          },
          {
            primaryText: 'Approved',
            value: 'approved'
          },
          {
            primaryText: 'Refunded',
            value: 'refunded'
          },
          {
            primaryText: 'Chargeback',
            value: 'chargeback'
          }
        ],
        value: 'all'
      },
      {
        field: 'filler'
      }
    ];

    return (
      <div>
        {this.props.isFetching && this.props.loader(`Loading data`)}
        <Table
          name={resourceName}
          data={() => this.formatTableData()}
          exportDesc='Export Transaction Records'
          filters={filters}
        />
      </div>
    )
  }
}

Transactions.defaultProps = {
  resourceName: 'orgTransactions'
}

function mapStateToProps(state, props) {
  return {
    data: state.resource.orgTransactions ? state.resource.orgTransactions.data : {},
    isFetching: state.resource.isFetching
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource
})(Transactions);
