const GBXWidget = (function() {

  var blackOverlayStyle = 'position:fixed;background:#000;opacity:.5;top:0px;bottom:0px;left:0px;right:0px;z-index:10000008;';

  var giveboxStyle = 'position:absolute;top:0;right:0;bottom:0;left:0;border:none;white-space:nowrap;background-color:rgba(0,0,0,0);z-index:2147483647;text-align:center;width:100%;height:100%;overflow-y:scroll;overflow-x:hidden;display:none;';

  var DEFAULT_COLOR = '2f94ec';
  var iframeId = 'givebox-embed';

  const env = {
    local: 'http://localhost:3000',
    staging: 'https://staging-share.givebox.com',
    production: 'https://givebox.com'
  };

  function createWidget(p) {
    const url = makeURL(p);
    const auto = p.auto;
    if (!document.getElementById(iframeId)) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', iframeId);
      iframe.setAttribute('allowTransparency', 'true');
      iframe.setAttribute('style', giveboxStyle);
      iframe.setAttribute('data-url', url);

      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    }
    if (auto && !deviceOS()) {
      loadWidget(url);
    }
    giveboxBtn();
    giveboxBtnStyle(DEFAULT_COLOR);
  }

  function giveboxBtn() {
    const btns = document.getElementsByClassName('givebox-btn');
    for (var i=0; i < btns.length; i++) {
      btns[i].addEventListener('click', handleClick, false);
    }
  }

  function giveboxBtnStyle(color) {
    const btns = document.getElementsByClassName('gb-style');
    const background = '#'+color;

    for (var i=0; i < btns.length; i++) {
      btns[i].style['border'] = '0';
      btns[i].style['border-radius'] = '5px';
      btns[i].style['width'] = '180px';
      btns[i].style['height'] = '50px';
      btns[i].style['text-align'] = 'center';
      btns[i].style['vertical-align'] = 'middle';
      btns[i].style['background'] = background;
      btns[i].style['color'] = '#FFFFFF';
      btns[i].style['cursor'] = 'pointer';
    }
  }

  function handleClick(e) {
    const p = {};
    p.id = e.currentTarget.getAttribute('data-givebox') ? e.currentTarget.getAttribute('data-givebox') : null;
    p.env = e.currentTarget.getAttribute('data-env') ? e.currentTarget.getAttribute('data-env') : null;
    p.loc = e.currentTarget.getAttribute('data-loc') ? e.currentTarget.getAttribute('data-loc') : null;
    const url = makeURL(p);
    loadWidget(url);
  }

  function loadWidget(url) {

    // Check if mobile device
    // If mobile device redirect
    if (deviceOS()) {
      window.location.replace(`${url}&redirect=true`);
    } else {
      const iframe = document.getElementById(iframeId);
      iframe.setAttribute('data-url', url);
      const overlay = document.createElement('div');
      overlay.setAttribute('id', 'giveboxOverlay');
      overlay.setAttribute('style', blackOverlayStyle);
      document.body.appendChild(overlay);

      loader();
      iframe.style.visibility = 'visible';
      iframe.style.display = 'block';
      iframe.src = url;
      iframe.onload = function() {
        removeLoader();
        window.scrollTo(0, 0);
      };
    }
  }

  function deviceOS() {
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

  function messageGivebox(e) {
    if (e.data === 'closeGivebox') {
      const iframe = document.getElementById(iframeId);
      if (iframe) {
        iframe.src = '';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        var overlay = document.getElementById('giveboxOverlay');
        if (overlay) {
          overlay.parentNode.removeChild(overlay);
        }
      }
    }
  }
  window.addEventListener('message', messageGivebox, false);

  // Loader
  function loader() {
    const loaderDiv = document.createElement('div');
    loaderDiv.setAttribute('id', 'givebox-loader');

    const outerStyle = 'position:fixed;display:table;top:0%;left:50%;transform:translate(-50%,0);border:none;white-space:nowrap;background-color:transparent;z-index:10000009;width:100%;height:100%;margin:0 auto;overflow:auto;min-height:50%;';
    const outerDiv = document.createElement('div');
    outerDiv.setAttribute('allowTransparency', 'true');
    outerDiv.setAttribute('style', outerStyle);

    const innerDivStyle =
    'display:table-cell;width:100%;height:100%;vertical-align:middle;text-align:center;';
    const innerDiv = document.createElement('div');
    innerDiv.setAttribute('style', innerDivStyle);

    // SVG Loader
    const loaderGraphic = document.createElement('img');
    loaderGraphic.setAttribute('class', 'loaderSVG');
    loaderGraphic.setAttribute('type', 'image/svg+xml');
    loaderGraphic.src = 'https://cdn.givebox.com/givebox/public/gb-logo3.svg';


    innerDiv.appendChild(loaderGraphic);
    //innerDiv.appendChild(loaderText);
    outerDiv.appendChild(innerDiv);
    loaderDiv.appendChild(outerDiv);
    document.body.appendChild(loaderDiv);
  }

  function removeLoader() {
    const loader = document.getElementById('givebox-loader');
    if (loader) {
      loader.parentNode.removeChild(loader);
    }
  }

  function injectLoaderCSS() {

    const css = '.loaderSVG  {height: 45px;width: 45px;background: transparent;animation: logoPulsate .5s ease-in-out infinite, spin 1.5s linear infinite;-webkit-animation: logoPulsate .5s ease-in-out infinite, spin 1.5s linear infinite;}@-moz-keyframes spin {from { -moz-transform: rotate(0deg); }to { -moz-transform: rotate(360deg); }}@-webkit-keyframes spin {from { -webkit-transform: rotate(0deg); }to { -webkit-transform: rotate(360deg); }}@keyframes spin {from {transform:rotate(0deg);}to {transform:rotate(360deg);}}@-webkit-keyframes logoPulsate {0% {filter: brightness(70);-webkit-filter:brightness(70%);}50% {filter: brightness(150);-webkit-filter:brightness(150%);}100% {filter: brightness(70);-webkit-filter:brightness(70%);}}';

    if (!document.getElementById('giveboxLoaderStyle')) {
      const head = document.getElementsByTagName('head')[0];
      const style = document.createElement('style');
      style.type = 'text/css';
      style.setAttribute('id', 'giveboxLoaderStyle');
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    }
  }

  function makeURL(p) {
    const append = '?modal=true';
    const host = p.env ? env[p.env] : env.production;
    const id = p.auto || p.id;
    const loc = p.loc || window.location;
    let url = host + `/${id}${append}`;
    url = url + '&loc=' + encodeURI(loc);
    return url;
  }

  return {
    init: function(params) {
      const p = params[0];
      if (document.readyState === 'complete') {
        injectLoaderCSS();
        createWidget(p);
      } else {
        window.onload = function() {
          injectLoaderCSS();
          createWidget(p);
        };
      }
    },
    load: function(p) {
      loadWidget(makeURL(p));
    },
  };
}());

export default GBXWidget;
