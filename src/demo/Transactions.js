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
  * Set Description and Details
  * @param {string} txType credit or debit
  * @param {object} data
  */
  setDesc(txType, txData) {
    const data = txData[txType];
    const item = {
      desc: [],
      details: []
    };
    switch (txType) {
      case 'credit': {
        item.desc.push(
          <div key={`${txType}-${data.ID}`} className='description'>
            <span className='line'>{data.cardName || `${data.cusFirstName} ${data.cusLastName}`}{data.cardType ? `, ${data.cardType.toUpperCase()} ${data.cardLast4} - ${data.state.toUpperCase()}` : ''}</span>
          </div>
        );
        let commerceDesc = '';
        if (txData.txAccount === 'commerce') commerceDesc = `per, Qty ${data.articleUnitQuantity} x ${data.articleUnitDescription}`;
        item.details.push(
          <div key={`${txType}-${data.ID}-details`} className='description'>
            <span className='line'>Transaction ID: {data.transactionID}</span>
            <span className='line'>{data.articleTitle.toUpperCase()}</span>
            <span className='line'>{types.kind(data.articleKind).txName} from {types.source(data.sourceType)}</span>
            <span className='line'>{data.cusEmail}</span>
            {commerceDesc && <span className='line'>{util.money(parseFloat(data.articleUnitPrice/100).toFixed(2))} {commerceDesc}</span>}
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
                <span className='line'>{data.kind === 'deposit' ? 'WITHDRAWAL' : 'PAYMENT'} to xxxxxx{data.dstAccount.last4} - {data.status.toUpperCase()}</span>
              </div>
            );
            item.details.push(
              <div key={`${txType}-${data.ID}-details`} className='description'>
                <span className='line'>{data.dstAccount.name}</span>
                <span className='line'>Account: xxxxxx{data.dstAccount.last4}</span>
                <span className='line'>Routing: {data.dstAccount.routingNumber}</span>
              </div>
            );
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
                <span className='line'>Transaction ID: {data.transactionID}</span>
              </div>
            );
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
    //let footer = [];

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
          { details: desc.details, width: '6%' },
          createdAt,
          desc.desc,
          value.txType === 'credit' ? util.money(util.calcAmount(data.amount, data.fee, data.passFees)) : '',
          value.txType === 'debit' ? util.money(parseFloat(data.amount/100).toFixed(2)) : '',
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

    return (
      <div>
        {this.props.isFetching && this.props.loader(`Loading data`)}
        <Table
          name={resourceName}
          data={() => this.formatTableData()}
          exportDesc='Export Transaction Records'
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
