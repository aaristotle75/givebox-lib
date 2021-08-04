import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../../api/actions';
import GBLink from '../../../common/GBLink';

class ConnectBankManualConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      desc,
      subDesc,
      confirmText
    } = this.props;

    return (
      <div className='removeModalWrapper'>
        <h2>Manually Connect a Bank Account</h2>
        <div className='hr'></div>
        <p>
          You have clicked to manually connect your bank account. This will require extra steps and additional documentation to be submitted for review, and can take up to 7 days to get connected.
        </p>
        <div className='button-group flexCenter'>
          <GBLink className='button' onClick={this.props.plaidCallback}>
            Cancel
          </GBLink>
          <GBLink className='link secondary' onClick={this.props.manualCallback}>Continue with Manual Connect</GBLink>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(ConnectBankManualConfirm);
