;
var swfobject = function() {

    var UNDEF = "undefined",
        OBJECT = "object",
        SHOCKWAVE_FLASH = "Shockwave Flash",
        SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE = "application/x-shockwave-flash",
        EXPRESS_INSTALL_ID = "SWFObjectExprInst",
        ON_READY_STATE_CHANGE = "onreadystatechange",

        win = window,
        doc = document,
        nav = navigator,

        plugin = false,
        domLoadFnArr = [main],
        regObjArr = [],
        objIdArr = [],
        listenersArr = [],
        storedAltContent,
        storedAltContentId,
        storedCallbackFn,
        storedCallbackObj,
        isDomLoaded = false,
        isExpressInstallActive = false,
        dynamicStylesheet,
        dynamicStylesheetMedia,
        autoHideShow = true,

        /* Centralized function for browser feature detection
        - User agent string detection is only used when no good alternative is possible
        - Is executed directly for optimal performance
    */
        ua = function() {
            var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
                u = nav.userAgent.toLowerCase(),
                p = nav.platform.toLowerCase(),
                windows = p ? /win/.test(p) : /win/.test(u),
                mac = p ? /mac/.test(p) : /mac/.test(u),
                webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
                ie = !+"\v1" ||
                //ie 11以及以上
                !! (navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/)), // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
                playerVersion = [0, 0, 0],
                d = null;
            if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
                d = nav.plugins[SHOCKWAVE_FLASH].description;
                if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                    plugin = true;
                    ie = false; // cascaded feature detection for Internet Explorer
                    d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                    playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                    playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                }
            } else if (typeof win.ActiveXObject != UNDEF || win.ActiveXObject !== undefined) {
                try {
                    var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                    if (a) { // a will return null when ActiveX is disabled
                        d = a.GetVariable("$version");
                        if (d) {
                            ie = true; // cascaded feature detection for Internet Explorer
                            d = d.split(" ")[1].split(",");
                            playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                        }
                    }
                } catch (e) {}
            }
            return {
                w3: w3cdom,
                pv: playerVersion,
                wk: webkit,
                ie: ie,
                win: windows,
                mac: mac
            };
        }(),

        /* Cross-browser onDomLoad
        - Will fire an event as soon as the DOM of a web page is loaded
        - Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
        - Regular onload serves as fallback
    */
        onDomLoad = function() {
            if (!ua.w3) {
                return;
            }
            if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
                callDomLoadFunctions();
            }
            if (!isDomLoaded) {
                if (typeof doc.addEventListener != UNDEF) {
                    doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
                }
                if (ua.ie && ua.win && doc.attachEvent) {
                    doc.attachEvent(ON_READY_STATE_CHANGE, function() {
                        if (doc.readyState == "complete") {
                            doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
                            callDomLoadFunctions();
                        }
                    });
                    if (win == top) { // if not inside an iframe
                        (function() {
                            if (isDomLoaded) {
                                return;
                            }
                            try {
                                doc.documentElement.doScroll("left");
                            } catch (e) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            callDomLoadFunctions();
                        })();
                    }
                }
                if (ua.wk) {
                    (function() {
                        if (isDomLoaded) {
                            return;
                        }
                        if (!/loaded|complete/.test(doc.readyState)) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        callDomLoadFunctions();
                    })();
                }
                addLoadEvent(callDomLoadFunctions);
            }
        }();

    function callDomLoadFunctions() {
        if (isDomLoaded) {
            return;
        }
        try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
            var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
            t.parentNode.removeChild(t);
        } catch (e) {
            return;
        }
        isDomLoaded = true;
        var dl = domLoadFnArr.length;
        for (var i = 0; i < dl; i++) {
            domLoadFnArr[i]();
        }
    }

    function addDomLoadEvent(fn) {
        if (isDomLoaded) {
            fn();
        } else {
            domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
        }
    }

    /* Cross-browser onload
        - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
        - Will fire an event as soon as a web page including all of its assets are loaded 
     */
    function addLoadEvent(fn) {
        if (typeof win.addEventListener != UNDEF) {
            win.addEventListener("load", fn, false);
        } else if (typeof doc.addEventListener != UNDEF) {
            doc.addEventListener("load", fn, false);
        } else if (typeof win.attachEvent != UNDEF) {
            addListener(win, "onload", fn);
        } else if (typeof win.onload == "function") {
            var fnOld = win.onload;
            win.onload = function() {
                fnOld();
                fn();
            };
        } else {
            win.onload = fn;
        }
    }

    /* Main function
        - Will preferably execute onDomLoad, otherwise onload (as a fallback)
    */
    function main() {
        if (plugin) {
            testPlayerVersion();
        } else {
            matchVersions();
        }
    }

    /* Detect the Flash Player version for non-Internet Explorer browsers
        - Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
          a. Both release and build numbers can be detected
          b. Avoid wrong descriptions by corrupt installers provided by Adobe
          c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
        - Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
    */
    function testPlayerVersion() {
        var b = doc.getElementsByTagName("body")[0];
        var o = createElement(OBJECT);
        o.setAttribute("type", FLASH_MIME_TYPE);
        var t = b.appendChild(o);
        if (t) {
            var counter = 0;
            (function() {
                if (typeof t.GetVariable != UNDEF) {
                    var d = t.GetVariable("$version");
                    if (d) {
                        d = d.split(" ")[1].split(",");
                        ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                } else if (counter < 10) {
                    counter++;
                    setTimeout(arguments.callee, 10);
                    return;
                }
                b.removeChild(o);
                t = null;
                matchVersions();
            })();
        } else {
            matchVersions();
        }
    }

    /* Perform Flash Player and SWF version matching; static publishing only
     */
    function matchVersions() {
        var rl = regObjArr.length;
        if (rl > 0) {
            for (var i = 0; i < rl; i++) { // for each registered object element
                var id = regObjArr[i].id;
                var cb = regObjArr[i].callbackFn;
                var cbObj = {
                    success: false,
                    id: id
                };
                if (ua.pv[0] > 0) {
                    var obj = getElementById(id);
                    if (obj) {
                        if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                            setVisibility(id, true);
                            if (cb) {
                                cbObj.success = true;
                                cbObj.ref = getObjectById(id);
                                cb(cbObj);
                            }
                        } else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                            var att = {};
                            att.data = regObjArr[i].expressInstall;
                            att.width = obj.getAttribute("width") || "0";
                            att.height = obj.getAttribute("height") || "0";
                            if (obj.getAttribute("class")) {
                                att.styleclass = obj.getAttribute("class");
                            }
                            if (obj.getAttribute("align")) {
                                att.align = obj.getAttribute("align");
                            }
                            // parse HTML object param element's name-value pairs
                            var par = {};
                            var p = obj.getElementsByTagName("param");
                            var pl = p.length;
                            for (var j = 0; j < pl; j++) {
                                if (p[j].getAttribute("name").toLowerCase() != "movie") {
                                    par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                }
                            }
                            showExpressInstall(att, par, id, cb);
                        } else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
                            displayAltContent(obj);
                            if (cb) {
                                cb(cbObj);
                            }
                        }
                    }
                } else { // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
                    setVisibility(id, true);
                    if (cb) {
                        var o = getObjectById(id); // test whether there is an HTML object element or not
                        if (o && typeof o.SetVariable != UNDEF) {
                            cbObj.success = true;
                            cbObj.ref = o;
                        }
                        cb(cbObj);
                    }
                }
            }
        }
    }

    function getObjectById(objectIdStr) {
        var r = null;
        var o = getElementById(objectIdStr);
        if (o && o.nodeName == "OBJECT") {
            if (typeof o.SetVariable != UNDEF) {
                r = o;
            } else {
                var n = o.getElementsByTagName(OBJECT)[0];
                if (n) {
                    r = n;
                }
            }
        }
        return r;
    }

    /* Requirements for Adobe Express Install
        - only one instance can be active at a time
        - fp 6.0.65 or higher
        - Win/Mac OS only
        - no Webkit engines older than version 312
    */
    function canExpressInstall() {
        return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
    }

    /* Show the Adobe Express Install dialog
        - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
    */
    function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
        isExpressInstallActive = true;
        storedCallbackFn = callbackFn || null;
        storedCallbackObj = {
            success: false,
            id: replaceElemIdStr
        };
        var obj = getElementById(replaceElemIdStr);
        if (obj) {
            if (obj.nodeName == "OBJECT") { // static publishing
                storedAltContent = abstractAltContent(obj);
                storedAltContentId = null;
            } else { // dynamic publishing
                storedAltContent = obj;
                storedAltContentId = replaceElemIdStr;
            }
            att.id = EXPRESS_INSTALL_ID;
            if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) {
                att.width = "310";
            }
            if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) {
                att.height = "137";
            }
            doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
            var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
                fv = "MMredirectURL=" + win.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
            if (typeof par.flashvars != UNDEF) {
                par.flashvars += "&" + fv;
            } else {
                par.flashvars = fv;
            }
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            if (ua.ie && ua.win && obj.readyState != 4) {
                var newObj = createElement("div");
                replaceElemIdStr += "SWFObjectNew";
                newObj.setAttribute("id", replaceElemIdStr);
                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                obj.style.display = "none";
                (function() {
                    if (obj.readyState == 4) {
                        obj.parentNode.removeChild(obj);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            }
            createSWF(att, par, replaceElemIdStr);
        }
    }

    /* Functions to abstract and display alternative content
     */
    function displayAltContent(obj) {
        if (ua.ie && ua.win && obj.readyState != 4) {
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            var el = createElement("div");
            obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
            el.parentNode.replaceChild(abstractAltContent(obj), el);
            obj.style.display = "none";
            (function() {
                if (obj.readyState == 4) {
                    obj.parentNode.removeChild(obj);
                } else {
                    setTimeout(arguments.callee, 10);
                }
            })();
        } else {
            obj.parentNode.replaceChild(abstractAltContent(obj), obj);
        }
    }

    function abstractAltContent(obj) {
        var ac = createElement("div");
        if (ua.win && ua.ie) {
            ac.innerHTML = obj.innerHTML;
        } else {
            var nestedObj = obj.getElementsByTagName(OBJECT)[0];
            if (nestedObj) {
                var c = nestedObj.childNodes;
                if (c) {
                    var cl = c.length;
                    for (var i = 0; i < cl; i++) {
                        if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                            ac.appendChild(c[i].cloneNode(true));
                        }
                    }
                }
            }
        }
        return ac;
    }

    /* Cross-browser dynamic SWF creation
     */
    function createSWF(attObj, parObj, id) {
        var r, el = getElementById(id);
        if (ua.wk && ua.wk < 312) {
            return r;
        }
        if (el) {
            if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
                attObj.id = id;
            }
            if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
                var att = "";
                for (var i in attObj) {
                    if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
                        if (i.toLowerCase() == "data") {
                            parObj.movie = attObj[i];
                        } else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            att += ' class="' + attObj[i] + '"';
                        } else if (i.toLowerCase() != "classid") {
                            att += ' ' + i + '="' + attObj[i] + '"';
                        }
                    }
                }
                var par = "";
                for (var j in parObj) {
                    if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
                        par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                    }
                }
                el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
                r = getElementById(attObj.id);
            } else { // well-behaving browsers
                var o = createElement(OBJECT);
                o.setAttribute("type", FLASH_MIME_TYPE);
                for (var m in attObj) {
                    if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
                        if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            o.setAttribute("class", attObj[m]);
                        } else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
                            o.setAttribute(m, attObj[m]);
                        }
                    }
                }
                for (var n in parObj) {
                    if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
                        createObjParam(o, n, parObj[n]);
                    }
                }
                el.parentNode.replaceChild(o, el);
                r = o;
            }
        }
        return r;
    }

    function createObjParam(el, pName, pValue) {
        var p = createElement("param");
        p.setAttribute("name", pName);
        p.setAttribute("value", pValue);
        el.appendChild(p);
    }

    /* Cross-browser SWF removal
        - Especially needed to safely and completely remove a SWF in Internet Explorer
    */
    function removeSWF(id) {
        var obj = getElementById(id);
        if (obj && obj.nodeName == "OBJECT") {
            if (ua.ie && ua.win) {
                obj.style.display = "none";
                (function() {
                    if (obj.readyState == 4) {
                        removeObjectInIE(id);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            } else {
                obj.parentNode.removeChild(obj);
            }
        }
    }

    function removeObjectInIE(id) {
        var obj = getElementById(id);
        if (obj) {
            for (var i in obj) {
                if (typeof obj[i] == "function") {
                    obj[i] = null;
                }
            }
            obj.parentNode.removeChild(obj);
        }
    }

    /* Functions to optimize JavaScript compression
     */
    function getElementById(id) {
        var el = null;
        try {
            el = doc.getElementById(id);
        } catch (e) {}
        return el;
    }

    function createElement(el) {
        return doc.createElement(el);
    }

    /* Updated attachEvent function for Internet Explorer
        - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
    */
    function addListener(target, eventType, fn) {
        target.attachEvent(eventType, fn);
        listenersArr[listenersArr.length] = [target, eventType, fn];
    }

    /* Flash Player and SWF content version matching
     */
    function hasPlayerVersion(rv) {
        var pv = ua.pv,
            v = rv.split(".");
        v[0] = parseInt(v[0], 10);
        v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
        v[2] = parseInt(v[2], 10) || 0;
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }

    /* Cross-browser dynamic CSS creation
        - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
    */
    function createCSS(sel, decl, media, newStyle) {
        if (ua.ie && ua.mac) {
            return;
        }
        var h = doc.getElementsByTagName("head")[0];
        if (!h) {
            return;
        } // to also support badly authored HTML pages that lack a head element
        var m = (media && typeof media == "string") ? media : "screen";
        if (newStyle) {
            dynamicStylesheet = null;
            dynamicStylesheetMedia = null;
        }
        if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
            // create dynamic stylesheet + get a global reference to it
            var s = createElement("style");
            s.setAttribute("type", "text/css");
            s.setAttribute("media", m);
            dynamicStylesheet = h.appendChild(s);
            if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
            }
            dynamicStylesheetMedia = m;
        }
        // add style rule
        if (ua.ie && ua.win) {
            if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
                dynamicStylesheet.addRule(sel, decl);
            }
        } else {
            if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
            }
        }
    }

    function setVisibility(id, isVisible) {
        if (!autoHideShow) {
            return;
        }
        var v = isVisible ? "visible" : "hidden";
        if (isDomLoaded && getElementById(id)) {
            getElementById(id).style.visibility = v;
        } else {
            createCSS("#" + id, "visibility:" + v);
        }
    }

    /* Filter to avoid XSS attacks
     */
    function urlEncodeIfNecessary(s) {
        var regex = /[\\\"<>\.;]/;
        var hasBadChars = regex.exec(s) != null;
        return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
    }

    /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
     */
    var cleanup = function() {
        if (ua.ie && ua.win && window.attachEvent) {
            window.attachEvent("onunload", function() {
                // remove listeners to avoid memory leaks
                var ll = listenersArr.length;
                for (var i = 0; i < ll; i++) {
                    listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                }
                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                var il = objIdArr.length;
                for (var j = 0; j < il; j++) {
                    removeSWF(objIdArr[j]);
                }
                // cleanup library's main closures to avoid memory leaks
                for (var k in ua) {
                    ua[k] = null;
                }
                ua = null;
                for (var l in swfobject) {
                    swfobject[l] = null;
                }
                swfobject = null;
            });
        }
    }();

    return {
        /* Public API
            - Reference: http://code.google.com/p/swfobject/wiki/documentation
        */
        registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
            if (ua.w3 && objectIdStr && swfVersionStr) {
                var regObj = {};
                regObj.id = objectIdStr;
                regObj.swfVersion = swfVersionStr;
                regObj.expressInstall = xiSwfUrlStr;
                regObj.callbackFn = callbackFn;
                regObjArr[regObjArr.length] = regObj;
                setVisibility(objectIdStr, false);
            } else if (callbackFn) {
                callbackFn({
                    success: false,
                    id: objectIdStr
                });
            }
        },

        getObjectById: function(objectIdStr) {
            if (ua.w3) {
                return getObjectById(objectIdStr);
            }
        },

        embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
            var callbackObj = {
                success: false,
                id: replaceElemIdStr
            };
            if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                setVisibility(replaceElemIdStr, false);
                addDomLoadEvent(function() {
                    widthStr += ""; // auto-convert to string
                    heightStr += "";
                    var att = {};
                    if (attObj && typeof attObj === OBJECT) {
                        for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                            att[i] = attObj[i];
                        }
                    }
                    att.data = swfUrlStr;
                    att.width = widthStr;
                    att.height = heightStr;
                    var par = {};
                    if (parObj && typeof parObj === OBJECT) {
                        for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                            par[j] = parObj[j];
                        }
                    }
                    if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                        for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                            if (typeof par.flashvars != UNDEF) {
                                par.flashvars += "&" + k + "=" + flashvarsObj[k];
                            } else {
                                par.flashvars = k + "=" + flashvarsObj[k];
                            }
                        }
                    }
                    if (hasPlayerVersion(swfVersionStr)) { // create SWF
                        var obj = createSWF(att, par, replaceElemIdStr);
                        if (att.id == replaceElemIdStr) {
                            setVisibility(replaceElemIdStr, true);
                        }
                        callbackObj.success = true;
                        callbackObj.ref = obj;
                    } else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                        att.data = xiSwfUrlStr;
                        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        return;
                    } else { // show alternative content
                        setVisibility(replaceElemIdStr, true);
                    }
                    if (callbackFn) {
                        callbackFn(callbackObj);
                    }
                });
            } else if (callbackFn) {
                callbackFn(callbackObj);
            }
        },

        switchOffAutoHideShow: function() {
            autoHideShow = false;
        },

        ua: ua,

        getFlashPlayerVersion: function() {
            return {
                major: ua.pv[0],
                minor: ua.pv[1],
                release: ua.pv[2]
            };
        },

        hasFlashPlayerVersion: hasPlayerVersion,

        createSWF: function(attObj, parObj, replaceElemIdStr) {
            if (ua.w3) {
                return createSWF(attObj, parObj, replaceElemIdStr);
            } else {
                return undefined;
            }
        },

        showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
            if (ua.w3 && canExpressInstall()) {
                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
            }
        },

        removeSWF: function(objElemIdStr) {
            if (ua.w3) {
                removeSWF(objElemIdStr);
            }
        },

        createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
            if (ua.w3) {
                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
            }
        },

        addDomLoadEvent: addDomLoadEvent,

        addLoadEvent: addLoadEvent,

        getQueryParamValue: function(param) {
            var q = doc.location.search || doc.location.hash;
            if (q) {
                if (/\?/.test(q)) {
                    q = q.split("?")[1];
                } // strip question mark
                if (param == null) {
                    return urlEncodeIfNecessary(q);
                }
                var pairs = q.split("&");
                for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                        return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                    }
                }
            }
            return "";
        },

        // For internal usage only
        expressInstallCallback: function() {
            if (isExpressInstallActive) {
                var obj = getElementById(EXPRESS_INSTALL_ID);
                if (obj && storedAltContent) {
                    obj.parentNode.replaceChild(storedAltContent, obj);
                    if (storedAltContentId) {
                        setVisibility(storedAltContentId, true);
                        if (ua.ie && ua.win) {
                            storedAltContent.style.display = "block";
                        }
                    }
                    if (storedCallbackFn) {
                        storedCallbackFn(storedCallbackObj);
                    }
                }
                isExpressInstallActive = false;
            }
        }
    };
}();

/*
SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com

mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/

SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilzén and Mammon Media and is released under the MIT License:
http://www.opensource.org/licenses/mit-license.php

SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

var SWFUpload;
if (SWFUpload == undefined) {
    SWFUpload = function(a) {
        this.initSWFUpload(a)
    }
}
SWFUpload.prototype.initSWFUpload = function(b) {
    try {
        this.customSettings = {};
        this.settings = b;
        this.eventQueue = [];
        this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
        this.movieElement = null;
        SWFUpload.instances[this.movieName] = this;
        this.initSettings();
        this.loadFlash();
        // this.displayDebugInfo()
    } catch (a) {
        delete SWFUpload.instances[this.movieName];
        throw a
    }
};
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 2009-03-25";
SWFUpload.QUEUE_ERROR = {
    QUEUE_LIMIT_EXCEEDED: -100,
    FILE_EXCEEDS_SIZE_LIMIT: -110,
    ZERO_BYTE_FILE: -120,
    INVALID_FILETYPE: -130
};
SWFUpload.UPLOAD_ERROR = {
    HTTP_ERROR: -200,
    MISSING_UPLOAD_URL: -210,
    IO_ERROR: -220,
    SECURITY_ERROR: -230,
    UPLOAD_LIMIT_EXCEEDED: -240,
    UPLOAD_FAILED: -250,
    SPECIFIED_FILE_ID_NOT_FOUND: -260,
    FILE_VALIDATION_FAILED: -270,
    FILE_CANCELLED: -280,
    UPLOAD_STOPPED: -290
};
SWFUpload.FILE_STATUS = {
    QUEUED: -1,
    IN_PROGRESS: -2,
    ERROR: -3,
    COMPLETE: -4,
    CANCELLED: -5
};
SWFUpload.BUTTON_ACTION = {
    SELECT_FILE: -100,
    SELECT_FILES: -110,
    START_UPLOAD: -120
};
SWFUpload.CURSOR = {
    ARROW: -1,
    HAND: -2
};
SWFUpload.WINDOW_MODE = {
    WINDOW: "window",
    TRANSPARENT: "transparent",
    OPAQUE: "opaque"
};
SWFUpload.completeURL = function(a) {
    if (typeof(a) !== "string" || a.match(/^https?:\/\//i) || a.match(/^\//)) {
        return a
    }
    var c = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    var b = window.location.pathname.lastIndexOf("/");
    if (b <= 0) {
        path = "/"
    } else {
        path = window.location.pathname.substr(0, b) + "/"
    }
    return path + a
};
SWFUpload.prototype.initSettings = function() {
    this.ensureDefault = function(b, a) {
        this.settings[b] = (this.settings[b] == undefined) ? a : this.settings[b]
    };
    this.ensureDefault("upload_url", "");
    this.ensureDefault("preserve_relative_urls", false);
    this.ensureDefault("file_post_name", "Filedata");
    this.ensureDefault("post_params", {});
    this.ensureDefault("use_query_string", false);
    this.ensureDefault("requeue_on_error", false);
    this.ensureDefault("http_success", []);
    this.ensureDefault("assume_success_timeout", 0);
    this.ensureDefault("file_types", "*.*");
    this.ensureDefault("file_types_description", "All Files");
    this.ensureDefault("file_size_limit", 0);
    this.ensureDefault("file_upload_limit", 0);
    this.ensureDefault("file_queue_limit", 0);
    this.ensureDefault("flash_url", "swfupload.swf");
    this.ensureDefault("prevent_swf_caching", true);
    this.ensureDefault("button_image_url", "");
    this.ensureDefault("button_width", 1);
    this.ensureDefault("button_height", 1);
    this.ensureDefault("button_text", "");
    this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
    this.ensureDefault("button_text_top_padding", 0);
    this.ensureDefault("button_text_left_padding", 0);
    this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
    this.ensureDefault("button_disabled", false);
    this.ensureDefault("button_placeholder_id", "");
    this.ensureDefault("button_placeholder", null);
    this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
    this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);
    this.ensureDefault("debug", false);
    this.settings.debug_enabled = this.settings.debug;
    this.settings.return_upload_start_handler = this.returnUploadStart;
    this.ensureDefault("swfupload_loaded_handler", null);
    this.ensureDefault("file_dialog_start_handler", null);
    this.ensureDefault("file_queued_handler", null);
    this.ensureDefault("file_queue_error_handler", null);
    this.ensureDefault("file_dialog_complete_handler", null);
    this.ensureDefault("upload_start_handler", null);
    this.ensureDefault("upload_progress_handler", null);
    this.ensureDefault("upload_error_handler", null);
    this.ensureDefault("upload_success_handler", null);
    this.ensureDefault("upload_complete_handler", null);
    this.ensureDefault("debug_handler", this.debugMessage);
    this.ensureDefault("custom_settings", {});
    this.customSettings = this.settings.custom_settings;
    if ( !! this.settings.prevent_swf_caching) {
        this.settings.flash_url = this.settings.flash_url + (this.settings.flash_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime()
    }
    if (!this.settings.preserve_relative_urls) {
        this.settings.upload_url = SWFUpload.completeURL(this.settings.upload_url);
        this.settings.button_image_url = this.settings.button_image_url ? SWFUpload.completeURL(this.settings.button_image_url) : this.settings.button_image_url
    }
    delete this.ensureDefault
};
SWFUpload.prototype.loadFlash = function() {
    var a, b;
    if (document.getElementById(this.movieName) !== null) {
        throw "ID " + this.movieName + " is already in use. The Flash Object could not be added"
    }
    a = document.getElementById(this.settings.button_placeholder_id) || this.settings.button_placeholder;
    if (a == undefined) {
        throw "Could not find the placeholder element: " + this.settings.button_placeholder_id
    }
    b = document.createElement("div");
    b.innerHTML = this.getFlashHTML();
    a.parentNode.replaceChild(b.firstChild, a);
    if (window[this.movieName] == undefined) {
        window[this.movieName] = this.getMovieElement()
    }
};
SWFUpload.prototype.getFlashHTML = function() {
    return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">', '<param name="wmode" value="', this.settings.button_window_mode, '" />', '<param name="movie" value="', this.settings.flash_url, '" />', '<param value="noscale" name="scale">', '<param name="quality" value="high" />', '<param name="menu" value="false" />', '<param name="allowScriptAccess" value="always" />', '<param name="allownetworking" value="all" />', '<param name="flashvars" value="' + this.getFlashVars() + '" />', "</object>"].join("")
};
SWFUpload.prototype.getFlashVars = function() {
    var b = this.buildParamString();
    var a = this.settings.http_success.join(",");
    return ["movieName=", encodeURIComponent(this.movieName), "&amp;uploadURL=", encodeURIComponent(this.settings.upload_url), "&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string), "&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error), "&amp;httpSuccess=", encodeURIComponent(a), "&amp;assumeSuccessTimeout=", encodeURIComponent(this.settings.assume_success_timeout), "&amp;params=", encodeURIComponent(b), "&amp;filePostName=", encodeURIComponent(this.settings.file_post_name), "&amp;fileTypes=", encodeURIComponent(this.settings.file_types), "&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description), "&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit), "&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit), "&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit), "&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled), "&amp;mId=" + this.movieName + "&amp;MoSwfId=" + this.movieName + "&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url), "&amp;buttonWidth=", encodeURIComponent(this.settings.button_width), "&amp;buttonHeight=", encodeURIComponent(this.settings.button_height), "&amp;buttonText=", encodeURIComponent(this.settings.button_text), "&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding), "&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding), "&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style), "&amp;buttonAction=", encodeURIComponent(this.settings.button_action), "&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled), "&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)].join("")
};
SWFUpload.prototype.getMovieElement = function() {
    if (this.movieElement == undefined) {
        this.movieElement = document.getElementById(this.movieName)
    }
    if (this.movieElement === null) {
        throw "Could not find Flash element"
    }
    return this.movieElement
};
SWFUpload.prototype.buildParamString = function() {
    var c = this.settings.post_params;
    var b = [];
    if (typeof(c) === "object") {
        for (var a in c) {
            if (c.hasOwnProperty(a)) {
                if (c[a]) {
                    b.push(encodeURIComponent(a.toString()) + "=" + encodeURIComponent(c[a].toString()))
                }
            }
        }
    }
    return b.join("&amp;")
};
SWFUpload.prototype.destroy = function() {
    try {
        this.cancelUpload(null, false);
        var a = null;
        a = this.getMovieElement();
        if (a && typeof(a.CallFunction) === "unknown") {
            for (var c in a) {
                try {
                    if (typeof(a[c]) === "function") {
                        a[c] = null
                    }
                } catch (e) {}
            }
            try {
                a.parentNode.removeChild(a)
            } catch (b) {}
        }
        window[this.movieName] = null;
        SWFUpload.instances[this.movieName] = null;
        delete SWFUpload.instances[this.movieName];
        this.movieElement = null;
        this.settings = null;
        this.customSettings = null;
        this.eventQueue = null;
        this.movieName = null;
        return true
    } catch (d) {
        return false
    }
};
SWFUpload.prototype.displayDebugInfo = function() {
    this.debug(["---SWFUpload Instance Info---\n", "Version: ", SWFUpload.version, "\n", "Movie Name: ", this.movieName, "\n", "Settings:\n", "\t", "upload_url:               ", this.settings.upload_url, "\n", "\t", "flash_url:                ", this.settings.flash_url, "\n", "\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n", "\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n", "\t", "http_success:             ", this.settings.http_success.join(", "), "\n", "\t", "assume_success_timeout:   ", this.settings.assume_success_timeout, "\n", "\t", "file_post_name:           ", this.settings.file_post_name, "\n", "\t", "post_params:              ", this.settings.post_params.toString(), "\n", "\t", "file_types:               ", this.settings.file_types, "\n", "\t", "file_types_description:   ", this.settings.file_types_description, "\n", "\t", "file_size_limit:          ", this.settings.file_size_limit, "\n", "\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n", "\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n", "\t", "debug:                    ", this.settings.debug.toString(), "\n", "\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n", "\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n", "\t", "button_placeholder:       ", (this.settings.button_placeholder ? "Set" : "Not Set"), "\n", "\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n", "\t", "button_width:             ", this.settings.button_width.toString(), "\n", "\t", "button_height:            ", this.settings.button_height.toString(), "\n", "\t", "button_text:              ", this.settings.button_text.toString(), "\n", "\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n", "\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n", "\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n", "\t", "button_action:            ", this.settings.button_action.toString(), "\n", "\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n", "\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n", "Event Handlers:\n", "\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n", "\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n", "\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n", "\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n", "\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n", "\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n", "\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n", "\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n", "\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n", "\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"].join(""))
};
SWFUpload.prototype.addSetting = function(b, c, a) {
    if (c == undefined) {
        return (this.settings[b] = a)
    } else {
        return (this.settings[b] = c)
    }
};
SWFUpload.prototype.getSetting = function(a) {
    if (this.settings[a] != undefined) {
        return this.settings[a]
    }
    return ""
};
SWFUpload.prototype.callFlash = function(functionName, argumentArray) {
    argumentArray = argumentArray || [];
    var movieElement = this.getMovieElement();
    var returnValue, returnString;
    try {
        returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + "</invoke>");
        returnValue = eval(returnString)
    } catch (ex) {
        throw "Call to " + functionName + " failed"
    }
    if (returnValue != undefined && typeof returnValue.post === "object") {
        returnValue = this.unescapeFilePostParams(returnValue)
    }
    return returnValue
};
SWFUpload.prototype.selectFile = function() {
    this.callFlash("SelectFile")
};
SWFUpload.prototype.selectFiles = function() {
    this.callFlash("SelectFiles")
};
SWFUpload.prototype.startUpload = function(a) {
    this.callFlash("StartUpload", [a])
};
SWFUpload.prototype.cancelUpload = function(a, b) {
    if (b !== false) {
        b = true
    }
    this.callFlash("CancelUpload", [a, b])
};
SWFUpload.prototype.stopUpload = function() {
    this.callFlash("StopUpload")
};
SWFUpload.prototype.getStats = function() {
    return this.callFlash("GetStats")
};
SWFUpload.prototype.setStats = function(a) {
    this.callFlash("SetStats", [a])
};
SWFUpload.prototype.getFile = function(a) {
    if (typeof(a) === "number") {
        return this.callFlash("GetFileByIndex", [a])
    } else {
        return this.callFlash("GetFile", [a])
    }
};
SWFUpload.prototype.addFileParam = function(a, b, c) {
    return this.callFlash("AddFileParam", [a, b, c])
};
SWFUpload.prototype.removeFileParam = function(a, b) {
    this.callFlash("RemoveFileParam", [a, b])
};
SWFUpload.prototype.setUploadURL = function(a) {
    this.settings.upload_url = a.toString();
    this.callFlash("SetUploadURL", [a])
};
SWFUpload.prototype.setPostParams = function(a) {
    this.settings.post_params = a;
    this.callFlash("SetPostParams", [a])
};
SWFUpload.prototype.addPostParam = function(a, b) {
    this.settings.post_params[a] = b;
    this.callFlash("SetPostParams", [this.settings.post_params])
};
SWFUpload.prototype.removePostParam = function(a) {
    delete this.settings.post_params[a];
    this.callFlash("SetPostParams", [this.settings.post_params])
};
SWFUpload.prototype.setFileTypes = function(a, b) {
    this.settings.file_types = a;
    this.settings.file_types_description = b;
    this.callFlash("SetFileTypes", [a, b])
};
SWFUpload.prototype.setFileSizeLimit = function(a) {
    this.settings.file_size_limit = a;
    this.callFlash("SetFileSizeLimit", [a])
};
SWFUpload.prototype.setFileUploadLimit = function(a) {
    this.settings.file_upload_limit = a;
    this.callFlash("SetFileUploadLimit", [a])
};
SWFUpload.prototype.setFileQueueLimit = function(a) {
    this.settings.file_queue_limit = a;
    this.callFlash("SetFileQueueLimit", [a])
};
SWFUpload.prototype.setFilePostName = function(a) {
    this.settings.file_post_name = a;
    this.callFlash("SetFilePostName", [a])
};
SWFUpload.prototype.setUseQueryString = function(a) {
    this.settings.use_query_string = a;
    this.callFlash("SetUseQueryString", [a])
};
SWFUpload.prototype.setRequeueOnError = function(a) {
    this.settings.requeue_on_error = a;
    this.callFlash("SetRequeueOnError", [a])
};
SWFUpload.prototype.setHTTPSuccess = function(a) {
    if (typeof a === "string") {
        a = a.replace(" ", "").split(",")
    }
    this.settings.http_success = a;
    this.callFlash("SetHTTPSuccess", [a])
};
SWFUpload.prototype.setAssumeSuccessTimeout = function(a) {
    this.settings.assume_success_timeout = a;
    this.callFlash("SetAssumeSuccessTimeout", [a])
};
SWFUpload.prototype.setDebugEnabled = function(a) {
    this.settings.debug_enabled = a;
    this.callFlash("SetDebugEnabled", [a])
};
SWFUpload.prototype.setButtonImageURL = function(a) {
    if (a == undefined) {
        a = ""
    }
    this.settings.button_image_url = a;
    this.callFlash("SetButtonImageURL", [a])
};
SWFUpload.prototype.setButtonDimensions = function(c, a) {
    this.settings.button_width = c;
    this.settings.button_height = a;
    var b = this.getMovieElement();
    if (b != undefined) {
        b.style.width = c + "px";
        b.style.height = a + "px"
    }
    // this.callFlash("SetButtonDimensions", [c, a])
};
SWFUpload.prototype.setButtonText = function(a) {
    this.settings.button_text = a;
    this.callFlash("SetButtonText", [a])
};
SWFUpload.prototype.setButtonTextPadding = function(b, a) {
    this.settings.button_text_top_padding = a;
    this.settings.button_text_left_padding = b;
    this.callFlash("SetButtonTextPadding", [b, a])
};
SWFUpload.prototype.setButtonTextStyle = function(a) {
    this.settings.button_text_style = a;
    this.callFlash("SetButtonTextStyle", [a])
};
SWFUpload.prototype.setButtonDisabled = function(a) {
    this.settings.button_disabled = a;
    // this.callFlash("SetButtonDisabled", [a])
};
SWFUpload.prototype.setButtonAction = function(a) {
    this.settings.button_action = a;
    this.callFlash("SetButtonAction", [a])
};
SWFUpload.prototype.setButtonCursor = function(a) {
    this.settings.button_cursor = a;
    this.callFlash("SetButtonCursor", [a])
};
SWFUpload.prototype.queueEvent = function(b, c) {
    if (c == undefined) {
        c = []
    } else {
        if (!(c instanceof Array)) {
            c = [c]
        }
    }
    var a = this;
    if (typeof this.settings[b] === "function") {
        this.eventQueue.push(function() {
            this.settings[b].apply(this, c)
        });
        setTimeout(function() {
            a.executeNextEvent()
        }, 0)
    } else {
        if (this.settings[b] !== null) {
            throw "Event handler " + b + " is unknown or is not a function"
        }
    }
};
SWFUpload.prototype.executeNextEvent = function() {
    var a = this.eventQueue ? this.eventQueue.shift() : null;
    if (typeof(a) === "function") {
        a.apply(this)
    }
};
SWFUpload.prototype.unescapeFilePostParams = function(c) {
    var e = /[$]([0-9a-f]{4})/i;
    var f = {};
    var d;
    if (c != undefined) {
        for (var a in c.post) {
            if (c.post.hasOwnProperty(a)) {
                d = a;
                var b;
                while ((b = e.exec(d)) !== null) {
                    d = d.replace(b[0], String.fromCharCode(parseInt("0x" + b[1], 16)))
                }
                f[d] = c.post[a]
            }
        }
        c.post = f
    }
    return c
};
SWFUpload.prototype.testExternalInterface = function() {
    try {
        return this.callFlash("TestExternalInterface")
    } catch (a) {
        return false
    }
};
SWFUpload.prototype.flashReady = function() {
    var a = this.getMovieElement();
    if (!a) {
        this.debug("Flash called back ready but the flash movie can't be found.");
        return
    }
    this.cleanUp(a);
    this.queueEvent("swfupload_loaded_handler")
};
SWFUpload.prototype.cleanUp = function(a) {
    try {
        if (this.movieElement && typeof(a.CallFunction) === "unknown") {
            this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
            for (var c in a) {
                try {
                    if (typeof(a[c]) === "function") {
                        a[c] = null
                    }
                } catch (b) {}
            }
        }
    } catch (d) {}
    window.__flash__removeCallback = function(e, f) {
        try {
            if (e) {
                e[f] = null
            }
        } catch (g) {}
    }
};
SWFUpload.prototype.fileDialogStart = function() {
    this.queueEvent("file_dialog_start_handler")
};
SWFUpload.prototype.fileQueued = function(a) {
    a = this.unescapeFilePostParams(a);
    this.queueEvent("file_queued_handler", a)
};
SWFUpload.prototype.fileQueueError = function(a, c, b) {
    a = this.unescapeFilePostParams(a);
    this.queueEvent("file_queue_error_handler", [a, c, b])
};
SWFUpload.prototype.fileDialogComplete = function(b, c, a) {
    this.queueEvent("file_dialog_complete_handler", [b, c, a])
};
SWFUpload.prototype.uploadStart = function(a) {
    a = this.unescapeFilePostParams(a);
    this.queueEvent("return_upload_start_handler", a)
};
SWFUpload.prototype.returnUploadStart = function(a) {
    var b;
    if (typeof this.settings.upload_start_handler === "function") {
        a = this.unescapeFilePostParams(a);
        b = this.settings.upload_start_handler.call(this, a)
    } else {
        if (this.settings.upload_start_handler != undefined) {
            throw "upload_start_handler must be a function"
        }
    } if (b === undefined) {
        b = true
    }
    b = !! b;
    this.callFlash("ReturnUploadStart", [b])
};
SWFUpload.prototype.uploadProgress = function(a, c, b) {
    a = this.unescapeFilePostParams(a);
    this.queueEvent("upload_progress_handler", [a, c, b])
};
SWFUpload.prototype.uploadError = function(a, c, b) {
    a = this.unescapeFilePostParams(a);
    this.queueEvent("upload_error_handler", [a, c, b])
};
SWFUpload.prototype.uploadSuccess = function(b, a, c) {
    b = this.unescapeFilePostParams(b);
    this.queueEvent("upload_success_handler", [b, a, c])
};
SWFUpload.prototype.uploadComplete = function(a) {
    a = this.unescapeFilePostParams(a);
    this.queueEvent("upload_complete_handler", a)
};
SWFUpload.prototype.debug = function(a) {
    this.queueEvent("debug_handler", a)
};
SWFUpload.prototype.debugMessage = function(c) {
    if (this.settings.debug) {
        var a, d = [];
        if (typeof c === "object" && typeof c.name === "string" && typeof c.message === "string") {
            for (var b in c) {
                if (c.hasOwnProperty(b)) {
                    d.push(b + ": " + c[b])
                }
            }
            a = d.join("\n") || "";
            d = a.split("\n");
            a = "EXCEPTION: " + d.join("\nEXCEPTION: ");
            SWFUpload.Console.writeLine(a)
        } else {
            SWFUpload.Console.writeLine(c)
        }
    }
};
SWFUpload.Console = {};
SWFUpload.Console.writeLine = function(d) {
    var b, a;
    try {
        b = document.getElementById("SWFUpload_Console");
        if (!b) {
            a = document.createElement("form");
            document.getElementsByTagName("body")[0].appendChild(a);
            b = document.createElement("textarea");
            b.id = "SWFUpload_Console";
            b.style.fontFamily = "monospace";
            b.setAttribute("wrap", "off");
            b.wrap = "off";
            b.style.overflow = "auto";
            b.style.width = "700px";
            b.style.height = "350px";
            b.style.margin = "5px";
            a.appendChild(b)
        }
        b.value += d + "\n";
        b.scrollTop = b.scrollHeight - b.clientHeight
    } catch (c) {
        alert("Exception: " + c.name + " Message: " + c.message)
    }
};

/*
 Uploadify v3.2.1
 Copyright (c) 2012 Reactive Apps, Ronnie Garcia
 Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
define("custom/uploadify/3.2.1/uploadify-debug", [], function(require, exports, module) {
    var $ = require("$");
    /*
     Uploadify v3.2.1
     Copyright (c) 2012 Reactive Apps, Ronnie Garcia
     Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
     */
    // These methods can be called by adding them as the first argument in the uploadify plugin call
    var methods = {
        init: function(options, swfUploadOptions) {
            return this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this = $(this);
                // Clone the original DOM object
                var $clone = $this.clone();
                // Setup the default options
                var settings = $.extend({
                    // Required Settings
                    id: $this.attr("id"),
                    // The ID of the DOM object
                    swf: "uploadify.swf",
                    // The path to the uploadify SWF file
                    uploader: "uploadify.php",
                    // The path to the server-side upload script
                    // Options
                    auto: true,
                    // Automatically upload files when added to the queue
                    buttonClass: "",
                    // A class name to add to the browse button DOM object
                    buttonCursor: "hand",
                    // The cursor to use with the browse button
                    buttonImage: null,
                    // (String or null) The path to an image to use for the Flash browse button if not using CSS to style the button
                    buttonText: "",
                    // The text to use for the browse button
                    checkExisting: false,
                    // The path to a server-side script that checks for existing files on the server
                    debug: false,
                    // Turn on swfUpload debugging mode
                    fileObjName: "Filedata",
                    // The name of the file object to use in your server-side script
                    fileSizeLimit: 0,
                    // The maximum size of an uploadable file in KB (Accepts units B KB MB GB if string, 0 for no limit)
                    fileTypeDesc: "All Files",
                    // The description for file types in the browse dialog
                    fileTypeExts: "*.*",
                    // Allowed extensions in the browse dialog (server-side validation should also be used)
                    height: 30,
                    // The height of the browse button
                    itemTemplate: false,
                    // The template for the file item in the queue
                    method: "post",
                    // The method to use when sending files to the server-side upload script
                    multi: true,
                    // Allow multiple file selection in the browse dialog
                    formData: {},
                    // An object with additional data to send to the server-side upload script with every file upload
                    preventCaching: true,
                    // Adds a random value to the Flash URL to prevent caching of it (conflicts with existing parameters)
                    progressData: "percentage",
                    // ('percentage' or 'speed') Data to show in the queue item during a file upload
                    queueID: false,
                    // The ID of the DOM object to use as a file queue (without the #)
                    queueSizeLimit: 999,
                    // The maximum number of files that can be in the queue at one time
                    removeCompleted: true,
                    // Remove queue items from the queue when they are done uploading
                    removeTimeout: 3,
                    // The delay in seconds before removing a queue item if removeCompleted is set to true
                    requeueErrors: false,
                    // Keep errored files in the queue and keep trying to upload them
                    successTimeout: 30,
                    // The number of seconds to wait for Flash to detect the server's response after the file has finished uploading
                    uploadLimit: 0,
                    // The maximum number of files you can upload
                    width: 120,
                    // The width of the browse button
                    // Events
                    overrideEvents: []
                }, options);
                // Prepare settings for SWFUpload
                var swfUploadSettings = {
                    assume_success_timeout: settings.successTimeout,
                    button_placeholder_id: settings.id,
                    button_width: settings.width,
                    button_height: settings.height,
                    button_text: null,
                    button_text_style: null,
                    button_text_top_padding: 0,
                    button_text_left_padding: 0,
                    button_action: settings.multi ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE,
                    button_disabled: false,
                    button_cursor: settings.buttonCursor == "arrow" ? SWFUpload.CURSOR.ARROW : SWFUpload.CURSOR.HAND,
                    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                    debug: settings.debug,
                    requeue_on_error: settings.requeueErrors,
                    file_post_name: settings.fileObjName,
                    file_size_limit: settings.fileSizeLimit,
                    file_types: settings.fileTypeExts,
                    file_types_description: settings.fileTypeDesc,
                    file_queue_limit: settings.queueSizeLimit,
                    file_upload_limit: settings.uploadLimit,
                    flash_url: settings.swf,
                    prevent_swf_caching: settings.preventCaching,
                    post_params: settings.formData,
                    upload_url: settings.uploader,
                    use_query_string: settings.method == "get",
                    // Event Handlers
                    file_dialog_complete_handler: handlers.onDialogClose,
                    file_dialog_start_handler: handlers.onDialogOpen,
                    file_queued_handler: handlers.onSelect,
                    file_queue_error_handler: handlers.onSelectError,
                    swfupload_loaded_handler: settings.onSWFReady,
                    upload_complete_handler: handlers.onUploadComplete,
                    upload_error_handler: handlers.onUploadError,
                    upload_progress_handler: handlers.onUploadProgress,
                    upload_start_handler: handlers.onUploadStart,
                    upload_success_handler: handlers.onUploadSuccess
                };
                // Merge the user-defined options with the defaults
                if (swfUploadOptions) {
                    swfUploadSettings = $.extend(swfUploadSettings, swfUploadOptions);
                }
                // Add the user-defined settings to the swfupload object
                swfUploadSettings = $.extend(swfUploadSettings, settings);
                // Detect if Flash is available
                var playerVersion = swfobject.getFlashPlayerVersion();
                var flashInstalled = playerVersion.major >= 9;
                if (flashInstalled) {
                    // Create the swfUpload instance
                    window["uploadify_" + settings.id] = new SWFUpload(swfUploadSettings);
                    var swfuploadify = window["uploadify_" + settings.id];
                    // Add the SWFUpload object to the elements data object
                    $this.data("uploadify", swfuploadify);
                    // Wrap the instance
                    var $wrapper = $("<div />", {
                        id: settings.id,
                        "class": "uploadify",
                        css: {
                            height: settings.height + "px",
                            width: settings.width + "px"
                        }
                    });
                    $("#" + swfuploadify.movieName).wrap($wrapper);
                    // Recreate the reference to wrapper
                    $wrapper = $("#" + settings.id);
                    // Add the data object to the wrapper
                    $wrapper.data("uploadify", swfuploadify);
                    // Create the button
                    var $button = $("<div />", {
                        id: settings.id + "-button",
                        "class": "uploadify-button " + settings.buttonClass
                    });
                    if (settings.buttonImage) {
                        $button.css({
                            "background-image": "url('" + settings.buttonImage + "')",
                            "text-indent": "-9999px"
                        });
                    }
                    $button.html('<span class="uploadify-button-text">' + settings.buttonText + "</span>").css({
                        height: settings.height + "px",
                        "line-height": settings.height + "px",
                        width: settings.width + "px"
                    });
                    // Append the button to the wrapper
                    $wrapper.append($button);
                    // Adjust the styles of the movie
                    $("#" + swfuploadify.movieName).css({
                        position: "absolute",
                        "z-index": 1
                    });
                    // Create the file queue
                    if (!settings.queueID) {
                        var $queue = $("<div />", {
                            id: settings.id + "-queue",
                            "class": "uploadify-queue"
                        });
                        $wrapper.after($queue);
                        swfuploadify.settings.queueID = settings.id + "-queue";
                        swfuploadify.settings.defaultQueue = true;
                    }
                    // Create some queue related objects and variables
                    swfuploadify.queueData = {
                        files: {},
                        // The files in the queue
                        filesSelected: 0,
                        // The number of files selected in the last select operation
                        filesQueued: 0,
                        // The number of files added to the queue in the last select operation
                        filesReplaced: 0,
                        // The number of files replaced in the last select operation
                        filesCancelled: 0,
                        // The number of files that were cancelled instead of replaced
                        filesErrored: 0,
                        // The number of files that caused error in the last select operation
                        uploadsSuccessful: 0,
                        // The number of files that were successfully uploaded
                        uploadsErrored: 0,
                        // The number of files that returned errors during upload
                        averageSpeed: 0,
                        // The average speed of the uploads in KB
                        queueLength: 0,
                        // The number of files in the queue
                        queueSize: 0,
                        // The size in bytes of the entire queue
                        uploadSize: 0,
                        // The size in bytes of the upload queue
                        queueBytesUploaded: 0,
                        // The size in bytes that have been uploaded for the current upload queue
                        uploadQueue: [],
                        // The files currently to be uploaded
                        errorMsg: "Some files were not added to the queue:"
                    };
                    // Save references to all the objects
                    swfuploadify.original = $clone;
                    swfuploadify.wrapper = $wrapper;
                    swfuploadify.button = $button;
                    swfuploadify.queue = $queue;
                    // Call the user-defined init event handler
                    if (settings.onInit) settings.onInit.call($this, swfuploadify);
                } else {
                    // Call the fallback function
                    if (settings.onFallback) settings.onFallback.call($this);
                }
            });
        },
        // Stop a file upload and remove it from the queue
        cancel: function(fileID, supressEvent) {
            var args = arguments;
            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this = $(this),
                    swfuploadify = $this.data("uploadify"),
                    settings = swfuploadify.settings,
                    delay = -1;
                if (args[0]) {
                    // Clear the queue
                    if (args[0] == "*") {
                        var queueItemCount = swfuploadify.queueData.queueLength;
                        $("#" + settings.queueID).find(".uploadify-queue-item").each(function() {
                            delay++;
                            if (args[1] === true) {
                                swfuploadify.cancelUpload($(this).attr("id"), false);
                            } else {
                                swfuploadify.cancelUpload($(this).attr("id"));
                            }
                            $(this).find(".data").removeClass("data").html(" - Cancelled");
                            $(this).find(".uploadify-progress-bar").remove();
                            $(this).delay(1e3 + 100 * delay).fadeOut(500, function() {
                                $(this).remove();
                            });
                        });
                        swfuploadify.queueData.queueSize = 0;
                        swfuploadify.queueData.queueLength = 0;
                        // Trigger the onClearQueue event
                        if (settings.onClearQueue) settings.onClearQueue.call($this, queueItemCount);
                    } else {
                        for (var n = 0; n < args.length; n++) {
                            swfuploadify.cancelUpload(args[n]);
                            $("#" + args[n]).find(".data").removeClass("data").html(" - Cancelled");
                            $("#" + args[n]).find(".uploadify-progress-bar").remove();
                            $("#" + args[n]).delay(1e3 + 100 * n).fadeOut(500, function() {
                                $(this).remove();
                            });
                        }
                    }
                } else {
                    var item = $("#" + settings.queueID).find(".uploadify-queue-item").get(0);
                    $item = $(item);
                    swfuploadify.cancelUpload($item.attr("id"));
                    $item.find(".data").removeClass("data").html(" - Cancelled");
                    $item.find(".uploadify-progress-bar").remove();
                    $item.delay(1e3).fadeOut(500, function() {
                        $(this).remove();
                    });
                }
            });
        },
        // Revert the DOM object back to its original state
        destroy: function() {
            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this = $(this),
                    swfuploadify = $this.data("uploadify"),
                    settings = swfuploadify.settings;
                // Destroy the SWF object and
                swfuploadify.destroy();
                // Destroy the queue
                if (settings.defaultQueue) {
                    $("#" + settings.queueID).remove();
                }
                // Reload the original DOM element
                $("#" + settings.id).replaceWith(swfuploadify.original);
                // Call the user-defined event handler
                if (settings.onDestroy) settings.onDestroy.call(this);
                delete swfuploadify;
            });
        },
        // Disable the select button
        disable: function(isDisabled) {
            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this = $(this),
                    swfuploadify = $this.data("uploadify"),
                    settings = swfuploadify.settings;
                // Call the user-defined event handlers
                if (isDisabled) {
                    swfuploadify.button.addClass("disabled");
                    if (settings.onDisable) settings.onDisable.call(this);
                } else {
                    swfuploadify.button.removeClass("disabled");
                    if (settings.onEnable) settings.onEnable.call(this);
                }
                // Enable/disable the browse button
                swfuploadify.setButtonDisabled(isDisabled);
            });
        },
        // Get or set the settings data
        settings: function(name, value, resetObjects) {
            var args = arguments;
            var returnValue = value;
            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this = $(this),
                    swfuploadify = $this.data("uploadify"),
                    settings = swfuploadify.settings;
                if (typeof args[0] == "object") {
                    for (var n in value) {
                        setData(n, value[n]);
                    }
                }
                if (args.length === 1) {
                    returnValue = settings[name];
                } else {
                    switch (name) {
                        case "uploader":
                            swfuploadify.setUploadURL(value);
                            break;

                        case "formData":
                            if (!resetObjects) {
                                value = $.extend(settings.formData, value);
                            }
                            swfuploadify.setPostParams(settings.formData);
                            break;

                        case "method":
                            if (value == "get") {
                                swfuploadify.setUseQueryString(true);
                            } else {
                                swfuploadify.setUseQueryString(false);
                            }
                            break;

                        case "fileObjName":
                            swfuploadify.setFilePostName(value);
                            break;

                        case "fileTypeExts":
                            swfuploadify.setFileTypes(value, settings.fileTypeDesc);
                            break;

                        case "fileTypeDesc":
                            swfuploadify.setFileTypes(settings.fileTypeExts, value);
                            break;

                        case "fileSizeLimit":
                            swfuploadify.setFileSizeLimit(value);
                            break;

                        case "uploadLimit":
                            swfuploadify.setFileUploadLimit(value);
                            break;

                        case "queueSizeLimit":
                            swfuploadify.setFileQueueLimit(value);
                            break;

                        case "buttonImage":
                            swfuploadify.button.css("background-image", settingValue);
                            break;

                        case "buttonCursor":
                            if (value == "arrow") {
                                swfuploadify.setButtonCursor(SWFUpload.CURSOR.ARROW);
                            } else {
                                swfuploadify.setButtonCursor(SWFUpload.CURSOR.HAND);
                            }
                            break;

                        case "buttonText":
                            $("#" + settings.id + "-button").find(".uploadify-button-text").html(value);
                            break;

                        case "width":
                            swfuploadify.setButtonDimensions(value, settings.height);
                            break;

                        case "height":
                            swfuploadify.setButtonDimensions(settings.width, value);
                            break;

                        case "multi":
                            if (value) {
                                swfuploadify.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILES);
                            } else {
                                swfuploadify.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILE);
                            }
                            break;
                    }
                    settings[name] = value;
                }
            });
            if (args.length === 1) {
                return returnValue;
            }
        },
        // Stop the current uploads and requeue what is in progress
        stop: function() {
            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this = $(this),
                    swfuploadify = $this.data("uploadify");
                // Reset the queue information
                swfuploadify.queueData.averageSpeed = 0;
                swfuploadify.queueData.uploadSize = 0;
                swfuploadify.queueData.bytesUploaded = 0;
                swfuploadify.queueData.uploadQueue = [];
                swfuploadify.stopUpload();
            });
        },
        // Start uploading files in the queue
        upload: function() {
            var args = arguments;
            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this = $(this),
                    swfuploadify = $this.data("uploadify");
                // Reset the queue information
                swfuploadify.queueData.averageSpeed = 0;
                swfuploadify.queueData.uploadSize = 0;
                swfuploadify.queueData.bytesUploaded = 0;
                swfuploadify.queueData.uploadQueue = [];
                // Upload the files
                if (args[0]) {
                    if (args[0] == "*") {
                        swfuploadify.queueData.uploadSize = swfuploadify.queueData.queueSize;
                        swfuploadify.queueData.uploadQueue.push("*");
                        swfuploadify.startUpload();
                    } else {
                        for (var n = 0; n < args.length; n++) {
                            swfuploadify.queueData.uploadSize += swfuploadify.queueData.files[args[n]].size;
                            swfuploadify.queueData.uploadQueue.push(args[n]);
                        }
                        swfuploadify.startUpload(swfuploadify.queueData.uploadQueue.shift());
                    }
                } else {
                    swfuploadify.startUpload();
                }
            });
        }
    };
    // These functions handle all the events that occur with the file uploader
    var handlers = {
        // Triggered when the file dialog is opened
        onDialogOpen: function() {
            // Load the swfupload settings
            var settings = this.settings;
            // Reset some queue info
            this.queueData.errorMsg = "Some files were not added to the queue:";
            this.queueData.filesReplaced = 0;
            this.queueData.filesCancelled = 0;
            // Call the user-defined event handler
            if (settings.onDialogOpen) settings.onDialogOpen.call(this);
        },
        // Triggered when the browse dialog is closed
        onDialogClose: function(filesSelected, filesQueued, queueLength) {
            // Load the swfupload settings
            var settings = this.settings;
            // Update the queue information
            this.queueData.filesErrored = filesSelected - filesQueued;
            this.queueData.filesSelected = filesSelected;
            this.queueData.filesQueued = filesQueued - this.queueData.filesCancelled;
            this.queueData.queueLength = queueLength;
            // Run the default event handler
            if ($.inArray("onDialogClose", settings.overrideEvents) < 0) {
                if (this.queueData.filesErrored > 0) {
                    alert(this.queueData.errorMsg);
                }
            }
            // Call the user-defined event handler
            if (settings.onDialogClose) settings.onDialogClose.call(this, this.queueData);
            // Upload the files if auto is true
            if (settings.auto) $("#" + settings.id).uploadify("upload", "*");
        },
        // Triggered once for each file added to the queue
        onSelect: function(file) {
            // Load the swfupload settings
            var settings = this.settings;
            // Check if a file with the same name exists in the queue
            var queuedFile = {};
            for (var n in this.queueData.files) {
                queuedFile = this.queueData.files[n];
                if (queuedFile.uploaded != true && queuedFile.name == file.name) {
                    var replaceQueueItem = confirm('The file named "' + file.name + '" is already in the queue.\nDo you want to replace the existing item in the queue?');
                    if (!replaceQueueItem) {
                        this.cancelUpload(file.id);
                        this.queueData.filesCancelled++;
                        return false;
                    } else {
                        $("#" + queuedFile.id).remove();
                        this.cancelUpload(queuedFile.id);
                        this.queueData.filesReplaced++;
                    }
                }
            }
            // Get the size of the file
            var fileSize = Math.round(file.size / 1024);
            var suffix = "KB";
            if (fileSize > 1e3) {
                fileSize = Math.round(fileSize / 1e3);
                suffix = "MB";
            }
            var fileSizeParts = fileSize.toString().split(".");
            fileSize = fileSizeParts[0];
            if (fileSizeParts.length > 1) {
                fileSize += "." + fileSizeParts[1].substr(0, 2);
            }
            fileSize += suffix;
            // Truncate the filename if it's too long
            var fileName = file.name;
            if (fileName.length > 15) {
                fileName = fileName.substr(0, 15) + "...";
            }
            // Create the file data object
            itemData = {
                fileID: file.id,
                instanceID: settings.id,
                fileName: fileName,
                fileSize: fileSize
            };
            // Create the file item template
            if (settings.itemTemplate == false) {
                settings.itemTemplate = '<div id="${fileID}" class="uploadify-queue-item">					<div class="cancel">						<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>					</div>					<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>					<div class="uploadify-progress">						<div class="uploadify-progress-bar"><!--Progress Bar--></div>					</div>				</div>';
            }
            // Run the default event handler
            if ($.inArray("onSelect", settings.overrideEvents) < 0) {
                // Replace the item data in the template
                itemHTML = settings.itemTemplate;
                for (var d in itemData) {
                    itemHTML = itemHTML.replace(new RegExp("\\$\\{" + d + "\\}", "g"), itemData[d]);
                }
                // Add the file item to the queue
                $("#" + settings.queueID).append(itemHTML);
            }
            this.queueData.queueSize += file.size;
            this.queueData.files[file.id] = file;
            // Call the user-defined event handler
            if (settings.onSelect) settings.onSelect.apply(this, arguments);
        },
        // Triggered when a file is not added to the queue
        onSelectError: function(file, errorCode, errorMsg) {
            // Load the swfupload settings
            var settings = this.settings;
            // Run the default event handler
            if ($.inArray("onSelectError", settings.overrideEvents) < 0) {
                switch (errorCode) {
                    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                        if (settings.queueSizeLimit > errorMsg) {
                            this.queueData.errorMsg += "\nThe number of files selected exceeds the remaining upload limit (" + errorMsg + ").";
                        } else {
                            this.queueData.errorMsg += "\nThe number of files selected exceeds the queue size limit (" + settings.queueSizeLimit + ").";
                        }
                        break;

                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                        this.queueData.errorMsg += '\nThe file "' + file.name + '" exceeds the size limit (' + settings.fileSizeLimit + ").";
                        break;

                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                        this.queueData.errorMsg += '\nThe file "' + file.name + '" is empty.';
                        break;

                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                        this.queueData.errorMsg += '\nThe file "' + file.name + '" is not an accepted file type (' + settings.fileTypeDesc + ").";
                        break;
                }
            }
            if (errorCode != SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                delete this.queueData.files[file.id];
            }
            // Call the user-defined event handler
            if (settings.onSelectError) settings.onSelectError.apply(this, arguments);
        },
        // Triggered when all the files in the queue have been processed
        onQueueComplete: function() {
            if (this.settings.onQueueComplete) this.settings.onQueueComplete.call(this, this.settings.queueData);
        },
        // Triggered when a file upload successfully completes
        onUploadComplete: function(file) {
            // Load the swfupload settings
            var settings = this.settings,
                swfuploadify = this;
            // Check if all the files have completed uploading
            var stats = this.getStats();
            this.queueData.queueLength = stats.files_queued;
            if (this.queueData.uploadQueue[0] == "*") {
                if (this.queueData.queueLength > 0) {
                    this.startUpload();
                } else {
                    this.queueData.uploadQueue = [];
                    // Call the user-defined event handler for queue complete
                    if (settings.onQueueComplete) settings.onQueueComplete.call(this, this.queueData);
                }
            } else {
                if (this.queueData.uploadQueue.length > 0) {
                    this.startUpload(this.queueData.uploadQueue.shift());
                } else {
                    this.queueData.uploadQueue = [];
                    // Call the user-defined event handler for queue complete
                    if (settings.onQueueComplete) settings.onQueueComplete.call(this, this.queueData);
                }
            }
            // Call the default event handler
            if ($.inArray("onUploadComplete", settings.overrideEvents) < 0) {
                if (settings.removeCompleted) {
                    switch (file.filestatus) {
                        case SWFUpload.FILE_STATUS.COMPLETE:
                            //looping
                            // setTimeout(function() {
                            if ($("#" + file.id)) {
                                swfuploadify.queueData.queueSize -= file.size;
                                swfuploadify.queueData.queueLength -= 1;
                                delete swfuploadify.queueData.files[file.id];
                                // $("#" + file.id).fadeOut(500, function() {
                                //     $(this).remove();
                                // });
                                $("#" + file.id).remove();
                            }
                            // }, settings.removeTimeout * 1e3);
                            break;

                        case SWFUpload.FILE_STATUS.ERROR:
                            if (!settings.requeueErrors) {
                                setTimeout(function() {
                                    if ($("#" + file.id)) {
                                        swfuploadify.queueData.queueSize -= file.size;
                                        swfuploadify.queueData.queueLength -= 1;
                                        delete swfuploadify.queueData.files[file.id];
                                        $("#" + file.id).fadeOut(500, function() {
                                            $(this).remove();
                                        });
                                    }
                                }, settings.removeTimeout * 1e3);
                            }
                            break;
                    }
                } else {
                    file.uploaded = true;
                }
            }
            // Call the user-defined event handler
            if (settings.onUploadComplete) settings.onUploadComplete.call(this, file);
        },
        // Triggered when a file upload returns an error
        onUploadError: function(file, errorCode, errorMsg) {
            // Load the swfupload settings
            var settings = this.settings;
            // Set the error string
            var errorString = "Error";
            switch (errorCode) {
                case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                    errorString = "HTTP Error (" + errorMsg + ")";
                    break;

                case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                    errorString = "Missing Upload URL";
                    break;

                case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                    errorString = "IO Error";
                    break;

                case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                    errorString = "Security Error";
                    break;

                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                    alert("The upload limit has been reached (" + errorMsg + ").");
                    errorString = "Exceeds Upload Limit";
                    break;

                case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                    errorString = "Failed";
                    break;

                case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                    break;

                case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                    errorString = "Validation Error";
                    break;

                case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                    errorString = "Cancelled";
                    this.queueData.queueSize -= file.size;
                    this.queueData.queueLength -= 1;
                    if (file.status == SWFUpload.FILE_STATUS.IN_PROGRESS || $.inArray(file.id, this.queueData.uploadQueue) >= 0) {
                        this.queueData.uploadSize -= file.size;
                    }
                    // Trigger the onCancel event
                    if (settings.onCancel) settings.onCancel.call(this, file);
                    delete this.queueData.files[file.id];
                    break;

                case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                    errorString = "Stopped";
                    break;
            }
            // Call the default event handler
            if ($.inArray("onUploadError", settings.overrideEvents) < 0) {
                if (errorCode != SWFUpload.UPLOAD_ERROR.FILE_CANCELLED && errorCode != SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) {
                    $("#" + file.id).addClass("uploadify-error");
                }
                // Reset the progress bar
                $("#" + file.id).find(".uploadify-progress-bar").css("width", "1px");
                // Add the error message to the queue item
                if (errorCode != SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND && file.status != SWFUpload.FILE_STATUS.COMPLETE) {
                    $("#" + file.id).find(".data").html(" - " + errorString);
                }
            }
            var stats = this.getStats();
            this.queueData.uploadsErrored = stats.upload_errors;
            // Call the user-defined event handler
            if (settings.onUploadError) settings.onUploadError.call(this, file, errorCode, errorMsg, errorString);
        },
        // Triggered periodically during a file upload
        onUploadProgress: function(file, fileBytesLoaded, fileTotalBytes) {
            // Load the swfupload settings
            var settings = this.settings;
            // Setup all the variables
            var timer = new Date();
            var newTime = timer.getTime();
            var lapsedTime = newTime - this.timer;
            if (lapsedTime > 500) {
                this.timer = newTime;
            }
            var lapsedBytes = fileBytesLoaded - this.bytesLoaded;
            this.bytesLoaded = fileBytesLoaded;
            var queueBytesLoaded = this.queueData.queueBytesUploaded + fileBytesLoaded;
            var percentage = Math.round(fileBytesLoaded / fileTotalBytes * 100);
            // Calculate the average speed
            var suffix = "KB/s";
            var mbs = 0;
            var kbs = lapsedBytes / 1024 / (lapsedTime / 1e3);
            kbs = Math.floor(kbs * 10) / 10;
            if (this.queueData.averageSpeed > 0) {
                this.queueData.averageSpeed = Math.floor((this.queueData.averageSpeed + kbs) / 2);
            } else {
                this.queueData.averageSpeed = Math.floor(kbs);
            }
            if (kbs > 1e3) {
                mbs = kbs * .001;
                this.queueData.averageSpeed = Math.floor(mbs);
                suffix = "MB/s";
            }
            // Call the default event handler
            if ($.inArray("onUploadProgress", settings.overrideEvents) < 0) {
                if (settings.progressData == "percentage") {
                    $("#" + file.id).find(".data").html(" - " + percentage + "%");
                } else if (settings.progressData == "speed" && lapsedTime > 500) {
                    $("#" + file.id).find(".data").html(" - " + this.queueData.averageSpeed + suffix);
                }
                $("#" + file.id).find(".uploadify-progress-bar").css("width", percentage + "%");
            }
            // Call the user-defined event handler
            if (settings.onUploadProgress) settings.onUploadProgress.call(this, file, fileBytesLoaded, fileTotalBytes, queueBytesLoaded, this.queueData.uploadSize);
        },
        // Triggered right before a file is uploaded
        onUploadStart: function(file) {
            // Load the swfupload settings
            var settings = this.settings;
            var timer = new Date();
            this.timer = timer.getTime();
            this.bytesLoaded = 0;
            if (this.queueData.uploadQueue.length == 0) {
                this.queueData.uploadSize = file.size;
            }
            if (settings.checkExisting) {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: settings.checkExisting,
                    data: {
                        filename: file.name
                    },
                    success: function(data) {
                        if (data == 1) {
                            var overwrite = confirm('A file with the name "' + file.name + '" already exists on the server.\nWould you like to replace the existing file?');
                            if (!overwrite) {
                                this.cancelUpload(file.id);
                                $("#" + file.id).remove();
                                if (this.queueData.uploadQueue.length > 0 && this.queueData.queueLength > 0) {
                                    if (this.queueData.uploadQueue[0] == "*") {
                                        this.startUpload();
                                    } else {
                                        this.startUpload(this.queueData.uploadQueue.shift());
                                    }
                                }
                            }
                        }
                    }
                });
            }
            // Call the user-defined event handler
            if (settings.onUploadStart) settings.onUploadStart.call(this, file);
        },
        // Triggered when a file upload returns a successful code
        onUploadSuccess: function(file, data, response) {
            // Load the swfupload settings
            var settings = this.settings;
            var stats = this.getStats();
            this.queueData.uploadsSuccessful = stats.successful_uploads;
            this.queueData.queueBytesUploaded += file.size;
            // Call the default event handler
            if ($.inArray("onUploadSuccess", settings.overrideEvents) < 0) {
                $("#" + file.id).find(".data").html(" - 上传成功");
            }
            // Call the user-defined event handler
            if (settings.onUploadSuccess) settings.onUploadSuccess.call(this, file, data, response);
        }
    };
    $.fn.uploadify = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("The method " + method + " does not exist in $.uploadify");
        }
    };
});