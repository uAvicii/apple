/* ---- BUILT FILE. DO NOT MODIFY THIS DIRECTLY. ---- */


window.matchMedia = window.matchMedia || (function (doc, undefined) {
	var bool, docElem = doc.documentElement,
	    refNode = docElem.firstElementChild || docElem.firstChild,
	// fakeBody required for <FF4 when executed in <head>
	fakeBody = doc.createElement('body'),
	     div = doc.createElement('div');
	div.id = 'mq-test-1';
	div.style.cssText = "position:absolute;top:-100em";
	fakeBody.style.background = "none";
	fakeBody.appendChild(div);
	return function (q) {
		div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width:42px; }</style>';
		docElem.insertBefore(fakeBody, refNode);
		bool = div.offsetWidth === 42;
		docElem.removeChild(fakeBody);
		return {
			matches: bool,
			media: q
		};
	};
}(document));
(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
		var currTime = new Date().getTime();
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
if (!Function.prototype.bind) {
	Function.prototype.bind = function bind(thisObj) {
		if (arguments.length < 1) {
			return this;
		}
		var __method = this;
		var args = AC.Array.toArray(arguments);
		var object = args.shift();
		return function () {
			return __method.apply(object, args.concat(AC.Array.toArray(arguments)));
		};
	};
}
if (!Array.isArray) {
	Array.isArray = function isArray(object) {
		return (object && typeof object === 'object' && 'splice' in object && 'join' in object);
	};
}
if (!Array.prototype.every) {
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
if (!Array.prototype.filter) {
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
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function forEach(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = this.length >>> 0;
		var i;
		var currentValue;
		if (typeof callback !== 'function') {
			throw new TypeError('No function object passed to forEach.');
		}
		for (i = 0; i < len; i += 1) {
			currentValue = arrayObject[i];
			callback.call(thisObj, currentValue, i, arrayObject);
		}
	};
}
if (!Array.prototype.indexOf) {
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
if (!Array.prototype.lastIndexOf) {
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
if (!Array.prototype.map) {
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
if (!Array.prototype.reduce) {
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
if (!Array.prototype.reduceRight) {
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
if (!Array.prototype.some) {
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
if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}
if (!Date.prototype.toISOString) {
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
if (!Date.prototype.toJSON) {
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
if (!String.prototype.trim) {
	String.prototype.trim = function trim() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
if (!Object.keys) {
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
;
// == JSON ==
// Fallback (for IE) to have JSON.stringify and JSON.parse methods
//
// From: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
//
if(typeof JSON == "undefined" || !('stringify' in JSON && 'parse' in JSON)) {
	if(!this.JSON) {
		this.JSON = {};
	}(function() {
		function f(n) {
			return n < 10 ? "0" + n : n;
		}
		// Date.toJSON used to be polyfilled here. A version that adheres more closely to ES5 spec
		// has been since added to ecma_script_5_shim.js rendering this version obsolete.
		if(typeof String.prototype.toJSON !== "function") {
			String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
				return this.valueOf();
			};
		}
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			gap, indent, meta = {
				"\b": "\\b",
				"\t": "\\t",
				"\n": "\\n",
				"\f": "\\f",
				"\r": "\\r",
				'"': '\\"',
				"\\": "\\\\"
			},
			rep;
		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
		}
		function str(key, holder) {
			var i, k, v, length, mind = gap,
				partial, value = holder[key];
			if(value && typeof value === "object" && typeof value.toJSON === "function") {
				value = value.toJSON(key);
			}
			if(typeof rep === "function") {
				value = rep.call(holder, key, value);
			}
			switch(typeof value) {
			case "string":
				return quote(value);
			case "number":
				return isFinite(value) ? String(value) : "null";
			case "boolean":
			case "null":
				return String(value);
			case "object":
				if(!value) {
					return "null";
				}
				gap += indent;
				partial = [];
				if(Object.prototype.toString.apply(value) === "[object Array]") {
					length = value.length;
					for(i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || "null";
					}
					v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
					gap = mind;
					return v;
				}
				if(rep && typeof rep === "object") {
					length = rep.length;
					for(i = 0; i < length; i += 1) {
						k = rep[i];
						if(typeof k === "string") {
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v);
							}
						}
					}
				} else {
					for(k in value) {
						if(Object.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v);
							}
						}
					}
				}
				v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
				gap = mind;
				return v;
			}
		}
		if(typeof JSON.stringify !== "function") {
			JSON.stringify = function(value, replacer, space) {
				var i;
				gap = "";
				indent = "";
				if(typeof space === "number") {
					for(i = 0; i < space; i += 1) {
						indent += " ";
					}
				} else {
					if(typeof space === "string") {
						indent = space;
					}
				}
				rep = replacer;
				if(replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
					throw new Error("JSON.stringify");
				}
				return str("", {
					"": value
				});
			};
		}
		if(typeof JSON.parse !== "function") {
			JSON.parse = function(text, reviver) {
				var j;
				function walk(holder, key) {
					var k, v, value = holder[key];
					if(value && typeof value === "object") {
						for(k in value) {
							if(Object.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if(v !== undefined) {
									value[k] = v;
								} else {
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder, key, value);
				}
				text = String(text);
				cx.lastIndex = 0;
				if(cx.test(text)) {
					text = text.replace(cx, function(a) {
						return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
					});
				}
				if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
					j = eval("(" + text + ")");
					return typeof reviver === "function" ? walk({
						"": j
					}, "") : j;
				}
				throw new SyntaxError("JSON.parse");
			}
		}
	}());
} 
;
// @f function reference
var ac_domready = function (f) {
	var done = false;
	var top = true;
	var doc = window.document;
	var root = doc.documentElement;
	var add = doc.addEventListener ? 'addEventListener' : 'attachEvent';
	var rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent';
	var pre = doc.addEventListener ? '' : 'on';
	var init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') {
			return;
		}
		(e.type == 'load' ? window : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) {
			f.call(window, e.type || e);
		}
	};
	var poll = function() {
		try {
			root.doScroll('left');
		} catch(e) {
			setTimeout(poll, 50);
			return;
		}
		init('poll');
	};
	if (doc.readyState == 'complete') {
		f.call(window, 'lazy');
	} else {
		if (doc.createEventObject && root.doScroll) {
			try {
				top = !window.frameElement;
			} catch(e) { }
			if (top) {
				poll();
			}
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		window[add](pre + 'load', init, false);
	}
};
var AC = window.AC || {};
AC.Array = AC.Array || {};
AC.Array.toArray = function (arrayLike) {
	return Array.prototype.slice.call(arrayLike);
};
AC.Array.flatten = function (array) {
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
AC.Array.without = function (arr, value) {
	var newArr;
	var index = arr.indexOf(value);
	var length = arr.length;
	if (index >= 0) {
		// If it’s the last item
		if (index === (length - 1)) {
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
var AC = window.AC || {};
AC.Element = AC.Element || {};
AC.Element.addEventListener = function (target, type, listener, useCapture) {
	if (target.addEventListener) {
		target.addEventListener(type, listener, useCapture);
	} else if (target.attachEvent) {
		var r = target.attachEvent("on" + type, listener);
	} else {
		target["on" + type] = listener;
	}
	return target;
};
AC.Element.removeEventListener = function (target, type, listener, useCapture) {
	if (target.removeEventListener) {
		target.removeEventListener(type, listener, useCapture);
	} else {
		target.detachEvent("on" + type, listener);
	}
	return target;
};
AC.Element.getElementById = function (element) {
	if (AC.String.isString(element)) {
		element = document.getElementById(element);
	}
	if (AC.Element.isElement(element)) {
		return element;
	} else {
		return null;
	}
};
AC.Element.selectAll = function (selector, context) {
	if (typeof context === 'undefined') {
		context = document.body;
	} else if (!AC.Element.isElement(context)) {
		throw 'AC.Element.selectAll: Context is not an Element';
	}
	if (typeof selector === 'string') {
		return Sizzle(selector, context);
	} else {
		throw 'AC.Element.selectAll: Selector must be a string';
	}
};
AC.Element.select = function (selector, context) {
	if (typeof context === 'undefined') {
		context = document.body;
	} else if (!AC.Element.isElement(context)) {
		throw 'AC.Element.select: Context is not an Element';
	}
	if (typeof selector === 'string') {
		if (window.Element && typeof Element.prototype.querySelector === 'function') {
			return context.querySelector(selector);
		} else {
			return Sizzle(selector, context)[0];
		}
	} else {
		throw 'AC.Element.select: Selector must be a string';
	}
};
AC.Element.matchesSelector = function (element, selector) {
	return Sizzle.matchesSelector(element, selector);
};
AC.Element.filterBySelector = function (elements, selector) {
	return Sizzle.matches(selector, elements);
};
(function () {
	var camelCaseReplaceFn = function (match, group, offset, string) {
		return (offset === 0) && (string.substr(1, 3) !== 'moz') ? group : group.toUpperCase();
	};
	AC.Element.setStyle = function (element, styles) {
		if ((typeof styles !== 'string' && typeof styles !== 'object') || Array.isArray(styles)) {
			throw new TypeError('styles argument must be either an object or a string');
		}
		element = AC.Element.getElementById(element);
		var stylesObj = (typeof styles === 'object') ? styles : {};
		var splitStyles;
		var colon;
		var i;
		var camelCaseProp;
		var prop;
		// if styles is string, explode to object
		if (typeof styles === 'string') {
			splitStyles = styles.split(';');
			for (i = 0; i < splitStyles.length; i += 1) {
				colon = splitStyles[i].indexOf(':');
				if (colon > 0) {
					stylesObj[splitStyles[i].substr(0, colon).trim()] = splitStyles[i].substr(colon + 1).trim();
				}
			}
		}
		// iterate over stylesObj and set styles
		for (prop in stylesObj) {
			if (stylesObj.hasOwnProperty(prop)) {
				camelCaseProp = prop.replace(/-(\w)/g, camelCaseReplaceFn);
				// Set opacity for IE via polyfill if necessary
				if (camelCaseProp === 'opacity' && AC.Element.__setOpacityIE) {
					AC.Element.__setOpacityIE(element, stylesObj[prop]);
				} else {
					if (typeof element.style[camelCaseProp] !== 'undefined') {
						element.style[camelCaseProp] = stylesObj[prop];
					}
				}
			}
		}
		return element;
	};
	AC.Element.getStyle = function (element, style) {
		var css;
		var value;
		style = style.replace(/-(\w)/g, camelCaseReplaceFn);
		// Support for legacy IEs without window.getComputedStyle()
		if (AC.Element.__getStyleIE) {
			return AC.Element.__getStyleIE(element, style);
		}
		element = AC.Element.getElementById(element);
		style = (style === 'float') ? 'cssFloat' : style;
		css = window.getComputedStyle(element, null);
		value = css ? css[style] : null;
		if (style === 'opacity') {
			return value ? parseFloat(value) : 1.0;
		}
		return value === 'auto' ? null : value;
	};
}());
AC.Element.getBoundingBox = function (element) {
	element = AC.Element.getElementById(element);
	var rect = element.getBoundingClientRect();
	var w = rect.width || rect.right - rect.left;
	var h = rect.height || rect.bottom - rect.top;
	return {
		top: rect.top,
		right: rect.right,
		bottom: rect.bottom,
		left: rect.left,
		width: w,
		height: h
	};
};
AC.Element.cumulativeOffset = function (element) {
	var box = AC.Element.getBoundingBox(element);
	var scrollOffsets = AC.Viewport.scrollOffsets();
	var offset = [box.top + scrollOffsets.y, box.left + scrollOffsets.x];
	offset.top = offset[0];
	offset.left = offset[1];
	return offset;
};
AC.Element.hasClassName = function (element, cls) {
	var matchedElement = AC.Element.getElementById(element);
	if (matchedElement && matchedElement.className !== '') {
		return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(matchedElement.className);
	} else {
		return false;
	}
};
AC.Element.addClassName = function (element, cls) {
	var matchedElement = AC.Element.getElementById(element);
	if (!AC.Element.hasClassName(matchedElement, cls)) {
		matchedElement.className += " " + cls;
	}
};
AC.Element.removeClassName = function (element, cls) {
	var matchedElement = AC.Element.getElementById(element);
	if (AC.Element.hasClassName(matchedElement, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		matchedElement.className = matchedElement.className.replace(reg, '$1').trim();
	}
};
AC.Element.toggleClassName = function (element, cls) {
	var matchedElement = AC.Element.getElementById(element);
	if (matchedElement.classList) {
		matchedElement.classList.toggle(cls);
	} else {
		if (AC.Element.hasClassName(matchedElement, cls)) {
			AC.Element.removeClassName(matchedElement, cls);
		} else {
			AC.Element.addClassName(matchedElement, cls);
		}
	}
};
AC.Element.isElement = function (object) {
	return !!(object && object.nodeType === 1);
};
AC.Element.addVendorEventListener = function (element, type, listener, useCapture) {
	AC.log('AC.Element.addVendorEventListener is deprecated. Please use AC.Element.addVendorPrefixEventListener.');
	return this.addVendorPrefixEventListener(element, type, listener, useCapture);
};
AC.Element.addVendorPrefixEventListener = function (element, type, listener, useCapture) {
	if (type.match(/^webkit/i)) {
		type = type.replace(/^webkit/i, '');
	} else if (type.match(/^moz/i)) {
		type = type.replace(/^moz/i, '');
	} else if (type.match(/^ms/i)) {
		type = type.replace(/^ms/i, '');
	} else if (type.match(/^o/i)) {
		type = type.replace(/^o/i, '');
	} else {
		type = type.charAt(0).toUpperCase() + type.slice(1);
	}
	// To avoid adding the same event twice, we need to sniff the user agent.
	// Once we've confirmed a browser supports the generic event name, we'll
	// change this if to be < that build.
	if (/WebKit/i.test(window.navigator.userAgent)) {
		return AC.Element.addEventListener(element, 'webkit' + type, listener, useCapture);
	} else if (/Opera/i.test(window.navigator.userAgent)) {
		return AC.Element.addEventListener(element, 'O' + type, listener, useCapture);
	} else if (/Gecko/i.test(window.navigator.userAgent)) {
		return AC.Element.addEventListener(element, type.toLowerCase(), listener, useCapture);
	} else {
		type = type.charAt(0).toLowerCase() + type.slice(1);
		return AC.Element.addEventListener(element, type, listener, useCapture);
	}
};
AC.Element.removeVendorEventListener = function (element, type, listener, useCapture) {
	AC.log('AC.Element.removeVendorEventListener is deprecated. Please use AC.Element.removeVendorPrefixEventListener.');
	return this.removeVendorPrefixEventListener(element, type, listener, useCapture);
};
AC.Element.removeVendorPrefixEventListener = function (element, type, listener, useCapture) {
	if (type.match(/^webkit/i)) {
		type = type.replace(/^webkit/i, '');
	} else if (type.match(/^moz/i)) {
		type = type.replace(/^moz/i, '');
	} else if (type.match(/^ms/i)) {
		type = type.replace(/^ms/i, '');
	} else if (type.match(/^o/i)) {
		type = type.replace(/^o/i, '');
	} else {
		type = type.charAt(0).toUpperCase() + type.slice(1);
	}
	AC.Element.removeEventListener(element, 'webkit' + type, listener, useCapture);
	AC.Element.removeEventListener(element, 'O' + type, listener, useCapture);
	AC.Element.removeEventListener(element, type.toLowerCase(), listener, useCapture);
	type = type.charAt(0).toLowerCase() + type.slice(1);
	return AC.Element.removeEventListener(element, type, listener, useCapture);
};
AC.Element.setVendorPrefixStyle = function (element, property, value) {
	if (typeof property !== 'string') {
		throw new TypeError('AC.Element.setVendorPrefixStyle: property must be a string');
	}
	if (typeof value !== 'string' && typeof value !== 'number') {
		throw new TypeError('AC.Element.setVendorPrefixStyle: value must be a string or a number');
	}
	// Coerce value to string
	value += '';
	element = AC.Element.getElementById(element);
	// Empty value accounts for non-vendor-prefixed properties
	var prefixes = ['', 'webkit', 'Moz', 'ms', 'O'];
	var prefixedCamelProp;
	var prefixedValue;
	// Strip prefix from property if it has one
	property = property.replace(/-(webkit|moz|ms|o)-/i, '');
	// Strip js camelcase vendor prefix if it has one and lowercase first letter. e.g. webkitTransform
	property = property.replace(/^(webkit|Moz|ms|O)/, '').charAt(0).toLowerCase() + property.slice(1);
	// camelCase property
	property = property.replace(/-(\w)/, function (match, group) {
		return group.toUpperCase();
	});
	// Insert token for vendor prefix replacement in values
	value = value.replace(/-(webkit|moz|ms|o)-/, '-vendor-');
	// Iterate through prefixes array testing for existence of property. AC.Element.setStyle runs on first match.
	prefixes.some(function (prefix, index, arrayObj) {
		// Apply prefixes
		prefixedCamelProp = (prefix === '') ? property : prefix + property.charAt(0).toUpperCase() + property.slice(1);
		prefixedValue = (prefix === '') ? value.replace('-vendor-', '') : value.replace('-vendor-', '-' + prefix.charAt(0).toLowerCase() + prefix.slice(1) + '-');
		if (prefixedCamelProp in element.style) {
			AC.Element.setStyle(element, prefixedCamelProp + ':' + prefixedValue);
			return true;
		}
	});
};
AC.Element.getVendorPrefixStyle = function (element, property) {
	if (typeof property !== 'string') {
		throw new TypeError('AC.Element.getVendorPrefixStyle: property must be a string');
	}
	element = AC.Element.getElementById(element);
	var prefixes = ['', 'webkit', 'Moz', 'ms', 'O'];
	var style;
	// Strip css vendor prefix from property if it has one. e.g. -webkit-transform
	property = property.replace(/-(webkit|moz|ms|o)-/i, '');
	// Strip js camelcase vendor prefix if it has one and lowercase first letter. e.g. webkitTransform
	property = property.replace(/^(webkit|Moz|ms|O)/, '').charAt(0).toLowerCase() + property.slice(1);
	// camelCase property
	property = property.replace(/-(\w)/, function (match, group) {
		return group.toUpperCase();
	});
	// Iterate through prefixes array, testing for existence of property. AC.Element.getStyle runs on the first match.
	prefixes.some(function (prefix, index) {
		// Apply prefixes
		var prefixedCamelProp = (prefix === '') ? property : prefix + property.charAt(0).toUpperCase() + property.slice(1);
		if (prefixedCamelProp in element.style) {
			style = AC.Element.getStyle(element, prefixedCamelProp);
			return true;
		}
	});
	return style;
};
AC.Element.insert = function (element, target, placement) {
	// Restrict node types passed: 1 = element, 3 = text node, 11 = document fragment
	if (!element || !(element.nodeType === 1 || element.nodeType === 3 || element.nodeType === 11)) {
		throw 'AC.Element.insert: element must be a valid node of type element, text, or document fragment';
	}
	if (!target || !(target.nodeType === 1 || target.nodeType === 11)) {
		throw 'AC.Element.insert: target must be a valid node of type element or document fragment';
	}
	// Placement is optional; defaults to ‘last’
	switch (placement) {
	case 'before':
		if (target.nodeType === 11) {
			throw 'AC.Element.insert: target cannot be nodeType of documentFragment when using placement ‘before’';
		}
		target.parentNode.insertBefore(element, target);
		break;
	case 'after':
		if (target.nodeType === 11) {
			throw 'AC.Element.insert: target cannot be nodeType of documentFragment when using placement ‘after’';
		}
		target.parentNode.insertBefore(element, target.nextSibling);
		break;
	case 'first':
		target.insertBefore(element, target.firstChild);
		break;
	default: //'last'
		target.appendChild(element);
	}
};
AC.Element.remove = function (element, retainReference) {
	if (!AC.Element.isElement(element)) {
		throw 'AC.Element.remove: element must be a valid DOM element';
	}
	if (retainReference === true) {
		var removedNode = element.parentNode.removeChild(element);
		return removedNode;
	} else {
		element.parentNode.removeChild(element);
	}
};
var AC = window.AC || {};
AC.Event = AC.Event || {};
AC.Event.stop = function (evt) {
	if (!evt) {
		evt = window.event;
	}
	if (evt.stopPropagation) {
		evt.stopPropagation();
	} else {
		evt.cancelBubble = true;
	}
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	evt.stopped = true;
	evt.returnValue = false;
};
AC.Event.target = function (evt) {
	return (typeof evt.target !== 'undefined') ? evt.target : evt.srcElement;
};
AC.Event.Keys = {
	UP:       38,
	DOWN:     40,
	LEFT:     37,
	RIGHT:    39,
	ESC:      27,
	SPACE:    32,
	BACKSPACE: 8,
	DELETE:   46,
	END:      35,
	HOME:     36,
	PAGEDOWN: 34,
	PAGEUP:   33,
	RETURN:   13,
	TAB:      9
};
var AC = window.AC || {};
AC.Function = AC.Function || {};
AC.Function.emptyFunction = function () {};
AC.Function.bindAsEventListener = function (__method, obj) {
	// Pass arguments after method name and obj as arguments to method
	var args = AC.Array.toArray(arguments).slice(2);
	return function (event) {
		return __method.apply(obj, [event || window.event].concat(args));
	};
};
AC.Function.getParamNames = function (func) {
    var funStr = func.toString();
    return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g) || [];
};
// == HTML5 Activation for Older Browsers ==
(function () {
	var elms = [
		'abbr',
		'article',
		'aside',
		'command',
		'details',
		'figcaption',
		'figure',
		'footer',
		'header',
		'hgroup',
		'mark',
		'meter',
		'nav',
		'output',
		'progress',
		'section',
		'summary',
		'time'
	];
	elms.forEach(function (value) {
		document.createElement(value);
	});
}());
(function () {
	// We are IE if window.attachEvent is present
	if (window.attachEvent) {
		var __getIEDocumentMode = function () {
			var compat = document.compatible;
			// Safely assume that IE version is <= 7 if document.compatible is not present.
			var ie = !compat ? 7 : undefined;
			var compatLen;
			var i;
			var versions = [];
			// Determine compat mode or version of IE
			if (compat) {
				compatLen = compat.length;
				// If no compat meta tag is set, document.documentMode will reliably report
				// the version that is being used to render the page.
				if (compatLen === 0) {
					ie = parseInt(document.documentMode, 10);
				}
				// Else use the highest version found in document.compatible
				if (compatLen > 0) {
					for (i = 0; i < compatLen; i += 1) {
						versions.push(parseInt(compat[i].version.match(/\d{1,2}/), 10));
					}
					versions = versions.sort(function (a, b) {
						return a - b;
					});
					ie = versions.pop();
				}
			}
			return ie;
		};
		var IE = __getIEDocumentMode();
		if (IE <= 8) {
			AC.Element.__setOpacityIE = function (element, value) {
				value = (value > 1) ? 1 : ((value < 0.00001) ? 0 : value) * 100;
				alphaFilter = element.filters['DXImageTransform.Microsoft.Alpha'] || element.filters.Alpha;
				if (alphaFilter) {
					// Favor modifying existing filters via the filters collection if already set.
					alphaFilter.Opacity = value;
				} else {
					// Don't clobber existing filter string if any
					element.style.filter += ' progid:DXImageTransform.Microsoft.Alpha(Opacity=' + value + ')';
				}
				return element;
			};
		}
		var nonClickableImageBooster = function () {
			// We are IE if currentStyle is present.
			if (document.body.currentStyle) {
				var parent;
				var anchor;
				var booster;
				var aPosition;
				var zIndices = [];
				var zIdx;
				// Eligible elements are images that are grandchildren of <a>'s
				AC.Element.selectAll('a > * > img').forEach(function (img) {
					parent = img.parentNode;
					anchor = img.parentNode.parentNode;
					// The bug is triggered when the image's parent node has layout
					if (parent.currentStyle.hasLayout && img.height > 0 && img.width > 0) {
						// We only need one booster per anchor
						if (!AC.Element.select('ieclickbooster', anchor)) {
							booster = document.createElement('ieclickbooster');
							aPosition = AC.Element.getStyle(anchor, 'position');
							if (aPosition === 'static') {
								AC.Element.setStyle(anchor, { position: 'relative' });
							}
							// Collect zIndices for all of the anchor's direct children
							AC.Element.selectAll('> *', anchor).forEach(function (element) {
								var elementZidx = parseInt(element.currentStyle.zIndex, 10);
								if (elementZidx > 0) {
									zIndices.push(elementZidx);
								}
							});
							zIndices.sort(function (a, b) {
								return b - a;
							});
							zIdx = zIndices[0] ? zIndices[0].toString() : '1';
							AC.Element.insert(booster, anchor);
							AC.Element.setStyle(booster, {
								display: 'block',
								position: 'absolute',
								top: '0',
								bottom: '0',
								left: '0',
								right: '0',
								background: 'url(/global/elements/blank.gif)',
								cursor: 'pointer',
								zIndex: zIdx
							});
						}
					}
				});
			}
		};
		if (typeof window.getComputedStyle !== 'function') {
			AC.Element.__getStyleIE = function (element, style) {
				element = AC.Element.getElementById(element);
				var css;
				var alphaFilter;
				var value;
				if (element.currentStyle) {
					// IE's currentStyle uses styleFloat instead of float
					style = style === 'float' ? 'styleFloat' : style;
					css = element.currentStyle;
					// Handle opacity
					if (style === 'opacity') {
						alphaFilter = element.filters['DXImageTransform.Microsoft.Alpha'] || element.filters.Alpha;
						if (alphaFilter) {
							return parseFloat(alphaFilter.Opacity / 100);
						}
						return 1.0;
					}
					value = css[style] || null;
					return value === 'auto' ? null : value;
				}
			};
		}
		ac_domready(function () {
			if (IE <= 7) {
				nonClickableImageBooster();
			}
		});
	}
}());
var AC = window.AC || {};
AC.Object = AC.Object || {};
if (Object.extend) {
	AC.Object.extend = Object.extend;
} else {
	AC.Object.extend = function extend(destination, source) {
		var property;
		for (property in source) {
			if (source.hasOwnProperty(property)) {
				destination[property] = source[property];
			}
		}
		return destination;
	};
}
if (Object.clone) {
	AC.Object.clone = Object.clone;
} else {
	AC.Object.clone = function clone(object) {
		return AC.Object.extend({}, object);
	};
}
if (Object.getPrototypeOf) {
	AC.Object.getPrototypeOf = Object.getPrototypeOf;
} else {
	if (typeof this.__proto__ === 'object') {
		AC.Object.getPrototypeOf = function getPrototypeOf(obj) {
			return obj.__proto__;
		};
	} else {
		AC.Object.getPrototypeOf = function getPrototypeOf(obj) {
			var constructor = obj.constructor;
			var oldConstructor;
			if (Object.prototype.hasOwnProperty.call(obj, 'constructor')) {
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
		};
	}
}
;
var AC = window.AC || {};
AC.RegExp = AC.RegExp || {};
AC.RegExp.isRegExp = function (obj) {
	return (obj.constructor.name === "RegExp");
};
var AC = window.AC || {};
AC.String = AC.String || {};
AC.String.isString = function (object) {
	return (typeof object === 'string');
};
AC.String.toCamelCase = function (string) {
	if (typeof string !== 'string') {
		throw 'Argument must be of type String.';
	}
	return string.replace(/-+(.)?/g, function (match, character) {
		return character ? character.toUpperCase() : '';
	});
};
var AC = window.AC || {};
AC.Object.extend(AC, {
	uid: function ac_uid() {
		if (!AC._uid) {
			AC._uid = 0;
		}
		return AC._uid++;
	},
	namespace: function ac_namespace(namespacePath) {
		var i;
		if (!(namespacePath && namespacePath.match && namespacePath.match(/\S/))) {
			throw 'Attempt to create AC.namespace with no name.';
		}
		var splitnamespaceArr = namespacePath.split(/\./);
		var cursor = window;
		for (i = 0; i < splitnamespaceArr.length; i++) {
			cursor[splitnamespaceArr[i]] = cursor[splitnamespaceArr[i]] || {};
			cursor = cursor[splitnamespaceArr[i]];
		}
	},
	bindEventListeners: function ac_bindEventListeners(object, element, handlerDictionary) {
		var aKey;
		element = AC.Element.getElementById(element);
		if (!AC.Element.isElement(element)) {
			throw 'Invalid or non-existent element passed to bindEventListeners.';
		}
		for (aKey in handlerDictionary) {
			if (handlerDictionary.hasOwnProperty(aKey)) {
				var aVal = handlerDictionary[aKey];
				if (typeof aVal === 'function') {
					AC.Element.addEventListener(element, aKey, AC.Function.bindAsEventListener(aVal, object));
				} else if (typeof aVal === 'string') {
					AC.Element.addEventListener(element, aKey, AC.Function.bindAsEventListener(object[aVal], object));
				}
			}
		}
	}
});
// Amaretto : Lightweight alternative to almond.js
(function(namespace, global) {
    "use strict";
    function getDependencies(dependencies) {
        return dependencies.map(function(dep) {
            return require(dep);
        });
    }
    var moduleRegistry, require, define;
    require = function(nameOrDependencies, callback) {
        var module;
        // If 1st argument is a module name.
        // If 1st argument is a module name.
        return "string" == typeof nameOrDependencies ? module = moduleRegistry[nameOrDependencies] : // If 1st argument is an array of dependencies.
        "function" == typeof callback && Array.isArray(nameOrDependencies) ? callback.apply(global, getDependencies(nameOrDependencies)) : void 0;
    }, 
    require.version = "1.0.0", 
    require.config = function() {}, 
    define = function(name, dependencies, module) {
        moduleRegistry[name] || (// If no module is given we assume that the 2nd argument is the module payload.
        module || (module = dependencies), // Defining a module with dependencies. Resolve, execute and register return value.
        // Eg. define('myModule', ['aDependency', bDependency], function (a, b) { });
        moduleRegistry[name] = "function" == typeof module && Array.isArray(dependencies) ? module.apply(module, getDependencies(dependencies)) : "function" == typeof module ? module() : module);
    }, 
    define.amd = {}, 
    require._init = function() {
        moduleRegistry = {}, define("require", [], function() {
            return require;
        });
    }, 
    require.getRegisteredModules = function() {
        return Object.getOwnPropertyNames(moduleRegistry).sort();
    }, require._init(), namespace.require = namespace.require || require, namespace.define = namespace.define || define;
})(this.AC || this, this);
AC.define("defer/core/Deferred", [ "require" ], function() {
    function Deferred() {}
    return Deferred.prototype = {
        resolve: function ac_resolve() {
            return this._defer.resolve.apply(this._defer, Array.prototype.slice.call(arguments)), 
            this.promise();
        },
        reject: function ac_reject() {
            return this._defer.reject.apply(this._defer, Array.prototype.slice.call(arguments)), 
            this.promise();
        },
        progress: function ac_progress() {
            return this._defer.progress.apply(this._defer, Array.prototype.slice.call(arguments)), 
            this.promise();
        },
        then: function ac_then() {
            return this._defer.then.apply(this._defer, Array.prototype.slice.call(arguments)), 
            this.promise();
        },
        promise: function ac_promise() {
            return this._defer.promise.apply(this._defer, Array.prototype.slice.call(arguments));
        }
    }, Deferred;
}), AC.define("defer/lib/Deferred", [], function() {
    var statuses, each, CallbackContainer, funcOrEmpty, Deferred, Promise;
    statuses = {
        0: "pending",
        1: "resolved",
        2: "rejected"
    }, each = function(type, data) {
        var i, pending, length, callbackObj, callbackResult;
        if (0 !== this._status) return console && console.warn && console.warn("Trying to fulfill more than once."), 
        !1;
        for (this.data = data, pending = this.pending, length = pending.length, i = 0; length > i; i++) callbackObj = pending[i], 
        callbackObj[type] && (callbackResult = callbackObj[type](data)), "object" == typeof callbackResult && callbackResult.hasOwnProperty("then") && callbackResult.hasOwnProperty("status") ? callbackResult.then(function(data) {
            callbackObj.deferred.resolve(data);
        }, function(data) {
            callbackObj.deferred.reject(data);
        }, function(data) {
            callbackObj.deferred.progress(data);
        }) : callbackObj.deferred[type](callbackResult || void 0);
        return "progress" !== type && (pending = []), !0;
    }, Promise = function(then, status) {
        this.then = then, this.status = status;
    }, funcOrEmpty = function(func) {
        return "function" != typeof func ? function() {} : func;
    }, CallbackContainer = function(success, error, progress) {
        this.resolve = funcOrEmpty(success), this.reject = funcOrEmpty(error), this.progress = funcOrEmpty(progress), 
        this.deferred = new Deferred();
    }, Deferred = function() {
        this.pending = [], this._status = 0, this._promise = new Promise(this.then.bind(this), this.status.bind(this));
    }, Deferred.prototype = {
        status: function ac_status() {
            return statuses[this._status];
        },
        promise: function ac_promise() {
            return this._promise;
        },
        progress: function ac_progress(update) {
            return each.call(this, "progress", update), this._promise;
        },
        resolve: function ac_resolve(value) {
            return each.call(this, "resolve", value), 0 === this._status && (this._status = 1), 
            this._promise;
        },
        reject: function ac_reject(error) {
            return each.call(this, "reject", error), 0 === this._status && (this._status = 2), 
            this._promise;
        },
        then: function ac_then(success, error, progress) {
            var result, callbackObject;
            return callbackObject = new CallbackContainer(success, error, progress), 0 === this._status ? this.pending.push(callbackObject) : 1 === this._status && "function" == typeof success ? (result = success(this.data), 
            "object" == typeof result && result.hasOwnProperty("then") && result.hasOwnProperty("status") ? result.then(function(data) {
                callbackObject.deferred.resolve(data);
            }, function(data) {
                callbackObject.deferred.reject(data);
            }, function(data) {
                callbackObject.deferred.progress(data);
            }) : callbackObject.deferred.resolve(result)) : 2 === this._status && "function" == typeof error && (result = error(this.data), 
            callbackObject.deferred.reject(result)), callbackObject.deferred.promise();
        }
    };
    var when = function() {
        var values, deferred, pending, success, fail;
        return values = [].slice.call(arguments), deferred = new Deferred(), pending = 0, 
        success = function(value) {
            pending--;
            var i = values.indexOf(this);
            values[i] = value, 0 === pending && deferred.resolve(values);
        }, fail = function(error) {
            deferred.reject(error);
        }, values.forEach(function(value) {
            value.then && (pending++, value.then(success.bind(value), fail));
        }), deferred.promise();
    };
    return Deferred.when = when, Deferred;
}), AC.define("defer/Deferred", [ "require", "defer/core/Deferred", "defer/lib/Deferred" ], function(require) {
    function Deferred() {
        this._defer = new Jett();
    }
    var proto = new (require("defer/core/Deferred"))(), Jett = require("defer/lib/Deferred");
    return Deferred.prototype = proto, Deferred.join = function() {
        return Jett.when.apply(null, [].slice.call(arguments));
    }, Deferred.all = function(arrayOfPromises) {
        return Jett.when.apply(null, arrayOfPromises);
    }, Deferred;
}), AC.define("animationTimeout/AnimationTimeout", [ "require", "defer/Deferred" ], function(require) {
    function AnimationTimeout(duration, intervalFunction, cancelFunction) {
        this.duration = duration, intervalFunction && (this._intervalFunction = intervalFunction), 
        cancelFunction && (this._cancelFunction = cancelFunction), this._update = this._update.bind(this);
    }
    var proto, Deferred = require("defer/Deferred");
    return proto = AnimationTimeout.prototype, proto._intervalFunction = window.requestAnimationFrame.bind(window), 
    proto._cancelFunction = window.cancelAnimationFrame.bind(window), proto._update = function(currentTime) {
        this._startTime = this._startTime || currentTime, this._progress = (currentTime - this._startTime) / this.duration, 
        1 > this._progress ? (this._defer.progress(this._progress), this._requestID = this._intervalFunction(this._update)) : (this._progress = 1, 
        this._defer.progress(1), this._defer.resolve(1));
    }, proto.start = function() {
        return this._defer = new Deferred(), this._startTime = 0, this._requestID = this._intervalFunction(this._update), 
        this._defer.promise();
    }, proto.cancel = function() {
        this._cancelFunction(this._requestID), this._defer.reject();
    }, AnimationTimeout;
}), AC.define("assetLoader/AssetLoader", [ "require", "defer/Deferred" ], function(require) {
    function AssetLoader(assets, type) {
        this._assetsToLoad = [].concat(assets), this._type = type || "img";
    }
    var Deferred = require("defer/Deferred");
    return AssetLoader.prototype = {
        load: function ac_load() {
            return this._assetsLoaded = [], this._assetsCountLoaded = 0, this._defer = new Deferred(), 
            this._failure = !1, this._assetsToLoad.forEach(this._loadAsset.bind(this)), this._defer.promise();
        },
        _progress: function ac__progress(event) {
            this._defer.progress(this._assetsLoaded[event.target._id] = event.target), this._assetsCountLoaded += 1, 
            this._assetsCountLoaded === this._assetsToLoad.length && this._defer.resolve(this._assetsLoaded);
        },
        _error: function ac__error(event) {
            this._failure = !0, this._defer.reject(event.target);
        },
        _loadAsset: function ac__loadAsset(src, id) {
            var img;
            this._failure || (img = document.createElement(this._type), img._id = id, img.onload = this._progress.bind(this), 
            img.onerror = this._error.bind(this), img.src = src);
        }
    }, AssetLoader;
}), AC.define("ajax/Ajax", [ "require", "defer/Deferred" ], function(require) {
    function getTransport() {
        var request = !1;
        try {
            request = new XMLHttpRequest();
        } catch (e) {
            try {
                request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    request = !1;
                }
            }
        }
        return request;
    }
    function Adaptor(timeout) {
        timeout && (this.timeout = timeout);
    }
    var proto, Deferred = require("defer/Deferred");
    return proto = Adaptor.prototype, proto.timeout = 5e3, proto.xhrMethod = function(method, url, data, headers) {
        var timeoutId, request = getTransport(), deferred = new Deferred();
        headers = headers || {}, request.open(method, url, !1), Object.keys(headers).forEach(function(key) {
            request.setRequestHeader(key, headers[key]);
        }), timeoutId = setTimeout(function() {
            request.abort(), deferred.reject();
        }, this.timeout), request.onreadystatechange = function() {
            4 === request.readyState && (clearTimeout(timeoutId), request.status >= 200 && 300 > request.status ? deferred.resolve(request) : deferred.reject(request));
        };
        try {
            request.send(data);
        } catch (e) {
            clearTimeout(timeoutId), request.abort();
        }
        return deferred.promise();
    }, proto.post = function(url, data, headers) {
        return this.xhrMethod("POST", url, data, headers);
    }, proto.get = function(url, data, headers) {
        return this.xhrMethod("GET", url, data, headers);
    }, Adaptor;
});
AC.Object.extend(AC, {
	onDOMReady: ac_domready
});
AC.windowHasLoaded = false;
AC.Element.addEventListener(window, 'load', function () {
	AC.windowHasLoaded = true;
});
AC.namespace('AC.Synthesize');
AC.Synthesize.synthesize = function (object) {
	if (typeof object !== 'object') {
		object = this;
	}
	var name, privateVariable;
	// Check all properties under object, ignore inherited properties
	for (privateVariable in object) {
		if (object.hasOwnProperty(privateVariable)) {
			// Check that first character is private variable indicator '_' and not '__'
			if (privateVariable.charAt(0) === '_' && privateVariable.charAt(1) !== '_') {
				// Don't create getter/setters for functions
				if (typeof object[privateVariable] !== 'function') {
					this.__synthesizeGetter(privateVariable, object);
					this.__synthesizeSetter(privateVariable, object);
				}
			}
		}
	}
};
AC.Synthesize.__synthesizeGetter = function (privateVariable, object) {
	// Get name of getter function
	var functionName = privateVariable.slice(1, privateVariable.length);
	// Define getter if not already defined
	if (typeof object[functionName] === 'undefined') {
		object[functionName] = function () {
			return object[privateVariable];
		};
	}
};
AC.Synthesize.__synthesizeSetter = function (privateVariable, object) {
	var functionName = privateVariable.slice(1, privateVariable.length);
	functionName = 'set' + functionName.slice(0, 1).toUpperCase() + functionName.slice(1, functionName.length);
	// Define setter if not already defined
	if (typeof object[functionName] === 'undefined') {
		object[functionName] = function (value) {
			object[privateVariable] = value;
		};
	}
};
AC.namespace('AC.Object');
AC.Object.synthesize = function (object) {
	if (typeof object === 'object') {
		// Create new instance of AC.Synthesize and extend it with your object
		AC.Object.extend(object, AC.Object.clone(AC.Synthesize));
		// Synthesize member data in extended object
		object.synthesize();
		return object;
	} else {
		throw 'Argument supplied was not a valid object.';
	}
};
AC.Class = function () {
	var args = AC.Array.toArray(arguments);
	var superclass = (typeof args[0] === 'function') ? args.shift() : null;
	var prototypeObj = args.shift() || {};
	var Superclass;
	var ACGeneratedClass = function () {
		var result;
		var timeoutCallback;
		// Run initialize method in constructor function
		result = ((typeof this.initialize === 'function' && ACGeneratedClass.__shouldInitialize !== false) ? this.initialize.apply(this, arguments) : false);
		// If that method returns <code>AC.Class.Invalidate</code>, remove this instance from memory
		if (result === AC.Class.Invalidate) {
			timeoutCallback = function () {
				try {
					// If this is the shared instance for the Class that we intend to invalidate
					if (this && this._parentClass && this._parentClass._sharedInstance === this) {
						this._parentClass._sharedInstance = null;
					}
				} catch (e) {
					throw e;
				}
			};
			// Let the current thread run until it catches its breath.
			window.setTimeout(timeoutCallback.bind(this), 200);
		}
	};
	// Save reference to superclass
	ACGeneratedClass.__superclass = superclass;
	// Extend with provided properties
	if (superclass) {
		// Setup Superclass placeholder
		if (superclass.__superclass) {
			Superclass = AC.Class(superclass.__superclass, superclass.prototype);
		} else {
			Superclass = AC.Class(superclass.prototype);
		}
		Superclass.__shouldInitialize = false;
		// Prototype chain to Superclass
		ACGeneratedClass.prototype = new Superclass();
		// Extend prototype on constructor with provided properties
		AC.Object.extend(ACGeneratedClass.prototype, prototypeObj);
		// Set up $super for methods that take it
		AC.Class.__wrapSuperMethods(ACGeneratedClass);
	} else {
		ACGeneratedClass.prototype = prototypeObj;
	}
	ACGeneratedClass.sharedInstance = function () {
		if (!ACGeneratedClass._sharedInstance) {
			ACGeneratedClass._sharedInstance = new ACGeneratedClass();
			ACGeneratedClass._sharedInstance._parentClass = ACGeneratedClass;
		}
		return ACGeneratedClass._sharedInstance;
	};
	// fill in missing accessors
	AC.Object.synthesize(ACGeneratedClass.prototype);
	// Look for autocreate flag
	ACGeneratedClass.autocreate = prototypeObj.__instantiateOnDOMReady || false;
	delete prototypeObj.__instantiateOnDOMReady;
	// Create a shared instance of this class on DOM ready.
	if (ACGeneratedClass.autocreate) {
		AC.onDOMReady(function () {
			// <code>autocreate</code> property can change between execution and DOMReady, so read it again.
			if (ACGeneratedClass.autocreate) {
				ACGeneratedClass.sharedInstance();
			}
		});
	}
	return ACGeneratedClass;
};
AC.Class.__wrapSuperMethods = function (ACGeneratedClass) {
	var proto = ACGeneratedClass.prototype;
	var superProto = ACGeneratedClass.__superclass.prototype;
	var property;
	// Loop through proto
	for (property in proto) {
		if (proto.hasOwnProperty(property)) {
			if (typeof proto[property] === 'function') {
				// Get the parameter keys for this method. If the first is $super, let’s wrap it up!
				var nestedMethod = proto[property];
				var paramNames = AC.Function.getParamNames(nestedMethod);
				// If the first arg is called '$super'
				if (paramNames[0] === '$super') {
					// Overwrite the method on the prototype
					proto[property] = (function (property, nestedMethod) {
						var $super = superProto[property];
						// Create closure that holds onto the value of $super
						return function superMethodWrapper() {
							var args = AC.Array.toArray(arguments);
							return nestedMethod.apply(this, [$super.bind(this)].concat(args));
						};
					// These variables will be overwritten in the scope of the for loop.
					// Pass them to the anonymous function to preserve their value at this time
					}(property, nestedMethod));
				}
			}
		}
	}
	return this;
};
AC.Class.Invalidate = function () {
	return false;
};
AC.namespace('AC.Ajax');
AC.Ajax.getTransport = function () {
	var request = false;
	try {
		request = new XMLHttpRequest();
	} catch (e) { // Couln’t get standards-based object
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) { // Couldn’t get newer MS-proprietary ActiveX object
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) { // Total XMLHTTP fail
				request = false;
			}
		}
	}
	return request;
};
AC.Ajax.AjaxTracker = AC.Class();
AC.Ajax.AjaxTracker.prototype = {
	_responders: [],
	initialize: function ac_initialize() {},
	addResponder: function ac_addResponder(responder) {
		this._responders.push(responder);
	},
	removeResponder: function ac_removeResponder(responder) {
		var n = 0, length = this._responders.length;
		for (n = 0; n < length; n += 1) {
			if (this._responders[n] === responder) {
				responder = null;
				this._responders.splice(n, 1);
				return true;
			}
		}
		return false;
	}
};
AC.Ajax.AjaxRequest = AC.Class();
AC.Ajax.AjaxRequest.prototype = {
	__defaultOptions: {
		method: 'get'
	},
	initialize: function ac_initialize(url, options) {
		this._transport = AC.Ajax.getTransport();
		this._mimeTypeOverride = null;
		this._options = null;
		AC.Object.synthesize(this);
		this.setOptions(AC.Object.extend(AC.Object.clone(this.__defaultOptions), options || {}));
		AC.Ajax.AjaxTracker.sharedInstance().addResponder(this);
		this.transport().onreadystatechange = this._handleTransportStateChange.bind(this);
		this.transport().open(this.options().method, url, true);
		this.transport().setRequestHeader('Content-Type', this.options().contentType);
		this.transport().send(null);
	},
	_handleTransportStateChange: function ac__handleTransportStateChange() {
		if (this.transport().readyState === 4) {
			var ajaxResponse = new AC.Ajax.AjaxResponse(this);
		}
	},
	overrideMimeType: function ac_overrideMimeType(overrideMimeTypeValue) {
		this._mimeTypeOverride = overrideMimeTypeValue;
		if (this.transport().overrideMimeType) {
			this.transport().overrideMimeType(overrideMimeTypeValue);
		}
	}
};
AC.Ajax.AjaxResponse = AC.Class();
AC.Ajax.AjaxResponse.prototype = {
	_request: null,
	_transport: null,
	initialize: function ac_initialize(request) {
		var complete = false,
			transport = request.transport();
		this._transport = transport;
		this._request = request;
		if (transport.readyState === 4) {
			if (transport.status >= 200 && transport.status < 300) {
				request.options().onSuccess ? request.options().onSuccess(this) : AC.Function.emptyFunction();
				complete = true;
			}
			if (transport.status >= 400 && transport.status < 500) {
				request.options().onFailure ? request.options().onFailure(this) : AC.Function.emptyFunction();
				complete = true;
			}
			if (transport.status >= 300 && transport.status < 400) {
				//redirect
				complete = true;
			}
			if ((transport.status >= 500 && transport.status < 600) || transport.status === 0) {
				request.options().onError ? request.options().onError(this) : AC.Function.emptyFunction();
				complete = true;
			}
		}
		if (complete === true) {
			request.options().onComplete ? request.options().onComplete(this) : AC.Function.emptyFunction();
			AC.Ajax.AjaxTracker.sharedInstance().removeResponder(request);
		}
	},
	responseText: function ac_responseText() {
		return this._transport.responseText;
	},
	responseXML: function ac_responseXML() {
		return this._transport.responseXML;
	},
	responseJSON: function ac_responseJSON() {
		return JSON.parse ? JSON.parse(this._transport.responseText) : (new Function('return ' + this._transport.responseText)());
	}
};
AC.Ajax.checkURL = function (url, callback) {
	var transport = AC.Ajax.getTransport();
	transport.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (typeof callback === 'function') {
				// True if the file exists, false otherwise
				callback(this.status === 200);
			}
		}
	};
	transport.open('HEAD', url, true);
	transport.send(null);
};
AC.Ajax.AjaxRequest.prototype._overrideMimeType = null;
AC.Ajax.AjaxRequest.prototype.overrideMimeType = function (overrideMimeTypeValue) {
	this._overrideMimeType = overrideMimeTypeValue;
	if (this.transport.overrideMimeType) {
		this.transport.overrideMimeType(overrideMimeTypeValue);
	}
};
AC.namespace('AC.Environment');
AC.namespace('AC.Environment.Browser');
(function (self) {
	var __dataBrowser;
	var __dataOS;
	var __searchString;
	var __searchVersion;
	var __searchOsVersion;
	var __versionSearchString;
	__dataBrowser = [
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
		{
			string: window.navigator.userAgent,
			subString: "MSIE",
			identity: "IE",
			versionSearch: "MSIE"
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
	];
	__dataOS = [
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
	];
	__searchString = function (data) {
		var dataString;
		var dataProp;
		var i;
		for (i = 0; i < data.length; i += 1) {
			dataString = data[i].string;
			dataProp = data[i].prop;
			__versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				// If it’s a regular expression, try to match it
				if (AC.RegExp.isRegExp(data[i].subString) && !!dataString.match(data[i].subString)) {
					return data[i].identity;
				} else if (dataString.indexOf(data[i].subString) !== -1) {
					return data[i].identity;
				}
			} else if (dataProp) {
				return data[i].identity;
			}
		}
	};
	__searchVersion = function (dataString) {
		var index = dataString.indexOf(__versionSearchString);
		if (index === -1) {
			return;
		}
		return parseFloat(dataString.substring(index + __versionSearchString.length + 1));
	};
	__searchOsVersion = function (dataString) {
		var regex = new RegExp(__versionSearchString + ' ([\\d_\\.]+)', 'i');
		var version = dataString.match(regex);
		if (version === null) {
			return;
		}
		return version[1].replace(/_/g, '.');
	};
	self.name = __searchString(__dataBrowser) || undefined;
	self.version = __searchVersion(window.navigator.userAgent) || __searchVersion(window.navigator.appVersion) || undefined;
	self.os = __searchString(__dataOS) || undefined;
	self.osVersion = __searchOsVersion(window.navigator.userAgent) || __searchOsVersion(window.navigator.appVersion) || undefined;
	self.lowerCaseUserAgent = navigator.userAgent.toLowerCase();
	return self;
}(AC.Environment.Browser));
AC.Environment.Browser.isWebKit = function () {
	return !!this.lowerCaseUserAgent.match(/applewebkit/);
};
AC.namespace('AC.Environment.Feature');
(function () {
	var style = null;
	var prefixes = null;
	var preFixes = null;
	var css = null;
	AC.Environment.Feature.isCSSAvailable = function (property) {
		AC.log('AC.Environment.Feature.isCSSAvailable is deprecated. Please use AC.Environment.Feature.cssPropertyAvailable instead.');
		return this.cssPropertyAvailable(property);
	};
	AC.Environment.Feature.cssPropertyAvailable = function (property) {
		if (style === null) {
			style = document.createElement('browserdetect').style;
		}
		if (prefixes === null) {
			prefixes = ['-webkit-', '-moz-', '-o-', '-ms-', '-khtml-', ''];
		}
		if (preFixes === null) {
			preFixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml', ''];
		}
		if (css === null) {
			css = {};
		}
		property = property.replace(/([A-Z]+)([A-Z][a-z])/g, '$1\\-$2').replace(/([a-z\d])([A-Z])/g, '$1\\-$2').replace(/^(\-*webkit|\-*moz|\-*o|\-*ms|\-*khtml)\-/, '').toLowerCase();
		switch (property) {
		case 'gradient':
			if (css.gradient !== undefined) {
				return css.gradient;
			}
			property = 'background-image:';
			var value1 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
			var value2 = 'linear-gradient(left top,#9f9, white);';
			style.cssText = (property + prefixes.join(value1 + property) + prefixes.join(value2 + property)).slice(0, -property.length);
			css.gradient = (style.backgroundImage.indexOf('gradient') !== -1);
			return css.gradient;
		case 'inset-box-shadow':
			if (css['inset-box-shadow'] !== undefined) {
				return css['inset-box-shadow'];
			}
			property = 'box-shadow:';
			var value = '#fff 0 1px 1px inset;';
			style.cssText = prefixes.join(property + value);
			css['inset-box-shadow'] = (style.cssText.indexOf('inset') !== -1);
			return css['inset-box-shadow'];
		default:
			var properties = property.split('-');
			var length = properties.length;
			var Property;
			var i;
			var j;
			if (properties.length > 0) {
				property = properties[0];
				for (i = 1; i < length; i += 1) {
					property += properties[i].substr(0, 1).toUpperCase() + properties[i].substr(1);
				}
			}
			Property = property.substr(0, 1).toUpperCase() + property.substr(1);
			if (css[property] !== undefined) {
				return css[property];
			}
			for (j = preFixes.length - 1; j >= 0; j -= 1) {
				if (style[preFixes[j] + property] !== undefined || style[preFixes[j] + Property] !== undefined) {
					css[property] = true;
					return true;
				}
			}
			return false;
		}
	};
}());
AC.Environment.Feature.supportsThreeD = function () {
	AC.log('AC.Environment.Feature.supportsThreeD is deprecated. Please use AC.Environment.Feature.threeDTransformsAvailable instead.');
	return this.threeDTransformsAvailable();
};
AC.Environment.Feature.threeDTransformsAvailable = function () {
	// Memoize previously returned value
	if (typeof this._threeDTransformsAvailable !== 'undefined') {
		return this._threeDTransformsAvailable;
	}
	var div;
	try {
		this._threeDTransformsAvailable = false;
		if (window.hasOwnProperty('styleMedia')) {
			this._threeDTransformsAvailable = window.styleMedia.matchMedium('(-webkit-transform-3d)');
		} else if (window.hasOwnProperty('media')) {
			this._threeDTransformsAvailable = window.media.matchMedium('(-webkit-transform-3d)');
		}
		// chrome returns all the values as true, but doesn't actually have 3d support
		if (!this._threeDTransformsAvailable) {
			if (!document.getElementById('supportsThreeDStyle')) {
				var style = document.createElement('style');
				style.id = 'supportsThreeDStyle';
				style.textContent = '@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d) { #supportsThreeD { height:3px } }';
				document.querySelector('head').appendChild(style);
			}
			if (!(div = document.querySelector('#supportsThreeD'))) {
				div = document.createElement('div');
				div.id = 'supportsThreeD';
				document.body.appendChild(div);
			}
			this._threeDTransformsAvailable = (div.offsetHeight === 3);
		}
		return this._threeDTransformsAvailable;
	} catch (e) {
		return false;
	}
};
AC.Environment.Feature.supportsCanvas = function () {
	AC.log('AC.Environment.Feature.supportsCanvas is deprecated. Please use AC.Environment.Feature.canvasAvailable instead.');
	return this.canvasAvailable();
};
AC.Environment.Feature.canvasAvailable = function () {
	// Memoize previously returned value
	if (typeof this._canvasAvailable !== 'undefined') {
		return this._canvasAvailable;
	}
	var canvas = document.createElement('canvas');
	this._canvasAvailable = !!(typeof canvas.getContext === 'function' && canvas.getContext('2d'));
	return this._canvasAvailable;
};
AC.Environment.Feature.localStorageAvailable = function () {
	// Memoize previously returned value
	if (typeof this._localStorageAvailable !== 'undefined') {
		return this._localStorageAvailable;
	}
	try {
		if (typeof window.localStorage !== 'undefined' && typeof window.localStorage.setItem === 'function') {
			window.localStorage.setItem('ac_environment_feature', 'test');
			this._localStorageAvailable = true;
			window.localStorage.removeItem('ac_environment_feature', 'test');
		} else {
			this._localStorageAvailable = false;
		}
	} catch (e) {
		this._localStorageAvailable = false;
	}
	return this._localStorageAvailable;
};
AC.Environment.Feature.sessionStorageAvailable = function () {
	// Memoize previously returned value
	if (typeof this._sessionStorageAvailable !== 'undefined') {
		return this._sessionStorageAvailable;
	}
	try {
		if (typeof window.sessionStorage !== 'undefined' && typeof window.sessionStorage.setItem === 'function') {
			window.sessionStorage.setItem('ac_browser_detect', 'test');
			this._sessionStorageAvailable = true;
			window.sessionStorage.removeItem('ac_browser_detect', 'test');
		} else {
			this._sessionStorageAvailable = false;
		}
	} catch (e) {
		this._sessionStorageAvailable = false;
	}
	return this._sessionStorageAvailable;
};
AC.Environment.Feature.cookiesAvailable = function () {
	// Memoize previously returned value
	if (typeof this._cookiesAvailable !== 'undefined') {
		return this._cookiesAvailable;
	}
	this._cookiesAvailable = (document.hasOwnProperty('cookie') && !!navigator.cookieEnabled) ? true : false;
	return this._cookiesAvailable;
};
AC.Environment.Feature.__normalizedScreenWidth = function () {
	// We only care if the device is orientable
	if (typeof window.orientation === 'undefined') {
		return window.screen.width;
	}
	return window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
};
AC.Environment.Feature.touchAvailable = function () {
	return typeof window.ontouchstart !== 'undefined';
};
AC.Environment.Feature.isDesktop = function () {
	if (!this.touchAvailable() && !window.orientation) {
		return true;
	}
	return false;
};
AC.Environment.Feature.isHandheld = function () {
	return !this.isDesktop() && !this.isTablet();
};
AC.Environment.Feature.isTablet = function () {
	return !this.isDesktop() && this.__normalizedScreenWidth() > 480;
};
AC.Environment.Feature.isRetina = function () {
	// Vendor prefixes and media queries for DPR detection are a mess
	var mediaQueryStrings = [
		'min-device-pixel-ratio:1.5',
		'-webkit-min-device-pixel-ratio:1.5',
		'min-resolution:1.5dppx',
		'min-resolution:144dpi',
		'min--moz-device-pixel-ratio:1.5'
	];
	var i;
	// Use devicePixelRatio if available
	if (window.devicePixelRatio !== undefined) {
		if (window.devicePixelRatio >= 1.5) {
			return true;
		}
	// Else resort to matchMedia
	} else {
		for (i = 0; i < mediaQueryStrings.length; i += 1) {
			if (window.matchMedia('(' + mediaQueryStrings[i] + ')').matches === true) {
				return true;
			}
		}
	}
	// Otherwise return false
	return false;
};
AC.log = (function log() {
	var debugMessagingKey = 'f7c9180f-5c45-47b4-8de4-428015f096c0';
	var allowDebugMessaging = (AC.Environment.Feature.localStorageAvailable() && !!window.localStorage.getItem(debugMessagingKey));
	return function (message) {
		if (window.console && typeof console.log === 'function' && allowDebugMessaging) {
			console.log(message);
		}
	};
}());
AC.Registry = AC.Class();
AC.Registry.prototype = {
	__defaultOptions: {
		contextInherits: [],
		matchCatchAll: false
	},
	initialize: function ac_initialize(prefix, options) {
		if (typeof prefix !== 'string') {
			throw 'Prefix not defined for Component Registry';
		}
		// Setup options
		if (typeof options !== 'object') {
			options = {};
		}
		this._options = AC.Object.extend(AC.Object.clone(this.__defaultOptions), options);
		this._prefix = prefix;
		this._reservedNames = [];
		this.__model = [];
		this.__lookup = {};
		// Synthesize Member Data
		AC.Object.synthesize(this);
	},
	addComponent: function ac_addComponent(name, properties, qualifier, parentComponentName, context) {
		var parent = null;
		var component;
		// Make sure Component name isn’t reserved
		if (!this.__isReserved(name)) {
			// The only property that is required to create a new Component is a name
			if (typeof name === 'string') {
				// Find the parent Component instance
				if (typeof parentComponentName === 'string') {
					parent = this.lookup(parentComponentName);
				}
				// <code>_base</code> is the parent if there is no parent defined
				// Create the <code>_base</code> Component if one doesn’t exist.
				if (!parent && name !== '_base') {
					parent = this.lookup('_base') || this.addComponent('_base');
				}
				// Warn me if we are overwriting an existing Component
				if (this.lookup(name)) {
					throw 'Cannot overwrite existing Component: ' + name;
				}
				// Context inheritance
				if (typeof context !== 'object') {
					context = {};
				}
				if (typeof context.inherits === 'undefined' && Array.isArray(this._options.contextInherits)) {
					context.inherits = this._options.contextInherits;
				}
				// Create your new instance of Component and add it to the lookup
				// Add Component to the lookup table
				component = this.__lookup[name] = new AC.Registry.Component(name, properties, qualifier, parent, context);
				// Add this Component to the model
				this.__addToModel(component);
				return component;
			}
		}
		return null;
	},
	match: function ac_match(element) {
		var component;
		// Try to match against the html classname attribute on the element
		if (component = this.__matchName(element)) {
			return component;
		}
		// Try to match against the qualifiers
		if (component = this.__matchQualifier(element)) {
			return component;
		}
		if (this.options().matchCatchAll === true) {
			// Catch all (if no other types matched)
			if (typeof this.__model[1] !== 'undefined') {
				if (typeof this.__model[0] !== 'undefined') {
					return this.__model[1][0];
				} else {
					throw 'Catchall Type not defined';
				}
			} else {
				throw 'No non-_base types defined at index 1.';
			}
		}
		return null;
	},
	__matchName: function ac___matchName(element) {
		var i, ii;
		// If we don’t have an element, fail here
		if (!AC.Element.isElement(element)) {
			return null;
		}
		// Iterate through model from the index with highest specificity/level to lowest
		for (i = this.__model.length - 1; i >= 0; i--) {
			// Iterate through this level if the level is defined
			// (in chronological order of when the Component was defined)
			if (Array.isArray(this.__model[i])) {
				for (ii = this.__model[i].length - 1; ii >= 0; ii--) {
					// The first Component with a html classname attribute that matches
					if (AC.Element.hasClassName(element, this._prefix + this.__model[i][ii].name())) {
						return this.__model[i][ii];
					}
				}
			}
		}
		return null;
	},
	__matchQualifier: function ac___matchQualifier(element) {
		var i, ii;
		// If we don’t have an element, fail here
		if (!AC.Element.isElement(element)) {
			return null;
		}
		// Iterate through model from the index with highest specificity/level to lowest
		for (i = this.__model.length - 1; i >= 0; i--) {
			// Iterate through this level if the level is defined
			// (in chronological order of when the Component was defined)
			if (Array.isArray(this.__model[i])) {
				for (ii = this.__model[i].length - 1; ii >= 0; ii--) {
					// The first Component that passes a qualifier
					if (typeof this.__model[i][ii].qualifier === 'function') {
						if (this.__model[i][ii].qualifier.apply(this.__model[i][ii], [element, this._prefix]) === true) {
							return this.__model[i][ii];
						}
					}
				}
			}
		}
		return null;
	},
	__addToModel: function ac___addToModel(component) {
		if (AC.Registry.Component.isComponent(component)) {
			// If this is the first Component at this index, create a new Array in the model to store it
			if (typeof this.__model[component.level()] === 'undefined') {
				this.__model[component.level()] = [];
			}
			// Add Component to the model at your index level
			this.__model[component.level()].push(component);
		}
	},
	lookup: function ac_lookup(name) {
		if (typeof name === 'string') {
			if (typeof this.__lookup[name] !== 'undefined') {
				return this.__lookup[name];
			}
		}
		return null;
	},
	hasComponent: function ac_hasComponent(component) {
		var comparisionComponent;
		// If the component is an object and has a name
		if (typeof component === 'object' && typeof component.name === 'function') {
			// If a component exists in this Registry by that name
			if (comparisionComponent = this.lookup(component.name())) {
				return comparisionComponent === component;
			}
		}
		return false;
	},
	reserveName: function ac_reserveName(name) {
		if (typeof name === 'string') {
			if (this.lookup(name)) {
				this._reservedNames.push(name);
			} else {
				throw 'Cannot reserve name: Component with name already exists.';
			}
		} else {
			throw 'Cannot reserve name: Name must be a string';
		}
	},
	__isReserved: function ac___isReserved(name) {
		if (typeof name === 'string') {
			return (this._reservedNames.indexOf(name) !== -1);
		} else {
			throw 'Cannot check if this name is reserved because it is not a String.';
		}
	}
};
AC.Registry.Component = AC.Class();
AC.Registry.Component.prototype = {
	initialize: function ac_initialize(name, properties, qualifier, parent, context) {
		if (typeof name !== 'string') {
			throw 'Cannot create Component without a name';
		}
		this._name = name;
		this._properties = properties || {};
		this.qualifier = typeof qualifier === 'function' ? qualifier : AC.Function.emptyFunction;
		this._parent = parent;
		this._context = context || {};
		// Synthesize Member Data
		AC.Object.synthesize(this);
	},
	properties: function ac_properties() {
		var parentProperties = (typeof this._parent === 'undefined' || this._parent === null) ? {} : this._parent.properties();
		return AC.Object.extend(parentProperties, this._properties);
	},
	context: function ac_context(key) {
		// If we have a value for this key, return it.
		if (this._context[key]) {
			return this._context[key];
		// If there is no value for this key in this context, check the parent’s if that key is set to inherit
		} else if (Array.isArray(this._context.inherits) && this._context.inherits.indexOf[key] !== -1) {
			return (this.parent()) ? this.parent().context(key) : null;
		}
		return null;
	},
	level: function ac_level() {
		// Memoize level as it is not intended to change.
		if (typeof this._level !== 'undefined') {
			return this._level;
		}
		// _base is a key word that assumes level 0
		if (this._name === '_base') {
			return 0;
		// If there is no parent or if the parent is _base, assume level 1
		} else if (typeof this._parent === 'undefined' || this._parent.name() === '_base') {
			return 1;
		// Otherwise if there is a parent the level is always 1 more than the parent’s
		} else {
			return this._parent.level() + 1;
		}
	}
};
AC.Registry.Component.isComponent = function (obj) {
	return (obj instanceof AC.Registry.Component);
};
AC.namespace('AC.NotificationCenter');
AC.NotificationCenter = (function () {
	var subscribers = {};
	return {
		publish: function ac_publish(event, options, asynchronous) {
			options = options || {};
			var publish = function () {
				if ((!subscribers[event]) || subscribers[event].length < 1) {
					return;
				}
				subscribers[event].forEach(function (subscriber) {
					if (subscriber.target && options.target) {
						if (subscriber.target === options.target) {
							subscriber.callback(options.data);
						}
					} else {
						subscriber.callback(options.data);
					}
				});
			};
			// Testtool integration (if present)
			if (typeof window.testtool === 'object' && typeof testtool.publishMessage === 'function') {
				if (typeof testtool.mDefaults === 'object') {
					// Save data for use later
					testtool.mDefaults.messageData = options;
				}
				// Tell testtool it’s time to rock'n'roll!
				testtool.publishMessage(event);
			}
			if (asynchronous === true) {
				window.setTimeout(publish, 10);
			} else {
				publish();
			}
		},
		subscribe: function ac_subscribe(event, callback, target) {
			if (!subscribers[event]) {
				subscribers[event] = [];
			}
			subscribers[event].push({
				callback: callback,
				target: target
			});
		},
		unsubscribe: function ac_unsubscribe(event, callback, target) {
			subscribers[event].forEach(function (subscriber, i) {
				if (target) {
					if (callback === subscriber.callback && subscriber.target === target) {
						subscribers[event].splice(i, 1);
					}
				} else if (callback === subscriber.callback) {
					subscribers[event].splice(i, 1);
				}
			});
		},
		hasSubscribers: function ac_hasSubscribers(event, target) {
			// If there are no subscribers to event name
			if ((!subscribers[event]) || subscribers[event].length < 1) {
				return false;
			}
			if (!target) {
				return true;
			}
			subscribers[event].forEach(function (subscriber) {
				// If any subscribers have a target and we’re looking to match to a target
				if (subscriber.target && target) {
					// And if the target is what we’re trying to match
					if (subscriber.target === target) {
						return true;
					}
				}
			});
			return false;
		}
	};
}());
AC.namespace('AC.Canvas');
AC.Canvas.imageDataFromFile = function (src, callback) {
	// Callback is required
	if (typeof callback !== 'function') {
		throw 'Need callback method to call when imageData is retrieved.';
	}
	// If it’s a string, just make sure it isn’t empty
	if (typeof src !== 'string' || src === '') {
		throw 'Src for imageData must be an Image Node with a src attribute or a string.';
	}
	var img = new Image();
	img.onload = function () {
		callback(AC.Canvas.imageDataFromNode(img));
	};
	img.src = src;
};
AC.Canvas.imageDataFromNode = function (img) {
	if (!AC.Element.isElement(img) || img.getAttribute('src') === 'null' || img.width === 0) {
		throw 'Source node must be an IMG tag and must have already loaded.';
	}
	var imageData;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	canvas.width = img.width;
	canvas.height = img.height;
	context.drawImage(img, 0, 0);
	imageData = context.getImageData(0, 0, img.width, img.height);
	return imageData;
};
AC.EasingFunctions = {
	linear: function ac_linear(time, begin, change, duration) {
		return change * time / duration + begin;
	},
	easeInQuad: function ac_easeInQuad(time, begin, change, duration) {
		return change * (time /= duration) * time + begin;
	},
	easeOutQuad: function ac_easeOutQuad(time, begin, change, duration) {
		return -change * (time /= duration) * (time - 2) + begin;
	},
	easeInOutQuad: function ac_easeInOutQuad(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time + begin;
		return -change / 2 * ((--time) * (time - 2) - 1) + begin;
	},
	easeInCubic: function ac_easeInCubic(time, begin, change, duration) {
		return change * (time /= duration) * time * time + begin;
	},
	easeOutCubic: function ac_easeOutCubic(time, begin, change, duration) {
		return change * ((time = time / duration - 1) * time * time + 1) + begin;
	},
	easeInOutCubic: function ac_easeInOutCubic(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time * time + begin;
		return change / 2 * ((time -= 2) * time * time + 2) + begin;
	},
	easeInQuart: function ac_easeInQuart(time, begin, change, duration) {
		return change * (time /= duration) * time * time * time + begin;
	},
	easeOutQuart: function ac_easeOutQuart(time, begin, change, duration) {
		return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
	},
	easeInOutQuart: function ac_easeInOutQuart(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time * time * time + begin;
		return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
	},
	easeInQuint: function ac_easeInQuint(time, begin, change, duration) {
		return change * (time /= duration) * time * time * time * time + begin;
	},
	easeOutQuint: function ac_easeOutQuint(time, begin, change, duration) {
		return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
	},
	easeInOutQuint: function ac_easeInOutQuint(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time * time * time * time + begin;
		return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
	},
	easeInSine: function ac_easeInSine(time, begin, change, duration) {
		return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
	},
	easeOutSine: function ac_easeOutSine(time, begin, change, duration) {
		return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
	},
	easeInOutSine: function ac_easeInOutSine(time, begin, change, duration) {
		return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
	},
	easeInExpo: function ac_easeInExpo(time, begin, change, duration) {
		return (time == 0) ? begin : change * Math.pow(2, 10 * (time / duration - 1)) + begin;
	},
	easeOutExpo: function ac_easeOutExpo(time, begin, change, duration) {
		return (time == duration) ? begin + change : change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
	},
	easeInOutExpo: function ac_easeInOutExpo(time, begin, change, duration) {
		if (time == 0) return begin;
		if (time == duration) return begin + change;
		if ((time /= duration / 2) < 1) return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
		return change / 2 * (-Math.pow(2, -10 * --time) + 2) + begin;
	},
	easeInCirc: function ac_easeInCirc(time, begin, change, duration) {
		return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + begin;
	},
	easeOutCirc: function ac_easeOutCirc(time, begin, change, duration) {
		return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
	},
	easeInOutCirc: function ac_easeInOutCirc(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
		return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
	},
	easeInElastic: function ac_easeInElastic(time, begin, change, duration) {
		var shootover = 1.70158;
		var period = 0;
		var amplitude = change;
		if (time == 0) return begin;
		if ((time /= duration) == 1) return begin + change;
		if (!period) period = duration * .3;
		if (amplitude < Math.abs(change)) {
			amplitude = change;
			var shootover = period / 4;
		}
		else var shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
		return -(amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
	},
	easeOutElastic: function ac_easeOutElastic(time, begin, change, duration) {
		var shootover = 1.70158;
		var period = 0;
		var amplitude = change;
		if (time == 0) return begin;
		if ((time /= duration) == 1) return begin + change;
		if (!period) period = duration * .3;
		if (amplitude < Math.abs(change)) {
			amplitude = change;
			var shootover = period / 4;
		}
		else var shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
		return amplitude * Math.pow(2, -10 * time) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) + change + begin;
	},
	easeInOutElastic: function ac_easeInOutElastic(time, begin, change, duration) {
		var shootover = 1.70158;
		var period = 0;
		var amplitude = change;
		if (time == 0) return begin;
		if ((time /= duration / 2) == 2) return begin + change;
		if (!period) period = duration * (.3 * 1.5);
		if (amplitude < Math.abs(change)) {
			amplitude = change;
			var shootover = period / 4;
		}
		else var shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
		if (time < 1) return -.5 * (amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
		return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) * .5 + change + begin;
	},
	easeInBack: function ac_easeInBack(time, begin, change, duration, shootover) {
		if (shootover == undefined) shootover = 1.70158;
		return change * (time /= duration) * time * ((shootover + 1) * time - shootover) + begin;
	},
	easeOutBack: function ac_easeOutBack(time, begin, change, duration, shootover) {
		if (shootover == undefined) shootover = 1.70158;
		return change * ((time = time / duration - 1) * time * ((shootover + 1) * time + shootover) + 1) + begin;
	},
	easeInOutBack: function ac_easeInOutBack(time, begin, change, duration, shootover) {
		if (shootover == undefined) shootover = 1.70158;
		if ((time /= duration / 2) < 1) return change / 2 * (time * time * (((shootover *= (1.525)) + 1) * time - shootover)) + begin;
		return change / 2 * ((time -= 2) * time * (((shootover *= (1.525)) + 1) * time + shootover) + 2) + begin;
	},
	easeInBounce: function ac_easeInBounce(time, begin, change, duration) {
		return change - AC.EasingFunctions.easeOutBounce(duration - time, 0, change, duration) + begin;
	},
	easeOutBounce: function ac_easeOutBounce(time, begin, change, duration) {
		if ((time /= duration) < (1 / 2.75)) {
			return change * (7.5625 * time * time) + begin;
		} else if (time < (2 / 2.75)) {
			return change * (7.5625 * (time -= (1.5 / 2.75)) * time + .75) + begin;
		} else if (time < (2.5 / 2.75)) {
			return change * (7.5625 * (time -= (2.25 / 2.75)) * time + .9375) + begin;
		} else {
			return change * (7.5625 * (time -= (2.625 / 2.75)) * time + .984375) + begin;
		}
	},
	easeInOutBounce: function ac_easeInOutBounce(time, begin, change, duration) {
		if (time < duration / 2) return AC.EasingFunctions.easeInBounce(time * 2, 0, change, duration) * .5 + begin;
		return AC.EasingFunctions.easeOutBounce(time * 2 - duration, 0, change, duration) * .5 + change * .5 + begin;
	}
};
AC.DeferredQueue = AC.Class({
	__defaultOptions: {
		autoplay: false,
		asynchronous: false,
		delay: 0
	},
	initialize: function ac_initialize(options) {
		// Setup options
		if (typeof options !== 'object') {
			options = {};
		}
		this._options = AC.Object.extend(AC.Object.clone(this.__defaultOptions), options);
		this._isPlaying = false;
		this._isRunningAction = false;
		this._queue = [];
		// Make sure didFinish is always bound correctly
		this.didFinish = this.__didFinish.bind(this);
		// Synthesize Member Data
		AC.Object.synthesize(this);
	},
	add: function ac_add(action) {
		if (typeof action !== 'function') {
			throw 'Deferred Queue action must be a function.';
		}
		// Add to end of the queue
		this.queue().push(action);
		// Autoplay if applicable
		if (!this.isPlaying() && this.options().autoplay === true) {
			this.start();
		}
	},
	remove: function ac_remove(action) {
		this.setQueue(AC.Array.without(this.queue(), action));
	},
	start: function ac_start() {
		if (this.isPlaying()) {
			return false;
		}
		this.setIsPlaying(true);
		this.__runNextAction();
	},
	stop: function ac_stop() {
		if (!this.isPlaying()) {
			return false;
		}
		this.setIsPlaying(false);
	},
	clear: function ac_clear() {
		this.setQueue([]);
		this.stop();
	},
	__didFinish: function ac___didFinish() {
		this.setIsRunningAction(false);
		this.__runNextAction();
	},
	__runNextAction: function ac___runNextAction() {
		var self = this;
		// Must be running to run next
		if (!this.isPlaying()) {
			return false;
		}
		// Make sure that our queue has stuff in it and we’re not waiting for a didFinish
		if (this.queue().length && !this.isRunningAction()) {
			// Get the next action at the front of the queue
			var action = this.queue().shift();
			// Validate it a bit
			if (typeof action === 'function') {
				// Run the action
				action();
				// Don’t allow us to run two at the same time
				if (this.options().asynchronous === true) {
					this.setIsRunningAction(true);
				// If we’re synchronous, keep running!
				} else {
					// Run with optional delay
					if (typeof this.options().delay === 'number' && this.options().delay > 0) {
						window.setTimeout(function () {
							self.__runNextAction();
						}, this.options().delay * 1000);
					} else {
						this.__runNextAction();
					}
				}
			// If that one was a dud, move on!
			} else {
				this.__runNextAction();
			}
		}
	}
});
AC.namespace('AC.Viewport');
AC.Viewport.scrollOffsets = function () {
	return {
		x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
	};
}
;
AC.version = '1.4.1';
