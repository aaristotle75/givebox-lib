import  * as types  from './actionTypes';

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
