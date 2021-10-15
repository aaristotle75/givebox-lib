import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';

class AboutFee extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    const {
      primaryColor,
      fees,
      orgName
    } = this.props;

    return (
      <div className='modalWrapper orgCustomElements'>
        <div className='center'>
          <img className='pciImage' src='https://cdn.givebox.com/givebox/public/images/logo-box.svg' alt='Givebox' height='70px' width='135px' />
        </div>
        <div style={{ paddingBottom: 100 }} className='sectionContent'>
          <h3 style={{ marginBottom: 0 }}>Credit Card and Platform Fees</h3>
          <h4>PLATFORM FEE</h4>
          <p>
            Givebox charges $0.00 (yes, that is zero) platform fee. The only platform that doesn't charge an additional platform fee on top of the credit card fee.
          </p>
          <h4>CREDIT CARD FEES</h4>
          <p>VISA, MasterCard and Discover processing fee is {util.getValue(fees, 'fndPctFee')/100}% the amount plus {util.getValue(fees, 'fndFixFee')} cents per item.</p>
          <p>AMEX processing fee is {util.getValue(fees, 'amexFndPctFee')/100}% the amount plus {util.getValue(fees, 'amexFndFixFee')} cents per item.</p>
          <h4>DEBIT CARD FEE</h4>
          <p>VISA Debit, MasterCard Debit processing fee is {util.getValue(fees, 'debitPctFee')/100}% the amount plus {util.getValue(fees, 'debitFixFee')} cents per item.</p>
          <h4>ORGANIZATION FEE</h4>
          <p>The Organization can add an optional fee to cover their processing expenses. {orgName} fee is {util.getValue(fees, 'CRFTFeePct')/100}% the amount.</p>
          {/*
          <h4>ECHECK FEE</h4>
          <p>The Bank fee to make an electronic payment from your checking account is {util.getValue(fees, 'echeckPctFee')/100}% the amount plus {util.getValue(fees, 'echeckFixFee')} cents per item.</p>
          */}
        </div>
        <div className='bottomContainer2 flexCenter'>
          <div className='button-group'>
            <GBLink allowCustom={true} customColor={primaryColor} onClick={() => this.props.toggleModal('aboutFee', false)}>Close</GBLink>
            <GBLink
              className='button'
              allowCustom={true}
              customColor={primaryColor}
              onClick={() => this.props.toggleModal('aboutFee', false)}
              solidColor={true}
            >Good to Know</GBLink>
          </div>
        </div>
      </div>
    )
  }
};

function mapStateToProps(state, props) {

  const fees = util.getValue(state, 'gbx3.fees');
  const orgName = util.getValue(state, 'gbx3.info.orgName');

  return {
    fees,
    orgName
  }
}

export default connect(mapStateToProps, {
})(AboutFee);
