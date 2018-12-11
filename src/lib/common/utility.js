import React from 'react';
import Moment from 'moment';
import has from 'has';

export const imageUrlWithStyle = function(imageURL, style) {
  if (imageURL) {
    return imageURL.replace(/original$/i, style);
  } else {
    return;
  }
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

export function splitName(str) {
  let arr = [];
  const value = {};
  if (!str) return false;
  arr = str.split(' ');
  if (arr.length > 1) {
    value.last = arr.pop();
    value.first = arr.length > 1 ? arr.join(' ') : arr[0];
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
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
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

export function deleteCookie(cname) {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = cname + '=' + expires + ';path=/';
}

export function getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
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

export function encodeDataURI(imageUrl, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', imageUrl);
  xhr.responseType = 'arraybuffer'
  xhr.onload = function() {
    let data;
    let binary = '';
    const type = 'image/jpeg'; // xhr.response['content-type'];
  	const bytes = new Uint8Array(xhr.response);
    const len = bytes.byteLength;
  	for (let i = 0; i < len; i++) {
  		binary += String.fromCharCode( bytes[ i ] );
  	}
    const prefix = 'data:' + type + ';base64,';
    data = prefix + window.btoa( binary );
    callback(data);
  }
  xhr.send();
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

export function money(amount, symbol = '$') {
  let negative = false;
  if (amount < 0) {
    amount = Math.abs(amount);
    negative = true;
  }
  return <span className={`moneyAmount ${negative && 'negativeAmount'}`}>{negative && '( '}<span className='symbol'>{symbol}</span>{numberWithCommas(amount)}{negative && ' )'}</span>;
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
      if (arr[1].length === 1) {
        cents = parseInt(arr[1] * 10);
      } else {
        cents = parseInt(arr[1]);
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


export function makeAPIQuery(obj) {
  let sort, order, str = '?s=cloud';
  if (obj.queryOnly) {
    return '&q=' + obj.query;
  }
  if (obj.sort && obj.order) {
    if (obj.order === 'desc') order = '-';
    else order = '';
    sort = order + obj.sort;
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

export function getDate(timestamp, format = 'MM/DD/YYYY HH:mm') {
  return Moment.unix(timestamp).format(format);
}

export function formatBytes(bytes,decimals) {
   if(bytes === 0) return '0 Bytes';
   const k = 1024,
       dm = decimals <= 0 ? 0 : decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function isEmpty(value){
  return  value === undefined ||
          value === null ||
          (typeof value === 'object' && Object.keys(value).length === 0) ||
          (typeof value === 'string' && value.trim().length === 0) ||
          value.length === 0
}

export function getValue(obj, prop) {
  if (isEmpty(obj)) return '';
  if (has(obj, prop)) return obj[prop];
  else return '';
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
