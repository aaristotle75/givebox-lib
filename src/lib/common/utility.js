import React from 'react';
import Moment from 'moment';
import has from 'has';
import animateScrollTo from 'animated-scroll-to';

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

export function money(amount, symbol = '$', cents = true, showNegative = true) {
  let negative = false;
  if (amount < 0 && showNegative) {
    amount = Math.abs(amount);
    negative = true;
  }
  return <span className={`moneyAmount ${negative && 'negativeAmount'}`}>{negative && '( '}<span className='symbol'>{symbol}</span>{numberWithCommas(parseFloat(amount).toFixed(cents ? 2 : 0))}{negative && ' )'}</span>;
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

export function getDate(timestamp, format = 'MM/DD/YYYY HH:mm', utc = true) {
  if (utc) return Moment.utc(Moment.unix(timestamp)).format(format);
  else return Moment.unix(timestamp).format(format);
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
  return  value === undefined ||
          value === null ||
          (typeof value === 'object' && Object.keys(value).length === 0) ||
          (typeof value === 'string' && value.trim().length === 0) ||
          value.length === 0
}

export function getValue(obj, prop, returnIfEmpty = '') {
  if (isEmpty(obj)) return returnIfEmpty;
  if (has(obj, prop)) return obj[prop];
  else return returnIfEmpty;
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
  descriptor = slug.substr(0, 21);
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

export function makeAddress(where, showCountry = true) {
  const obj = {};
  if (where.address) obj.line1 = where.address;
  if (where.city || where.state || where.zip) {
    obj.line2 = `${where.city || ''}${where.city && where.zip ? ',' : ''} ${where.state || ''} ${where.zip || ''}`;
  }
  if (where.country) obj.line3 = where.country;
  if (!isEmpty(obj)) {
    return (
      <div className='address'>
        {obj.line1 && <span className='line'>{obj.line1}</span>}
        {obj.line2 && <span className='line'>{obj.line2}</span>}
        {obj.line3 && showCountry && <span className='line'>{obj.line3}</span>}
      </div>
    )
  } else {
    return '';
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

  export function toTop(id, ref = null) {
    const el = ref || document.getElementById(id);
    if (el) animateScrollTo(0, { element: el });
  }
