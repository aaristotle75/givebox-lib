import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Portal from '../common/Portal';
import ErrorBoundary from '../common/ErrorBoundary';
import Loader from '../common/Loader';
import { toggleModal } from '../api/actions';
import * as util from '../common/utility';
import has from 'has';

class ModalRoute extends Component {

  constructor(props) {
    super(props);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.modalOpenCallback = this.modalOpenCallback.bind(this);
    this.state = {
      opened: false
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.receiveMessage, false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open && !this.props.open) {
      //console.log('execute componentDidUpdate should handle close modal-> ', this.props.open);
    }
  }

  receiveMessage(e) {
    if (e.data === this.props.id) {
      if (this.props.open) {
        this.props.toggleModal(e.data, false, this.props.opts);
      }
    }
  }

  modalOpenCallback(open) {
    this.setState({ opened: true });
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
      appRef,
      disallowBgClose,
      draggable,
      modalRootClass,
      closeCallback,
      draggableTitle,
      buttonGroup
    } = this.props;

    const modalRoot = document.getElementById('modal-root');

    const optsProps = {
      ...opts,
      ...this.props.optsProps
    };
    const customOverlay = this.props.customOverlay || {};

    if (!modalRoot) {
      return ( <Loader /> );
    }

    return (
      open ?
        <Portal id={id} rootEl={modalRoot} className={`${modalRootClass}`}>
          <Modal
            className={className}
            identifier={id}
            effect={effect}
            open={open}
            closeBtnShow={closeBtnShow}
            customStyle={style}
            closeCallback={util.getValue(optsProps, 'closeCallback', closeCallback)}
            disallowBgClose={disallowBgClose || util.getValue(optsProps, 'disallowBgClose', false)}
            customOverlay={util.getValue(optsProps, 'customOverlay', customOverlay)}
            appRef={appRef}
            draggable={draggable}
            draggableTitle={util.getValue(optsProps, 'draggableTitle', draggableTitle)}
            modalOpenCallback={this.modalOpenCallback}
            buttonGroup={buttonGroup}
          >
            { this.state.opened ?
              <ErrorBoundary>
                {component(optsProps)}
              </ErrorBoundary>
            : null }
          </Modal>
        </Portal>
      : null
    )
  }
}

ModalRoute.defaultProps = {
  className: '',
  optsProps: {},
  modalRootClass: 'generalModal'
}

function mapStateToProps(state, props) {

  let open = false;
  let opts = {};
  if (has(state.modal, props.id)) {
    open = state.modal[props.id].open;
    opts = state.modal[props.id].opts;
  }

  return {
    open,
    opts
  }
}


export default connect(mapStateToProps, {
  toggleModal
})(ModalRoute)
