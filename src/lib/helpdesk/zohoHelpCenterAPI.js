import axios from 'axios';
import * as util from '../common/utility';

const PORTAL_ID = '?portalId=ea68d2793e56a15bf831493087c3d8bd4dbff791f28abdeafd019406290a29ad';

const API_ENDPOINT = 'https://desk.zoho.com/portal/api/';

export function getArticles(callback, categoryID) {
  const category = categoryID ? `&categoryId=${categoryID}` : '';
  sendRequest({
    endpoint: `kbArticles${PORTAL_ID}&includeChildCategoryArticles=true${category}`
  }, callback);
}

export function getArticle(id, callback) {
  sendRequest({
    endpoint: `kbArticles/${id}${PORTAL_ID}`,
    single: true
  }, callback);
}

export function searchArticles(callback, search) {
  const searchStr = search ? `&searchStr=${search}` : '';
  sendRequest({
    endpoint: `kbArticles/search${PORTAL_ID}${searchStr}`
  }, callback);
}

function sendRequest(opts = {}, callback = null) {
  const defaultOpts = {
    method: 'GET',
    endpoint: ``,
    args: [],
    body: null,
    single: false,
  };
  const options = { ...defaultOpts, ...opts };

  // Always POST to our endpoint as a pass thru to Zoho
  axios({
    method: options.method,
    url: `${API_ENDPOINT}${options.endpoint}`,
    data: options.body
  })
  .then(function (response) {
    switch (response.status) {
      case 200:
      case 201:
      case 204:
        const resData = util.getValue(response, 'data', {});
        const data = options.single ? resData : util.getValue(resData, 'data', {});
        if (callback) callback(data, null);
        break;
      case 504:
        if (callback) callback(null, response);
        break;
      default:
        // pass response as error
        if (callback) callback(null, response);
        break;
    }
  })
  .catch(function (error) {
    //if (callback) callback(null, error);
  })
}
