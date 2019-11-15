import {
  sendResource
} from './helpers';
import * as util from '../common/utility';

export function trackActivity(resourceName, method, data, endpoint) {
  return (dispatch, getState) => {
    const resource = util.getValue(getState(), 'resource', {});
    const session = util.getValue(resource, 'session', {});
    const user = getSessionUser(util.getValue(session, 'data', {}));
    const desc = getActivity(resourceName, method, data);
    if (!util.isEmpty(desc)) {
      const activityData = {
        userID: util.getValue(user, 'ID', null),
        URLPath: endpoint,
        description: desc,
        method: method
      };
      dispatch(saveActivity(activityData));
    }
  }
}

function saveActivity(data) {
  return (dispatch, getState) => {
    dispatch(sendResource('orgActivities', {
      method: 'post',
      data,
      isSending: false,
      trackActivity: false,
      reload: false
    }));
  }
}

function getSessionUser(session) {
  const user = {};
  if (util.getValue(session, 'masker')) {
    Object.assign(user, util.getValue(session, 'masker', {}));
  } else {
    Object.assign(user, util.getValue(session, 'user', {}));
  }
  return user;
}

function getActivity(resource, method, data) {
  let methodDesc = '';
  switch (method.toLowerCase()) {
    case 'post': {
      methodDesc = 'Added';
      break;
    }

    case 'put':
    case 'patch': {
      methodDesc = 'Edited';
      break;
    }

    case 'delete': {
      methodDesc = 'Deleted';
      break;
    }

    // no default
  }
  let desc =  util.getValue(data, 'activityDesc');
  switch(resource) {
    case 'orgBankAccounts':
    case 'orgBankAccount': {
      desc = desc || `Bank Account: ${util.getValue(data, 'name')}`;
      break;
    }

    // no default
  }
  return !util.isEmpty(desc) ? `${methodDesc} ${desc}` : '';
}
