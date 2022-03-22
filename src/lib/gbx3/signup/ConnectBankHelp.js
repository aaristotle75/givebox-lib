import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../api/actions';
import * as util from '../../common/utility';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import AnimateHeight from 'react-animate-height';

class ConnectBankHelp extends React.Component {

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

    return (
      <>
         <div style={{ marginTop: 20 }} className='flexCenter'>
           <GBLink onClick={() => this.setState({ display: display ? false : true })}>
             { display ?
               <span>Why Do I have to Connect My Bank Account?</span>
             :
               <span>Click Here to Find Out Why You Have to Connect Your Bank Account</span>
             }
           </GBLink>
         </div>
         <AnimateHeight height={whyConnect ? 'auto' : 0 }>
           <div style={{ fontSize: 14, marginTop: 20 }}>
             <div style={{ display: 'block', marginBottom: 20 }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>We Need to Know Where to Send Your Money</span>
               You need to connect a bank account to Givebox to be able to receive money.
             </div>
             <div style={{ display: 'block', marginBottom: 20 }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>Givebox's Legal Obligation to Verify Your Identity</span>
               <span>
                 All US financial institutions such as banks, credit card issuers and transaction processors such as Givebox are required by law to verify the identity of the person 
                 behind any and all Accounts into which money is collected.
               </span>
               <span style={{ display: 'block', marginTop: 5 }}>
                 Verification mitigates money laundering and terrorist financing.  Givebox takes advantage of the fact that you had to prove to the bank you are who you say you are.  
                 Therefore, by linking and confirming your bank account, the background work has already been done and Givebox has now met the legal requirements to protect you and themselves.
               </span>
             </div> 
             <div style={{ display: 'block',  marginBottom: 20 }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>Faster Verification with Plaid</span>
                 When you connect with Plaid, we can verify you immediately, usually within minutes as long as the name on your bank account matches you Organization's name. 
                 <ul style={{ marginTop: 10 }}>
                   <li style={{ marginBottom: 2 }}>
                     {util.overlayLink({ 
                       src: 'https://plaid.com/trouble-connecting/',
                       title: 'Click Here if You Are Having Trouble Connecting to Plaid.'
                     })}
                   </li>
                   <li style={{ marginBottom: 2 }}>
                     {util.overlayLink({ 
                       src: 'https://plaid.com/why-is-plaid-involved/',
                       title: 'Why Does Givebox Use Plaid?'
                     })}
                   </li>
                   <li style={{ marginBottom: 2 }}>
                     {util.overlayLink({ 
                       src: 'https://plaid.com/how-it-works-for-consumers/',
                       title: 'How Does Plaid Work?'
                     })}
                   </li>
                 </ul>
             </div>
             <span style={{ display: 'block',  marginBottom: 0  }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>Manually Connecting a Bank Account</span>
               When you manually connect a bank account, you will need to provide additional documentation to verify your identity and the process can take a few days. 
             </span>
           </div>
         </AnimateHeight>      
      </>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(ConnectBankHelp);
