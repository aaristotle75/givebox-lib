import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import {
  resetGBX3Receipt,
  saveReceipt,
} from '../../redux/gbx3actions';
import { toggleModal } from '../../../api/actions';

class ReceiptMenuTools extends React.Component {

  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.state = {
    };
  }

  reset() {
    this.props.resetGBX3Receipt();
  }

  render() {

    return (
      <div className='layoutMenu'>
        <ul>
          <li onClick={this.reset}>Reset Receipt</li>
          <li onClick={() => this.props.saveReceipt({ isSending: true })}>Save</li>
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});

  return {
    gbx3
  }
}

export default connect(mapStateToProps, {
  resetGBX3Receipt,
  saveReceipt,
  toggleModal
})(ReceiptMenuTools);
