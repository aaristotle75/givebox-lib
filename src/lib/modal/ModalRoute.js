import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Portal from '../common/Portal';
import Loader from '../common/Loader';
import { toggleModal } from '../api/actions';
import { util } from '../';
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
      appRef,
      disallowBgClose,
      draggable,
      modalRootClass
    } = this.props;

    const modalRoot = document.getElementById('modal-root');

    const optsProps = { ...opts, ...this.props.optsProps };
		const customOverlay = this.props.customOverlay || {};

    if (!modalRoot) {
      return ( <Loader /> );
    }

    return (
      <div>
        { open &&
          <Portal id={id} rootEl={modalRoot} className={`${modalRootClass}`}>
            <Modal
              className={className}
              identifier={id}
              effect={effect}
              open={open}
              closeBtnShow={closeBtnShow}
              customStyle={style}
              closeCallback={util.getValue(optsProps, 'closeCallback', null)}
              disallowBgClose={disallowBgClose || util.getValue(optsProps, 'disallowBgClose', false)}
							customOverlay={util.getValue(optsProps, 'customOverlay', customOverlay)}
              appRef={appRef}
              draggable={draggable}
            >
              {component(optsProps)}
            </Modal>
          </Portal>
        }
      </div>
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
    open: open,
    opts: opts
  }
}


export default connect(mapStateToProps, {
  toggleModal
})(ModalRoute)
