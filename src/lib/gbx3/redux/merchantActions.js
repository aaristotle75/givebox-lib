import * as types from './merchantActionTypes';
import * as util from '../../common/utility';
import * as _v from '../../form/formValidate';
import {
  getResource,
  sendResource,
  reloadResource
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
    const org = util.getValue(state, 'resource.gbx3Org.data', {});
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

    if (!data.ID) data.ID = null;
    if (data.contactPhone) data.contactPhone = util.prunePhone(data.contactPhone);
    if (!data.annualCreditCardSalesVolume) data.annualCreditCardSalesVolume = 10000;
    if (!data.yearsInBusiness) data.yearsInBusiness = util.getRand(1, 10);

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
    const orgBankAccounts = util.getValue(state, 'resource.orgBankAccounts', {});
    const orgBankAccountsData = util.getValue(orgBankAccounts, 'data');
    const bankAccount = util.getValue(orgBankAccountsData, 0, {});
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const data = {
      ...opts.data
    };

    if (!data.ID) data.ID = util.getValue(bankAccount, 'ID', null);
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
    updateLegalPhone: true,
    ...options
  };
  return (dispatch, getState) => {
    const state = getState();
    const orgPrincipals = util.getValue(state, 'resource.orgPrincipals', {});
    const orgPrincipalsData = util.getValue(orgPrincipals, 'data');
    const principal = util.getValue(orgPrincipalsData, 0, {});
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const taxID = util.getValue(state, 'resource.gbx3Org.data.taxID');
    const legalContactPhone = util.getValue(state, 'resource.orgLegalEntity.data.contactPhone');
    const data = {
      ...opts.data
    };

    if (!data.ID) data.ID = util.getValue(principal, 'ID', null);
    if (data.contactPhone) data.contactPhone = util.prunePhone(data.contactPhone);
    //if (!data.SSN) data.SSN = _v.formatSSN(taxID);
    if (!data.SSN) data.SSN = _v.formatTaxID(taxID);
    if (!data.title) data.title = 'Director';
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

      if (opts.updateLegalPhone && data.contactPhone !== legalContactPhone) {
        dispatch(sendResource('orgLegalEntity', {
            orgID,
            method: 'patch',
            data: {
              contactPhone: data.contactPhone
            },
            isSending: false
        }));
      }
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
    const orgAddresses = util.getValue(state, 'resource.orgAddresses', {});
    const orgAddressesData = util.getValue(orgAddresses, 'data');
    const address = util.getValue(orgAddressesData, 0, {});
    const orgID = opts.orgID || util.getValue(state, 'gbx3.info.orgID');
    const data = {
      ...opts.data
    };

    if (!data.ID) data.ID = util.getValue(address, 'ID', null);

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

    const merchantIdentString = util.getValue(getState(), 'resource.gbx3Org.data.vantiv.merchantIdentString');

    if (!merchantIdentString) {

      dispatch(getResource('org', {
        customName: 'gbx3Org',
        reload: true,
        isSending: false,
        callback: async (res, err) => {

          const vantiv = util.getValue(res, 'vantiv', {});
          const merchantIdentString = util.getValue(vantiv, 'merchantIdentString');
          const isVantivReady = util.getValue(vantiv, 'isVantivReady');
          const legalEntityID = util.getValue(vantiv, 'legalEntityID');
          const legalEntityStatus = util.getValue(vantiv, 'legalEntityStatus');

          let submitToVantiv = false;
          let message = '';
          let query = null;

          if (isVantivReady && !legalEntityID) {
            submitToVantiv = true;
            message = 'submitted_to_vantiv';
          } else if (legalEntityStatus === 'approved' && !merchantIdentString) {
            submitToVantiv = true;
            message = 'submerchant_only';
            query = 'submerchant_only=true';
          } else if (merchantIdentString && legalEntityStatus === 'approved') {
            message = 'submerchant_created';
          }

          if (submitToVantiv) {
            dispatch(sendResource('orgSubmitToVantiv', {
              query,
              isSending: opts.isSending,
              sendData: opts.sendData,
              callback: (res, err) => {
                if (!err) {
                  dispatch(getResource('org', {
                    customName: 'gbx3Org',
                    reload: true,
                    isSending: false,
                    callback: (res, err) => {
                      if (!util.isEmpty(res) && !err) {
                        const vantiv = util.getValue(res, 'vantiv', {});
                        const merchantIdentString = util.getValue(vantiv, 'merchantIdentString');
                        const legalEntityStatus = util.getValue(vantiv, 'legalEntityStatus');
                        let message = '';
                        if (merchantIdentString && legalEntityStatus === 'approved') {
                          message = 'submerchant_created';
                        }
                        if (opts.callback) opts.callback(message);
                      } else {
                        if (opts.callback) opts.callback();
                      }
                    }
                  }));
                } else {
                  if (opts.callback) opts.callback(null, err);
                }
              }
            }));
          } else {
            if (opts.callback) opts.callback(message);
          }
        }
      }));
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

export function accessToken(publicToken, metaData, options = {}) {

  const opts = {
    callback: null,
    ...options
  };

  return async (dispatch) => {
    dispatch(setMerchantApp('gettingInfoFromPlaid', true));
    const account_id = util.getValue(metaData, 'account_id');
    if (localStorage.getItem('account_id')) {
      localStorage.removeItem('account_id');
    }
    if (account_id) {
      localStorage.setItem('account_id', account_id);
      const updated = await dispatch(updateMerchantApp('plaid', { account_id }));

      if (updated) {
        dispatch(sendResource('plaidAccess', {
          data: {
            publicToken
          },
          method: 'POST',
          callback: (res, err) => {
            dispatch(getPlaidInfo(opts.callback));
          }
        }));
      }
    } else {
      // Throw error stop checking
      dispatch(setMerchantApp('gettingInfoFromPlaid', false));
    }
  }
}

export function getPlaidInfo(callback) {
  return (dispatch, getState) => {
    const gettingInfoFromPlaid = util.getValue(getState(), 'merchantApp.gettingInfoFromPlaid');
    if (!gettingInfoFromPlaid) dispatch(setMerchantApp('gettingInfoFromPlaid', true));

    const account_id = util.getValue(getState(), 'merchantApp.plaid.account_id', localStorage.getItem('account_id'));
    if (account_id) {
      dispatch(getResource('plaidAuth', {
        method: 'GET',
        callback: (res, err) => {
          if (!util.isEmpty(res)) {
            const data = util.getValue(res, 'data', {});
            dispatch(extractFromPlaidAuth(account_id, data));
            dispatch(getResource('plaidIdentity', {
              method: 'GET',
              callback: (res, err) => {
                if (!util.isEmpty(res)) {
                  const data = util.getValue(res, 'data', {});
                  dispatch(extractFromPlaidIdentity(account_id, data, callback));
                  dispatch(setMerchantApp('gettingInfoFromPlaid', false));
                } else {
                  if (callback) callback('error');
                }
              }
            }));
          } else {
            if (callback) callback('error');
          }
        }
      }));
    } else {
      // Throw error stop checking
      dispatch(setMerchantApp('gettingInfoFromPlaid', false));
      if (callback) callback('error');
    }
  }
}


function extractFromPlaidAuth(account_id, data) {

  return (dispatch, getState) => {
    const accounts = util.getValue(data, 'accounts', []);
    const ach = util.getValue(data, 'numbers.ach', []);
    const account = accounts.find(a => a.account_id === account_id);
    const bankInfo = ach.find(a => a.account_id === account_id);

    const bankAccount = {
      kind: 'deposit',
      name: util.getValue(account, 'name'),
      number: util.getValue(bankInfo, 'account'),
      routingNumber: util.getValue(bankInfo, 'routing'),
      accountType: util.getValue(account, 'subtype'),
      metaData: {
        plaid: data
      }
    };

    dispatch(updateMerchantApp('extractAuth', {
      bankAccount,
      data
    }));
  }
}

function extractFromPlaidIdentity(account_id, data, callback) {

  return async (dispatch, getState) => {
    const accounts = util.getValue(data, 'accounts', []);
    const account = accounts.find(a => a.account_id === account_id);
    const owners = util.getValue(account, 'owners', []);
    const owner = util.getValue(owners, 0, {});
    const addresses = util.getValue(owner, 'addresses', []);
    const addressObj = util.getValue(addresses, 0, {});
    const addressData = util.getValue(addressObj, 'data', {});
    const city = util.getValue(addressData, 'city');
    const zipUnformatted = util.getValue(addressData, 'postal_code');
    const zip = zipUnformatted ? zipUnformatted.substring(0, 5) : '';
    const state = util.getValue(addressData, 'region');
    const line1 = util.getValue(addressData, 'street');
    const address = {
      line1,
      city,
      state,
      zip
    };

    const names = util.getValue(owner, 'names', []);
    const name = util.getValue(names, 0);
    const splitName = util.splitName(name, false);
    const firstName = splitName.first;
    const lastName = splitName.last;
    const emails = util.getValue(owner, 'emails', []);
    const emailAddressObj = util.getValue(emails, 0);
    const emailAddress = util.getValue(emailAddressObj, 'data');
    const phone_numbers = util.getValue(owner, 'phone_numbers', []);
    const contactPhoneObj = util.getValue(phone_numbers, 0);
    const contactPhoneUnformatted = util.getValue(contactPhoneObj, 'data');
    const contactPhone = contactPhoneUnformatted ? contactPhoneUnformatted.slice(-10) : '';

    const principal = {
      firstName,
      lastName,
      emailAddress,
      contactPhone
    };

    const updated = await dispatch(updateMerchantApp('extractIdentity', {
      address,
      principal,
      data
    }));

    if (updated) {
      dispatch(savePlaidInfo(callback));
    }
  }
}

function savePlaidInfo(callback) {
  return (dispatch, getState) => {
    dispatch(setMerchantApp('gettingInfoFromPlaid', false));
    dispatch(setMerchantApp('savingInfoFromPlaid', true));

    const state = getState();
    const bankAccount = util.getValue(state, 'merchantApp.extractAuth.bankAccount', {});
    const principal = util.getValue(state, 'merchantApp.extractIdentity.principal', {});
    const address = util.getValue(state, 'merchantApp.extractIdentity.address', {});

    // Chain the check and saves: bankAccount, principal, legalEntity, address
    dispatch(checkBankAccount((ID) => {
      if (ID) bankAccount.ID = ID;
      dispatch(saveBankAccount({
        hasBeenUpdated: true,
        data: {
          ...bankAccount
        },
        callback: (res, err) => {
          if (!util.isEmpty(res) && !err) {
            // continue to check and save principal
            dispatch(checkPrincipal((ID) => {
              if (ID) principal.ID = ID;
              dispatch(savePrincipal({
                hasBeenUpdated: true,
                data: {
                  ...principal
                },
                callback: (res, err) => {
                  if (!util.isEmpty(res) && !err) {
                    // continue to check and save address
                    dispatch(checkAddress((ID) => {
                      if (ID) address.ID = ID;
                      dispatch(saveAddress({
                        hasBeenUpdated: true,
                        data: {
                          ...address
                        },
                        callback: (res, err) => {
                          if (!util.isEmpty(res) && !err) {
                            // Everything saved return success and check status
                            if (callback) callback('success');
                          } else {
                            if (callback) callback('error', 'address');
                          }
                        }
                      }));
                    }));
                  } else {
                    if (callback) callback('error', 'principal');
                  }
                }
              }));
            }));
          } else {
            if (callback) callback('error', 'bankAccount');
          }
        }
      }));
    }));
  }
}

function checkBankAccount(callback) {
  return (dispatch, getState) => {
    const state = getState();
    const orgBankAccounts = util.getValue(state, 'resource.orgBankAccounts', {});
    const orgBankAccountsData = util.getValue(orgBankAccounts, 'data');
    const bankAccount = util.getValue(orgBankAccountsData, 0, {});
    if (util.isEmpty(bankAccount)) {
      dispatch(getResource('orgBankAccounts', {
        reload: true,
        search: {
          sort: 'createdAt',
          order: 'desc'
        },
        callback: (res, err) => {
          console.log('execute orgBankAccounts res -> ', res, res.data);
          const orgBankAccountsData = util.getValue(res, 'data', []);
          const bankAccount = util.getValue(orgBankAccountsData, 0, {});
          const ID = util.getValue(bankAccount, 'ID');
          callback(ID);
        }
      }));
    } else {
      callback();
    }
  }
}

function checkPrincipal(callback) {
  return (dispatch, getState) => {
    const state = getState();
    const orgPrincipals = util.getValue(state, 'resource.orgPrincipals', {});
    const orgPrincipalsData = util.getValue(orgPrincipals, 'data');
    const principal = util.getValue(orgPrincipalsData, 0, {});
    if (util.isEmpty(principal)) {
      dispatch(getResource('orgPrincipals', {
        reload: true,
        search: {
          sort: 'createdAt',
          order: 'desc'
        },
        callback: (res, err) => {
          const orgPrincipalsData = util.getValue(res, 'data', []);
          const principal = util.getValue(orgPrincipalsData, 0, {});
          const ID = util.getValue(principal, 'ID');
          callback(ID);
        }
      }));
    } else {
      callback();
    }
  }
}

function checkAddress(callback) {
  return (dispatch, getState) => {
    const state = getState();
    const orgAddresses = util.getValue(state, 'resource.orgAddresses', {});
    const orgAddressesData = util.getValue(orgAddresses, 'data');
    const address = util.getValue(orgAddressesData, 0, {});
    if (util.isEmpty(address)) {
      dispatch(getResource('orgAddresses', {
        reload: true,
        search: {
          sort: 'createdAt',
          order: 'desc'
        },
        callback: (res, err) => {
          const orgAddressesData = util.getValue(res, 'data', []);
          const address = util.getValue(orgAddressesData, 0, {});
          const ID = util.getValue(address, 'ID');
          callback(ID);
        }
      }));
    } else {
      callback();
    }
  }
}

/**
* End Plaid Actions
*/
