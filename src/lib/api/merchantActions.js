import * as types from './actionTypes';
import * as util from '../common/utility';
import {
  getResource
} from './helpers';


/**
* The merchant status includes:
* General merchant status
* Legal Entity created and status
* Does it have a merchantIdentString
* Is there a bank account connected and what is the status
* What is the undewriting status
* What is the risk status
* Risk options, Can transfer, can process
*/
export function getMerchantStatus() {
  const status = {
    orgStatus: null,
    instantStatus: null,
    legalEntityStatus: null,
    bankAccountStatus: null,
    underwritingStatus: null,
    riskStatus: null,
    hasMID: false,
    canProcess: false,
    canTransfer: false,
  };
  return (dispatch, getState) => {
    dispatch(setMerchantStatus(status));
  }
}

function setMerchantStatus(status) {
  return {
    status,
    type: types.SET_MERCHANT_STATUS
  }
}
