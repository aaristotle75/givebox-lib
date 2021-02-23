import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import ModalLink from '../../../modal/ModalLink';
import ModalRoute from '../../../modal/ModalRoute';
import GBLink from '../../../common/GBLink';
import Loader from '../../../common/Loader';
import {
  resetOrg
} from '../../redux/gbx3actions';
import { toggleModal } from '../../../api/actions';

class AdminMenuTools extends React.Component {

  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.state = {
      resetting: false
    };
  }

  reset() {
    this.setState({ resetting: true });
    this.props.resetOrg(() => {
      this.setState({ resetting: false });
      this.props.toggleModal('resetOrgConfirmation', false);
    });
  }

  render() {

    return (
      <div className='layoutMenu'>
        <ModalRoute
          id='resetOrgConfirmation'
          effect='3DFlipVert'
          style={{ width: '60%' }}
          className='gbx3'
          component={(props) =>
            <div className='modalWrapper'>
              { this.state.resetting ? <Loader msg='Resetting' /> : null }
              <div className='center'>
                <h2 style={{ marginBottom: 10 }}>Please confirm you want to reset.</h2>
                All style, layout and content changes will be reverted to defaults.
              </div>
              <div style={{ marginBottom: 0 }} className='button-group center'>
                <GBLink className='link' onClick={() => this.props.toggleModal('resetOrgConfirmation', false)}>Cancel</GBLink>
                <GBLink className='button' onClick={this.reset}>Confirm Reset</GBLink>
              </div>
            </div>
          }
        />
        <ul>
          <ModalLink type='li' id='resetOrgConfirmation'>
            <>
              Reset
              <span className='wrap smallText gray'>Caution! This resets everything<br /> including content.</span>
            </>
          </ModalLink>
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
  resetOrg
})(AdminMenuTools);
