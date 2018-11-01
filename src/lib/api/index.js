import { getAPI, sendAPI, util, giveboxAPI } from '../';

const API_URL = process.env.REACT_APP_API_URL;

/*
* GET a resource from the API
*
* @param {string} resource Name of resource
* @param {object} options
* // Options //
* @param {array} id Each ID should be entered in the order of the endpoint
* @param {object} search Search options, max, page, sort, order, filter, query, queryOnly
* @param {function} callback
* @param {bool} reload If the resource should be reloaded
*/
export function getResource(
  resource,
  options = {
    id: [],
    search: {},
    callback: null,
    reload: false,
  }) {

  return (dispatch, getState) => {
    let id = options.id;
    let reload = options.reload;
    if (!util.isEmpty(id)) {
      if (id.indexOf('org') !== -1) id[0] = getState().resource.orgID;
      if (id.indexOf('user') !== -1) id[0] = getState().resource.userID;
    }

    // Reload if resource exists and a new ID is requested
    if (getState().resource.hasOwnProperty(resource)) {
      if (!util.isEmpty(id)) {
        id.forEach(function(value, key) {
          if (getState().resource[resource].search.hasOwnProperty('id')) {
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

    const search = Object.assign({}, util.cloneObj(defaultSearch), options.search);

    // Get the API endpoint and add search obj to query string
    let endpoint = API_URL + giveboxAPI.endpoint(resource, id);
    endpoint = endpoint + util.makeAPIQuery(search);

    return dispatch(getAPI(resource, endpoint, search, options.callback, reload));
  }
}

/*
* Reload the resource from an existing endpoint
*
* @param {string} name Name of resource to reload
* @param {function} callback
* @param {bool} reloadAfterSend If a single item should be included in the reload
*/
export function reloadResource(name, callback, reloadAfterSend = false) {
  return (dispatch, getState) => {
    let resource = getState().resource.hasOwnProperty(name) ? getState().resource[name] : null;
    if (resource) dispatch(getAPI(name, resource.endpoint, resource.search, callback, true));

    // Reload a single resource item by removing the s from the end of the resource name after sending an update
    if (reloadAfterSend) {
      let itemName = name.slice(0, -1);
      let resourceItem = getState().resource.hasOwnProperty(itemName) ? getState().resource[itemName] : null;
      if (resourceItem) dispatch(getAPI(itemName, resourceItem.endpoint, resourceItem.search, callback, true));
    }
  }
}

/*
* POST, PUT, PATCH a resource to the API
*
* @params (object) sendObj Options: name, id, id2, method (post, put, patch)
* @params (object) data
* @params (function) callback
* @params (bool) reload If the resource should be reloaded
*/
export function sendResource(sendObj={}, data, callback, reload = true) {
  return (dispatch, getState) => {
    const orgID = getState().resource.orgID || null;
    let endpoint;
    switch (sendObj.name) {
      case 'customers':
        endpoint = `orgs/${orgID}/customers/${sendObj.id}`;
        break;

      // no default
    }
    endpoint = API_URL + endpoint;
    return dispatch(sendAPI(sendObj.name, endpoint, sendObj.method, data, callback, reload ? reloadResource : null));
  }
}
