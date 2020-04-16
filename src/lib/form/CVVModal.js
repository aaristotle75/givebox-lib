import React, {Component} from 'react';
import Moment from 'moment';
import { Image, GBLink } from '../';

class CVVModal extends Component {

	render() {

		return (
			<div className="modalWrapper">
				<div className="center">
          <img className="pciImage" src='https://s3-us-west-1.amazonaws.com/givebox/public/images/logo-box.svg' alt="Givebox" height="70px" width="135px" />
				</div>
  	    <h3>What is CVV?</h3>
  			<p>
        A card verification value (CVV) or card identification code (CID) is a three or four- digit number printed on your credit card that adds an extra level of security to keep criminals from making unauthorized purchases. The CVV is sometimes referred to as a CVV2 code, or a Card Security Code (CSC).
        </p>
  			<h3>Where to Find Your CVV or CID</h3>
  			<p>The CVV for Visa, MasterCard, and Discover credit cards is a three-digit number on the back of your card. It is the last three numbers on the right side of the signature box.</p>
        <p>American Express uses a 4-digit code, called the Card Identification (CID). The American Express CID is on the front of the card above the account number.</p>
        <Image className='flexCenter' url='https://givebox.s3-us-west-1.amazonaws.com/public/images/cvv-example.png' alt='How do I find my CVV?' maxWidth={'488px'} />
				<div className="center">
						<span className="smallText">&copy; {Moment().format('YYYY')} Givebox</span>
						<span className="smallText"><GBLink primaryColor={this.props.primaryColor} onClick={() => window.open('https://givebox.com', '_blank')}>www.givebox.com</GBLink></span>
				</div>
			</div>
		)
	}
};

export default CVVModal;
