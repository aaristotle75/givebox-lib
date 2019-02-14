import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Portal from '../common/Portal';
import Loader from '../common/Loader';
import { toggleModal } from '../api/actions';
import has from 'has';

class ModalRoute extends Component {
  constructor(props) {
    super(props);
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.receiveMessage, false);
  }

  receiveMessage(e) {
    if (e.data === this.props.id) {
      if (this.props.open) {
        this.props.toggleModal(e.data, false);
      }
    }
  }

  render() {
    const {
      effect,
      closeBtnShow,
      style,
      open,
      component,
      id,
      opts,
      className,
      appRef
    } = this.props;
    const modalRoot = document.getElementById('modal-root');

    if (!modalRoot) {
      return React.createElement(Loader, null);
    }

    return React.createElement("div", null, open && React.createElement(Portal, {
      id: id,
      rootEl: modalRoot,
      className: "modal"
    }, React.createElement(Modal, {
      className: className,
      identifier: id,
      effect: effect,
      open: open,
      closeBtnShow: closeBtnShow,
      customStyle: style,
      closeCallback: has(opts, 'closeCallback') ? opts.closeCallback : null,
      appRef: appRef
    }, component(opts))));
  }

}

ModalRoute.defaultProps = {
  className: ''
};

function mapStateToProps(state, props) {
  let open = false;
  let opts = {};

  if (has(state.modal, props.id)) {
    open = state.modal[props.id].open;
    opts = state.modal[props.id].opts;
  }

  return {
    open: open,
    opts: opts
  };
}

export default connect(mapStateToProps, {
  toggleModal
})(ModalRoute);