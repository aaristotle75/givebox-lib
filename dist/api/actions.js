import axios from 'axios';
import * as types from './actionTypes';
import has from 'has';
export function toggleModal(identifier, open, opts = {}) {
  return {
    type: types.TOGGLE_MODAL,
    identifier: identifier,
    opts: opts,
    open: open
  };
}
export function resourceProp(key, value) {
  return {
    type: types.SET_RESOURCE_PROP,
    key: key,
    value: value
  };
}

function requestResource(resource, reload) {
  return {
    type: reload ? types.RELOAD_REQUEST_RESOURCE : types.NEW_REQUEST_RESOURCE,
    resource: resource
  };
}

function receiveResource(resource, endpoint, data, error, search) {
  return {
    type: types.RECEIVE_RESOURCE,
    resource: resource,
    endpoint: endpoint,
    data: data,
    search: search,
    error: error
  };
}

function resourceCatchError(resource, error) {
  return {
    type: types.RESOURCE_CATCH_ERROR,
    resource: resource,
    error: error
  };
}

export function getAPI(resource, endpoint, search, callback, reload, customName) {
  let csrf_token = document.querySelector(`meta[name='csrf_token']`) ? document.querySelector(`meta[name='csrf_token']`)['content'] : '';
  return (dispatch, getState) => {
    if (shouldGetAPI(getState(), customName || resource, reload)) {
      dispatch(requestResource(customName || resource, reload));
      axios.get(endpoint, {
        headers: {
          'X-CSRF-Token': csrf_token
        },
        withCredentials: true,
        transformResponse: data => {
          return JSON.parse(data);
        }
      }).then(function (response) {
        switch (response.status) {
          case 200:
            dispatch(receiveResource(customName || resource, endpoint, response.data, null, search));
            if (callback) callback(response.data, null);
            break;

          default:
            // pass response as error
            dispatch(receiveResource(customName || resource, endpoint, {}, response, search));
            if (callback) callback(null, response);
            break;
        }
      }).catch(function (error) {
        dispatch(resourceCatchError(customName || resource, error));
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

function sendRequest(resource, endpoint, method, data) {
  return {
    type: types.SEND_REQUEST,
    resource: resource,
    endpoint: endpoint,
    method: method,
    data: data
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

export function sendAPI(resource, endpoint, method, data, callback, reloadResource, resourcesToLoad, customName) {
  const csrf_token = document.querySelector(`meta[name='csrf_token']`) ? document.querySelector(`meta[name='csrf_token']`)['content'] === '{{ .CSRFToken }}' ? 'localhost' : document.querySelector(`meta[name='csrf_token']`)['content'] : '';
  return (dispatch, getState) => {
    method = method.toLowerCase();

    if (shouldSendAPI(getState(), resource)) {
      dispatch(sendRequest(resource, endpoint, method, data));
      axios({
        method: method,
        url: endpoint,
        data: data,
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrf_token
        },
        transformResponse: data => {
          return data ? JSON.parse(data) : '';
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
            }));
            break;

          default:
            // pass response as error
            dispatch(sendResponse(resource, {}, response));
            if (callback) callback(null, response);
            break;
        }
      }).catch(function (error) {
        dispatch(sendResponse(resource, {}, error));
        if (callback) callback(null, error);
      });
    }
  };
}

function shouldSendAPI(state, resource) {
  let shouldSend = true;

  if (has(state.send, resource)) {
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