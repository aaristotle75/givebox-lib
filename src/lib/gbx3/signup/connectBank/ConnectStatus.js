import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import { Alert } from '../../../common/Alert';

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

    let message = isVantivReady ? 'Please click "Check Connection Status" below to finish connecting your bank account.' : 'Please complete the previous steps to connect a bank account.';
    if (merchantIdentString) {
      message = 'Success! Your bank account is connected to Givebox.';
    }

    return message;
  }

  render() {

    const {
      merchantIdentString,
      legalEntityStatus,
      legalEntityID,
      isVantivReady
    } = this.props;

    return (
      <div className='stepTitle'>
        { merchantIdentString ?
          <Alert alert='success' display={true} msg='Congratulations, you can continue to accept donations. Share your fundraiser to raise money!' />
        : null }
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
