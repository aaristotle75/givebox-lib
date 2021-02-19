import React from 'react';
import { connect } from 'react-redux';

class EditProfilePic extends React.Component {

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
      <div className='modalWrapper'>
        Edit Profile Pic....
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(EditProfilePic);
