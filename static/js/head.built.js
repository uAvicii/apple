(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var BrowserData = require('./ac-browser/BrowserData');
var webkitRegExp = /applewebkit/i;
var IE = require('./ac-browser/IE');

/**
 * Reports information about the user's browser and device
 * based on the userAgent string and feature detection.
 * @reference http://www.quirksmode.org/js/detect.html
 * @name module:ac-browser
 * @kind namespace
 */
var browser = BrowserData.create();

/**
 * Returns true/false whether the browser is WebKit based
 * @param  {String}  userAgentString
 * @return {Boolean}
 * @name module:ac-browser.isWebKit
 * @kind function
 */
browser.isWebKit = function(userAgentString) {
	var userAgent = userAgentString || window.navigator.userAgent;
	return userAgent ? !! webkitRegExp.test(userAgent) : false;
};

/**
 * @type {String}
 * @name module:ac-browser.lowerCaseUserAgent
 */
browser.lowerCaseUserAgent = navigator.userAgent.toLowerCase();

if (browser.name === 'IE') {
	/**
	 * Only available in Internet Explorer
	 * @name module:ac-browser.IE
	 * @kind namespace
	 */
	browser.IE = {
		/**
		 * The emulated Internet Explorer version, which may not match actual version
		 * @name module:ac-browser.IE.documentMode
		 * @type {Number}
		 */
		documentMode: IE.getDocumentMode()
	};
}

module.exports = browser;

// ac-browser@0.5.0

},{"./ac-browser/BrowserData":2,"./ac-browser/IE":3}],2:[function(require,module,exports){
'use strict';

require('@marcom/ac-polyfills/Array/prototype.filter');
require('@marcom/ac-polyfills/Array/prototype.some');

var _data = require('./data');

function BrowserData() { }

BrowserData.prototype = {
	/**
	 * Parses string (such as userAgent) and returns the browser version
	 * @param  {String} stringToSearch
	 * @return {Number}
	 */
	__getBrowserVersion: function(stringToSearch, identity) {
		var version;

		if (!stringToSearch || !identity) {
			return;
		}

		// Filters data.browser for the members with identities equal to identity
		var filteredData = _data.browser.filter(function(item) {
			return item.identity === identity;
		});

		filteredData.some(function (item) {
			var versionSearchString = item.versionSearch || identity;
			var index = stringToSearch.indexOf(versionSearchString);

			if (index > -1) {
				version = parseFloat(stringToSearch.substring(index + versionSearchString.length + 1));
				return true;
			}
		});

		return version;
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} browserData | Expects data.browser
	 * @return {String}
	 */
	__getName: function(dataBrowser) {
		return this.__getIdentityStringFromArray(dataBrowser);
	},

	/**
	 * Expects single member of data.browser or data.os
	 * and returns a string to be used in os or name.
	 * @param  {Object} item
	 * @return {String}
	 */
	__getIdentity: function(item) {
		if (item.string) {
			return this.__matchSubString(item);
		} else if (item.prop) {
			return item.identity;
		}
	},

	/**
	 * Iterates through data.browser or data.os returning the correct
	 * browser or os identity
	 * @param  {Array} dataArray
	 * @return {String}
	 */
	__getIdentityStringFromArray: function(dataArray) {
		for (var i = 0, l = dataArray.length, identity; i < l; i++) {
			identity = this.__getIdentity(dataArray[i]);
			if (identity) {
				return identity;
			}
		}
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} OSData | Expects data.os
	 * @return {String}
	 */
	__getOS: function(dataOS) {
		return this.__getIdentityStringFromArray(dataOS);
	},

	/**
	 * Parses string (such as userAgent) and returns the operating system version
	 * @param {String} stringToSearch
	 * @param {String} osIdentity
	 * @return {String|Number} int if not a decimal delimited version
	 */
	__getOSVersion: function(stringToSearch, osIdentity) {

		if (!stringToSearch || !osIdentity) {
			return;
		}

		// Filters data.os returning the member with an identity equal to osIdentity
		var filteredData = _data.os.filter(function(item) {
			return item.identity === osIdentity;
		})[0];

		var versionSearchString = filteredData.versionSearch || osIdentity;
		var regex = new RegExp(versionSearchString + ' ([\\d_\\.]+)', 'i');
		var version = stringToSearch.match(regex);

		if (version !== null) {
			return version[1].replace(/_/g, '.');
		}
	},

	/**
	 * Regular expression and indexOf against item.string using item.subString as the pattern
	 * @param  {Object} item
	 * @return {String}
	 */
	__matchSubString: function(item) {
		var subString = item.subString;
		if (subString) {
			var matches = subString.test ? !!subString.test(item.string) : item.string.indexOf(subString) > -1;
			if (matches) {
				return item.identity;
			}
		}
	}
};

BrowserData.create = function () {
	var instance = new BrowserData();
	var out = {};
	/**
	 * @type {String}
	 * @name module:ac-browser.name
	 */
	out.name      = instance.__getName(_data.browser);
	/**
	 * @type {String}
	 * @name module:ac-browser.version
	 */
	out.version   = instance.__getBrowserVersion(_data.versionString, out.name);
	/**
	 * @type {String}
	 * @name module:ac-browser.os
	 */
	out.os        = instance.__getOS(_data.os);
	/**
	 * @type {String}
	 * @name module:ac-browser.osVersion
	 */
	out.osVersion = instance.__getOSVersion(_data.versionString, out.os);
	return out;
};

module.exports = BrowserData;

// ac-browser@0.5.0

},{"./data":4,"@marcom/ac-polyfills/Array/prototype.filter":24,"@marcom/ac-polyfills/Array/prototype.some":34}],3:[function(require,module,exports){
'use strict';

module.exports = {
	/**
	 * Detect what version or document/standards mode IE is rendering the page as.
	 * Accounts for later versions of IE rendering pages in earlier standards modes. E.G. it is
	 * possible to set the X-UA-Compatible tag to tell IE9 to render pages in IE7 standards mode.//
	 * Based on Microsoft test
	 * @see http://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx
	 */
	getDocumentMode: function () {
		var ie;

		// IE8 or later
		if (document.documentMode) {
			ie = parseInt(document.documentMode, 10);
		// IE 5-7
		} else {
			// Assume quirks mode unless proven otherwise
			ie = 5;
			if (document.compatMode) {
				// standards mode
				if (document.compatMode === "CSS1Compat") {
					ie = 7;
				}
			}
			// There is no test for IE6 standards mode because that mode
			// was replaced by IE7 standards mode; there is no emulation.
		}
		return ie;
	}
};

// ac-browser@0.5.0

},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
	// Used to test getName
	browser: [
		{
			string: window.navigator.userAgent,
			subString: "Edge",
			identity: "Edge"
		},
		{
			string: window.navigator.userAgent,
			subString: /silk/i,
			identity: "Silk"
		},
		{
			string: window.navigator.userAgent,
			subString: /(android).*(version\/[0-9+].[0-9+])/i,
			identity: "Android"
		},
		{
			string: window.navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: window.navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: window.navigator.userAgent,
			subString: /mobile\/[^\s]*\ssafari\//i,
			identity: "Safari Mobile",
			versionSearch: "Version"
		},
		{
			string: window.navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: window.navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: window.navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: window.navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: window.navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{ // for newer Netscapes (6+)
			string: window.navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		// IE < 11
		{
			string: window.navigator.userAgent,
			subString: "MSIE",
			identity: "IE",
			versionSearch: "MSIE"
		},
		// IE >= 11
		{
			string: window.navigator.userAgent,
			subString: "Trident",
			identity: "IE",
			versionSearch: "rv"
		},
		{
			string: window.navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ // for older Netscapes (4-)
			string: window.navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	// Used to test getOS
	os: [
		{
			string: window.navigator.platform,
			subString: "Win",
			identity: "Windows",
			versionSearch: "Windows NT"
		},
		{
			string: window.navigator.platform,
			subString: "Mac",
			identity: "OS X"
		},
		{
			string: window.navigator.userAgent,
			subString: "iPhone",
			identity: "iOS",
			versionSearch: "iPhone OS"
		},
		{
			string: window.navigator.userAgent,
			subString: "iPad",
			identity: "iOS",
			versionSearch: "CPU OS"
		},
		{
			string: window.navigator.userAgent,
			subString: /android/i,
			identity: "Android"
		},
		{
			string: window.navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	],
	// Used to test version and osVersion
	versionString: window.navigator.userAgent || window.navigator.appVersion || undefined
};

// ac-browser@0.5.0

},{}],5:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');
require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var classNameAdd = require('./className/add');

/**
 * @name module:ac-classlist.add
 *
 * @function
 *
 * @desc Adds one or more tokens to an Element's classList.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {...String} token
 *        One or more classes to be added
 */
module.exports = function add() {
	var tokens = Array.prototype.slice.call(arguments);
	var el = tokens.shift(tokens);
	var i;

	if (el.classList && el.classList.add) {
		el.classList.add.apply(el.classList, tokens);
		return;
	}

	for (i = 0; i < tokens.length; i++) {
		classNameAdd(el, tokens[i]);
	}
};

// ac-classlist@1.3.0

},{"./className/add":6,"@marcom/ac-polyfills/Array/prototype.slice":33,"@marcom/ac-polyfills/Element/prototype.classList":41}],6:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var classNameContains = require('./contains');

/**
 * @name module:ac-classlist/className.add
 *
 * @function
 *
 * @desc Adds a token to an Element's className
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The class to be added
 */
module.exports = function add(el, token) {
	if (!classNameContains(el, token)) {
		el.className += ' ' + token;
	}
};

// ac-classlist@1.3.0

},{"./contains":7}],7:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getTokenRegExp = require('./getTokenRegExp');

/**
 * @name module:ac-classlist/className.contains
 *
 * @function
 *
 * @desc Checks if an Element's className contains a specific token
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The token to be checked
 *
 * @returns {Boolean} `true` if className contains token, otherwise `false`
 */
module.exports = function classNameAdd(el, token) {
	return getTokenRegExp(token).test(el.className);
};


// ac-classlist@1.3.0

},{"./getTokenRegExp":8}],8:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name getTokenRegExp
 * @memberOf module:ac-classlist/className
 *
 * @function
 * @private
 *
 * @desc Creates a RegExp that matches the token within a className.
 *
 * @returns {RegExp}
 */
module.exports = function getTokenRegExp(token) {
	return new RegExp('(\\s|^)' + token + '(\\s|$)');
};

// ac-classlist@1.3.0

},{}],9:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var classNameContains = require('./contains');
var getTokenRegExp = require('./getTokenRegExp');

/**
 * @name module:ac-classlist/className.remove
 *
 * @function
 *
 * @desc Removes a token from an Element's className
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The class to be removed
 */
module.exports = function remove(el, token) {
	if (classNameContains(el, token)) {
		el.className = el.className.replace(getTokenRegExp(token), '$1').trim();
	}
};


// ac-classlist@1.3.0

},{"./contains":7,"./getTokenRegExp":8}],10:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');
require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var classNameRemove = require('./className/remove');

/**
 * @name module:ac-classlist.remove
 *
 * @function
 *
 * @desc Remove one or more tokens from an Element's classList.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {...String} token
 *        One or more classes to be removed
 */
module.exports = function remove() {
	var tokens = Array.prototype.slice.call(arguments);
	var el = tokens.shift(tokens);
	var i;

	if (el.classList && el.classList.remove) {
		el.classList.remove.apply(el.classList, tokens);
		return;
	}

	for (i = 0; i < tokens.length; i++) {
		classNameRemove(el, tokens[i]);
	}
};

// ac-classlist@1.3.0

},{"./className/remove":9,"@marcom/ac-polyfills/Array/prototype.slice":33,"@marcom/ac-polyfills/Element/prototype.classList":41}],11:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:globals
 * @private
 */
module.exports = {
	/**
	 * @name module.globals.getWindow
	 *
	 * @function
	 *
	 * @desc Get the window object.
	 *
	 * @returns {Window}
	 */
	getWindow: function() {
		return window;
	},

	/**
	 * @name module.globals.getDocument
	 *
	 * @function
	 *
	 * @desc Get the document object.
	 *
	 * @returns {Document}
	 */
	getDocument: function() {
		return document;
	},

	/**
	 * @name module.globals.getNavigator
	 *
	 * @function
	 *
	 * @desc Get the navigator object.
	 *
	 * @returns {Navigator}
	 */
	getNavigator: function() {
		return navigator;
	}
};

},{}],12:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var globalsHelper = require('./helpers/globals');
var once = require('@marcom/ac-function/once');

/**
 * @name module:ac-feature.svgAvailable
 *
 * @function
 *
 * @desc Returns the availability of SVG for <img> tags and background images.
 *
 * @returns {Boolean} `true` if SVG is supported, otherwise `false`.
 */
function svgAvailable() {
	var documentObj = globalsHelper.getDocument();

	return !!documentObj.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
}

module.exports = once(svgAvailable);
module.exports.original = svgAvailable;

},{"./helpers/globals":11,"@marcom/ac-function/once":14}],13:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var globalsHelper = require('./helpers/globals');
var once = require('@marcom/ac-function/once');

/**
 * @name module:ac-feature.touchAvailable
 *
 * @function
 *
 * @desc Returns the availability of touch events.
 *
 * @returns {Boolean} `true` if touch events are supported, otherwise `false`.
 */
function touchAvailable() {
	var windowObj = globalsHelper.getWindow();
	var documentObj = globalsHelper.getDocument();
	var navigatorObj = globalsHelper.getNavigator();

	// DocumentTouch is specific to Firefox <25 support.
	// navigator.maxTouchPoints and navigator.msMaxTouchPoints are specific to IE10 & 11
	return !!(('ontouchstart' in windowObj) ||
		(windowObj.DocumentTouch && documentObj instanceof windowObj.DocumentTouch) ||
		(navigatorObj.maxTouchPoints > 0) ||
		(navigatorObj.msMaxTouchPoints > 0));
}

module.exports = once(touchAvailable);
module.exports.original = touchAvailable;

},{"./helpers/globals":11,"@marcom/ac-function/once":14}],14:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-function.once
 *
 * @function
 *
 * @desc Creates a function that executes `func` only once
 *
 * @param {Function} func
 *        The function to be executed once
 *
 * @returns {Function}
 */
module.exports = function once(func) {
	var result;

	return function() {
		if (typeof result === 'undefined') {
			result = func.apply(this, arguments);
		}

		return result;
	};
};

// ac-function@1.3.0

},{}],15:[function(require,module,exports){
/**
 * @module ac-headjs
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var addClass = require('@marcom/ac-classlist/add');
var removeClass = require('@marcom/ac-classlist/remove');
var extend = require('@marcom/ac-object/extend');

var FeatureDetect = function (targetElement, tests) {
	this._target = targetElement;
	this._tests = {};
	this.addTests(tests);
};

var proto = FeatureDetect.prototype;

proto.addTests = function (tests) {
	this._tests = extend(this._tests, tests || {});
};

proto._supports = function (feature) {
	if (typeof this._tests[feature] === 'undefined') {
		return false;
	}

	if (typeof this._tests[feature] === 'function') {
		// only run each test once
		this._tests[feature] = this._tests[feature]();
	}

	return this._tests[feature];
};

proto._addClass = function (feature, failure_prefix) {
	failure_prefix = failure_prefix || 'no-';

	if (this._supports(feature)) {
		addClass(this._target, feature);
	} else {
		addClass(this._target, failure_prefix + feature);
	}
};

proto.htmlClass = function () {
	var key;

	removeClass(this._target, 'no-js');
	addClass(this._target, 'js');

	for (key in this._tests) {
		if (this._tests.hasOwnProperty(key)) {
			this._addClass(key);
		}
	}
};

module.exports = FeatureDetect;

// ac-headjs@2.2.0

},{"@marcom/ac-classlist/add":5,"@marcom/ac-classlist/remove":10,"@marcom/ac-object/extend":19}],16:[function(require,module,exports){
'use strict';

var DEFAULT_ATTR = 'data-focus-method';

var ATTR_TOUCH = 'touch';
var ATTR_MOUSE = 'mouse';
var ATTR_KEY = 'key';

function FocusManager(target, attr) {
	this._target = target || document.body;
	this._attr = attr || DEFAULT_ATTR;
	this._focusMethod = this._lastFocusMethod = false;

	this._onKeyDown = this._onKeyDown.bind(this);
	this._onMouseDown = this._onMouseDown.bind(this);
	this._onTouchStart = this._onTouchStart.bind(this);
	this._onFocus = this._onFocus.bind(this);
	this._onBlur = this._onBlur.bind(this);
	this._onWindowBlur = this._onWindowBlur.bind(this);

	this._bindEvents();
}

var proto = FocusManager.prototype;

proto._bindEvents = function () {
	if (this._target.addEventListener) {
		this._target.addEventListener('keydown', this._onKeyDown, true);
		this._target.addEventListener('mousedown', this._onMouseDown, true);
		this._target.addEventListener('touchstart', this._onTouchStart, true);
		this._target.addEventListener('focus', this._onFocus, true);
		this._target.addEventListener('blur', this._onBlur, true);
		window.addEventListener('blur', this._onWindowBlur);
	}
};

proto._onKeyDown = function (evt) {
	this._focusMethod = ATTR_KEY;
};

proto._onMouseDown = function (evt) {
	if (this._focusMethod === ATTR_TOUCH) {
		return;
	}

	this._focusMethod = ATTR_MOUSE;
};

proto._onTouchStart = function (evt) {
	this._focusMethod = ATTR_TOUCH;
};

proto._onFocus = function (evt) {
	if (!this._focusMethod) {
		this._focusMethod = this._lastFocusMethod;
	}

	evt.target.setAttribute(this._attr, this._focusMethod);

	this._lastFocusMethod = this._focusMethod;
	this._focusMethod = false;
};

proto._onBlur = function (evt) {
	evt.target.removeAttribute(this._attr);
};

proto._onWindowBlur = function (evt) {
	this._focusMethod = false;
};

module.exports = FocusManager;

// ac-headjs@2.2.0

},{}],17:[function(require,module,exports){
/**
 * @module ac-headjs
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills');

var FeatureDetect = require('./FeatureDetect');
var defaultTests = require('./defaultTests');

module.exports = new FeatureDetect(document.documentElement, defaultTests);
module.exports.FeatureDetect = FeatureDetect;

// focus manager
var FocusManager = require('./FocusManager');

if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', function () {
		new FocusManager();
	});
}

// ac-headjs@2.2.0

},{"./FeatureDetect":15,"./FocusManager":16,"./defaultTests":18,"@marcom/ac-polyfills":59}],18:[function(require,module,exports){
/**
 * @module ac-headjs
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var ac_browser = require('@marcom/ac-browser');
var touchAvailable = require('@marcom/ac-feature/touchAvailable');
var svgAvailable = require('@marcom/ac-feature/svgAvailable');

var ie8Test = function () {
	return (ac_browser.IE && ac_browser.IE.documentMode === 8);
};

module.exports = {
	touch: touchAvailable,
	svg: svgAvailable,
	ie8: ie8Test,
	'progressive-image': true
};

// ac-headjs@2.2.0

},{"@marcom/ac-browser":1,"@marcom/ac-feature/svgAvailable":12,"@marcom/ac-feature/touchAvailable":13}],19:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.forEach');

/** @ignore */
var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name module:ac-object.extend
 *
 * @deprecated since version 1.4.0
 *	Use native [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) instead.
 *
 * @function
 *
 * @desc Add properties from one object into another. Not a deep copy.
 *
 * @param {Object} destination
 *        The object where the properties will end up. Properties in this Object
 *        that have the same key as properties in the source object will be
 *        overwritten with the source property’s value. If destination is not
 *        provided a blank object is created.
 *
 * @param {Object} source
 *        The properties to add / overwrite in the destination Object. An infinite
 *        number of source paramaters may be passed.
 *
 * @returns {Object} The extended object.
 */
module.exports = function extend () {
	var args;
	var dest;

	if (arguments.length < 2) {
		args = [{}, arguments[0]];
	} else {
		args = [].slice.call(arguments);
	}

	dest = args.shift();

	args.forEach(function (source) {
		if (source != null) {
			for (var property in source) {
				// Anything that does not prototype Object will not have this method
				if (hasOwnProp.call(source, property)) {
					dest[property] = source[property];
				}
			}
		}
	});

	return dest;
};

// ac-object@1.6.1

},{"@marcom/ac-polyfills/Array/prototype.forEach":26}],20:[function(require,module,exports){
'use strict';

require('./Array/from');
require('./Array/isArray');
require('./Array/prototype.every');
require('./Array/prototype.filter');
require('./Array/prototype.find');
require('./Array/prototype.forEach');
require('./Array/prototype.includes');
require('./Array/prototype.indexOf');
require('./Array/prototype.lastIndexOf');
require('./Array/prototype.map');
require('./Array/prototype.reduce');
require('./Array/prototype.reduceRight');
require('./Array/prototype.slice');
require('./Array/prototype.some');

// ac-polyfills@2.10.0

},{"./Array/from":21,"./Array/isArray":22,"./Array/prototype.every":23,"./Array/prototype.filter":24,"./Array/prototype.find":25,"./Array/prototype.forEach":26,"./Array/prototype.includes":27,"./Array/prototype.indexOf":28,"./Array/prototype.lastIndexOf":29,"./Array/prototype.map":30,"./Array/prototype.reduce":31,"./Array/prototype.reduceRight":32,"./Array/prototype.slice":33,"./Array/prototype.some":34}],21:[function(require,module,exports){
if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// The length property of the from method is 1.
		return function from(arrayLike/*, mapFn, thisArg */) {
			// 1. Let C be the this value.
			var C = this;

			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError("Array.from requires an array-like object - not null or undefined");
			}

			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);

			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method
			// of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, "length", len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	}());
}

// ac-polyfills@2.10.0

},{}],22:[function(require,module,exports){
if (!Array.isArray) {
    /**
     * Returns true if an object is an array, false if it is not.
     * @param {Object} object Object to test against.
     * @name Array.isArray
     * @deprecated since version 2.10.0
     */

    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// ac-polyfills@2.10.0

},{}],23:[function(require,module,exports){
if (!Array.prototype.every) {
/**
	Behaving in a similar yet opposite fashion to Array.prototype.some, Array.prototype.every tests whether
	all elements in the array pass the test implemented by the provided function. A return of false by the
	callback will immediately return false for the whole method.
	@param {Function} callback Function to test against. The callback should return a boolean value. Please
	note that 'falsy' values, e.g. no return, will evaluate to false.
	@param {Object} thisObj Object to use as `this` when executing the callback.
	@returns {Boolean} Returns true if all objects pass the test implemented by the provided function.
	@reference https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every
	@deprecated since version 2.10.0
*/
	Array.prototype.every = function every(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObject.length >>> 0;
		var i;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObject && !callback.call(thisObj, arrayObject[i], i, arrayObject)) {
				return false;
			}
		}
		return true;
	};
}

// ac-polyfills@2.10.0

},{}],24:[function(require,module,exports){
if (!Array.prototype.filter) {
/**
	Tests all elements in an array and returns a new array filled with elements that pass the test.
	@param {Function} callback Function to test against. The callback must return a boolean value.
	@param {Object} thisObj Object to use as `this` when executing the callback.
	@returns {Array} Returns a new array populated with values from the original array that passed the test implemented by the provided function.
	@reference https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
	@deprecated since version 2.10.0
*/
	Array.prototype.filter = function filter(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObject.length >>> 0;
		var i;
		var results = [];

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObject && callback.call(thisObj, arrayObject[i], i, arrayObject)) {
				results.push(arrayObject[i]);
			}
		}

		return results;
	};
}

// ac-polyfills@2.10.0

},{}],25:[function(require,module,exports){
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find (Public domain)
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}


// ac-polyfills@2.10.0

},{}],26:[function(require,module,exports){
if (!Array.prototype.forEach) {
/**
	Executes a provided function once per array element.
	@param callback {Function} Object to test against.
	@param thisObj {Object} What the callback method is bound to.
	@deprecated since version 2.10.0
*/
	Array.prototype.forEach = function forEach(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var i;
		var currentValue;

		if (typeof callback !== 'function') {
			throw new TypeError('No function object passed to forEach.');
		}

		var length = this.length
		
		for (i = 0; i < length; i += 1) {
			currentValue = arrayObject[i];
			callback.call(thisObj, currentValue, i, arrayObject);
		}
	};
}

// ac-polyfills@2.10.0

},{}],27:[function(require,module,exports){
/**
 * @author tc39 <https://tc39.github.io/ecma262/#sec-array.prototype.includes>
 * @author MDN <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes>
*/

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

// ac-polyfills@2.10.0

},{}],28:[function(require,module,exports){
if (!Array.prototype.indexOf) {
/**
	Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
	@param searchElement {Object} Element to locate in the array.
	@param fromIndex {Number} Optional; the index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
	@deprecated since version 2.10.0
*/
	Array.prototype.indexOf = function indexOf(searchElement, fromIndex) {
		var startIndex = fromIndex || 0;
		var currentIndex = 0;

		if (startIndex < 0) {
			startIndex = this.length + fromIndex - 1;
			if (startIndex < 0) {
				throw 'Wrapped past beginning of array while looking up a negative start index.';
			}
		}

		for (currentIndex = 0; currentIndex < this.length; currentIndex++) {
			if (this[currentIndex] === searchElement) {
				return currentIndex;
			}
		}

		return (-1);
	};
}

// ac-polyfills@2.10.0

},{}],29:[function(require,module,exports){
if (!Array.prototype.lastIndexOf) {
/**
	<p>Returns thelast index at which a given element can be found in the array, or -1 if it is not present.
	The array is searched backwards, starting at fromIndex.</p>
	<p><em>It should be noted that the Prototype library also implementes a version of this polyfill that doesn't behave
	according exactly to the ECMA-262 5.1 spec. Where this version will default the `fromIndex` paramater to the
	array's length if `fromIndex > array.length`, the Prototype version will not and as a result will return a different value.
	Care should be taken when using this library in conjunction with Prototype as Prototype's version will override
	this version in non-supporting browsers if it is included in the application ahead of ac_base.js.</em></p>

	@param {Object} value The element to locate in the array.
	@param {Number} fromIndex Optional; The index at which to start searching backwards. Defaults to the array's length.
		If negative, it is taken as the offset from the end of the array. If the index is 0, -1 is returned; the array
		will not be searched.
	@returns {Number} Returns the last index at which the element can be found. Else, returns -1.
	@deprecated since version 2.10.0
*/
	Array.prototype.lastIndexOf = function lastIndexOf(value, fromIndex) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;
		fromIndex = parseInt(fromIndex, 10);

		// Return -1 if the array has no length
		if (len <= 0) {
			return -1;
		}

		// Is fromIndex provided? Set i accordingly if it is
		i = (typeof fromIndex === 'number') ? Math.min(len - 1, fromIndex) : len - 1;

		// Handle negative indices
		i = i >= 0 ? i : len - Math.abs(i);

		// Search backwards through array
		for (; i >= 0; i -= 1) {
			if (i in arrayObj && value === arrayObj[i]) {
				return i;
			}
		}

		return -1;

	};
}

// ac-polyfills@2.10.0

},{}],30:[function(require,module,exports){
if (!Array.prototype.map) {
/**
	<p>Calls a provided callback function once for each element in an array, in order, and constructs a new array from the results</p>
	<p>Usage:<p>
	<pre>
	var mapArray = ['foo', 'bar', 'baz'];
	var mapFunction = function (value) {
		return value + '_cat';
	}
	console.log(mapArray.map(mapFunction));
	</pre>
	@param {Function} callback The function to execute on each element in the array
	@param {Object} thisObj Optional; The object to use as `this` when executing the callback
	@returns {Object} A new array containing the results from the callback function.
		Array elements will be in the same order as the original array.
	@deprecated since version 2.10.0
*/
	Array.prototype.map = function map(callback, thisObj) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;
		var result = new Array(len);

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObj) {
				result[i] = callback.call(thisObj, arrayObj[i], i, arrayObj);
			}
		}

		return result;
	};
}

// ac-polyfills@2.10.0

},{}],31:[function(require,module,exports){
if (!Array.prototype.reduce) {
/**
	<p>Applies an accumulation function to every value in an array from left to right and returns a single value.</p>
	<p>Usage:</p>
	<pre>
	var reduceArray = [1, 2, 3, 4, 5];
	var reduceFunction = function (previousValue, currentValue, index, array) {
		return previousValue + currentValue;
	};
	console.log(reduceArray.reduce(reduceFunction));
	</pre>
	@param {Function} callback The function to execute on each value in the array.
		<p><code>callback</code> takes four arguments:</p>
		<dl>
			<dt><strong>previousValue</strong></dt>
			<dd>The value previously returned by the last invocation of the callback, or <code>initialValue</code>, if supplied.</dd>
			<dt><strong>currentValue</strong></dt>
			<dd>The current array value being processed.</dd>
			<dt><strong>index</strong></dt>
			<dd>The index of the current array value being processed in the array.</dd>
			<dt><strong>array</strong></dt>
			<dd>The array <code>reduce</code> was called upon.</dd>
		</dl>
	@param {Mixed} initialValue Optional; If provided, then the first time the callback is called <code>initialValue</code> will be used
		as the value for <code>previousValue</code> and <code>currentValue</code> will be equal to the first value in the array. If not
		provided then <code>previousValue</code> will be equal to the first value in the array and <code>currentValue</code> will be
		equal to the second.
	@returns {Mixed} Reduce returns a single value that is the result of the accumulation function applied to each array element.
	@deprecated since version 2.10.0
*/
	Array.prototype.reduce = function reduce(callback, initialValue) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i = 0;
		var result;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		if (typeof initialValue === 'undefined') {
			if (!len) {
				// No value to return if we have an empty array and no initialValue
				throw new TypeError('Reduce of empty array with no initial value');
			}
			result = arrayObj[0];
			// Start at second element when initialValue is not provided
			i = 1;
		} else {
			result = initialValue;
		}

		while (i < len) {
			if (i in arrayObj) {
				result = callback.call(undefined, result, arrayObj[i], i, arrayObj);
				i += 1;
			}
		}

		return result;
	};
}

// ac-polyfills@2.10.0

},{}],32:[function(require,module,exports){
if (!Array.prototype.reduceRight) {
/**
	<p>Applies an accumulation function to every element in an array from right to left and returns a single value.</p>
	<p>Usage:</p>
	<pre>
	var reduceRightArray = ['foo', 'bar', 'baz'];
	var reduceRightFn = function (previousValue, currentValue, index, array) {
		return previousValue + '_' + currentValue;
	}
	console.log(reduceRightArray.reduceRight(reduceRightFn));
	</pre>
	@param {Function} callback The function to execute on each value in the array.
		<p><code>callback</code> takes four arguments:</p>
		<dl>
			<dt><strong>previousValue</strong></dt>
			<dd>The value previously returned by the last invocation of the callback, or <code>initialValue</code>, if supplied.</dd>
			<dt><strong>currentValue</strong></dt>
			<dd>The current element being processed in the array.</dd>
			<dt><strong>index</strong></dt>
			<dd>The index of the current element being processed in the array.</dd>
			<dt><strong>array</strong></dt>
			<dd>The array <code>reduce</code> was called upon.</dd>
		</dl>
	@param {Mixed} initialValue Optional; If provided, then the first time the callback is called <code>initialValue</code> will be used
		as the value for <code>previousValue</code> and <code>currentValue</code> will be equal to the last value in the array. If not
		provided then <code>previousValue</code> will be equal to the last value in the array and <code>currentValue</code> will be
		equal to the second to last value.
	@returns {Mixed} Reduce returns a single value that is the result of the accumulation function applied to each array element.
	@deprecated since version 2.10.0
*/
	Array.prototype.reduceRight = function reduceRight(callback, initialValue) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i = len - 1;
		var result;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		if (initialValue === undefined) {
			if (!len) {
				// No value to return if we have an empty array and no initialValue
				throw new TypeError('Reduce of empty array with no initial value');
			}
			result = arrayObj[len - 1];
			// Start at second to last element when initialValue is not provided
			i = len - 2;
		} else {
			result = initialValue;
		}

		while (i >= 0) {
			if (i in arrayObj) {
				result = callback.call(undefined, result, arrayObj[i], i, arrayObj);
				i -= 1;
			}
		}

		return result;
	};
}

// ac-polyfills@2.10.0

},{}],33:[function(require,module,exports){
/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES6, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 * @deprecated since version 2.10.0
 */
(function () {
    'use strict';
    var _slice = Array.prototype.slice;

    try {
        // Can't be used with DOM elements in IE < 9
        _slice.call(document.documentElement);
    } catch (e) { // Fails in IE < 9
        // This will work for genuine arrays, array-like objects, 
        // NamedNodeMap (attributes, entities, notations),
        // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
        // and will not fail on other DOM objects (as do DOM elements in IE < 9)
        Array.prototype.slice = function (begin, end) {
            // IE < 9 gets unhappy with an undefined end argument
            end = (typeof end !== 'undefined') ? end : this.length;

            // For native Array objects, we use the native slice function
            if (Object.prototype.toString.call(this) === '[object Array]'){
                return _slice.call(this, begin, end); 
            }

            // For array like object we handle it ourselves.
            var i, cloned = [],
                size, len = this.length;

            // Handle negative value for "begin"
            var start = begin || 0;
            start = (start >= 0) ? start: len + start;

            // Handle negative value for "end"
            var upTo = (end) ? end : len;
            if (end < 0) {
                upTo = len + end;
            }

            // Actual expected size of the slice
            size = upTo - start;

            if (size > 0) {
                cloned = new Array(size);
                if (this.charAt) {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this.charAt(start + i);
                    }
                } else {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this[start + i];
                    }
                }
            }

            return cloned;
        };
    }
}());

// ac-polyfills@2.10.0

},{}],34:[function(require,module,exports){
if (!Array.prototype.some) {
/**
	Essentially the opposite of Array.prototype.every, Array.prototype.some calls a provided callback function once
	for each element in an array, until the callback function returns true.
	@param {Function} callback The fucntion to execute on each element in the array. The return value must evaluate to
	a boolean true in order for the entire method to return true.
	@param {Object} thisObj Optional; The object to use as `this` when executing the callback
	@returns {Boolean} true if the callback returns a true value, otherwise false.
	@deprecated since version 2.10.0
*/
	Array.prototype.some = function some(callback, thisObj) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObj && callback.call(thisObj, arrayObj[i], i, arrayObj) === true) {
				return true;
			}
		}

		return false;
	};
}

// ac-polyfills@2.10.0

},{}],35:[function(require,module,exports){
/**
 * The DOM CustomEvent are events initialized by an application for any purpose.
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 *
 * This is not compatible with IE < 9.
 *
 * @return {Function} CustomEvent constructor
 */

if (document.createEvent) {
	try {
		new window.CustomEvent('click');
	} catch (err) {
		window.CustomEvent = (function () {
			function CustomEvent(event, params) {
				params = params || {bubbles: false, cancelable: false, detail: undefined};
				var evt = document.createEvent('CustomEvent');
				evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
				return evt;
			}
			CustomEvent.prototype = window.Event.prototype;
			return CustomEvent;
		}());
	}
}
// ac-polyfills@2.10.0

},{}],36:[function(require,module,exports){
'use strict';

require('./Date/now');
require('./Date/prototype.toISOString');
require('./Date/prototype.toJSON');

// ac-polyfills@2.10.0

},{"./Date/now":37,"./Date/prototype.toISOString":38,"./Date/prototype.toJSON":39}],37:[function(require,module,exports){
if (!Date.now) {
/**
	Returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
	@returns {Integer} The number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
	@deprecated since version 2.10.0
*/
	Date.now = function now() {
		return new Date().getTime();
	};
}

// ac-polyfills@2.10.0

},{}],38:[function(require,module,exports){
if (!Date.prototype.toISOString) {
/**
	<p>Returns a string from a Date object formatted per the ISO 8601 Extended Format.</p>
	<p><em>Please note that the Prototype library also polyfills this method. However their polyfill
	does not entirely adhere to the ES5 spec. The Prototype version fails to include the milliseconds
	and does not provide support for the extended year format. Be aware that if the Prototype library
	is included ahead of ac_base.js in your application, Prototype's version will take precedence
	on non-supporting browsers.</em></p>
	@returns {String} Returns a date string formatted per the ISO 8601 Extended format.
	@deprecated since version 2.10.0
*/
	Date.prototype.toISOString = function toISOString() {
		if (!isFinite(this)) {
			throw new RangeError('Date.prototype.toISOString called on non-finite value.');
		}

		var parts = {
			'year': this.getUTCFullYear(),
			'month': this.getUTCMonth() + 1,
			'day': this.getUTCDate(),
			'hours': this.getUTCHours(),
			'minutes': this.getUTCMinutes(),
			'seconds': this.getUTCSeconds(),
			'mseconds': (this.getUTCMilliseconds() / 1000).toFixed(3).substr(2, 3)
		};
		var prop;
		var prefix;

		// Pad single digits with a leading 0
		for (prop in parts) {
			if (parts.hasOwnProperty(prop) && prop !== 'year' && prop !== 'mseconds') {
				parts[prop] = String(parts[prop]).length === 1 ? '0' + String(parts[prop]) : String(parts[prop]);
			}
		}

		// Support for extended years per 15.9.1.15.1 (http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
		if (parts.year < 0 || parts.year > 9999) {
			prefix = parts.year < 0 ? '-' : '+';
			parts.year = prefix + String(Math.abs(parts.year / 1000000)).substr(2, 6);
		}

		return parts.year + '-' + parts.month + '-' + parts.day + 'T' + parts.hours + ':' + parts.minutes + ':' + parts.seconds + '.' + parts.mseconds + 'Z';
	};

}

// ac-polyfills@2.10.0

},{}],39:[function(require,module,exports){
if (!Date.prototype.toJSON) {
/**
	<p>Provides a String representation of a Date object for use by JSON.stringify</p>
	<p><strong>Note 1:</strong> The toJSON method is intentionally generic; it does not require that its `this` value be a Date object.
	Therefore, it can be transferred to other kinds of objects for use as a method. However, it does require that
	any such object have a <code>toISOString</code> method. Full info can be found in the ES5 spec (15.9.5.44):
	http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf</p>
	<p><strong>Note 2:</strong> The Prototype library also polyfills this method. However their polyfill
	does not adhere to the ES5 spec. The Prototype version fails to include the ignored <code>key</code> argument,
	and only returns a call to <code>Date.toISOString()</code>. This is quite different from the behavior defined in the ES5 spec.
	Be aware that if the Prototype library is included ahead of ac_base.js in your application, Prototype's version
	will take precedence on non-supporting browsers.</p>
	@param {Mixed} key The key argument is ignored, however an object is free to use the <code>key</code>
		argument to filter its stringification.
	@returns {String} Returns a date string formatted per the ISO 8601 Extended format for use with JSON.stringify
	@deprecated since version 2.10.0
*/
	Date.prototype.toJSON = function (key) {
		var obj = Object(this);
		var prim;

		// These primitive related functions simulate the required call to the internal ToPrimitive() construct per the ES5 spec.
		var isPrimitive = function (input) {
			var type = typeof input;

			var types = [null, 'undefined', 'boolean', 'string', 'number'].some(function (value) {
				return value === type;
			});

			if (types) {
				return true;
			}

			return false;
		};

		var toPrimitive = function (input) {
			var value;

			if (isPrimitive(input)) {
				return input;
			}

			value = (typeof input.valueOf === 'function') ? input.valueOf() : (typeof input.toString === 'function') ? input.toString() : null;

			if (value && isPrimitive(value)) {
				return value;
			}

			throw new TypeError(input + ' cannot be converted to a primitive');
		};

		prim = toPrimitive(obj);

		if (typeof prim === 'number' && !isFinite(prim)) {
			return null;
		}

		if (typeof obj.toISOString !== 'function') {
			throw new TypeError('toISOString is not callable');
		}

		return obj.toISOString.call(obj);
	};
}

// ac-polyfills@2.10.0

},{}],40:[function(require,module,exports){
'use strict';

require('./Element/prototype.classList');
require('./Element/prototype.matches');
require('./Element/prototype.remove');

// ac-polyfills@2.10.0

},{"./Element/prototype.classList":41,"./Element/prototype.matches":42,"./Element/prototype.remove":43}],41:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}

// ac-polyfills@2.10.0

},{}],42:[function(require,module,exports){
'use strict';

/**
 * @name module:ac-polyfills.Element.prototype.matches
 *
 * @function
 *
 * @desc https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill}
 */

if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function(s) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;
		};
}

// ac-polyfills@2.10.0

},{}],43:[function(require,module,exports){
'use strict';

/**
 * @name module:ac-polyfills.Element.prototype.remove
 *
 * @function
 *
 * @desc https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
 */

module.exports = (function () {
	if (!('remove' in Element.prototype)) {
		Element.prototype.remove = function() {
			if (this.parentNode) {
				this.parentNode.removeChild(this);
			}
		};
	}
});

// ac-polyfills@2.10.0

},{}],44:[function(require,module,exports){
'use strict';

require('./Function/prototype.bind');

// ac-polyfills@2.10.0

},{"./Function/prototype.bind":45}],45:[function(require,module,exports){
if (!Function.prototype.bind) {
/**
	Creates a new function that, when called, itself calls this function in the context of the provided
	this value, with a given sequence of arguments preceding any provided when the new function was called.
	Arguments may be passed to bind as separate arguments following `thisObj`.
	@param {Object} thisObj The object that will provide the context of `this` for the called function.
	@deprecated since version 2.10.0
*/
	Function.prototype.bind = function(originalContext){
		if (typeof this !== 'function') {
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}
		var applicableArgs = Array.prototype.slice.call(arguments, 1);
		var functionToBind = this;
		var fnOriginalPrototype = function(){ };
		var fnBound = function() {
			return functionToBind.apply(
				(this instanceof fnOriginalPrototype && originalContext) ? this : originalContext,
				applicableArgs.concat(Array.prototype.slice.call(arguments))
			);
		}
		fnOriginalPrototype.prototype = this.prototype;
		fnBound.prototype = new fnOriginalPrototype();
		return fnBound;
	};
}

// ac-polyfills@2.10.0

},{}],46:[function(require,module,exports){
/*
    json2.js
    2014-02-04
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
    This file creates a global JSON object containing two methods: stringify
    and parse.
        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.
            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.
            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.
            This method produces a JSON text from a JavaScript value.
            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value
            For example, this would serialize Dates as ISO strings.
                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }
                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };
            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.
            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.
            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.
            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.
            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.
            Example:
            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'
            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'
        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.
            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.
            Example:
            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.
            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });
            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });
    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

/** @deprecated since version 2.10.0 */
if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

// ac-polyfills@2.10.0

},{}],47:[function(require,module,exports){
'use strict';

require('./NodeList/prototype.forEach');

// ac-polyfills@2.10.0

},{"./NodeList/prototype.forEach":48}],48:[function(require,module,exports){
if (window.NodeList && !NodeList.prototype.forEach) {
	/**
		Executes a provided function once per value pair in a NodeList.
		@param callback {Function} Function run for each item in NodeList
		@param thisArg {Object} The value of `this` when running the callback

		@author https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
	*/
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// ac-polyfills@2.10.0

},{}],49:[function(require,module,exports){
'use strict';

require('./Object/assign');
require('./Object/create');
require('./Object/is');
require('./Object/keys');

// ac-polyfills@2.10.0

},{"./Object/assign":50,"./Object/create":51,"./Object/is":52,"./Object/keys":53}],50:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill

if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
// ac-polyfills@2.10.0

},{}],51:[function(require,module,exports){
if (!Object.create) {
    /** @ignore */
    var F = function () {};

    /** @deprecated since version 2.10.0 */
    Object.create = function (proto) {
        // Don’t support second argument because it is not possible to accurately polyfill
        if (arguments.length > 1) {
            throw new Error('Second argument not supported');
        }
        // Prototype object is required
        if (proto === null || typeof proto !== 'object') {
            throw new TypeError('Object prototype may only be an Object.');
        }
        F.prototype = proto;
        return new F();
    };
}

// ac-polyfills@2.10.0

},{}],52:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
/** @deprecated since version 2.10.0 */
if (!Object.is) {
  Object.is = function(v1, v2) {
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2;
    }
    if (v1 !== v1) {
      return v2 !== v2;
    }
    return v1 === v2;
  };
}

// ac-polyfills@2.10.0

},{}],53:[function(require,module,exports){
if (!Object.keys) {
/**
	Returns an array of strings representing all the enumerable property names of the object.
	@param {Object} Object who's keys to return.
	@deprecated since version 2.10.0
*/
	Object.keys = function keys(obj) {
		var keysArray = [];
		var currentKey;

		if ((!obj) || (typeof obj.hasOwnProperty !== 'function')) {
			throw 'Object.keys called on non-object.';
		}

		for (currentKey in obj) {
			if (obj.hasOwnProperty(currentKey)) {
				keysArray.push(currentKey);
			}
		}

		return keysArray;
	};
}

// ac-polyfills@2.10.0

},{}],54:[function(require,module,exports){
/*@ignore*/
module.exports = require('es6-promise').polyfill();
// ac-polyfills@2.10.0

},{"es6-promise":72}],55:[function(require,module,exports){
'use strict';

require('./String/prototype.trim');
require('./String/prototype.includes');

// ac-polyfills@2.10.0

},{"./String/prototype.includes":56,"./String/prototype.trim":57}],56:[function(require,module,exports){
/**
 * @author MDN <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes>
*/

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

// ac-polyfills@2.10.0

},{}],57:[function(require,module,exports){
if (!String.prototype.trim) {
/**
	Removes whitespace from both ends of the string.
	@deprecated since version 2.10.0
*/
	String.prototype.trim = function trim() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

// ac-polyfills@2.10.0

},{}],58:[function(require,module,exports){
/** @deprecated since version 2.10.0 */
window.XMLHttpRequest = window.XMLHttpRequest || function () {	
	var request;
	try {
		request = new ActiveXObject("Msxml2.XMLHTTP");
	// Couldn’t get newer MS-proprietary ActiveX object
	} catch (exception) { 
		try {
			request = new ActiveXObject("Microsoft.XMLHTTP");
		// Total XMLHTTP fail
		} catch (exception) {
			request = false;
		}
	}
	return request;
};

// ac-polyfills@2.10.0

},{}],59:[function(require,module,exports){
'use strict';

require('./Array');
require('./console.log');
require('./CustomEvent');
require('./Date');
require('./Element');
require('./Function');
require('./getComputedStyle');
require('./html5shiv');
require('./JSON');
require('./matchMedia');
require('./NodeList');
require('./Object');
require('./performance');
require('./Promise');
require('./requestAnimationFrame');
require('./String');
require('./XMLHttpRequest');

// ac-polyfills@2.10.0

},{"./Array":20,"./CustomEvent":35,"./Date":36,"./Element":40,"./Function":44,"./JSON":46,"./NodeList":47,"./Object":49,"./Promise":54,"./String":55,"./XMLHttpRequest":58,"./console.log":60,"./getComputedStyle":61,"./html5shiv":62,"./matchMedia":63,"./performance":64,"./requestAnimationFrame":66}],60:[function(require,module,exports){
require('console-polyfill');
// ac-polyfills@2.10.0

},{"console-polyfill":71}],61:[function(require,module,exports){
// https://raw.githubusercontent.com/jonathantneal/polyfill/master/source/Window.prototype.getComputedStyle.ie8.js
// Window.prototype.getComputedStyle
/** @deprecated since version 2.10.0 */
if (!window.getComputedStyle) {

	function getComputedStylePixel(element, property, fontSize) {
		element.document; // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.

		var
			value = element.currentStyle[property].match(/(-?[\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
			size = value[1],
			suffix = value[2],
			rootSize;

		fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
		rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

		return suffix == '%' ? size / 100 * rootSize :
			suffix == 'cm' ? size * 0.3937 * 96 :
			suffix == 'em' ? size * fontSize :
			suffix == 'in' ? size * 96 :
			suffix == 'mm' ? size * 0.3937 * 96 / 10 :
			suffix == 'pc' ? size * 12 * 96 / 72 :
			suffix == 'pt' ? size * 96 / 72 :
			size;
	}

	function setShortStyleProperty(style, property) {
		var
			borderSuffix = property == 'border' ? 'Width' : '',
			t = property + 'Top' + borderSuffix,
			r = property + 'Right' + borderSuffix,
			b = property + 'Bottom' + borderSuffix,
			l = property + 'Left' + borderSuffix;

		style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [style[t]] :
			style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]] :
			style[l] == style[r] ? [style[t], style[r], style[b]] :
			[style[t], style[r], style[b], style[l]]).join(' ');
	}

	// <CSSStyleDeclaration>
	function CSSStyleDeclaration(element) {
		var
			style = this,
			currentStyle = element.currentStyle,
			fontSize = getComputedStylePixel(element, 'fontSize'),
			unCamelCase = function(match) {
				return '-' + match.toLowerCase();
			},
			property;

		for (property in currentStyle) {
			Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

			if (property == 'width') {
				style[property] = element.offsetWidth + 'px';
			} else if (property == 'height') {
				style[property] = element.offsetHeight + 'px';
			} else if (property == 'styleFloat') {
				style['float'] = currentStyle[property];
				style.cssFloat = currentStyle[property];
			} else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
				style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
			} else if (/^outline/.test(property)) {
				// errors on checking outline
				try {
					style[property] = currentStyle[property];
				} catch (error) {
					style.outlineColor = currentStyle.color;
					style.outlineStyle = style.outlineStyle || 'none';
					style.outlineWidth = style.outlineWidth || '0px';
					style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
				}
			} else {
				style[property] = currentStyle[property];
			}
		}

		setShortStyleProperty(style, 'margin');
		setShortStyleProperty(style, 'padding');
		setShortStyleProperty(style, 'border');

		style.fontSize = Math.round(fontSize) + 'px';
	}

	CSSStyleDeclaration.prototype = {
		constructor: CSSStyleDeclaration,
		// <CSSStyleDeclaration>.getPropertyPriority
		getPropertyPriority: function() {
			throw new Error('NotSupportedError: DOM Exception 9');
		},
		// <CSSStyleDeclaration>.getPropertyValue
		getPropertyValue: function(property) {
			return this[property.replace(/-\w/g, function(match) {
				return match[1].toUpperCase();
			})];
		},
		// <CSSStyleDeclaration>.item
		item: function(index) {
			return this[index];
		},
		// <CSSStyleDeclaration>.removeProperty
		removeProperty: function() {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.setProperty
		setProperty: function() {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.getPropertyCSSValue
		getPropertyCSSValue: function() {
			throw new Error('NotSupportedError: DOM Exception 9');
		}
	};

	// <window>.getComputedStyle
	window.getComputedStyle = function(element) {
		return new CSSStyleDeclaration(element);
	};

}

// ac-polyfills@2.10.0

},{}],62:[function(require,module,exports){
/* istanbul ignore next */
/*@ignore*/
/** @deprecated since version 2.10.0 */
require('html5shiv/src/html5shiv');

// ac-polyfills@2.10.0

},{"html5shiv/src/html5shiv":82}],63:[function(require,module,exports){
/** @deprecated since version 2.10.0 */
require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');

// ac-polyfills@2.10.0

},{"matchmedia-polyfill":84,"matchmedia-polyfill/matchMedia.addListener":83}],64:[function(require,module,exports){
'use strict';

require('./performance/now');

// ac-polyfills@2.10.0

},{"./performance/now":65}],65:[function(require,module,exports){
/*! MIT License
 *
 * performance.now polyfill
 * copyright Paul Irish 2015
 *
 */

 /** @deprecated since version 2.10.0 */

require('../Date/now');
(function(){

  if ("performance" in window == false) {
      window.performance = {};
  }

  if ("now" in window.performance == false){
    
    var nowOffset = Date.now();
    
    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }

})();

// ac-polyfills@2.10.0

},{"../Date/now":37}],66:[function(require,module,exports){
/**
	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame polyfill by Erik Möller
	fixes from Paul Irish and Tino Zijdel
	Modified to implement Date.now()
*/
/** @deprecated since version 2.10.0 */
(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
		var currTime = Date.now();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function () {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}());

// ac-polyfills@2.10.0

},{}],67:[function(require,module,exports){
/**
 * @module ac-useragent
 * @copyright 2016 Apple Inc. All rights reserved.
 */

'use strict';

var navigatorObj = {
	ua: window.navigator.userAgent,
	platform: window.navigator.platform,
	vendor: window.navigator.vendor
};

module.exports = require('./parseUserAgent')(navigatorObj);

},{"./parseUserAgent":70}],68:[function(require,module,exports){
/**
 * @name module:ac-useragent.browser and module:ac-useragent.os
 */

'use strict';

module.exports = {
	browser: {
		safari: false,
		chrome: false,
		firefox: false,
		ie: false,
		opera: false,
		android: false,
		edge: false,
		version: {
			name: '',
			major: 0,
			minor: 0,
			patch: 0,
			documentMode: false
		}
	},
	os: {
		osx: false,
		ios: false,
		android: false,
		windows: false,
		linux: false,
		fireos: false,
		chromeos: false,
		version: {
			name: '',
			major: 0,
			minor: 0,
			patch: 0
		}
	}
};

},{}],69:[function(require,module,exports){
'use strict';

module.exports = {
	browser: [{
		name: 'edge',
		userAgent: 'Edge',
		version: ['rv', 'Edge'],
		test : function(navigatorObj) {
			return (navigatorObj.ua.indexOf('Edge') > -1 || navigatorObj.ua === 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
		}
	},
	{
		name: 'chrome',
		userAgent: 'Chrome'
	},
	{
		name: 'firefox',
		test: function (navigatorObj) {
			return (navigatorObj.ua.indexOf('Firefox') > -1 && navigatorObj.ua.indexOf('Opera') === -1);
		},
		version: 'Firefox'
	},
	{
		name: 'android',
		userAgent: 'Android'
	},
	{
		name: 'safari',
		test: function (navigatorObj) {
			return (navigatorObj.ua.indexOf('Safari') > -1 && navigatorObj.vendor.indexOf('Apple') > -1);
		},
		version: 'Version'
	},
	{
		name: 'ie',
		test: function (navigatorObj) {
			return (navigatorObj.ua.indexOf('IE') > -1 || navigatorObj.ua.indexOf('Trident') > -1);
		},
		version: ['MSIE', 'rv'],
		parseDocumentMode: function () {
			var documentModeForIE = false;

			// IE8 or later
			if (document.documentMode) {
				documentModeForIE = parseInt(document.documentMode, 10);
			}
			return documentModeForIE;
		}
	},
	{
		name: 'opera',
		userAgent: 'Opera',
		version: ['Version', 'Opera']
	}],

	os: [{
		name: 'windows',
		test: function (navigatorObj) {
			return (navigatorObj.platform.indexOf('Win') > -1);
		},
		version: 'Windows NT'
	},
	{
		name: 'osx',
		userAgent: 'Mac',
		test: function (navigatorObj) {
			return (navigatorObj.platform.indexOf('Mac') > -1);
		}
	},
	{
		name: 'ios',
		test: function (navigatorObj) {
			return (navigatorObj.ua.indexOf('iPhone') > -1 || navigatorObj.ua.indexOf('iPad') > -1);
		},
		version: ['iPhone OS', 'CPU OS']
	},
	{
		name: 'linux',
		userAgent: 'Linux',
		test: function (navigatorObj) {
			//Android devices often have a platform without "Android" in the platform string
			return (navigatorObj.platform.indexOf('Linux') > -1 && navigatorObj.ua.indexOf('Android') === -1);
		}
	},
	{
		name: 'fireos',
		test: function (navigatorObj) {
			return (navigatorObj.ua.indexOf('Firefox') > -1 && navigatorObj.ua.indexOf('Mobile') > -1);
		},
		version: 'rv'
	},
	{
		name: 'android',
		userAgent: 'Android'
	},
	{
		name: 'chromeos',
		userAgent: 'CrOS'
	}]
};

},{}],70:[function(require,module,exports){
'use strict';

var defaults = require('./defaults');
var dictionary = require('./dictionary');

function _matchVersionStrRegExp(str) {
	return new RegExp(str + '[a-zA-Z\\s\/\:]+([0-9_\.]+)', 'i');
}

/**
 * @private
 *
 * @desc Parses the current UA version from the UA string.
 *
 * @param {Object} data A single object containing browser/os information from the defaults array.
 * @param {String} ua The user agent string `navigator.userAgent`.
 *
 * @returns {String} A string containing the version of the current browser/os.
 */
function _parseVersion(data, ua) {

	// 1- Look for a custom version parser, if found, run through that first
	if (typeof data.parseVersion === 'function') {
		return data.parseVersion(ua);

	// 2 - Match the version based on a custom string or array of strings
	} else {
		var versionSearchStr = data.version || data.userAgent;

		// Version search can take a single string or an array of strings
		// normalize it to an array and do the lookup
		if (typeof versionSearchStr === 'string') {
			versionSearchStr = [versionSearchStr];
		}

		var versionSearchStrLength = versionSearchStr.length;
		var match;

		for (var i = 0; i < versionSearchStrLength; i++) {
			match = ua.match(_matchVersionStrRegExp(versionSearchStr[i]));

			// Replace the underscore found in OS version strings with a dot
			if (match && match.length > 1) {
				return match[1].replace(/_/g, '.');
			}
		}
	}
}

/**
 * @private
 *
 * @desc Parses the current UA version from the UA string.
 *
 * @param {Array} dictionaryData A single Array containing the dictionary for browser/os and version parsing.
 * @param {Object} defaultObj The object containing default values for browser/os.
 * @param {Object} navigatorObj The object that holds `navigator.userAgent`,`navigator.platform` and `navigator.vendor`.
 *
 * @returns {Object} Returns the defaults object with current Browser/OS properties filled in.
 */
function _parseUserAgent(dictionaryData, defaultObj, navigatorObj) {
	var dictionaryDataLength = dictionaryData.length;
	var current;
	var currentVersion;

	// Run through the dictionaryData Array in the dictionary
	for (var i = 0; i < dictionaryDataLength; i++) {

		// Find the Browser/OS
		// 1- Look for a custom test function, if found, run through that first
		if (typeof dictionaryData[i].test === 'function') {
			if (dictionaryData[i].test(navigatorObj) === true) {
				current = dictionaryData[i].name;
			}
		} else {

			// 2- If userAgent is specified look for that in the UA string
			if (navigatorObj.ua.indexOf(dictionaryData[i].userAgent) > -1) {
				current = dictionaryData[i].name;
			}
		}

		// If a matching Browser/OS is found. Set the default Object values
		if (current) {
			// Set the Browser/OS to true
			defaultObj[current] = true;

			// Parse the Version
			currentVersion = _parseVersion(dictionaryData[i], navigatorObj.ua);

			// Set the version name, and the breakdown of
			// major, minor and patch in the defaultObj
			if (typeof currentVersion === 'string') {
				var versionBreakdown = currentVersion.split('.');

				defaultObj.version.name = currentVersion;

				if (versionBreakdown && versionBreakdown.length > 0) {
					defaultObj.version.major = parseInt(versionBreakdown[0] || 0);
					defaultObj.version.minor = parseInt(versionBreakdown[1] || 0);
					defaultObj.version.patch = parseInt(versionBreakdown[2] || 0);
				} 
			} else if (current === 'edge') {
					//sometimes edge gives no version, so default to 12.0.0
					defaultObj.version.name = '12.0.0';
					defaultObj.version.major = '12';
					defaultObj.version.minor = '0';
					defaultObj.version.patch = '0';
			}	

			// If there is a document mode then set it at this point
			if (typeof dictionaryData[i].parseDocumentMode === 'function') {
				defaultObj.version.documentMode = dictionaryData[i].parseDocumentMode();
			}

			return defaultObj;
		}
	}

	//If we didn't make a determination
	return defaultObj;
}

/**
 * @name parseUserAgent
 *
 * @desc Parses the current Browser and OS from the UA string.
 *
 * @param {String} ua The user agent string `navigator.userAgent`.
 *
 * @returns {Object} An object with the Browser/OS defaults and the current match set to true.
 */
function parseUserAgent(navigatorObj) {
	var userAgent = {};

	userAgent.browser = _parseUserAgent(dictionary.browser, defaults.browser, navigatorObj);
	userAgent.os = _parseUserAgent(dictionary.os, defaults.os, navigatorObj);

	return userAgent;
}

module.exports = parseUserAgent;

},{"./defaults":68,"./dictionary":69}],71:[function(require,module,exports){
// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function(global) {
  'use strict';
  if (!global.console) {
    global.console = {};
  }
  var con = global.console;
  var prop, method;
  var dummy = function() {};
  var properties = ['memory'];
  var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
     'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
  while (prop = properties.pop()) if (!con[prop]) con[prop] = {};
  while (method = methods.pop()) if (typeof con[method] !== 'function') con[method] = dummy;
  // Using `this` for web workers & supports Browserify / Webpack.
})(typeof window === 'undefined' ? this : window);

},{}],72:[function(require,module,exports){
"use strict";
var Promise = require("./promise/promise").Promise;
var polyfill = require("./promise/polyfill").polyfill;
exports.Promise = Promise;
exports.polyfill = polyfill;
},{"./promise/polyfill":76,"./promise/promise":77}],73:[function(require,module,exports){
"use strict";
/* global toString */

var isArray = require("./utils").isArray;
var isFunction = require("./utils").isFunction;

/**
  Returns a promise that is fulfilled when all the given promises have been
  fulfilled, or rejected if any of them become rejected. The return promise
  is fulfilled with an array that gives all the values in the order they were
  passed in the `promises` array argument.

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.resolve(2);
  var promise3 = RSVP.resolve(3);
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `RSVP.all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  var promise1 = RSVP.resolve(1);
  var promise2 = RSVP.reject(new Error("2"));
  var promise3 = RSVP.reject(new Error("3"));
  var promises = [ promise1, promise2, promise3 ];

  RSVP.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @for RSVP
  @param {Array} promises
  @param {String} label
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
*/
function all(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to all.');
  }

  return new Promise(function(resolve, reject) {
    var results = [], remaining = promises.length,
    promise;

    if (remaining === 0) {
      resolve([]);
    }

    function resolver(index) {
      return function(value) {
        resolveAll(index, value);
      };
    }

    function resolveAll(index, value) {
      results[index] = value;
      if (--remaining === 0) {
        resolve(results);
      }
    }

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && isFunction(promise.then)) {
        promise.then(resolver(i), reject);
      } else {
        resolveAll(i, promise);
      }
    }
  });
}

exports.all = all;
},{"./utils":81}],74:[function(require,module,exports){
(function (process,global){
"use strict";
var browserGlobal = (typeof window !== 'undefined') ? window : {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

// node
function useNextTick() {
  return function() {
    process.nextTick(flush);
  };
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function() {
    node.data = (iterations = ++iterations % 2);
  };
}

function useSetTimeout() {
  return function() {
    local.setTimeout(flush, 1);
  };
}

var queue = [];
function flush() {
  for (var i = 0; i < queue.length; i++) {
    var tuple = queue[i];
    var callback = tuple[0], arg = tuple[1];
    callback(arg);
  }
  queue = [];
}

var scheduleFlush;

// Decide what async method to use to triggering processing of queued callbacks:
if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else {
  scheduleFlush = useSetTimeout();
}

function asap(callback, arg) {
  var length = queue.push([callback, arg]);
  if (length === 1) {
    // If length is 1, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    scheduleFlush();
  }
}

exports.asap = asap;
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":85}],75:[function(require,module,exports){
"use strict";
var config = {
  instrument: false
};

function configure(name, value) {
  if (arguments.length === 2) {
    config[name] = value;
  } else {
    return config[name];
  }
}

exports.config = config;
exports.configure = configure;
},{}],76:[function(require,module,exports){
(function (global){
"use strict";
/*global self*/
var RSVPPromise = require("./promise").Promise;
var isFunction = require("./utils").isFunction;

function polyfill() {
  var local;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof window !== 'undefined' && window.document) {
    local = window;
  } else {
    local = self;
  }

  var es6PromiseSupport = 
    "Promise" in local &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    "resolve" in local.Promise &&
    "reject" in local.Promise &&
    "all" in local.Promise &&
    "race" in local.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new local.Promise(function(r) { resolve = r; });
      return isFunction(resolve);
    }());

  if (!es6PromiseSupport) {
    local.Promise = RSVPPromise;
  }
}

exports.polyfill = polyfill;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./promise":77,"./utils":81}],77:[function(require,module,exports){
"use strict";
var config = require("./config").config;
var configure = require("./config").configure;
var objectOrFunction = require("./utils").objectOrFunction;
var isFunction = require("./utils").isFunction;
var now = require("./utils").now;
var all = require("./all").all;
var race = require("./race").race;
var staticResolve = require("./resolve").resolve;
var staticReject = require("./reject").reject;
var asap = require("./asap").asap;

var counter = 0;

config.async = asap; // default async is asap;

function Promise(resolver) {
  if (!isFunction(resolver)) {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  if (!(this instanceof Promise)) {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  this._subscribers = [];

  invokeResolver(resolver, this);
}

function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch(e) {
    rejectPromise(e);
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value, error, succeeded, failed;

  if (hasCallback) {
    try {
      value = callback(detail);
      succeeded = true;
    } catch(e) {
      failed = true;
      error = e;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (handleThenable(promise, value)) {
    return;
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    resolve(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

var PENDING   = void 0;
var SEALED    = 0;
var FULFILLED = 1;
var REJECTED  = 2;

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers;
  var length = subscribers.length;

  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED]  = onRejection;
}

function publish(promise, settled) {
  var child, callback, subscribers = promise._subscribers, detail = promise._detail;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    invokeCallback(settled, child, callback, detail);
  }

  promise._subscribers = null;
}

Promise.prototype = {
  constructor: Promise,

  _state: undefined,
  _detail: undefined,
  _subscribers: undefined,

  then: function(onFulfillment, onRejection) {
    var promise = this;

    var thenPromise = new this.constructor(function() {});

    if (this._state) {
      var callbacks = arguments;
      config.async(function invokePromiseCallback() {
        invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
      });
    } else {
      subscribe(this, thenPromise, onFulfillment, onRejection);
    }

    return thenPromise;
  },

  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

Promise.all = all;
Promise.race = race;
Promise.resolve = staticResolve;
Promise.reject = staticReject;

function handleThenable(promise, value) {
  var then = null,
  resolved;

  try {
    if (promise === value) {
      throw new TypeError("A promises callback cannot return that same promise.");
    }

    if (objectOrFunction(value)) {
      then = value.then;

      if (isFunction(then)) {
        then.call(value, function(val) {
          if (resolved) { return true; }
          resolved = true;

          if (value !== val) {
            resolve(promise, val);
          } else {
            fulfill(promise, val);
          }
        }, function(val) {
          if (resolved) { return true; }
          resolved = true;

          reject(promise, val);
        });

        return true;
      }
    }
  } catch (error) {
    if (resolved) { return true; }
    reject(promise, error);
    return true;
  }

  return false;
}

function resolve(promise, value) {
  if (promise === value) {
    fulfill(promise, value);
  } else if (!handleThenable(promise, value)) {
    fulfill(promise, value);
  }
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = value;

  config.async(publishFulfillment, promise);
}

function reject(promise, reason) {
  if (promise._state !== PENDING) { return; }
  promise._state = SEALED;
  promise._detail = reason;

  config.async(publishRejection, promise);
}

function publishFulfillment(promise) {
  publish(promise, promise._state = FULFILLED);
}

function publishRejection(promise) {
  publish(promise, promise._state = REJECTED);
}

exports.Promise = Promise;
},{"./all":73,"./asap":74,"./config":75,"./race":78,"./reject":79,"./resolve":80,"./utils":81}],78:[function(require,module,exports){
"use strict";
/* global toString */
var isArray = require("./utils").isArray;

/**
  `RSVP.race` allows you to watch a series of promises and act as soon as the
  first promise given to the `promises` argument fulfills or rejects.

  Example:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 2");
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // result === "promise 2" because it was resolved before promise1
    // was resolved.
  });
  ```

  `RSVP.race` is deterministic in that only the state of the first completed
  promise matters. For example, even if other promises given to the `promises`
  array argument are resolved, but the first completed promise has become
  rejected before the other promises became fulfilled, the returned promise
  will become rejected:

  ```javascript
  var promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve("promise 1");
    }, 200);
  });

  var promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error("promise 2"));
    }, 100);
  });

  RSVP.race([promise1, promise2]).then(function(result){
    // Code here never runs because there are rejected promises!
  }, function(reason){
    // reason.message === "promise2" because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  @method race
  @for RSVP
  @param {Array} promises array of promises to observe
  @param {String} label optional string for describing the promise returned.
  Useful for tooling.
  @return {Promise} a promise that becomes fulfilled with the value the first
  completed promises is resolved with if the first completed promise was
  fulfilled, or rejected with the reason that the first completed promise
  was rejected with.
*/
function race(promises) {
  /*jshint validthis:true */
  var Promise = this;

  if (!isArray(promises)) {
    throw new TypeError('You must pass an array to race.');
  }
  return new Promise(function(resolve, reject) {
    var results = [], promise;

    for (var i = 0; i < promises.length; i++) {
      promise = promises[i];

      if (promise && typeof promise.then === 'function') {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
  });
}

exports.race = race;
},{"./utils":81}],79:[function(require,module,exports){
"use strict";
/**
  `RSVP.reject` returns a promise that will become rejected with the passed
  `reason`. `RSVP.reject` is essentially shorthand for the following:

  ```javascript
  var promise = new RSVP.Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  var promise = RSVP.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @for RSVP
  @param {Any} reason value that the returned promise will be rejected with.
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become rejected with the given
  `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Promise = this;

  return new Promise(function (resolve, reject) {
    reject(reason);
  });
}

exports.reject = reject;
},{}],80:[function(require,module,exports){
"use strict";
function resolve(value) {
  /*jshint validthis:true */
  if (value && typeof value === 'object' && value.constructor === this) {
    return value;
  }

  var Promise = this;

  return new Promise(function(resolve) {
    resolve(value);
  });
}

exports.resolve = resolve;
},{}],81:[function(require,module,exports){
"use strict";
function objectOrFunction(x) {
  return isFunction(x) || (typeof x === "object" && x !== null);
}

function isFunction(x) {
  return typeof x === "function";
}

function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

// Date.now is not available in browsers < IE9
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
var now = Date.now || function() { return new Date().getTime(); };


exports.objectOrFunction = objectOrFunction;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.now = now;
},{}],82:[function(require,module,exports){
/**
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.3-pre';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));

},{}],83:[function(require,module,exports){
/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. MIT license */
(function(){
    // Bail out for browsers that have addListener support
    if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
    }

    var localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening     = false,
        timeoutID       = 0,    // setTimeout for debouncing 'handleChange'
        queries         = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange    = function(evt) {
            // Debounce
            clearTimeout(timeoutID);

            timeoutID = setTimeout(function() {
                for (var i = 0, il = queries.length; i < il; i++) {
                    var mql         = queries[i].mql,
                        listeners   = queries[i].listeners || [],
                        matches     = localMatchMedia(mql.media).matches;

                    // Update mql.matches value and call listeners
                    // Fire listeners only if transitioning to or from matched state
                    if (matches !== mql.matches) {
                        mql.matches = matches;

                        for (var j = 0, jl = listeners.length; j < jl; j++) {
                            listeners[j].call(window, mql);
                        }
                    }
                }
            }, 30);
        };

    window.matchMedia = function(media) {
        var mql         = localMatchMedia(media),
            listeners   = [],
            index       = 0;

        mql.addListener = function(listener) {
            // Changes would not occur to css media type so return now (Affects IE <= 8)
            if (!hasMediaQueries) {
                return;
            }

            // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
            // There should only ever be 1 resize listener running for performance
            if (!isListening) {
                isListening = true;
                window.addEventListener('resize', handleChange, true);
            }

            // Push object only if it has not been pushed already
            if (index === 0) {
                index = queries.push({
                    mql         : mql,
                    listeners   : listeners
                });
            }

            listeners.push(listener);
        };

        mql.removeListener = function(listener) {
            for (var i = 0, il = listeners.length; i < il; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                }
            }
        };

        return mql;
    };
}());

},{}],84:[function(require,module,exports){
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. MIT license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        if (!script) {
          document.head.appendChild(style);
        } else {
          script.parentNode.insertBefore(style, script);
        }

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

},{}],85:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],86:[function(require,module,exports){
'use strict';

var ac_headjs = require('@marcom/ac-headjs');
var ac_useragent = require('@marcom/ac-useragent');
var Main = (function() {
	return {
		initialize: function() {
			ac_headjs.addTests({
				ios: function() {
					return (ac_useragent.os.ios);
				},
				chrome: function() {
					return (ac_useragent.browser.chrome);
				},
				edge: function() {
					return (ac_useragent.browser.edge);
				},
				ie: function() {
					return (ac_useragent.browser.ie);
				}
			});
			ac_headjs.htmlClass();
			return this;
		}
	};
}());

module.exports = Main.initialize();
},{"@marcom/ac-headjs":17,"@marcom/ac-useragent":67}]},{},[86]);
