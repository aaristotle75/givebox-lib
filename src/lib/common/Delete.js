import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendResource } from '../api/helpers';
import { removeResource, toggleModal } from '../api/actions';
import { Alert } from './Alert';
import GBLink from './GBLink';
import * as util from './utility';
import has from 'has';

class Delete extends Component {

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.confirmCallback = this.confirmCallback.bind(this);
    this.errorCallback = this.errorCallback.bind(this);
    this.state = {
      success: '',
      error: '',
      loading: false
    }
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
    this.setState({ loading: false });
    if (!err) {
      this.setState({ success: 'Deleted successfully.' });
      if (this.props.callback) this.props.callback();
      this.timeout = setTimeout(() => {
        this.props.removeResource(this.props.resource);
        this.props.toggleModal(this.props.modalID || 'delete', false);
        if (this.props.history && this.props.redirect) {
          this.props.history.push(this.props.redirect);
        }
        this.timeout = null;
      }, 2000);
    } else {
      if (has(err, 'data')) this.setState({ error: util.getValue(err.data, 'message', 'An error occurred.')}, this.errorCallback);
    }
  }

  confirm() {
    const {
      orgID,
      id,
      activityDesc,
      desc
    } = this.props;

    if (this.props.showLoader === 'yes') this.setState({loading: true });
    this.props.sendResource(
      this.props.resource, {
        orgID,
        id: [id],
        method: 'delete',
        data: {
          activityDesc: activityDesc || desc
        },
        sendData: false,
        callback: this.confirmCallback,
        resourcesToLoad: this.props.resourcesToLoad || null
      });
  }

  render() {

    const {
      desc,
      subDesc,
      confirmText
    } = this.props;

    return (
      <div className='removeModalWrapper'>
        <Alert alert='success' display={this.state.success} msg={this.state.success} />
        <Alert alert='error' display={this.state.error} msg={this.state.error} />
        <h2>{desc}</h2>
        <div className='hr'></div>
        <p>
          {subDesc}
        </p>
        <div className='button-group flexEnd'>
          <GBLink className='link secondary' onClick={() => this.props.toggleModal(this.props.modalID || 'delete', false)}>Cancel</GBLink>
          <GBLink className="button" onClick={this.confirm}>{confirmText}</GBLink>
        </div>
      </div>
    )
  }
}

Delete.defaultProps = {
  showLoader: 'yes',
  desc: 'Delete',
  subDesc: 'Please confirm you want to delete?',
  confirmText: 'Confirm Delete'
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  sendResource,
  removeResource,
  toggleModal
})(Delete)
