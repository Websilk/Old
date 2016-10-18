/// Websilk Platform : global.js ///

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

