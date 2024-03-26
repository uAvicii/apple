
/**
 * Holds all Tracking related functionality.
 * @name as.Tracking
 * @namespace
 * @memberOf as
 */

var as = {};

as.Tracking = (function (global) {

    // Private utility function
    function addEvent(el, type, handle, capture) {
        if (el.addEventListener) {
            el.addEventListener(type, handle, capture);
        } else {
            el.attachEvent('on' + type, handle);
        }
    };

    function isFunction(obj) {
        return typeof (obj) === 'function';
    };

    function getSitecatalystInstance() {
        /* jshint -W106 */ // Identifiers 's_gi' and 's_account' are not in camel case, but this is outside our control.
        var scInstance = global.s_gi,
            scAccount = global.s_account;

        if (!(scInstance && scAccount)) {
            // This means that Sitecatalyst is globally disabled via configuration and
            // s_code_h.js file is not loaded. So, return the shim object. see omnitureshim.js
            return global.s;
        }

        return scInstance(scAccount);
    };

    function trackPage(metricsData) {
        var sc = this.getSitecatalystInstance();
        sc.t(metricsData);
    };

    function track(el, name, metricsData, callback) {

        if (!(name && metricsData)) {
            throw new Error('Tracking.track require a valid event name and metrics overrides params.');
        } else if (!('linkTrackVars' in metricsData && 'linkTrackEvents' in metricsData)) {
            throw new Error('Tracking.track requires both linkTrackVars and linkTrackEvents to be defined in the metricsData param.');
        }

        var sc = this.getSitecatalystInstance(),
            old_mrq = sc.mrq, // Fix for issue with actions that navigate away (Safari!!).
            shouldExecuteCallback = sc.tl.length !== 5 && isFunction(callback),
            delay = (el === true || el === void 0) ? 0 : 300,
            isCallbackCalled = false,
            executeCallbackFn = function () {
                if (!isCallbackCalled) {
                    isCallbackCalled = true;
                    callback.call(global);
                }
            };

        // Minimum linkTrackVars to send for all tl calls <rdar://problem/13725489>
        metricsData.linkTrackVars += [
            /* Variables ------|-- Sitecatalyst Report Name 
            ',prop2,eVar3',     // Store name
            'prop4',            // Current page URL
            'prop5',            // Platform + Display resolution
            'prop6',            // Campaign pathing
            'prop8,eVar4',      // PageName
            'prop14',           // Previous page name
            'prop19,eVar19',    // Segment - Page
            'prop20',           // Segment
            'prop40'*/            // Storefront ID
        ].join(',');

        // HACK: The dynamic image's onload event calls the s.mrq function. So, hooking into this
        //       to know when the beacon event has finished firing.
        // TODO: Delete this hack/code once the s_code_h.js file is upgraded to H.25.* version
        if (shouldExecuteCallback) {
            sc.mrq = function () {
                sc.mrq = old_mrq;
                sc.mrq.apply(sc, arguments);
                executeCallbackFn();
            };
        }

        // First Parameter:
        //  el - Uses a 500ms delay to ensure data is collected before leaving the page.
        //  true - Disables the 500ms delay when the action is not going to leave the page.
        // NOTE : The 500ms delay is a maximum delay. If the image requested returns in less than 500 ms, the delay
        //        stops immediately. This allows the visitor to move onto the next page or next action within the page.
        // NOTE: Version H.25.* has a fifth doneAction callback parameter
        // see https://microsite.omniture.com/t2/help/en_US/sc/implement/index.html#Manual_Link_Tracking_Using_Custom_Link_Code
        sc.tl(el || true, 'o', name, metricsData, callback);

        // TODO: Delete this hack/code once the s_code_h.js file is upgraded to H.25.* version
        if (shouldExecuteCallback) {
            // Backup: In case metrics.apple.com is inaccessible, blocked or is taking too loooong to respond.
            setTimeout(executeCallbackFn, delay);
        }
    };


    return {

        /**
         * Call this method to get the underlying Sitecatalyst object/variable.
         * @function
         * @return {object} The global Sitecatalyst instance.
         */
        getSitecatalystInstance: getSitecatalystInstance,

        /**
         * TrackPage simulate's Sitecatalyst's page load beacon request.
         * @function
         * @param {object} metricsData The metrics <a href='https://microsite.omniture.com/t2/help/
         * en_US/sc/implement/index.html#Variable_Overrides'>override variables</a> to send in this event.
         */
        trackPage: trackPage,

        /**
         * Track or record a custom event.
         *
         * @function
         *
         * @param {Element} el The DOM element the event needs to be reported on or
         * pass in null to fire the event without the 500ms delay.
         *
         * @param {String} name The name of your event up to 100 characters.
         * This determines how the link is displayed in the appropriate report.
         *
         * @param {Object} metricsData A dictionary of <a href='https://microsite.omniture.com/t2/help/
         * en_US/sc/implement/index.html#Variable_Overrides'>variable overrides</a> to send in this event.
         *
         * @param {Function} callback (optional) A function to call after the beacon has finished firing.
         * Currently, only used internally.
         */
        track: track

        /**
         * A helper method for tracking DOM element clicks or form submissions. This method ensures
         * that the Sitecatalyst beacon is fired for actions that would normally navigate the page away (links and form submissions)
         *
         * @function
         *
         * @param {Element} el The DOM element the event needs to be reported on.
         *
         * @param {String} name The name of your event up to 100 characters. This determines how the link is
         * displayed in the appropriate report.
         *
         * @param {Object|function} metricsData A dictionary of <a href='https://microsite.omniture.com/t2/help/
         * en_US/sc/implement/index.html#Variable_Overrides'>variable overrides</a> to send in this event. If this
         * is a function, then it will be called once the click event is fired which *should* return the
         * necessary variable overrides.
         *
         * @param {Function} callback (optional) A function to call after the beacon has finished firing.
         * If the callback is not defined then the code will programmatically submit the form / navigate the page.
         */
        //trackClick : trackClick
    };

}(this));
