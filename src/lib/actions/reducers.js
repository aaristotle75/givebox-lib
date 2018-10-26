import { combineReducers } from 'redux';
import  * as types  from './actionTypes';

export function resource(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case types.SET_RESOURCE_PROP:
      return Object.assign({}, state, {
        ...state,
        [action.key]: action.value
      });
    case types.NEW_REQUEST_RESOURCE:
      return Object.assign({}, state, {
        isFetching: true,
        [action.resource]: {
          ...state[action.resource],
          isFetching: true,
          error: false,
          data: {},
          meta: {},
          search: {}
        }
      });
    case types.RELOAD_REQUEST_RESOURCE:
      return Object.assign({}, state, {
        isFetching: true,
        [action.resource]: {
          ...state[action.resource],
          isFetching: true,
          error: false
        }
      });
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
      return Object.assign({}, state, {
        isFetching: false,
        [action.resource]: {
          ...state[action.resource],
          endpoint: action.endpoint,
          isFetching: false,
          error: action.error,
          data: data,
          meta: meta,
          search: {
            ...action.search
          }
        }
      });
    case types.RESOURCE_CATCH_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        [action.resource]: {
          ...state[action.resource],
          isFetching: false,
          error: action.error,
          data: {},
          meta: {}
        }
      });
    default:
      return state
  }
}


export function send(state = {
  isSending: false
}, action) {
  switch (action.type) {
    case types.SEND_REQUEST:
      return Object.assign({}, state, {
        isSending: true,
        [action.resource]: {
          ...state[action.resource],
          isSending: true,
          method: action.method,
          data: action.data,
          error: false,
          response: {}
        }
      });
    case types.SEND_RESPONSE:
      return Object.assign({}, state, {
        isSending: false,
        [action.resource]: {
          ...state[action.resource],
          isSending: false,
          error: action.error,
          response: action.response
        }
      });
    default:
      return state
  }
}

export function modal(state = {
}, action) {
  switch (action.type) {
    case types.TOGGLE_MODAL:
      return Object.assign({}, state, {
        ...state.modals,
        [action.identifier] : action.open
      });
    default:
      return state
  }
}


const appReducer = combineReducers({
  resource,
  modal,
  send
})

const rootReducers = (state, action) => {
  /*
  if (action.type === 'USER_LOGOUT') {
    const { routing } = state;
    state = { routing };
  }
  */
  return appReducer(state, action);
}

export default rootReducers;
