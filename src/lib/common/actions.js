import * as types from './actionTypes';


export function toggleModal(identifier, open) {
  return {
    type: types.TOGGLE_MODAL,
    identifier: identifier,
    open: open
  }
}
