import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../../api/actions';
import GBLink from '../../../common/GBLink';
import Image from '../../../common/Image';

class VoidCheck extends React.Component {

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
        <div className='flexCenter flexColumn'>
          <Image url='https://cdn.givebox.com/givebox/public/images/backgrounds/void-check.png' alt='What is a voided check?' maxWidth={'500px'} />
        </div>
        <div className='button-group flexCenter'>
          <GBLink className='button' onClick={() => this.props.toggleModal('voidCheckExample', false)}>Close</GBLink>
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
})(VoidCheck);
