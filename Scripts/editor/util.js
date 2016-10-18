S.util.str = {
    Capitalize: function (str) {
        return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    },

    isAlphaNumeric: function (str, spaces, exchars) {
        var ex = [], chr, sub, err = false;
        if (exchars) { if (exchars.length > 0) { ex = exchars.split(''); } }
        for (x = 0; x < str.length; x++) {
            sub = str.substr(x, 1);
            chr = str.charCodeAt(x);
            //groups of characters
            if (chr >= 0 && chr <= 47) { err = true; }
            if (chr >= 58 && chr <= 64) { err = true; }
            if (chr >= 91 && chr <= 96) { err = true; }
            if (chr >= 123) { err = true; }

            //spaces
            if (spaces == true) { if (sub == ' ') { err = false; } }

            //exempt characters
            for (y = 0; y < ex.length; y++) {
                if (ex[y] == sub) { err = false; break; }
            }
        }
        return err;
    },

    hasCurseWords: function (str, include) {
        var words = ['fuck', 'cunt', 'nigger', 'pussy', 'asshole', 'bitch', 'whore', 'slut'];
        if (include) { if (include.length > 0) { words.concat(include); } }
        for (x = 0; x < words.length; x++) {
            if (str.indexOf(words[x]) > -1) { return true; }
        }
        return false;
    }
}

S.util.file = {
    extension: function (filename) {
        return filename.substr(filename.lastIndexOf('.') + 1);
    }
}

S.util.array = {
    indexOfPartialString: function (arr, str) {
        for (x = 0; x < arr.length; x++) {
            if (arr[x].indexOf(str) > -1) { return x; }
        }
        return -1;
    }
}

S.util.message = {
    show: function (div, msg, time) {
        $(div).css({ opacity: 0, height: 'auto' }).show().html(msg);
        var h = S.elem.height($(div)[0]);
        if (arguments.length < 3) { time = 10; }
        $(div).css({ height: 0, overflow: 'hidden' }).stop().animate({ height: h, opacity: 1 }, 1000).delay(time * 1000).animate({ opacity: 0, height: 0 }, 1000, function () { $(this).hide(); });
    }
}

S.util.css = {
    objects: function (a) {
        var sheets = document.styleSheets, o = {};
        for (var i in sheets) {
            var rules = sheets[i].rules || sheets[i].cssRules;
            for (var r in rules) {
                if (a.is(rules[r].selectorText)) {
                    o = $.extend(o,
                        S.util.css.convert(rules[r].style),
                        S.util.css.convert(a.attr('style')
                        ));
                }
            }
        }
        return o;
    },

    convert: function (css) {
        var s = {};
        if (!css) return s;
        if (css instanceof CSSStyleDeclaration) {
            for (var i in css) {
                if ((css[i]).toLowerCase) {
                    s[(css[i]).toLowerCase()] = (css[css[i]]);
                }
            }
        } else if (typeof css == "string") {
            css = css.split("; ");
            for (var i in css) {
                var l = css[i].split(": ");
                s[l[0].toLowerCase()] = (l[1]);
            };
        }
        return s;
    }
}

S.util.scrollIntoView = function (elem) {
    //only scrolls if the element is out of view
    var h = S.editor.toolbar.height;
    var pos = S.elem.pos(elem);
    var options = { offset: -100 }
    if (arguments[1] != null) {
        var arg = arguments[1];
        if (arg.offset != null) { options.offset = arg.offset; }
    }
    if (pos.y < S.window.scrolly - h || pos.y + pos.h > S.window.h + S.window.scrolly + 10) {
        $(document.body).scrollTo($(elem), options);
    }
}