import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getResource,
  reloadResource,
  util,
  Table,
  ModalLink,
  ModalRoute,
  StatBlock,
  ActionsMenu,
  ActionBar,
  types,
  Tabs,
  Tab,
  Filter
} from '../lib';
import Moment from 'moment';

class Transactions extends Component {

  constructor(props) {
    super(props);
    this.formatTableData = this.formatTableData.bind(this);
    this.tabsCallbackBefore = this.tabsCallbackBefore.bind(this);
    this.tabsCallbackAfter = this.tabsCallbackAfter.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.resourceName, { search: { max: 20, filter: 'txAccount:"commerce"' } } );
    this.props.getResource('orgFinanceStats');
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
            item.credit = -Math.abs(util.calcAmount(data.amount, data.fee, data.passFees, data.freeRefund ? false : true));
            //item.credit = -Math.abs(data.fee/100);
            returnAmount = util.money(util.calcAmount(data.amount, data.fee, data.passFees, true));
            break;
          }

          case 'chargeback': {
            feeText = 'Bank fee debited from available balance';
            item.credit = -Math.abs(util.calcAmount(data.amount, data.fee, data.passFees, true));
            //item.credit = -Math.abs(data.fee/100);
            returnAmount = util.money(util.calcAmount(data.amount, data.fee, data.passFees, true));
            break;
          }

          // no default
        }

        item.desc.push(
          <div key={`${txType}-${data.ID}`} className='description'>
            <span className='line'>{data.cardName || `${data.cusFirstName} ${data.cusLastName}`}{data.cardType ? `, ${data.cardType.toUpperCase()} ${data.cardLast4} ${data.state !== 'approved' ? ` - ${status}` : txData.txState === 'pending' ? ` - ${txData.txState.toUpperCase()}` : ''}` : ''}</span>
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
              <span className='line'>Status: {data.state === 'approved' ? <ModalLink id='financeGlossary'>{txData.txState.toUpperCase()}</ModalLink> : <ModalLink id='financeGlossary'>{status}</ModalLink>}</span>
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
      transactions
    } = this.props;

    const data = transactions.data;
    const meta = transactions.meta;
    const bindthis = this;
    const fdata = {};
    const headers = [];
    const rows = [];
    const footer = [];

    headers.push(
      { name: 'Date', colspan: 2, width: '20%', sort: 'createdAt' },
      { name: 'Description', width: '45%', sort: 'cardName' },
      { name: 'Deposits/Credits', width: '10%', sort: 'net%2CtxType' },
      { name: 'Withdrawals/Debits', width: '10%', sort: 'kind' },
      { name: '', width: '20%', sort: '' }
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
          { options: { grayout: value.txState === 'pending' ? true : false } },
          { details: desc.details, width: '6%', key: data.ID },
          { value: createdAt },
          { value: desc.desc, primary: true},
          { value: desc.credit !== '0.00' || value.txType === 'credit' ? util.money(desc.credit) : ''},
          { value: desc.debit !== '0.00' || value.txType === 'debit' ? util.money(desc.debit) : ''},
          { actions:
            <ActionsMenu
              options={options}
            />
          }
        ]);
      });
    }
    fdata.rows = rows;

    footer.push([
      { value: '', colspan: 1},
      { value: <div style={{textAlign: 'left'}}>TOTALS</div>, colspan: 2 },
      { value: <div>{util.money(parseFloat(meta.netTotal/100).toFixed(2))}</div>, colspan: 1},
      { value: <div>{util.money(parseFloat(meta.withdrawalTotal/100).toFixed(2))}</div>, colspan: 1}
    ]);

    fdata.footer = footer;

    return fdata;
  }

  tabsCallbackBefore(key) {
    return true;
  }

  tabsCallbackAfter(key) {
    return true;
  }

  render() {

    const {
      resourceName,
      financeStats,
      transactions
    } = this.props;

    const meta = transactions.meta;
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
        multi: true,
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
            primaryText: 'Refunded/Voided',
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
        field: 'dropdown',
        name: 'txState',
        options: [
          {
            primaryText: 'Pending and Posted',
            value: 'all'
          },
          {
            primaryText: 'Pending',
            value: 'pending'
          },
          {
            primaryText: 'Posted',
            value: 'posted'
          }
        ],
        value: 'all'
      },
    ];

    if (util.isEmpty(financeStats)) return this.props.loader('Loading Stats');
    const stats = financeStats.aggregate;

    return (
      <div>
        {this.props.isFetching && this.props.loader(`Loading data`)}
        <div style={{textAlign: 'center'}}>
          <Tabs
            default='tab1'
            className='statsTab'
            style={{
              display: 'inline-block',
              width: '48%',
              marginRight: '2%'
            }}
            callbackBefore={this.tabsCallbackBefore}
            callbackAfter={this.tabsCallbackAfter}
          >
            <Tab id='tab1' label={<span><span className='icon-checkmark'></span> Lifetime</span>}>
              <StatBlock
                options={[
                  <div className='item'>
                    <div className='label'><ModalLink id='financeGlossary' className='glossary'>Lifetime NET Deposits</ModalLink> as of {Moment().format('MM/DD/YYYY')}</div>
                    <div className='value'>{util.money(parseFloat(stats.netTotal/100).toFixed(2))}</div>
                  </div>,
                  <div className='item'>
                    <div className='label'>Lifetime Withdrawals</div>
                    <div className='value'>{util.money(parseFloat(stats.withdrawalTotal/100).toFixed(2))}</div>
                  </div>
                ]}
              />
            </Tab>
            <Tab id='tab2' label='Results'>
              <StatBlock
                options={[
                  <div className='item'>
                    <div className='label'><ModalLink id='financeGlossary' className='glossary'>Results NET Deposits</ModalLink></div>
                    <div className='value'>{util.money(parseFloat(meta.netTotal/100).toFixed(2))}</div>
                  </div>,
                  <div className='item'>
                    <div className='label'>Results Withdrawals</div>
                    <div className='value'>{util.money(parseFloat(meta.withdrawalTotal/100).toFixed(2))}</div>
                  </div>
                ]}
              />
            </Tab>
          </Tabs>
          <div
            style={{
              display: 'inline-block',
              textAlign: 'left',
              width: '48%',
              marginLeft: '2%'
            }}
          >
            <ActionBar
              options={[
                <div className='item'>
                  <ModalRoute  id='addBank' component={() => this.props.loadComponent('modal/demo/AddBank', {useProjectRoot: false})} effect='3DFlipVert' style={{ width: '50%' }} />
                  <ModalLink id='addBank'>
                    <span className='icon icon-bank'></span>
                    <span className='text'>Add Bank Account</span>
                  </ModalLink>
                </div>,
                <div className='item'>
                  <span className='icon icon-withdraw'></span>
                  <span className='text'>Withdrawal Money</span>
                </div>,
                <div className='item'>
                  <span className='icon icon-payment'></span>
                  <span className='text'>Send Payment</span>
                </div>
              ]}
            />
          </div>
        </div>
        <Filter
          name={resourceName}
          options={filters}
          label='Advanced Search'
          allowDisabled={false}
        />
        <Table
          name={resourceName}
          data={() => this.formatTableData()}
          exportDesc='Export Transaction Records'
          maxRecordsDisplay='both'
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
    transactions: state.resource.orgTransactions ? state.resource.orgTransactions : {},
    financeStats: state.resource.orgFinanceStats ? state.resource.orgFinanceStats.data : {},
    isFetching: state.resource.isFetching
  }
}

export default connect(mapStateToProps, {
  getResource,
  reloadResource
})(Transactions);
