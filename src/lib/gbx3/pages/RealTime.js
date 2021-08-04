import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';
import {
  toggleModal
} from '../../api/actions';
import {
  getResource,
  savePrefs
} from '../../api/helpers';
import AnimateHeight from 'react-animate-height';
import RealTimeTicker from './RealTimeTicker';
import MoneyRaised from './MoneyRaised';
import Moment from 'moment';
import '../../styles/realtime.scss';

class RealTimeClass extends Component {

  render() {

    const orgStats = util.getValue(this.props.orgStats, 'data', {});
    const transactions = util.getValue(this.props.transactions, 'data', {});
    const latest = !util.isEmpty(transactions) ? util.getValue(transactions[0], 'credit', {}) : {};
    const balance = util.numberWithCommas(parseFloat(util.getValue(orgStats, 'netTotal', 0)/100).toFixed(2)).split('.');
    let dollarAmount = <span className='dollarAmount'>{balance[0]}</span>;
    let centAmount = `.${balance[1]}`;

    if (balance[0].includes(',')) {
      let dollarArr = balance[0].split(',');
      dollarAmount =
        <span className='dollarAmount'>
          {dollarArr[0]}
          <span><span className='dollarComma'>,</span>{dollarArr[1]}</span>
          {dollarArr[2] && <span><span className='dollarComma'>,</span>{dollarArr[2]}</span>}
        </span>
    }

    return (
      <div className='realTimeFlex'>
        <MoneyRaised balance={balance} />

        {/*
        <div className='realTimeTotal'>
          <span className='moneyAmount'><span className='symbol'>$</span>{dollarAmount}<span className='centAmount'><span className='centSymbol'></span>{centAmount}</span></span>
          <span className='change'><span className='icon icon-arrow-up'></span> {util.money(util.calcAmount(util.getValue(latest, 'amount', 0), util.getValue(latest, 'fee', 0), util.getValue(latest, 'passFees', true)))}</span>
          { util.getValue(latest, 'updatedAt') ? <span className='date'>{Moment.unix(util.getValue(latest, 'updatedAt', 0)).fromNow()}</span> : ''}
        </div>
        */}
        <RealTimeTicker display={this.props.display} />
      </div>
    )
  }
}

class RealTime extends Component {

  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.timer = this.timer.bind(this);
    this.checkForLatest = this.checkForLatest.bind(this);
    this.state = {
      processed: 0,
      loading: false
    }
    this.loop = null;
  }

  componentDidMount() {
    this.checkForLatest();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.loop) {
      clearTimeout(this.loop);
      this.loop = null;
    }
  }

  timer(callback) {
    this.loop = setTimeout(() => {
      callback();
      this.loop = null;
    }, 10000);
  }

  checkForLatest() {
    this.checkProcessed();
    if (process.env.NODE_ENV !== 'development') this.timer(this.checkForLatest);
  }

  checkProcessed() {
    this.props.getResource('orgFinanceStats', {
      reload: true,
      isSending: false,
      callback: (res, err) => {
        const aggregate = util.getValue(res, 'aggregate', {});
        const total = util.getValue(aggregate, 'grossTotal', 0);
        if (total !== this.state.processed) {
          this.setState({ processed: total }, this.getData());
        }
      }
    });
  }

  getData() {
    this.props.getResource('orgFinanceStats', {
      reload: true,
      isSending: false
    });
    this.props.getResource('orgStats', { reload: true, isSending: false });
    this.props.getResource('orgTransactions', {
      customName: 'latestTransactions',
      search: {
        sort: 'createdAt',
        order: 'desc',
        filter: '(state:"approved"%2Cstate:"if_batch")%3BtxType:"credit"',
        max: 10
      },
      reload: true,
      isSending: false
    });
  }

  toggleDisplay() {
    const display = this.state.display ? false : true;
    this.setState({ display });
    this.props.savePrefs({ ticker: { open: display } });
  }

  render() {

    const {
      display
    } = this.props;

    const orgStats = util.getValue(this.props.orgStats, 'data', {});
    const netTotal = util.getValue(orgStats, 'netTotal', 0);

    return (
        <AnimateHeight
          duration={500}
          height={display ? 'auto' : 1}
        >
          <div id='realTimeTicker' className='realTimeWrapper'>
            <div className='realTime'>
              <GBLink className='close link' onClick={this.props.toggleDisplay}><span className='icon icon-x'></span></GBLink>
              { display && util.isFetching(this.props.transactions) ?
                <div className={`realTimeLoader`}>
                  <Image url='https://cdn.givebox.com/givebox/public/images/tiny-loader.png' alt='Loader' />
                </div>
              :
                <RealTimeClass {...this.props} display={display} />
              }
            </div>
          </div>
        </AnimateHeight>
    )
  }
}

class RealTimeDisplay extends Component {

  constructor(props) {
    super(props);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.state = {
      display: this.props.open
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ display: this.props.open });
    }
  }

  toggleDisplay() {
    const display = this.state.display ? false : true;
    this.setState({ display });
    this.props.savePrefs({ ticker: { open: display } });
  }

  render() {

    const {
      stage
    } = this.props;

    const {
      display
    } = this.state;

    if (!display || stage !== 'admin') {
      return <></>;
    }

    return (
      <RealTime
        {...this.props}
        display={display}
        toggleDisplay={this.toggleDisplay}
      />
    )
  }
}

function mapStateToProps(state, props) {

  const pref = util.getValue(state.preferences, 'ticker', {});
  const open = util.getValue(pref, 'open', true);
  const transactions =  state.resource.latestTransactions ? state.resource.latestTransactions : {};
  const orgFinanceStats = state.resource.orgFinanceStats ? state.resource.orgFinanceStats : {};
  const orgStats = state.resource.orgStats ? state.resource.orgStats : {};
  const stage = util.getValue(state, 'gbx3.info.stage');

  return {
    open,
    transactions,
    orgFinanceStats,
    orgStats,
    stage
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  getResource,
  savePrefs
})(RealTimeDisplay);
