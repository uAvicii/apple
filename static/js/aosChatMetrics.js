/*global Storage:false*/
/**
 * @fileOverview This file contains all Omniture / Metrics related code.
 **/
(function (window, $, undefined) {
    /**
     * Holds all Omniture / Metrics related functionality.
     * @name jQuery.AppleMetrics
     * @namespace
     * @memberOf jQuery
     */
    $.AppleMetrics = (function () {
        /**
         * Stores unique micro-events data that have been previously fired
         * @private
         * @ignore
         */
        var microEventDuplicateDetector = {};

        /** @scope jQuery.AppleMetrics */
        return {

            /**
             * Specifies if the eVars are stored as data attributes on HTML tags.
             * @property
             * @type {boolean}
             */
            evarDataNodesEnabled: true,

            /**
             * Gets the current product string
             * @property
             * @type {string}
             */
            productSubstring: '',

            /**
             * Stores the data stored in local storage on page load.
             * @property
             * @type {object}
             */
            pageLoadMetricsData: null,

            /**
             * AppleMetrics CONSTANTS
             */
            CONSTANTS: {
                /** The namespace that should be used */
                AosNamespace: 'Contact Retail: ',

                /** The pageLoadDataKeyPrefix that should be used */
                pageLoadDataKeyPrefix: 'apple.metrics',

                /** The pageLoadDataKeySeparator that should be used */
                pageLoadDataKeySeparator: '__',

                /** The pageLoadDataKeyLatestKeyName that should be used */
                pageLoadDataKeyLatestKeyName: 'apple_Metrics_LatestKey',

                /** Regex used to parse metrics templates */
                templateRegex: /\$\{(\w+)\}/g,

                /** These details are used when crating the metrics related cookie */
                cookieDefaults: {
                    name: 'chatmetrics',
                    path: '/',
                    domain: window.location.host,
                    expires: 0.0208333333,
                    secure: false
                }
            },

            /**
             * Fires a collection of metric events via fireOmniMicroEvent and fireOmniMetricsEvent methods.
             * @param {Object} metricsData The metrics data thats needs to be sent.
             * @param {Object|[]} metricsData.metrics The metrics data thats needs to be sent via {@link jQuery.AppleMetrics.fireOmniMicroEvent} method.
             * @param {Object|[]} metricsData.microEvent The metrics data thats needs to be sent via {@link jQuery.AppleMetrics.fireOmniMetricsEvent} method.
             */
            fireOmniEventCollection: function (metricsData) {
                var eventData, len, i;

                if (!metricsData) {
                    return;
                }

                if (metricsData.microEvent) {
                    // microEvent can be an array, or a single item, so stick it in an array first.
                    eventData = [].concat(metricsData.microEvent);
                    len = eventData.length;

                    for (i = 0; i < len; i++) {
                        this.fireOmniMicroEvent(eventData[i]);
                    }
                }

                if (metricsData.metrics) {
                    // metrics can be an array, or a single item, so stick it in an array first.
                    eventData = [].concat(metricsData.metrics);
                    len = eventData.length;

                    for (i = 0; i < len; i++) {
                        this.fireOmniMetricsEvent(eventData[i]);
                    }
                }
            },

            /**
             * Fires a page request event. This is the same thing as if the site user were to visit a page directly.
             * @param {object} metricsData The metric values to be sent in this event.
             */
            fireOmniMetricsEvent: function (metricsData) {
                as.Tracking.trackPage(metricsData);
            },

            /**
             * Fires a custom link tracking (micro event) that gets tracked either in eVar5 / eVar6 / eVar21.
             * Syntax : 'page | slot | feature | part | action'.
             * NOTE: The call to Omniture is handled asynchronously, so navigating away from the page is
             * likely to cause the tracking to fail.
             * @param {object} metricsData The link element that needs tracking.
             * @param {string} metricsData.page (optional) Override the default Omniture.pageName value.
             * @param {string} metricsData.slot (optional) provide a slot name for the microevent.
             * @param {string} metricsData.feature The name of the feature reporting the event.
             * @param {string} metricsData.part (optional) The part or sub-feature associated with the event.
             * @param {string} metricsData.action What action has occurred.
             * @param {string} metricsData.eVar (optional) Sets the omniture variable to track. Defaults to 'eVar5'.
             * @param {Element} metricsData.node (optional) The link element that needs tracking.
             * @param {boolean} metricsData.excludeAosNamespace (optional) Weather to include the 'AOS :' for the link name.
             * @param {boolean} suppressDuplicates Ensure that the same event data isn't sent again on the same page.
             * @param {function} callback The callback function to call once the Sitecatalyst event is fired.
             */
            fireOmniMicroEvent: function (metricsData, suppressDuplicates, callback) {

                if (!('feature' in metricsData && 'action' in metricsData)) {
                    throw new Error('Microevents require a feature and an action.');
                }

                var sc = as.Tracking.getSitecatalystInstance(),
                    namespace = this.CONSTANTS.AosNamespace;

                // Apply the defaults if they are not defined;
                metricsData = $.extend({
                    page: (sc.pageName || ''),
                    slot: '',
                    eVar: metricsData.linkTrackVars
                }, metricsData);

                if (!metricsData.excludeAosNamespace && metricsData.page.indexOf(this.CONSTANTS.AosNamespace) !== 0) {
                    metricsData.page = this.CONSTANTS.AosNamespace + metricsData.page;
                }
                var trackVarName = metricsData.eVar, trackVar,
                    overrides = {
                        linkTrackVars: trackVarName,
                        linkTrackEvents: 'None'
                    };

                if ('part' in metricsData) {
                    linkname = [metricsData.feature, metricsData.part, metricsData.action].join(' | ');
                } else {
                    linkname = [metricsData.feature, metricsData.action].join(' | ');
                }

                if (metricsData.events) {
                    overrides.linkTrackVars = trackVarName + ',events';
                    overrides.linkTrackEvents = metricsData.events;
                    overrides.events = metricsData.events;
                }

                if (metricsData.page === sc.pageName) {
                    // Replace with dynamic variable to reduce the beacon URL length.
                    trackVar = ['D=pageName+"', metricsData.slot, linkname].join(' | ') + '"';
                } else {
                    //trackVar = [metricsData.page, linkname].join(' | ');
                    trackVar = [linkname].join(' | ');
                }

                overrides[trackVarName] = trackVar;

                if (!suppressDuplicates || !(trackVar in microEventDuplicateDetector)) {
                    microEventDuplicateDetector[trackVar] = true;
                    as.Tracking.track(metricsData.node, linkname, overrides, callback);
                }

                // return the modified data object (useful for testing as well)
                return metricsData;
            }

        };
    }());

    /**
     * Creates an instance of Metrics object.
     * @name jQuery.AppleMetrics.Metrics
     * @augments jQuery.AppleMetrics
     * @class
     * @param {Object} config Options inspected when constructing the Metrics instance
     * @param {boolean} config.isHome Is the current page a home page?
     * @param {boolean} config.evarDataNodes Is the metrics data stored in HTML tags as data attributes?
     * @param {string} config.storeId The merchandising store id for the current page

     */
    $.AppleMetrics.Metrics = function (config) {
        this.config = (config || {});
        this.cookieProps = $.AppleMetrics.CONSTANTS.cookieDefaults;
        this.metrics = ($.cookie(this.cookieProps.name) || {});

        // Note: The default value is true & any value other than false is coerced to true.
        $.AppleMetrics.evarDataNodesEnabled = (this.config.evarDataNodes !== false);

        this.init();
    };

    $.AppleMetrics.Metrics.prototype = /** @lends jQuery.AppleMetrics.Metrics.prototype */ {

        /**
         * Sets the correct page name.
         * @param {string} name The current page name.
         * @returns {string} The modified current page name.
         */
        pageName: function (name) {
            var pageSuffix = '',
                hasReturnedHome = this.metrics.vh;

            if (this.config.isHome) {
                pageSuffix = ' - ' + (hasReturnedHome ? 'Return' : 'First');
            }

            return name + pageSuffix;
        }

    };

})(this, jQuery);
