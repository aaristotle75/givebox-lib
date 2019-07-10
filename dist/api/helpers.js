import { getAPI, sendAPI, updatePrefs } from './actions';
import * as giveboxAPI from './givebox';
import * as util from '../common/utility';
import has from 'has';
const API_URL = process.env.REACT_APP_API_URL;
/**
* GET a resource from the API
*
* @param {string} resource Name of resource
* @param {object} opt
*
* // Options //
* @param {array} id Each ID should be entered in the order of the endpoint
* @param {object} search Search options, max, page, sort, order, filter, query, queryOnly
* @param {function} callback
* @param {bool} reload If the resource should be reloaded
*/

export function getResource(resource, opts = {}) {
  const defaults = {
    id: [],
    search: {},
    callback: null,
    reload: false,
    csv: false,
    customName: null,
    resourcesToLoad: null,
    fullResponse: false
  };
  const options = { ...defaults,
    ...opts
  };
  return (dispatch, getState) => {
    let id = options.id;
    let reload = options.reload;
    const orgID = has(getState().resource, 'orgID') ? getState().resource.orgID : null;
    const userID = has(getState().resource, 'userID') ? getState().resource.userID : null;
    const affiliateID = has(getState().resource, 'affiliateID') ? getState().resource.affiliateID : null;
    const enterpriseID = has(getState().resource, 'enterpriseID') ? getState().resource.enterpriseID : null; //const access = has(getState().resource, 'access') ? getState().resource.access : null;
    //console.log('getResource access', access);
    // Reload if resource exists and a new ID is requested

    if (has(getState().resource, options.customName || resource)) {
      if (!util.isEmpty(id)) {
        id.forEach(function (value, key) {
          if (has(getState().resource[options.customName || resource], 'search')) {
            if (has(getState().resource[options.customName || resource].search, 'id')) {
              if (!util.isEmpty(getState().resource[options.customName || resource].search.id[key])) {
                if (getState().resource[options.customName || resource].search.id[key] !== id[key]) reload = true;
              }
            }
          }
        });
      }
    } // Set default search params and merge custom search which can override defaults


    const defaultSearch = {
      max: 50,
      page: 1,
      sort: 'createdAt',
      order: 'desc',
      filter: '',
      query: '',
      queryOnly: false,
      id: id
    };
    const search = { ...defaultSearch,
      ...options.search
    }; // Get the API endpoint

    const api = giveboxAPI.endpoint(resource, id, {
      orgID,
      userID
    }); // Only dispatch if an api.endpoint exists

    if (api.endpoint) {
      let endpoint = API_URL + api.endpoint;
      endpoint = `${endpoint}${options.csv ? '.csv' : ''}${util.makeAPIQuery(search)}`; // If CSV return the endpoint else dispatch the API

      if (options.csv) return endpoint;else return dispatch(getAPI(resource, endpoint, search, options.callback, reload, options.customName, options.resourcesToLoad, reloadResource, options.fullResponse));
    }
  };
}
/**
* Reload the resource from an existing endpoint
*
* @param {string} name Name of resource to reload
* @param {function} callback
* @param {bool} reloadAfterSend If the resource list should be included in the reload
*/

export function reloadResource(name, opts = {}) {
  // callback, reloadAfterSend = false
  const defaults = {
    callback: null,
    reloadList: true,
    resourcesToLoad: null
  };
  const options = { ...defaults,
    ...opts
  };
  return (dispatch, getState) => {
    if (name) {
      let resource = has(getState().resource, name) ? getState().resource[name] : null;
      if (resource) dispatch(getAPI(name, resource.endpoint, resource.search, null, true)); // Reload the list after updating a single item

      if (options.reloadList) {
        let listName = name + 's';
        let resourceList = has(getState().resource, listName) ? getState().resource[listName] : null;
        if (resourceList) dispatch(getAPI(listName, resourceList.endpoint, resourceList.search, null, true));
      }
    } // Reload resources


    if (options.resourcesToLoad) {
      options.resourcesToLoad.forEach(function (value) {
        if (has(getState().resource, value)) {
          const resource = getState().resource[value];
          dispatch(getAPI(value, resource.endpoint, resource.search, null, true));
        } else {
          dispatch(getResource(value, {
            reload: true
          }));
        }
      });
    }

    if (options.callback) options.callback(getState());
  };
}
/**
* POST, PUT, PATCH a resource to the API
*
* @params (string) resource
* @params {object} opt
*
* // Options //
* @param {array} id Each ID should be entered in the order of the endpoint
* @param {object} data
* @param {string} method
* @param {function} callback
* @param {bool} reload If the resource should be reloaded
* @param {array} resourcesToLoad array of resources to load
* @param {bool} multi If should send multi of same resource
*/

export function sendResource(resource, opts = {}) {
  const defaults = {
    id: [],
    data: null,
    method: 'post',
    callback: null,
    reload: true,
    resourcesToLoad: null,
    customName: null,
    multi: false,
    isSending: true
  };
  const options = { ...defaults,
    ...opts
  };
  return (dispatch, getState) => {
    let id = options.id;
    let method = options.method;
    const orgID = has(getState().resource, 'orgID') ? getState().resource.orgID : null;
    const userID = has(getState().resource, 'userID') ? getState().resource.userID : null;
    const api = giveboxAPI.endpoint(resource, id, {
      orgID,
      userID
    }); // Only dispatch if an api.endpoint exists

    if (api.endpoint) {
      let endpoint = API_URL + api.endpoint; // If endpoint is create new than slice off new and set method to POST

      if (endpoint.slice(-3) === 'new') {
        method = 'POST'; // This slices off the /new from the endpoint

        endpoint = endpoint.slice(0, -4);
      }

      return dispatch(sendAPI(resource, endpoint, method, options.data, options.callback, options.reload ? reloadResource : null, options.resourcesToLoad, options.customName, options.multi, options.isSending));
    }
  };
}
export function translatePerm(value) {
  var slugArr = util.getSplitStr(value.slug, '_', 2, -1);
  var obj = {};
  var group, groupName, perm, name;
  groupName = value.name.substr(value.name.indexOf(' ') + 1);
  group = slugArr[1];
  perm = slugArr[0];
  name = value.name;

  switch (group) {
    case 'refund':
      groupName = 'Refunds';
      break;

    case 'finance':
    case 'transfer':
      group = 'money';
      groupName = 'Money';

      switch (perm) {
        case 'read':
          name = 'View Transactions';
          break;

        case 'write':
          name = 'Transfer Money (Withdrawal/Send Payments)';
          break;
        // no default
      }

      break;

    case 'general':
      group = 'general';
      groupName = 'Non Profit Details';

      switch (perm) {
        case 'read':
          name = 'View Non Profit Details';
          break;

        case 'write':
          name = 'Update Non Profit Details';
          break;
        // no default
      }

      break;

    case 'sweepstake':
      groupName = 'Sweepstakes';
      break;

    case 'member':
      group = 'users';
      groupName = 'Team Members';

      switch (perm) {
        case 'read':
          name = 'View User';
          break;

        case 'write':
          name = 'Create/Edit User';
          break;

        case 'delete':
          name = 'Delete User';
          break;
        // no default
      }

      ;
      break;

    case 'keys':
      groupName = 'Developer';
      break;

    case 'fundraiser':
      groupName = 'Donation Forms';
      break;

    case 'membership':
      groupName = 'Memberships';
      break;

    case 'event':
      groupName = 'Events';
      break;

    case 'invoice':
      groupName = 'Invoices';
      break;

    case 'customer':
      groupName = 'Customers';
      break;

    case 'bank':
      groupName = 'Bank Accounts';
      break;

    case 'email':
      groupName = 'Email Blasts';
      break;
    // no default
  }

  obj.groupName = groupName;
  obj.group = group;
  obj.perm = perm;
  obj.name = name;
  obj.slug = value.slug;
  return obj;
}
export function savePrefs(pref, callback) {
  return (dispatch, getState) => {
    const preferences = has(getState(), 'preferences') ? getState().preferences : {};
    const updatedPrefs = { ...preferences,
      ...pref
    };
    dispatch(updatePrefs(updatedPrefs));
    dispatch(sendResource('userPreferences', {
      method: 'patch',
      data: {
        cloudUI: updatedPrefs
      },
      reload: false,
      isSending: false
    }));
  };
}