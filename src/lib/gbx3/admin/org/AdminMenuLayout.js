import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import {
  updateAdmin
} from '../../redux/gbx3actions';
import { toggleModal } from '../../../api/actions';

class AdminMenuLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <div className='layoutMenu'>
        <ul>
          <li className='listHeader'>Page Elements</li>
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal,
  updateAdmin
})(AdminMenuLayout);
