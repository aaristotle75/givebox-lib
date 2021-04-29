import * as types from './merchantActionTypes';
import * as util from '../../common/utility';
import * as _v from '../../form/formValidate';
import {
  getResource,
  sendResource
} from '../../api/helpers';
import Moment from 'moment';

export function setMerchantApp(key, value) {
  return {
    key,
    value,
    type: types.SET_MERCHANT_APP
  }
}

export function updateMerchantApp(name, obj) {
  return {
    name,
    obj,
    type: types.UPDATE_MERCHANT_APP
  }
}

export function getLegalEntity(options = {}) {
  const opts = {
    reload: true,
    orgID: null,
    callback: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const org = util.getValue(state, 'resource.org.data', {});
    dispatch(getResource('orgLegalEntity', {
      orgID,
      reload: opts.reload,
      callback: async (res, err) => {
        if (!util.isEmpty(res) && !err) {
          if (opts.callback) opts.callback(res, err);
        } else {
          dispatch(saveLegalEntity({
            hasBeenUpdated: true,
            callback: opts.callback,
            data: {
              name: util.getValue(org, 'name'),
              taxID: util.getValue(org, 'taxID')
            }
          }));
          if (opts.callback) opts.callback(res, err);
        }
      }
    }));
  }
}

export function saveLegalEntity(options = {}) {
  const opts = {
    hasBeenUpdated: false,
    data: {},
    orgID: null,
    callback: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const data = {
      ...opts.data
    };

    if (data.contactPhone) data.contactPhone = util.prunePhone(data.contactPhone);
    data.annualCreditCardSalesVolume = +data.annualCreditCardSalesVolume;
    data.yearsInBusiness = +data.yearsInBusiness;

    if (opts.hasBeenUpdated) {
      dispatch(sendResource('orgLegalEntity', {
        orgID,
        data,
        method: data.ID ? 'patch' : 'post',
        callback: async (res, err) => {
          if (!data.ID) {
            dispatch(getLegalEntity({
              callback: opts.callback
            }))
          } else {
            if (opts.callback) opts.callback(res, err);
          }
        }
      }));
    } else {
      if (opts.callback) opts.callback();
    }
  }
}

export function saveBankAccount(options = {}) {
  const opts = {
    hasBeenUpdated: false,
    data: {},
    orgID: null,
    callback: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const data = {
      ...opts.data
    };

    if (!data.number) data.number = null;

    if (opts.hasBeenUpdated) {
      dispatch(sendResource(data.ID ? 'orgBankAccount' : 'orgBankAccounts', {
        id: data.ID ? [data.ID] : null,
        orgID,
        data,
        method: data.ID ? 'patch' : 'post',
        callback: (res, err) => {
          if (opts.callback) opts.callback(res, err);
        },
        resourcesToLoad: ['orgBankAccounts']
      }));
    } else {
      if (opts.callback) opts.callback();
    }
  }
}

export function savePrincipal(options = {}) {
  const opts = {
    hasBeenUpdated: false,
    data: {},
    orgID: null,
    callback: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const taxID = util.getValue(state, 'resource.org.data.taxID');
    const data = {
      ...opts.data
    };

    if (data.contactPhone) data.contactPhone = util.prunePhone(data.contactPhone);
    //if (!data.SSN) data.SSN = _v.formatSSN(taxID);
    if (!data.SSN) data.SSN = _v.formatTaxID(taxID);
    if (!data.dateOfBirth) {
      const minDate = Moment().subtract(18, 'years');
      const minDateFormat = minDate.format('MM/DD/YYYY');
      const minDateTS = parseInt(minDate.valueOf()/1000);
      const maxDate = Moment().subtract(60, 'years');
      const maxDateFormat = maxDate.format('MM/DD/YYYY');
      const maxDateTS = parseInt(maxDate.valueOf()/1000);
      const randomTS = util.getRand(minDateTS, maxDateTS);
      data.dateOfBirth = randomTS;
    }

    if (opts.hasBeenUpdated) {
      dispatch(sendResource(data.ID ? 'orgPrincipal' : 'orgPrincipals', {
        id: data.ID ? [data.ID] : null,
        orgID,
        data,
        method: data.ID ? 'patch' : 'post',
        callback: (res, err) => {
          if (opts.callback) opts.callback(res, err);
        },
        resourcesToLoad: ['orgPrincipals']
      }));
    } else {
      if (opts.callback) opts.callback();
    }
  }
}

export function saveAddress(options = {}) {
  const opts = {
    hasBeenUpdated: false,
    data: {},
    orgID: null,
    callback: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const data = {
      ...opts.data
    };

    if (opts.hasBeenUpdated) {
      dispatch(sendResource(data.ID ? 'orgAddress' : 'orgAddresses', {
        id: data.ID ? [data.ID] : null,
        orgID,
        data,
        method: data.ID ? 'patch' : 'post',
        callback: (res, err) => {
          if (opts.callback) opts.callback(res, err);
        }
      }));
    } else {
      if (opts.callback) opts.callback();
    }
  }
}

export function checkSubmitMerchantApp(options = {}) {
  const opts = {
    callback: null,
    isSending: false,
    sendData: false,
    ...options
  }

  return (dispatch, getState) => {

    const state = getState();
    const vantiv = util.getValue(state, 'resource.gbx3Org.data.vantiv', {});
    const merchantIdentString = util.getValue(vantiv, 'merchantIdentString');
    const isVantivReady = util.getValue(vantiv, 'isVantivReady');

    if (isVantivReady && !merchantIdentString) {
      dispatch(getResource('org', {
        customName: 'gbx3Org',
        reload: true,
        isSending: false,
        callback: (res, err) => {
          const vantiv = util.getValue(res, 'vantiv', {});
          const merchantIdentString = util.getValue(vantiv, 'merchantIdentString');
          const isVantivReady = util.getValue(vantiv, 'isVantivReady');
          const legalEntityID = util.getValue(vantiv, 'legalEntityID');
          const legalEntityStatus = util.getValue(vantiv, 'legalEntityStatus');

          let submitToVantiv = false;
          let query = null;

          if (isVantivReady && !legalEntityID) {
            submitToVantiv = 'submitted_to_vantiv';
          } else if (legalEntityStatus === 'approved' && !merchantIdentString) {
            submitToVantiv = 'submerchant_only';
            query = 'submerchant_only=true';
          }

          if (submitToVantiv) {
            dispatch(sendResource('orgSubmitToVantiv', {
              query,
              isSending: opts.isSending,
              sendData: opts.sendData,
              callback: (res, err) => {
                if (opts.callback) opts.callback(res, err, submitToVantiv);
              }
            }));
          }
        }
      }))
    } else {
      if (opts.callback) opts.callback();
    }
  }
}

/****
* Plaid Actions
*/
export function getLinkToken() {
  return (dispatch) => {
    dispatch(sendResource('plaidLink', {
      method: 'POST',
      callback: (res, err) => {
        if (!util.isEmpty(res) && !err) {
          const linkToken = util.getValue(res, 'linkToken');
          dispatch(updateMerchantApp('plaid', { linkToken }));
        }
      }
    }));
  }
}

export function accessToken(publicToken, metaData) {
  return (dispatch) => {
    const account_id = util.getValue(metaData, 'account_id');
    dispatch(updateMerchantApp('plaid', { account_id }));

    this.props.sendResource('plaidAccess', {
      data: {
        publicToken
      },
      method: 'POST',
      callback: (res, err) => {
        console.log('execute plaidAccess -> ', res, err);
      }
    })
  }
}


/**
* End Plaid Actions
*/
