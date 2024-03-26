/* ---- BUILT FILE. DO NOT MODIFY THIS DIRECTLY. ---- */


AC.Retina = AC.Class();
AC.Retina.prototype = {
	__defaultOptions: {
		attribute: 'data-hires',
		recursive: true,
		queueSize: 8,
		publishNotifications: true
	},
	initialize: function ac_initialize(options) {
		// Define properties
		this._benchmarkTimer = new Date();
		this._options = {};
		this._globalBlacklist = null;
		this._tagNameBlacklist = null;
		this._images = [];
		this._paused = false;
		this._deferredQueue = null;
		// Create queue array
		this.__queues = [];
		// Add synthesizer methods
		AC.Object.synthesize(this);
		// Setup options
		if (typeof options !== 'object') {
			options = {};
		}
		this.setOptions(AC.Object.extend(AC.Object.clone(this.__defaultOptions), options));
		// Globally blacklist based on Device or Browser and Version
		this.__setupGlobalBlacklists();
		if (!AC.Retina.Debug && this.globalBlacklist().isBlacklisted()) {
			this.replace = AC.Function.emptyFunction;
			return false;
		}
		// Set up the shared instance of AC.Registry that represents AC.Retina.Image Components.
		if (typeof AC.Retina.imageComponentRegistry === 'undefined') {
			AC.Retina.imageComponentRegistry = new AC.Registry(AC.Retina.classNamePrefix());
		}
		// Set up mediaQueryList listener, which listens for when the DPR changes
		this.__listenToMediaQueryChange();
		// Prioritize images on window load
		// (not on DOM ready because we don’t want this to affect perceived page load time in the progress bar)
		if (AC.Retina.windowHasLoaded) {
			this.__setup();
		} else {
			var setup = this.__setup.bind(this);
			AC.Element.addEventListener(window, 'load', setup);
		}
	},
	shouldReplace: function ac_shouldReplace(input, src, options) {
		var component;
		var blacklist;
		var image = new AC.Retina.Image(null, options);
		// Optional input argument is deprecated in AC.Retina 3.0 +
		if (typeof input === 'undefined') {
			try { console.warn('AC.Retina.shouldReplace() expects an argument.'); } catch (e) {}
		}
		// Try global blacklist first
		if (!this.globalBlacklist().isBlacklisted()) {
			// If String is passed
			if (typeof input === 'string') {
				component = AC.Retina.imageComponentRegistry.lookup(input);
			// If Component is passed and is registered in this Registry
			} else if (AC.Element.isElement(input)) {
				component = AC.Retina.imageComponentRegistry.match(input);
			// If Component is passed and is registered in this Registry
			} else if (input !== null && typeof input === 'object' && AC.Retina.imageComponentRegistry.hasComponent(input)) {
				component = input;
			// Default is 'img-tag'
			} else {
				component = AC.Retina.imageComponentRegistry.lookup('img-tag');
			}
			// Set image source to src provided
			image.setSrc(src || '/global/elements/blank.gif');
			image.setComponent(component);
			if (component !== null && typeof component === 'object' && typeof component.context === 'function') {
				blacklist = component.context('blacklist');
				if (blacklist && typeof blacklist === 'object') {
					return !blacklist.isBlacklisted(null, image);
				}
			}
		}
		return false;
	},
	bestSrc: function ac_bestSrc(src, component, checkExistsCallback, options) {
		// src is required.
		if (typeof src !== 'string') {
			throw 'Need a source string to get hires src.';
		}
		// Create temporary Image instance
		var image = new AC.Retina.Image(null, options);
		// Lookup component by string
		if (typeof component === 'string') {
			component = AC.Retina.imageComponentRegistry.lookup(component);
		}
		// Default is 'img-tag'
		if (component === null || !(typeof component === 'object' && AC.Retina.imageComponentRegistry.hasComponent(component))) {
			component = AC.Retina.imageComponentRegistry.lookup('img-tag');
		}
		// Set image source to src provided
		image.setSrc(src);
		image.setComponent(component);
		if (typeof checkExistsCallback === 'function') {
			image.checkExists(checkExistsCallback, src);
		}
		if (!image.isHires() && !image.ignored() && this.shouldReplace(component, src, component)) {
			return image.hiresSrc();
		} else {
			return src;
		}
	},
	replace: function ac_replace(scopeElement, parent) {
		// Memoize bound addToQueue
		if (typeof this.__boundAddToQueue === 'undefined') {
			this.__boundAddToQueue = this.__addToQueue.bind(this);
		}
		var denotedElements;
		// Accepts IDs or Element instances
		scopeElement = AC.Element.getElementById(scopeElement);
		parent = AC.Element.getElementById(parent);
		if (!AC.Element.isElement(scopeElement)) {
			throw 'Cannot replace content because scopeElement is not valid';
		}
		// Get the elements with
		denotedElements = this.__findDenotedElements(scopeElement, parent);
		// If there are no denotedElements, then there is nothing to replace
		if (denotedElements.length < 1) {
			return;
		}
		// Find images that have data-hires="true" to process them first
		this.__filterDenotedImages(denotedElements);
		// Find child elements (if applicable) to filter out images that need to be replaced
		this.__filterChildImages(denotedElements);
		// Replace images with their higher-res counterparts.
		this.__replaceQueues();
	},
	paused: function ac_paused() {
		// If deferredQueue is not undefined or null. Set to null after it is ran.
		if (this._paused === true && !this.deferredQueue()) {
			this.setDeferredQueue(new AC.DeferredQueue());
		}
		return this._paused;
	},
	pause: function ac_pause() {
		if (this.paused()) {
			return;
		}
		this.setPaused(true);
	},
	resume: function ac_resume() {
		if (!this.paused()) {
			return;
		}
		this.setPaused(false);
		if (this.deferredQueue()) {
			// Run queue (which is synchronous)
			this.deferredQueue().start();
			// Reset queue to null
			this.setDeferredQueue(null);
		}
	},
	publishNotification: function ac_publishNotification(event, data) {
		if (typeof AC.NotificationCenter === 'object' && this.options().publishNotifications === true) {
			AC.NotificationCenter.publish(AC.Retina.classNamePrefix() + event, {
				target: this,
				data: data
			});
		}
	},
	subscribeToNotification: function ac_subscribeToNotification(event, callback) {
		if (typeof AC.NotificationCenter === 'object' && this.options().publishNotifications === true) {
			AC.NotificationCenter.subscribe(AC.Retina.classNamePrefix() + event, callback, this);
		}
	}
};
AC.Retina.rasterImageFormatRegExp = function () {
	return AC.Retina._rasterImageFormatRegExp;
};
AC.Retina._rasterImageFormatRegExp = /(\.jpg($|#.*|\?.*)|\.png($|#.*|\?.*)|\.gif($|#.*|\?.*))/;
AC.Retina.devicePixelRatio = function () {
	if (typeof AC.Retina._devicePixelRatio !== 'undefined') {
		return AC.Retina._devicePixelRatio;
	}
	var matches = false;
	var mql = null;
	// Use MediaQueryList if applicable.
	// If we understand matchMedia and a DPR-related media query
	if (AC.Retina.minDPRMediaQuery() !== null) {
		// See if we’re on a screen that matches our media query
		mql = window.matchMedia('(' + AC.Retina.minDPRMediaQuery() + ': ' + AC.Retina.minDPR() + ')');
		matches = mql.matches;
	}
	// If matchMedia didn’t work
	if (mql === null) {
		matches = (typeof window.devicePixelRatio !== 'undefined' && window.devicePixelRatio >= AC.Retina.minDPR());
	}
	// Assume that any DPR > 1.5 is === 2 (for final naming consistency)
	if (AC.Retina.Debug || matches === true) {
		AC.Retina._devicePixelRatio = 2;
	} else {
		AC.Retina._devicePixelRatio = 1;
	}
	return AC.Retina._devicePixelRatio;
};
AC.Retina.minDPRMediaQuery = function () {
	if (typeof AC.Retina._minDPRMediaQuery !== 'undefined') {
		return AC.Retina._minDPRMediaQuery;
	}
	// Possible values for device pixel ratio media queries
	var mqlTestStrings = [
		        'min-device-pixel-ratio',
		'-webkit-min-device-pixel-ratio',
		   'min--moz-device-pixel-ratio',
		     '-o-min-device-pixel-ratio'
	];
	var i;
	var mql;
	if (typeof window.matchMedia !== 'undefined') {
		for (i = 0; i < mqlTestStrings.length; i += 1) {
			// Try each media query with a min DPR of 0 and see if we get any takers
			mql = window.matchMedia('(' + mqlTestStrings[i] + ': 0)');
			if (mql.matches === true) {
				AC.Retina._minDPRMediaQuery = mqlTestStrings[i];
				return AC.Retina._minDPRMediaQuery;
			}
		}
	}
	AC.Retina._minDPRMediaQuery = null;
	return AC.Retina._minDPRMediaQuery;
};
AC.Retina.classNamePrefix = function () {
	return AC.Retina._classNamePrefix;
};
AC.Retina._classNamePrefix = 'ac-retina-';
AC.Retina.minDPR = function () {
	return AC.Retina._minDPR;
};
AC.Retina._minDPR = 1.5;
AC.Retina.windowHasLoaded = false;
AC.Element.addEventListener(window, 'load', function () {
	AC.Retina.windowHasLoaded = true;
});
AC.Retina.iOSHandheld = function () {
	AC.log('AC.Retina.iOSHandheld is deprecated. For use outside of AC.Retina, use AC.Environment methods instead.');
	return AC.Retina.Blacklist.Qualifiers.iOSHandheld();
};
AC.Object.extend(AC.Retina.prototype, {
	__setupGlobalBlacklists: function ac___setupGlobalBlacklists() {
		this.setGlobalBlacklist(new AC.Retina.Blacklist([AC.Retina.Blacklist.Qualifiers.iOSHandheld, AC.Retina.Blacklist.Qualifiers.antiquatedBrowser]));
		// Tag name blacklist is separate because it errors out tree walker
		this.setTagNameBlacklist(new AC.Retina.Blacklist([AC.Retina.Blacklist.Qualifiers.restrictedTagName]));
	},
	__listenToMediaQueryChange: function ac___listenToMediaQueryChange() {
		var self = this;
		var mql;
		var onDPRChange = function () {
			// Only matters if we do match media query
			if (mql.matches === true) {
				// Invalidate the devicePixelRatio
				delete AC.Retina._devicePixelRatio;
				// Make sure window has loaded. If it hasn’t, then we’re already going to replace the body
				if (AC.Retina.windowHasLoaded) {
					self.replace(document.body);
				}
				mql.removeListener(onDPRChange);
			}
		};
		// If our browser understands a min-DPR media query and isn’t already high enough to replace
		if (AC.Retina.devicePixelRatio() < AC.Retina.minDPR() && AC.Retina.minDPRMediaQuery() !== null) {
			// Create a MediaQueryList to reflect that media query.
			mql = window.matchMedia('(' + AC.Retina.minDPRMediaQuery() + ': ' + AC.Retina.minDPR() + ')');
			if (typeof mql.addListener === 'function' && mql.matches === false) {
				mql.addListener(onDPRChange);
			}
		}
	},
	__setup: function ac___setup() {
		// Get all relevant elements and prioritize, then queue
		// Replace images with their high-res counterparts.
		this.replace(document.body);
	},
	__findDenotedElements: function ac___findDenotedElements(scopeElement, parent) {
		// Get the elements with data-hires="true"
		var denotedElements = this.__denotedElements(scopeElement);
		// If there is a parent defined, we assume the content we are replacing is not yet in the DOM, but will be soon inside of the parent.
		// If the parent has the attribute, then let's handle the content as if it did as well.
		if (AC.Element.isElement(parent)) {
			if (AC.Retina.__isRecursivelyDenoted(parent, this.options().attribute)) {
				denotedElements.push(scopeElement);
			}
		// Used if we call AC.Retina.sharedInstance().replace() and provide a scope element that it not in the DOM
		} else if (AC.Retina.__nearestAncestorHasAttribute(scopeElement, this.options().attribute, 'true')) {
			denotedElements.push(scopeElement);
		}
		this.publishNotification('foundDenotedElements', denotedElements);
		return denotedElements;
	},
	__filterDenotedImages: function ac___filterDenotedImages(denotedElements) {
		// Queue elements that have the data-hires attribute directly on them separately. They are considered the highest priority.
		var filteredDenotedElements = this.__filterElements(denotedElements);
		this.publishNotification('filteredDenotedImages', filteredDenotedElements);
		// If there are any denotedElements that are also images that should be replaced, then add them to the queue.
		if (filteredDenotedElements.length > 0) {
			filteredDenotedElements.forEach(this.__boundAddToQueue);
			this.publishNotification('queuedDenotedImages', this.__queues[this.__queues.length - 1]);
		}
	},
	__filterChildImages: function ac___filterChildImages(denotedElements) {
		var filteredChildElements;
		var i;
		// Search recursively through the denoted elements for children that need to be replaced
		if (this.options().recursive === true) {
			for (i = 0; i < denotedElements.length; i += 1) {
				// Note: Elements that are valid Images with the data-hires attr directly on them will already be in a queue and will be filtered out here.
				// Non-image elements are already filtered out
				filteredChildElements = this.__imagesWithinElement(denotedElements[i]);
				this.publishNotification('filteredChildImages', filteredChildElements);
				if (filteredChildElements.length > 0) {
					// Create a queue for each set of children, then add elements to them
					this.__createQueue();
					filteredChildElements.forEach(this.__boundAddToQueue);
					this.publishNotification('queuedChildImages', this.__queues[this.__queues.length - 1]);
				}
			}
		}
	},
	__createQueue: function ac___createQueue() {
		var queue = new AC.Retina.Queue(this.options().queueSize);
		this.__queues.push(queue);
	},
	__addToQueue: function ac___addToQueue(image) {
		// If there is no current Queue, then create one and add this image to it!
		if (this.__queues.length === 0 || this.__queues[this.__queues.length - 1].ran() === true) {
			this.__createQueue();
		}
		// Add this image to the last queue.
		this.__queues[this.__queues.length - 1].add(image);
	},
	__isInQueue: function ac___isInQueue(image) {
		var i;
		for (i = 0; i < this.__queues.length; i += 1) {
			if (this.__queues[i].queue().indexOf(image) !== -1) {
				return true;
			}
		}
		return false;
	},
	__denotedElements: function ac___denotedElements(scopeElement) {
		if (typeof scopeElement === 'undefined') {
			scopeElement = document.body;
		} else {
			scopeElement = AC.Element.getElementById(scopeElement);
		}
		// Get elements that we’re told should be considered.
		var denotedElements = AC.Element.selectAll('[' + this.options().attribute + '="true"]', scopeElement);
		return denotedElements;
	},
	__imagesWithinElement: function ac___imagesWithinElement(scopeElement) {
		var isImageToReplace = this.__filterElement.bind(this);
		var tagNameBlacklist = this.tagNameBlacklist();
		var elements = [];
		var acceptNode;
		var treeWalker;
		// Make sure scopeElement is an Element instance
		scopeElement = AC.Element.getElementById(scopeElement);
		// Filter for treeWalker
		acceptNode = function acceptNode(node) {
			if (!tagNameBlacklist.isBlacklisted(node) && isImageToReplace(node)) {
				return NodeFilter.FILTER_ACCEPT;
			}
			return NodeFilter.FILTER_SKIP;
		};
		// For cross-browser compatibility, spec expects method called acceptNode on filter Object, but some browsers try to execute directly.
		// More info: http://stackoverflow.com/questions/5982648/recommendations-for-working-around-ie9-treewalker-filter-bug
		acceptNode.acceptNode = acceptNode;
		// Create tree walker and add nodes to array
		treeWalker = document.createTreeWalker(scopeElement, NodeFilter.SHOW_ELEMENT, acceptNode, false);
		while (treeWalker.nextNode()) {
			if (AC.Retina.Image.isImage(treeWalker.currentNode.ac_retina_image)) {
				elements.push(treeWalker.currentNode.ac_retina_image);
			}
		}
		return elements;
	},
	__filterElements: function ac___filterElements(arr) {
		var i;
		var filteredArr = [];
		for (i = 0; i < arr.length; i += 1) {
			if (this.__filterElement(arr[i])) {
				filteredArr.push(arr[i].ac_retina_image);
			}
		}
		return filteredArr;
	},
	__filterElement: function ac___filterElement(element) {
		var image = element.ac_retina_image;
		var options;
		// If the element is not denoted for replacement by the attribute or by the nearest ancestor with
		// the attribute set to true, then stop here.
		if (!AC.Retina.__isRecursivelyDenoted(element, this.options().attribute)) {
			return false;
		}
		// If there isn’t already an Image instance for this Element, or if last time we checked it, it wasn’t an image
		if (AC.Retina.Image.isImage(image) === false) {
			options = this.__optionsFromElement(element);
			image = new AC.Retina.Image(element, options);
			element.ac_retina_image = image;
		// If we’re replaced already, then all bets are off.
		} else if (image.replaced()) {
			return false;
		}
		// Set up component (can change over course of image existing)
		if (this.__matchComponentToElement(element) === false) {
			return false;
		}
		// If image should not be filtered out based on hires status, ignore status, or blacklisting
		if (this.__filterImage(image)) {
			this.images().push(image);
			return true;
		}
		return false;
	},
	__matchComponentToElement: function ac___matchComponentToElement(element) {
		var image = element.ac_retina_image;
		var component;
		if (AC.Retina.Image.isImage(image) === false) {
			throw 'Element is missing AC.Retina.Image object.';
		}
		// Try to match this element to a Component
		// We can match to a different component if we are re-assessed and have not yet been replaced
		component = AC.Retina.imageComponentRegistry.match(element);
		// If we matched a component
		if (component && component.name() !== '_base') {
			// Set our status. If we matched any component, then we are some kind of Image
			image.setStatus('is-image');
			// Assign our Image that component
			image.setComponent(component);
			return true;
		} else {
			image.setStatus('not-image');
			// Return false because this element does not contain image content
			return false;
		}
	},
	__filterImage: function ac___filterImage(image) {
		var blacklist;
		if (AC.Retina.Image.isImage(image) === false) {
			throw 'Element is missing AC.Retina.Image object.';
		}
		// Return if this element is already hires
		if (image.isHires()) {
			image.setStatus('already-hires');
			return false;
		}
		// Return if this Image is ignored
		if (image.ignored()) {
			image.setStatus('ignored');
			return false;
		}
		// Get access to our blacklist
		// the context method takes into account context inheritance
		blacklist = image.component().context('blacklist');
		// Return if this element is blacklisted (meaning the element contains image content, but the environment is not appropriate for it to be hi-res)
		if (AC.Retina.Blacklist.isBlacklist(blacklist) && blacklist.isBlacklisted(image.element(), image)) {
			image.setStatus('blacklisted');
			return false;
		}
		return true;
	},
	__optionsFromElement: function ac___optionsFromElement(element) {
		var options = {};
		var dataAttributeOptions = element.getAttribute(this.options().attribute + '-options');
		var i;
		if (dataAttributeOptions) {
			// Split each comma-separated option
			dataAttributeOptions = dataAttributeOptions.split(',');
			for (i = 0; i < dataAttributeOptions.length; i += 1) {
				// Split each option into key and value pairs
				dataAttributeOptions[i] = dataAttributeOptions[i].split(':');
				// Extend the options object with this value
				options[dataAttributeOptions[i][0]] = dataAttributeOptions[i][1];
				// Convert to float or boolean if applicable
				try {
					options[dataAttributeOptions[i][0]] = JSON.parse(options[dataAttributeOptions[i][0]]);
				} catch (e) {}
				// Allow either - or camelCase syntax
				options[dataAttributeOptions[i][0].camelize()] = options[dataAttributeOptions[i][0]];
			}
		}
		return options;
	},
	__replaceQueues: function ac___replaceQueues() {
		if (typeof this.__boundReplaceQueues !== 'function') {
			this.__boundReplaceQueues = this.__replaceQueues.bind(this);
		}
		var queue;
		if (this.__queues.length > 0) {
			// Remove the queue that we are replacing from the list of active queues
			queue = this.__queues[0];
			this.__queues.splice(0, 1);
			// Replace the next queue, then run replace again until there are no more queues
			queue.run('replace', this.__boundReplaceQueues);
		}
	}
});
AC.Retina.__isRecursivelyDenoted = function (element, attr) {
	if (
		// If the element has the attribute set to true
		(element.getAttribute(attr) === 'true') ||
		// If the element does not have the attribute set to false and the nearest parent with the attribute
		// has it set to true.
		(AC.Retina.__nearestAncestorHasAttribute(element, attr, 'true') && element.getAttribute(attr) !== 'false')
	) {
		return true;
	}
	return false;
};
AC.Retina.__nearestAncestorHasAttribute = function (element, attr, value) {
	var ancestors = AC.Retina.__ancestors(element);
	var i;
	for (i = 0; i < ancestors.length; i += 1) {
		if (ancestors[i].hasAttribute(attr)) {
			if (typeof value === 'undefined' || ancestors[i].getAttribute(attr) === value) {
				return ancestors[i];
			} else {
				return null;
			}
		}
	}
	return null;
};
AC.Retina.__ancestors = function (element) {
	element = AC.Element.getElementById(element);
	var elements = [];
	if (AC.Element.isElement(element.parentNode)) {
		while (element = element.parentNode) {
			if (AC.Element.isElement(element)) {
				elements.push(element);
			}
		}
	}
	return elements;
};
AC.Retina.Blacklist = AC.Class();
AC.Retina.Blacklist.prototype = {
	initialize: function ac_initialize(qualifier) {
		// Define properties
		this._qualifiers = [];
		// Synthesize Member Data
		AC.Object.synthesize(this);
		// If there are initial qualifier methods to add, do so.
		if (typeof qualifier !== 'undefined') {
			this.addQualifier(qualifier);
		}
	},
	addQualifier: function ac_addQualifier(qualifier) {
		var i;
		// If it’s a function, add it to the stack
		if (typeof qualifier === 'function') {
			this.qualifiers().push(qualifier);
		// If it’s an Array of functions, add each one to the stack (in order).
		} else if (Array.isArray(qualifier) && qualifier.length > 0) {
			for (i = 0; i < qualifier.length; i++) {
				this.addQualifier(qualifier[i]);
			}
		}
	},
	isBlacklisted: function ac_isBlacklisted(obj, boundTo) {
		var i;
		for (i = 0; i < this.qualifiers().length; i++) {
			if (this.qualifiers()[i].call(boundTo || this, obj)) {
				return true;
			}
		}
		return false;
	}
};
AC.Retina.Blacklist.isBlacklist = function (obj) {
	return (obj instanceof AC.Retina.Blacklist);
};
AC.Retina.Blacklist.Qualifiers = {};
AC.Retina.Blacklist.Qualifiers.DPRLessThanMinAndNotSVG = function (element) {
	return (this.options().hiresFormat !== 'svg') && (AC.Retina.devicePixelRatio() < AC.Retina.minDPR());
};
AC.Retina.Blacklist.Qualifiers.iOSHandheld = function () {
	return (AC.Environment.Feature.isHandheld() && AC.Environment.Browser.os === 'iOS');
};
AC.Retina.Blacklist.Qualifiers.antiquatedBrowser = function () {
	if (
		// Safari and Safari Mobile < Version 5.0
		((AC.Environment.Browser.name.indexOf('Safari') !== -1) && (AC.Environment.Browser.version < 5)) ||
		// Internet Explorer < Version 9
		((AC.Environment.Browser.name === 'IE') && (AC.Environment.Browser.version < 9)) ||
		// Firefox < Version 5
		((AC.Environment.Browser.name === 'Firefox') && (AC.Environment.Browser.version < 5)) ||
		// Chrome < Version 16
		((AC.Environment.Browser.name === 'Chrome') && (AC.Environment.Browser.version < 16))
	) {
		return true;
	}
	return false;
};
AC.Retina.Blacklist.Qualifiers.restrictedTagName = function (node) {
	var restrictedTagNames = [
		'object',
		'param',
		'embed',
		'source'
	];
	if (
		// Restricted if note an element
		(!AC.Element.isElement(node)) ||
		// Or restricted if tagName is restricted
		(restrictedTagNames.indexOf(node.tagName.toLowerCase()) >= 0)
	) {
		return true;
	}
	return false;
};
AC.Retina.Image = AC.Class();
AC.Retina.Image.prototype = {
	initialize: function ac_initialize(element, options) {
		// Define properties
		this._options = options || {};
		this._element = AC.Element.getElementById(element);
		this._component = null;
		this._status = 'considered';
		this._isPreloaded = false;
		this._replaced = false;
		this._exists = null;
		this._ignored = null;
		this._src = null;
		this._hiresSrc = null;
		this._srcFormat = null;
		this._isHires = null;
		this._width = null;
		this._height = null;
		// Add synthesizer methods
		AC.Object.synthesize(this);
		// For Image Nodes, get width and height from element (if defined)
		if (AC.Element.isElement(this.element()) && this.element().tagName.toLowerCase() === 'img') {
			if (typeof this.element().naturalWidth !== 'undefined' && this.element().naturalWidth !== 0) {
				this.setWidth(this.element().naturalWidth);
			}
			if (typeof this.element().naturalWidth !== 'naturalHeight' && this.element().naturalHeight !== 0) {
				this.setHeight(this.element().naturalHeight);
			}
		}
	},
	setComponent: function ac_setComponent(component) {
		// Cannot change Component once it is set
		if (typeof component === 'object' && this.component() === null) {
			this._component = component;
			// Merge the options with the options from the src
			this.setOptions(AC.Object.extend(AC.Retina.Image.convertParametersToObject(this.src()), this.options()));
			// Merge the options with the options from the new Component
			this.setOptions(AC.Object.extend(AC.Object.clone(component.properties()), this.options()));
			// Backwards compatibility for inconsistent camelcase of hiRes
			if (typeof this.options().hiResFormat !== 'undefined') {
				this.options().hiresFormat = this.options().hiResFormat;
			}
			return this.component();
		}
	},
	setStatus: function ac_setStatus(status) {
		if (typeof status !== 'string') {
			return false;
		}
		// Some debug code
		if (typeof AC.Retina.Debug !== 'undefined') {
			AC.Retina.Debug.sharedInstance().addStatus(status);
			if (AC.Element.isElement(this.element())) {
				this.element().setAttribute('data-hires-status', status);
			}
		}
		this._status = status;
		return this._status;
	},
	__memoizedContextGetter: function ac___memoizedContextGetter(methodName) {
		if (this.component()) {
			if (typeof this['__' + methodName] !== 'function') {
				// Track down the method from the component’s context
				// The .context() method allows for context inheritance.
				var method = this.component().context(methodName);
				// Memoize the method when we find it so that we don’t need to track it down again.
				this['__' + methodName] = typeof method === 'function' ? method.bind(this) : AC.Function.emptyFunction;
			}
			return this['__' + methodName]();
		} else {
			// Must have a component before we try to access any properties/methods requiring component, such as src, hiresSrc, replace, etc.
			// The behavior of these methods changes depending on what kind of Image we’re dealing with.
			throw 'Component not assigned yet.';
		}
	},
	// getter for this._src
	src: function ac_src() {
		if (this._src !== null) {
			return this._src;
		}
		this.setSrc(this.__memoizedContextGetter('src'));
		return this._src;
	},
	// getter for this._hiresSrc
	hiresSrc: function ac_hiresSrc() {
		if (this._hiresSrc !== null) {
			return this._hiresSrc;
		}
		// If we’re ignoring this Image, the lowres source is the hires
		if (this.ignored()) {
			this.setHiresSrc(this.src());
			return this._hiresSrc;
		}
		var hiresSrc = this.__memoizedContextGetter('hiresSrc');
		// Remove garbage in SRC
		if (this.options().cleanHiresSrc === true) {
			hiresSrc = hiresSrc.replace(/((\?.*)|(#.*))$/, '');
		}
		this.setHiresSrc(hiresSrc);
		return this._hiresSrc;
	},
	// getter for this._srcFormat
	srcFormat: function ac_srcFormat() {
		if (this._srcFormat !== null) {
			return this._srcFormat;
		}
		var format = this.src().match(/^.*\.([a-z]*)($|#.*|\?.*)/i);
		this.setSrcFormat((format === null) ? null : format[1]);
		return this._srcFormat;
	},
	// getter for this._isHires
	isHires: function ac_isHires() {
		// Can become true, but can’t become false after it is already true.
		if (this._isHires === true) {
			return this._isHires;
		}
		var src = this.src();
		if (
			// Is not a raster image
			(src.match(AC.Retina.rasterImageFormatRegExp()) === null) ||
			// Has already been replaced
			(this.replaced() === true)
		) {
			this.setIsHires(true);
			return this._isHires;
		}
		this.setIsHires(false);
		return this._isHires;
	},
	// getter for this._ignored
	ignored: function ac_ignored() {
		// If it’s already replaced, we can’t ignore it
		if (this.replaced()) {
			this.setIgnored(false);
			return this._ignored;
		}
		if (this._ignored !== null) {
			return this._ignored;
		}
		this.setIgnored(!!this.src().match(this.options().ignoreRegex));
		return this._ignored;
	},
	replace: function ac_replace(callback) {
		var self = this;
		var replace;
		// Can’t replace more than once or if the image does not exist
		// Need to run callback anyway, so that next image in queue gets replaced.
		if (self.replaced() === true || self.exists() === false) {
			return callback();
		// Check that the image exists
		} else if (self.options().checkExists === true && typeof self.exists() !== 'boolean') {
			self.checkExists.call(self, function (exists) {
				// Remember if it exists or not, so we don’t need to check again.
				self.setExists(exists);
				// Update status to 404 if it doesn’t exist
				if (!self.exists()) {
					self.setStatus('404');
				}
				// Try replacing again, now that we know!
				self.replace(callback);
			});
			// Stop here to wait for head request
			return;
		}
		replace = function replace(shouldReplace) {
			var doReplacement = function () {
				self.__memoizedContextGetter('replace');
				self.setStatus('replaced');
				self.setReplaced(true);
			};
			if (shouldReplace) {
				// Allow pausing
				if (AC.Retina.sharedInstance().paused()) {
					AC.Retina.sharedInstance().deferredQueue().add(doReplacement);
				} else {
					doReplacement();
				}
			}
			if (typeof callback === 'function') {
				callback();
			}
		};
		self.setStatus('replacing');
		// Replace after preloading
		if (self.options().preload || (self.options().preloadIfNoDimensions && (!self.width() || !self.height()))) {
			self.preload(replace);
		} else {
			replace(true);
		}
	},
	checkExists: function ac_checkExists(callback, src) {
		var self = this;
		if (typeof src === 'undefined') {
			src = self.hiresSrc();
		}
		if (self.options().checkAsRootRelative === true || (src.indexOf(window.location.origin) === 0 || src.indexOf('/') === 0)) {
			// Check as root relative if it’s not already
			src = (self.options().checkAsRootRelative === true) ? src.replace(/^https?:\/\/[^\/]*\//, '/') : src;
			if (typeof AC.Ajax === 'object') {
				AC.Ajax.checkURL(src, callback);
			}
		}
	},
	preload: function ac_preload(callback) {
		var self = this;
		var img;
		// Don’t preload multiple times
		if (self.isPreloaded() === true) {
			return callback(true);
		}
		// Don’t load if it doesn’t exist
		if (self.exists() === false) {
			return callback(false);
		}
		self.setStatus('loading');
		// Create a new Image element and listen for it to load.
		img = new Image();
		AC.Element.addEventListener(img, 'load', function () {
			self.setIsPreloaded(true);
			// Get image dimensions
			self.setWidth(img.width / AC.Retina.devicePixelRatio(AC.Retina.minDPR()));
			self.setHeight(img.height / AC.Retina.devicePixelRatio(AC.Retina.minDPR()));
			self.setStatus('loaded');
			if (typeof callback === 'function') {
				callback(true);
			}
		});
		// If we haven’t already made sure this file exists, then let’s account for the error.
		if (self.options().checkExists === true) {
			AC.Element.addEventListener(img, 'error', function () {
				self.setStatus('404');
				self.setExists(false);
				if (typeof callback === 'function') {
					callback(false);
				}
			});
		}
		// Start the loading process
		img.src = self.hiresSrc();
	}
};
AC.Retina.Image.isImage = function (obj) {
	return (obj instanceof AC.Retina.Image);
};
AC.Retina.Image.removeCSSURLSyntax = function (string) {
	var matches;
	if (typeof string === 'string' && typeof string.replace === 'function') {
		matches = string.match(/url\((\'|\")?([^\"\'\)]+)(\'|\")?\)/i);
		if (matches) {
			return matches[2];
		}
	}
	return '';
};
AC.Retina.Image.replaceExtension = function (url, extension) {
	var split = url.match(/^(.*)((\.[a-z]{3})($|#.*|\?.*))/i);
	if (split !== null && split.length > 1) {
		return split[1] + '.' + extension + (split[4] || '');
	}
};
AC.Retina.Image.convertParametersToObject = function (string) {
	if (typeof string === 'string' && typeof string.toQueryParams === 'function') {
		var options = {};
		var optionsFromString = string.toQueryParams();
		var option;
		for (option in optionsFromString) {
			if (optionsFromString.hasOwnProperty(option) && typeof optionsFromString[option] !== 'undefined') {
				options[option.camelize()] = optionsFromString[option];
			}
		}
		return options;
	}
	return {};
};
AC.Retina.Queue = AC.Class();
AC.Retina.Queue.prototype = {
	initialize: function ac_initialize(threadCount, image) {
		this._threadCount = threadCount;
		this._queue = [];
		if (typeof image !== 'undefined') {
			this.add(image);
		}
		// Queue can only run once
		this._ran = false;
		// Synthesize Member Data
		AC.Object.synthesize(this);
	},
	add: function ac_add(image) {
		if (this._ran === true) {
			return;
		}
		var i;
		// If it’s and Array of Images
		if (Array.isArray(image)) {
			for (i = 0; i < image.length; i++) {
				this.add(image[i]);
			}
		// Just one Image file
		} else if (AC.Retina.Image.isImage(image)) {
			this._queue.push(image);
			if (typeof image.setStatus === 'function') {
				image.setStatus('queued');
			}
		}
	},
	run: function ac_run(method, callback) {
		if (this._ran === true) {
			return;
		}
		var self = this;
		// Reverse a clone of our queue so we can pop items off the end
		var queue = self._queue.slice(0).reverse();
		// How many threads need to run out of images before we are done
		var threads = (queue.length < self._threadCount) ? queue.length : self._threadCount;
		var threadCount = threads;
		// Don’t accept any more Images in this queue.
		self._ran = true;
		var replaceNextImage = function replaceNextImage() {
			var image = queue.pop();
			// Bail if there are no more images to replace
			if (typeof image === 'undefined') {
				threadCount--;
				if (threadCount === 0) {
					if (typeof callback === 'function') {
						callback();
					}
					AC.Retina.sharedInstance().publishNotification('queueEmptied', self);
					return;
				}
			} else {
				// Replace the image, then track it as replaced and replace the next
				// If there is a method passed as a function, give it them image instance and a callback to run when it’s done
				if (typeof method === 'function') {
					method.apply(image, [image, replaceNextImage]);
				// If the method is a string, assume that it is meant to run on the image object
				} else if (typeof method === 'string' && typeof image[method] === 'function') {
					image[method].apply(image, [replaceNextImage]);
				}
			}
		};
		var replaceQueue = function replaceQueue() {
			var i;
			// Fire off a queue of replaceNextImage() calls, based on this._threadCount.
			for (i = 0; i < threads; i++) {
				replaceNextImage();
			}
		};
		// Use a timer to empty the queue after JS goes idle
		window.setTimeout(replaceQueue, 10);
	}
};
AC.Retina.version = '3.0';
if (typeof AC.Retina.imageComponentRegistry === 'undefined') {
	AC.Retina.imageComponentRegistry = new AC.Registry(AC.Retina.classNamePrefix(), {
		contextInherits: ['src', 'hiresSrc', 'replace', 'blacklist']
	});
}
AC.Retina.imageComponentRegistry.addComponent(
	// name
	'_base',
	// properties (Options)
	{
		ignoreRegex: /(^http:\/\/movies\.apple\.com\/|\/105\/|\/media\/|\/global(\/ac_media_player)?\/elements\/quicktime\/|_(([2-9]|[1-9][0-9]+)x|nohires)(\.[a-z]+)($|#.*|\?.*))/i,
		filenameRegex: /(.*)(\.[a-z]{3}($|#.*|\?.*))/i,
		filenameInsert: '_☃x',
		hiresFormat: false,
		cleanHiresSrc: true,
		preload: false,
		checkExists: true,
		checkAsRootRelative: true
	},
	// qualifier
	AC.Function.emptyFunction,
	// parent
	null,
	// context
	{
		src: function ac_src() {
			return '';
		},
		hiresSrc: function ac_hiresSrc() {
			var split;
			var src = this.src();
			var hiresFormat = this.options().hiresFormat;
			var srcFormat = this.srcFormat();
			// If hires format is defined and is not the same as the current format
			if (typeof hiresFormat === 'string' && hiresFormat !== srcFormat) {
				return AC.Retina.Image.replaceExtension(src, hiresFormat);
			}
			split = this.src().match(this.options().filenameRegex);
			if (split === null) {
				return null;
			} else {
				return split[1] + this.options().filenameInsert.replace('☃', AC.Retina.devicePixelRatio(AC.Retina.minDPR())) + split[2];
			}
		},
		replace: AC.Function.emptyFunction,
		blacklist: new AC.Retina.Blacklist()
	}
);
AC.Retina.imageComponentRegistry.addComponent(
	// name
	'background-image',
	// properties (Options)
	{
		preload: true
	},
	// qualifier
	function (element, prefix) {
		var bg = AC.Element.getStyle(element, 'background-image');
		return (element.tagName.toLowerCase() !== 'img') && (bg) && (!!bg.match(/^url\(([^\)]+)\)$/i));
	},
	// parent
	'_base',
	// context
	{
		src: function ac_src() {
			return AC.Retina.Image.removeCSSURLSyntax(AC.Element.getStyle(this.element(), 'background-image'));
		},
		replace: function ac_replace() {
			var backgroundSize = AC.Element.getStyle(this.element(), 'background-size');
			if (!backgroundSize || !!backgroundSize.match('auto')) {
				AC.Element.setStyle(this.element(), 'background-size:' + (this.width()) + 'px ' + (this.height()) + 'px;');
			}
			AC.Element.setStyle(this.element(), 'background-image:url(' + this.hiresSrc() + ');');
		},
		blacklist: new AC.Retina.Blacklist([
			AC.Retina.Blacklist.Qualifiers.DPRLessThanMinAndNotSVG
		])
	}
);
AC.Retina.imageComponentRegistry.addComponent(
	// name
	'img-tag',
	// properties (Options)
	{
		preloadIfNoDimensions: true
	},
	// qualifier
	function (element, prefix) {
		return (element.tagName.toLowerCase() === 'img') && (!!element.getAttribute('src'));
	},
	// parent
	'_base',
	// context
	{
		src: function ac_src() {
			return this.element().getAttribute('src');
		},
		replace: function ac_replace() {
			// Set width if not already defined.
			if (isNaN(parseInt(this.element().getAttribute('width'), 10)) && this.width()) {
				this.element().setAttribute('width', this.width());
			}
			// Set height if not already defined.
			if (isNaN(parseInt(this.element().getAttribute('height'), 10)) && this.height()) {
				this.element().setAttribute('height', this.height());
			}
			// Set src
			this.element().setAttribute('src', this.hiresSrc());
		},
		blacklist: new AC.Retina.Blacklist([
			AC.Retina.Blacklist.Qualifiers.DPRLessThanMinAndNotSVG
		])
	}
);
AC.Retina.sharedInstance();
