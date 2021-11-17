import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../api/actions';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';

class SignupConfirmation extends React.Component {

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
      confirmText
    } = this.props;

    return (
      <div className='removeModalWrapper'>
        <div style={{ marginTop: 40, marginBottom: 20 }} className='flexColumn flexCenter'>
          <div className='flexStart alignCenter'>
            <Image url='https://cdn.givebox.com/givebox/public/images/backgrounds/green-checkmark.jpeg' alt='Green Check Mark' maxSize={60} />
            <h2>Congratulations! You can now accept donations.</h2>
          </div>
          <div style={{ marginBottom: 20 }} className='previewTitleText'>
            The next step is to preview and share your fundraiser.
          </div>
        </div>
        <div className='button-group flexCenter'>
          <GBLink className='link secondary' onClick={() => this.props.toggleModal('signupConfirmation', false)}>
            Close
          </GBLink>
          <GBLink className='button' onClick={() => this.props.toggleModal('signupConfirmation', false)}>Continue to Preview & Share</GBLink>
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
  toggleModal
})(SignupConfirmation);
