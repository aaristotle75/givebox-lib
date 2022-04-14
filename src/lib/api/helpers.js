import {
  getAPI,
  sendAPI,
  updatePrefs,
  receiveResource
} from './actions';
import * as giveboxAPI from './givebox';
import * as util from '../common/utility';
import has from 'has';
import { is } from 'immutable';

const API_URL = process.env.REACT_APP_API_URL;

/**
* GET a resource from the API
*
* @param {string} resource Name of resource
* @param {object} opt
*
* // opt props //
* @prop {array} id Each ID should be entered in the order of the endpoint
* @prop {object} search Search options, max, page, sort, order, filter, query, queryOnly
* @prop {function} callback
* @prop {bool} reload If the resource should be reloaded
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
    fullResponse: false,
    returnData: true,
    orgID: null,
    userID: null,
    affiliateID: null,
    showFetching: true
  }
  const options = { ...defaults, ...opts };
  return (dispatch, getState) => {
    let id = options.id;
    let reload = options.reload;
    const orgID = options.orgID || util.getValue(getState().resource, 'orgID', null);
    const userID = options.userID || util.getValue(getState().resource, 'userID', null);
    const affiliateID = options.affiliateID || util.getValue(getState().resource, 'affiliateID', null);
    //const enterpriseID = has(getState().resource, 'enterpriseID') ? getState().resource.enterpriseID : null;
    //const access = has(getState().resource, 'access') ? getState().resource.access : null;
    //console.log('getResource access', access);

    // Reload if resource exists and a new ID is requested
    if (has(getState().resource, options.customName || resource)) {
      if (!util.isEmpty(id)) {
        id.forEach(function(value, key) {
          if (has(getState().resource[options.customName || resource], 'search')) {
            if (has(getState().resource[options.customName || resource].search, 'id')) {
              if (!util.isEmpty(getState().resource[options.customName || resource].search.id[key])) {
                if (getState().resource[options.customName || resource].search.id[key] !== id[key]) reload = true;
              }
            }
          }
        });
      }
    }

    // Set default search params and merge custom search which can override defaults
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

    const search = { ...defaultSearch, ...options.search };

    // Get the API endpoint
    const api = giveboxAPI.endpoint(resource, id, { orgID, userID, affiliateID });

    // Only dispatch if an api.endpoint exists
    if (api.endpoint) {
      let endpoint = API_URL + api.endpoint;
      endpoint = `${endpoint}${options.csv ? '.csv' : ''}${util.makeAPIQuery(search)}`;

      // If CSV return the endpoint else dispatch the API
      if (options.csv) {
        if (options.callback) options.callback();
        return endpoint;
      }
      else if (!options.returnData) {
        return dispatch(receiveResource(
          options.customName || resource,
          endpoint,
          null,
          null,
          search,
          false
        ));
      } else return dispatch(getAPI(
        resource,
        endpoint,
        search,
        options.callback,
        reload,
        options.customName,
        options.resourcesToLoad || options.toLoad,
        reloadResource,
        options.fullResponse,
        options.showFetching
      ));
    }
  }
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
  }

  const options = { ...defaults, ...opts };

  return (dispatch, getState) => {
    if (name) {
      let resource = has(getState().resource, name) ? getState().resource[name] : null;
      if (resource) dispatch(getAPI(name, resource.endpoint, resource.search, null, true));

      // Reload the list after updating a single item
      if (options.reloadList) {
        let listName = name + 's';
        let resourceList = has(getState().resource, listName) ? getState().resource[listName] : null;
        if (resourceList) dispatch(getAPI(listName, resourceList.endpoint, resourceList.search, null, true));
      }
    }
    // Reload resources
    if (options.resourcesToLoad) {
      options.resourcesToLoad.forEach(function(value) {
        if (has(getState().resource, value)) {
          const resource = getState().resource[value];
          if (!util.isEmpty(util.getValue(resource, 'data'))) dispatch(getAPI(value, resource.endpoint, resource.search, null, true));
        } else {
          dispatch(getResource(value, { reload: true }));
        }
      });
    }
    if (options.callback) options.callback(getState());
  }
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
    sendData: true,
    method: 'post',
    callback: null,
    reload: true,
    resourcesToLoad: null,
    customName: null,
    multi: false,
    isSending: true,
    trackActivity: true,
    orgID: null,
    userID: null,
    query: null
  };
  const options = { ...defaults, ...opts };
  return (dispatch, getState) => {
    let id = options.id;
    let method = options.method;
    const orgID = options.orgID || util.getValue(getState().resource, 'orgID', null);
    const userID = options.userID || util.getValue(getState().resource, 'userID', null);

    const api = giveboxAPI.endpoint(resource, id, { orgID, userID });

    // Only dispatch if an api.endpoint exists
    if (api.endpoint) {
      let endpoint = `${API_URL}${api.endpoint}`;

      // If endpoint is create new than slice off new and set method to POST
      if (endpoint.slice(-3) === 'new') {
        method = 'POST';

        // This slices off the /new from the endpoint
        endpoint = endpoint.slice(0, -4);
      }

      if (options.query) {
        endpoint = `${endpoint}?${options.query}`;
      }

      return dispatch(sendAPI(
        resource,
        endpoint,
        method,
        options.data,
        options.callback,
        options.reload ? reloadResource : null,
        options.resourcesToLoad || options.toLoad,
        options.customName,
        options.multi,
        options.isSending,
        options.trackActivity,
        options.sendData
      ));
    }
  }
}

export function savePrefs(pref, callback, opts = {}) {
  const {
    reset,
    isSending
  } = opts;

  return (dispatch, getState) => {
    const preferences = !reset && has(getState(), 'preferences') ? getState().preferences : {};
    const updatedPrefs = { ...preferences, ...pref };
    dispatch(updatePrefs(updatedPrefs));
    dispatch(sendResource('userPreferences', {
      method: 'patch',
      data: {
        cloudUI: updatedPrefs
      },
      reload: reset ? true : false,
      isSending: isSending ? true : false,
      callback: (res, err) => {
        if (callback) callback(res, err);
      }
    }));
  }
}
