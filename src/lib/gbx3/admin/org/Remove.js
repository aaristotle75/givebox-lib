import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../../api/actions';
import GBLink from '../../../common/GBLink';
import { Alert } from '../../../common/Alert';
import has from 'has';
import * as util from '../../../common/utility';

class Remove extends React.Component {

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.confirmCallback = this.confirmCallback.bind(this);
    this.errorCallback = this.errorCallback.bind(this);
    this.state = {
      success: '',
      error: ''
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  errorCallback() {
    this.timeout = setTimeout(() => {
      this.setState({ error: '' });
      this.timeout = null;
    }, 3000);
  }

  confirmCallback(res, err) {
    if (this.props.useConfirmCallback) {
      if (!err) {
        this.setState({ success: this.props.successMsg });
        this.timeout = setTimeout(() => {
          this.props.toggleModal('orgRemove', false);
          this.timeout = null;
        }, 2000);
      } else {
        if (has(err, 'data')) this.setState({ error: util.getValue(err.data, 'message', 'An error occurred.')}, this.errorCallback);
      }
    }
  }

  confirm() {
    if (this.props.callback) {
      this.props.callback(this.confirmCallback);
    }
  }

  render() {

    const {
      desc,
      subDesc,
      confirmText,
      modalName
    } = this.props;

    return (
      <div className='removeModalWrapper'>
        <Alert alert='success' display={this.state.success} msg={this.state.success} />
        <h2>{desc}</h2>
        <div className='hr'></div>
        <p>
          {subDesc}
        </p>
        <div className='button-group flexEnd'>
          <GBLink className='link secondary' onClick={() => this.props.toggleModal(modalName, false)}>Cancel</GBLink>
          <GBLink className='button' onClick={this.confirm}>
            {confirmText}
          </GBLink>
        </div>
      </div>
    )
  }
}

Remove.defaultProps = {
  modalName: 'orgRemove',
  confirmText: 'Confirm',
  useConfirmCallback: true,
  successMsg: 'Removed successfully.'
};

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Remove);
