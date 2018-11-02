import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Portal from './Portal';
import Loader from './Loader';
import { toggleModal } from '../redux/actions';

class ModalRoute extends Component {

  constructor(props) {
    super(props);
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  componentDidMount() {
		window.addEventListener('message', this.receiveMessage, false);
  }

  componentWillUnmount() {
  }

  receiveMessage(e) {
    if (e.data === this.props.id) {
      if (this.props.open) this.props.toggleModal(e.data, false);
    }
  }

  render() {

    const {
      effect,
      closeBtnShow,
      style,
      open,
      component,
      id
    } = this.props;

    const modalRoot = document.getElementById('modal-root');

    if (!modalRoot) {
      return ( <Loader /> );
    }

    return (
      <div>
        { open &&
          <Portal rootEl={modalRoot} className='modal'>
            <Modal
              identifier={id}
              effect={effect}
              open={open}
              closeBtnShow={closeBtnShow}
              customStyle={style}
            >
              {component()}
            </Modal>
          </Portal>
        }
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    open: !!state.modal[props.id]
  }
}


export default connect(mapStateToProps, {
  toggleModal
})(ModalRoute)
