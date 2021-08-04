import React, { Component } from 'react';
import GBLink from './GBLink';

class Terms extends Component {

  render() {

    return (
      <div className='terms'>
        <iframe id='termsIframe' src='https://givebox.com/terms' width='100%' height='500px' title='Givebox Terms & Conditions' scrolling='yes' />
        <div className='button-group center'>
          <GBLink onClick={this.props.closeCallback} className='button'>I agree</GBLink>
        </div>
      </div>
    )
  }
}

export default Terms;
