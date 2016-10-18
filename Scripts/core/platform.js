/// Websilk Platform : view.js ///
/// <reference path="global.js" />
var S = {
    init: function (ajax, viewstateid, title) {
        S.page.useAjax = ajax;
        S.ajax.viewstateId = viewstateid;
        S.viewport.getLevel();
    },

    window: {
        w: 0, h: 0, scrollx: 0, scrolly: 0, z: 0, changed: true,

        pos: function () {
            if (this.changed == false && arguments[0] == null) { return this; } else {
                this.changed = false;
                //cross-browser compatible window dimensions
                var w = window,
                d = document,
                e = d.documentElement,
                b = d.body;
                this.scrollx = w.scrollX;
                this.scrolly = w.scrollY;
                if (typeof this.scrollx == 'undefined') {
                    this.scrollx = b.scrollLeft;
                    this.scrolly = b.scrollTop;
                    if (typeof this.scrollx == 'undefined') {
                        this.scrollx = w.pageXOffset;
                        this.scrolly = w.pageYOffset;
                        if (typeof this.scrollx == 'undefined') {
                            this.z = GetZoomFactor();
                            this.scrollx = Math.round(e.scrollLeft / this.z);
                            this.scrolly = Math.round(e.scrollTop / this.z);
                        }
                    }
                }
                if (arguments[0] == 1) { return this; }
                this.w = w.innerWidth || e.clientWidth || b.clientWidth;
                this.h = w.innerHeight || e.clientHeight || b.clientHeight;
                return this;
            }
        }

    },

    viewport: {
        speed: 0, isChanging: false,
        levels: [350, 700, 1024, 1440, 9999], level: -1, sizeIndex: -1,
        levelNames: ['cell', 'mobile', 'tablet', 'desktop', 'hd'],

        getLevel: function () {
            var w = $('.webpage').width();
            for (x = 0; x < S.viewport.levels.length; x++) {
                if (w <= S.viewport.levels[x]) {
                    var changed = false;
                    if (S.viewport.level != x) { changed = true; }
                    S.viewport.level = x;
                    if (changed == true) {
                        var wp = $(document.body);
                        var size = S.viewport.levelNames[x];
                        if (wp.hasClass(size) == false) { wp.removeClass('s-cell s-mobile s-tablet s-desktop s-hd').addClass('s-' + size); }
                    }
                    return changed;
                }
            }
        }
    },

    elem: {
        get: function (id) {
            return document.getElementById(id);
        },

        pos: function (elem) {
            var x = 0, y = 0, w = 0, h = 0;
            if (typeof elem != 'undefined' && elem != null) {
                var e = elem;
                while (e.offsetParent) {
                    x += e.offsetLeft + (e.clientLeft || 0);
                    y += e.offsetTop + (e.clientTop || 0);
                    e = e.offsetParent;
                }
                w = elem.offsetWidth ? elem.offsetWidth : elem.clientWidth;
                h = elem.offsetHeight ? elem.offsetHeight : elem.clientHeight;
                if (h == 0) { h = $(elem).height(); }
            }
            return { x: x, y: y, w: w, h: h };
        },

        innerPos: function (elem) {
            var p = this.pos(elem);
            var e = $(elem);
            p.w = e.width();
            p.h = e.height();
            return p;
        },

        offset: function (elem) {
            return {
                y: elem.offsetTop ? elem.offsetTop : elem.clientTop,
                x: elem.offsetLeft ? elem.offsetLeft : elem.clientLeft,
                w: elem.offsetWidth ? elem.offsetWidth : elem.clientWidth,
                h: elem.offsetHeight ? elem.offsetHeight : elem.clientHeight
            }
        },

        top: function (elem) {
            return elem.offsetTop ? elem.offsetTop : elem.clientTop;
        },

        width: function (elem) {
            return elem.offsetWidth ? elem.offsetWidth : elem.clientWidth;
        },

        height: function (elem) {
            return elem.offsetHeight ? elem.offsetHeight : elem.clientHeight;
        },

        fromEvent: function (event) {
            if (S.browser.isIE) {
                return window.event.srcElement;
            } else if (S.browser.isNS) { return event.target; }
            return null;
        },

        panel: function (elem) {
            var p = $(elem).parents('.ispanel');
            if (p.length > 0) { return p[0]; }
            return null;
        },

        panelCell: function (inner) {
            //get panel from inner-panel (cell)
            var cls = inner.className.split(' ');
            var parentId = "";
            for (i = 0; i < cls.length; i++) {
                if (cls[i].indexOf('innerpanel') == 0) {
                    parentId = 'panel' + cls[i].replace('innerpanel', '');
                    if ($('#' + parentId).hasClass('istheme') == true) { return null; }
                    return $S(parentId);
                }
            }
        },

        isInnerPanel(elem) {
            if (!elem.className) { return false; }
            if (elem.className.toString().indexOf('inner-panel') >= 0) { return true; }
            return false;
        }

    },

    css: {
        add: function (id, css) {
            $('#css' + id).remove();
            $('head').append('<style id="css' + id + '" type="text/css">' + css + "</style>");
        },

        remove: function (id) {
            $('head').remove('#css' + id);
        }
    },

    website: {
        id: 0, title: ''
    },

    page: {
        id: 0, title: '', useAjax: false,
    },

    layers: {
        cache: new Array(),

        add: function (pageId, title, pageType) {
            for (x = 0; x < this.cache.length; x++) {
                if (this.cache[x].pageId == pageId) {
                    this.cache[x] = { pageId: pageId, title: title, pageType: pageType };
                    return;
                }
            }
            this.cache.push({ pageId: pageId, title: title, pageType: pageType });
        }
    },

    panels: {
        items: [{ p: null, x: 0, y: 0, w: 0, h: 0 }],

        get: function () {
            if (this.items.length == 0) {
                var p = S.selectors.cache[7], pos;
                for (x = 0; x < p.length; x++) {
                    pos = S.elem.offset(p[x]);
                    this.items[p[x].id] = { p: p[x], x: pos.x, y: pos.y, w: pos.w, h: pos.h };
                }
            }
            return this.items;
        }
    },

    components: {
        cache: new Array(), calls: {}, //calls contain custom functions used by components

        add: function (id, type, position, css, label, limit, duplicate) {
            if (id == null || id == '') { return; }
            if (typeof this.cache['c' + id] == 'undefined') { this.cache.length++; }
            var pos = position || '', cs = css || '';
            if (pos == '') { pos = '||||'; }
            if (css == '') { css = '||||'; }
            this.cache['c' + id] = { id: id, type: type, position: pos.split('|'), css: cs.split('|'), label: label, limit: limit || 0, duplicate: duplicate || null };
        },

        cleanup: function () {
            var keep, z;
            for (x in this.cache) {
                keep = false; z = -1
                if ($S('c' + this.cache[x].id) != null) { keep = true; }
                if (keep == false) {
                    z = this.cache.indexOf(x);
                    if (z > -1) { this.cache.splice(z, 1); }
                    //remove unwanted CSS

                }
            }
        }
    },

    panel: {
        coordinates: new Array()
    },

    editor: {
        selectedLayerId: '', editMode: false, enabled: false
    },

    browser: {
        isIE: false, isNS: false, version: null,

        get: function () {
            var ua, s, i;
            ua = navigator.userAgent;
            s = "MSIE";
            if ((i = ua.indexOf(s)) >= 0) {
                this.isIE = true;
                this.version = parseFloat(ua.substr(i + s.length));
                return;
            }

            s = "Netscape6/";
            if ((i = ua.indexOf(s)) >= 0) {
                this.isNS = true;
                this.version = parseFloat(ua.substr(i + s.length));
                return;
            }

            // Treat any other "Gecko" browser as NS 6.1.

            s = "Gecko";
            if ((i = ua.indexOf(s)) >= 0) {
                this.isNS = true;
                this.version = 6.1;
                return;
            }
        }
    },

    elements: {
        textbox: {
            focus: function (elem) {
                $(elem.parentNode).addClass('active').find('input:nth-child(1)').focus();

            },

            blur: function (elem) {
                if (elem.value == '') {
                    $(elem.parentNode).removeClass('active');
                }
            }
        }
    },

    lostSession: function () {
        alert('Your session has been lost. The page will now reload');
        location.reload();
    }
}
