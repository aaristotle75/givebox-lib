import {
  toggleModal
} from '../../api/actions';
import {
  updateOrgGlobal,
  saveOrg
} from './gbx3actions';

export function saveGlobal(name, obj = {}, callback) {
  return async (dispatch) => {
    const globalUpdated = await dispatch(updateOrgGlobal(name, obj));
    if (globalUpdated) {
      dispatch(saveOrg({
        callback: (res, err) => {
          if (callback) callback();
        }
      }));
    }
  }
}
