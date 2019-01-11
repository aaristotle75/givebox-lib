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
    this.searchForOpenModals = this.searchForOpenModals.bind(this);
  }

  componentDidMount() {
		window.addEventListener('message', this.receiveMessage, false);
  }

  componentWillUnmount() {
  }

  searchForOpenModals(ignore) {
    let modalIsOpen = false;
    Object.entries(this.props.modals).forEach(([key, value]) => {
      if (ignore !== key && value.open) modalIsOpen = true;
    });
    return modalIsOpen;
  }

  receiveMessage(e) {
    if (e.data === this.props.id) {
      if (this.props.open) {
        this.props.toggleModal(e.data, false);
        if (this.props.appRef && !this.searchForOpenModals(e.data)) {
          if (this.props.appRef.current.classList.contains('blur')) {
            this.props.appRef.current.classList.remove('blur');
          }
        }
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
      return ( <Loader /> );
    }

    if (appRef) {
      if (open) {
        appRef.current.classList.add('blur');
      }
    }

    return (
      <div>
        { open &&
          <Portal rootEl={modalRoot} className='modal'>
            <Modal
              className={className}
              identifier={id}
              effect={effect}
              open={open}
              closeBtnShow={closeBtnShow}
              customStyle={style}
            >
              {component(opts)}
            </Modal>
          </Portal>
        }
      </div>
    )
  }
}

ModalRoute.defaultProps = {
  className: ''
}

function mapStateToProps(state, props) {

  let open = false;
  let opts = {};
  if (has(state.modal, props.id)) {
    open = state.modal[props.id].open;
    opts = state.modal[props.id].opts;
  }

  return {
    modals: state.modal,
    open: open,
    opts: opts,
    reduxAppRef: state.app.appRef
  }
}


export default connect(mapStateToProps, {
  toggleModal
})(ModalRoute)
