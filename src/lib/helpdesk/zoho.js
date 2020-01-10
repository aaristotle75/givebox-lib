import axios from 'axios';
import * as util from '../common/utility';

const config = {
  endpoint: 'https://desk.zoho.com/api/v1',
  headers: {
    'Authorization': '2e236757fab17528db187e0f38ddbc64',
    'orgID': 702331924,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true'
  }
};

const headers = {
  'Authorization': '2e236757fab17528db187e0f38ddbc64',
  'orgID': 702331924,
  'contentType': 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true'
}

export function searchContacts(params, callback) {
  const endpoint = `${config.endpoint}/contacts${params}`;
  getAPI(endpoint);
}

function getAPI(endpoint) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function(e) {
    var response = e.target.responseText;
    console.log(response);
  });
  xhr.addEventListener('error', function(e) {
    console.error('Request errored with status', e.target.status);
  });
  xhr.open('GET', 'https://desk.zoho.com/api/v1/contacts');
  xhr.setRequestHeader('Authorization','2e236757fab17528db187e0f38ddbc64');
  xhr.setRequestHeader('orgId','702331924');
  xhr.send();


  /*
  axios.get(endpoint, {
    headers: config.headers,
    withCredentials: true,
    credentials: 'same-origin',
  })
  .then(function (response) {
    switch (response.status) {
      case 200:
        console.log('response 200', response);
        break;
      default:
        // pass response as error
        console.log(response.status, response);
        break;
    }
  })
  .catch(function (error) {
    console.log('catch', error);
  })
  */
}
