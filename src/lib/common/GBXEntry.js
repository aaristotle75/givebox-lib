const GBXEntry = (function() {

	var blackOverlayStyle = 'position:fixed;background:#e8ebed;opacity:.9;top:0px;bottom:0px;left:0px;right:0px;z-index:10000008;';

	var giveboxStyle = 'position:absolute;top:0;right:0;bottom:0;left:0;border:none;white-space:nowrap;background-color:rgba(0,0,0,0);z-index:2147483647;text-align:center;width:100%;height:100%;overflow-y:scroll;overflow-x:hidden;display:none;';

	var DEFAULT_COLOR = '1976D2';
	var iframeId = 'givebox-entry-widget';

	function createWidget(url, auto) {
		if (!document.getElementById(iframeId)) {
			var iframe = document.createElement('iframe');
			iframe.setAttribute('id', iframeId);
			iframe.setAttribute('allowTransparency', 'true');
			iframe.setAttribute('style', giveboxStyle);
			iframe.setAttribute('data-url', url);

			iframe.style.visibility = 'hidden';
			document.body.appendChild(iframe);
		}
		if (auto) {
			loadWidget(url);
		}
		giveboxBtn();
	}

	function giveboxBtn() {
		var btns = document.getElementsByClassName('givebox-entry-btn');
		for (var i=0; i < btns.length; i++) {
			btns[i].addEventListener('click', handleClick, false);
		}
	}

	function handleClick(e) {
		var p = {};
		p.env = e.currentTarget.getAttribute('data-env') ? e.currentTarget.getAttribute('data-env') : null;
		p.widget = e.currentTarget.getAttribute('data-widget') ? e.currentTarget.getAttribute('data-widget') : null;
		p.signupPath = e.currentTarget.getAttribute('data-signup-path') ? e.currentTarget.getAttribute('data-signup-path') : null;
		p.kind = e.currentTarget.getAttribute('data-kind') ? e.currentTarget.getAttribute('data-kind') : null;
		var url = makeURL(p);
		loadWidget(url);
	}

	function loadWidget(url) {
		var iframe = document.getElementById(iframeId);
		iframe.setAttribute('data-url', url);
		var overlay = document.createElement('div');
		overlay.setAttribute('id', 'widgetOverlay');
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

	function closeWidget() {
		var iframe = document.getElementById(iframeId);
		if (iframe) {
			iframe.src = '';
			iframe.style.display = 'none';
			iframe.style.visibility = 'hidden';
		}
		var overlay = document.getElementById('widgetOverlay');
		if (overlay) {
			overlay.parentNode.removeChild(overlay);
		}
	}

	function messageGivebox(e) {
		if (e.data === 'closeWidget') {
			closeWidget();
		}
	}
	window.addEventListener('message', messageGivebox, false);

	// Loader
	function loader() {
		var loaderDiv = document.createElement('div');
		loaderDiv.setAttribute('id', 'widget-loader');

		var outerStyle = 'position:fixed;display:table;top:0%;left:50%;transform:translate(-50%,0);border:none;white-space:nowrap;background-color:transparent;z-index:10000009;width:100%;height:100%;margin:0 auto;overflow:auto;min-height:50%;';
		var outerDiv = document.createElement('div');
		outerDiv.setAttribute('allowTransparency', 'true');
		outerDiv.setAttribute('style', outerStyle);

		var innerDivStyle =
		'display:table-cell;width:100%;height:100%;vertical-align:middle;text-align:center;';
		var innerDiv = document.createElement('div');
		innerDiv.setAttribute('style', innerDivStyle);

		// SVG Loader
		var loaderGraphic = document.createElement('img');
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
		var loader = document.getElementById('widget-loader');
		if (loader) {
			loader.parentNode.removeChild(loader);
		}
	}

	function injectLoaderCSS(color) {
		color = typeof color !== 'undefined' ? color : DEFAULT_COLOR;

		var css = '.loaderSVG  {height: 45px;width: 45px;background: transparent;animation: logoPulsate .5s ease-in-out infinite, spin 1.5s linear infinite;-webkit-animation: logoPulsate .5s ease-in-out infinite, spin 1.5s linear infinite;}@-moz-keyframes spin {from { -moz-transform: rotate(0deg); }to { -moz-transform: rotate(360deg); }}@-webkit-keyframes spin {from { -webkit-transform: rotate(0deg); }to { -webkit-transform: rotate(360deg); }}@keyframes spin {from {transform:rotate(0deg);}to {transform:rotate(360deg);}}@-webkit-keyframes logoPulsate {0% {filter: brightness(70);-webkit-filter:brightness(70%);}50% {filter: brightness(150);-webkit-filter:brightness(150%);}100% {filter: brightness(70);-webkit-filter:brightness(70%);}}';

		if (!document.getElementById('giveboxLoaderStyle')) {
			var head = document.getElementsByTagName('head')[0];
			var style = document.createElement('style');
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

	var p = {};
	var env = {
		local: 'http://localhost:4010',
		staging: 'https://staging-entry.givebox.com',
		production: 'https://entry.givebox.com'
	};

	function makeURL(p) {
		let host = p.env ? env[p.env] : env.production;
		let widget = p.widget ? p.widget : 'signup';
		let signupPath = p.signupPath ? `&signupPath=${p.signupPath}` : '';
		const url = p.url || host + `/${widget}?modal=true${signupPath}`;
		return url;
	}

	return {
		init: function(params) {
			p = params[0];
			if (document.readyState === 'complete') {
				injectLoaderCSS();
				createWidget(makeURL(p), p.auto);
			} else {
				window.onload = function() {
					injectLoaderCSS();
					createWidget(makeURL(p), p.auto);
				};
			}
		},
		load: function(p) {
			loadWidget(makeURL(p));
		},
	};
}());

export default GBXEntry;
