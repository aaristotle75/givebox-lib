import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../../api/actions';
import GBLink from '../../../common/GBLink';

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
      modalName
    } = this.props;

    return (
      <div className='removeModalWrapper'>
        <h2>{desc}</h2>
        <div className='hr'></div>
        <p>
          {subDesc}
        </p>
        <div className='button-group flexEnd'>
          <GBLink className='link secondary' onClick={() => this.props.toggleModal(modalName, false)}>Cancel</GBLink>
          <GBLink className='button' onClick={() => {
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
  modalName: 'orgRemove',
  confirmText: 'Confirm'
};

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(Remove);
