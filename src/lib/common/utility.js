import React from 'react';
import Moment from 'moment';
import has from 'has';

export var imageUrlWithStyle = function(imageURL, style) {
  if (imageURL) {
    return imageURL.replace(/original$/i, style);
  } else {
    return;
  }
}

export function lookup(arr, field, value) {
  var item;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) item = arr[i];
  }
  return item;
}

export function getSplitStr(str, delimiter, num, index) {
  var arr;
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
  var match=RegExp('(\\d+\\.\\d{1,'+precision+'})(\\d)?').exec(n);
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
  var str = '';
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
  var arr = [];
  var value = {};
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
    var length = 0;
    for( var key in object ) {
        if(has(object, key)) {
            ++length;
        }
    }
    return length;
};

export function hexToRgb(hex) {
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

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
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires='+d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export function deleteCookie(cname) {
    var expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = cname + '=' + expires + ';path=/';
}

export function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
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
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i <= length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export function randomPassword(length) {
    var chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
    var pass = '';
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function encodeBlob(imageUrl, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', imageUrl);
  xhr.responseType = 'arraybuffer'
  xhr.onload = function() {
    var data;
    var type = {type: 'image/jpeg'}; // xhr.response['content-type'];
  	var bytes = new Uint8Array(xhr.response);
    var blob = new Blob([bytes], type);
    var blobUrl = URL.createObjectURL(blob);
    data = blobUrl;
    callback(data);
  }
  xhr.send();
}

export function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

export function getBlob(objectUrl, callback, data, fileName, imageCallback, fieldName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', objectUrl, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status === 200) {
      var blob = this.response;
      callback(blob, data, fileName, imageCallback, fieldName);
    }
  };
  xhr.send();
}

export function encodeDataURI(imageUrl, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', imageUrl);
  xhr.responseType = 'arraybuffer'
  xhr.onload = function() {
    var data;
    var type = 'image/jpeg'; // xhr.response['content-type'];
    var binary = '';
  	var bytes = new Uint8Array(xhr.response);
    var len = bytes.byteLength;
  	for (var i = 0; i < len; i++) {
  		binary += String.fromCharCode( bytes[ i ] );
  	}
    var prefix = 'data:' + type + ';base64,';
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
  return <span className='moneyAmount'><span className='symbol'>{symbol}</span>{numberWithCommas(amount)}</span>;
}

export function formatMoneyForAPI(amount) {
  if (!amount) return 0;
  amount = amount.toString();
  amount = amount.replace(/,/g, '');
  var arr = getSplitStr(amount, '.', 2, -1);
  var dollar;
  var cents = 0;
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
  var v = parseInt(dollar + cents);
  return v;
}

export function onLoaded(element,callback){
 var self = element;
 var h = self.clientHeight;
 var w = self.clientWidth;
 var txt = self.innerText;
 var html = self.innerHTML;
 (function flux(){
    setTimeout(function(){
        var done =
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
  var sort, order, str = '?s=cloud';
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
   var k = 1024,
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
