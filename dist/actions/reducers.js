import _defineProperty from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import { combineReducers } from 'redux';
import * as types from './actionTypes';
export function resource() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    isFetching: false
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case types.SET_RESOURCE_PROP:
      return Object.assign({}, state, _objectSpread({}, state, _defineProperty({}, action.key, action.value)));

    case types.NEW_REQUEST_RESOURCE:
      return Object.assign({}, state, _defineProperty({
        isFetching: true
      }, action.resource, _objectSpread({}, state[action.resource], {
        isFetching: true,
        error: false,
        data: {},
        meta: {},
        search: {}
      })));

    case types.RELOAD_REQUEST_RESOURCE:
      return Object.assign({}, state, _defineProperty({
        isFetching: true
      }, action.resource, _objectSpread({}, state[action.resource], {
        isFetching: true,
        error: false
      })));

    case types.RECEIVE_RESOURCE:
      var data, meta;

      if (action.data.hasOwnProperty('data')) {
        data = action.data.data;
        delete action.data['data'];
        meta = action.data;
      } else {
        data = action.data;
        meta = {};
      }

      return Object.assign({}, state, _defineProperty({
        isFetching: false
      }, action.resource, _objectSpread({}, state[action.resource], {
        endpoint: action.endpoint,
        isFetching: false,
        error: action.error,
        data: data,
        meta: meta,
        search: _objectSpread({}, action.search)
      })));

    case types.RESOURCE_CATCH_ERROR:
      return Object.assign({}, state, _defineProperty({
        isFetching: false
      }, action.resource, _objectSpread({}, state[action.resource], {
        isFetching: false,
        error: action.error,
        data: {},
        meta: {}
      })));

    default:
      return state;
  }
}
export function send() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    isSending: false
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case types.SEND_REQUEST:
      return Object.assign({}, state, _defineProperty({
        isSending: true
      }, action.resource, _objectSpread({}, state[action.resource], {
        isSending: true,
        method: action.method,
        data: action.data,
        error: false,
        response: {}
      })));

    case types.SEND_RESPONSE:
      return Object.assign({}, state, _defineProperty({
        isSending: false
      }, action.resource, _objectSpread({}, state[action.resource], {
        isSending: false,
        error: action.error,
        response: action.response
      })));

    default:
      return state;
  }
}
export function modal() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case types.TOGGLE_MODAL:
      return Object.assign({}, state, _objectSpread({}, state.modals, _defineProperty({}, action.identifier, action.open)));

    default:
      return state;
  }
}
var appReducer = combineReducers({
  resource: resource,
  modal: modal,
  send: send
});

var rootReducers = function rootReducers(state, action) {
  /*
  if (action.type === 'USER_LOGOUT') {
    const { routing } = state;
    state = { routing };
  }
  */
  return appReducer(state, action);
};

export default rootReducers;