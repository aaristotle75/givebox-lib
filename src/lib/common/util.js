import get from 'get-value';

export function getValue(obj, prop, returnIfEmpty = '', debug) {
  const returnObj = get(obj, prop);
  if (debug) console.log(debug, obj, prop, returnObj);
  return (returnObj || typeof(returnObj) === 'boolean') || returnObj === 0 || returnObj === false ? returnObj : returnIfEmpty;
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function isEmpty(value){
  return  !value ||
          value === undefined ||
          value === null ||
          (typeof value === 'object' && Object.keys(value).length === 0) ||
          (typeof value === 'string' && value.trim().length === 0) ||
          value.length === 0
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
    } : null;
  } else {
    return {};
  }
}

export const imageUrlWithStyle = function(imageURL, style) {
  if (imageURL) {
    return imageURL.replace(/original$/i, style);
  } else {
    return;
  }
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
