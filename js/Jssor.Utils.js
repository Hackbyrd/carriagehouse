/// <reference path="Jssor.Core.js" />
/// <reference path="Jssor.Debug.js" />
/// <reference path="Jssor.Point.js" />
/// <reference path="Jssor.Easing.js" />

/*
* Jssor.Utils 6.0
* 
* TERMS OF USE - Jssor.Utils
* 
* Open source under the BSD License. 
* 
* Copyright Â© 2012 Jssor
* All rights reserved.
* 
* Redistribution and use in source and binary forms, with or without modification, 
* are permitted provided that the following conditions are met:
* 
* Redistributions of source code must retain the above copyright notice, this list of 
* conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list 
* of conditions and the following disclaimer in the documentation and/or other materials 
* provided with the distribution.
* 
* Neither the name of the author nor the names of contributors may be used to endorse 
* or promote products derived from this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
*  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
*  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
*  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
*  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
* OF THE POSSIBILITY OF SUCH DAMAGE. 
*
*/

var $JssorDirection$ = {
    $TO_LEFT: 0x0001,
    $TO_RIGHT: 0x0002,
    $TO_TOP: 0x0004,
    $TO_BOTTOM: 0x0008,
    $HORIZONTAL: 0x0003,
    $VERTICAL: 0x000C,
    $LEFTRIGHT: 0x0003,
    $TOPBOTOM: 0x000C,
    $TOPLEFT: 0x0005,
    $TOPRIGHT: 0x0006,
    $BOTTOMLEFT: 0x0009,
    $BOTTOMRIGHT: 0x000A,
    $AROUND: 0x000F,

    $GetDirectionHorizontal: function (direction) {
        return direction & 0x0003;
    },
    $GetDirectionVertical: function (direction) {
        return direction & 0x000C;
    },
    $ChessHorizontal: function (direction) {
        return (~direction & 0x0003) + (direction & 0x000C);
    },
    $ChessVertical: function (direction) {
        return (~direction & 0x000C) + (direction & 0x0003);
    },
    $IsToLeft: function (direction) {
        return (direction & 0x0003) == 0x0001;
    },
    $IsToRight: function (direction) {
        return (direction & 0x0003) == 0x0002;
    },
    $IsToTop: function (direction) {
        return (direction & 0x000C) == 0x0004;
    },
    $IsToBottom: function (direction) {
        return (direction & 0x000C) == 0x0008;
    },
    $IsHorizontal: function (direction) {
        return (direction & 0x0003) > 0;
    },
    $IsVertical: function (direction) {
        return (direction & 0x000C) > 0;
    }
};

var $JssorKeyCode$ = {
    $BACKSPACE: 8,
    $COMMA: 188,
    $DELETE: 46,
    $DOWN: 40,
    $END: 35,
    $ENTER: 13,
    $ESCAPE: 27,
    $HOME: 36,
    $LEFT: 37,
    $NUMPAD_ADD: 107,
    $NUMPAD_DECIMAL: 110,
    $NUMPAD_DIVIDE: 111,
    $NUMPAD_ENTER: 108,
    $NUMPAD_MULTIPLY: 106,
    $NUMPAD_SUBTRACT: 109,
    $PAGE_DOWN: 34,
    $PAGE_UP: 33,
    $PERIOD: 190,
    $RIGHT: 39,
    $SPACE: 32,
    $TAB: 9,
    $UP: 38
};

var $JssorAlignment$ = {
    $TopLeft: 0x11,
    $TopCenter: 0x12,
    $TopRight: 0x14,
    $MiddleLeft: 0x21,
    $MiddleCenter: 0x22,
    $MiddleRight: 0x24,
    $BottomLeft: 0x41,
    $BottomCenter: 0x42,
    $BottomRight: 0x44,

    $IsTop: function (aligment) {
        return aligment & 0x10 > 0;
    },
    $IsMiddle: function (alignment) {
        return alignment & 0x20 > 0;
    },
    $IsBottom: function (alignment) {
        return alignment & 0x40 > 0;
    },
    $IsLeft: function (alignment) {
        return alignment & 0x01 > 0;
    },
    $IsCenter: function (alignment) {
        return alignment & 0x02 > 0;
    },
    $IsRight: function (alignment) {
        return alignment & 0x04 > 0;
    }
};

var $JssorMatrix$;

var $JssorBrowser$ = {
    $UNKNOWN: 0,
    $IE: 1,
    $FIREFOX: 2,
    $SAFARI: 3,
    $CHROME: 4,
    $OPERA: 5
};

var $ROWSER_UNKNOWN$ = 0;
var $ROWSER_IE$ = 1;
var $ROWSER_FIREFOX$ = 2;
var $ROWSER_SAFARI$ = 3;
var $ROWSER_CHROME$ = 4;
var $ROWSER_OPERA$ = 5;

var $JssorAnimator$;

// $JssorUtils$ is a static class, so make it singleton instance
var $JssorUtils$ = new function () {

    // Fields

    var self = this;

    var arrActiveX = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
    var supportedImageFormats = {
        "bmp": false,
        "jpeg": true,
        "jpg": true,
        "png": true,
        "tif": false,
        "wdp": false
    };

    var browser = $JssorBrowser$.$UNKNOWN;
    var browserRuntimeVersion = 0;
    var browserEngineVersion = 0;

    var app = navigator.appName;
    var ver = navigator.appVersion;
    var ua = navigator.userAgent;

    var urlParams = {};

    function DetectBrowserIE() {
        if (!browser && app == "Microsoft Internet Explorer" &&
                !!window.attachEvent && !!window.ActiveXObject) {

            var ieOffset = ua.indexOf("MSIE");
            browser = $JssorBrowser$.$IE;
            browserEngineVersion = parseFloat(ua.substring(ieOffset + 5, ua.indexOf(";", ieOffset)));

            // update: for intranet sites and compat view list sites, IE sends
            // an IE7 User-Agent to the server to be interoperable, and even if
            // the page requests a later IE version, IE will still report the
            // IE7 UA to JS. we should be robust to self.
            //var docMode = document.documentMode;
            //if (typeof docMode !== "undefined") {
            //    browserRuntimeVersion = docMode;
            //}

            browserRuntimeVersion = document.documentMode || browserEngineVersion;
        }
    }

    function DetectBrowserOpera() {
        var match = /(opera)(?:.*version|)[ \/]([\w.]+)/i.exec(ua);
        if (match) {
            browser = $JssorBrowser$.$OPERA;
            browserRuntimeVersion = parseFloat(match[2]);
        }
    }

    function DetectBrowserElse() {
        if (!browser && app == "Netscape" && !!window.addEventListener) {

            var ffOffset = ua.indexOf("Firefox");
            var saOffset = ua.indexOf("Safari");
            var chOffset = ua.indexOf("Chrome");

            if (ffOffset >= 0) {
                browser = $JssorBrowser$.$FIREFOX;
                browserRuntimeVersion = parseFloat(ua.substring(ffOffset + 8));
            } else if (saOffset >= 0) {
                var slash = ua.substring(0, saOffset).lastIndexOf("/");
                browser = (chOffset >= 0) ? $JssorBrowser$.$CHROME : $JssorBrowser$.$SAFARI;
                browserRuntimeVersion = parseFloat(ua.substring(slash + 1, saOffset));
            }
        }
    }

    function IsBrowserIE() {
        DetectBrowserIE();
        return browser == $ROWSER_IE$;
    }

    function IsBrowserIeQuirks() {
        DetectBrowserIE();

        return browser == $ROWSER_IE$ && (browserRuntimeVersion < 6 || document.compatMode == "BackCompat");   //Composite to "CSS1Compat"
    }

    function IsBrowserFireFox() {
        DetectBrowserElse();
        return browser == $ROWSER_FIREFOX$;
    }

    function IsBrowserSafari() {
        DetectBrowserElse();
        return browser == $ROWSER_SAFARI$;
    }

    function IsBrowserChrome() {
        DetectBrowserElse();
        return browser == $ROWSER_CHROME$;
    }

    function IsBrowserOpera() {
        DetectBrowserOpera();
        return browser == $ROWSER_OPERA$;
    }

    function IsBadAlphaBrowser() {

        // update: chrome 2 no longer has self problem! and now same with IE9!
        return IsBrowserIE() && browserRuntimeVersion < 9 || (IsBrowserChrome() && browserRuntimeVersion < 2);
    }

    var _TransformProperty;
    function GetTransformProperty(elmt) {

        if (!_TransformProperty) {
            // Note that in some versions of IE9 it is critical that
            // msTransform appear in this list before MozTransform

            each(['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'], function (property) {
                if (!self.$IsUndefined(elmt.style[property])) {
                    _TransformProperty = property;
                    return true;
                }
            });
        }

        return _TransformProperty;
    }

    // Constructor
    {
        //Ignore urlParams
        //        // Url parameters

        //        var query = window.location.search.substring(1);    // ignore '?'
        //        var parts = query.split('&');

        //        for (var i = 0; i < parts.length; i++) {
        //            var part = parts[i];
        //            var sep = part.indexOf('=');

        //            if (sep > 0) {
        //                urlParams[part.substring(0, sep)] =
        //                        decodeURIComponent(part.substring(sep + 1));
        //            }
        //        }

        // Browser behaviors

    }

    // Helpers
    function getOffsetParent(elmt, isFixed) {
        // IE and Opera "fixed" position elements don't have offset parents.
        // regardless, if it's fixed, its offset parent is the body.
        if (isFixed && elmt != document.body) {
            return document.body;
        } else {
            return elmt.offsetParent;
        }
    }

    function toString(obj) {
        return Object.prototype.toString.call(obj);
    }

    // [[Class]] -> type pairs
    var class2type;

    function each(object, callback) {
        if (toString(object) == "[object Array]") {
            for (var i = 0; i < object.length; i++) {
                if (callback(object[i], i, object)) {
                    break;
                }
            }
        } else {
            for (var name in object) {
                if (callback(object[name], name, object)) {
                    break;
                }
            }
        }
    }

    function GetClass2Type() {
        if (!class2type) {
            class2type = {};
            each(["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object"], function (name) {
                class2type["[object " + name + "]"] = name.toLowerCase();
            });
        }

        return class2type;
    }

    function type(obj) {
        return obj == null ? String(obj) : GetClass2Type()[toString(obj)] || "object";
    }

    function isPlainObject(obj) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || type(obj) !== "object" || obj.nodeType || self.$IsWindow(obj)) {
            return false;
        }

        var hasOwn = Object.prototype.hasOwnProperty;

        try {
            // Not own constructor property must be Object
            if (obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for (key in obj) { }

        return key === undefined || hasOwn.call(obj, key);
    }

    function Delay(code, delay) {
        setTimeout(code, delay || 0);
    }

    function RemoveByReg(str, reg) {
        var m = reg.exec(str);

        if (m) {
            var header = str.substr(0, m.index);
            var tailer = str.substr(m.lastIndex + 1, str.length - (m.lastIndex + 1));
            str = header + tailer;
        }

        return str;
    }

    function BuildNewCss(oldCss, removeRegs, replaceValue) {
        var css = oldCss || "";

        each(removeRegs, function (removeReg) {
            var m = removeReg.exec(css);

            if (m) {
                var header = css.substr(0, m.index);
                var tailer = css.substr(m.lastIndex + 1, css.length - (m.lastIndex + 1));
                css = header + tailer;
            }
        });

        css = replaceValue + (css.indexOf(" ") != 0 ? " " : "") + css;

        return css;
    }

    // Methods

    self.$IsBrowserIE = IsBrowserIE;

    self.$IsBrowserIeQuirks = IsBrowserIeQuirks;

    self.$IsBrowserFireFox = IsBrowserFireFox;

    self.$IsBrowserSafari = IsBrowserSafari;

    self.$IsBrowserChrome = IsBrowserChrome;

    self.$IsBrowserOpera = IsBrowserOpera;

    self.$GetBrowser = function () {
        DetectBrowserIE();
        DetectBrowserOpera();
        DetectBrowserElse();

        return browser;
    };

    self.$GetBrowserVersion = function () {
        return browserRuntimeVersion;
    };

    self.$GetBrowserEngineVersion = function () {
        return browserEngineVersion || browserRuntimeVersion;
    };

    self.$Delay = Delay;

    self.$GetElement = function (elmt) {
        if (self.$IsString(elmt)) {
            elmt = document.getElementById(elmt);
        }

        return elmt;
    };

    self.$GetElementPosition = function (elmt) {
        elmt = self.$GetElement(elmt);
        var result = new $JssorPoint$();

        // technique from:
        // http://www.quirksmode.org/js/findpos.html
        // with special check for "fixed" elements.

        while (elmt) {
            result.x += elmt.offsetLeft;
            result.y += elmt.offsetTop;

            var isFixed = self.$GetElementStyle(elmt).position == "fixed";

            if (isFixed) {
                result = result.$Plus(self.$GetPageScroll(window));
            }

            elmt = getOffsetParent(elmt, isFixed);
        }

        return result;
    };

    self.$GetElementSize = function (elmt) {
        elmt = self.$GetElement(elmt);
        return new $JssorPoint$(elmt.clientWidth, elmt.clientHeight);
    };

    self.$GetElementStyle = function (elmt) {
        elmt = self.$GetElement(elmt);

        if (elmt.currentStyle) {
            return elmt.currentStyle;
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(elmt, "");
        } else {
            $JssorDebug$.$Fail("Unknown elmt style, no known technique.");
        }
    };

    self.$GetEvent = function (event) {
        return event ? event : window.event;
    };

    self.$GetEventSrcElement = function (event) {
        event = self.$GetEvent(event);
        return event.target || event.srcElement || document;
    };

    self.$GetEventDstElement = function (event) {
        event = self.$GetEvent(event);
        return event.relatedTarget || event.toElement;
    };

    self.$GetMousePosition = function (event) {
        event = self.$GetEvent(event);
        var result = new $JssorPoint$();

        // technique from:
        // http://www.quirksmode.org/js/events_properties.html

        if (event.type == "DOMMouseScroll" &&
                IsBrowserFireFox() && browserRuntimeVersion < 3) {
            // hack for FF2 which reports incorrect position for mouse scroll
            result.x = event.screenX;
            result.y = event.screenY;
        } else if (typeof (event.pageX) == "number") {
            result.x = event.pageX;
            result.y = event.pageY;
        } else if (typeof (event.clientX) == "number") {
            result.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            result.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        } else {
            $JssorDebug$.$Fail("Unknown event mouse position, no known technique.");
        }

        return result;
    };

    self.$GetMouseScroll = function (event) {
        event = self.$GetEvent(event);
        var delta = 0; // default value

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/10/31/javascript-tutorial-the-scroll-wheel/

        if (typeof (event.wheelDelta) == "number") {
            delta = event.wheelDelta;
        } else if (typeof (event.detail) == "number") {
            delta = event.detail * -1;
        } else {
            $JssorDebug$.$Fail("Unknown event mouse scroll, no known technique.");
        }

        // normalize value to [-1, 1]
        return delta ? delta / Math.abs(delta) : 0;
    };

    self.$GetPageScroll = function (window) {
        var result = new $JssorPoint$();
        var docElmt = window.document.documentElement || {};
        var body = window.document.body || {};

        // technique from:
        // http://www.howtocreate.co.uk/tutorials/javascript/browserwindow

        if (typeof (window.pageXOffset) == "number") {
            // most browsers
            result.x = window.pageXOffset;
            result.y = window.pageYOffset;
        } else if (body.scrollLeft || body.scrollTop) {
            // W3C spec, IE6+ in quirks mode
            result.x = body.scrollLeft;
            result.y = body.scrollTop;
        } else if (docElmt.scrollLeft || docElmt.scrollTop) {
            // IE6+ in standards mode
            result.x = docElmt.scrollLeft;
            result.y = docElmt.scrollTop;
        }

        // note: we specifically aren't testing for typeof here, because IE sets
        // the appropriate variables undefined instead of 0 under certain
        // conditions. self means we also shouldn't fail if none of the three
        // cases are hit; we'll just assume the page scroll is 0.

        return result;
    };

    self.$GetWindowSize = function (window) {
        var result = new $JssorPoint$();
        var docElmt = window.document.documentElement || {};
        var body = window.document.body || {};

        // technique from:
        // http://www.howtocreate.co.uk/tutorials/javascript/browserwindow

        // important: i originally cleaned up the second and third IE checks to
        // check if the typeof was number. but self fails for quirks mode,
        // because docElmt.clientWidth is indeed a number, but it's incorrectly
        // zero. so no longer checking typeof is number for those cases.

        if (typeof (window.innerWidth) == 'number') {
            // non-IE browsers
            result.x = window.innerWidth;
            result.y = window.innerHeight;
        } else if (docElmt.clientWidth || docElmt.clientHeight) {
            // IE6+ in standards mode
            result.x = docElmt.clientWidth;
            result.y = docElmt.clientHeight;
        } else if (body.clientWidth || body.clientHeight) {
            // IE6+ in quirks mode
            result.x = body.clientWidth;
            result.y = body.clientHeight;
        } else {
            $JssorDebug$.$Fail("Unknown window size, no known technique.");
        }

        return result;
    };

    self.$ImageFormatSupported = function (ext) {
        var ext = ext ? ext : "";
        return !!supportedImageFormats[ext.toLowerCase()];
    };

    self.$MakeCenteredNode = function (elmt) {
        elmt = $JssorUtils$.$GetElement(elmt);
        var div = self.$MakeNeutralElement("div");
        var html = [];

        // technique for vertically centering (in IE!!!) from:
        // http://www.jakpsatweb.cz/css/css-vertical-center-solution.html
        // with explicit neutralizing of styles added by me.
        html.push('<div style="display:table; height:100%; width:100%;');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('#position:relative; overflow:hidden; text-align:left;">');
        // the text-align:left guards against incorrect centering in IE
        html.push('<div style="#position:absolute; #top:50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('display:table-cell; vertical-align:middle;">');
        html.push('<div style="#position:relative; #top:-50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('text-align:center;"></div></div></div>');

        div.innerHTML = html.join('');
        div = div.firstChild;

        // now add the elmt as a child to the inner-most div
        var innerDiv = div;
        var innerDivs = div.getElementsByTagName("div");
        while (innerDivs.length > 0) {
            innerDiv = innerDivs[0];
            innerDivs = innerDiv.getElementsByTagName("div");
        }

        innerDiv.appendChild(elmt);

        return div;
    };

    self.$MakeNeutralElement = function (tagName) {
        var elmt = self.$CreateElement(tagName);
        var style = elmt.style;

        // TODO reset neutral elmt's style in a better way
        style.background = "transparent none";
        style.border = "none";
        style.margin = "0px";
        style.padding = "0px";
        style.position = "static";

        return elmt;
    };

    self.$MakeTransparentImage = function (src) {
        var img = self.$MakeNeutralElement("img");
        var elmt = null;

        if (IsBrowserIE() && browserRuntimeVersion < 7) {
            elmt = self.$MakeNeutralElement("span");
            elmt.style.display = "inline-block";

            // to size span correctly, load image and get natural size,
            // but don't override any user-set CSS values
            img.onload = function () {
                elmt.style.width = elmt.style.width || img.width + "px";
                elmt.style.height = elmt.style.height || img.height + "px";

                img.onload = null;
                img = null;     // to prevent memory leaks in IE
            };

            img.src = src;
            elmt.style.filter =
                    "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
                    src + "', sizingMethod='scale')";
        } else {
            elmt = img;
            elmt.src = src;
        }

        return elmt;
    };

    self.$GetStyleOpacity = function (elmt) {
        if (IsBrowserIE() && browserEngineVersion < 9) {
            var match = /opacity=([^)]*)/.exec(elmt.style.filter || "");
            return match ? (parseFloat(match[1]) / 100) : 1;
        }
        else
            return parseFloat(elmt.style.opacity || "1");
    };

    self.$SetStyleOpacity = self.$setElementOpacity = function (elmt, opacity, usesAlpha) {
        if (usesAlpha && IsBadAlphaBrowser()) {
            // images with alpha channels won't fade well, so round
            opacity = Math.round(opacity);
        }

        if (IsBrowserIE() && browserEngineVersion < 9) {
            var filterName = "filter"; // browserEngineVersion < 8 ? "filter" : "-ms-filter";
            var finalFilter = elmt.style[filterName] || "";

            // for CSS filter browsers (IE), remove alpha filter if it's unnecessary.
            // update: doing self always since IE9 beta seems to have broken the
            // behavior if we rely on the programmatic filters collection.
            var re = new RegExp(/[\s]*alpha\([^\)]*\)/g);

            // important: note the lazy star! self protects against
            // multiple filters; we don't want to delete the other ones.
            // update: also trimming extra whitespace around filter.


            var ieOpacity = Math.round(100 * opacity);
            var alphaFilter = ""
            if (ieOpacity < 100) {
                alphaFilter = "alpha(opacity=" + ieOpacity + ") ";
                //elmt.style["-ms-filter"] = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + ieOpacity + ") ";
            }

            var newFilter = BuildNewCss(finalFilter, [re], alphaFilter);

            elmt.style[filterName] = newFilter;
        }
        else {
            elmt.style.opacity = opacity == 1 ? "" : opacity;
        }
    };

    //self.$SetStyleTransformMatrix = function (elmt, matrix) {
    //    var cssPropertyName = "transform";
    //    var replaceReg;
    //    var replaceValue;
    //    var prefixQuote;

    //    if (IsBrowserIE() && browserEngineVersion < 10) {
    //        cssPropertyName = "filter";
    //        prefixQuote = browserEngineVersion >= 8;
    //        replaceReg = new RegExp(/[\s]*progid:DXImageTransform\.Microsoft\.Matrix\([^\)]*\)/g);

    //        replaceValue = "progid:DXImageTransform.Microsoft.Matrix(" + "M11=" + matrix[0][0] + ",M12=" + matrix[0][1] + ",M21=" + matrix[1][0] + ",M22=" + matrix[1][1] + ",SizingMethod='auto expand')";
    //    }
    //    else {
    //        cssPropertyName = GetTransformProperty();
    //        replaceReg = new RegExp(/[\s]*Matrix\(.*?\)/g);

    //        replaceValue = "matrix(" + [matrix[0][0], matrix[1][0], matrix[0][1], matrix[1][1]].join(",") + ",0,0)";
    //    }

    //    var cssValue = elmt.style[cssPropertyName];
    //    cssValue = RemoveByReg(cssValue, replaceReg);

    //    if (cssValue && cssValue.indexOf(" ") != 0)
    //        cssValue = " " + cssValue;
    //    replaceValue += cssValue;

    //    elmt.style[cssPropertyName] = replaceValue;
    //};

    self.$SetStyleMatrixIE = function (elmt, matrix, offset) {
        var oldFilterValue = elmt.style.filter;
        var matrixReg = new RegExp(/[\s]*progid:DXImageTransform\.Microsoft\.Matrix\([^\)]*\)/g);
        var matrixValue = "progid:DXImageTransform.Microsoft.Matrix(" + "M11=" + matrix[0][0] + ", M12=" + matrix[0][1] + ", M21=" + matrix[1][0] + ", M22=" + matrix[1][1] + ", SizingMethod='auto expand')";

        var newFilterValue = BuildNewCss(oldFilterValue, [matrixReg], matrixValue);
        elmt.style.filter = newFilterValue;

        self.$SetStyleMarginTop(elmt, offset.y);
        self.$SetStyleMarginLeft(elmt, offset.x);
    };

    self.$SetStyleTransform = function (elmt, transform) {
        var rotate = transform.$Rotate || 0;
        var scale = transform.$Scale == 0 ? 0 : (transform.$Scale || 1);

        if (IsBrowserIE() && browserEngineVersion < 9) {
            var matrix = self.$CreateMatrix(rotate / 180 * Math.PI, scale, scale);
            self.$SetStyleMatrixIE(elmt, matrix, self.$GetMatrixOffset(matrix, transform.$OriginalWidth, transform.$OriginalHeight));
        }
        else {
            //rotate(15deg) scale(.5)
            var transformValue = "rotate(" + rotate % 360 + "deg) scale(" + scale + ")";
            var transformProperty = GetTransformProperty(elmt);

            var oldTransformValue = elmt.style[transformProperty];
            var rotateReg = new RegExp(/[\s]*rotate\(.*?\)/g);
            var scaleReg = new RegExp(/[\s]*scale\(.*?\)/g);

            var newTransformValue = BuildNewCss(oldTransformValue, [rotateReg, scaleReg], transformValue);

            if (transformProperty)
                elmt.style[transformProperty] = newTransformValue;
        }
    };

    self.$GetStyleFloat = function (elmt) {
        return IsBrowserIE() ? elmt.style.styleFloat : elmt.style.cssFloat;
    };

    self.$SetStyleFloat = function (elmt, float) {
        if (IsBrowserIE())
            elmt.style.styleFloat = float;
        else
            elmt.style.cssFloat = float;
    };

    self.$AddEvent = function (elmt, eventName, handler, useCapture) {
        elmt = self.$GetElement(elmt);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (elmt.addEventListener) {
            if (eventName == "mousewheel") {
                elmt.addEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to add the mousewheel -- not a mistake!
            // self is for opera, since it uses onmousewheel but needs addEventListener.
            elmt.addEventListener(eventName, handler, useCapture);
        } else if (elmt.attachEvent) {
            elmt.attachEvent("on" + eventName, handler);
            if (useCapture && elmt.setCapture) {
                elmt.setCapture();
            }
        } else {
            $JssorDebug$.$Fail("Unable to attach event handler, no known technique.");
        }
    };

    self.$RemoveEvent = function (elmt, eventName, handler, useCapture) {
        elmt = self.$GetElement(elmt);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (elmt.removeEventListener) {
            if (eventName == "mousewheel") {
                elmt.removeEventListener("DOMMouseScroll", handler, useCapture);
            }
            // we are still going to remove the mousewheel -- not a mistake!
            // self is for opera, since it uses onmousewheel but needs removeEventListener.
            elmt.removeEventListener(eventName, handler, useCapture);
        } else if (elmt.detachEvent) {
            elmt.detachEvent("on" + eventName, handler);
            if (useCapture && elmt.releaseCapture) {
                elmt.releaseCapture();
            }
        } else {
            $JssorDebug$.$Fail("Unable to detach event handler, no known technique.");
        }
    };

    self.$AddEventBrowserMouseUp = function (handler, userCapture) {
        self.$AddEvent((IsBrowserIE() && browserRuntimeVersion < 9) ? document : window, "mouseup", handler, userCapture);
    };

    self.$RemoveEventBrowserMouseUp = function (handler, userCapture) {
        self.$RemoveEvent((IsBrowserIE() && browserRuntimeVersion < 9) ? document : window, "mouseup", handler, userCapture);
    };

    self.$AddEventBrowserMouseDown = function (handler, userCapture) {
        self.$AddEvent((IsBrowserIE() && browserRuntimeVersion < 9) ? document : window, "mousedown", handler, userCapture);
    };

    self.$RemoveEventBrowserMouseDown = function (handler, userCapture) {
        self.$RemoveEvent((IsBrowserIE() && browserRuntimeVersion < 9) ? document : window, "mousedown", handler, userCapture);
    };

    self.$CancelEvent = function (event) {
        event = self.$GetEvent(event);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (event.preventDefault) {
            event.preventDefault();     // W3C for preventing default
        }

        event.cancel = true;            // legacy for preventing default
        event.returnValue = false;      // IE for preventing default
    };

    self.$StopEvent = function (event) {
        event = self.$GetEvent(event);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if (event.stopPropagation) {
            event.stopPropagation();    // W3C for stopping propagation
        }

        event.cancelBubble = true;      // IE for stopping propagation
    };

    self.$CreateCallback = function (object, method) {
        // create callback args
        var initialArgs = [];
        for (var i = 2; i < arguments.length; i++) {
            initialArgs.push(arguments[i]);
        }

        // create closure to apply method
        return function () {
            // concatenate new args, but make a copy of initialArgs first
            var args = initialArgs.concat([]);
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            return method.apply(object, args);
        };
    };

    var _Freeer;
    self.$FreeElement = function (elmt) {
        if (!_Freeer)
            _Freeer = self.$CreateDivElement();

        if (elmt) {
            $JssorUtils$.$AppendChild(_Freeer, elmt);
            $JssorUtils$.$ClearInnerHtml(_Freeer);
        }
    };

    //    self.$GetUrlParameter = function (key) {
    //        var value = urlParams[key];
    //        return value ? value : null;
    //    };

    self.$MakeAjaxRequest = function (url, callback) {
        var async = typeof (callback) == "function";
        var req = null;

        if (async) {
            var actual = callback;
            var callback = function () {
                Delay($JssorUtils$.$CreateCallback(null, actual, req), 1);
            };
        }

        if (window.ActiveXObject) {
            for (var i = 0; i < arrActiveX.length; i++) {
                try {
                    req = new ActiveXObject(arrActiveX[i]);
                    break;
                } catch (e) {
                    continue;
                }
            }
        } else if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        }

        if (!req) {
            $JssorDebug$.$Fail("Browser doesn't support XMLHttpRequest.");
        }

        if (async) {
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    // prevent memory leaks by breaking circular reference now
                    req.onreadystatechange = new Function();
                    callback();
                }
            };
        }

        try {
            req.open("GET", url, async);
            req.send(null);
        } catch (e) {
            $JssorDebug$.$Log(e.name + " while making AJAX request: " + e.message);

            req.onreadystatechange = null;
            req = null;

            if (async) {
                callback();
            }
        }

        return async ? null : req;
    };

    self.$ParseXml = function (string) {
        var xmlDoc = null;

        if (window.ActiveXObject) {
            try {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(string);
            } catch (e) {
                $JssorDebug$.$Log(e.name + " while parsing XML (ActiveX): " + e.message);
            }
        } else if (window.DOMParser) {
            try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(string, "text/xml");
            } catch (e) {
                $JssorDebug$.$Log(e.name + " while parsing XML (DOMParser): " + e.message);
            }
        } else {
            $JssorDebug$.$Fail("Browser doesn't support XML DOM.");
        }

        return xmlDoc;
    };

    self.$SetInnerText = function (elmt, text) {
        var textNode = document.createTextNode(text);
        elmt.innerHTML = "";
        elmt.appendChild(textNode);
    };

    self.$GetInnerText = function (elmt) {
        return elmt.textContent || elmt.innerText;
    };

    self.$GetInnerHtml = function (elmt) {
        return elmt.innerHTML;
    };

    self.$SetInnerHtml = function (elmt, html) {
        elmt.innerHTML = html;
    };

    self.$ClearInnerHtml = function (elmt) {
        elmt.innerHTML = "";
    };

    self.$EncodeHtml = function (text) {
        var div = self.$CreateDivElement();
        self.$SetInnerText(div, text);
        return self.$GetInnerHtml(div);
    };

    self.$DecodeHtml = function (html) {
        var div = self.$CreateDivElement();
        self.$SetInnerHtml(div, html);
        return self.$GetInnerText(div);
    };

    self.$SelectElement = function (elmt) {
        var userSelection;
        if (window.getSelection) {
            //W3C default
            userSelection = window.getSelection();
        }
        var theRange = null;
        if (document.createRange) {
            theRange = document.createRange();
            theRange.selectNode(elmt);
        }
        else {
            theRange = document.body.createTextRange();
            theRange.moveToElementText(elmt);
            theRange.select();
        }
        //set user selection
        if (userSelection)
            userSelection.addRange(theRange);
    };

    self.$DeselectElements = function () {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };

    self.$GetChildren = function (elmt) {
        var children = [];

        for (var tmpEl = elmt.firstChild; tmpEl; tmpEl = tmpEl.nextSibling) {
            if (tmpEl.nodeType == 1) {
                children.push(tmpEl);
            }
        }

        return children;
    };

    function FindFirstChildByAttribute(elmt, attrValue, attrName, deep) {
        if (!attrName)
            attrName = "u";

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (elmt.getAttribute(attrName) == attrValue)
                    return elmt;

                if (deep) {
                    var childRet = FindFirstChildByAttribute(elmt, attrValue, attrName, deep);
                    if (childRet)
                        return childRet;
                }
            }
        }
    }

    self.$FindFirstChildByAttribute = FindFirstChildByAttribute;

    function FindChildrenByAttribute(elmt, attrValue, attrName, deep) {
        if (!attrName)
            attrName = "u";

        var ret = [];

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (elmt.getAttribute(attrName) == attrValue)
                    ret.push(elmt);

                if (deep) {
                    var childRet = FindFirstChildByAttribute(elmt, attrValue, attrName, deep);
                    if (childRet.length)
                        ret = ret.concat(childRet);
                }
            }
        }

        return ret;
    }

    self.$FindChildrenByAttribute = FindChildrenByAttribute;

    function FindFirstChildByTag(elmt, tagName, deep) {

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (elmt.tagName == tagName)
                    return elmt;

                if (deep) {
                    var childRet = FindFirstChildByTag(elmt, tagName, deep);
                    if (childRet)
                        return childRet;
                }
            }
        }
    }

    self.$FindFirstChildByTag = FindFirstChildByTag;

    function FindChildrenByTag(elmt, tagName, deep) {
        var ret = [];

        for (elmt = elmt ? elmt.firstChild : null; elmt; elmt = elmt.nextSibling) {
            if (elmt.nodeType == 1) {
                if (elmt.tagName == tagName)
                    ret.push(elmt);

                if (deep) {
                    var childRet = FindChildrenByTag(elmt, tagName, true);
                    if (childRet.length)
                        ret = ret.concat(childRet);
                }
            }
        }

        return ret;
    }

    self.$FindChildrenByTag = FindChildrenByTag;

    self.$GetElementsByTagName = function (elmt, tagName) {
        return elmt.getElementsByTagName(tagName);
    };

    self.$Extend = function (target) {
        for (var i = 1; i < arguments.length; i++) {

            var options = arguments[i];

            // Only deal with non-null/undefined values
            if (options) {
                // Extend the base object
                for (var name in options) {
                    target[name] = options[name];
                }
            }
        }

        // Return the modified object
        return target;
    };

    self.$Unextend = function (target, options) {
        $JssorDebug$.$Assert(options);

        var unextended = {};

        // Extend the base object
        for (var name in target) {
            if (target[name] != options[name]) {
                unextended[name] = target[name];
            }
        }

        // Return the modified object
        return unextended;
    };

    self.$IsUndefined = function (obj) {
        return type(obj) == "undefined";
    };

    self.$IsFunction = function (obj) {
        return type(obj) == "function";
    };

    self.$IsArray = Array.isArray || function (obj) {
        return type(obj) == "array";
    };

    self.$IsString = function (obj) {
        return type(obj) == "string";
    };

    self.$IsNumeric = function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    };

    self.$IsWindow = function (obj) {
        return obj != null && obj == obj.window;
    };

    self.$Type = type;

    // args is for internal usage only
    self.$Each = each;

    self.$IsPlainObject = isPlainObject;

    self.$CreateDivElement = function (doc) {
        return self.$CreateElement("DIV", doc);
    };

    self.$CreateSpanElement = function (doc) {
        return self.$CreateElement("SPAN", doc);
    };

    self.$CreateElement = function (tagName, doc) {
        doc = doc || document;
        return doc.createElement(tagName);
    };

    self.$EmptyFunction = function () { };

    self.$GetAttribute = function (elmt, name) {
        return elmt.getAttribute(name);
    };

    self.$SetAttribute = function (elmt, name, value) {
        elmt.setAttribute(name, value);
    };

    self.$GetClassName = function (elmt) {
        return elmt.className;
    };

    self.$SetClassName = function (elmt, className) {
        elmt.className = className ? className : "";
    };

    self.$GetStyleCursor = function (elmt) {
        return elmt.style.cursor;
    };

    self.$SetStyleCursor = function (elmt, cursor) {
        elmt.style.cursor = cursor;
    };

    self.$GetStyleDisplay = function (elmt) {
        return elmt.style.display;
    };

    self.$SetStyleDisplay = function (elmt, display) {
        elmt.style.display = display;
    };

    self.$GetStyleOverflow = function (elmt) {
        return elmt.style.overflow;
    };

    self.$SetStyleOverflow = function (elmt, overflow) {
        elmt.style.overflow = overflow;
    };

    self.$GetStyleOverflowX = function (elmt) {
        return elmt.style.overflowX;
    };

    self.$SetStyleOverflowX = function (elmt, overflow) {
        elmt.style.overflowX = overflow;
    };

    self.$GetStyleOverflowY = function (elmt) {
        return elmt.style.overflowY;
    };

    self.$SetStyleOverflowY = function (elmt, overflow) {
        elmt.style.overflowY = overflow;
    };

    self.$GetParentNode = function (elmt) {
        return elmt.parentNode;
    };

    self.$HideElement = function (elmt) {
        self.$SetStyleDisplay(elmt, "none");
    };

    self.$HideElements = function (elmts) {
        for (var i = 0; i < elmts.length; i++) {
            self.$HideElement(elmts[i]);
        }
    };

    self.$ShowElement = function (elmt, show) {
        self.$SetStyleDisplay(elmt, show == false ? "none" : "");
    };

    self.$ShowElements = function (elmts) {
        for (var i = 0; i < elmts.length; i++) {
            self.$ShowElement(elmts[i]);
        }
    };

    self.$GetStylePosition = function (elmt) {
        return elmt.style.position;
    };

    self.$SetStylePosition = function (elmt, position) {
        elmt.style.position = position;
    };

    self.$GetStyleTop = function (elmt) {
        return parseInt(elmt.style.top, 10);
    };

    self.$SetStyleTop = function (elmt, top) {
        elmt.style.top = top + "px";
    };

    self.$GetStyleRight = function (elmt) {
        return parseInt(elmt.style.right, 10);
    };

    self.$SetStyleRight = function (elmt, right) {
        elmt.style.right = right + "px";
    };

    self.$GetStyleBottom = function (elmt) {
        return parseInt(elmt.style.bottom, 10);
    };

    self.$SetStyleBottom = function (elmt, bottom) {
        elmt.style.bottom = bottom + "px";
    };

    self.$GetStyleLeft = function (elmt) {
        return parseInt(elmt.style.left, 10);
    };

    self.$SetStyleLeft = function (elmt, left) {
        elmt.style.left = left + "px";
    };

    self.$GetStyleWidth = function (elmt) {
        return parseInt(elmt.style.width, 10);
    };

    self.$SetStyleWidth = function (elmt, width) {
        elmt.style.width = Math.max(width, 0) + "px";
    };

    self.$GetStyleHeight = function (elmt) {
        return parseInt(elmt.style.height, 10);
    };

    self.$SetStyleHeight = function (elmt, height) {
        elmt.style.height = Math.max(height, 0) + "px";
    };

    self.$GetStyleCssText = function (elmt) {
        return elmt.style.cssText;
    };

    self.$SetStyleCssText = function (elmt, cssText) {
        elmt.style.cssText = cssText;
    };

    self.$RemoveAttribute = function (elmt, attrbuteName) {
        elmt.removeAttribute(attrbuteName);
    };

    self.$GetBorderWidth = function (elmt) {
        return parseInt(elmt.style.borderWidth, 10);
    };

    self.$SetBorderWdith = function (elmt, width) {
        elmt.style.width = width + "px";
    };

    self.$GetStyleMarginLeft = function (elmt) {
        return parseInt(elmt.style.marginLeft, 10);
    };

    self.$SetStyleMarginLeft = function (elmt, marginLeft) {
        elmt.style.marginLeft = marginLeft + "px";
    };

    self.$GetStyleMarginTop = function (elmt) {
        return parseInt(elmt.style.marginTop, 10);
    };

    self.$SetStyleMarginTop = function (elmt, marginTop) {
        elmt.style.marginTop = marginTop + "px";
    };

    self.$GetStyleMarginBottom = function (elmt) {
        return parseInt(elmt.style.marginBottom, 10);
    };

    self.$SetStyleMarginBottom = function (elmt, marginBottom) {
        elmt.style.marginBottom = marginBottom + "px";
    };

    self.$GetStyleMarginRight = function (elmt) {
        return parseInt(elmt.style.marginRight, 10);
    };

    self.$SetStyleMarginRight = function (elmt, marginRight) {
        elmt.style.marginRight = marginRight + "px";
    };

    self.$GetStyleBorder = function (elmt) {
        return elmt.style.border;
    };

    self.$SetStyleBorder = function (elmt, border) {
        elmt.style.border = border;
    };

    self.$GetStyleBorderWidth = function (elmt) {
        return parseInt(elmt.style.borderWidth);
    };

    self.$SetStyleBorderWidth = function (elmt, borderWidth) {
        elmt.style.borderWidth = borderWidth + "px";
    };

    self.$GetStyleBorderStyle = function (elmt) {
        return elmt.style.borderStyle;
    };

    self.$SetStyleBorderStyle = function (elmt, borderStyle) {
        elmt.style.borderStyle = borderStyle;
    };

    self.$GetStyleBorderColor = function (elmt) {
        return elmt.style.borderColor;
    };

    self.$SetStyleBorderColor = function (elmt, borderColor) {
        elmt.style.borderColor = borderColor;
    };

    self.$GetStyleVibility = function (elmt) {
        return elmt.style.vibility;
    };

    self.$SetStyleVisibility = function (elmt, visibility) {
        elmt.style.visibility = visibility;
    };

    self.$GetStyleZIndex = function (elmt) {
        return elmt.style.zIndex;
    };

    self.$SetStyleZIndex = function (elmt, zIndex) {
        elmt.style.zIndex = zIndex;
    };

    self.$GetStyleBackgroundColor = function (elmt) {
        return elmt.style.backgroundColor;
    };

    self.$SetStyleBackgroundColor = function (elmt, backgroundColor) {
        elmt.style.backgroundColor = backgroundColor;
    };

    self.$GetStyleColor = function (elmt) {
        return elmt.style.color;
    };

    self.$SetStyleColor = function (elmt, color) {
        elmt.style.color = color;
    };

    self.$GetStyleBackgroundImage = function (elmt) {
        return elmt.style.backgroundImage;
    };

    self.$SetStyleBackgroundImage = function (elmt, backgroundImage) {
        elmt.style.backgroundImage = backgroundImage;
    };

    self.$SetStyleClip = function (elmt, clip) {
        elmt.style.clip = "rect(" + Math.round(clip.$Top) + "px " + Math.round(clip.$Right) + "px " + Math.round(clip.$Bottom) + "px " + Math.round(clip.$Left) + "px)";
    };

    self.$GetStyleZoom = function (elmt) {
        return elmt.style.zoom;
    };

    self.$SetStyleZoom = function (elmt, zoom) {
        return elmt.style.zoom = zoom;
    };

    self.$GetNow = function () {
        return new Date().getTime();
    };

    self.$AppendChild = function (elmt, child) {
        elmt.appendChild(child);
    };

    self.$AppendChildren = function (elmt, children) {
        each(children, function (child) {
            self.$AppendChild(elmt, child);
        });
    };

    self.$InsertBefore = function (elmt, child, refObject) {
        elmt.insertBefore(child, refObject);
    };

    self.$InsertAfter = function (elmt, child, refObject) {
        elmt.insertAfter(child, refObject);
    };

    self.$InsertAdjacentHtml = function (elmt, where, text) {
        elmt.insertAdjacentHTML(where, text);
    };

    self.$RemoveChild = function (elmt, child) {
        elmt.removeChild(child);
    };

    self.$RemoveChildren = function (elmt, children) {
        each(children, function (child) {
            self.$RemoveChild(elmt, child);
        });
    };

    self.$ClearChildren = function (elmt) {
        self.$RemoveChildren(elmt, self.$GetChildren(elmt));
    };

    self.$ParseInt = function (str, radix) {
        return parseInt(str, radix || 10);
    };

    self.$ParseFloat = function (str) {
        return parseFloat(str);
    };

    self.$IsChild = function (elmtA, elmtB) {
        var body = document.body;
        while (elmtB && elmtA != elmtB && body != elmtB) {
            try {
                elmtB = elmtB.parentNode;
            } catch (e) {
                // Firefox sometimes fires events for XUL elements, which throws
                // a "permission denied" error. so this is not a child.
                return false;
            }
        }
        return elmtA == elmtB;
    };

    self.$ToLowerCase = function (value) {
        if (value)
            value = value.toLowerCase();

        return value;
    };

    self.$CloneNode = function (elmt, deep) {
        return elmt.cloneNode(deep);
    };

    //var _ImagesLoaded = [];
    function LoadImageCallback(callback, image, abort) {
        image.onload = null;
        //_ImagesLoaded[image.src] = true;

        if (callback)
            callback(image, abort);
    }

    self.$LoadImage = function (src, callback) {
        var image = new Image();
        image.onload = $JssorUtils$.$CreateCallback(null, LoadImageCallback, callback, image);
        image.onabort = $JssorUtils$.$CreateCallback(null, LoadImageCallback, callback, image, true);
        image.src = src;

        if (self.$IsBrowserOpera() && browserRuntimeVersion < 11.6)
            LoadImageCallback(callback, image);
    };

    self.$BuildElement = function (template, tagName, replacer, createCopy) {
        if (createCopy)
            template = $JssorUtils$.$CloneNode(template, true);

        var templateHolders = $JssorUtils$.$GetElementsByTagName(template, tagName);
        for (var j = templateHolders.length - 1; j > -1; j--) {
            var templateHolder = templateHolders[j];
            var replaceItem = $JssorUtils$.$CloneNode(replacer, true);
            $JssorUtils$.$SetClassName(replaceItem, $JssorUtils$.$GetClassName(templateHolder));
            $JssorUtils$.$SetStyleCssText(replaceItem, $JssorUtils$.$GetStyleCssText(templateHolder));

            var thumbnailPlaceHolderParent = $JssorUtils$.$GetParentNode(templateHolder);
            $JssorUtils$.$InsertBefore(thumbnailPlaceHolderParent, replaceItem, templateHolder);
            $JssorUtils$.$RemoveChild(thumbnailPlaceHolderParent, templateHolder);
        }

        return template;
    };

    var _MouseDownButtons;
    var _MouseOverButtons = [];
    function JssorButtonEx(elmt, optimizeForIe6) {
        var _Self = this;

        var _OriginClassName;

        var _IsMouseDown;   //class name 'dn'
        var _IsActive;      //class name 'av'

        //Optimization for IE Quirks
        var _IsHover;       //class name 'hv'

        function Highlight() {
            var className = _OriginClassName;

            if (_IsMouseDown) {
                className += 'dn';
            }
            else if (_IsHover) {
                className += 'hv';
            }
            else if (_IsActive) {
                className += "av";
            }

            $JssorUtils$.$SetClassName(elmt, className);
        }

        function OnMouseOver(event) {
            _IsHover = true;

            Highlight();
        }

        function OnMouseOut(event) {
            _IsHover = false;

            Highlight();
        }

        function OnMouseDown(event) {
            _MouseDownButtons.push(_Self);

            _IsMouseDown = true;

            Highlight();
        }

        _Self.$MouseUp = function () {
            ///	<summary>
            ///		Internal member function, do not use it.
            ///	</summary>
            ///	<private />

            _IsMouseDown = false;

            Highlight();
        };

        _Self.$Activate = function (activate) {
            _IsActive = activate;

            Highlight();
        };

        //JssorButtonEx Constructor
        {
            elmt = self.$GetElement(elmt);

            if (!_MouseDownButtons) {
                self.$AddEventBrowserMouseUp(function () {
                    var oldMouseDownButtons = _MouseDownButtons;
                    _MouseDownButtons = [];

                    each(oldMouseDownButtons, function (button) {
                        button.$MouseUp();
                    });
                });

                _MouseDownButtons = [];
            }

            _OriginClassName = self.$GetClassName(elmt);

            $JssorUtils$.$AddEvent(elmt, "mousedown", OnMouseDown);

            if (optimizeForIe6 && IsBrowserIE() && browserRuntimeVersion < 7) {
                $JssorUtils$.$AddEvent(elmt, "mouseover", OnMouseOver);
                $JssorUtils$.$AddEvent(elmt, "mouseout", OnMouseOut);
            }
        }
    }

    self.$Buttonize = function (elmt, optimizeForIe6) {
        return new JssorButtonEx(elmt, optimizeForIe6);
    };

    var StyleGetter = {
        $Opacity: self.$GetStyleOpacity,
        $Top: self.$GetStyleTop,
        $Left: self.$GetStyleLeft,
        $Width: self.$GetStyleWidth,
        $Height: self.$GetStyleHeight,
        $Position: self.$GetStylePosition,
        $Display: self.$GetStyleDisplay
    };

    //For Compression Only
    var _StyleSetterReserved;
    function GetStyleSetter() {
        if (!_StyleSetterReserved) {
            _StyleSetterReserved = {
                $Opacity: self.$SetStyleOpacity,
                $Top: self.$SetStyleTop,
                $Left: self.$SetStyleLeft,
                $Width: self.$SetStyleWidth,
                $Height: self.$SetStyleHeight,
                $Display: self.$SetStyleDisplay,
                $Clip: self.$SetStyleClip,
                $MarginLeft: self.$SetStyleMarginLeft,
                $MarginTop: self.$SetStyleMarginTop,
                $Transform: self.$SetStyleTransform,
                $Position: self.$SetStylePosition
            };

            _StyleSetterReserved.$Opacity = _StyleSetterReserved.$Opacity;
            _StyleSetterReserved.$Top = _StyleSetterReserved.$Top;
            _StyleSetterReserved.$Left = _StyleSetterReserved.$Left;
            _StyleSetterReserved.$Width = _StyleSetterReserved.$Width;
            _StyleSetterReserved.$Height = _StyleSetterReserved.$Height;
            _StyleSetterReserved.$Display = _StyleSetterReserved.$Display;
            _StyleSetterReserved.$Clip = _StyleSetterReserved.$Clip;
        }
        return _StyleSetterReserved;
    }

    function GetStyleSetterEx() {
        GetStyleSetter();

        _StyleSetterReserved.$MarginLeft = _StyleSetterReserved.$MarginLeft;
        _StyleSetterReserved.$MarginTop = _StyleSetterReserved.$MarginTop;
        _StyleSetterReserved.$Transform = _StyleSetterReserved.$Transform;

        return _StyleSetterReserved;
    }

    self.$GetStyleSetterEx = GetStyleSetterEx;

    self.$GetStyles = function (elmt, originStyles) {
        GetStyleSetter();

        var styles = {};

        each(originStyles, function (value, key) {
            if (StyleGetter[key]) {
                styles[key] = StyleGetter[key](elmt);
            }
        });

        return styles;
    };

    self.$SetStyles = function (elmt, styles) {
        var styleSetter = GetStyleSetter();

        each(styles, function (value, key) {
            styleSetter[key] && styleSetter[key](elmt, value);
        });
    };

    self.$SetStylesEx = function (elmt, styles) {
        GetStyleSetterEx();

        self.$SetStyles(elmt, styles);
    };

    $JssorMatrix$ = new function () {
        var _This = this;

        function Multiply(ma, mb) {
            var acs = ma[0].length;
            var rows = ma.length;
            var cols = mb[0].length;

            var matrix = [];

            for (var r = 0; r < rows; r++) {
                var row = matrix[r] = [];
                for (var c = 0; c < cols; c++) {
                    var unitValue = 0;

                    for (var ac = 0; ac < acs; ac++) {
                        unitValue += ma[r][ac] * mb[ac][c];
                    }

                    row[c] = unitValue;
                }
            }

            return matrix;
        }

        _This.$ScaleX = function (matrix, sx) {
            return _This.$ScaleXY(matrix, sx, 0);
        };

        _This.$ScaleY = function (matrix, sy) {
            return _This.$ScaleXY(matrix, 0, sy);
        };

        _This.$ScaleXY = function (matrix, sx, sy) {
            return Multiply(matrix, [[sx, 0], [0, sy]]);
        };

        _This.$TransformPoint = function (matrix, p) {
            var pMatrix = Multiply(matrix, [[p.x], [p.y]]);

            return new $JssorPoint$(pMatrix[0][0], pMatrix[1][0]);
        };
    };

    self.$CreateMatrix = function (alpha, scaleX, scaleY) {
        var cos = Math.cos(alpha);
        var sin = Math.sin(alpha);
        //var r11 = cos;
        //var r21 = sin;
        //var r12 = -sin;
        //var r22 = cos;

        //var m11 = cos * scaleX;
        //var m12 = -sin * scaleY;
        //var m21 = sin * scaleX;
        //var m22 = cos * scaleY;

        return [[cos * scaleX, -sin * scaleY], [sin * scaleX, cos * scaleY]];
    };

    self.$GetMatrixOffset = function (matrix, width, height) {
        var p1 = $JssorMatrix$.$TransformPoint(matrix, new $JssorPoint$(-width / 2, -height / 2));
        var p2 = $JssorMatrix$.$TransformPoint(matrix, new $JssorPoint$(width / 2, -height / 2));
        var p3 = $JssorMatrix$.$TransformPoint(matrix, new $JssorPoint$(width / 2, height / 2));
        var p4 = $JssorMatrix$.$TransformPoint(matrix, new $JssorPoint$(-width / 2, height / 2));

        return new $JssorPoint$(Math.min(Math.min(Math.min(p1.x, p2.x), p3.x), p4.x) + width / 2, Math.min(Math.min(Math.min(p1.y, p2.y), p3.y), p4.y) + height / 2);
    };

    $JssorAnimator$ = function (delay, duration, options, elmt, fromStyles, toStyles) {
        var _This = this;
        var _AutoPlay;
        var _Hiden;
        var _CombineMode;
        var _PlayToPosition;
        var _PlayDirection;
        var _NoStop;
        var _TimeStampLastFrame = 0;

        var _SubEasings;
        var _SubRounds;
        var _SubDurings;
        var _Callback;

        var _Position_Current = 0;
        var _Position_Display = 0;
        var _Position_Current_Ready;

        var _Position_InnerBegin = delay;
        var _Position_InnerEnd = delay + duration;
        var _Position_OuterBegin;
        var _Position_OuterEnd;
        var _LoopLength;

        var _NestedAnimators = [];
        var _StyleSetter;

        function IsInRangeInner(position) {
            return position >= _Position_InnerBegin && position <= _Position_InnerEnd;
        }

        function IsInRangeOuter(position) {
            return position >= _Position_OuterBegin && position <= _Position_OuterEnd;
        }

        function Shift(offset) {
            _Position_OuterBegin += offset;
            _Position_OuterEnd += offset;
            _Position_InnerBegin += offset;
            _Position_InnerEnd += offset;

            each(_NestedAnimators, function (animator) {
                animator, animator.$Shift(offset);
            });
        }

        function Locate(position, relative) {
            var offset = position - _Position_OuterBegin + delay * relative;

            Shift(offset);

            //$JssorDebug$.$Execute(function () {
            //    _This.$Position_InnerBegin = _Position_InnerBegin;
            //    _This.$Position_InnerEnd = _Position_InnerEnd;
            //    _This.$Position_OuterBegin = _Position_OuterBegin;
            //    _This.$Position_OuterEnd = _Position_OuterEnd;
            //});

            return _Position_OuterEnd;
        }

        function GoToPosition(positionOuter) {
            var trimedPositionOuter = positionOuter;

            if (_LoopLength && (trimedPositionOuter >= _Position_OuterEnd || trimedPositionOuter <= _Position_OuterBegin)) {
                trimedPositionOuter = ((trimedPositionOuter - _Position_OuterBegin) % _LoopLength + _LoopLength) % _LoopLength + _Position_OuterBegin;
            }

            //if (options.$HideAtStart) {
            //    if (trimedPositionOuter <= _Position_InnerBegin && !_Hiden) {
            //        $JssorUtils$.$HideElement(elmt);
            //        _Hiden = true;
            //    }
            //    else if (trimedPositionOuter > _Position_InnerBegin && _Hiden) {
            //        $JssorUtils$.$ShowElement(elmt);
            //        _Hiden = false;
            //    }
            //}

            $JssorDebug$.$Execute(function () {
                if (options.$CaptionAnimator) {
                    var a = 0;
                }
            });

            if (_Position_Current != trimedPositionOuter || !_Position_Current_Ready || _NoStop) {

                var positionToDisplay = Math.min(trimedPositionOuter, _Position_OuterEnd);
                positionToDisplay = Math.max(positionToDisplay, _Position_OuterBegin);

                if (IsInRangeInner(positionToDisplay) || IsInRangeInner(_Position_Current)) {
                    if (toStyles) {
                        var interPosition = (positionToDisplay - _Position_InnerBegin) / duration;
                        var currentStyles = {};

                        for (var key in toStyles) {
                            var round = _SubRounds[key] || 1;
                            var during = _SubDurings[key] || [0, 1];
                            var propertyInterPosition = (interPosition - during[0]) / during[1];
                            propertyInterPosition = Math.min(Math.max(propertyInterPosition, 0), 1);
                            propertyInterPosition = propertyInterPosition * round;
                            var floorPosition = Math.floor(propertyInterPosition);
                            if (propertyInterPosition != floorPosition)
                                propertyInterPosition -= floorPosition;

                            var easing = _SubEasings[key] || _SubEasings.$Default;
                            var easingValue = easing(propertyInterPosition);
                            var currentPropertyValue;
                            var value = fromStyles[key];
                            var toValue = toStyles[key];

                            if ($JssorUtils$.$IsNumeric(toValue)) {
                                currentPropertyValue = value + (toValue - value) * easingValue;
                            }
                            else {
                                currentPropertyValue = self.$Extend({ $Offset: {} }, fromStyles[key]);

                                each(toValue.$Offset, function (rectX, n) {
                                    var offsetValue = rectX * easingValue;
                                    currentPropertyValue.$Offset[n] = offsetValue;
                                    currentPropertyValue[n] += offsetValue;
                                });
                            }
                            currentStyles[key] = currentPropertyValue;
                        }

                        if (fromStyles.$Zoom) {
                            currentStyles.$Transform = { $Rotate: currentStyles.$Rotate || 0, $Scale: currentStyles.$Zoom, $OriginalWidth: options.$OriginalWidth, $OriginalHeight: options.$OriginalHeight };
                        }
                        if (toStyles.$Clip && options.$Move) {
                            var styleFrameNClipOffset = currentStyles.$Clip.$Offset;

                            var offsetY = (styleFrameNClipOffset.$Top || 0) + (styleFrameNClipOffset.$Bottom || 0);
                            var offsetX = (styleFrameNClipOffset.$Left || 0) + (styleFrameNClipOffset.$Right || 0);

                            currentStyles.$Left = (currentStyles.$Left || 0) + offsetX;
                            currentStyles.$Top = (currentStyles.$Top || 0) + offsetY;
                            currentStyles.$Clip.$Left -= offsetX;
                            currentStyles.$Clip.$Right -= offsetX;
                            currentStyles.$Clip.$Top -= offsetY;
                            currentStyles.$Clip.$Bottom -= offsetY;
                        }

                        each(currentStyles, function (value, key) {
                            _StyleSetter[key] && _StyleSetter[key](elmt, value);
                        });
                    }

                    _This.$OnInnerOffsetChange(_Position_Display - _Position_InnerBegin, positionToDisplay - _Position_InnerBegin);
                }

                _Position_Display = positionToDisplay;

                $JssorUtils$.$Each(_NestedAnimators, function (animator) {
                    animator.$GoToPosition(positionToDisplay);
                });

                var positionOld = _Position_Current;
                var positionNew = positionOuter;

                _Position_Current = positionOuter;
                _Position_Current_Ready = true;

                _This.$OnPositionChange(positionOld, positionNew);
            }
        }

        function Join(animator, combineMode) {
            ///	<summary>
            ///		Combine another animator as nested animator
            ///	</summary>
            ///	<param name="animator" type="$JssorAnimator$">
            ///		An instance of $JssorAnimator$
            ///	</param>
            ///	<param name="combineMode" type="int">
            ///		0: parallel - place the animator parallel to this animator.
            ///		1: chain - chain the animator at the _Position_InnerEnd of this animator.
            ///	</param>
            $JssorDebug$.$Execute(function () {
                if (combineMode !== 0 && combineMode !== 1)
                    $JssorDebug$.$Fail("Argument out of range, the value of 'combineMode' should be either 0 or 1.");
            });

            _Position_OuterEnd = Math.max(_Position_OuterEnd, animator.$Locate(_Position_OuterEnd * combineMode, 1));
            _NestedAnimators.push(animator);
        }

        function PlayFrame() {
            if (_AutoPlay) {
                var now = self.$GetNow();
                var timeOffset = Math.min(now - _TimeStampLastFrame, 80);
                var timePosition = _Position_Current + timeOffset * _PlayDirection;
                _TimeStampLastFrame = now;

                if (timePosition * _PlayDirection >= _PlayToPosition * _PlayDirection)
                    timePosition = _PlayToPosition;

                GoToPosition(timePosition);

                if (!_NoStop && timePosition * _PlayDirection >= _PlayToPosition * _PlayDirection) {
                    Stop(_Callback);
                }
                else {
                    Delay(PlayFrame, options.$Interval);
                }
            }
        }

        function PlayToPosition(toPosition, callback, noStop) {
            if (!_AutoPlay) {
                _AutoPlay = true;
                _NoStop = noStop
                _Callback = callback;
                toPosition = Math.max(toPosition, _Position_OuterBegin);
                toPosition = Math.min(toPosition, _Position_OuterEnd);
                _PlayToPosition = toPosition;
                _PlayDirection = _PlayToPosition < _Position_Current ? -1 : 1;
                _This.$OnStart();
                _TimeStampLastFrame = self.$GetNow();
                PlayFrame();
            }
        }

        function Stop(callback) {
            if (_AutoPlay) {
                _NoStop = _AutoPlay = false;
                _This.$OnStop();

                if (callback)
                    callback();
            }
        }

        _This.$Play = function (positionLength, callback, noStop) {
            PlayToPosition(positionLength ? _Position_Current + positionLength : _Position_OuterEnd, callback, noStop);
        };

        _This.$PlayToPosition = function (position, callback, noStop) {
            PlayToPosition(position, callback, noStop);
        };

        _This.$PlayToBegin = function (callback, noStop) {
            PlayToPosition(_Position_OuterBegin, callback, noStop);
        };

        _This.$PlayToEnd = function (callback, noStop) {
            PlayToPosition(_Position_OuterEnd, callback, noStop);
        };

        _This.$Stop = function () {
            Stop();
        };

        _This.$Continue = function (toPosition) {
            PlayToPosition(toPosition);
        };

        _This.$GetPosition = function () {
            return _Position_Current;
        };

        _This.$GetPlayToPosition = function () {
            return _PlayToPosition;
        };

        _This.$GetPosition_Display = function () {
            return _Position_Display;
        };

        _This.$GoToPosition = GoToPosition;

        _This.$GoToBegin = function () {
            GoToPosition(_Position_OuterBegin);
        };

        _This.$GoToEnd = function () {
            GoToPosition(_Position_OuterEnd);
        };

        _This.$Move = function (offset) {
            GoToPosition(_Position_Current + offset);
        };

        _This.$CombineMode = function () {
            return _CombineMode;
        };

        _This.$GetDuration = function () {
            return duration;
        };

        _This.$IsPlaying = function () {
            return _AutoPlay;
        };

        _This.$SetLoopLength = function (length) {
            _LoopLength = length;
        };

        _This.$Locate = Locate;

        _This.$Shift = Shift;

        _This.$Join = Join;

        _This.$Combine = function (animator) {
            ///	<summary>
            ///		Combine another animator parallel to this animator
            ///	</summary>
            ///	<param name="animator" type="$JssorAnimator$">
            ///		An instance of $JssorAnimator$
            ///	</param>
            Join(animator, 0);
        };

        _This.$Chain = function (animator) {
            ///	<summary>
            ///		Chain another animator at the _Position_InnerEnd of this animator
            ///	</summary>
            ///	<param name="animator" type="$JssorAnimator$">
            ///		An instance of $JssorAnimator$
            ///	</param>
            Join(animator, 1);
        };

        _This.$GetPosition_InnerBegin = function () {
            ///	<summary>
            ///		Internal member function, do not use it.
            ///	</summary>
            ///	<private />
            ///	<returns type="int" />
            return _Position_InnerBegin;
        };

        _This.$GetPosition_InnerEnd = function () {
            ///	<summary>
            ///		Internal member function, do not use it.
            ///	</summary>
            ///	<private />
            ///	<returns type="int" />
            return _Position_InnerEnd;
        };

        _This.$GetPosition_OuterBegin = function () {
            ///	<summary>
            ///		Internal member function, do not use it.
            ///	</summary>
            ///	<private />
            ///	<returns type="int" />
            return _Position_OuterBegin;
        };

        _This.$GetPosition_OuterEnd = function () {
            ///	<summary>
            ///		Internal member function, do not use it.
            ///	</summary>
            ///	<private />
            ///	<returns type="int" />
            return _Position_OuterEnd;
        };

        _This.$OnPositionChange = self.$EmptyFunction;
        _This.$OnStart = self.$EmptyFunction;
        _This.$OnStop = self.$EmptyFunction;
        _This.$OnInnerOffsetChange = self.$EmptyFunction;

        //Constructor`  1
        {
            options = $JssorUtils$.$Extend({
                $Interval: 10
            }, options);

            //Sodo statement, for development time intelligence only
            $JssorDebug$.$Execute(function () {
                options = $JssorUtils$.$Extend({
                    $HideAtStart: undefined,
                    $LoopLength: undefined,
                    $Setter: undefined,
                    $Easing: undefined
                }, options);
            });

            _LoopLength = options.$LoopLength;

            _StyleSetter = self.$Extend({}, GetStyleSetter(), options.$Setter);

            _Position_OuterBegin = _Position_InnerBegin = delay;
            _Position_OuterEnd = _Position_InnerEnd = delay + duration;

            var _SubRounds = options.$Round || {};
            var _SubDurings = options.$During || {};
            _SubEasings = $JssorUtils$.$Extend({ $Default: $JssorUtils$.$IsFunction(options.$Easing) && options.$Easing || $JssorEasing$.$EaseSwing }, options.$Easing);
        }
    }
};