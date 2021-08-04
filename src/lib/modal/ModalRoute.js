import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Portal from '../common/Portal';
import ErrorBoundary from '../common/ErrorBoundary';
import Loader from '../common/Loader';
import { modalClosed, toggleModal } from '../api/actions';
import * as util from '../common/utility';
import has from 'has';

class ModalRoute extends Component {

  constructor(props) {
    super(props);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.state = {
      opened: false
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.receiveMessage, false);
  }

  async receiveMessage(e) {
    if (e.data === this.props.id) {
      if (this.props.opened) {
        this.props.toggleModal(e.data, false, this.props.opts);
        this.props.modalClosed(e.data);
      }
    }
  }

  render() {

    const {
      effect,
      closeBtnShow,
      style,
      open,
      opened,
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
      buttonGroup,
      forceShowModalGraphic
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
      opened ?
        <Portal id={id} rootEl={modalRoot} className={`${modalRootClass}`}>
          <Modal
            className={className}
            identifier={id}
            effect={effect}
            open={open}
            opened={opened}
            closeBtnShow={closeBtnShow}
            customStyle={style}
            closeCallback={util.getValue(optsProps, 'closeCallback', closeCallback)}
            disallowBgClose={disallowBgClose || util.getValue(optsProps, 'disallowBgClose', false)}
            customOverlay={util.getValue(optsProps, 'customOverlay', customOverlay)}
            appRef={appRef}
            draggable={draggable}
            draggableTitle={util.getValue(optsProps, 'draggableTitle', draggableTitle)}
            buttonGroup={buttonGroup}
            blurClass={util.getValue(optsProps, 'blurClass', 'blur')}
            forceShowModalGraphic={util.getValue(optsProps, 'forceShowModalGraphic', forceShowModalGraphic)}
          >
            { opened ?
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

  let opened = false;
  let open = false;
  let opts = {};

  if (has(state.modal, props.id)) {
    opened = state.modal[props.id].opened;
    open = state.modal[props.id].open;
    opts = state.modal[props.id].opts;
  }

  return {
    opened,
    open,
    opts
  }
}


export default connect(mapStateToProps, {
  modalClosed,
  toggleModal
})(ModalRoute)
