import { combineReducers } from 'redux';
import * as types from './actionTypes';
import { gbx3 } from '../gbx3/redux/gbx3reducers';
import has from 'has';
export function preferences(state = {}, action) {
  switch (action.type) {
    case types.SET_PREFERENCES:
      return Object.assign({}, state, { ...state,
        ...action.preferences
      });

    default:
      return state;
  }
}
export function app(state = {
  appRef: null,
  modalRef: null,
  filterOpen: false,
  primaryColor: ''
}, action) {
  switch (action.type) {
    case types.SET_APP_REF:
      return Object.assign({}, state, {
        appRef: action.ref
      });

    case types.SET_MODAL_REF:
      return Object.assign({}, state, {
        modalRef: action.ref
      });

    case types.IS_FILTER_OPEN:
      return Object.assign({}, state, {
        filterOpen: action.open
      });

    case types.SET_PROP:
      return Object.assign({}, state, { ...state,
        [action.key]: action.value
      });

    default:
      return state;
  }
}
export function custom(state = {
  primaryColor: ''
}, action) {
  switch (action.type) {
    case types.SET_CUSTOM_PROP:
      return Object.assign({}, state, { ...state,
        [action.key]: action.value
      });

    default:
      return state;
  }
}
export function resource(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case types.SET_RESOURCE_PROP:
      return Object.assign({}, state, { ...state,
        [action.key]: action.value
      });

    case types.NEW_REQUEST_RESOURCE:
      return Object.assign({}, state, {
        isFetching: true,
        [action.resource]: { ...state[action.resource],
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
        [action.resource]: { ...state[action.resource],
          isFetching: true,
          error: false
        }
      });

    case types.RECEIVE_RESOURCE:
      let data, meta;

      if (action.returnData) {
        if (has(action.data, 'data')) {
          data = action.data.data;
          delete action.data['data'];
          meta = action.data;
        } else {
          data = action.data;
          meta = {};
        }
      } else {
        data = action.data;
        meta = {};
      }

      return Object.assign({}, state, {
        isFetching: false,
        [action.resource]: { ...state[action.resource],
          endpoint: action.endpoint,
          isFetching: false,
          error: action.error,
          data: data,
          meta: meta,
          search: { ...action.search
          }
        }
      });

    case types.RESOURCE_CATCH_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        [action.resource]: { ...state[action.resource],
          isFetching: false,
          error: action.error,
          data: {},
          meta: {}
        }
      });

    case types.REMOVE_RESOURCE:
      delete state[action.resource];
      return Object.assign({}, state, {
        isFetching: false,
        ...state
      });

    default:
      return state;
  }
}
export function send(state = {
  isSending: false
}, action) {
  switch (action.type) {
    case types.SEND_REQUEST:
      return Object.assign({}, state, {
        isSending: action.isSending ? true : false,
        [action.resource]: { ...state[action.resource],
          isSending: action.isSending ? true : false,
          method: action.method,
          data: action.data,
          error: false,
          response: {}
        }
      });

    case types.SEND_RESPONSE:
      return Object.assign({}, state, {
        isSending: false,
        [action.resource]: { ...state[action.resource],
          isSending: false,
          error: action.error,
          response: action.response
        }
      });

    default:
      return state;
  }
}
export function modal(state = {
  topModal: null
}, action) {
  switch (action.type) {
    case types.TOGGLE_MODAL:
      return Object.assign({}, state, {
        topModal: action.topModal,
        [action.identifier]: {
          open: action.open,
          opts: action.opts
        }
      });

    default:
      return state;
  }
}
const appReducer = combineReducers({
  preferences,
  app,
  resource,
  modal,
  send,
  custom,
  gbx3
});

const rootReducers = (state, action) => {
  /*
  if (action.type === 'USER_LOGOUT') {
  	const { routing } = state;
  	state = { routing };
  }
  */
  return appReducer(state, action);
};

export default rootReducers;