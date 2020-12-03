import React, {Component} from 'react';
import Moment from 'moment';
import GBLink from '../../common/GBLink';
import Image from '../../common/Image';

class EcheckHowModal extends Component {

  render() {

    return (
      <div className="modalWrapper">
        <div className="center">
          <img className="pciImage" src='https://cdn.givebox.com/givebox/public/images/logo-box.svg' alt="Givebox" height="70px" width="135px" />
        </div>
        <h3>What is eCheck?</h3>
        <p>
          An e-check is essentially an electronic payment from your checking account. In order to use an e-check you will need to have the bank's routing number, your checking account number and of course your name as listed on the account.
        </p>
        <h3>Where do I find my bank's routing number and checking account number?</h3>
        <div style={{ marginBottom: 20 }}>
          <Image className='flexCenter' url='https://cdn.givebox.com/givebox/public/images/echeck-example.png' maxWidth={'488px'} />
        </div>
        <div className="center">
            <span className="smallText">&copy; {Moment().format('YYYY')} Givebox</span>
            <span className="smallText"><GBLink primaryColor={this.props.primaryColor} onClick={() => window.open('https://givebox.com', '_blank')}>www.givebox.com</GBLink></span>
        </div>
      </div>
    )
  }
};

export default EcheckHowModal;
