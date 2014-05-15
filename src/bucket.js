//-------------------------------------------------
// bucket 
(function () {
    "use strict";
})();

// make console.log safe to use

window.console || (console = { log: function () { } });

Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

Number.prototype.roundToStep = function (num) {
    var resto = this % num;
    if (resto <= (num / 2)) {
        return this - resto;
    } else {
        return this + num - resto;
    }
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        }
    });
}

// context / platform

(function (i) { var e = /iPhone/i, n = /iPod/i, o = /iPad/i, t = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, r = /Android/i, d = /BlackBerry/i, s = /Opera Mini/i, a = /IEMobile/i, b = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, h = RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"), c = function (i, e) { return i.test(e) }, l = function (i) { var l = i || navigator.userAgent; this.apple = { phone: c(e, l), ipod: c(n, l), tablet: c(o, l), device: c(e, l) || c(n, l) || c(o, l) }, this.android = { phone: c(t, l), tablet: !c(t, l) && c(r, l), device: c(t, l) || c(r, l) }, this.other = { blackberry: c(d, l), opera: c(s, l), windows: c(a, l), firefox: c(b, l), device: c(d, l) || c(s, l) || c(a, l) || c(b, l) }, this.seven_inch = c(h, l), this.any = this.apple.device || this.android.device || this.other.device || this.seven_inch }, v = i.isMobile = new l; v.Class = l })(window);

// rAF

if (!Date.now)
    Date.now = function () { return new Date().getTime(); };

(function () {

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame']
                                   || window[vp + 'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function (callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function () { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

//window.addEventListener("load", function () {
//   if (isMobile.any) {
//setTimeout(function () {
// Hide the address bar!
//window.scrollTo(0, 1);
//}, 0);
//    }
//});


(function (bucket, $, undefined) {

    // ----------------------------------------
    // PRIVATE PROPERTIES

    var _loaded = false;

    // ----------------------------------------
    // PUBLIC PROPERTIES

    bucket.loaded = true;

    bucket.me = null;

    bucket.MapObject = {
        dataElevation: "country",
        dataCode: "us",
        canvasType: "svg-d3", // "svg-default" "canvas-easel" "svg-d3"
        canvasId: "map-elevation",
        width: 960,
        height: 640,
        data: {},
        el: null,
        container: null,
        updating: true
    }

    bucket.MapRenderObject = {
        canvasType: "svg",
        canvasLib: "d3",
        canvasId: "map-elevation",
        width: 960,
        height: 640,
        datas: {
            canvas: null, // canvas or svg 
            stage: null // easeljs
        },
        runtime: {
            updateCanvas: false,
            editable: false
        },
        view: {
            zoom: null,
            translate: [0, 0],
            scale: 1
        }
    }

    // ----------------------------------------
    // PRIVATE

    function addItem(item) {
        if (item !== undefined) {
            console.log("Adding " + $.trim(item));
        }
    }

    // ----------------------------------------
    // PUBLIC

    bucket.init = function () {
        console.log("bucket", "loaded");

        // platform
        (window.bucket.error = window.bucket.error || {}, jQuery);
        (window.bucket.u = window.bucket.u || {}, jQuery);

        (window.bucket.settings = window.bucket.settings || {}, jQuery);
        (window.bucket.profile = window.bucket.profile || {}, jQuery);
        (window.bucket.ui = window.bucket.ui || {}, jQuery);
        (window.bucket.canvas = window.bucket.canvas || {}, jQuery);
        (window.bucket.template = window.bucket.template || {}, jQuery);
        (window.bucket.tracker = window.bucket.tracker || {}, jQuery);

        (window.bucket.api = window.bucket.api || {}, jQuery);
        (window.bucket.api.error = window.bucket.api.error || {}, jQuery);
        (window.bucket.api.profile = window.bucket.api.profile || {}, jQuery);
        (window.bucket.api.content = window.bucket.api.content || {}, jQuery);
        (window.bucket.api.find = window.bucket.api.find || {}, jQuery);
        (window.bucket.api.context = window.bucket.api.context || {}, jQuery);
        (window.bucket.api.util = window.bucket.api.util || {}, jQuery);

        bucket.platform();

        console.log("bucket:platform", "loaded");

        bucket.u.init();

        bucket.settings.init();
        bucket.profile.init();

        // filter
        bucket.filter = bucket.profile.profileFilter;

        bucket.ui.init();
        bucket.canvas.init();
        bucket.template.init();
        bucket.tracker.init();

        bucket.api.error.init();
        bucket.api.profile.init();
        bucket.api.content.init();
        bucket.api.find.init();
        bucket.api.context.init();
        bucket.api.util.init();

        bucket.startUp();
    }

    bucket.keyFilters = {
        name: "name",
        network: "network"
    }

    bucket.keySwitches = {
        name: "name",
        network: "network"
    }

    bucket.localAttributeCodes = {
        bucketAtts: "bucketAtts",
        geoLat: "geoLat",
        geoLong: "geoLong",
        colorBackgroundHighlight: "colorBackgroundHighlight",
        colorHighlight: "colorHighlight"
    }

    bucket.startUpProfile = function () {

        // init user/geo
        bucket.profile.initProfile();
    }

    bucket.startUpUI = function () {
        bucket.ui.attachUIEvents();
    }

    bucket.startUp = function () {

        bucket.ui.startLoadingIndicator();

        bucket.startUpProfile();
        bucket.startUpUI();

        bucket.ui.stopLoadingIndicator();

        bucket.ui.tick();
    }

    bucket.log = function (key, val) {
        bucket.u.log(key, val);
    }

    bucket.platform = function () {

        // ----------------------------------------
        // SETTINGS        

        /* bucket main css and overrides */
        /*
        bucket colors
        - red: #da4834
        - blue: #468cf5
        - dark blue: #0050F0
        - teal: #00B4BC
        - pink: #FF64FF
        - gray: #20221d
        - graylight: #90918e        
        */

        bucket.settings.init = function () {
            bucket.settings.loaded = true;
            console.log("bucket.settings", "loaded");
        }

        bucket.settings.colorByClass = function (cls) {
            for (var key in bucket.settings.colors) {
                var obj = bucket.settings.colors[key];
                for (var prop in obj) {
                    if (prop == 'cls') {
                        if (obj[prop] == cls) {
                            return obj['color'];
                        }
                    }
                }
            }
            return null;
        }

        /* customizable colors */
        bucket.settings.colors = {
            colorBackgroundDark: { color: '#000000', cls: '.color-background-dark' },
            colorBackgroundLight: { color: '#ffffff', cls: '.color-background-dark' },
            colorBackgroundSemiDark: { color: '#9da0a4', cls: '.color-background-dark' },
            colorBackgroundBrandRed: { color: '#da4834', cls: '.color-background-dark' },
            colorBackgroundBrandPink: { color: '#FF64FF', cls: '.color-background-dark' },
            colorBackgroundBrandLightblue: { color: '#468cf5', cls: '.color-background-dark' },
            colorBackgroundBrandDarkblue: { color: '#0050F0', cls: '.color-background-dark' },
            colorBackgroundBrandTeal: { color: '#00B4BC', cls: '.color-background-dark' },
            colorBackgroundBrandGray: { color: '#20221d', cls: '.color-background-dark' },
            colorBackgroundBrandGraylight: { color: '#90918e', cls: '.color-background-dark' },
            colorBackgroundAmbient: { color: '#20221d', cls: '.color-background-dark' },
            colorBackgroundHighlight: { color: '#468cf5', cls: '.color-background-dark' },
            colorDark: { color: '#20221d', cls: '.color-dark' },
            colorBlack: { color: '#000000', cls: '.color-black' },
            colorLight: { color: '#ffffff', cls: '.color-light' },
            colorSemiDark: { color: '#9da0a4', cls: '.color-semidark' },
            colorDark: { color: '#20221d', cls: '.color-dark' },
            colorBrandRed: { color: '#da4834', cls: '.color-brand-red' },
            colorBrandPink: { color: '#FF64FF', cls: '.color-brand-pink' },
            colorBrandLightblue: { color: '#468cf5', cls: '.color-brand-lightblue' },
            colorBrandDarkblue: { color: '#0050F0', cls: '.color-brand-darkblue' },
            colorBrandTeal: { color: '#00B4BC', cls: '.color-brand-teal' },
            colorBrandGray: { color: '#20221d', cls: '.color-brand-gray' },
            colorBrandGraylight: { color: '#90918e', cls: '.color-brand-graylight' },
            colorAmbient: { color: '#20221d', cls: '.color-ambient' },
            colorHighlight: { color: '#da4834', cls: '.color-highlight' },
            colorBackgroundFilterYellow: { color: '#fed304', cls: '.color-background-filter-yellow' },
            colorBackgroundFilterTeal: { color: '#53c0a9', cls: '.color-background-filter-teal' },
            colorBackgroundFilterGreen: { color: '#93c43d', cls: '.color-background-filter-green' },
            colorBackgroundFilterBluegreen: { color: '#034b51', cls: '.color-background-filter-bluegreen' },
            colorBackgroundFilterLightblue: { color: '#00aee7', cls: '.color-background-filter-lightblue' },
            colorBackgroundFilterBlue: { color: '#003367', cls: '.color-background-filter-blue' },
            colorBackgroundFilterBeige: { color: '#b7a27c', cls: '.color-background-filter-beige' },
            colorBackgroundFilterLightpink: { color: '#d3ccc9', cls: '.color-background-filter-pink' },
            colorBackgroundFilterRed: { color: '#ef5032', cls: '.color-background-filter-red' },
            colorBackgroundFilterPink: { color: '#ef3666', cls: '.color-background-filter-pink' },
            colorBackgroundFilterPurple: { color: '#b200ff', cls: '.color-background-filter-purple' },
            colorBackgroundFilterOrangeBright: { color: '#ffaf03', cls: '.color-background-filter-orangebright' },
        };

        // ----------------------------------------
        // PROFILE

        bucket.profile.init = function () {
            bucket.profile.loaded = true;
            console.log("bucket.profile", "loaded");
        };

        bucket.profile.geo = null;
        bucket.profile.uuid = null;
        bucket.profile.profileState = null;
        bucket.profile.profileMe = null;
        bucket.profile.profileStates = null;

        bucket.profile.profileFilter = {
            name: "",//bucket.profile.getProfileFilterValue(bucket.keyFilters.name),
            network: ""
        }

        bucket.profile.localAttributes = null;

        bucket.profile.updateProfileFilter = function () {
            if (bucket.profile.profileMe == null) {
                return;
            }

            if (bucket.me == null) {
                return;
            }

            bucket.filter.name =
                bucket.profile.getProfileFilterValue(
                bucket.keyFilters.name);

            bucket.ui.setProfileFilterValues();
        }

        bucket.profile.getProfileFilterValue = function (code) {
            if (code == "name") {
                return bucket.me.firstName + " " + bucket.me.lastName;
            }

            return null;
        }

        bucket.profile.getLocation = function () {
            if (!bucket.profile.hasAttribute(bucket.localAttributeCodes.geoLat)
                || !bucket.profile.hasAttribute(bucket.localAttributeCodes.geoLong)) {

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(

                        function (position) {
                            bucket.profile.geo = position;
                            bucket.profile.setGeoLat(position.coords.latitude);
                            bucket.profile.setGeoLong(position.coords.longitude);
                            bucket.ui.handleChangeStateLocation();
                        },
                        // next function is the error callback
                        function (error) {
                            switch (error.code) {
                                case error.TIMEOUT:
                                    bucket.u.log('Timeout');
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    bucket.u.log('Position unavailable');
                                    break;
                                case error.PERMISSION_DENIED:
                                    bucket.u.log('Permission denied');
                                    break;
                                case error.UNKNOWN_ERROR:
                                    bucket.u.log('Unknown error');
                                    break;
                            }
                        }
                    );
                }
                else {
                    // no loc
                }
            }
        }

        bucket.profile.initProfile = function () {
            bucket.profile.checkProfile();
            bucket.profile.getLocation();
        }

        bucket.profile.checkProfile = function () {
            //bucket.api.profile.checkProfile();
            //bucket.api.profile.getProfileMe();
        }

        bucket.profile.initAttributes = function () {
            if (bucket.profile.localAttributes == null) {
                bucket.profile.localAttributes = JSON.parse(
                    $.cookie(bucket.localAttributeCodes.bucketAtts));
            }
            if (bucket.profile.localAttributes == null) {
                bucket.profile.localAttributes = {};
            }
        }

        bucket.profile.hasAttribute = function (att) {
            bucket.profile.initAttributes();
            if (bucket.profile.localAttributes != null) {
                if (bucket.profile.localAttributes[att] != null) {
                    if (!bucket.u.isNullOrEmptyString(att)) {
                        return true;
                    }
                }
            }
            return false;
        }

        bucket.profile.getAttribute = function (att) {
            // get local attributes
            // get server attributes
            var attValue = null;
            bucket.profile.initAttributes();
            if (bucket.profile.hasAttribute(att)) {
                attValue = bucket.profile.localAttributes[att];
            }
            return attValue;
        }

        bucket.profile.setAttribute = function (att, val) {
            // set local cookies if client side needed
            // set on server.
            bucket.profile.initAttributes();
            bucket.profile.localAttributes[att] = val;
            $.cookie(bucket.localAttributeCodes.bucketAtts,
                JSON.stringify(bucket.profile.localAttributes),
                    { expires: 5000, path: '/' });
        }

        bucket.profile.setCustomColorHighlight = function (val) {
            bucket.profile.setAttribute(
                bucket.localAttributeCodes.colorHighlight, val);
        }

        bucket.profile.getCustomColorHighlight = function () {
            return bucket.profile.getAttribute(
                bucket.localAttributeCodes.colorHighlight);
        }

        bucket.profile.setCustomColorBackgroundHighlight = function (val) {
            bucket.profile.setAttribute(
                bucket.localAttributeCodes.colorBackgroundHighlight, val);
        }

        bucket.profile.getCustomColorBackgroundHighlight = function () {
            return bucket.profile.getAttribute(
                bucket.localAttributeCodes.colorBackgroundHighlight);
        }

        bucket.profile.setGeoLat = function (val) {
            bucket.profile.setAttribute(
                bucket.localAttributeCodes.geoLat, val);
        }

        bucket.profile.getGeoLat = function () {
            return bucket.profile.getAttribute(
                bucket.localAttributeCodes.geoLat);
        }

        bucket.profile.setGeoLong = function (val) {
            bucket.profile.setAttribute(
                bucket.localAttributeCodes.geoLong, val);
        }

        bucket.profile.getGeoLong = function () {
            return bucket.profile.getAttribute(
                bucket.localAttributeCodes.geoLong);
        }

        // ----------------------------------------
        // TRACKER

        bucket.tracker.init = function () {
            bucket.tracker.loaded = true;
            console.log("bucket.tracker", "loaded");
        }

        bucket.tracker.setAccount = function (account_id) {
            try {
                if (ga) {
                    ga('create', account_id);
                }
            }
            catch (e) {
            }
            try {
                if (!bucket.u.isNullOrEmpty(_gaq)) {
                    _gaq.push(['_setAccount', account_id]);
                }
            }
            catch (e) {
            }
        }

        bucket.tracker.trackPageView = function (opt_url) {
            try {
                if (ga) {
                    ga('send', 'pageview');
                }
            }
            catch (e) {
            }
            try {
                if (!bucket.u.isNullOrEmpty(_gaq)) {
                    _gaq.push(['_trackPageview', opt_url]);
                }
            }
            catch (e) {
            }
        }

        bucket.tracker.trackEvent = function (category, action, opt_label, opt_value) {

            try {
                if (ga) {
                    if (bucket.u.isNullOrEmptyString(opt_label)) {
                        opt_label = 'default';
                    }
                    if (bucket.u.isNullOrEmptyString(opt_value)) {
                        opt_value = 1;
                    }
                    ga('send', {
                        'hitType': 'event',          // Required.
                        'eventCategory': category,   // Required.
                        'eventAction': action,      // Required.
                        'eventLabel': opt_label,
                        'eventValue': opt_value,
                        'nonInteraction': 1
                    });  // value is a number.
                    bucket.u.log('trackEvent:ga:',
                                    ' category:' + category +
                                    ' action:' + action +
                                    ' opt_label:' + opt_label +
                                    ' opt_value:' + opt_value);
                }
            }
            catch (e) {

            }
            try {
                if (!bucket.u.isNullOrEmpty(_gaq)) {
                    //_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
                    _gaq.push(['_trackEvent', category, action, opt_label, opt_value, true]);
                    bucket.u.log('trackEvent:gaq:',
                                ' category:' + category +
                                ' action:' + action +
                                ' opt_label:' + opt_label +
                                ' opt_value:' + opt_value);
                }
            }
            catch (e) {

            }
        }

        bucket.tracker.trackEventAction = function (action, label, val) {
            bucket.tracker.trackEvent(
            "action:" + action, action + ":" + label, label, 1);
        }

        // ----------------------------------------
        // UTILITY

        bucket.u.paramValueSeparator = '/';
        bucket.u.paramValueSeparatorItem = '-';
        bucket.u.paramValueSeparatorFilter = '--';

        bucket.u.init = function () {
            bucket.u.loaded = true;
            console.log("bucket.u", "loaded");
        };

        bucket.u.exists = function (id) {
            var obj = $(id);
            if (obj.length > 0) {
                return true;
            }
            return false;
        }

        bucket.u.isUrlParamAction = function (url, val) {
            if (url.charAt(0) != '-'
                || url.charAt(0) != '?'
                || url == 'find'
                || url == 'filter'
                || url == 'results'
                || url == 'info'
                || url == 'me'
                || url == 'u') {
                return true;
            }
            return false;
        }

        bucket.u.isUrlAction = function (url, val) {
            if (url.indexOf('/' + val) > -1) {
                return true;
            }
            return false;
        }
        
        bucket.u.log = function (key, val) {
            bucket.u.logType("default", key, val);
        }

        bucket.u.logType = function (type, key, val) {
            // Filter logs for type to help debug noise
            var logit = false;
            if (type == "srv") {
                logit = true;
            }
            else if (type == "srv-profile-check") {
                //logit = true;
            }
            else if (type == "srv-profile-me") {
                //logit = true;
            }
            else if (type == "srv-viewdata") {
                //logit = true;
            }
            else if (type == "srv-profile-u") {
                //logit = true;
            }
            else if (type == "events") {
                //logit = true;
            }
            else if (type == "info") {
                //logit = true;
            }
            else if (type == "location") {
                //logit = true;
            }
            else if (type == "filter") {
                //logit = true;
            }
            else if (type == "results") {
                //logit = true;
            }
            else if (type == "ui") {
                logit = true;
            }
            else if (type == "map") {
                //logit = true;
            }
            else if (type == "default") {
                //logit = false; // turn off default for now
            }

            if (logit && window.console) {
                console.log(key, val);
            }
        }

        bucket.u.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        bucket.u.getRandomArbitary = function (min, max) {
            return Math.random() * (max - min) + min;
        }

        bucket.u.isMobile = function () {
            return isMobile.any;
        }

        bucket.u.arrayRemoveByVal = function (arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === val) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            return arr;
        }

        bucket.u.renderWrapTagStyles = function (tag, content, styles) {
            return '<' + tag + ' class="' + styles + '">' + content + '</' + tag + '>';
        }

        bucket.u.renderWrapTag = function (tag, content) {
            return '<' + tag + '>' + content + '</' + tag + '>';
        }

        bucket.u.formatDatePrettyString = function (dt) {
            return moment(dt, 'YYYY-MM-DDTHH:mm:ss.SSS Z').fromNow();
        }

        bucket.u.isNullOrEmptyString = function (obj) {
            if (obj == null
                    || obj == ""
                    || obj == 'undefined') {
                return true;
            }
            return false;
        }

        bucket.u.isNullOrEmpty = function (obj) {
            if ((obj == null
                    || obj == ""
                    || obj == 'undefined')
                && obj != false) {
                return true;
            }
            return false;
        }

        bucket.u.stripToAlphanumerics = function (str) {
            if (!bucket.u.isNullOrEmptyString(str)) {
                str = str.replace(/[^\w\s-_]|/g, "");
                //.replace(/\s+/g, " ");
                return str;
            }
            return str;
        }

        bucket.u.toLower = function (str) {
            if (!bucket.u.isNullOrEmptyString(str)) {
                return str.toLowerCase();
            }
            return str;
        }

        bucket.u.filterToUrlFormat = function (str) {
            if (!bucket.u.isNullOrEmptyString(str)) {
                str = unescape(str);
                str = bucket.u.stripToAlphanumerics(str);
                str = bucket.u.toLower(str);
                str = str.replace(/_/g, "-");
                str = str.replace(/ /g, "-");
                return str;
            }
            return str;
        }

        bucket.u.getObjectValue = function (obj, key) {
            if (!bucket.u.isNullOrEmpty(obj)) {
                if (!isNullOrEmpty(obj[key])) {
                    return obj[key];
                }
            }
            return "";
        }

        bucket.u.fillObjectValue = function (strtofill, obj, key, param) {
            if (!bucket.u.isNullOrEmpty(obj[key])) {
                if (key != "div")
                    strtofill += param + obj[key];
            }
            return strtofill;
        }

        bucket.u.getPathParamValue = function (path, separator, key) {
            var val = "";

            var arrVal = path.split('#');
            var hash = '';

            if (arrVal.length > 0) {
                path = arrVal[0];
            }
            if (arrVal.length > 1) {
                hash = arrVal[1];
            }

            if (path.indexOf(key + separator) > -1) {
                var params = path.split(separator);
                for (var i = 0; i < params.length; i++) {
                    if (params[i] == key) {
                        if (params[i + 1] != null) {
                            val = params[i + 1];
                        }
                    }
                }
            }
            return val;
        }

        bucket.u.getPathContext = function () {
            return "context/" + (location.pathname + location.search).substr(1);
        }

        bucket.u.getPathParamValues = function (path, separator) {
            var params = path.split(separator);
            return params;
        }

        bucket.u.getPathParamPathValues = function (path) {
            var params = path.split(bucket.u.paramValueSeparator);
            return params;
        },
        getPathParamFilterValues = function (path) {
            var params = path.split(bucket.u.paramValueSeparatorFilter);
            return params;
        }

        bucket.u.changePathParamValue = function (path, separator, param, paramvalue) {
            var arrVal = path.split('#');
            var hash = '';
            if (arrVal.length > 0) {
                path = arrVal[0];
            }
            if (arrVal.length > 1) {
                hash = arrVal[1];
            }
            if (path.indexOf(param) > -1) {
                // hash contains param, just update
                var p = path.split(separator);
                for (var i = 0; i < p.length; i++) {
                    if (p[i] == param) {
                        p[i + 1] = paramvalue;
                    }
                }
                path = p.join(separator);
            }
            else {
                // has not present, append it
                if (path.indexOf(param + separator) == -1) {
                    if (path.lastIndexOf(separator) == path.length - 1) {
                        path = path.substr(0, path.length - 1);
                    }
                    path = path + separator + param + separator + paramvalue;
                }
            }

            if (!bucket.u.isNullOrEmptyString(hash)) {
                if (!bucket.u.endsWithSlash(path)) {
                    path += '/';
                }
                path += '#' + hash;
            }

            return path;
        }

        bucket.u.removePathParamValue = function (path, separator, param) {
            var val = path;
            if (bucket.u.isNullOrEmptyString(path)) {
                return val;
            }
            if (path.indexOf(param) > -1) {
                // hash contains param, just update
                var p = path.split(separator);
                p = bucket.u.removeArrayItemByValue(p, param, 2);
                if (p == null) {
                    p = path.split(separator);
                }
                if (p) {
                    val = p.join(separator);
                }
            }
            return val;
        }

        bucket.u.getUrlParamValue = function (path, key) {
            var value = "";
            if (bucket.u.isNullOrEmptyString(path)) {
                return value;
            }
            if (path.indexOf(key + bucket.u.paramValueSeparator) > -1) {
                var p = path.split(bucket.u.paramValueSeparator);
                for (var i = 0; i < p.length; i++) {
                    if (p[i] == key) {
                        if (p[i + 1] != null) {
                            value = p[i + 1];
                        }
                    }
                }
            }
            return value;
        }

        bucket.u.changeUrlParamValue = function (path, param, paramvalue) {
            return bucket.u.changePathParamValue(path, bucket.u.paramValueSeparator, param, paramvalue);
        }
        bucket.u.removeUrlParamValue = function (path, param) {
            return bucket.u.removePathParamValue(path, bucket.u.paramValueSeparator, param);
        }

        bucket.u.removeArrayItemByValue = function (arr, val, count) {
            for (var i = arr.length; i--;) {
                if (arr[i] === val) {
                    arr.splice(i, count);
                }
            }
            return arr;
        }

        bucket.u.removeArrayItemByIndex = function (arr, index, count) {
            for (var i = arr.length; i--;) {
                if (i === index) {
                    arr.splice(i, count);
                }
            }
            return arr;
        }

        bucket.u.endsWithSlash = function (str) {
            return str.match(/\/$/);
        }

        bucket.u.isAbsoluteUrl = function (check) {
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            return bucket.u.regexMatch(check, expression);
        }

        bucket.u.regexMatch = function (check, expression) {
            var regex = new RegExp(expression);
            var t = check;
            if (t.match(regex)) {
                return true;
            }
            else {
                return false;
            }
        }

        bucket.u.loadContent = function (div, url) {
            if ($(div).length > 0) {
                $(div).load(url, function () {
                    bucket.u.log('Content Loaded: ' + div + ' url:' + url);
                    bucket.ui.refreshUI();
                });
            }
        }

        bucket.u.loadDiv = function (div, content) {
            if ($(div).length > 0) {
                $(div).html(content);
                bucket.ui.refreshUI();
            }
        }

        bucket.u.ajax = function (url, parms) {
            parms = parms || {};
            var req = new XMLHttpRequest(),
                post = parms.post || null,
                callback = parms.callback || null,
                timeout = parms.timeout || null;

            req.onreadystatechange = function () {
                if (req.readyState != 4) return;

                // Error
                if (req.status != 200 && req.status != 304) {
                    if (callback) callback(false);
                    return;
                }

                if (callback) callback(req.responseText);
            };

            if (post) {
                req.open('POST', url, true);
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            } else {
                req.open('GET', url, true);
            }

            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            req.send(post);

            if (timeout) {
                setTimeout(function () {
                    req.onreadystatechange = function () { };
                    req.abort();
                    if (callback) callback(false);
                }, timeout);
            }
        }

        bucket.u.isMobile = function () {
            return isMobile;
        }

        bucket.u.isMobileChrome = function () {
            return navigator.userAgent.match('CriOS');
        }

        // ----------------------------------------
        // UI

        bucket.ui.init = function () {
            bucket.ui.loaded = true;
            console.log("bucket.ui", "loaded");

            bucket.ui.initDev();
            bucket.ui.loadContentAccountStart();
            bucket.ui.initScrolls();

            // gestures
            $('html').bind('tapone', bucket.ui.eventHandlerTapOne);
            $('html').bind('taptwo', bucket.ui.eventHandlerTapTwo);
            $('html').bind('tapthree', bucket.ui.eventHandlerTapThree);
            $('html').bind('tapfour', bucket.ui.eventHandlerTapFour);

            $('html').bind('swipeone', bucket.ui.eventHandlerSwipeOne);
            $('html').bind('swipetwo', bucket.ui.eventHandlerSwipeTwo);
            $('html').bind('swipethree', bucket.ui.eventHandlerSwipeThree);
            $('html').bind('swipefour', bucket.ui.eventHandlerSwipeFour);

            $('html').bind('swipeup', bucket.ui.eventHandlerSwipeUp);
            $('html').bind('swiperightup', bucket.ui.eventHandlerSwipeRightUp);
            $('html').bind('swiperight', bucket.ui.eventHandlerSwipeRight);
            $('html').bind('swiperightdown', bucket.ui.eventHandlerSwipeRightDown);

            $('html').bind('swipedown', bucket.ui.eventHandlerSwipeDown);
            $('html').bind('swipeleftdown', bucket.ui.eventHandlerSwipeLeftDown);
            $('html').bind('swipeleft', bucket.ui.eventHandlerSwipeLeft);
            $('html').bind('swipeleftup', bucket.ui.eventHandlerSwipeLeftUp);

            $('html').bind('pinchopen', bucket.ui.eventHandlerPinchOpen);
            $('html').bind('pinchclose', bucket.ui.eventHandlerPinchClose);
            $('html').bind('rotatecw', bucket.ui.eventHandlerRotateCW);
            $('html').bind('rotateccw', bucket.ui.eventHandlerRotateCCW);
            $('html').bind('swipeone', bucket.ui.eventHandlerSwipeOne);
            $('html').bind('swipemove', bucket.ui.eventHandlerSwipeMove);
            $('html').bind('pinch', bucket.ui.eventHandlerPinch);
            $('html').bind('rotate', bucket.ui.eventHandlerRotate);
        };

        bucket.ui.screenHeight = null;
        bucket.ui.screenWidth = null;
        bucket.ui.fpsLabel = null;
        bucket.ui.offscreenLeft = -3500; // left css
        bucket.ui.offscreenRight = -3500; // right css
        bucket.ui.offscreenTop = -3500;
        bucket.ui.offscreenBottom = 50000;
        bucket.ui.profileBackground = "light";
        bucket.ui.profileColor = "red";
        bucket.ui.currentPanel = "";
        bucket.ui.currentEffect = 'wave-top-left';

        bucket.ui.currentViewData = {
            section: 'map',
            elevation: 'country', // country, region, state
            tileData: [],
            title: 'Select a Region',
            description: 'Select a Region',
            code: 'us',
            codeRegion: 'sw',
            codeCountry: 'us',
            codeState: '',
            displayCode: 'US',
            url: 'us',
            urlRoot: 'us',
            urlParams: 'test=1&test2=2',
            urlHash: 'n=0'
        };

        bucket.ui.customBrandedBackgroundItems = [
            "#tile-settings",
            "#tile-overlay-info",
            ".panel-results-tile",
            "#panel-info-header",
            "#tile-search",
            "#tile-brand",
            "#tile-brand-profile",
            "#tile-logo",
            ".brand-background"
        ];

        bucket.ui.customBrandedItems = [
            "#title-section"
        ];

        bucket.ui.customColorBackgroundClasses = [
            "color-background-brand-red",
            "color-background-brand-pink",
            "color-background-brand-lightblue",
            "color-background-brand-darkblue",
            "color-background-brand-teal"
        ];

        bucket.ui.customColorClasses = [
            "color-brand-red",
            "color-brand-pink",
            "color-brand-lightblue",
            "color-brand-darkblue",
            "color-brand-teal"
        ];

        bucket.ui.viewStates = {
            school: "school",
            u: "u",
            me: "me",
            people: "people",
            group: "group",
            place: "place",
            city: "city",
            company: "company",
            info: "info"
        };

        bucket.ui.handleContentDataItems = function (container, url) {
            bucket.u.ajax(url, {
                callback: function (data) {
                    var obj = $(container);
                    if (obj.length > 0) {
                        obj.append(data);
                    }
                    bucket.ui.refreshUI();
                }
            });
        }

        bucket.ui.getPosition = function (element) {
            var xPosition = 0;
            var yPosition = 0;

            while (element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            return { x: xPosition, y: yPosition };
        }

        bucket.ui.scrollItems = null;
        bucket.ui.scrollItem = null;

        bucket.ui.updatePositionScrollItems = function (b) {
            // position.innerHTML = this.y >> 0;
            console.log('updatePositionScrollItems', b.y >> 0);
        }

        bucket.ui.updatePositionScrollItem = function (b) {
            // position.innerHTML = this.y >> 0;
            console.log('updatePositionScrollItem', b.y >> 0);
        }

        bucket.ui.initScrolls = function () {

            // results scrollbar
            var scrollerItemsId = '#panel-results-wrapper';

            if (bucket.u.exists(scrollerItemsId)) {
                bucket.ui.scrollItems = new IScroll(scrollerItemsId, {
                    scrollbars: false,
                    scrollX: false,
                    scrollY: true,
                    mouseWheel: true
                });

                // bucket.ui.scrollItems.on('scroll', bucket.ui.updatePositionItems);
                // bucket.ui.scrollItems.on('scrollEnd', bucket.ui.updatePositionItems);
            }

            // item view scrollbar
            var scrollerItemId = '#panel-info-wrapper';

            if (bucket.u.exists(scrollerItemId)) {
                bucket.ui.scrollItem = new IScroll(scrollerItemId, {
                    scrollbars: false,
                    scrollX: false,
                    scrollY: true,
                    mouseWheel: true
                });

                // bucket.ui.scrollItem.on('scroll', bucket.ui.updatePositionItem);
                // bucket.ui.scrollItem.on('scrollEnd', bucket.ui.updatePositionItem);
            }

            if (isMobile.any) {
                //bucket.ui.toggleFullScreen();
            }

            document.addEventListener('touchmove', function (e) {
                e.preventDefault();
            }, false);
        }

        bucket.ui.loadContentDiv = function (content) {
            bucket.u.loadDiv("#contents-result", content);
        }

        bucket.ui.loadContentResultsDiv = function (content) {
            bucket.u.loadDiv("#panel-results-items", content);
        }

        bucket.ui.loadContentDivUrl = function (url) {

            bucket.ui.startLoadingIndicator();

            $("#contents-result").load(url, function (responseText, textStatus, req) {
                console.log("contents-result:", url);

                if (textStatus == "error") {
                }

                bucket.ui.refreshUI();
                bucket.ui.stopLoadingIndicator();
            });
        }

        bucket.ui.loadContentResultsDivUrl = function (url) {

            bucket.ui.startLoadingIndicator();

            $("#panel-results-items").load(url, function (responseText, textStatus, req) {
                console.log("panel-results-items:", url);

                if (textStatus == "error") {
                }

                bucket.ui.refreshUI();
                bucket.ui.stopLoadingIndicator();
            });
        }

        // Rendered templates on server, same as client side versions
        // uses mustache and the api services to render profiles, 
        // school, cities, companies etc
        bucket.ui.loadContent = function (path) {
            var url = "/api/v1/contents/" + path;
            bucket.ui.loadContentDivUrl(url);
        }

        bucket.ui.loadContentItemsView = function (path) {
            var url = "/api/v1/contents/" + path;
            bucket.ui.loadContentResultsDivUrl(url);
        }

        bucket.ui.loadContentView = function (pathView) {
            bucket.ui.loadContent("view/" + pathView);
        }

        bucket.ui.lastUrlItemsView = '';
        bucket.ui.currentPaging = {
            page: 1,
            limit: 18,
            sort: "desc",
            field: "date"
        }

        bucket.ui.loadContentViewType = function (filter) {

            if (!filter.title) {
                filter.title = 'Results'
            }

            var viewData = bucket.ui.currentViewData;


            var pathViewChange = filter.viewCode +
                bucket.u.paramValueSeparatorFilter +
                bucket.u.filterToUrlFormat(filter.viewValue);

            if (filter.displayType == "items") {

                var delim = bucket.u.paramValueSeparatorFilter;

                var urlItems = "";
                urlItems += "view/" + viewData.pathView;

                urlItems += "/to/" + viewData.pathTo;
                urlItems += "/find/" + viewData.pathFind;
                urlItems +=
                    delim + "page" + delim + bucket.ui.currentPaging.page +
                    delim + "limit" + delim + bucket.ui.currentPaging.limit;

                if (bucket.ui.lastUrlItemsView != urlItems) {
                    bucket.ui.lastUrlItemsView = urlItems;
                    bucket.ui.loadContentItemsView(urlItems);
                }
            }
            else {
                bucket.ui.loadContentView(pathViewChange);
            }


            var title = $("#panel-info-title");
            if (title.length > 0) {
                title.html(filter.title);
            }
        }

        bucket.ui.toggleFullScreen = function () {
            var doc = window.document;
            var docEl = doc.documentElement;

            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                requestFullScreen.call(docEl);
            }
            else {
                cancelFullScreen.call(doc);
            }
        }

        bucket.ui.isEventHandlerBound = function (obj, eventType) {
            if (obj == null || obj.length == 0) {
                return false;
            }
            var data = jQuery._data(obj[0], 'events');
            if (data != null) {
                if (data[eventType] != null) {
                    data = data[eventType];
                }
            }
            ;
            if (data === undefined || data.length === 0) {
                return false;
            }
            if (data.length > 0) {
                return true;
            }

            return false;

            //return (-1 !== $.inArray(obj, data));
        }

        bucket.ui.attachEventHandler = function (objPath, eventType, f) {
            var obj = $(objPath);
            if (obj && obj.length > 0 &&
                (!objPath.startsWith("#")
                || (objPath.startsWith("#") &&
                     bucket.ui.isEventHandlerBound(obj, eventType) == false))) {
                //if(obj._data.) // one
                obj.off(eventType).on(eventType, function (e) {
                    e.stopPropagation();
                    bucket.u.log('event: ' + objPath + ' ' + eventType + ':', e);
                    f(e);
                });
            }
        }

        bucket.ui.refreshedScrolls = function () {
            //
            bucket.ui.refreshUI();
        }

        bucket.ui.refreshScrolls = function () {

            if (bucket.ui.scrollItems) {
                bucket.ui.scrollItems.refresh();
            }
            if (bucket.ui.scrollItem) {
                bucket.ui.scrollItem.refresh();
            }

            /*
            $("#panel-info-wrapper").jScroll({
                refresh: true
            });

            $("#panel-results-wrapper").jScroll({
                refresh: true
            });
            */
        }

        bucket.ui.refreshInitial = false;

        bucket.ui.refreshUI = function () {
            bucket.ui.refreshScrolls();
            bucket.ui.attachUIEvents();
            bucket.ui.initColorsAdjust(false);
        }

        bucket.ui.setContext = function (title, indicatorCode) {
            $('#title-section').text(title);
            $('.tile-indicator-value').text(indicatorCode);
        }

        bucket.ui.togglePanel = function (div) {
            if (!$(div).hasClass('closed-right')) {
                hidePanel(div);
            }
            else {
                showPanel(div);
            }
        }

        bucket.ui.showPanel = function (div) {
            if ($(div).hasClass('closed-right')) {
                $(div).removeClass('closed-right');
            }
        }

        bucket.ui.hidePanel = function (div) {
            if (!$(div).hasClass('closed-right')) {
                $(div).addClass('closed-right');
            }
            bucket.ui.handlePanelUrlState("hide", name);
        }

        bucket.ui.handlePanelUrlState = function (type, div) {

            if (type == "hide") {
                var close = false;

                if (div.indexOf("results") > -1
                    || div.indexOf("info") > -1) {
                    close = true;
                }

                if (close) {
                    //bucket.ui.changeUrlPanelClose();
                }
            }
            else if (type == "show") {

            }
        }

        bucket.ui.presentPanelModal = function (name) {
            //bucket.ui.hidePanel("#panel-login");

            var close = false;

            if (name != "settings") {
                bucket.ui.hidePanel("#panel-settings");
            }
            if (name != "login") {
                //bucket.ui.hidePanel("#panel-login");
            }
            if (name != "info") {
                bucket.ui.hidePanel("#panel-info");
            }
            if (name != "results") {
                bucket.ui.hidePanel("#panel-results");

            }
            if (name != "filters") {
                bucket.ui.hidePanel("#panel-filters");
            }

            bucket.ui.handlePanelUrlState("hide", name);

            bucket.ui.hideProfilePanelDelayed();

            bucket.ui.showPanel("#panel-" + name);
            bucket.ui.currentPanel = name;
        }

        bucket.ui.hideProfilePanelDelayed = function () {

            setTimeout(bucket.ui.hideProfilePanel, 900);
        }

        bucket.ui.presentPanel = function (name) {

            if (bucket.ui.currentPanel == name) {
                bucket.ui.hidePanel("#panel-" + name);
                bucket.ui.currentPanel = "";
                return;
            }

            bucket.ui.presentPanelExplicit(name);
        }

        bucket.ui.presentPanelExplicit = function (name) {

            bucket.ui.presentPanelModal(name);
        }

        bucket.ui.toggleSettings = function () {
            bucket.ui.togglePanel("#panel-settings");
        }

        bucket.ui.toggleResults = function () {
            bucket.ui.togglePanel("#panel-results");
        }

        bucket.ui.toggleInfo = function () {
            bucket.ui.togglePanel("#panel-info");
        }

        bucket.ui.toggleFilters = function () {
            bucket.ui.togglePanel("#panel-filters");
        }

        bucket.ui.showSettings = function () {
            bucket.ui.showPanel("#panel-settings");
        }

        bucket.ui.showResults = function () {
            bucket.ui.showPanel("#panel-results");
        }

        bucket.ui.showInfo = function () {
            bucket.ui.showPanel("#panel-info");
        }

        bucket.ui.showFilters = function () {
            bucket.ui.showPanel("#panel-filters");
        }

        bucket.ui.hideSettings = function () {
            bucket.ui.hidePanel("#panel-settings");
        }

        bucket.ui.hideResults = function () {
            bucket.ui.hidePanel("#panel-results");
        }

        bucket.ui.hideInfo = function () {
            bucket.ui.hidePanel("#panel-info");
        }

        bucket.ui.hideFilters = function () {
            bucket.ui.hidePanel("#panel-filters");
        }

        bucket.ui.adjustCurrentLayoutToScreen = function () {
            bucket.ui.screenHeight = $(window).height();
            bucket.ui.screenWidth = $(window).width();
        }

        bucket.ui.applyClass = function (div, klass) {
            if (!$(div).hasClass(klass)) {
                $(div).addClass(klass);
            }
        }

        bucket.ui.removeClass = function (div, klass) {
            if ($(div).hasClass(klass)) {
                $(div).removeClass(klass);
            }
        }

        bucket.ui.changeCSS = function (myclass, element, value) {
            var CSSRules = null;
            if (document.getElementById) {
                CSSRules = 'cssRules'
            }
            if (CSSRules) {
                for (var i = 0; i < document.styleSheets[0][CSSRules].length; i++) {
                    if (document.styleSheets[0][CSSRules][i].selectorText == myclass) {
                        document.styleSheets[0][CSSRules][i].style[element] = value
                    }
                }
            }
        }

        bucket.ui.setDialogLoginTitle = function (val) {

            var obj = $(".tile-content-header-title");
            if (obj.length > 0) {
                if (!bucket.u.isNullOrEmptyString(val)) {
                    obj.html(val);
                }
            }
        }

        bucket.ui.panelFlipToggleLoginContainer = function () {
            bucket.u.log("panelFlipToggleLoginContainer", "");
            if ($("#login-container .card").hasClass('flip')) {
                bucket.ui.panelFlipFrontLoginContainer();
            }
            else {
                bucket.ui.panelFlipBackLoginContainer();
            }
        }

        bucket.ui.panelFlipFrontLoginContainer = function () {
            bucket.u.log("panelFlipFrontLoginContainer", "");
            if ($("#login-container .card").hasClass('flip')) {
                $("#login-container .card").removeClass('flip');
                bucket.u.log("panelFlipToggleLoginContainer", "remove flip");

                var tileContentHeader = $('#tile-content-header');
                var tileLogo = $('#tile-logo');

                if (tileContentHeader.length > 0) {
                    TweenLite.to(tileContentHeader, 1, { css: { opacity: 1 }, ease: Power3.linear, delay: 0 });
                }

                if (tileLogo.length > 0) {
                    TweenLite.to(tileLogo, 1, { css: { opacity: 0 }, ease: Power3.linear, delay: 0 });
                }
            }
        }

        bucket.ui.panelFlipBackLoginContainer = function () {
            bucket.u.log("panelFlipFrontLoginContainer", "");
            if (!$("#login-container .card").hasClass('flip')) {
                bucket.u.log("panelFlipToggleLoginContainer", "add flip");

                $("#login-container .card").addClass('flip');

                var tileContentHeader = $('#tile-content-header');
                var tileLogo = $('#tile-logo');

                if (tileContentHeader.length > 0) {
                    TweenLite.to(tileContentHeader, 1, { css: { opacity: 0 }, ease: Power3.linear, delay: 0 });
                }

                if (tileLogo.length > 0) {
                    TweenLite.to(tileLogo, 1, { css: { opacity: 0 }, ease: Power3.linear, delay: 0 });
                }
            }
        }

        bucket.ui.loadingIncrement = 0;
        bucket.ui.showLoadingInterval = null;

        bucket.ui.startLoadingIndicator = function () {

            bucket.ui.loadingIncrement += 1;

            if (bucket.ui.showLoadingInterval == null) {
                bucket.ui.showLoading();
            }
        }

        bucket.ui.stopLoadingIndicator = function () {
            bucket.ui.loadingIncrement -= 1;
        }

        bucket.ui.showLoading = function () {
            if (bucket.ui.showLoadingInterval != null) {
                clearInterval(bucket.ui.showLoadingInterval);
                bucket.ui.showLoadingInterval = null;
            }

            if (bucket.ui.showLoadingInterval == null) {
                bucket.ui.showLoadingInterval = setTimeout(bucket.ui.showLoading, 2500);
            }

            if (bucket.ui.loadingIncrement < 0) {
                bucket.ui.loadingIncrement = 0;
            }

            if (bucket.ui.loadingIncrement > 0) {
                bucket.ui.showLoadingAnimated();
                bucket.ui.loadingIncrement -= 1;
            }
        }

        bucket.ui.showLoadingAnimated = function () {
            bucket.ui.animateFilm($('.img-fill-load'));
            ////bucket.ui.animateFilm($('.tile-indicator-value'));
        }

        bucket.ui.animateFilm = function (obj) {
            if (obj) {
                TweenLite.to(obj, 0.4, { css: { marginTop: "150%", opacity: 0 }, ease: Power3.linear, delay: 0.0 });
                TweenLite.to(obj, 0.0, { css: { marginTop: "-150%", opacity: 0 }, ease: Power3.linear, delay: 0.4 });
                TweenLite.to(obj, 0.2, { css: { marginTop: "0%", opacity: 1 }, ease: Power3.easeOut, delay: 0.6 });
            }
        }

        bucket.ui.initColors = function () {
            bucket.ui.initColorsAdjust(true);
        }

        bucket.ui.initColorsAdjust = function (shouldAdjustLayout) {
            // find all colored divs and apply colors
            ////bucket.u.log("initColors", "");

            bucket.ui.applyClass("html", "color-background-light");
            bucket.ui.applyClass("body", "color-background-light");

            bucket.ui.applyClass("#tile-content-dialog", "color-background-light");
            bucket.ui.applyClass("#tile-content-dialog", "color-dark");

            bucket.ui.applyClass("#tile-content-dialog-main", "color-background-light");
            bucket.ui.applyClass("#tile-content-dialog-main", "color-dark");

            bucket.ui.applyClass("#tile-content-header", "color-background-light");
            bucket.ui.applyClass("#tile-content-header", "color-dark");

            bucket.ui.applyClass("#tile-content-header a", "color-dark");
            bucket.ui.applyClass("#tile-content-header a:hover", "color-dark");
            bucket.ui.applyClass("#tile-content-header a:visited", "color-dark");

            bucket.ui.applyClass(".color-setting", "color-background-light");
            bucket.ui.applyClass(".color-setting", "color-dark");

            bucket.ui.applyClass(".color-setting-background", "color-background-light");
            bucket.ui.applyClass(".color-setting-main", "color-dark");

            bucket.ui.applyClass(".color-setting-background-flipped", "color-background-dark");
            bucket.ui.applyClass(".color-setting-main-flipped", "color-light");

            bucket.ui.applyClass("#tile-settings", "color-light");

            bucket.ui.applyClass("#tile-search", "color-light");

            bucket.ui.applyClass("#tile-brand", "color-highlight");
            bucket.ui.applyClass("#tile-brand-profile", "color-highlight");

            bucket.ui.applyClass("#tile-indicator", "color-background-black");
            bucket.ui.applyClass("#tile-indicator", "color-light");

            bucket.ui.applyClass("#panel-info-close", "color-light");
            bucket.ui.applyClass("#panel-results-close", "color-light");

            bucket.ui.applyClass("#tile-title-background", "color-background-light");
            bucket.ui.applyClass(".panel-backer-alpha", "color-background-light-alpha");

            bucket.ui.applyClass(".panel-background", "color-background-dark");
            bucket.ui.applyClass(".panel-background", "opacity90");


            bucket.ui.applyClass(".panel-background-overlay", "color-background-light");
            bucket.ui.applyClass(".panel-background-overlay", "opacity90");
            //opacity90

            bucket.ui.profileColor = bucket.profile.getCustomColorHighlight();
            bucket.ui.profileBackground = bucket.profile.getCustomColorBackgroundHighlight();

            if (bucket.ui.profileColor == null) {
                bucket.ui.profileColor = "red";
            }

            if (bucket.ui.profileBackground == null) {
                bucket.ui.profileBackground = "light";
            }

            bucket.ui.changeBackgroundAdjust(bucket.ui.profileBackground, shouldAdjustLayout);
            bucket.ui.changeHighlight(bucket.ui.profileColor);
        }

        bucket.ui.initDev = function () {
        }

        bucket.ui.initCustomElements = function () {
            // Handle user customize
            bucket.ui.initColorsAdjust(false);

            bucket.ui.attachEventHandler('#button-accent-red', 'click', function (e) {
                bucket.ui.changeHighlight("red");
            });

            bucket.ui.attachEventHandler('#button-accent-pink', 'click', function (e) {
                bucket.ui.changeHighlight("pink");
            });

            bucket.ui.attachEventHandler('#button-accent-lightblue', 'click', function (e) {
                bucket.ui.changeHighlight("lightblue");
            });

            bucket.ui.attachEventHandler('#button-accent-darkblue', 'click', function (e) {
                bucket.ui.changeHighlight("darkblue");
            });

            bucket.ui.attachEventHandler('#button-accent-teal', 'click', function (e) {
                bucket.ui.changeHighlight("teal");
            });

            bucket.ui.attachEventHandler('#button-background-dark', 'click', function (e) {
                bucket.ui.changeBackground("dark");
            });

            bucket.ui.attachEventHandler('#button-background-light', 'click', function (e) {
                bucket.ui.changeBackground("light");
            });

            // filters

            bucket.ui.attachEventHandler('#button-filter-network', 'click', function (e) {
                bucket.ui.changeUrlFilter("network");
            });

            bucket.ui.attachEventHandler('#button-filter-education-high-school', 'click', function (e) {
                bucket.ui.changeUrlFilter("education_high_school");
            });

            bucket.ui.attachEventHandler('#button-filter-education-college', 'click', function (e) {
                bucket.ui.changeUrlFilter("education_college");
            });

            bucket.ui.attachEventHandler('#button-filter-education-graduate', 'click', function (e) {
                bucket.ui.changeUrlFilter("education_graduate");
            });

            bucket.ui.attachEventHandler('#button-filter-location-city', 'click', function (e) {
                bucket.ui.changeUrlFilter("location_city");
            });

            bucket.ui.attachEventHandler('#button-filter-location-state', 'click', function (e) {
                bucket.ui.changeUrlFilter("location_state");
            });

            bucket.ui.attachEventHandler('#button-filter-location-country', 'click', function (e) {
                bucket.ui.changeUrlFilter("location_country");
            });

            bucket.ui.attachEventHandler('#button-filter-location-hometown-city', 'click', function (e) {
                bucket.ui.changeUrlFilter("hometown_city");
            });

        }

        bucket.ui.navigateBack = function () {
            window.history.go(-1);
        }

        bucket.ui.navigateElevationUp = function () {

            bucket.u.logType("ui", "navigateElevationUp:bucket.ui.currentViewData.elevation", bucket.ui.currentViewData.elevation);

            if (bucket.ui.currentViewData.elevation == "country") {
                // do nothing
            }
            else if (bucket.ui.currentViewData.elevation == "region") {
                var pathTo = bucket.ui.currentViewData.codeCountry;
                bucket.ui.changeUrlTo(pathTo);

                bucket.u.logType("ui", "navigateElevationUp:pathTo", pathTo);
            }
            else if (bucket.ui.currentViewData.elevation == "state") {

                var pathTo = bucket.ui.currentViewData.codeCountry
                    + bucket.u.paramValueSeparatorItem
                    + bucket.ui.currentViewData.codeRegion;
                bucket.ui.changeUrlTo(pathTo);

                bucket.u.logType("ui", "navigateElevationUp:pathTo", pathTo);
            }
        }

        bucket.ui.navigateElevationDown = function (code) {

            if (bucket.ui.currentViewData.elevation == "country") {
                var pathTo = code;
                bucket.ui.changeUrlTo(pathTo);
            }
            else if (bucket.ui.currentViewData.elevation == "region") {
                var pathTo = code;
                bucket.ui.changeUrlTo(pathTo);
            }
            else if (bucket.ui.currentViewData.elevation == "state") {
                // do nothing
            }
        }

        bucket.ui.getResultItemTemplate = function (type, data) {

            if (type == "item-profile") {

            }

            var code = data.code;
            var display_name = data.display_name;

            var template = '';
            template += '<div class="span3">';
            template += '    <div class="panel-results-tile">';
            template += '   <div class="results-picture"><img src="/u/' + code + '/picture" class="img-fill"></div>';
            template += '        <div class="panel-results-tile-content">';
            template += '           <div class="results-name"><a href="javascript:void(0);" class="data-profile" data-object="people" data-type="profile" data-code="' + code + '">' + display_name + '</a></div>';
            template += '            <div class="results-text">';
            template += '                <a href="javascript:void(0);" class="data-profile" data-object="people" data-type="profile" data-code="' + code + '">' + code + '</a>';
            //template += '                <ul>';
            //template += '                    <li><a href="javascript:void(0);" class="data-school" data-object="education" data-type="college" data-code="arizona-state-university">Arizona State University</a></li>';
            //template += '                    <li><a href="javascript:void(0);" class="data-school" data-object="education" data-type="high-school" data-code="marcos-de-niza">Marcos de Niza High School</a></li>';
            //template += '                    <li><a href="javascript:void(0);" class="data-school" data-object="education" data-type="high-school" data-code="chandler-high-school">Chandler High School</a></li>';
            //template += '                </ul>';
            template += '            </div>';
            template += '       </div>';
            template += '    </div>';
            template += '</div>';

            return template;
        }


        bucket.ui.displayResultsClientRendered = function (filter) {
            bucket.u.logType("results", "filter", filter);

            bucket.ui.startLoadingIndicator();

            if (!filter.viewModal) {
                bucket.ui.presentPanelExplicit("results");
            }
            else {
                bucket.ui.presentPanelModal("results");
            }

            var viewData = bucket.ui.currentViewData;

            // update panel results titles

            var pathFind = bucket.u.getPathParamValue(url, bucket.u.paramValueSeparatorFilter, "find");
            var pathFindValue = "any college";
            var pathFindType = "people";

            var results = bucket.api.context.getContextViewDataViewResults();
            var countResults = 0;

            if (results) {

                // clear items

                $("#panel-results-items").html("");

                for (var i = 0; i < results.length; i++) {

                    var data = {};
                    data.code = results[i].username;
                    data.display_name = results[i].firstName + " " + results[i].lastName;

                    var template = bucket.ui.getResultItemTemplate("people", data);

                    $("#panel-results-items").append(template);
                }
            }

            bucket.ui.refreshUI();

            // var pathFindValue = 
            //var titleResults = countResults.toString() + " " + pathFindType + " in " + pathFindValue;

            //$("#panel-results-count").html(countResults);
            //$("#panel-results-title").html(titleResults);

            bucket.ui.stopLoadingIndicator();

        }

        bucket.ui.displayResults = function (filter) {
            bucket.u.logType("displayResults", "filter", filter);
            bucket.u.logType("results", "filter", filter);

            bucket.ui.startLoadingIndicator();

            if (!filter.viewModal) {
                bucket.ui.presentPanelExplicit("results");
            }
            else {
                bucket.ui.presentPanelModal("results");
            }

            var viewData = bucket.ui.currentViewData;

            var url = location.href;

            filter.displayType = "items";

            bucket.ui.loadContentViewType(filter);
        }

        bucket.ui.getDisplayTemplatePath = function (type) {
            return "/content/templates/" + type + ".html";
        }

        // Server rendered

        bucket.ui.renderDisplayTemplateSchoolRendered = function (filter) {
            filter.title = "School";
            bucket.ui.loadContentViewType(filter);
        }

        bucket.ui.renderDisplayTemplateProfileURendered = function (filter) {
            filter.title = "People";
            bucket.ui.loadContentViewType(filter);
        }

        bucket.ui.renderDisplayTemplateCityRendered = function (filter) {
            filter.title = "City";
            bucket.ui.loadContentViewType(filter);
        }

        bucket.ui.renderDisplayTemplateCompanyRendered = function (filter) {
            filter.title = "Company";
            bucket.ui.loadContentViewType(filter);
        }

        bucket.ui.renderDisplayTemplateGroupRendered = function (filter) {
            filter.title = "Group";
            bucket.ui.loadContentViewType(filter);
        }

        bucket.ui.renderDisplayTemplateResultsRendered = function (filter) {
            filter.title = "Results";
            bucket.ui.loadContentViewType(filter);
        }

        // Client rendered + data 

        bucket.ui.renderDisplayTemplateSchoolData = function (filter) {

            bucket.api.school.getSchool(filter);
        }

        bucket.ui.renderDisplayTemplateProfileUData = function (filter) {

            bucket.api.profile.getProfileU(filter);
        }

        bucket.ui.renderDisplayTemplateCityData = function (filter) {

            //bucket.api.city.getCity(filter);
        }

        bucket.ui.renderDisplayTemplateProfileMeData = function (filter) {

            bucket.api.profile.getProfileMe(filter);
        }

        bucket.ui.renderDisplayTemplatePeopleData = function (filter) {

            //bucket.api.profile.getPeople(filter);
        }

        bucket.ui.renderDisplayTemplateGroupData = function (filter) {

            //bucket.api.group.getGroup(filter);
        }

        bucket.ui.renderDisplayTemplatePlaceData = function (filter) {

            //bucket.api.group.getPlace(filter);
        }

        bucket.ui.renderDisplayTemplateCompany = function (filter) {

            //bucket.api.group.getCompany(filter);
        }

        bucket.ui.renderDisplayTemplateInfo = function (filter) {

            //bucket.api.group.getInfo(filter);
        }

        // Local client side cache for renderTemplates from server
        bucket.ui.renderTemplates = {
            school: "",
            u: "",
            me: "",
            people: "",
            group: "",
            place: "",
            company: "",
            info: ""
        }

        bucket.ui.renderDisplayTemplate = function (filter) {

            bucket.u.logType("info", "renderDisplayTemplate", filter);

            bucket.ui.startLoadingIndicator();

            if (filter.renderAction == "client") {
                // Render local template
                bucket.ui.renderDisplayTemplateClientRendered(filter);
            }
            else {
                // Render server template
                bucket.ui.renderDisplayTemplateServerRendered(filter);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.ui.renderDisplayTemplateProcess = function (filter, data, storeLocal) {
            if (bucket.u.isNullOrEmptyString(data) && storeLocal) {
                return;
            }

            if (filter.viewCode == bucket.ui.viewStates.school) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.school = data;
                    bucket.ui.renderDisplayTemplateSchoolData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplateSchoolRendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.u) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.u = data;
                    bucket.ui.renderDisplayTemplateProfileUData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplateProfileURendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.me) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.me = data;
                    bucket.ui.renderDisplayTemplateProfileMeData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplateProfileMeRendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.people) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.people = data;
                    bucket.ui.renderDisplayTemplatePeopleData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplatePeopleRendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.group) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.group = data;
                    bucket.ui.renderDisplayTemplateGroupData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplateGroupRendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.place) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.place = data;
                    bucket.ui.renderDisplayTemplatePlaceData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplatePlaceRendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.city) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.city = data;
                    bucket.ui.renderDisplayTemplateCityData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplateCityRendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.company) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.company = data;
                    bucket.ui.renderDisplayTemplateCompanyData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplateCompanyRendered(filter);
                }
            }
            else if (filter.viewCode == bucket.ui.viewStates.info) {
                if (storeLocal) {
                    bucket.ui.renderTemplates.info = data;
                    bucket.ui.renderDisplayTemplateInfoData(filter);
                }
                else {
                    bucket.ui.renderDisplayTemplateInfoRendered(filter);
                }
            }
        }

        bucket.ui.renderDisplayTemplateServerRendered = function (filter) {

            bucket.ui.renderDisplayTemplateProcess(filter, null, false);

            bucket.ui.stopLoadingIndicator();
        }

        bucket.ui.renderDisplayTemplateClientRendered = function (filter) {

            $.get(bucket.ui.getDisplayTemplatePath(filter.viewCode))
                .done(function (data) {

                    bucket.ui.renderDisplayTemplateProcess(filter, data, true);

                    bucket.ui.stopLoadingIndicator();

                }).fail(function () {
                    bucket.ui.loadContentDiv("Nothing found...");

                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.ui.displayInfo = function (filter) {
            bucket.u.logType("info", "filter", filter);

            bucket.ui.startLoadingIndicator();

            bucket.ui.loadContentDiv("Loading content...");

            if (!bucket.u.isNullOrEmptyString(filter.viewCode)) {
                if (filter.viewCode == bucket.ui.viewStates.school
                    || filter.viewCode == bucket.ui.viewStates.u
                    || filter.viewCode == bucket.ui.viewStates.me
                    || filter.viewCode == bucket.ui.viewStates.city
                    || filter.viewCode == bucket.ui.viewStates.company) {
                    // fetch template
                    filter.server = true;
                    bucket.ui.renderDisplayTemplate(filter);
                }
            }

            //bucket.ui.loadContentAdhoc('education-college--arizona-state-university');

            if (!filter.viewModal) {
                bucket.ui.presentPanelExplicit("info");
            }
            else {
                bucket.ui.presentPanelModal("info");
            }
        }

        bucket.ui.changeUrlViewClose = function () {

        }

        bucket.ui.changeUrlViewInfoElement = function (id) {
            var data = {};

            var type = $(id).html();

            //data.param = "tester";
            bucket.ui.changeUrlViewInfo(data);
        }

        bucket.ui.resetUrlView = function () {
            var url = bucket.u.removeUrlParamValue(location.href, "view");
            bucket.u.log("resetUrlView:url:", url);
            bucket.ui.changeStateUrl(url);
        }

        bucket.ui.changeUrlViewInfo = function (data) {

            bucket.u.log("changeUrlViewInfo", data);
            var url = bucket.u.changeUrlParamValue(location.href, "view", data.type + bucket.u.paramValueSeparatorFilter + data.param);
            bucket.ui.changeStateUrl(url);
        }

        bucket.ui.changeUrlViewInfoType = function (type, val) {
            if (!bucket.u.isNullOrEmptyString(val)) {
                bucket.u.log("changeUrlViewInfoProfile:", val);
                var url = bucket.u.changeUrlParamValue(location.href, "view", type + bucket.u.paramValueSeparatorFilter + val);
                bucket.ui.changeStateUrl(url);
            }
        }

        bucket.ui.changeUrlViewInfoTypeProfileU = function (val) {
            bucket.ui.changeUrlViewInfoType("u", val);
        }

        bucket.ui.changeUrlViewInfoTypeSchool = function (val) {
            bucket.ui.changeUrlViewInfoType("school", val);
        }

        bucket.ui.changeUrlViewInfoTypeCompany = function (val) {
            bucket.ui.changeUrlViewInfoType("company", val);
        }

        bucket.ui.changeUrlViewInfoTypeCity = function (val) {
            bucket.ui.changeUrlViewInfoType("city", val);
        }

        bucket.ui.changeUrlViewResults = function (data) {

            //data.param = "country" + bucket.u.paramValueSeparatorFilter + data.country;
            //data.param = "region" + bucket.u.paramValueSeparatorFilter + data.region;
            //data.param = "state" + bucket.u.paramValueSeparatorFilter + data.state;
            var url = location.href;

            if (data.type == "results") {
                data.param = "loco" + bucket.u.paramValueSeparatorFilter +
                    data.dataX + bucket.u.paramValueSeparatorItem + data.dataY;

                bucket.u.log("changeUrlViewResults", data);
                url = bucket.u.changeUrlParamValue(location.href, "view", "results" + bucket.u.paramValueSeparatorFilter + data.param);
            }

            if (url != location.href) {
                bucket.ui.changeStateUrl(url);
            }
        }

        bucket.ui.changeUrlFilter = function (code) {
            var urlContext = $("#filter-attribute-value-" + code).html();
            urlContext = bucket.u.filterToUrlFormat(code) + bucket.u.paramValueSeparatorFilter + bucket.u.filterToUrlFormat(urlContext);
            bucket.u.logType('events', 'location:' + urlContext);
            var url = bucket.u.changeUrlParamValue(location.href, "find", urlContext);
            //url = bucket.u.removeUrlParamValue(url, "view");
            bucket.ui.changeStateUrl(url);
        }

        bucket.ui.changeUrlPanelClose = function () {
            var url = location.href;
            url = bucket.u.removeUrlParamValue(url, "view");
            bucket.ui.changeStateUrl(url);
        }

        bucket.ui.changeUrlTo = function (code) {
            var url = bucket.u.changeUrlParamValue(location.href, "to", code);
            //url = bucket.u.removeUrlParamValue(url, "view");
            url = bucket.u.removeUrlParamValue(url, "focus");
            bucket.u.logType("results", "changeUrlTo:url:", url);
            bucket.ui.changeStateUrl(url);
        }

        bucket.ui.changeUrlFocus = function (code) {
            var url = bucket.u.changeUrlParamValue(location.href, "focus", code);
            bucket.u.logType("results", "changeUrlFocus:url:", url);
            bucket.ui.changeStateUrl(url);
        }

        bucket.ui.changeUrlFocusValues = function (code) {
            bucket.ui.changeUrlFocus(code);
        }

        bucket.ui.changeUrlFocusZoom = function (code) {
            var url = location.href;
            var paramTo = bucket.u.getUrlParamValue(url, "to");
            var paramFocus = bucket.u.getUrlParamValue(url, "focus");

            // If no 'focus' param then add one and focus it
            if (bucket.u.isNullOrEmptyString(paramFocus)) {
                bucket.ui.changeUrlFocus(code);
            }
                // If focus but the current focus isn't selected, switch
            else if ((paramTo.indexOf(code) == -1 && paramFocus != code)
                || paramFocus != code) {
                bucket.ui.changeUrlFocus(code);
            }
                // If the focus code is not the map location + 
                // The focus code is not the current focus then zoom to elevation
            else if (paramTo.indexOf(code) == -1 && paramFocus == code) {
                code = paramTo + "-" + code;
                url = bucket.u.removeUrlParamValue(url, "focus");
                url = bucket.u.changeUrlParamValue(url, "to", code);
                bucket.ui.changeStateUrl(url);
            }
                // reload current view
            else {
                //bucket.ui.changeUrlFocus(url);
            }

        }

        bucket.ui.lastUrl = '';

        bucket.ui.changeStateUrl = function (url) {

            if (bucket.ui.lastUrl == url
                || bucket.u.isNullOrEmptyString(url)) {
                return;
            }

            bucket.ui.lastUrl = url;

            bucket.ui.startLoadingIndicator();

            var elevationCode = "country";
            var pathCode = "us";

            var pathTo = bucket.u.getUrlParamValue(url, "to");

            var arrPathTo = pathTo.split("-");
            if (arrPathTo.length > 0) { // country
                elevationCode = "country";
            }

            if (arrPathTo.length > 1) { // region
                elevationCode = "region";
            }

            if (arrPathTo.length > 2) { // state
                elevationCode = "state";
            }

            dataCode = arrPathTo.join("-"); //bucket.ui.currentViewData.url

            bucket.ui.changeStateUrlData(url, elevationCode, dataCode);
        }

        bucket.ui.changeStateData = function (level, code) {
            var url = bucket.u.changeUrlParamValue(location.href, "to", code);
            bucket.ui.changeStateUrl(url);
            //bucket.ui.changeStateUrlData(location.href, level, code);
        }

        bucket.ui.changeStateUrlData = function (url, level, code) {
            var tileData = bucket.template.getTemplateDataItem(level, code);

            if (tileData) {
                bucket.ui.changeState(url, tileData.displayName, tileData.displayName,
                    tileData.code, 'map', level, tileData.displayCode, tileData);
            }
            else {
                bucket.u.log("loadUrl:tileData not found:url:", url);
                bucket.u.log("loadUrl:tileData not found:currentViewData:", bucket.ui.currentViewData);
            }
        }

        //bucket.ui.lastChangeStateHistoryUrl = '';

        bucket.ui.changeStateHistory = function (viewDataHistory) {
            if (viewDataHistory != null) {
                if (!bucket.u.isNullOrEmptyString(viewDataHistory.url)) {
                    //&& bucket.ui.lastChangeStateHistoryUrl != viewDataHistory) {
                    //bucket.ui.lastChangeStateHistoryUrl = viewDataHistory;
                    bucket.ui.changeStateUrl(viewDataHistory.url);
                }
            }
        }

        bucket.ui.changeState = function (url, title, description, code, section, elevation, displayCode, tileData) {

            var urlRoot = url;
            var urlParams = '';
            var urlHash = '';

            var pathTo = bucket.u.getUrlParamValue(url, "to");
            var pathFind = bucket.u.getUrlParamValue(url, "find");
            var pathView = bucket.u.getUrlParamValue(url, "view");

            if (url.indexOf('?') > -1) {
                var arrUrlParts = url.split('?');
                if (arrUrlParts.length > 0) {
                    urlRoot = arrUrlParts[0];
                    urlParams = arrUrlParts[1];

                    if (urlParams.indexOf('#') > -1) {
                        var arrUrlSubParts = urlParams.split('#');
                        if (arrUrlSubParts.length > 0) {
                            urlHash = arrUrlSubParts[1];
                        }
                    }
                }
            }

            var arrPathFind = pathFind.split(bucket.u.paramValueSeparatorFilter);
            if (arrPathFind.length > 0) {
                bucket.ui.currentViewData.findCode = arrPathFind[0];
                if (arrPathFind.length > 1) {
                    bucket.ui.currentViewData.findValue = arrPathFind[1];
                }
            }

            var codeCountry = "us";
            var codeRegion = "";
            var codeState = "";

            var arrPathTo = pathTo.split(bucket.u.paramValueSeparatorItem);
            if (arrPathTo.length > 0) { // country
                elevationCode = "country";
                codeCountry = arrPathTo[0];
            }

            if (arrPathTo.length > 1) { // region
                elevationCode = "region";
                codeRegion = arrPathTo[1];
            }

            if (arrPathTo.length > 2) { // state
                elevationCode = "state";
                codeState = arrPathTo[2];
            }

            bucket.ui.currentViewData.pathTo = pathTo;
            bucket.ui.currentViewData.pathFind = pathFind;
            bucket.ui.currentViewData.pathView = pathView;

            bucket.ui.currentViewData.url = url;
            bucket.ui.currentViewData.urlRoot = urlRoot;
            bucket.ui.currentViewData.urlParams = urlParams;
            bucket.ui.currentViewData.urlHash = urlHash;
            bucket.ui.currentViewData.title = title;
            bucket.ui.currentViewData.description = description;
            bucket.ui.currentViewData.code = code;
            bucket.ui.currentViewData.codeCountry = codeCountry;
            bucket.ui.currentViewData.codeRegion = codeRegion;
            bucket.ui.currentViewData.codeState = codeState;

            bucket.ui.currentViewData.section = section;
            bucket.ui.currentViewData.elevation = elevation;
            bucket.ui.currentViewData.tileData = tileData;
            bucket.ui.currentViewData.displayCode = displayCode;

            bucket.u.logType("ui", "changeState:currentViewData:", bucket.ui.currentViewData);

            bucket.ui.pushHistoryState(bucket.ui.currentViewData, title, url);

            bucket.ui.handleViewData();
        }

        bucket.ui.handleViewData = function () {

            var filter = {};
            bucket.api.context.getContextViewData(filter); // calls other ui render after view fetch
        }

        bucket.ui.handleChangeStateMeta = function () {
            var title = 'Drove';
            if (bucket.api.context.data) {
                if (bucket.api.context.data.filters) {
                    title = bucket.api.context.data.filters.displayName;
                }
            }
            document.title = title;
        }

        bucket.ui.lastMapStateChangeElevation = '';
        bucket.ui.lastMapStateChangeCode = '';

        bucket.ui.handleChangeStateMap = function () {

            // Only change if elevation changed

            var updateMap = false;

            if (bucket.ui.lastMapStateChangeElevation !=
                bucket.ui.currentViewData.elevation) {
                bucket.ui.lastMapStateChangeElevation =
                    bucket.ui.currentViewData.elevation;
                updateMap = true;
            }

            if (bucket.ui.lastMapStateChangeCode !=
                 bucket.ui.currentViewData.code) {
                bucket.ui.lastMapStateChangeCode =
                    bucket.ui.currentViewData.code;
                updateMap = true;
            }

            if (!updateMap) {
                return;
            }

            bucket.ui.setContext(
                bucket.ui.currentViewData.title,
                bucket.ui.currentViewData.displayCode.toUpperCase());

            if (bucket.ui.currentViewData.elevation == "country") {
                bucket.canvas.renderMapLevel(
                    bucket.ui.currentViewData.elevation,
                    bucket.ui.currentViewData.code);
                bucket.canvas.zoomInMapLevel("country");
            }
            else if (bucket.ui.currentViewData.elevation == "region") {
                bucket.canvas.renderMapLevel(
                    bucket.ui.currentViewData.elevation,
                    bucket.ui.currentViewData.code);
                bucket.canvas.zoomInMapLevel("region");
            }
            else if (bucket.ui.currentViewData.elevation == "state") {
                bucket.canvas.renderMapLevel(
                    bucket.ui.currentViewData.elevation,
                    bucket.ui.currentViewData.code);
                bucket.canvas.zoomInMapLevel("state");
            }
        }

        bucket.ui.handleChangeStateFocus = function () {
            var pathFocus = bucket.u.getUrlParamValue(location.href, "focus");
            var pathTo = bucket.u.getUrlParamValue(location.href, "to");

            if (bucket.u.isNullOrEmptyString(pathFocus)) {
                return;
            }

            if (pathTo != pathFocus) {

                var elevation = bucket.ui.currentViewData.elevation;
                bucket.u.logType("srv-viewdata", "handleChangeStateFocus:", " elevation:" + elevation + " pathFocus:" + pathFocus);

                if (!bucket.u.isNullOrEmptyString(pathTo)
                    && !bucket.u.isNullOrEmptyString(pathFocus)) {
                    bucket.canvas.highlightTiles("map-" + elevation + "-1",
                        elevation, pathTo, pathFocus);
                }
            }
        }

        bucket.ui.handleChangeStateTo = function () {
            // handling /to param changes    
        }

        bucket.ui.handleChangeStateFind = function () {
            // handling /find param changes 
            var pathFind = bucket.u.getUrlParamValue(bucket.ui.currentViewData.url, "find");
            bucket.canvas.drawHighlightFilter(pathFind);
        }

        bucket.ui.handleChangeStateView = function () {
            // handling /view param changes  
            var pathView = bucket.u.getUrlParamValue(bucket.ui.currentViewData.url, "view");

            var arrPath = pathView.split(bucket.u.paramValueSeparatorFilter);
            // TODO get all of them, for now first set.

            if (arrPath.length > 0) {
                bucket.ui.currentViewData.viewCode = arrPath[0];
                if (arrPath.length > 1) {
                    bucket.ui.currentViewData.viewValue = arrPath[1];
                }
            }

            if (bucket.u.isNullOrEmptyString(pathView)) {
                bucket.ui.hidePanel("#panel-info");
                bucket.ui.hidePanel("#panel-results");
            }

            if (!bucket.u.isNullOrEmptyString(bucket.ui.currentViewData.viewCode)) {
                var viewCode = bucket.ui.currentViewData.viewCode;

                var data = {};
                data.viewCode = bucket.ui.currentViewData.viewCode;
                data.viewValue = bucket.ui.currentViewData.viewValue;
                data.viewPath = pathView;
                data.viewModal = false;

                // handle results panel
                if (viewCode.indexOf("results") > -1) {
                    bucket.ui.displayResults(data);
                }

                // handle detail panel
                if (viewCode.indexOf("city") > -1
                    || viewCode == "u"
                    || viewCode.indexOf("school") > -1
                    || viewCode.indexOf("company") > -1) {
                    bucket.ui.displayInfo(data);
                }
            }

            //panel-
        }

        bucket.ui.handleChangeStateLocation = function () {
            var latitude = bucket.profile.getGeoLat();
            var longitude = bucket.profile.getGeoLong();

            bucket.u.logType("location", "latitude", latitude);
            bucket.u.logType("location", "longitude", longitude);

            var data = bucket.canvas.getTileByLocationDefault(latitude, longitude);
            bucket.canvas.highlightMapTileMain(data.currentLocX, data.currentLocY);

            bucket.u.logType("location", "data", data);

            var radius = 6371;
            var x = radius * Math.cos(latitude) * Math.cos(longitude);
            var y = radius * Math.cos(latitude) * Math.sin(longitude);
            var z = radius * Math.sin(latitude);

            bucket.u.logType("location", "radius", radius);
            bucket.u.logType("location", "x", x);
            bucket.u.logType("location", "y", y);
            bucket.u.logType("location", "z", z);

            /*
            x = R * cos(lat) * cos(lon)
            y = R * cos(lat) * sin(lon)
            z = R *sin(lat)

            R = radius of earth 6371KM

            back conversion
               lat = asin(z / R)
               lon = atan2(y, x)

            */
        }

        bucket.ui.resetState = function () {
            bucket.canvas.hideResultsIndicator();
        }

        bucket.ui.loadHistoryState = function (viewData) {
            bucket.ui.changeStateHistory(viewData);
        }

        bucket.ui.lastPushHistoryStateUrl = '';

        bucket.ui.pushHistoryState = function (data, title, url) {
            //if (Modernizr.history) {

            if (bucket.ui.lastPushHistoryStateUrl != url) {
                bucket.ui.lastUrl = '';
                bucket.ui.lastPushHistoryStateUrl = url;

                //if (bucket.u.isMobileChrome) {
                //    history.pushState(data, title, url);
                //}
                //else {
                history.pushState(data, title, url);
                //}
            }
            //}
        }

        bucket.ui.initHistoryState = function () {

            bucket.ui.changeStateUrl(location.href);

            //if(!bucket.u.isMobileChrome) {
            window.onpopstate = function (event) {
                if (event.state != null) {
                    bucket.ui.handleHistoryState(event.state);
                }
            };

            //}
        }

        bucket.ui.handleHistoryState = function (data) {
            bucket.canvas.tileElevationCodeLast = 'changeme';
            bucket.ui.loadHistoryState(data);
        }

        bucket.ui.onStateChange = function () {

            if (bucket.u.isMobileChrome) {
                //bucket.ui.handleHistoryState(History.getState());
            }
        }

        bucket.ui.initPlacement = function () {
            var tileLoader = $("#tile-loader");
            if (tileLoader.length > 0) {
                TweenLite.to(tileLoader, 1, { css: { opacity: 0.0 }, ease: Power3.linear, delay: 2 });
                TweenLite.to(tileLoader, 0, { css: { left: -5500 }, ease: Power3.easeIn, delay: 5 });
            }

            var holderAppTopLeftContainer = $("#holder-app-top-left-container");
            if (holderAppTopLeftContainer.length > 0) {
                TweenLite.to(holderAppTopLeftContainer, 0, { css: { left: -1000 }, ease: Power3.easeIn });
                TweenLite.to(holderAppTopLeftContainer, 1, { css: { left: 0 }, ease: Power3.easeIn, delay: 3 });
            }

            var holderAppBottomLeftContainer = $("#holder-app-bottom-left-container");
            if (holderAppBottomLeftContainer.length > 0) {
                TweenLite.to(holderAppBottomLeftContainer, 0, { css: { left: -1000 }, ease: Power3.easeIn });
                TweenLite.to(holderAppBottomLeftContainer, 1, { css: { left: 0 }, ease: Power3.easeIn, delay: 3 });
            }

            var holderAppTopRightContainer = $("#holder-app-top-right-container");
            if (holderAppTopRightContainer.length > 0) {
                TweenLite.to(holderAppTopRightContainer, 0, { css: { right: -1000 }, ease: Power3.easeIn });
                TweenLite.to(holderAppTopRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 3 });
                TweenLite.to(holderAppTopRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 4, onComplete: bucket.ui.panelFlipToggleLoginContainer });
            }

            var holderAppBottomRightContainer = $("#holder-app-bottom-right-container");
            if (holderAppBottomRightContainer.length > 0) {
                TweenLite.to(holderAppBottomRightContainer, 0, { css: { right: -1000 }, ease: Power3.easeIn });
                TweenLite.to(holderAppBottomRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 3 });
                TweenLite.to(holderAppBottomRightContainer, 1, { css: { right: 0 }, ease: Power3.easeIn, delay: 4, onComplete: bucket.ui.panelFlipToggleLoginContainer });
            }

            //TweenLite.to(panelLogin, 1, { css: { scaleX: 1.5, scaleY: 1.5 }, ease: Power3.easeIn, delay: 6});

            //setTimeout(panelFlipToggleLoginContainer, 9000);
        }

        bucket.ui.changeBackground = function (profileTo) {
            bucket.ui.changeBackgroundAdjust(profileTo, true);
        }

        bucket.ui.changeBackgroundAdjust = function (profileTo, shouldAdjustLayout) {
            bucket.u.log("changing highlight to:" + profileTo);
            bucket.profile.setCustomColorBackgroundHighlight(profileTo);
            bucket.ui.profileBackground = profileTo;

            if (shouldAdjustLayout) {
                bucket.ui.adjustCurrentLayout();
            }

            if (profileTo == "light") {
                // do white

                // remove

                bucket.ui.removeClass("html", "color-background-highlight");
                bucket.ui.removeClass("body", "color-background-highlight");

                bucket.ui.removeClass("#tile-indicator", "color-background-light");
                bucket.ui.removeClass("#tile-indicator", "color-dark");

                bucket.ui.removeClass("#tile-title-background", "color-background-dark");
                bucket.ui.removeClass(".panel-backer-alpha", "color-background-dark-alpha");

                bucket.ui.removeClass("#panel-results-header", "color-background-light");
                bucket.ui.removeClass("#panel-results-header", "color-dark");

                bucket.ui.removeClass("#tile-content-dialog", "color-background-light");
                bucket.ui.removeClass("#tile-content-dialog", "color-dark");

                bucket.ui.removeClass("#tile-content-dialog-main", "color-background-light");
                bucket.ui.removeClass("#tile-content-dialog-main", "color-dark");

                bucket.ui.removeClass("#tile-content-header", "color-background-light");
                bucket.ui.removeClass("#tile-content-header", "color-dark");

                bucket.ui.removeClass("#tile-content-header a", "color-dark");
                bucket.ui.removeClass("#tile-content-header a:hover", "color-dark");
                bucket.ui.removeClass("#tile-content-header a:visited", "color-dark");

                bucket.ui.removeClass(".color-setting", "color-background-light");
                bucket.ui.removeClass(".color-setting", "color-dark");

                bucket.ui.removeClass(".color-setting-background", "color-background-light");
                bucket.ui.removeClass(".color-setting-main", "color-dark");

                bucket.ui.removeClass(".color-setting-background-flipped", "color-background-dark");
                bucket.ui.removeClass(".color-setting-main-flipped", "color-light");

                bucket.ui.removeClass("#panel-results-close", "color-light");
                //bucket.ui.removeClass("#panel-info-close", "color-dark");

                // apply

                bucket.ui.applyClass("html", "color-background-light");
                bucket.ui.applyClass("body", "color-background-light");

                // indicator

                bucket.ui.applyClass("#tile-indicator", "color-background-black");
                bucket.ui.applyClass("#tile-indicator", "color-light");

                bucket.ui.applyClass("#tile-title-background", "color-background-light");
                bucket.ui.applyClass(".panel-backer-alpha", "color-background-light-alpha");


                bucket.ui.applyClass("#panel-results-header", "color-background-black");
                bucket.ui.applyClass("#panel-results-header", "color-light");

                bucket.ui.applyClass("#tile-content-dialog", "color-background-dark");
                bucket.ui.applyClass("#tile-content-dialog", "color-light");

                bucket.ui.applyClass("#tile-content-dialog-main", "color-background-dark");
                bucket.ui.applyClass("#tile-content-dialog-main", "color-light");

                bucket.ui.applyClass("#tile-content-header", "color-background-dark");
                bucket.ui.applyClass("#tile-content-header", "color-light");

                bucket.ui.applyClass("#tile-content-header a", "color-light");
                bucket.ui.applyClass("#tile-content-header a:hover", "color-light");
                bucket.ui.applyClass("#tile-content-header a:visited", "color-light");

                bucket.ui.applyClass(".color-setting", "color-background-dark");
                bucket.ui.applyClass(".color-setting", "color-light");

                bucket.ui.applyClass(".color-setting-background", "color-background-dark");
                bucket.ui.applyClass(".color-setting-main", "color-light");

                bucket.ui.applyClass(".color-setting-background-flipped", "color-background-light");
                bucket.ui.applyClass(".color-setting-main-flipped", "color-dark");

                bucket.ui.applyClass("#panel-results-close", "color-light");
                //bucket.ui.applyClass("#panel-info-close", "color-light");
            }
            else {
                // do dark

                // remove

                bucket.ui.removeClass("html", "color-background-light");
                bucket.ui.removeClass("body", "color-background-light");

                bucket.ui.removeClass("#tile-indicator", "color-background-black");
                bucket.ui.removeClass("#tile-indicator", "color-light");

                bucket.ui.removeClass("#panel-results-header", "color-background-black");
                bucket.ui.removeClass("#panel-results-header", "color-light");

                bucket.ui.removeClass("#tile-title-background", "color-background-light");
                bucket.ui.removeClass(".panel-backer-alpha", "color-background-light-alpha");

                bucket.ui.removeClass("#tile-content-dialog", "color-background-dark");
                bucket.ui.removeClass("#tile-content-dialog", "color-light");

                bucket.ui.removeClass("#tile-content-dialog-main", "color-background-dark");
                bucket.ui.removeClass("#tile-content-dialog-main", "color-light");

                bucket.ui.removeClass("#tile-content-header", "color-background-dark");
                bucket.ui.removeClass("#tile-content-header", "color-light");

                bucket.ui.removeClass("#tile-content-header a", "color-light");
                bucket.ui.removeClass("#tile-content-header a:hover", "color-light");
                bucket.ui.removeClass("#tile-content-header a:visited", "color-light");

                bucket.ui.removeClass(".color-setting", "color-background-dark");
                bucket.ui.removeClass(".color-setting", "color-light");

                bucket.ui.removeClass(".color-setting-background", "color-background-dark");
                bucket.ui.removeClass(".color-setting-main", "color-light");

                bucket.ui.removeClass(".color-setting-background-flipped", "color-background-light");
                bucket.ui.removeClass(".color-setting-main-flipped", "color-dark");

                bucket.ui.removeClass("#panel-results-close", "color-light");
                //bucket.ui.removeClass("#panel-info-close", "color-dark");

                // apply

                bucket.ui.applyClass("html", "color-background-dark");
                bucket.ui.applyClass("body", "color-background-dark");

                // indicator

                bucket.ui.applyClass("#tile-indicator", "color-background-light");
                bucket.ui.applyClass("#tile-indicator", "color-dark");

                bucket.ui.applyClass("#tile-title-background", "color-background-dark");
                bucket.ui.applyClass(".panel-backer-alpha", "color-background-dark-alpha");

                bucket.ui.applyClass("#panel-results-header", "color-background-light");
                bucket.ui.applyClass("#panel-results-header", "color-dark");

                bucket.ui.applyClass("#tile-content-dialog", "color-background-light");
                bucket.ui.applyClass("#tile-content-dialog", "color-dark");

                bucket.ui.applyClass("#tile-content-dialog-main", "color-background-light");
                bucket.ui.applyClass("#tile-content-dialog-main", "color-dark");

                bucket.ui.applyClass("#tile-content-header", "color-background-light");
                bucket.ui.applyClass("#tile-content-header", "color-dark");

                bucket.ui.applyClass("#tile-content-header a", "color-dark");
                bucket.ui.applyClass("#tile-content-header a:hover", "color-dark");
                bucket.ui.applyClass("#tile-content-header a:visited", "color-dark");

                bucket.ui.applyClass(".color-setting", "color-background-light");
                bucket.ui.applyClass(".color-setting", "color-dark");

                bucket.ui.applyClass(".color-setting-background", "color-background-light");
                bucket.ui.applyClass(".color-setting-main", "color-dark");

                bucket.ui.applyClass(".color-setting-background-flipped", "color-background-dark");
                bucket.ui.applyClass(".color-setting-main-flipped", "color-light");

                bucket.ui.applyClass("#panel-results-close", "color-dark");
                //bucket.ui.applyClass("#panel-info-close", "color-light");
            }
        }

        bucket.ui.removeCurrentBackgroundHighlights = function () {
            for (var i = 0; i < bucket.ui.customBrandedBackgroundItems.length; i++) {
                for (var j = 0; j < bucket.ui.customColorBackgroundClasses.length; j++) {
                    bucket.ui.removeClass(bucket.ui.customBrandedBackgroundItems[i],
                        bucket.ui.customColorBackgroundClasses[j]);
                }
            }
        }

        bucket.ui.removeCurrentColorHighlights = function () {
            for (var i = 0; i < bucket.ui.customBrandedItems.length; i++) {
                for (var j = 0; j < bucket.ui.customColorClasses.length; j++) {
                    bucket.ui.removeClass(bucket.ui.customBrandedItems[i],
                        bucket.ui.customColorClasses[j]);
                }
            }
        }

        bucket.ui.applyBackgroundHighlights = function (colorTo) {
            for (var i = 0; i < bucket.ui.customBrandedBackgroundItems.length; i++) {
                var colorToClass = "color-background-brand-" + colorTo;
                bucket.ui.applyClass(bucket.ui.customBrandedBackgroundItems[i], colorToClass);
            }
        }

        bucket.ui.applyColorHighlights = function (colorTo) {
            for (var i = 0; i < bucket.ui.customBrandedItems.length; i++) {
                var colorToClass = "color-brand-" + colorTo;
                bucket.ui.applyClass(bucket.ui.customBrandedItems[i], colorToClass);
            }
        }

        bucket.ui.changeHighlight = function (profileTo) {
            if (profileTo == "red"
                || profileTo == "lightblue"
                || profileTo == "darkblue"
                || profileTo == "pink"
                || profileTo == "teal") {
                ////bucket.u.log("changing highlight to:", profileTo);
                bucket.ui.removeCurrentColorHighlights();
                bucket.ui.removeCurrentBackgroundHighlights();

                bucket.ui.applyBackgroundHighlights(profileTo);
                bucket.ui.applyColorHighlights(profileTo);
                bucket.profile.setCustomColorHighlight(profileTo);
            }
        }

        bucket.ui.setProfileFilterValues = function () {
            if (bucket.me) {
                bucket.ui.setProfileFilterValue(bucket.keyFilters.name);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.education_high_school);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.education_college);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.education_graduate);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.location_city);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.location_state);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.location_country);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.hometown_city);
                bucket.ui.setProfileFilterValue(bucket.keyFilters.network);
            }
        }

        bucket.ui.setProfileFilterValue = function (code) {
            //filter-attribute-value-location_country
            var id = "filter-attribute-value-" + code;
            var val = bucket.profile.getProfileFilterValue(code);
            if (!bucket.u.isNullOrEmptyString(val)) {
                var obj = $("#" + id);
                if (obj.length > 0) {
                    obj.html(val);
                }
            }
        }

        bucket.ui.setProfileStatusUsername = function (val) {
            var obj = $(".panel-profile-username");
            if (obj.length > 0) {
                if (!bucket.u.isNullOrEmptyString(val)) {
                    obj.html(val);
                }
                else {
                    obj.html("Login or Sign up to bucket");
                }
            }
        }

        bucket.ui.setProfileStatusImage = function (val) {
            var obj = $(".panel-profile-image");
            if (obj.length > 0) {
                var img = '/u/' + val + '/picture';
                img = '<img src="' + img + '" class="img-fill" />';
                obj.html(img);
            }
        }

        bucket.ui.showProfileStatusPanel = function () {
            var panelLogin = $(".panel-profile-status");
            if (panelLogin.length > 0) {
                //TweenLite.to(panelLogin, 1, { css: { left: 0, bottom: 0, opacity: 1.0 }, ease: Power3.linear, delay: 0 });
                if (panelLogin.hasClass('closed-left')) {
                    panelLogin.removeClass('closed-left');
                }
            }
        }

        bucket.ui.hideProfileStatusPanel = function () {
            var panelLogin = $(".panel-profile-status");
            if (panelLogin.length > 0) {
                //TweenLite.to(panelLogin, 1, { css: { left: bucket.ui.offscreenLeft, opacity: 1.0 }, ease: Power3.linear, delay: 0 });
                if (!panelLogin.hasClass('closed-left')) {
                    panelLogin.addClass('closed-left');
                }
            }
        }

        bucket.ui.showProfilePanel = function () {
            var panelLogin = $("#panel-login");
            if (panelLogin.length > 0) {
                if (panelLogin.hasClass('closed-left')) {
                    bucket.ui.hideProfileStatusPanel();
                    panelLogin.removeClass('closed-left');
                    bucket.ui.refreshUI();
                }
            }
        }

        bucket.ui.hideProfilePanel = function () {
            var panelLogin = $("#panel-login");
            if (panelLogin.length > 0) {
                bucket.ui.showProfileStatusPanel();
                if (!panelLogin.hasClass('closed-left')) {
                    panelLogin.addClass('closed-left');
                    bucket.ui.refreshUI();
                }
            }
        }

        bucket.ui.loadContentAll = function (url) {
            // USES JQUERY TO LOAD THE CONTENT
            $.getJSON(url, { cid: url, format: 'json' }, function (json) {
                // THIS LOOP PUTS ALL THE CONTENT INTO THE RIGHT PLACES
                $.each(json, function (key, value) {
                    var obj = $(key);
                    if (obj.length > 0) {

                        if (!bucket.u.isNullOrEmptyString(value)) {
                            obj.html(value);
                        }
                    }
                });
                $("#loading").hide();
            });
        }

        bucket.ui.loadContentAccountStart = function () {
            bucket.u.loadContent('#tile-login', '/account/loginstart');
        }

        bucket.ui.loadContentAccountCallback = function () {
            bucket.u.loadContent('#tile-login', '/account/loginstart');
            if (bucket.ui) {
                bucket.ui.panelFlipBackLoginContainer();
            }
        }

        bucket.ui.loadContentAccountManage = function () {
            bucket.ui.loadContentAccountStart();
            bucket.u.loadContent("#tile-content-dialog", "/account/manage");
            bucket.ui.panelFlipFrontLoginContainer();
            bucket.ui.setDialogLoginTitle("Manage your profile");
        }

        bucket.ui.loadContentAccountManageChangePassword = function () {
            bucket.ui.loadContentAccountStart();
            bucket.u.loadContent("#tile-content-dialog", "/account/managechangepassword");
            bucket.ui.panelFlipFrontLoginContainer();
            bucket.ui.setDialogLoginTitle("Manage: Change Password");
        }

        bucket.ui.loadContentAccountManageExternalLogins = function () {
            bucket.ui.loadContentAccountStart();
            bucket.u.loadContent("#tile-content-dialog", "/account/manageexternallogins");
            bucket.ui.panelFlipFrontLoginContainer();
            bucket.ui.setDialogLoginTitle("Manage: External Logins");
        }

        bucket.ui.loadContentAccountLogin = function () {
            bucket.ui.loadContentAccountStart();
            bucket.u.loadContent("#tile-content-dialog", "/account/login");
            bucket.ui.panelFlipFrontLoginContainer();
            bucket.ui.setDialogLoginTitle("Login with bucket");
        }

        bucket.ui.loadContentAccountLoginExtra = function () {
            bucket.ui.loadContentAccountStart();
            bucket.u.loadContent("#tile-content-dialog", "/account/loginextra");
            bucket.ui.panelFlipFrontLoginContainer();
            bucket.ui.setDialogLoginTitle("Login or Sign Up to bucket");
        }

        bucket.ui.loadContentAccountRegister = function () {
            bucket.ui.loadContentAccountStart();
            bucket.u.loadContent("#tile-content-dialog", "/account/register");
            bucket.ui.panelFlipFrontLoginContainer();
            bucket.ui.setDialogLoginTitle("Sign up with bucket");
        }

        bucket.ui.loadContentAdhoc = function (val) {
            bucket.u.loadContent('#contents-result',
                '/api/v1/contents/?type=filter&format=html&' + escape(val));
        }

        bucket.ui.isParamAction = function (val) {
            if (val.charAt(0) != '-') {
                return true;
            }
            return false;
        }

        bucket.ui.adjustCurrentLayoutInterval = null;

        bucket.ui.adjustCurrentLayout = function () {
            if (bucket.ui.adjustCurrentLayoutInterval != null) {
                clearInterval(bucket.ui.adjustCurrentLayoutInterval);
            }
            bucket.ui.adjustCurrentLayoutInterval = setTimeout(
                bucket.ui.adjustCurrentLayoutDelayed, 1500);
        }

        bucket.ui.adjustCurrentLayoutDelayed = function () {

            bucket.canvas.drawMaps();

            bucket.ui.screenHeight = $(window).height();
            bucket.ui.screenWidth = $(window).width();

            var desiredWidth = $(window).width();//"960";
            var desiredHeight = $(window).height();//"640";
            var scaleVal = 1;//$(window).width() / desiredWidth; //now you have scale value

            for (var i = 0; i < bucket.canvas.mapRenderObjects.length; i++) {

                var items = d3.selectAll("#" + bucket.canvas.mapRenderObjects[i].canvasId + " svg")
                    .attr("viewBox", "0 0 " + desiredWidth * scaleVal + " " + desiredHeight * scaleVal)
                    .attr("width", desiredWidth * scaleVal)
                    .attr("height", desiredHeight * scaleVal);
            }

            bucket.canvas.mapTypeScalePosition("country", "map-country-1");
            bucket.canvas.mapTypeScalePosition("region", "map-region-1");
            bucket.canvas.mapTypeScalePosition("state", "map-state-1");

            clearInterval(bucket.canvas.adjustCurrentLayoutInterval);
        }

        bucket.ui.adjustCurrentPositionInterval = null;

        bucket.ui.adjustCurrentPosition = function () {
            if (bucket.ui.adjustCurrentPositionInterval != null) {
                clearInterval(bucket.ui.adjustCurrentPositionInterval);
            }
            bucket.ui.adjustCurrentPositionInterval = setTimeout(
                bucket.ui.adjustCurrentPositionDelayed, 1500);
        }

        bucket.ui.adjustCurrentPositionDelayed = function () {

            bucket.canvas.mapTypeScalePosition("country", "map-country-1");
            bucket.canvas.mapTypeScalePosition("region", "map-region-1");
            bucket.canvas.mapTypeScalePosition("state", "map-state-1");

            clearInterval(bucket.canvas.adjustCurrentPositionInterval);
        }

        bucket.ui.formRegisterExternal = function () {
            bucket.u.log('formRegisterExternal', $('form#registerExternalForm'));
            $('form#registerExternalForm').submit();
        }

        bucket.ui.formRegister = function () {
            bucket.u.log('formRegister', $('form#registerForm'));
            $('form#registerForm').submit();
        }

        bucket.ui.formLogin = function () {
            $('form#loginForm').submit();
        }

        bucket.ui.formLogout = function () {
            $('form#logoutForm').submit();
        }

        bucket.ui.formExternalLogin = function () {
            $('form#externalLoginForm').submit();
        }

        // UI ATTACH EVENTS

        bucket.ui.attachUIEvents = function () {

            bucket.ui.attachEventHandler('.button-account', 'click', function () {
                bucket.ui.showProfilePanel();
            });

            bucket.ui.attachEventHandler('.button-navigate-back', 'click', function () {
                bucket.ui.panelFlipBackLoginContainer();//panelFlipToggleLoginContainer();
            });

            bucket.ui.attachEventHandler('.button-dismiss', 'click', function () {
                bucket.ui.hideProfilePanel();
            });

            bucket.ui.attachEventHandler('.button-login-flip', 'click', function () {
                bucket.ui.loadContentAccountLogin();
            });

            bucket.ui.attachEventHandler('.button-login-extra-flip', 'click', function () {
                bucket.ui.loadContentAccountLoginExtra();
            });

            bucket.ui.attachEventHandler('.button-register-flip', 'click', function () {
                bucket.ui.loadContentAccountRegister();
            });

            bucket.ui.attachEventHandler('.button-manage-flip', 'click', function () {
                bucket.ui.loadContentAccountManage();
            });

            bucket.ui.attachEventHandler('.button-manage-change-password', 'click', function () {
                bucket.ui.loadContentAccountManageChangePassword();
            });

            bucket.ui.attachEventHandler('.button-manage-external-logins', 'click', function () {
                bucket.ui.loadContentAccountManageExternalLogins();
            });

            bucket.ui.attachEventHandler('.button-manage-view-profile', 'click', function () {
                bucket.ui.changeUrlViewInfoTypeProfileU(bucket.profile.profileState.username);
            });

            bucket.ui.attachEventHandler('.button-login-facebook', 'click', function () {
                bucket.ui.formExternalLogin();
            });

            bucket.ui.attachEventHandler('.button-login-bucket', 'click', function () {
                bucket.ui.formLogin();
            });

            bucket.ui.attachEventHandler('.button-logout-bucket', 'click', function () {
                bucket.ui.formLogout();
            });

            bucket.ui.attachEventHandler('.button-register-bucket', 'click', function () {
                bucket.ui.formRegister();
            });

            bucket.ui.attachEventHandler('.button-register-external', 'click', function () {
                bucket.ui.formRegisterExternal();
            });

            bucket.ui.attachEventHandler('#tile-logo', 'click', function () {
                bucket.ui.panelFlipToggleLoginContainer();
            });

            bucket.ui.attachEventHandler('#tile-nav', 'click', function () {
                bucket.ui.navigateElevationUp();
            });

            bucket.ui.attachEventHandler('#tile-settings', 'click', function () {
                bucket.ui.presentPanel("settings");
            });

            bucket.ui.attachEventHandler('#tile-search', 'click', function () {
                bucket.ui.presentPanel("filters");
            });

            bucket.ui.attachEventHandler('#tile-overlay-info', 'click', function () {
                bucket.ui.presentPanel("results");
            });

            bucket.ui.attachEventHandler('#panel-results-close', 'click', function () {
                bucket.ui.resetUrlView();
                bucket.ui.hidePanel("#panel-results");
            });

            bucket.ui.attachEventHandler('#panel-info-close', 'click', function () {
                bucket.ui.resetUrlView();
                bucket.ui.hidePanel("#panel-info");
            });

            bucket.ui.attachEventHandler('.panel-results-tile', 'click', function () {
                //var id = panelResultsTile.id;
                //bucket.ui.changeUrlViewInfoElement(id);
            });

            // Triggered link types, profile, school, location, company

            bucket.ui.attachEventHandler('.data-object', 'click tap', function (evt) {
                var code = $(evt.currentTarget).data("code");
                var obj = $(evt.currentTarget).data("object");
                var type = $(evt.currentTarget).data("type");

                var slug = bucket.u.filterToUrlFormat(code);

                if (bucket.u.isNullOrEmptyString(code)) {
                    return;
                }
                if (obj == "profile" || obj == "people") {
                    bucket.ui.changeUrlViewInfoTypeProfileU(slug);
                }
                else if (obj == "school" || obj == "education") {
                    bucket.ui.changeUrlViewInfoTypeSchool(slug);
                }
                else if (
                    obj == "company"
                    || obj == "work" || obj == "employer") {
                    bucket.ui.changeUrlViewInfoTypeCompany(slug);
                }
                else if (
                       obj == "location" || obj == "hometown"
                    || obj == "place" || obj == "city"
                    || obj == "state" || obj == "country") {

                    if (obj == "city") {
                        bucket.ui.changeUrlViewInfoTypeCity(slug);
                    }
                }

                return false;
            });
        }

        // EVENTS

        bucket.ui.eventHandlerClick = function (evt) {
            bucket.u.log("eventHandlerClick:", evt);
        }

        bucket.ui.eventHandlerTapOne = function (evt) {
            bucket.u.log("eventHandlerTapOne:", evt);
        }

        bucket.ui.eventHandlerTapTwo = function (evt) {
            bucket.u.log("eventHandlerTapTwo:", evt);
        }

        bucket.ui.eventHandlerTapThree = function (evt) {
            bucket.u.log("eventHandlerTapThree:", evt);
        }

        bucket.ui.eventHandlertapFour = function (evt) {
            bucket.u.log("eventHandlertapFour:", evt);
        }

        bucket.ui.eventHandlerSwipeOne = function (evt) {
            bucket.u.log("eventHandlerSwipeOne:", evt);

            if (obj) {
                var direction = obj.description.split(":")[2]
                if (direction == "left") {
                    //alert("left");
                }
                else if (direction == "right") {
                    //alert("right");
                    //bucket.ui.toggleMenu();
                }
                else {
                    //bucket.ui.toggleMenu();
                }
            }
        }

        bucket.ui.eventHandlerSwipeTwo = function (evt) {
            bucket.u.log("eventHandlerSwipeTwo:", evt);
        }

        bucket.ui.eventHandlerSwipeThree = function (evt) {
            bucket.u.log("eventHandlerSwipeThree:", evt);
        }

        bucket.ui.eventHandlerSwipeFour = function (evt) {
            bucket.u.log("eventHandlerSwipeFour:", evt);
        }

        bucket.ui.eventHandlerSwipeUp = function (evt) {
            bucket.u.log("eventHandlerSwipeUp:", evt);
        }

        bucket.ui.eventHandlerSwipeRightUp = function (evt) {
            bucket.u.log("eventHandlerSwipeRightUp:", evt);
        }

        bucket.ui.eventHandlerSwipeRight = function (evt) {
            bucket.u.log("eventHandlerSwipeRight:", evt);
        }

        bucket.ui.eventHandlerSwipeDown = function (evt) {
            bucket.u.log("eventHandlerSwipeDown:", evt);
        }

        bucket.ui.eventHandlerSwipeLeftDown = function (evt) {
            bucket.u.log("eventHandlerSwipeLeftDown:", evt);
        }

        bucket.ui.eventHandlerSwipeLeft = function (evt) {
            bucket.u.log("eventHandlerSwipeLeft:", evt);
        }

        bucket.ui.eventHandlerSwipeLeftUp = function (evt) {
            bucket.u.log("eventHandlerSwipeLeftUp:", evt);
        }

        bucket.ui.eventHandler = function (evt) {
            bucket.u.log("eventHandler:", evt);
        }

        bucket.ui.eventHandlerPinchOpen = function (evt) {
            bucket.u.log("eventHandlerPinchOpen:", evt);
        }

        bucket.ui.eventHandlerPinchClose = function (evt) {
            bucket.u.log("eventHandlerPinchClose:", evt);
        }

        bucket.ui.eventHandlerRotateCW = function (evt) {
            bucket.u.log("eventHandlerRotateCW:", evt);
        }

        bucket.ui.eventHandlerRotateCCW = function (evt) {
            bucket.u.log("eventHandlerRotateCCW:", evt);
        }

        bucket.ui.eventHandlerSwipeOne = function (evt) {
            bucket.u.log("eventHandlerSwipeOne:", evt);
        }

        bucket.ui.eventHandlerSwipeMove = function (evt) {
            // bucket.u.log("eventHandlerSwipeMove:", evt);
        }

        bucket.ui.eventHandlerPinch = function (evt) {
            bucket.u.log("eventHandlerPinch:", evt);
        }

        bucket.ui.eventHandlerRotate = function (evt) {
            bucket.u.log("eventHandlerRotate:", evt);
        }

        // UI ACTION HANDLERS

        bucket.ui.HandleOnSuccess = function (val) {
            bucket.u.log("HandleOnSuccess:", val);
            bucket.ui.refreshUI();
        }

        bucket.ui.HandleOnBegin = function (val) {
            bucket.u.log("HandleOnSuccessHandleOnBegin:", val);
        }

        bucket.ui.HandleOnComplete = function (val) {
            bucket.u.log("HandleOnComplete:", val);
            bucket.ui.refreshUI();
        }

        bucket.ui.HandleOnFailure = function (val) {
            bucket.u.log("HandleOnFailure:", val);
            bucket.ui.refreshUI();
        }

        bucket.ui.OnLoginSuccessHandler = function () {
            bucket.u.log("OnLoginSuccessHandler:", true);
            bucket.ui.refreshUI();
            bucket.ui.loadContentAccountCallback();
            bucket.api.profile.checkProfile();
            location.reload(true);
        }

        bucket.ui.OnLogoffSuccessHandler = function () {
            bucket.u.log("OnLogoffSuccessHandler:", true);
            //bucket.ui.refreshUI();
            //bucket.ui.loadContentAccountCallback();
            //bucket.api.profile.checkProfile();
            location.reload(true);
        }

        bucket.ui.OnRegisterSuccessHandler = function () {
            bucket.u.log("OnRegisterSuccessHandler:", true);
            bucket.ui.refreshUI();
            bucket.ui.loadContentAccountCallback();
            bucket.api.profile.checkProfile();
            location.reload(true);
        }

        bucket.ui.OnExternalLoginConfirmationSuccessHandler = function () {
            bucket.u.log("OnExternalLoginConfirmationSuccessHandler:", true);
            document.location = "/to/us";
        }

        // TICKS

        bucket.ui.tick = function (currentTime) {
            requestAnimationFrame(bucket.ui.tick);
            bucket.ui.handleTickEvent(currentTime);
        }

        bucket.ui.lastTime = 0.0;
        bucket.ui.lastTimeQuick = 0.0;

        bucket.ui.handleTickEvent = function (currentTime) {
            if (currentTime >= bucket.ui.lastTime + 1000) {
                bucket.ui.lastTime = currentTime;
                bucket.ui.handleTickEventEverySecond(currentTime);
            }

            if (currentTime >= bucket.ui.lastTimeQuick + 200) {
                bucket.ui.lastTimeQuick = currentTime;
                bucket.ui.handleTickEventQuick(currentTime);
            }
        }

        bucket.ui.handleTickEventEverySecond = function (currentTime) {

        }

        bucket.ui.handleTickEventQuick = function (currentTime) {
            bucket.ui.handleContentMoreLinks();
        }

        bucket.ui.handleContentMoreLinks = function () {

            var objUrl = $(".url-more");
            if (objUrl.length > 0) {

                var pos = objUrl.position();

                if (pos.top < 1200) {
                    // Load in this as it may scroll into view
                    var url = objUrl.attr("href");
                    var container = objUrl.data("container");

                    if (bucket.u.isNullOrEmptyString(container)) {
                        container = "#panel-results-items";
                    }

                    objUrl.remove();

                    bucket.ui.handleContentDataItems(container, url);
                }
            }
        }

        // ----------------------------------------
        // CANVAS

        bucket.canvas.init = function () {
            bucket.canvas.loaded = true;
            console.log("bucket.canvas", "loaded");
            bucket.u.log("initialized CanvasController", true);
        };

        // new maps

        bucket.canvas.mapObjects = [];
        bucket.canvas.mapRenderObjects = [];
        bucket.canvas.initialRenderCompleted = false;
        bucket.canvas.lastScaleFactor = 1;

        bucket.canvas.setMapObject = function (mapDataItem) {
            var found = false;
            for (var i = 0; i < bucket.canvas.mapObjects.length; i++) {
                if (bucket.canvas.mapObjects[i].canvasId == mapDataItem.canvasId) {
                    bucket.canvas.mapObjects[i] = mapDataItem;
                }
            }

            if (!found) {
                bucket.canvas.mapObjects.push(mapDataItem);
            }
        }

        bucket.canvas.getMapObject = function (canvasId) {
            for (var i = 0; i < bucket.canvas.mapObjects.length; i++) {
                if (bucket.canvas.mapObjects[i].canvasId == canvasId) {
                    return bucket.canvas.mapObjects[i];
                }
            }
            return null;
        }

        bucket.canvas.setMapRenderObject = function (mapDataItem) {
            var found = false;
            for (var i = 0; i < bucket.canvas.mapRenderObjects.length; i++) {
                if (bucket.canvas.mapRenderObjects[i].canvasId == mapDataItem.canvasId) {
                    bucket.canvas.mapRenderObjects[i] = mapDataItem;
                }
            }

            if (!found) {
                bucket.canvas.mapRenderObjects.push(mapDataItem);
            }
        }

        bucket.canvas.getMapRenderObject = function (canvasId) {
            for (var i = 0; i < bucket.canvas.mapRenderObjects.length; i++) {
                if (bucket.canvas.mapRenderObjects[i].canvasId == canvasId) {
                    return bucket.canvas.mapRenderObjects[i];
                }
            }
            return null;
        }

        bucket.canvas.fetchMaps = function () {
            bucket.canvas.fetchAllMaps(false);
        }

        bucket.canvas.fetchAllMaps = function (drawAll) {
            // Find all maps on the page and render or pull them in to main elevations
            bucket.u.log("canvas:fetchMaps: drawAll", drawAll);

            var mapTags = ['.bucket-map'];
            bucket.canvas.updateMapTags(mapTags);
            bucket.canvas.processMaps();
            if (drawAll) {
                bucket.canvas.drawMaps();
            }
            else {
                bucket.canvas.drawMapInitial();
            }
            bucket.canvas.zoomInMapInitial();
        }

        bucket.canvas.processMaps = function () {
            for (var i = 0; i < bucket.canvas.mapObjects.length; i++) {
                if (bucket.canvas.mapObjects[i].ref == null) {
                    // create reference
                    var mapObject = bucket.canvas.mapObjects[i];
                    var canvasId = mapObject.canvasId;
                    var renderObject = bucket.canvas.getMapRenderObject(canvasId);
                    if (renderObject == null) {

                        renderObject = {};
                        renderObject.canvasType = "svg";
                        renderObject.canvasId = canvasId;
                        renderObject.canvasLib = "d3";
                        renderObject.width = mapObject.width;
                        renderObject.height = mapObject.height;
                        renderObject.datas = {};
                        renderObject.runtime = {};
                        renderObject.view = { zoom: null, translate: [0, 0], scale: 1 };
                        renderObject.datas.canvas = bucket.canvas.createMapType(renderObject);
                        renderObject.datas.stage = null;
                        renderObject.runtime.updateCanvas = true;
                        renderObject.runtime.editable = false;

                        bucket.canvas.setMapRenderObject(renderObject);
                    }
                }
            }
        }

        bucket.canvas.renderMapLevel = function (elevation, code) {
            // Update one of the level maps upon zoom or state change
            // Find correct canvas
            // render current code
            var canvasId = "map-" + elevation + "-1";
            bucket.canvas.updateMapCode(canvasId, elevation, code);
            bucket.canvas.drawMapType(canvasId);
        }

        bucket.canvas.updateMapCode = function (canvasId, level, code) {
            for (var i = 0; i < bucket.canvas.mapObjects.length; i++) {
                // create reference
                var mapObject = bucket.canvas.mapObjects[i];
                if (mapObject.canvasId == canvasId) {
                    mapObject.dataCode = code;
                    mapObject.dataElevation = level;
                }
            }
        }

        bucket.canvas.drawMapInitial = function () {
            bucket.u.log("canvas:drawMapInitial:", true);

            for (var g = 0; g < bucket.canvas.mapObjects.length; g++) {
                bucket.canvas.drawMapType(bucket.canvas.mapObjects[g].canvasId);
                break;
            }
        }

        bucket.canvas.drawMaps = function () {
            bucket.u.log("canvas:drawMaps:", true);

            for (var g = 0; g < bucket.canvas.mapObjects.length; g++) {
                bucket.canvas.drawMapType(bucket.canvas.mapObjects[g].canvasId);
            }

            bucket.ui.handleChangeStateFind();
        }

        bucket.canvas.zoomMapBack = function () {
            if (bucket.ui.currentViewData.elevation == "state") {
                bucket.canvas.zoomInMapLevel("region");
            }
            else if (bucket.ui.currentViewData.elevation == "region") {
                bucket.canvas.zoomInMapLevel("country");
            }
        }

        bucket.canvas.zoomInMapLevel = function (level) {
            if (level == "country") {
                bucket.canvas.zoomInMap("map-country-1");
                bucket.canvas.zoomOutMapFuture("map-region-1");
                bucket.canvas.zoomOutMapFuture("map-state-1");

                bucket.ui.hidePanel("#tile-nav");
            }
            else if (level == "region") {
                bucket.canvas.zoomOutMapPast("map-country-1");
                bucket.canvas.zoomInMap("map-region-1");
                bucket.canvas.zoomOutMapFuture("map-state-1");

                bucket.ui.showPanel("#tile-nav");
            }
            else if (level == "state") {
                bucket.canvas.zoomOutMapPast("map-country-1");
                bucket.canvas.zoomOutMapPast("map-region-1");
                bucket.canvas.zoomInMap("map-state-1");

                bucket.ui.showPanel("#tile-nav");
            }
        }

        bucket.canvas.zoomInMapInitial = function () {
            bucket.canvas.zoomInMapLevel("country");
        }

        bucket.canvas.zoomInMap = function (canvasId) {
            // zoom in current state
            var div = "#" + canvasId;
            if ($(div).hasClass('zoomed-past')) {
                $(div).removeClass('zoomed-past');
            }

            if ($(div).hasClass('zoomed-future')) {
                $(div).removeClass('zoomed-future');
            }

            if ($(div).hasClass('zoomed-present')) {
                $(div).addClass('zoomed-present');
            }
        }

        bucket.canvas.zoomOutMapPast = function (canvasId) {
            // zoom in current state
            var div = "#" + canvasId;

            if ($(div).hasClass('zoomed-present')) {
                $(div).removeClass('zoomed-present');
            }

            if ($(div).hasClass('zoomed-future')) {
                $(div).removeClass('zoomed-future');
            }

            if (!$(div).hasClass('zoomed-past')) {
                $(div).addClass('zoomed-past');
            }
        }

        bucket.canvas.zoomOutMapFuture = function (canvasId) {
            // zoom in current state
            var div = "#" + canvasId;

            if ($(div).hasClass('zoomed-present')) {
                $(div).removeClass('zoomed-present');
            }

            if ($(div).hasClass('zoomed-past')) {
                $(div).removeClass('zoomed-past');
            }

            if (!$(div).hasClass('zoomed-future')) {
                $(div).addClass('zoomed-future');
            }
        }

        bucket.canvas.drawMapType = function (canvasId) {
            // ensure render references
            bucket.canvas.processMaps();

            bucket.u.log("canvas:canvasId:", canvasId);

            // look up map and render it
            var mapObject = bucket.canvas.getMapObject(canvasId);
            var mapRenderObject = bucket.canvas.getMapRenderObject(canvasId)

            if (mapRenderObject.canvasLib == "d3") {
                bucket.canvas.drawMapTypeSVG(mapObject, mapRenderObject);
            }
        }

        bucket.canvas.drawMapTypeSVGTile = function (code, obj, x, y, canvasId, transitionType, tileSize, tileSizeDivider,
            tileTransitionTime, tileDelayTime, initialDelay, startColor, endColor) {

            //x -= offsets.x;
            //y -= offsets.y;
            if (transitionType == "wave-top-left") {

                var xData = x + 1;
                var yData = y + 1;
                var xVal = (xData) * tileSize;
                var yVal = (yData) * tileSize;
                var xOffset = x;
                var yOffset = y;
                var xWidth = tileSize - tileSizeDivider;
                var yHeight = tileSize - tileSizeDivider;
                var incX = xVal;
                var incY = yVal;

                var viewData = bucket.ui.currentViewData;

                if (viewData.elevation == "region") {
                    var offsetsRegion = bucket.template.getTemplateDataOffsets("region", viewData.code);
                    xVal -= offsetsRegion.x * tileSize;
                    yVal -= offsetsRegion.y * tileSize;
                    //xOffset = x + offsetsRegion.x;
                    //yOffset = y + offsetsRegion.y;
                    //yVal -= (yOffset * yHeight);
                }
                else if (viewData.elevation == "state") {
                    var offsetsState = bucket.template.getTemplateDataOffsets("state", viewData.code);
                    xData = offsetsState.x + xData;
                    yData = offsetsState.y + yData;
                    //xOffset = x + offsetsState.x;
                    //yOffset = y + offsetsState.y;
                }

                incX = xVal / tileSize;
                incY = yVal / tileSize;

                var tile = obj
                    .append("rect")
                    //.attr("pointer-events", "visible")
                    .attr("x", xVal)
                    .attr("y", yVal)
                    .attr("width", xWidth)
                    .attr("height", yHeight)
                    .attr("data-x", xData)
                    .attr("data-y", yData)
                    .attr("data-offset-x", xOffset)
                    .attr("data-offset-y", yOffset)
                    .attr("data-canvas-id", canvasId);

                var doAnimation = true;

                if (isMobile.any) {
                    //tileDelayTime = tileDelayTime * 3;
                    x *= 2; y *= 2;
                }

                if (isMobile.any && viewData.elevation == "country") {
                    doAnimation = false;
                }

                if (doAnimation) {
                    tile.style("fill", startColor)
                        .style("opacity", 0)
                        .style("transform", "rotate(0 180 0)")
                        .transition(tileTransitionTime)
                            .delay(initialDelay + (tileDelayTime * incX) + (tileDelayTime * incY))
                            .style("opacity", 1)
                            .style("fill", endColor)
                            .style("transform", "rotate(0 0 0)");
                }
                else {
                    if (tile != null) {
                        tile.style("fill", endColor);
                    }
                }
            }
        }

        bucket.canvas.blockScroll = function () {
            d3.event.preventDefault();
        }

        bucket.canvas.drawHighlightFilter = function (filter) {

            var highlightColor = "";
            var viewData = bucket.ui.currentViewData;
            var elevation = viewData.elevation;
            var canvasId = "map-" + elevation + "-1";

            var colorDefault = bucket.settings.colors.colorBackgroundDark.color;
            if (bucket.ui.profileBackground == "dark") {
                colorDefault = bucket.settings.colors.colorBackgroundLight.color;
            }

            bucket.u.log("drawHighlightFilter:type:", type);
            bucket.u.log("drawHighlightFilter:elevation:", elevation);
            bucket.u.log("drawHighlightFilter:canvasId:", canvasId);
            bucket.u.log("drawHighlightFilter:colorDefault:", colorDefault);

            var drawResults = true;
            var paramValues = bucket.u.getPathParamValues(filter, bucket.u.paramValueSeparatorFilter);

            bucket.u.logType("filter", "paramValues", paramValues);

            for (var i = 0; i < paramValues.length; i++) {

                var filterItem = paramValues[i];

                var type = filterItem;
                var val = bucket.u.getPathParamValue(filter, bucket.u.paramValueSeparatorFilter, type);

                if (bucket.canvas.val == val
                    && bucket.canvas.filter == filter) {
                    return;
                }

                bucket.u.logType("filter", "filterItem", filterItem);
                bucket.u.logType("filter", "type", type);
                bucket.u.logType("filter", "val", val);

                if (!bucket.u.isNullOrEmptyString(type)) {
                    type = type.replace(/-/g, "_");
                }

                if (type == bucket.keyFilters.network) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterTeal.color;
                }
                else if (type == bucket.keyFilters.education_high_school) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterYellow.color;
                }
                else if (type == bucket.keyFilters.education_college) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterGreen.color;
                }
                else if (type == bucket.keyFilters.education_graduate) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterLightblue.color;
                }
                else if (type == bucket.keyFilters.location_city) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterBeige.color;
                }
                else if (type == bucket.keyFilters.location_state) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterLightpink.color;
                }
                else if (type == bucket.keyFilters.location_country) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterPink.color;
                }
                else if (type == bucket.keyFilters.hometown_city) {
                    highlightColor = bucket.settings.colors.colorBackgroundFilterPurple.color;
                }
                else {
                    drawResults = false;
                }

                bucket.u.log("drawHighlightFilter:highlightColor:", highlightColor);

                if (drawResults) {
                    bucket.canvas.drawMapResults(
                        canvasId, colorDefault, highlightColor, true);
                }
            }
        }

        bucket.canvas.drawMapResultData = [];

        bucket.canvas.getMapResultsFromData = function (x, y) {
            bucket.canvas.getMapResultsData();

            if (bucket.canvas.drawMapResultData) {
                for (var i = 0; i < bucket.canvas.drawMapResultData.length; i++) {
                    var item = bucket.canvas.drawMapResultData[i];
                    if (item) {
                        if (item.x == parseInt(x)
                            && item.y == parseInt(y)) {
                            return item;
                        }
                    }
                }
            }
            return null;
        }

        bucket.canvas.getMapResultsFromDataOffset = function (x, y) {
            bucket.canvas.getMapResultsData();

            if (bucket.canvas.drawMapResultData) {
                for (var i = 0; i < bucket.canvas.drawMapResultData.length; i++) {
                    var item = bucket.canvas.drawMapResultData[i];
                    if (item) {
                        if (item.dataOffsetX == parseInt(x)
                            && item.dataOffsetY == parseInt(y)) {
                            return item;
                        }
                    }
                }
            }
            return null;
        }

        bucket.canvas.getMapResultsData = function () {
            //var viewData = bucket.ui.currentViewData;
            //var profileId = bucket.profile.uuid;
            bucket.canvas.drawMapResultData = bucket.api.context.getContextFindDataResults();
            return bucket.canvas.drawMapResultData;
        }

        bucket.ui.lastFilterType = null;
        bucket.ui.lastFilterValue = null;
        bucket.ui.lastMapResults = null;

        bucket.canvas.drawMapResults = function (canvasId, defaultColor, highlightColor, resetFilters) {

            var colorBrandCustom = bucket.profile.getCustomColorHighlight();
            colorBrandCustom = bucket.settings.colorByClass('.color-brand-' + colorBrandCustom);

            var viewData = bucket.ui.currentViewData;
            var results = bucket.api.context.getContextFindDataResults();

            bucket.u.logType("srv-viewdata", "getContextFindDataResults:", results);

            if (bucket.ui.lastMapResults == null && highlightColor != bucket.ui.lastMapColor) {
                bucket.ui.lastMapColor = highlightColor;
                bucket.ui.lastMapResults = bucket.canvas.getMapResultsData();
                //results = bucket.ui.lastMapResults;
            }

            // reset
            if (resetFilters) {
                var path = "#" + canvasId
                    + " rect[data-highlighted='highlighted']";
                //bucket.u.log("drawMapResult:pathFilter:", path);
                var mapCanvasReset = d3.selectAll(path)
                    .style("fill", defaultColor)
                    .style("opacity", 1);
            }

            // reset selected states

            var path = "#" + canvasId
                + " rect[data-selected='selected']";
            bucket.u.logType("filter", "drawMapResult:pathFilter:", path);

            var mapCanvasResetSelected = d3.selectAll(path)
                .style("fill", colorBrandCustom)
                .style("opacity", 1);

            bucket.u.logType("filter", "drawMapResult:mapCanvasResetSelected:", mapCanvasResetSelected);

            if (results) {
                for (var j = 0; j < results.length; j++) {
                    var result = results[j];
                    bucket.canvas.highlightMapTile(canvasId, defaultColor, highlightColor, result.x, result.y);
                }
            }

        }

        bucket.canvas.highlightMapTileMain = function (x, y) {

            var highlightColor = bucket.settings.colors.colorBackgroundFilterOrangeBright.color;;
            var viewData = bucket.ui.currentViewData;
            var elevation = viewData.elevation;
            var canvasId = "map-" + elevation + "-1";

            var colorDefault = bucket.settings.colors.colorBackgroundDark.color;
            if (bucket.ui.profileBackground == "dark") {
                colorDefault = bucket.settings.colors.colorBackgroundLight.color;
            }

            bucket.canvas.highlightMapTile(canvasId, colorDefault, highlightColor, x, y);
        }

        bucket.canvas.highlightMapTile = function (canvasId, defaultColor, highlightColor, x, y) {

            var colorBrandCustom = bucket.profile.getCustomColorHighlight();
            colorBrandCustom = bucket.settings.colorByClass('.color-brand-' + colorBrandCustom);

            var path = "#" + canvasId
                + " svg rect[data-x='" + x + "']"
                + "[data-y='" + y + "']";

            var mapCanvasHighlighted = d3.selectAll(path)
                .attr("data-highlighted", "highlighted")
                .transition(2000)
                    .delay(bucket.canvas.initialDelay + ((15 * x) + (15 * y)))
                    .style("fill", highlightColor)
                    .style("opacity", 1);
        }

        bucket.canvas.drawResultsRect = function (svgElement, elevation, code, count) {
            ////bucket.u.log("drawResultsRect svgElement:", svgElement);
            var templateItem = bucket.template.getTemplateDataItem(elevation, code);
            //getBoundingClientRect()
            if (svgElement) {
                var rect = svgElement.getBoundingClientRect();
                ////bucket.u.log("SVGElement rect:", rect);
                //var item = bucket.canvas.getMapResultsFromData(dataX, dataY);
                //if(item) {
                if (templateItem && rect) {
                    bucket.canvas.renderResultsIndicator(templateItem.displayCode,
                        count, rect.left, rect.top, rect.right, rect.bottom);
                }
                //}
            }
        }

        bucket.canvas.showResultsIndicator = function () {
            var indicator = $("#tile-overlay-info");
            if (indicator.length > 0) {
                indicator.show();
            }
        }

        bucket.canvas.hideResultsIndicator = function () {
            var indicator = $("#tile-overlay-info");
            if (indicator.length > 0) {
                indicator.hide();
            }
        }

        bucket.canvas.renderResultsIndicator = function (displayCode, displayCount, left, top, right, bottom) {
            var indicator = $("#tile-overlay-info");
            var indicatorCount = $("#tile-overlay-info-count");
            var indicatorCode = $("#tile-overlay-info-code");
            var position = indicator.position();

            if (indicatorCode.length > 0) {
                if (!bucket.u.isNullOrEmptyString(displayCode)) {
                    indicatorCode.html(displayCode);
                }
            }
            if (indicatorCount.length > 0) {
                if (!bucket.u.isNullOrEmptyString(displayCount)) {
                    indicatorCount.html(displayCount);
                }
            }

            left = position.right;

            if (indicator.length > 0) {
                ////bucket.u.log("indicator:", indicator);
                indicator.hide();
                TweenLite.to(indicator, 0, {
                    css: {
                        left: left, top: top
                    }, ease: Power3.easeIn
                });
                indicator.show();
            }
        }

        bucket.canvas.mapReset = function (mapObject) {
            var items = d3.selectAll("#" + mapObject.canvasId
                + " svg g[id='container-all'] g").remove();
        }

        bucket.canvas.mapTypeScalePosition = function (elevation, canvasId) {
            // get bounding box to zoom to
            var container = null;
            var item = null;
            var box = null;

            var viewData = bucket.ui.currentViewData;

            ////bucket.u.log("mapTypeScalePosition:elevation:", elevation);
            ////bucket.u.log("mapTypeScalePosition:canvasId:", canvasId);

            var pathContainer = "#" + canvasId + " svg g[id='container-all']";
            var pathItem = "#" + canvasId + " svg g[id='container-all'] g[data-elevation='" + elevation + "'] ";

            ////bucket.u.log("mapTypeScalePosition:pathContainer:", pathContainer);
            ////bucket.u.log("mapTypeScalePosition:pathItem:", pathItem);

            container = d3.select(pathContainer);
            item = d3.select(pathItem);

            if (elevation == "country"
                || elevation == "region"
                || elevation == "state") {

                if (item != null) {
                    var node = item.node();
                    if (node) {
                        box = node.getBBox();
                        ////bucket.u.log("box:", box);
                    }
                }
            }

            if (item != null
                && box != null
                && container != null) {

                ////bucket.u.log("mapTypeScalePosition:item:", item);
                ////bucket.u.log("mapTypeScalePosition:box:", box);

                var currentWidth = $(window).width();
                var currentHeight = $(window).height();

                ////bucket.u.log("mapTypeScalePosition:currentWidth:", currentWidth);
                ////bucket.u.log("mapTypeScalePosition:currentHeight:", currentHeight);

                var currentBoxWidth = box.width;
                var currentBoxHeight = box.height;
                var currentBoxX = box.x;
                var currentBoxY = box.y;

                ////bucket.u.log("mapTypeScalePosition:currentBoxWidth:", currentBoxWidth);
                ////bucket.u.log("mapTypeScalePosition:currentBoxHeight:", currentBoxHeight);
                ////bucket.u.log("mapTypeScalePosition:currentBoxX:", currentBoxX);
                ////bucket.u.log("mapTypeScalePosition:currentBoxY:", currentBoxY);

                var scaleFactorX = currentWidth / currentBoxWidth;
                var scaleFactorY = currentHeight / currentBoxHeight;
                var scaleFactorAbs = 1;
                var scaleFactor = bucket.canvas.lastScaleFactor;
                if (scaleFactorX < scaleFactorY) {
                    scaleFactorAbs = scaleFactorX;
                    scaleFactor = scaleFactorAbs * .75;
                }
                else if (scaleFactorY < scaleFactorX) {
                    scaleFactorAbs = scaleFactorY;
                    scaleFactor = scaleFactorAbs * .75;
                }

                scaleFactor = scaleFactor.clamp(.3, 3.3);

                bucket.canvas.lastScaleFactor = scaleFactor;

                var translate = {
                    x: ((currentWidth / 2) - ((currentBoxWidth) / 2) * scaleFactor) - ((currentBoxWidth * .05) * scaleFactor),
                    y: ((currentHeight / 2) - ((currentBoxHeight) / 2) * scaleFactor) + ((currentHeight * .005) * scaleFactor)
                };

                var scale = { x: scaleFactor, y: scaleFactor };
                var lineWidth = scaleFactor;

                ////bucket.u.log("mapTypeScalePosition:scaleFactorX:", scaleFactorX);
                ////bucket.u.log("mapTypeScalePosition:scaleFactorY:", scaleFactorY);
                ////bucket.u.log("mapTypeScalePosition:scaleFactor:", scaleFactor);
                ////bucket.u.log("mapTypeScalePosition:translate:", translate);
                ////bucket.u.log("mapTypeScalePosition:scale:", scale);

                container.attr("transform",
                    "translate(" + translate.x + "," + translate.y + ")" +
                    "scale(" + scaleFactor + "," + scaleFactor + ")")
                        .attr("data-translate", translate.x + "," + translate.y)
                        .attr("data-scale", scaleFactor);

                var mapRenderObject = bucket.canvas.getMapRenderObject(canvasId);
                if (mapRenderObject) {
                    var renderTranslate = [translate.x, translate.y];
                    mapRenderObject.view.zoom.translate(renderTranslate);
                    mapRenderObject.view.zoom.scale(scaleFactor);
                }
            }
        }


        bucket.canvas.initialDelay = 5000;

        bucket.canvas.drawMapTypeSVG = function (mapObject, mapRenderObject) {

            if (mapObject && mapRenderObject) {

                bucket.u.log("canvas:drawMapTypeSVG:", mapObject.canvasId);

                bucket.canvas.initialDelay = 5000;
                var templateDatas = null;

                var canvas = mapRenderObject.datas.canvas;
                var viewData = bucket.ui.currentViewData;

                var tileSize = bucket.canvas.getTileSizeContext();
                var tileSizeDivider = bucket.canvas.getTileDividerSizeContext();

                var item = d3.select("#" + mapObject.canvasId + " svg g[id='container-all']");
                item.attr("data-scale-tile", tileSize - tileSizeDivider);

                var desiredWidth = "960";
                var desiredHeight = "640";
                var scaleVal = 1;//desiredWidth / $(window).width(); //now you have scale value
                // tileSize = tileSize * scaleVal;

                var transitionType = "wave-top-left";
                var tileTransitionTime = 1;
                var tileDelayTime = 25;
                var colorStart = "#ffffff";
                var colorEnd = "#000000";

                var country = 'us';
                var region = 'sw';
                var state = 'az';

                var limiterX = 120;
                var limiterY = 80;

                var currentTemplateTileData = null;
                var isTemplateData = false;
                var drawTile = false;

                var containerCountries = {};
                var containerRegions = {};
                var containerStates = {};

                if (templateDatas == null) {
                    templateDatas = [];
                    templateData = bucket.canvas.templateDataByLevelByCode(
                        mapObject.dataElevation,
                        mapObject.dataCode);
                    templateDatas.push(templateData);
                }

                for (var b = 0; b < templateDatas.length; b++) {
                    currentTemplateTileData = templateDatas[b];
                    break;
                }

                if (bucket.canvas.initialRenderCompleted == true) {
                    bucket.canvas.initialDelay = 25;
                }

                bucket.canvas.mapReset(mapObject);

                tileTransitionTime = tileTransitionTime / 10;
                //tileDelayTime = tileDelayTime * 5;

                colorStart = bucket.settings.colors.colorBackgroundLight.color;
                colorEnd = bucket.settings.colors.colorBackgroundDark.color;

                if (bucket.ui.profileBackground == "dark") {
                    colorStart = bucket.settings.colors.colorBackgroundDark.color;
                    colorEnd = bucket.settings.colors.colorBackgroundLight.color;
                }

                for (var x = 0; x < limiterX; x++) {
                    for (var y = 0; y < limiterY; y++) {

                        drawTile = false;
                        isTemplateData = false;
                        var vector3Data = { x: x, y: y, z: 1 };
                        currentTemplateItem =
                            bucket.canvas.isTileTemplateData(
                                currentTemplateTileData, vector3Data);

                        if (currentTemplateItem) {
                            isTemplateData = true;
                        }

                        if (isTemplateData) {
                            drawTile = true;
                        }

                        if (drawTile) {

                            if (currentTemplateItem) {
                                if (currentTemplateItem.data) {
                                    if (currentTemplateItem.data.country) {
                                        country = currentTemplateItem.data.country;
                                    }
                                    if (currentTemplateItem.data.region) {
                                        region = currentTemplateItem.data.region;
                                    }
                                    if (currentTemplateItem.data.state) {
                                        state = currentTemplateItem.data.state;
                                    }
                                }
                                // country container
                                var currentContainerCountry = containerCountries[country];

                                if (currentContainerCountry == null) {
                                    var container = item.append("g")
                                        .attr("id", "map-country-" + country)
                                        .attr("class", "map-country")
                                        //.attr("pointer-events", "visible")
                                        .attr("data-elevation", "country")
                                        .attr("data-code", country)
                                        .attr("data-country", country)
                                        .attr("data-canvas-id", mapObject.canvasId)
                                    ;
                                    currentContainerCountry = container;
                                    containerCountries[country] = currentContainerCountry;
                                    //currentContainerCountry.on('click',
                                    //    function (event) { bucket.canvas.countryHandlerClickSVG(this); });
                                }
                                else {
                                    currentContainerCountry = containerCountries[country];
                                }

                                // region container
                                var currentContainerRegion = containerRegions[region];

                                if (currentContainerRegion == null) {
                                    var container = currentContainerCountry.append("g")
                                        .attr("id", "map-region-" + region)
                                        .attr("class", "map-region")
                                        //.attr("pointer-events", "visible")
                                        .attr("data-elevation", "region")
                                        .attr("data-code", country + "-" + region)
                                        .attr("data-country", country)
                                        .attr("data-region", region)
                                        .attr("data-canvas-id", mapObject.canvasId)
                                    ;
                                    currentContainerRegion = container;
                                    containerRegions[region] = currentContainerRegion;
                                    //currentContainerRegion.on('click',
                                    //function (event) { bucket.canvas.regionHandlerClickSVG(this); });
                                }
                                else {
                                    currentContainerRegion = containerRegions[region];
                                }

                                // state container
                                var currentContainerState = containerStates[state];

                                if (currentContainerState == null) {
                                    var container = currentContainerRegion.append("g")
                                        .attr("id", "map-state-" + state)
                                        .attr("class", "map-state")
                                        //.attr("pointer-events", "visible")
                                        .attr("data-elevation", "state")
                                        .attr("data-code", country + "-" + region + "-" + state)
                                        .attr("data-country", country)
                                        .attr("data-region", region)
                                        .attr("data-state", state)
                                        .attr("data-canvas-id", mapObject.canvasId)
                                    ;
                                    currentContainerState = container;
                                    containerStates[state] = currentContainerState;
                                    //currentContainerState.on('click',
                                    //function (event) { bucket.canvas.stateHandlerClickSVG(this); });
                                }
                                else {
                                    currentContainerState = containerStates[state];
                                }

                                var pathCode = country + "-" + region + "-" + state;

                                if (viewData.elevation == "country"
                                    || viewData.elevation == "region"
                                    || (viewData.elevation == "state"
                                        && viewData.code == pathCode)) {

                                    bucket.canvas.drawMapTypeSVGTile(pathCode,
                                        currentContainerState, x, y,
                                        mapObject.canvasId,
                                        transitionType, tileSize, tileSizeDivider,
                                        tileTransitionTime, tileDelayTime, bucket.canvas.initialDelay,
                                        colorStart, colorEnd);
                                }
                            }
                        }
                    }
                }

                //if (viewData.elevation == mapObject.elevation) {
                bucket.canvas.mapTypeScalePosition(viewData.elevation,
                    "map-" + viewData.elevation + "-1");
                //}

                d3.selectAll("#" + mapObject.canvasId + " svg").on('click',
                    function (event) { bucket.canvas.canvasHandlerClickSVG(this); });

                bucket.canvas.initialRenderCompleted = true;
            }
        }

        bucket.canvas.createMapType = function (mapRenderObject) {
            if (mapRenderObject.canvasType == "svg"
                    && mapRenderObject.canvasLib == "d3") {
                return bucket.canvas.createMapTypeSVGD3(mapRenderObject);
            }
            return null;
        }

        bucket.canvas.createMapTypeSVGD3 = function (mapRenderObject) {

            var desiredWidth = $(window).width();//"960";
            var desiredHeight = $(window).height();//"640";
            var scaleVal = $(window).width() / desiredWidth; //now you have scale value
            //tileSize = tileSize * scaleVal;

            var container = d3.select("#" + mapRenderObject.canvasId)
            .on("mousewheel", bucket.canvas.blockScroll)
            .on("DOMMouseScroll", bucket.canvas.blockScroll)
                .append("svg")
                .attr("viewBox", "0 0 " + desiredWidth * scaleVal + " " + desiredHeight * scaleVal)
                .attr("width", desiredWidth * scaleVal)//mapRenderObject.width)
                .attr("height", desiredHeight * scaleVal)
                .attr("pointer-events", "all")
            //.data(positions);

            var containerDrag = container
                .append("g")
                .attr("id", "container-all")
                //.attr("pointer-events", "visible")
                .attr("class", "draggable")
                .attr("class", "zoomable")
                .attr("data-translate", "")
                .attr("data-scale", "")
                .attr("data-scale-tile", "")
                .attr("x", 0)
                .attr("y", 0)
                .attr("transform", "translate(0 0 0) scale(1 1 1) rotate(0 0 0)");

            var zoom = d3.behavior.zoom();
            //zoom.translate([translate.x, translate.y])
            //zoom.scale(scaleFactor)

            zoom.on("zoom", function () {
                var translate = d3.event.translate.join(",");
                var scale = d3.event.scale;
                d3.selectAll($(this).find("#container-all"))
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
                    .attr("data-translate", translate)
                    .attr("data-scale", scale);
            });
            zoom.scaleExtent([.3, 4]);

            mapRenderObject.view.zoom = zoom;
            mapRenderObject.view.translate = zoom;

            bucket.canvas.setMapRenderObject(mapRenderObject);

            container.call(zoom);

            return container;
        }

        bucket.canvas.updateMapTags = function (mapClassTags) {
            // for each placholder, update map by map data if exists
            // The class 'bucket-map' is the switch to turn on/off map services on a placeholder
            // 
            // Both tags below would be updated dynamically with the cookie/campaign if exists on a
            // page with the services api javascript library (it's on every page on drupal at the bottom
            // after google analytics).

            //<div class="bucket-map" data-elevation="country" data-code"us" data-canvas-type="svg-d3" data-canvas-id="" />
            //<div class="bucket-map" data-elevation="region" data-code"us-sw" />
            //<div class="bucket-map" data-elevation="state" data-code"us-sw-az" />
            //<!-- filters still in progress -->
            //<div class="bucket-map" data-elevation="state" data-code"us-sw-az" data-data="school:[Chandler High School]" />

            var mapElevationKey = 'data-elevation';
            var mapCodeKey = 'data-code';
            var mapDataKey = 'data-data';
            var mapCanvasTypeKey = 'data-canvas-type';
            var mapCanvasIdKey = 'data-canvas-id';

            for (var i = 0; i < mapClassTags.length; i++) {
                // loop all dynamic tags to lookup
                //ServiceAPI.Instance.log('i', i);
                //ServiceAPI.Instance.log('crmClassTags[i]', crmClassTags[i]);
                $(mapClassTags[i]).each(function (index) {

                    var currentMapClassTag = mapClassTags[i];
                    var currentDataElevation = $(this).attr(mapElevationKey);
                    var currentDataCode = $(this).attr(mapCodeKey);
                    var currentDataData = $(this).attr(mapDataKey);
                    var currentDataCanvasType = $(this).attr(mapCanvasTypeKey);
                    var currentDataCanvasId = $(this).attr(mapCanvasIdKey);

                    bucket.u.log('map:----------------', "");
                    bucket.u.log('map:currentDataElevation', currentDataElevation);
                    bucket.u.log('map:currentDataCode', currentDataCode);
                    bucket.u.log('map:currentDataData', currentDataData);
                    bucket.u.log('map:currentDataCanvasType', currentDataCanvasType);
                    bucket.u.log('map:currentDataCanvasId', currentDataCanvasId);

                    // TODO filter parser... [filter]:[val]

                    if (bucket.u.isNullOrEmptyString(currentDataElevation)) {
                        currentDataElevation = "country";
                    }

                    if (bucket.u.isNullOrEmptyString(currentDataCode)) {
                        currentDataCode = "us";
                    }

                    if (bucket.u.isNullOrEmptyString(currentDataData)) {
                        currentDataData = "";
                    }

                    if (bucket.u.isNullOrEmptyString(currentDataCanvasType)) {
                        currentDataCanvasType = "svg-d3";
                    }

                    if (bucket.u.isNullOrEmptyString(currentDataCanvasId)) {
                        currentDataCanvasId = "map-" + (i + 1);
                    }

                    if (!bucket.u.isNullOrEmptyString(currentDataCode)) {
                        var mapObject = {};
                        mapObject.dataElevation = currentDataElevation;
                        mapObject.dataCode = currentDataCode;
                        mapObject.canvasType = currentDataCanvasType;
                        mapObject.canvasId = currentDataCanvasId;
                        mapObject.data = null;
                        mapObject.el = this;
                        mapObject.updating = true;

                        bucket.canvas.setMapObject(mapObject);
                    }
                });
            }
        }

        bucket.canvas.getTileByLocationDefault = function (
            lat, long) {
            // chandler
            lat = 33;
            long = -111;

            // new york
            // lat = 43.6
            // long = -73.7;

            startLat = 50;
            endLat = 20;

            startLong = -130;
            end_long = -65;
            tilesize = 8;

            mapWidth = 960;
            mapHeight = 640;

            var data = bucket.canvas.getTileByLocation(
            lat, long, tilesize, mapWidth, mapHeight,
            startLat, startLong, endLat, end_long);

            return data;
        }

        bucket.canvas.getTileByLocation = function (
            lat, long, tilesize, mapWidth, mapHeight,
            startLat, startLong, endLat, end_long) {
            // map geo rect to map size
            // find position within map pixel ranges

            var rectx = end_long - startLong;
            var recty = endLat - startLat;

            var tileWidth = (mapWidth / tilesize);
            var tileHeight = (mapHeight / tilesize);

            // find where current loc fits within range
            // map is 65 wide in long
            // curren location is -111
            // find that within -65 - -130

            var currentLocX = (Math.abs(long) * rectx) / 100 - rectx;
            var currentLocY = (Math.abs(lat) * recty) / 100 - recty;
            var currentLocXScaled = (currentLocX * tileWidth) / 100;
            var currentLocYScaled = (currentLocY * tileHeight) / 100;

            // TODO work in equator check, flip x or y based on location , us is always flip y
            //bucket.canvas.draw_map_easel(Math.abs(currentLocXScaled), Math.abs(tileHeight - currentLocYScaled, 8));

            var userLocX = 1;

            // if width of the actual tiles are 120 (8px per)
            // and there is 60 available area to draw
            // each point would be double to find it's tile

            var data = {};
            data.currentLocX = currentLocX;
            data.currentLocY = currentLocY;
            data.currentLocXScaled = currentLocXScaled;
            data.currentLocYScaled = currentLocYScaled;

            return data;
        }

        bucket.canvas.templateData = function (type, time, delay, properties, data) {
            var templateDataItem = {
                type: type, time: time, delay: delay, properties: properties, data: data
            };
            return templateDataItem;
        }

        bucket.canvas.templateDataByLevelByCode = function (level, code) {
            var templateDataItem = bucket.canvas.templateData(
                "flip-wave", 2000, 0, {}, {
                    tiles: bucket.template.getTemplateDrawArray(level, code)
                }
            );
            return templateDataItem;
        }

        bucket.canvas.isTileTemplateData = function (templateData, vector3Data) {
            if (templateData == null)
                return false;

            if (templateData.data == null)
                return false;

            if (templateData.data.tiles == null)
                return false;

            var tiles = templateData.data.tiles;
            if (tiles != null) {
                for (var i = 0; i < tiles.length; i++) {
                    if (vector3Data.x == tiles[i].x
                        && vector3Data.y == tiles[i].y) {
                        //bucket.u.log('isTileTemplateData: vector3Data:', vector3Data);
                        return tiles[i];
                    }
                }
            }
            return null;
        }

        bucket.canvas.highlightTilesSelectionSVG = function (
            canvasId, defaultColor, highlightColor, elevation, val) {

            var mapObject = bucket.canvas.getMapObject(canvasId);
            if (mapObject) {

                var viewData = bucket.ui.currentViewData;

                var pathMapObject = "#" + mapObject.canvasId;
                var pathMapObjectContainer = pathMapObject + " g[id='container-all']";
                var pathAll = pathMapObject + " rect";
                var pathItemLevel = pathMapObject + " g[data-" + elevation + "='" + val + "']";
                var pathItem = pathItemLevel + " rect";

                var tileSize = bucket.canvas.getTileSizeContext();
                var tileSizeDivider = bucket.canvas.getTileDividerSizeContext();
                var tileScale = tileSize - tileSizeDivider;
                var relativeScale = (tileSize / 8) * 1;

                var pathItemResultContainer =
                    pathMapObjectContainer + " g[data-elevation='country']";

                if (elevation == "region") {
                    pathItemResultContainer =
                        pathMapObjectContainer + " g[data-elevation='country']";
                }
                else if (elevation == "state") {
                    pathItemResultContainer =
                        pathMapObjectContainer + " g[data-elevation='region']";
                }

                var pathOverlay = pathItemResultContainer + " g[data-overlay='resultRect']";

                var dataItem = bucket.template.getTemplateDataItemByDisplayCode(elevation, val);
                var dataDisplayCode = "SW";
                var dataDisplayCount = "0";

                if (dataItem) {
                    dataDisplayCode = dataItem.displayCode;
                    dataDisplayCount =
                        bucket.api.context.getContextToDataCountByCode(
                        dataItem.displayCode.toLowerCase());
                }

                var itemCurrent = d3.select(pathItemLevel);
                var offsetsElevation = bucket.template.getTemplateDataOffsets(
                    viewData.elevation, viewData.code);

                var bboxWidth = 0;
                var bboxHeight = 0;
                var bboxX = 8;
                var bboxY = 8;
                var sizeOverlay = 64;

                if (itemCurrent) {
                    var node = itemCurrent.node();
                    if (node) {
                        var boundingBox = node.getBBox();
                        bboxWidth = boundingBox.width;
                        bboxHeight = boundingBox.height;
                        bboxX = boundingBox.x;
                        bboxY = boundingBox.y;
                        bucket.u.log("boundingBox", boundingBox);
                    }
                }

                var positionX = bboxX;
                var positionY = bboxY;

                positionX -= sizeOverlay * relativeScale;

                if (positionX < sizeOverlay * relativeScale) {
                    positionX += bboxWidth + 1 + sizeOverlay;
                }

                // adjust for elevation
                // adjust for anchor, anchor top but along tile lines 

                var randomAjust = bucket.u.getRandomInt(-3, 1);

                positionY = ((bboxY - (sizeOverlay / 2.0)) +
                    (bboxHeight / 2.0)).roundToStep(tileSize) +
                    (randomAjust * tileSize);

                // remove any section overlay
                var itemLevels = d3.selectAll(pathOverlay)
                    .remove();

                // d3 filter for data- elements
                // reset any highlights

                d3.selectAll(pathAll)
                    .attr("data-selected", "selected")
                    .transition(1)
                        .style("fill", defaultColor)
                        .style("opacity", 1);

                d3.selectAll(pathAll)
                    .attr("data-selected", null)
                    .transition(500)
                        .delay(10)
                        .style("fill", defaultColor)
                        .style("opacity", 1);

                // Set the highlight under current color selected

                var rand = bucket.u.getRandomInt(1, 150);

                var item = d3.selectAll(pathItem)
                        .attr("data-selected", "selected")
                    .transition(500 + rand)
                        .delay(500 + rand)
                        .style("fill", highlightColor)
                        .style("opacity", 1);

                // Drew the section overlay / callout tile

                var itemContainer = d3.select(pathItemResultContainer)
                    .append("g")
                    .attr("x", positionX)
                    .attr("y", positionY)
                    .attr("transform",
                        "translate(" +
                            positionX + "," +
                            positionY + ")scale(" +
                            relativeScale + ")")
                    .attr("width", sizeOverlay - 1)
                    .attr("height", sizeOverlay - 1)
                    .attr("data-overlay", "resultRect");

                itemContainer.append("rect")
                    .attr("width", sizeOverlay - 1)
                    .attr("height", sizeOverlay - 1)
                    .style("opacity", 0)
                    .attr("x", 0)
                    .attr("y", 0)
                    .transition(500)
                        .delay(550)
                        .style("fill", highlightColor)
                        .style("opacity", 1);

                itemContainer.append("text")
                    .attr("x", 8)
                    .attr("y", 20)
                    .style("opacity", 0)
                    .transition(500)
                        .delay(550)
                        .text(dataDisplayCode)
                        .style("fill", "#ffffff")
                        .style("font-weight", "bold")
                        .style("font-size", "16px")
                        .style("text-anchor", "start")
                        .style("opacity", 1);

                itemContainer.append("text")
                    .attr("x", 56)
                    .attr("y", 56)
                    .style("opacity", 0)
                    .transition(500)
                        .delay(550)
                        .text(dataDisplayCount)
                        .style("fill", "#ffffff")
                        .style("font-weight", "bold")
                        .style("font-size", "16px")
                        .style("text-anchor", "end")
                        .style("opacity", 1);

                itemContainer.append("line")
                    .attr("x1", 56)
                    .attr("y1", 8)
                    .attr("x2", 8)
                    .attr("y2", 56)
                    .style("opacity", 0)
                    .transition(500)
                        .delay(550)
                    .attr("stroke-width", 2)
                    .attr("stroke", "#ffffff")
                    .style("opacity", 1);
                //<line x1="5" y1="5" x2="40" y2="40" stroke="gray" stroke-width="5"  />
                //<text x="20" y="20" font-family="sans-serif" font-size="20px" fill="red">Hello!</text>
            }
        }

        bucket.canvas.highlightTilesByRegionSVG = function (canvasId, defaultColor, highlightColor, region) {
            bucket.canvas.highlightTilesSelectionSVG(canvasId, defaultColor, highlightColor, "region", region);
        }

        bucket.canvas.highlightTilesByStateSVG = function (canvasId, defaultColor, highlightColor, state) {
            bucket.canvas.highlightTilesSelectionSVG(canvasId, defaultColor, highlightColor, "state", state);
        }

        bucket.canvas.getTileSizeContext = function () {
            var tileSizeContext = 8;
            /*
            var currentWidth = $(window).width();
            // 8/960 = x/currentWidth;
            tileSizeContext = currentWidth * 8 / 960;
            tileSizeContext = Math.floor(tileSizeContext) - 1;
            if (tileSizeContext < 1) {
                tileSizeContext = 1;
            }
            */
            return tileSizeContext;
        }

        bucket.canvas.getTileDividerSizeContext = function () {
            var tileSizeContext = 1;
            /*
            var currentWidth = $(window).width();

            bucket.u.log("currentWidth:" + currentWidth);
            bucket.u.log("tileSizeContext:" + tileSizeContext);

            // 8/960 = x/currentWidth;
            tileSizeContext = currentWidth * 1 / 960;
            //tileSizeContext = Math.floor(tileSizeContext);
            if (tileSizeContext <= .05) {
                tileSizeContext = .05;
            }
            bucket.u.log("tileSizeContext:" + tileSizeContext);
            */
            return tileSizeContext;
        }

        bucket.canvas.getTileSizeContextElevation = function (elevation) {
            var tileSizeContext = 8;
            //var currentWidth = $(window).width();
            // 8/960 = x/currentWidth;
            /*
            tileSizeContext = currentWidth * 8 / 960;
            if (elevation != "country") {
                tileSizeContext = Math.floor(tileSizeContext) - 1;
            }
            else {
                tileSizeContext = 7;
            }
            
            if (tileSizeContext < 2) {
                tileSizeContext = 2;
            }
            */
            bucket.u.log("tileSizeContext:" + tileSizeContext);
            return tileSizeContext;
        }

        bucket.canvas.getTileDividerSizeContextElevation = function (elevation) {

            var tileDividerSizeContext = 1;

            if (elevation != "country") {
                tileDividerSizeContext = bucket.canvas.getTileDividerSizeContext();
            }
            else {
                tileDividerSizeContext = 0;
            }
            bucket.u.log("tileDividerSizeContext:" + tileDividerSizeContext);
            return tileDividerSizeContext;
        }

        bucket.canvas.highlightTiles = function (canvasId, elevation, code, val) {

            var doRender = false;
            var elevationTo = "country";
            var colorBrandCustom = bucket.profile.getCustomColorHighlight();
            colorBrandCustom = bucket.settings.colorByClass('.color-brand-' + colorBrandCustom);

            var colorDefault = bucket.settings.colors.colorBackgroundDark.color;
            if (bucket.ui.profileBackground == "dark") {
                colorDefault = bucket.settings.colors.colorBackgroundLight.color;
            }

            if (elevation == "country") {
                elevationTo = "region";

                bucket.canvas.tileElevationCode = val;

                if (bucket.canvas.tileElevationCode !=
                    bucket.canvas.tileElevationCodeLast) {

                    bucket.canvas.tileElevationCodeLast =
                        bucket.canvas.tileElevationCode;

                    bucket.canvas.highlightTilesByRegionSVG(canvasId,
                        colorDefault, colorBrandCustom, val);
                }
                else {
                    doRender = true;
                }

            }
            else if (elevation == "region") {
                elevationTo = "state";

                bucket.canvas.tileElevationCode = val;

                if (bucket.canvas.tileElevationCode !=
                    bucket.canvas.tileElevationCodeLast) {

                    bucket.canvas.tileElevationCodeLast =
                        bucket.canvas.tileElevationCode;

                    bucket.canvas.highlightTilesByStateSVG(canvasId,
                        colorDefault, colorBrandCustom, val);
                }
                else {
                    doRender = true;
                }
            }
            else if (elevation == "state") {
                bucket.canvas.tileElevationCode = val;
                bucket.canvas.tileElevationCodeLast = val;

                var filter = {};
                filter.type = "results";
                filter.elevation = elevation;
                filter.code = code;
                filter.param = "location-" + elevation + bucket.u.paramValueSeparatorFilter + code;

                bucket.ui.changeUrlViewResults(filter);
            }

            if (doRender && !bucket.canvas.deferBubbleEvents) {
                bucket.ui.changeStateData(elevationTo, code);
            }

            if (bucket.canvas.deferBubbleEvents) {
                bucket.canvas.deferBubbleEvents = false;
            }
        }

        bucket.canvas.deferBubbleEvents = false;

        bucket.canvas.countryHandlerClickSVG = function (obj) {

            bucket.u.logType("ui", "countryHandlerClickSVG:obj:", obj);

            var viewData = bucket.ui.currentViewData;
            var country = $(obj).attr("data-country");
            var code = $(obj).attr("data-code");
            var canvasId = $(obj).attr("data-canvas-id");
            var highlighted = $(obj).attr("data-highlighted");
            var hasHighlight = (highlighted == "highlighted") ? true : false;

            if (!hasHighlight) {

                bucket.u.logType("ui", "countryHandlerClickSVG:viewData.elevation:", viewData.elevation);
                bucket.u.logType("ui", "countryHandlerClickSVG:country:", country);

                if (viewData) {
                    if (viewData.elevation == "country") {
                        bucket.u.logType("ui", "countryHandlerClickSVG2:country:", viewData.elevation);
                        //bucket.canvas.highlightTiles("map-country-1", viewData.elevation, code, country);
                    }
                }
            }
        }

        bucket.canvas.regionHandlerClickSVG = function (obj) {

            var viewData = bucket.ui.currentViewData;

            var country = $(obj).attr("data-country");
            var region = $(obj).attr("data-region");
            var code = $(obj).attr("data-code");
            var canvasId = $(obj).attr("data-canvas-id");
            var highlighted = $(obj).attr("data-highlighted");
            var hasHighlight = (highlighted == "highlighted") ? true : false;

            if (!hasHighlight) {
                var count = 33;

                bucket.u.logType("ui", "regionHandlerClickSVG:viewData.elevation:", viewData.elevation);
                bucket.u.logType("ui", "regionHandlerClickSVG:country:", country);
                bucket.u.logType("ui", "regionHandlerClickSVG:region:", region);

                if (viewData) {
                    if (viewData.elevation == "country") {
                        bucket.u.logType("ui", "regionHandlerClickSVG2:region:", viewData.elevation);
                        bucket.ui.changeUrlFocusZoom(region);
                    }
                }
            }
        }

        bucket.canvas.stateHandlerClickSVG = function (obj) {

            var viewData = bucket.ui.currentViewData;

            var country = $(obj).attr("data-country");
            var region = $(obj).attr("data-region");
            var state = $(obj).attr("data-state");
            var code = $(obj).attr("data-code");
            var canvasId = $(obj).attr("data-canvas-id");
            var highlighted = $(obj).attr("data-highlighted");
            var hasHighlight = (highlighted == "highlighted") ? true : false;

            if (!hasHighlight) {

                var count = 33;

                bucket.u.logType("ui", "stateHandlerClickSVG:viewData.elevation:", viewData.elevation);
                bucket.u.logType("ui", "stateHandlerClickSVG:country:", country);
                bucket.u.logType("ui", "stateHandlerClickSVG:region:", region);
                bucket.u.logType("ui", "stateHandlerClickSVG:state:", state);

                if (viewData) {
                    if (viewData.elevation == "region") {
                        bucket.u.logType("ui", "stateHandlerClickSVG2:state:", viewData.elevation);
                        bucket.ui.changeUrlFocusZoom(state);
                    }
                }
            }
        }

        bucket.canvas.canvasHandlerClickSVG = function (obj) {

            bucket.ui.startLoadingIndicator();

            //bucket.u.logType("ui", "canvasHandlerClickSVG:obj", obj);

            var canvasId = $(obj).parent().attr("id");

            //bucket.u.logType("ui", "canvasHandlerClickSVG:canvasId:", canvasId);

            var canvasWidth = $(obj).attr("width");
            var canvasHeight = $(obj).attr("height");

            //bucket.u.logType("ui", "canvasHandlerClickSVG:canvasWidth:", canvasWidth);
            //bucket.u.logType("ui", "canvasHandlerClickSVG:canvasHeight:", canvasHeight);

            var pos = d3.mouse(obj);
            var mouseX = 0;
            var mouseY = 0;

            if (pos[0]) {
                mouseX = pos[0];
            }

            if (pos[1]) {
                mouseY = pos[1];
            }

            var viewData = bucket.ui.currentViewData;

            //bucket.u.logType("ui", "canvasHandlerClickSVG:mouseX:", mouseX);
            //bucket.u.logType("ui", "canvasHandlerClickSVG:mouseY:", mouseY);

            var container = d3.selectAll("#" + canvasId + " svg g[id = 'container-all']");

            if (container) {
                // figure out where we clicked in this map object
                //bucket.u.logType("ui", "canvasHandlerClickSVG:container:", container);

                // We have mouseX/Y and height/width but need to get relative scale/position

                var dataScale = container.attr("data-scale");
                var dataScaleTile = container.attr("data-scale-tile");
                var dataTranslate = container.attr("data-translate");

                //bucket.u.logType("ui", "canvasHandlerClickSVG:dataScale", dataScale);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:dataScaleTile", dataScaleTile);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:dataTranslate", dataTranslate);

                // Get scale and translation (position vector 2)

                var translateX = 0.0;
                var translateY = 0.0;

                if (dataTranslate) {
                    var arrTranslate = dataTranslate.split(',');
                    if (arrTranslate[0]) {
                        translateX = arrTranslate[0];
                    }
                    if (arrTranslate[1]) {
                        translateY = arrTranslate[1];
                    }
                }

                var tileSize = (parseInt(dataScaleTile) + 1);

                //bucket.u.logType("ui", "canvasHandlerClickSVG:translateX", translateX);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:translateY", translateY);

                var offsetsElevation = bucket.template.getTemplateDataOffsets(viewData.elevation, viewData.code);

                //bucket.u.logType("ui", "canvasHandlerClickSVG:offsetsElevation", offsetsElevation);

                // Find the relative position within the container object

                var offsetX = ((mouseX) - (translateX));
                var offsetY = ((mouseY) - (translateY));

                //bucket.u.logType("ui", "canvasHandlerClickSVG:offsetX", offsetX);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:offsetY", offsetY);

                // Find scaled xy with scaled map to figure out x/y closest node

                var tileX = offsetX / tileSize;
                var tileY = offsetY / tileSize;

                //bucket.u.logType("ui", "canvasHandlerClickSVG:tileSize", tileSize);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:tileX", tileX);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:tileY", tileY);

                // Get absolute x/y floored for full tile coverage

                var absoluteX = Math.floor(tileX / dataScale);
                var absoluteY = Math.floor(tileY / dataScale);

                //bucket.u.logType("ui", "canvasHandlerClickSVG:absoluteX", absoluteX);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:absoluteY", absoluteY);

                // Get final xy for the elevation by offsets.

                var tileOffsetX = absoluteX + offsetsElevation.x;
                var tileOffsetY = absoluteY + offsetsElevation.y;

                //bucket.u.logType("ui", "canvasHandlerClickSVG:tileOffsetX", tileOffsetX);
                //bucket.u.logType("ui", "canvasHandlerClickSVG:tileOffsetY", tileOffsetY);

                var scaledX = absoluteX * tileSize;
                var scaledY = absoluteY * tileSize;

                var obj = d3.selectAll("#" + canvasId +
                    " svg g[id='container-all'] g g g rect[data-x='" + tileOffsetX + "'][data-y='" + tileOffsetY + "']");

                bucket.u.logType("ui", "canvasHandlerClickSVG:obj", obj);

                if (obj) {
                    var objTile = obj[0][0];
                    if (objTile != null) {
                        bucket.canvas.tileHandlerClickSVG(objTile);
                    }
                }
            }
        }

        bucket.canvas.containerHandlerClickSVG = function (obj) {
            //var dataX = $(obj).attr("data-x");
            //bucket.u.logType("ui", "containerHandlerClickSVG:obj", obj);
        }

        bucket.canvas.canvasHandlerMoveSVG = function (obj) {
            //d3.mouse(this)
            bucket.u.logType("ui", "containerHandlerMoveSVG:d3.mouse(this):", d3.mouse(obj));
            bucket.u.logType("ui", "containerHandlerMoveSVG:obj", obj);
        }

        bucket.canvas.tileElevationCode = '';
        bucket.canvas.tileElevationCodeLast = 'changeme';

        bucket.canvas.tileHandlerClickSVG = function (obj) {

            if (obj == null) {
                return;
            }

            bucket.ui.hideProfilePanelDelayed();

            var dataX = $(obj).attr("data-x");
            var dataY = $(obj).attr("data-y");
            var dataOffsetX = $(obj).attr("data-offset-x");
            var dataOffsetY = $(obj).attr("data-offset-y");

            var state = $(obj.parentNode).attr("data-state");
            var region = $(obj.parentNode.parentNode).attr("data-region");
            var country = $(obj.parentNode.parentNode.parentNode).attr("data-country");
            var canvasId = $(obj.parentNode).attr("data-canvas-id");
            var highlighted = $(obj.parentNode).attr("data-h");
            var hasHighlight = (highlighted == "highlighted") ? true : false;
            var hasData = false;
            var viewData = bucket.canvas.currentViewData;

            //if (hasData){
            bucket.canvas.deferBubbleEvents = true;
            //}

            bucket.u.logType("ui", "tileHandlerClickSVG:dataX:", dataX);
            bucket.u.logType("ui", "tileHandlerClickSVG:dataY:", dataY);
            //bucket.u.logType("ui", "tileHandlerClickSVG:dataOffsetX:", dataOffsetX);
            //bucket.u.logType("ui", "tileHandlerClickSVG:dataOffsetY:", dataOffsetY);
            bucket.u.logType("ui", "tileHandlerClickSVG:state:", state);
            bucket.u.logType("ui", "tileHandlerClickSVG:region:", region);
            //bucket.u.logType("ui", "tileHandlerClickSVG:country:", country);
            //bucket.u.logType("ui", "tileHandlerClickSVG:canvasId:", canvasId);

            //bucket.u.logType("ui", "tileHandlerClickSVG:bucket.canvas.tileElevationCode:",
            //    bucket.canvas.tileElevationCode);

            var resultItem = bucket.canvas.getMapResultsFromData(dataX, dataY);

            var count = 0;
            if (resultItem) {
                count = resultItem.resultCount;
                if (count > 0)
                    hasData = true;
            }

            bucket.u.logType("ui", "tileHandlerClickSVG:hasData:", hasData);

            if (hasData) {
                var filter = {};
                filter.type = "results";
                filter.viewModal = true;
                filter.dataX = dataX;
                filter.dataY = dataY;
                filter.dataOffsetX = dataOffsetX;
                filter.dataOffsetY = dataOffsetY;
                filter.resultItem = resultItem;

                bucket.ui.changeUrlViewResults(filter);
            }
            else {

                var url = location.href;
                var paramFocus = bucket.u.getUrlParamValue(url, "focus");
                var viewData = bucket.ui.currentViewData;

                if (viewData) {
                    //bucket.u.logType("ui", "tileHandlerClickSVG:viewData:", viewData);
                    //var hasParamFocus = !bucket.u.isNullOrEmptyString(paramFocus);

                    if (viewData.elevation == "country") {
                        bucket.u.logType("ui", "tileHandlerClickSVG:region:", viewData.elevation);
                        bucket.ui.changeUrlFocusZoom(region);
                    }
                    else if (viewData.elevation == "region") {
                        bucket.u.logType("ui", "tileHandlerClickSVG:state:", viewData.elevation);
                        bucket.ui.changeUrlFocusZoom(state);
                    }
                }
            }

            bucket.ui.stopLoadingIndicator();
        }

        // ----------------------------------------
        // TEMPLATE

        bucket.template.init = function () {
            bucket.template.loaded = true;
            console.log("bucket.template", "loaded");
            bucket.u.log("initialized TemplateController", true);
        };

        bucket.template.templateDatas = templateDesignDatas;

        bucket.template.getTemplateDrawReferenceData = function (level, code, nestedLevel, nestedCode) {
            var templateItem = bucket.template.getTemplateDataItem(level, code);
            if (templateItem) {
                for (var i = 0; i < templateItem.drawReferenceData.length; i++) {
                    var item = templateItem.drawReferenceData[i];
                    if (item.type == nestedLevel
                        && item.code == nestedCode) {
                        return item;
                    }
                }
            }
            return null;
        }

        bucket.template.getCodeParts = function (code) {

            var country = '';
            var region = '';
            var state = '';

            var parts = code.split('-');
            if (parts.length > 0) {
                country = parts[0];
            }
            if (parts.length > 1) {
                region = parts[1];
            }
            if (parts.length > 2) {
                state = parts[2];
            }

            var partsObject = {
                country: country,
                region: region,
                state: state,
                pathCountry: function () {
                    var path = "";
                    if (country != null
                        && country != '') {
                        path += country;
                    }
                    return path;
                },
                pathRegion: function () {
                    var path = "";
                    if (country != null
                        && country != '') {
                        path += country;
                    }
                    if (region != null
                        && region != '') {
                        path += "-" + region;
                    }
                    return path;
                },
                pathState: function () {
                    var path = "";
                    if (country != null
                        && country != '') {
                        path += country;
                    }
                    if (region != null
                        && region != '') {
                        path += "-" + region;
                    }
                    if (state != null
                        && state != '') {
                        path += "-" + state;
                    }
                    return path;
                }
            };
            return partsObject;
        }

        bucket.template.getTemplateDataOffsets = function (level, code) {

            var referenceDataCountry = { x: 0, y: 0, z: 0 };
            var referenceDataRegion = { x: 0, y: 0, z: 0 };
            var referenceDataState = { x: 0, y: 0, z: 0 };
            var referenceDataAll = { x: 0, y: 0, z: 0 };

            var parts = bucket.template.getCodeParts(code);

            if (level == "region") {
                referenceDataRegionItem = bucket.template.getTemplateDrawReferenceData(
                    "country", parts.pathCountry(), "region", parts.pathRegion());
                if (referenceDataRegionItem) {
                    referenceDataRegion = referenceDataRegionItem.position;
                }
            }
            else if (level == "state") {
                referenceDataStateItem = bucket.template.getTemplateDrawReferenceData(
                    "region", parts.pathRegion(), "state", parts.pathState());

                if (referenceDataStateItem) {
                    referenceDataState = referenceDataStateItem.position;
                }
            }

            referenceDataAll.x = referenceDataCountry.x + referenceDataRegion.x + referenceDataState.x;
            referenceDataAll.y = referenceDataCountry.y + referenceDataRegion.y + referenceDataState.y;
            referenceDataAll.z = referenceDataCountry.z + referenceDataRegion.z + referenceDataState.z;

            return referenceDataAll;
        }

        bucket.template.getTemplateDataItem = function (level, code) {
            var templateDataItems = [];
            for (var i = 0; i < bucket.template.templateDatas.length; i++) {
                if (bucket.template.templateDatas[i].code == code) {
                    return bucket.template.templateDatas[i];
                }
            }
            return null;
        }

        bucket.template.getTemplateDataItemByCode = function (code) {
            var templateDataItems = [];
            for (var i = 0; i < bucket.template.templateDatas.length; i++) {
                // TODO change to O(1) from O(N) when expanded to more places
                if (bucket.template.templateDatas[i].code == code) {
                    return bucket.template.templateDatas[i];
                }
            }
            return null;
        }

        bucket.template.getTemplateDataItemByDisplayCode = function (level, code) {
            var templateDataItems = [];
            for (var i = 0; i < bucket.template.templateDatas.length; i++) {
                // TODO change to O(1) from O(N) when expanded to more places
                if (bucket.template.templateDatas[i].displayCode.toLowerCase() == code
                    && bucket.template.templateDatas[i].type == level) {
                    return bucket.template.templateDatas[i];
                }
            }
            return null;
        }

        bucket.template.setTemplateDataItem = function (level, code, data) {
            var templateDataItems = [];
            for (var i = 0; i < bucket.template.templateDatas.length; i++) {
                if (bucket.template.templateDatas[i].code == code) {
                    bucket.template.templateDatas[i].drawArray = data;
                }
            }
        }

        bucket.template.getTemplateDataString = function (level, code) {
            var template = bucket.template.getTemplateDataItem(level, code);
            if (template != null) {
                return template.drawStringData;
            }
            return null;
        }

        bucket.template.getTemplateDataItemData = function (level, code) {
            var template = bucket.template.getTemplateDataItem(level, code);
            if (template != null) {
                return template.itemData;
            }
            return null;
        }

        bucket.template.getTemplateDataReference = function (level, code) {
            var template = bucket.template.getTemplateDataItem(level, code);
            if (template != null) {
                return template.drawReferenceData;
            }
            return null;
        }

        bucket.template.getTemplateDrawArray = function (level, code) {
            bucket.template.processTemplateDataArray(level, code);
            var item = bucket.template.getTemplateDataItem(level, code);
            if (item) {
                return item.drawArray;
            }
            return null;
        }

        bucket.template.processTemplateDataArray = function (level, code) {
            var currentTiles = bucket.template.getTemplateDataItem(level, code);
            if (currentTiles) {
                if (currentTiles.drawArray) {
                    if (currentTiles.drawArray.length == 0) {
                        var tiles = bucket.template.getTemplateDataArrayRecursive(level, code);
                        if (tiles != null) {
                            bucket.template.setTemplateDataItem(level, code, tiles);
                        }
                    }
                }
            }
        }

        bucket.template.getTemplateDataArray = function (level, code) {
            // Convert dataString to array to render.

            var templateDrawDataArray = [];
            var templateData = bucket.template.getTemplateDataItem(level, code);
            var templateStringArray = templateData.drawStringData;//bucket.template.getTemplateDataString(level, code);
            var templateItemData = templateData.itemData;

            if (templateStringArray != null) {
                for (var i = 0; i < templateStringArray.length; i++) {
                    var tempItemString = templateStringArray[i];
                    if (!bucket.u.isNullOrEmptyString(tempItemString)) {
                        // for each line item, split to x/y position.
                        var templateItemArray = tempItemString.split(',');

                        for (var j = 0; j < templateItemArray.length; j++) {
                            // create tile
                            var itemData = templateItemArray[j];

                            if (!bucket.u.isNullOrEmptyString(itemData)) {
                                if (itemData != ' ' && itemData != '_') {
                                    var tile = {
                                        data: templateItemData,
                                        x: j, y: i, z: 1, type: 'design',
                                        scale: { x: 1, y: 1, z: 1 },
                                        rotation: { x: 0, y: 0, z: 0 }
                                    };

                                    templateDrawDataArray.push(tile);
                                }
                            }
                        }
                    }
                }
            }
            return templateDrawDataArray;
        }

        bucket.template.getTemplateDataArrayOffset = function (level, code, offsetX, offsetY, offsetZ) {
            // Convert dataString to array to render.

            var templateDrawDataArray = [];
            var templateData = bucket.template.getTemplateDataItem(level, code);
            var templateStringArray = templateData.drawStringData;//bucket.template.getTemplateDataString(level, code);
            var templateItemData = templateData.itemData;

            if (templateStringArray != null) {
                for (var i = 0; i < templateStringArray.length; i++) {
                    var tempItemString = templateStringArray[i];
                    if (!bucket.u.isNullOrEmptyString(tempItemString)) {
                        // for each line item, split to x/y position.
                        var templateItemArray = tempItemString.split(',');

                        if (level == "region") {
                            offsetX = 0; offsetY = 0; offsetZ = 0;
                        }

                        for (var j = 0; j < templateItemArray.length; j++) {
                            // create tile
                            var itemData = templateItemArray[j];

                            if (!bucket.u.isNullOrEmptyString(itemData)) {
                                if (itemData != ' ' && itemData != '_') {
                                    var tile = {
                                        data: templateItemData,
                                        x: j + offsetX,
                                        y: i + offsetY,
                                        z: 1 + offsetZ, type: 'design',
                                        scale: { x: 1, y: 1, z: 1 },
                                        rotation: { x: 0, y: 0, z: 0 }
                                    };

                                    templateDrawDataArray.push(tile);
                                }
                            }
                        }
                    }
                }
            }
            return templateDrawDataArray;
        }

        bucket.template.getTemplateReferenceSet = function (
            templateDrawReferenceData, level, code, offsetX, offsetY, offsetZ) {

            var template = bucket.template.getTemplateDataItem(level, code);
            if (template != null) {
                if (template.drawReferenceData && templateDrawReferenceData) {

                    templateDrawReferenceData = templateDrawReferenceData.concat(
                        template.drawReferenceData);

                    var viewData = bucket.ui.currentViewData;

                    for (var i = 0; i < template.drawReferenceData.length; i++) {
                        // if (template.drawReferenceData[i].drawReferenceData.length > 0) {
                        var innerTemplate = [];

                        template.drawReferenceData[i].position.x += offsetX;
                        template.drawReferenceData[i].position.y += offsetY;
                        template.drawReferenceData[i].position.z += offsetZ;

                        var offsetInnerX = 0;
                        var offsetInnerY = 0;
                        var offsetInnerZ = 0;

                        offsetInnerX = template.drawReferenceData[i].position.x;
                        offsetInnerY = template.drawReferenceData[i].position.y;
                        offsetInnerZ = template.drawReferenceData[i].position.z;

                        var innerData = bucket.template.getTemplateReferenceSet(
                                innerTemplate,
                                template.drawReferenceData[i].elevation,
                                template.drawReferenceData[i].code,
                                offsetInnerX,
                                offsetInnerY,
                                offsetInnerZ);

                        if (innerData) {
                            templateDrawReferenceData =
                                templateDrawReferenceData.concat(innerData);
                        }
                        //}
                    }
                }
            }
            return templateDrawReferenceData;
        }

        bucket.template.getTemplateDataArrayRecursive = function (level, code) {
            // Convert dataString to array to render.
            var templateDrawDataArray = [];
            var templateStringArray = bucket.template.getTemplateDataString(level, code);
            var currentArray = bucket.template.getTemplateDataArray(level, code);
            templateDrawDataArray = templateDrawDataArray.concat(currentArray);

            var viewData = bucket.ui.currentViewData;

            var templateDrawReferenceData = [];
            var templateDrawReferenceData = bucket.template.getTemplateReferenceSet(
                templateDrawReferenceData, level, code, 0, 0, 0);

            // convert each reference item into position in reference data
            for (var i = 0; i < templateDrawReferenceData.length; i++) {
                ////bucket.u.log('templateDrawReferenceData[item]:', templateDrawReferenceData[i]);

                var offsetInnerX = 0;
                var offsetInnerY = 0;
                var offsetInnerZ = 0;

                offsetInnerX = templateDrawReferenceData[i].position.x;
                offsetInnerY = templateDrawReferenceData[i].position.y;
                offsetInnerZ = templateDrawReferenceData[i].position.z;

                // fetch the string data and convert it
                var drawArray = bucket.template.getTemplateDataArrayOffset(
                    templateDrawReferenceData[i].elevation,
                    templateDrawReferenceData[i].code,
                    offsetInnerX,
                    offsetInnerY,
                    offsetInnerZ
                    );

                templateDrawDataArray = templateDrawDataArray.concat(drawArray);
            }
            return templateDrawDataArray;
        }

        // ----------------------------------------
        // API

        bucket.api.apiUrlRoot = "/api/v1/";

        bucket.api.logApiData = function (type, data) {
            var log = bucket.u.logType;

            log(type, "data", data);

            if (data.msg) {
                log(type, "data.msg", data.msg);
            }

            if (data.code) {
                log(type, "data.code", data.code);
            }

            if (data.data) {
                log(type, "data.data", data.data);
            }

            if (data.info) {
                log(type, "data.info", data.info);
            }

            if (data.action) {
                log(type, "data.action", data.action);
            }
        }

        bucket.api.getApiAction = function (filter) {

            var rangeType = 'all';
            var page = 1;
            var pageSize = 36;

            if (filter.rangeType) {
                rangeType = filter.rangeType;
            }
            if (filter.page) {
                page = filter.page;
            }
            if (filter.pageSize) {
                pageSize = filter.pageSize;
            }

            var serviceUrl = bucket.api.apiUrlRoot;
            serviceUrl += filter.action;
            if (serviceUrl.substr(serviceUrl.length - 1, 1) != "/") {
                serviceUrl += "/";
            }

            if (filter.username) {
                serviceUrl += filter.username;
            }

            if (filter.id) {
                serviceUrl += filter.id;
            }

            if (filter.uuid) {
                serviceUrl += filter.uuid;
            }

            if (filter.code) {
                serviceUrl += filter.code;
            }

            serviceUrl += "?api=v1";

            if (filter.rangeType) {
                serviceUrl += "&range=" + filter.rangeType;
            }

            if (filter.page) {
                serviceUrl += "&page=" + filter.page;
            }

            if (filter.pageSize) {
                serviceUrl += "&page-size=" + filter.pageSize;
            }

            if (filter.username) {
                serviceUrl += "&username=" + escape(filter.username);
            }

            if (filter.params) {
                serviceUrl += filter.params;
            }

            if (filter.json) {
                serviceUrl += "&format=json&callback=?";
            }

            return serviceUrl;
        }

        // ----------------------------------------
        // API

        // ERROR               

        bucket.api.error.init = function () {

        }

        bucket.api.error.handleServiceError = function (val) {
            console.log(val);
        }

        // PROFILE

        bucket.api.profile.init = function () {
            bucket.api.profile.loaded = true;
            console.log("bucket.api.profile", "loaded");
        }

        bucket.api.profile.render = function (filter) {
            bucket.api.profile.getProfile(filter);
        }

        bucket.api.profile.renderResponse = function (filter, data) {

            /*
            var rangeType = 'all';
            var page = 1;
            var pageSize = 50;

            if (filter.rangeType) {
                rangeType = filter.rangeType;
            }
            if (filter.page) {
                page = filter.page;
            }
            if (filter.pageSize) {
                pageSize = filter.pageSize;
            }

            var templateHeader = '';
            var templateLayout = '';
            var templateItem = '';

            templateLayout += '<table id="item-container" class="table">';
            templateLayout += ' <tr>';
            templateLayout += bucket.u.renderWrapTagStyles('th', 'Value', 'head-item item-head-value');
            templateLayout += ' </tr>';
            for (i = 0; i < data.data.length; i++) {
                templateLayout += ' <tr>';
                templateLayout += bucket.u.renderWrapTagStyles('td', data.data[i].value_formatted, 'item item-value');
                templateLayout += ' </tr>';
            }
            templateLayout += '</table>';

            var view = {
                profileType: { code: 'user', type: 'string' },
                formatted: function () {
                    return bucket.api.profile.profileType.type;
                },
                view_data: data
            };

            var output = Mustache.render(templateLayout, view);
            
            var obj = $(filter.div);
            if (obj.length > 0) {
                if (!bucket.u.isNullOrEmptyString(output)) {
                    obj.html(output);
                }
            }
            */
        }

        bucket.api.profile.getProfile = function (filter) {

            filter.action = "profile";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.profile.filter = filter;

            bucket.u.log("serviceUrl:", serviceUrl);
            $.get(serviceUrl,
                null, bucket.api.profile.getProfileCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.profile.getProfileCallback = function (data) {
            bucket.api.logApiData("profile", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.log("ERRORS:getProfileCallback", true);
            } else {
                bucket.u.log("SUCCESS:getProfileCallback", false);
                bucket.api.profile.renderResponse(bucket.api.profile.filter, data.data);
            }
        }

        bucket.api.profile.checkProfile = function () {

            bucket.ui.startLoadingIndicator();

            var filter = {};
            filter.action = "sync/profile/check";
            filter.params = "&s=bucket";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.u.logType("srv-profile-check",
                "bucket.api.profile.checkProfile: serviceUrl:", serviceUrl);

            $.get(serviceUrl,
                null, bucket.api.profile.checkProfileCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.profile.checkProfileCallback = function (data) {

            bucket.api.logApiData("srv-profile-check", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.logType("srv-profile-check", "ERRORS:checkProfileCallback", true);
            }
            else {
                bucket.u.logType("srv-profile-check", "SUCCESS:checkProfileCallback", false);
                // check if profile logged in and hide/show login panel

                if (data.data) {
                    bucket.profile.profileState = data.data;
                    bucket.u.logType("srv-profile-check", "profileState:", bucket.profile.profileState);
                    bucket.u.logType("srv-profile-check", "profileState:loggedIn:", bucket.profile.profileState.loggedIn);

                    var username = bucket.profile.profileState.username;

                    if (bucket.ui && bucket.profile.profileState.loggedIn == true) {

                        bucket.ui.setProfileStatusUsername(username);
                        bucket.ui.setProfileStatusImage(username);

                        bucket.ui.hideProfilePanel();
                    }
                    else {

                        bucket.ui.setProfileStatusUsername("");
                        bucket.ui.setProfileStatusImage("");

                        bucket.ui.showProfilePanel();
                    }
                }
            }
            bucket.ui.stopLoadingIndicator();
        }

        // PROFILE INFO

        bucket.api.profile.getProfileFilter = function (filter) {

            bucket.ui.startLoadingIndicator();

            filter.action = "profile-filter";
            filter.params = "&s=bucket";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.profile.filter = filter;

            bucket.u.log("serviceUrl:", serviceUrl);
            $.get(serviceUrl,
                null, bucket.api.profile.getProfileFilterCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.profile.getProfileFilterCallback = function (data) {
            var obj = bucket.api.profile;

            bucket.api.logApiData("srv-profile-filter", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.log("ERRORS:getProfileFilterCallback", true);
            }
            else {
                bucket.u.log("SUCCESS:getProfileFilterCallback", false);
                obj.renderProfileFilterResponse(obj.filter, data.data);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.api.profile.renderProfileFilterResponse = function (filter, data) {

            // Set local attributes/cookies and set to ui panel filters.

            bucket.u.log('renderProfileFilterResponse:', data);
        }

        // PROFILE ME

        bucket.api.profile.getProfileMe = function (filter) {

            bucket.ui.startLoadingIndicator();

            if (!filter) {
                filter = {};
            }

            filter.action = "me";
            filter.params = "&s=bucket";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.profile.filter = filter;

            bucket.u.logType("getProfileMe::serviceUrl:", serviceUrl);
            $.get(serviceUrl,
                null, bucket.api.profile.getProfileMeCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.profile.getProfileMeCallback = function (data) {
            bucket.api.logApiData("srv-profile-me", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.logType("srv-profile-me", "ERRORS:getProfileMeCallback", true);
            }
            else {
                bucket.u.logType("srv-profile-me", "SUCCESS:getProfileMeCallback", false);
                bucket.api.profile.renderProfileMeResponse(bucket.api.profile.filter, data.data);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.api.profile.renderProfileMeResponse = function (filter, data) {
            bucket.u.logType("srv-profile-me", "renderProfileMeResponse:", data);

            bucket.profile.profileMe = data;

            if (bucket.profile.profileMe
                && bucket.profile.profileMe.profile) {

                bucket.me = bucket.profile.profileMe.profile;
                bucket.profile.updateProfileFilter();

                bucket.u.logType("srv-profile-me", "profileMe:", bucket.profile.profileMe);


                bucket.u.logType("srv-profile-me", "name", bucket.profile.profileFilter.name);
                bucket.u.logType("srv-profile-me", "education_high_school", bucket.profile.profileFilter.education_high_school);
                bucket.u.logType("srv-profile-me", "profileFilter", bucket.profile.profileFilter);
            }
        }

        // PROFILE U

        bucket.api.profile.getProfileU = function (filter) {

            bucket.ui.startLoadingIndicator();

            filter.action = "u";
            filter.params = "&s=bucket";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.profile.filter = filter;

            bucket.u.logType("getProfileU::serviceUrl:", serviceUrl);
            $.get(serviceUrl,
                null, bucket.api.profile.getProfileUCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.profile.getProfileUCallback = function (data) {
            bucket.api.logApiData("srv-profile-u", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.logType("srv-profile-u", "ERRORS:getProfileUCallback", true);
            }
            else {
                bucket.u.logType("srv-profile-u", "SUCCESS:getProfileUCallback", false);
                bucket.api.profile.renderProfileUResponse(bucket.api.profile.filter, data.data);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.api.profile.renderProfileUResponse = function (filter, data) {
            bucket.u.logType("srv-profile-u", "renderProfileUResponse:", data);

            var templateOutput = bucket.ui.renderTemplates.u;

            bucket.u.logType("srv-profile-u", "templateOutput:", templateOutput);

            var output = "Person not found or there was a problem.";
            var doTemplate = false;

            if (data) {
                if (data.profile) {
                    if (!bucket.u.isNullOrEmptyString(data.profile.username)) {
                        doTemplate = true;
                    }
                }
            }

            if (doTemplate) {

                var view = {
                    profile: data.profile
                };

                bucket.u.logType("srv-profile-u", "view:", view);

                var titleItem = "";

                if (!bucket.u.isNullOrEmptyString(data.profile.firstName)) {
                    titleItem += data.profile.firstName;
                }

                if (!bucket.u.isNullOrEmptyString(data.profile.lastName)) {
                    titleItem += " " + data.profile.lastName;
                }

                bucket.u.logType("srv-profile-u", "titleItem:", titleItem);

                var title = $("#panel-info-title");
                if (title.length > 0) {
                    title.html("People: " + titleItem);
                }

                output = Mustache.render(templateOutput, view);
            }

            bucket.ui.loadContentDiv(output);
        }

        // ----------------------------------------
        // API - SCHOOL

        bucket.api.school.init = function () {
            bucket.api.school.loaded = true;
            console.log("bucket.api.school", "loaded");
        }

        bucket.api.school.render = function (filter) {
            bucket.api.school.getSchool(filter);
        }

        bucket.api.school.renderResponse = function (filter, data) {
            //
        }

        bucket.api.school.getSchool = function (filter) {

            bucket.ui.startLoadingIndicator();

            filter.action = "school";
            filter.params = "&s=bucket";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.school.filter = filter;

            bucket.u.log("serviceUrl:", serviceUrl);
            $.get(serviceUrl,
                null, bucket.api.school.getSchoolCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.school.getSchoolCallback = function (data) {
            bucket.api.logApiData("srv-school", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.log("ERRORS:getSchoolCallback", true);
            }
            else {
                bucket.u.log("SUCCESS:getSchoolCallback", false);
                bucket.api.school.renderResponse(bucket.api.school.filter, data.data);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.api.school.getSchoolFilter = function (filter) {

            bucket.ui.startLoadingIndicator();

            filter.action = "school-filter";
            filter.params = "&s=bucket";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.school.filter = filter;

            bucket.u.log("serviceUrl:", serviceUrl);
            $.get(serviceUrl,
                null, bucket.api.school.getSchoolFilterCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.school.getSchoolFilterCallback = function (data) {

            bucket.api.logApiData("srv-school-filter", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.log("ERRORS:getSchoolFilterCallback", true);
            }
            else {
                bucket.u.log("SUCCESS:getSchoolFilterCallback", false);
                bucket.api.school.renderSchoolFilterResponse(bucket.api.school.filter, data.data);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.api.school.renderSchoolFilterResponse = function (filter, data) {

            // Set local attributes/cookies and set to ui panel filters.

            bucket.u.log('renderProfileFilterResponse:', data);
        }

        bucket.api.school.getSchool = function (filter) {

            bucket.ui.startLoadingIndicator();

            filter.action = bucket.ui.viewStates.school;
            filter.params = "&s=bucket";
            filter.json = true;
            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.school.filter = filter;

            bucket.u.logType("getSchool::serviceUrl:", serviceUrl);
            $.get(serviceUrl,
                bucket.api.error.handleServiceError, bucket.api.school.getSchoolCallback, "json");

            $.get(serviceUrl,
                null, bucket.api.school.getSchoolCallback, "json")
                .done(function (data) {
                    // handled in callback
                }).fail(function () {
                    bucket.api.error.handleServiceError();
                    bucket.ui.stopLoadingIndicator();
                });
        }

        bucket.api.school.getSchoolCallback = function (data) {
            bucket.api.logApiData("srv-school", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.logType("srv-school", "ERRORS:getSchoolCallback", true);
            }
            else {
                bucket.u.logType("srv-school", "SUCCESS:getSchoolCallback", false);
                bucket.api.school.renderSchoolResponse(bucket.api.school.filter, data.data);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.api.school.renderSchoolResponse = function (filter, data) {

            bucket.u.logType("srv-school", "renderSchoolResponse:", data);

            var templateOutput = bucket.ui.renderTemplates.school;

            bucket.u.logType("srv-school", "templateOutput:", templateOutput);

            var view = {
                school: data.school
            };

            bucket.u.logType("srv-school", "view:", view);

            var titleItem = "";

            if (!bucket.u.isNullOrEmptyString(data.school.displayName)) {
                titleItem += data.school.displayName;
            }

            bucket.u.logType("srv-school", "titleItem:", titleItem);

            var title = $("#panel-info-title");
            if (title.length > 0) {
                title.html("School: " + titleItem);
            }

            var output = Mustache.render(templateOutput, view);

            bucket.ui.loadContentDiv(output);
        }

        // ----------------------------------------
        // CONTENT

        bucket.api.content.init = function () {
            bucket.api.content.loaded = true;
            console.log("bucket.api.content", "loaded");
        };

        // ----------------------------------------
        // FIND

        bucket.api.find.init = function () {
            bucket.api.find.loaded = true;
            console.log("bucket.api.find", "loaded");
        };

        // ----------------------------------------
        // CONTEXT

        bucket.api.context.init = function () {
            bucket.api.context.loaded = true;
            console.log("bucket.api.context", "loaded");
        };

        bucket.api.context.getContextViewDataCached = function () {

            var fetchContext = false;

            var viewData = bucket.ui.currentViewData;
            var url = location.href;

            var r = bucket.api.context.data;

            if (r && viewData) {

                if (r.to) {
                    if (r.to.path != viewData.pathTo) {
                        fetchContext = true;
                    }
                }
                if (r.find) {
                    if (r.find.path != viewData.pathFind) {
                        fetchContext = true;
                    }
                }
                if (r.view) {
                    if (r.view.path != viewData.pathView) {
                        fetchContext = true;
                    }
                }
            }
            else {
                fetchContext = true;
            }

            return fetchContext;
        }

        bucket.api.context.getContextViewData = function (filter) {

            bucket.ui.startLoadingIndicator();

            filter.action = bucket.u.getPathContext();
            filter.params = "&s=bucket";
            filter.json = true;

            var serviceUrl = bucket.api.getApiAction(filter);

            bucket.api.context.filter = filter;

            bucket.u.logType("srv-viewdata", "getContextViewData::serviceUrl:", serviceUrl);

            var fetchContext = bucket.api.context.getContextViewDataCached();

            if (fetchContext) {
                $.get(serviceUrl,
                    null, bucket.api.context.getContextViewDataCallback, "json")
                    .done(function (data) {
                        // handled in callback
                    }).fail(function () {
                        bucket.api.error.handleServiceError();
                        bucket.ui.stopLoadingIndicator();
                    });
            }
            else {
                bucket.api.context.renderContextViewDataResponse(
                    filter, bucket.api.context.data);
            }
        }

        bucket.api.context.getContextViewDataCallback = function (data) {
            bucket.api.logApiData("srv-viewdata", data);

            if (data.code > 0 || data.code.length > 1) {
                bucket.u.logType("srv-viewdata", "ERRORS:getContextViewDataCallback", true);
            }
            else {
                bucket.u.logType("srv-viewdata", "SUCCESS:getContextViewDataCallback", false);
                bucket.api.context.renderContextViewDataResponse(bucket.api.context.filter, data.data);
            }

            bucket.ui.stopLoadingIndicator();
        }

        bucket.api.context.data = null;

        bucket.api.context.getContextViewDataViewResults = function () {
            var r = bucket.api.context.data;
            if (r) {
                if (r.view) {
                    if (r.view.values) {
                        if (r.view.values.results) {
                            return r.view.values.results;
                        }
                    }
                }
            }
            return null;
        }

        bucket.api.context.getContextToDataCounts = function () {
            var r = bucket.api.context.data;
            if (r) {
                if (r.to) {
                    if (r.to.values) {
                        if (r.to.values.counts) {
                            return r.to.values.counts;
                        }
                    }
                }
            }
            return null;
        }

        bucket.api.context.getContextToDataCountByCode = function (code) {
            var counts = bucket.api.context.getContextToDataCounts();
            if (counts) {
                if (counts[code]) {
                    return counts[code];
                }
            }
            return 0;
        }

        bucket.api.context.getContextFindDataResults = function () {
            var r = bucket.api.context.data;
            if (r) {
                if (r.find) {
                    if (r.find.values) {
                        if (r.find.values.results) {
                            return r.find.values.results;
                        }
                    }
                }
            }
            return null;
        }

        bucket.api.context.renderContextViewDataResponse = function (filter, data) {

            bucket.api.context.data = data;

            bucket.u.logType("srv-viewdata", "renderContextViewDataResponse:", data);

            bucket.ui.handleChangeStateMeta();

            bucket.ui.handleChangeStateMap();

            bucket.ui.handleChangeStateFocus();

            bucket.ui.handleChangeStateView();

            bucket.ui.handleChangeStateFind();

            bucket.ui.handleChangeStateLocation();

            bucket.ui.stopLoadingIndicator();
        }

        // ----------------------------------------
        // UTILITY

        bucket.api.util.init = function () {
            bucket.api.util.loaded = true;
            console.log("bucket.api.util", "loaded");
        };

        // If chrome ios use non pushState
        if (bucket.u.isMobileChrome) {
            // State Change
            //History.Adapter.bind(window, 'statechange', bucket.ui.onStateChange);
        }
    }
}(window.bucket = window.bucket || {}, jQuery));

// UI ACTION HANDLERS

HandleOnSuccess = function (val) {
    bucket.ui.HandleOnSuccess(val);
}

HandleOnBegin = function (val) {
    bucket.ui.HandleOnBegin(val);
}

HandleOnComplete = function (val) {
    bucket.ui.HandleOnComplete(val);
}

HandleOnFailure = function (val) {
    bucket.ui.HandleOnFailure(val);
}

OnLoginSuccessHandler = function () {
    bucket.ui.OnLoginSuccessHandler();
}

OnLogoffSuccessHandler = function () {
    bucket.ui.OnLogoffSuccessHandler();
}

OnRegisterSuccessHandler = function () {
    bucket.ui.OnRegisterSuccessHandler();
}

OnExternalLoginConfirmationSuccessHandler = function () {
    bucket.ui.OnExternalLoginConfirmationSuccessHandler();
}

$(function () {
    bucket.init();
});
