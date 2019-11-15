import axios from 'axios';
import * as types from './actionTypes';
import * as util from '../common/utility';
import has from 'has';
import { trackActivity } from './activity';
export function updatePrefs(prefs) {
  return {
    type: types.SET_PREFERENCES,
    preferences: prefs
  };
}
export function setPrefs(pref) {
  return (dispatch, getState) => {
    const preferences = has(getState(), 'preferences') ? getState().preferences : {};
    const updatedPrefs = { ...preferences,
      ...pref
    };
    return dispatch(updatePrefs(updatedPrefs));
  };
}

function setModal(identifier, open, topModal, opts = {}) {
  return {
    type: types.TOGGLE_MODAL,
    identifier: identifier,
    opts: opts,
    open: open,
    topModal: topModal
  };
}

export function toggleModal(identifier, open, opts = {}) {
  return (dispatch, getState) => {
    const modals = util.getValue(getState(), 'modal', {});
    let openModals = [];

    if (!util.isEmpty(modals)) {
      const filtered = util.filterObj(modals, 'open', true);
      openModals = Object.keys(filtered);
    }

    if (open) {
      if (!openModals.includes(identifier)) {
        openModals.push(identifier);
      }
    } else {
      const index = openModals.indexOf(identifier);

      if (index !== -1) {
        openModals.splice(index, 1);
      }
    }

    let topModal = null;

    if (!util.isEmpty(openModals)) {
      topModal = openModals[openModals.length - 1];
    }

    dispatch(setModal(identifier, open, topModal, opts));
  };
}
export function resourceProp(key, value) {
  return {
    type: types.SET_RESOURCE_PROP,
    key: key,
    value: value
  };
}
export function setProp(key, value) {
  return {
    type: types.SET_PROP,
    key: key,
    value: value
  };
}
export function isFilterOpen(open) {
  return {
    type: types.IS_FILTER_OPEN,
    open: open
  };
}
export function setAppRef(ref) {
  return {
    type: types.SET_APP_REF,
    ref: ref
  };
}
export function setModalRef(ref) {
  return {
    type: types.SET_MODAL_REF,
    ref: ref
  };
}

function requestResource(resource, reload) {
  return {
    type: reload ? types.RELOAD_REQUEST_RESOURCE : types.NEW_REQUEST_RESOURCE,
    resource: resource
  };
}

export function receiveResource(resource, endpoint, data, error, search, returnData = true) {
  return {
    type: types.RECEIVE_RESOURCE,
    resource: resource,
    endpoint: endpoint,
    data: data,
    search: search,
    error: error,
    returnData: returnData
  };
}

function resourceCatchError(resource, error) {
  return {
    type: types.RESOURCE_CATCH_ERROR,
    resource: resource,
    error: error
  };
}

export function getAPI(resource, endpoint, search, callback, reload, customName, resourcesToLoad, reloadResource, fullResponse) {
  return (dispatch, getState) => {
    if (shouldGetAPI(getState(), customName || resource, reload)) {
      const csrf_token = document.getElementById('givebox_csrf_token') ? document.getElementById('givebox_csrf_token').value : '';
      dispatch(requestResource(customName || resource, reload));
      axios.get(endpoint, {
        headers: {
          'X-CSRF-Token': csrf_token === '{{ .CSRFToken }}' ? 'localhost' : csrf_token
        },
        withCredentials: true,
        transformResponse: data => {
          return JSON.parse(data);
        }
      }).then(function (response) {
        switch (response.status) {
          case 200:
            dispatch(receiveResource(customName || resource, endpoint, response.data, null, search));
            if (resourcesToLoad) dispatch(reloadResource(null, {
              resourcesToLoad: resourcesToLoad
            }));
            if (callback) callback(fullResponse ? response : response.data, null);
            break;

          default:
            // pass response as error
            dispatch(receiveResource(customName || resource, endpoint, {}, response, search));
            if (resourcesToLoad) dispatch(reloadResource(null, {
              resourcesToLoad: resourcesToLoad
            }));
            if (callback) callback(null, response);
            break;
        }
      }).catch(function (error) {
        dispatch(resourceCatchError(customName || resource, error));
        dispatch(receiveResource(customName || resource, endpoint, {}, null, search));
        if (callback) callback(null, error);
      });
    }
  };
}

function shouldGetAPI(state, resource, reload) {
  let shouldGet = true;

  if (has(state.resource, resource)) {
    if (state.resource[resource].isFetching) shouldGet = false;
    if (!reload) shouldGet = false;
  }

  return shouldGet;
}

function sendRequest(resource, endpoint, method, data, isSending = true) {
  return {
    type: types.SEND_REQUEST,
    resource: resource,
    endpoint: endpoint,
    method: method,
    data: data,
    isSending: isSending
  };
}

function sendResponse(resource, response, error) {
  return {
    type: types.SEND_RESPONSE,
    resource: resource,
    response: response,
    error: error
  };
}

export function sendAPI(resource, endpoint, method, data, callback, reloadResource, resourcesToLoad, customName, multi, isSending, tryTrackActivity) {
  const errorMsg = {
    data: {
      message: 'Some error occurred.'
    }
  };
  return (dispatch, getState) => {
    method = method.toLowerCase();

    if (shouldSendAPI(getState(), resource, multi)) {
      const csrf_token = document.getElementById('givebox_csrf_token') ? document.getElementById('givebox_csrf_token').value : '';
      dispatch(sendRequest(resource, endpoint, method, data, isSending));
      axios({
        method: method,
        url: endpoint,
        data: data,
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrf_token === '{{ .CSRFToken }}' ? 'localhost' : csrf_token
        }
      }).then(function (response) {
        switch (response.status) {
          case 200:
          case 201:
          case 204:
            dispatch(sendResponse(resource, has(response, 'data') ? response.data : response, null));
            if (callback) callback(has(response, 'data') ? response.data : null, null);
            if (reloadResource) dispatch(reloadResource(customName || resource, {
              resourcesToLoad: resourcesToLoad
            })); // Check if should track activity

            if (tryTrackActivity) dispatch(trackActivity(resource, method, data, endpoint));
            break;

          case 504:
            errorMsg.response.data.message = 'Gateway timeout error occured. Please retry later.';
            dispatch(sendResponse(resource, {}, errorMsg));
            if (callback) callback(null, errorMsg);
            break;

          default:
            // pass response as error
            dispatch(sendResponse(resource, {}, response));
            if (callback) callback(null, response, response.status);
            break;
        }
      }).catch(function (error) {
        if (error.response) {
          let customMsg = false;

          if (error.response.status === 400) {
            customMsg = true;
            errorMsg.data.message = '400 Bad Request. This is a server issue, please contact support@givebox.com or try again in a few minutes.';
          }

          if (error.response.status === 401) {
            customMsg = true;
            errorMsg.data.message = 'You do not have permission to make this request. Please contact your administrator to allow access.';
          }

          dispatch(sendResponse(resource, {}, customMsg ? errorMsg : error));
          if (callback) callback(null, customMsg ? errorMsg : error.response);
        } else {
          errorMsg.data.message = 'Javascript error occurred.';
          dispatch(sendResponse(resource, {}, error));
          console.error('Error', error);
          if (callback) callback(null, errorMsg);
        }
      });
    }
  };
}

function shouldSendAPI(state, resource, multi) {
  let shouldSend = true;

  if (has(state.send, resource && !multi)) {
    if (state.send[resource].isSending) shouldSend = false;
  }

  return shouldSend;
}

export function removeResource(resource) {
  return (dispatch, getState) => {
    if (shouldRemoveResource(getState(), resource)) dispatch(remove(resource));
  };
}

function shouldRemoveResource(state, resource) {
  if (has(state.resource, resource)) {
    return true;
  }

  return false;
}

function remove(resource) {
  return {
    type: types.REMOVE_RESOURCE,
    resource: resource
  };
}