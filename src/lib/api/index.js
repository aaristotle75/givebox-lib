import { getAPI, sendAPI, util, giveboxAPI } from '../';
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
export function getResource(resource, opt = {}) {
  const defaults = {
    id: [],
    search: {},
    callback: null,
    reload: false
  }
  const options = {...defaults, ...opt};
  return (dispatch, getState) => {
    let id = options.id;
    let reload = options.reload;
    if (!util.isEmpty(id)) {
      if (id.indexOf('org') !== -1) id[0] = getState().resource.orgID;
      if (id.indexOf('user') !== -1) id[0] = getState().resource.userID;
    }

    // Reload if resource exists and a new ID is requested
    if (has(getState().resource, resource)) {
      if (!util.isEmpty(id)) {
        id.forEach(function(value, key) {
          if (has(getState().resource[resource].search, 'id')) {
            if (!util.isEmpty(getState().resource[resource].search.id[key])) {
              if (getState().resource[resource].search.id[key] !== id[key]) reload = true;
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

    // Get the API endpoint and add search obj to query string
    let endpoint = API_URL + giveboxAPI.endpoint(resource, id);
    endpoint = endpoint + util.makeAPIQuery(search);

    return dispatch(getAPI(resource, endpoint, search, options.callback, reload));
  }
}

/**
* Reload the resource from an existing endpoint
*
* @param {string} name Name of resource to reload
* @param {function} callback
* @param {bool} reloadAfterSend If a single item should be included in the reload
*/
export function reloadResource(name, callback, reloadAfterSend = false) {
  return (dispatch, getState) => {
    let resource = has(getState().resource, name) ? getState().resource[name] : null;
    if (resource) dispatch(getAPI(name, resource.endpoint, resource.search, callback, true));

    // Reload the list after updating a single item
    if (reloadAfterSend) {
      let listName = name + 's';
      let resourceList = has(getState().resource, listName) ? getState().resource[listName] : null;
      if (resourceList) dispatch(getAPI(listName, resourceList.endpoint, resourceList.search, callback, true));
    }
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
*/
export function sendResource(resource, opt = {}) {
  const defaults = {
    id: [],
    data: null,
    method: 'post',
    callback: null,
    reload: true
  };
  const options = { ...defaults, ...opt};
  return (dispatch, getState) => {
    let id = options.id;
    if (!util.isEmpty(id)) {
      if (id.indexOf('org') !== -1) id[0] = getState().resource.orgID;
      if (id.indexOf('user') !== -1) id[0] = getState().resource.userID;
    }
    const endpoint = API_URL + giveboxAPI.endpoint(resource, id);
    return dispatch(sendAPI(resource, endpoint, options.method, options.data, options.callback, options.reload ? reloadResource : null));
  }
}
