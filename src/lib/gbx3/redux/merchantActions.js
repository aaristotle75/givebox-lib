import * as types from './merchantActionTypes';
import * as util from '../../common/utility';
import {
  getResource,
  sendResource
} from '../../api/helpers';

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

@param {bool} hasReceivedTransaction
if a first transaction has been received

@param {bool} isUnderwritingApproved
If org.underwritingStatus equal approved than true otherwise false

@param {bool} canProcess
Whether the merchant can process or not

@param {bool} canTransfer
Wehter the merchant can transfer money or not
**/


export function getMerchantVitals(options = {}) {
  const opts = {
    orgID: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'resource.access.orgID', null);
    if (!orgID) return console.error('No orgID - cannot get merchant vitals!');

    dispatch(getResource('org', {
      orgID,
      reload: true,
      callback: (res, err) => {
        if (!util.isEmpty(res) && !err) {
          const isActive = util.getValue(res, 'status') === 'active' ? true : false;
          const isInstantEnabled = util.getValue(res, 'instantFundraising.status') === 'enabled' ? true : false;
          const instantPhase = util.getValue(res, 'instantFundraising.phase');
          const instantPhaseEndsAt = util.getValue(res, 'instantFundraising.phaseEndsAt', null);
          const hasMerchantInfo = util.getValue(res, 'vantiv.isVantivReady');
          const legalEntityID = util.getValue(res, 'vantiv.legalEntityID');
          const legalEntityStatus = util.getValue(res, 'vantiv.legalEntityStatus');
          const legalEntityNotes = util.getValue(res, 'vantiv.legalEntityNotes');
          const hasLegalEntity = util.getValue(res, 'vantiv.legalEntityID') ? true : false;
          const hasMID = util.getValue(res, 'vantiv.merchantIdentString') ? true : false;
          const hasReceivedTransaction = util.getValue(res, 'hasReceivedTransaction');
          const isUnderwritingApproved = util.getValue(res, 'underwritingStatus') === 'approved' ? true : false;
          const canTransfer = util.getValue(res, 'canTransferMoney');
          const canProcess = util.getValue(res, 'canProcessMoney');

          dispatch(setMerchantVitals({
            isActive,
            isInstantEnabled,
            instantPhase,
            instantPhaseEndsAt,
            hasMerchantInfo,
            legalEntityID,
            legalEntityStatus,
            legalEntityNotes,
            hasMID,
            hasReceivedTransaction,
            isUnderwritingApproved,
            canTransfer,
            canProcess
          }))
        }
      }
    }));
  }
}

function setMerchantVitals(vitals = {}) {
  return {
    vitals,
    type: types.SET_MERCHANT_VITALS
  }
}

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

    const hasBeenUpdated = opts.hasBeenUpdated || data.hasBeenUpdated;

    if (data.websiteURL) {
      this.props.sendResource('org', {
        orgID,
        method: 'patch',
        data: {
          websiteURL: data.websiteURL
        },
      });
    }

    if (hasBeenUpdated) {
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

export function getPrincipal(options = {}) {
  const opts = {
    reload: true,
    orgID: null,
    callback: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    dispatch(getResource('orgPrincipals', {
      orgID,
      search: {
        sort: 'createdAt',
        order: 'desc'
      },
      reload: opts.reload,
      callback: async (res, err) => {
        if (opts.callback) opts.callback(res, err);
      }
    }));
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
    const data = {
      ...opts.data
    };

    const hasBeenUpdated = opts.hasBeenUpdated || data.hasBeenUpdated;

    if (hasBeenUpdated) {
      dispatch(sendResource(data.ID ? 'orgPrincipal' : 'orgPrincipals', {
        id: data.ID ? [data.ID] : null,
        orgID,
        data,
        callback: (res, err) => {
          if (opts.callback) opts.callback(res, err);
        }
      }));
    } else {
      if (opts.callback) opts.callback();
    }
  }
}

export function getAddress(options = {}) {
  const opts = {
    reload: true,
    orgID: null,
    callback: null,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    dispatch(getResource('orgAddresses', {
      orgID,
      reload: opts.reload,
      callback: (res, err) => {
        if (opts.callback) opts.callback(res, err);
      }
    }));
  }
}

export function saveAddress(options = {}) {
  const opts = {
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

    dispatch(sendResource(data.ID ? 'orgAddress' : 'orgAddresses', {
      id: data.ID ? [data.ID] : null,
      orgID,
      data,
      callback: (res, err) => {
        if (opts.callback) opts.callback(res, err);
      }
    }));
  }
}
