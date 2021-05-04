import  * as types  from './merchantActionTypes';
import * as util from '../../common/utility';

/**
* See merchantActions.js for details
*/
export function merchantApp(state = {
  loading: false,
  gettingInfoFromPlaid: false,
  errorSavingPlaidInfo: false,
  plaid: {
    hasBeenUpdated: false,
    linkToken: null,
    accountID: null
  },
  extractAuth: {},
  extractIdentity: {}
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
