import axios from 'axios';
import * as types from './actionTypes';
import * as util from '../common/utility';
import has from 'has';
import { trackActivity } from './activity';

export function updatePrefs(prefs) {
  return {
    type: types.SET_PREFERENCES,
    preferences: prefs
  }
}

export function setPrefs(pref) {
  return (dispatch, getState) => {
    const preferences = has(getState(), 'preferences') ? getState().preferences : {};
    const updatedPrefs = { ...preferences, ...pref };
    return dispatch(updatePrefs(updatedPrefs));
  }
}

function setModal(identifier, open, topModal, opts = {}) {
  return {
    type: types.TOGGLE_MODAL,
    identifier: identifier,
    opts: opts,
    open: open,
    topModal: topModal
  }
}

export function toggleModal(identifier, open, opts = {}) {
  return (dispatch, getState) => {
    const modals = util.getValue(getState(), 'modal', {});
    let openModals = [];
    let allowSetModal = false;
    if (!util.isEmpty(modals)) {
      const filtered = util.filterObj(modals, 'open', true);
      openModals = Object.keys(filtered);
    }
    if (open) {
      if (!openModals.includes(identifier)) {
        openModals.push(identifier);
        allowSetModal = true;
      }
    } else {
      const index = openModals.indexOf(identifier);
      if (index !== -1) {
        openModals.splice(index, 1);
        allowSetModal = true;
      }
    }
    let topModal = null;
    if (!util.isEmpty(openModals)) {
      topModal = openModals[openModals.length - 1]
    }
    if (allowSetModal) dispatch(setModal(identifier, open, topModal, opts));
  }
}

export function setAccess(res, callback) {
  return (dispatch, getState) => {
    const org = util.getValue(res, 'organization', {});
    const orgID = util.getValue(org, 'ID', null);
    const orgName = util.getValue(org, 'name', null);
    const orgImage = util.getValue(org, 'imageURL', null);
    const orgSlug = util.getValue(org, 'slug', null);
    const underwritingStatus = util.getValue(org, 'underwritingStatus', null);
    const status = util.getValue(org, 'status', null);

    // Set the selected org
    if (orgID) dispatch(resourceProp('orgID', orgID));

    // Check if this is a masquerade
    let user;
    if (has(res, 'masker')) user = res.masker;
    else user = res.user;

    if (user.ID) dispatch(resourceProp('userID', user.ID));

    // set access
    const access = {
      ...util.getValue(getState(), 'resource.access', {}),
      isOwner: false,
      role: util.getValue(user, 'role'),
      permissions: [],
      type: 'organization',
      is2FAVerified: true,
      userID: user.ID,
      initial: user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.firstName + ' ' + user.lastName,
      email: user.email,
      userImage: user.imageURL,
      masker: has(res, 'masker') ? true : false,
      theme: user.preferences ? user.preferences.cloudTheme : 'light',
      animations: user.preferences ? user.preferences.animations : false,
      orgName,
      orgImage,
      orgID,
      orgSlug,
      underwritingStatus,
      status
    };

    // Check member for access
    if (has(res, 'member')) {
      access.isOwner = util.getValue(res.member, 'isOwner');
      access.permissions = util.getValue(res.member, 'permissions');
    }
    dispatch(resourceProp('access', access));
    if (callback) callback(access);
  }
}

export function resourceProp(key, value) {
  return {
    type: types.SET_RESOURCE_PROP,
    key: key,
    value: value
  }
}

export function setProp(key, value) {
  return {
    type: types.SET_PROP,
    key: key,
    value: value
  }
}

export function setCustomProp(key, value) {
  return {
    type: types.SET_CUSTOM_PROP,
    key: key,
    value: value
  }
}

export function isFilterOpen(open) {
  return {
    type: types.IS_FILTER_OPEN,
    open: open
  }
}

export function setAppRef(ref) {
  return {
    type: types.SET_APP_REF,
    ref: ref
  }
}

export function setModalRef(ref) {
  return {
    type: types.SET_MODAL_REF,
    ref: ref
  }
}

function requestResource(resource, reload, showFetching) {
  return {
    type: reload ? types.RELOAD_REQUEST_RESOURCE : types.NEW_REQUEST_RESOURCE,
    resource: resource,
    showFetching
  }
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
  }
}

export function getAPI(
  resource,
  endpoint,
  search,
  callback,
  reload,
  customName,
  resourcesToLoad,
  reloadResource,
  fullResponse,
  showFetching
) {
  return (dispatch, getState) => {
    if (shouldGetAPI(getState(), customName || resource, reload)) {
      const csrf_token = document.getElementById('givebox_csrf_token') ? document.getElementById('givebox_csrf_token').value : '';
      dispatch(requestResource(customName || resource, reload, showFetching));
      axios.get(endpoint, {
        headers: {
          'X-CSRF-Token': csrf_token === '{{ .CSRFToken }}' ? 'localhost' : csrf_token
        },
        withCredentials: true,
        transformResponse: (data) => {
          return JSON.parse(data);
        }
      })
      .then(function (response) {
        switch (response.status) {
          case 200:
            dispatch(receiveResource(customName || resource, endpoint, response.data, null, search));
            if (resourcesToLoad) dispatch(reloadResource(null, { resourcesToLoad: resourcesToLoad }));
            if (callback) callback(fullResponse ? response : response.data, null);
            break;
          default:
            // pass response as error
            dispatch(receiveResource(customName || resource, endpoint, {}, response, search));
            if (resourcesToLoad) dispatch(reloadResource(null, { resourcesToLoad: resourcesToLoad }));
            if (callback) callback(null, response);
            break;
        }
      })
      .catch(function (error) {
        //dispatch(resourceCatchError(customName || resource, error));
        dispatch(receiveResource(customName || resource, endpoint, {}, null, search));
        if (callback) callback(null, error);
      })
    }
  }
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
  }
}

export function sendResponse(resource, response, error) {
  return {
    type: types.SEND_RESPONSE,
    resource: resource,
    response: response,
    error: error
  }
}

export function sendAPI(
  resource,
  endpoint,
  method,
  data,
  callback,
  reloadResource,
  resourcesToLoad,
  customName,
  multi,
  isSending,
  tryTrackActivity,
  sendData
) {

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
        data: sendData && data ? data : null,
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrf_token === '{{ .CSRFToken }}' ? 'localhost' : csrf_token
        }
      })
      .then(function (response) {
        switch (response.status) {
          case 200:
          case 201:
          case 204:
            dispatch(sendResponse(resource, has(response, 'data') ? response.data : response, null));
            if (callback) callback(has(response, 'data') ? response.data : null, null);
            if (reloadResource) dispatch(reloadResource(customName || resource, { resourcesToLoad: resourcesToLoad }));

            // Check if should track activity
            if (tryTrackActivity) dispatch(trackActivity(resource, method, data, endpoint, util.getValue(response, 'data', {})));
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
      })
      .catch(function (error) {
        if (error.response) {
          let customMsg = false;
          if (error.response.status === 400) {
            customMsg = true;
            errorMsg.data.message = 'There was an issue with your connection, please try again in a few minutes.';
          }
          if (error.response.status === 401) {
            customMsg = true;
            errorMsg.data.message = 'You do not have permission to make this request. Please contact your administrator to allow access.';
          }
          dispatch(sendResponse(resource, {}, customMsg ? errorMsg : error ));
          if (callback) callback(null, customMsg ? errorMsg : error.response);
        } else {
          errorMsg.data.message = 'Javascript error occurred.';
          dispatch(sendResponse(resource, {}, error));
          if (callback) callback(null, errorMsg);
        }
      })
    }
  }
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
  }
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
  }
}
