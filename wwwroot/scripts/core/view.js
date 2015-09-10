/// Websilk Platform : view.js ///
/// <reference path="global.js" />
var R = {
    init:function(ajax, viewstateid, title){
        R.page.useAjax = ajax;
        R.ajax.viewstateId = viewstateid;
        R.hash.last = title;
        R.viewport.getLevel();
        R.hash.start();
    },

    window: {
        w: 0, h: 0, scrollx: 0, scrolly: 0, z: 0, absolute: { w: 0, h: 0 }, changed: true,

        pos:function(){
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
                if (R.browser.isNS) {
                    this.w = window.innerWidth;
                    this.h = window.innerHeight;
                }

                var bod = $('.body')[0];
                if(bod != null){
                    this.absolute.w = R.elem.width(bod);
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
            for (x = 0; x < R.viewport.levels.length; x++) {
                if (w <= R.viewport.levels[x]) {
                    var changed = false;
                    if (R.viewport.level != x) { changed = true; }
                    R.viewport.level = x;
                    if (changed == true) {
                        var wp = $(document.body);
                        var size = R.viewport.levelNames[x];
                        if (wp.hasClass(size) == false) { wp.removeClass('cell mobile tablet desktop hd screen').addClass(size + ' screen'); }
                    }
                    return changed;
                }
            }
        },

        resize: function (width) {
            if (R.editor.enabled == false) { return; }
            var webpage = $('.webpage');
            if (webpage.css('maxWidth') == '' || webpage.css('maxWidth') == 'none') {
                webpage.css({ 'maxWidth': webpage.width() });
            }
            webpage.stop().animate({ maxWidth: width }, {
                duration: this.speed * 1000,
                progress: function () {
                    if (R.viewport.getLevel() == true) {
                        R.viewport.levelChanged(R.viewport.level);
                    }
                    R.events.doc.resize.trigger();
                },
                complete: function () {
                    R.events.doc.resize.trigger();
                    R.viewport.getLevel();
                    if (R.viewport.isChanging == true) {
                        R.viewport.isChanging = false;
                        if (R.editor.enabled == true) { R.editor.components.disabled = false; }
                        R.viewport.levelChanged(R.viewport.level);
                    } else {
                        if (R.editor.enabled == true) { R.editor.components.resizeSelectBox(); }
                    }
                }
            });
        },

        view: function (level) {
            if (R.editor.enabled == false) { return; }
            //hide selected components
            R.editor.components.hideSelect();
            R.editor.components.disabled = true;
            switch (level) {
                case 4: //HD
                    R.viewport.resize(1920); break;

                default: //all other screen sizes
                    R.viewport.resize(R.viewport.levels[level]); break;
            }
            R.viewport.isChanging = false;
            R.viewport.levelChanged(level)
            R.viewport.isChanging = true;
        },

        levelChanged: function (level) {
            if (R.viewport.isChanging == true) { return; }
            R.viewport.sizeIndex = level;
            var screen = 'HD', ext = 'hd';
            switch (level) {
                case 4: //HD
                    screen = 'HD'; ext = 'hd'; break;

                case 3: //Desktop
                    screen = 'Desktop'; ext = 'desktop'; break;

                case 2: //Tablet
                    screen = 'Tablet'; ext = 'tablet'; break;

                case 1: //Mobile Device
                    screen = 'Mobile Device'; ext = 'mobile'; break;

                case 0: //Cell Phone
                    screen = 'Cell Phone'; ext = 'cell'; break;

            }
            $('.toolbar .menu .screens use').attr('xlink:href', '#icon-screen' + ext)
        },

        nextLevel: function () {
            if (R.editor.enabled == false) { return; }
            R.viewport.speed = 2;
            var sizeIndex = R.viewport.sizeIndex;
            if (sizeIndex == -1) {
                sizeIndex = R.viewport.level;
            }
            var next = sizeIndex > 0 ? sizeIndex - 1 : 4;
            R.viewport.view(next);
        },

        previousLevel: function () {
            if (R.editor.enabled == false) { return; }
            R.viewport.speed = 2;
            var sizeIndex = R.viewport.sizeIndex;
            if (sizeIndex == -1) {
                sizeIndex = R.viewport.level;
            }
            var prev = sizeIndex < 4 ? sizeIndex + 1 : 0;
            R.viewport.view(prev);
        },

        getLevelOrder: function () {
            this.getLevel();
            var lvl = this.level;
            switch (lvl) {
                case 0:
                    return [0, 1, 2, 3, 4];
                case 1:
                    return [1, 2, 0, 3, 4];
                case 2:
                    return [2, 3, 4, 1, 0];
                case 3:
                    return [3, 4, 2, 1, 0];
                case 4:
                    return [4, 3, 2, 1, 0];
            }
        }
    },

    elem: {
        get: function(id){
            return document.getElementById(id);
        },

        pos: function(elem){
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
                if (h == 0) {h = $(elem).height(); }
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

        top:function(elem){
            return elem.offsetTop ? elem.offsetTop : elem.clientTop;
        },

        width:function(elem){
            return elem.offsetWidth ? elem.offsetWidth : elem.clientWidth;
        },

        height:function(elem){
            return elem.offsetHeight ? elem.offsetHeight : elem.clientHeight;
        },

        fromEvent: function(event){
            if (R.browser.isIE) { return window.event.srcElement;
            } else if (R.browser.isNS) { return event.target; }
            return null;
        },

        panel: function (elem) {
            var p = $(elem).parents('.ispanel');
            if (p.length > 0) { return p[0]; }
            return null;
        }

    },

    css:{
        add: function (id, css) {
            $('#css' + id).remove();
            $('head').append('<style id="css'+id+'" type="text/css">' + css + "</style>");
        },

        remove: function (id) {
            $('head').remove('#css' + id);
        }
    },

    website: {
        id:0, title:''
    },

    page: {
        id:0, title: '', useAjax: false,

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
            for (x = 0; x < this.cache.length; x++){
                if(this.cache[x].pageId == pageId){
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
                var p = R.selectors.cache[7], pos;
                for (x = 0; x < p.length; x++) {
                    pos = R.elem.offset(p[x]);
                    this.items[p[x].id] = { p: p[x], x: pos.x, y: pos.y, w: pos.w, h: pos.h };
                }
            }
            return this.items;
        }
    },

    components: {
        cache: new Array(), calls:{},

        add: function (id, type, position, css, label, limit, duplicate) {
            if (id == null || id == '') { return;}
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
                if ($R('c' + this.cache[x].id) != null) { keep = true; }
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
                R.browser.get();
            },

            ready: function () {
                //setTimeout(function () { R.events.render.trigger(1); }, 300);
                //setTimeout(function () { R.events.render.trigger(1); }, 700);
                R.events.doc.resize.trigger();
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
                        this.items.push({ elem: elem, vars: vars, onClick: onClick});
                    },

                    remove: function (elem) {
                        for (var x = 0; x < this.items.length; x++) {
                            if (this.items[x].elem == elem) { this.items.splice(x, 1); x--;}
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

                start: function(){
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
                    R.window.scrollx = this.last.scrollx;
                    R.window.scrolly = this.last.scrolly;
                    this.callback.execute('onGo');

                    if (new Date() - this.timer.date > this.timer.timeout) {
                        this.stop();
                    } else {
                        this.timer.callback = setTimeout(function () { R.events.doc.scroll.go(); }, 1000 / this.timer.fps)
                    }
                },

                stop: function () {
                    if (this.timer.started == false) { return; }
                    this.timer.started = false;
                    this.last.scrollx = window.scrollX;
                    this.last.scrolly = window.scrollY;
                    R.window.scrollx = this.last.scrollx;
                    R.window.scrolly = this.last.scrolly;
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
                    if (this.timer.started == false) { this.start(); R.window.changed = true; R.window.pos();}
                },

                start: function () {
                    if (this.timer.started == true) { return; }
                    this.timer.started = true;
                    this.timer.date = new Date();
                    this.callback.execute('onStart');
                    this.go();
                },

                go: function () {
                    R.window.changed = true; R.window.pos();
                    if (this.timer.started == false) { return; }

                    if (new Date() - this.timer.date > this.timer.timeout) {
                        this.stop();
                    } else {
                        this.timer.callback = setTimeout(function () { R.events.doc.resize.go(); }, 1000 / this.timer.fps)
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
            //register & execute callbacks when ajax makes a post (including hash change)
            loaded: true, 

            start: function () {
                this.loaded = false;
                $(document.body).addClass('wait');
                clearTimeout(R.hash.timer);

            },

            complete: function () {
                R.events.ajax.loaded = true;
                $(document.body).removeClass('wait');
                R.window.changed = true;
                R.hash.isChanging = false;
                R.hash.checked = 0;
                R.hash.watch();
                R.events.images.load();
            },

            error: function (status, err) {
                R.events.ajax.loaded = true;
                $(document.body).removeClass('wait');
                R.hash.isChanging = false; R.hash.checked = 0; R.hash.watch();
            },

            callback: {
                items: [],

                add: function (elem, vars, onStart, onComplete, onError) {
                    this.items.push({ elem: elem, vars:vars, onStart: onStart, onComplete: onComplete, onError: onError });
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

        hash: {
            //register & execute callbacks when the hash changes
            callback: {
                items: [],

                add: function (elem, vars, onCallback) {
                    this.items.push({ elem: elem, vars: vars, onCallback: onCallback});
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
                if (!imgs.length) { R.events.images.complete(); return; }
                var df = [];
                imgs.each(function () {
                    var dfnew = $.Deferred();
                    df.push(dfnew);
                    var img = new Image();
                    img.onload = function () { dfnew.resolve(); }
                    img.src = this.src;
                });
                $.when.apply($, df).done(R.events.images.complete);
            },

            complete: function () {
                //R.events.render.init();
                R.events.doc.resize.trigger();
            }
        }
    },

    ajax: {
        //class used to make simple web service posts to the server
        viewstateId:'', expire:new Date(), queue:[], timerKeep: null,

        post: function (url, data, callback) {
            this.expire = new Date();
            R.events.ajax.start();
            data.viewstateId = R.ajax.viewstateId;
            var options = {
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                url: url,
                contentType: "text/plain; charset=utf-8",
                success: function (d) { R.ajax.runQueue(); R.events.ajax.complete(d); callback(d); },
                error: function (xhr, status, err) { R.events.ajax.error(status, err); R.ajax.runQueue(); }
            }
            R.ajax.queue.push(options);
            if (R.ajax.queue.length == 1) {
                $.ajax(options);
            }
        },

        runQueue:function(){
            R.ajax.queue.shift();
            if (R.ajax.queue.length > 0) {
                $.ajax(R.ajax.queue[0]);
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
                        R.css.add(data.d.cssid, data.d.css);
                    }

                    //finally, execute callback javascript
                    if (data.d.js != '' && data.d.js != null) {
                        var js = new Function(data.d.js);
                        js();
                    }
                }

                //R.events.render.trigger();
                R.events.doc.resize.trigger();
            }
        },

        keepAlive: function () {
            if (typeof isNotKeepAlive != "undefined") { return; }
            var options = {save:''};
            if (R.editor) {
                if (R.editor.save) {
                    if (R.editor.save.cache.length > 0){
                        options.save = JSON.stringify(R.editor.save.cache);
                        R.editor.save.cache = [];
                        $('.editor .toolbar .savepage').addClass('saving');
                    }
                }
                
            }

            if (((new Date() - this.expire) / 1000) > 180 || options.save != '') {
                this.expire = new Date();
                this.post("/websilk/App/KeepAlive", options, function (data) {
                    if (R.editor) {
                        $('.editor .toolbar .savepage').removeClass('saving').addClass('nosave');
                    }
                    if (data.d == "lost") {
                        //session lost, execute javascript
                        R.lostSession();
                    }
                });
            }
            this.timerKeep = setTimeout(function () { R.ajax.keepAlive(); }, 180000);
        }
    },

    panel:{
        coordinates: new Array()
    },
    
    editor:{
        selectedLayerId: '', editMode: false, enabled:false
    },
    
    hash: {
        // 'AJAX URL Hash System ////////////////////////////////////////////////////////////////////////////////////'
        //the hash system for Websilk is set up to manipulate components on the page. A few examples:

        // page-name/dg8+3+2/b1e+1+love/7ob+2+15+2011/vsa+8279189
        // dashboard/website+1078098+designs+82

        //each object is separated by a plus sign +
        //1st object is the page name of the Websilk Web Site
        //other objects are component instances & commands to execute
        //1st component in the example:
        //dg8+3+2  <--- dg8 = component name, 3 = command #3, 2 = command attribute

        last: '', timer: null, started:null, isChanging: false,

        start: function () {
            if (R.page.title != "") {
                R.hash.started = new Date();
                R.hash.update();
                setTimeout(function () { R.hash.watch(); }, 500);
            }
        },

        inject:function(obj, inject) {
            //injects the hash into an <a/> tag
            //inject should always be like so:
            //componentId:command:(value)
            //so for example, blog:search:love
            //would search the blog app for the keyword "love"
            //(value) means it is optional

            //first, see if the app is already in the hash
            var newhash = "";
            var arrInj = inject.split("+");
            var start = new Array();
            var evTitle = R.page.title.replace(/\s/g, "-");
            if (arrInj.length > 1) {
                if (R.hash.last != "") {
                    start[0] = R.hash.last.indexOf("/" + arrInj[0]);
                    if (start[0] > -1) {
                        //app is in hash, check to see if command is in app hash
                        start[1] = R.hash.last.substr(start[0] + 1).indexOf("/");
                        newhash = R.hash.last.substr(0, start[0] + 1) + inject;
                        if (start[1] > -1) { newhash += R.hash.last.substr(start[0] + 1 + start[1]); }
                    } else {
                        newhash = R.hash.last + "/" + inject;
                    }
                } else { newhash = evTitle + "/" + inject; }
            } else {
                newhash = evTitle + "/" + inject;
            }
            if (obj.getAttribute("replace") == "true") {
                newhash = evTitle + "/" + inject;
            }
            if (R.page.useAjax == false) {
                newhash = newhash.replace(/\+/g, "/").replace(/:/g, "+");
                //add query string to url
                newhash = "?h=" + newhash;
                if (window.location.search != "") {
                    if (window.location.search.indexOf("?h=") < 0 && window.location.search.indexOf("&h=") < 0) {
                        //h variable isn't in the old querystring, add the entire querystring
                        newhash += "&" + window.location.search.substr(1);
                    } else {
                        //remove "h" variable from the old query string
                        var oldhash = window.location.search;
                        start[0] = oldhash.indexOf("?h=");
                        if (start[0] < 0) { start[0] = oldhash.indexOf("&h="); }
                        start[1] = oldhash.substr(start[0]).indexOf("&");
                        if (start[1] > 1) {
                            oldhash = oldhash.substr(0, start[0]) + oldhash.substr(start[1] + start[0]);
                        } else {
                            oldhash = oldhash.substr(0, start[0]);
                        }
                        newhash += "&" + oldhash.replace("?", "");
                    }
                }
                obj.href = newhash;
            } else {
                //replace page title if needed
                var apage = obj.getAttribute("page");
                if (apage != "" && apage != null && apage != undefined) {
                    start[0] = newhash.indexOf("/");
                    if (start[0] > -1) {
                        newhash = apage + "/" + newhash.substr(start[0] + 1);
                    } else {
                        if (newhash != "") {
                            newhash = apage + "/" + newhash;
                        } else {
                            newhash = apage;
                        }
                    }
                }
                if (obj.getAttribute("replace") == "true") {
                    newhash = inject;
                }
                if (newhash.substring(newhash.length, newhash.length - 1) == "+") { newhash = newhash.substring(0, newhash.length - 1); }
                obj.href = "#" + newhash;
            }
         },

        watch: function() {
            //check to see if the hash has changed every 0.5 seconds
            if (R.page.useAjax == false) { return;}
            var hash = location.hash.toLowerCase().replace('#', '');
            clearTimeout(R.hash.timer); R.hash.timer = null;
            if (location.hash.replace("#", "").toLowerCase() != R.hash.last.toLowerCase() && R.page.title != "") {
                //hash has changed
                
                if (location.hash.replace("#", "").toLowerCase() != '' && (new Date() - R.hash.started / 1000) > 3) {
                    R.hash.change(); return;
                }

            } else if (location.hash == "" && R.hash.last != "" && R.page.title != "") {
                R.hash.change(); return;

            } else if (R.page.title == "") {
                R.hash.change(); return;
                return;
            }
            R.hash.timer = setTimeout(function () { R.hash.watch(); }, 500);
        },

        post: function (url) {
            if (R.page.useAjax == true) {
                location.hash = '#'+url;
            } else {
                location.href = '/'+url
            }
        },

        ghost:function(url) {
            //changes the URL hash while bypassing an AJAX request
            if (R.page.useAjax == false) { return; }
            R.hash.last = url;
            location.hash = url;
        },

        change: function () {
            if (R.page.useAjax == false) { return; }
            var hash = location.hash.toLowerCase().replace('#', '');
            if (this.last.toLowerCase() == 'home' && hash == '') {
                R.hash.timer = setTimeout(function () { R.hash.watch(); }, 500);
                return;
            }

            clearTimeout(R.hash.timer);
            
            //check for special hash words that would override the server-side method
            var words = R.hash.special.words;
            for (x = 0; x < words.length; x++) {
                if (hash.indexOf(words[x].word) == 0) {
                    R.hash.update();//updates all href links on the page with new hash
                    words[x].callback(hash);
                    R.events.hash.callback.execute(); //run registered callbacks
                    R.hash.last = hash;
                    R.hash.timer = setTimeout(function () { R.hash.watch(); }, 500);
                    return;
                }
            }

            

            //no special hash words found, continue with server-side method
            R.hash.isChanging = true;
            var arrNhash = hash.split("/");
            var finalhash = "";
            if (R.hash.last != "") {
                var changed = "";
                var isChanged = true;
                var arrHash = R.hash.last.split("/");
                var arrNhashCmd, arrHashCmd;
                for (x = 0; x < arrNhash.length; x++) {//search new hash
                    isChanged = true;
                    for (y = 0; y < arrHash.length; y++) {//compare with old hash
                        if (arrNhash[x] == arrHash[y]) { isChanged = false; }
                    }
                    if (isChanged == true) {
                        if (changed != "") { changed += "/"; }
                        changed += arrNhash[x];
                    }
                }
                if (changed != "") {
                    //send hash changes to the server
                    finalhash = changed;
                }
            } else {
                //evolver hash is empty, send it all to the server
                finalhash = hash;
            }
            if (finalhash == "" && arrNhash.length > 0) {
                finalhash = arrNhash[0];
            }
            //remove page title if the page is already loaded
            if (finalhash.indexOf(R.page.title) == 1) { finalhash = finalhash.substr(R.page.title.length + 2); }
            finalhash = finalhash.replace("#", "");
            R.hash.last = hash;
            R.hash.update();//updates all href links on the page with new hash
            //R.events.render.disabled = true;
            R.ajax.post('/websilk/App/Hash', { url: finalhash }, R.hash.callback);
        },

        callback: function (data) {
            if(data.d == null){return;}
            if (data.type == 'Websilk.PageRequest') {
                //load new page from web service
                var p, comp, div;
                    
                //first, remove unwanted components
                for (x = 0; x < data.d.remove.length; x++) {
                    $('#c' + data.d.remove[x]).remove();
                }
                R.components.cleanup();

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

                //finally, execute callback javascript
                if (data.d.js != '' && data.d.js != null) {
                    var js = new Function(data.d.js);
                    js();
                }

                //reset the rendering engine
                //R.events.render.init();
                R.events.doc.resize.trigger();

                //add CSS to page
                if (data.d.css != null && data.d.css != '') {
                    R.css.add('pageRequest' + R.page.id, data.d.css);
                }

                //run registered callbacks
                R.events.hash.callback.execute();
            }
        },

        update:function() {
            //reset all a href links
            var arra = $("a[hash]");
            for (var x = 0; x < arra.length; x++) {
                R.hash.inject(arra[x], arra[x].getAttribute("hash"));
            }
        },

        combine:function(url1, url2) {
          var url3, arr1, arr2, arr3, exists;
          arr1 = url1.replace("#", "").split("/");
          arr2 = url2.replace("#", "").split("/");
          if (arr1.length > 1) {
              for (var x = 1; x < arr1.length; x++) {
                  arr3 = arr1[x].split("+");
                  exists = false;
                  if (arr3.length > 0) {
                      //check 2nd array to see if it exists
                      for (var y = 0; y < arr2.length; y++) {
                          if (arr2[x].indexOf(arr3[0]) > -1) {
                              exists = true;
                          }
                      }
                      if (exists == false) { if (url3 != '') { url3 += '/'; } url3 += arr1[x]; }
                  }
              }
              return url3;
          } else {
              return url2;
          }
        },

        special:{
            words: [],

            add: function (word, callback) {
                var words = R.hash.special.words;
                for (x = 0; x < words.length; x++) {if (words[x].word == word) { return false;}}
                R.hash.special.words.push({ word: word, callback: callback });
            }
        }
    },

    browser: {
        isIE:false, isNS:false, version:null,

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

R.util = {}

//setup jQuery //////////////////////////////////////////////////////////////////////////////////////
$.ajaxSetup({ 'cache': true });

//pseudo-selector "above"
$.expr[':'].above = function (obj, index, meta, stack) {
    return R.elem.top(obj) < meta[3];
}

// Window Events ////////////////////////////////////////////////////////////////////////////////////'
$(document).on('ready', function () { R.events.doc.ready(); });
$(document.body).on('click', function (e) { R.events.doc.click.trigger(e.target); });
$(window).on('resize', function () { R.events.doc.resize.trigger();});
$(window).on('scroll', function () { R.events.doc.scroll.trigger(); });
$('iframe').load(function () { R.events.iframe.loaded(); });


// start timers /////////////////////////////////////////////////////////////////////////////////
if (typeof document.getElementsByClassName('component') != 'undefined') {
    R.events.doc.load();
    setTimeout(function () { R.ajax.keepAlive(); }, 3000);
}
