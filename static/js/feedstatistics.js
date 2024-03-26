// = FeedStatistics = //
// ***** Inject scripts in 5 places of 3 pages to make the FeedStatistics work *****//
// 1. globalnav.js 
//	SearchShortcut.prototype.loadJson = function(json) {
//		...
//		// ***** Apple Instant - FeedStatistics: updateLastSuggestions()
//		if (FeedStatistics) {
//			var feedStats = new FeedStatistics();
//			// pass search term and suggestions
//			feedStats.updateLastSuggestions(this.lastSuggestions);
//		}
//	}
//
// 2. globalnav.js 
//	// == SearchShortcut.onKeyUp ==
//	SearchShortcut.prototype.onKeyUp = function (evt) {
//		...
//		// ***** Apple Instant, updateLastSuggestions()
//		if (FeedStatistics) {
//			var feedStats = new FeedStatistics();
//		// pass search term and suggestions
//			feedStats.updateLastQuery(this.searchInput.value);
//		}
//	}
//
//
// 3. search_trigger.js
//	var SearchEnvironment = Class.create();
//	Object.extend(SearchEnvironment.prototype, {
//		initialize: function(categoryIds) {
//		...
//		// **** Apple Instant - FeedStatistics: feedStats for search input box of search page
//		if (FeedStatistics) {
//			var feedStats = new FeedStatistics();
//			feedStats.searchInputFeed();
//		}
//	}
//
//
// 4. search.js
//	Search.Application = Class.create();
//	Object.extend(Search.Application.prototype, Event.Listener);
//	Object.extend(Search.Application.prototype, Event.Publisher);
//	Object.extend(Search.Application.prototype, {
//		presentResults: function() {
//		...
//		// Apple Instant - FeedStatistics: searchResultFeed()
//		if (FeedStatistics) {
//			var feedStats = new FeedStatistics();
//			feedStats.searchResultFeed();
//		}
//	}
//
// 5. search.js
//	Search.TextCategory = Class.create();
//	Object.extend(Search.TextCategory.prototype, Search.Category.prototype);
//	Object.extend(Search.TextCategory.prototype, {
//		renderResults: function(start, count) {
//		...
//		// Apple Instant - FeedStatistics : nextPage()
//		if (FeedStatistics && start !== 0) {
//			var feedStats = new FeedStatistics();
//			feedStats.nextPageFeed();
//		}
//	}
// *****

if (typeof(AC) === 'undefined') {
	AC = {};
}

// == {{{AC.addEvent(element, name, handler)}}} ==
// Registers a crossbrowser event listener on a single target element, returns {{{event}}}.
if (typeof (AC.addEvent) === 'undefined') {
	AC.addEvent = function (element, name, handler) {
		if (element.addEventListener) {
			return element.addEventListener(name, handler, false);
		}

		return element.attachEvent('on' + name, handler);
	};
}

// we are dependent on AC.Storage, if it's not on the page, let's just provide
// the functions we need as empty functions, to supress errors, but allow for the
// least amount of code changes below in FeedStatistics and also in globalnav.js
if (typeof (AC.Storage) !== 'object') {
	AC.Storage = {
		getItem: function () {},
		getItemObject: function () {},
		setItem: function () {}
	};
} else {
	if (typeof (AC.Storage.getItem) !== 'function') {
		AC.Storage.getItem = function () {};
	}
	if (typeof (AC.Storage.getItemObject) !== 'function') {
		AC.Storage.getItemObject = function () {};
	}
	if (typeof (AC.Storage.setItem) !== 'function') {
		AC.Storage.setItem = function () {};
	}
}

// == FeedStatistics ==
// FeedStatistics object
var FeedStatistics = function () {
	// global variable aiRequestEnabled controls if it sends out AI Suggestion requests and FeedStatistics requests or not
	if (typeof (aiRequestsEnabled) !== 'undefined' && aiRequestsEnabled === false) {
		return;
	}


	// *** basic setting for Apple Instant uri parameters *** //
	this.hostUri         = window.location.protocol + '//' + window.location.hostname + '/search/instant/feedStatistics';
	this.params          = {};
	this.params.model    = 'marcom_en_US';
	this.params.locale   = 'en_US';
	this.callback        = 'FeedStatistics.callbackSuccess';
	// local storage expiration duration in days
	this.storageDays     = 0;
	// updateRead() timer           - if user spends more than 3000 miniseconds on result page, then counts as 'read'; if less than 3000 miniseconds, then counts as 'notread'
	this.readTimer       = 3000;

	// *** define page scope *** //
	// country scope				- FeedStatistics only works for 'us' now
	this.countryScope    = 'us';
	// global navigation bar scope  
	this.globalNavScope  = ['global', 'mac', 'ipod', 'iphone', 'ipad', 'ipoditunes'];
	// search page scope
	this.searchPageScope = ['global'];
	// 'read', 'unread' scope
	this.readScope       = ['global', 'mac', 'ipod', 'iphone', 'ipad', 'ipoditunes'];

	// callback response log toggle
	// true: display log; false: not display log 
	// responseLog          = true;
};


// == FeedStatistics.callbackSuccess ==
// callback for send Statistics
FeedStatistics.callbackSuccess = function (json) {
	if (typeof window.console !== 'undefined') {
		// check the responseLog toggle 
		if (typeof (responseLog) !== 'undefined' && responseLog === true) {
			console.log(json);
		}
	}
};


// == FeedStatistics.globalNavFeed ==
// FeedStatistics for search bar in global navigation
FeedStatistics.prototype.globalNavFeed = function () {
	// check the scope 
	if (this.checkScope(this.globalNavScope)) {
		// get search input box of global navigation bar
		var globalNavSearch = document.getElementById('sp-searchtext');

		if (typeof (globalNavSearch) !== 'undefined' && globalNavSearch != null) {
			// register FeedStatistics for search bar in global navigation
			this.inputFeed(globalNavSearch);
		}

	}
};


// == FeedStatistics.searchInputFeed ==
// FeedStatistics for search bar in search page of Apple.com
FeedStatistics.prototype.searchInputFeed = function () {
	// check the scope
	if (this.checkScope(this.searchPageScope)) {
		var searchPageInput = document.getElementById('barsearchapple');

		if (typeof (searchPageInput) !== 'undefined' && searchPageInput != null) {
			// register FeedStatistics for search bar in search page of Apple.com
			this.inputFeed(searchPageInput);
		}

	}
};


// == FeedStatistics.inputFeed ==
// register 'notviewed' for search input bar
FeedStatistics.prototype.inputFeed = function (searchInputNode) {
	if (searchInputNode) {
		var self = this;
		var storedQuery = self.getStorageItem('query');
		AC.addEvent(searchInputNode, 'keyup', function (evt) {
			if (!evt) { evt = event; }
			var keyCode = evt.keyCode;
			if (keyCode === 13 && !evt.altKey && storedQuery && storedQuery !== '' && storedQuery !== searchInputNode.value) {
				self.updateNotViewed();
			}
		});

	}
};


// == FeedStatistics.searchResultFeed ==
// FeedStatistics for search result in search page
FeedStatistics.prototype.searchResultFeed = function () {
	// check the scope
	if (this.checkScope(this.searchPageScope)) {
		var searchBodyClass = document.body.className;
		var searchResult;

		// if current page is in search page
		if (searchBodyClass && (searchBodyClass === 'search')) {
			//TODO: pull in search results quantities here.
			searchResult = document.getElementById('www').getElementsByTagName('li');
			// if the result section has no result listed
			if (Search.allResults && Search.allResults.length === 0) {
							// updateSearched('No result found') 
				this.updateSearched(false);
			} else {
				// updateSearched('Results found')

				this.updateSearched(true);
				// load search result listeners
				this.loadResultListeners(searchResult);
			}

			// reset next flag in local storage
			this.updateStorageItem('next', false);
		}
	}
};


// == FeedStatistics.nextPageFeed ==
// FeedStatistics for next page in search page
FeedStatistics.prototype.nextPageFeed = function () {
	// check the scope
	if (this.checkScope(this.searchPageScope)) {
		var searchBodyClass = document.body.className;
		var searchResult = document.getElementById('www').getElementsByTagName('li');

		// Load search result listeners
		if ((typeof (searchResult) !== 'undefined') && (searchResult.length !== 0)) {
			// load search result listeners
			this.loadResultListeners(searchResult);
		}

		// if current page is in search page
		if ((searchBodyClass) && (searchBodyClass === 'search')) {
			// only update nextpage once after user clicks pagination 
			if ((typeof (this.getStorageItem('next')) !== 'undefined') && (this.getStorageItem('next') === true)) {
				return;
			} else { // if it is the first 'next page' user clicks 
				this.updateNextPage();
				// set 'next' in local storage
				this.updateStorageItem('next', true);
			}
		}
	}
};


// == FeedStatistics.readFeed ==
// FeedStatistics for read and notread in global scope
FeedStatistics.prototype.readFeed = function () {
	// check ths scope
	if (this.checkScope(this.readScope)) {
		//if current page is 404 page, then skip the read/notread feedStats

		if (typeof (s) !== 'undefined') {
			if (typeof (s.pageType) !== 'undefined' && s.pageType === 'errorPage') {
				return;
			}
		}

		// if the search result link has been clicked and current uri is equal to 'selectedUri' in local storage
		if ((this.getStorageItem('read') !== null) && (window.location.href === this.getStorageItem('selectedUri'))) {
			// get time when the page loads
			var time         = new Date();
			var self         = this;
			this.currentTime = time.getTime();

			// register event handler for <notread>
			AC.addEvent(window, 'beforeunload', function (evt) {
				var time      = new Date();
				var timeDiff  = time.getTime() - self.currentTime;
				var timeSpent = Math.round(timeDiff / 1000);
				// if the time spent on the page is more than 3000, then read; if the time is less than 3000, then notread	
				if (timeDiff > self.readTimer) {
					// updateRead() after 'this.readTimer' seconds
					self.updateRead(true, timeSpent);
				} else {
					// update not read    
					self.updateRead(false, timeSpent);
				}
				// reset the 'read' in local storage
				self.updateStorageItem('read', null);
			});
		}
	}
};


// == FeedStatistics.updateNotViewed == 
FeedStatistics.prototype.updateNotViewed = function () {
	if (typeof (aiRequestsEnabled) !== 'undefined' && aiRequestsEnabled !== false) {
		var notviewedHash       = this.params;
		notviewedHash.feedType  = 'notviewed';
		notviewedHash.feedQuery = (this.getStorageItem('query') !== null) ? encodeURIComponent(this.getStorageItem('query')) : null;
		this.sendRequest(notviewedHash);
	}
};


// == FeedStatistics.updateSearched ==
FeedStatistics.prototype.updateSearched = function (hasResults) {
	var searchHash                 = this.params;
	searchHash.feedType            = 'searched';
	searchHash.hasResults          = (hasResults === true) ? 'true' : 'false';
	// fetch query from URI of search result page
	searchHash.feedQuery           = encodeURIComponent(this.getQueryFromUri());
	searchHash.feedLastSuggestions = (this.getStorageItem('lastSuggestions') !== null) ? encodeURIComponent(this.getStorageItem('lastSuggestions')) : null;

	this.sendRequest(searchHash);
	// udpate last query to searched query
	this.updateStorageItem('query', this.getQueryFromUri());
};


// == FeedStatistics.updateNextPage ==
FeedStatistics.prototype.updateNextPage = function () {
	var nextHash         = this.params;
	nextHash.feedType    = 'nextpage';
	// fetch query from URI of search result page
	nextHash.feedQuery   = encodeURIComponent(this.getQueryFromUri());

	this.sendRequest(nextHash);
};


// == FeedStatistic.updateRead ==
FeedStatistics.prototype.updateRead = function (read, timeSpent) {
	var readHash           = this.params;
	readHash.feedType      = (read) ? 'read' : 'notread';
	readHash.feedArticleID = (this.getStorageItem('selectedUri') !== null) ? this.getStorageItem('selectedUri') : null;
	readHash.feedQuery     = (this.getStorageItem('query') !== null) ? encodeURIComponent(this.getStorageItem('query')) : null;
	readHash.position      = (this.getStorageItem('position') !== null) ? this.getStorageItem('position') : null;
	readHash.timeSpent     = timeSpent;
	this.sendRequest(readHash);
};


// == FeedStatistics.updateLastSuggestions ==
// update browser's local storage when query is typed in search input box
// it is registered in globalnav.js page
FeedStatistics.prototype.updateLastSuggestions = function (lastSuggestions) {
	this.updateStorageItem('lastSuggestions', lastSuggestions);
};


// == FeedStatistics.updateLastQuery ==
// update browser's local storage when query is typed in search input box
// it is registered in globalnav.js page
FeedStatistics.prototype.updateLastQuery = function (query) {
	this.updateStorageItem('query', query);
};


// == FeedStatstics.updateResultActivity ==
FeedStatistics.prototype.udpateResultActivity = function (position, uri) {
	this.updateStorageItem('read', false);
	this.updateStorageItem('position', position);
	this.updateStorageItem('selectedUri', uri);
};


// == FeedStatistics.loadResultListeners == 
// load event listeners for search result list
FeedStatistics.prototype.loadResultListeners = function (resultLinks) {
	try {
		var self  = this;
		var i;
		var resultLinksLen = resultLinks.length;
		var linkNode;
		var position_0;
		var position_1;
		var url_0;
		var url_1;

		for (i = 0; i < resultLinksLen;  i += 1) {
			var links = resultLinks[i].getElementsByTagName('a');

			// register the title link
			AC.addEvent(links[0], 'mousedown', function (evt) {
				linkNode = this;

				var linkPos  = (!linkNode.attributes) ? linkNode.position : linkNode.getAttribute('position'),
					linkHref = (!linkNode.attributes) ? linkNode.href     : linkNode.getAttribute('href');

				if (linkPos && linkHref) {
					position_0 = linkPos;
					url_0      = linkHref;
				}

				self.udpateResultActivity(position_0, url_0);
				return false;
			});

			AC.addEvent(links[1], 'mousedown', function (evt) {
				linkNode = this;

				if (linkNode.attributes['position'] && linkNode.attributes['href']) {
					position_1 = linkNode.attributes['position'].value;
					url_1 = linkNode.attributes['href'].value;
				}

				self.udpateResultActivity(position_1, url_1);
				return false;
			});
		}
	} catch (err) {}
};


// == FeedStatistic.getStorageItem==
// get data from browser's local storage
FeedStatistics.prototype.getStorageItem = function (key) {
	var storage = AC.Storage.getItem('feedStats');
	if ((typeof (storage) !== 'undefined') && (storage !== null)) {
		if (typeof (storage[key]) !== 'undefined') {
			return storage[key];
		} else {
			return null;
		}
	}
};


// == FeedStatistics.updateStorageItem ==
// create or update data in browser's local storage
FeedStatistics.prototype.updateStorageItem = function (itemKey, itemValue) {
	var newObj      = {};
	newObj[itemKey] = itemValue;
	var oldObj      = AC.Storage.getItemObject("feedStats");

	if ((typeof (oldObj) !== 'undefined') && (oldObj !== null)) {
		if (oldObj.hasOwnProperty('value')) {
			var objToBeSet = Object.extend(oldObj.value, newObj);
			AC.Storage.setItem("feedStats", objToBeSet, this.storageDays);
		} else {
			// need to figure out why ei6/7 aren't giving us the the full object back as expected
			return;
		}
	} else {
		// create the new storage
		AC.Storage.setItem("feedStats", newObj, this.storageDays);
	}
};


// == FeedStatistics.sendRequest ==
// Feed statistics to Apple Instant
FeedStatistics.prototype.sendRequest = function (feedObject) {
	var uri = this.generateStatisticsUri(feedObject);

	// ignore requests that do not match the current domain
	if (uri.indexOf(location.protocol + '//' + location.host) === 0) {
		var httpRequest;
		if (window.XMLHttpRequest) { // for IE7+, FF, Chrome, Opera, Safari
			httpRequest = new XMLHttpRequest();
		} else { // for IE6, IE5
			httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
		}
		httpRequest.open('GET', uri, false);
		httpRequest.send();
	}

};


// == FeedStatistics.generateStatisticsUri ==
// generate URI fro session storage
FeedStatistics.prototype.generateStatisticsUri = function (feedObject) {
	function sanitize(text) {
		text = unescape(text);
		text = text.replace(/^\s+/g, '').replace(/\s+$/g, '').replace(/\s\s+/g, ' ');
		text = escape(text);
		return text;
	};

	feedObject.feedQuery = sanitize(feedObject.feedQuery);
	var uri = this.hostUri + '?feedType=' + feedObject.feedType + '&query=' + feedObject.feedQuery + '&locale=' + feedObject.locale + '&model=' + feedObject.model;
	//AC.GlobalNav.prototype.enhanceSearch
	if (feedObject.feedType) {
		switch (feedObject.feedType) {
		case 'notviewed':
			break;
		case 'searched':
			uri = uri + '&hasResults=' + feedObject.hasResults + '&lastSuggestions=' + feedObject.feedLastSuggestions;
			break;
		case 'nextpage':
			break;
		case 'read':
			uri = uri + '&articleID=' + feedObject.feedArticleID + '&position=' + feedObject.position + '&timeSpent=' + feedObject.timeSpent;
			break;
		case 'notread':
			uri = uri + '&articleID=' + feedObject.feedArticleID + '&position=' + feedObject.position + '&timeSpent=' + feedObject.timeSpent;
			break;
		default:
			break;
		}
		// add callback
		uri = uri + '&callback=' + this.callback;
	}

	return uri;
};


// == FeedStatistics.checkScope ==
// check if current page is in FeedStatistics' scope
FeedStatistics.prototype.checkScope = function (scope) {
	var i;
	// use global variables 'searchCountry' and
	//'searchSection' to check current page's scope
	if ((typeof (searchCountry) !== 'undefined') && (typeof (searchSection) !== 'undefined')) {
		// now FeedStatistics only work for 'us'
		if (searchCountry === this.countryScope) {
			for (i = 0; i < scope.length; i += 1) {
				// searchSection is a global variable defined for every page in Apple.com
				if (searchSection === scope[i]) {
					return true;
				}
			}
		}
	} else {
		return false;
	}
	return false;
};


// == FeedStatistics.getQueryFromUri ==
// get query from uir of search result page
FeedStatistics.prototype.getQueryFromUri = function () {
	// search result page uri
	var uri    = window.location.href;

	// parameter in the uri needs to be fetched
	var name   = 'q';
	name       = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex  = new RegExp(regexS);
	// retrieved query from uri
	var query  = regex.exec(uri);

	if (query === null) {
		return '';
	}
	return decodeURIComponent(query[1]);
};


// when DOM is fully loaded
if (typeof (AC.onDOMReady) === 'function') {
	AC.onDOMReady(function () {
		if (typeof (aiRequestsEnabled) !== 'undefined' && aiRequestsEnabled !== false) {
			var globalFeedStats = new FeedStatistics();
			// register globalNav input box feed
			globalFeedStats.globalNavFeed();
			// register read/notread feed
			globalFeedStats.readFeed();
		}
	});
}
