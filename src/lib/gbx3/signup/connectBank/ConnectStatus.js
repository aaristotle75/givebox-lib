import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';

class ConnectStatus extends React.Component {

  constructor(props) {
    super(props);
    this.getStatus = this.getStatus.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      merchantIdentString
    } = this.props;

    if (merchantIdentString) {
      this.props.stepCompleted('connectStatus', false);
    }
  }

  getStatus() {
    const {
      merchantIdentString,
      legalEntityStatus,
      legalEntityID,
      isVantivReady
    } = this.props;

    let message = 'Please complete all the steps to connect a bank account. After completing steps please check status to confirm your bank account is connected.';
    if (merchantIdentString) {
      message = <span className='green'>Congratulations, your bank account is connected to Givebox.</span>;
    }

    return (
      <span style={{ display: 'block' }}>{message}</span>
    )
  }

  render() {

    const {
      merchantIdentString,
      legalEntityStatus,
      legalEntityID,
      isVantivReady
    } = this.props;

    return (
      <div>
        <span style={{ display: 'block', fontStyle: 'italic', fontSize: 13, marginTop: 30 }}>Your Connection Status:</span>
        {this.getStatus()}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const isVantivReady = util.getValue(state, 'resource.gbx3Org.data.vantiv.isVantivReady');
  const merchantIdentString = util.getValue(state, 'resource.gbx3Org.data.vantiv.merchantIdentString');
  const legalEntityID = util.getValue(state, 'resource.gbx3Org.data.vantiv.legalEntityID');
  const legalEntityStatus = util.getValue(state, 'resource.gbx3Org.data.vantiv.legalEntityStatus');

  return {
    merchantIdentString,
    legalEntityID,
    legalEntityStatus,
    isVantivReady
  }
}

export default connect(mapStateToProps, {
})(ConnectStatus);
