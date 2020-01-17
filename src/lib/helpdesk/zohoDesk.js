import axios from 'axios';
import * as util from '../common/utility';
import Cookies from 'js-cookie'

const API_ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://api.givebox.com/v2/zoho/desk' : 'https://staging-api.givebox.com/v2/zoho/desk';

const csrf_token = document.getElementById('givebox_csrf_token') ? document.getElementById('givebox_csrf_token').value :  Cookies.get('csrf_token') || '';

export function searchContact(email, callback) {
  const endpoint = `/contacts/search?limit=1&email=${email}`;
  sendDesk({ endpoint, single: true, method: 'GET' }, callback);
}

export function createContact(body, callback) {
  const endpoint = `/contacts`;
  sendDesk({ endpoint, body, method: 'POST' }, callback);
}

export function createAccount(body, callback) {
  const endpoint = `/accounts`;
  sendDesk({ endpoint, body, method: 'POST' }, callback);
}

export function createTicket(body, callback) {
  const endpoint = `/tickets`;
  sendDesk({ endpoint, body, method: 'POST' }, callback);
}

export function createAttachment({ fileName, base64, ticketId }, callback) {
  const endpoint = `/tickets/{ticket_id}/attachments`;
  sendDesk({ endpoint, fileName, body: base64, args: [ticketId], method: 'POST' }, callback);
}

export function getArticles(opts = {}, callback) {
  const defaultOptions = {
    limit: 20,
    from: 1,
    categoryId: ''
  };
  const options = { ...defaultOptions, ...opts };
  const categoryId = options.categoryId ? `&categoryId=${options.categoryId}` : '';

  //const endpoint = `/articles?from=${options.from}&limit=${options.limit}${status}${categoryId}${permission}`;
  const endpoint = `/articles?from=3&limit=1&status=Published`;
  sendDesk({ endpoint, method: 'GET' }, callback);
}

export function searchArticle(title, callback) {
  const endpoint = `/articles/search?title=${title}`;
  sendDesk({ endpoint, single: true, method: 'GET' }, callback);
}

export function articleCount(callback) {
  const endpoint = `/articles/count?status=Published`;
  sendDesk({ endpoint, method: 'GET' }, callback);
}

function sendDesk(opts = {}, callback) {
  const defaultOpts = {
    method: '',
    endpoint: '',
    args: [],
    body: null,
    single: false
  };
  const options = { ...defaultOpts, ...opts };

  // Always POST to our endpoint as a pass thru to Zoho
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
        if (options.method === 'GET') {
          const res = util.getValue(response, 'data', {});
          const body = util.getValue(res, 'body', {});
          const data = util.getValue(body, 'data', {});
          const returnData = options.single ? util.getValue(data, 0, null) : data;
          if (callback) callback(returnData);
        } else if (options.method === 'POST') {
          const res = util.getValue(response, 'data', {});
          const body = util.getValue(res, 'body', {});
          if (callback) callback(body);
        }
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
