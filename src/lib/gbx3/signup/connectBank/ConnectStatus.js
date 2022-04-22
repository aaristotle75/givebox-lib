import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import { Alert } from '../../../common/Alert';
import ConnectBankHelp from '../ConnectBankHelp';
import SecureAccountHelp from '../SecureAccountHelp';

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
      isVantivReady,
      previousStepMessage
    } = this.props;

    let message = previousStepMessage || 'Please complete the previous steps to connect a bank account.';
    let componentMessage = '';
    if (isVantivReady) {
      message = 'Please click "Complete Bank Verification" below to finish connecting your bank account.'
      componentMessage = '';
    }

    if (merchantIdentString) {
      message = 'Success! Your bank account is connected to Givebox.';
      componentMessage = 'Please continue to share your fundraiser and raise money.';
    }

    return (
      <div className='flexCenter flexColumn'>
        <div className='stepTitle'>
          {message}
        </div>
        { componentMessage ?
          <div style={{ marginBottom: 0 }} className={`stepComponent`}>
            <div className='flexCenter flexColumn'>
              {componentMessage}
            </div>
          </div>
        : null }
      </div>
    )
  }

  render() {

    const {
      merchantIdentString
    } = this.props;

    return (
      <div>
        {this.getStatus()}
        <div>
          { !merchantIdentString ? 
            <ConnectBankHelp />
          : null
          }
        </div>        
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
