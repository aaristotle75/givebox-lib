import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import ModalLink from '../../modal/ModalLink';
import RedirectPref from '../../login/RedirectPref';

class AvatarSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
    } = this.props;

    return (
      <div className='modalWrapper avatarSettings'>
        <h2>User Settings</h2>
        <div className='formSectionContainer'>
          <div className='formSection'>
            <div className='formSubSection'>
              <span className='label'>Page You Go After Login</span>
              <RedirectPref />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(AvatarSettings);
