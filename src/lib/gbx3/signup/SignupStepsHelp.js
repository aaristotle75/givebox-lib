import React from 'react';
import { connect } from 'react-redux';
import {
  toggleModal
} from '../../api/actions';
import Image from '../../common/Image';
import GBLink from '../../common/GBLink';
import * as util from '../../common/utility';
import AnimateHeight from 'react-animate-height';

class SignupStepsHelp extends React.Component {

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
               <span>{util.getValue(content, 'linkText', 'Help Starting a Fundraiser')}</span>
             :
               <span>{util.getValue(content, 'linkText', 'Click Here for Help Starting a Fundraiser')}</span>
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
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>Givebox is 100% Free</span>
               You can use Givebox for free! We do not ask for a credit card and there is no contract.
             </div>
             <div style={{ display: 'block', marginBottom: 20 }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>How can Givebox be free?</span>
               <span>
                  Givebox is able to provide a free service because we are the processor (meaning we process the money) 
                  and we get paid through the complex interchange between your credit card issuer and the card brands like VISA, MasterCard, AMEX and Discover.
               </span>
              </div>          
              <div style={{ display: 'block', marginBottom: 20 }}>
               <span style={{ display: 'block', fontWeight: 500, fontSize: 16 }}>How Can I Raise Money Immediately?</span>
               <span>
                  After you create a fundraiser you can share it and start raising money immediately.
                  Once you get your first transaction you will then have up to 5 days to connect a bank account for where the money should be received.
               </span>
              </div>  
            </div>
          </AnimateHeight>      
      </>
    )
  }
}

SignupStepsHelp.defaultProps = {
  content: null
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(SignupStepsHelp);
