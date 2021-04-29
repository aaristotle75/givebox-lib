import  * as types  from './merchantActionTypes';
import * as util from '../../common/utility';

/**
* See merchantActions.js for details
*/
export function merchantApp(state = {
  loading: false,
  fetching: false,
  plaid: {
    hasBeenUpdated: false,
    linkToken: null,
    accountID: null,
    authMeta: null,
    identityMeta: null
  }
}, action) {
  switch (action.type) {
    case types.UPDATE_MERCHANT_APP:
      return Object.assign({}, state, {
        ...state,
        [action.name]: {
          ...state[action.name],
          ...action.obj
        }
      });
    case types.SET_MERCHANT_APP:
      return Object.assign({}, state, {
        ...state,
        [action.key]: action.value
      });
    default:
      return state
  }
}
