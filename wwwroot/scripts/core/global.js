/// Websilk Platform : global.js ///

//global variables
var scrollbarW = 0;
var winPosChange = true;
var winPosVal = null;

//special functions
function $R(id) {
    return document.getElementById(id);
}

function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}
function ltrim(stringToTrim) {
    return stringToTrim.replace(/^\s+/, "");
}
function rtrim(stringToTrim) {
    return stringToTrim.replace(/\s+$/, "");
}

function left(str, n) {
    if (n <= 0) {
        return "";
    } else if (n > String(str).length) {
        return str;
    } else {
        return String(str).substring(0, n);
    }
}
function right(str, n) {
    if (n <= 0) {
        return "";
    } else if (n > String(str).length) {
        return str;
    } else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isValidText(sText, ValidChars, extraChars) {

    var valchar = '';
    valchar = ValidChars;
    if (valchar == '') { valchar = '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    valchar += extraChars;
    var Char = '';
    for (i = 0; i < sText.length; i++) {
        Char = sText.charAt(i);
        if (valchar.indexOf(Char) == -1) {
            return false;
        }
    }
    return true;
}

function getElementFromEvent(event) {
    var obj = new Object();
    if (R.browser.isIE) {
        obj = window.event.srcElement;
    }
    if (R.browser.isNS) {
        obj = event.target;
    }
    return obj;
}

function windowPos() {
    if (winPosChange == false) { return winPosVal; } else {
        winPosChange = false;
        //cross-browser compatible window dimensions
        var scrollx = 0;
        var scrolly = 0;
        var w = 0;
        var h = 0;
        scrollx = window.scrollX;
        scrolly = window.scrollY;
        if (typeof scrollx == 'undefined') {
            scrollx = document.body.scrollLeft;
            scrolly = document.body.scrollTop;
            if (typeof scrollx == 'undefined') {
                scrollx = window.pageXOffset;
                scrolly = window.pageYOffset;
                if (typeof scrollx == 'undefined') {
                    z = GetZoomFactor();
                    scrollx = Math.round(document.documentElement.scrollLeft / z);
                    scrolly = Math.round(document.documentElement.scrollTop / z);
                }
            }
        }
        if (arguments[0] == 1) { return winPosVal; }

        if (document.documentElement) {
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        }
        if (R.browser.isNS) {
            w = window.innerWidth;
            h = window.innerHeight;
        }

        winPosVal = { scrollx: scrollx, scrolly: scrolly, w: w, h: h };
        return winPosVal;
    }
}

function mousePos(event) {
    //cross-broswer compatible mouse X & Y position
    var x = 0;
    var y = 0;
    if (R.browser.isIE) {
        x = window.event.clientX;
        y = window.event.clientY;
    }
    if (R.browser.isNS) {
        x = event.clientX;
        y = event.clientY;
    }
    return { x: x, y: y };
}

function elementPos(elem) {
    //cross-browser compatible element x & y position & width & height
    var x = 0, y = 0, w = 0, h = 0, myelem = elem;
    if (typeof elem != 'undefined' && elem != null) {
        while (elem.offsetParent) {
            x += elem.offsetLeft + (elem.clientLeft || 0);
            y += elem.offsetTop + (elem.clientTop || 0);
            elem = elem.offsetParent;
        }
        w = myelem.offsetWidth ? myelem.offsetWidth : myelem.clientWidth;
        h = myelem.offsetHeight ? myelem.offsetHeight : myelem.clientHeight;
        if (h == 0) { if (typeof $ != 'undefined') { h = $(myelem).height(); } }
    }
    return { x: x, y: y, w: w, h: h };
}

function offsetPos(myelem) {
    return {
        y: myelem.offsetTop ? myelem.offsetTop : myelem.clientTop,
        x: myelem.offsetLeft ? myelem.offsetLeft : myelem.clientLeft,
        w: myelem.offsetWidth ? myelem.offsetWidth : myelem.clientWidth,
        h: myelem.offsetHeight ? myelem.offsetHeight : myelem.clientHeight
    }
}

function GetZoomFactor() {
    var factor = 1;
    if (document.body.getBoundingClientRect) {
        // rect is only in physical pixel size in IE before version 8 
        var rect = document.body.getBoundingClientRect();
        var physicalW = rect.right - rect.left;
        var logicalW = document.body.offsetWidth;

        // the zoom level is always an integer percent value
        factor = Math.round((physicalW / logicalW) * 100) / 100;
    }
    return factor;
}

function centerElement(elementId) {
    var myElem = $R(elementId);
    if (myElem) {
        var winPos = windowPos();
        var ePos = elementPos(myElem);
        myElem.style.left = ((winPos.w / 2) - (ePos.w / 2) + winPos.scrollx) + "px";
        myElem.style.top = ((winPos.h / 2) - (ePos.h / 2) + winPos.scrolly) + "px";
    }
}

function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) {
        num = "0";
    }
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10) {
        cents = "0" + cents;
    }
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}

function htmlEncode(txt) {
    var r = txt;
    r = Replace(/\&/g, "&amp;");
    r = Replace(/\</g, "&lt;");
    r = Replace(/\>/g, "&gt;");

    return r;
}

function htmlDecode(txt) {
    var r = txt;
    r = Replace(/'&amp;'/g, "&");
    r = Replace(/'&lt;'/g, "<");
    r = Replace(/'&gt;'/g, ">");
    return r;

}

function rgb2hex(rgb) {
    if (rgb == null || rgb == undefined || rgb == '') { return ''; }
    if (rgb.indexOf("#") > -1) { return rgb; }
    if (rgb.indexOf("rgb") == -1) { return "#" + rgb; }
    var r = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (r == null) { r = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/); }
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(r[1]) + hex(r[2]) + hex(r[3]);
}

function hex2rgb(hex, opacity) {
    var rgb = hex.replace('#', '').match(/(.{2})/g);

    var i = 3;
    while (i--) {
        rgb[i] = parseInt(rgb[i], 16);
    }

    if (typeof opacity == 'undefined') {
        return 'rgb(' + rgb.join(', ') + ')';
    }

    return 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
};

function getScrollBarWidth() {
    if (scrollbarW != 0) { return scrollbarW; }
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);
    scrollbarW = w1 - w2;
    if (scrollbarW < 10) { scrollbarW = 25; }
    return (scrollbarW);
};

