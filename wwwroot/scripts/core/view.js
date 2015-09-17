/// Websilk Platform : view.js ///
/// <reference path="global.js" />
var S = {
    init: function (ajax, viewstateid, title) {
        S.page.useAjax = ajax;
        S.ajax.viewstateId = viewstateid;
        S.viewport.getLevel();
    },

    window: {
        w: 0, h: 0, scrollx: 0, scrolly: 0, z: 0, absolute: { w: 0, h: 0 }, changed: true,

        pos: function () {
            if (this.changed == false && arguments[0] == null) { return this; } else {
                this.changed = false;
                //cross-browser compatible window dimensions
                this.scrollx = window.scrollX;
                this.scrolly = window.scrollY;
                if (typeof this.scrollx == 'undefined') {
                    this.scrollx = document.body.scrollLeft;
                    this.scrolly = document.body.scrollTop;
                    if (typeof this.scrollx == 'undefined') {
                        this.scrollx = window.pageXOffset;
                        this.scrolly = window.pageYOffset;
                        if (typeof this.scrollx == 'undefined') {
                            this.z = GetZoomFactor();
                            this.scrollx = Math.round(document.documentElement.scrollLeft / this.z);
                            this.scrolly = Math.round(document.documentElement.scrollTop / this.z);
                        }
                    }
                }
                if (arguments[0] == 1) { return this; }

                if (document.documentElement) {
                    this.w = document.documentElement.clientWidth;
                    this.h = document.documentElement.clientHeight;
                }
                if (S.browser.isNS) {
                    this.w = window.innerWidth;
                    this.h = window.innerHeight;
                }

                var bod = $('.body')[0];
                if (bod != null) {
                    this.absolute.w = S.elem.width(bod);
                    this.absolute.h = this.h;
                }
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

        bg: {
            YTPlayer: {
                destroy: function () {
                    $('#wrapper_mbYTP_updateBackground').hide();
                }
            }
        },
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
        cache: new Array(), calls: {},

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

    events: {

        doc: {
            load: function () {
                S.browser.get();
            },

            ready: function () {
                //setTimeout(function () { S.events.render.trigger(1); }, 300);
                //setTimeout(function () { S.events.render.trigger(1); }, 700);
                S.events.doc.resize.trigger();
            },

            click: {
                trigger: function (target) {

                    var type = 'bg';
                    var t = $(target);
                    if (t.parents('.component').length > 0 || t.hasClass('component') == true) {
                        type = 'component';
                    } else if (t.parents('.window').length > 0 || t.hasClass('window') == true) {
                        type = 'window';
                    } else if (t.parents('.toolbar').length > 0 || t.hasClass('toolbar') == true) {
                        type = 'toolbar';
                    } else if (t.parents('.component-select').length > 0 || t.hasClass('component-select') == true) {
                        type = 'component-select';
                    } else if (t.parents('.tools').length > 0) {
                        type = 'tools';
                    }

                    this.callback.execute(target, type);
                },

                callback: {
                    //register & execute callbacks when the user clicks anywhere on the document
                    items: [],

                    add: function (elem, vars, onClick) {
                        this.items.push({ elem: elem, vars: vars, onClick: onClick });
                    },

                    remove: function (elem) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                        }
                    },

                    execute: function (target, type) {
                        if (this.items.length > 0) {
                            for (var x = 0; x < this.items.length; x++) {
                                if (typeof this.items[x].onClick == 'function') {
                                    this.items[x].onClick(target, type);
                                }
                            }
                        }
                    }
                }
            },

            scroll: {
                timer: { started: false, fps: 60, timeout: 250, date: new Date(), callback: null },
                last: { scrollx: 0, scrolly: 0 },

                trigger: function () {
                    this.timer.date = new Date();
                    if (this.timer.started == false) { this.start(); }
                },

                start: function () {
                    if (this.timer.started == true) { return; }
                    this.timer.started = true;
                    this.timer.date = new Date();
                    this.callback.execute('onStart');
                    this.go();
                },

                go: function () {
                    if (this.timer.started == false) { return; }
                    this.last.scrollx = window.scrollX;
                    this.last.scrolly = window.scrollY;
                    S.window.scrollx = this.last.scrollx;
                    S.window.scrolly = this.last.scrolly;
                    this.callback.execute('onGo');

                    if (new Date() - this.timer.date > this.timer.timeout) {
                        this.stop();
                    } else {
                        this.timer.callback = setTimeout(function () { S.events.doc.scroll.go(); }, 1000 / this.timer.fps)
                    }
                },

                stop: function () {
                    if (this.timer.started == false) { return; }
                    this.timer.started = false;
                    this.last.scrollx = window.scrollX;
                    this.last.scrolly = window.scrollY;
                    S.window.scrollx = this.last.scrollx;
                    S.window.scrolly = this.last.scrolly;
                    this.callback.execute('onStop');
                },

                callback: {
                    //register & execute callbacks when the window resizes
                    items: [],

                    add: function (elem, vars, onStart, onGo, onStop) {
                        this.items.push({ elem: elem, vars: vars, onStart: onStart, onGo: onGo, onStop: onStop });
                    },

                    remove: function (elem) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                        }
                    },

                    execute: function (type) {
                        if (this.items.length > 0) {
                            switch (type) {
                                case '': case null: case 'onStart':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onStart == 'function') {
                                            this.items[x].onStart();
                                        }
                                    } break;

                                case 'onGo':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onGo == 'function') {
                                            this.items[x].onGo();
                                        }
                                    } break;

                                case 'onStop':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onStop == 'function') {
                                            this.items[x].onStop();
                                        }
                                    } break;

                            }
                        }
                    }
                }


            },

            resize: {
                timer: { started: false, fps: 60, timeout: 100, date: new Date(), callback: null },

                trigger: function () {
                    this.timer.date = new Date();
                    if (this.timer.started == false) { this.start(); S.window.changed = true; S.window.pos(); }
                },

                start: function () {
                    if (this.timer.started == true) { return; }
                    this.timer.started = true;
                    this.timer.date = new Date();
                    this.callback.execute('onStart');
                    this.go();
                },

                go: function () {
                    S.window.changed = true; S.window.pos();
                    if (this.timer.started == false) { return; }

                    if (new Date() - this.timer.date > this.timer.timeout) {
                        this.stop();
                    } else {
                        this.timer.callback = setTimeout(function () { S.events.doc.resize.go(); }, 1000 / this.timer.fps)
                    }
                },

                stop: function () {
                    if (this.timer.started == false) { return; }
                    this.timer.started = false;
                },

                callback: {
                    //register & execute callbacks when the window resizes
                    items: [],

                    add: function (elem, vars, onStart, onGo, onStop, onLevelChange) {
                        this.items.push({ elem: elem, vars: vars, onStart: onStart, onGo: onGo, onStop: onStop, onLevelChange: onLevelChange });
                    },

                    remove: function (elem) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                        }
                    },

                    execute: function (type, lvl) {
                        if (this.items.length > 0) {
                            switch (type) {
                                case '': case null: case 'onStart':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onStart == 'function') {
                                            this.items[x].onStart();
                                        }
                                    } break;

                                case 'onGo':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onGo == 'function') {
                                            this.items[x].onGo();
                                        }
                                    } break;

                                case 'onStop':
                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onStop == 'function') {
                                            this.items[x].onStop();
                                        }
                                    } break;

                                case 'onLevelChange':

                                    for (var x = 0; x < this.items.length; x++) {
                                        if (typeof this.items[x].onLevelChange == 'function') {
                                            this.items[x].onLevelChange(lvl);
                                        }
                                    } break;
                            }
                        }
                    }
                }
            }
        },

        iframe: {
            loaded: function () {

            }
        },

        ajax: {
            //register & execute callbacks when ajax makes a post
            loaded: true,

            start: function () {
                this.loaded = false;
                $(document.body).addClass('wait');

            },

            complete: function () {
                S.events.ajax.loaded = true;
                $(document.body).removeClass('wait');
                S.window.changed = true;
                S.events.images.load();

                //replace all relative URLs with ajax calls
                setTimeout(function () { S.url.checkAnchors(); }, 500);
            },

            error: function (status, err) {
                S.events.ajax.loaded = true;
                $(document.body).removeClass('wait');
            },

            callback: {
                items: [],

                add: function (elem, vars, onStart, onComplete, onError) {
                    this.items.push({ elem: elem, vars: vars, onStart: onStart, onComplete: onComplete, onError: onError });
                },

                remove: function (elem) {
                    for (var x = 0; x < this.items.length; x++) {
                        if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                    }
                },

                execute: function (type) {
                    if (this.items.length > 0) {
                        switch (type) {
                            case '': case null: case 'onStart':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (typeof this.items[x].onStart == 'function') {
                                        this.items[x].onStart();
                                    }
                                } break;

                            case 'onComplete':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (typeof this.items[x].onComplete == 'function') {
                                        this.items[x].onComplete();
                                    }
                                } break;

                            case 'onError':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (typeof this.items[x].onError == 'function') {
                                        this.items[x].onError();
                                    }
                                } break;

                        }
                    }
                }
            }
        },

        url: {
            change: function(e){
                if (typeof e.state == 'string') {
                    S.url.load(e.state, 1);
                    return false;
                }
            },

            //register & execute callbacks when the url changes
            callback: {
                items: [],

                add: function (elem, vars, onCallback) {
                    this.items.push({ elem: elem, vars: vars, onCallback: onCallback });
                },

                remove: function (elem) {
                    for (var x = 0; x < this.items.length; x++) {
                        if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                    }
                },

                execute: function () {
                    if (this.items.length > 0) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (typeof this.items[x].onCallback == 'function') {
                                this.items[x].onCallback();
                            }
                        }
                    }
                }
            }
        },

        images: {
            load: function () {
                imgs = $('img[src!=""]');
                if (!imgs.length) { S.events.images.complete(); return; }
                var df = [];
                imgs.each(function () {
                    var dfnew = $.Deferred();
                    df.push(dfnew);
                    var img = new Image();
                    img.onload = function () { dfnew.resolve(); }
                    img.src = this.src;
                });
                $.when.apply($, df).done(S.events.images.complete);
            },

            complete: function () {
                //S.events.render.init();
                S.events.doc.resize.trigger();
            }
        }
    },

    ajax: {
        //class used to make simple web service posts to the server
        viewstateId: '', expire: new Date(), queue: [], timerKeep: null, keeping: true,

        post: function (url, data, callback) {
            this.expire = new Date();
            S.events.ajax.start();
            data.viewstateId = S.ajax.viewstateId;
            var options = {
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                url: url,
                contentType: "text/plain; charset=utf-8",
                success: function (d) { S.ajax.runQueue(); S.events.ajax.complete(d); callback(d); },
                error: function (xhr, status, err) { S.events.ajax.error(status, err); S.ajax.runQueue(); }
            }
            S.ajax.queue.push(options);
            if (S.ajax.queue.length == 1) {
                $.ajax(options);
            }
        },

        runQueue: function () {
            S.ajax.queue.shift();
            if (S.ajax.queue.length > 0) {
                $.ajax(S.ajax.queue[0]);
            }
        },

        callback: {
            inject: function (data) {
                if (data.type == 'Websilk.Inject') {
                    //load new content from web service
                    var elem = $(data.d.element);
                    if (elem.length > 0 && data.d.html != '') {
                        switch (data.d.inject) {
                            case 0: //replace
                                elem.html(data.d.html);
                                break;
                            case 1: //append
                                elem.append(data.d.html);
                                break;
                            case 2: //before
                                elem.before(data.d.html);
                                break;
                            case 3: //after
                                elem.after(data.d.html);
                                break;
                        }
                    }

                    //add any CSS to the page
                    if (data.d.css != null && data.d.css != '') {
                        S.css.add(data.d.cssid, data.d.css);
                    }

                    //finally, execute callback javascript
                    if (data.d.js != '' && data.d.js != null) {
                        var js = new Function(data.d.js);
                        js();
                    }
                }

                //S.events.render.trigger();
                S.events.doc.resize.trigger();
            },

            pageRequest: function (data) {
                if (data.d == null) { return; }
                if (data.type == 'Websilk.PageRequest') {
                    if (data.d.pageTitle == '' && data.d.components.length == 0) {
                        if (S.editor.enabled == true) {
                            S.editor.dashboard.hide();
                        }
                        return;
                    }
                    //load new page from web service
                    var p, comp, div;

                    //first, remove unwanted components
                    for (x = 0; x < data.d.remove.length; x++) {
                        $('#c' + data.d.remove[x]).remove();
                    }
                    S.components.cleanup();

                    //remove any duplicate components
                    for (x = 0; x < data.d.components.length; x++) {
                        comp = data.d.components[x];
                        if ($('#c' + comp.itemId).length > 0) {
                            $('#c' + comp.itemId).remove();
                        }
                    }

                    //next, add new components
                    for (x = 0; x < data.d.components.length; x++) {
                        comp = data.d.components[x];
                        p = $('.panel' + comp.panelClassId + ' .inner-panel')[0];
                        if (typeof p == 'object') {
                            div = document.createElement('div');
                            div.innerHTML = comp.html;
                            p.appendChild(div.firstChild);
                        }
                    }
                    $('#divPageLoad').hide();
                    $('.component').show();

                    //add editor if exists (only on login)
                    if (data.d.editor != '') {
                        $('.body').before(data.d.editor);
                    }

                    //update title
                    if (data.d.pageTitle != '') { document.title = data.d.pageTitle; }

                    //create new state in browser history
                    S.url.push(data.d.pageTitle, data.d.url);

                    //finally, execute callback javascript
                    if (data.d.js != '' && data.d.js != null) {
                        var js = new Function(data.d.js);
                        js();
                    }

                    //reset the rendering engine
                    S.events.doc.resize.trigger();

                    //add CSS to page
                    if (data.d.css != null && data.d.css != '') {
                        S.css.add('pageRequest' + S.page.id, data.d.css);
                    }

                    //run registered callbacks
                    S.events.url.callback.execute();
                }
            }
        },

        keepAlive: function () {
            if (typeof isNotKeepAlive != "undefined") { return; }
            clearTimeout(this.timerKeep);
            var options = { save: '' };
            if (S.editor) {
                if (S.editor.save) {
                    if (S.editor.save.cache.length > 0) {
                        options.save = JSON.stringify(S.editor.save.cache);
                        S.editor.save.cache = [];
                        $('.editor .toolbar .savepage').addClass('saving');
                    }
                }

            }

            if (((new Date() - this.expire) / 1000) >= 180 || options.save.length > 0) {
                this.expire = new Date();
                this.post("/websilk/App/KeepAlive", options, function (data) {
                    if (S.editor) {
                        $('.editor .toolbar .savepage').removeClass('saving').addClass('nosave');
                    }
                    if (data.d == "lost") {
                        S.lostSession();
                    }
                });
            }
            this.timerKeep = setTimeout(function () { S.ajax.keepAlive(); }, 180000);
        }
    },

    url: {
        load: function (url) {
            //first, check for a special url
            console.log('load ' + url);
            var urls = url.split('/');
            var words = S.url.special.words;
            if (words.length > 0) {
                for (var x in words) {
                    if (urls[0].toLowerCase() == words[x].word.toLowerCase()) {
                        if (arguments.length < 2) {
                            S.url.push(S.website.title + ' - ' + url.replace('/', ' '), url);
                        }
                        words[x].callback(url);
                        return false;
                    }
                }
            }
            //post page request via Ajax
            S.ajax.post('/websilk/App/Url', { url: url }, S.ajax.callback.pageRequest);
            return false;
        },

        push: function (title, url) {
            history.pushState(url, title, '/' + url);
        },

        special: {
            words: [],

            add: function (word, callback) {
                var words = S.url.special.words;
                for (x = 0; x < words.length; x++) { if (words[x].word == word) { return false; } }
                S.url.special.words.push({ word: word, callback: callback });
            }
        },

        fromAnchor: function(e){
            S.url.load(e.getAttribute("href").substr(1));
            return false;
        },

        checkAnchors: function () {
            var anchors = $('a').filter(function () {
                if (this.getAttribute('href').indexOf('/') == 0) { return true; } return false;
            }).each(function () {
                this.setAttribute('onclick', 'S.url.fromAnchor(this);return false;');
            });
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

S.util = {}

//setup jQuery //////////////////////////////////////////////////////////////////////////////////////
$.ajaxSetup({ 'cache': true });

//pseudo-selector "above"
$.expr[':'].above = function (obj, index, meta, stack) {
    return S.elem.top(obj) < meta[3];
}

// Window Events ////////////////////////////////////////////////////////////////////////////////////'
$(document).on('ready', function () { S.events.doc.ready(); });
$(document.body).on('click', function (e) { S.events.doc.click.trigger(e.target); });
$(window).on('resize', function () { S.events.doc.resize.trigger(); });
$(window).on('scroll', function () { S.events.doc.scroll.trigger(); });
$('iframe').load(function () { S.events.iframe.loaded(); });
window.onpopstate = S.events.url.change;


// start timers /////////////////////////////////////////////////////////////////////////////////
if (typeof document.getElementsByClassName('component') != 'undefined') {
    S.events.doc.load();
    setTimeout(function () { S.ajax.keepAlive(); }, 100);
}
