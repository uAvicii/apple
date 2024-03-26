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

},{"./data":4,"@marcom/ac-polyfills/Array/prototype.filter":385,"@marcom/ac-polyfills/Array/prototype.some":390}],3:[function(require,module,exports){
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

/** @ignore */
var getBoundingClientRect = require('./utils/getBoundingClientRect');

/**
 * @name module:ac-dom-metrics.getContentDimensions
 *
 * @function
 *
 * @desc Get the width and height of an Element's content.
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Dimensions} The scrollWidth/Height of an Element.
 */
module.exports = function getContentDimensions(el, rendered) {
	var scale = 1;

	if (rendered) {
		scale = getBoundingClientRect(el).width / el.offsetWidth;
	}

	return {
		width: el.scrollWidth * scale,
		height: el.scrollHeight * scale
	};
};

// ac-dom-metrics@2.4.0

},{"./utils/getBoundingClientRect":15}],6:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getBoundingClientRect = require('./utils/getBoundingClientRect');

/**
 * @name module:ac-dom-metrics.getDimensions
 *
 * @function
 *
 * @desc Get the width and height of an Element.
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Dimensions} The Element dimensions.
 */
module.exports = function getDimensions(el, rendered) {
	var rect;

	if (rendered) {
		rect = getBoundingClientRect(el);

		return {
			width: rect.width,
			height: rect.height
		};
	}

	return {
		width: el.offsetWidth,
		height: el.offsetHeight
	};
};

// ac-dom-metrics@2.4.0

},{"./utils/getBoundingClientRect":15}],7:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getDimensions = require('./getDimensions');
var getBoundingClientRect = require('./utils/getBoundingClientRect');
var getScrollX = require('./getScrollX');
var getScrollY = require('./getScrollY');

/**
 * @name module:ac-dom-metrics.getPagePosition
 *
 * @function
 *
 * @desc Get the position of an Element, relative to the page (0,0).
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Position} The Element position.
 */
module.exports = function getPagePosition(el, rendered) {
	var rect;
	var scrollX;
	var scrollY;
	var dimensions;

	if (rendered) {
		rect = getBoundingClientRect(el);
		scrollX = getScrollX();
		scrollY = getScrollY();

		return {
			top: rect.top + scrollY,
			right: rect.right + scrollX,
			bottom: rect.bottom + scrollY,
			left: rect.left + scrollX
		};
	}

	dimensions = getDimensions(el, rendered);

	rect = {
		top: el.offsetTop,
		left: el.offsetLeft,
		width: dimensions.width,
		height: dimensions.height
	};

	while ((el = el.offsetParent)) {
		rect.top += el.offsetTop;
		rect.left += el.offsetLeft;
	}

	return {
		top: rect.top,
		right: rect.left + rect.width,
		bottom: rect.top + rect.height,
		left: rect.left
	};
};

// ac-dom-metrics@2.4.0

},{"./getDimensions":6,"./getScrollX":11,"./getScrollY":12,"./utils/getBoundingClientRect":15}],8:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getDimensions = require('./getDimensions');
var getPixelsInViewport = require('./getPixelsInViewport');

/**
 * @name module:ac-dom-metrics.getPercentInViewport
 *
 * @function
 *
 * @desc Get the percentage of the Element height in the current viewport.
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Number} Amount in the current viewport, as a percentage from 0-1.
 */
module.exports = function getPercentInViewport(el, rendered) {
	var inViewport = getPixelsInViewport(el, rendered);
	var height = getDimensions(el, rendered).height;

	return (inViewport / height);
};

// ac-dom-metrics@2.4.0

},{"./getDimensions":6,"./getPixelsInViewport":9}],9:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getViewportPosition = require('./getViewportPosition');

/**
 * @name module:ac-dom-metrics.getPixelsInViewport
 *
 * @function
 *
 * @desc Get the vertical pixels of the Element in the current viewport.
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Number} Amount in the current viewport, in pixels without 'px' units.
 */
module.exports = function getPixelsInViewport(el, rendered) {
	var vh = document.documentElement.clientHeight;
	var position = getViewportPosition(el, rendered);
	var pixels;

	if (position.top >= vh || position.bottom <= 0) {
		return 0;
	}

	pixels = (position.bottom - position.top);

	if (position.top < 0) {
		pixels += position.top;
	}

	if (position.bottom > vh) {
		pixels -= position.bottom - vh;
	}

	return pixels;
};

// ac-dom-metrics@2.4.0

},{"./getViewportPosition":13}],10:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getDimensions = require('./getDimensions');
var getBoundingClientRect = require('./utils/getBoundingClientRect');

/**
 * @name module:ac-dom-metrics.getPosition
 *
 * @function
 *
 * @desc Get the layout position of an Element, relative to it's offset parent.
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Position} The Element position.
 */
module.exports = function getPosition(el, rendered) {
	var rect;
	var parentRect;
	var dimensions;

	if (rendered) {
		rect = getBoundingClientRect(el);

		if (el.offsetParent) {
			// Fixed position Elements don't have an offsetParent in WebKit
			parentRect = getBoundingClientRect(el.offsetParent);
			rect.top -= parentRect.top;
			rect.left -= parentRect.left;
		}
	} else {
		dimensions = getDimensions(el, rendered);

		rect = {
			top: el.offsetTop,
			left: el.offsetLeft,
			width: dimensions.width,
			height: dimensions.height
		};
	}

	return {
		top: rect.top,
		right: rect.left + rect.width,
		bottom: rect.top + rect.height,
		left: rect.left
	};
};

// ac-dom-metrics@2.4.0

},{"./getDimensions":6,"./utils/getBoundingClientRect":15}],11:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-metrics.getScrollX
 *
 * @function
 *
 * @desc Get the scrollX of an Element or the Window
 *
 * @param {Element|Window} [el=window]
 *
 * @returns {Number} The scrollX value.
 */
module.exports = function getScrollX(el) {
	var offset;

	el = el || window;

	if (el === window) {
		offset = window.pageXOffset;

		if (!offset) {
			el = document.documentElement || document.body.parentNode || document.body;
		} else {
			return offset;
		}
	}

	return el.scrollLeft;
};

// ac-dom-metrics@2.4.0

},{}],12:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-metrics.getScrollY
 *
 * @function
 *
 * @desc Get the scrollY of an Element or the Window
 *
 * @param {Element|Window} [el=window]
 *
 * @returns {Number} The scrollY value.
 */
module.exports = function getScrollY(el) {
	var offset;

	el = el || window;

	if (el === window) {
		offset = window.pageYOffset;

		if (!offset) {
			el = document.documentElement || document.body.parentNode || document.body;
		} else {
			return offset;
		}
	}

	return el.scrollTop;
};

// ac-dom-metrics@2.4.0

},{}],13:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getPagePosition = require('./getPagePosition');
var getBoundingClientRect = require('./utils/getBoundingClientRect');
var getScrollX = require('./getScrollX');
var getScrollY = require('./getScrollY');

/**
 * @name module:ac-dom-metrics.getViewportPosition
 *
 * @function
 *
 * @desc Get the layout position of an Element, relative to the current viewport/scroll.
 *       Note: Fixed position Elements are only accounted for with rendered set to `true`
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @returns {Position} The Element position.
 */
module.exports = function getViewportPosition(el, rendered) {
	var position;
	var scrollX;
	var scrollY;

	if (rendered) {
		position = getBoundingClientRect(el);

		return {
			top: position.top,
			right: position.right,
			bottom: position.bottom,
			left: position.left
		};
	}

	position = getPagePosition(el);
	scrollX = getScrollX();
	scrollY = getScrollY();

	return {
		top: position.top - scrollY,
		right: position.right - scrollX,
		bottom: position.bottom - scrollY,
		left: position.left - scrollX
	};
};

// ac-dom-metrics@2.4.0

},{"./getPagePosition":7,"./getScrollX":11,"./getScrollY":12,"./utils/getBoundingClientRect":15}],14:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getPixelsInViewport = require('./getPixelsInViewport');
var getPercentInViewport = require('./getPercentInViewport');

/**
 * @name module:ac-dom-metrics.isInViewport
 *
 * @function
 *
 * @desc Determine whether or not an Element is in the current viewport, past a specified threshold
 *
 * @param {Element} el
 *
 * @param {Boolean} [rendered=false]
 *        `false` for layout values (before transforms).
 *        `true` for rendered values (after transforms).
 *
 * @param {Number|String} [threshold=0]
 *        The minimum amount an Element must be in view.
 *        Accepts a percentage from 0-1, or a string with 'px' units (e.g., '50px').
 *        Defaults to any visibility above 0.
 *
 * @returns {Boolean} `true` if the Element is in view, `false` otherwise.
 */
module.exports = function isInViewport(el, rendered, threshold) {
	var inViewport;

	threshold = threshold || 0;

	if (typeof threshold === 'string' && threshold.slice(-2) === 'px') {
		threshold = parseInt(threshold, 10);
		inViewport = getPixelsInViewport(el, rendered);
	} else {
		inViewport = getPercentInViewport(el, rendered);
	}

	return (inViewport > 0 && inViewport >= threshold);
};

// ac-dom-metrics@2.4.0

},{"./getPercentInViewport":8,"./getPixelsInViewport":9}],15:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-metrics/utils.getBoundingClientRect
 *
 * @function
 *
 * @deprecated since version 2.4.0
 *  Use native [Element.getBoundingClientRect()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} instead.
 */
module.exports = function getBoundingClientRect(el) {
	var rect = el.getBoundingClientRect();

	return {
		top: rect.top,
		right: rect.right,
		bottom: rect.bottom,
		left: rect.left,
		width: rect.width || rect.right - rect.left,
		height: rect.height || rect.bottom - rect.top
	};
};

// ac-dom-metrics@2.4.0

},{}],16:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var cache = require('./shared/stylePropertyCache');
var getStyleProperty = require('./getStyleProperty');
var getStyleValue = require('./getStyleValue');

/**
 * @name module:ac-prefixer.getStyleCSS
 *
 * @function
 *
 * @desc Returns a CSS property or full CSS rule with vendor prefixes, as needed.
 *
 * @param {String} property
 *        The unprefixed property name in CSS or DOM form.
 *
 * @param {String} [value]
 *        The unprefixed property's value.
 *
 * @returns {String|Boolean}
 *          The property in CSS form if no value is provided.
 *          The full CSS rule if a value is provided.
 *          `false` if the property and/or value are not avialable.
 */
module.exports = function getStyleCSS(property, value) {
	var css;

	property = getStyleProperty(property);

	if (!property) {
		return false;
	}

	css = cache[property].css;

	if (typeof value !== 'undefined') {
		value = getStyleValue(property, value);

		if (value === false) {
			return false;
		}

		css += ':' + value + ';';
	}

	return css;
};
// ac-prefixer@3.1.1

},{"./getStyleProperty":17,"./getStyleValue":18,"./shared/stylePropertyCache":21}],17:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var cache = require('./shared/stylePropertyCache');
var getStyleTestElement = require('./shared/getStyleTestElement');
var toCSS = require('./utils/toCSS');
var toDOM = require('./utils/toDOM');
var prefixHelper = require('./shared/prefixHelper');

/**
 * @name memoizeStyleProperty
 *
 * @function
 * @private
 *
 * @desc Memoize the results of getStyleProperty
 *
 * @param {String} property
 *        The unprefixed property name in DOM form.
 *
 * @param {String} prefixed
 *        The properly prefixed property name in DOM form.
 */
var memoizeStyleProperty = function (property, prefixed) {
	var cssProperty = toCSS(property);
	var cssPrefixed = (prefixed === false) ? false : toCSS(prefixed);

	cache[property] =
	cache[prefixed] =
	cache[cssProperty] =
	cache[cssPrefixed] = {
		dom: prefixed,
		css: cssPrefixed
	};

	return prefixed;
};

/**
 * @name module:ac-prefixer.getStyleProperty
 *
 * @function
 *
 * @desc Returns the property in DOM form with vendor prefix, as needed.
 *
 * @param {String} property
 *        The unprefixed property name in CSS or DOM form.
 *
 * @returns {String|Boolean} The property in DOM form, or `false` if not available.
 */
module.exports = function getStyleProperty(property) {
	var properties;
	var ucProperty;
	var el;
	var i;

	property += '';

	if (property in cache) {
		return cache[property].dom;
	}

	el = getStyleTestElement();

	property = toDOM(property);
	ucProperty = property.charAt(0).toUpperCase() + property.substring(1);

	if (property === 'filter') {
		// Chrome has both prefixed and unprefixed `filter`
		// but only the prefixed version is fully implemented.
		// Firefox isn't prefixed, so we drop it here.
		properties = ['WebkitFilter', 'filter'];
	} else {
		properties = (property + ' ' + prefixHelper.dom.join(ucProperty + ' ') + ucProperty).split(' ');
	}

	for (i = 0; i < properties.length; i++) {
		if (typeof el.style[properties[i]] !== 'undefined') {

			if (i !== 0) {
				prefixHelper.reduce(i - 1);
			}

			return memoizeStyleProperty(property, properties[i]);
		}
	}

	return memoizeStyleProperty(property, false);
};

// ac-prefixer@3.1.1

},{"./shared/getStyleTestElement":19,"./shared/prefixHelper":20,"./shared/stylePropertyCache":21,"./utils/toCSS":24,"./utils/toDOM":25}],18:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyleProperty = require('./getStyleProperty');
var styleValueAvailable = require('./shared/styleValueAvailable');
var prefixHelper = require('./shared/prefixHelper');

var stylePropertyCache = require('./shared/stylePropertyCache');
var styleValueCache = {};

var RE_CSS_FUNCTION_PARAMS = /(\([^\)]+\))/gi;
var RE_CSS_VALUES = /([^ ,;\(]+(\([^\)]+\))?)/gi;

/**
 * @name module:ac-prefixer.getStyleValue
 *
 * @function
 *
 * @desc Returns the value for a specific property with vendor prefix(es), as needed.
 *
 * @param {String} property
 *        The unprefixed property name in CSS or DOM form.
 *
 * @param {String} value
 *        The unprefixed property value.
 *
 * @returns {String|Boolean} The value, or `false` if not available.
 */
module.exports = function getStyleValue(property, value) {
	var cssProperty;

	value += '';
	property = getStyleProperty(property);

	if (!property) {
		return false;
	}

	if (styleValueAvailable(property, value)) {
		return value;
	}

	cssProperty = stylePropertyCache[property].css;

	value = value.replace(RE_CSS_VALUES, function (match) {
		var values;
		var valueKey;
		var key;
		var i;

		// ignore colors and numbers
		if (match[0] === '#' || !isNaN(match[0])) {
			return match;
		}

		// check memoized value
		valueKey = match.replace(RE_CSS_FUNCTION_PARAMS, '');
		key = cssProperty + ':' + valueKey;
		if (key in styleValueCache) {
			if (styleValueCache[key] === false) {
				// value not supported, stripped
				return '';
			}

			return match.replace(valueKey, styleValueCache[key]);
		}

		// prepare potential prefixes
		values = prefixHelper.css.map(function (prefix) {
			return prefix + match;
		});
		values = [match].concat(values);

		// check potential prefixes
		for (i = 0; i < values.length; i++) {
			if (styleValueAvailable(property, values[i])) {
				// valid prefix found

				if (i !== 0) {
					prefixHelper.reduce(i - 1);
				}

				styleValueCache[key] = values[i].replace(RE_CSS_FUNCTION_PARAMS, '');
				return values[i];
			}
		}

		// value not supported, stripped
		styleValueCache[key] = false;
		return '';
	});

	value = value.trim();
	return (value === '') ? false : value;
};

// ac-prefixer@3.1.1

},{"./getStyleProperty":17,"./shared/prefixHelper":20,"./shared/stylePropertyCache":21,"./shared/styleValueAvailable":22}],19:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var el;

/**
 * @name getStyleTestElement
 * @memberOf module:ac-prefixer/shared
 *
 * @function
 * @private
 *
 * @desc Creates the test Element and/or resets it's style properties.
 */
 module.exports = function getStyleTestElement() {
	if (!el) {
		el = document.createElement('_');
	} else {
		el.style.cssText = '';
		el.removeAttribute('style');
	}

	return el;
};

/*
 * @name getStyleTestElement.resetElement
 *
 * @function
 * @private
 *
 * @desc Reset the test Element. Exposed for testing.
 */
module.exports.resetElement = function () {
	el = null;
};

// ac-prefixer@3.1.1

},{}],20:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var CSS_PREFIXES = ['-webkit-', '-moz-', '-ms-'];
var DOM_PREFIXES = ['Webkit', 'Moz', 'ms'];
var EVT_PREFIXES = ['webkit', 'moz', 'ms'];

var PrefixeHelper = function () {
	this.initialize();
};

var proto = PrefixeHelper.prototype;

proto.initialize = function () {
	this.reduced = false;
	this.css = CSS_PREFIXES;
	this.dom = DOM_PREFIXES;
	this.evt = EVT_PREFIXES;
};

proto.reduce = function (index) {
	if (!this.reduced) {
		this.reduced = true;
		this.css = [this.css[index]];
		this.dom = [this.dom[index]];
		this.evt = [this.evt[index]];
	}
};

module.exports = new PrefixeHelper();

// ac-prefixer@3.1.1

},{}],21:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
module.exports = {};

// ac-prefixer@3.1.1

},{}],22:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var cache = require('./stylePropertyCache');
var getStyleTestElement = require('./getStyleTestElement');
var flagsSet = false;
var supportsAvailable;
var invalidStyleThrowsError;

var prepareFlags = function () {
	var el;

	if (!flagsSet) {
		flagsSet = true;
		supportsAvailable = ('CSS' in window && 'supports' in window.CSS);
		invalidStyleThrowsError = false;

		el = getStyleTestElement();
		try {
			el.style.width = 'invalid';
		} catch (e) {
			// Old IE throws an error for invalid values
			invalidStyleThrowsError = true;
		}
	}
};

/**
 * @name styleValueAvailable
 * @memberOf module:ac-prefixer/shared
 *
 * @function
 * @private
 *
 * @desc Determine whether or not a CSS value is valid
 *
 * @param {String} property
 *        The property name in DOM form, prefixed as needed.
 *
 * @param {String} value
 *        The value to test.
 *
 * @returns {Boolean} `true` if the value is valid, otherwise `false`.
 */
module.exports = function styleValueAvailable(property, value) {
	var before;
	var el;

	prepareFlags();

	if (supportsAvailable) {
		property = cache[property].css;
		return CSS.supports(property, value);
	}

	el = getStyleTestElement();
	before = el.style[property];

	if (invalidStyleThrowsError) {
		try {
			el.style[property] = value;
		} catch (e) {
			// Old IE throws an error for invalid values
			return false;
		}
	} else {
		el.style[property] = value;
	}

	return (el.style[property] && el.style[property] !== before);
};

/*
 * @name styleValueAvailable.resetFlags
 *
 * @function
 * @private
 *
 * @desc Reset CSS.support and try/catch flags. Exposed for testing.
 */
module.exports.resetFlags = function () {
	flagsSet = false;
};

// ac-prefixer@3.1.1

},{"./getStyleTestElement":19,"./stylePropertyCache":21}],23:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var RE_PREFIXES = /(-webkit-|-moz-|-ms-)|^(webkit|moz|ms)/gi;

/**
 * @name module:ac-prefixer.stripPrefixes
 *
 * @function
 *
 * @desc Strips vendor prefixes from a property or value.
 *
 * @param {String} str
 *        The property or value in CSS or DOM form.
 *
 * @returns {String} String in original form with vendor prefixes removed.
 */
module.exports = function stripPrefixes(str) {
	str = String.prototype.replace.call(str, RE_PREFIXES, '');
	return str.charAt(0).toLowerCase() + str.substring(1);
};

// ac-prefixer@3.1.1

},{}],24:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var RE_DOM_PREFIXES = /^(webkit|moz|ms)/gi;

/**
 * @name toCSS
 * @memberOf module:ac-prefixer/utils
 *
 * @function
 *
 * @desc Converts a property or value to CSS form (i.e., "-webkit-property-name").
 *
 * @param {String} str
 *        The property or value in CSS or DOM form.
 *
 * @returns {String} String in CSS form.
 */
module.exports = function toCSS(str) {
	var i;

	if (str.toLowerCase() === 'cssfloat') {
		return 'float';
	}

	if (RE_DOM_PREFIXES.test(str)) {
		str = '-' + str;
	}

	return str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

// ac-prefixer@3.1.1

},{}],25:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var RE_CSS_WORD = /-([a-z])/g;

/**
 * @name toDOM
 * @memberOf module:ac-prefixer/utils
 *
 * @function
 *
 * @desc Converts a property to DOM form (i.e., "WebkitPropertyName").
 *
 * @param {String} str
 *        The property in CSS or DOM form.
 *
 * @returns {String} String in DOM form.
 */
module.exports = function toDOM(str) {
	var i;

	if (str.toLowerCase() === 'float') {
		return 'cssFloat';
	}

	str = str.replace(RE_CSS_WORD, function (str, m1) {
		return m1.toUpperCase();
	});

	if (str.substr(0, 2) === 'Ms') {
		str = 'ms' + str.substring(2);
	}

	return str;
};

// ac-prefixer@3.1.1

},{}],26:[function(require,module,exports){
/**
 * Utility methods for setting and getting Element styles
 * @module ac-dom-styles
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	getStyle: require('./getStyle'),
	setStyle: require('./setStyle')
};

// ac-dom-styles@3.1.2

},{"./getStyle":27,"./setStyle":29}],27:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyleProperty = require('@marcom/ac-prefixer/getStyleProperty');
var stripPrefixes = require('@marcom/ac-prefixer/stripPrefixes');

/**
 * @name module:ac-dom-styles.getStyle
 *
 * @function
 *
 * @desc Get one or more CSS styles on an Element.
 *       Uses `window.getComputedStyle` to get styles set in CSS and/or inline.
 *       Automatically handles vendor prefixed properties and values.
 *
 * @param {Element} target
 *        The DOM element to get the style(s) on.
 *
 * @param {...String|String[]} properties
 *        One or more properties as multiple arguments, or an Array.
 *
 * @returns {Object} An Object with multiple domProperty:value pairs.
 */
module.exports = function getStyle() {
	var properties = Array.prototype.slice.call(arguments);
	var target = properties.shift(properties);
	var computed = window.getComputedStyle(target);
	var styles = {};
	var property;
	var prefixed;
	var value;
	var i;

	if (typeof properties[0] !== 'string') {
		properties = properties[0];
	}

	for (i = 0; i < properties.length; i++) {
		property = properties[i];
		prefixed = getStyleProperty(property);

		if (prefixed) {
			property = stripPrefixes(prefixed);
			value = computed[prefixed];

			if (!value || value === 'auto') {
				value = null;
			}

			if (value) {
				value = stripPrefixes(value);
			}
		} else {
			value = null;
		}

		styles[property] = value;
	}

	return styles;
};

// ac-dom-styles@3.1.2

},{"@marcom/ac-prefixer/getStyleProperty":17,"@marcom/ac-prefixer/stripPrefixes":23}],28:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name normalizeValue
 *
 * @function
 * @private
 *
 * @desc Normalize a CSS value, as follows:
 *       - converts falsey values other than `0` to an empty String
 *       - converts an Array to a String
 *       - combines Object keys as CSS functions
 *       - returns `value` otherwise
 *
 * @param {*} value
 *        The CSS property's value
 *
 * @returns {String|Number} The normalized value
 */
module.exports = function normalizeValue(value) {
	var combined;
	var partials;
	var i;

	if (!value && value !== 0) {
		return '';
	}

	if (Array.isArray(value)) {
		return value + '';
	}

	if (typeof value === 'object') {
		combined = '';
		partials = Object.keys(value);

		for (i = 0; i < partials.length; i++) {
			combined += partials[i] + '(' + value[partials[i]] + ') ';
		}

		return combined.trim();
	}

	return value;
};

// ac-dom-styles@3.1.2

},{}],29:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyleCSS = require('@marcom/ac-prefixer/getStyleCSS');
var getStyleProperty = require('@marcom/ac-prefixer/getStyleProperty');
var normalizeValue = require('./internal/normalizeValue');

/**
 * @name module:ac-dom-styles.setStyle
 *
 * @function
 *
 * @desc Set one or more inline styles on an Element.
 *       Automatically handles vendor prefixed properties and values.
 *
 * @param {Element} target
 *        The DOM element to set the style(s) on.
 *
 * @param {Object} styles
 *        One or more styles as an Object with property/value pairs.
 *        A value of `null` or an empty String will remove that inline style.
 *
 * @returns {Element} target
 */
module.exports = function setStyle(target, styles) {
	var cssText = '';
	var cssRule;
	var property;
	var domProperty;
	var value;
	var targetCSSText;

	if (typeof styles !== 'object') {
		throw new TypeError('setStyle: styles must be an Object');
	}

	for (property in styles) {
		value = normalizeValue(styles[property]);

		if (!value && value !== 0) {
			// remove properties with blank values

			domProperty = getStyleProperty(property);

			if ('removeAttribute' in target.style) {
				// IE < 9
				target.style.removeAttribute(domProperty);
			} else {
				target.style[domProperty] = '';
			}

		} else {
			// get the CSS rule
			cssRule = getStyleCSS(property, value);

			if (cssRule !== false) {
				cssText += ' ' + cssRule;
			}
		}
	}

	if (cssText.length) {
		targetCSSText = target.style.cssText;
		if (targetCSSText.charAt(targetCSSText.length - 1) !== ';') {
			targetCSSText += ';';
		}

		targetCSSText += cssText;

		target.style.cssText = targetCSSText;
	}

	return target;
};

// ac-dom-styles@3.1.2

},{"./internal/normalizeValue":28,"@marcom/ac-prefixer/getStyleCSS":16,"@marcom/ac-prefixer/getStyleProperty":17}],30:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.COMMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for Comment
 */
module.exports = 8;

// ac-dom-nodes@1.7.0

},{}],31:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.DOCUMENT_FRAGMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for DocumentFragment
 */
module.exports = 11;

// ac-dom-nodes@1.7.0

},{}],32:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.DOCUMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for Document
 */
module.exports = 9;

// ac-dom-nodes@1.7.0

},{}],33:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.ELEMENT_NODE
 *
 * @constant
 *
 * @desc nodeType value for Element
 */
module.exports = 1;

// ac-dom-nodes@1.7.0

},{}],34:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.TEXT_NODE
 *
 * @constant
 *
 * @desc nodeType value for TextNode
 */
module.exports = 3;

// ac-dom-nodes@1.7.0

},{}],35:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNode = require('../isNode');

module.exports = function isNodeType(node, nodeType) {
	if (!isNode(node)) {
		return false;
	}

	if (typeof nodeType === 'number') {
		return (node.nodeType === nodeType);
	}

	return (nodeType.indexOf(node.nodeType) !== -1);
};

// ac-dom-nodes@1.7.0

},{"../isNode":39}],36:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./isNodeType');
var COMMENT_NODE = require('../COMMENT_NODE');
var DOCUMENT_FRAGMENT_NODE = require('../DOCUMENT_FRAGMENT_NODE');
var ELEMENT_NODE = require('../ELEMENT_NODE');
var TEXT_NODE = require('../TEXT_NODE');

/** @ignore */
var VALID_INSERT_NODE = [
	ELEMENT_NODE,
	TEXT_NODE,
	COMMENT_NODE,
	DOCUMENT_FRAGMENT_NODE
];

/** @ignore */
var ERR_INVALID_INSERT_NODE = ' must be an Element, TextNode, Comment, or Document Fragment';

/** @ignore */
var VALID_CHILD_NODE = [
	ELEMENT_NODE,
	TEXT_NODE,
	COMMENT_NODE
];

/** @ignore */
var ERR_INVALID_CHILD_NODE = ' must be an Element, TextNode, or Comment';

/** @ignore */
var VALID_PARENT_NODE = [
	ELEMENT_NODE,
	DOCUMENT_FRAGMENT_NODE
];

/** @ignore */
var ERR_INVALID_PARENT_NODE = ' must be an Element, or Document Fragment';

/** @ignore */
var ERR_NO_PARENT_NODE = ' must have a parentNode';

module.exports = {

	/** @ignore */
	parentNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'target';

		if ((node || required) && !isNodeType(node, VALID_PARENT_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_PARENT_NODE);
		}
	},

	/** @ignore */
	childNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'target';

		if (!node && !required) {
			return;
		}

		if (!isNodeType(node, VALID_CHILD_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_CHILD_NODE);
		}
	},

	/** @ignore */
	insertNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'node';

		if (!node && !required) {
			return;
		}

		if (!isNodeType(node, VALID_INSERT_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_INSERT_NODE);
		}
	},

	/** @ignore */
	hasParentNode: function (node, funcName, paramName) {
		paramName = paramName || 'target';

		if (!node.parentNode) {
			throw new TypeError(funcName + ': ' + paramName + ERR_NO_PARENT_NODE);
		}
	}

};

// ac-dom-nodes@1.7.0

},{"../COMMENT_NODE":30,"../DOCUMENT_FRAGMENT_NODE":31,"../ELEMENT_NODE":33,"../TEXT_NODE":34,"./isNodeType":35}],37:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var DOCUMENT_FRAGMENT_NODE = require('./DOCUMENT_FRAGMENT_NODE');

/**
 * @name module:ac-dom-nodes.isDocumentFragment
 *
 * @function
 *
 * @desc Test whether or not an Object is a DocumentFragment.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isDocumentFragment(obj) {
 	return isNodeType(obj, DOCUMENT_FRAGMENT_NODE);
};

// ac-dom-nodes@1.7.0

},{"./DOCUMENT_FRAGMENT_NODE":31,"./internal/isNodeType":35}],38:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var ELEMENT_NODE = require('./ELEMENT_NODE');

/**
 * @name module:ac-dom-nodes.isElement
 *
 * @function
 *
 * @desc Test whether or not an Object is an Element.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isElement (obj) {
 	return isNodeType(obj, ELEMENT_NODE);
};

// ac-dom-nodes@1.7.0

},{"./ELEMENT_NODE":33,"./internal/isNodeType":35}],39:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.isNode
 *
 * @function
 *
 * @desc Test whether or not an Object is a Node.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isNode (obj) {
 	return !!(obj && obj.nodeType);
};

// ac-dom-nodes@1.7.0

},{}],40:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.remove
 *
 * @deprecated since version 1.7.0
 * Use ac-polyfills [`elementNode.remove()`](https://interactive-git.apple.com/interactive-frameworks/ac-polyfills/blob/master/src/Element/prototype.remove.js) instead; see [MDN ChildNode.remove()](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove) for additional information.
 *
 * @function
 *
 * @desc Remove a Node from it's parentNode
 *
 * @param {Node} node
 *        The Node to remove
 *
 * @returns {Node} The removed Node
 */
module.exports = function remove (node) {
	validate.childNode(node, true, 'remove');

	if (!node.parentNode) {
		return node;
	}

	return node.parentNode.removeChild(node);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":36}],41:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isElement = require('@marcom/ac-dom-nodes/isElement');
var matchesSelector = require('./matchesSelector');
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-traversal.ancestors
 *
 * @function
 *
 * @desc Returns an Array of Elements that are ancestors of the specified Node, matching an optional CSS selector, up to and including the body.
 *
 * @param {Node} node
 *        The child Element, TextNode, or Comment.
 *
 * @param {String} [selector]
 *        Optional CSS selectors, separated by commas, to filter ancestor Elements by.
 *
 * @param {Boolean} [inclusive=false]
 *        `true` to include the target node in the potential results, otherwise `false`
 *
 * @param {Boolean} [context=document.body]
 *        An optional ancestor Element to stop checking for parentNodes.
 *        Results are inclusive of this Element.
 *
 * @returns {Element[]} Array of matching ancestor Elements, with the closest ancestor first.
 */
module.exports = function ancestors(node, selector, inclusive, context) {
 	var els = [];

 	validate.childNode(node, true, 'ancestors');
 	validate.selector(selector, false, 'ancestors');

 	if (inclusive && isElement(node) && (!selector || matchesSelector(node, selector))) {
 		els.push(node);
 	}

 	context = context || document.body;

 	if (node !== context) {
	 	while ((node = node.parentNode) && isElement(node)) {
	 		if (!selector || matchesSelector(node, selector)) {
	 			els.push(node);
	 		}

	 		if (node === context) {
	 			break;
	 		}
	 	}
	}

 	return els;
};

// ac-dom-traversal@2.2.0

},{"./internal/validate":43,"./matchesSelector":44,"@marcom/ac-dom-nodes/isElement":38}],42:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
module.exports = window.Element ? (function (proto) {
	return proto.matches ||
		proto.matchesSelector ||
		proto.webkitMatchesSelector ||
		proto.mozMatchesSelector ||
		proto.msMatchesSelector ||
		proto.oMatchesSelector;
}(Element.prototype)) : null;

// ac-dom-traversal@2.2.0

},{}],43:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.indexOf');

/** @ignore */
var isNode = require('@marcom/ac-dom-nodes/isNode');
var COMMENT_NODE = require('@marcom/ac-dom-nodes/COMMENT_NODE');
var DOCUMENT_FRAGMENT_NODE = require('@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE');
var DOCUMENT_NODE = require('@marcom/ac-dom-nodes/DOCUMENT_NODE');
var ELEMENT_NODE = require('@marcom/ac-dom-nodes/ELEMENT_NODE');
var TEXT_NODE = require('@marcom/ac-dom-nodes/TEXT_NODE');

/** @ignore */
var isNodeType = function (node, nodeType) {
	if (!isNode(node)) {
		return false;
	}

	if (typeof nodeType === 'number') {
		return (node.nodeType === nodeType);
	}

	return (nodeType.indexOf(node.nodeType) !== -1);
};

/** @ignore */
var VALID_PARENT_NODE = [
	ELEMENT_NODE,
	DOCUMENT_NODE,
	DOCUMENT_FRAGMENT_NODE
];

/** @ignore */
var ERR_INVALID_PARENT_NODE = ' must be an Element, Document, or Document Fragment';

/** @ignore */
var VALID_CHILD_NODE = [
	ELEMENT_NODE,
	TEXT_NODE,
	COMMENT_NODE
];

/** @ignore */
var ERR_INVALID_CHILD_NODE = ' must be an Element, TextNode, or Comment';

/** @ignore */
var ERR_INVALID_SELECTOR = ' must be a string';

module.exports = {

	/** @ignore */
	parentNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'node';

		if ((node || required) && !isNodeType(node, VALID_PARENT_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_PARENT_NODE);
		}
	},

	/** @ignore */
	childNode: function (node, required, funcName, paramName) {
		paramName = paramName || 'node';

		if (!node && !required) {
			return;
		}

		if (!isNodeType(node, VALID_CHILD_NODE)) {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_CHILD_NODE);
		}
	},

	/** @ignore */
	selector: function (selector, required, funcName, paramName) {
		paramName = paramName || 'selector';

		if ((selector || required) && typeof selector !== 'string') {
			throw new TypeError(funcName + ': ' + paramName + ERR_INVALID_SELECTOR);
		}
	}

};

// ac-dom-traversal@2.2.0

},{"@marcom/ac-dom-nodes/COMMENT_NODE":30,"@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE":31,"@marcom/ac-dom-nodes/DOCUMENT_NODE":32,"@marcom/ac-dom-nodes/ELEMENT_NODE":33,"@marcom/ac-dom-nodes/TEXT_NODE":34,"@marcom/ac-dom-nodes/isNode":39,"@marcom/ac-polyfills/Array/prototype.indexOf":387}],44:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isElement = require('@marcom/ac-dom-nodes/isElement');
var validate = require('./internal/validate');
var nativeMatches = require('./internal/nativeMatches');
var matchesSelectorShim = require('./shims/matchesSelector');

/**
 * @name module:ac-dom-traversal.matchesSelector
 *
 * @deprecated since version 2.2.0
 *  Use [ac-polyfills](https://interactive-git.apple.com/interactive-frameworks/ac-polyfills) `Element.prototype.matches` instead.
 *
 * @function
 *
 * @desc Returns whether or not an Element matches a given CSS selector.
 *
 * @param {Node} node
 *        The Element to be checked.
 *
 * @param {String} selector
 *        CSS selectors, separated by commas, to check Element against.
 *
 * @returns {Boolean} `true` if the Element matches the selector, otherwise `false`
 */
module.exports = function matchesSelector(node, selector) {
 	validate.selector(selector, true, 'matchesSelector');

 	if (!isElement(node)) {
 		return false;
 	}

 	if (!nativeMatches) {
 		return matchesSelectorShim(node, selector);
 	}

	return nativeMatches.call(node, selector);
};

// ac-dom-traversal@2.2.0

},{"./internal/nativeMatches":42,"./internal/validate":43,"./shims/matchesSelector":47,"@marcom/ac-dom-nodes/isElement":38}],45:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');
var querySelectorShim = require('./shims/querySelector');
var querySelectorAvailable = ('querySelector' in document);

/**
 * @name module:ac-dom-traversal.querySelector
 *
 * @deprecated since version 2.2.0
 *  Use native [Element.querySelector()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} instead.
 *
 * @function
 *
 * @desc Returns the first Element within the specified context that match given CSS selector(s).
 *
 * @param {String} selector
 *        One or more CSS selectors separated by commas.
 *
 * @param {Node} [context=document]
 *        An optional ParentNode to scope the selector to. Defaults to `document`.
 *
 * @returns {Element|null} First matching Element, or `null` if no matches are found.
 *
 */
module.exports = function querySelector(selector, context) {
	context = context || document;

	validate.parentNode(context, true, 'querySelector', 'context');
	validate.selector(selector, true, 'querySelector');

	if (!querySelectorAvailable) {
		return querySelectorShim(selector, context);
	}

	return context.querySelector(selector);
};

// ac-dom-traversal@2.2.0

},{"./internal/validate":43,"./shims/querySelector":48}],46:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');

/** @ignore */
var validate = require('./internal/validate');
var querySelectorAllShim = require('./shims/querySelectorAll');
var querySelectorAllAvailable = ('querySelectorAll' in document);

/**
 * @name module:ac-dom-traversal.querySelectorAll
 *
 * @deprecated since version 2.2.0
 *  Use native [Element.querySelectorAll()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll} instead.
 *
 * @function
 *
 * @desc Returns an Array of Elements within the specified context that match given CSS selector(s).
 *
 * @param {String} selector
 *        One or more CSS selectors separated by commas.
 *
 * @param {Node} [context=document]
 *        An optional ParentNode to scope the selector to. Defaults to `document`.
 *
 * @returns {Element[]} Array of matching Elements
 */
module.exports = function querySelectorAll(selector, context) {
	context = context || document;

	validate.parentNode(context, true, 'querySelectorAll', 'context');
	validate.selector(selector, true, 'querySelectorAll');

	if (!querySelectorAllAvailable) {
		return querySelectorAllShim(selector, context);
	}

	return Array.prototype.slice.call(context.querySelectorAll(selector));
};

// ac-dom-traversal@2.2.0

},{"./internal/validate":43,"./shims/querySelectorAll":49,"@marcom/ac-polyfills/Array/prototype.slice":389}],47:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var querySelectorAll = require('../querySelectorAll');

/**
 * module:ac-dom-traversal.matchesSelector shim for IE < 8
 */
module.exports = function matchesSelector(node, selector) {
	var context = node.parentNode || document;
	var nodes = querySelectorAll(selector, context);
	var i;

	for (i = 0; i < nodes.length; i++) {
		if (nodes[i] === node) {
			return true;
		}
	}

	return false;
};

// ac-dom-traversal@2.2.0

},{"../querySelectorAll":46}],48:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var querySelectorAll = require('./querySelectorAll');

/**
 * module:ac-dom-traversal.querySelector shim for IE < 8
 */
module.exports = function querySelector(selector, context) {
	var allResults = querySelectorAll(selector, context);

	return allResults.length ? allResults[0] : null;
};

// ac-dom-traversal@2.2.0

},{"./querySelectorAll":49}],49:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.indexOf');

/** @ignore */
var isElement = require('@marcom/ac-dom-nodes/isElement');
var isDocumentFragment = require('@marcom/ac-dom-nodes/isDocumentFragment');
var removeElement = require('@marcom/ac-dom-nodes/remove');
var COLLECTION_PREFIX = '_ac_qsa_';

var isElementInContext = function (el, context) {
	var parent;

	if (context === document) {
		return true;
	}

	parent = el;
	while ((parent = parent.parentNode) && isElement(parent)) {
		if (parent === context) {
			return true;
		}
	}

	return false;
};

var recalcStyles = function (context) {
	if ('recalc' in context) {
		context.recalc(false);
	} else {
		document.recalc(false);
	}

	window.scrollBy(0, 0);
};

/**
 * module:ac-dom-traversal.querySelectorAll shim for IE < 8
 */
module.exports = function querySelectorAll(selector, context) {
	var style = document.createElement('style');
	var id = COLLECTION_PREFIX + (Math.random() + '').slice(-6);
	var els = [];
	var el;

	// default context
	context = context || document;

	// prepare the collection
	document[id] = [];

	if (isDocumentFragment(context)) {
		context.appendChild(style);
	} else {
		document.documentElement.firstChild.appendChild(style);
	}

	// prepare style tag
	// ac-qsa:expression() adds matching elements to the collection
	// display:recalc; is invalid, but forces display:none; elements to recalc
	style.styleSheet.cssText = '*{display:recalc;}' + selector + '{ac-qsa:expression(document["' + id + '"] && document["' + id + '"].push(this));}';

	// recalc styles
	recalcStyles(context);

	// cleanup and collect matched elements
	while (document[id].length) {
		el = document[id].shift();
		el.style.removeAttribute('ac-qsa');

		// don't repeat elements
		// and enforce the current context
		if (els.indexOf(el) === -1 && isElementInContext(el, context)) {
			els.push(el);
		}
	}

	// reset collection and styles
	document[id] = null;
	removeElement(style);
	recalcStyles(context);

	// done!
	return els;
};

// ac-dom-traversal@2.2.0

},{"@marcom/ac-dom-nodes/isDocumentFragment":37,"@marcom/ac-dom-nodes/isElement":38,"@marcom/ac-dom-nodes/remove":40,"@marcom/ac-polyfills/Array/prototype.indexOf":387}],50:[function(require,module,exports){
var Clock = require("./ac-clock/Clock"),
	ThrottledClock = require("./ac-clock/ThrottledClock"),
	sharedClockInstance = require("./ac-clock/sharedClockInstance");

// expose parent constructor on global instance (in case we want to create private versions of this later)
sharedClockInstance.Clock = Clock;
sharedClockInstance.ThrottledClock = ThrottledClock;

module.exports = sharedClockInstance;

// ac-clock@1.1.2

},{"./ac-clock/Clock":51,"./ac-clock/ThrottledClock":52,"./ac-clock/sharedClockInstance":53}],51:[function(require,module,exports){
/*global module */
"use strict";

require('@marcom/ac-polyfills/Function/prototype.bind');
require('@marcom/ac-polyfills/requestAnimationFrame');

var proto;

var EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var pageLoadTime = new Date().getTime();

/**
 * @name .Clock
 * @class Clock
 * <pre>Clock = require('/Clock');</pre>
 */
function Clock() {
	// initialize EventEmitter scope on this object
	EventEmitter.call( this );

	// create variables to house state information and animationFrame location
	this.lastFrameTime = null;
	this._animationFrame = null;
	this._active = false;
	this._startTime = null;
	this._boundOnAnimationFrame = this._onAnimationFrame.bind( this );
	this._getTime = Date.now || function() { return new Date().getTime(); };
}

// force EventEmitter prototype on Clock
proto = Clock.prototype = new EventEmitter( null );

// start running the animationFrame loop
proto.start = function() {
	// prevent the clock from running more than once
	if ( this._active ) {
		return;
	}
	this._tick();
};

// stop running the animationFrame loop
proto.stop = function() {
	if ( this._active ) {
		// cancel a previous animation frame if we're catching it off its refresh cycle
		window.cancelAnimationFrame( this._animationFrame );
	}

	// set the animationFrame to null and remove active state
	this._animationFrame = null;
	this.lastFrameTime = null;
	this._active = false;
};

// stop running the Clock and ensure that the object can be garbage collected
proto.destroy = function() {
	this.stop();
	this.off();

	var i;
	for ( i in this ) {
		if ( this.hasOwnProperty( i ) ) {
			this[ i ] = null;
		}
	}
};

// API to determine whether or not the clock is currently running
proto.isRunning = function() {
	return this._active;
};

// internally called start method to allow it to run continuously without triggering a new run cycle
proto._tick = function() {
	if ( !this._active ) {
		this._active = true;
	}

	// request the next animation frame to run
	this._animationFrame = window.requestAnimationFrame( this._boundOnAnimationFrame );
};

// method that gets called on each animationFrame render
proto._onAnimationFrame = function( time ) {
	if ( this.lastFrameTime === null ) {
		this.lastFrameTime = time;
	}

	// calculate delta and default fps
	var delta = time - this.lastFrameTime;
	var fps = 0;

	if (delta >= 1000) {
		// ignore very long deltas
		// e.g., after App Nap
		delta = 0;
	}

	// if we can actually determine the FPS, calcaluate that here
	if ( delta !== 0 ) {
		fps = 1000 / delta;
	}

	// reset delta to 0 if this is the first frame
	if (this._firstFrame === true) {
		delta = 0;
		this._firstFrame = false;
	}

	if (fps === 0) {
		// wait for FPS to trigger events
		this._firstFrame = true;

	} else {

		// set data object
		var data = {
			time : time,
			delta : delta,
			fps : fps,
			naturalFps : fps,
			timeNow : this._getTime()
		};

		// trigger the 'update' event, which modules should bind to if they have values that should be synced before 'draw'
		this.trigger( 'update', data );
		// trigger the 'draw' event, which modules should call when drawing to the page
		this.trigger( 'draw', data );
	}

	// remove reference for this._animationFrame
	this._animationFrame = null;
	// set lastFrameTime
	this.lastFrameTime = time;
	// restart the animation frame loop

	// If the clock wasn't stopped in the update or draw cycles
	if (this._active !== false) {
		this._tick();
	} else {
		this.lastFrameTime = null;
	}
};

module.exports = Clock;

// ac-clock@1.1.2

},{"@marcom/ac-event-emitter-micro":84,"@marcom/ac-polyfills/Function/prototype.bind":393,"@marcom/ac-polyfills/requestAnimationFrame":394}],52:[function(require,module,exports){
/*global module */
"use strict";

require('@marcom/ac-polyfills/requestAnimationFrame');

var proto;

var sharedClockInstance = require('./sharedClockInstance'),
	EventEmitter = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

/**
 * @name .ThrottledClock
 * @class ThrottledClock
 * <pre>ThrottledClock = require('/ThrottledClock');</pre>
 */
function ThrottledClock( fps, options ) {
	// if being extended by another module, return false here;
	if ( fps === null ) {
		return;
	}

	EventEmitter.call( this );
	options = options || {};

	this._fps = fps || null;
	this._clock = options.clock || sharedClockInstance;
	this._lastThrottledTime = null;
	this._clockEvent = null;

	this._boundOnClockDraw = this._onClockDraw.bind(this);
	this._boundOnClockUpdate = this._onClockUpdate.bind(this);

	this._clock.on( 'update', this._boundOnClockUpdate );
}

proto = ThrottledClock.prototype = new EventEmitter( null );

proto.setFps = function( fps ) {
	this._fps = fps;
	return this;
};

proto.getFps = function() {
	return this._fps;
};

proto.start = function() {
	this._clock.start();
	return this;
};

proto.stop = function() {
	this._clock.stop();
	return this;
};

proto.isRunning = function() {
	return this._clock.isRunning();
};

proto.destroy = function() {
	this._clock.off( 'update', this._boundOnClockUpdate );
	this._clock.destroy.call( this );
};

proto._onClockUpdate = function( e ) {
	// get the last throttled time if DNE
	if ( this._lastThrottledTime === null ) {
		this._lastThrottledTime = this._clock.lastFrameTime;
	}

	var delta = e.time - this._lastThrottledTime;

	if ( !this._fps ) {
		throw new TypeError('FPS is not defined.');
	}

	// if the delta is less than the lastThrottledTime, return early
	if ( Math.ceil( 1000 / delta ) >= this._fps + 2 ) {
		return;
	}

	// pass the updated delta to object
	this._clockEvent = e;

	// set new delta and fps values
	this._clockEvent.delta = delta;
	this._clockEvent.fps = 1000 / delta;

	// set the lastThrottledTime to the current time
	this._lastThrottledTime = this._clockEvent.time;

	// ensure that _onClockDraw gets called on the next draw event from this._clock
	this._clock.once( 'draw', this._boundOnClockDraw );

	this.trigger( 'update', this._clockEvent );
};

proto._onClockDraw = function() {
	this.trigger( 'draw', this._clockEvent );
};

module.exports = ThrottledClock;

// ac-clock@1.1.2

},{"./sharedClockInstance":53,"@marcom/ac-event-emitter-micro":84,"@marcom/ac-polyfills/requestAnimationFrame":394}],53:[function(require,module,exports){
'use strict';

var Clock = require('./Clock');

module.exports = new Clock();
// ac-clock@1.1.2

},{"./Clock":51}],54:[function(require,module,exports){
/** 
 * @module ac-clip
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	Clip: require('./ac-clip/Clip')
};

// ac-clip@3.1.0

},{"./ac-clip/Clip":55}],55:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/isArray');
var create = require('@marcom/ac-object/create');
var createPredefined = require('@marcom/ac-easing').createPredefined;

/** @ignore */
var Clock = require('@marcom/ac-clock');
var Ease = require('@marcom/ac-easing').Ease;
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

/** @ignore */
var DEFAULT_EASE = 'ease';

/**
 * @name module:ac-clip.Clip
 * @class
 *
 * @param {Object} target
 *        The `Object` whose properties Clip will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.delay=0]
 *        Delay in seconds before a clip will start after play has been called.
 *
 * @param {String|Function} [options.ease='ease']
 *        The ease used for transitions.
 *
 * @param {Clock} [options.clock=Clock]
 *        An instance of `ac-clock.Clock` to be used. Defaults to global singleton.
 *
 * @param {Object} [options.propsFrom={}]
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.loop=0]
 *        Amount of times the clip will loop and replay upon completion.
 *
 * @param {Number} [options.yoyo=false]
 *        When `true` the clip will play in reverse upon completion until it returns
 *        to it’s original state.
 *
 * @param {Boolean} [options.destroyOnComplete=null]
 *        When true the clip will self destruct - call destroy on itself upon
 *        completion.
 *
 * @param {Function} [options.onStart=null]
 *        A callback `Function` called when the clip starts to play.
 *
 * @param {Function} [options.onUpdate=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used if you require to do further calculations with the
 *        properties and not for rendering. Use `onDraw` for rendering.
 *
 * @param {Function} [options.onDraw=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used for rendering, e.g. drawing something to a `canvas`
 *        element.
 *
 * @param {Function} [options.onComplete=null]
 *        A callback `Function` called when the clip has finished playing.
 */
function Clip(target, duration, propsTo, options) {

	// options
	options = options || {};
	this._options = options;

	// features
	this._isYoyo = options.yoyo;
	this._direction = 1;
	this._timeScale = 1;
	this._loop = options.loop || 0;
	this._loopCount = 0;

	// object / timing
	this._target = target;
	this.duration(duration);
	this._delay = (options.delay || 0) * 1000;
	this._remainingDelay = this._delay;
	this._progress = 0;
	this._clock = options.clock || Clock;
	this._playing = false;
	this._getTime = Date.now || function() { return new Date().getTime(); };

	// properties
	this._propsTo = propsTo || {};
	this._propsFrom = options.propsFrom || {};

	// callbacks
	this._onStart = options.onStart || null;
	this._onUpdate = options.onUpdate || null;
	this._onDraw = options.onDraw || null;
	this._onComplete = options.onComplete || null;

	// easing
	var ease = options.ease || DEFAULT_EASE;
	this._ease = (typeof ease === 'function') ? new Ease(ease) : createPredefined(ease);

	//bind
	this._start = this._start.bind(this);
	this._update = this._update.bind(this);
	this._draw = this._draw.bind(this);

	// further prep work to be done in _prepareProperties
	this._isPrepared = false;

	Clip._add(this);

	// call super
	EventEmitterMicro.call(this);
}

var proto = Clip.prototype = create(EventEmitterMicro.prototype);

/** Events */
Clip.COMPLETE = 'complete';
Clip.PAUSE = 'pause';
Clip.PLAY = 'play';


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.Clip#play
 * @function
 *
 * @desc Starts the clip.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.play = function () {
	if (!this._playing) {
		this._playing = true;

		if (this._delay === 0 || this._remainingDelay === 0) {
			this._start();
		}
		else {
			if (!this._isPrepared) {
				this._setDiff();
				this._updateProps();
			}
			this._startTimeout = setTimeout(this._start, this._remainingDelay / this._timeScale);
			this._delayStart = this._getTime();
		}
	}
	return this;
};

/**
 * @name module:ac-clip.Clip#pause
 * @function
 *
 * @desc Pauses the clip.
 *
 * @fires Clip#pause
 *
 * @returns {Clip} A reference to this clip.
 */
proto.pause = function () {
	if (this._playing) {
		if (this._startTimeout) {
			this._remainingDelay = this._getTime() - this._delayStart;
			clearTimeout(this._startTimeout);
		}

		this._stop();

		/**
		 * Pause event.
		 * @event Clip#pause
		 */
		this.trigger(Clip.PAUSE, this);
	}
	return this;
};

/**
 * @name module:ac-clip.Clip#destroy
 * @function
 *
 * @desc Immediately stop the clip and make it eligible for garbage collection.
 *       A clip can not be reused after it has been destroyed.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.destroy = function () {
	this.pause();

	this._options = null;
	this._target = null;
	this._storeTarget = null;
	this._ease = null;
	this._clock = null;
	this._propsTo = null;
	this._propsFrom = null;
	this._storePropsTo = null;
	this._storePropsFrom = null;
	this._propsDiff = null;
	this._propsEase = null;
	this._onStart = null;
	this._onUpdate = null;
	this._onDraw = null;
	this._onComplete = null;

	Clip._remove(this);

	// call Super destroy method
	EventEmitterMicro.prototype.destroy.call(this);

	return this;
};

/**
 * @name module:ac-clip.Clip#reset
 * @function
 *
 * @desc Resets the clip and target properties.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.reset = function () {
	if (!this._isPrepared) {
		// nothing to reset
		return;
	}

	this._stop();
	
	this._resetLoop(this._target, this._storeTarget);
	
	this._direction = 1;
	this._loop = this._options.loop || 0;
	this._loopCount = 0;
	this._propsFrom = this._storePropsFrom;
	this._propsTo = this._storePropsTo;
	
	this._progress = 0;
	this._setStartTime();

	if (this._onUpdate) {
		this._onUpdate.call(this, this);
	}
	if (this._onDraw) {
		this._onDraw.call(this, this);
	}

	return this;
};

/**
 * @name module:ac-clip.Clip#playing
 * @function
 *
 * @desc Returns the clips current play stat as a `Boolean` true / false.
 *
 * @returns {Boolean} The current play stat.
 */
proto.playing = function () {
	return this._playing;
};

/**
 * @name module:ac-clip.Clip#target
 * @function
 *
 * @desc Gets the target `Object`.
 *
 * @returns {Object} The target.
 */
proto.target = function () {
	return this._target;
};

/**
 * @name module:ac-clip.Clip#duration
 * @function
 *
 * @desc Gets or sets the duration of the transition.
 *
 * @param {Number} [duration]
 *        Optional new duration for the transition.
 *
 * @returns {Number} The current duration.
 */
proto.duration = function (duration) {

	if (duration !== undefined) {
		this._duration = duration;
		this._durationMs = (duration * 1000) / this._timeScale;

		if (this._playing) {
			this._setStartTime();
		}
	}

	return this._duration;
};

/**
 * @name module:ac-clip.Clip#timeScale
 * @function
 *
 * @desc Gets or sets the timeScale of the transition. TimeScale is the rate at
 *       which the transition will play. For example, a Clip with a duration of
 *       1 second and timeScale of 0.5 will play over 2 seconds.
 *
 * @param {Number} [timeScale]
 *        Optional new timeScale for the transition.
 *
 * @returns {Number} The current timeScale.
 */
proto.timeScale = function (timeScale) {

	if (timeScale !== undefined) {
		this._timeScale = timeScale;
		this.duration(this._duration);
	}
	
	return this._timeScale;
};

/**
 * @name module:ac-clip.Clip#currentTime
 * @function
 *
 * @desc Gets or sets the current time of the transition.
 *
 * @param {Number} [time]
 *        Optional new time for the Clip to jump to.
 *
 * @returns {Number} The current time.
 */
proto.currentTime = function (time) {

	if (time !== undefined) {
		return this.progress(time / this._duration) * this._duration;
	}
	
	return (this.progress() * this._duration);
};

/**
 * @name module:ac-clip.Clip#progress
 * @function
 *
 * @desc Gets or sets the current progress of the transition.
 *
 * @param {Number} progress
 *        Accepts a Number between 0 and 1 and will change the position of the clip.
 *
 * @returns {Number} The current progress.
 */
proto.progress = function (progress) {

	if (progress !== undefined) {

		this._progress = Math.min(1, Math.max(0, progress));
		this._setStartTime();
		
		if (!this._isPrepared) {
			this._setDiff();
		}
		
		if (this._playing && progress === 1) {
			this._completeProps();
			if (this._onUpdate) {
				this._onUpdate.call(this, this);
			}
			if (this._onDraw) {
				this._onDraw.call(this, this);
			}
			this._complete();
		}
		else {
			this._updateProps();
			if (this._onUpdate) {
				this._onUpdate.call(this, this);
			}
			if (this._onDraw) {
				this._onDraw.call(this, this);
			}
		}
	}
	
	return this._progress;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.Clip#_resetLoop
 * @function
 * @private
 */
/** @ignore */
proto._resetLoop = function (target, stored) {
	var prop;
	for (prop in stored) {
		if (stored.hasOwnProperty(prop)) {
			if (stored[prop] !== null) {
				if (typeof stored[prop] === 'object') {
					this._resetLoop(target[prop], stored[prop]);
				}
				else {
					target[prop] = stored[prop];
				}
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_cloneObjects
 * @function
 * @private
 *
 * @returns {Object}
 */
/** @ignore */
proto._cloneObjects = function () {
	var cloneTarget = {};
	var clonePropsTo = {};
	var clonePropsFrom = {};
	this._cloneObjectsLoop(this._target, this._propsTo, this._propsFrom, cloneTarget, clonePropsTo, clonePropsFrom);
	return {
		target: cloneTarget,
		propsTo: clonePropsTo,
		propsFrom: clonePropsFrom
	};
};

/**
 * @name module:ac-clip.Clip#_cloneObjectsLoop
 * @function
 * @private
 *
 * @returns {Object}
 */
/** @ignore */
proto._cloneObjectsLoop = function (target, to, from, cloneTarget, clonePropsTo, clonePropsFrom) {
	var type;
	var prop;

	// loops through propsFrom and if there isn't a matching propsTo
	// adds propsTo property to match the current state of target
	for (prop in from) {
		if (from.hasOwnProperty(prop) && to[prop] === undefined && target[prop] !== undefined) {
			cloneTarget[prop] = target[prop];
			clonePropsTo[prop] = target[prop];
			clonePropsFrom[prop] = from[prop];
		}
	}

	for (prop in to) {
		if (target.hasOwnProperty(prop)) {
			type = typeof target[prop];
			if (target[prop] !== null && type === 'object') {

				if (Array.isArray(target[prop])) {
					// array
					cloneTarget[prop] = [];
					clonePropsTo[prop] = [];
					clonePropsFrom[prop] = [];
				}
				else {
					// object
					cloneTarget[prop] = {};
					clonePropsTo[prop] = {};
					clonePropsFrom[prop] = {};
				}

				this._cloneObjectsLoop(target[prop], to[prop] || {}, from[prop] || {}, cloneTarget[prop], clonePropsTo[prop], clonePropsFrom[prop]);
			}
			else if (to[prop] !== null && type === 'number') {
				cloneTarget[prop] = target[prop];
				clonePropsTo[prop] = to[prop];

				if (from && from[prop] !== undefined) {
					clonePropsFrom[prop] = from[prop];
				}
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_prepareProperties
 * @function
 * @private
 */
/** @ignore */
proto._prepareProperties = function () {
	if (!this._isPrepared) {
		// create clones of main objects
		var clones = this._cloneObjects();
		// we need to clone the target so we can use it for reset, yoyo and loop etc
		this._storeTarget = clones.target;
		// we clone / override the propsTo as we don't want to manipulate / change the
		// object passed to Clip on instantiation as it might be used by something else
		this._propsTo = clones.propsTo;
		this._storePropsTo = this._propsTo;
		// same as propsTo - clone so we don't mess with object that might be used elsewhere
		this._propsFrom = clones.propsFrom;
		this._storePropsFrom = this._propsFrom;

		this._isPrepared = true;
	}
};

/**
 * @name module:ac-clip.Clip#_setStartTime
 * @function
 * @private
 */
/** @ignore */
proto._setStartTime = function () {
	this._startTime = this._getTime() - (this.progress() * this._durationMs);
};

/**
 * @name module:ac-clip.Clip#_setDiff
 * @function
 * @private
 */
/** @ignore */
proto._setDiff = function () {

	// this is the last moment to prep any props
	if (!this._isPrepared) {
		this._prepareProperties();
	}

	this._propsDiff = {};
	this._setDiffLoop(this._propsTo, this._propsFrom, this._target, this._propsDiff);
};

/**
 * @name module:ac-clip.Clip#_setDiffLoop
 * @function
 * @private
 */
/** @ignore */
proto._setDiffLoop = function (to, from, target, diff) {
	var type;
	var prop;
	for (prop in to) {
		if (to.hasOwnProperty(prop)) {
			type = typeof to[prop];
			if (to[prop] !== null && type === 'object') {
				from[prop] = from[prop] || {};
				diff[prop] = diff[prop] || {};
				this._setDiffLoop(to[prop], from[prop], target[prop], diff[prop]);
			}
			else if (type === 'number' && target[prop] !== undefined) {
				if (from[prop] !== undefined) {
					target[prop] = from[prop];
				}
				else {
					from[prop] = target[prop];
				}
				diff[prop] = to[prop] - target[prop];
			}
			else {
				to[prop] = null;
				from[prop] = null;
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_start
 * @function
 * @private
 *
 * @fires Clip#play
 */
/** @ignore */
proto._start = function () {
	this._startTimeout = null;
	this._remainingDelay = 0;

	this._setStartTime();

	this._clock.on('update', this._update);
	this._clock.on('draw', this._draw);

	if (!this._clock.isRunning()) {
		this._clock.start();
	}

	this._setDiff();

	this._playing = true;
	this._running = true;

	if (this._onStart) {
		this._onStart.call(this, this);
	}

	/**
     * Play event.
     * @event Clip#play
     */
	this.trigger(Clip.PLAY, this);
};

/**
 * @name module:ac-clip.Clip#_stop
 * @function
 * @private
 */
/** @ignore */
proto._stop = function () {
	this._playing = false;
	this._running = false;
	this._clock.off('update', this._update);
	this._clock.off('draw', this._draw);
};

/**
 * @name module:ac-clip.Clip#_updateProps
 * @function
 * @private
 */
/** @ignore */
proto._updateProps = function () {
	var eased;
	if (this._direction === 1) {
		eased = this._ease.getValue(this._progress);
	}
	else {
		eased = 1 - this._ease.getValue(1 - this._progress);
	}

	this._updatePropsLoop(this._propsTo, this._propsFrom, this._target, this._propsDiff, eased);
};

/**
 * @name module:ac-clip.Clip#_updateProps
 * @function
 * @private
 */
/** @ignore */
proto._updatePropsLoop = function (to, from, target, diff, eased) {
	var prop;
	for (prop in to) {
		if (to.hasOwnProperty(prop) && to[prop] !== null) {
			if (typeof to[prop] !== 'number') {
				this._updatePropsLoop(to[prop], from[prop], target[prop], diff[prop], eased);
			}
			else {
				target[prop] = from[prop] + (diff[prop] * eased);
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_completeProps
 * @function
 * @private
 */
/** @ignore */
proto._completeProps = function () {
	this._completePropsLoop(this._propsTo, this._target);
};

/**
 * @name module:ac-clip.Clip#_completePropsLoop
 * @function
 * @private
 */
/** @ignore */
proto._completePropsLoop = function (to, target) {
	var prop;
	for (prop in to) {
		if (to.hasOwnProperty(prop) && to[prop] !== null) {
			if (typeof to[prop] !== 'number') {
				this._completePropsLoop(to[prop], target[prop]);
			}
			else {
				target[prop] = to[prop];
			}
		}
	}
};

/**
 * @name module:ac-clip.Clip#_complete
 * @function
 * @private
 *
 * @fires Clip#complete
 */
/** @ignore */
proto._complete = function () {
	if (this._isYoyo && ((this._loop > 0 && this._loopCount <= this._loop) || (this._loop === 0 && this._loopCount === 0))) {
		this._propsFrom = (this._direction === 1) ? this._storePropsTo : this._storePropsFrom;
		this._propsTo = (this._direction === 1) ? this._storePropsFrom : this._storePropsTo;
		this._direction *= -1;
		if (this._direction === -1) {
			++this._loopCount;
		}
		this.progress(0);
		this._start();
	}
	else if (this._loopCount < this._loop) {
		++this._loopCount;
		this.progress(0);
		this._start();
	}
	else {
		/**
		 * Complete event.
		 * @event Clip#complete
		 */
		this.trigger(Clip.COMPLETE, this);

		if (this._onComplete) {
			this._onComplete.call(this, this);
		}

		if (this._options && this._options.destroyOnComplete) {
			this.destroy();
		}
	}
};

/**
 * @name module:ac-clip.Clip#_update
 * @function
 * @private
 *
 * @param {Object} [evt=undefined]
 */
/** @ignore */
proto._update = function (evt) {
	if (this._running) {
		this._progress = (evt.timeNow - this._startTime) / this._durationMs;

		if (this._progress >= 1) {
			this._progress = 1;
			this._running = false;
			this._completeProps();
		}
		else {
			this._updateProps();
		}

		if (this._onUpdate) {
			this._onUpdate.call(this, this);
		}
	}
};

/**
 * @name module:ac-clip.Clip#_draw
 * @function
 * @private
 *
 * @param {Object} [evt=undefined]
 */
/** @ignore */
proto._draw = function (evt) {
	if (this._onDraw) {
		this._onDraw.call(this, this);
	}

	if (!this._running) {
		this._stop();

		if (this._progress === 1) {
			this._complete();
		}
	}
};


////////////////////////////////////////
//////////  STATIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.Clip#_instantiate
 * @function
 * @private
 * @static
 */
/** @ignore */
Clip._instantiate = function () {
	this._clips = [];
	return this;
};

/**
 * @name module:ac-clip.Clip#_add
 * @function
 * @private
 * @static
 *
 * @param {Clip} clip
 */
/** @ignore */
Clip._add = function (clip) {
	this._clips.push(clip);
};

/**
 * @name module:ac-clip.Clip#_remove
 * @function
 * @private
 * @static
 *
 * @param {Clip} clip
 */
/** @ignore */
Clip._remove = function (clip) {
	var index = this._clips.indexOf(clip);
	if (index > -1) {
		this._clips.splice(index, 1);
	}
};

/**
 * @name module:ac-clip.Clip#getAll
 * @function
 * @static
 *
 * @desc Returns an Array of all Clip instances. Will filter to only
 *       instances using target param when supplied.
 *
 * @param {Object} [target=null]
 *        An optional target options. If supplied this function will
 *        return only Clip instances who use this target.
 *
 * @returns {Array} An array of Clip instances.
 */
Clip.getAll = function (target) {
	if (target !== undefined) {
		var clips = [];
		var i = this._clips.length;
		while (i--) {
			if (this._clips[i].target() === target) {
				clips.push(this._clips[i]);
			}
		}
		return clips;
	}
	return Array.prototype.slice.call(this._clips);
};

/**
 * @name module:ac-clip.Clip#destroyAll
 * @function
 * @static
 *
 * @desc Destroys all Clip instances. Will filter to only
 *       instances using target param when supplied.
 *
 * @param {Object} [target=null]
 *        An optional target options. If supplied this function will
 *        destroy only Clip instances who use this target.
 *
 * @returns {Array} An array of all Clips destroyed.
 */
Clip.destroyAll = function (target) {
	var clips = this.getAll(target);
	if (this._clips.length === clips.length) {
		// if all clips then empty array to prevent splice
		this._clips = [];
	}
	var i = clips.length;
	while (i--) {
		clips[i].destroy();
	}
	return clips;
};

/**
 * @name module:ac-clip.Clip#to
 * @function
 * @static
 *
 * @desc Creates and returns an instance of a Clip that will autostart and destroy
 *       itself upon completetion. Ideal for creating throw away instances of Clip
 *       and not having to worry about memory / destroying them.
 *
 * @param {Object} target
 *        The `Object` whose properties Clip will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} options
 *        See Clip instantiation docs for full list of options.
 *
 * @returns {Clip} An new instance of Clip.
 */
Clip.to = function (target, duration, propsTo, options) {
	options = options || {};
	if (options.destroyOnComplete === undefined) {
		options.destroyOnComplete = true;
	}
	return new Clip(target, duration, propsTo, options).play();
};

/**
 * @name module:ac-clip.Clip#from
 * @function
 * @static
 *
 * @desc Creates and returns an instance of a Clip that will autostart and destroy
 *       itself upon completetion. Ideal for creating throw away instances of Clip
 *       and not having to worry about memory / destroying them. Unlike the static
 *       `to` method this method takes propsFrom as the third argument and will
 *       transition an Object back to it's original state.
 *
 * @param {Object} target
 *        The `Object` whose properties Clip will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsFrom
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} options
 *        See Clip instantiation docs for full list of options. The one difference
 *        here is no `propsFrom` object can be passed in options but instead a `propsTo`
 *        option is accepted that works in a similar way - listing end states for props.
 *
 * @returns {Clip} An new instance of Clip.
 */
Clip.from = function (target, duration, propsFrom, options) {
	options = options || {};
	options.propsFrom = propsFrom;
	if (options.destroyOnComplete === undefined) {
		options.destroyOnComplete = true;
	}
	return new Clip(target, duration, options.propsTo, options).play();
};


module.exports = Clip._instantiate();

// ac-clip@3.1.0

},{"@marcom/ac-clock":50,"@marcom/ac-easing":76,"@marcom/ac-event-emitter-micro":84,"@marcom/ac-object/create":97,"@marcom/ac-polyfills/Array/isArray":383}],56:[function(require,module,exports){
/** 
 * @module ac-color
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** require Color */
var Color = require('./ac-color/Color');

/** add static methods to Color */
Color.decimalToHex =	require('./ac-color/static/decimalToHex');
Color.hexToDecimal =	require('./ac-color/static/hexToDecimal');
Color.hexToRgb =		require('./ac-color/static/hexToRgb');
Color.isColor =			require('./ac-color/static/isColor');
Color.isHex =			require('./ac-color/static/isHex');
Color.isRgb =			require('./ac-color/static/isRgb');
Color.isRgba =			require('./ac-color/static/isRgba');
Color.mixColors =		require('./ac-color/static/mixColors');
Color.rgbaToArray =		require('./ac-color/static/rgbaToArray');
Color.rgbToArray =		require('./ac-color/static/rgbToArray');
Color.rgbToDecimal =	require('./ac-color/static/rgbToDecimal');
Color.rgbToHex =		require('./ac-color/static/rgbToHex');
Color.rgbToHsl =		require('./ac-color/static/rgbToHsl');
Color.rgbToHsv =		require('./ac-color/static/rgbToHsv');
Color.rgbaToObject =	require('./ac-color/static/rgbaToObject');
Color.rgbToObject =		require('./ac-color/static/rgbToObject');
Color.shortToLongHex =	require('./ac-color/static/shortToLongHex');

/** exports */
module.exports = {
	Color: Color
};

// ac-color@1.1.0

},{"./ac-color/Color":57,"./ac-color/static/decimalToHex":59,"./ac-color/static/hexToDecimal":60,"./ac-color/static/hexToRgb":61,"./ac-color/static/isColor":62,"./ac-color/static/isHex":63,"./ac-color/static/isRgb":64,"./ac-color/static/isRgba":65,"./ac-color/static/mixColors":66,"./ac-color/static/rgbToArray":67,"./ac-color/static/rgbToDecimal":68,"./ac-color/static/rgbToHex":69,"./ac-color/static/rgbToHsl":70,"./ac-color/static/rgbToHsv":71,"./ac-color/static/rgbToObject":72,"./ac-color/static/rgbaToArray":73,"./ac-color/static/rgbaToObject":74,"./ac-color/static/shortToLongHex":75}],57:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var cssColorNames = require('./helpers/cssColorNames');
var hexToRgb = require('./static/hexToRgb');
var isColor = require('./static/isColor');
var isHex = require('./static/isHex');
var isRgba = require('./static/isRgba');
var mixColors = require('./static/mixColors');
var rgbaToArray = require('./static/rgbaToArray');
var rgbToArray = require('./static/rgbToArray');
var rgbToDecimal = require('./static/rgbToDecimal');
var rgbToHex = require('./static/rgbToHex');
var rgbaToObject = require('./static/rgbaToObject');
var rgbToObject = require('./static/rgbToObject');
var shortToLongHex = require('./static/shortToLongHex');

/**
 * @name module:ac-color.Color
 * @class
 *
 * @desc An Object with methods for converting and manipulating a color.
 *
 * @param {String} color
 *        The color of the object.
 */
function Color(color) {
	if (!isColor(color) && !cssColorNames.nameToRgbObject[color]) {
		throw new Error(color + ' is not a supported color.');
	}

	this._setColor(color);
}

var proto = Color.prototype;

/**
 * @name module:ac-color.Color#_setColor
 * @function
 * @private
 *
 * @param {String} color
 */
proto._setColor = function(color) {
	this._color = {};

	if (isHex(color)) {
		this._color.hex = shortToLongHex(color);
		this._color.rgb = {
			color: hexToRgb(color)
		};
	}
	else if (isRgba(color)) {
		this._color.rgba = {
			color: color
		};
		var rgbaObject = this.rgbaObject();
		this._color.rgb = {
			color: 'rgb(' + rgbaObject.r + ', ' + rgbaObject.g + ', ' + rgbaObject.b + ')'
		};
	}
	else if (cssColorNames.nameToRgbObject[color]) {
		var rgbObject = cssColorNames.nameToRgbObject[color];
		this._color.rgb = {
			object: rgbObject,
			color: 'rgb(' + rgbObject.r + ', ' + rgbObject.g + ', ' + rgbObject.b + ')'
		};
	}
	else {
		this._color.rgb = {
			color: color
		};
	}
};

/**
 * @name module:ac-color.Color#rgb
 * @function
 *
 * @desc Returns the color as an rgb string.
 *
 * @returns {String} The color as an rgb string.
 */
proto.rgb = function () {
	return this._color.rgb.color;
};

/**
 * @name module:ac-color.Color#rgba
 * @function
 *
 * @desc Returns the color as an rgba string.
 *
 * @returns {String} The color as an rgba string.
 */
proto.rgba = function () {
	if (this._color.rgba === undefined) {
		var rgbObject = this.rgbObject();
		this._color.rgba = {
			color: 'rgba(' + rgbObject.r + ', ' + rgbObject.g + ', ' + rgbObject.b + ', 1)'
		};
	}
	return this._color.rgba.color;
};

/**
 * @name module:ac-color.Color#hex
 * @function
 *
 * @desc Returns the color as a hex string.
 *
 * @returns {String} The color as a hex string.
 */
proto.hex = function () {
	if (this._color.hex === undefined) {
		this._color.hex = rgbToHex.apply(this, this.rgbArray());
	}
	return this._color.hex;
};

/**
 * @name module:ac-color.Color#decimal
 * @function
 *
 * @desc Returns the color as a decimal number.
 *
 * @returns {Number} The color as a decimal number.
 */
proto.decimal = function () {
	if (this._color.decimal === undefined) {
		this._color.decimal = rgbToDecimal(this.rgb());
	}
	return this._color.decimal;
};

/**
 * @name module:ac-color.Color#cssName
 * @function
 *
 * @desc Returns the color as a CSS name.
 *
 * @returns {Number} The color as a CSS name.
 */
proto.cssName = function () {
	return cssColorNames.rgbToName[this.rgb()] || null;
};

/**
 * @name module:ac-color.Color#rgbArray
 * @function
 *
 * @desc Returns the color as an rgb array.
 *
 * @returns {Array} The color as an rgb array.
 */
proto.rgbArray = function () {
	if (this._color.rgb.array === undefined) {
		this._color.rgb.array = rgbToArray(this.rgb());
	}
	return this._color.rgb.array;
};

/**
 * @name module:ac-color.Color#rgbaArray
 * @function
 *
 * @desc Returns the color as an rgba array.
 *
 * @returns {Array} The color as an rgba array.
 */
proto.rgbaArray = function () {
	if (this._color.rgba === undefined) {
		this.rgba();
	}
	if (this._color.rgba.array === undefined) {
		this._color.rgba.array = rgbaToArray(this.rgba());
	}
	return this._color.rgba.array;
};

/**
 * @name module:ac-color.Color#rgbObject
 * @function
 *
 * @desc Returns the color as an rgb object with the properties: r, g, b.
 *
 * @returns {Object} The color as an rgb object with the properties: r, g, b.
 */
proto.rgbObject = function () {
	if (this._color.rgb.object === undefined) {
		this._color.rgb.object = rgbToObject(this.rgb());
	}
	return this._color.rgb.object;
};

/**
 * @name module:ac-color.Color#rgbaObject
 * @function
 *
 * @desc Returns the color as an rgba object with the properties: r, g, b, a.
 *
 * @returns {Object} The color as an rgba object with the properties: r, g, b, a.
 */
proto.rgbaObject = function () {
	if (this._color.rgba === undefined) {
		this.rgba();
	}
	if (this._color.rgba.object === undefined) {
		this._color.rgba.object = rgbaToObject(this.rgba());
	}
	return this._color.rgba.object;
};

/**
 * @name module:ac-color.Color#getRed
 * @function
 *
 * @desc Returns the value of the red channel of the color.
 *
 * @returns {Number} The value of the red channel of the color.
 */
proto.getRed = function () {
	return this.rgbObject().r;
};

/**
 * @name module:ac-color.Color#getGreen
 * @function
 *
 * @desc Returns the value of the green channel of the color.
 *
 * @returns {Number} The value of the green channel of the color.
 */
proto.getGreen = function () {
	return this.rgbObject().g;
};

/**
 * @name module:ac-color.Color#getBlue
 * @function
 *
 * @desc Returns the value of the blue channel of the color.
 *
 * @returns {Number} The value of the blue channel of the color.
 */
proto.getBlue = function () {
	return this.rgbObject().b;
};

/**
 * @name module:ac-color.Color#getAlpha
 * @function
 *
 * @desc Returns the value of the alpha channel of the color.
 *
 * @returns {Number} The value of the alpha channel of the color.
 */
proto.getAlpha = function () {
	if (this._color.rgba === undefined) {
		return 1;
	}
	return this.rgbaObject().a;
};

/**
 * @name module:ac-color.Color#setRed
 * @function
 *
 * @desc Sets the red channel of the color.
 *
 * @param {Number} red
 *        The integer value to set the red channel to between 0-255.
 *
 * @returns {Number} The new value of the red channel of the color.
 */
proto.setRed = function (red) {
	if (red !== this.getRed()) {
		this._setColor('rgba(' + red + ', ' + this.getGreen() + ', ' + this.getBlue() + ', ' + this.getAlpha() + ')');
	}
	return this.rgbObject().r;
};

/**
 * @name module:ac-color.Color#setGreen
 * @function
 *
 * @desc Sets the green channel of the color.
 *
 * @param {Number} green
 *        The integer value to set the green channel to between 0-255.
 *
 * @returns {Number} The new value of the green channel of the color.
 */
proto.setGreen = function (green) {
	if (green !== this.getGreen()) {
		this._setColor('rgba(' + this.getRed() + ', ' + green + ', ' + this.getBlue() + ', ' + this.getAlpha() + ')');
	}
	return this.rgbObject().g;
};

/**
 * @name module:ac-color.Color#setBlue
 * @function
 *
 * @desc Sets the blue channel of the color.
 *
 * @param {Number} blue
 *        The integer value to set the blue channel to between 0-255.
 *
 * @returns {Number} The new value of the blue channel of the color.
 */
proto.setBlue = function (blue) {
	if (blue !== this.getBlue()) {
		this._setColor('rgba(' + this.getRed() + ', ' + this.getGreen() + ', ' + blue + ', ' + this.getAlpha() + ')');
	}
	return this.rgbObject().b;
};

/**
 * @name module:ac-color.Color#setAlpha
 * @function
 *
 * @desc Sets the alpha channel of the color.
 *
 * @param {Number} alpha
 *        The float value to set the alpha channel to between 0-1.
 *
 * @returns {Number} The new value of the alpha channel of the color.
 */
proto.setAlpha = function (alpha) {
	if (alpha !== this.getAlpha()) {
		this._setColor('rgba(' + this.getRed() + ', ' + this.getGreen() + ', ' + this.getBlue() + ', ' + alpha + ')');
	}
	return this.rgbaObject().a;
};

/**
 * @name module:ac-color.Color#mix
 * @function
 *
 * @desc Mixes a color into the color at a percentage.
 *
 * @param {String} color
 *        The color to mix into the color as a rgb or hex string.
 *
 * @param {Number} percent
 *        The float value percent to mix the color in between 0-1.
 *
 * @returns {String} The new color as an rgb string.
 */
proto.mix = function (color, percent) {
	var rgbObject = rgbToObject(mixColors(this.rgb(), color, percent));
	this._setColor('rgba(' + rgbObject.r + ', ' + rgbObject.g + ', ' + rgbObject.b + ', ' + this.getAlpha() + ')');
	return this.rgb();
};

/**
 * @name module:ac-color.Color#clone
 * @function
 *
 * @desc Creates a copy of this color object.
 *
 * @returns {Color} The new instance of a Color object.
 */
proto.clone = function () {
	return new Color(this.rgb());
};

module.exports = Color;

// ac-color@1.1.0

},{"./helpers/cssColorNames":58,"./static/hexToRgb":61,"./static/isColor":62,"./static/isHex":63,"./static/isRgba":65,"./static/mixColors":66,"./static/rgbToArray":67,"./static/rgbToDecimal":68,"./static/rgbToHex":69,"./static/rgbToObject":72,"./static/rgbaToArray":73,"./static/rgbaToObject":74,"./static/shortToLongHex":75}],58:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

var rgbToName = {
	'rgb(240, 248, 255)': 'aliceblue',
	'rgb(250, 235, 215)': 'antiquewhite',
	'rgb(0, 0, 0)': 'black',
	'rgb(0, 0, 255)': 'blue',
	'rgb(0, 255, 255)': 'cyan',
	'rgb(0, 0, 139)': 'darkblue',
	'rgb(0, 139, 139)': 'darkcyan',
	'rgb(0, 100, 0)': 'darkgreen',
	'rgb(0, 206, 209)': 'darkturquoise',
	'rgb(0, 191, 255)': 'deepskyblue',
	'rgb(0, 128, 0)': 'green',
	'rgb(0, 255, 0)': 'lime',
	'rgb(0, 0, 205)': 'mediumblue',
	'rgb(0, 250, 154)': 'mediumspringgreen',
	'rgb(0, 0, 128)': 'navy',
	'rgb(0, 255, 127)': 'springgreen',
	'rgb(0, 128, 128)': 'teal',
	'rgb(25, 25, 112)': 'midnightblue',
	'rgb(30, 144, 255)': 'dodgerblue',
	'rgb(32, 178, 170)': 'lightseagreen',
	'rgb(34, 139, 34)': 'forestgreen',
	'rgb(46, 139, 87)': 'seagreen',
	'rgb(47, 79, 79)': 'darkslategray',
	'rgb(50, 205, 50)': 'limegreen',
	'rgb(60, 179, 113)': 'mediumseagreen',
	'rgb(64, 224, 208)': 'turquoise',
	'rgb(65, 105, 225)': 'royalblue',
	'rgb(70, 130, 180)': 'steelblue',
	'rgb(72, 61, 139)': 'darkslateblue',
	'rgb(72, 209, 204)': 'mediumturquoise',
	'rgb(75, 0, 130)': 'indigo',
	'rgb(85, 107, 47)': 'darkolivegreen',
	'rgb(95, 158, 160)': 'cadetblue',
	'rgb(100, 149, 237)': 'cornflowerblue',
	'rgb(102, 205, 170)': 'mediumaquamarine',
	'rgb(105, 105, 105)': 'dimgray',
	'rgb(106, 90, 205)': 'slateblue',
	'rgb(107, 142, 35)': 'olivedrab',
	'rgb(112, 128, 144)': 'slategray',
	'rgb(119, 136, 153)': 'lightslategray',
	'rgb(123, 104, 238)': 'mediumslateblue',
	'rgb(124, 252, 0)': 'lawngreen',
	'rgb(127, 255, 212)': 'aquamarine',
	'rgb(127, 255, 0)': 'chartreuse',
	'rgb(128, 128, 128)': 'gray',
	'rgb(128, 0, 0)': 'maroon',
	'rgb(128, 128, 0)': 'olive',
	'rgb(128, 0, 128)': 'purple',
	'rgb(135, 206, 250)': 'lightskyblue',
	'rgb(135, 206, 235)': 'skyblue',
	'rgb(138, 43, 226)': 'blueviolet',
	'rgb(139, 0, 139)': 'darkmagenta',
	'rgb(139, 0, 0)': 'darkred',
	'rgb(139, 69, 19)': 'saddlebrown',
	'rgb(143, 188, 143)': 'darkseagreen',
	'rgb(144, 238, 144)': 'lightgreen',
	'rgb(147, 112, 219)': 'mediumpurple',
	'rgb(148, 0, 211)': 'darkviolet',
	'rgb(152, 251, 152)': 'palegreen',
	'rgb(153, 50, 204)': 'darkorchid',
	'rgb(154, 205, 50)': 'yellowgreen',
	'rgb(160, 82, 45)': 'sienna',
	'rgb(165, 42, 42)': 'brown',
	'rgb(169, 169, 169)': 'darkgray',
	'rgb(173, 255, 47)': 'greenyellow',
	'rgb(173, 216, 230)': 'lightblue',
	'rgb(175, 238, 238)': 'paleturquoise',
	'rgb(176, 196, 222)': 'lightsteelblue',
	'rgb(176, 224, 230)': 'powderblue',
	'rgb(178, 34, 34)': 'firebrick',
	'rgb(184, 134, 11)': 'darkgoldenrod',
	'rgb(186, 85, 211)': 'mediumorchid',
	'rgb(188, 143, 143)': 'rosybrown',
	'rgb(189, 183, 107)': 'darkkhaki',
	'rgb(192, 192, 192)': 'silver',
	'rgb(199, 21, 133)': 'mediumvioletred',
	'rgb(205, 92, 92)': 'indianred',
	'rgb(205, 133, 63)': 'peru',
	'rgb(210, 105, 30)': 'chocolate',
	'rgb(210, 180, 140)': 'tan',
	'rgb(211, 211, 211)': 'lightgray',
	'rgb(216, 191, 216)': 'thistle',
	'rgb(218, 165, 32)': 'goldenrod',
	'rgb(218, 112, 214)': 'orchid',
	'rgb(219, 112, 147)': 'palevioletred',
	'rgb(220, 20, 60)': 'crimson',
	'rgb(220, 220, 220)': 'gainsboro',
	'rgb(221, 160, 221)': 'plum',
	'rgb(222, 184, 135)': 'burlywood',
	'rgb(224, 255, 255)': 'lightcyan',
	'rgb(230, 230, 250)': 'lavender',
	'rgb(233, 150, 122)': 'darksalmon',
	'rgb(238, 232, 170)': 'palegoldenrod',
	'rgb(238, 130, 238)': 'violet',
	'rgb(240, 255, 255)': 'azure',
	'rgb(240, 255, 240)': 'honeydew',
	'rgb(240, 230, 140)': 'khaki',
	'rgb(240, 128, 128)': 'lightcoral',
	'rgb(244, 164, 96)': 'sandybrown',
	'rgb(245, 245, 220)': 'beige',
	'rgb(245, 255, 250)': 'mintcream',
	'rgb(245, 222, 179)': 'wheat',
	'rgb(245, 245, 245)': 'whitesmoke',
	'rgb(248, 248, 255)': 'ghostwhite',
	'rgb(250, 250, 210)': 'lightgoldenrodyellow',
	'rgb(250, 240, 230)': 'linen',
	'rgb(250, 128, 114)': 'salmon',
	'rgb(253, 245, 230)': 'oldlace',
	'rgb(255, 228, 196)': 'bisque',
	'rgb(255, 235, 205)': 'blanchedalmond',
	'rgb(255, 127, 80)': 'coral',
	'rgb(255, 248, 220)': 'cornsilk',
	'rgb(255, 140, 0)': 'darkorange',
	'rgb(255, 20, 147)': 'deeppink',
	'rgb(255, 250, 240)': 'floralwhite',
	'rgb(255, 215, 0)': 'gold',
	'rgb(255, 105, 180)': 'hotpink',
	'rgb(255, 255, 240)': 'ivory',
	'rgb(255, 240, 245)': 'lavenderblush',
	'rgb(255, 250, 205)': 'lemonchiffon',
	'rgb(255, 182, 193)': 'lightpink',
	'rgb(255, 160, 122)': 'lightsalmon',
	'rgb(255, 255, 224)': 'lightyellow',
	'rgb(255, 0, 255)': 'magenta',
	'rgb(255, 228, 225)': 'mistyrose',
	'rgb(255, 228, 181)': 'moccasin',
	'rgb(255, 222, 173)': 'navajowhite',
	'rgb(255, 165, 0)': 'orange',
	'rgb(255, 69, 0)': 'orangered',
	'rgb(255, 239, 213)': 'papayawhip',
	'rgb(255, 218, 185)': 'peachpuff',
	'rgb(255, 192, 203)': 'pink',
	'rgb(255, 0, 0)': 'red',
	'rgb(255, 245, 238)': 'seashell',
	'rgb(255, 250, 250)': 'snow',
	'rgb(255, 99, 71)': 'tomato',
	'rgb(255, 255, 255)': 'white',
	'rgb(255, 255, 0)': 'yellow',
	'rgb(102, 51, 153)': 'rebeccapurple'
};

var nameToRgbObject = {
	aqua: {r: 0, g: 255, b: 255},
	aliceblue: {r: 240, g: 248, b: 255},
	antiquewhite: {r: 250, g: 235, b: 215},
	black: {r: 0, g: 0, b: 0},
	blue: {r: 0, g: 0, b: 255},
	cyan: {r: 0, g: 255, b: 255},
	darkblue: {r: 0, g: 0, b: 139},
	darkcyan: {r: 0, g: 139, b: 139},
	darkgreen: {r: 0, g: 100, b: 0},
	darkturquoise: {r: 0, g: 206, b: 209},
	deepskyblue: {r: 0, g: 191, b: 255},
	green: {r: 0, g: 128, b: 0},
	lime: {r: 0, g: 255, b: 0},
	mediumblue: {r: 0, g: 0, b: 205},
	mediumspringgreen: {r: 0, g: 250, b: 154},
	navy: {r: 0, g: 0, b: 128},
	springgreen: {r: 0, g: 255, b: 127},
	teal: {r: 0, g: 128, b: 128},
	midnightblue: {r: 25, g: 25, b: 112},
	dodgerblue: {r: 30, g: 144, b: 255},
	lightseagreen: {r: 32, g: 178, b: 170},
	forestgreen: {r: 34, g: 139, b: 34},
	seagreen: {r: 46, g: 139, b: 87},
	darkslategray: {r: 47, g: 79, b: 79},
	darkslategrey: {r: 47, g: 79, b: 79},
	limegreen: {r: 50, g: 205, b: 50},
	mediumseagreen: {r: 60, g: 179, b: 113},
	turquoise: {r: 64, g: 224, b: 208},
	royalblue: {r: 65, g: 105, b: 225},
	steelblue: {r: 70, g: 130, b: 180},
	darkslateblue: {r: 72, g: 61, b: 139},
	mediumturquoise: {r: 72, g: 209, b: 204},
	indigo: {r: 75, g: 0, b: 130},
	darkolivegreen: {r: 85, g: 107, b: 47},
	cadetblue: {r: 95, g: 158, b: 160},
	cornflowerblue: {r: 100, g: 149, b: 237},
	mediumaquamarine: {r: 102, g: 205, b: 170},
	dimgray: {r: 105, g: 105, b: 105},
	dimgrey: {r: 105, g: 105, b: 105},
	slateblue: {r: 106, g: 90, b: 205},
	olivedrab: {r: 107, g: 142, b: 35},
	slategray: {r: 112, g: 128, b: 144},
	slategrey: {r: 112, g: 128, b: 144},
	lightslategray: {r: 119, g: 136, b: 153},
	lightslategrey: {r: 119, g: 136, b: 153},
	mediumslateblue: {r: 123, g: 104, b: 238},
	lawngreen: {r: 124, g: 252, b: 0},
	aquamarine: {r: 127, g: 255, b: 212},
	chartreuse: {r: 127, g: 255, b: 0},
	gray: {r: 128, g: 128, b: 128},
	grey: {r: 128, g: 128, b: 128},
	maroon: {r: 128, g: 0, b: 0},
	olive: {r: 128, g: 128, b: 0},
	purple: {r: 128, g: 0, b: 128},
	lightskyblue: {r: 135, g: 206, b: 250},
	skyblue: {r: 135, g: 206, b: 235},
	blueviolet: {r: 138, g: 43, b: 226},
	darkmagenta: {r: 139, g: 0, b: 139},
	darkred: {r: 139, g: 0, b: 0},
	saddlebrown: {r: 139, g: 69, b: 19},
	darkseagreen: {r: 143, g: 188, b: 143},
	lightgreen: {r: 144, g: 238, b: 144},
	mediumpurple: {r: 147, g: 112, b: 219},
	darkviolet: {r: 148, g: 0, b: 211},
	palegreen: {r: 152, g: 251, b: 152},
	darkorchid: {r: 153, g: 50, b: 204},
	yellowgreen: {r: 154, g: 205, b: 50},
	sienna: {r: 160, g: 82, b: 45},
	brown: {r: 165, g: 42, b: 42},
	darkgray: {r: 169, g: 169, b: 169},
	darkgrey: {r: 169, g: 169, b: 169},
	greenyellow: {r: 173, g: 255, b: 47},
	lightblue: {r: 173, g: 216, b: 230},
	paleturquoise: {r: 175, g: 238, b: 238},
	lightsteelblue: {r: 176, g: 196, b: 222},
	powderblue: {r: 176, g: 224, b: 230},
	firebrick: {r: 178, g: 34, b: 34},
	darkgoldenrod: {r: 184, g: 134, b: 11},
	mediumorchid: {r: 186, g: 85, b: 211},
	rosybrown: {r: 188, g: 143, b: 143},
	darkkhaki: {r: 189, g: 183, b: 107},
	silver: {r: 192, g: 192, b: 192},
	mediumvioletred: {r: 199, g: 21, b: 133},
	indianred: {r: 205, g: 92, b: 92},
	peru: {r: 205, g: 133, b: 63},
	chocolate: {r: 210, g: 105, b: 30},
	tan: {r: 210, g: 180, b: 140},
	lightgray: {r: 211, g: 211, b: 211},
	lightgrey: {r: 211, g: 211, b: 211},
	thistle: {r: 216, g: 191, b: 216},
	goldenrod: {r: 218, g: 165, b: 32},
	orchid: {r: 218, g: 112, b: 214},
	palevioletred: {r: 219, g: 112, b: 147},
	crimson: {r: 220, g: 20, b: 60},
	gainsboro: {r: 220, g: 220, b: 220},
	plum: {r: 221, g: 160, b: 221},
	burlywood: {r: 222, g: 184, b: 135},
	lightcyan: {r: 224, g: 255, b: 255},
	lavender: {r: 230, g: 230, b: 250},
	darksalmon: {r: 233, g: 150, b: 122},
	palegoldenrod: {r: 238, g: 232, b: 170},
	violet: {r: 238, g: 130, b: 238},
	azure: {r: 240, g: 255, b: 255},
	honeydew: {r: 240, g: 255, b: 240},
	khaki: {r: 240, g: 230, b: 140},
	lightcoral: {r: 240, g: 128, b: 128},
	sandybrown: {r: 244, g: 164, b: 96},
	beige: {r: 245, g: 245, b: 220},
	mintcream: {r: 245, g: 255, b: 250},
	wheat: {r: 245, g: 222, b: 179},
	whitesmoke: {r: 245, g: 245, b: 245},
	ghostwhite: {r: 248, g: 248, b: 255},
	lightgoldenrodyellow: {r: 250, g: 250, b: 210},
	linen: {r: 250, g: 240, b: 230},
	salmon: {r: 250, g: 128, b: 114},
	oldlace: {r: 253, g: 245, b: 230},
	bisque: {r: 255, g: 228, b: 196},
	blanchedalmond: {r: 255, g: 235, b: 205},
	coral: {r: 255, g: 127, b: 80},
	cornsilk: {r: 255, g: 248, b: 220},
	darkorange: {r: 255, g: 140, b: 0},
	deeppink: {r: 255, g: 20, b: 147},
	floralwhite: {r: 255, g: 250, b: 240},
	fuchsia: {r: 255, g: 0, b: 255},
	gold: {r: 255, g: 215, b: 0},
	hotpink: {r: 255, g: 105, b: 180},
	ivory: {r: 255, g: 255, b: 240},
	lavenderblush: {r: 255, g: 240, b: 245},
	lemonchiffon: {r: 255, g: 250, b: 205},
	lightpink: {r: 255, g: 182, b: 193},
	lightsalmon: {r: 255, g: 160, b: 122},
	lightyellow: {r: 255, g: 255, b: 224},
	magenta: {r: 255, g: 0, b: 255},
	mistyrose: {r: 255, g: 228, b: 225},
	moccasin: {r: 255, g: 228, b: 181},
	navajowhite: {r: 255, g: 222, b: 173},
	orange: {r: 255, g: 165, b: 0},
	orangered: {r: 255, g: 69, b: 0},
	papayawhip: {r: 255, g: 239, b: 213},
	peachpuff: {r: 255, g: 218, b: 185},
	pink: {r: 255, g: 192, b: 203},
	red: {r: 255, g: 0, b: 0},
	seashell: {r: 255, g: 245, b: 238},
	snow: {r: 255, g: 250, b: 250},
	tomato: {r: 255, g: 99, b: 71},
	white: {r: 255, g: 255, b: 255},
	yellow: {r: 255, g: 255, b: 0},
	rebeccapurple: {r: 102, g: 51, b: 153}
};

module.exports = {
	rgbToName: rgbToName,
	nameToRgbObject: nameToRgbObject
};

// ac-color@1.1.0

},{}],59:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#decimalToHex
 * @function
 * @static
 *
 * @desc Converts a decimal value to a hex value.
 *
 * @param {Number} decimal
 *
 * @returns {String}
 */
module.exports = function decimalToHex (decimal) {
	return '#' + (decimal).toString(16);
};

// ac-color@1.1.0

},{}],60:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#hexToDecimal
 * @function
 * @static
 *
 * @desc Converts a hex value to a decimal value.
 *
 * @param {String} hex
 *
 * @returns {Number}
 */
module.exports = function hexToDecimal (hex) {
	return parseInt(hex.substr(1), 16);
};

// ac-color@1.1.0

},{}],61:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var shortToLongHex = require('./shortToLongHex');

/**
 * @name module:ac-color.Color#hexToRgb
 * @function
 * @static
 *
 * @desc Converts a hex value to a rgb value.
 *
 * @param {String} hex
 *
 * @returns {String}
 */
module.exports = function hexToRgb (hex) {
	hex = shortToLongHex(hex);
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? 'rgb(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) + ')' : null;
};

// ac-color@1.1.0

},{"./shortToLongHex":75}],62:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isRgb = require('./isRgb');
var isRgba = require('./isRgba');
var isHex = require('./isHex');

/**
 * @name module:ac-color.Color#isColor
 * @function
 * @static
 *
 * @desc Returns `true` when passed value is a hex, rgb or rgba string.
 *
 * @param {String} str
 *
 * @returns {Boolean}
 */
module.exports = function isColor (str) {
	return isHex(str) || isRgb(str) || isRgba(str);
};

// ac-color@1.1.0

},{"./isHex":63,"./isRgb":64,"./isRgba":65}],63:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#isHex
 * @function
 * @static
 *
 * @desc Returns `true` when passed value is a hex string.
 *
 * @param {String} str
 *
 * @returns {Boolean}
 */
module.exports = function isHex (str) {
	var regex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
	return regex.test(str);
};

// ac-color@1.1.0

},{}],64:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#isRgb
 * @function
 * @static
 *
 * @desc Returns `true` when passed value is a rgb string.
 *
 * @param {String} str
 *
 * @returns {Boolean}
 */
module.exports = function isRgb (str) {
	var regex = /^rgb\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*\)$/;
	return regex.exec(str) !== null;
};

// ac-color@1.1.0

},{}],65:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#isRgba
 * @function
 * @static
 *
 * @desc Returns `true` when passed value is a rgba string.
 *
 * @param {String} str
 *
 * @returns {Boolean}
 */
module.exports = function isRgba (str) {
	var regex = /^rgba\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/;
	return regex.exec(str) !== null;
};

// ac-color@1.1.0

},{}],66:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isHex = require('./isHex');
var hexToRgb = require('./hexToRgb');
var rgbToObject = require('./rgbToObject');

/**
 * @name module:ac-color.Color#hexToDecimal
 * @function
 * @static
 *
 * @desc Mixes two colors at a percentage.
 *
 * @param {String} from
 * @param {String} to
 * @param {Number} percent
 *
 * @returns {String}
 */
module.exports = function mixColors (from, to, percent) {
	// ensure rgb
	from = isHex(from) ? hexToRgb(from) : from;
	to = isHex(to) ? hexToRgb(to) : to;
	
	// convert to object
	from = rgbToObject(from);
	to = rgbToObject(to);
	
	// set rgb
	var r = from.r + ((to.r - from.r) * percent);
	var g = from.g + ((to.g - from.g) * percent);
	var b = from.b + ((to.b - from.b) * percent);

	return 'rgb(' + Math.round(r) + ', ' + Math.round(g) + ', ' + Math.round(b) + ')';
};

// ac-color@1.1.0

},{"./hexToRgb":61,"./isHex":63,"./rgbToObject":72}],67:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var rgbToObject = require('./rgbToObject');

/**
 * @name module:ac-color.Color#rgbToArray
 * @function
 * @static
 *
 * @desc Converts an rgb value to an `Array`.
 *
 * @param {String} rgb
 *
 * @returns {Array}
 */
module.exports = function rgbToArray (rgb) {
	var o = rgbToObject(rgb);
	return [o.r, o.g, o.b];
};

// ac-color@1.1.0

},{"./rgbToObject":72}],68:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var hexToDecimal = require('./hexToDecimal');
var rgbToArray = require('./rgbToArray');
var rgbToHex = require('./rgbToHex');

/**
 * @name module:ac-color.Color#rgbToDecimal
 * @function
 * @static
 *
 * @desc Converts an rgb value to a decimal value.
 *
 * @param {String} rgb
 *
 * @returns {Number}
 */
module.exports = function rgbToDecimal (rgb) {
	var hex = rgbToHex.apply(this, rgbToArray(rgb));
	return hexToDecimal(hex);
};

// ac-color@1.1.0

},{"./hexToDecimal":60,"./rgbToArray":67,"./rgbToHex":69}],69:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#hexToDecimal
 * @function
 * @static
 *
 * @desc Converts an rgb value to a hex value.
 *
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 *
 * @returns {String}
 */
module.exports = function rgbToHex (r, g, b) {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// ac-color@1.1.0

},{}],70:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#rgbToHsl
 * @function
 * @static
 *
 * @desc Converts an RGB color value to HSL. Conversion formula
 *       adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 *       Assumes r, g, and b are contained in the set [0, 255] and
 *       returns h, s, and l in the set [0, 1].
 *
 * @param   {Number}  r
 *          The red color value
 *          
 * @param   {Number}  g
 *          The green color value
 *          
 * @param   {Number}  b
 *          The blue color value
 *
 * @return  {Object} The HSL representation
 */
module.exports = function rgbToHsl (r, g, b) {
    if (arguments.length !== 3) {
        return false;
    }

    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var sum = max + min;
    var diff = max - min;
    
    var h;
    var s;
    var l = (sum / 2);

      if (max === min) {
          h = s = 0; // achromatic
      } else {

          s = l > 0.5 ? diff / (2 - max - min) : diff / sum;

          switch(max) {
              case r: h = (g - b) / diff ; break;
              case g: h = 2 + ( (b - r) / diff); break;
              case b: h = 4 + ( (r - g) / diff); break;
          }

        h *= 60;

        if (h < 0) {
            h +=360;
        }
    }

    return([h, Math.round(100*s), Math.round(100*l)]);
};

// ac-color@1.1.0

},{}],71:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#rgbToHsv
 * @function
 * @static
 * 
 * @desc Converts an RGB color value to HSV. Conversion formula
 *       adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * 
 *     This should match the same values that Photohop provides
 *     for HSB for a color
 * 
 *     Assumes r, g, and b are contained in the set [0, 255] and
 *     returns h, s, and v in the set [0, 1].
 *
 * @param   {Number}  r
 *          The red color value
 *          
 * @param   {Number}  g
 *          The green color value
 *          
 * @param   {Number}  b
 *          The blue color value
 * 
 * @return  {Array} The HSV representation
 */
module.exports = function rgbToHsv (r, g, b) {
    if (arguments.length !== 3) {
        return false;
    }

    var red   = r / 255;
    var green = g / 255;
    var blue  = b / 255;

    var max = Math.max(red, green, blue);
    var min = Math.min(red, green, blue);

    var h;
    var s;
    var v = max;

    var delta = max - min;

    s = max === 0 ? 0 : delta / max;

    if (max === min){
        h = 0; // achromatic
    } else {
        switch (max){
            case red:   h = (green - blue) / delta + (green < blue ? 6 : 0); break;
            case green: h = (blue - red) / delta + 2; break;
            case blue:  h = (red - green) / delta + 4; break;
        }

        h /= 6;
    }

    return [Math.round(360*h), Math.round(100*s), Math.round(100*v)];
};

// ac-color@1.1.0

},{}],72:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#rgbToObject
 * @function
 * @static
 *
 * @desc Converts an rgb value to an `Object` with properties `r`, `g` and `b`.
 *
 * @param {String} rgb
 *
 * @returns {Object}
 */
module.exports = function rgbToObject (rgb) {
	var regex = /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/;
	var match = regex.exec(rgb);
	return {
		r: Number(match[1]),
		g: Number(match[2]),
		b: Number(match[3])
	};
};

// ac-color@1.1.0

},{}],73:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var rgbaToObject = require('./rgbaToObject');

/**
 * @name module:ac-color.Color#rgbaToArray
 * @function
 * @static
 *
 * @desc Converts an rgba value to an `Array`.
 *
 * @param {String} rgba
 *
 * @returns {Array}
 */
module.exports = function rgbaToArray (rgba) {
	var o = rgbaToObject(rgba);
	return [o.r, o.g, o.b, o.a];
};

// ac-color@1.1.0

},{"./rgbaToObject":74}],74:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#rgbaToObject
 * @function
 * @static
 *
 * @desc Converts an rgba value to an `Object` with properties `r`, `g`, `b` and `a`.
 *
 * @param {String} rgba
 *
 * @returns {Object}
 */
module.exports = function rgbaToObject (rgba) {
	var regex = /rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0(\.\d+)?|1(\.0+)?)\s*\)/;
	var match = regex.exec(rgba);
	return {
		r: Number(match[1]),
		g: Number(match[2]),
		b: Number(match[3]),
		a: Number(match[4])
	};
};

// ac-color@1.1.0

},{}],75:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-color.Color#shortToLongHex
 * @function
 * @static
 *
 * @desc Converts a short hex value to a long hex value.
 *
 * @param {String} hex
 *
 * @returns {String}
 */
module.exports = function shortToLongHex (hex) {
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return '#' + r + r + g + g + b + b;
	});
	return hex;
};

// ac-color@1.1.0

},{}],76:[function(require,module,exports){
/** 
 * @module ac-easing
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	createBezier: require('./ac-easing/createBezier'),
	createPredefined: require('./ac-easing/createPredefined'),
	createStep: require('./ac-easing/createStep'),
	Ease: require('./ac-easing/Ease')
};

// ac-easing@1.1.1

},{"./ac-easing/Ease":77,"./ac-easing/createBezier":78,"./ac-easing/createPredefined":79,"./ac-easing/createStep":80}],77:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ERR_FUNCTION_REQUIRE = 'Ease expects an easing function.';

/**
 * @name module:ac-easing.Ease
 * @class
 *
 * @param {Function} func
 *        An easing function.
 *
 * @param {String} [cssString=null]
 *        The CSS equivelant of the easing function.
 *        e.g. ease-in would be 'cubic-bezier(0.42, 0.0, 1.00, 1.0)'
 */
function Ease(func, cssString) {
	if (typeof func !== 'function') {
		throw new TypeError(ERR_FUNCTION_REQUIRE);
	}

	/**
	 * @name module:ac-easing.Ease#easingFunction
	 * @type {Function}
	 *
	 * @desc The easing function.
	 */
	this.easingFunction = func;

	/**
	 * @name module:ac-easing.Ease#cssString
	 * @type {String}
	 * 
	 * @desc The CSS equivilant of the easing function.
	 */
	this.cssString = cssString || null;
}

var proto = Ease.prototype;

/**
 * @name module:ac-easing.Ease#getValue
 * @function
 *
 * @desc Returns the eased equivilant of the number passed.
 *
 * @param {Number} value
 *        A number between 0-1.
 *
 * @returns {Number} The eased equivilant of the number passed.
 */
proto.getValue = function (value) {
	return this.easingFunction(value, 0, 1, 1);
};

module.exports = Ease;

// ac-easing@1.1.1

},{}],78:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/prototype.every');

/** @ignore */
var Ease = require('./Ease');
var KeySpline = require('./helpers/KeySpline');

/** @ignore */
var ERR_BEZIER_VALUES = 'Bezier curve expects exactly four (4) numbers. Given: ';

/**
 * @name module:ac-easing.createBezier
 *
 * @function
 *
 * @desc Create an easing function from a set of bezier curve points.
 *
 * @param {Number} x1
 *        The x-coordinate of the first Bézier control point.
 *
 * @param {Number} y1
 *        The y-coordinate of the first Bézier control point.
 *
 * @param {Number} x2
 *        The x-coordinate of the second Bézier control point.
 *
 * @param {Number} y2
 *        The y-coordinate of the second Bézier control point.
 *
 * @returns {Ease} A new instance of an Ease object.
 */
module.exports = function createBezier (x1, y1, x2, y2) {
	var pts = Array.prototype.slice.call(arguments);
	var allNums = pts.every(function (pt) {
		return (typeof pt === 'number');
	});

	if (pts.length !== 4 || !allNums) {
		throw new TypeError(ERR_BEZIER_VALUES + pts);
	}

	var keySpline = new KeySpline(x1, y1, x2, y2);

	var easingFn = function(time, begin, change, duration) {
		return keySpline.get(time / duration) * change + begin;
	};

	var cssString = 'cubic-bezier(' + pts.join(', ') + ')';

	return new Ease(easingFn, cssString);
};

// ac-easing@1.1.1

},{"./Ease":77,"./helpers/KeySpline":81,"@marcom/ac-polyfills/Array/prototype.every":384}],79:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var createStep = require('./createStep');
var cssAliases = require('./helpers/cssAliases');
var easingFunctions = require('./helpers/easingFunctions');

/** @ignore */
var Ease = require('./Ease');

/** @ignore */
var ERR_PREDEFINED = 'Easing function "%TYPE%" not recognized among the following: ' + Object.keys(easingFunctions).join(', ');

/**
 * @name module:ac-easing.createPredefined
 *
 * @function
 * 
 * @desc Create an easing function from a set of predefined.
 *
 * @param {String} type
 *        The name of the ease, e.g. 'easeIn'.
 *
 * @returns {Ease} A new instance of an Ease object.
 */
module.exports = function createPredefined (type) {
	var easingFn;

	if (type === 'step-start') {
		return createStep(1, 'start');
	}
	else if (type === 'step-end') {
		return createStep(1, 'end');
	}
	else {
		easingFn = easingFunctions[type];
	}

	if (!easingFn) {
		throw new Error(ERR_PREDEFINED.replace('%TYPE%', type));
	}

	return new Ease(easingFn, cssAliases[type]);
};

// ac-easing@1.1.1

},{"./Ease":77,"./createStep":80,"./helpers/cssAliases":82,"./helpers/easingFunctions":83}],80:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Ease = require('./Ease');

/** @ignore */
var ERR_STEP_TYPE = 'Step function expects a numeric value greater than zero. Given: ';
var ERR_STEP_DIRECTION = 'Step function direction must be either "start" or "end" (default). Given: ';

/**
 * @name module:ac-easing.createStep
 *
 * @function
 * 
 * @desc Create a step easing function.
 *
 * @param {Number} steps
 *        Amount of steps.
 *
 * @param {String} [direction='end']
 *        Direction of ease.
 *
 * @returns {Ease} A new instance of an Ease object.
 */
module.exports = function createStep (steps, direction) {
	direction = direction || 'end';

	if (typeof steps !== 'number' || steps < 1) {
		throw new TypeError(ERR_STEP_TYPE + steps);
	}

	if (direction !== 'start' && direction !== 'end') {
		throw new TypeError(ERR_STEP_DIRECTION + direction);
	}

	var easingFn = function (time, begin, change, duration) {
		var length = change / steps;
		var step = Math[(direction === 'start') ? 'floor' : 'ceil'](time / duration * steps);
		return begin + length * step;
	};

	var cssString = 'steps(' + steps + ', ' + direction + ')';

	return new Ease(easingFn, cssString);
};

// ac-easing@1.1.1

},{"./Ease":77}],81:[function(require,module,exports){
/*! MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
* KeySpline - use bezier curve for transition easing function
* is inspired from Firefox's nsSMILKeySpline.cpp
* Usage:
* var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
* spline.get(x) => returns the easing value | x must be in [0, 1] range
*/

/* jshint newcap:false */


function KeySpline (mX1, mY1, mX2, mY2) {

  this.get = function(aX) {
    if (mX1 === mY1 && mX2 === mY2) { return aX; } // linear
    return CalcBezier(GetTForX(aX), mY1, mY2);
  };

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C(aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function CalcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function GetSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function GetTForX(aX) {
    // Newton raphson iteration
    var aGuessT = aX;
    for (var i = 0; i < 4; ++i) {
      var currentSlope = GetSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) { return aGuessT; }
      var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
}

module.exports = KeySpline;

// ac-easing@1.1.1

},{}],82:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

var aliases = {

	'linear': 'cubic-bezier(0, 0, 1, 1)',
	
	// ease
	'ease':        'cubic-bezier(0.25, 0.1, 0.25, 1)',
	'ease-in':     'cubic-bezier(0.42, 0, 1, 1)',
	'ease-out':    'cubic-bezier(0, 0, 0.58, 1)',
	'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
	
	// cubic
	'ease-in-cubic':     'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
	'ease-out-cubic':    'cubic-bezier(0.215, 0.61, 0.355, 1)',
	'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',

	// quad
	'ease-in-quad':     'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	'ease-out-quad':    'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
	
	// quart
	'ease-in-quart':     'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
	'ease-out-quart':    'cubic-bezier(0.165, 0.84, 0.44, 1)',
	'ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',

	// quint
	'ease-in-quint':     'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
	'ease-out-quint':    'cubic-bezier(0.23, 1, 0.32, 1)',
	'ease-in-out-quint': 'cubic-bezier(0.86, 0, 0.07, 1)',

	// sine
	'ease-in-sine':     'cubic-bezier(0.47, 0, 0.745, 0.715)',
	'ease-out-sine':    'cubic-bezier(0.39, 0.575, 0.565, 1)',
	'ease-in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',

	// expo
	'ease-in-expo':     'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
	'ease-out-expo':    'cubic-bezier(0.19, 1, 0.22, 1)',
	'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',

	// circ
	'ease-in-circ':     'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
	'ease-out-circ':    'cubic-bezier(0.075, 0.82, 0.165, 1)',
	'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

	// back
	'ease-in-back':     'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
	'ease-out-back':    'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
	'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
	
};

// ease
aliases['easeIn'] = aliases['ease-in'];
aliases['easeOut'] = aliases['ease-out'];
aliases['easeInOut'] = aliases['ease-in-out'];

// cubic
aliases['easeInCubic'] = aliases['ease-in-cubic'];
aliases['easeOutCubic'] = aliases['ease-out-cubic'];
aliases['easeInOutCubic'] = aliases['ease-in-out-cubic'];

// quad
aliases['easeInQuad'] = aliases['ease-in-quad'];
aliases['easeOutQuad'] = aliases['ease-out-quad'];
aliases['easeInOutQuad'] = aliases['ease-in-out-quad'];

// quart
aliases['easeInQuart'] = aliases['ease-in-quart'];
aliases['easeOutQuart'] = aliases['ease-out-quart'];
aliases['easeInOutQuart'] = aliases['ease-in-out-quart'];

// quint
aliases['easeInQuint'] = aliases['ease-in-quint'];
aliases['easeOutQuint'] = aliases['ease-out-quint'];
aliases['easeInOutQuint'] = aliases['ease-in-out-quint'];

// sine
aliases['easeInSine'] = aliases['ease-in-sine'];
aliases['easeOutSine'] = aliases['ease-out-sine'];
aliases['easeInOutSine'] = aliases['ease-in-out-sine'];

// expo
aliases['easeInExpo'] = aliases['ease-in-expo'];
aliases['easeOutExpo'] = aliases['ease-out-expo'];
aliases['easeInOutExpo'] = aliases['ease-in-out-expo'];

// circ
aliases['easeInCirc'] = aliases['ease-in-circ'];
aliases['easeOutCirc'] = aliases['ease-out-circ'];
aliases['easeInOutCirc'] = aliases['ease-in-out-circ'];

// back
aliases['easeInBack'] = aliases['ease-in-back'];
aliases['easeOutBack'] = aliases['ease-out-back'];
aliases['easeInOutBack'] = aliases['ease-in-out-back'];

module.exports = aliases;

// ac-easing@1.1.1

},{}],83:[function(require,module,exports){
'use strict';

/** @ignore */
var createBezier = require('../createBezier');

var ease = createBezier(0.25, 0.1, 0.25, 1.0).easingFunction;
var easeIn = createBezier(0.42, 0.0, 1.00, 1.0).easingFunction;
var easeOut = createBezier(0.00, 0.0, 0.58, 1.0).easingFunction;
var easeInOut = createBezier(0.42, 0.0, 0.58, 1.0).easingFunction;

var linear = function (time, begin, change, duration) {
	return change * time / duration + begin;
};

var easeInQuad = function (time, begin, change, duration) {
	return change * (time /= duration) * time + begin;
};

var easeOutQuad = function (time, begin, change, duration) {
	return -change * (time /= duration) * (time - 2) + begin;
};

var easeInOutQuad = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time + begin;
	}
	return -change / 2 * ((--time) * (time - 2) - 1) + begin;
};

var easeInCubic = function (time, begin, change, duration) {
	return change * (time /= duration) * time * time + begin;
};

var easeOutCubic = function (time, begin, change, duration) {
	return change * ((time = time / duration - 1) * time * time + 1) + begin;
};

var easeInOutCubic = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time * time + begin;
	}
	return change / 2 * ((time -= 2) * time * time + 2) + begin;
};

var easeInQuart = function (time, begin, change, duration) {
	return change * (time /= duration) * time * time * time + begin;
};

var easeOutQuart = function (time, begin, change, duration) {
	return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
};

var easeInOutQuart = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time * time * time + begin;
	}
	return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
};

var easeInQuint = function (time, begin, change, duration) {
	return change * (time /= duration) * time * time * time * time + begin;
};

var easeOutQuint = function (time, begin, change, duration) {
	return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
};

var easeInOutQuint = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return change / 2 * time * time * time * time * time + begin;
	}
	return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
};

var easeInSine = function (time, begin, change, duration) {
	return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
};

var easeOutSine = function (time, begin, change, duration) {
	return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
};

var easeInOutSine = function (time, begin, change, duration) {
	return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
};

var easeInExpo = function (time, begin, change, duration) {
	return (time === 0) ? begin : change * Math.pow(2, 10 * (time / duration - 1)) + begin;
};

var easeOutExpo = function (time, begin, change, duration) {
	return (time === duration) ? begin + change : change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
};

var easeInOutExpo = function (time, begin, change, duration) {
	if (time === 0) {
		return begin;
	}
	else if (time === duration) {
		return begin + change;
	}
	else if ((time /= duration / 2) < 1) {
		return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
	}
	return change / 2 * (-Math.pow(2, -10 * --time) + 2) + begin;
};

var easeInCirc = function (time, begin, change, duration) {
	return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + begin;
};

var easeOutCirc = function (time, begin, change, duration) {
	return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
};

var easeInOutCirc = function (time, begin, change, duration) {
	if ((time /= duration / 2) < 1) {
		return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
	}
	return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
};

var easeInElastic = function (time, begin, change, duration) {
	var shootover = 1.70158;
	var period = 0;
	var amplitude = change;
	if (time === 0) {
		return begin;
	}
	else if ((time /= duration) === 1) {
		return begin + change;
	}
	if (!period) {
		period = duration * 0.3;
	}
	if (amplitude < Math.abs(change)) {
		amplitude = change;
		shootover = period / 4;
	}
	else {
		shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
	}
	return -(amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
};

var easeOutElastic = function (time, begin, change, duration) {
	var shootover = 1.70158;
	var period = 0;
	var amplitude = change;
	if (time === 0) {
		return begin;
	}
	else if ((time /= duration) === 1) {
		return begin + change;
	}
	if (!period) {
		period = duration * 0.3;
	}
	if (amplitude < Math.abs(change)) {
		amplitude = change;
		shootover = period / 4;
	}
	else {
		shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
	}
	return amplitude * Math.pow(2, -10 * time) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) + change + begin;
};

var easeInOutElastic = function (time, begin, change, duration) {
	var shootover = 1.70158;
	var period = 0;
	var amplitude = change;
	if (time === 0) {
		return begin;
	}
	else if ((time /= duration / 2) === 2) {
		return begin + change;
	}
	if (!period) {
		period = duration * (0.3 * 1.5);
	}
	if (amplitude < Math.abs(change)) {
		amplitude = change;
		shootover = period / 4;
	}
	else {
		shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
	}
	if (time < 1) {
		return -0.5 * (amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
	}
	return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) * 0.5 + change + begin;
};


var easeInBack = function (time, begin, change, duration, shootover) {
	if (shootover === undefined) {
		shootover = 1.70158;
	}
	return change * (time /= duration) * time * ((shootover + 1) * time - shootover) + begin;
};

var easeOutBack = function (time, begin, change, duration, shootover) {
	if (shootover === undefined) {
		shootover = 1.70158;
	}
	return change * ((time = time / duration - 1) * time * ((shootover + 1) * time + shootover) + 1) + begin;
};

var easeInOutBack = function (time, begin, change, duration, shootover) {
	if (shootover === undefined) {
		shootover = 1.70158;
	}
	if ((time /= duration / 2) < 1) {
		return change / 2 * (time * time * (((shootover *= (1.525)) + 1) * time - shootover)) + begin;
	}
	return change / 2 * ((time -= 2) * time * (((shootover *= (1.525)) + 1) * time + shootover) + 2) + begin;
};

var easeOutBounce = function (time, begin, change, duration) {
	if ((time /= duration) < (1 / 2.75)) {
		return change * (7.5625 * time * time) + begin;
	}
	else if (time < (2 / 2.75)) {
		return change * (7.5625 * (time -= (1.5 / 2.75)) * time + 0.75) + begin;
	}
	else if (time < (2.5 / 2.75)) {
		return change * (7.5625 * (time -= (2.25 / 2.75)) * time + 0.9375) + begin;
	}
	return change * (7.5625 * (time -= (2.625 / 2.75)) * time + 0.984375) + begin;
};

var easeInBounce = function (time, begin, change, duration) {
	return change - easeOutBounce(duration - time, 0, change, duration) + begin;
};

var easeInOutBounce = function (time, begin, change, duration) {
	if (time < duration / 2) {
		return easeInBounce(time * 2, 0, change, duration) * 0.5 + begin;
	}
	return easeOutBounce(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
};

/**
 * @name module:ac-easing.easingFunctions
 * @function
 * @param {Float} time 
 *        Current position in time. Can be frames/seconds/milliseconds. ('t' in original Penner functions)
 * @param {Float} begin
 *        Start value. ('b' in original Penner functions)
 * @param {Float} change
 *        Change in value. ('c' in original Penner functions)
 * @param {Float} duration
 *        Duration. Can be frames/seconds/milliseconds. ('d' in original Penner functions)
 * @param {Float} [shootover=1.70158]
 *        Functions with 'Back' in their names take an additional optional parameter 'shootover', which
 *        controls the amount of overshoot. A higher value means greater overshoot. 'shootover' has a default
 *        value of 1.70158, which produces an overshoot of 10 percent. shootover==0 produces cubic easing with
 *        no overshoot. ('s' in original Penner functions)
 * @returns {Function}
 */
module.exports = {
	
	'linear': linear,

	// ease
	'ease':        ease,
	'easeIn':      easeIn,
	'ease-in':     easeIn,
	'easeOut':     easeOut,
	'ease-out':    easeOut,
	'easeInOut':   easeInOut,
	'ease-in-out': easeInOut,

	// cubic
	'easeInCubic':       easeInCubic,
	'ease-in-cubic':     easeInCubic,
	'easeOutCubic':      easeOutCubic,
	'ease-out-cubic':    easeOutCubic,
	'easeInOutCubic':    easeInOutCubic,
	'ease-in-out-cubic': easeInOutCubic,

	// quad
	'easeInQuad':       easeInQuad,
	'ease-in-quad':     easeInQuad,
	'easeOutQuad':      easeOutQuad,
	'ease-out-quad':    easeOutQuad,
	'easeInOutQuad':    easeInOutQuad,
	'ease-in-out-quad': easeInOutQuad,

	// quart
	'easeInQuart':       easeInQuart,
	'ease-in-quart':     easeInQuart,
	'easeOutQuart':      easeOutQuart,
	'ease-out-quart':    easeOutQuart,
	'easeInOutQuart':    easeInOutQuart,
	'ease-in-out-quart': easeInOutQuart,

	// quint
	'easeInQuint':       easeInQuint,
	'ease-in-quint':     easeInQuint,
	'easeOutQuint':      easeOutQuint,
	'ease-out-quint':    easeOutQuint,
	'easeInOutQuint':    easeInOutQuint,
	'ease-in-out-quint': easeInOutQuint,

	// sine
	'easeInSine':       easeInSine,
	'ease-in-sine':     easeInSine,
	'easeOutSine':      easeOutSine,
	'ease-out-sine':    easeOutSine,
	'easeInOutSine':    easeInOutSine,
	'ease-in-out-sine': easeInOutSine,

	// expo
	'easeInExpo':       easeInExpo,
	'ease-in-expo':     easeInExpo,
	'easeOutExpo':      easeOutExpo,
	'ease-out-expo':    easeOutExpo,
	'easeInOutExpo':    easeInOutExpo,
	'ease-in-out-expo': easeInOutExpo,

	// circ
	'easeInCirc':       easeInCirc,
	'ease-in-circ':     easeInCirc,
	'easeOutCirc':      easeOutCirc,
	'ease-out-circ':    easeOutCirc,
	'easeInOutCirc':    easeInOutCirc,
	'ease-in-out-circ': easeInOutCirc,

	// back
	'easeInBack':       easeInBack,
	'ease-in-back':     easeInBack,
	'easeOutBack':      easeOutBack,
	'ease-out-back':    easeOutBack,
	'easeInOutBack':    easeInOutBack,
	'ease-in-out-back': easeInOutBack,
	
	// elastic
	'easeInElastic':       easeInElastic,
	'ease-in-elastic':     easeInElastic,
	'easeOutElastic':      easeOutElastic,
	'ease-out-elastic':    easeOutElastic,
	'easeInOutElastic':    easeInOutElastic,
	'ease-in-out-elastic': easeInOutElastic,

	// bounce
	'easeInBounce':       easeInBounce,
	'ease-in-bounce':     easeInBounce,
	'easeOutBounce':      easeOutBounce,
	'ease-out-bounce':    easeOutBounce,
	'easeInOutBounce':    easeInOutBounce,
	'ease-in-out-bounce': easeInOutBounce
	
};

// ac-easing@1.1.1

},{"../createBezier":78}],84:[function(require,module,exports){
/** 
 * @module ac-event-emitter-micro
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	EventEmitterMicro: require('./ac-event-emitter-micro/EventEmitterMicro')
};

// ac-event-emitter-micro@1.1.0

},{"./ac-event-emitter-micro/EventEmitterMicro":85}],85:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';


/**
 * A performance focused minimal event emitter.
 * @constructor
 * @class
 */
function EventEmitterMicro() {
	this._events = {};
}
/** @lends EventEmitterMicro.prototype */
var proto = EventEmitterMicro.prototype;

/**
 * Adds an event listener, which will fire `callback` when `eventName` is triggered
 * @param {String} eventName
 * @param {Function} callback
 */
proto.on = function(eventName, callback) {
	this._events[eventName] = this._events[eventName] || [];
	this._events[eventName].unshift(callback);
};

/**
 * Same as `on` however event will be removed after first trigger
 * @param {String} eventName
 * @param {Function} callback
 */
proto.once = function(eventName, callback){
	var that = this;
	function fn(data){
		that.off(eventName, fn);

		if(data !== undefined) callback(data);
		else callback();
	}

	this.on(eventName, fn);
};

/**
 * Removes an event listener, listening for `eventName` with `callback
 * @param {String} eventName
 * @param {Function} callback
 */
proto.off = function(eventName, callback) {
	if (!this.has(eventName)) return;

	var index = this._events[eventName].indexOf(callback);
	if( index === -1 ) return;

	this._events[eventName].splice(index, 1);
};

/**
 * Dispatches an event with the name `eventName`, optionally passing in additional data
 * @param {String} eventName
 * @param {*=} data	Optional data that will be passed to the callback -
 */
proto.trigger = function(eventName, data) {
	if (!this.has(eventName)) return;

	for(var i = this._events[eventName].length -1; i >= 0 ; i--) {
		// Don't pass `undefined` to functions which don't expect a value
		if(data !== undefined) this._events[eventName][i](data);
		else this._events[eventName][i]();
	}
};

/**
 * Returns true if there are any listeners for `eventName`
 * @param {String} eventName
 */
proto.has = function(eventName) {
	if (eventName in this._events === false || this._events[eventName].length === 0) {
		return false;
	}

	return true;
};

/**
 * Clears this EventEmitterMicro instance for GC
 * It is no longer usable once this is called
 */
proto.destroy = function(){
	for(var eventName in this._events) {
		this._events[eventName] = null;
	}
	this._events = null;
};

/** @type {EventEmitterMicro} */
module.exports = EventEmitterMicro;

// ac-event-emitter-micro@1.1.0

},{}],86:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name defaultHashFunction
 *
 * @function
 * @private
 *
 * @desc Creates a cache key based on arguments
 *
 * @param {...*}
 *
 * @returns {String} Comma-separated string of arguments
 */
var defaultHashFunction = function () {
	var key = '';
	var i;

	for (i = 0; i < arguments.length; i++) {
		if (i > 0) {
			key += ',';
		}

		key += arguments[i];
	}

	return key;
};

/**
 * @name module:ac-function.memoize
 *
 * @function
 *
 * @desc Creates a function that memoizes the result of `func`
 *
 * @param {Function} func
 *        The function to be memoized
 *
 * @param {Function} [hashFunction]
 *        A function that returns a cache key based on arguments
 *        Creates a comma-separated string of arguments by default
 *
 * @returns {Function}
 */
module.exports = function memoize(func, hashFunction) {
	hashFunction = hashFunction || defaultHashFunction;

	var memoized = function () {
		var args = arguments;
		var key = hashFunction.apply(this, args);

		if (!(key in memoized.cache)) {
			memoized.cache[key] = func.apply(this, args);
		}

		return memoized.cache[key];
	};

	memoized.cache = {};

	return memoized;
};

// ac-function@1.2.0

},{}],87:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./shared/getStyleTestElement":89,"./shared/prefixHelper":90,"./shared/stylePropertyCache":91,"./utils/toCSS":93,"./utils/toDOM":94,"dup":17}],88:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"./getStyleProperty":87,"./shared/prefixHelper":90,"./shared/stylePropertyCache":91,"./shared/styleValueAvailable":92,"dup":18}],89:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],90:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],91:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],92:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"./getStyleTestElement":89,"./stylePropertyCache":91,"dup":22}],93:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],94:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],95:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyleValue = require('@marcom/ac-prefixer/getStyleValue');
var getStyleProperty = require('@marcom/ac-prefixer/getStyleProperty');
var memoize = require('@marcom/ac-function/memoize');

/**
 * @name module:ac-feature.cssPropertyAvailable
 *
 * @function
 *
 * @desc Returns the availability of a CSS property including vendor-prefixed flavors, along with an optional value.
 *
 * @param {String} property
 *        The CSS property to test.
 *        Can be in DOM (borderRadius) or CSS (border-radius) form.
 *
 * @param {String} [value]
 *        An optional value to test.
 *
 * @returns {Boolean} `true` if the browser supports the given CSS property/value, otherwise `false`.
 */
function cssPropertyAvailable(property, value) {
	if (typeof value !== 'undefined') {
		return !!getStyleValue(property, value);
	} else {
		return !!getStyleProperty(property);
	}
}

module.exports = memoize(cssPropertyAvailable);
module.exports.original = cssPropertyAvailable;

// ac-feature@2.5.0

},{"@marcom/ac-function/memoize":86,"@marcom/ac-prefixer/getStyleProperty":87,"@marcom/ac-prefixer/getStyleValue":88}],96:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/isArray');

/** @ignore */
var extend = require('./extend');
var hasOwnProp = Object.prototype.hasOwnProperty;
var deepClone = function (dest, source) {
	var prop;
	for (prop in source) {
		// Anything that does not prototype Object will not have this method
		if (hasOwnProp.call(source, prop)) {
			if (source[prop] === null) {
				dest[prop] = null;
			}
			else if (typeof source[prop] === 'object') {
				dest[prop] = Array.isArray(source[prop]) ? [] : {};
				deepClone(dest[prop], source[prop]);
			}
			else {
				dest[prop] = source[prop];
			}
		}
	}
	return dest;
};

/**
 * @name module:ac-object.clone
 *
 * @function
 *
 * @desc Create a new Object that has the same properties as the original.
 *
 * @param {Object} object
 *        The Object to make a clone of.
 *
 * @param {Boolean} [deep=false]
 *        If `true` the clone will be deep. Defaults to shallow.
 *
 * @returns {Object} The cloned object.
 */
module.exports = function clone (object, deep) {
	if (deep) {
		return deepClone({}, object);
	}
	return extend({}, object);
};

// ac-object@1.3.1

},{"./extend":98,"@marcom/ac-polyfills/Array/isArray":383}],97:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var F = function () {};

/**
 * @name module:ac-object.create
 *
 * @function
 *
 * @desc Create a new Object who’s prototype is the object passed
 *
 * @see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 *
 * @param {Object} proto
 *        The prototype for the new Object
 *
 * @returns {Object} The new Object
 */
module.exports = function create(proto) {
	// Don’t support second argument because it is not possible to accurately polyfill
	if (arguments.length > 1) {
		throw new Error('Second argument not supported');
	}

	// Prototype object is required
	if (proto === null || typeof proto !== 'object') {
		throw new TypeError('Object prototype may only be an Object.');
	}

	// If native Object.create exists, use it!
	if (typeof Object.create === 'function') {
		return Object.create(proto);

	// Otherwise create a new Object F with the prototype provided assigned to it
	} else {
		F.prototype = proto;
		return new F();
	}
};

// ac-object@1.3.1

},{}],98:[function(require,module,exports){
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

// ac-object@1.3.1

},{"@marcom/ac-polyfills/Array/prototype.forEach":386}],99:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */

'use strict';

module.exports = {
	PageVisibilityManager: require('./ac-page-visibility/PageVisibilityManager')
};
},{"./ac-page-visibility/PageVisibilityManager":100}],100:[function(require,module,exports){
'use strict';

/** @ignore */
var create = require('@marcom/ac-object/create'); 

/** @ignore */
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

/**
 * @name PageVisibilityManager
 * @class
 * @singleton
 */
function PageVisibilityManager() {

	if (typeof document.addEventListener === 'undefined') {
		// if browser doesn't support addEventListener then it also won't support document.hidden
		return;
	}
	
	var visibilityChange;

	if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
		this._hidden = 'hidden';
		visibilityChange = 'visibilitychange';
	}
	else if (typeof document.mozHidden !== 'undefined') {
		this._hidden = 'mozHidden';
		visibilityChange = 'mozvisibilitychange';
	}
	else if (typeof document.msHidden !== 'undefined') {
		this._hidden = 'msHidden';
		visibilityChange = 'msvisibilitychange';
	}
	else if (typeof document.webkitHidden !== 'undefined') {
		this._hidden = 'webkitHidden';
		visibilityChange = 'webkitvisibilitychange';
	}
	
	if (typeof document[this._hidden] === "undefined") {
		this.isHidden = false;
	}
	else {
		this.isHidden = document[this._hidden];
	}
	
	// if we have found a string we can use to listen for events, bind an event listener
	if ( visibilityChange ) {
		document.addEventListener(visibilityChange, this._handleVisibilityChange.bind(this), false);
	}

	// call super
	EventEmitterMicro.call(this);
}

var proto = PageVisibilityManager.prototype = create(EventEmitterMicro.prototype);

/** Events */
proto.CHANGED = 'changed';

/**
 * @name PageVisibilityManager#_handleVisibilityChange
 * @function
 * @private
 *
 * @param {Object} [evt=undefined]
 *
 * @fires PageVisibilityManager#changed
 */
/** @ignore */
proto._handleVisibilityChange = function (evt) {
	this.isHidden = document[this._hidden];

	/**
	 * Changed event.
	 * @event PageVisibilityManager#changed
	 */
	this.trigger(this.CHANGED, {
		isHidden: this.isHidden
	});
};

module.exports = new PageVisibilityManager();

},{"@marcom/ac-event-emitter-micro":84,"@marcom/ac-object/create":97}],101:[function(require,module,exports){
module.exports = clone;

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
    var out = new Float32Array(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],102:[function(require,module,exports){
module.exports = create;

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
    var out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],103:[function(require,module,exports){
module.exports = fromRotationTranslation;

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};
},{}],104:[function(require,module,exports){
module.exports = identity;

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],105:[function(require,module,exports){
module.exports = invert;

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};
},{}],106:[function(require,module,exports){
module.exports = multiply;

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};
},{}],107:[function(require,module,exports){
module.exports = rotate;

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < 0.000001) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};
},{}],108:[function(require,module,exports){
module.exports = rotateX;

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};
},{}],109:[function(require,module,exports){
module.exports = rotateY;

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};
},{}],110:[function(require,module,exports){
module.exports = rotateZ;

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};
},{}],111:[function(require,module,exports){
module.exports = scale;

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],112:[function(require,module,exports){
module.exports = translate;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};
},{}],113:[function(require,module,exports){
module.exports = transpose;

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};
},{}],114:[function(require,module,exports){
module.exports = create;

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
    var out = new Float32Array(3)
    out[0] = 0
    out[1] = 0
    out[2] = 0
    return out
}
},{}],115:[function(require,module,exports){
module.exports = cross;

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2]

    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out
}
},{}],116:[function(require,module,exports){
module.exports = dot;

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}
},{}],117:[function(require,module,exports){
module.exports = fromValues;

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
    var out = new Float32Array(3)
    out[0] = x
    out[1] = y
    out[2] = z
    return out
}
},{}],118:[function(require,module,exports){
module.exports = length;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    return Math.sqrt(x*x + y*y + z*z)
}
},{}],119:[function(require,module,exports){
module.exports = normalize;

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    var len = x*x + y*y + z*z
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len)
        out[0] = a[0] * len
        out[1] = a[1] * len
        out[2] = a[2] * len
    }
    return out
}
},{}],120:[function(require,module,exports){
module.exports = create

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create () {
  var out = new Float32Array(4)
  out[0] = 0
  out[1] = 0
  out[2] = 0
  out[3] = 0
  return out
}

},{}],121:[function(require,module,exports){
module.exports = fromValues

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues (x, y, z, w) {
  var out = new Float32Array(4)
  out[0] = x
  out[1] = y
  out[2] = z
  out[3] = w
  return out
}

},{}],122:[function(require,module,exports){
module.exports = transformMat4

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4 (out, a, m) {
  var x = a[0], y = a[1], z = a[2], w = a[3]
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w
  return out
}

},{}],123:[function(require,module,exports){
/**
 * @module ac-transform
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	Transform: require('./ac-transform/Transform')
};




// ac-transform@1.1.0

},{"./ac-transform/Transform":124}],124:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';
/* jshint -W116 */
/**
 * @type {mat4}
 * @ignore
 */
var mat4 = require("./gl-matrix/mat4");
/**
 * @type {vec3}
 * @ignore
 */
var vec3 = require("./gl-matrix/vec3");
/**
 * @type {vec4}
 * @ignore
 */
var vec4 = require("./gl-matrix/vec4");

var degToRad = Math.PI / 180;
var radToDeg = 180 / Math.PI;

// MATRIX SHORTHAND
// Because gl-matrix is a 16 length floating point array for performance,
// it is tricky to translate algorithms you see online because they always refer to A or m11 for affine/non-affine matrices respectively
// This makes it so we can more easily reason about the matrix
var m11 = 0,  mA = 0,     m12 = 1,  mB = 1,      m13 = 2,    m14 = 3;
var m21 = 4,  mC = 4,     m22 = 5,  mD = 5,      m23 = 6,    m24 = 7;
var m31 = 8,              m32 = 9,               m33 = 10,   m34 = 11;
var m41 = 12, mE = 12,    m42 = 13, mF = 13,     m43 = 14,   m44 = 15;

/**
 * @module ac-transform.Transform
 * @alias ac-transform:Transform
 * @constructor
 * @class
 *
 * @desc Javascript implementation of the w3 css3-transforms specification.
 * For performance, all functions modify the existing matrix instead of creating a new one.
 * Call Transform.Clone to clone the matrix, to run functions without modifying this matrix
 */
function Transform() {
	this.m = mat4.create();
}
var proto = Transform.prototype;

////////////////////////////////////////
////////////// ROTATION   //////////////
////////////////////////////////////////
/**
 * @module ac-transform.Transform#rotateX
 * @function
 *
 * @desc Applies a 3D rotation along the X axis by the angle specified.
 * Same as calling `same as rotate3d(1, 0, 0, angle)`
 *
 * @param {number} deg Rotation amount in degrees
 * @returns {Transform}
 */
proto.rotateX = function(deg) {
	var rad = degToRad * deg;
	mat4.rotateX( this.m, this.m, rad );

	return this;
};
/**
 * @module ac-transform.Transform#rotateY
 * @function
 *
 * @desc Applies a 3D rotation along the Y axis by the angle specified.
 * Same as calling `same as rotate3d(0, 1, 0, angle)`
 *
 * @param {number} deg Rotation amount in degrees
 *
 * @returns {Transform}
 */
proto.rotateY = function(deg) {
	var rad = degToRad * deg;
	mat4.rotateY( this.m, this.m, rad );

	return this;
};

/**
 * @module ac-transform.Transform#rotateZ
 * @function
 *
 * @desc Applies a 3D rotation along the Z axis by the angle specified.
 * Same as calling `same as rotate3d(0, 0, 1, angle)`
 *
 * @param {number} deg Rotation amount in degrees
 *
 * @returns {Transform}
 */
proto.rotateZ = function(deg) {
	var rad = degToRad * deg;
	mat4.rotateZ( this.m, this.m, rad );

	return this;
};
/**
 * @alias ac-transform.Transform.rotateZ
 */
proto.rotate = proto.rotateZ;

/**
 * @module ac-transform.Transform#rotate3d
 * @function
 *
 * @desc Applies a 3D rotation about the Vector(x,y,z) by the `deg` angle
 * For example, to rotate around the 180 degrees Y axis, you would call `Transform.rotate3d(0,1,0, 180)`
 *
 * @param {number} x	X axis for direction vector
 * @param {number} y	Y axis for direction vector
 * @param {number} z	Z axis for direction vector
 * @param {number} deg	Rotation amount in degrees
 *
 * @returns {Transform}
 */
proto.rotate3d = function( x, y, z, deg) {
	if (y === null || y === undefined ) y = x;
	if (z === null || y === undefined ) z = x;
	var rad = degToRad * deg;
	mat4.rotate( this.m, this.m, rad, [x,y,z] );

	return this;
};
/**
 * @alias ac-transform.Transform.rotate3d
 */
proto.rotateAxisAngle = proto.rotate3d;

////////////////////////////////////////
///////////////  SCALE   ///////////////
////////////////////////////////////////
/**
 * @module ac-transform.Transform#scale
 * @function
 *
 * @desc Applies a 2D scale operation using the [sx,sy] scaling vector
 *
 * @param {number} sx	Scaling vector along the x-axis
 * @param {number} sy	Scaling vector along the y-axis
 *
 * @returns {Transform}
 */
proto.scale = function( sx, sy ) {
	sy = sy || sx;
	mat4.scale(this.m, this.m, [sx,sy,1]);

	return this;
};
/**
 * @module ac-transform.Transform#scaleX
 * @function
 *
 * @desc Applies a 2D scale operation using the [sx,1] scaling vector, where sx is given as the parameter.
 * @param {number} sx	Scaling vector along the x-axis
 *
 * @returns {Transform}
 */
proto.scaleX = function( sx ) {
	mat4.scale(this.m, this.m, [sx,1,1]);

	return this;
};
/**
 * @module ac-transform.Transform#scaleY
 * @function
 *
 * @desc Applies a 2D scale operation using the [1,sy] scaling vector, where sy is given as the parameter.
 * @param {number} sy	Scaling vector along the y-axis
 *
 * @returns {Transform}
 */
proto.scaleY = function( sy ) {
	mat4.scale(this.m, this.m, [1,sy,1]);

	return this;
};
/**
 * @module ac-transform.Transform#scaleZ
 * @function
 *
 * @desc Applies a 3D scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.
 * @param sz
 *
 * @returns {Transform}
 */
proto.scaleZ = function( sz ) {
	mat4.scale(this.m, this.m, [1,1,sz]);

	return this;
};
/**
 * @module ac-transform.Transform#scale3d
 * @function
 *
 * @desc Applies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.
 * @param {number} sx	Scaling vector along the x-axis
 * @param {number} sy	Scaling vector along the y-axis
 * @param {number} sz	Scaling vector along the y-axis
 *
 * @returns {Transform}
 */
proto.scale3d = function( sx, sy, sz ) {
	mat4.scale(this.m, this.m, [sx,sy,sz]);

	return this;
};


////////////////////////////////////////
///////////////  SKEW   ////////////////
////////////////////////////////////////
/**
 * @module ac-transform.Transform#skew
 * @function
 *
 * @desc Applies a 2D skew by [ax,ay] for X and Y.
 * If the second parameter is not provided, it has a zero value.
 * @param {number} ax	Skew vector along the X axis
 * @param {number} ay	Skew vector along the X axis
 *
 * @returns {Transform}
 */
proto.skew = function( ax, ay ) {
	if( ay === null || ay === undefined ) {
		return this.skewX(ax);
	}

	ax = degToRad * ax;
	ay = degToRad * ay;

	// X
	var transform = mat4.create();
	transform[mC] = Math.tan(ax);
	transform[mB] = Math.tan(ay);

	mat4.multiply(this.m, this.m, transform);

	return this;
};

/**
 * @module ac-transform.Transform#skewX
 * @function
 *
 * @desc Applies a 2D skew transformation along the X axis by the given angle.
 * @param {number} ax	Skew vector along the X axis
 *
 * @returns {Transform}
 */
proto.skewX = function( ax ) {
	ax = degToRad * ax;

	var transform = mat4.create();
	transform[mC] = Math.tan(ax);

	mat4.multiply(this.m, this.m, transform);

	return this;
};

/**
 * @module ac-transform.Transform#skewY
 * @function
 *
 * @desc Applies a 2D skew transformation along the Y axis by the given angle.
 * @param {number} ay	Skew vector along the Y axis
 *
 * @returns {Transform}
 */
proto.skewY = function( ay ) {
	ay = degToRad * ay;

	var transform = mat4.create();
	transform[mB] = Math.tan(ay);

	mat4.multiply(this.m, this.m, transform);

	return this;
};


////////////////////////////////////////
/////////////  TRANSLATE   /////////////
////////////////////////////////////////
/**
 * @module ac-transform.Transform#translate
 * @function
 *
 * @desc Applies a 2D translation by the vector [tx, ty], where tx represents the X axis, and ty is an optional value representing the Y axis.
 * If <ty> is not provided, ty has zero as a value.
 *
 * @param {number} tx	Translation along the X axis
 * @param {number} [ty]	Optional, translation along the Y axis
 *
 * @returns {Transform}
 */
proto.translate = function(tx, ty) {
	ty = ty || 0;
	mat4.translate( this.m, this.m, [tx, ty, 0] );

	return this;
};

/**
 * @module ac-transform.Transform#translate3d
 * @function
 *
 * @desc Applies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.
 * @param {number} tx	Translation along the X axis
 * @param {number} ty	Translation along the X axis
 * @param {number} tz	Translation along the X axis
 *
 * @returns {Transform}
 */
proto.translate3d = function(tx, ty, tz) {
	mat4.translate( this.m, this.m, [tx, ty, tz] );

	return this;
};

/**
 * @module ac-transform.Transform#translateX
 * @function
 *
 * @desc Applies a 2D translation alon the X axis
 * Same as calling translate3d(tx,0,0);

 * @param {number} tx	Translation along the X axis
 * @returns {Transform}
 */
proto.translateX = function(tx) {
	mat4.translate( this.m, this.m, [tx, 0, 0] );

	return this;
};

/**
 * @module ac-transform.Transform#translateY
 * @function
 *
 * @desc Applies a 2D translation along the Y axis
 * Same as calling translate3d(0,ty,0);

 * @param {number} ty	Translation along the Y axis
 * @returns {Transform}
 */
proto.translateY = function(ty) {
	mat4.translate( this.m, this.m, [0, ty, 0] );

	return this;
};

/**
 * @module ac-transform.Transform#translateZ
 * @function
 *
 * @desc Applies a 3D translation along the Z axis
 * Same as calling translate3d(0,0, tz);
 *
 * @param tz	Translation along the Z axis
 * @returns {Transform}
 */
proto.translateZ = function(tz) {
	mat4.translate( this.m, this.m, [0, 0, tz] );

	return this;
};

////////////////////////////////////////
///////////////   MISC   ///////////////
////////////////////////////////////////
/**
 * @module ac-transform.Transform#perspective
 * @function
 *
 * @desc Applies a perspective projection matrix.
 * The perspective() function represents the distance of the z-plane (z = 0) from the viewer.
 *
 * @param {number} depth Distance of the z-plane in pixels
 * @returns {Transform}
 */
proto.perspective = function( depth ) {
	var t = mat4.create();
	if( depth !== 0 ) {
		t[m34] = -1.0 / depth;
	}

	mat4.multiply( this.m, this.m, t);
};

/**
 * @module ac-transform.Transform#inverse
 * @function
 *
 * @desc Returns a new Transform, which is the inverse of this instance
 * @returns {Transform} A new Transform, in which the matrix has been inverted
 */
proto.inverse = function(){
	var t = this.clone();
	t.m = mat4.invert(t.m, this.m);

	return t;
};

/**
 * @module ac-transform.Transform#inverse
 * @function
 *
 * @desc	Resets this Transform
 * @returns {Transform}
 */
proto.reset = function(){
	mat4.identity(this.m);
	return this;
};

/**
 * Returns an array [x,y] representing the current translation along the respective axis
 * @returns {Array.<number>}
 */
proto.getTranslateXY = function(){
	var m = this.m;
	if ( this.isAffine() ) {
		return [m[mE], m[mF]];
	}
	return [m[m41], m[m42]];
};

/**
 * Returns an array [x,y,z] representing the current translation along the respective axis
 * @returns {Array.<number>}
 */
proto.getTranslateXYZ = function(){
	var m = this.m;
	if ( this.isAffine() ) {
		return [m[mE], m[mF], 0];
	}
	return [m[m41], m[m42], m[m43]];
};

/**
 * Returns the current translation value along the X axis
 * @returns {number}
 */
proto.getTranslateX = function(){
	var m = this.m;
	if ( this.isAffine() ) {
		return m[mE];
	}
	return m[m41];
};

/**
 * Returns the current translation value along the Y axis
 * @returns {number}
 */
proto.getTranslateY = function(){
	var m = this.m;
	if ( this.isAffine() ) {
		return m[mF];
	}
	return m[m42];
};

/**
 * Returns the current translation value along the Z axis
 * @returns {number}
 */
proto.getTranslateZ = function(){
	var m = this.m;
	if ( this.isAffine() ) {
		return 0;
	}
	return m[m43];
};



/**
 * @module ac-transform.Transform#clone
 * @function
 *
 * @desc Clones this Transform
 * @returns {Transform}
 */
proto.clone = function(){
	var t = new Transform();
	t.m = mat4.clone( this.m );

	return t;
};

/**
 * @module ac-transform.Transform#toArray
 * @function
 *
 * @desc Returns an object containing all the values in our matrix
 * Used for animation in conjunction with fromObject
 *
 * @returns {Array}
 */
proto.toArray = function(){
	var m = this.m;
	if ( this.isAffine() ) {
		return [m[mA], m[mB], m[mC], m[mD], m[mE], m[mF]];
	}
	return [m[m11], m[m12], m[m13], m[m14], m[m21], m[m22], m[m23], m[m24],
			m[m31], m[m32], m[m33], m[m34], m[m41], m[m42], m[m43], m[m44]];
};

/**
 * @module ac-transform.Transform#fromArray
 * @function
 *
 * @desc Replaces the contents of our matrix, with the contents of this array
 * Used for animation in conjunction with toArray
 * NOTE: Assumes the array has a length of 16
 *
 * @param {Array} arr
 * @returns {Transform}
 */
proto.fromArray = function( arr ){
	this.m = Array.prototype.slice.call(arr);

	return this;
};


/**
 * @module ac-transform.Transform#setMatrixValue
 * @function
 *
 * @desc Sets the matrix via a CSS Transform string. e.g. `element.getComputedStyle().transform`
 *
 * @example
 * var t = new Transform();
 * t.setMatrixValue( window.getComputedStyle(element).transform);
 *
 * @param {String} string	String returned from getComputedStyle().transform
 * @returns {Transform}
 */
proto.setMatrixValue = function(string){
	string = String(string).trim();
	var m = mat4.create();
	if (string === 'none') {
		this.m = m;
		return this;
	}

	var type = string.slice(0, string.indexOf('(')), parts, i;
	if (type === 'matrix3d'){
		parts = string.slice(9, -1).split(',');
		for (i = 0; i < parts.length; i++) {
			m[i] = parseFloat(parts[i]);
		}
	} else if (type === 'matrix'){
		// From: https://github.com/arian/CSSMatrix/blob/master/CSSMatrix.js#L149
		// From: https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js#L928
		parts = string.slice(7, -1).split(',');
		for (i = parts.length; i--;) parts[i] = parseFloat(parts[i]);

		m[m11] = parts[0];	// m11 / A
		m[m12] = parts[1];	// m12 / B
		m[m41] = parts[4];	// m41 / C
		m[m21] = parts[2];	// m21 / D
		m[m22] = parts[3];	// m22 / E / TX
		m[m42] = parts[5];	// m42 / F / TY
	} else {
		throw new TypeError('Invalid Matrix Value');
	}

	this.m = m;

	return this;
};

/**
 * Helper method used by #decompose
 * Returns true if a number is fuzzy equal to 0
 * @param {number} val
 * @returns {boolean}
 */
var isZero = function( val ) {
	return Math.abs(val) < 1e-4;
};


/**
 * @module ac-transform.Transform#decompose
 * @function
 *
 * @desc Decomposes a 4x4 matrix returning independent Translation/Scale/Skew/Perspective/Quaternion properties.
 * If `convertToDegrees` is true, rotation and skew properties are converted from radians to degrees
 *
 * @see Algorithm converted from W3C css-transform pseudo algorithm
 * @link http://www.w3.org/TR/css3-transforms/#interpolation-of-3d-matrices
 *
 * @param {Boolean=} convertToDegrees If true, angle values will be converted from radians to degrees
 * @returns {{translation: vec3, scale: vec3, skew: vec3, perspective: vec4, quaternion: vec4, eulerRotation: vec3, axisAngle: vec3}}
 */
proto.decompose = function( convertToDegrees ){
	convertToDegrees = convertToDegrees || false;

	var matrix = mat4.clone(this.m);
	var translation = vec3.create();
	var scale = vec3.create();
	var skew = vec3.create();
	var perspective = vec4.create();
	var quaternion = vec4.create();
	var eulerRotation = vec3.create();

	// Normalize, or return null if not possible
	//if(matrix[m44] === 0 ) return null;

	for (var i=0; i<16; i++)
		matrix[i] /= matrix[m44];

	// perspectiveMatrix is used to solve for perspective, but it also provides
	// an easy way to test for singularity of the upper 3x3 component.
	var perspectiveMatrix = mat4.clone(matrix);
	perspectiveMatrix[m14] = 0;
	perspectiveMatrix[m24] = 0;
	perspectiveMatrix[m34] = 0;
	perspectiveMatrix[m44] = 1;

	//if (Math.abs(mat4.determinant(perspectiveMatrix)) < 1e-8)
	//	return false;

	var a03 = matrix[3], a13 = matrix[7], a23 = matrix[11],
		a30 = matrix[12], a31 = matrix[13], a32 = matrix[14], a33 = matrix[15];

	var rightHandSide = vec4.create();
	if ( !isZero(matrix[m14]) || !isZero(matrix[m24]) || !isZero(matrix[m34]) ) {
		// rightHandSide is the right hand side of the equation.
		rightHandSide[0] = matrix[m14];
		rightHandSide[1] = matrix[m24];
		rightHandSide[2] = matrix[m34];
		rightHandSide[3] = matrix[m44];

		// Solve the equation by inverting perspectiveMatrix and multiplying
		// rightHandSide by the inverse.
		var inversePerspectiveMatrix = mat4.invert(mat4.create(), perspectiveMatrix);
		var transposedInversePerspectiveMatrix = mat4.transpose(mat4.create(), inversePerspectiveMatrix);
		perspective = vec4.transformMat4(perspective, rightHandSide, transposedInversePerspectiveMatrix);
	} else {
		perspective = vec4.fromValues(0,0,0,1);
	}

	// TRANSLATION
	translation[0] = a30;
	translation[1] = a31;
	translation[2] = a32;

	// Now get scale and shear. 'row' is a 3 element array of 3 component vectors
	var row = [vec3.create(), vec3.create(), vec3.create()];
	row[0][0] = matrix[0];
	row[0][1] = matrix[1];
	row[0][2] = matrix[2];

	row[1][0] = matrix[4];
	row[1][1] = matrix[5];
	row[1][2] = matrix[6];

	row[2][0] = matrix[8];
	row[2][1] = matrix[9];
	row[2][2] = matrix[10];

	// Compute X scale factor and normalize first row.
	scale[0] = vec3.length(row[0]);
	vec3.normalize(row[0], row[0]);

	// Compute XY shear factor and make 2nd row orthogonal to 1st.
	skew[0] = vec3.dot(row[0], row[1]);
	row[1] = this._combine(row[1], row[0], 1.0, -skew[0]);

	// Now, compute Y scale and normalize 2nd row.
	scale[1] = vec3.length(row[1]);
	vec3.normalize(row[1], row[1]);
	skew[0] /= scale[1];

	// Compute XZ and YZ shears, orthogonalize 3rd row
	skew[1] = vec3.dot(row[0], row[2]);
	row[2] = this._combine(row[2], row[0], 1.0, -skew[1]);
	skew[2] = vec3.dot(row[1], row[2]);
	row[2] = this._combine(row[2], row[1], 1.0, -skew[2]);

	// Next, get Z scale and normalize 3rd row.
	scale[2] = vec3.length(row[2]);
	vec3.normalize(row[2], row[2]);
	skew[1] /= scale[2];
	skew[2] /= scale[2];

	// At this point, the matrix (in rows) is orthonormal.
	// Check for a coordinate system flip.  If the determinant
	// is -1, then negate the matrix and the scaling factors.
	var pdum3 = vec3.cross(vec3.create(), row[1], row[2]);
	if (vec3.dot(row[0], pdum3) < 0) {
		for (i = 0; i < 3; i++) {
			scale[i] *= -1;
			row[i][0] *= -1;
			row[i][1] *= -1;
			row[i][2] *= -1;
		}
	}

	// Now, get the rotations out
	quaternion[0] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0));
	quaternion[1] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0));
	quaternion[2] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0));
	quaternion[3] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0));

	if (row[2][1] > row[1][2])
		quaternion[0] = -quaternion[0];
	if (row[0][2] > row[2][0])
		quaternion[1] = -quaternion[1];
	if (row[1][0] > row[0][1])
		quaternion[2] = -quaternion[2];

	var axisAngle = vec4.fromValues( quaternion[0],quaternion[1],quaternion[2], 2 * Math.acos(quaternion[3]) );

	/** @type {vec3} **/
	var rotation = this._rotationFromQuat(quaternion);

	if( convertToDegrees ) {
		skew[0] = Math.round(skew[0] * radToDeg * 100)/100;
		skew[1] = Math.round(skew[1] * radToDeg * 100)/100;
		skew[2] = Math.round(skew[2] * radToDeg * 100)/100;

		rotation[0] = Math.round(rotation[0] * radToDeg * 100)/100;
		rotation[1] = Math.round(rotation[1] * radToDeg * 100)/100;
		rotation[2] = Math.round(rotation[2] * radToDeg * 100)/100;

		axisAngle[3] = Math.round(axisAngle[3] * radToDeg * 100)/100;
	}

	return {
		translation: translation,
		scale: scale,
		skew: skew,
		perspective: perspective,
		quaternion: quaternion,
		eulerRotation: rotation,
		axisAngle: axisAngle
	};
};

/**
 * Set this transform from recomposed values, if any are not supplied identity versions are supplied
 * @param {vec3|Array.<Number>} translation
 * @param {vec3|Array.<Number>} scale
 * @param {vec3|Array.<Number>} skew
 * @param {vec4|Array.<Number>} perspective
 * @param {vec4|Array.<Number>} quaternion
 *
 * @returns {Transform}
 */
proto.recompose = function(translation, scale, skew, perspective, quaternion) {
	translation = translation || vec3.create();
	scale = scale || vec3.create();
	skew = skew || vec3.create();
	perspective = perspective || vec4.create();
	quaternion = quaternion || vec4.create();

	var matrix = mat4.fromRotationTranslation(mat4.create(), quaternion, translation);

	//apply perspective
	matrix[m14] = perspective[0];
	matrix[m24] = perspective[1];
	matrix[m34] = perspective[2];
	matrix[m44] = perspective[3];

	// apply skew
	// temp is a identity 4x4 matrix initially
	var temp = mat4.create();

	if (skew[2] !== 0) {
		temp[m32] = skew[2];
		mat4.multiply(matrix, matrix, temp);
	}
	if (skew[1] !== 0) {
		temp[m32] = 0;
		temp[m31] = skew[1];
		mat4.multiply(matrix, matrix, temp);
	}

	if (skew[0]) {
		temp[m31] = 0;
		temp[4] = skew[0];
		mat4.multiply(matrix, matrix, temp);
	}

	// apply scale
	mat4.scale(matrix, matrix, scale);
	this.m = matrix;

	return this;
};

/**
 *
 * @module ac-transform.Transform#isAffine
 * @function
 * @desc Returns true if this is an affine transformation
 * @returns {Boolean}
 */
proto.isAffine = function() {
	return (this.m[m13] === 0 && this.m[m14] === 0 && this.m[m23] === 0 && this.m[m24] === 0 &&
	this.m[m31] === 0 && this.m[m32] === 0 && this.m[m33] === 1 && this.m[m34] === 0 && this.m[m43] === 0 && this.m[m44] === 1);
};

/**
 * @module ac-transform.Transform#toString
 * @function
 *
 * @desc Returns a string representation of the matrix, which can be used to apply the matrix to an element
 *
 * @example
 * element.style.transform = transform.toString();
 *
 * @return {string}
 */
proto.toString = function () {
	var m = this.m;
	if ( this.isAffine() ) {
		return 'matrix(' +	m[mA] + ', ' + m[mB] + ', ' +
			m[mC] + ', ' + m[mD] + ', ' +
			m[mE] + ', ' + m[mF] + ')';
	}
	return 'matrix3d('+ m[m11] + ', ' + m[m12] + ', ' + m[m13] + ', ' + m[m14] + ', ' +
		m[m21] + ', ' + m[m22] + ', ' + m[m23] + ', ' + m[m24] + ', ' +
		m[m31] + ', ' + m[m32] + ', ' + m[m33] + ', ' + m[m34] + ', ' +
		m[m41] + ', ' + m[m42] + ', ' + m[m43] + ', ' + m[m44] + ')';
};

/**
 * @alias ac-transform.Transform.toString
 */
proto.toCSSString = proto.toString;


/**
 * @module ac-transform.Transform#_combine
 * @function
 * @private
 *
 * @desc Helper function required for Transform.decompose
 * Creates a new vector, by interpolating A and B using the ratios supplied ascl/bscl respectively
 *
 * http://www.w3.org/TR/css3-transforms/#supporting-functions
 *
 * @param {vec3} A
 * 			Left side vec3
 * @param {vec3} B
 * 			Right side vec3
 * @param {number} ascl
 * 			Scale of vector A
 * @param bscl
 * 			Scale of vector B
 * @returns {vec3}	A new vec3 after combining A and B with the supplied ratios
 * @private
 */
proto._combine = function( A, B, ascl, bscl) {
	var result = vec3.create();
	result[0] = (ascl * A[0]) + (bscl * B[0]);
	result[1] = (ascl * A[1]) + (bscl * B[1]);
	result[2] = (ascl * A[2]) + (bscl * B[2]);

	return result;
};


/**
 * @name ac-transform.Transform#_matrix2dToMat4
 * @function
 * @private
 *
 * @desc Creates a 2d Array representation of the matrix, from a `mat4`
 * @returns {mat4}
 */
proto._matrix2dToMat4 = function( matrix ){
	var out = mat4.create();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			out[i * 4 + j] = matrix[i][j];
		}
	}

	return out;
};

/**
 * @name ac-transform.Transform#_mat4ToMatrix2d
 * @function
 * @private
 *
 * @desc Creates a `mat4` from a 2d array of numbers
 * @returns {Array.<Array.<number>>}
 */
proto._mat4ToMatrix2d = function( ref ) {
	var matrix = [];
	for (var i = 0; i < 4; i++) {
		matrix[i] = [];
		for (var j = 0; j < 4; j++) {
			matrix[i][j] = ref[i * 4 + j];
		}
	}

	return matrix;
};


// FROM: http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
/**
 * Extracts the rotation in eulerAngles, somewhat experimental because at the poles the numbers are thrown off
 *
 * @param {quat} q
 * @returns {vec3}
 * @private
 */
proto._rotationFromQuat = function(q) {
	var sqw = q[3] * q[3];
	var sqx = q[0] * q[0];
	var sqy = q[1] * q[1];
	var sqz = q[2] * q[2];
	var unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
	var test = q[0] * q[1] + q[2] * q[3];

	var x, y, z;
	if (test > 0.499 * unit) { // singularity at north pole
		y = 2 * Math.atan2(q[0], q[3]);
		z = Math.PI / 2;
		x = 0;
		return vec3.fromValues(x,y,z);
	}
	if (test < -0.499 * unit) { // singularity at south pole
		y = -2 * Math.atan2(q[0], q[3]);
		z = -Math.PI / 2;
		x = 0;
		return vec3.fromValues(x,y,z);
	}
	y = Math.atan2(2 * q[1] * q[3] - 2 * q[0] * q[2], sqx - sqy - sqz + sqw);
	z = Math.asin(2 * test / unit);
	x = Math.atan2(2 * q[0] * q[3] - 2 * q[1] * q[2], -sqx + sqy - sqz + sqw);

	return vec3.fromValues(x,y,z);
};

//// Create shorthand matrix accessor getter/setters - for example Transform.m11
//var accessors = {
//	m11: 0, mA: 0, m12: 1, mB: 1, m13: 2, m14: 3,
//	m21: 4, mC: 4, m22: 5, mD: 5, m23: 6, m24: 7,
//	m31: 8, m32: 9, m33: 10, m34: 11,
//	m41: 12, mE: 12, m42: 13, mF: 13, m43: 14, m44: 15
//};
//for (var key in accessors) {
//	if (!accessors.hasOwnProperty(key)) continue;
//
//	(function (myKey) {
//		Object.defineProperty(proto, key, {
//			set: function (val) {
//				this.m[myKey] = val;
//			},
//			get: function () {
//				return this.m[myKey];
//			},
//			enumerable: true,
//			configurable: true
//		});
//	})(accessors[key]);
//}


module.exports = Transform;

// ac-transform@1.1.0

},{"./gl-matrix/mat4":125,"./gl-matrix/vec3":126,"./gl-matrix/vec4":127}],125:[function(require,module,exports){
/**
 * Slim version of mat4, with only the API needed by ac-transform
 * @type {mat4}
 */
var mat4 = {
	/** @type {mat4}*/
	create                 : require('gl-mat4/create'),
	/** @type {mat4}*/
	rotate                 : require('gl-mat4/rotate'),
	/** @type {mat4}*/
	rotateX                : require('gl-mat4/rotateX'),
	/** @type {mat4}*/
	rotateY                : require('gl-mat4/rotateY'),
	/** @type {mat4}*/
	rotateZ                : require('gl-mat4/rotateZ'),
	/** @type {mat4}*/
	scale                  : require('gl-mat4/scale'),
	/** @type {mat4}*/
	multiply               : require('gl-mat4/multiply'),
	/** @type {mat4}*/
	translate              : require('gl-mat4/translate'),
	/** @type {mat4}*/
	invert                 : require('gl-mat4/invert'),
	/** @type {mat4}*/
	clone                  : require('gl-mat4/clone'),
	/** @type {mat4}*/
	transpose              : require('gl-mat4/transpose'),
	/** @type {mat4}*/
	identity               : require('gl-mat4/identity'),
	/** @type {mat4}*/
	fromRotationTranslation: require('gl-mat4/fromRotationTranslation')
};

/** @type {mat4} */
module.exports = mat4;

// ac-transform@1.1.0

},{"gl-mat4/clone":101,"gl-mat4/create":102,"gl-mat4/fromRotationTranslation":103,"gl-mat4/identity":104,"gl-mat4/invert":105,"gl-mat4/multiply":106,"gl-mat4/rotate":107,"gl-mat4/rotateX":108,"gl-mat4/rotateY":109,"gl-mat4/rotateZ":110,"gl-mat4/scale":111,"gl-mat4/translate":112,"gl-mat4/transpose":113}],126:[function(require,module,exports){
/**
 * Slim version of vec3, with only the API needed by ac-transform
 * @type {vec3}
 */
var vec3 = {
	/** @type {vec3}*/
	create    : require("gl-vec3/create"),
	/** @type {vec3}*/
	dot       : require("gl-vec3/dot"),
	/** @type {vec3}*/
	normalize : require("gl-vec3/normalize"),
	/** @type {vec3}*/
	length    : require("gl-vec3/length"),
	/** @type {vec3}*/
	cross     : require("gl-vec3/cross"),
	/** @type {vec3}*/
	fromValues: require("gl-vec3/fromValues")
};

/** @type {vec3} */
module.exports = vec3;



// ac-transform@1.1.0

},{"gl-vec3/create":114,"gl-vec3/cross":115,"gl-vec3/dot":116,"gl-vec3/fromValues":117,"gl-vec3/length":118,"gl-vec3/normalize":119}],127:[function(require,module,exports){
/**
 * Slim version of mat4, with only the API needed by ac-transform
 * @type {vec4}
 */
var vec4 = {
	/** @type {vec4}*/
	create       : require('gl-vec4/create'),
	/** @type {vec4}*/
	transformMat4: require('gl-vec4/transformMat4'),
	/** @type {vec4}*/
	fromValues   : require('gl-vec4/fromValues')
};

/** @type {vec4} */
module.exports = vec4;

// ac-transform@1.1.0

},{"gl-vec4/create":120,"gl-vec4/fromValues":121,"gl-vec4/transformMat4":122}],128:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('./helpers/Float32Array'); // stops ac-transform blowing up in old browsers
var transitionEnd = require('./helpers/transitionEnd');

/** @ignore */
var Clip = require('@marcom/ac-clip').Clip;
var ClipEasing = require('./clips/ClipEasing');
var ClipInlineCss = require('./clips/ClipInlineCss');
var ClipTransitionCss = require('./clips/ClipTransitionCss');

/**
 * @name module:ac-eclipse.ClipFactory
 * @class
 *
 * @desc Clip will transition properties on an object or styles on an element.
 *
 * @param {Object|Element} target
 *        The `Object` or `Element` whose properties / styles will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.delay=0]
 *        Delay in seconds before a clip will start after play has been called.
 *
 * @param {String|Function} [options.ease='ease-out']
 *        The default ease for transitions.
 *
 * @param {Clock} [options.clock=Clock]
 *        An instance of `ac-clock.Clock` to be used. Defaults to global singleton.
 *
 * @param {Object} [options.propsFrom={}]
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} [options.propsEase={}]
 *        An `Object` containing unique easing algorithms for specific properties.
 *
 * @param {Boolean} [options.destroyOnComplete=null]
 *        When true the clip will self destruct - call destroy on itself upon
 *        completion.
 *
 * @param {Function} [options.onStart=null]
 *        A callback `Function` called when the clip starts to play.
 *
 * @param {Function} [options.onUpdate=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used if you require to do further calculations with the
 *        properties and not for rendering. Use `onDraw` for rendering.
 *
 * @param {Function} [options.onDraw=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used for rendering, e.g. drawing something to a `canvas`
 *        element.
 *
 * @param {Function} [options.onComplete=null]
 *        A callback `Function` called when the clip has finished playing.
 */
function ClipFactory(target, duration, propsTo, options) {

	// if target is an element then transition css styles
	if (target.nodeType) {

		// if css transitions not supports (or inlineStyles option true) then set styles inline
		if (transitionEnd === undefined || (options && options.inlineStyles)) {
			return new ClipInlineCss(target, duration, propsTo, options);
		}

		// otherwise use css transitions to control animations
		return new ClipTransitionCss(target, duration, propsTo, options);
	}

	// used for transitioning properties on objects
	return new ClipEasing(target, duration, propsTo, options);
}

// loop through Clip public static methods and inherit them
for (var prop in Clip) {
	if (typeof Clip[prop] === 'function' && prop.substr(0, 1) !== '_') {
		ClipFactory[prop] = Clip[prop].bind(Clip);
	}
}

/**
 * @name module:ac-eclipse.ClipFactory#to
 * @function
 * @override
 * @static
 *
 * @desc Creates and returns an instance of a Clip that will autostart and destroy
 *       itself upon completetion. Ideal for creating throw away instances of Clip
 *       and not having to worry about memory / destroying them.
 *
 * @param {Object|Element} target
 *        The `Object` or `Element` whose properties / styles will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} options
 *        See Clip instantiation docs for full list of options.
 *
 * @returns {Clip} An new instance of Clip.
 */
ClipFactory.to = function (target, duration, propsTo, options) {
	options = options || {};
	if (options.destroyOnComplete === undefined) {
		options.destroyOnComplete = true;
	}
	return new ClipFactory(target, duration, propsTo, options).play();
};

/**
 * @name module:ac-eclipse.ClipFactory#from
 * @function
 * @override
 * @static
 *
 * @desc Creates and returns an instance of a Clip that will autostart and destroy
 *       itself upon completetion. Ideal for creating throw away instances of Clip
 *       and not having to worry about memory / destroying them. Unlike the static
 *       `to` method this method takes propsFrom as the third argument and will
 *       transition an Object back to it's original state.
 *
 * @param {Object|Element} target
 *        The `Object` or `Element` whose properties / styles will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsFrom
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} options
 *        See Clip instantiation docs for full list of options. The one difference
 *        here is no `propsFrom` object can be passed in options but instead a `propsTo`
 *        option is accepted that works in a similar way - listing end states for props.
 *
 * @returns {Clip} An new instance of Clip.
 */
ClipFactory.from = function (target, duration, propsFrom, options) {
	options = options || {};
	options.propsFrom = propsFrom;
	if (options.destroyOnComplete === undefined) {
		options.destroyOnComplete = true;
	}
	return new ClipFactory(target, duration, options.propsTo, options).play();
};

module.exports = ClipFactory;

// ac-eclipse@2.2.0

},{"./clips/ClipEasing":131,"./clips/ClipInlineCss":132,"./clips/ClipTransitionCss":133,"./helpers/Float32Array":136,"./helpers/transitionEnd":145,"@marcom/ac-clip":54}],129:[function(require,module,exports){
/**
 * @copyright 2016 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = require('./timeline/Timeline');

// ac-eclipse@2.2.0

},{"./timeline/Timeline":147}],130:[function(require,module,exports){
/**
 * @module ac-eclipse
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	Clip: require('./Clip'),
	Timeline: require('./Timeline')
};

// ac-eclipse@2.2.0

},{"./Clip":128,"./Timeline":129}],131:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var clone = require('@marcom/ac-object/clone');
var create = require('@marcom/ac-object/create');
var createPredefined = require('@marcom/ac-easing').createPredefined;
var isCssCubicBezierString = require('../helpers/isCssCubicBezierString');

/** @ignore */
var BezierCurveCssManager = require('../helpers/BezierCurveCssManager');
var Clip = require('@marcom/ac-clip').Clip;
var Ease = require('@marcom/ac-easing').Ease;


/**
 * @name module:ac-eclipse.ClipEasing
 * @class
 * @extends Clip
 *
 * @desc ClipEasing basically does the same as ac-clip.Clip - transitioning properties on objects.
 *       The one difference is that ClipEasing can have different easing algorithms per property
 *       and this is set with the propsEase option (see below). To achieve this, when propsEase is
 *       set, ClipEasing will create multiple instances of ac-clip.Clip with each unqiue easing
 *       algorithm. If only one easing is used ClipEasing will work the same as Clip.
 *
 * @param {Object} target
 *        The `Object` whose properties will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.delay=0]
 *        Delay in seconds before a clip will start after play has been called.
 *
 * @param {String|Function} [options.ease='ease-out']
 *        The default ease for transitions.
 *
 * @param {Clock} [options.clock=Clock]
 *        An instance of `ac-clock.Clock` to be used. Defaults to global singleton.
 *
 * @param {Object} [options.propsFrom={}]
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} [options.propsEase={}]
 *        An `Object` containing unique easing algorithms for specific properties.
 *
 * @param {Boolean} [options.destroyOnComplete=null]
 *        When true the clip will self destruct - call destroy on itself upon
 *        completion.
 *
 * @param {Function} [options.onStart=null]
 *        A callback `Function` called when the clip starts to play.
 *
 * @param {Function} [options.onUpdate=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used if you require to do further calculations with the
 *        properties and not for rendering. Use `onDraw` for rendering.
 *
 * @param {Function} [options.onDraw=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used for rendering, e.g. drawing something to a `canvas`
 *        element.
 *
 * @param {Function} [options.onComplete=null]
 *        A callback `Function` called when the clip has finished playing.
 */
function ClipEasing(target, duration, propsTo, options) {

	if (options && isCssCubicBezierString(options.ease)) {
		// convert to js easing function
		options.ease = BezierCurveCssManager.create(options.ease).toEasingFunction();
	}

	options = options || {};
	this._propsEase = options.propsEase || {};

	Clip.call(this, target, duration, propsTo, options);
}

var Super = Clip.prototype;
var proto = ClipEasing.prototype = create(Super);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-eclipse.ClipEasing#reset
 * @function
 * @override
 *
 * @desc Resets the clip and target properties.
 *
 * @returns {ClipEasing} A reference to this clip.
 */
proto.reset = function () {
	var returnValue = Super.reset.call(this);
	if (this._clips) {
		// if we have an array of clips then reset each clip
		var i = this._clips.length;
		while (i--) {
			this._clips[i].reset();
		}
	}
	return returnValue;
};

/**
 * @name module:ac-clip.ClipEasing#destroy
 * @function
 * @override
 *
 * @desc Immediately stop the clip and make it eligible for garbage collection.
 *       A clip can not be reused after it has been destroyed.
 *
 * @returns {ClipEasing} A reference to this clip.
 */
proto.destroy = function () {
	if (this._clips) {
		// if we have an array of clips then destroy each clip
		var i = this._clips.length;
		while (i--) {
			this._clips[i].destroy();
		}
		this._clips = null;
	}
	this._eases = null;
	this._storeOnUpdate = null;
	return Super.destroy.call(this);
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-eclipse.ClipEasing#_prepareProperties
 * @function
 * @override
 * @private
 */
/** @ignore */
proto._prepareProperties = function () {

	var easeCount = 0;
	var groupsTo = {};
	var groupsFrom = {};
	var eases = {};
	var prop;
	var ease;

	if (this._propsEase) {
		// create groups of props that share the same easing
		for (prop in this._propsTo) {
			if (this._propsTo.hasOwnProperty(prop)) {

				ease = this._propsEase[prop];
				if (isCssCubicBezierString(ease)) {
					// if cubic bezier css string then convert to js function
					ease = BezierCurveCssManager.create(ease).toEasingFunction();
				}

				if (ease === undefined) {
					// uses default ease
					if (groupsTo[this._ease] === undefined) {
						groupsTo[this._ease] = {};
						groupsFrom[this._ease] = {};
						eases[this._ease] = this._ease.easingFunction;
						easeCount++;
					}
					groupsTo[this._ease][prop] = this._propsTo[prop];
					groupsFrom[this._ease][prop] = this._propsFrom[prop];

				} else if (typeof ease === 'function') {
					// uses function for ease
					// can't use function as key as will mostly match default and other
					// functions when converted to String so use the easeCount as the key
					groupsTo[easeCount] = {};
					groupsFrom[easeCount] = {};
					groupsTo[easeCount][prop] = this._propsTo[prop];
					groupsFrom[easeCount][prop] = this._propsFrom[prop];
					eases[easeCount] = ease;
					easeCount++;

				} else {
					// uses a predefined string
					if (groupsTo[ease] === undefined) {
						groupsTo[ease] = {};
						groupsFrom[ease] = {};
						eases[ease] = ease;
						easeCount++;
					}
					groupsTo[ease][prop] = this._propsTo[prop];
					groupsFrom[ease][prop] = this._propsFrom[prop];
				}
			}
		}

		if (easeCount > 1) {
			// there is more than one ease so we group the props with the
			// same ease and create an array of clips to control them
			var optionsClone = clone(this._options || {}, true);
			var duration = this._duration * 0.001;

			this._storeOnUpdate = this._onUpdate;
			this._onUpdate = this._onUpdateClips;

			// set callbacks to null otherwise ease instance of clip per
			// ease will call them, so if we have 3 types of easing onStart
			// will get triggered 3 times (which would be undesired behaviour)
			optionsClone.onStart = null;
			optionsClone.onUpdate = null;
			optionsClone.onDraw = null;
			optionsClone.onComplete = null;

			// iterate through each group of props that share an ease
			// and create a new instance of clip for them. The progress
			// of these clips will be controlled in this._onUpdate
			this._clips = [];
			for (ease in groupsTo) {
				if (groupsTo.hasOwnProperty(ease)) {
					optionsClone.ease = eases[ease];
					optionsClone.propsFrom = groupsFrom[ease];
					this._clips.push(new Clip(this._target, duration, groupsTo[ease], optionsClone));
				}
			}

			// set ease to linear as ease on this doesn't matter anymore as our array of clips are doing all that work
			ease = 'linear';

			// set propsTo and propsFrom to an empty object, again, our array of clips does all that
			this._propsTo = {};
			this._propsFrom = {};

		} else {
			// we do this as the only ease isn't necessarily `options.ease` as `options.propsEase`
			// might contain same ease for all props that's different to `options.ease`
			for (prop in eases) {
				if (eases.hasOwnProperty(prop)) {
					ease = eases[prop];
				}
			}
		}

		if (ease !== undefined) {
			this._ease = (typeof ease === 'function') ? new Ease(ease) : createPredefined(ease);
		}
	}

	return Super._prepareProperties.call(this);
};

/**
 * @name module:ac-eclipse.ClipEasing#_onUpdateClips
 * @function
 * @private
 *
 * @param {Clip} [clip=undefined]
 */
/** @ignore */
proto._onUpdateClips = function (clip) {
	// this method is only called if there was multiple easing algorithms specified on instantiation
	// using `options.propsEase`. In that instance there will be an array of clips that need there
	// progress setting to match this.progress() (which is passed in the evt as a progress property)
	var progress = (this._direction === 1) ? clip.progress() : 1 - clip.progress();
	var i = this._clips.length;
	while (i--) {
		this._clips[i].progress(progress);
	}

	if (typeof this._storeOnUpdate === 'function') {
		this._storeOnUpdate.call(this, this);
	}
};

module.exports = ClipEasing;

// ac-eclipse@2.2.0

},{"../helpers/BezierCurveCssManager":135,"../helpers/isCssCubicBezierString":141,"@marcom/ac-clip":54,"@marcom/ac-easing":76,"@marcom/ac-object/clone":96,"@marcom/ac-object/create":97}],132:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var setStyle = require('@marcom/ac-dom-styles/setStyle');
var convertToStyleObject = require('../helpers/convertToStyleObject');
var convertToTransitionableObjects = require('../helpers/convertToTransitionableObjects');
var create = require('@marcom/ac-object/create');
var removeTransitions = require('../helpers/removeTransitions');

/** @ignore */
var ClipEasing = require('./ClipEasing');

/**
 * @name module:ac-eclipse.ClipInlineCss
 * @class
 * @extends ClipEasing
 *
 * @desc ClipInlineCss transitions CSS styles on an element. It extends ClipEasing to
 *       transition style properties on an object and then uses ac-dom-styles to apply
 *       these styles to a target element on Clock update.
 *
 * @param {Element} target
 *        The `Element` whose styles will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.delay=0]
 *        Delay in seconds before a clip will start after play has been called.
 *
 * @param {String|Function} [options.ease='ease-out']
 *        The default ease for transitions.
 *
 * @param {Clock} [options.clock=Clock]
 *        An instance of `ac-clock.Clock` to be used. Defaults to global singleton.
 *
 * @param {Object} [options.propsFrom={}]
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} [options.propsEase={}]
 *        An `Object` containing unique easing algorithms for specific properties.
 *
 * @param {Boolean} [options.destroyOnComplete=null]
 *        When true the clip will self destruct - call destroy on itself upon
 *        completion.
 *
 * @param {Function} [options.onStart=null]
 *        A callback `Function` called when the clip starts to play.
 *
 * @param {Function} [options.onUpdate=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used if you require to do further calculations with the
 *        properties and not for rendering. Use `onDraw` for rendering.
 *
 * @param {Function} [options.onDraw=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used for rendering, e.g. drawing something to a `canvas`
 *        element.
 *
 * @param {Function} [options.onComplete=null]
 *        A callback `Function` called when the clip has finished playing.
 */
function ClipInlineCss(target, duration, propsTo, options) {
	options = options || {};

	this._el = target;

	// store callbacks so they can be called later in this._onStart etc
	this._storeOnStart = options.onStart || null;
	this._storeOnDraw = options.onDraw || null;
	this._storeOnComplete = options.onComplete || null;

	// set callbacks to call internal methods on this so we can write styles on start and update etc
	options.onStart = this._onStart;
	options.onDraw = this._onDraw;
	options.onComplete = this._onComplete;

	// call super on ClipEasing constructor
	ClipEasing.call(this, {}, duration, propsTo, options);
}

var Super = ClipEasing.prototype;
var proto = ClipInlineCss.prototype = create(Super);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.ClipInlineCss#play
 * @function
 *
 * @desc Starts the clip.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.play = function () {
	var returnValue = Super.play.call(this);
	if (this._remainingDelay !== 0) {
		setStyle(this._el, convertToStyleObject(this._target));
	}
	return returnValue;
};

/**
 * @name module:ac-eclipse.ClipInlineCss#reset
 * @function
 * @override
 *
 * @desc Resets the clip and target properties.
 *
 * @returns {ClipInlineCss} A reference to this clip.
 */
proto.reset = function () {
	var returnValue = Super.reset.call(this);
	setStyle(this._el, convertToStyleObject(this._target));
	return returnValue;
};

/**
 * @name module:ac-clip.ClipInlineCss#destroy
 * @function
 * @override
 *
 * @desc Immediately stop the clip and make it eligible for garbage collection.
 *       A clip can not be reused after it has been destroyed.
 *
 * @returns {ClipInlineCss} A reference to this clip.
 */
proto.destroy = function () {
	this._el = null;
	this._completeStyles = null;
	this._storeOnStart = null;
	this._storeOnDraw = null;
	this._storeOnComplete = null;
	return Super.destroy.call(this);
};

/**
 * @name module:ac-eclipse.ClipInlineCss#target
 * @function
 * @override
 *
 * @desc Returns the target `Element`.
 *
 * @returns {Element} The target.
 */
proto.target = function () {
	return this._el;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-eclipse.ClipInlineCss#_prepareProperties
 * @function
 * @override
 * @private
 */
/** @ignore */
proto._prepareProperties = function () {

	// convert the object so it can be used with clip.
	// e.g. 'width':'10px' becomes 'width':{value:'10',unit'px'}
	var converted = convertToTransitionableObjects(this._el, this._propsTo, this._propsFrom);
	this._target = converted.target;
	this._propsFrom = converted.propsFrom;
	this._propsTo = converted.propsTo;

	// if properties we are animating have css transition on them weird things happen so remove
	removeTransitions(this._el, this._target);

	var completeStyles = (this._isYoyo) ? this._propsFrom : this._propsTo;
	this._completeStyles = convertToStyleObject(completeStyles);

	// if set will generate an object of styles to remove when transition completes
	if (this._options.removeStylesOnComplete !== undefined) {
		var prop;
		var removeStyles = this._options.removeStylesOnComplete;
		if (typeof removeStyles === 'boolean' && removeStyles) {
			// remove all styles
			for (prop in this._completeStyles) {
				if (this._completeStyles.hasOwnProperty(prop)) {
					this._completeStyles[prop] = null;
				}
			}
		} else if (typeof removeStyles === 'object' && removeStyles.length) {
			// remove certain styles
			var i = removeStyles.length;
			while (i--) {
				prop = removeStyles[i];
				if (this._completeStyles.hasOwnProperty(prop)) {
					this._completeStyles[prop] = null;
				}
			}
		}
	}

	return Super._prepareProperties.call(this);
};

/**
 * @name module:ac-eclipse.ClipInlineCss#_onStart
 * @function
 * @private
 *
 * @param {Clip} [clip=undefined]
 */
/** @ignore */
proto._onStart = function (clip) {
	if (this.playing() && this._direction === 1 && this._delay === 0) {
		setStyle(this._el, convertToStyleObject(this._propsFrom));
	}
	if (typeof this._storeOnStart === 'function') {
		this._storeOnStart.call(this, this);
	}
};

/**
 * @name module:ac-eclipse.ClipInlineCss#_onDraw
 * @function
 * @private
 *
 * @param {Clip} [clip=undefined]
 */
/** @ignore */
proto._onDraw = function (clip) {
	setStyle(this._el, convertToStyleObject(this._target));
	if (typeof this._storeOnDraw === 'function') {
		this._storeOnDraw.call(this, this);
	}
};

/**
 * @name module:ac-eclipse.ClipInlineCss#_onComplete
 * @function
 * @private
 *
 * @param {Clip} [clip=undefined]
 */
/** @ignore */
proto._onComplete = function (clip) {
	setStyle(this._el, this._completeStyles);
	if (typeof this._storeOnComplete === 'function') {
		this._storeOnComplete.call(this, this);
	}
};

module.exports = ClipInlineCss;

// ac-eclipse@2.2.0

},{"../helpers/convertToStyleObject":138,"../helpers/convertToTransitionableObjects":139,"../helpers/removeTransitions":142,"./ClipEasing":131,"@marcom/ac-dom-styles/setStyle":29,"@marcom/ac-object/create":97}],133:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var setStyle = require('@marcom/ac-dom-styles/setStyle');
var getStyle = require('@marcom/ac-dom-styles/getStyle');
var convertToStyleObject = require('../helpers/convertToStyleObject');
var convertToTransitionableObjects = require('../helpers/convertToTransitionableObjects');
var clone = require('@marcom/ac-object/clone');
var create = require('@marcom/ac-object/create');
var createPredefined = require('@marcom/ac-easing').createPredefined;
var isCssCubicBezierString = require('../helpers/isCssCubicBezierString');
var removeTransitions = require('../helpers/removeTransitions');
var transitionEnd = require('../helpers/transitionEnd');
var waitAnimationFrames = require('../helpers/waitAnimationFrames');

/** @ignore */
var BezierCurveCssManager = require('../helpers/BezierCurveCssManager');
var Clip = require('@marcom/ac-clip').Clip;
var ClipEasing = require('./ClipEasing');
var PageVisibilityManager = require('@marcom/ac-page-visibility').PageVisibilityManager;

/** @ignore */
var DEFAULT_EASE = 'ease'; // should match ac-eclipse.ClipEasing.DEFAULT_EASE
var ERROR_EASE_NOT_SUPPORTED = '%EASE% is not a supported predefined ease when transitioning with Elements ' +
								'and CSS transition. If you need to use %EASE% then pass the inlineStyle:true option.';
var ERROR_EASE_IS_FUNCTION = 'Function eases are not supported when using CSS transitions with Elements. ' +
								'Either use a cubic-bezier string (e.g. \'cubic-bezier(0, 0, 1, 1)\' or pass the ' +
								'inlineStyle option as `true` to render styles each frame instead of using CSS transitions.';

/**
 * @name module:ac-eclipse.ClipTransitionCss
 * @class
 * @extends Clip
 *
 * @desc ClipTransitionCss transitions CSS styles on an element. As with ClipInlineCss, it
 *       extends ClipEasing to transition style properties on an object. However, instead
 *       of applying these styles on Clock update it instead uses ac-dom-styles to apply
 *       the end styles to a target element along with CSS transition properties.
 *
 * @param {Element} target
 *        The `Element` whose styles will transition / modify.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Object} propsTo
 *        An `Object` containing the end state of the properties you wish to
 *        transition on target.
 *
 * @param {Number} [options.delay=0]
 *        Delay in seconds before a clip will start after play has been called.
 *
 * @param {String|Function} [options.ease='ease-out']
 *        The default ease for transitions.
 *
 * @param {Clock} [options.clock=Clock]
 *        An instance of `ac-clock.Clock` to be used. Defaults to global singleton.
 *
 * @param {Object} [options.propsFrom={}]
 *        An `Object` containing the start state of the properties you wish to
 *        transition on target.
 *
 * @param {Object} [options.propsEase={}]
 *        An `Object` containing unique easing algorithms for specific properties.
 *
 * @param {Boolean} [options.destroyOnComplete=null]
 *        When true the clip will self destruct - call destroy on itself upon
 *        completion.
 *
 * @param {Function} [options.onStart=null]
 *        A callback `Function` called when the clip starts to play.
 *
 * @param {Function} [options.onUpdate=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used if you require to do further calculations with the
 *        properties and not for rendering. Use `onDraw` for rendering.
 *
 * @param {Function} [options.onDraw=null]
 *        A callback `Function` called when the clip has updated properties.
 *        This should be used for rendering, e.g. drawing something to a `canvas`
 *        element.
 *
 * @param {Function} [options.onComplete=null]
 *        A callback `Function` called when the clip has finished playing.
 */
function ClipTransitionCss(target, duration, propsTo, options) {
	options = options || {};

	this._el = target;
	this._storeEase = options.ease;

	if (typeof this._storeEase === 'function') {
		throw new Error(ERROR_EASE_IS_FUNCTION);
	}

	// store callbacks so they can be called later in this._onStart etc
	this._storeOnStart = options.onStart || null;
	this._storeOnComplete = options.onComplete || null;

	// set callbacks to call internal methods on this so we can write styles on start and update etc
	options.onStart = this._onStart.bind(this);
	options.onComplete = this._onComplete.bind(this);

	this._stylesTo = clone(propsTo, true);
	this._stylesFrom = (options.propsFrom) ? clone(options.propsFrom, true) : {};
	this._propsEase = (options.propsEase) ? clone(options.propsEase, true) : {};

	if (isCssCubicBezierString(options.ease)) {
		// convert to js easing function
		options.ease = BezierCurveCssManager.create(options.ease).toEasingFunction();
	}

	// call super on Clip constructor
	Clip.call(this, {}, duration, {}, options);

	// remove this._propsFrom as we don't want it used in super
	this._propsFrom = {};
}

var Super = Clip.prototype;
var proto = ClipTransitionCss.prototype = create(Super);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-clip.ClipTransitionCss#play
 * @function
 *
 * @desc Starts the clip.
 *
 * @returns {Clip} A reference to this clip.
 */
proto.play = function () {
	var returnValue = Super.play.call(this);
	if (this._direction === 1 && this.progress() === 0 && this._remainingDelay !== 0) {
		this._applyStyles(0, convertToStyleObject(this._stylesFrom));
	}
	return returnValue;
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#reset
 * @function
 * @override
 *
 * @desc Resets the clip and target properties.
 *
 * @returns {ClipTransitionCss} A reference to this clip.
 */
proto.reset = function () {
	var returnValue = Super.reset.call(this);
	this._stylesClip.reset();
	this._applyStyles(0, convertToStyleObject(this._styles));
	return returnValue;
};

/**
 * @name module:ac-clip.ClipTransitionCss#destroy
 * @function
 * @override
 *
 * @desc Immediately stop the clip and make it eligible for garbage collection.
 *       A clip can not be reused after it has been destroyed.
 *
 * @returns {ClipTransitionCss} A reference to this clip.
 */
proto.destroy = function () {
	PageVisibilityManager.off('changed', this._onVisibilityChanged);
	this._removeTransitionListener();
	this.off('pause', this._onPaused);
	this._onPaused();
	this._stylesClip.destroy();
	this._stylesClip = null;
	this._el = null;
	this._propsArray = null;
	this._styles = null;
	this._stylesFrom = null;
	this._stylesTo = null;
	this._completeStyles = null;
	this._storeOnStart = null;
	this._storeOnComplete = null;
	this._onTransitionEnded = null;
	return Super.destroy.call(this);
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#target
 * @function
 * @override
 *
 * @desc Returns the target `Element`.
 *
 * @returns {Element} The target.
 */
proto.target = function () {
	return this._el;
};

/**
 * @name module:ac-clip.Clip#duration
 * @function
 * @override
 *
 * @desc Gets or sets the duration of the transition.
 *
 * @param {Number} [duration]
 *        Optional new duration for the transition.
 *
 * @returns {Number} The current duration.
 */
proto.duration = function (duration) {
	var returnValue = Super.duration.call(this, duration);

	if (duration === undefined) {
		return returnValue;
	}

	if (this.playing()) {
		this.progress(this._progress);
	}

	return returnValue;
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#progress
 * @function
 * @override
 *
 * @desc Accepts a `Number` between 0 and 1 and will change the position of the clip.
 *
 * @param {Number} progress
 *        Accepts a Number between 0 and 1 and will change the position of the clip.
 *
 * @returns {Number} The current progress.
 */
proto.progress = function (progress) {

	var returnValue = Super.progress.call(this, progress);

	if (progress === undefined) {
		return returnValue;
	}

	progress = (this._direction === 1) ? progress : 1 - progress;
	this._stylesClip.progress(progress);

	// first we set the styles immediately to using this._styles which is updated by this._stylesClip
	this._applyStyles(0, convertToStyleObject(this._styles));

	if (this.playing()) {
		this._isWaitingForStylesToBeApplied = true;
		// if we're playing we need to then set the end state along with transitions
		// the reason for waiting two frames here is immediately setting the styles with
		// CSS transition properties will stop the above _applyStyles to _target not be
		// instant (it will animate)
		waitAnimationFrames(this._setStylesAfterWaiting, 2);
	}

	return returnValue;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-eclipse.ClipTransitionCss#_prepareProperties
 * @function
 * @override
 * @private
 */
/** @ignore */
proto._prepareProperties = function () {

	// convert the object so it can be used with clip.
	// e.g. 'width':'10px' becomes 'width':{value:'10',unit'px'}
	var converted = convertToTransitionableObjects(this._el, this._stylesTo, this._stylesFrom);
	this._styles = converted.target;
	this._stylesTo = converted.propsTo;
	this._stylesFrom = converted.propsFrom;

	var ease = this._storeEase || DEFAULT_EASE;
	this._eases = {};
	this._propsArray = [];
	var convertedEase;
	this._styleCompleteTo = convertToStyleObject(this._stylesTo);
	this._styleCompleteFrom = convertToStyleObject(this._stylesFrom);
	this._propsEaseKeys = {};

	var prop;
	for (prop in this._stylesTo) {

		if (this._stylesTo.hasOwnProperty(prop)) {
			// store props to use with ac-dom-styles in _onPaused
			// method to get current styles of element
			this._propsArray[this._propsArray.length] = prop;

			if (this._propsEase[prop] === undefined) {
				if (this._eases[ease] === undefined) {
					// setup default ease
					convertedEase = this._convertEase(ease);
					this._eases[ease] = convertedEase.css;
				}

				// use default
				this._propsEaseKeys[prop] = ease;

			} else if (this._eases[this._propsEase[prop]] === undefined) {
				// setup new bezier curve ease
				convertedEase = this._convertEase(this._propsEase[prop]);
				this._eases[this._propsEase[prop]] = convertedEase.css;

				this._propsEaseKeys[prop] = this._propsEase[prop];
				this._propsEase[prop] = convertedEase.js;

			} else if (isCssCubicBezierString(this._propsEase[prop])) {
				// uses a cubic bezier that we already converted so just need the JS function
				this._propsEaseKeys[prop] = this._propsEase[prop];
				this._propsEase[prop] = this._eases[this._propsEase[prop]]['1'].toEasingFunction();
			}
		}
	}

	// listen for pause event to fire from super so we can set styles
	this._onPaused = this._onPaused.bind(this);
	this.on('pause', this._onPaused);

	this._setOtherTransitions();
	this._currentTransitionStyles = this._otherTransitions;

	this._completeStyles = convertToStyleObject((this._isYoyo) ? this._stylesFrom : this._stylesTo);

	// if set will generate an object of styles to remove when transition completes
	if (this._options.removeStylesOnComplete !== undefined) {
		var removeStyles = this._options.removeStylesOnComplete;
		if (typeof removeStyles === 'boolean' && removeStyles) {
			// remove all styles
			for (prop in this._stylesTo) {
				this._completeStyles[prop] = null;
			}
		} else if (typeof removeStyles === 'object' && removeStyles.length) {
			// remove certain styles
			var i = removeStyles.length;
			while (i--) {
				this._completeStyles[removeStyles[i]] = null;
			}
		}
	}

	// bind methods to this context
	this._onTransitionEnded = this._onTransitionEnded.bind(this);
	this._setStylesAfterWaiting = this._setStylesAfterWaiting.bind(this);
	this._onVisibilityChanged = this._onVisibilityChanged.bind(this);

	PageVisibilityManager.on(PageVisibilityManager.CHANGED, this._onVisibilityChanged);

	// this._stylesClip is used in progress method to get the correctly eased values/styles
	// when jumping to a specific progress of a clip
	this._stylesClip = new ClipEasing(this._styles, 1, this._stylesTo, {
		ease: this._options.ease,
		propsFrom: this._stylesFrom,
		propsEase: this._options.propsEase
	});
	// this._stylesClip should only be used privately in ClipTransitionCss so remove it
	// from Clip Class array of all Clip instances to avoid user confusion and protect
	// it from inadvertidle getting interfered with
	Clip._remove(this._stylesClip);

	return Super._prepareProperties.call(this);
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_convertEase
 * @function
 * @override
 * @private
 *
 * @param {String} ease
 *
 * @returns {Object} Returns an `Object` containing converted eases.
 */
/** @ignore */
proto._convertEase = function (ease) {
	if (typeof ease === 'function') {
		throw new Error(ERROR_EASE_IS_FUNCTION);
	}
	var bezierCurve;
	var jsEase;
	if (isCssCubicBezierString(ease)) {
		bezierCurve = BezierCurveCssManager.create(ease);
		jsEase = bezierCurve.toEasingFunction();
	} else {
		var predefinedEase = createPredefined(ease);
		if (predefinedEase.cssString === null) {
			throw new Error(ERROR_EASE_NOT_SUPPORTED.replace(/%EASE%/g, ease));
		}
		bezierCurve = BezierCurveCssManager.create(predefinedEase.cssString);
		jsEase = ease;
	}
	return {
		css: {
			'1': bezierCurve,
			'-1': bezierCurve.reversed()
		},
		js: jsEase
	};
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_complete
 * @function
 * @override
 * @private
 *
 * @fires ClipTransitionCss#complete
 */
/** @ignore */
proto._complete = function () {
	if ((this._isWaitingForStylesToBeApplied || this._isTransitionEnded || !this._isListeningForTransitionEnd) && this.progress() === 1) {
		this._isWaitingForStylesToBeApplied = false;
		Super._complete.call(this);
	}
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_onTransitionEnded
 * @function
 * @private
 *
 * @fires ClipTransitionCss#complete
 */
/** @ignore */
proto._onTransitionEnded = function () {
	this._isTransitionEnded = true;
	this._complete();
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_addTransitionListener
 * @function
 * @private
 */
/** @ignore */
proto._addTransitionListener = function () {
	if (!this._isListeningForTransitionEnd && this._el && this._onTransitionEnded) {
		this._isListeningForTransitionEnd = true;
		this._isTransitionEnded = false;
		this._el.addEventListener(transitionEnd, this._onTransitionEnded);
	}
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_removeTransitionListener
 * @function
 * @private
 */
/** @ignore */
proto._removeTransitionListener = function () {
	if (this._isListeningForTransitionEnd && this._el && this._onTransitionEnded) {
		this._isListeningForTransitionEnd = false;
		this._isTransitionEnded = false;
		this._el.removeEventListener(transitionEnd, this._onTransitionEnded);
	}
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_applyStyles
 * @function
 * @private
 *
 * @param {Number} duration
 * @param {Object} styles
 */
/** @ignore */
proto._applyStyles = function (duration, styles) {

	if (duration > 0) {
		var transition = '';
		var eases = {};
		var prop;
		for (prop in this._eases) {
			if (this._eases.hasOwnProperty(prop)) {
				// this._eases contains instances of BezierCurveCss
				// split on the current progress to return the correct css bezier curve ease
				eases[prop] = this._eases[prop][this._direction].splitAt(this.progress()).toCSSString();
			}
		}
		for (prop in this._stylesTo) {
			if (this._stylesTo.hasOwnProperty(prop)) {
				// iterate through each property and generate a transition string
				transition += prop + ' ' + duration + 'ms ' + eases[this._propsEaseKeys[prop]] + ' 0ms, ';
			}
		}
		this._currentTransitionStyles = transition.substr(0, transition.length - 2);

		if (!this._doStylesMatchCurrentStyles(styles)) {
			this._addTransitionListener();
		} else {
			this._removeTransitionListener();
		}
	} else {
		// no transition if duration is 0
		this._currentTransitionStyles = '';
		this._removeTransitionListener();
	}

	styles['transition'] = this._getOtherClipTransitionStyles() + this._currentTransitionStyles;

	// apply styles using ac-dom-styles
	setStyle(this._el, styles);
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_doStylesMatchCurrentStyles
 * @function
 * @private
 */
/** @ignore */
proto._doStylesMatchCurrentStyles = function (newStyles) {
	var currentStyles = getStyle.apply(this, [this._el].concat([this._propsArray]));
	var style;
	for (style in newStyles) {
		if (newStyles.hasOwnProperty(style) && currentStyles.hasOwnProperty(style) && newStyles[style] !== currentStyles[style]) {
			return false;
		}
	}
	return true;
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_setStylesAfterWaiting
 * @function
 * @private
 */
/** @ignore */
proto._setStylesAfterWaiting = function () {
	this._isWaitingForStylesToBeApplied = false;
	// ensure still playing - 2 frames can be a long time ;)
	if (this.playing()) {
		var duration = this._durationMs * (1 - this.progress());
		var styles = (this._direction > 0) ? this._styleCompleteTo : this._styleCompleteFrom;
		this._applyStyles(duration, styles);
	}
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_setOtherTransitions
 * @function
 * @private
 */
/** @ignore */
proto._setOtherTransitions = function () {
	// remove CSS transitions that clash with properties Clip will animate
	removeTransitions(this._el, this._stylesTo);

	var clips = Clip.getAll(this._el);
	var i = clips.length;
	while (i--) {
		if (clips[i] !== this &&
			clips[i].playing() &&
			clips[i]._otherTransitions &&
			clips[i]._otherTransitions.length) {
			this._otherTransitions = clips[i]._otherTransitions;
			return;
		}
	}

	// store transitions that don't clash with properties Clip will animate
	// because two instances of clip might be transitioning differing properties
	this._otherTransitions = getStyle(this._el, 'transition').transition;
	if (this._otherTransitions === null || this._otherTransitions === 'all 0s ease 0s') {
		this._otherTransitions = '';
	}
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_getTransitionStyles
 * @function
 * @private
 */
/** @ignore */
proto._getTransitionStyles = function () {
	var transition = this._getOtherClipTransitionStyles();
	if (this._otherTransitions.length) {
		transition += this._otherTransitions;
	} else if (transition.length) {
		transition = transition.substr(0, transition.length - 2);
	}
	return transition;
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_getOtherClipTransitionStyles
 * @function
 * @private
 */
/** @ignore */
proto._getOtherClipTransitionStyles = function () {
	var transition = '';
	var clips = Clip.getAll(this._el);
	var i = clips.length;
	while (i--) {
		if (clips[i] !== this &&
			clips[i].playing() &&
			clips[i]._currentTransitionStyles &&
			clips[i]._currentTransitionStyles.length) {
			transition += clips[i]._currentTransitionStyles + ', ';
		}
	}
	return transition;
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_onVisibilityChanged
 * @function
 * @private
 *
 * @param {Object} [evt=undefined]
 */
/** @ignore */
proto._onVisibilityChanged = function (evt) {
	if (this.playing() && !evt.isHidden) {
		this._update({
			timeNow: this._getTime()
		});

		var progress = this.progress();
		if (progress < 1) {
			this.progress(progress);
		}
	}
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_onPaused
 * @function
 * @private
 *
 * @param {Clip} [clip=undefined]
 */
/** @ignore */
proto._onPaused = function (clip) {
	// get current styles
	var styles = getStyle.apply(this, [this._el].concat([this._propsArray]));
	// remove transition
	styles['transition'] = this._getTransitionStyles();
	this._removeTransitionListener();

	setStyle(this._el, styles);
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_onStart
 * @function
 * @private
 *
 * @param {Clip} [clip=undefined]
 */
/** @ignore */
proto._onStart = function (clip) {
	// if progress is 0 and direction is 1 then we want to initially apply the fromStyles
	// therefore, to ensure the inital styles don't animate we have to wait 2 frames before
	// apply the end state with CSS transition properties
	var waitFrames = (this._direction === 1 && this.progress() === 0 && this._delay === 0) ? 2 : 0;
	if (waitFrames) {
		this._isWaitingForStylesToBeApplied = true;
		this._applyStyles(0, this._styleCompleteFrom);
	}

	waitAnimationFrames(this._setStylesAfterWaiting, waitFrames);

	if (typeof this._storeOnStart === 'function') {
		this._storeOnStart.call(this, this);
	}
};

/**
 * @name module:ac-eclipse.ClipTransitionCss#_onComplete
 * @function
 * @private
 *
 * @param {Clip} [clip=undefined]
 */
/** @ignore */
proto._onComplete = function (clip) {
	this._removeTransitionListener();
	this._completeStyles['transition'] = this._getTransitionStyles();
	setStyle(this._el, this._completeStyles);
	if (typeof this._storeOnComplete === 'function') {
		this._storeOnComplete.call(this, this);
	}
};

module.exports = ClipTransitionCss;

// ac-eclipse@2.2.0

},{"../helpers/BezierCurveCssManager":135,"../helpers/convertToStyleObject":138,"../helpers/convertToTransitionableObjects":139,"../helpers/isCssCubicBezierString":141,"../helpers/removeTransitions":142,"../helpers/transitionEnd":145,"../helpers/waitAnimationFrames":146,"./ClipEasing":131,"@marcom/ac-clip":54,"@marcom/ac-dom-styles/getStyle":27,"@marcom/ac-dom-styles/setStyle":29,"@marcom/ac-easing":76,"@marcom/ac-object/clone":96,"@marcom/ac-object/create":97,"@marcom/ac-page-visibility":99}],134:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var createBezier = require('@marcom/ac-easing').createBezier;

/**
 * @name BezierCurveCss
 * @class
 *
 * @desc Stores information about a CSS cubic bezier easing curve and has useful methods
 *       for splitting and reversing etc.
 *
 * @link http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B.C3.A9zier_curves
 * @link http://dev.w3.org/csswg/css-transitions/#propdef-transition-timing-function
 *
 * @param {Array} curve
 *        An `Array` containing the two control points, e.g. `[0, 0, 1, 1]`
 *
 * @param {BezierCurveCssManager} manager
 *        A reference to the BezierCurveCssManager instance that will create new instancs
 *        of BezierCurveCss when split and reverse methods are invoked.
 */
function BezierCurveCss(curve, manager) {
	this.manager = manager;

	this.p1 = {
		x: curve[0],
		y: curve[1]
	};

	this.p2 = {
		x: curve[2],
		y: curve[3]
	};

	this._isLinear = (this.p1.x === this.p1.y) && (this.p2.x === this.p2.y);
	this._cacheSplits = {};
}

var proto = BezierCurveCss.prototype;

/**
 * @name BezierCurveCss#splitAt
 * @function
 *
 * @desc Splits this bezier curve at a percent (0 to 1) and returns a new BezierCurveCss.
 *       Note: the percent in this instance is the time, or the x-axis of the bezier curve.
 *
 * @param {Number} percent
 *        Accepts a Number between 0 and 1 at which the bezier curver should be split.
 *
 * @returns {BezierCurveCss} A new instance of BezierCurveCss.
 */
proto.splitAt = function (percent) {

	// if the ease is linear we don't need to split it
	if (this._isLinear) {
		return this;
	}

	// round the split percent to the nearest 0.025, e.g. 0.043778348757853837 will be 0.05 and 0.076347848 will be 0.075
	// it means the split curve isn't *perfect* but it'll be close enough and will be much better for performance
	percent = Math.round(percent * 40) / 40; // 40 is used here because 1 / 0.025 = 40

	if (percent === 0) {
		return this;
	} else if (this._cacheSplits[percent] !== undefined) {
		return this._cacheSplits[percent];
	}

	var x = [this.p1.x, this.p2.x];
	var y = [this.p1.y, this.p2.y];
	var maxIterations = 0;
	var targetX = percent;
	var min = 0;
	var max = 1;
	var startX = this._getStartX(percent, x);

	// So what's happening here? Let me try and explain...
	// CSS uses bezier curves for controlling easing of transitions. The x-axis is the time ratio
	// and the y-axis the output ratio. We want this function to split on the x-axis, as we're thinking
	// about time. Imagine an ease-in curve (0.42, 0.0, 1.00, 1.0). If you split the bezier curve at 0.5
	// you will actually be at 0.6575 on the x-axis. I'm not sure on the maths for getting the actual
	// value we want elegantly so for now we use the below (sort of brute force). It usually takes about
	// 50 iterations and runs in 0-1ms so it's not a major blocker but if you know a better way please
	// feel free to make a pull request.
	//
	// Make sense? Probably not. Hopefully this diagram will help:
	// https://interactive-git.apple.com/github-enterprise-assets/0000/0080/0000/0508/596a7432-c904-11e4-9650-2db51bc94cfe.png
	while (targetX !== startX && maxIterations < 1000) {
		if (targetX < startX) {
			max = percent;
		} else {
			min = percent;
		}

		percent = min + ((max - min) * 0.5); // split min / max
		startX = this._getStartX(percent, x);

		// count iterations so we don't get a maximum call stack size exceeded error if something goes awry
		++maxIterations;
	}

	var split = this._splitBezier(percent, x, y);
	var normalized = this._normalize(split);
	var newBezierCurve = this.manager.create(normalized);

	this._cacheSplits[targetX] = newBezierCurve; // todo: this should probably be cached globally / go in BezierCurveCssManager

	return newBezierCurve;
};

/**
 * @name BezierCurveCss#reversed
 * @function
 *
 * @desc Inverts / rotates the bezier curve. If currently eases in the new BezierCurveCss will ease out.
 * @link http://stackoverflow.com/questions/23453721/opposite-of-ease-cubic-bezier-function
 *
 * @returns {BezierCurveCss} A new instance of BezierCurveCss.
 */
proto.reversed = function () {
	var arr = this.toArray();
	return this.manager.create([
		0.5 - (arr[2] - 0.5),
		0.5 - (arr[3] - 0.5),
		0.5 - (arr[0] - 0.5),
		0.5 - (arr[1] - 0.5)
	]);
};

/**
 * @name BezierCurveCss#toArray
 * @function
 *
 * @desc Returns the anchor points in an array with a length of 4 (as the first point is always 0,0 and the last point 1,1).
 *
 * @returns {Array} The anchor points in an array.
 */
proto.toArray = function () {
	return [
		this.p1.x,
		this.p1.y,
		this.p2.x,
		this.p2.y
	];
};

/**
 * @name BezierCurveCss#toCSSString
 * @function
 *
 * @desc Returns a string that can be used as a CSS ease, e.g. `'cubic-bezier(0.0, 0.0, 1.0, 1.0)'`.
 *
 * @returns {String} A string that can be used as a CSS ease.
 */
proto.toCSSString = function () {
	// todo: cache this
	return 'cubic-bezier(' + this.p1.x + ', ' + this.p1.y + ', ' + this.p2.x + ', ' + this.p2.y + ')';
};

/**
 * @name BezierCurveCss#toEasingFunction
 * @function
 *
 * @desc Returns the equivalent JS easing function.
 *
 * @returns {Function} Equivalent JS easing function.
 */
proto.toEasingFunction = function () {
	// todo: cache this
	return createBezier.apply(this, this.toArray()).easingFunction;
};

/**
 * @name BezierCurveCss#_getStartX
 * @function
 * @private
 *
 * @desc Similar to the _splitBezier function below but only returns the starting X position of the new curve.
 *
 * @param {Number} p
 *        A number between 0 and 1 representing the percent at which the curve should be split.
 *
 * @param {Array} x
 *        The x-axis control points. The start and end points are always 0 and 1 so the length
 *        of this array will always be 2 for the control points only.
 *
 * @returns {Number} todo.
 */
/** @ignore */
proto._getStartX = function (p, x) {
	var cp = p - 1;
	var p2 = p * p;
	var cp2 = cp * cp;
	var p3 = p2 * p;
	return p3 - 3 * p2 * cp * x[1] + 3 * p * cp2 * x[0];
};

/**
 * @name BezierCurveCss#_splitBezier
 * @function
 * @private
 *
 * @desc Splits a bezier curve at a percentage along it's curve. Uses De Casteljau's algorithm.
 * @link http://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm
 * @link http://stackoverflow.com/questions/8369488/splitting-a-bezier-curve
 *
 * @param {Number} p
 *        A number between 0 and 1 representing the percent at which the curve should be split.
 *
 * @param {Array} x
 *        The x-axis control points. The start and end points are always 0 and 1 so the length
 *        of this array will always be 2 for the control points only.
 *
 * @param {Array} y
 *        The y-axis control points. The start and end points are always 0 and 1 so the length
 *        of this array will always be 2 for the control points only.
 *
 * @returns {Array} Returns an array of the new start and control points. End points are not
 *                  included as they will always be 1,1.
 */
/** @ignore */
proto._splitBezier = function (p, x, y) {
	var cp = p - 1;
	var p2 = p * p;
	var cp2 = cp * cp;
	var p3 = p2 * p;
	return [
		p3 - 3 * p2 * cp * x[1] + 3 * p * cp2 * x[0], // p0.x
		p3 - 3 * p2 * cp * y[1] + 3 * p * cp2 * y[0], // p0.y
		p2 - 2 * p * cp * x[1] + cp2 * x[0], // p1.x
		p2 - 2 * p * cp * y[1] + cp2 * y[0], // p1.y
		p - cp * x[1], // p2.x
		p - cp * y[1] // p2.y
	];
};

/**
 * @name BezierCurveCss#_normalize
 * @function
 * @private
 *
 * @desc Bezier curves used in CSS easing must always start at 0,0 and end at 1,1.
 *       What this function does is take an Array of control points and stretches it to
 *       meet this requirments.
 *
 * @param {Array} array
 *        An array of start and control points. The end points are always 1,1.
 *
 * @returns {Array} A new array of control points.
 *                  Note: that start points are not inluded as they are now 0,0.
 */
/** @ignore */
proto._normalize = function (array) {
	return [
		(array[2] - array[0]) / (1 - array[0]),	// p1.x
		(array[3] - array[1]) / (1 - array[1]),	// p1.y
		(array[4] - array[0]) / (1 - array[0]),	// p2.x
		(array[5] - array[1]) / (1 - array[1])	// p2.y
	];
};

module.exports = BezierCurveCss;

// ac-eclipse@2.2.0

},{"@marcom/ac-easing":76}],135:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var BezierCurveCss = require('./BezierCurveCss');

/**
 * @name BezierCurveCssManager
 * @class
 * @singleton
 *
 * @desc Manages instances of BezierCurveCss to enable caching.
 */
function BezierCurveCssManager() {
	this._instances = {};
}

var proto = BezierCurveCssManager.prototype;

/**
 * @name BezierCurveCssManager#curve
 * @function
 *
 * @desc Returns an instance of BezierCurveCss. Checks to see if there's already an
 *       instance first otherwise create new instance.
 *
 * @param {String|Array} curve
 *        Either a CSS cubic bezier ease `String`, e.g. `'cubic-bezier(0.0, 0.0, 1.0, 1.0)'`.
 *        Alternatively, an `Array` containing the two control points, so using the above
 *        CSS string, `[0, 0, 1, 1]`
 *
 * @returns {BezierCurveCss} An instance of BezierCurveCss.
 */
proto.create = function (curve) {
	var key;
	if (typeof curve === 'string') {
		key = curve.replace(/ /g, '');
	} else {
		key = 'cubic-bezier(' + curve.join(',') + ')';
	}

	if (this._instances[key] === undefined) {
		if (typeof curve === 'string') {
			curve = curve.match(/\d*\.?\d+/g);
			var i = curve.length;
			while (i--) {
				curve[i] = Number(curve[i]);
			}
		}
		this._instances[key] = new BezierCurveCss(curve, this);
	}

	return this._instances[key];
};

module.exports = new BezierCurveCssManager();

// ac-eclipse@2.2.0

},{"./BezierCurveCss":134}],136:[function(require,module,exports){
'use strict';

// Currently include ac-transform causing old IE to fall over because Float32Array is undefined
if (typeof window.Float32Array === 'undefined') {
	window.Float32Array = function () {};
}

// ac-eclipse@2.2.0

},{}],137:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getDimensions = require('@marcom/ac-dom-metrics/getDimensions');
var splitUnits = require('./splitUnits');

/** @ignore */
var percentagePropToDimention = {
	translateX: 'width',
	translateY: 'height'
};

/**
 * @name TransformMatrix
 * @class
 *
 * @desc TransformMatrix is a sort of wrapper for ac-transform. It takes an object
 *       of styles and applies them to an instance of Transform
 *
 * @param {Transform} transform
 *        An instance of ac-transform.Transform.
 *
 * @param {Element} el
 *        The element to use to get dimentions from when using %.
 *
 * @param {Object} styles
 *        An object containing css transform partial properties, e.g. translateX.
 */
function TransformMatrix(transform, el, styles) {
	this._transform = transform;
	var split;
	var value;
	var prop;
	for (prop in styles) {
		if (styles.hasOwnProperty(prop) && typeof this._transform[prop] === 'function') {
			split = splitUnits(styles[prop]);
			if (split.unit === '%') {
				value = this._convertPercentToPixelValue(prop, split.value, el);
			} else {
				value = split.value;
			}
			this._transform[prop].call(this._transform, value);
		}
	}
}

var proto = TransformMatrix.prototype;

/**
 * @name TransformMatrix#_convertPercentToPixelValue
 * @function
 * @private
 *
 * @param {String} prop
 * @param {Number} value
 * @param {Element} el
 *
 * @return {Number}
 */
/** @ignore */
proto._convertPercentToPixelValue = function (prop, value, el) {
	prop = percentagePropToDimention[prop];
	var dimentions = getDimensions(el);

	if (dimentions[prop]) {
		value *= 0.01;
		return dimentions[prop] * value;
	}

	return value;
};

/**
 * @name TransformMatrix#toArray
 * @function
 *
 * @desc Returns the transform matrix as an Array.
 *
 * @returns {Array}
 */
proto.toArray = function () {
	return this._transform.toArray();
};

/**
 * @name TransformMatrix#toCSSString
 * @function
 *
 * @desc Returns the transform matrix as a CSS compatible string.
 *
 * @returns {String}
 */
proto.toCSSString = function () {
	return this._transform.toCSSString();
};

module.exports = TransformMatrix;

// ac-eclipse@2.2.0

},{"./splitUnits":143,"@marcom/ac-dom-metrics/getDimensions":6}],138:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name convertToStyleObject
 * @function
 *
 * @desc Convert a transitional styles object into actual CSS styles.
 *
 * @param {Object} target
 *        The object of transitional style properties to convert.
 *
 * @returns {Object} An object containing CSS styles.
 */
module.exports = function convertToStyleObject(target) {
	var styles = {};
	var matrix;
	var prop;
	for (prop in target) {
		if (target.hasOwnProperty(prop) && target[prop] !== null) {
			if (target[prop].isColor) {
				if (target[prop].isRgb) {
					styles[prop] = 'rgb(' + Math.round(target[prop].r) + ', ' +
											Math.round(target[prop].g) + ', ' +
											Math.round(target[prop].b) + ')';

				} else if (target[prop].isRgba) {
					styles[prop] = 'rgba(' + Math.round(target[prop].r) + ', ' +
											Math.round(target[prop].g) + ', ' +
											Math.round(target[prop].b) + ', ' +
											target[prop].a + ')';
				}

			} else if (prop === 'transform') {
				matrix = (target[prop].length === 6) ? 'matrix' : 'matrix3d';
				styles[prop] = matrix + '(' + target[prop].join(',') + ')';

			} else if (!target[prop].unit) {
				styles[prop] = target[prop].value;

			} else {
				styles[prop] = target[prop].value + target[prop].unit;
			}
		}
	}
	return styles;
};

// ac-eclipse@2.2.0

},{}],139:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyle = require('@marcom/ac-dom-styles/getStyle');
var clone = require('@marcom/ac-object/clone');
var splitUnits = require('./splitUnits');
var toCamCase = require('./toCamCase');

/** @ignore */
var Color = require('@marcom/ac-color').Color;
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');
var Transform = require('@marcom/ac-transform').Transform;
var TransformMatrix = require('./TransformMatrix');

// takes a color (hex, color name (e.g. red) etc)
// and returns an rgb/rgba object
var toColorObject = function (color) {
	if (Color.isRgba(color)) {
		color = new Color(color).rgbaObject();
		color['isRgba'] = true;
	} else {
		color = new Color(color).rgbObject();
		color['isRgb'] = true;
	}
	color['isColor'] = true;
	return color;
};

var convertRgbToRgbaObject = function (obj) {
	if (obj.isRgb) {
		obj.isRgb = false;
		obj.isRgba = true;
		obj.a = 1;
	}
};

var standardizeColors = function (target, propsFrom, propsTo) {
	if (target.isRgba || propsFrom.isRgba || propsTo.isRgba) {
		convertRgbToRgbaObject(target);
		convertRgbToRgbaObject(propsFrom);
		convertRgbToRgbaObject(propsTo);
	}
};

var convertMatrixTo3d = function (matrix) {
	return [matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1];
};

var standardizeMatrices = function (target, propsFrom, propsTo) {
	if (target['transform'].length === 16 ||
		propsFrom['transform'].length === 16 ||
		propsTo['transform'].length === 16) {

		if (target['transform'].length === 6) {
			target['transform'] = convertMatrixTo3d(target['transform']);
		}
		if (propsFrom['transform'].length === 6) {
			propsFrom['transform'] = convertMatrixTo3d(propsFrom['transform']);
		}
		if (propsTo['transform'].length === 6) {
			propsTo['transform'] = convertMatrixTo3d(propsTo['transform']);
		}
	}
};

/**
 * @name convertToTransitionableObjects
 * @function
 *
 * @desc Converts objects containing CSS styles into objects that ac-clip.Clip can use / transition.
 *
 * @param {Element} el
 *        The element that will be used to get inital / target styles (the element that will be transitioned).
 *
 * @param {Object} propsTo
 *        The CSS styles that will be transitioned to.
 *
 * @param {Object} propsFrom
 *        The CSS styles that will be a start state when the clip starts. Defaults to the current styles of el.
 *
 * @returns {Object} An object containing transitionable styles broken into target, propsTo and propsFrom.
 */
module.exports = function convertToTransitionableObjects(el, propsTo, propsFrom) {

	var target = {};
	propsTo = clone(propsTo, true);
	propsFrom = clone(propsFrom, true);

	var style;
	var mTarget;
	var mTo;
	var mFrom;
	var isTransformSupported = cssPropertyAvailable('transform');

	var prop;
	// first loop through each propTo value
	for (prop in propsTo) {
		if (propsTo.hasOwnProperty(prop) && propsTo[prop] !== null) {
			if (prop === 'transform') {
				if (isTransformSupported) {
					// Transform is a JS implementation of the CSS3-Transforms spec
					mTarget = new Transform();
					style = getStyle(el, 'transform')['transform'] || 'none';
					mTarget.setMatrixValue(style);
					// if transform should be relative use mTarget.clone() instead of new Transform()
					mTo = new TransformMatrix(new Transform(), el, propsTo[prop]);
				}

				if (mTo && mTo.toCSSString() !== mTarget.toCSSString()) {
					mFrom = new TransformMatrix(propsFrom[prop] ? new Transform() : mTarget.clone(), el, propsFrom[prop]);
					target[prop] = mTarget.toArray();
					propsTo[prop] = mTo.toArray();
					propsFrom[prop] = mFrom.toArray();
				} else {
					// transforms not supported
					target[prop] = null;
					propsTo[prop] = null;
				}

			} else {
				style = getStyle(el, prop)[toCamCase(prop)] || propsFrom[prop];
				if (Color.isColor(style)) {
					// for colors convert to RGB and use an object
					target[prop] = toColorObject(style);
					propsFrom[prop] = (propsFrom[prop] !== undefined) ? toColorObject(propsFrom[prop]) : clone(target[prop], true);
					propsTo[prop] = toColorObject(propsTo[prop]);

				} else {
					// splitUnits takes a CSS value (e.g. 10px) and breaks it into an object ({ value:10, unit:'px' })
					target[prop] = splitUnits(style);
					propsFrom[prop] = (propsFrom[prop] !== undefined) ? splitUnits(propsFrom[prop]) : clone(target[prop], true);
					propsTo[prop] = splitUnits(propsTo[prop]);
				}
			}
		}
	}

	// next we loop through propsFrom and if a propsFrom doesn't have a propsTo we add propsTo to match the current state of target
	for (prop in propsFrom) {
		if (propsFrom.hasOwnProperty(prop) && propsFrom[prop] !== null && (propsTo[prop] === undefined || propsTo[prop] === null)) {
			if (prop === 'transform') {
				if (isTransformSupported) {
					// Transform is a JS implementation of the CSS3-Transforms spec
					mTarget = new Transform();
					mTarget.setMatrixValue(getComputedStyle(el).transform || getComputedStyle(el).webkitTransform || 'none');
					// if transform should be relative use mTarget.clone() instead of new Transform()
					mFrom = new TransformMatrix(new Transform(), el, propsFrom[prop]);
				}
				if (mFrom && mFrom.toCSSString() !== mTarget.toCSSString()) {
					mTo = new TransformMatrix(mTarget.clone());
					target[prop] = mTarget.toArray();
					propsTo[prop] = mTo.toArray();
					propsFrom[prop] = mFrom.toArray();
				} else {
					// transforms not supported
					target[prop] = null;
					propsTo[prop] = null;
					propsFrom[prop] = null;
				}
			} else {
				style = getStyle(el, prop)[toCamCase(prop)];
				if (Color.isColor(style)) {
					// for colors convert to RGB and use an object
					target[prop] = toColorObject(style);
					propsTo[prop] = clone(target[prop], true);
					propsFrom[prop] = toColorObject(propsFrom[prop]);

				} else {
					// splitUnits takes a CSS value (e.g. 10px) and breaks it into an object ({ value:10, unit:'px' })
					target[prop] = splitUnits(style);
					propsFrom[prop] = splitUnits(propsFrom[prop]);
					propsTo[prop] = clone(target[prop], true);
				}
			}
		}

		// as we loop through all the properties here and we're done manipulating
		// them we can ensure color objects match (as in all rgb or all rgba)
		if (target[prop] && target[prop].isColor) {
			standardizeColors(target[prop], propsFrom[prop], propsTo[prop]);
		}
	}

	if (target['transform']) {
		standardizeMatrices(target, propsFrom, propsTo);
	}

	return {
		target: target,
		propsTo: propsTo,
		propsFrom: propsFrom
	};
};

// ac-eclipse@2.2.0

},{"./TransformMatrix":137,"./splitUnits":143,"./toCamCase":144,"@marcom/ac-color":56,"@marcom/ac-dom-styles/getStyle":27,"@marcom/ac-feature/cssPropertyAvailable":95,"@marcom/ac-object/clone":96,"@marcom/ac-transform":123}],140:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name getShorthandTransition
 * @function
 *
 * @desc Converts an object containing longhand CSS transition properties into a shorthand string.
 *
 * @param {Object} styles
 *        An object containing longhand CSS transition properties:
 *        transitionProperty, transitionDuration, transitionTimingFunction, transitionDelay.
 *
 * @returns {String} Transition properties as shorthand.
 */
module.exports = function getShorthandTransition(styles) {
	if (styles.transitionProperty) {
		var transition = '';
		var props = styles.transitionProperty.split(', ');
		var duration = styles.transitionDuration.split(', ');
		var ease = styles.transitionTimingFunction.replace(/\d+[,]+[\s]/gi, function (match) {
			return match.substr(0, match.length - 1);
		}).split(', ');
		var delay = styles.transitionDelay.split(', ');

		var i = props.length;
		while (i--) {
			transition += props[i] + ' ' + duration[i] + ' ' + ease[i] + ' ' + delay[i] + ', ';
		}

		return transition.substr(0, transition.length - 2);
	}

	return false;
};

// ac-eclipse@2.2.0

},{}],141:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name isCssCubicBezierString
 * @function
 *
 * @desc Returns a boolean depending if a string starts with 'cubic-bezier('.
 *       Essentially, is an easing string cubic-bezier or predefined easing name like 'ease-out'.
 *
 * @param {String} str
 *        An easing string (e.g. 'ease-out' or 'cubic-bezier(...)'.
 *
 * @returns {Boolean} `true` if the string starts with 'cubic-bezier(', else `false`
 */
module.exports = function isCssCubicBezierString(str) {
	return typeof str === 'string' && str.substr(0, 13) === 'cubic-bezier(';
};

// ac-eclipse@2.2.0

},{}],142:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var setStyle = require('@marcom/ac-dom-styles/setStyle');
var getStyle = require('@marcom/ac-dom-styles/getStyle');
var getShorthandTransition = require('./getShorthandTransition');


/**
 * @name removeTransitions
 * @function
 *
 * @desc Removes any CSS transitions that already exist for properties that
 *       will be transitioned using Clip.
 *
 * @param {Element} el
 *        The element from which to get the CSS transition property.
 *
 * @param {Object} propsTo
 *        An object containing which properties will be transitioned / removed.
 */
module.exports = function removeTransitions(el, propsTo) {
	var transition = getStyle(el,
		'transition',
		'transition-property',
		'transition-duration',
		'transition-timing-function',
		'transition-delay'
	);
	// ac_dom_styles returns an object, if transition is undefined then instead get shorthand transitions
	transition = transition.transition || getShorthandTransition(transition);

	if (transition && transition.length) {
		transition = transition.split(',');
		var deleteCount = 0;
		var prop;
		var i = transition.length;
		while (i--) {
			prop = transition[i].trim().split(' ')[0];
			if (propsTo[prop] !== undefined) {
				transition.splice(i, 1);
				++deleteCount;
			}
		}
		if (deleteCount) {
			if (transition.length === 0) {
				transition = ['all'];
			}
			setStyle(el, {
				'transition': transition.join(',').trim()
			});
		}
	}
};

// ac-eclipse@2.2.0

},{"./getShorthandTransition":140,"@marcom/ac-dom-styles/getStyle":27,"@marcom/ac-dom-styles/setStyle":29}],143:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name splitUnits
 * @function
 *
 * @desc Takes a value with units and splits it into an object.
 *       E.g. '10px' becomes the object { value:10, units:'px' }
 *
 * @param {String} value
 *        The value to be converted into an object, e.g. '10px'.
 *
 * @returns {Object} The return object, contains 'value' and 'units'
 *                   e.g. { value:10, units:'px' }.
 */
module.exports = function splitUnits(value) {

	value = String(value);
	if (value.indexOf(' ') > -1) {
		throw new Error('Shorthand CSS is not supported. Please use longhand CSS only.');
	}

	var regex = /(\d*\.?\d*)(.*)/;
	var multipler = 1;

	if (value && value.substr(0, 1) === '-') {
		// if the value is negative
		value = value.substr(1);
		multipler = -1;
	}

	var match = String(value).match(regex);

	return {
		value: Number(match[1]) * multipler,
		unit: match[2]
	};
};

// ac-eclipse@2.2.0

},{}],144:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name toCamCase
 * @function
 *
 * @desc Simply converts a dash seperated string to camel case.
 *       E.g. background-color becomes backgroundColor
 *
 * @param {String} str
 *        Input string, e.g. background-color
 *
 * @returns {String} Output string, e.g. backgroundColor.
 */
module.exports = function toCamCase(str) {

	var camelCaseReplace = function (match, group, offset, string) {
		return (offset === 0) && (string.substr(1, 3) !== 'moz') ? group : group.toUpperCase();
	};

	return str.replace(/-(\w)/g, camelCaseReplace);
};

// ac-eclipse@2.2.0

},{}],145:[function(require,module,exports){
'use strict';

var transitionEnd;

/* From Modernizr */
module.exports = (function transitionEndEvent() {

	if (transitionEnd) {
		return transitionEnd;
	}

	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'transition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'MozTransition': 'transitionend',
		'WebkitTransition': 'webkitTransitionEnd'
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			transitionEnd = transitions[t];
			return transitionEnd;
		}
	}
})();

// ac-eclipse@2.2.0

},{}],146:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var PageVisibilityManager = require('@marcom/ac-page-visibility').PageVisibilityManager;

/**
 * @name waitAnimationFrames
 * @function
 *
 * @desc Waits n amount of animation frames before triggering a callback function.
 *       This exists because when applying CSS styles to dom elements in certain
 *       browsers it takes more than one requestAnimationFrame to apply the styles.
 *       The issue is when using CSS transition - if you need to set an initial state
 *       and then animate to an end start using CSS transitions you need to wait 2
 *       frames otherwise the browser will animate to the initial state.
 *
 * @param {Function} callback
 *        The function to be called.
 *
 * @param {Number} frames
 *        The amount of frames to wait until triggering the callback.
 */
module.exports = function waitAnimationFrames(callback, frames) {
	if (frames) {
		var rAF = function (cb) {
			if (PageVisibilityManager.isHidden) {
				setTimeout(cb, 16);
			} else {
				window.requestAnimationFrame(cb);
			}
		};
		var count = 0;
		var waitFunc = function () {
			if (count === frames) {
				callback.call(this);
			} else {
				++count;
				rAF(waitFunc);
			}
		};
		waitFunc();
	} else {
		callback.call(this);
	}
};

// ac-eclipse@2.2.0

},{"@marcom/ac-page-visibility":99}],147:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var create = require('@marcom/ac-object/create');

/** @ignore */
var Clip = require('@marcom/ac-clip').Clip;
var TimelineClip = require('./TimelineClip');
var TimelineCallback = require('./TimelineCallback');
var TimelineItemList = require('./TimelineItemList');

var superProto = Clip.prototype;

/**
 * @extends {Clip}
 * @param options
 * @constructor
 */
function Timeline(options) {
	options = options || {};
	options.ease = options.ease || 'linear';
	options.destroyOnComplete = false;
	this.options = options;

	Clip.call(this, {t:0}, 0, {t:1}, options);

	/**
	 * @type {TimelineItemList}
	 * @private
	 */
	this._itemList = new TimelineItemList();
}

/** @lends {Timeline.prototype} */
var proto = Timeline.prototype = create(superProto);
Timeline.prototype.constructor = Timeline;

/**
 * @inheritDoc
 */
proto._update = function (evt) {
	superProto._update.call(this, evt);
	this._render();
};

/**
 * @inheritDoc
 */
proto.progress = function (progress) {
	superProto.progress.call(this, progress);

	if (progress !== undefined) {
		this._render();
	}

	return this._progress;
};

/**
 * Draws all our clips where they should be in their own local time
 */
proto._render = function () {
	if (this._itemList.length === 0) {
		return;
	}

	var renderTime = this._target.t * this._duration;

	var aClip = this._itemList.head;
	var next = aClip;
	while (next) {
		next = aClip.next;

		var offsetTime = (renderTime - aClip.position);
		aClip.currentTime(offsetTime);

		aClip = next;
	}
};

/**
 * @param {Clip} clip
 * @param {Number=} position Position on the timeline, in seconds
 */
proto.addClip = function (clip, position) {
	position = (position === undefined) ? this.duration() : position;
	var builtInDelay = clip._delay/1000;
	this._itemList.append(new TimelineClip(clip, position+builtInDelay));
	this._updateDuration();
};


/**
 *
 * @param {function} fn
 * @param position
 */
proto.addCallback = function (fn, position) {
	position = (position === undefined) ? this.duration() : position;
	this._itemList.append(new TimelineCallback(fn, position));
	this._updateDuration();
};

/**
 * Removes a clip or callback from the timeline
 * @param {Clip|function} clipOrFunction
 */
proto.remove = function (clipOrFunction) {
	var item = this._itemList.getItem(clipOrFunction);
	if (item) {
		this._itemList.remove(item);
		this._updateDuration();
	}
};

/**
 * Called when clips are added/removed - updates our duration (
 * @private
 */
proto._updateDuration = function () {
	var lastClip = this._itemList.head;
	var duration = lastClip.position + lastClip.duration();

	this._itemList.forEach(function (clip) {
		var newDuration = clip.position + clip.duration();
		// clip extends beyond our current 'last' item
		if (newDuration >= duration) {
			lastClip = clip;
			duration = newDuration;
		}
	});

	this.duration(duration);
};

/**
 * Removes this timeline and all it's containing clips
 * @returns {Timeline}
 */
proto.destroy = function () {
	var next = this._itemList.head;
	while (next) {
		var timelineClip = next;
		next = timelineClip.next;
		this._itemList.remove(timelineClip);
	}

	this._duration = 0;

	return superProto.destroy.call(this);
};


module.exports = Timeline;

// ac-eclipse@2.2.0

},{"./TimelineCallback":148,"./TimelineClip":149,"./TimelineItemList":150,"@marcom/ac-clip":54,"@marcom/ac-object/create":97}],148:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * A callback that will be fired a specific time in the Timeline
 * @param {function} fn		The callback
 * @param {number} position	Position on the timeline in seconds
 * @constructor
 */
function TimelineCallback(fn, position) {
	/**
	 * @type {Function}
	 */
	this.callback = fn;

	/**
	 * Required to match clip API, always zero
	 * @type {number}
	 */
	this._delay = 0;

	/**
	 * Position on the timeline in seconds
	 * @type {number}
	 * @private
	 */
	this.position = position;

	/**
	 * True after the element is
	 * @type {boolean}
	 * @private
	 */
	this._hasTriggered = false;

	/** @type {TimelineClip|TimelineCallback} */
	this.prev = null;

	/** @type {TimelineClip|TimelineCallback} */
	this.next = null;

}
 /** @lends {TimelineClip#} */
var proto = TimelineCallback.prototype;

/**
 * Exist to match the expected interface, but always returns zero
 * @returns {number}
 */
proto.duration = function () {
	return 0;
};

/**
 * Triggers the callback if the playhead has passed it's position
 * @param {number} offsetTime	The time relative to our position in the timeline;
 * @returns {Number} Callbacks do not have progress, always returns 0
 */
proto.currentTime = function (offsetTime) {
	// playhead has past our position, but not triggered yet
	if (offsetTime >= 0 && !this._hasTriggered) {
		this.callback();
		this._hasTriggered = true;
	}

	// playhead has past our position going backward but not triggered yet
	if (offsetTime < 0 && this._hasTriggered) {
		this.callback();
		this._hasTriggered = false;
	}

	return 0;
};

module.exports = TimelineCallback;

// ac-eclipse@2.2.0

},{}],149:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * A callback that will be fired a specific time in the Timeline
 * @param {ClipInlineCss|ClipTransitionCss|ClipEasing} clip
 * @param {number} position	Position on the timeline in seconds
 * @constructor
 */
function TimelineClip(clip, position) {
	/**
	 * @type {Function}
	 * @public
	 */
	this.clip = clip;
	/**
	 * Position on the timeline in seconds
	 * @type {number}
	 */
	this.position = position;

	/**
	 * @param {number} time
	 * @returns {number}
	 */
	this.duration = this.clip.duration.bind(this.clip);

	/** @type {number} */
	this.lastProgress = -1;

	/** @type {TimelineClip|TimelineCallback} */
	this.prev = null;

	/** @type {TimelineClip|TimelineCallback} */
	this.next = null;
}

/** @lends {TimelineClip#} */
var proto = TimelineClip.prototype;

/**
 * Triggers the callback if the playhead has passed it's position
 * @param {number} offsetTime	The time relative to our position in the timeline;
 * @returns {Number} Callbacks do not have progress, always returns 0
 */
proto.currentTime = function (offsetTime) {
	var clampedProgress = Math.min(1, Math.max(0, offsetTime/this.clip._duration));

	// if duration is zero, clampedProgress is NaN - set to 1
	if(clampedProgress !== clampedProgress) {
		clampedProgress = 1;
	}

	// do nothing if time has not changed
	if(this.lastProgress === clampedProgress) {
		return this.lastProgress;
	}

	////// ON START
	// Leaving zero, or coming to zero - call on start
	if(this.lastProgress === 0 || clampedProgress === 0 || this.lastProgress === -1) {
		if(this.clip._storeOnStart) {
			this.clip._storeOnStart(this.clip);
		}
	}


	////// ON COMPLETE
	// Clips fire onComplete only when `_playing` is true, and it hits the end of the animation
	this.clip._playing = (clampedProgress * this.clip._duration === this.clip._duration);

	this.lastProgress = this.clip.progress(clampedProgress);

	return this.lastProgress;
};


proto.destroy = function() {
	this.clip.destroy();
	this.prev = null;
	this.next = null;
	this.duration = null;
};

module.exports = TimelineClip;

// ac-eclipse@2.2.0

},{}],150:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var TimelineClip = require('./TimelineClip');
var TimelineCallback = require('./TimelineCallback');

/**
 * A linked list implementation for managing {Clip|Callback} instances
 * The {Clip} class acts as a node, with prev / next properties
 * Supports O(1) addition, and O(1) removal
 * @constructor
 */
var TimelineItemList = function () {
	/** @type {TimelineClip|TimelineCallback} */
	this.head = null;
	/** @type {TimelineClip|TimelineCallback} */
	this.tail = null;
	/** @type {number} */
	this.length = 0;
};

/** @lends {TimelineItemList.prototype} */
var proto = TimelineItemList.prototype;

/**
 * Adds an node to the back of the list
 * @param {TimelineClip|TimelineCallback} clip
 */
proto.append = function (clip) {
	clip.prev = null;
	clip.next = null;

	if (this.tail) {
		this.tail.next = clip;
		clip.prev = this.tail;
	} else {
		this.head = clip;
	}

	this.tail = clip;

	this.length++;
};

/**
 * Removes a given node
 * @param {TimelineClip|TimelineCallback} clip
 */
proto.remove = function (clip) {

	if (clip === this.head) { // It was the head, make the head point to head.next
		this.head = this.head.next;
	} else if (clip === this.tail) { // It was the tail, make the tail point to tail.prev
		this.tail = this.tail.prev;
	}

	// make node.prev.next point to nodes.next instead of node
	if (clip.prev) {
		clip.prev.next = clip.next;
	}

	// make node.next.prev point to node.prev instead of node
	if (clip.next) {
		clip.next.prev = clip.prev;
	}

	clip.next = clip.prev = null;

	if (this.head === null) {
		this.tail = null;
	}

	this.length--;
};

/**
 * Returns an item from our list,
 * @param clipOrFunction
 * @returns {TimelineClip|TimelineCallback}
 */
proto.getItem = function (clipOrFunction) {
	var next = this.head;
	while (next) {
		var item = next;

		// If it's a TimelineClip check .clip ref, if it's a TimelineCallback check .callback ref
		if ((item instanceof TimelineClip && item.clip === clipOrFunction) || (item instanceof TimelineCallback && item.callback === clipOrFunction)) {
			return item;
		}
		next = item.next;
	}

	return null;
};

/**
 * Performs a callback on each node, with the signature (node, i, length)
 * @param {function} callback
 */
proto.forEach = function (callback) {
	var i = 0;
	var next = this.head;

	while (next) {
		var clip = next;
		callback(clip, i, this.length);
		next = clip.next;
	}
};

/**
 * Removes all nodes from the linked list
 */
proto.destroy = function () {
	while (this.head) {
		var item = this.head;
		this.remove(item);
		item.destroy();
	}
};

module.exports = TimelineItemList;

// ac-eclipse@2.2.0

},{"./TimelineCallback":148,"./TimelineClip":149}],151:[function(require,module,exports){
/** 
 * @module ac-array
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	flatten:      require('./flatten'),
	intersection: require('./intersection'),
	shuffle:      require('./shuffle'),
	toArray:      require('./toArray'),
	union:        require('./union'),
	unique:       require('./unique'),
	without:      require('./without')
};

// ac-array@1.2.1

},{"./flatten":152,"./intersection":153,"./shuffle":154,"./toArray":155,"./union":156,"./unique":157,"./without":158}],152:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/isArray');
require('@marcom/ac-polyfills/Array/prototype.forEach');

/**
 * @name module:ac-array.flatten
 *
 * @function
 *
 * @desc Take a multi-dimensional array and flatten it into a single level.
 *
 * @param {Array} array
 *        Take a multi-dimensional array and flatten it into a single level
 *
 * @returns {Array} Flattened array.
 */
module.exports = function flatten (array) {
	var flattenedArray = [];
	var callback = function (item) {
		if (Array.isArray(item)) {
			item.forEach(callback);
		} else {
			flattenedArray.push(item);
		}
	};
	array.forEach(callback);
	return flattenedArray;
};

// ac-array@1.2.1

},{"@marcom/ac-polyfills/Array/isArray":383,"@marcom/ac-polyfills/Array/prototype.forEach":386}],153:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/prototype.indexOf');

/**
 * @name module:ac-array.intersection
 *
 * @function
 *
 * @desc Produce an array that contains every item shared between all the passed-in arrays.
 *       Based on: https://github.com/jashkenas/underscore/blob/master/underscore.js#L525
 *
 * @param {...Array} array
 *        Any number of arrays
 *
 * @returns {Array} An empty array if no matches or an array containing all matches.
 */
module.exports = function intersection (array) {
	// If nothing was passed return an empty array
	if (!array) {
		return [];
	}
	var argsLength = arguments.length;
	var i = 0;
	var len = array.length;
	var result = [];
	var item;

	for(i; i < len; i++) {
		item = array[i];

		// If item has already been pushed continue on to the next iteration
		if (result.indexOf(item) > -1) {
			continue;
		}

		// If the item does not exist in the arguments index break;
		for(var j = 1; j < argsLength; j++) {
			if (arguments[j].indexOf(item) < 0) {
				break;
			}
		}

		// If all arguments have been matched push the item into the result
		if (j === argsLength) {
			result.push(item);
		}
	}

	return result;
};

// ac-array@1.2.1

},{"@marcom/ac-polyfills/Array/prototype.indexOf":387}],154:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-array.shuffle
 *
 * @function
 *
 * @desc Shuffle the elements in an array using the Fisher–Yates/Knuth algorithm
 *
 * @see {@link http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle|Fisher-Yates shuffle - Wikipedia, the free encyclopedia}
 *
 * @param {Array} array
 *
 * @returns {Array} original array with shuffled elements
 *
 */
module.exports = function shuffle (array) {
  var len = array.length;
  var index;
  var temp;

  while (len) {
	index = Math.floor(Math.random() * len--);
	temp = array[len];
	array[len] = array[index];
	array[index] = temp;
  }

  return array;
};

// ac-array@1.2.1

},{}],155:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/prototype.slice');

/**
 * @name module:ac-array.toArray
 *
 * @function
 *
 * @desc Take an Array-like object and convert it to an actual Array.
 *
 * @param {Object} arrayLike
 *        Take an Array-like object and convert it to an actual Array
 *        (for instance a NodeList)
 *
 * @returns {Array} Generated array from object.
 */
module.exports = function toArray (arrayLike) {
	return Array.prototype.slice.call(arrayLike);
};

// ac-array@1.2.1

},{"@marcom/ac-polyfills/Array/prototype.slice":389}],156:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var flatten = require('./flatten');
var toArray = require('./toArray');
var unique = require('./unique');

/**
 * @name module:ac-array.union
 *
 * @function
 *
 * @desc Creates a union of unique values of the provided arrays.
 *
 * @param {...Array} array
 *        The array(s) to create a union of
 *
 * @returns {Array} An array containing the union of the provided arrays.
 */
module.exports = function union (array) {
	return unique(flatten(toArray(arguments)));
};

// ac-array@1.2.1

},{"./flatten":152,"./toArray":155,"./unique":157}],157:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/prototype.indexOf');
require('@marcom/ac-polyfills/Array/prototype.reduce');

/**
 * @name module:ac-array.unique
 *
 * @function
 *
 * @desc Takes an array containing duplicates and returns a new
 *       array containing only unique values.
 *
 * @param {Array} array
 *        An array containing duplicate values
 *
 * @returns {Array} An array containing only unique values.
 */
module.exports = function unique (array) {
	var _unique = function(prev, current) {
		if (prev.indexOf(current) < 0) {
			prev.push(current);
		}
		return prev;
	};
	return array.reduce(_unique, []);
};

// ac-array@1.2.1

},{"@marcom/ac-polyfills/Array/prototype.indexOf":387,"@marcom/ac-polyfills/Array/prototype.reduce":388}],158:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/Array/prototype.indexOf');
require('@marcom/ac-polyfills/Array/prototype.slice');

/**
 * @name module:ac-array.without
 *
 * @function
 *
 * @desc Removes an entry from an array.
 *
 * @param {Array} arr
 *        Source array
 *
 * @param {*} value
 *        Entry in array to remove
 *
 * @returns {Array} A new array that is the source array without the first
 *                  instance of the value provided.
 */
module.exports = function without (arr, value, recurse) {
	var newArr;
	var index = arr.indexOf(value);
	var length = arr.length;

	if (index >= 0) {

		// iterating through the array will be faster than calling .without() over and over
		if(recurse) {
			// clone the arr to newArr
			newArr = arr.slice(0, length);
			// start at the first index and continue
			var i,
				amountRemoved = 0;
			for (i = index; i < length; i++) {
				// if the value matches, remove it from the newArr
				if (arr[ i ] === value) {
					newArr.splice(i - amountRemoved, 1);
					// add one to the amountRemoved to handle the difference between arr and newArr
					amountRemoved++;
				}
			}

		// If it’s the last item
		} else if (index === (length - 1)) {
			newArr = arr.slice(0, (length - 1));

		// If it’s the first item
		} else if (index === 0) {
			newArr = arr.slice(1);

		// If it’s in the middle
		} else {
			newArr = arr.slice(0, index);
			newArr = newArr.concat(arr.slice(index + 1));
		}

	} else {
		return arr;
	}

	return newArr;
};

// ac-array@1.2.1

},{"@marcom/ac-polyfills/Array/prototype.indexOf":387,"@marcom/ac-polyfills/Array/prototype.slice":389}],159:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var addEventListenerUtil = require('./utils/addEventListener');
var getEventType = require('./shared/getEventType');

/**
 * @name module:ac-dom-events.addEventListener
 *
 * @function
 *
 * @desc Register the specified listener on a target.
 *       Automatically handles vendor prefixed and camel-cased event types.
 *
 * @param {Object} target
 *        The event target to listen to.
 *        Usually an Element, document, or window.
 *
 * @param {String} type
 *        A lowercase string representing the event type.
 *        e.g., "click", "transitionend"
 *
 * @param {Function} listener
 *        A Function to be called when the event type is triggered.
 *
 * @param {Boolean} [useCapture=false]
 *        `true` listens for the event in the capture phase.
 *        `false` (default) listens for the event in the bubbling phases.
 *        IE < 9 does not support useCapture
 *
 * @returns {Object} target
 */
module.exports = function addEventListener(target, type, listener, useCapture) {
	type = getEventType(target, type);
	return addEventListenerUtil(target, type, listener, useCapture);
};

// ac-dom-events@1.4.1

},{"./shared/getEventType":169,"./utils/addEventListener":173}],160:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var dispatchEventUtil = require('./utils/dispatchEvent');
var getEventType = require('./shared/getEventType');

/**
 * @name module:ac-dom-events.dispatchEvent
 *
 * @function
 *
 * @desc Creates and dispatches an Event on a target.
 *       Note: custom events on `window` are not supported in IE < 9
 *
 * @param {Object} target
 *        The event target.
 *        Usually an Element, document, or window.
 *
 * @param {String} type
 *        A lowercase string representing the event type to dispatch.
 *        Automatically handles vendor prefixed and camel-cased event types.
 *
 * @param {Object} [options]
 *
 * @param {Boolean} [options.bubbles=false]
 *        Whether or not the event bubbles up through the DOM.
 *        IE < 9 ignores this options, using the `true` behavior.
 *
 * @param {Boolean} [options.cancelable=false]
 *        Whether or not the event can be cancelled.
 *        IE < 9 ignores this options, using the `false` behavior.
 *
 * @param {*} [options.detail]
 *        The data passed to event listeners.
 *
 * @returns {Object} target
 */
module.exports = function dispatchEvent(target, type, options) {
	type = getEventType(target, type);
	return dispatchEventUtil(target, type, options);
};

// ac-dom-events@1.4.1

},{"./shared/getEventType":169,"./utils/dispatchEvent":174}],161:[function(require,module,exports){
/**
 * Helper methods for handling DOM events with cross-browser compatibility.
 * @module ac-dom-events
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	addEventListener: require('./addEventListener'),
	dispatchEvent: require('./dispatchEvent'),
	preventDefault: require('./preventDefault'),
	removeEventListener: require('./removeEventListener'),
	stop: require('./stop'),
	stopPropagation: require('./stopPropagation'),
	target: require('./target')
};

// ac-dom-events@1.4.1

},{"./addEventListener":159,"./dispatchEvent":160,"./preventDefault":167,"./removeEventListener":168,"./stop":170,"./stopPropagation":171,"./target":172}],162:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var eventTypeAvailable = require('./utils/eventTypeAvailable');
var camelCasedEventTypes = require('./shared/camelCasedEventTypes');
var windowFallbackEventTypes = require('./shared/windowFallbackEventTypes');
var prefixHelper = require('./shared/prefixHelper');
var cache = {};

/**
 * @name module:ac-prefixer.getEventType
 *
 * @function
 *
 * @desc Get an Event type with appropriate vendor prefix and casing.
 *
 * @param {String} type
 *        A lowercase string representing the Event type.
 *        e.g., "click", "transitionend"
 *
 * @param {String} [tagName="div"]
 *        The Element tag name to test, or "window", or "document"
 *        e.g., "div", "video", "input"
 *
 * @returns {String|Boolean} The properly prefixed Event type, or `false` if not available.
 */
module.exports = function getEventType(type, tagName) {
	var prefixedType;
	var tagNameCache;
	var i;

	tagName = tagName || 'div';

	type = type.toLowerCase();

	// prepare cache
	if (!(tagName in cache)) {
		cache[tagName] = {};
	}

	tagNameCache = cache[tagName];

	// memoized?
	if (type in tagNameCache) {
		return tagNameCache[type];
	}

	// unprefixed?
	if (eventTypeAvailable(type, tagName)) {
		return tagNameCache[type] = type;
	}

	// camelCased vendor prefix?
	if (type in camelCasedEventTypes) {
		for (i = 0; i < camelCasedEventTypes[type].length; i++) {
			prefixedType = camelCasedEventTypes[type][i];
			if (eventTypeAvailable(prefixedType.toLowerCase(), tagName)) {
				return tagNameCache[type] = prefixedType;
			}
		}
	}

	// lowercase vendor prefix?
	for (i = 0; i < prefixHelper.evt.length; i++) {
		prefixedType = prefixHelper.evt[i] + type;
		if (eventTypeAvailable(prefixedType, tagName)) {
			prefixHelper.reduce(i);
			return tagNameCache[type] = prefixedType;
		}
	}

	// fallback to window for certain events
	if (tagName !== 'window' && windowFallbackEventTypes.indexOf(type)) {
		return tagNameCache[type] = getEventType(type, 'window');
	}

	// invalid event type
	return tagNameCache[type] = false;
};

// ac-prefixer@3.1.1

},{"./shared/camelCasedEventTypes":163,"./shared/prefixHelper":164,"./shared/windowFallbackEventTypes":165,"./utils/eventTypeAvailable":166}],163:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
module.exports = {
	transitionend: [
		'webkitTransitionEnd',
		'MSTransitionEnd'
	],
	animationstart: [
		'webkitAnimationStart',
		'MSAnimationStart'
	],
	animationend: [
		'webkitAnimationEnd',
		'MSAnimationEnd'
	],
	animationiteration: [
		'webkitAnimationIteration',
		'MSAnimationIteration'
	],
	fullscreenchange: [
		'MSFullscreenChange'
	],
	fullscreenerror: [
		'MSFullscreenError'
	]
};

// ac-prefixer@3.1.1

},{}],164:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],165:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
module.exports = [
	'transitionend',
	'animationstart',
	'animationend',
	'animationiteration',
];

// ac-prefixer@3.1.1

},{}],166:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var testElements = {
	'window': window,
	'document': document
};

/**
 * @name eventTypeAvailable
 * @memberOf module:ac-prefixer/utils
 *
 * @function
 *
 * @desc Check if an Event type is available.
 *
 * @param {String} type
 *        A DOM-style string representing the Event type.
 *        e.g., "click", "transitionend", "webkittransitionend"
 *
 * @param {String} tagName
 *        The Element tag name to test, or "window", or "document"
 *        e.g., "div", "video", "input"
 *
 * @returns {Boolean} `true` if the Event type is available, otherwise `false`
 */
module.exports = function eventTypeAvailable(type, tagName) {
	var el;

	type = 'on' + type;

	if (!(tagName in testElements)) {
		testElements[tagName] = document.createElement(tagName);
	}

	el = testElements[tagName];

	// easy check first
	if (type in el) {
		return true;
	}

	// more robust check
	if ('setAttribute' in el) {
		el.setAttribute(type, 'return;');
		return (typeof el[type] === 'function');
	}

	// not available by default
	return false;
};

// ac-prefixer@3.1.1

},{}],167:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-events.preventDefault
 *
 * @function
 *
 * @desc Cancels the event if it is cancelable.
 *
 * @param {Event} evt
 */
module.exports = function preventDefault(evt) {
	evt = evt || window.event;

	if (evt.preventDefault) {
		evt.preventDefault();
	} else {
		evt.returnValue = false;
	}
};

// ac-dom-events@1.4.1

},{}],168:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var removeEventListenerUtil = require('./utils/removeEventListener');
var getEventType = require('./shared/getEventType');

/**
 * @name module:ac-dom-events.removeEventListener
 *
 * @function
 *
 * @desc Removes a previously added event listener.
 *       Automatically handles vendor prefixed and camel-cased event types.
 *
 * @param {Object} target
 *        The event target.
 *        Usually an Element, document, or window.
 *
 * @param {String} type
 *        A lowercase string representing the event type.
 *        e.g., "click", "transitionend"
 *
 * @param {Function} listener
 *        The listener Function to be removed.
 *
 * @param {Boolean} [useCapture=false]
 *        `true` for the a listener on the capture phase.
 *        `false` (default) for a listener on the bubbling phases.
 *
 * @returns {Object} target
 */
module.exports = function removeEventListener(target, type, listener, useCapture) {
	type = getEventType(target, type);
	return removeEventListenerUtil(target, type, listener, useCapture);
};

// ac-dom-events@1.4.1

},{"./shared/getEventType":169,"./utils/removeEventListener":175}],169:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getPrefixedEventType = require('@marcom/ac-prefixer/getEventType');

/**
 * @name getEventType
 * @memberOf module:ac-dom-events/shared
 *
 * @function
 * @private
 *
 * @desc Get an Event type with appropriate vendor prefix and casing.
 *
 * @param {Object} target
 *        The event target, usually an Element, document, or window.
 *
 * @param {String} type
 *        A lowercase string representing the Event type.
 *        e.g., "click", "transitionend"
 *
 * @returns {String|Boolean} The properly prefixed Event type
 */
module.exports = function getEventType(target, type) {
	var tagName;
	var prefixed;

	if ('tagName' in target) {
		tagName = target.tagName;
	} else if (target === window) {
		tagName = 'window';
	} else {
		tagName = 'document';
	}

	prefixed = getPrefixedEventType(type, tagName);

	if (prefixed) {
		return prefixed;
	}

	return type;
};

// ac-dom-events@1.4.1

},{"@marcom/ac-prefixer/getEventType":162}],170:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var stopPropagation = require('./stopPropagation');
var preventDefault = require('./preventDefault');

/**
 * @name module:ac-dom-events.stop
 *
 * @function
 *
 * @deprecated since version 1.1.
 *             Use [stopPropagation]{@link module:ac-dom-events.stopPropagation}
 *             and [preventDefault]{@link module:ac-dom-events.preventDefault} instead.
 *
 */
module.exports = function stop(evt) {
	evt = evt || window.event;

	stopPropagation(evt);
	preventDefault(evt);

	evt.stopped = true;
	evt.returnValue = false;
};

// ac-dom-events@1.4.1

},{"./preventDefault":167,"./stopPropagation":171}],171:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-events.stopPropagation
 *
 * @function
 *
 * @desc Prevents further propagation of the current event.
 *
 * @param {Event} evt
 */
module.exports = function stopPropagation(evt) {
	evt = evt || window.event;

	if (evt.stopPropagation) {
		evt.stopPropagation();
	} else {
		evt.cancelBubble = true;
	}
};

// ac-dom-events@1.4.1

},{}],172:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-events.target
 *
 * @function
 *
 * @desc Get the target of an Event.
 *
 * @param {Event} evt
 *
 * @returns {Object} target
 */
module.exports = function target(evt) {
	evt = evt || window.event;
	return (typeof evt.target !== 'undefined') ? evt.target : evt.srcElement;
};

// ac-dom-events@1.4.1

},{}],173:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name addEventListener
 * @memberOf module:ac-dom-events/utils
 *
 * @function
 *
 * @desc Register the specified listener on a target.
 *       Automatically handles vendor prefixed and camel-cased event types.
 *
 * @param {Object} target
 *        The event target to listen to.
 *        Usually an Element, document, or window.
 *
 * @param {String} type
 *        A lowercase string representing the event type.
 *        e.g., "click", "transitionend"
 *
 * @param {Function} listener
 *        A Function to be called when the event type is triggered.
 *
 * @param {Boolean} [useCapture=false]
 *        `true` listens for the event in the capture phase.
 *        `false` (default) listens for the event in the bubbling phases.
 *        IE < 9 does not support useCapture
 *
 * @returns {Object} target
 */
module.exports = function addEventListener(target, type, listener, useCapture) {
	if (target.addEventListener) {
		target.addEventListener(type, listener, !!useCapture);
	} else {
		target.attachEvent('on' + type, listener);
	}

	return target;
};

// ac-dom-events@1.4.1

},{}],174:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/CustomEvent');

/**
 * @name dispatchEvent
 * @memberOf module:ac-dom-events/utils
 *
 * @function
 *
 * @desc Creates and dispatches an Event on a target.
 *       Note: custom events on `window` are not supported in IE < 9
 *
 * @param {Object} target
 *        The event target.
 *        Usually an Element, document, or window.
 *
 * @param {String} type
 *        A String representing the event type to dispatch.
 *
 * @param {Object} [options]
 *
 * @param {Boolean} [options.bubbles=false]
 *        Whether or not the event bubbles up through the DOM.
 *        IE < 9 ignores this options, using the `true` behavior.
 *
 * @param {Boolean} [options.cancelable=false]
 *        Whether or not the event can be cancelled.
 *        IE < 9 ignores this options, using the `false` behavior.
 *
 * @param {*} [options.detail]
 *        The data passed to event listeners.
 *
 * @returns {Object} target
 */
module.exports = function dispatchEvent(target, type, options) {
	var evt;

	if (target.dispatchEvent) {
		// Expects polyfill for CustomEvent constructor
		if (options) {
			evt = new CustomEvent(type, options);
		} else {
			evt = new CustomEvent(type);
		}

		target.dispatchEvent(evt);

	} else {
		evt = document.createEventObject();

		if (options && 'detail' in options) {
			evt.detail = options.detail;
		}

		target.fireEvent('on' + type, evt);
	}

	return target;
};

// ac-dom-events@1.4.1

},{"@marcom/ac-polyfills/CustomEvent":391}],175:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name removeEventListener
 * @memberOf module:ac-dom-events/utils
 *
 * @function
 *
 * @desc Removes a previously added event listener.
 *
 * @param {Object} target
 *        The event target.
 *        Usually an Element, document, or window.
 *
 * @param {String} type
 *        A String representing the event type.
 *        e.g., "click", "transitionend"
 *
 * @param {Function} listener
 *        The listener Function to be removed.
 *
 * @param {Boolean} [useCapture=false]
 *        `true` for the a listener on the capture phase.
 *        `false` (default) for a listener on the bubbling phases.
 *
 * @returns {Object} target
 */
module.exports = function removeEventListener(target, type, listener, useCapture) {
	if (target.removeEventListener) {
		target.removeEventListener(type, listener, !!useCapture);
	} else {
		target.detachEvent('on' + type, listener);
	}

	return target;
};

// ac-dom-events@1.4.1

},{}],176:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],177:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],178:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],179:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.DOCUMENT_TYPE_NODE
 *
 * @constant
 *
 * @desc nodeType value for DocumentType
 */
module.exports = 10;

// ac-dom-nodes@1.7.0

},{}],180:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],181:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],182:[function(require,module,exports){
/**
 * Utility methods dealing with the DOM
 * @module ac-dom-nodes
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	createDocumentFragment: require('./createDocumentFragment'),
	filterByNodeType: require('./filterByNodeType'),
	hasAttribute: require('./hasAttribute'),
	indexOf: require('./indexOf'),
	insertAfter: require('./insertAfter'),
	insertBefore: require('./insertBefore'),
	insertFirstChild: require('./insertFirstChild'),
	insertLastChild: require('./insertLastChild'),
	isComment: require('./isComment'),
	isDocument: require('./isDocument'),
	isDocumentFragment: require('./isDocumentFragment'),
	isDocumentType: require('./isDocumentType'),
	isElement: require('./isElement'),
	isNode: require('./isNode'),
	isNodeList: require('./isNodeList'),
	isTextNode: require('./isTextNode'),
	remove: require('./remove'),
	replace: require('./replace'),

	COMMENT_NODE: require('./COMMENT_NODE'),
	DOCUMENT_FRAGMENT_NODE: require('./DOCUMENT_FRAGMENT_NODE'),
	DOCUMENT_NODE: require('./DOCUMENT_NODE'),
	DOCUMENT_TYPE_NODE: require('./DOCUMENT_TYPE_NODE'),
	ELEMENT_NODE: require('./ELEMENT_NODE'),
	TEXT_NODE: require('./TEXT_NODE')
};

// ac-dom-nodes@1.7.0

},{"./COMMENT_NODE":176,"./DOCUMENT_FRAGMENT_NODE":177,"./DOCUMENT_NODE":178,"./DOCUMENT_TYPE_NODE":179,"./ELEMENT_NODE":180,"./TEXT_NODE":181,"./createDocumentFragment":183,"./filterByNodeType":184,"./hasAttribute":185,"./indexOf":186,"./insertAfter":187,"./insertBefore":188,"./insertFirstChild":189,"./insertLastChild":190,"./isComment":193,"./isDocument":194,"./isDocumentFragment":195,"./isDocumentType":196,"./isElement":197,"./isNode":198,"./isNodeList":199,"./isTextNode":200,"./remove":201,"./replace":202}],183:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.createDocumentFragment
 *
 * @deprecated since version 1.7.0
 * 	Use native [`Document.createDocumentFragment()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment) instead.
 *
 * @function
 *
 * @desc Create a DocumentFragment with optional HTML contents
 *
 * @param {String} [html]
 *        Optional inner HTML of the DocumentFragment
 *
 * @returns {DocumentFragment} A new DocumentFragment
 */
module.exports = function createDocumentFragment(html) {
	var fragment = document.createDocumentFragment();
	var div;

	if (html) {
		div = document.createElement('div');
		div.innerHTML = html;

		while (div.firstChild) {
			fragment.appendChild(div.firstChild);
		}
	}

	return fragment;
};

// ac-dom-nodes@1.7.0

},{}],184:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.slice');
require('@marcom/ac-polyfills/Array/prototype.filter');

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var ELEMENT_NODE = require('./ELEMENT_NODE');

/**
 * @name module:ac-dom-nodes.filterByNodeType
 *
 * @function
 *
 * @desc Filters an Array of Nodes by nodeType.
 *
 * @param {Array|NodeList} nodes
 *
 * @param {Integer} [nodeType={@link module:ac-dom-nodes.ELEMENT_NODE ELEMENT_NODE}]
 *
 * @returns {Array} An new Array of Nodes of the specified nodeType
 */
module.exports = function filterByNodeType(nodes, nodeType) {
	nodeType = nodeType || ELEMENT_NODE;
	nodes = Array.prototype.slice.call(nodes);

	return nodes.filter(function (node) {
		return isNodeType(node, nodeType);
	});
};

// ac-dom-nodes@1.7.0

},{"./ELEMENT_NODE":180,"./internal/isNodeType":191,"@marcom/ac-polyfills/Array/prototype.filter":385,"@marcom/ac-polyfills/Array/prototype.slice":389}],185:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-dom-nodes.hasAttribute
 *
 * @deprecated since version 1.7.0
 * 	Use native [`Element.hasAttribute()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute) instead.
 *
 * @function
 *
 * @desc Test whether or not the Element has the specified attribute or not.
 *
 * @param {Element} el
 *
 * @param {String} attr
 *
 * @returns {Boolean}
 */
module.exports = function hasAttribute(el, attr) {
 	if ('hasAttribute' in el) {
 		return el.hasAttribute(attr);
 	}

 	return (el.attributes.getNamedItem(attr) !== null);
};

// ac-dom-nodes@1.7.0

},{}],186:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Array/prototype.indexOf');
require('@marcom/ac-polyfills/Array/prototype.slice');

/** @ignore */
var validate = require('./internal/validate');
var filterByNodeType = require('./filterByNodeType');

/**
 * @name module:ac-dom-nodes.indexOf
 *
 * @deprecated since version 1.7.0
 * 	Use [`Array.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf) where Array is an array of nodes.
 *
 * @function
 *
 * @desc Get the index of a Node amongst it's siblings
 *
 * @param {Node} node
 *
 * @param {Integer|Boolean} [nodeType={@link module:ac-dom-nodes.ELEMENT_NODE ELEMENT_NODE}]
 *                  A nodeType to filter by. Set to `false` for no filter.
 *
 * @returns {Number} The index of the Node, or -1 if not in the current nodeType filter
 */
module.exports = function indexOf(node, nodeType) {
	var parentNode = node.parentNode;
	var nodes;

	if (!parentNode) {
		return 0;
	}

	nodes = parentNode.childNodes;

	if (nodeType !== false) {
		nodes = filterByNodeType(nodes, nodeType);
	} else {
		nodes = Array.prototype.slice.call(nodes);
	}

	return nodes.indexOf(node);
};

// ac-dom-nodes@1.7.0

},{"./filterByNodeType":184,"./internal/validate":192,"@marcom/ac-polyfills/Array/prototype.indexOf":387,"@marcom/ac-polyfills/Array/prototype.slice":389}],187:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.insertAfter
 *
 * @function
 *
 * @desc Insert a Node after a specified target
 *
 * @param {Node} node
 *        The Node to insert
 *
 * @param {Node} target
 *        The target Node
 *
 * @returns {Node} The inserted Node
 */
module.exports = function insertAfter(node, target) {
	validate.insertNode(node, true, 'insertAfter');
	validate.childNode(target, true, 'insertAfter');
	validate.hasParentNode(target, 'insertAfter');

	if (!target.nextSibling) {
		return target.parentNode.appendChild(node);
	}

	return target.parentNode.insertBefore(node, target.nextSibling);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":192}],188:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.insertBefore
 *
 * @function
 *
 * @desc Insert a Node before a specified target
 *
 * @param {Node} node
 *        The Node to insert
 *
 * @param {Node} target
 *        The target Node
 *
 * @returns {Node} The inserted Node
 */
module.exports = function insertBefore(node, target) {
	validate.insertNode(node, true, 'insertBefore');
	validate.childNode(target, true, 'insertBefore');
	validate.hasParentNode(target, 'insertBefore');

	return target.parentNode.insertBefore(node, target);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":192}],189:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.insertFirstChild
 *
 * @function
 *
 * @desc Insert a Node as the first child of a specified target
 *
 * @param {Node} node
 *        The Node to insert
 *
 * @param {Node} target
 *        The target Node
 *
 * @returns {Node} The inserted Node
 */
module.exports = function insertFirstChild(node, target) {
	validate.insertNode(node, true, 'insertFirstChild');
	validate.parentNode(target, true, 'insertFirstChild');

	if (!target.firstChild) {
		return target.appendChild(node);
	}

	return target.insertBefore(node, target.firstChild);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":192}],190:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.insertLastChild
 *
 * @deprecated since version 1.7.0
 * Use native [`Node.appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) instead.
 *
 * @function
 *
 * @desc Insert a Node as the last child of a specified target
 *
 * @param {Node} node
 *        The Node to insert
 *
 * @param {Node} target
 *        The target Node
 *
 * @returns {Node} The inserted Node
 */
module.exports = function insertLastChild(node, target) {
	validate.insertNode(node, true, 'insertLastChild');
	validate.parentNode(target, true, 'insertLastChild');

	return target.appendChild(node);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":192}],191:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"../isNode":198,"dup":35}],192:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"../COMMENT_NODE":176,"../DOCUMENT_FRAGMENT_NODE":177,"../ELEMENT_NODE":180,"../TEXT_NODE":181,"./isNodeType":191,"dup":36}],193:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var COMMENT_NODE = require('./COMMENT_NODE');

/**
 * @name module:ac-dom-nodes.isComment
 *
 * @function
 *
 * @desc Test whether or not an Object is a Comment.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isComment(obj) {
 	return isNodeType(obj, COMMENT_NODE);
};

// ac-dom-nodes@1.7.0

},{"./COMMENT_NODE":176,"./internal/isNodeType":191}],194:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var DOCUMENT_NODE = require('./DOCUMENT_NODE');

/**
 * @name module:ac-dom-nodes.isDocument
 *
 * @function
 *
 * @desc Test whether or not an Object is a Document.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isDocument(obj) {
 	return isNodeType(obj, DOCUMENT_NODE);
};

// ac-dom-nodes@1.7.0

},{"./DOCUMENT_NODE":178,"./internal/isNodeType":191}],195:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"./DOCUMENT_FRAGMENT_NODE":177,"./internal/isNodeType":191,"dup":37}],196:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var DOCUMENT_TYPE_NODE = require('./DOCUMENT_TYPE_NODE');

/**
 * @name module:ac-dom-nodes.isDocumentType
 *
 * @function
 *
 * @desc Test whether or not an Object is a DocumentType.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isDocumentType (obj) {
 	return isNodeType(obj, DOCUMENT_TYPE_NODE);
};

// ac-dom-nodes@1.7.0

},{"./DOCUMENT_TYPE_NODE":179,"./internal/isNodeType":191}],197:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./ELEMENT_NODE":180,"./internal/isNodeType":191,"dup":38}],198:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],199:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var nodeListToStringPattern = /^\[object (HTMLCollection|NodeList|Object)\]$/;

/**
 * @name module:ac-dom-nodes.isNodeList
 *
 * @function
 *
 * @desc Test whether or not an Object is a NodeList.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isNodeList (obj) {
 	if (!obj) {
 		return false;
 	}

 	// not Array-like
 	if (typeof obj.length !== 'number') {
 		return false;
 	}

 	// Array-like, but not a NodeList
 	if (typeof obj[0] === 'object' && (!obj[0] || !obj[0].nodeType)) {
 		return false;
 	}

 	return nodeListToStringPattern.test(Object.prototype.toString.call(obj));
};

// ac-dom-nodes@1.7.0

},{}],200:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var isNodeType = require('./internal/isNodeType');
var TEXT_NODE = require('./TEXT_NODE');

/**
 * @name module:ac-dom-nodes.isTextNode
 *
 * @function
 *
 * @desc Test whether or not an Object is a TextNode.
 *
 * @param {Object} obj
 *
 * @returns {Boolean}
 */
module.exports = function isTextNode (obj) {
 	return isNodeType(obj, TEXT_NODE);
};

// ac-dom-nodes@1.7.0

},{"./TEXT_NODE":181,"./internal/isNodeType":191}],201:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"./internal/validate":192,"dup":40}],202:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var validate = require('./internal/validate');

/**
 * @name module:ac-dom-nodes.replace
 *
 * @function
 *
 * @desc Replace one Node with another
 *
 * @param {Node} newNode
 *        The Node to be inserted
 *
 * @param {Node} oldNode
 *        The Node to be replaced
 *
 * @returns {Node} The replaced Node
 */
module.exports = function replace (newNode, oldNode) {
	validate.insertNode(newNode, true, 'insertFirstChild', 'newNode');
	validate.childNode(oldNode, true, 'insertFirstChild', 'oldNode');
	validate.hasParentNode(oldNode, 'insertFirstChild', 'oldNode');

	return oldNode.parentNode.replaceChild(newNode, oldNode);
};

// ac-dom-nodes@1.7.0

},{"./internal/validate":192}],203:[function(require,module,exports){
var ElementTracker = require('./ac-element-tracker/ElementTracker');

/**
 * @module ac-element-tracker
 */
module.exports = new ElementTracker();
module.exports.ElementTracker = ElementTracker;

// ac-element-tracker@2.2.0

},{"./ac-element-tracker/ElementTracker":204}],204:[function(require,module,exports){
'use strict';

require('@marcom/ac-polyfills/Function/prototype.bind');

var ac_Array       = require('@marcom/ac-array');
var ac_dom_nodes   = require('@marcom/ac-dom-nodes');
var ac_dom_metrics = {
	getDimensions  : require('@marcom/ac-dom-metrics/getDimensions'),
	getPagePosition: require('@marcom/ac-dom-metrics/getPagePosition'),
	getScrollY     : require('@marcom/ac-dom-metrics/getScrollY')
};
var ac_dom_events  = require('@marcom/ac-dom-events');
var ac_Object      = require('@marcom/ac-object');

var TrackedElement = require('./TrackedElement');

// default autoStart to false because it gives the user a chance to attach their event listeners
// before things start firing events.
var defaultOptions = {
	autoStart: false,
	useRenderedPosition: false
};

/**
 * @constructor
 * @param {(Array|NodeList)} elements - Array or Nodelist of DOM elements to track
 * @param {Object}  [options]
 * @param {boolean} options.autoStart
 * @param {boolean} options.useRenderedPosition Defaults to False. If true, elements will default to being tracked taking transforms into account
 */
function ElementTracker (elements, options) {
	this.options = ac_Object.clone(defaultOptions);
	this.options = typeof options === 'object' ? ac_Object.extend(this.options, options) : this.options;

	/**
	 * Cached windowScroll value, updated on scroll/resize/orientationchange
	 * @type {number}
	 * @private
	 */
	this._scrollY = this._getScrollY();
	/**
	 * Cached window.innerHeight value, updated on resize/orientationchange
	 * @type {number}
	 * @private
	 */
	this._windowHeight = this._getWindowHeight();

	// are we tracking?
	this.tracking = false;

	/**
	 * Array of tracked element objects
	 * @type {Array.<TrackedElement>}
	 */
	this.elements = [];

	// add elements if we get a valid Element object, Array or NodeList
	if (elements && (Array.isArray(elements) || ac_dom_nodes.isNodeList(elements) || ac_dom_nodes.isElement(elements))) {
		this.addElements(elements);
	}

	this.refreshAllElementStates = this.refreshAllElementStates.bind(this);
	this.refreshAllElementMetrics = this.refreshAllElementMetrics.bind(this);

	// only start if autoStart
	if (this.options.autoStart) {
		this.start();
	}
}
/** @lends ElementTracker# */
var proto = ElementTracker.prototype;

/**
 * Clears the ElementTracker instance for GC
 * It is no longer usable once this has been called
 */
proto.destroy = function(){
	var i,len;
	this.stop();

	for(i = 0, len = this.elements.length; i < len; i++) {
		this.elements[i].destroy();
	}
	this.elements = null;
	this.options = null;
};

/**
 * Accepts single DOM Elements or an array of DOM Elements. Turns DOM Elements into TrackedElement objects and pushes them to this.elements
 * @param {(Array|NodeList)} elements
 * @private
 */
proto._registerElements = function (elements) {
	// make sure we use an array
	elements = [].concat(elements);

	elements.forEach(function (element) {
		// only register elements that are present in the DOM
		if (this._elementInDOM(element)) {
			var trackedElement = new TrackedElement(element, this.options.useRenderedPosition);
			// we only want to get this once intially for now
			trackedElement.offsetTop = trackedElement.element.offsetTop;

			this.elements.push(trackedElement);
		}

	}, this);
};

/**
 * Register objects that are already TrackedElement instances. Will accept a single object or an array of objects
 * @param {Array.<TrackedElement>} trackedElements
 * @private
 */
proto._registerTrackedElements = function (trackedElements) {
	var objects = [].concat(trackedElements);

	objects.forEach(function (object) {
		// only register objects in DOM
		if (this._elementInDOM(object.element)) {
			object.offsetTop = object.element.offsetTop;
			this.elements.push(object);
		}
	}, this);
};

/**
 * Returns true if the element is a valid element and exists in the DOM
 * @param {Element} element
 * @returns {boolean}
 * @private
 */
proto._elementInDOM = function (element) {
	var assertion = false;
	var body = document.getElementsByTagName('body')[0];

	if (ac_dom_nodes.isElement(element) && body.contains(element)) {
		assertion = true;
	}

	return assertion;
};

/**
 * Returns the percentage [0.0 - 1.0] that this element visible currently in the viewport
 * @param {TrackedElement} trackedElement
 * @returns {number}
 * @private
 */
proto._elementPercentInView = function (trackedElement) {
	return trackedElement.pixelsInView / trackedElement.height;
};

/**
 * How many pixels of `trackedElement` are currently in the viewport
 * @param {TrackedElement} trackedElement
 * @returns {number}
 * @private
 */
proto._elementPixelsInView = function (trackedElement) {
	// Convert to viewport local coordinates
	var elementTop = trackedElement.top - this._scrollY;
	var elementBottom = trackedElement.bottom - this._scrollY;

	// Fully above, or fully below the viewport area
	if(elementTop > this._windowHeight || elementBottom < 0) {
		return 0;
	}

	// visible pixels = (maximally visible local area) - (minimally visible local area)
	return Math.min(elementBottom, this._windowHeight) - Math.max(elementTop, 0);
};

/**
 * Conditions to meet and actions to take when refreshing the element's state if is in view, but was not necessarily already in view.
 * @param {TrackedElement} trackedElement
 * @param {boolean} alreadyInView
 * @private
 */
proto._ifInView = function (trackedElement, alreadyInView) {
	// if the element enters view
	if (!alreadyInView) {
		trackedElement.trigger('enterview', trackedElement);
	}
};

/**
 * Conditions to meet and actions to take when refreshing the element's state if it was already in view, but not necessarily in view anymore.
 * @param {TrackedElement} trackedElement
 * @private
 */
proto._ifAlreadyInView = function (trackedElement) {
	// if the element exits view
	if (!trackedElement.inView) {
		trackedElement.trigger('exitview', trackedElement);
	}
};

/**
 * Public Methods
 */

/**
 * Add elements to the element index. Accepts single element or array of elements or a nodelist
 * {(Element|Array|NodeList)} collection - A single DOM Element or an array of DOM Elements or a NodeList
 */
proto.addElements = function (collection, useRenderedPosition) {
	// If not set, use default value for this tracker (which is false by default)
	if (typeof useRenderedPosition === 'undefined') {
		useRenderedPosition = this.options.useRenderedPosition;
	}
	collection = ac_dom_nodes.isNodeList(collection) ? ac_Array.toArray(collection) : [].concat(collection);
	for(var i = 0, len = collection.length; i < len; i++) {
		this.addElement(collection[i], useRenderedPosition);
	}
};

/**
 * Add a single DOM Element to be tracked.
 * @param {Element} element
 * @param {Boolean} useRenderedPosition False by default. If true, the element will be tracked taking its final transformed position into account
 * @returns {TrackedElement}
 * @throws TypeError if the supplied element is not a valid DOM Element
 */
proto.addElement = function (element, useRenderedPosition) {
	var trackedElement = null;

	// If not set, use default value for this tracker (which is false by default)
	if (typeof useRenderedPosition === 'undefined') {
		useRenderedPosition = this.options.useRenderedPosition;
	}

	if (ac_dom_nodes.isElement(element)) {
		trackedElement = new TrackedElement(element, useRenderedPosition);
		this._registerTrackedElements(trackedElement);

		this.refreshElementMetrics(trackedElement);
		this.refreshElementState(trackedElement);
	} else {
		throw new TypeError('ElementTracker: ' + element + ' is not a valid DOM element');
	}

	return trackedElement;
};

/**
 * Removes an element object from the element index. Will remove any duplicates of passed element.
 * @param {(Element|Object)} element - A DOM Element or a valid `TrackedElement` object
 */
proto.removeElement = function (element) {
	var indexes = [];
	var filtered;

	this.elements.forEach(function (trackedElement, i) {
		if (trackedElement === element || trackedElement.element === element) {
			indexes.push(i);
		}
	});

	// remove matched elements at specified indexes
	filtered = this.elements.filter(function (element, i) {
		return indexes.indexOf(i) < 0;
	});

	this.elements = filtered;
};


/**
 * Start tracking, automatically refreshes all TrackedElement's metrics metrics and state
 */
proto.start = function () {
	if (this.tracking === false) {
		this.tracking = true;

		ac_dom_events.addEventListener(window, 'resize', this.refreshAllElementMetrics);
		ac_dom_events.addEventListener(window, 'orientationchange', this.refreshAllElementMetrics);
		ac_dom_events.addEventListener(window, 'scroll', this.refreshAllElementStates);

		this.refreshAllElementMetrics();
	}
};

/**
 * Stop tracking. Removes (scroll resize orientationchange) listeners.
 */
proto.stop = function () {
	if (this.tracking === true) {
		this.tracking = false;
		ac_dom_events.removeEventListener(window, 'resize', this.refreshAllElementMetrics);
		ac_dom_events.removeEventListener(window, 'orientationchange', this.refreshAllElementMetrics);
		ac_dom_events.removeEventListener(window, 'scroll', this.refreshAllElementStates);
	}
};


/**
 * Force a metric and state update on all tracked elements
 */
proto.refreshAllElementMetrics = function(currentScrollY, windowHeight) {
	if (typeof currentScrollY !== 'number') {
		currentScrollY = this._getScrollY();
	}

	if (typeof windowHeight !== 'number') {
		windowHeight = this._getWindowHeight();
	}

	this._scrollY = currentScrollY;
	this._windowHeight = windowHeight;
	this.elements.forEach(this.refreshElementMetrics, this);
};

/**
 * Force a metric and state update provided tracked element
 * @param {TrackedElement} trackedElement - the `TrackedElement` whose metrics to update
 * @returns {TrackedElement} The provided tracked element
 */
proto.refreshElementMetrics = function (trackedElement) {
	var dimensions = ac_dom_metrics.getDimensions(trackedElement.element, trackedElement.useRenderedPosition);
	var position = ac_dom_metrics.getPagePosition(trackedElement.element, trackedElement.useRenderedPosition);

	trackedElement = ac_Object.extend(trackedElement, dimensions, position);

	return this.refreshElementState(trackedElement);
};

/**
 * Force a state update on all tracked elements
 */
proto.refreshAllElementStates = function (currentScrollY) {
	if (typeof currentScrollY !== 'number') {
		currentScrollY = this._getScrollY();
	}

	this._scrollY = currentScrollY;
	this.elements.forEach(this.refreshElementState, this);
};
/**
 * Force a metric and state update on `trackedElement`
 * @param {TrackedElement} trackedElement
 * @returns {TrackedElement} The provided tracked element
 */
proto.refreshElementState = function (trackedElement) {
	var alreadyInView = trackedElement.inView;

	trackedElement.pixelsInView = this._elementPixelsInView(trackedElement);
	trackedElement.percentInView = this._elementPercentInView(trackedElement);
	trackedElement.inView = trackedElement.pixelsInView > 0;

	if (trackedElement.inView) {
		this._ifInView(trackedElement, alreadyInView);
	}

	if (alreadyInView) {
		this._ifAlreadyInView(trackedElement);
	}

	return trackedElement;
};

/**
 * Returns the window height (with IE<9 fallback)
 * @returns {number}
 * @private
 */
proto._getWindowHeight = function() {
	return document.documentElement.clientHeight || window.innerHeight;
};

proto._getScrollY = function() {
	return ac_dom_metrics.getScrollY();
};

module.exports = ElementTracker;

// ac-element-tracker@2.0.1

// ac-element-tracker@2.2.0

},{"./TrackedElement":205,"@marcom/ac-array":151,"@marcom/ac-dom-events":161,"@marcom/ac-dom-metrics/getDimensions":6,"@marcom/ac-dom-metrics/getPagePosition":7,"@marcom/ac-dom-metrics/getScrollY":12,"@marcom/ac-dom-nodes":182,"@marcom/ac-object":213,"@marcom/ac-polyfills/Function/prototype.bind":393}],205:[function(require,module,exports){
'use strict';

var objCreate         = require('@marcom/ac-object').create;
var ac_dom_nodes      = require('@marcom/ac-dom-nodes');
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

var superclass = EventEmitterMicro.prototype;

/**
 * Extends DOMEmitter and wraps a DOM Element with metrics related to its position in the viewport.
 * @constructor
 * @extends DOMEmitter
 * @param {Element} element A valid DOM element
 * @param {Boolean} useRenderedPosition False by default. If true, the element will be tracked taking its final transform into account
 */
function TrackedElement (element, useRenderedPosition) {
	// if an invalid element is passed
	if (!ac_dom_nodes.isElement(element)) {
		throw new TypeError('TrackedElement: ' + element + ' is not a valid DOM element');
	}

	EventEmitterMicro.call(this);

	/** @type {Element} */
	this.element = element;
	/** @type {boolean} */
	this.inView        = false;
	/** @type {number} */
	this.percentInView = 0;
	/** @type {number} */
	this.pixelsInView  = 0;
	/** @type {number} */
	this.offsetTop     = 0;
	/** @type {number} */
	this.top           = 0;
	/** @type {number} */
	this.right         = 0;
	/** @type {number} */
	this.bottom        = 0;
	/** @type {number} */
	this.left          = 0;
	/** @type {number} */
	this.width         = 0;
	/** @type {number} */
	this.height        = 0;
	/**
	 * If true, the element will be tracked taking its final transformed position into account
	 * @type {boolean}
	 */
	this.useRenderedPosition = useRenderedPosition || false;
}

/** @lends TrackedElement# */
var proto = TrackedElement.prototype = objCreate(superclass);

/**
 * Clears the TrackedElement instance for GC
 * It is no longer usable once this has been called
 */
proto.destroy = function(){
	this.element = null;
	superclass.destroy.call(this);
};

module.exports = TrackedElement;

// ac-element-tracker@2.2.0

},{"@marcom/ac-dom-nodes":182,"@marcom/ac-event-emitter-micro":206,"@marcom/ac-object":213}],206:[function(require,module,exports){
/** 
 * @module ac-event-emitter-micro
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	EventEmitterMicro: require('./ac-event-emitter-micro/EventEmitterMicro')
};

},{"./ac-event-emitter-micro/EventEmitterMicro":207}],207:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';


/**
 * A performance focused minimal event emitter.
 * @constructor
 * @class
 */
function EventEmitterMicro() {
	this._events = {};
}
/** @lends EventEmitterMicro.prototype */
var proto = EventEmitterMicro.prototype;

/**
 * Adds an event listener, which will fire `callback` when `eventName` is triggered
 * @param {String} eventName
 * @param {Function} callback
 */
proto.on = function(eventName, callback) {
	this._events[eventName] = this._events[eventName] || [];
	this._events[eventName].unshift(callback);
};

/**
 * Same as `on` however event will be removed after first trigger
 * @param {String} eventName
 * @param {Function} callback
 */
proto.once = function(eventName, callback){
	var that = this;
	function fn(data){
		that.off(eventName, fn);

		if(data !== undefined) callback(data);
		else callback();
	}

	this.on(eventName, fn);
};

/**
 * Removes an event listener, listening for `eventName` with `callback
 * @param {String} eventName
 * @param {Function} callback
 */
proto.off = function(eventName, callback) {
	if (!this.has(eventName)) return;

	var index = this._events[eventName].indexOf(callback);
	if( index === -1 ) return;

	this._events[eventName].splice(index, 1);
};

/**
 * Dispatches an event with the name `eventName`, optionally passing in additional data
 * @param {String} eventName
 * @param {*=} data	Optional data that will be passed to the callback -
 */
proto.trigger = function(eventName, data) {
	if (!this.has(eventName)) return;

	for(var i = this._events[eventName].length -1; i >= 0 ; i--) {
		// Don't pass `undefined` to functions which don't expect a value
		if(data !== undefined) this._events[eventName][i](data);
		else this._events[eventName][i]();
	}
};

/**
 * Returns true if there are any listeners for `eventName`
 * @param {String} eventName
 */
proto.has = function(eventName) {
	if (eventName in this._events === false || this._events[eventName].length === 0) {
		return false;
	}

	return true;
};

/**
 * Clears this EventEmitterMicro instance for GC
 * It is no longer usable once this is called
 */
proto.destroy = function(){
	for(var eventName in this._events) {
		this._events[eventName] = null;
	}
	this._events = null;
};

/** @type {EventEmitterMicro} */
module.exports = EventEmitterMicro;

},{}],208:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var qs = require('qs');

/**
 * @name module:ac-url.joinSearchParams
 *
 * @function
 *
 * @desc Joins an object of search component or query string key-value pairs
 *
 * @param {Object} obj
 *        Key-value pairs of the search component or query stirng.
 *
 * @param {Boolean} [questionMark=true]
 *        Whether or not to include the leading question mark (`'?'`)
 *
 * @returns {Object} The search component or query stirng
 */
module.exports = function joinSearchParams(obj, questionMark) {
	var str = qs.stringify(obj, { strictNullHandling: true });

	if (str && questionMark !== false) {
		str = '?' + str;
	}

	return str;
};

// ac-url@1.1.0

},{"qs":209}],209:[function(require,module,exports){
// Load modules

var Stringify = require('./stringify');
var Parse = require('./parse');


// Declare internals

var internals = {};


module.exports = {
    stringify: Stringify,
    parse: Parse
};

},{"./parse":210,"./stringify":211}],210:[function(require,module,exports){
// Load modules

var Utils = require('./utils');


// Declare internals

var internals = {
    delimiter: '&',
    depth: 5,
    arrayLimit: 20,
    parameterLimit: 1000,
    strictNullHandling: false,
    plainObjects: false,
    allowPrototypes: false
};


internals.parseValues = function (str, options) {

    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0, il = parts.length; i < il; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        if (pos === -1) {
            obj[Utils.decode(part)] = '';

            if (options.strictNullHandling) {
                obj[Utils.decode(part)] = null;
            }
        }
        else {
            var key = Utils.decode(part.slice(0, pos));
            var val = Utils.decode(part.slice(pos + 1));

            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                obj[key] = val;
            }
            else {
                obj[key] = [].concat(obj[key]).concat(val);
            }
        }
    }

    return obj;
};


internals.parseObject = function (chain, val, options) {

    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj;
    if (root === '[]') {
        obj = [];
        obj = obj.concat(internals.parseObject(chain, val, options));
    }
    else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
        var index = parseInt(cleanRoot, 10);
        var indexString = '' + index;
        if (!isNaN(index) &&
            root !== cleanRoot &&
            indexString === cleanRoot &&
            index >= 0 &&
            (options.parseArrays &&
             index <= options.arrayLimit)) {

            obj = [];
            obj[index] = internals.parseObject(chain, val, options);
        }
        else {
            obj[cleanRoot] = internals.parseObject(chain, val, options);
        }
    }

    return obj;
};


internals.parseKeys = function (key, val, options) {

    if (!key) {
        return;
    }

    // Transform dot notation to bracket notation

    if (options.allowDots) {
        key = key.replace(/\.([^\.\[]+)/g, '[$1]');
    }

    // The regex chunks

    var parent = /^([^\[\]]*)/;
    var child = /(\[[^\[\]]*\])/g;

    // Get the parent

    var segment = parent.exec(key);

    // Stash the parent if it exists

    var keys = [];
    if (segment[1]) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects &&
            Object.prototype.hasOwnProperty(segment[1])) {

            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(segment[1]);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {

        ++i;
        if (!options.plainObjects &&
            Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {

            if (!options.allowPrototypes) {
                continue;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return internals.parseObject(keys, val, options);
};


module.exports = function (str, options) {

    options = options || {};
    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : internals.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : internals.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : internals.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.allowDots = options.allowDots !== false;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : internals.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : internals.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : internals.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : internals.strictNullHandling;

    if (str === '' ||
        str === null ||
        typeof str === 'undefined') {

        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? internals.parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        var newObj = internals.parseKeys(key, tempObj[key], options);
        obj = Utils.merge(obj, newObj, options);
    }

    return Utils.compact(obj);
};

},{"./utils":212}],211:[function(require,module,exports){
// Load modules

var Utils = require('./utils');


// Declare internals

var internals = {
    delimiter: '&',
    arrayPrefixGenerators: {
        brackets: function (prefix, key) {

            return prefix + '[]';
        },
        indices: function (prefix, key) {

            return prefix + '[' + key + ']';
        },
        repeat: function (prefix, key) {

            return prefix;
        }
    },
    strictNullHandling: false
};


internals.stringify = function (obj, prefix, generateArrayPrefix, strictNullHandling, filter) {

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    }
    else if (Utils.isBuffer(obj)) {
        obj = obj.toString();
    }
    else if (obj instanceof Date) {
        obj = obj.toISOString();
    }
    else if (obj === null) {
        if (strictNullHandling) {
            return Utils.encode(prefix);
        }

        obj = '';
    }

    if (typeof obj === 'string' ||
        typeof obj === 'number' ||
        typeof obj === 'boolean') {

        return [Utils.encode(prefix) + '=' + Utils.encode(obj)];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys = Array.isArray(filter) ? filter : Object.keys(obj);
    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];

        if (Array.isArray(obj)) {
            values = values.concat(internals.stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, filter));
        }
        else {
            values = values.concat(internals.stringify(obj[key], prefix + '[' + key + ']', generateArrayPrefix, strictNullHandling, filter));
        }
    }

    return values;
};


module.exports = function (obj, options) {

    options = options || {};
    var delimiter = typeof options.delimiter === 'undefined' ? internals.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : internals.strictNullHandling;
    var objKeys;
    var filter;
    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    }
    else if (Array.isArray(options.filter)) {
        objKeys = filter = options.filter;
    }

    var keys = [];

    if (typeof obj !== 'object' ||
        obj === null) {

        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in internals.arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    }
    else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    }
    else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = internals.arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }
    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];
        keys = keys.concat(internals.stringify(obj[key], key, generateArrayPrefix, strictNullHandling, filter));
    }

    return keys.join(delimiter);
};

},{"./utils":212}],212:[function(require,module,exports){
// Load modules


// Declare internals

var internals = {};
internals.hexTable = new Array(256);
for (var h = 0; h < 256; ++h) {
    internals.hexTable[h] = '%' + ((h < 16 ? '0' : '') + h.toString(16)).toUpperCase();
}


exports.arrayToObject = function (source, options) {

    var obj = options.plainObjects ? Object.create(null) : {};
    for (var i = 0, il = source.length; i < il; ++i) {
        if (typeof source[i] !== 'undefined') {

            obj[i] = source[i];
        }
    }

    return obj;
};


exports.merge = function (target, source, options) {

    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        }
        else if (typeof target === 'object') {
            target[source] = true;
        }
        else {
            target = [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        target = [target].concat(source);
        return target;
    }

    if (Array.isArray(target) &&
        !Array.isArray(source)) {

        target = exports.arrayToObject(target, options);
    }

    var keys = Object.keys(source);
    for (var k = 0, kl = keys.length; k < kl; ++k) {
        var key = keys[k];
        var value = source[key];

        if (!Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = value;
        }
        else {
            target[key] = exports.merge(target[key], value, options);
        }
    }

    return target;
};


exports.decode = function (str) {

    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {

    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    if (typeof str !== 'string') {
        str = '' + str;
    }

    var out = '';
    for (var i = 0, il = str.length; i < il; ++i) {
        var c = str.charCodeAt(i);

        if (c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A)) { // A-Z

            out += str[i];
            continue;
        }

        if (c < 0x80) {
            out += internals.hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out += internals.hexTable[0xC0 | (c >> 6)] + internals.hexTable[0x80 | (c & 0x3F)];
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out += internals.hexTable[0xE0 | (c >> 12)] + internals.hexTable[0x80 | ((c >> 6) & 0x3F)] + internals.hexTable[0x80 | (c & 0x3F)];
            continue;
        }

        ++i;
        c = 0x10000 + (((c & 0x3FF) << 10) | (str.charCodeAt(i) & 0x3FF));
        out += internals.hexTable[0xF0 | (c >> 18)] + internals.hexTable[0x80 | ((c >> 12) & 0x3F)] + internals.hexTable[0x80 | ((c >> 6) & 0x3F)] + internals.hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function (obj, refs) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    refs = refs || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0, il = obj.length; i < il; ++i) {
            if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    for (i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        obj[key] = exports.compact(obj[key], refs);
    }

    return obj;
};


exports.isRegExp = function (obj) {

    return Object.prototype.toString.call(obj) === '[object RegExp]';
};


exports.isBuffer = function (obj) {

    if (obj === null ||
        typeof obj === 'undefined') {

        return false;
    }

    return !!(obj.constructor &&
              obj.constructor.isBuffer &&
              obj.constructor.isBuffer(obj));
};

},{}],213:[function(require,module,exports){
/**
 * @module ac-object
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	clone: require('./clone'),
	create: require('./create'),
	defaults: require('./defaults'),
	extend: require('./extend'),
	getPrototypeOf: require('./getPrototypeOf'),
	isDate: require('./isDate'),
	isEmpty: require('./isEmpty'),
	isRegExp: require('./isRegExp'),
	toQueryParameters: require('./toQueryParameters')
};

// ac-object@1.3.1

},{"./clone":214,"./create":215,"./defaults":216,"./extend":217,"./getPrototypeOf":218,"./isDate":219,"./isEmpty":220,"./isRegExp":221,"./toQueryParameters":222}],214:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./extend":217,"@marcom/ac-polyfills/Array/isArray":383,"dup":96}],215:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"dup":97}],216:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var extend = require('./extend');

/**
 * @name module:ac-object.defaults
 *
 * @function
 * 
 * @desc Combines defaults and options into a new object and returns it.
 *
 * @param {Object} defaultsObj
 *        The defaults object.
 *
 * @param {Object} options
 *        The options object.
 *
 * @returns {Object} An object resulting from the combination of defaults and options.
 */
module.exports = function defaults (defaultsObj, options) {
	if (typeof defaultsObj !== 'object'){
		throw new TypeError('defaults: must provide a defaults object');
	}
	options = options || {};
	if (typeof options !== 'object'){
		throw new TypeError('defaults: options must be a typeof object');
	}
	return extend({}, defaultsObj, options);
};

// ac-object@1.3.1

},{"./extend":217}],217:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/prototype.forEach":386,"dup":98}],218:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name module:ac-object.getPrototypeOf
 *
 * @function
 * 
 * @desc Returns the prototype (i.e. the internal [[Prototype]]) of the specified object.
 *
 * @param {Object} obj
 *        The object whose prototype is to be returned.
 *
 * @returns {Object} The prototype of the specified object.
 */
module.exports = function getPrototypeOf (obj) {
	if (Object.getPrototypeOf) {
		return Object.getPrototypeOf(obj);
	}
	else {
		if (typeof obj !== 'object') {
			throw new Error('Requested prototype of a value that is not an object.');
		}
		else if (typeof this.__proto__ === 'object') {
			return obj.__proto__;
		}
		else {
			var constructor = obj.constructor;
			var oldConstructor;
			if (hasOwnProp.call(obj, 'constructor')) {
				oldConstructor = constructor;
				// reset constructor
				if (!(delete obj.constructor)) {
					// can't delete obj.constructor, return null
					return null;
				}
				// get real constructor
				constructor = obj.constructor;
				// restore constructor
				obj.constructor = oldConstructor;
			}
			// needed for IE
			return constructor ? constructor.prototype : null;
		}
	}
};

// ac-object@1.3.1

},{}],219:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-object.isDate
 *
 * @function
 * 
 * @desc Test an Object to see if it is an instance of the Date constructor or not.
 *
 * @param {Object} date
 *        The Object to test.
 *
 * @returns {Boolean} If the Object is a Date or not.
 */
module.exports = function isDate (date) {
	return Object.prototype.toString.call(date) === '[object Date]';
};

// ac-object@1.3.1

},{}],220:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name module:ac-object.isEmpty
 *
 * @function
 * 
 * @desc Check if an empty object.
 *
 * @param {Object} object
 *        The Object to check if empty.
 *
 * @returns {Boolean} Return true if and only if object is empty ({}).
 */
module.exports = function isEmpty (object) {
	var prop;

	if (typeof object !== 'object') {
		throw new TypeError('ac-base.Object.isEmpty : Invalid parameter - expected object');
	}

	for (prop in object) {
		if (hasOwnProp.call(object, prop)) {
			return false;
		}
	}

	return true;
};

// ac-object@1.3.1

},{}],221:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-object.isRegExp
 *
 * @function
 * 
 * @desc Test whether or not an Object is a Regular Expression.
 *
 * @param {Object} obj
 *        Object to test whether or not it is a Regular Expression.
 *
 * @returns {Boolean} Whether or not it is a Regular Expression.
 */
module.exports = function isRegExp (obj) {
	return window.RegExp ? obj instanceof RegExp : false;
};

// ac-object@1.3.1

},{}],222:[function(require,module,exports){
/**
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var joinSearchParams = require('@marcom/ac-url/joinSearchParams');

/**
 * @name module:ac-object.toQueryParameters
 *
 * @deprecated use `@marcom/ac-url/joinSearchParams`
 *
 * @function
 *
 * @desc Convert object to query string.
 *
 * @param {Object} object
 *        The Object to convert to a query string.
 *
 * @returns {String} Returns query string representation of object.
 */
module.exports = function toQueryParameters (object) {
	if (typeof object !== 'object'){
		throw new TypeError('toQueryParameters error: argument is not an object');
	}

	return joinSearchParams(object, false);
};

// ac-object@1.3.1

},{"@marcom/ac-url/joinSearchParams":208}],223:[function(require,module,exports){
var ElementEngagement = require('./ac-element-engagement/ElementEngagement');

module.exports = new ElementEngagement();
module.exports.ElementEngagement = ElementEngagement;

// ac-element-engagement@2.1.0

},{"./ac-element-engagement/ElementEngagement":224}],224:[function(require,module,exports){
/**
 *  @desc Reports user engagement on tracked elements
 *  @module ElementEngagement
 */

'use strict';

var proto;
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;

var ac_Object = {
	create: require('@marcom/ac-object/create'),
	defaults: require('@marcom/ac-object/defaults'),
	extend: require('@marcom/ac-object/extend')
};
var Super = require('@marcom/ac-element-tracker').ElementTracker;

var trackedElementDefaults = {
	timeToEngage: 500,
	inViewThreshold: 0.75,
	stopOnEngaged: true
};

// defaults for when we decorate the TrackedElement objects
var extendedTrackedElementProps = {
	thresholdEnterTime: 0,
	thresholdExitTime: 0,
	inThreshold: false,
	engaged: false,
	tracking: true // we should default this to false
};


/**
 * @class
 * @augments {ElementTracker}
 * @augments {EventEmitterMicro}
 */
var ElementEngagement = function (options) {
	Super.call(this, null, options);

	// Call EE Micro constructor since ElementTracker is no longer
	// directly an event emitter.
	EventEmitterMicro.call(this);

	// bind context for event emitter micro
	this._thresholdEnter = this._thresholdEnter.bind(this);
	this._thresholdExit = this._thresholdExit.bind(this);
	this._enterView = this._enterView.bind(this);
	this._exitView = this._exitView.bind(this);
};

proto = ElementEngagement.prototype = ac_Object.create(Super.prototype);

// extend with event emitter micro
proto = ac_Object.extend(proto, EventEmitterMicro.prototype);

/**
 * @desc decorates the TrackedElement instances with ElementEngagement specific properties
 * @private
 */
proto._decorateTrackedElement = function (trackedElement, options) {
	var extendedDefaults;

	// merge user specified options with defaults
	extendedDefaults = ac_Object.defaults(trackedElementDefaults, options || {});
	ac_Object.extend(trackedElement, extendedDefaults);
	ac_Object.extend(trackedElement, extendedTrackedElementProps);
};


/**
 * @desc Adds EventEmitter listeners to an individual TrackedElement object
 * @private
 */
proto._attachElementListeners = function (trackedElement) {
	trackedElement.on('thresholdenter', this._thresholdEnter, this);
	trackedElement.on('thresholdexit', this._thresholdExit, this);
	trackedElement.on('enterview', this._enterView, this);
	trackedElement.on('exitview', this._exitView, this);
};

/**
 * @desc Removes EventEmitter listeners from an individaul TrackedElement object
 * @private
 */
proto._removeElementListeners = function (trackedElement) {
	trackedElement.off('thresholdenter', this._thresholdEnter);
	trackedElement.off('thresholdexit', this._thresholdExit);
	trackedElement.off('enterview', this._enterView);
	trackedElement.off('exitview', this._exitView);
};

/**
 * @desc Attaches EventEmitter listeners to all TrackedElement objects
 * @private
 */
proto._attachAllElementListeners = function () {
	this.elements.forEach(function (trackedElement) {
		// Only attach if the element is not set to stop on engagement
		// and if it is, that it is not already engaged.
		if (!trackedElement.stopOnEngaged) {
			this._attachElementListeners(trackedElement);
		} else if (!trackedElement.engaged) {
			this._attachElementListeners(trackedElement);
		}
	}, this);
};

/**
 * @desc Removes EventEmitter listeners from all TrackedElement objects
 * @private
 */
proto._removeAllElementListeners = function () {
	this.elements.forEach(function (trackedElement) {
		this._removeElementListeners(trackedElement);
	}, this);
};


/**
 * @desc is the element in view past its defined threshold? Offset if viewport is >= element height.
 * @private
 */
proto._elementInViewPastThreshold = function (trackedElement) {
	var winHeight = document.documentElement.clientHeight || window.innerHeight;
	var isIt = false;

	// if the whole viewport is filled with the element, then we consider that enough in view
	if (trackedElement.pixelsInView === winHeight) {
		isIt = true;
	} else {
		isIt = (trackedElement.percentInView > trackedElement.inViewThreshold);
	}

	return isIt;
};


/**
 * @desc Conditions to meet and actions to take when refreshing the element's state if is in view, but was not necessarily already in view.
 * @private
 */
proto._ifInView = function (trackedElement, alreadyInView) {
	var alreadyInThreshold = trackedElement.inThreshold;
	Super.prototype._ifInView.apply(this, arguments);

	// if element enters view threshold
	if (!alreadyInThreshold && this._elementInViewPastThreshold(trackedElement)) {
		trackedElement.inThreshold = true;
		trackedElement.trigger('thresholdenter', trackedElement);

		if (typeof trackedElement.timeToEngage === 'number' && trackedElement.timeToEngage >= 0) {
			trackedElement.engagedTimeout = window.setTimeout(this._engaged.bind(this, trackedElement), trackedElement.timeToEngage);
		}
	}
};

/**
 * @desc Conditions to meet and actions to take when refreshing the element's state if it was already in view, but not necessarily in view anymore.
 * @private
 */
proto._ifAlreadyInView = function (trackedElement) {
	var alreadyInThreshold = trackedElement.inThreshold;
	Super.prototype._ifAlreadyInView.apply(this, arguments);

	// if element exits view threshold
	if (alreadyInThreshold && !this._elementInViewPastThreshold(trackedElement)) {
		trackedElement.inThreshold = false;
		trackedElement.trigger('thresholdexit', trackedElement);

		if (trackedElement.engagedTimeout) {
			window.clearTimeout(trackedElement.engagedTimeout);
			trackedElement.engagedTimeout = null;
		}
	}
};

proto._engaged = function (trackedElement) {
	trackedElement.engagedTimeout = null;
	this._elementEngaged(trackedElement);
	trackedElement.trigger('engaged', trackedElement);
	this.trigger('engaged', trackedElement);
};

/**
 * @desc Method that gets fired on EventEmitter 'thresholdenter' event
 * @private
 */
proto._thresholdEnter = function (trackedElement) {
	// replace old values
	trackedElement.thresholdEnterTime = Date.now();
	trackedElement.thresholdExitTime = 0;

	// fire thresholdenter event
	this.trigger('thresholdenter', trackedElement);
};

/**
 * @desc Method that gets fired on EventEmitter 'thresholdexit' event
 * @private
 **/
proto._thresholdExit = function (trackedElement) {
	// set exit time
	trackedElement.thresholdExitTime = Date.now();

	// fire thresholdexit event
	this.trigger('thresholdexit', trackedElement);
};

proto._enterView = function (trackedElement) {
	this.trigger('enterview', trackedElement);
};

proto._exitView = function (trackedElement) {
	this.trigger('exitview', trackedElement);
};

/**
 * @desc Method that fires on EventEmitter 'engaged' event
 * @private
 */
proto._elementEngaged = function (trackedElement) {
	trackedElement.engaged = true;
	// stop tracking element if stopOnEngaged is true
	if (trackedElement.stopOnEngaged) {
		this.stop(trackedElement);
	}
};


/**
 * Public methods
 */

/**
 * @method
 * @public
 * @desc Remove tracking from all elements. Or pass a single TrackedElement object to
 *       remove tracking from only that element.
 * @name ElementEngagement#stop
 * @param {Object} [trackedElement] - A TrackedElement object that is provided to ElementEngagement
 *                                    by ElementTracker.
 */
proto.stop = function (trackedElement) {
	// stop everything
	if (this.tracking && !trackedElement) {
		this._removeAllElementListeners();
		Super.prototype.stop.call(this);
	}

	// just stop tracking the trackedElement
	if (trackedElement && trackedElement.tracking) {
		trackedElement.tracking = false;
		this._removeElementListeners(trackedElement);
	}

};

/**
 * @method
 * @public
 * @desc Start tracking all elements, or pass a single TrackedElement object to start
 *       tracking only that element. Will not resume tracking on elements that have
 *       already been engaged.
 * @name ElementEngagement#start
 * @param {Object} [trackedElement] - A TrackedElement object that is provided to ElementEngagement
 *                                    by ElementTracker.
 */
proto.start = function (trackedElement) {
	// start everything
	if (!trackedElement) {
		this._attachAllElementListeners();
	}

	// just start tracking the trackedElement
	if (trackedElement && !trackedElement.tracking) {
		if (!trackedElement.stopOnEngaged) {
			trackedElement.tracking = true;
			this._attachElementListeners(trackedElement);
		} else if (!trackedElement.engaged) {
			trackedElement.tracking = true;
			this._attachElementListeners(trackedElement);
		}
	}

	// Start tracking if not already. Else, force metrics and state update on all elements
	if (!this.tracking) {
		Super.prototype.start.call(this);
	} else {
		this.refreshAllElementMetrics();
		this.refreshAllElementStates();
	}

};

// add a single element
/**
 * Add an element to track for engagement
 * @param {HTMLElement} element
 * @param {Object} options
 * @param {number} options.timeToEngage			 Time an element must be in view beyond its threshold to be 'engaged'
 * @param {number} options.inViewThreshold		 Percentage [0.0-1.0] an element must be in view to be considered being in view past its threshold
 * @param {boolean} options.stopOnEngaged		 Stop tracking/emitting events once element becomes engaged
 * @param {boolean} options.useRenderedPosition	 If true, element will be tracked using its final rendered/transformed position
 * @returns {TrackedElement}
 */
proto.addElement = function (element, options) {
	options = options || {};

	var trackedElement = Super.prototype.addElement.call(this, element, options.useRenderedPosition);
	this._decorateTrackedElement(trackedElement, options);

	return trackedElement;
};

/**
 * Add a nodelist or array of elements with the same options
 * @param {NodeList|Array.<HTMLElement>} collection
 * @param {Object} options
 * @param {number} options.timeToEngage			 Time an element must be in view beyond its threshold to be 'engaged'
 * @param {number} options.inViewThreshold		 Percentage [0.0-1.0] an element must be in view to be considered being in view past its threshold
 * @param {boolean} options.stopOnEngaged		 Stop tracking/emitting events once element becomes engaged
 * @param {boolean} options.useRenderedPosition	 If true, element will be tracked using its final rendered/transformed position
 */
proto.addElements = function (collection, options) {
	[].forEach.call(collection, function (element) {
		this.addElement(element, options);
	}, this);
};


module.exports = ElementEngagement;

// ac-element-engagement@2.1.0

},{"@marcom/ac-element-tracker":203,"@marcom/ac-event-emitter-micro":206,"@marcom/ac-object/create":215,"@marcom/ac-object/defaults":216,"@marcom/ac-object/extend":217}],225:[function(require,module,exports){
arguments[4][151][0].apply(exports,arguments)
},{"./flatten":226,"./intersection":227,"./shuffle":228,"./toArray":229,"./union":230,"./unique":231,"./without":232,"dup":151}],226:[function(require,module,exports){
arguments[4][152][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/isArray":383,"@marcom/ac-polyfills/Array/prototype.forEach":386,"dup":152}],227:[function(require,module,exports){
arguments[4][153][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/prototype.indexOf":387,"dup":153}],228:[function(require,module,exports){
arguments[4][154][0].apply(exports,arguments)
},{"dup":154}],229:[function(require,module,exports){
arguments[4][155][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/prototype.slice":389,"dup":155}],230:[function(require,module,exports){
arguments[4][156][0].apply(exports,arguments)
},{"./flatten":226,"./toArray":229,"./unique":231,"dup":156}],231:[function(require,module,exports){
arguments[4][157][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/prototype.indexOf":387,"@marcom/ac-polyfills/Array/prototype.reduce":388,"dup":157}],232:[function(require,module,exports){
arguments[4][158][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/prototype.indexOf":387,"@marcom/ac-polyfills/Array/prototype.slice":389,"dup":158}],233:[function(require,module,exports){
arguments[4][159][0].apply(exports,arguments)
},{"./shared/getEventType":243,"./utils/addEventListener":247,"dup":159}],234:[function(require,module,exports){
arguments[4][160][0].apply(exports,arguments)
},{"./shared/getEventType":243,"./utils/dispatchEvent":248,"dup":160}],235:[function(require,module,exports){
arguments[4][161][0].apply(exports,arguments)
},{"./addEventListener":233,"./dispatchEvent":234,"./preventDefault":241,"./removeEventListener":242,"./stop":244,"./stopPropagation":245,"./target":246,"dup":161}],236:[function(require,module,exports){
arguments[4][162][0].apply(exports,arguments)
},{"./shared/camelCasedEventTypes":237,"./shared/prefixHelper":238,"./shared/windowFallbackEventTypes":239,"./utils/eventTypeAvailable":240,"dup":162}],237:[function(require,module,exports){
arguments[4][163][0].apply(exports,arguments)
},{"dup":163}],238:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],239:[function(require,module,exports){
arguments[4][165][0].apply(exports,arguments)
},{"dup":165}],240:[function(require,module,exports){
arguments[4][166][0].apply(exports,arguments)
},{"dup":166}],241:[function(require,module,exports){
arguments[4][167][0].apply(exports,arguments)
},{"dup":167}],242:[function(require,module,exports){
arguments[4][168][0].apply(exports,arguments)
},{"./shared/getEventType":243,"./utils/removeEventListener":249,"dup":168}],243:[function(require,module,exports){
arguments[4][169][0].apply(exports,arguments)
},{"@marcom/ac-prefixer/getEventType":236,"dup":169}],244:[function(require,module,exports){
arguments[4][170][0].apply(exports,arguments)
},{"./preventDefault":241,"./stopPropagation":245,"dup":170}],245:[function(require,module,exports){
arguments[4][171][0].apply(exports,arguments)
},{"dup":171}],246:[function(require,module,exports){
arguments[4][172][0].apply(exports,arguments)
},{"dup":172}],247:[function(require,module,exports){
arguments[4][173][0].apply(exports,arguments)
},{"dup":173}],248:[function(require,module,exports){
arguments[4][174][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/CustomEvent":391,"dup":174}],249:[function(require,module,exports){
arguments[4][175][0].apply(exports,arguments)
},{"dup":175}],250:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],251:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],252:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],253:[function(require,module,exports){
arguments[4][179][0].apply(exports,arguments)
},{"dup":179}],254:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],255:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],256:[function(require,module,exports){
arguments[4][182][0].apply(exports,arguments)
},{"./COMMENT_NODE":250,"./DOCUMENT_FRAGMENT_NODE":251,"./DOCUMENT_NODE":252,"./DOCUMENT_TYPE_NODE":253,"./ELEMENT_NODE":254,"./TEXT_NODE":255,"./createDocumentFragment":257,"./filterByNodeType":258,"./hasAttribute":259,"./indexOf":260,"./insertAfter":261,"./insertBefore":262,"./insertFirstChild":263,"./insertLastChild":264,"./isComment":267,"./isDocument":268,"./isDocumentFragment":269,"./isDocumentType":270,"./isElement":271,"./isNode":272,"./isNodeList":273,"./isTextNode":274,"./remove":275,"./replace":276,"dup":182}],257:[function(require,module,exports){
arguments[4][183][0].apply(exports,arguments)
},{"dup":183}],258:[function(require,module,exports){
arguments[4][184][0].apply(exports,arguments)
},{"./ELEMENT_NODE":254,"./internal/isNodeType":265,"@marcom/ac-polyfills/Array/prototype.filter":385,"@marcom/ac-polyfills/Array/prototype.slice":389,"dup":184}],259:[function(require,module,exports){
arguments[4][185][0].apply(exports,arguments)
},{"dup":185}],260:[function(require,module,exports){
arguments[4][186][0].apply(exports,arguments)
},{"./filterByNodeType":258,"./internal/validate":266,"@marcom/ac-polyfills/Array/prototype.indexOf":387,"@marcom/ac-polyfills/Array/prototype.slice":389,"dup":186}],261:[function(require,module,exports){
arguments[4][187][0].apply(exports,arguments)
},{"./internal/validate":266,"dup":187}],262:[function(require,module,exports){
arguments[4][188][0].apply(exports,arguments)
},{"./internal/validate":266,"dup":188}],263:[function(require,module,exports){
arguments[4][189][0].apply(exports,arguments)
},{"./internal/validate":266,"dup":189}],264:[function(require,module,exports){
arguments[4][190][0].apply(exports,arguments)
},{"./internal/validate":266,"dup":190}],265:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"../isNode":272,"dup":35}],266:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"../COMMENT_NODE":250,"../DOCUMENT_FRAGMENT_NODE":251,"../ELEMENT_NODE":254,"../TEXT_NODE":255,"./isNodeType":265,"dup":36}],267:[function(require,module,exports){
arguments[4][193][0].apply(exports,arguments)
},{"./COMMENT_NODE":250,"./internal/isNodeType":265,"dup":193}],268:[function(require,module,exports){
arguments[4][194][0].apply(exports,arguments)
},{"./DOCUMENT_NODE":252,"./internal/isNodeType":265,"dup":194}],269:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"./DOCUMENT_FRAGMENT_NODE":251,"./internal/isNodeType":265,"dup":37}],270:[function(require,module,exports){
arguments[4][196][0].apply(exports,arguments)
},{"./DOCUMENT_TYPE_NODE":253,"./internal/isNodeType":265,"dup":196}],271:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./ELEMENT_NODE":254,"./internal/isNodeType":265,"dup":38}],272:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],273:[function(require,module,exports){
arguments[4][199][0].apply(exports,arguments)
},{"dup":199}],274:[function(require,module,exports){
arguments[4][200][0].apply(exports,arguments)
},{"./TEXT_NODE":255,"./internal/isNodeType":265,"dup":200}],275:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"./internal/validate":266,"dup":40}],276:[function(require,module,exports){
arguments[4][202][0].apply(exports,arguments)
},{"./internal/validate":266,"dup":202}],277:[function(require,module,exports){
arguments[4][208][0].apply(exports,arguments)
},{"dup":208,"qs":278}],278:[function(require,module,exports){
arguments[4][209][0].apply(exports,arguments)
},{"./parse":279,"./stringify":280,"dup":209}],279:[function(require,module,exports){
arguments[4][210][0].apply(exports,arguments)
},{"./utils":281,"dup":210}],280:[function(require,module,exports){
arguments[4][211][0].apply(exports,arguments)
},{"./utils":281,"dup":211}],281:[function(require,module,exports){
arguments[4][212][0].apply(exports,arguments)
},{"dup":212}],282:[function(require,module,exports){
arguments[4][213][0].apply(exports,arguments)
},{"./clone":283,"./create":284,"./defaults":285,"./extend":286,"./getPrototypeOf":287,"./isDate":288,"./isEmpty":289,"./isRegExp":290,"./toQueryParameters":291,"dup":213}],283:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./extend":286,"@marcom/ac-polyfills/Array/isArray":383,"dup":96}],284:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"dup":97}],285:[function(require,module,exports){
arguments[4][216][0].apply(exports,arguments)
},{"./extend":286,"dup":216}],286:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/prototype.forEach":386,"dup":98}],287:[function(require,module,exports){
arguments[4][218][0].apply(exports,arguments)
},{"dup":218}],288:[function(require,module,exports){
arguments[4][219][0].apply(exports,arguments)
},{"dup":219}],289:[function(require,module,exports){
arguments[4][220][0].apply(exports,arguments)
},{"dup":220}],290:[function(require,module,exports){
arguments[4][221][0].apply(exports,arguments)
},{"dup":221}],291:[function(require,module,exports){
arguments[4][222][0].apply(exports,arguments)
},{"@marcom/ac-url/joinSearchParams":277,"dup":222}],292:[function(require,module,exports){
arguments[4][203][0].apply(exports,arguments)
},{"./ac-element-tracker/ElementTracker":293,"dup":203}],293:[function(require,module,exports){
arguments[4][204][0].apply(exports,arguments)
},{"./TrackedElement":294,"@marcom/ac-array":225,"@marcom/ac-dom-events":235,"@marcom/ac-dom-metrics/getDimensions":6,"@marcom/ac-dom-metrics/getPagePosition":7,"@marcom/ac-dom-metrics/getScrollY":12,"@marcom/ac-dom-nodes":256,"@marcom/ac-object":282,"@marcom/ac-polyfills/Function/prototype.bind":393,"dup":204}],294:[function(require,module,exports){
arguments[4][205][0].apply(exports,arguments)
},{"@marcom/ac-dom-nodes":256,"@marcom/ac-event-emitter-micro":295,"@marcom/ac-object":282,"dup":205}],295:[function(require,module,exports){
arguments[4][206][0].apply(exports,arguments)
},{"./ac-event-emitter-micro/EventEmitterMicro":296,"dup":206}],296:[function(require,module,exports){
arguments[4][207][0].apply(exports,arguments)
},{"dup":207}],297:[function(require,module,exports){
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

},{"./className/add":299,"@marcom/ac-polyfills/Array/prototype.slice":389,"@marcom/ac-polyfills/Element/prototype.classList":392}],298:[function(require,module,exports){
/**
 * @module ac-classlist/className
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	add: require('./className/add'),
	contains: require('./className/contains'),
	remove: require('./className/remove')
};

// ac-classlist@1.3.0

},{"./className/add":299,"./className/contains":300,"./className/remove":302}],299:[function(require,module,exports){
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

},{"./contains":300}],300:[function(require,module,exports){
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

},{"./getTokenRegExp":301}],301:[function(require,module,exports){
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

},{}],302:[function(require,module,exports){
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

},{"./contains":300,"./getTokenRegExp":301}],303:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var classNameContains = require('./className/contains');

/**
 * @name module:ac-classlist.contains
 *
 * @function
 *
 * @desc Checks if an Element's classList contains a specific token.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The token to be checked
 *
 * @returns {Boolean} `true` if classList contains token, otherwise `false`
 */
module.exports = function contains(el, token) {
	if (el.classList && el.classList.contains) {
		return el.classList.contains(token);
	}

	return classNameContains(el, token);
};

// ac-classlist@1.3.0

},{"./className/contains":300,"@marcom/ac-polyfills/Element/prototype.classList":392}],304:[function(require,module,exports){
/**
 * @module ac-classlist
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	add: require('./add'),
	contains: require('./contains'),
	remove: require('./remove'),
	toggle: require('./toggle')
};

// ac-classlist@1.3.0

},{"./add":297,"./contains":303,"./remove":305,"./toggle":306}],305:[function(require,module,exports){
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

},{"./className/remove":302,"@marcom/ac-polyfills/Array/prototype.slice":389,"@marcom/ac-polyfills/Element/prototype.classList":392}],306:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

require('@marcom/ac-polyfills/Element/prototype.classList');

/** @ignore */
var className = require('./className');

/**
 * @name module:ac-classlist.toggle
 *
 * @function
 *
 * @desc Toggles a token in an Element's classList.
 *       Accounts for browsers without classList support.
 *
 * @param {Element} el
 *        The target Element
 *
 * @param {String} token
 *        The token to be toggled
 *
 * @param {Boolean} [force]
 *        Optionally forces add with `true` and remove with `false`
 *
 * @returns {Boolean} `true` if classList contains token after the toggle, otherwise `false`
 */
module.exports = function toggle(el, token, force) {
	var hasForce = (typeof force !== 'undefined');
	var addToken;

	if (el.classList && el.classList.toggle) {
		if (hasForce) {
			return el.classList.toggle(token, force);
		}

		return el.classList.toggle(token);
	}

	if (hasForce) {
		addToken = !!force;
	} else {
		addToken = !className.contains(el, token);
	}

	if (addToken) {
		className.add(el, token);
	} else {
		className.remove(el, token);
	}

	return addToken;
};

// ac-classlist@1.3.0

},{"./className":298,"@marcom/ac-polyfills/Element/prototype.classList":392}],307:[function(require,module,exports){
arguments[4][159][0].apply(exports,arguments)
},{"./shared/getEventType":317,"./utils/addEventListener":321,"dup":159}],308:[function(require,module,exports){
arguments[4][160][0].apply(exports,arguments)
},{"./shared/getEventType":317,"./utils/dispatchEvent":322,"dup":160}],309:[function(require,module,exports){
arguments[4][161][0].apply(exports,arguments)
},{"./addEventListener":307,"./dispatchEvent":308,"./preventDefault":315,"./removeEventListener":316,"./stop":318,"./stopPropagation":319,"./target":320,"dup":161}],310:[function(require,module,exports){
arguments[4][162][0].apply(exports,arguments)
},{"./shared/camelCasedEventTypes":311,"./shared/prefixHelper":312,"./shared/windowFallbackEventTypes":313,"./utils/eventTypeAvailable":314,"dup":162}],311:[function(require,module,exports){
arguments[4][163][0].apply(exports,arguments)
},{"dup":163}],312:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],313:[function(require,module,exports){
arguments[4][165][0].apply(exports,arguments)
},{"dup":165}],314:[function(require,module,exports){
arguments[4][166][0].apply(exports,arguments)
},{"dup":166}],315:[function(require,module,exports){
arguments[4][167][0].apply(exports,arguments)
},{"dup":167}],316:[function(require,module,exports){
arguments[4][168][0].apply(exports,arguments)
},{"./shared/getEventType":317,"./utils/removeEventListener":323,"dup":168}],317:[function(require,module,exports){
arguments[4][169][0].apply(exports,arguments)
},{"@marcom/ac-prefixer/getEventType":310,"dup":169}],318:[function(require,module,exports){
arguments[4][170][0].apply(exports,arguments)
},{"./preventDefault":315,"./stopPropagation":319,"dup":170}],319:[function(require,module,exports){
arguments[4][171][0].apply(exports,arguments)
},{"dup":171}],320:[function(require,module,exports){
arguments[4][172][0].apply(exports,arguments)
},{"dup":172}],321:[function(require,module,exports){
arguments[4][173][0].apply(exports,arguments)
},{"dup":173}],322:[function(require,module,exports){
arguments[4][174][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/CustomEvent":391,"dup":174}],323:[function(require,module,exports){
arguments[4][175][0].apply(exports,arguments)
},{"dup":175}],324:[function(require,module,exports){
arguments[4][206][0].apply(exports,arguments)
},{"./ac-event-emitter-micro/EventEmitterMicro":325,"dup":206}],325:[function(require,module,exports){
arguments[4][207][0].apply(exports,arguments)
},{"dup":207}],326:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./shared/getStyleTestElement":328,"./shared/prefixHelper":329,"./shared/stylePropertyCache":330,"./utils/toCSS":332,"./utils/toDOM":333,"dup":17}],327:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"./getStyleProperty":326,"./shared/prefixHelper":329,"./shared/stylePropertyCache":330,"./shared/styleValueAvailable":331,"dup":18}],328:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],329:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],330:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],331:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"./getStyleTestElement":328,"./stylePropertyCache":330,"dup":22}],332:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],333:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],334:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"@marcom/ac-function/memoize":337,"@marcom/ac-prefixer/getStyleProperty":326,"@marcom/ac-prefixer/getStyleValue":327,"dup":95}],335:[function(require,module,exports){
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
	getWindow: function () {
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
	getDocument: function () {
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
	getNavigator: function () {
		return navigator;
	}
};

// ac-feature@2.5.0

},{}],336:[function(require,module,exports){
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

// ac-feature@2.5.0

},{"./helpers/globals":335,"@marcom/ac-function/once":338}],337:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"dup":86}],338:[function(require,module,exports){
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

	return function () {
		if (typeof result === 'undefined') {
			result = func.apply(this, arguments);
		}

		return result;
	};
};

// ac-function@1.2.0

},{}],339:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-function.throttle
 *
 * @function
 * 
 * @desc Returns a function, that, when invoked, will only be triggered
 *       at most once during a given window of time.
 *
 * @param {Function} func
 *        The function to be executed.
 *
 * @param {Number} wait
 *        The time to wait before executing the function in milliseconds.
 *
 * @returns {Function} Throttled function.
 */
module.exports = function throttle (func, wait) {
	var timeout = null;
	return function () {	
		if (timeout === null) {
			func.apply(this, arguments);
			timeout = setTimeout(function () {
				timeout = null;
			}, wait);
		}
	};
};

// ac-function@1.2.0

},{}],340:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var ac_addEventListener = require('@marcom/ac-dom-events/utils/addEventListener');
var ac_removeEventListener = require('@marcom/ac-dom-events/utils/removeEventListener');
var create = require('@marcom/ac-object/create');

/** @ignore */
var KeyEvent = require('./internal/KeyEvent');

/** @ignore */
var KEYDOWN = 'keydown';
var KEYUP = 'keyup';

/**
 * @name module:ac-keyboard.Keyboard
 * @class
 * @extends EventEmitterMicro
 *
 * @desc A simple `EventEmitterMicro` based Class for reacting to `keydown` and `keup` keyboard events
 *
 * @example
 *
 * var keyboard = require('@marcom/ac-keyboard');
 *
 * keyboard.onDown(13, function (evt) {
 *     console.log('You pressed the enter key');
 * });
 *
 * keyboard.onUp(13, function (evt) {
 *     console.log('You released the enter key');
 * });
 */
function Keyboard(contextElement) {
	this._keysDown = {};

	// prebind key handlers
	this._DOMKeyDown = this._DOMKeyDown.bind(this);
	this._DOMKeyUp = this._DOMKeyUp.bind(this);

	this._context = contextElement || document;

	ac_addEventListener(this._context, KEYDOWN, this._DOMKeyDown, true);
	ac_addEventListener(this._context, KEYUP, this._DOMKeyUp, true);

	// call super constructor
	EventEmitterMicro.call(this);
}

var proto = Keyboard.prototype = create(EventEmitterMicro.prototype);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////


/**
 * @name module:ac-keyboard.Keyboard#onDown
 * @function
 *
 * @desc Add a `callback` for the keydown event for passed `keyCode`.
 *
 * @param {(Number|String)} keyCode
 *        The `keyCode` to add a `callback` to for a keydown event
 *
 * @param {Function} callback
 *        The `callback` to be invoked on keydown of the passed `keyCode`
 */
proto.onDown = function(keyCode, callback) {
	return this.on(KEYDOWN + ':' + keyCode, callback);
};

/**
 * @name module:ac-keyboard.Keyboard#onceDown
 * @function
 *
 * @desc  Add `callback` for the keydown event for passed `keyCode`. The callback will only be invoked once.
 *
 * @param {(Number|String)} keyCode
 *        The `keyCode` to add a `callback` to for a keydown event
 *
 * @param {Function} callback
 *        The `callback` to add to the keydown event of the passed `keyCode`
 */
proto.onceDown = function(keyCode, callback) {
	return this.once(KEYDOWN + ':' + keyCode, callback);
};

/**
 * @name module:ac-keyboard.Keyboard#offDown
 * @function
 *
 * @desc  Remove `callback` from the keydown event for passed `keyCode`.
 *
 * @param {(Number|String)} keyCode
 *        The `keyCode` to remove a `callback` from for a keydown event
 *
 * @param {Function} callback
 *        The `callback` to remove from the keydown event of the passed `keyCode`
 */
proto.offDown = function(keyCode, callback) {
	return this.off(KEYDOWN + ':' + keyCode, callback);
};

/**
 * @name module:ac-keyboard.Keyboard#onUp
 * @function
 *
 * @desc Add a `callback` for the keyup event for passed `keyCode`.
 *
 * @param {(Number|String)} keyCode
 *       The `keyCode` to add a `callback` to for a keyup event
 *
 * @param {Function} callback
 *        The `callback` to be invoked on keyup of the passed `keyCode`
 */
proto.onUp = function(keyCode, callback) {
	return this.on(KEYUP + ':' + keyCode, callback);
};

/**
 * @name module:ac-keyboard.Keyboard#onceUp
 * @function
 *
 * @desc  Add `callback` for the keyup event for passed `keyCode`. The callback will only be invoked once.
 *
 * @param {(Number|String)} keyCode
 *        The `keyCode` to add a `callback` to for a keyup event
 *
 * @param {Function} callback
 *        The `callback` to add to the keyup event of the passed `keyCode`
 */
proto.onceUp = function(keyCode, callback) {
	return this.once(KEYUP + ':' + keyCode, callback);
};


/**
 * @name module:ac-keyboard.Keyboard#offUp
 * @function
 *
 * @desc  Remove `callback` from the keyup event for passed `keyCode`.
 *
 * @param {(Number|String)} keyCode
 *        The `keyCode` to remove a `callback` from for a keyup event
 *
 * @param {Function} callback
 *        The `callback` to remove from the keyup event of the passed `keyCode`
 */
proto.offUp = function(keyCode, callback) {
	return this.off(KEYUP + ':' + keyCode, callback);
};

/**
 * @name module:ac-keyboard.Keyboard#isDown
 * @function
 *
 * @desc  Check if the passed `keyCode` key is down.
 *
 * @param {(Number|String)} keyCode
 *        The `keyCode` to check if key is down
 *
 * @returns {Boolean} true when the passed key is down else false.
 */
proto.isDown = function(keyCode) {
	keyCode += '';

	return this._keysDown[keyCode] || false;
};


/**
 * @name module:ac-keyboard.Keyboard#isUp
 * @function
 *
 * @desc  Check if the passed `keyCode` key is up.
 *
 * @param {(Number|String)} keyCode
 *        The `keyCode` to check if key is up
 *
 * @returns {Boolean} true when the passed key is up else false.
 */
proto.isUp = function(keyCode) {
	return !this.isDown(keyCode);
};

/**
 * @name module:ac-keyboard.Keyboard#destroy
 * @function
 *
 * @desc Unbind all event listeners and nullify all variables.
 */
proto.destroy = function() {	

	ac_removeEventListener(this._context, KEYDOWN, this._DOMKeyDown, true);
	ac_removeEventListener(this._context, KEYUP, this._DOMKeyUp, true);

	this._keysDown = null;
	this._context = null;

	// call Super destroy method
	EventEmitterMicro.prototype.destroy.call(this);

	return this;
};

////////////////////////////////////////
//////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-keyboard.Keyboard#_DOMKeyDown
 * @function
 * @private
 *
 * @param {Event} keyboardEvent
 *        A keyboard keydown event
 *
 * @fires module:ac-keyboard.Keyboard#keydown:keyCode
 */
/** @ignore */
proto._DOMKeyDown = function(keyboardEvent) {
	var evt = this._normalizeKeyboardEvent(keyboardEvent);
	var keyCode = evt.keyCode += '';

	this._trackKeyDown(keyCode);

	/**
     * Keydown event.
     *
     * @event module:ac-keyboard.Keyboard#keydown:keyCode
     * @type {object}
     * @description Fires a `keydown:keyCode` event containing a
     *              normalized keyboardEvent.
     */
	this.trigger(KEYDOWN + ':' + keyCode, evt);
};

/**
 * @name module:ac-keyboard.Keyboard#_DOMKeyUp
 * @function
 * @private
 *
 * @param {Event} keyboardEvent
 *        A keyboard keyup event
 *
 * @fires module:ac-keyboard.Keyboard#keyup:keyCode
 */
/** @ignore */
proto._DOMKeyUp = function(keyboardEvent) {
	var evt = this._normalizeKeyboardEvent(keyboardEvent);
	var keyCode = evt.keyCode += '';

	this._trackKeyUp(keyCode);
	/**
	* Keyup event.
	*
	* @event module:ac-keyboard.Keyboard#keyup:keyCode
	* @type {object}
	*
	* @description Fires a `keyup:keyCode` event containing a
	*              normalized keyboardEvent.
	*/
	this.trigger(KEYUP + ':' + keyCode, evt);
};

/**
 * @name module:ac-keyboard.Keyboard#_normalizeKeyboardEvent
 * @function
 * @private
 *
 * @param {Event} keyboardEvent
 *        A keyboard keyup or keydown event
 */
/** @ignore */
proto._normalizeKeyboardEvent = function(keyboardEvent) {
	return new KeyEvent(keyboardEvent);
};

/**
 * @name module:ac-keyboard.Keyboard#_trackKeyUp
 * @function
 * @private
 *
 * @param {String} keyCode
 *        A keyboard `keyCode`
 */
/** @ignore */
proto._trackKeyUp = function(keyCode) {
	if (this._keysDown[keyCode]) {
		this._keysDown[keyCode] = false;
	}
};

/**
 * @name module:ac-keyboard.Keyboard#_trackKeyDown
 * @function
 * @private
 *
 * @param {String} keyCode
 *        A keyboard `keyCode`
 */
/** @ignore */
proto._trackKeyDown = function(keyCode) {
	if (!this._keysDown[keyCode]) {
		this._keysDown[keyCode] = true;
	}
};

module.exports = Keyboard;

// ac-keyboard@1.2.1

},{"./internal/KeyEvent":342,"@marcom/ac-dom-events/utils/addEventListener":321,"@marcom/ac-dom-events/utils/removeEventListener":323,"@marcom/ac-event-emitter-micro":324,"@marcom/ac-object/create":345}],341:[function(require,module,exports){
/**
 * @module ac-keyboard
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Keyboard = require('./Keyboard');

module.exports = new Keyboard();

// ac-keyboard@1.2.1

},{"./Keyboard":340}],342:[function(require,module,exports){
'use strict';

var blackList = ['keyLocation'];

function KeyEvent(originalEvt) {
	this.originalEvent = originalEvt;
	var prop;

	for (prop in originalEvt) {
		if (blackList.indexOf(prop) === -1 && typeof originalEvt[prop] !== 'function') {
			this[prop] = originalEvt[prop];
		}
	}

	this.location = (this.originalEvent.location !== undefined) ? this.originalEvent.location : this.originalEvent.keyLocation;
}

KeyEvent.prototype = {

	preventDefault: function() {
		if (typeof this.originalEvent.preventDefault !== 'function') {
			this.originalEvent.returnValue = false;
			return;
		}

		return this.originalEvent.preventDefault();
	},

	stopPropagation: function() {
		return this.originalEvent.stopPropagation();
	}

};

module.exports = KeyEvent;

// ac-keyboard@1.2.1

},{}],343:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-keyboard.keyMap
 * @module
 *
 * @desc A map of `keyCodes` to their more recognizable names (US).
 *
 * @example
 *
 * var keyMap = require('@marcom/ac-keyboard/keyMap');
 *
 * console.log(keyMap.ENTER);
 * // 13
 *
 * @example
 *
 * var keyboard = require('@marcom/ac-keyboard');
 * var keyMap = require('@marcom/ac-keyboard/keyMap');
 *
 * keyboard.onDown(keyMap.ENTER, function (evt) {
 *     console.log('You pressed the enter key');
 * });
 *
 * keyboard.onUp(keyMap.ENTER, function (evt) {
 *     console.log('You released the enter key');
 * });
 */
module.exports = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CONTROL: 17,
	ALT: 18,
	COMMAND: 91,
	CAPSLOCK: 20,
	ESCAPE: 27,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	ARROW_LEFT: 37,
	ARROW_UP: 38,
	ARROW_RIGHT: 39,
	ARROW_DOWN: 40,
	DELETE: 46,
	ZERO: 48,
	ONE: 49,
	TWO: 50,
	THREE: 51,
	FOUR: 52,
	FIVE: 53,
	SIX: 54,
	SEVEN: 55,
	EIGHT: 56,
	NINE: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	NUMPAD_ZERO: 96,
	NUMPAD_ONE: 97,
	NUMPAD_TWO: 98,
	NUMPAD_THREE: 99,
	NUMPAD_FOUR: 100,
	NUMPAD_FIVE: 101,
	NUMPAD_SIX: 102,
	NUMPAD_SEVEN: 103,
	NUMPAD_EIGHT: 104,
	NUMPAD_NINE: 105,
	NUMPAD_ASTERISK: 106,
	NUMPAD_PLUS: 107,
	NUMPAD_DASH: 109,
	NUMPAD_DOT: 110,
	NUMPAD_SLASH: 111,
	NUMPAD_EQUALS: 187,
	TICK: 192,
	LEFT_BRACKET: 219,
	RIGHT_BRACKET: 221,
	BACKSLASH: 220,
	SEMICOLON: 186,
	APOSTRAPHE: 222,
	APOSTROPHE: 222,
	SPACEBAR: 32,
	CLEAR: 12,
	COMMA: 188,
	DOT: 190,
	SLASH: 191
};

// ac-keyboard@1.2.1

},{}],344:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./extend":346,"@marcom/ac-polyfills/Array/isArray":383,"dup":96}],345:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"dup":97}],346:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@marcom/ac-polyfills/Array/prototype.forEach":386,"dup":98}],347:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./ac-page-visibility/PageVisibilityManager":348,"dup":99}],348:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"@marcom/ac-event-emitter-micro":324,"@marcom/ac-object/create":345,"dup":100}],349:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"./ac-browser/BrowserData":350,"./ac-browser/IE":351,"dup":1}],350:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./data":352,"@marcom/ac-polyfills/Array/prototype.filter":385,"@marcom/ac-polyfills/Array/prototype.some":390,"dup":2}],351:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],352:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],353:[function(require,module,exports){
/**
 * @module ac-pointer-tracker
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	PointerTracker: require('./ac-pointer-tracker/PointerTracker')
};

},{"./ac-pointer-tracker/PointerTracker":354}],354:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_browser = require('@marcom/ac-browser');
var ac_dom_events = require('@marcom/ac-dom-events');
var ac_dom_styles = require('@marcom/ac-dom-styles');
var create = require('@marcom/ac-object/create');
var isLowThreshold = ac_browser.os === 'Android' || (ac_browser.name === 'IE' && ac_browser.version <= 8);
var touchAvailable = require('@marcom/ac-feature/touchAvailable')();

/** @ignore */
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;


/**
 * @name module:ac-pointer-tracker.PointerTracker
 * @class
 * @extends EventEmitterMicro
 *
 * @param {Element} el
 *        The element to attach event listeners to.
 *
 * @param {Object} [pointerEvents={
 *                      down: 'touchstart',
 *                      up: 'touchend',
 *                      out: 'mouseout',
 *                      move: 'touchmove'
 *                  }]
 *        The pointerEvents object defines which events to use for touch / mouse interactions.
 *
 * @param {Boolean} [options.lockVertical=true]
 *        Locks vertical scrolling on touch devices when the initial movement is horizontal.
 *
 * @param {Number} [options.swipeThreshold=PointerTracker.DEFAULT_SWIPE_THRESHOLD]
 *        The throw resistence for determining if movement is enough to justify a swipe event.
 */
function PointerTracker(el, pointerEvents, options) {
	this._el = el;
	options = options || {};
	this._lockVertical = options.lockVertical !== false;
	this._swipeThreshold = options.swipeThreshold || PointerTracker.DEFAULT_SWIPE_THRESHOLD;

	this._pointerEvents = pointerEvents || {};
	this._pointerEvents.down = this._pointerEvents.down || ((touchAvailable) ? PointerTracker.TOUCH_EVENTS.down : PointerTracker.MOUSE_EVENTS.down);
	this._pointerEvents.up = this._pointerEvents.up || ((touchAvailable) ? PointerTracker.TOUCH_EVENTS.up : PointerTracker.MOUSE_EVENTS.up);
	this._pointerEvents.out = this._pointerEvents.out || ((touchAvailable) ? PointerTracker.TOUCH_EVENTS.out : PointerTracker.MOUSE_EVENTS.out);
	this._pointerEvents.move = this._pointerEvents.move || ((touchAvailable) ? PointerTracker.TOUCH_EVENTS.move : PointerTracker.MOUSE_EVENTS.move);

	this._onMouseDown = this._onMouseDown.bind(this);
	this._onMouseUp = this._onMouseUp.bind(this);
	this._onMouseOut = this._onMouseOut.bind(this);
	this._onMouseMove = this._onMouseMove.bind(this);

	// call super constructor
	EventEmitterMicro.call(this);

	ac_dom_events.addEventListener(this._el, this._pointerEvents.down, this._onMouseDown);

	this._setCursorStyle('grab');
}

/** Events */
PointerTracker.START = 'start';
PointerTracker.END = 'end';
PointerTracker.UPDATE = 'update';
PointerTracker.SWIPE_RIGHT = 'swiperight';
PointerTracker.SWIPE_LEFT = 'swipeleft';


/** Public constants */
PointerTracker.DEFAULT_SWIPE_THRESHOLD = (isLowThreshold) ? 2 : 8; // throw resistance
PointerTracker.TOUCH_EVENTS = {
	down: 'touchstart',
	up: 'touchend',
	out: 'mouseout', // todo: should we use touchcancel here?
	move: 'touchmove'
};
PointerTracker.MOUSE_EVENTS = {
	down: 'mousedown',
	up: 'mouseup',
	out: 'mouseout',
	move: 'mousemove'
};


var Super = EventEmitterMicro.prototype;
var proto = PointerTracker.prototype = create(Super);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-pointer-tracker.PointerTracker#destroy
 * @function
 * @override
 *
 * @desc Unbinds event listeners and nullifies variables.
 */
proto.destroy = function () {
	if (this._isDragging) {
		this._onMouseUp();
	}
	ac_dom_events.removeEventListener(this._el, this._pointerEvents.down, this._onMouseDown);

	this._setCursorStyle(null);

	this._el = null;
	this._pointerEvents = null;
	this._lockVertical = null;
	this._swipeThreshold = null;
	this._checkForTouchScrollY = null;
	this._isDragging = null;
	this._currentX = null;
	this._currentY = null;
	this._velocityX = null;
	this._velocityY = null;
	this._lastX = null;
	this._lastY = null;

	// call / return Super destroy method
	return Super.destroy.call(this);
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-pointer-tracker.PointerTracker#_onMouseDown
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onMouseDown = function (evt) {
	if (this._isDragging) {
		// already dragging
		return;
	}

	this._isDragging = true;
	this._setCursorStyle('grabbing');

	ac_dom_events.removeEventListener(this._el, this._pointerEvents.down, this._onMouseDown);
	ac_dom_events.addEventListener(document.body, this._pointerEvents.up, this._onMouseUp);
	ac_dom_events.addEventListener(document, this._pointerEvents.out, this._onMouseOut);
	ac_dom_events.addEventListener(document.body, this._pointerEvents.move, this._onMouseMove);

	this._checkForTouchScrollY = this._lockVertical && !!(evt.touches && evt.touches[0]);
	if (this._checkForTouchScrollY) {
		this._lastY = this._getTouchY(evt);
	}

	var values = this._storeAndGetValues(evt);
	this._velocityX = values.diffX = 0;
	this._velocityY = values.diffY = 0;
	this.trigger(PointerTracker.START, values);
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_onMouseUp
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onMouseUp = function (evt) {
	if (!this._isDragging) {
		// not dragging
		return;
	}

	this._isDragging = false;
	this._setCursorStyle('grab');

	ac_dom_events.addEventListener(this._el, this._pointerEvents.down, this._onMouseDown);
	ac_dom_events.removeEventListener(document.body, this._pointerEvents.up, this._onMouseUp);
	ac_dom_events.removeEventListener(document, this._pointerEvents.out, this._onMouseOut);
	ac_dom_events.removeEventListener(document.body, this._pointerEvents.move, this._onMouseMove);

	var swipe;
	if (this._checkForTouchScrollY) {
		swipe = null;
	} else if (this._velocityX > this._swipeThreshold) {
		swipe = PointerTracker.SWIPE_LEFT;
	} else if ((this._velocityX * -1) > this._swipeThreshold) {
		swipe = PointerTracker.SWIPE_RIGHT;
	}

	var values = this._storeAndGetValues(evt);
	values.swipe = swipe;
	this.trigger(PointerTracker.END, values);

	if (swipe) {
		this.trigger(swipe, values);
	}
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_onMouseOut
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onMouseOut = function (evt) {
	evt = (evt) ? evt : window.event;
	var from = evt.relatedTarget || evt.toElement;
	if (!from || from.nodeName === 'HTML') {
		this._onMouseUp(evt);
	}
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_onMouseMove
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onMouseMove = function (evt) {
	if (this._checkForTouchScrollY && this._isVerticalTouchMove(evt)) {
		this._onMouseUp(evt);
		return;
	}

	ac_dom_events.preventDefault(evt);
	this.trigger(PointerTracker.UPDATE, this._storeAndGetValues(evt));
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_storeAndGetValues
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 *
 * @returns {Object} An object containing information about the pointer position.
 */
/** @ignore */
proto._storeAndGetValues = function (evt) {
	if (evt === undefined) {
		return {};
	}

	this._currentX = this._getPointerX(evt);
	this._currentY = this._getPointerY(evt);

	this._velocityX = this._lastX - this._currentX;
	this._velocityY = this._lastY - this._currentY;

	var values = {
		x: this._currentX,
		y: this._currentY,
		lastX: this._lastX,
		lastY: this._lastY,
		diffX: this._velocityX,
		diffY: this._velocityY,
		interactionEvent: evt
	};

	this._lastX = this._currentX;
	this._lastY = this._currentY;

	return values;
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_getPointerX
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 *
 * @returns {Number} The X position of the click or first touch.
 */
/** @ignore */
proto._getPointerX = function (evt) {
	if (evt.pageX) {
		return evt.pageX;
	} else if (evt.touches && evt.touches[0]) {
		return evt.touches[0].pageX;
	} else if (evt.clientX) {
		return evt.clientX;
	}
	return 0;
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_getPointerY
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 *
 * @returns {Number} The Y position of the click or first touch.
 */
/** @ignore */
proto._getPointerY = function (evt) {
	if (evt.pageY) {
		return evt.pageY;
	} else if (evt.touches && evt.touches[0]) {
		return evt.touches[0].pageY;
	} else if (evt.clientY) {
		return evt.clientY;
	}
	return 0;
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_getTouchX
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 *
 * @returns {Number} The X position of the click or first touch.
 */
/** @ignore */
proto._getTouchX = function (evt) {
	if (evt.touches && evt.touches[0]) {
		return evt.touches[0].pageX;
	}
	return 0;
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_getTouchY
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 *
 * @returns {Number} The Y position of the click or first touch.
 */
/** @ignore */
proto._getTouchY = function (evt) {
	if (evt.touches && evt.touches[0]) {
		return evt.touches[0].pageY;
	}
	return 0;
};

/**
 * @name module:ac-pointer-tracker.PointerTracker#_isVerticalTouchMove
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        MouseEvent or TouchEvent.
 *
 * @returns {Boolean} If the user is scrolling vertically.
 */
/** @ignore */
proto._isVerticalTouchMove = function (evt) {
	var x = this._getTouchX(evt);
	var y = this._getTouchY(evt);
	var diffX = Math.abs(x - this._lastX);
	var diffY = Math.abs(y - this._lastY);
	this._checkForTouchScrollY = (diffX < diffY);
	return this._checkForTouchScrollY;
};

/**
 * @name module:ac-pointer-tracker.SlideGallery#_setCursorStyle
 * @function
 * @private
 *
 * @param {String} cursor
 *        The CSS property to set the cursor to.
 */
/** @ignore */
proto._setCursorStyle = function (cursor) {
	ac_dom_styles.setStyle(this._el, {
		cursor: cursor
	});
};


module.exports = PointerTracker;

},{"@marcom/ac-browser":349,"@marcom/ac-dom-events":309,"@marcom/ac-dom-styles":26,"@marcom/ac-event-emitter-micro":324,"@marcom/ac-feature/touchAvailable":336,"@marcom/ac-object/create":345}],355:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Clip = require('@marcom/ac-eclipse').Clip;
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');

/**
 * @name module:ac-solar.fade
 *
 * @function
 *
 * @desc Fades from a start value to an end value an element.
 *
 * @param {Element} el
 *        The element to fade.
 *
 * @param {Number} from
 *        The opacity the fade should start from.
 *
 * @param {Number} to
 *        The opacity the fade should start end at.
 *
 * @param {Number} duration
 *        The duration of the fade, how long it should take to animation.
 *
 * @param {Object} options
 *        Contains any AC Clip options specific to your fade animation.
 *
 * @returns {Clip} The clip that controls the animation.
 */
module.exports = function fade (el, from, to, duration, options) {

	if (cssPropertyAvailable('opacity')) {
		options = options || {};

		if (duration) {
			options.propsFrom = options.propsFrom || {};
			options.propsFrom.opacity = from;

			return Clip.to(el, duration, {
				opacity: to
			}, options);
		}
		else {
			el.style.opacity = to;

			if (typeof options.onStart === 'function') {
				options.onStart();
			}

			if (typeof options.onComplete === 'function') {
				options.onComplete();
			}
		}

	}
	else {
		el.style.visibility = (to) ? 'visible' : 'hidden';

		if (typeof options.onStart === 'function') {
			options.onStart();
		}

		if (typeof options.onComplete === 'function') {
			options.onComplete();
		}
	}
};

// ac-solar@1.2.1

},{"@marcom/ac-eclipse":130,"@marcom/ac-feature/cssPropertyAvailable":334}],356:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Clip = require('@marcom/ac-eclipse').Clip;
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');

/**
 * @name module:ac-solar.fadeIn
 *
 * @function
 *
 * @desc Fades an element to 100% opacity.
 *
 * @param {Element} el
 *        The element to fade.
 *
 * @param {Number} duration
 *        The duration of the fade, how long it should take to animation.
 *
 * @param {Object} options
 *        Contains any AC Clip options specific to your fade-in animation.
 *
 * @returns {Clip} The clip that controls the animation.
 */
module.exports = function fadeIn (el, duration, options) {
	options = options || {};

	if (cssPropertyAvailable('opacity')) {
		if (duration) {
			return Clip.to(el, duration, {
				opacity: 1
			}, options);
		}
		else {
			el.style.opacity = 1;

			if (typeof options.onStart === 'function') {
				options.onStart();
			}

			if (typeof options.onComplete === 'function') {
				options.onComplete();
			}
		}
	}
	else {
		el.style.visibility = 'visible';

		if (typeof options.onStart === 'function') {
			options.onStart();
		}

		if (typeof options.onComplete === 'function') {
			options.onComplete();
		}
	}
};

// ac-solar@1.2.1

},{"@marcom/ac-eclipse":130,"@marcom/ac-feature/cssPropertyAvailable":334}],357:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Clip = require('@marcom/ac-eclipse').Clip;
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');

/**
 * @name module:ac-solar.fadeOut
 *
 * @function
 *
 * @desc Fades an element to 0% opacity.
 *
 * @param {Element} el
 *        The element to fade.
 *
 * @param {Number} duration
 *        The duration of the fade, how long it should take to animation.
 *
 * @param {Object} options
 *        Contains any AC Clip options specific to your fade-out animation.
 *
 * @returns {Clip} The clip that controls the animation.
 */
module.exports = function fadeOut (el, duration, options) {
	options = options || {};

	if (cssPropertyAvailable('opacity')) {
		if (duration) {
			return Clip.to(el, duration, {
				opacity: 0
			}, options);
		}
		else {
			el.style.opacity = 0;

			if (typeof options.onStart === 'function') {
				options.onStart();
			}

			if (typeof options.onComplete === 'function') {
				options.onComplete();
			}
		}
	}
	else {
		el.style.visibility = 'hidden';

		if (typeof options.onStart === 'function') {
			options.onStart();
		}

		if (typeof options.onComplete === 'function') {
			options.onComplete();
		}
	}
};

// ac-solar@1.2.1

},{"@marcom/ac-eclipse":130,"@marcom/ac-feature/cssPropertyAvailable":334}],358:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Clip = require('@marcom/ac-eclipse').Clip;
var ac_dom_styles = require('@marcom/ac-dom-styles');
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');

/**
 * @name module:ac-solar.move
 *
 * @function
 *
 * @desc Moves an element.
 *
 * @param {Element} el
 *        The element to move.
 *
 * @param {Number} x
 *        The x position to move to.
 *
 * @param {Number} y
 *        The y position to move to.
 *
 * @param {Number} duration
 *        The duration of the move, how long it should take to animation.
 *
 * @param {Object} options
 *        Contains any AC Clip options specific to your move animation.
 *
 * @returns {Clip} The clip that controls the animation.
 */
module.exports = function move (el, x, y, duration, options) {

	options = options || {};

	var to;
	if (cssPropertyAvailable('transition')) {
		to = {
			transform: {
				translateX: x + 'px',
				translateY: y + 'px'
			}
		};
	} else {
		to = {
			left: x + 'px',
			top: y + 'px'
		};
	}

	if (duration) {
		return Clip.to(el, duration, to, options);
	}
	else {
		ac_dom_styles.setStyle(el, to);

		if (typeof options.onStart === 'function') {
			options.onStart();
		}

		if (typeof options.onComplete === 'function') {
			options.onComplete();
		}
	}
};

// ac-solar@1.2.1

},{"@marcom/ac-dom-styles":26,"@marcom/ac-eclipse":130,"@marcom/ac-feature/cssPropertyAvailable":334}],359:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var cssPropertyAvailable = require('@marcom/ac-feature/cssPropertyAvailable');

/** @ignore */
var move   = require('./move');

/**
 * @name module:ac-solar.moveX
 *
 * @function
 *
 * @desc Moves an element.
 *
 * @param {Element} el
 *        The element to move.
 *
 * @param {Number} x
 *        The x position to move to.
 *
 * @param {Number} duration
 *        The duration of the move, how long it should take to animation.
 *
 * @param {Object} options
 *        Contains any AC Clip options specific to your move animation.
 *
 * @returns {Clip} The clip that controls the animation.
 */
module.exports = function moveX (el, x, duration, options) {
	return move(el, x, 0, duration, options);
};

// ac-solar@1.2.1

},{"./move":358,"@marcom/ac-feature/cssPropertyAvailable":334}],360:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var Clip = require('@marcom/ac-eclipse').Clip;

/**
 * @name module:ac-solar.scroll
 *
 * @function
 *
 * @desc Scrolls an element both horizontally and vertically.
 *
 * @param {Element} el
 *        The element to scroll.
 *
 * @param {Number} x
 *        The position to scroll to.
 *
 * @param {Number} y
 *        The position to scroll to.
 *
 * @param {Number} duration
 *        The duration of the scroll, how long it should take to animation.
 *
 * @param {Object} options
 *        Contains any AC Clip options specific to your scroll animation.
 *
 * @returns {Clip} The clip that controls the animation.
 */
module.exports = function scroll (el, x, y, duration, options) {

	options = options || {};

	var isWindow = el === window;
	var currentScrollPositionX;
	var currentScrollPositionY;

	if (isWindow) {
		currentScrollPositionX = el.scrollX;
		currentScrollPositionY = el.scrollY;
	} else {
		currentScrollPositionX = el.scrollLeft;
		currentScrollPositionY = el.scrollTop;
	}

	var scrollPosition = {
		x: currentScrollPositionX,
		y: currentScrollPositionY
	};

	var to = {
		x: x,
		y: y
	};

	if (typeof options.onDraw === 'function') {
		var storeOnDraw = options.onDraw;
	}

	var newOnDraw = function (evt) {
		if(isWindow) {
			el.scrollTo(scrollPosition.x, scrollPosition.y);
		} else {
			el.scrollLeft = scrollPosition.x;
			el.scrollTop = scrollPosition.y;
		}

		if (storeOnDraw) {
			storeOnDraw.call(this, evt);
		}
	};

	options.onDraw = newOnDraw;

	return Clip.to(scrollPosition, duration, to, options);
};
// ac-solar@1.2.1

},{"@marcom/ac-eclipse":130}],361:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var scroll = require('./scroll');

/**
 * @name module:ac-solar.scrollX
 *
 * @function
 *
 * @desc Scrolls an element horizontally.
 *
 * @param {Element} el
 *        The element to scroll.
 *
 * @param {Number} x
 *        The position to scroll to.
 *
 * @param {Number} duration
 *        The duration of the scroll, how long it should take to animation.
 *
 * @param {Object} options
 *        Contains any AC Clip options specific to your scroll animation.
 *
 * @returns {Clip} The clip that controls the animation.
 */
module.exports = function scrollX (el, x, duration, options) {
	var isWindow = el === window;
	var currentScrollPositionY;

	if (isWindow) {
		currentScrollPositionY = el.scrollY;
	} else {
		currentScrollPositionY = el.scrollTop;
	}

	return scroll(el, x, currentScrollPositionY, duration, options);
};

// ac-solar@1.2.1

},{"./scroll":360}],362:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_classList = require('@marcom/ac-classlist');
var analyticsManager = require('./singletons/analyticsManager');
var create = require('@marcom/ac-object/create');

/** @ignore */
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var Item = require('./Item');


/**
 * @name module:ac-gallery.Gallery
 * @class
 * @extends EventEmitterMicro
 *
 * @param {Function} [options.itemType=Item]
 *        The Item type for this gallery. The gallery will find it's elements and
 *        instantiate new Item objects using this type.
 *
 * @param {Boolean} [options.wrapAround=false]
 *        When `true` calling `showNext` when on last item will move to first item
 *        and calling `showPrevious` on first item will move to last. Essentially
 *        this makes the gallery loop for infinity.
 *
 * @param {Object} [options.analyticsOptions={}]
 *        The ability to override options for `ac-analytics`. Check `AnalyticsManager`
 *        for more information.
 *
 * @param {Number} [options.startAt=undefined]
 *        By default, this option is not set so that the gallery defaults to start at the first item.
 *        Otherwise, the gallery starts at the item with the provided index, if that item exists exists.
 */
function Gallery(options) {
	options = options || {};

	this._wrapAround = options.wrapAround || false;
	this._itemType = options.itemType || Item;
	this._items = [];
	this._itemsIdLookup = {};

	// bind
	this.showNext = this.showNext.bind(this);
	this.showPrevious = this.showPrevious.bind(this);
	this._update = this._update.bind(this);
	this._updateItems = this._updateItems.bind(this);

	// call super constructor
	EventEmitterMicro.call(this);

	if (options.startAt) {
		this._startAt(options.startAt);
	}

	Gallery._add(this, options.analyticsOptions);
}

/** Events */
Gallery.FADE = 'fade';
Gallery.FADE_SELECTOR = '[data-ac-gallery-fade]';
Gallery.SLIDE = 'slide';
Gallery.SLIDE_SELECTOR = '[data-ac-gallery-slide]';
Gallery.UPDATE = 'update';
Gallery.UPDATE_COMPLETE = 'update:complete';

var superProto = EventEmitterMicro.prototype;
var proto = Gallery.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.Gallery#addItem
 * @function
 *
 * @desc Adds an item to the gallery.
 *
 * @param {Item|Element} item
 *        Can be an object that is or extends the `Item` type. Alternatively, can
 *        be an Element and Gallery will instantiate a new `Item`. The type of item
 *        can be set in instantiation options (options.itemType)
 *
 * @param {Number} [index]
 *        Allows you to specify where the item is added to the items array. By default
 *        the item will be added to the end of the items array.
 *
 * @returns {Item} The added item instance.
 */
proto.addItem = function (item, index) {
	if (item.nodeType) {
		item = new this._itemType(item);
	} else if (this._items.indexOf(item) > -1) {
		// already added
		return item;
	}

	if (typeof index === 'number') {
		this._items.splice(index, 0, item);
	} else {
		this._items.push(item);
	}

	if (this._items.length === 1) {
		item.show();
		this._setCurrentItem(item);
	} else {
		item.hide();
		if (this.getNextItem() === item) {
			this._setNextItem(item);
		}
		if (this.getPreviousItem() === item) {
			this._setPreviousItem(item);
		}
	}

	if (item.getElementId() !== null) {
		this._itemsIdLookup[item.getElementId()] = item;
	}

	item.on(Item.SELECTED, this._update);

	return item;
};

/**
 * @name module:ac-gallery.Gallery#removeItem
 * @function
 *
 * @desc Removes an item from the gallery.
 *
 * @param {Item} item
 *        The item that should be removed.
 *
 * @param {Boolean} [options.destroyItem=false]
 *        When true, the removed item will have it's destroy method called.
 *
 * @param {Boolean} [options.setCurrentItem=undefined]
 *        When false, if the removed item is the current item, we won't call
 *        update passing the first item to reset the currentItem. This is
 *        really only intended to be used in `this.destroy()`.
 *
 * @returns {Item} The removed item.
 */
proto.removeItem = function (item, options) {
	options = options || {};

	if (typeof item === 'number') {
		item = this._items[item];
	}

	var index = this._items.indexOf(item);
	if (index > -1) {

		var nextItem = this.getNextItem();
		var previousItem = this.getPreviousItem();

		this._items.splice(index, 1);
		item.off(Item.SELECTED, this._update);

		if (nextItem === item) {
			this._setNextItem(this.getNextItem());
		}
		if (previousItem === item) {
			this._setPreviousItem(this.getPreviousItem());
		}
	}

	if (item === this._currentItem && this._items.length && options.setCurrentItem !== false) {
		this._update({
			item: this._items[0]
		});
		this._setLastItem(null);
	}

	if (options.destroyItem && item.getElement()) {
		item.destroy();
	}

	return item;
};

/**
 * @name module:ac-gallery.Gallery#show
 * @function
 *
 * @desc Shows a specified item.
 *
 * @param {Item|Number|String} item
 *        Can be a gallery item, the index of an item or the ID of an item.
 *
 * @returns {Item} Returns the showed item.
 */
proto.show = function (item, options) {
	if (typeof item === 'number') {
		item = this._items[item];
	} else if (typeof item === 'string') {
		item = this._itemsIdLookup[item];
	}

	if (item) {
		options = options || {};
		this._update({
			item: item,
			interactionEvent: options.interactionEvent
		});
	}

	return item || null;
};

/**
 * @name module:ac-gallery.Gallery#showNext
 * @function
 *
 * @desc Shows the next item in the items array. If options.wrapAround was set
 *       to true and the current item is the last item in the array, the first
 *       item will be shown.
 *
 * @returns {Item} Returns the showed item.
 */
proto.showNext = function (options) {
	var item = this.getNextItem();
	if (item) {
		this.show(item, options);
	}
	return item;
};

/**
 * @name module:ac-gallery.Gallery#showPrevious
 * @function
 *
 * @desc Shows the previous item in the items array. If options.wrapAround was set
 *       to true and the current item is the first item in the array, the last
 *       item will be shown.
 *
 * @returns {Item} Returns the showed item.
 */
proto.showPrevious = function (options) {
	var item = this.getPreviousItem();
	if (item) {
		this.show(item, options);
	}
	return item;
};

/**
 * @name module:ac-gallery.Gallery#isInView
 * @function
 *
 * @desc Returns true when the gallery has a currentItem and that currentItem is
 *       in the current viewport window.
 *
 * @returns {Boolean} True when the currentItem is in view, else false.
 */
proto.isInView = function () {
	return this._currentItem && this._currentItem.isInView();
};

/**
 * @name module:ac-gallery.Gallery#getTotalItems
 * @function
 *
 * @desc The total number of gallery items.
 *
 * @returns {Number} The total number of gallery items.
 */
proto.getTotalItems = function () {
	return this._items.length;
};

/**
 * @name module:ac-gallery.Gallery#getItems
 * @function
 *
 * @desc An array of all the gallery items.
 *
 * @returns {Array} An array of all the gallery items.
 */
proto.getItems = function () {
	return this._items;
};

/**
 * @name module:ac-gallery.Gallery#getItem
 * @function
 *
 * @desc Finds and returns an item in the gallery based of the passed key.
 *
 * @param {Number|String} key
 *        Can be either the index of the item or it's ID.
 *
 * @returns {Item} The item if it exists in the gallery, else null.
 */
proto.getItem = function (key) {
	if (typeof key === 'number') {
		return this.getItemAt(key);
	} else if (typeof key === 'string') {
		return this.getItemById(key);
	}
};

/**
 * @name module:ac-gallery.Gallery#getItemAt
 * @function
 *
 * @desc Finds and returns an item in the gallery based of the passed index.
 *
 * @param {Number} index
 *        The index of the item.
 *
 * @returns {Item} The item if it exists in the gallery, else null.
 */
proto.getItemAt = function (index) {
	return this._items[index] || null;
};

/**
 * @name module:ac-gallery.Gallery#getItemById
 * @function
 *
 * @desc Finds and returns an item in the gallery based of the passed ID string.
 *
 * @param {String} id
 *        The ID of the item.
 *
 * @returns {Item} The item if it exists in the gallery, else null.
 */
proto.getItemById = function (id) {
	return this._itemsIdLookup[id] || null;
};

/**
 * @name module:ac-gallery.Gallery#getItemIndex
 * @function
 *
 * @desc Returns the index of a item within the gallery.
 *
 * @param {Item} item
 *        The item whose index to return.
 *
 * @returns {Number} The index of an item in the gallery.
 */
proto.getItemIndex = function (item) {
	return this._items.indexOf(item);
};

/**
 * @name module:ac-gallery.Gallery#getCurrentItem
 * @function
 *
 * @desc Returns the currently selected / shown item.
 *
 * @returns {Item} The currently selected item.
 */
proto.getCurrentItem = function () {
	return this._currentItem || null;
};

/**
 * @name module:ac-gallery.Gallery#getLastItem
 * @function
 *
 * @desc Returns the last selected / shown item.
 *
 * @returns {Item} The last selected item.
 */
proto.getLastItem = function () {
	return this._lastItem || null;
};

/**
 * @name module:ac-gallery.Gallery#getNextItem
 * @function
 *
 * @desc Returns the next item in the items array.
 *
 * @returns {Item} The next item.
 */
proto.getNextItem = function () {
	var item;
	var index = this._items.indexOf(this._currentItem);

	if (index < this._items.length - 1) {
		item = this._items[index + 1];
	} else if (this._wrapAround) {
		item = this._items[0];
	}

	return item || null;
};

/**
 * @name module:ac-gallery.Gallery#getPreviousItem
 * @function
 *
 * @desc Returns the previous item in the items array.
 *
 * @returns {Item} The previous item.
 */
proto.getPreviousItem = function () {
	var item;
	var index = this._items.indexOf(this._currentItem);

	if (index > 0) {
		item = this._items[index - 1];
	} else if (this._wrapAround) {
		item = this._items[this._items.length - 1];
	}

	return item || null;
};

/**
 * @name module:ac-gallery.Gallery#getId
 * @function
 *
 * @desc Returns the gallery unique ID.
 *
 * @returns {Number} Unique ID.
 */
proto.getId = function () {
	return this._id;
};

/**
 * @name module:ac-gallery.Gallery#destroy
 * @function
 *
 * @desc Destroys a gallery, removes it's items and sets props to null.
 *
 * @param {Boolean} [options.destroyItems=true]
 *        When `true` the gallery will call the `destroy` method of all it's
 *        items as it removes them.
 */
proto.destroy = function (options) {
	options = options || {};

	if (options.destroyItems === undefined) {
		options.destroyItems = true;
	}

	this._setCurrentItem(null);

	if (options.destroyItems) {
		var item;
		while (this._items.length) {
			item = this._items[0];
			item.off(Item.SELECTED, this._update);
			this.removeItem(item, {
				destroyItem: true,
				setCurrentItem: false
			});
		}
	}

	this._items = null;
	this._itemsIdLookup = null;

	Gallery._remove(this);

	// call / return super.destroy method
	return superProto.destroy.call(this);
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.Gallery#_startAt
 * @function
 * @private
 *
 * @param  {Number} index
 *         The index of the item at which to start at.
 */
proto._startAt = function (index) {
	var item = this._items[index];

	if (item && (this._currentItem !== item)) {
		this._currentItem.hide();
		this._setCurrentItem(item);
		this._currentItem.show();
		this.trigger(Gallery.UPDATE, this._items);
	}
};

/**
 * @name module:ac-gallery.Gallery#_setCurrentItem
 * @function
 * @private
 *
 * @param {Item} item
 *        The item to set as the currentItem.
 */
/** @ignore */
proto._setCurrentItem = function (item) {
	if (this._currentItem && this._currentItem.getElement() && this._currentItem !== item) {
		ac_classList.remove(this._currentItem.getElement(), Item.CSS_CURRENT_ITEM);
		this._setLastItem(this._currentItem);
	}
	this._currentItem = item;
	if (this._currentItem && this._currentItem.getElement()) {
		ac_classList.add(this._currentItem.getElement(), Item.CSS_CURRENT_ITEM);
		this._setNextItem(this.getNextItem());
		this._setPreviousItem(this.getPreviousItem());
	}
};

/**
 * @name module:ac-gallery.Gallery#_setLastItem
 * @function
 * @private
 *
 * @param {Item} item
 *        The item to set as the lastItem.
 */
/** @ignore */
proto._setLastItem = function (item) {
	if (this._lastItem && this._lastItem.getElement() && this._lastItem !== item) {
		ac_classList.remove(this._lastItem.getElement(), Item.CSS_LAST_ITEM);
	}
	this._lastItem = item;
	if (this._lastItem && this._lastItem.getElement()) {
		ac_classList.add(this._lastItem.getElement(), Item.CSS_LAST_ITEM);
	}
};

/**
 * @name module:ac-gallery.Gallery#_setNextItem
 * @function
 * @private
 *
 * @param {Item} item
 *        The item to set as the nextItem.
 */
/** @ignore */
proto._setNextItem = function (item) {
	if (this._nextItem && this._nextItem.getElement() && this._nextItem !== item) {
		ac_classList.remove(this._nextItem.getElement(), Item.CSS_NEXT_ITEM);
	}
	this._nextItem = item;
	if (this._nextItem && this._nextItem.getElement()) {
		ac_classList.add(this._nextItem.getElement(), Item.CSS_NEXT_ITEM);
	}
};

/**
 * @name module:ac-gallery.Gallery#_setPreviousItem
 * @function
 * @private
 *
 * @param {Item} item
 *        The item to set as the previousItem.
 */
/** @ignore */
proto._setPreviousItem = function (item) {
	if (this._previousItem && this._previousItem.getElement() && this._previousItem !== item) {
		ac_classList.remove(this._previousItem.getElement(), Item.CSS_PREVIOUS_ITEM);
	}
	this._previousItem = item;
	if (this._previousItem && this._previousItem.getElement()) {
		ac_classList.add(this._previousItem.getElement(), Item.CSS_PREVIOUS_ITEM);
	}
};

/**
 * @name module:ac-gallery.Gallery#_updateItems
 * @function
 * @private
 *
 * @param {Object} items
 *        An object containing the incoming and outgoing items.
 *
 * @param {Boolean} silent
 *        When `true` the update:complete event will not be triggered.
 *
 * @fires Gallery#update:complete
 */
/** @ignore */
proto._updateItems = function (items, silent) {
	if (items.outgoing[0]) {
		items.outgoing[0].hide();
	}
	items.incoming[0].show();

	if (!silent) {
		/**
		 * Update complete event.
		 * @event Gallery#update:complete
		 */
		this.trigger(Gallery.UPDATE_COMPLETE, items);
	}
};

/**
 * @name module:ac-gallery.Gallery#_update
 * @function
 * @private
 *
 * @param {Item} evt.item
 *        The new item to set as current.
 *
 * @param {Event} evt.interactionEvent
 *        The event that triggered the update, e.g. MouseEvent.
 *
 * @fires Gallery#update
 */
/** @ignore */
proto._update = function (evt) {
	var hasChanged = this._currentItem !== evt.item;

	if (hasChanged) {
		this._setCurrentItem(evt.item);
	}

	var items = {
		incoming: [evt.item],
		outgoing: (this._lastItem) ? [this._lastItem] : [],
		interactionEvent: evt.interactionEvent || null
	};

	if (hasChanged) {
		/**
		 * Update event.
		 * @event Gallery#update
		 */
		this.trigger(Gallery.UPDATE, items);
	}

	this._updateItems(items, !hasChanged);
};


////////////////////////////////////////
//////////  STATIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.Gallery#_instantiate
 * @function
 * @private
 * @static
 */
/** @ignore */
Gallery._instantiate = function () {
	this._galleries = [];
	this._idCounter = 0;
	return this;
};

/**
 * @name module:ac-gallery.Gallery#_add
 * @function
 * @private
 * @static
 *
 * @param {Gallery} gallery
 *
 * @param {Object} analyticsOptions
 */
/** @ignore */
Gallery._add = function (gallery, analyticsOptions) {
	this._galleries.push(gallery);
	gallery._id = ++this._idCounter;
	analyticsManager.add(gallery, analyticsOptions);
};

/**
 * @name module:ac-gallery.Gallery#_remove
 * @function
 * @private
 * @static
 *
 * @param {Gallery} gallery
 */
/** @ignore */
Gallery._remove = function (gallery) {
	var index = this._galleries.indexOf(gallery);
	if (index > -1) {
		this._galleries.splice(index, 1);
		analyticsManager.remove(gallery);
	}
};

/**
 * @name module:ac-gallery.Gallery#getAll
 * @function
 * @static
 *
 * @desc Returns an Array of all Gallery instances.
 *
 * @returns {Array} An array of Gallery instances.
 */
Gallery.getAll = function () {
	return Array.prototype.slice.call(this._galleries);
};

/**
 * @name module:ac-gallery.Gallery#getAllInView
 * @function
 * @static
 *
 * @desc Returns an Array of all Gallery instances that are currently in view.
 *
 * @returns {Array} An array of Gallery instances.
 */
Gallery.getAllInView = function () {
	var inView = [];
	var index = this._galleries.length;
	while (index--) {
		if (this._galleries[index].isInView()) {
			inView.push(this._galleries[index]);
		}
	}
	return inView;
};

/**
 * @name module:ac-gallery.Gallery#destroyAll
 * @function
 * @static
 *
 * @desc Destroys all Gallery instances.
 */
Gallery.destroyAll = function () {
	var i = this._galleries.length;
	while (i--) {
		this._galleries[i].destroy();
	}
	this._galleries = [];
};


module.exports = Gallery._instantiate();

// ac-gallery@2.3.0

},{"./Item":363,"./singletons/analyticsManager":377,"@marcom/ac-classlist":304,"@marcom/ac-event-emitter-micro":324,"@marcom/ac-object/create":345}],363:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_classList = require('@marcom/ac-classlist');
var ac_addEventListener = require('@marcom/ac-dom-events/addEventListener');
var ac_removeEventListener = require('@marcom/ac-dom-events/removeEventListener');
var preventDefault = require('@marcom/ac-dom-events/preventDefault');
var isInViewport = require('@marcom/ac-dom-metrics/isInViewport');
var getPercentInViewport = require('@marcom/ac-dom-metrics/getPercentInViewport');
var ac_querySelectorAll = require('@marcom/ac-dom-traversal/querySelectorAll');
var create = require('@marcom/ac-object/create');
var tabManager = require('./singletons/tabManager');
var keyMap = require('@marcom/ac-keyboard/keyMap');

/** @ignore */
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var Keyboard = require('@marcom/ac-keyboard');

/** @ignore */
var CSS_CURRENT = 'current';


/**
 * @name module:ac-gallery.Item
 * @class
 * @extends EventEmitterMicro
 *
 * @param {Element} el
 *        The visual element used by the item.
 *
 * @param {Boolean|String|Number} [option.isACaption]
 *        When this option is set, `role="tabpanel"` is not placed on the `Item` element.
 *        When there is a supplementary captions gallery, it is not appropriate
 *        to have an extra `role="tabpanel"` placed on the `Item` element because it has
 *        no relation to any tabs.
 */
function Item(el, options) {
	this._el = el;
	options = options || {};

	this._triggerKeys = [];
	this._triggerEls = {};
	this._isShown = false;
	this._isACaption = (options.isACaption === undefined) ? false : options.isACaption;

	// bind
	this._onKeyboardInteraction = this._onKeyboardInteraction.bind(this);
	this._onTriggered = this._onTriggered.bind(this);

	if (!this._isACaption) {
		this._el.setAttribute('role', 'tabpanel');
	}
	this._focusableEls = ac_querySelectorAll(tabManager.focusableSelectors, el);

	// call super constructor
	EventEmitterMicro.call(this);
}

/** Events */
Item.CSS_CURRENT_ITEM = 'ac-gallery-currentitem';
Item.CSS_LAST_ITEM = 'ac-gallery-lastitem';
Item.CSS_NEXT_ITEM = 'ac-gallery-nextitem';
Item.CSS_PREVIOUS_ITEM = 'ac-gallery-previousitem';
Item.SELECTED = 'selected';
Item.SHOW = 'show';
Item.HIDE = 'hide';

var proto = Item.prototype = create(EventEmitterMicro.prototype);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.Item#show
 * @function
 *
 * @desc Tells the item to show. An item will add the `ac-gallery-currentitem` CSS
 *       class to it's element and `current` to any triggers associated with it. It
 *       will then trigger a `show` event.
 *
 * @fires Item#show
 */
proto.show = function () {
	this._isShown = true;
	this._addCurrentClassToTriggers();

	this._setTabIndexOnFocusableItems(null);
	this._el.removeAttribute('aria-hidden');

	/**
	 * Show event.
	 * @event Item#show
	 */
	this.trigger(Item.SHOW, this);
};

/**
 * @name module:ac-gallery.Item#hide
 * @function
 *
 * @desc Tells the item to hide. An item will remove the `ac-gallery-currentitem` CSS
 *       class from it's element and `current` from any triggers associated with it. It
 *       will then trigger a `hide` event.
 *
 * @fires Item#hide
 */
proto.hide = function () {
	this._isShown = false;
	this._removeCurrentClassFromTriggers();

	this._setTabIndexOnFocusableItems('-1');
	this._el.setAttribute('aria-hidden', 'true');

	/**
	 * Hide event.
	 * @event Item#hide
	 */
	this.trigger(Item.HIDE, this);
};

/**
 * @name module:ac-gallery.Item#addElementTrigger
 * @function
 *
 * @desc Adds an event listener to the element specified in the first argument.
 *       When the event is trigger the item will trigger a `selected` event to
 *       notify the gallery to show it.
 *
 * @param {Element} el
 *        The element to add a listener to.
 *
 * @param {String} [eventType="click"]
 *        The event to listen for on the element. Defaults to 'click'.
 */
proto.addElementTrigger = function (el, eventType) {
	eventType = eventType || 'click';

	if (this._triggerEls[eventType] === undefined) {
		this._triggerEls[eventType] = [];
	}

	var index = this._triggerEls[eventType].indexOf(el);
	if (index < 0) {
		el.setAttribute('role', 'tab');
		el.setAttribute('tabindex', '0');

		var id = this.getElementId();
		if (id) {
			el.setAttribute('aria-controls', id);
		}

		id = el.getAttribute('id');
		if (id && this._el.getAttribute('aria-labelledby') === null) {
			this._el.setAttribute('aria-labelledby', id);
		}

		ac_addEventListener(el, eventType, this._onTriggered);
		this._triggerEls[eventType].push(el);

		if (this._isShown) {
			el.setAttribute('aria-selected', 'true');
			ac_classList.add(el, CSS_CURRENT);
		} else {
			el.setAttribute('aria-selected', 'false');
		}
	}
};

/**
 * @name module:ac-gallery.Item#removeElementTrigger
 * @function
 *
 * @desc Removes an event listener from an element.
 *
 * @param {Element} el
 *        The element to remove a listener from.
 *
 * @param {String} [eventType="click"]
 *        The event to remove from the element. Defaults to 'click'.
 */
proto.removeElementTrigger = function (el, eventType) {
	eventType = eventType || 'click';

	if (this._triggerEls[eventType] === undefined) {
		return;
	}

	var index = this._triggerEls[eventType].indexOf(el);
	if (index > -1) {
		this._cleanElementTrigger(el, eventType);
	}

	if (this._triggerEls[eventType].length === 0) {
		this._triggerEls[eventType] = undefined;
	}
};

/**
 * @name module:ac-gallery.Item#addKeyTrigger
 * @function
 *
 * @desc Add a listener to key down events. When the specified key is pressed the
 *       item will trigger a `selected` event to notify the gallery to show it.
 *
 * @param {String} key
 *        The keycode or name (specified in `ac-keyboard.keyMap`) of the key to
 *        listen to.
 */
proto.addKeyTrigger = function (key) {
	if (typeof key === 'string') {
		key = keyMap[key.toUpperCase()];
	}

	if (typeof key === 'number') {
		var index = this._triggerKeys.indexOf(key);
		if (index < 0) {
			Keyboard.onDown(key, this._onKeyboardInteraction);
			this._triggerKeys.push(key);
		}
	}
};

/**
 * @name module:ac-gallery.Item#removeKeyTrigger
 * @function
 *
 * @desc Removes an event listener from the specified key.
 *
 * @param {String} key
 *        The keycode or name (specified in `ac-keyboard.keyMap`) of the key to stop
 *        listening to.
 */
proto.removeKeyTrigger = function (key) {
	if (typeof key === 'string') {
		key = keyMap[key.toUpperCase()];
	}

	if (typeof key === 'number') {
		var index = this._triggerKeys.indexOf(key);
		if (index > -1) {
			Keyboard.offDown(key, this._onKeyboardInteraction);
			this._triggerKeys.splice(index, 1);
		}
	}
};

/**
 * @name module:ac-gallery.Item#removeAllTriggers
 * @function
 *
 * @desc Unbinds all event listeners added to triggers.
 */
proto.removeAllTriggers = function () {
	var key;
	var index = this._triggerKeys.length;
	while (index--) {
		key = this._triggerKeys[index];
		Keyboard.offDown(key, this._onKeyboardInteraction);
	}
	this._triggerKeys = [];

	var el;
	var type;
	for (type in this._triggerEls) {
		index = this._triggerEls[type].length;
		while (index--) {
			el = this._triggerEls[type][index];
			this._cleanElementTrigger(el, type);
		}
	}
	this._triggerEls = {};
};

/**
 * @name module:ac-gallery.Item#isInView
 * @function
 *
 * @desc Returns true when the item element is visible in the current viewport window.
 *
 * @returns {Boolean} true when the element is in view else false.
 */
proto.isInView = function () {
	if (this._el) {
		return isInViewport(this._el);
	}
	return false;
};

/**
 * @name module:ac-gallery.Item#percentageInView
 * @function
 *
 * @desc Returns the percentage the item element is visible in the current viewport.
 *
 * @returns {Number} todo.
 */
proto.percentageInView = function () {
	if (this._el) {
		return getPercentInViewport(this._el);
	}
	return 0;
};

/**
 * @name module:ac-gallery.Item#getElement
 * @function
 *
 * @desc Returns the visual element used by the item.
 *
 * @returns {Element} The visual element used by the item.
 */
proto.getElement = function () {
	return this._el;
};

/**
 * @name module:ac-gallery.Item#getElementId
 * @function
 *
 * @desc Returns the visual element's ID attribute.
 *
 * @returns {String} The element's ID attribute.
 */
proto.getElementId = function () {
	if (this._elId !== undefined) {
		return this._elId;
	}
	this._elId = this._el.getAttribute('id') || null;
	return this._elId;
};

/**
 * @name module:ac-gallery.Item#destroy
 * @function
 *
 * @desc Removes any classes from item element and associated triggers.
 *       Unbinds events and nullifies variables.
 */
proto.destroy = function () {
	if (this._isShown) {
		this._isShown = null;
		ac_classList.remove(this._el,
			Item.CSS_CURRENT_ITEM,
			Item.CSS_LAST_ITEM,
			Item.CSS_NEXT_ITEM,
			Item.CSS_PREVIOUS_ITEM
		);
		this._removeCurrentClassFromTriggers();
	}

	this.removeAllTriggers();

	this._setTabIndexOnFocusableItems(null);
	this._el.removeAttribute('aria-hidden');
	this._el.removeAttribute('role');
	this._el.removeAttribute('aria-labelledby');

	this._isACaption = null;
	this._triggerKeys = null;
	this._triggerEls = null;
	this._el = null;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.Item#_addCurrentClassToTriggers
 * @function
 * @private
 */
/** @ignore */
proto._addCurrentClassToTriggers = function () {
	var el;
	var type;
	var index;
	for (type in this._triggerEls) {
		index = this._triggerEls[type].length;
		while (index--) {
			el = this._triggerEls[type][index];
			el.setAttribute('aria-selected', 'true');
			ac_classList.add(el, CSS_CURRENT);
		}
	}
};

/**
 * @name module:ac-gallery.Item#_removeCurrentClassFromTriggers
 * @function
 * @private
 */
/** @ignore */
proto._removeCurrentClassFromTriggers = function () {
	var el;
	var type;
	var index;
	for (type in this._triggerEls) {
		index = this._triggerEls[type].length;
		while (index--) {
			el = this._triggerEls[type][index];
			el.setAttribute('aria-selected', 'false');
			ac_classList.remove(el, CSS_CURRENT);
		}
	}
};

proto._cleanElementTrigger = function (el, type) {
	el.removeAttribute('aria-selected');
	el.removeAttribute('role');
	el.removeAttribute('tabindex');
	el.removeAttribute('aria-controls');

	ac_removeEventListener(el, type, this._onTriggered);

	if (this._isShown) {
		ac_classList.remove(el, CSS_CURRENT);
	}
};

/**
 * @name module:ac-gallery.Item#_onKeyboardInteraction
 * @function
 * @private
 *
 * @param {Event} evt
 *        Event from `ac-keyboard`.
 */
/** @ignore */
proto._onKeyboardInteraction = function (evt) {
	if (this.isInView()) {
		this._onTriggered(evt);
	}
};

/**
 * @name module:ac-gallery.Item#_setTabIndexOnFocusableItems
 * @function
 * @private
 *
 * @param {Number} index
 *        The index to set the tabindex attribute to. When null the
 *        tabindex attribute will be removed.
 */
/** @ignore */
proto._setTabIndexOnFocusableItems = function (index) {
	var remove = index === null;
	var tabbableEls = [];
	this._currentTabbableEls = this._currentTabbableEls || tabManager.getTabbable(this._focusableEls);

	//We should cache what's going to be hidden when Item#hide calls
	if(!remove) {
		tabbableEls = tabManager.getTabbable(this._focusableEls);
		this._currentTabbableEls = tabbableEls;
	}

	var i = this._currentTabbableEls.length;
	while (i--) {
		if (remove) {
			this._currentTabbableEls[i].removeAttribute('tabindex');
		} else {
			this._currentTabbableEls[i].setAttribute('tabindex', index);
		}
	}
};

/**
 * @name module:ac-gallery.Item#_onTriggered
 * @function
 * @private
 *
 * @param {Event} evt
 *        The event that triggered the update. This is for analytics.
 *
 * @fires Item#selected
 */
/** @ignore */
proto._onTriggered = function (evt) {
	preventDefault(evt);

	/**
	 * Selected event.
	 * @event Item#selected
	 */
	this.trigger(Item.SELECTED, {
		item: this,
		interactionEvent: evt
	});
};


module.exports = Item;

// ac-gallery@2.3.0

},{"./singletons/tabManager":378,"@marcom/ac-classlist":304,"@marcom/ac-dom-events/addEventListener":307,"@marcom/ac-dom-events/preventDefault":315,"@marcom/ac-dom-events/removeEventListener":316,"@marcom/ac-dom-metrics/getPercentInViewport":8,"@marcom/ac-dom-metrics/isInViewport":14,"@marcom/ac-dom-traversal/querySelectorAll":46,"@marcom/ac-event-emitter-micro":324,"@marcom/ac-keyboard":341,"@marcom/ac-keyboard/keyMap":343,"@marcom/ac-object/create":345}],364:[function(require,module,exports){
/**
 * @module ac-gallery
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var extendProto = require('./helpers/extendProto');

/** @ignore */
var Gallery = require('./Gallery');
var AutoGallery = require('./auto/AutoGallery');
var FadeGallery = require('./fade/FadeGallery');
var FadeGalleryItem = require('./fade/FadeItem');
var SlideGallery = require('./slide/SlideGallery');
var SlideGalleryItem = require('./slide/SlideItem');
var Item = require('./Item');

// add static methods
Gallery.create = require('./factories/create');
Gallery.autoCreate = require('./factories/autoCreate');
Gallery.extend = extendProto;
AutoGallery.extend = extendProto;
FadeGallery.extend = extendProto;
FadeGalleryItem.extend = extendProto;
SlideGallery.extend = extendProto;
SlideGalleryItem.extend = extendProto;
Item.extend = extendProto;

module.exports = {
	Gallery: Gallery,
	AutoGallery: AutoGallery,
	FadeGallery: FadeGallery,
	FadeGalleryItem: FadeGalleryItem,
	SlideGallery: SlideGallery,
	SlideGalleryItem: SlideGalleryItem,
	Item: Item,
	ToggleNav: require('./navigation/ToggleNav')
};

// ac-gallery@2.3.0

},{"./Gallery":362,"./Item":363,"./auto/AutoGallery":366,"./factories/autoCreate":367,"./factories/create":368,"./fade/FadeGallery":369,"./fade/FadeItem":370,"./helpers/extendProto":371,"./navigation/ToggleNav":376,"./slide/SlideGallery":379,"./slide/SlideItem":380}],365:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var GalleryAnalyticsObserver;
try {
	GalleryAnalyticsObserver = require('ac-analytics').observer.Gallery;
} catch (e) {
	//
}

/** @ignore */
var DEFAULT_ID_DATA_ATTRIBUTE = 'data-analytics-gallery-id';


/**
 * @name AnalyticsManager
 * @class
 */
function AnalyticsManager() {
	this._observers = {};
}

var proto = AnalyticsManager.prototype;


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name AnalyticsManager#add
 * @function
 *
 * @desc When `ac-analytics` is on the page and available this method will create
 *       a new instance of GalleryAnalyticsObserver.
 *
 * @param {Gallery} gallery
 *        An instance of Gallery or a module that extends from it.
 *
 * @param {Object} [options={}]
 *        Options for setting up GalleryAnalyticsObserver. Can include galleryName,
 *        beforeUpdateEvent and afterUpdateEvent.
 */
proto.add = function (gallery, options) {

	var id = gallery.getId();

	if (!GalleryAnalyticsObserver || this._observers[id]) {
		// ac-analytics isn't included on the page
		// or we already have an observer for this gallery
		return;
	}

	options = options || {};
	if (!options.galleryName) {
		options.galleryName = this._getAnalyticsId(gallery, options.dataAttribute) || id;
	}
	if (!options.beforeUpdateEvent) {
		// only needed for IE8 - set to `null` when we drop support for IE8
		options.beforeUpdateEvent = 'update';
	}
	if (!options.afterUpdateEvent) {
		options.afterUpdateEvent = 'update:complete';
	}

	var observer = new GalleryAnalyticsObserver(gallery, options);

	if (observer.gallery) {
		// GalleryAnalyticsObserver can sometimes fail to properly instantiate
		// which then causes an error when calling destroy in remove
		this._observers[id] = observer;
	}
};

/**
 * @name AnalyticsManager#remove
 * @function
 *
 * @desc Destroys the instance of GalleryAnalyticsObserver associated with the
 *       passed gallery.
 *
 * @param {Gallery} gallery
 *        An instance of Gallery or a module that extends from it.
 */
proto.remove = function (gallery) {

	var id = gallery.getId();

	if (!GalleryAnalyticsObserver || !this._observers[id]) {
		// ac-analytics isn't included on the page
		// or we don't have an observer for this gallery
		return;
	}

	if (typeof this._observers[id].destroy === 'function') {
		this._observers[id].destroy();
	}
	this._observers[id] = null;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name AnalyticsManager#_getAnalyticsId
 * @function
 * @private
 *
 * @param {Gallery} gallery
 *        An instance of Gallery or a module that extends from it.
 *
 * @param {String} dataAttribute
 *        The data attribute for retrieving the gallery name for analytics.
 *
 * @returns {String} todo.
 */
proto._getAnalyticsId = function (gallery, dataAttribute) {
	if (typeof gallery.getElement === 'function') {
		dataAttribute = dataAttribute || DEFAULT_ID_DATA_ATTRIBUTE;
		var el = gallery.getElement();
		return el.getAttribute(dataAttribute) || el.getAttribute('id');
	}
	return null;
};


module.exports = AnalyticsManager;

// ac-gallery@2.3.0

},{"ac-analytics":"ac-analytics"}],366:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
require('@marcom/ac-polyfills/requestAnimationFrame');
var ac_classList = require('@marcom/ac-classlist');
var ac_addEventListener = require('@marcom/ac-dom-events/addEventListener');
var ac_removeEventListener = require('@marcom/ac-dom-events/removeEventListener');
var preventDefault = require('@marcom/ac-dom-events/preventDefault');
var ac_dom_styles = require('@marcom/ac-dom-styles');
var ac_querySelector = require('@marcom/ac-dom-traversal/querySelector');
var ac_querySelectorAll = require('@marcom/ac-dom-traversal/querySelectorAll');
var create = require('@marcom/ac-object/create');
var getContentDimensions = require('@marcom/ac-dom-metrics/getContentDimensions');
var keyMap = require('@marcom/ac-keyboard/keyMap');
var selectElementFromDataAttributeValue = require('./../helpers/selectElementFromDataAttributeValue');
var selectElementThatHasDataAttribute = require('./../helpers/selectElementThatHasDataAttribute');
var inputHasFocus = require('./../helpers/inputHasFocus');
var throttle = require('@marcom/ac-function/throttle');
var touchAvailable = require('@marcom/ac-feature/touchAvailable');

/** @ignore */
var Gallery = require('./../Gallery');
var Keyboard = require('@marcom/ac-keyboard');
var PageVisibilityManager = require('@marcom/ac-page-visibility').PageVisibilityManager;
var PointerTracker = require('@marcom/ac-pointer-tracker').PointerTracker;
var ToggleNav = require('./../navigation/ToggleNav');

/** @ignore */
var CSS_DISABLED_CLASS = 'disabled';
var DEFAULT_AUTO_PLAY_DELAY = 3;
var DEFAULT_CONTAINER_RESIZE_DURATION = 0.5;
var DEFAULT_ITEM_SELECTOR = '[data-ac-gallery-item]';
var DEFAULT_KEYBOARD_THROTTLE_DELAY = 0.12;
var DEFAULT_PADDLENAV_TEMPLATE = require('../templates/paddlenav.js');
var ERROR_NO_ELEMENT_SUPPLIED = 'No element supplied.';
var ERROR_NO_CONTAINER_ELEMENT_SUPPLIED = 'Container element needed when autoPlay is on. Use the "container" option when you instantiate your gallery.';


/**
 * @name module:ac-gallery.AutoGallery
 * @class
 * @extends Gallery
 *
 * @param {Element} el
 *        The container `Element` that wraps the gallery.
 *
 * @param {String} [options.itemSelector='[data-ac-gallery-item]']
 *        The selector to use when selecting items within the container element.
 *
 * @param {Boolean} [options.updateOnWindowResize=true]
 *        By default a gallery listens to the window for a resize event and calls
 *        a `resize` method on itself. Some users won't want this as they'll want
 *        control over window resize listeners. In order to stop gallery from
 *        listening to the window set this option to false.
 *
 * @param {Boolean} [options.wrapAround=false]
 *        When `true` calling `showNext` when on last item will move to first item and
 *        calling `showPrevious` on first item will move to last. Essentially this
 *        makes the gallery loop for infinity.
 *
 * @param {Boolean} [options.enableArrowKeys=true]
 *        When `true` a listening will be added to the arrow keys that triggers
 *        the `showNext` and `showPrevious` methods.
 *
 * @param {Boolean|Number} [options.autoPlay=false]
 *        When `true` the gallery will autoplay using the default autoplay delay until
 *        a user interacts with the gallery. When set as a `Number` the gallery will
 *        autoplay using the number as the delay in seconds. Use in conjunction with
 *        the `container` option so that `autoPlay` will stop with the user gains focus
 *        on the gallery and its elements.
 *
 * @param {String} [options.container=undefined]
 *        The ID string of the container element. Use in conjunction with the `autoPlay` option.
 *        The gallery and any of its related elements (tabnav, dotnav, paddlenav, captions)
 *        should live in a container element, so that `autoPlay` will stop when the user gains
 *        focus on the gallery and any of its related elements.
 *
 * @param {Boolean} [options.deeplink=true]
 *        When true, if the URL contains a hash that matches one of the gallery items
 *        element ID, the gallery will deeplink to that item.
 *
 * @param {Number} [options.toggleNavDuration=undefined]
 *        If the gallery has a togglenav, this will determine the slide transition duration
 *        when the nav is wider than the window width.
 *
 * @param {Boolean} [options.rightToLeft=false]
 *        By default, rightToLeft behaviour will be determine if the container element has
 *        the direction attribute set to 'rtl'. It's unlikely you'd want to force the gallery
 *        to be right to left but if you need to this is the option to set.
 *
 * @param {Boolean} [options.resizeContainer=false]
 *        If true the container element will resize to be the height of the tallest item element.
 *
 * @param {Boolean|Number} [options.resizeContainerOnUpdate=false]
 *        If true or a number the container element will resize to be the height of the current
 *        item element. When the gallery updates, so will the height. When set as a number the
 *        height change will be animated. If true, the height change will be instant.
 *
 * @param {Number} [options.keyboardThrottleDelay=120]
 *        When the keyboard arrow keys are pressed the event will be triggered at most once
 *        during the given value of keyboardThrottleDelay. This should be in seconds and
 *        defaults to 0.12s.
 *
 * @param {Boolean} [options.touch=false]
 *        Enables touch screen interactions.
 *
 * @param {Boolean} [options.desktopSwipe=false]
 *        Basically touch like behaviour for desktop but with click and drag.
 *
 * @param {Boolean|String} [options.addPaddleNav=false]
 *        When `true` will add the default html for paddle navs (see templates/paddlenav.js).
 *        If a string, that string will be used as html for paddle nav.
 *
 * @param {Number} [options.startAt=undefined]
 *        By default, this option is not set so that the gallery defaults to start at the first item.
 *        Otherwise, the gallery starts at the item with the provided index, if that item exists exists.
 */
function AutoGallery(el, options) {
	options = options || {};

	if (!el || el.nodeType === undefined) {
		throw new Error(ERROR_NO_ELEMENT_SUPPLIED);
	}
	this._el = el;

	// call super constructor
	Gallery.call(this, options);

	this._itemHeights = [];
	this._itemHeightsLookup = {};

	this._toggleNavDuration = options.toggleNavDuration;
	this._isRightToLeft = (options.rightToLeft === undefined) ? ac_dom_styles.getStyle(el, 'direction').direction === 'rtl' : options.rightToLeft;
	this._keyboardThrottleDelay = ((options.keyboardThrottleDelay === undefined) ? DEFAULT_KEYBOARD_THROTTLE_DELAY : options.keyboardThrottleDelay) * 1000;

	this._resizeContainer = !!options.resizeContainer;
	this._setUpContainerAutoResize(options.resizeContainerOnUpdate);

	this._createToggleNav();
	this._addPaddleNav(options.addPaddleNav);
	this._isACaptionsGallery = el.getAttribute('data-ac-gallery-captions') === '';
	this._addItems(options.itemSelector || DEFAULT_ITEM_SELECTOR);

	if (!this._wrapAround) {
		this._updatePaddleNavState();
	}

	if (options.enableArrowKeys !== false) {
		this._enableArrowKeys = true;
		this._addKeyboardListener();
	}

	if (options.updateOnWindowResize !== false) {
		this._onWindowResize = this._onWindowResize.bind(this);
		ac_addEventListener(window, 'resize', this._onWindowResize);
	}

	this._componentsContainer = document.getElementById(options.container);

	if (options.startAt) {
		this._startAt(options.startAt);
	}

	this.stopAutoPlay = this.stopAutoPlay.bind(this);
	if (options.autoPlay) {
		if (!this._componentsContainer) {
			throw new Error(ERROR_NO_CONTAINER_ELEMENT_SUPPLIED);
		}

		var delay = (typeof options.autoPlay === 'number') ? options.autoPlay : DEFAULT_AUTO_PLAY_DELAY;
		this.startAutoPlay(delay);
	}

	if (options.deeplink !== false) {
		var item = this._getDeeplinkedItem();
		if (item && item !== this._currentItem) {
			this.show(item);
		}
	}

	if (this._containerResizeDuration !== false) {
		var height = this._itemHeightsLookup[this._currentItem.getElementId()];
		if (height) {
			this._setElHeight(height);
		}
	}

	if (this._toggleNav) {
		this._toggleNav.start();
	}

	this._setUpSwiping(options.touch && touchAvailable(), options.desktopSwipe);

	if (this._componentsContainer) {
		this._componentsContainer.setAttribute('tabIndex', -1);
	}
}

/** Events */
AutoGallery.RESIZED = 'resized';
AutoGallery.UPDATE = Gallery.UPDATE;
AutoGallery.UPDATE_COMPLETE = Gallery.UPDATE_COMPLETE;

var superProto = Gallery.prototype;
var proto = AutoGallery.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.AutoGallery#addItem
 * @function
 * @override
 *
 * @desc Adds an item to the gallery.
 *
 * @param {Item|Element} item
 *        Can be an object that is or extends the `Item` type. Alternatively, can
 *        be an Element and Gallery will instantiate a new `Item`. The type of item
 *        can be set in instantiation options (options.itemType)
 *
 * @param {Number} [index]
 *        Allows you to specify where the item is added to the items array. By default
 *        the item will be added to the end of the items array.
 *
 * @returns {Item} The added item instance.
 */
proto.addItem = function (item, index) {
	if (item.nodeType) {
		var isACaption = this._isACaptionsGallery;

		item = new this._itemType(item, {
			isACaption: isACaption
		});
	} else if (this._items.indexOf(item) > -1) {
		// already added
		// todo: figure out how to not repeat this here and in super Gallery
		return item;
	}

	if (this._resizeContainer) {
		this._storeItemHeight(item, this._containerResizeDuration === false);
	}

	this._addItemTriggers(item);

	return superProto.addItem.call(this, item, index);
};

/**
 * @name module:ac-gallery.AutoGallery#removeItem
 * @function
 * @override
 *
 * @desc Removes an item from the gallery.
 *
 * @param {Item} item
 *        The item that should be removed.
 *
 * @param {Boolean} [options.destroyItem=false]
 *        When true, the removed item will have it's destroy method called.
 *
 * @param {Boolean} [options.setCurrentItem=undefined]
 *        When false, if the removed item is the current item, we won't call
 *        update passing the first item to reset the currentItem. This is
 *        really only intended to be used in `this.destroy()`.
 *
 * @returns {Item} The removed item.
 */
proto.removeItem = function (item, options) {

	if (this._resizeContainer) {
		var index = this._itemHeights.length;
		while (index--) {
			if (this._itemHeights[index].item === item) {
				this._itemHeights.splice(index, 1);

				if (index === 0 && this._itemHeights.length) {
					this._setElHeight(this._itemHeights[0].height);
				}
			}
		}
	}

	return superProto.removeItem.call(this, item, options);
};

/**
 * @name module:ac-gallery.AutoGallery#startAutoPlay
 * @function
 *
 * @desc Starts autoplay on the gallery. The gallery will call `showNext` on itself
 *       repeatidly until told to stop. The time between each update is set by the
 *       delay argument.
 *
 * @param {Number} [delay=3]
 *        The time in seconds between each update.
 *
 * @param {Boolean} [options.cancelOnInteraction=true]
 *        Mostly when a user interacts with the gallery that you'll want autoPlay
 *        to stop. In the unlikely event you don't want that behaviour, you can
 *        set this option to true.
 */
proto.startAutoPlay = function (delay, options) {
	options = options || {};
	this._isAutoPlaying = true;
	this._autoPlayDelay = (delay || DEFAULT_AUTO_PLAY_DELAY) * 1000;
	this._cancelAutoPlayOnInteraction = (options.cancelOnInteraction === undefined) ? true : options.cancelOnInteraction;
	setTimeout(this._onAutoPlayToNextItem.bind(this), this._autoPlayDelay);

	if (this._cancelAutoPlayOnInteraction) {
		this.on(Gallery.UPDATE, this.stopAutoPlay);
	}

	if (this._componentsContainer) {
		ac_addEventListener(this._componentsContainer, 'focus', this.stopAutoPlay, true);
		ac_addEventListener(this._componentsContainer, 'touchend', this.stopAutoPlay, true);
		ac_addEventListener(this._componentsContainer, 'click', this.stopAutoPlay, true);
	} else {
		throw new Error(ERROR_NO_CONTAINER_ELEMENT_SUPPLIED);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#stopAutoPlay
 * @function
 *
 * @desc Cancels autoplay functionality.
 */
proto.stopAutoPlay = function () {
	this._isAutoPlaying = false;

	if (this._cancelAutoPlayOnInteraction) {
		this.off(Gallery.UPDATE, this.stopAutoPlay);
	}

	if (this._componentsContainer) {
		ac_removeEventListener(this._componentsContainer, 'focus', this.stopAutoPlay, true);
		ac_removeEventListener(this._componentsContainer, 'touchend', this.stopAutoPlay, true);
		ac_removeEventListener(this._componentsContainer, 'click', this.stopAutoPlay, true);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#getElement
 * @function
 *
 * @desc Returns the container element for the gallery.
 *
 * @returns {Element} The container element for the gallery.
 */
proto.getElement = function () {
	return this._el;
};

/**
 * @name module:ac-gallery.AutoGallery#getToggleNav
 * @function
 *
 * @desc Returns the instance of ToggleNav created by this gallery.
 *
 * @returns {ToggleNav} The instance of ToggleNav created by this gallery.
 */
proto.getToggleNav = function () {
	return this._toggleNav || null;
};

/**
 * @name module:ac-gallery.AutoGallery#resize
 * @function
 *
 * @desc Resets any styles or elements that need to be adjusted in case of a height change.
 *
 * @fires AutoGallery#resized
 */
proto.resize = function (winWidth, winHeight) {

	if (this._resizeContainer) {
		this._itemHeights = [];
		var index = this._items.length;
		while (index--) {
			this._storeItemHeight(this._items[index], false);
		}

		if (this._containerResizeDuration !== false) {
			this._setElHeight(this._itemHeightsLookup[this._currentItem.getElementId()]);
		} else {
			this._setElHeight(this._itemHeights[0].height);
		}
	}

	if (this._toggleNav) {
		this._toggleNav.resize();
	}

	/**
	 * Resized event.
	 * @event AutoGallery#resized
	 */
	this.trigger(AutoGallery.RESIZED, this);
};

/**
 * @name module:ac-gallery.AutoGallery#enableKeyboard
 * @function
 *
 * @desc Turns on keyboard interaction for the gallery.
 */
proto.enableKeyboard = function () {
	if (!this._enableArrowKeys) {
		this._enableArrowKeys = true;
		this._addKeyboardListener();
	}
};

/**
 * @name module:ac-gallery.AutoGallery#disableKeyboard
 * @function
 *
 * @desc Turns off keyboard interaction for the gallery.
 */
proto.disableKeyboard = function () {
	if (this._enableArrowKeys) {
		this._enableArrowKeys = false;
		Keyboard.offDown(keyMap.ARROW_RIGHT, this._rightArrowFunc);
		Keyboard.offDown(keyMap.ARROW_LEFT, this._leftArrowFunc);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#enableTouch
 * @function
 *
 * @desc Turns on touch interaction for the gallery.
 */
proto.enableTouch = function () {
	if (!this._touchSwipe) {
		this._setUpSwiping(true, false);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#disableTouch
 * @function
 *
 * @desc Turns off touch interaction for the gallery.
 */
proto.disableTouch = function () {
	if (this._touchSwipe) {
		this._touchSwipe.off(PointerTracker.END, this._onSwipeEnd);
		this._touchSwipe.destroy();
		this._touchSwipe = null;
	}
};

/**
 * @name module:ac-gallery.AutoGallery#enableDesktopSwipe
 * @function
 *
 * @desc Turns on click and drag interaction on desktop for the gallery.
 */
proto.enableDesktopSwipe = function () {
	if (!this._clickSwipe) {
		this._setUpSwiping(false, true);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#disableDesktopSwipe
 * @function
 *
 * @desc Turns off click and drag interaction on desktop for the gallery.
 */
proto.disableDesktopSwipe = function () {
	if (this._clickSwipe) {
		this._clickSwipe.off(PointerTracker.END, this._onSwipeEnd);
		this._clickSwipe.destroy();
		this._clickSwipe = null;
	}
};

/**
 * @name module:ac-gallery.AutoGallery#destroy
 * @function
 * @override
 *
 * @desc Destroys a gallery, removes it's items and sets props to null.
 *       Also, unbinds event listeners on keyboard (if enableArrowKeys
 *       option was `true`) and paddle nav (if exists).
 *
 * @param {Boolean} [options.destroyItems=true]
 *        When `true` the gallery will call the `destroy` method of all it's
 *        items as it removes them.
 */
proto.destroy = function (options) {
	if (this._isAutoPlaying) {
		this.stopAutoPlay();
	}

	if (this._componentsContainer) {
		ac_removeEventListener(this._componentsContainer, 'focus', this.stopAutoPlay, true);
		ac_removeEventListener(this._componentsContainer, 'touchend', this.stopAutoPlay, true);
		ac_removeEventListener(this._componentsContainer, 'click', this.stopAutoPlay, true);
	}

	if (this._resizeContainer) {
		ac_dom_styles.setStyle(this._el, {
			height: null,
			transition: null
		});
	}

	if (this._enableArrowKeys) {
		Keyboard.offDown(keyMap.ARROW_RIGHT, this._rightArrowFunc);
		Keyboard.offDown(keyMap.ARROW_LEFT, this._leftArrowFunc);
	}

	var index;
	if (this._previousButtons) {
		index = this._previousButtons.length;
		while (index--) {
			ac_removeEventListener(this._previousButtons[index], 'click', this._onPaddlePrevious);
		}
		this._setPaddleDisabledState(this._previousButtons, false);
	}
	if (this._nextButtons) {
		index = this._nextButtons.length;
		while (index--) {
			ac_removeEventListener(this._nextButtons[index], 'click', this._onPaddleNext);
		}
		this._setPaddleDisabledState(this._nextButtons, false);
	}

	if (this._dynamicPaddleNav) {
		this._el.removeChild(this._dynamicPaddleNav);
	}

	if (this._hasPaddleNavStateHandler) {
		this.off(Gallery.UPDATE, this._updatePaddleNavState);
	}

	this.disableTouch();
	this.disableDesktopSwipe();

	if (this._toggleNav) {
		this._toggleNav.destroy();
		this._toggleNav = null;
	}

	ac_removeEventListener(window, 'resize', this._onWindowResize);

	this._el = null;
	this._itemHeights = null;
	this._itemHeightsLookup = null;
	this._resizeContainer = null;
	this._isRightToLeft = null;
	this._enableArrowKeys = null;
	this._previousButtons = null;
	this._onPaddlePrevious = null;
	this._nextButtons = null;
	this._onPaddleNext = null;
	this._isACaptionsGallery = null;
	this._componentsContainer = null;

	// call / return super.destroy method
	return superProto.destroy.call(this, options);
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.AutoGallery#_getDeeplinkedItem
 * @function
 * @private
 *
 * @returns {Item} The item that shares the same ID as the current URL hash (if there is one).
 */
/** @ignore */
proto._getDeeplinkedItem = function () {
	var path = window.location.hash.substr(1);
	var item;
	var index = this._items.length;
	while (index--) {
		item = this._items[index];
		if (path === item.getElementId()) {
			return item;
		}
	}
	return null;
};

/**
 * @name module:ac-gallery.AutoGallery#_addItems
 * @function
 * @private
 *
 * @desc Selects items within the gallery wrapper element, loops through them
 *       and calls `_addItem` passing the element.
 *
 * @param {String} itemSelector
 *        The selector for getting dom elements to use with gallery Items.
 */
/** @ignore */
proto._addItems = function (itemSelector) {
	var item;
	var items;
	var isDataAttribute = /(^\[).*(\]$)/.test(itemSelector);
	if (isDataAttribute) {
		// this can be deleted once support for ie7 is dropped
		itemSelector = itemSelector.replace(/\[|\]/g, '');
		items = selectElementThatHasDataAttribute(itemSelector, this._el);
	} else {
		items = ac_querySelectorAll(itemSelector, this._el);
	}
	var index = 0;
	var length = items.length;
	var isACaption = this._isACaptionsGallery;

	for (index; index < length; index++) {
		item = new this._itemType(items[index], {
			isACaption: isACaption
		});
		this.addItem(item);
		this._addItemTriggers(item);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_createToggleNav
 * @function
 * @private
 */
/** @ignore */
proto._createToggleNav = function () {
	var id = this._getElementId();
	var selector = '[data-ac-gallery-togglenav="' + id + '"], [data-ac-gallery-tabnav="' + id + '"]';
	var toggleNavEl = ac_querySelector(selector);
	if (toggleNavEl) {
		this._toggleNav = new ToggleNav(toggleNavEl, this, {
			duration: this._toggleNavDuration
		});
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_addItemTriggers
 * @function
 * @private
 *
 * @desc Finds elements on the page that have the data attribute `data-ac-gallery-trigger` where
 *       the value contains the id of the passed item and adds them as triggers to the item.
 *
 * @param {Item} item
 *        The item whose triggers to find and add to.
 */
/** @ignore */
proto._addItemTriggers = function (item, additionalTriggers) {
	var triggers = selectElementFromDataAttributeValue('data-ac-gallery-trigger', item.getElementId());
	if (additionalTriggers && additionalTriggers.length) {
		triggers = triggers.concat(additionalTriggers);
	}
	var index = 0;
	var length = triggers.length;

	for (index; index < length; index++) {
		item.addElementTrigger(triggers[index]);
		if (this._toggleNav) {
			this._toggleNav.addTrigger(triggers[index], item);
		}
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_addPaddleNav
 * @function
 * @private
 *
 * @desc If the gallery wrapper element has next / previous buttons (paddle nav)
 *       this method will add an event listener to them for when they are clicked,
 *       with this `showNext` and `showPrevious` methods as the handler.
 *
 * @param {String|Boolean} autoAdd
 *        If true the default template will be used for paddles. If string the
 *        string will be used for paddles template. See docs for what a template
 *        string should look like.
 */
/** @ignore */
proto._addPaddleNav = function (autoAdd) {
	var index;
	var id = this._getElementId();

	if (autoAdd) {
		var template = (typeof autoAdd === 'string') ? autoAdd : DEFAULT_PADDLENAV_TEMPLATE;
		template = template.replace(/%ID%/g, this._getElementId());
		this._dynamicPaddleNav = document.createElement('div');
		this._dynamicPaddleNav.innerHTML = template;
		this._el.insertBefore(this._dynamicPaddleNav, this._el.firstChild);
	}

	this._previousButtons = selectElementFromDataAttributeValue('data-ac-gallery-previous-trigger', id);
	this._nextButtons = selectElementFromDataAttributeValue('data-ac-gallery-next-trigger', id);

	var galleryLabel = this._el.getAttribute('aria-label') || '';
	if (galleryLabel.length) {
		galleryLabel = '(' + galleryLabel + ')';
	}

	// loop through all previous paddle nav buttons and add listener / accessibility attributes
	this._onPaddlePrevious = this._onPaddleInteraction.bind(null, this.showPrevious);
	index = this._previousButtons.length;
	if (index) {
		var previousAriaLabel = this._el.getAttribute('data-ac-gallery-previouslabel');
		if (previousAriaLabel && galleryLabel.length) {
			if (this._isRightToLeft) {
				previousAriaLabel = galleryLabel + ' ' + previousAriaLabel;
			} else {
				previousAriaLabel += ' ' + galleryLabel;
			}
		}

		while (index--) {
			if (previousAriaLabel && this._previousButtons[index].getAttribute('aria-label') === null) {
				this._previousButtons[index].setAttribute('aria-label', previousAriaLabel);
			}
			ac_addEventListener(this._previousButtons[index], 'click', this._onPaddlePrevious);
		}
	}

	// loop through all next paddle nav buttons and add listener / accessibility attributes
	this._onPaddleNext = this._onPaddleInteraction.bind(null, this.showNext);
	index = this._nextButtons.length;
	if (index) {
		var nextAriaLabel = this._el.getAttribute('data-ac-gallery-nextlabel');
		if (nextAriaLabel && galleryLabel.length) {
			if (this._isRightToLeft) {
				nextAriaLabel = galleryLabel + ' ' + nextAriaLabel;
			} else {
				nextAriaLabel += ' ' + galleryLabel;
			}
		}

		while (index--) {
			if (nextAriaLabel && this._nextButtons[index].getAttribute('aria-label') === null) {
				this._nextButtons[index].setAttribute('aria-label', nextAriaLabel);
			}
			ac_addEventListener(this._nextButtons[index], 'click', this._onPaddleNext);
		}
	}

	if (this._nextButtons.length || this._previousButtons.length) {

		this._hasPaddleNavStateHandler = true;
		this._updatePaddleNavState = this._updatePaddleNavState.bind(this);

		this.on(Gallery.UPDATE, this._updatePaddleNavState);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_onPaddleInteraction
 * @function
 * @private
 *
 * @param {Function} method
 *        The method to be called when the paddle is clicked.
 *
 * @param {Event} evt
 *        The MouseEvent from when the paddle is clicked.
 */
/** @ignore */
proto._onPaddleInteraction = function (method, evt) {
	preventDefault(evt);

	method.call(null, {
		interactionEvent: evt
	});
};

/**
 * @name module:ac-gallery.AutoGallery#_updatePaddleNavState
 * @function
 * @private
 *
 * @desc Sets the disabled attribute to `true` or `false` on the paddle nav buttons
 *       based on if the current item is first or last.
 */
/** @ignore */
proto._updatePaddleNavState = function () {
	if (!this._wrapAround) {
		var index = this._items.indexOf(this._currentItem);

		if (index === 0 && this._previousButtons.length) {
			this._setPaddleDisabledState(this._previousButtons, true);
			this._setPaddleDisabledState(this._nextButtons, false);
		} else if (index === this._items.length - 1 && this._nextButtons.length) {
			this._setPaddleDisabledState(this._nextButtons, true);
			this._setPaddleDisabledState(this._previousButtons, false);
		} else {
			this._setPaddleDisabledState(this._previousButtons, false);
			this._setPaddleDisabledState(this._nextButtons, false);
		}
	} else {
		this._setPaddleDisabledState(this._previousButtons, false);
		this._setPaddleDisabledState(this._nextButtons, false);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_setPaddleDisabledState
 * @function
 * @private
 *
 * @param {Array} paddles
 *        An array of next or previous paddles.
 *
 * @param {Boolean} isDisabled
 *        When true a 'disabled' css class will be added to the paddles and
 *        it's disabled attribute will be set to true.
 */
/** @ignore */
proto._setPaddleDisabledState = function (paddles, isDisabled) {
	var index = paddles.length;
	while (index--) {
		paddles[index].disabled = isDisabled;
		if (isDisabled) {
			ac_classList.add(paddles[index], CSS_DISABLED_CLASS);
		} else {
			ac_classList.remove(paddles[index], CSS_DISABLED_CLASS);
		}
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_addKeyboardListener
 * @function
 * @private
 *
 * @desc Called when the enableArrowKeys option is passed as `true` when this gallery is
 *       instantiated. Adds listeners to right / left arrow keys and binds them to this
 *       `next` and `previous` methods.
 */
/** @ignore */
proto._addKeyboardListener = function () {
	if (this._enableArrowKeys) {
		this._onKeyboardInteraction = this._onKeyboardInteraction.bind(this);

		var rightArrowFunc;
		var leftArrowFunc;

		if (this._isRightToLeft) {
			rightArrowFunc = this.showPrevious;
			leftArrowFunc = this.showNext;
		} else {
			rightArrowFunc = this.showNext;
			leftArrowFunc = this.showPrevious;
		}

		// todo: check that using throttle doesn't cause memory leaks (ensure this instance of gallery can be removed from memory)
		this._rightArrowFunc = throttle(this._onKeyboardInteraction.bind(null, rightArrowFunc), this._keyboardThrottleDelay);
		this._leftArrowFunc = throttle(this._onKeyboardInteraction.bind(null, leftArrowFunc), this._keyboardThrottleDelay);

		Keyboard.onDown(keyMap.ARROW_RIGHT, this._rightArrowFunc);
		Keyboard.onDown(keyMap.ARROW_LEFT, this._leftArrowFunc);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_onKeyboardInteraction
 * @function
 * @private
 *
 * @param {Function} method
 *        The method to be called when the key is pressed.
 *
 * @param {Event} evt
 *        The KeyboardEvent from when the key is pressed.
 */
/** @ignore */
proto._onKeyboardInteraction = function (method, evt) {
	if (this.isInView() && !inputHasFocus()) {
		var galleries = Gallery.getAllInView();
		if (galleries.length > 1) {
			// if there's more than one gallery currently in view
			galleries.sort(function (a, b) {
				// order the array based on the percentage in view the galleries are
				a = (a._enableArrowKeys) ? a.getCurrentItem().percentageInView() : 0;
				b = (b._enableArrowKeys) ? b.getCurrentItem().percentageInView() : 0;
				return b - a;
			});

			if (this !== galleries[0]) {
				// not the most in view gallery so do nothing
				return;
			}
		}

		method.call(null, {
			interactionEvent: evt
		});
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_setUpSwiping
 * @function
 * @private
 *
 * @param {Boolean} forTouch
 *        When true listeners will be added for touch events.
 *
 * @param {Boolean} forClick
 *        Basically touch like behaviour for desktop but with click and drag.
 */
/** @ignore */
proto._setUpSwiping = function (forTouch, forClick) {
	this._onSwipeEnd = this._onSwipeEnd.bind(this);

	if (forTouch) {
		this._touchSwipe = new PointerTracker(this._el, PointerTracker.TOUCH_EVENTS);
		this._touchSwipe.on(PointerTracker.END, this._onSwipeEnd);
	}

	if (forClick) {
		this._clickSwipe = new PointerTracker(this._el, PointerTracker.MOUSE_EVENTS);
		this._clickSwipe.on(PointerTracker.END, this._onSwipeEnd);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_onSwipeEnd
 * @function
 * @private
 *
 * @param {Number} evt.diff
 *        The difference between the current mouse/touch x position and the last.
 *
 * @param {Event} evt.interactionEvent
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onSwipeEnd = function (evt) {
	var method;

	var interactionEvent = evt.interactionEvent;
	var clickSwipe = interactionEvent.type !== 'touchend' || interactionEvent.type !== 'touchstart' || interactionEvent.type !== 'touchmove';

	if (clickSwipe) {
		var clickSwipeEvent = {
			type: 'touchmove',
			target: interactionEvent.target,
			srcElement: interactionEvent.srcElement
		};
	}

	var options = {
		interactionEvent: clickSwipeEvent || interactionEvent
	};

	if (evt.swipe === PointerTracker.SWIPE_RIGHT) {
		method = (this._isRightToLeft) ? this.showNext : this.showPrevious;
	} else if (evt.swipe === PointerTracker.SWIPE_LEFT) {
		method = (this._isRightToLeft) ? this.showPrevious : this.showNext;
	}

	if (method) {
		return method.call(this, options);
	}

	interactionEvent = null;

	return null;
};

/**
 * @name module:ac-gallery.AutoGallery#_getElementId
 * @function
 * @private
 *
 * @returns {String} The ID of the gallery element.
 */
/** @ignore */
proto._getElementId = function () {
	if (this._elementId === undefined) {
		this._elementId = this._el.getAttribute('id');
	}
	return this._elementId;
};

/**
 * @name module:ac-gallery.AutoGallery#_setUpContainerAutoResize
 * @function
 * @private
 *
 * @desc Sets up a listen on itself for the `update` event. On update it'll
 *       resize the container element to the height of the current item element.
 *
 * @param {Number|Boolean} resizeContainerOnUpdate
 *        The duration of the transition between heights in seconds. When true
 *        the duration will be the default of 0.5 seconds.
 */
/** @ignore */
proto._setUpContainerAutoResize = function (resizeContainerOnUpdate) {
	if (typeof resizeContainerOnUpdate === 'number') {
		this._containerResizeDuration = resizeContainerOnUpdate;
	} else if (resizeContainerOnUpdate) {
		this._containerResizeDuration = DEFAULT_CONTAINER_RESIZE_DURATION;
	} else {
		this._containerResizeDuration = false;
	}

	if (this._containerResizeDuration !== false) {
		this._resizeContainer = true;

		this._updateContainerSize = this._updateContainerSize.bind(this);
		this.on(Gallery.UPDATE, this._updateContainerSize);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_updateContainerSize
 * @function
 * @private
 *
 * @param {Object} items
 *        An object containing the incoming item which is then used to
 *        get it's elements height.
 */
/** @ignore */
proto._updateContainerSize = function (items) {
	var height = this._itemHeightsLookup[items.incoming[0].getElementId()];
	if (height) {
		this._setElHeight(height, this._containerResizeDuration);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_storeItemHeight
 * @function
 * @private
 *
 * @param {Item} item
 *        The item whose height we want to get.
 *
 * @param {Boolean} [resizeEl=false]
 *        Set to true when we want to resize the container element to the tallest element.
 */
/** @ignore */
proto._storeItemHeight = function (item, resizeEl) {
	var bounds = getContentDimensions(item.getElement());
	this._itemHeights.push({
		item: item,
		height: bounds.height
	});
	this._itemHeightsLookup[item.getElementId()] = bounds.height;

	// todo: right now this happens for every item on resize, doesn't need to
	this._itemHeights.sort(function (a, b) {
		return b.height - a.height;
	});

	if (resizeEl && this._itemHeights[0].item === item) {
		this._setElHeight(bounds.height);
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_setElHeight
 * @function
 * @private
 *
 * @param {Number} height
 *        The height to set the container element to.
 *
 * @param {Number} duration
 *        The duration in seconds if you want the height change to animate.
 */
/** @ignore */
proto._setElHeight = function (height, duration) {
	var styles = {
		height: height + 'px'
	};
	if (duration) {
		styles['transition'] = 'height ' + duration + 's';
	} else {
		styles['transition'] = null;
	}

	ac_dom_styles.setStyle(this._el, styles);
};

/**
 * @name module:ac-gallery.AutoGallery#_onAutoPlayToNextItem
 * @function
 * @private
 */
/** @ignore */
proto._onAutoPlayToNextItem = function () {
	if (this._isAutoPlaying) {
		if (!PageVisibilityManager.isHidden && this._currentItem.isInView()) {
			if (this._cancelAutoPlayOnInteraction) {
				this.off(Gallery.UPDATE, this.stopAutoPlay);
			}
			var item = this.showNext();
			if (item !== null) {
				if (this._cancelAutoPlayOnInteraction) {
					this.on(Gallery.UPDATE, this.stopAutoPlay);
				}
				setTimeout(this._onAutoPlayToNextItem.bind(this), this._autoPlayDelay);
			}
		} else {
			setTimeout(this._onAutoPlayToNextItem.bind(this), this._autoPlayDelay);
		}
	}
};

/**
 * @name module:ac-gallery.AutoGallery#_onWindowResize
 * @function
 * @private
 *
 * @param {Event} [evt=null]
 *        Window resize event.
 */
/** @ignore */
proto._onWindowResize = function (evt) {
	window.requestAnimationFrame(function () {
		if (this._el) {
			this.resize();
		}
	}.bind(this));
};

module.exports = AutoGallery;

// ac-gallery@2.3.0

},{"../templates/paddlenav.js":382,"./../Gallery":362,"./../helpers/inputHasFocus":373,"./../helpers/selectElementFromDataAttributeValue":374,"./../helpers/selectElementThatHasDataAttribute":375,"./../navigation/ToggleNav":376,"@marcom/ac-classlist":304,"@marcom/ac-dom-events/addEventListener":307,"@marcom/ac-dom-events/preventDefault":315,"@marcom/ac-dom-events/removeEventListener":316,"@marcom/ac-dom-metrics/getContentDimensions":5,"@marcom/ac-dom-styles":26,"@marcom/ac-dom-traversal/querySelector":45,"@marcom/ac-dom-traversal/querySelectorAll":46,"@marcom/ac-feature/touchAvailable":336,"@marcom/ac-function/throttle":339,"@marcom/ac-keyboard":341,"@marcom/ac-keyboard/keyMap":343,"@marcom/ac-object/create":345,"@marcom/ac-page-visibility":347,"@marcom/ac-pointer-tracker":353,"@marcom/ac-polyfills/requestAnimationFrame":394}],367:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var create = require('./create');
var selectElementThatHasDataAttribute = require('./../helpers/selectElementThatHasDataAttribute');

/** @ignore */
var Gallery = require('./../Gallery');

/** @ignore */
var FADE_DATA_ATTRIBUTE = Gallery.FADE_SELECTOR.replace(/\[|\]/g, '');
var SLIDE_DATA_ATTRIBUTE = Gallery.SLIDE_SELECTOR.replace(/\[|\]/g, '');


/**
 * @name module:ac-gallery#autoCreate
 * @function
 * @static
 *
 * @desc Will search the given context (defaults to `document.body`) for gallery
 *       elements and instantiate new instances of the relevant type depending on
 *       the data attribute the element has. (`data-ac-gallery-fade` or
 *       `data-ac-gallery-slide`)
 *
 * @param {Object} [options={}]
 *        Options to pass when instantiating the gallery instance.
 *
 * @param {Element} [options.context=document.body]
 *        The context option is the element that autoCreate should search for gallery
 *        elements. It defaults to `document.body`.
 *
 * @returns {Gallery} todo.
 */
module.exports = function autoCreate(options) {
	options = options || {};
	var context = options.context || document.body;
	var elements;
	var index;

	// slide galleries
	elements = selectElementThatHasDataAttribute(SLIDE_DATA_ATTRIBUTE, context);
	index = elements.length;
	while (index--) {
		create(elements[index], Gallery.SLIDE, options);
	}

	// fade galleries
	elements = selectElementThatHasDataAttribute(FADE_DATA_ATTRIBUTE, context);
	index = elements.length;
	while (index--) {
		create(elements[index], Gallery.FADE, options);
	}

	return Gallery.getAll();
};

// ac-gallery@2.3.0

},{"./../Gallery":362,"./../helpers/selectElementThatHasDataAttribute":375,"./create":368}],368:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var FadeGallery = require('./../fade/FadeGallery');
var Gallery = require('./../Gallery');
var SlideGallery = require('./../slide/SlideGallery');

/** @ignore */
var ERROR_GALLERY_TYPE_UNSUPPORTED = '%TYPE% is not a supported gallery type and el has no gallery data attribute.';
var FADE_DATA_ATTRIBUTE = Gallery.FADE_SELECTOR.replace(/\[|\]/g, '');
var SLIDE_DATA_ATTRIBUTE = Gallery.SLIDE_SELECTOR.replace(/\[|\]/g, '');


/**
 * @name module:ac-gallery#create
 * @function
 * @static
 *
 * @desc Takes an element and instantiates a gallery with it. The type of gallery can
 *       be set by either having a data attribute on the element (`data-ac-gallery-fade`
 *       or `data-ac-gallery-slide`) or by specifying it in the type argument.
 *
 * @param {Element} el
 *        The element to use as the gallery container.
 *
 * @param {String} [type=null]
 *        The type of gallery to create. Either "fade" or "slide".
 *
 * @param {object} [options={}]
 *        Options to pass when instantiating the gallery instance.
 *
 * @returns {Gallery} The new instance of Gallery (either FadeGallery or SlideGallery).
 */
module.exports = function create(el, type, options) {
	var GalleryType;
	if (typeof type === 'string') {
		if (type === Gallery.SLIDE) {
			GalleryType = SlideGallery;
		} else if (type === Gallery.FADE) {
			GalleryType = FadeGallery;
		}
	}
	if (GalleryType === undefined) {
		if (el.getAttribute(SLIDE_DATA_ATTRIBUTE) !== null) {
			GalleryType = SlideGallery;
		} else if (el.getAttribute(FADE_DATA_ATTRIBUTE) !== null) {
			GalleryType = FadeGallery;
		}
	}

	if (GalleryType === undefined) {
		throw new Error(ERROR_GALLERY_TYPE_UNSUPPORTED.replace(/%TYPE%/g, type));
	}

	return new GalleryType(el, options);
};

// ac-gallery@2.3.0

},{"./../Gallery":362,"./../fade/FadeGallery":369,"./../slide/SlideGallery":379}],369:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var clone = require('@marcom/ac-object/clone');
var create = require('@marcom/ac-object/create');

/** @ignore */
var FadeItem = require('./FadeItem');
var AutoGallery = require('./../auto/AutoGallery');

/** @ignore */
var DEFAULT_FADE_DURATION = 0.5;


/**
 * @name module:ac-gallery.FadeGallery
 * @class
 * @extends AutoGallery
 *
 * @param {Element} el
 *        The container `Element` that wraps the gallery.
 *
 * @param {Function} [options.itemType=FadeItem]
 *        The Item type for this gallery. The gallery will find it's elements and
 *        instantiate new Item objects using this type.
 *
 * @param {Boolean} [options.updateOnWindowResize=true]
 *        By default a gallery listens to the window for a resize event and calls
 *        a `resize` method on itself. Some users won't want this as they'll want
 *        control over window resize listeners. In order to stop gallery from
 *        listening to the window set this option to false.
 *
 * @param {Boolean} [options.wrapAround=false]
 *        When `true` calling `showNext` when on last item will move to first item and
 *        calling `showPrevious` on first item will move to last. Essentially this
 *        makes the gallery loop for infinity.
 *
 * @param {Boolean} [options.enableArrowKeys=true]
 *        When `true` a listening will be added to the arrow keys that triggers
 *        the `showNext` and `showPrevious` methods.
 *
 * @param {Boolean|Number} [options.autoPlay=false]
 *        When `true` the gallery will autoplay using the default autoplay delay until
 *        a user interacts with the gallery. When set as a `Number` the gallery will
 *        autoplay using the number as the delay in seconds. Use in conjunction with
 *        the `container` option so that `autoPlay` will stop with the user gains focus
 *        on the gallery and its elements.
 *
 * @param {String} [options.container=undefined]
 *        The ID string of the container element. Use in conjunction with the `autoPlay` option.
 *        The gallery and any of its related elements (tabnav, dotnav, paddlenav, captions)
 *        should live in a container element, so that `autoPlay` will stop when the user gains
 *        focus on the gallery and any of its related elements.
 *
 * @param {Boolean} [options.touch=false]
 *        Enables touch screen interactions.
 *
 * @param {Boolean} [options.desktopSwipe=false]
 *        Basically touch like behaviour for desktop but with click and drag.
 *
 * @param {Boolean|String} [option.addPaddleNav=false]
 *        When `true` will add the default html for paddle navs (see templates/paddlenav.js).
 *        If a string, that string will be used as html for paddle nav.
 *
 * @param {Number} [options.duration=0.5]
 *        The duration (in seconds) of the fade transition.
 *
 * @param {String} [options.ease=null]
 *        The easing algorithm to use for fade transition. Defaults to the default
 *        `ac-eclipse` easing algorithm.
 *
 * @param {Number} [options.toggleNavDuration=options.duration]
 *        If the gallery has a togglenav, this will determine the slide transition duration
 *        when the nav is wider than the window width.
 *
 * @param {Boolean} [options.crossFade=false]
 *        When `true` the gallery items will cross fade. The default behaviour is
 *        for the new item to fade in on top of the current item.
 *
 * @param {startZIndex} [options.startZIndex=1]
 *        The gallery puts the current item on an incrementing z-index in CSS. This
 *        option allows a user to set what the start z-index is. Defaults to 1.
 *
 * @param {Number} [options.startAt=undefined]
 *        By default, this option is not set so that the gallery defaults to start at the first item.
 *        Otherwise, the gallery starts at the item with the provided index, if that item exists exists.
 */
function FadeGallery(el, options) {
	options = clone(options) || {};

	options.itemType = options.itemType || FadeItem;

	this._fadeDuration = options.duration || DEFAULT_FADE_DURATION;
	options.toggleNavDuration = (options.toggleNavDuration === undefined) ? this._fadeDuration : options.toggleNavDuration;
	this._crossFade = options.crossFade;
	this._zIndexCount = options.startZIndex || 1;
	this._ease = options.ease;

	if (options.resizeContainerOnUpdate === true) { // need === true because we don't want to do this when it's a number
		options.resizeContainerOnUpdate = this._fadeDuration;
	}

	// bind
	this._onItemShowComplete = this._onItemShowComplete.bind(this);

	// call super constructor
	AutoGallery.call(this, el, options);

	if (this._currentItem) {
		this._currentItem.fadeIn(0);
	}
}

/** Events */
FadeGallery.RESIZED = AutoGallery.RESIZED;
FadeGallery.UPDATE = AutoGallery.UPDATE;
FadeGallery.UPDATE_COMPLETE = AutoGallery.UPDATE_COMPLETE;

var superProto = AutoGallery.prototype;
var proto = FadeGallery.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.FadeGallery#addItem
 * @function
 * @override
 *
 * @desc Adds an item to the gallery.
 *
 * @param {Item|Element} item
 *        Can be an object that is or extends the `Item` type. If is an `Item` it must match the `itemType`
 *        set at gallery instantiation. Alternatively, can be an Element and Gallery will instantiate a new `Item`.
 *        The type of item can be set in instantiation options (options.itemType).
 *
 * @param {Number} [index]
 *        Allows you to specify where the item is added to the items array. By default
 *        the item will be added to the end of the items array.
 *
 * @returns {Item} The added item instance.
 */
proto.addItem = function (item, index) {
	if (item.nodeType) {
		item = new this._itemType(item);
	}

	var returnValue = superProto.addItem.call(this, item, index);

	if (item !== this._currentItem) {
		item.fadeOut();
	} else {
		item.fadeIn(0);
	}

	return returnValue;
};

/**
 * @name module:ac-gallery.FadeGallery#destroy
 * @function
 * @override
 *
 * @desc Destroys a gallery, removes it's items and sets props to null.
 *       Also, unbinds event listeners on keyboard (if enableArrowKeys
 *       option was `true`) and paddle nav (if exists).
 *
 * @param {Boolean} [options.destroyItems=true]
 *        When `true` the gallery will call the `destroy` method of all it's
 *        items as it removes them.
 */
proto.destroy = function (options) {
	// call / return super.destroy method
	var returnValue = superProto.destroy.call(this, options);

	this._fadeDuration = null;
	this._crossFade = null;
	this._zIndexCount = null;
	this._ease = null;
	this._onItemShowComplete = null;

	// return super.destroy method
	return returnValue;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.FadeGallery#_startAt
 * @function
 * @private
 * @override
 *
 * @param  {Number} index
 *         The index of the item at which to start at.
 */
proto._startAt = function(index) {
	var item = this._items[index];

	if (item && (this._currentItem !== item)) {
		this._currentItem.fadeOut(0);
		this._currentItem.hide();
  		this._setCurrentItem(item);
  		this._currentItem.show();
  		this._currentItem.fadeIn(0);
  		this.trigger(FadeGallery.UPDATE, this._items);
	}
};

/**
 * @name module:ac-gallery.FadeGallery#_onItemShowComplete
 * @function
 * @private
 *
 * @desc Called when a item's fade in has completed.
 *
 * @param {Clip} clip
 *        The Clip instance that controlled the fade animation.
 *
 * @fires Gallery#update:complete
 */
/** @ignore */
proto._onItemShowComplete = function (clip) {
	if (clip && clip.target() !== this._currentItem.getElement()) {
		if (!this._currentItem.isFading()) {
			this._currentItem.fadeIn(this._fadeDuration, this._ease, ++this._zIndexCount, this._onItemShowComplete);
		}
		return;
	}

	var item;
	var index = this._items.length;
	while (index--) {
		item = this._items[index];
		if (item !== this._currentItem) {
			item.fadeOut();
		}
	}

	if (this._incomingOutgoingItems) {
		this.trigger(FadeGallery.UPDATE_COMPLETE, this._incomingOutgoingItems);
	}
};

/**
 * @name module:ac-gallery.FadeGallery#_updateItems
 * @function
 * @private
 * @override
 *
 * @param {Object} items
 *        An object containing the incoming and outgoing items.
 *
 * @param {Boolean} silent
 *        When `true` the update:complete event will not be triggered.
 */
/** @ignore */
proto._updateItems = function (items, silent) {
	if (silent) {
		// silent means the current item didn't change
		return;
	}

	if (this._crossFade) {
		var callback = (silent) ? null : this.trigger.bind(this, FadeGallery.UPDATE_COMPLETE, items);
		items.outgoing[0].fadeOut(this._fadeDuration * 0.99, this._ease); // 0.99 to ensure fade out finishes before fade in
		items.incoming[0].fadeIn(this._fadeDuration, this._ease, ++this._zIndexCount, callback);
	} else {
		// store items to be dispatched with update:complete event
		this._incomingOutgoingItems = (silent) ? false : items;

		if (!items.outgoing[0].isFading()) {
			items.incoming[0].fadeIn(this._fadeDuration, this._ease, ++this._zIndexCount, this._onItemShowComplete);
		}
	}

	items.outgoing[0].hide();
	items.incoming[0].show();
};


module.exports = FadeGallery;

// ac-gallery@2.3.0

},{"./../auto/AutoGallery":366,"./FadeItem":370,"@marcom/ac-object/clone":344,"@marcom/ac-object/create":345}],370:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var setStyle = require('@marcom/ac-dom-styles/setStyle');
var create = require('@marcom/ac-object/create');
var fade = require('@marcom/ac-solar/fade');
var fadeIn = require('@marcom/ac-solar/fadeIn');
var fadeOut = require('@marcom/ac-solar/fadeOut');

/** @ignore */
var Item = require('./../Item');


/**
 * @name module:ac-gallery.FadeItem
 * @class
 * @extends Item
 *
 * @param {Element} el
 *        The visual element used by the item.
 *
 * @param {Boolean|String|Number} [option.isACaption]
 *        When this option is set, `role="tabpanel"` is not placed on the `Item` element.
 *        When there is a supplementary captions gallery, it is not appropriate
 *        to have an extra `role="tabpanel"` placed on the `Item` element because it has
 *        no relation to any tabs.
 */
function FadeItem(el, options) {

	// call super constructor
	Item.call(this, el, options);

	setStyle(el, {
		position: 'absolute'
	});
}

/** Events */
FadeItem.SELECTED = Item.SELECTED;
FadeItem.SHOW = Item.SHOW;
FadeItem.HIDE = Item.HIDE;

/** @ignore */
var superProto = Item.prototype;
var proto = FadeItem.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.FadeItem#fadeIn
 * @function
 *
 * @desc Fades the item element in from opacity `0` to `1`.
 *
 * @param {Number} duration
 *        The time in seconds for the fade animation.
 *
 * @param {String} ease
 *        The easing algorithm to use.
 *
 * @param {Number} zIndex
 *        The CSS z-index to set the element to.
 *
 * @param {Function} [callback=null]
 *        A callback function that's trigger when the fade in is complete.
 *
 * @fires Item#show
 */
proto.fadeIn = function (duration, ease, zIndex, callback) {
	if (duration) {
		setStyle(this._el, {
			zIndex: zIndex || 1
		});
		this._destroyCurrentClip();
		this._clip = fade(this._el, 0, 1, duration, {
			ease: ease,
			onComplete: callback
		});
	} else {
		fadeIn(this._el, 0);
		setStyle(this._el, {
			zIndex: zIndex || 1
		});
	}
};

/**
 * @name module:ac-gallery.FadeItem#fadeOut
 * @function
 *
 * @desc Fades the item element out from whatever it's current opacity is to `0`.
 *
 * @param {Number} duration
 *        The time in seconds for the fade animation.
 *
 * @param {String} ease
 *        The easing algorithm to use.
 *
 * @fires Item#hide
 */
proto.fadeOut = function (duration, ease) {
	if (duration) {
		this._destroyCurrentClip();
		this._clip = fadeOut(this._el, duration, {
			ease: ease
		});
	} else {
		fadeOut(this._el, 0);
	}
};

/**
 * @name module:ac-gallery.FadeItem#isFading
 * @function
 *
 * @desc Returns if an item is currently transitioning.
 *
 * @return {Boolean} If the item is currently transitioning.
 */
proto.isFading = function () {
	return !!(this._clip && this._clip.playing());
};

/**
 * @name module:ac-gallery.FadeItem#destroy
 * @function
 * @override
 *
 * @desc Removes any classes or styles from item element and associated triggers.
 *       Unbinds events and nullifies variables. Destroys any instances of Clip.
 */
proto.destroy = function () {
	setStyle(this._el, {
		position: null,
		opacity: null,
		zIndex: null
	});

	superProto.destroy.call(this);

	this._destroyCurrentClip();
	this._clip = null;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.FadeItem#_destroyCurrentClip
 * @function
 * @private
 */
/** @ignore */
proto._destroyCurrentClip = function () {
	if (this.isFading()) {
		this._clip.destroy();
	}
};


module.exports = FadeItem;

// ac-gallery@2.3.0

},{"./../Item":363,"@marcom/ac-dom-styles/setStyle":29,"@marcom/ac-object/create":345,"@marcom/ac-solar/fade":355,"@marcom/ac-solar/fadeIn":356,"@marcom/ac-solar/fadeOut":357}],371:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var create = require('@marcom/ac-object/create');
var extend = require('@marcom/ac-object/extend');


/**
 * @name module:ac-gallery#extendProto
 * @function
 * @static
 *
 * @desc This method is intended to be attached to modules and allows the ability
 *       to easily extend a function and inherit it's properties.
 *
 * @param {Object} proto
 *        An object that contains methods or variable to add to the new function
 *
 * @returns {Function} A new function which inherits the prototype of the
 *          function this method was attached to.
 */
module.exports = function extendProto(proto) {
	var self = this;

	var Child = function () {
		self.apply(this, arguments);
	};

	var childProto = create(this.prototype);
	Child.prototype = extend(childProto, proto);
	extend(Child, this);

	return Child;
};

// ac-gallery@2.3.0

},{"@marcom/ac-object/create":345,"@marcom/ac-object/extend":346}],372:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var getStyle = require('@marcom/ac-dom-styles/getStyle');
var getContentDimensions = require('@marcom/ac-dom-metrics/getContentDimensions');

/**
 * @name module:ac-gallery#getElementFullWidth
 * @function
 *
 * @param {Element} el
 *        The element whose dimentions to query.
 *
 * @returns {Number} The width of the passed element including it's margin left and right.
 */
module.exports = function getElementFullWidth(el) {
	var styles = getStyle(el, 'margin-right', 'margin-left');
	return Math.round(getContentDimensions(el).width) + parseInt(styles.marginRight, 10) + parseInt(styles.marginLeft, 10);
};

// ac-gallery@2.3.0

},{"@marcom/ac-dom-metrics/getContentDimensions":5,"@marcom/ac-dom-styles/getStyle":27}],373:[function(require,module,exports){
/**
 * @copyright 2016 Apple Inc. All rights reserved.
 */
'use strict';

/**
 * @name module:ac-gallery#inputHasFocus
 * @function
 *
 * @returns {Boolean} If the currently focused element is an input, select, or textarea element.
 */
module.exports = function inputHasFocus() {
	var elements = [
		'input',
		'select',
		'textarea'
	];
	return elements.indexOf(document.activeElement.nodeName.toLowerCase()) > -1;
};

// ac-gallery@2.3.0

},{}],374:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_querySelectorAll = require('@marcom/ac-dom-traversal/querySelectorAll');


/**
 * @name module:ac-gallery#selectInIE7
 * @function
 *
 * @desc IE7 (and IE8 in IE7 mode) can't select elements using data attributes.
 *       This code is a bit heavy handed way of getting the elements we need.
 */
/** @ignore */
var selectInIE7 = function (dataAttribute, value) {
	var el;
	var elements = document.getElementsByTagName('*');
	var index = 0;
	var length = elements.length;
	var matches = [];

	for (index; index < length; index++) {
		el = elements[index];
		if (el.getAttribute(dataAttribute) !== null && el.getAttribute(dataAttribute).split(' ').indexOf(value) > -1) {
			matches[matches.length] = el;
		}
	}

	return matches;
};


/**
 * @name module:ac-gallery#selectElementFromDataAttributeValue
 * @function
 * @static
 *
 * @desc Takes a data attribute and a value and finds elements that have that
 *       attribute on them that contains the value. Values can be space seperated.
 *
 * @param {String} dataAttribute
 *        The data attribute string minus square brackets.
 *
 * @param {String} value
 *        The value that the data attribute must contain.
 *
 * @returns {Array} An array of elements.
 */
module.exports = function selectElementFromDataAttributeValue(dataAttribute, value) {

	var elements = ac_querySelectorAll('[' + dataAttribute + '*="' + value + '"]');

	if (elements.length === 0 && document.documentMode === 7) {
		// the above way of selecting elements doesn't work in IE7 (inc IE8 in IE7 mode)
		return selectInIE7(dataAttribute, value);
	}

	var selectedElements = [];
	var index = 0;
	var length = elements.length;
	var values;

	for (index; index < length; index++) {
		values = elements[index].getAttribute(dataAttribute);
		if (values === value) {
			selectedElements.push(elements[index]);
		} else if (values && values.length) {
			values = values.split(' ');

			if (values.indexOf(value) > -1) {
				selectedElements.push(elements[index]);
			}
		}
	}

	return selectedElements;
};

// ac-gallery@2.3.0

},{"@marcom/ac-dom-traversal/querySelectorAll":46}],375:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_querySelectorAll = require('@marcom/ac-dom-traversal/querySelectorAll');
var ancestors = require('@marcom/ac-dom-traversal/ancestors');

/**
 * @name module:ac-gallery#selectInIE7
 * @function
 *
 * @desc IE7 (and IE8 in IE7 mode) can't select elements using data attributes.
 *       This code is a bit heavy handed way of getting the elements we need.
 */
/** @ignore */
var selectInIE7 = function (dataAttribute, context) {
	var el;
	var elements = document.getElementsByTagName('*');
	var index = 0;
	var length = elements.length;
	var matches = [];

	for (index; index < length; index++) {
		el = elements[index];
		if (el.getAttribute(dataAttribute) !== null && (!context || ancestors(el).indexOf(context) > -1)) {
			matches[matches.length] = el;
		}
	}

	return matches;
};


/**
 * @name module:ac-gallery#selectElementThatHasDataAttribute
 * @function
 * @static
 *
 * @desc ac_dom_traversal.querySelectorAll that works with data-attributes in IE7.
 *
 * @param {String} dataAttribute
 *        The data attribute string minus square brackets.
 *
 * @param {String} context
 *        An optional ParentNode to scope the selector to. Defaults to `document.body`.
 *
 * @returns {Array} An array of elements.
 */
module.exports = function selectElementThatHasDataAttribute(dataAttribute, context) {

	context = context || document.body;
	var elements = ac_querySelectorAll('[' + dataAttribute + ']', context);

	if (elements.length === 0 && document.documentMode === 7) {
		// the above way of selecting elements doesn't work in IE7 (inc IE8 in IE7 mode)
		return selectInIE7(dataAttribute, context);
	}

	return elements;
};

// ac-gallery@2.3.0

},{"@marcom/ac-dom-traversal/ancestors":41,"@marcom/ac-dom-traversal/querySelectorAll":46}],376:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_addEventListener = require('@marcom/ac-dom-events/addEventListener');
var ac_removeEventListener = require('@marcom/ac-dom-events/removeEventListener');
var getDimensions = require('@marcom/ac-dom-metrics/getDimensions');
var getPosition = require('@marcom/ac-dom-metrics/getPosition');
var getStyle = require('@marcom/ac-dom-styles/getStyle');
var setStyle = require('@marcom/ac-dom-styles/setStyle');
var ancestors = require('@marcom/ac-dom-traversal/ancestors');
var create = require('@marcom/ac-object/create');
var scrollX = require('@marcom/ac-solar/scrollX');

/** @ignore */
var EventEmitterMicro = require('@marcom/ac-event-emitter-micro').EventEmitterMicro;
var Gallery = require('./../Gallery');

/** @ignore */
var DEFAULT_SLIDE_DURATION = 0.5;


/**
 * @name module:ac-gallery.ToggleNav
 * @class
 * @extends EventEmitterMicro
 *
 * @param {Element} el
 *        The wrapper element for the togglenav. Will contain the `ac-toolkit` "togglenav" class.
 *
 * @param {Gallery} gallery
 *        The gallery that the togglenav is related to.
 */
function ToggleNav(el, gallery, options) {
	options = options || {};

	this._el = el;
	this._isRightToLeft = (options.rightToLeft === undefined) ? getStyle(el, 'direction').direction === 'rtl' : options.rightToLeft;
	this._scrollType = this._scrollDirection();
	this._gallery = gallery;
	this._triggers = {};
	this._ordered = [];
	this._containerEl = this._el.children[0];
	this._slideDuration = (options.duration === undefined) ? DEFAULT_SLIDE_DURATION : options.duration;

	// call super
	EventEmitterMicro.call(this);
}

var superProto = EventEmitterMicro.prototype;
var proto = ToggleNav.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.ToggleNav#start
 * @function
 * @override
 *
 * @desc Binds an event to the gallery update method and sets up the togglenav.
 */
proto.start = function () {
	this._onWindowLoad = this._onWindowLoad.bind(this);
	this._onGalleryUpdated = this._onGalleryUpdated.bind(this);

	this._gallery.on(Gallery.UPDATE, this._onGalleryUpdated);

	this.resize();

	ac_addEventListener(window, 'load', this._onWindowLoad);
};

/**
 * @name module:ac-gallery.ToggleNav#addTrigger
 * @function
 * @override
 *
 * @desc Adds a trigger element to the togglenav.
 *
 * @param {Element} el
 *        The trigger element.
 *
 * @param {Item} item
 *        The item the trigger is related to.
 */
proto.addTrigger = function (el, item) {
	if (this._triggers[item.getElementId()] !== undefined) {
		// we already have a trigger for this item
		return;
	}

	var els = ancestors(el);

	if (els.indexOf(this._el) > -1) {
		var triggerObject = {
			el: el
		};
		this._triggers[item.getElementId()] = triggerObject;
		this._ordered.push(triggerObject);
	}
};

/**
 * @name module:ac-gallery.ToggleNav#resize
 * @function
 * @override
 *
 * @desc Repositions the togglenav to work with the updated window width.
 */
proto.resize = function () {

	if (!this._ordered.length) {
		return;
	}

	setStyle(this._containerEl, {
		paddingLeft: null,
		paddingRight: null
	});

	this._containerWidth = getDimensions(this._containerEl).width;
	this._width = getDimensions(this._el).width;
	this._viewCenter = Math.round(this._width * 0.5);

	var index = this._ordered.length;
	while (index--) {
		this._setTriggerData(this._ordered[index]);
	}

	this._ordered.sort(function (a, b) {
		return a.left - b.left;
	});

	if (this._containerWidth > this._width) {
		var firstItem = this._ordered[0];
		var lastItem = this._ordered[this._ordered.length - 1];

		var paddingLeft = (this._width - firstItem.width) * 0.5;
		var paddingRight = (this._width - lastItem.width) * 0.5;

		setStyle(this._containerEl, {
			paddingLeft: paddingLeft + 'px',
			paddingRight: paddingRight + 'px'
		});

		var trigger = this._triggers[this._gallery.getCurrentItem().getElementId()];
		if (trigger) {
			this._centerNav(trigger);
		}
	}
};

/**
 * @name module:ac-gallery.ToggleNav#destroy
 * @function
 * @override
 *
 * @desc Unbinds events, cleans up the DOM and nullifies variables.
 */
proto.destroy = function () {
	this._gallery.off(Gallery.UPDATE, this._onGalleryUpdated);
	ac_removeEventListener(window, 'load', this._onWindowLoad);

	setStyle(this._containerEl, {
		paddingLeft: null,
		paddingRight: null
	});

	this._el = null;
	this._gallery = null;
	this._triggers = null;
	this._ordered = null;
	this._containerEl = null;

	this._destroyCurrentClip();
	this._clip = null;

	// todo: remove any styles added

	// call / return super.destroy method
	return superProto.destroy.call(this);
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.ToggleNav#_onWindowLoad
 * @function
 * @private
 */
/** @ignore */
proto._onWindowLoad = function () {
	ac_removeEventListener(window, 'load', this._onWindowLoad);
	this.resize();
};

/**
 * @name module:ac-gallery.ToggleNav#_setTriggerData
 * @function
 * @private
 *
 * @param {Object} trigger
 *        The trigger object who's data should be set.
 */
/** @ignore */
proto._setTriggerData = function (trigger) {
	trigger.width = getDimensions(trigger.el).width;
	var position = getPosition(trigger.el);
	trigger.left = position.left;
	trigger.right = position.right;
	trigger.center = trigger.left + (trigger.width * 0.5);
};

/**
 * @name module:ac-gallery.ToggleNav#_centerNav
 * @function
 * @private
 *
 * @param {Object} trigger
 *        The trigger object to get scroll / positional info from.
 *
 * @param {Number} duration
 *        The time in seconds of the scroll transition.
 */
/** @ignore */
proto._centerNav = function (trigger, duration) {
	// todo: the below 3 lines are for when widths change which could be caused
	// by fonts loading etc. Investigate a better way to set this up as seems
	// we're going a lot of repeated work here
	this._setTriggerData(trigger);
	this._width = getDimensions(this._el).width;
	this._viewCenter = Math.round(this._width * 0.5);

	var xp = Math.round(trigger.center - this._viewCenter);

	// RTL horizonal scroll is not standardized
	if (this._isRightToLeft) {

		// absolute value for reverse and default
		if (this._scrollType !== 'negative') {
			xp = Math.abs(xp);
		}

		if (this._scrollType === 'default') {
			// since content is aligned right and overflows left,
			// xp must be updated to account for overflow width
			xp = this._el.scrollWidth - this._el.clientWidth - xp;
		}
	}

	this._destroyCurrentClip();

	if (duration) {
		this._clip = scrollX(this._el, xp, duration);
	} else {
		this._el.scrollLeft = xp;
	}
};

/**
 * @name module:ac-gallery.ToggleNav#_onGalleryUpdated
 * @function
 * @private
 *
 * @param {Object} items
 *        An object containing the incoming and outgoing items.
 */
/** @ignore */
proto._onGalleryUpdated = function (items) {
	var trigger = this._triggers[items.incoming[0].getElementId()];
	if (trigger) {
		this._centerNav(trigger, this._slideDuration);
	}
};

/**
 * @name module:ac-gallery.ToggleNav#_destroyCurrentClip
 * @function
 * @private
 */
/** @ignore */
proto._destroyCurrentClip = function () {
	if (this._clip && this._clip.playing()) {
		this._clip.destroy();
	}
};

/**
 * @name module:ac-gallery.ToggleNav#_scrollDirection
 * @function
 * @private
 */
/** @ignore */
proto._scrollDirection = function () {
	var scrollType = 'reverse';
	var scrollTest = document.createElement('div');
	scrollTest.style.cssText = 'width:2px; height:1px; position:absolute; top:-1000px; overflow:scroll; font-size: 14px;';
	scrollTest.style.direction = 'rtl';
	scrollTest.innerHTML = 'test';
	document.body.appendChild(scrollTest);

	if (scrollTest.scrollLeft > 0) {
		scrollType = 'default';
	} else {
		scrollTest.scrollLeft = 1;
		if (scrollTest.scrollLeft === 0) {
			scrollType = 'negative'
		}
	}

	document.body.removeChild(scrollTest);
	return scrollType;
};


module.exports = ToggleNav;

// ac-gallery@2.3.0

},{"./../Gallery":362,"@marcom/ac-dom-events/addEventListener":307,"@marcom/ac-dom-events/removeEventListener":316,"@marcom/ac-dom-metrics/getDimensions":6,"@marcom/ac-dom-metrics/getPosition":10,"@marcom/ac-dom-styles/getStyle":27,"@marcom/ac-dom-styles/setStyle":29,"@marcom/ac-dom-traversal/ancestors":41,"@marcom/ac-event-emitter-micro":324,"@marcom/ac-object/create":345,"@marcom/ac-solar/scrollX":361}],377:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var AnalyticsManager = require('./../analytics/AnalyticsManager');

/**
 * @name analyticsManager
 * @singleton
 */
module.exports = new AnalyticsManager();

// ac-gallery@2.3.0

},{"./../analytics/AnalyticsManager":365}],378:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var focusableElements = [
	'input',
	'select',
	'textarea',
	'button',
	'object'
];

var focusableAttribute = [
	'href',
	'tabindex',
	'contenteditable'
];

/**
 * @name module:TabManager
 * @singleton
 *
 */
var TabManager = function() {
	this.focusableSelectors = focusableElements.concat(
		focusableAttribute.map(function(attribute) {
			return (attribute === 'href')?'a['+attribute+']':'*['+attribute+']';
		})
	).join(',');
};

var proto = TabManager.prototype;

/**
 * @name module:TabManager#focusable
 * @function
 *
 * @param {Element} element
 *        The element to check if it's focusable.
 * @param {Number} tabIndex
 *        The given element's tabIndex.
 *
 * @returns {Boolean} if the given element is focusable.
 */
proto.isFocusable = function (element, tabIndex) {

	var nodeName = element.nodeName.toLowerCase();
	var	isFocusableElement = focusableElements.indexOf(nodeName) > -1;

	if(nodeName === 'a') {
		return true;
	}

	if(isFocusableElement) {
		return !element.disabled;
	}

	if(!element.contentEditable) {
		return true;
	}

	tabIndex = tabIndex || element.tabIndex;
	return isNaN(tabIndex);
};

/**
 * @name module:TabManager#tabbable
 * @function
 *
 * @param {Element} element
 *        The element to check if it's tabbable.
 *
 * @returns {Element} if the given element is tabbable.
 */
proto.isTabbable = function (element) {
	var tabIndex =  element.getAttribute('tabindex');

	if(!isNaN(tabIndex)) {
			return (tabIndex >= 0);
	} else {
		return this.isFocusable(element, tabIndex);
	}
};
/**
 * @name module:TabManager#getTabbable
 * @function
 *
 * @param {Object} focusableElements
 *        Array like Object with elements to be checked if there are tabbable elements.
 *
 * @returns {Array} tabbable elements.
 */
proto.getTabbable = function(focusableElements) {
	var l = focusableElements.length;
	var tabbableElements = [];
	for (var i = 0; i < l; i++) {
		if(this.isTabbable(focusableElements[i])) {
			tabbableElements.push(focusableElements[i]);
		}
	}

	return tabbableElements;
};

module.exports = new TabManager();

// ac-gallery@2.3.0

},{}],379:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_classList = require('@marcom/ac-classlist');
var ac_dom_styles = require('@marcom/ac-dom-styles');
var ac_querySelectorAll = require('@marcom/ac-dom-traversal/querySelectorAll');
var clone = require('@marcom/ac-object/clone');
var create = require('@marcom/ac-object/create');
var getElementFullWidth = require('./../helpers/getElementFullWidth');
var moveX = require('@marcom/ac-solar/moveX');
var selectElementFromDataAttributeValue = require('./../helpers/selectElementFromDataAttributeValue');
var selectElementThatHasDataAttribute = require('./../helpers/selectElementThatHasDataAttribute');

/** @ignore */
var AutoGallery = require('./../auto/AutoGallery');
var PointerTracker = require('@marcom/ac-pointer-tracker').PointerTracker;
var SlideItem = require('./SlideItem');
var SlideItemWrapper = require('./SlideItemWrapper');

/** @ignore */
var DEFAULT_ITEM_CENTER_POINT = 0.5;
var DEFAULT_SLIDE_DURATION = 0.5;
var DEFAULT_EDGE_PULL_RESISTANCE = true;

/**
 * @name module:ac-gallery.SlideGallery
 * @class
 * @extends AutoGallery
 *
 * @param {Element} el
 *        The container `Element` that wraps the gallery.
 *
 * @param {Function} [options.itemType=SlideItem]
 *        The Item type for this gallery. The gallery will find it's elements and
 *        instantiate new Item objects using this type.
 *
 * @param {Boolean} [options.updateOnWindowResize=true]
 *        By default a gallery listens to the window for a resize event and calls
 *        a `resize` method on itself. Some users won't want this as they'll want
 *        control over window resize listeners. In order to stop gallery from
 *        listening to the window set this option to false.
 *
 * @param {Boolean} [options.wrapAround=false]
 *        When `true` calling `showNext` when on last item will move to first item and
 *        calling `showPrevious` on first item will move to last. Essentially this
 *        makes the gallery loop for infinity.
 *
 * @param {Boolean} [options.enableArrowKeys=true]
 *        When `true` a listening will be added to the arrow keys that triggers
 *        the `showNext` and `showPrevious` methods.
 *
 * @param {Boolean|Number} [options.autoPlay=false]
 *        When `true` the gallery will autoplay using the default autoplay delay until
 *        a user interacts with the gallery. When set as a `Number` the gallery will
 *        autoplay using the number as the delay in seconds. Use in conjunction with
 *        the `container` option so that `autoPlay` will stop with the user gains focus
 *        on the gallery and its elements.
 *
 * @param {String} [options.container=undefined]
 *        The ID string of the container element. Use in conjunction with the `autoPlay` option.
 *        The gallery and any of its related elements (tabnav, dotnav, paddlenav, captions)
 *        should live in a container element, so that `autoPlay` will stop when the user gains
 *        focus on the gallery and any of its related elements.
 *
 * @param {Boolean} [options.touch=true]
 *        Enables touch screen interactions.
 *
 * @param {Boolean} [options.desktopSwipe=false]
 *        Basically touch like behaviour for desktop but with click and drag.
 *
 * @param {Boolean|String} [option.addPaddleNav=false]
 *        When `true` will add the default html for paddle navs (see templates/paddlenav.js).
 *        If a string, that string will be used as html for paddle nav.
 *
 * @param {Number} [options.duration=0.5]
 *        The duration (in seconds) of the slide transition.
 *
 * @param {String} [options.ease=null]
 *        The easing algorithm to use for slide transition. Defaults to the default
 *        `ac-eclipse` easing algorithm.
 *
 * @param {Number} [options.toggleNavDuration=options.duration]
 *        If the gallery has a togglenav, this will determine the slide transition duration
 *        when the nav is wider than the window width.
 *
 * @param {Number} [options.itemCenterPoint=0.5]
 *        Alignment of items, 0 is beginning (left) of container, 1 is end (right).
 *
 * @param {Number} [options.itemsPerSlide=1]
 *        How many items to show per slide.
 *
 * @param {Boolean} [options.edgePullResistance] In a slide gallery that doesn't
 *        wrap around,resistance is applied when a user drags from the left or right
 *        bounds of a gallery. This creates a rubberbanding effect like UIScrollView in iOS
 *
 * @param {Number} [options.startAt=undefined]
 *        By default, this option is not set so that the gallery defaults to start at the first item.
 *        Otherwise, the gallery starts at the item with the provided index, if that item exists exists.
 */
function SlideGallery(el, options) {
	options = clone(options) || {};

	options.itemType = options.itemType || SlideItem;
	this._itemsPerSlide = options.itemsPerSlide || 1;

	var deeplink = options.deeplink !== false;
	options.deeplink = false;

	this._slideDuration = (options.duration !== undefined) ? options.duration : DEFAULT_SLIDE_DURATION;
	options.toggleNavDuration = (options.toggleNavDuration === undefined) ? this._slideDuration : options.toggleNavDuration;
	this._itemCenterPoint = (options.itemCenterPoint !== undefined) ? options.itemCenterPoint : DEFAULT_ITEM_CENTER_POINT;
	this._edgePullResistance = (options.edgePullResistance ? options.edgePullResistance : DEFAULT_EDGE_PULL_RESISTANCE);
	this._slideOptions = {
		ease: options.ease
	};

	if (options.resizeContainerOnUpdate === true) { // need === true because we don't want to do this when it's a number
		options.resizeContainerOnUpdate = this._slideDuration;
	}

	options.touch = options.touch !== false;

	this._originalWrapAround = options.wrapAround || false;

	// call super constructor
	AutoGallery.call(this, el, options);

	if (deeplink) {
		var item = this._getDeeplinkedItem();
		if (item) {
			if (this._currentItem !== item) {
				this._currentItem.hide();
				this._setCurrentItem(item);
				this._currentItem.show();
			}
		}
	}

	// bind
	this._positionItems = this._positionItems.bind(this);

	this._createContainer();

	if (this._items.length !== 0) {
		this._positionItems();
	}

	this._isInstantiated = true;
}

/** Events */
SlideGallery.RESIZED = AutoGallery.RESIZED;
SlideGallery.UPDATE = AutoGallery.UPDATE;
SlideGallery.UPDATE_COMPLETE = AutoGallery.UPDATE_COMPLETE;

var superProto = AutoGallery.prototype;
var proto = SlideGallery.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.SlideGallery#addItem
 * @function
 * @override
 *
 * @desc Adds an item to the gallery.
 *
 * @param {Item|Element} item
 *        Can be an object that is or extends the `Item` type. If is an `Item` it must match the `itemType`
 *        set at gallery instantiation. Alternatively, can be an Element and Gallery will instantiate a new `Item`.
 *        The type of item can be set in instantiation options (options.itemType).
 *
 * @param {Number} [index]
 *        Allows you to specify where the item is added to the items array. By default
 *        the item will be added to the end of the items array.
 *
 * @returns {Item} The added item instance.
 */
proto.addItem = function (item, index) {
	if (item.nodeType) {
		item = new this._itemType(item);
	}
	var returnValue = superProto.addItem.call(this, item, index);

	if (this._containerEl !== undefined) {
		this._addItemToContainer(item);
		this._positionItems();
	}

	this._updateWrapAround();

	return returnValue;
};

/**
 * @name module:ac-gallery.SlideGallery#removeItem
 * @function
 * @override
 *
 * @desc Removes an item from the gallery.
 *
 * @param {Item} item
 *        The item that should be removed.
 *
 * @param {Boolean} [options.destroyItem=false]
 *        When true, the removed item will have it's destroy method called.
 *
 * @param {Boolean} [options.setCurrentItem=undefined]
 *        When false, if the removed item is the current item, we won't call
 *        update passing the first item to reset the currentItem. This is
 *        really only intended to be used in `this.destroy()`.
 *
 * @returns {Item} The removed item.
 */
proto.removeItem = function (item, options) {
	if (this._containerEl && item.getElement().parentElement === this._containerEl) {
		var parentElement = item.getOriginalParentElement();
		if (parentElement) {
			parentElement.appendChild(item.getElement());
		} else if (typeof item.removeItems === 'function') {
			item.removeItems();
			options.destroyItem = true;
		}

		var returnValue = superProto.removeItem.call(this, item, options);
		if (this._currentItem) {
			this._positionItems(this._currentItem);
		}

		this._updateWrapAround();

		return returnValue;
	}

	return superProto.removeItem.call(this, item, options);
};

/**
 * @name module:ac-gallery.SlideGallery#resize
 * @function
 * @override
 *
 * @desc Resets any styles or elements that need to be adjusted in case of a height change.
 *
 * @fires SlideGallery#resized
 */
proto.resize = function () {
	this._positionItems();
	this._snapToPosition(this._currentItem.position());

	// call / return super.resize method
	return superProto.resize.call(this);
};

/**
 * @name module:ac-gallery.SlideGallery#destroy
 * @function
 * @override
 *
 * @desc Destroys a gallery, removes it's items and sets props to null.
 *       Also, unbinds event listeners on keyboard (if enableArrowKeys
 *       option was `true`) and paddle nav (if exists).
 *
 * @param {Boolean} [options.destroyItems=true]
 *        When `true` the gallery will call the `destroy` method of all it's
 *        items as it removes them.
 */
proto.destroy = function (options) {
	this._destroyCurrentClip();
	this._clip = null;

	var index = this._items.length;
	while (index--) {
		this._items[index].off(SlideItem.CENTER_POINT_CHANGED, this._positionItems);
	}

	if (this._touchSwipe) {
		this._touchSwipe.off(PointerTracker.START, this._onSwipeStart);
		this._touchSwipe.off(PointerTracker.UPDATE, this._onSwipeUpdate);
	}

	if (this._clickSwipe) {
		this._clickSwipe.off(PointerTracker.START, this._onSwipeStart);
		this._clickSwipe.off(PointerTracker.UPDATE, this._onSwipeUpdate);
	}

	var el = this._el;

	// call / return super.destroy method
	var returnValue = superProto.destroy.call(this, options);

	el.removeChild(this._containerEl);

	this._containerEl = null;
	this._slideDuration = null;
	this._itemCenterPoint = null;
	this._positionItems = null;
	this._slideOptions = null;

	// return super.destroy method
	return returnValue;
};


////////////////////////////////////////
/////////  PRIVATE METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.SlideGallery#_addItems
 * @function
 * @override
 * @private
 *
 * @desc Selects items within the gallery wrapper element, loops through them
 *       and calls `_addItem` passing the element.
 *
 * @param {String} itemSelector
 *        The selector for getting dom elements to use with gallery Items.
 */
/** @ignore */
proto._addItems = function (itemSelector) {
	if (this._itemsPerSlide > 1) {
		var items;
		var isDataAttribute = /(^\[).*(\]$)/.test(itemSelector);
		if (isDataAttribute) {
			// this can be deleted once support for ie7 is dropped
			items = selectElementThatHasDataAttribute(itemSelector.replace(/\[|\]/g, ''), this._el);
		} else {
			items = ac_querySelectorAll(itemSelector, this._el);
		}

		var itemWrapper;
		var triggers;
		var elementId;
		var count = 0;
		var index = 0;
		var length = items.length;

		for (index; index < length; index++) {
			if (count === 0) {
				itemWrapper = new SlideItemWrapper();
			}

			itemWrapper.addItem(items[index]);
			elementId = items[index].getAttribute('id');

			if (elementId) {
				triggers = selectElementFromDataAttributeValue('data-ac-gallery-trigger', elementId);
				this._addItemTriggers(itemWrapper, triggers);
			}

			if (++count === this._itemsPerSlide || index === length - 1) {
				count = 0;
				itemWrapper.resize();
				this.addItem(itemWrapper);
			}
		}
	} else {
		superProto._addItems.call(this, itemSelector);
	}
};

/**
 * @name module:ac-gallery.SlideGallery#_createContainer
 * @function
 * @private
 */
/** @ignore */
proto._createContainer = function () {
	this._containerEl = document.createElement('div');
	ac_classList.add(this._containerEl, 'ac-gallery-slidecontainer');

	ac_dom_styles.setStyle(this._containerEl, {
		position: 'absolute',
		left: '0',
		top: '0',
		width: '100%',
		height: '100%'
	});

	this._el.appendChild(this._containerEl);

	var index = 0;
	var length = this._items.length;
	for (index; index < length; index++) {
		this._addItemToContainer(this._items[index]);
	}
};

/**
 * @name module:ac-gallery.SlideGallery#_addItemToContainer
 * @function
 * @private
 *
 * @param {Item} item
 *        The item whose element will be added to the container element.
 */
/** @ignore */
proto._addItemToContainer = function (item) {
	this._containerEl.appendChild(item.getElement());

	// if an items center point changes we need to reposition stuff
	item.on(SlideItem.CENTER_POINT_CHANGED, this._positionItems);
};

/**
 * @name module:ac-gallery.SlideGallery#_positionItems
 * @function
 * @private
 *
 * @param {Item} itemToSnapTo
 *        The item whose position to snap to.
 */
/** @ignore */
proto._positionItems = function (itemToSnapTo) {

	itemToSnapTo = itemToSnapTo || this._currentItem;
	var items = this._items;
	if (this._wrapAround) {
		items = this._shuffleItems();
	}

	var diff = (this._getActualPositionX() - itemToSnapTo.position()) || 0; // difference between current x and slide to x
	var containerWidth = parseInt(ac_dom_styles.getStyle(this._el, 'width').width, 10);
	var xPosition = 0;
	var index = 0;
	var length = items.length;
	var item;
	var el;
	var width;
	var offset;
	var centerPoint;

	for (index; index < length; index++) {

		item = items[index];
		item.resize();
		el = item.getElement();

		ac_dom_styles.setStyle(el, {
			left: xPosition + 'px'
		});

		width = getElementFullWidth(el);
		offset = containerWidth - width;
		centerPoint = (item.centerPoint && item.centerPoint() !== null) ? item.centerPoint() : this._itemCenterPoint;

		item.position((xPosition * -1) + (offset * centerPoint));

		if (this._isRightToLeft) {
			xPosition -= width;
		} else {
			xPosition += width;
		}
	}

	xPosition = itemToSnapTo.position() + diff;
	this._snapToPosition(xPosition);
};

/**
 * @name module:ac-gallery.SlideGallery#_getActualPositionX
 * @function
 * @private
 *
 * @returns {Number} The transform.translateX position of the container element.
 */
/** @ignore */
proto._getActualPositionX = function () {
	var transformStyles = ac_dom_styles.getStyle(this._containerEl, 'transform').transform;
	if (!transformStyles || transformStyles === 'none') {
		// older browsers that don't support transform
		var left = ac_dom_styles.getStyle(this._containerEl, 'left').left;
		return parseInt(left, 10);
	} else if (transformStyles === this._transformStyles && this._actualPositionX !== undefined) {
		return this._actualPositionX;
	}

	this._transformStyles = transformStyles;
	// todo: figure out an elegant way to do this
	var spiltMatrix = this._transformStyles.split(',');
	this._actualPositionX = spiltMatrix[4] || this._currentItem.position();
	return this._actualPositionX * 1; // multiple makes it a number
};

/**
 * @name module:ac-gallery.SlideGallery#_snapToPosition
 * @function
 * @private
 *
 * @param {Number} positionX
 *        The value to set the container element's translateX to.
 */
/** @ignore */
proto._snapToPosition = function (positionX) {
	this._destroyCurrentClip();
	this._positionX = positionX;
	ac_dom_styles.setStyle(this._containerEl, {
		transition: 'transform 0s, left 0s'
	});
	moveX(this._containerEl, positionX, 0, this._slideOptions);
};

/**
 * @name module:ac-gallery.SlideGallery#_slideToPosition
 * @function
 * @private
 *
 * @param {Number} positionX
 *        The value to set the container element's translateX to.
 *
 * @param {Number} duration
 *        The duration of the transition in seconds.
 *
 * @param {Function} callback
 *        The function to call when the slide animation is complete.
 */
/** @ignore */
proto._slideToPosition = function (positionX, duration, callback) {
	this._positionX = positionX;
	this._clip = moveX(this._containerEl, positionX, duration, {
		ease: this._slideOptions.ease,
		onComplete: callback
	});
};

/**
 * @name module:ac-gallery.SlideGallery#_setUpSwiping
 * @function
 * @private
 * @override
 *
 * @param {Boolean} forTouch
 *        When true listeners will be added for touch events.
 *
 * @param {Boolean} forClick
 *        Basically touch like behaviour for desktop but with click and drag.
 */
/** @ignore */
proto._setUpSwiping = function (forTouch, forClick) {
	// call / return super._setUpSwiping method
	var returnValue = superProto._setUpSwiping.call(this, forTouch, forClick);

	this._onSwipeStart = this._onSwipeStart.bind(this);
	this._onSwipeUpdate = this._onSwipeUpdate.bind(this);

	if (this._touchSwipe) {
		this._touchSwipe.on(PointerTracker.START, this._onSwipeStart);
		this._touchSwipe.on(PointerTracker.UPDATE, this._onSwipeUpdate);
	}

	if (this._clickSwipe) {
		this._clickSwipe.on(PointerTracker.START, this._onSwipeStart);
		this._clickSwipe.on(PointerTracker.UPDATE, this._onSwipeUpdate);
	}

	return returnValue;
};

/**
 * @name module:ac-gallery.SlideGallery#_onSwipeStart
 * @function
 * @private
 *
 * @param {Number} evt.diffX
 *        The difference between the current mouse/touch x position and the last.
 *
 * @param {Event} evt.interactionEvent
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onSwipeStart = function (evt) {
	if (this._clip && this._clip.playing()) {
		this._destroyCurrentClip();
		this._positionX = this._getActualPositionX();
	}
};

/**
 * @name module:ac-gallery.SlideGallery#_onSwipeUpdate
 * @function
 * @private
 *
 * @param {Number} evt.diffX
 *        The difference between the current mouse/touch x position and the last.
 *
 * @param {Event} evt.interactionEvent
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onSwipeUpdate = function (evt) {
	this._destroyCurrentClip();

	var lastSlidePosition = this.getItems().slice(-1)[0].position();
	var isOverscrolled = this._positionX > 0 || this._positionX < lastSlidePosition;
	var diffX = evt.diffX;

	if (this._edgePullResistance && !this._wrapAround && isOverscrolled) {
		diffX *= 0.5;
	}

	this._snapToPosition(this._positionX - diffX);
};

/**
 * @name module:ac-gallery.AutoGallery#_onSwipeEnd
 * @function
 * @private
 * @override
 *
 * @param {Number} evt.diffX
 *        The difference between the current mouse/touch x position and the last.
 *
 * @param {Event} evt.interactionEvent
 *        MouseEvent or TouchEvent.
 */
/** @ignore */
proto._onSwipeEnd = function (evt) {
	var item = superProto._onSwipeEnd.call(this, evt);
	if (item === null) {
		// if no swipe event because user didn't swipe enough
		// we want to reset as we move on swipe update
		item = this.show(this._currentItem, {
			interactionEvent: evt.interactionEvent
		});
	}
	return item;
};

/**
 * @name module:ac-gallery.SlideGallery#_shuffleItems
 * @function
 * @private
 *
 * @desc Returns a new Array that reflects the items array but with the current item as the
 *       middle item in the array. This method is used to position items in a wrapAround
 *       slide gallery - whereby the carousel infinitely scrolls.
 *
 * @returns {Array} An array of items where the middle item in the array is the current item.
 */
/** @ignore */
proto._shuffleItems = function () {
	// Fix for 2 item wrap around galleries when position items is triggered by interaction not autoplay
	//   * Auto play should always animate 'from the reading order' (generally right to left)
	//   * But triggered selections to go in the direction of that item
	var twoItemGalleryIsEngaged = this._items.length === 2 && !this._isAutoPlaying;
	if (twoItemGalleryIsEngaged) {
		return this._items.slice(); // return version of items array in original order
	}

	var totalItems = this._items.length;
	var currentIndex = this._items.indexOf(this._currentItem);
	var middleIndex = Math.floor(totalItems * 0.5);
	var itemsToSlice;
	var removedItems;
	var remainingItems;

	if (currentIndex < middleIndex) {
		// remove items from the end of the array and stick them at the start
		itemsToSlice = middleIndex - currentIndex;
		var sliceIndex = totalItems - itemsToSlice;
		removedItems = this._items.slice(sliceIndex);
		remainingItems = this._items.slice(0, sliceIndex);
		return removedItems.concat(remainingItems);
	} else if (currentIndex > middleIndex) {
		// remove items from the start of the array and stick them at the end
		itemsToSlice = currentIndex - middleIndex;
		removedItems = this._items.slice(0, itemsToSlice);
		remainingItems = this._items.slice(itemsToSlice);
		return remainingItems.concat(removedItems);
	}

	return this._items;
};

/**
 * @name module:ac-gallery.SlideGallery#_updateItems
 * @function
 * @private
 * @override
 *
 * @param {Object} items
 *        An object containing the incoming and outgoing items.
 *
 * @param {Boolean} silent
 *        When `true` the update:complete event will not be triggered.
 *
 * @fires Gallery#update:complete
 */
/** @ignore */
proto._updateItems = function (items, silent) {
	this._destroyCurrentClip();

	if (this._wrapAround) {
		this._positionItems(items.outgoing[0]);
	}

	if (this.getItemIndex(items.outgoing[0]) > -1) {
		var callback = (silent) ? null : this.trigger.bind(this, SlideGallery.UPDATE_COMPLETE, items);

		// the below code is for shortening the slide duration when the distance to travel is shorter
		// e.g. when a user goes next / previous really fast
		// todo: decide if we want to do the below?
		// var incomingX = items.incoming[0].position();
		// var p = (incomingX - this._getActualPositionX()) / (incomingX - items.outgoing[0].position());
		// var duration = Math.min(1, p) * this._slideDuration;
		// duration = Math.max(duration, this._slideDuration * 0.15);
		var duration = this._slideDuration;

		this._slideToPosition(items.incoming[0].position(), duration, callback);

		if (items.incoming[0] !== items.outgoing[0]) {
			items.incoming[0].show();
			items.outgoing[0].hide();
		}
	} else {
		this._slideToPosition(this._currentItem.position(), this._slideDuration);

		items.incoming[0].show();

		if (!silent) {
			/**
			 * Update complete event.
			 * @event Gallery#update:complete
			 */
			this.trigger(SlideGallery.UPDATE_COMPLETE, items);
		}
	}
};

/**
 * @name module:ac-gallery.SlideGallery#_updateWrapAround
 * @function
 * @private
 *
 * @desc Updates the `wrapAround` value depending on the number of items.
 *       For 2 items or less, `wrapAround` is disabled.
 */
proto._updateWrapAround = function() {
	if (this._items.length <= 2) {
		this._wrapAround = false;
	} else if (this._originalWrapAround) {
		this._wrapAround = this._originalWrapAround;
	}

	if (this._isInstantiated && (this._previousButtons || this._nextButtons)) {
		this._updatePaddleNavState();
	}
};

/**
 * @name module:ac-gallery.SlideGallery#_destroyCurrentClip
 * @function
 * @private
 */
/** @ignore */
proto._destroyCurrentClip = function () {
	if (this._clip && this._clip.playing()) {
		this._clip.destroy();
	}
};


module.exports = SlideGallery;

// ac-gallery@2.3.0

},{"./../auto/AutoGallery":366,"./../helpers/getElementFullWidth":372,"./../helpers/selectElementFromDataAttributeValue":374,"./../helpers/selectElementThatHasDataAttribute":375,"./SlideItem":380,"./SlideItemWrapper":381,"@marcom/ac-classlist":304,"@marcom/ac-dom-styles":26,"@marcom/ac-dom-traversal/querySelectorAll":46,"@marcom/ac-object/clone":344,"@marcom/ac-object/create":345,"@marcom/ac-pointer-tracker":353,"@marcom/ac-solar/moveX":359}],380:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var setStyle = require('@marcom/ac-dom-styles/setStyle');
var create = require('@marcom/ac-object/create');

/** @ignore */
var Item = require('./../Item');


/**
 * @name module:ac-gallery.SlideItem
 * @class
 * @extends Item
 *
 * @param {Element} el
 *        The visual element used by the item.
 *
 * @param {Boolean|String|Number} [option.isACaption]
 *        When this option is set, `role="tabpanel"` is not placed on the `Item` element.
 *        When there is a supplementary captions gallery, it is not appropriate
 *        to have an extra `role="tabpanel"` placed on the `Item` element because it has
 *        no relation to any tabs.
 */
function SlideItem(el, options) {

	// call super constructor
	Item.call(this, el, options);

	setStyle(el, {
		position: 'absolute',
		transform: {
			translateZ: 0
		}
	});

	this._parentElement = el.parentElement;
}

/** Events */
SlideItem.CENTER_POINT_CHANGED = 'centerpointchanged';
SlideItem.SELECTED = Item.SELECTED;
SlideItem.SHOW = Item.SHOW;
SlideItem.HIDE = Item.HIDE;

/** @ignore */
var superProto = Item.prototype;
var proto = SlideItem.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.SlideItem#position
 * @function
 *
 * @desc Used to store the visual position of the item in the slide container.
 *
 * @param {Number} [pos=undefined]
 *        The visual position value.
 *
 * @returns {Number} Returns the stored positon.
 */
proto.position = function (pos) {
	if (pos !== undefined) {
		this._position = pos;
	}
	return this._position || 0;
};

/**
 * @name module:ac-gallery.SlideItem#centerPoint
 * @function
 *
 * @desc A slide item is centered in it's container. This method can be used to
 *       have an item off center. For example, setting the centerPoint to `0` will
 *       make it left aligned, `1` will be right aligned.
 *
 * @param {Number} [point=undefined]
 *        The centerPoint value.
 *
 * @returns {Number} Returns the stored centerPoint value.
 */
proto.centerPoint = function (point) {
	if (point !== undefined) {
		this._centerPoint = point;
		this.trigger(SlideItem.CENTER_POINT_CHANGED);
	}
	return (this._centerPoint !== undefined) ? this._centerPoint : null;
};

/**
 * @name module:ac-gallery.SlideItem#getOriginalParentElement
 * @function
 *
 * @desc Returns the original parent of the SlideItem's element. This is required
 *       as a SlideGallery will move an item's element into a slide container.
 *
 * @returns {Element} The original parent of the SlideItem's element.
 */
proto.getOriginalParentElement = function () {
	return this._parentElement;
};

/**
 * @name module:ac-gallery.SlideItem#resize
 * @function
 *
 * @desc Stubbed out function for doing resize calcs in SlideItemWrapper.
 */
proto.resize = function () {
	//
};

/**
 * @name module:ac-gallery.SlideItem#destroy
 * @function
 * @override
 *
 * @desc Removes any classes or styles from item element and associated triggers.
 *       Unbinds events and nullifies variables.
 */
proto.destroy = function () {
	setStyle(this._el, {
		position: null,
		left: null,
		transform: null
	});

	superProto.destroy.call(this);
};


module.exports = SlideItem;

// ac-gallery@2.3.0

},{"./../Item":363,"@marcom/ac-dom-styles/setStyle":29,"@marcom/ac-object/create":345}],381:[function(require,module,exports){
/**
 * @copyright 2016 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var ac_classlist = require('@marcom/ac-classlist');
var setStyle = require('@marcom/ac-dom-styles/setStyle');
var ac_querySelectorAll = require('@marcom/ac-dom-traversal/querySelectorAll');
var create = require('@marcom/ac-object/create');
var tabManager = require('./../singletons/tabManager');
var getElementFullWidth = require('./../helpers/getElementFullWidth');

/** @ignore */
var SlideItem = require('./SlideItem');

/** @ignore */
var CSS_CLASSNAME = 'ac-gallery-slideitemwrapper';


/**
 * @name module:ac-gallery.SlideItemWrapper
 * @class
 */
function SlideItemWrapper() {
	// call super constructor
	SlideItem.call(this, document.createElement('div'));

	this._items = [];
	this._currentWidth = 0;
	ac_classlist.add(this._el, CSS_CLASSNAME);
}

/** @ignore */
var superProto = SlideItem.prototype;
var proto = SlideItemWrapper.prototype = create(superProto);


////////////////////////////////////////
//////////  PUBLIC METHODS   ///////////
////////////////////////////////////////

/**
 * @name module:ac-gallery.SlideItemWrapper#addItem
 * @function
 *
 * @desc Remove all item elements and return them to their original parent.
 *
 * @param {Element} el
 *        Item element to move inside the wrapper element.
 */
proto.addItem = function (el) {
	this._items.push({
		el: el,
		parentElement: el.parentElement
	});

	this._el.appendChild(el);

	var elId = el.getAttribute('id');
	if (elId) {
		var id = this._el.getAttribute('id') || '';
		var seperator = (id.length) ? '-' : '';
		id += seperator + elId;
		this._el.setAttribute('id', id);
	}
	
	this._focusableEls = this._focusableEls.concat(ac_querySelectorAll(tabManager.focusableSelectors, el));
};

/**
 * @name module:ac-gallery.SlideItemWrapper#removeItems
 * @function
 *
 * @desc Remove all item elements and return them to their original parent.
 */
proto.removeItems = function () {
	var el;
	var parentElement;
	var index = 0;
	var length = this._items.length;

	for (index; index < length; index++) {
		el = this._items[index].el;
		setStyle(el, {
			position: null,
			left: null
		});
		parentElement = this._items[index].parentElement;
		if (parentElement) {
			parentElement.appendChild(el);
		}
	}
};

/**
 * @name module:ac-gallery.SlideItemWrapper#resize
 * @function
 * @override
 *
 * @desc Reposition item elements.
 */
proto.resize = function () {
	this._currentWidth = 0;
	var el;
	var index = 0;
	var length = this._items.length;

	for (index; index < length; index++) {
		el = this._items[index].el;
		setStyle(el, {
			position: 'absolute',
			left: this._currentWidth + 'px'
		});

		this._currentWidth += getElementFullWidth(el);
	}

	setStyle(this._el, {
		width: this._currentWidth + 'px'
	});
};

/**
 * @name module:ac-gallery.SlideItemWrapper#destroy
 * @function
 * @override
 *
 * @desc Removes any classes or styles from item element and associated triggers.
 *       Unbinds events and nullifies variables.
 */
proto.destroy = function () {
	this.removeItems();
	this._items = null;
	this._currentWidth = null;

	var parentElement = this._el.parentElement;
	if (parentElement) {
		parentElement.removeChild(this._el);
	}

	superProto.destroy.call(this);
};


module.exports = SlideItemWrapper;

// ac-gallery@2.3.0

},{"./../helpers/getElementFullWidth":372,"./../singletons/tabManager":378,"./SlideItem":380,"@marcom/ac-classlist":304,"@marcom/ac-dom-styles/setStyle":29,"@marcom/ac-dom-traversal/querySelectorAll":46,"@marcom/ac-object/create":345}],382:[function(require,module,exports){
/**
 * @copyright 2015 Apple Inc. All rights reserved.
 */
'use strict';

var template = '';

template += '<nav class="paddlenav">';
template +=	'<ul>';
template +=	'<li><button class="paddlenav-arrow paddlenav-arrow-previous" data-ac-gallery-previous-trigger="%ID%"></button></li>';
template +=	'<li><button class="paddlenav-arrow paddlenav-arrow-next" data-ac-gallery-next-trigger="%ID%"></button></li>';
template +=	'</ul>';
template += '</nav>';

module.exports = template;

// ac-gallery@2.3.0

},{}],383:[function(require,module,exports){
if (!Array.isArray) {
    /**
     * Returns true if an object is an array, false if it is not.
     * @param {Object} object Object to test against.
     * @name Array.isArray
     */
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
// ac-polyfills@2.4.0

},{}],384:[function(require,module,exports){
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
// ac-polyfills@2.4.0

},{}],385:[function(require,module,exports){
if (!Array.prototype.filter) {
/**
	Tests all elements in an array and returns a new array filled with elements that pass the test.
	@param {Function} callback Function to test against. The callback must return a boolean value.
	@param {Object} thisObj Object to use as `this` when executing the callback.
	@returns {Array} Returns a new array populated with values from the original array that passed the test implemented by the provided function.
	@reference https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
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
// ac-polyfills@2.4.0

},{}],386:[function(require,module,exports){
if (!Array.prototype.forEach) {
/**
	Executes a provided function once per array element.
	@param callback {Function} Object to test against.
	@param thisObj {Object} What the callback method is bound to.
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
// ac-polyfills@2.4.0

},{}],387:[function(require,module,exports){
if (!Array.prototype.indexOf) {
/**
	Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
	@param searchElement {Object} Element to locate in the array.
	@param fromIndex {Number} Optional; the index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
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
// ac-polyfills@2.4.0

},{}],388:[function(require,module,exports){
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
// ac-polyfills@2.4.0

},{}],389:[function(require,module,exports){
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
// ac-polyfills@2.4.0

},{}],390:[function(require,module,exports){
if (!Array.prototype.some) {
/**
	Essentially the opposite of Array.prototype.every, Array.prototype.some calls a provided callback function once
	for each element in an array, until the callback function returns true.
	@param {Function} callback The fucntion to execute on each element in the array. The return value must evaluate to
	a boolean true in order for the entire method to return true.
	@param {Object} thisObj Optional; The object to use as `this` when executing the callback
	@returns {Boolean} true if the callback returns a true value, otherwise false.
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
// ac-polyfills@2.4.0

},{}],391:[function(require,module,exports){
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
// ac-polyfills@2.4.0

},{}],392:[function(require,module,exports){
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

// ac-polyfills@2.4.0

},{}],393:[function(require,module,exports){
if (!Function.prototype.bind) {
/**
	Creates a new function that, when called, itself calls this function in the context of the provided
	this value, with a given sequence of arguments preceding any provided when the new function was called.
	Arguments may be passed to bind as separate arguments following `thisObj`.
	@param {Object} thisObj The object that will provide the context of `this` for the called function.
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

// ac-polyfills@2.4.0

},{}],394:[function(require,module,exports){
/**
	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame polyfill by Erik Möller
	fixes from Paul Irish and Tino Zijdel
	Modified to implement Date.now()
*/
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
// ac-polyfills@2.4.0

},{}],395:[function(require,module,exports){
//slideGallery
var Gallery = require('@marcom/ac-gallery').Gallery;
var SlideGallery = require('@marcom/ac-gallery').SlideGallery;


function JobsGallery(id, captionId) {

	var galleryEle = document.getElementById(id);
	var captionEle = document.getElementById(captionId);

	if (galleryEle) {
		var gallery = new SlideGallery(galleryEle, {
			wrapAround: true,
			updateOnWindowResize: true,
			enableArrowKeys: true,
			autoPlay: false,
			rightToLeft: false,
			resizeContainer: true,
			duration: 0.5,
			itemCenterPoint: 0.5,
			touch: true,
			desktopSwipe: false,
			edgePullResistance: true,
			startAt: 0
		});
	}

	if (captionEle) {
		var captionGallery = new SlideGallery(captionEle, {
			wrapAround: true,
			updateOnWindowResize: true,
			enableArrowKeys: false,
			autoPlay: false,
			rightToLeft: false,
			resizeContainer: true,
			duration: 0.5,
			itemCenterPoint: 0.5,
			touch: false,
			desktopSwipe: false,
			edgePullResistance: true,
			itemSelector: '[data-captions-gallery]',
			startAt: 0
		});
	}

	gallery.on(SlideGallery.UPDATE, function (items) {
		var index = gallery.getItemIndex(items.incoming[0]);
		captionGallery.show(index);
	});

}


module.exports = JobsGallery;

},{"@marcom/ac-gallery":364}],396:[function(require,module,exports){
'use strict';

// var CardGallery = require("./components/CardGallery");
var JobsGallery = require("./components/JobsGallery");
// var MapBubble = require("./components/MapBubble")
var querySelector = require('@marcom/ac-dom-traversal/querySelector');
var ac_analytics = require('ac-analytics');
var elementTracker = require('@marcom/ac-element-tracker');
var elementEngagement = require('@marcom/ac-element-engagement');
var ac_browser = require('@marcom/ac-browser');

var Main = (function(){

	return {

		initialize: function(){
			// custom analytics for slide galleries
			var employeeGallery = new JobsGallery('gallery-employee', 'gallery-employee-captions');
			var employeeGalleryJob = new JobsGallery('gallery-employee-job', 'gallery-employee-captions-job');
			var supplierGallery = new JobsGallery('gallery-supplier', 'gallery-supplier-captions');
			var supplierGalleryPeople = new JobsGallery('gallery-supplier-people', 'gallery-supplier-captions-people');
			var supplierGalleryPlanet = new JobsGallery('gallery-supplier-planet', 'gallery-supplier-captions-planet');
			this.staticHeroFallback();
			this.pollForPageHeightChanges().then( this.onFontsReady );
			return this;
		},
		
		pollForPageHeightChanges: function(){
			return new Promise( function( resolve, reject ) {
				var pageHeight = document.documentElement.scrollHeight;
				var numberOfChecksWithoutChange = 0; // once this number hits 30, we consider ourselves ready
	
				window.requestAnimationFrame(function poll(){
					var newPageHeight = document.documentElement.scrollHeight;
	
					// If the page height hasn't changed, check to see if it's been the same for 30 frames and start Jetpack
					if(pageHeight !== newPageHeight) {
						numberOfChecksWithoutChange = 0;
						resolve();
					} else {
						numberOfChecksWithoutChange++;
	
						if(numberOfChecksWithoutChange >= 300) {
							resolve();
							return;
						}
					}
	
					// store the current height and queue another check
					pageHeight = newPageHeight;
					window.requestAnimationFrame(poll);
				});
			}.bind( this ));
		},
		
		onFontsReady : function() {
			window.requestAnimationFrame(function() {
				elementEngagement.refreshAllElementMetrics();			
			});
		},
		
		staticHeroFallback: function(){
			// No animations for IE 11 and below
			var htmlEl = document.getElementsByTagName('html')[0];
			if (ac_browser.name == 'IE' && Math.abs(ac_browser.version) <= 11) {
				htmlEl.classList.add('no-engaged-animation');
			}
		}

	};

}());

module.exports = Main.initialize();

},{"./components/JobsGallery":395,"@marcom/ac-browser":1,"@marcom/ac-dom-traversal/querySelector":45,"@marcom/ac-element-engagement":223,"@marcom/ac-element-tracker":292,"ac-analytics":"ac-analytics"}]},{},[396]);
