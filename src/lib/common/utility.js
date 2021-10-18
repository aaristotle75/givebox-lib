import React from 'react';
import Moment from 'moment-timezone';
import has from 'has';
import animateScrollTo from 'animated-scroll-to';
import ModalLink from '../modal/ModalLink';
import get from 'get-value';
import sanitizeHtml from 'sanitize-html';

const API_URL = process.env.REACT_APP_API_URL;
const ENV = process.env.REACT_APP_ENV;

export const imageUrlWithStyle = function(imageURL, style) {
  if (imageURL) {
    return imageURL.replace(/original$/i, style);
  } else {
    return;
  }
}

export function cleanHtml(html, opts = {}) {
  const defaultOptions = {
    allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'span', 'u', 'figure' ],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
      a: [ 'href', 'name', 'target' ],
      img: [ 'src', 'width', 'height', 'alt' ],
      '*': [ 'align', 'style', 'class' ],
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
    // URL schemes we permit
    allowedSchemes: [ 'http', 'https', 'mailto' ],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
    allowProtocolRelative: true
  };
  const options = { ...defaultOptions, ...opts };
  return sanitizeHtml(html, options);
}

export function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

export function group(array, prop) {
  if (!isEmpty(array)) {
    const group = array.reduce((a, b) => {
      if (!a[b[prop]]) a[b[prop]] = [];
      a[b[prop]].push(b);
      return a;
    },{});
    return group;
  }
  return {};
}

export function roundNumber(rnum, rlength) {
    var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
    return newnumber;
}

// Check if image is default. If default return empty.
export function checkImage(url) {
  const default1 = 'fundraiser-cover';
  const default2 = 'invoice-cover';
  const default3 = 'org-logo';
  return !url.includes(default1) && !url.includes(default2) && !url.includes(default3) ? url : '';
}

export function checkDefault(str) {
  //const default1 = 'My first fundraiser';
  const default1 = 'akdsfaskdfkdjfkjdk';
  //return str !== default1 ? str : '';
  return true;
}

export function lookup(arr, field, value) {
  let item;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) item = arr[i];
  }
  return item;
}

export function getSplitStr(str, delimiter, num, index) {
  let arr;
  str = !isNaN(str) ? str.toString() : str;
  if (str.indexOf(delimiter) !== -1) {
    arr = str.split(delimiter, num);
  } else {
    return arr = str;
  }
  if (index >= 0) {
    return arr[index];
  } else {
    return arr;
  }
}

export function truncate(str, n, useWordBoundary = true) {
  if (str.length <= n) { return str; }
  const subString = str.substr(0, n-1); // the original check
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(" "))
    : subString) + "...";
};

export function toFixed(n,precision) {
  const match = RegExp('(\\d+\\.\\d{1,'+precision+'})(\\d)?').exec(n);
  if(match===null||match[2]===undefined) {
      return n.toFixed(precision);
      }
  if(match[2]>=5) {
      return (Number(match[1])+Math.pow(10,-precision)).toFixed(precision);
      }
  return match[1];
}

export function numberWithCommas(x) {
  if (!x || isNaN(x)) return 0;
  else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getRand(min, max, int = true) {
    return parseInt((Math.random() * (max - min) + min).toFixed(0));
}

export function translateSort(sort) {
  let str = '';
  if (sort === 'desc') str = '-';
  return str;
}

export function sortByField(obj, fieldToSort, direction = 'DESC') {
  return obj.sort(propCompare(fieldToSort, direction));
}

export function sortNumbers(array, order = 'asc') {
  if (order === 'asc') {
    array.sort((a, b) => a - b);
  } else {
    array.sort((a, b) => b - a);
  }
  return array;
}

function propCompare(prop, direction) {
  return function(a, b) {
    switch(direction) {
      case 'DESC':
        if (a[prop] > b[prop])
          return -1;
        if (a[prop] < b[prop])
          return 1;
        break;
      case 'ASC':
        if (a[prop] < b[prop])
          return -1;
        if (a[prop] > b[prop])
          return 1;
        break;
      default:
        break;
    }
    return 0;
  }
}

export function splitName(string, middle = true) {
  let arr = [];
  const value = {
    first: '',
    last: ''
  };
  const str = string.trim();
  if (!str) return value;
  arr = str.split(' ');
  if (arr.length > 1) {
    value.last = arr.pop();
    value.first = arr.length && middle > 1 ? arr.join(' ') : arr[0];
  } else {
    value.last = '';
    value.first = arr[0];
  }
  return value;
}

export function objectLength( object ) {
    let length = 0;
    for( let key in object ) {
        if(has(object, key)) {
            ++length;
        }
    }
    return length;
};

export function hexToRgb(hex) {
  // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  if (hex && ( typeof hex === 'string') ) {
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {};
  } else {
    return {};
  }
}

export function rgba(hex, opacity = 1) {
  const color = hexToRgb(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
}

export function removeFromArr(array, element) {
  const arr = array;
  const index = arr.indexOf(element);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function removeElement(element) {
  element && element.parentNode && element.parentNode.removeChild(element);
}

export function convertArrayOfObjectsToCSV(args) {
  let result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
      return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
      });
      result += lineDelimiter;
  });

  return result;
}

export function createCSV(arr, name) {
  let data;
  let csv = convertArrayOfObjectsToCSV({data: arr});
  if (csv == null) return;

  if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  return data;
}

export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires='+d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export function deleteCookie(cname, path = '/') {
  if (getCookie(cname, null)) {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = cname + '=' + expires + ';path=' + path;
  }
  return null;
}

export function read_cookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}

export function getCookie(cname, returnVal = '') {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
    }
    return returnVal;
}

export function uniqueHash(length = 10) {
  const hash = makeHash(length);
  const now = Date.now();
  return hash + now;
}

export function makeHash(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for( let i=0; i <= length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export function randomPassword(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
    let pass = '';
    for (let x = 0; x < length; x++) {
        let i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function encodeBlob(imageUrl, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', imageUrl);
  xhr.responseType = 'arraybuffer'
  xhr.onload = function() {
    const type = {type: 'image/jpeg'}; // xhr.response['content-type'];
    const bytes = new Uint8Array(xhr.response);
    const blob = new Blob([bytes], type);
    const blobUrl = URL.createObjectURL(blob);
    const data = blobUrl;
    callback(data);
  }
  xhr.send();
}

export function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  let byteCharacters = atob(b64Data);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

export function getBlob(objectUrl, callback, data, fileName, imageCallback, fieldName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', objectUrl, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status === 200) {
      const blob = this.response;
      callback(blob, data, fileName, imageCallback, fieldName);
    }
  };
  xhr.send();
}

export function encodeDataURI(imageUrl, callback, progressCallback = null) {
  const xhr = new XMLHttpRequest();
  if (progressCallback) {
    xhr.addEventListener('progress', function(e) {
      var percent_complete = (e.loaded / e.total)*100;
      progressCallback(percent_complete);
    });
  }
  xhr.open('GET', imageUrl);
  xhr.responseType = 'arraybuffer'
  xhr.onload = function(response) {
    let data;
    let binary = '';
    const type =  xhr.getResponseHeader('Content-type');
    const bytes = new Uint8Array(xhr.response);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    const prefix = 'data:' + type + ';base64,';
    data = prefix + window.btoa( binary );
    callback(data, imageUrl);
  }
  xhr.send();
}

export function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

export function sum(items, prop) {
  return items.reduce( function(a, b){
       return a + b[prop];
   }, 0);
}

export function calcAmount(amount, fee, passFees, gross = false) {
  if (passFees) {
    if (gross) return parseFloat((amount/100)+(fee/100)).toFixed(2);
    else return parseFloat(amount/100).toFixed(2);
  } else {
    if (gross) return parseFloat(amount/100).toFixed(2);
    else return parseFloat((amount/100)-(fee/100)).toFixed(2);
  }
}

export function money(amount, symbol = '$', cents = true, showNegative = true) {
  let negative = false;
  if (amount < 0 && showNegative) {
    amount = Math.abs(amount);
    negative = true;
  }
  return <span className={`moneyAmount ${negative && 'negativeAmount'}`}>{negative && '-'}<span className='symbol'>{symbol}</span>{numberWithCommas(parseFloat(amount).toFixed(cents ? 2 : 0))}</span>;
}

export function formatMoneyForAPI(amount) {
  if (!amount) return 0;
  amount = amount.toString();
  amount = amount.replace(/,/g, '');
  const arr = getSplitStr(amount, '.', 2, -1);
  let dollar;
  let cents = 0;
  if (Array.isArray(arr)) {
    dollar = parseInt(arr[0]*100)
    if (1 in arr) {
      if (arr[1].length > 0) {
        if (arr[1].length === 1) {
          cents = parseInt(arr[1] * 10);
        } else {
          cents = parseInt(arr[1].slice(0, 2));
        }
      } else {
        dollar = parseInt(arr)*100;
      }
    }
  } else {
    dollar = parseInt(arr)*100;
  }
  const v = parseInt(dollar + cents);
  return v;
}

export function onLoaded(element,callback){
 const self = element;
 let h = self.clientHeight;
 let w = self.clientWidth;
 let txt = self.innerText;
 let html = self.innerHTML;
 (function flux(){
    setTimeout(function(){
        const done =
          h === self.clientHeight &&
          w === self.clientWidth &&
          txt === self.innerText &&
          html === self.innerHTML;
        if( done ){
         callback();
        }else{
         h = self.clientHeight;
         w = self.clientWidth;
         txt = self.innerText;
         html = self.innerHTML;
         flux();
        }
    },250);
 })()
};

export function cloneObj(obj) {
  return { ...obj };
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function makeAPIQuery(obj) {
  let sort, order = '', str = '?s=cloud';
  if (obj.queryOnly) {
    return '&q=' + obj.query;
  }
  if (obj.sort && obj.order) {
    if (obj.order === 'desc' && (obj.sort.substring(0, 2) !== '-')) order = '-';
    else if (obj.sort.substring(0, 2) !== '-') order = '';
    sort = order + obj.sort;
    /*
    if (sort.substring(0, 2) === '--') {
      sort = sort.substr(1);
    }
    */
  }
  if (obj.max) str = str + '&max=' + obj.max;
  if (obj.page) str = str + '&page=' + obj.page;
  if (sort) str = str + '&sort=' + sort;
  if (obj.filter) str = str + '&filter=' + obj.filter;
  if (obj.query) str = str + '&q=' + obj.query;
  return str;
}

/**
* Check if a resource has been loaded
*
* @param {object} resource props to check
* @param {int} id of the resource, if id is passed check resource data is not empty
*   and if id doesn't match and isFetching show loading
*/
export function isLoading(resource, id = null) {
  if (id === 'new') return false;
  let loading = false;
  if (!resource) {
    loading = true;
  } else {
    if (!has(resource, 'data')
      || !has(resource, 'search')
      || !has(resource, 'meta')) {
      loading = true;
    } else {
      if (id) {
        if (isEmpty(resource.data)) {
          loading = true;
        } else {
          if (has(resource.data, 'ID')) {
            if (resource.data.ID !== parseInt(id) && resource.isFetching) loading = true;
          }
        }
      }
    }
  }
  return loading;
}

/**
* Check if a resource is fetching
* @param {object} resource props to check
*/
export function isFetching(resource) {
  let loading = false;
  if (resource) {
    if (has(resource, 'isFetching')) {
      if (resource.isFetching) loading = true;
    }
  }
  return loading;
}

export function getDate(timestamp, format, opts = {}) {
  format = format || 'MM/DD/YYYY h:mmA z';
  const defaults = {
    utc: true,
    tz: process.env.REACT_APP_TZ,
    modal: false,
    modalID: 'timezone',
    modalClass: '',
    style: {}
  };
  const options = { ...defaults, ...opts };
  let date = '';

  if (options.utc) date = Moment.utc(Moment.unix(timestamp));
  else date = Moment.unix(timestamp);
  /*
  if (options.tz) date = date.tz(options.tz).format(format);
  else date = date.format(format);
  */
  date = date.format(format);
  const local = Moment.unix(timestamp).local().format(format);
  if (options.modal) {
    return (
      <ModalLink style={options.style} className={options.modalClass} id={options.modalID} opts={{ ts: timestamp, local: local }}>{date}</ModalLink>
    )
  } else {
    return date;
  }
}

export function formatBytes(bytes,decimals) {
   if(bytes === 0) return '0 Bytes';
   const k = 1024,
       dm = decimals <= 0 ? 0 : decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function toBinary(accepted) {
  accepted.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
        const fileAsBinaryString = reader.result;
        // do whatever you want with the file content
        console.log('execute', fileAsBinaryString);
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(file);
  });
}

export function isEmpty(value){
  return  !value ||
          value === undefined ||
          value === null ||
          (typeof value === 'object' && Object.keys(value).length === 0) ||
          (typeof value === 'string' && value.trim().length === 0) ||
          value.length === 0
}

export function search(haystack, needle, found = []) {
  if (typeof(haystack) === 'object' && haystack) {
    Object.keys(haystack).forEach((key) => {
      if(key === needle){
        found.push(haystack[key]);
        return found;
      }
      if(typeof haystack[key] === 'object'){
        search(haystack[key], needle, found);
      }
    });
  }
  return found;
};

export function getValue(obj, prop, returnIfEmpty = '', debug) {
  const returnObj = get(obj, prop);
  if (debug) console.log(debug, obj, prop, returnObj);
  return (returnObj || typeof(returnObj) === 'boolean') || returnObj === 0 || returnObj === false ? returnObj : returnIfEmpty;
}

export function mutateObject(obj, path, value) {
  let schema = obj;  // a moving reference to internal objects within obj
  const pList = path.split('.');
  const len = pList.length;
  for (let i = 0; i < len-1; i++) {
      const elem = pList[i];
      if( !schema[elem] ) schema[elem] = {}
      schema = schema[elem];
  }
  schema[pList[len-1]] = value;
  return schema;
}

export function getIndex(array, index, returnIfEmpty = '') {
  if (typeof array === 'undefined') {
    return returnIfEmpty;
  }
  if (!array) {
    return returnIfEmpty;
  }
  if (typeof array[index] === 'undefined') {
    return returnIfEmpty;
  }
  return array[index];
}

export function setHeight(e, id) {
  const arr = e.data.split('-');
  const el = document.getElementById(id);
  if (el) {
    if (!isEmpty(arr)) {
      switch (arr[0]) {
        case 'height': {
          const height = `${parseInt(arr[1]) + 20}px`;
          el.style.height = height;
          break;
        }

        // no default
      }
    }
  }
}

export const allowRecurring = (match) => {
  switch (match) {
    case 'invoice':
    case 'membership':
    case 'fundraiser': {
      return true;
    }

    default: {
      return false;
    }
  }
}

export function legalLanguage(merchant, campaign) {
  let legal = '';
  if (merchant.vantiv.merchantIdentString) {
    if (campaign.volunteer) {
      legal = `100% of your donation goes to ${merchant.name} Tax ID ${merchant.taxID}. This peer-to-peer fundraiser was created by ${campaign.volunteerFirstName} ${campaign.volunteerLastName} to support ${merchant.name} and does not represent the official nonprofit or its views.`;
    } else {
      legal = `100% of your donation goes to ${merchant.name} Tax ID ${merchant.taxID}. `;
    }
  } else {
    if (campaign.volunteer) {
      legal = `100% of your donation goes to ${merchant.name} through the support of Givebox Technology Foundation Tax ID 47-4471615. This peer-to-peer fundraiser was created by ${campaign.volunteerFirstName} ${campaign.volunteerLastName} to support ${merchant.name} and does not represent the official organization or its views.`;
    } else {
      legal = `100% of your donation goes to ${merchant.name} through the support of Givebox Technology Foundation Tax ID 47-4471615.`;
    }
  }
  return legal;
}

export function makeDescriptor(value, prefix = 'GBX*') {
  let descriptor;
  if (!value) return descriptor;
  let slug = value.replace(/[^a-zA-Z0-9,-.]/, '');
  let slugCleaned = slug.replace(/\s/g, '');
  descriptor = slugCleaned.substr(0, 21);
  return prefix + descriptor.toUpperCase();
}

export function noSelection() {
  if (document.selection) {
    document.selection.empty()
  } else {
    window.getSelection().removeAllRanges()
  }
}

export function prunePhone(phone) {
  if (phone) {
    phone = phone.replace("(", "");
    phone = phone.replace(")", "");
    phone = phone.replace(" " , "");
    phone = phone.replace("-", "");
  }
  return phone;
}

export function replaceAll(str,mapObj){
  var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

  return str.replace(re, function(matched){
      return mapObj[matched.toLowerCase()];
  });
}

export function stripHtml(html){
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

export function makeAddress(where, showCountry = true, returnObj = false, format = 'stacked', noHTML) {
  const obj = {};
  if (where.address) obj.line1 = where.address;
  if (where.city || where.state || where.zip) {
    obj.line2 = `${where.city || ''}${where.city && where.zip ? ',' : ''} ${where.state || ''} ${where.zip || ''}`;
  }
  if (where.country) obj.line3 = where.country;
  if (!isEmpty(obj)) {
    if (returnObj) return obj;
    else {
      switch (format) {
        case 'horizontal': {
          if (noHTML) {
            return (
              `${obj.line1 ? `${obj.line1} ` : ''}${obj.line2 ? `${obj.line2}` : ''}${obj.line3 ? ` ${obj.line3}` : ''}`
            )
          } else {
            return (
              <div className='address'>
                {`${obj.line1 ? `${obj.line1} ` : ''}${obj.line2 ? `${obj.line2}` : ''}${obj.line3 ? ` ${obj.line3}` : ''}`}
              </div>
            )
          }
        }

        case 'stacked':
        default: {
          return (
            <div className='address'>
              {obj.line1 && <span className='line'>{obj.line1}</span>}
              {obj.line2 && <span className='line'>{obj.line2}</span>}
              {obj.line3 && showCountry && <span className='line'>{obj.line3}</span>}
            </div>
          )
        }
      }
    }
  } else {
    if (returnObj) return {};
    else return '';
  }
}

export const equals = function(array, array2) {
  // if the other array is a falsy value, return
  if (!array || !array2)
    return false;

  // compare lengths - can save a lot of time
  if (array.length !== array2.length)
    return false;

  for (var i = 0, l=array.length; i < l; i++) {
    // Check if we have nested arrays
    if (array[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!array[i].equals(array2[i]))
        return false;
    }
    else if (array[i] !== array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

  export function toTop(id, ref = null, scrollTo = 0) {
    const el = ref || document.getElementById(id);
    if (el) animateScrollTo(scrollTo, { element: el });
  }

  export function filterObj(obj, key, value) {
    const result = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (!isEmpty(v)) {
        if (has(v, key)) {
          if (v[key] === value) {
            result[k] = obj[k];
          }
        }
      }
    });
    return result;
  }

export function deviceOS() {
  const useragent = navigator.userAgent;

  if(useragent.match(/Android/i)) {
      return 'android';
  } else if(useragent.match(/webOS/i)) {
      return 'webos';
  } else if(useragent.match(/iPhone/i)) {
      return 'iphone';
  } else if(useragent.match(/iPod/i)) {
      return 'ipod';
  } else if(useragent.match(/iPad/i)) {
      return 'ipad';
  } else if(useragent.match(/Windows Phone/i)) {
      return 'windows phone';
  } else if(useragent.match(/SymbianOS/i)) {
    return 'symbian';
  } else if(useragent.match(/RIM/i) || useragent.match(/BB/i)) {
      return 'blackberry';
  } else {
      return false;
  }
}

export function getAuthorizedAccess(access, orgID, volunteerID) {
  let hasAccess = false;
  const fullName = getValue(access, 'fullName');
  const userOrgID = getValue(access, 'orgID', null);
  const userRole = getValue(access, 'role', null);
  const userID = getValue(access, 'userID', null);
  if (userRole === 'super') hasAccess = true;
  if (userRole === 'admin' && userOrgID === orgID) hasAccess = true;
  const obj = {
    fullName,
    userRole
  }
  if (userRole === 'user' && volunteerID === userID ) {
    hasAccess = true;
    obj.isVolunteer = true;
  }
  return hasAccess ? obj : false;
}

export function handleFile(file, callback, progressCallback) {
  const x = new XMLHttpRequest();
  x.onload = function() {
    if (this.status !== 200 || !this.response) {
      if (callback) callback(null);
      return;
    }
    const s3 = JSON.parse(this.response);
    blob2S3(file, s3, file.name, callback, progressCallback);
  }
  const endpoint = `${API_URL}s3/upload-form?name=${file.name}&mime=${file.type}`
  x.open('GET', endpoint);
  x.withCredentials = true;
  x.send();
}

export function blob2S3(
  file,
  s3,
  fileName,
  callback,
  progressCallback
) {
  const formData = new FormData();
  const key = s3.fields.key;
  for (var name in s3.fields) {
    formData.append(name, s3.fields[name]);
  }
  formData.append('file', file, fileName);
  var x = new XMLHttpRequest();

  if (progressCallback) {
    x.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        progressCallback(percentLoaded);
      }
    }
  }

  x.onload = function() {
    if (this.status !== 204) {
      if (callback) {
        callback(null);
      }
      return;
    }
    if (callback) {
      const cdn = ENV === 'production' ? `https://cdn.givebox.com/` : `https://staging-cdn.givebox.com/`;
      const url = `${cdn}${key}`;
      callback(url);
    }
  }
  x.open(s3.method, s3.action);
  x.send(formData);
}

export function toggle(bool, options) {
  const opts = {
    style: {
      margin: '0 10px',
    },
    className: '',
    onText: 'ON',
    onStyle: {
      color: '#FFFFFF',
    },
    offText: 'OFF',
    offStyle: {
      color: '#B0BEC5',
    },
    ...options
  }
  const text = bool ? opts.onText : opts.offText;
  const boolStyle = bool ? opts.onStyle : opts.offStyle;
  const style = { ...opts.style, ...boolStyle };
  return (
    <span style={style} className={`${opts.className} toggleUtil`}>{text}</span>
  )
}

export function getPublishStatus(kind, webApp) {

  let status = 'public';

  switch (kind) {
    case 'fundraiser': {
      if (webApp) status = 'public';
      else status = 'private';
      break;
    }

    default: {
      if (webApp) status = 'private';
      else status = 'public';
      break;
    }
  }

  return status;
}

export function remove_non_ascii(str) {
  if ((str===null) || (str===''))
       return false;
 else
   str = str.toString();
  return str.replace(/[^\x20-\x7E]/g, '');
}

/* eslint-disable */
export function pSBC(p,c0,c1,l) {
  let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
  if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
  if(!this.pSBCr)this.pSBCr=(d)=>{
    let n=d.length,x={};
    if(n>9){
      [r,g,b,a]=d=d.split(","),n=d.length;
      if(n<3||n>4)return null;
      x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
    }else{
      if(n==8||n==6||n<4)return null;
      if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
      d=i(d.slice(1),16);
      if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
      else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
    }return x};
  h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
  if(!f||!t)return null;
  if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
  else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
  a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
  if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
  else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}


export function opacityOptions() {
  const items = [];
  for (let i=0; i <= 20; i++) {
    const perc = i * 5;
    items.push({ primaryText: `${perc}%`, value: perc });
  }
  return sortByField(items, 'value');
}

export function pageRadiusOptions() {
  const items = [];
  for (let i=0; i <= 10; i++) {
    const value = +(i * 5);
    items.push({ primaryText: `${value}px`, value});
  }
  return items;
}

export function blurOptions() {
  const items = [];
  for (let i=0; i <= 20; i++) {
    const perc = i * 5;
    items.push({ primaryText: `${perc}%`, value: perc});
  }
  return items;
}

export function maxRecordOptions() {
  const items = [];
  for (let i=0; i <= 20; i++) {
    const number = i * 5;
    items.push({ primaryText: `${number} Per Page`, value: number});
  }
  return items;
}

export function creditStatus(opts = {}) {
  const options = {
    score: 0,
    status: '',
    hasBankAccount: false,
    underwritingStatus: '',
    ...opts
  };

  const checkScore = options.score >= 650 ? true : false;
  const checkBank = options.hasBankAccount ? true : false;
  const underwrtingApproved = options.underwritingStatus === 'approved' ? true : false;
  const creditStatus = {
    eligible: false,
    status: options.status,
    statusText: '',
    checkScore,
    checkBank,
    underwrtingApproved
  };

  if (options.score >= 650
  && options.status === 'eligible'
  && options.hasBankAccount
  && options.underwritingStatus === 'approved') {
      creditStatus.eligible = true;
  }

  switch (options.status) {
    case 'eligible': {

      creditStatus.statusText = creditStatus.eligible ?
        <span>Eligible to Request Credit</span>
      :
        <div className='description'>
          <span className='line'>Does Not Meet Minimum</span>
          <span className='line date'><span style={{ color: checkScore ? 'green' : 'red' }} className={`icon icon-${checkScore ? 'check' : 'x'}`}></span> Score</span>
          <span className='line date'><span style={{ color: checkBank ? 'green' : 'red' }} className={`icon icon-${checkBank ? 'check' : 'x'}`}></span> Bank Account</span>
          <span className='line date'><span style={{ color: underwrtingApproved ? 'green' : 'red' }} className={`icon icon-${underwrtingApproved ? 'check' : 'x'}`}></span> Givebox Approved</span>
        </div>
      ;
      break;
    }

    case 'requested': {
      creditStatus.statusText = <span>Requested a Credit Line</span>;
      break;
    }

    case 'granted': {
      creditStatus.statusText = <span>Credit Line Granted</span>;
      break;
    }

    case 'on_hold': {
      creditStatus.statusText = <span>Credit Line put On Hold</span>;
      break;
    }

    case 'revoked': {
      creditStatus.statusText = <span>Credit Line has been Revoked</span>;
      break;
    }

    default: {
      creditStatus.statusText = <span>Insufficient History</span>;
      break;
    }
  }

  return creditStatus;
}

export function customListFilter(customList, options = {}) {
  const opts = {
    noInclude: false,
    operator: '%2C',
    field: 'ID',
    ...options
  };
  const noInclude = opts.noInclude ? '!' : '';
  let filter = '';
  if (!isEmpty(customList)) {
    customList.forEach((value, key) => {
      if (key === 0) filter = `${opts.field}:${noInclude}${value}`;
      else filter = filter + `${opts.operator}${opts.field}:${noInclude}${value}`;
    });
  }
  return `(${filter})`;
}

export function getFileInfo(url) {
  const partsUrl = url.split('/');
  const partsFile = !isEmpty(partsUrl) ? partsUrl[partsUrl.length - 1] : [];
  const name = !isEmpty(partsFile) ? partsFile.split('?')[0] : '';
  const fileParts = !isEmpty(name) ? name.split('.') : [];
  const type = !isEmpty(fileParts) ? fileParts[fileParts.length -1].toLowerCase() : 'png';
  return {
    type,
    name
  };
}

export function isObject(val) {
  if (typeof val === 'object' && val !== null && !Array.isArray(val)) return true;
  return false;
}

export function addDelimiter(a, b, delimiter = '.') {
  return a ? `${a}${delimiter}${b}` : b;
}

export function propertiesToArray(obj) {
  const paths = (obj = {}, head = '') => {
    return Object.entries(obj || {}).reduce((product, [key, value]) => {
      let fullPath = addDelimiter(head, key)
      return isObject(value) ? product.concat(paths(value, fullPath)) : `${product.concat(fullPath)}: ${obj[key]}<br />`;
    }, []);
  }
  return paths(obj);
}
