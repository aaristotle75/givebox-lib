import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../api/actions';
import GBLink from './GBLink';

class Remove extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      desc,
      subDesc,
      confirmText,
      modalName,
      cancelText,
      hideCancelButton,
      saveButtonStyle
    } = this.props;

    return (
      <div className='removeModalWrapper'>
        <h2>{desc}</h2>
        <div className='hr'></div>
        <p>
          {subDesc}
        </p>
        <div className='button-group flexEnd'>
          { !hideCancelButton ?
            <GBLink className='link secondary' onClick={() => this.props.toggleModal(modalName, false)}>{cancelText}</GBLink>
          : null }
          <GBLink style={saveButtonStyle} className='button' onClick={() => {
            if (this.props.callback) this.props.callback();
          }}>
            {confirmText}
          </GBLink>
        </div>
      </div>
    )
  }
}

Remove.defaultProps = {
  desc: 'Delete',
  subDesc: 'Please confirm you want to delete?',
  cancelText: 'cancel',
  hideCancelButton: false,
  modalName: 'orgRemove',
  confirmText: 'Confirm',
  saveButtonStyle: null
};

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Remove);
