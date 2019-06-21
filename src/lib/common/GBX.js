const GBX = (function() {
	const host = process.env.REACT_APP_GBX_URL;
	const isMobile = window.innerWidth <= 767 ? true : false;
	let position = 'fixed';
  if (isMobile) position = 'absolute';
	const blackOverlayStyle = 'position:fixed;background:#000;opacity:.5;top:0px;bottom:0px;left:0px;right:0px;z-index:10000008;overflow:hidden;';
	const giveboxStyle = 'position:'+position+';top:0;right:0;bottom:0;left:0;border:none;white-space:nowrap;background-color:rgba(0,0,0,0);z-index:2147483647;text-align:center;width:100%;height:100%;overflow-y:scroll;overflow-x:hidden;display:none;';

	const DEFAULT_COLOR = '374dcf';
	const URL = host + '/';
	const iframeId = 'givebox-embed';

	function createGivebox(p) {
		const color = p.color || DEFAULT_COLOR;
		if (!document.getElementById(iframeId)) {
			var iframe = document.createElement('iframe');
			iframe.setAttribute('id', iframeId);
			iframe.setAttribute('allowTransparency', 'true');
			iframe.setAttribute('style', giveboxStyle);
			iframe.setAttribute('data-color', color);
			iframe.style.visibility = 'hidden';
			document.body.appendChild(iframe);
		}
		loadGivebox(p);
	}

	function loadGivebox(p) {
    const iframe = document.getElementById(iframeId);
		let id, loc, preview, signup, url, overlay;
    id = p.id;
    loc = p.loc || window.location.href;
    preview = p.preview ? '&preview=true' : '';
    signup = p.signup ? '&signup=true' : '';
		overlay = document.createElement('div');
		overlay.setAttribute('id', 'giveboxOverlay');
		overlay.setAttribute('style', blackOverlayStyle);
		document.body.appendChild(overlay);

		loader();
		iframe.style.visibility = 'visible';
		url = URL + '/' + id + '?loc=' + encodeURI(loc)+preview+signup;
		iframe.style.display = 'block';
		iframe.src = url;
		iframe.onload = function() {
			removeLoader();
		};
	}

	function messageGivebox(e) {
		if (e.data === 'closeGivebox') {
			const iframe = document.getElementById(iframeId);
			if (iframe) {
				iframe.src = '';
				iframe.style.display = 'none';
				iframe.style.visibility = 'hidden';
			}
			const overlay = document.getElementById('giveboxOverlay');
			if (overlay) {
				overlay.parentNode.removeChild(overlay);
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

		// Old Loader
		/*
		var loaderGraphic = document.createElement('div');
		loaderGraphic.setAttribute('class', 'gbloader');
		var loaderText = document.createElement('div');
		loaderText.setAttribute('style', 'display:block;color: #fff;font-size:14px;font-weight:500;');
		loaderText.innerHTML = 'Loading...';
		*/

		// SVG Loader
		const loaderGraphic = document.createElement('img');
		loaderGraphic.setAttribute('class', 'loaderSVG');
		loaderGraphic.setAttribute('type', 'image/svg+xml');
		loaderGraphic.src = 'https://s3-us-west-1.amazonaws.com/givebox/public/gb-logo3.svg';

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

	function injectLoaderCSS(color) {
		color = typeof color !== 'undefined' ? color : DEFAULT_COLOR;
		//var css_old = '.gbloader {margin:0 auto;border:4px solid transparent;border-top:4px solid #'+color+';border-bottom:4px solid #'+color+';border-radius:50%;width:60px;height:60px;animation:spin .7s linear infinite;} @keyframes spin {0%{transform: rotate(0deg);} 100%{transform:rotate(360deg);}';

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

	let p = {};

	return {
		init: function(params) {
			p = params[0];
			if (document.readyState === 'complete') {
				injectLoaderCSS(p.color);
				createGivebox(p);
			} else {
				window.onload = function() {
					injectLoaderCSS(p.color);
					createGivebox(p);
				};
			}
		},
		load: function(p) {
			createGivebox(p);
		},
	};
}());

export default GBX;
