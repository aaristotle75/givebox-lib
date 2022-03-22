import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../api/actions';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import * as util from '../../common/utility';
import AnimateHeight from 'react-animate-height';

class SecureAccountHelp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      display: false
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      display
    } = this.state;

    const {
      content
    } = this.props;

    return (
      <>
         <div style={{ marginTop: 20 }} className='flexCenter'>
           <GBLink onClick={() => this.setState({ display: display ? false : true })}>
             { display ?
               <span>{util.getValue(content, 'linkText', 'Why Do I have to Secure My Account?')}</span>
             :
               <span>{util.getValue(content, 'linkText', 'Click Here to Find Out Why You Have to Secure Your Account to Prevent Fraud')}</span>
             }
           </GBLink>
         </div>
         <AnimateHeight height={display ? 'auto' : 0 }>
           <div style={{ fontSize: 14, marginTop: 20 }}>
              { !util.isEmpty(content) ?
              <div style={{ display: 'block', marginBottom: 20 }}>
                <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>{util.getValue(content, 'title')}</span>
                {util.getValue(content, 'text')}
              </div>
              : null }
             <div style={{ display: 'block', marginBottom: 20 }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>Fraud is Rampant</span>
               Fraud has increased exponentially and securing your account is the number one way to prevent it.
             </div>
             <div style={{ display: 'block', marginBottom: 20 }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>Givebox's Legal Obligation to Protect Your Account</span>
               <span>
                  All US financial institutions such as banks, credit card issuers and transaction processors such as Givebox
                  are required to KYC (Know Your Customer) and do Customer Due Diligence to protect your account from fraud.
               </span>
               <span style={{ display: 'block', marginTop: 5 }}>
                 Securing your account mitigates fraud, money laundering and terrorist financing. 
                 Therefore, by securing your account, Givebox has now met the legal requirements to protect you and themselves.
               </span>
              </div>
              <div style={{ display: 'block', marginBottom: 20 }}>
                <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>Other Sites Do Not Make Me Do This</span>
                <span>
                  If you use other websites that do not require you to secure your account,
                  you are being exposed to an extremely high risk of fraud and inevitable identity theft.
               </span>
               <span style={{ display: 'block', marginTop: 5 }}>
                 Any legimiate service used to collect and transfer money, whether it is Stripe, Paypal, Square, or Givebox, 
                 you are going to be required to secure your account and provide verifying information and documented proof.
                 In short, If you want to raise money online and avoid being scammed, you are going to need to do the same steps anywhere. 
               </span>
              </div>            
            </div>
          </AnimateHeight>      
      </>
    )
  }
}

SecureAccountHelp.defaultProps = {
  content: null
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(SecureAccountHelp);
