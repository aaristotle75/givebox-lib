import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendResource } from '../api/helpers';
import { removeResource, toggleModal } from '../api/actions';
import { Alert } from './Alert';
import { util } from '../';
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
    if (this.props.showLoader === 'yes') this.setState({loading: true });
    this.props.sendResource(
      this.props.resource, {
        id: [this.props.id],
        method: 'delete',
        data: {
          activityDesc: this.props.desc
        },
        callback: this.confirmCallback,
        resourcesToLoad: this.props.resourcesToLoad || null
      });
  }

  render() {

    const {
      desc
    } = this.props;

    return (
      <div className='center'>
        {this.state.loading && this.props.loader('Deleting...')}
        <Alert alert='success' display={this.state.success} msg={this.state.success} />
        <Alert alert='error' display={this.state.error} msg={this.state.error} />
        <h3>You are about to delete<br /> {desc}</h3>
        <div className='button-group'>
          <button className="button" type="button" onClick={this.confirm}>Confirm Delete</button>
        </div>
      </div>
    )
  }
}

Delete.defaultProps = {
  showLoader: 'yes'
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
