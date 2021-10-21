import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import Choice from '../../form/Choice';
import TextField from '../../form/TextField';
import ModalRoute from '../../modal/ModalRoute';
import ModalLink from '../../modal/ModalLink';
import {
  getResource
} from '../../api/helpers';
import {
  toggleModal
} from '../../api/actions';
import AnimateHeight from 'react-animate-height';
import CheckoutDonationSelect from './CheckoutDonationSelect';

class CheckoutDonationEdit extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.getResource('orgFundraisers', {
      customName: 'donationForms',
      orgID: this.props.orgID
    });
  }

  componentDidUpdate(prevProps) {

    const {
      checkoutDonation,
      checkoutDonationFormID
    } = this.props;

    if (prevProps.checkoutDonation !== this.props.checkoutDonation && checkoutDonation && !checkoutDonationFormID) {
      this.props.toggleModal('checkoutDonationSelect', true, { checkoutDonationFormID });
    }
  }

  render() {

    const {
      checkoutDonation,
      checkoutDonationText,
      checkoutDonationAmount,
      checkoutDonationFormID,
      checkoutDonationFormTitle
    } = this.props;

    return (
      <>
        <Choice
          type='checkbox'
          name='checkoutDonation'
          label={'Enable Donation Option at Checkout'}
          onChange={(name, value) => {
            this.props.updateForm('checkoutDonation', checkoutDonation ? false : true);
          }}
          checked={checkoutDonation}
          value={checkoutDonation}
          toggle={true}
        />
        <ModalRoute
          className='gbx3'
          id={'checkoutDonationSelect'}
          effect='3DFlipVert' style={{ width: '60%' }}
          draggable={false}
          component={(props) =>
            <CheckoutDonationSelect
              {...props}
              orgID={this.props.orgID}
              updateForm={this.props.updateForm}
              updateMulti={this.props.updateMulti}
            />
          }
        />
        <AnimateHeight height={checkoutDonation ? 'auto' : 0}>
          <div className='input-group' style={{ margin: '10px 15px', padding: 0 }}>
            <div className='inputLeftBar'></div>
            <div className='label'>Donation Form</div>
            <ModalLink id='checkoutDonationSelect' opts={{ checkoutDonationFormID }}>
              {checkoutDonationFormID ? 'Click Here to Change Donation Form' : 'Click Here to Select a Donation Form' }
            </ModalLink>
            <div style={{ padding: '5px 0' }} className='fieldContext'>{ checkoutDonationFormTitle ? <span className='green'><span style={{ fontStyle: 'italic' }}>Current:</span> {checkoutDonationFormTitle}</span> : 'You must select a donation form for this feature to display to the user.' }</div>
          </div>
          <TextField
            name='checkoutDonationText'
            label='Call to Action Text on Form'
            fixedLabel={true}
            placeholder='E.g. Make a donation at checkout'
            value={checkoutDonationText}
            maxLength={128}
            onChange={(e) => {
              const value = e.currentTarget.value;
              this.props.updateForm('checkoutDonationText', value);
            }}
            leftBar={true}
            style={{ margin: '0 15px' }}
          />
          <TextField
            name='checkoutDonationAmount'
            label='Default Donation Amount'
            fixedLabel={true}
            placeholder='0.00'
            money={true}
            value={checkoutDonationAmount ? checkoutDonationAmount/100 : ''}
            maxLength={7}
            onChange={(e) => {
              const value = +(e.currentTarget.value * 100);
              this.props.updateForm('checkoutDonationAmount', value);
            }}
            leftBar={true}
            style={{ margin: '0 15px' }}
          />
        </AnimateHeight>
      </>
    )
  }
};

CheckoutDonationEdit.defaultProps = {
}

function mapStateToProps(state, props) {

  const donationForms = util.getValue(state, 'resource.checkoutDonationForms.data', true);

  return {
    donationForms
  }
}

export default connect(mapStateToProps, {
  getResource,
  toggleModal
})(CheckoutDonationEdit);
