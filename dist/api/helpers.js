import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import { getAPI, sendAPI, util, giveboxAPI } from '../';
import has from 'has';
var API_URL = process.env.REACT_APP_API_URL;
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

export function getResource(resource) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaults = {
    id: [],
    search: {},
    callback: null,
    reload: false,
    csv: false
  };

  var options = _objectSpread({}, defaults, opt);

  return function (dispatch, getState) {
    var id = options.id;
    var reload = options.reload;
    var orgID = has(getState().resource, 'orgID') ? getState().resource.orgID : null;
    var userID = has(getState().resource, 'userID') ? getState().resource.userID : null;
    var affiliateID = has(getState().resource, 'affiliateID') ? getState().resource.affiliateID : null; // Reload if resource exists and a new ID is requested

    if (has(getState().resource, resource)) {
      if (!util.isEmpty(id)) {
        id.forEach(function (value, key) {
          if (has(getState().resource[resource].search, 'id')) {
            if (!util.isEmpty(getState().resource[resource].search.id[key])) {
              if (getState().resource[resource].search.id[key] !== id[key]) reload = true;
            }
          }
        });
      }
    } // Set default search params and merge custom search which can override defaults


    var defaultSearch = {
      max: 50,
      page: 1,
      sort: 'createdAt',
      order: 'desc',
      filter: '',
      query: '',
      queryOnly: false,
      id: id
    };

    var search = _objectSpread({}, defaultSearch, options.search); // Get the API endpoint


    var endpoint = API_URL + giveboxAPI.endpoint(resource, id, {
      orgID: orgID,
      userID: userID,
      affiliateID: affiliateID
    });
    endpoint = "".concat(endpoint).concat(options.csv ? '.csv' : '').concat(util.makeAPIQuery(search)); // If CSV return the endpoint else dispatch the API

    if (options.csv) return endpoint;else return dispatch(getAPI(resource, endpoint, search, options.callback, reload));
  };
}
/**
* Reload the resource from an existing endpoint
*
* @param {string} name Name of resource to reload
* @param {function} callback
* @param {bool} reloadAfterSend If the resource list should be included in the reload
*/

export function reloadResource(name, callback) {
  var reloadAfterSend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch, getState) {
    var resource = has(getState().resource, name) ? getState().resource[name] : null;
    if (resource) dispatch(getAPI(name, resource.endpoint, resource.search, callback, true)); // Reload the list after updating a single item

    if (reloadAfterSend) {
      var listName = name + 's';
      var resourceList = has(getState().resource, listName) ? getState().resource[listName] : null;
      if (resourceList) dispatch(getAPI(listName, resourceList.endpoint, resourceList.search, callback, true));
    }
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
*/

export function sendResource(resource) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaults = {
    id: [],
    data: null,
    method: 'post',
    callback: null,
    reload: true
  };

  var options = _objectSpread({}, defaults, opt);

  return function (dispatch, getState) {
    var id = options.id;
    var method = options.method;
    var orgID = has(getState().resource, 'orgID') ? getState().resource.orgID : null;
    var userID = has(getState().resource, 'userID') ? getState().resource.userID : null;
    var endpoint = API_URL + giveboxAPI.endpoint(resource, id, {
      orgID: orgID,
      userID: userID
    }); // If endpoint is create new than slice off new and set method to POST

    if (endpoint.slice(-3) === 'new') {
      method = 'POST'; // This slices off the /new from the endpoint

      endpoint = endpoint.slice(0, -4);
    }

    return dispatch(sendAPI(resource, endpoint, method, options.data, options.callback, options.reload ? reloadResource : null));
  };
}