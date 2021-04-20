import * as types from './actionTypes';
import * as util from '../common/utility';
import {
  getResource
} from './helpers';


/**
Merchant Properties

@param {bool} isActive
if org.status equals active then true otherwise false

@param {bool} isInstantEnabled
if instant fundraising status equals enabled than true otherwise false
if isInstantEnabled equals true than the merchant can process without a MID

@param {bool} hasMerchantInfo
if all the required info for Worldpay has been collected. This includes legal entity, principal and address info.
Uses the org.isVantivReady flag

@param {bool} hasLegalEntityID
if has a legalEntityID and legalEntityStatus equal approved than true otherwise false
This field indicates whether the merchant app was submitted to WP and if the legal entity was successfully created and approved

@param {bool} hasMID
 if has a merchantIdentString than true otherwise false.
 This field indincates whether worldpay has granted ths merchant a MID and a subMerchant was successfully created and approved
 If hasMID true than can process as normal

@param {bool} hasBankInfo
if user has a bank account and it is approved

@param {bool} hasReceivedFirstTx
if a first transaction has been received

@param {bool} isUnderwritingApproved
If org.underwritingStatus equal approved than true otherwise false

@param {bool} canProcess
Whether the merchant can process or not

@param {bool} canTransfer
Wehter the merchant can transfer money or not
**/


export function getMerchantVitals(orgData) {
  if (!orgData) return console.log('No org data - cannot get merchant vitals');
  return (dispatch, getState) => {
      const vitals = util.getValue(getState(), 'vitals', {});
      console.log('execute -> ', vitals);
  }
}

function setMerchantVitals(vitals = {}) {
  return {
    vitals,,
    type: types.SET_MERCHANT_VITALS
  }
}
