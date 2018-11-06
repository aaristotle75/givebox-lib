import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendResource } from '../api/helpers';
import { removeResource, toggleModal } from '../api/actions';
import { Alert } from './Alert';

class Delete extends Component {

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.confirmCallback = this.confirmCallback.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      success: ''
    }
  }

  confirmCallback(res, err) {
    if (!err) {
      this.setState({ success: 'Deleted successfully.' });
      if (this.props.redirect) {
        if (this.props.history) {
          setTimeout(() => {
            this.props.removeResource(this.props.resource);
            this.props.toggleModal(this.props.modalID, false);
            this.props.history.push(this.props.redirect);
          }, 2000);
        } else {
          console.error('Must pass Router history props to redirect.');
        }
      }
    }
  }

  confirm() {
    this.props.sendResource(
      this.props.resource, {
        id: [this.props.id],
        method: 'delete',
        callback: this.confirmCallback
      });
  }

  cancel() {
    this.props.toggleModal(this.props.modalID, false);
  }

  render() {

    const {
      desc
    } = this.props;

    return (
      <div className='center'>
        <Alert alert='success' msg={this.state.success} />
        <h3>You are about to delete<br /> {desc}</h3>
        <div className='button-group'>
          <button className="button secondary" type="button" onClick={this.cancel}>Cancel</button>
          <button className="button" type="button" onClick={this.confirm}>Delete</button>
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
  sendResource,
  removeResource,
  toggleModal
})(Delete)
