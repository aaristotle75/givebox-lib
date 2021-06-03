import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Moment from 'moment';
import Ticker from 'react-ticker'

class RealTimeTickerClass extends Component {

  constructor(props) {
    super(props);
    this.renderList = this.renderList.bind(this);
  }

  renderList(int) {
    const items = [];
    const list = util.getValue(this.props.transactions, 'data', {});
    const increment = int.toString();
    const count = parseInt(increment.slice(-1));
    let index = list.length > 9 && count >= list.length ? count - 9 : count;

    if (!util.isEmpty(list)) {
      const value = util.getValue(list, index, {});
      if (!util.isEmpty(value)) {
        const credit = util.getValue(value, 'credit', {});
        const nameOnCard = util.getValue(credit, 'paymethod.card.name');
        items.push(
          <div
            className='description'
            key={index}
            opts={{ id: credit.cusID }}
            onClick={() => {
              console.log('onClick item in ticker -> ', credit);
            }}
          >
            <span className='line amount'>{util.money(util.calcAmount(credit.amount, credit.fee, credit.passFees))}</span>
            <span className='line smallText'>{nameOnCard}</span>
            <span className='line date'>{Moment.unix(credit.updatedAt).fromNow()}</span>
          </div>
        );
      } else {
        items.push(
          <div key={increment} className='description'>
            <span className='line'></span>
          </div>
        );
      }
    }
    return items;
  }

  render() {

    return (
      <div style={{ width: '100%' }}>
        {this.renderList(this.props.index)}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const transactions =  state.resource.latestTransactions ? state.resource.latestTransactions : {}

  return {
    transactions
  }
}

const RealTimeTickerConnect = connect(mapStateToProps, {
})(RealTimeTickerClass);

const RealTimeTicker = ({ display }) => {

  return (
    <Ticker
      mode={'chain'}
      move={display}
    >
      {({index}) => <RealTimeTickerConnect index={index} />}
    </Ticker>
  )
}

export default RealTimeTicker;
