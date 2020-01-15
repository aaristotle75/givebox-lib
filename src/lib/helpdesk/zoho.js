import axios from 'axios';
import * as util from '../common/utility';
import Cookies from 'js-cookie'

const API_ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://api.givebox.com/v2/zoho/desk' : 'https://staging-api.givebox.com/v2/zoho/desk';

const csrf_token = document.getElementById('givebox_csrf_token') ? document.getElementById('givebox_csrf_token').value :  Cookies.get('csrf_token') || '';

export function searchContact(email, callback) {
  const endpoint = `/contacts/search?limit=1&email=${email}`;
  sendDesk({ endpoint, single: true }, callback);
}

function sendDesk(opts = {}, callback) {
  const defaultOpts = {
    method: 'GET',
    endpoint: '/contacts',
    args: [],
    body: null,
    single: false
  };
  const options = { ...defaultOpts, ...opts };

  axios({
    method: 'POST',
    url: API_ENDPOINT,
    data: options,
    withCredentials: true,
    headers: {
      'X-CSRF-Token': csrf_token === '{{ .CSRFToken }}' ? 'localhost' : csrf_token
    }
  })
  .then(function (response) {
    switch (response.status) {
      case 200:
      case 201:
      case 204:
        const res = util.getValue(response, 'data', {});
        const body = util.getValue(res, 'body', {});
        const data = util.getValue(body, 'data', {});
        const returnData = options.single ? util.getValue(data, 0, null) : data;
        if (callback) callback(returnData);
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
    if (callback) callback(null, error);
  })
}
