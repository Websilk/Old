S.editor.window = {
    windows: [], loadclick: null, popupshown: false,

    load: function (name, url, data, options) {
        var a = this.windows[name.replace(/ /g, '')];
        var div, win = $('.editor > .windows .win' + name.replace(/ /g, ''));
        var autoHide = false, addResize = false;
        if (options != null) {
            if (options.autoHide == true) { autoHide = true; }
            if (options.popup == true) {
                setTimeout(function () {
                    S.editor.components.disabled = true;
                    S.editor.window.popupshown = true;
                    S.editor.components.hideSelect();
                }, 100);
            }
        }

        if (win.length > 0) {
            //window already exists
            div = win[0];
            if (autoHide == true && win[0].style.display != 'none') {
                win.hide();
                if (a.dialog == true) {
                    $('.dialog-bg').hide();
                }
            } else {
                S.editor.window.hidePopUps();
                if (S.editor.dashboard.visible == true) {
                    if (a.noDashboard != true) {
                        if (win.hasClass('dashboard') == false) {
                            win.addClass('dashboard');
                        }
                        S.editor.dashboard.hideAllWindows();
                        S.editor.dashboard.callback.resize();
                    }

                    //change url link
                    if (options.url != '') {
                        a.url = options.url;
                    }
                    if(a.url != ''){
                        var t = S.util.str.Capitalize(a.url.replace('-', ' ')).replace(' ', '-');
                        var u = 'Dashboard/' + t;
                        document.title = S.website.title + ' - ' + t + ' - Dashboard';
                        if (location.href.indexOf(S.url.domain() + u) < 0) {
                            S.url.push(S.website.title + ' - ' + t, u);
                        }
                    }
                }
                win.show();
                if (a.dialog == true) {
                    win.style.zIndex = 4510;
                    $('.dialog-bg').show();
                }
                S.editor.window.callback.resize(a);
            }
        } else {
            //create new window
            S.editor.window.hidePopUps();
            var toolh = S.editor.toolbar.height;
            var item = {
                title: name, name: name.replace(/ /g, ''), x: 0, y: S.editor.toolbar.height, w: 320, h: 240, maxh: 0, r: null, target: null,
                align: null, arrow: null, spacing: 0, toolbar: true, classes: '', addResize: false, resizable: false,
                popup: false, dialog: false, visible: true, zIndex: 0, resizealign: 'minimize', noDashboard: false, url: ''
            };

            //setup options
            if (options != null) {
                if (options.x != null) { item.x = options.x; }
                if (options.y != null) { item.y = options.y; }
                if (options.w != null) { item.w = options.w; }
                if (options.h != null) { item.h = options.h; }
                if (options.maxh != null) { item.maxh = options.maxh; }
                if (options.r != null) { item.r = options.r; }
                if (options.title != null) { item.title = options.title; }
                if (options.target != null) { item.target = options.target; item.addResize = true; }
                if (options.align != null) { item.align = options.align; }
                if (options.arrow != null) { item.arrow = options.arrow; }
                if (options.spacing != null) { item.spacing = options.spacing; }
                if (options.toolbar != null) { item.toolbar = options.toolbar; }
                if (options.classes != null) { item.classes += ' ' + options.classes; }
                if (options.popup != null) { item.popup = options.popup; if (item.popup == true) { item.classes += ' popup' } }
                if (options.dialog != null) { item.dialog = options.dialog; if (item.dialog == true) { item.classes += ' dialog' } }
                if (options.autoHide != null) { item.autoHide = options.autoHide; }
                if (options.postOnce != null) { item.postOnce = options.postOnce; item.pageId = S.page.id; }
                if (options.visible != null) { item.visible = options.visible; }
                if (options.resizable != null) { item.resizable = options.resizable; }
                if (options.zIndex != null) { item.zIndex = options.zIndex; }
                if (options.resizealign != null) { item.resizealign = options.resizealign; }
                if (options.noDashboard != null) { item.noDashboard = options.noDashboard; }
                if (options.url != null) { item.url = options.url; }
            }

            if (a != null && typeof a != 'undefined') {
                if (a.x != null) { item.x = a.x; }
                if (a.y != null) { item.y = a.y; }
                if (a.w != null) { item.w = a.w; }
                if (a.h != null) { item.h = a.h; }
                if (a.r != null) { item.r = a.r; }
            }

            switch (item.align) {
                case 'bottom-center':
                    if (item.arrow == true) { item.classes += ' arrow-top'; }
                    break;
            }
            if (S.editor.dashboard.visible == true && item.noDashboard == false) { item.classes += ' dashboard'; S.editor.dashboard.hideAllWindows(); }

            if (item.y < S.editor.toolbar.height) { item.y = S.editor.toolbar.height; }
            item = this.reposition(item);

            //create window using options
            div = document.createElement('div');
            div.className = 'window win' + item.name + ' draggable interface box' + item.classes;

            if (item.r != null) {
                //right-aligned
                item.addResize = true;
                div.style.left = (S.window.w - item.r - item.w) + 'px';
            } else {
                //left-aligned
                div.style.left = item.x + 'px';
            }
            div.style.top = (item.y + item.spacing) + 'px';

            if (item.h.toString().indexOf('%') < 0) { div.style.minHeight = item.h + 'px'; } else {
                div.style.minHeight = (((S.window.h - item.y) / 100) * parseInt(item.h.replace('%', ''))) + 'px';
                item.addResize = true;
            }
            if (item.w.toString().indexOf('%') < 0) { div.style.width = item.w + 'px'; } else {
                div.style.width = (((S.window.w - item.x) / 100) * parseInt(item.w.replace('%', ''))) + 'px';
                item.addResize = true;
            }
            if (item.maxh > 0) { div.style.maxHeight = item.maxh + 'px' }
            if (item.popup == true) {
                div.style.zIndex = 4550;
            }
            if (item.zIndex > 0) {
                div.style.zIndex = 4500 + item.zIndex;
            }

            if (item.visible == false) { div.style.display = 'none'; }

            var htm = '';
            if (item.toolbar != false) {
                htm += '<div class="grip">';
                if (item.title != '') { htm += '<div class="title">' + item.title + '</div>'; }
                htm += '<div class="close"><a href="javascript:" onclick="S.editor.window.hide(event)">' +
                      '<svg viewBox="0 0 15 15"><use xlink:href="#icon-close" x="0" y="0" width="36" height="36"></use></svg></a></div>';
                if (item.resizable == true) {
                    htm +=
                      '<div class="resizable">' +
                        '<div class="resize-leftside"><a href="javascript:" onclick="S.editor.window.resize.leftSide(\'' + item.name + '\')" title="Maximize window to the left-hand side of the screen">' +
                        '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowleftside" x="0" y="0" width="14" height="14"></use></svg></a></div>' +
                        '<div class="resize-maximize"><a href="javascript:" onclick="S.editor.window.resize.maximize(\'' + item.name + '\')" title="Maximize window to fullscreen">' +
                        '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowmaximize" x="0" y="0" width="14" height="14"></use></svg></a></div>' +
                        '<div class="resize-minimize" style="display:none"><a href="javascript:" onclick="S.editor.window.resize.minimize(\'' + item.name + '\')" title="Minimize window to its original size">' +
                        '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowminimize" x="0" y="0" width="14" height="14"></use></svg></a></div>' +
                        '<div class="resize-rightside"><a href="javascript:" onclick="S.editor.window.resize.rightSide(\'' + item.name + '\')" title="Maximize window to the right-hand side of the screen">' +
                        '<svg viewBox="0 0 14 14" style="width:14px;"><use xlink:href="#icon-windowrightside" x="0" y="0" width="14" height="14"></use></svg></a></div>' +
                      '</div>';
                }
                htm += '</div>';
            }
            htm += '<div class="content"></div>';
            div.innerHTML = htm;
            $('.editor > .windows')[0].appendChild(div);
            item.elem = div;
            S.editor.window.draggable();

            this.windows[item.name] = item;
            a = item;

            if (item.dialog == true) {
                div.style.zIndex = 4510;
                $('.dialog-bg').show();
            }

            if (item.addResize == true) {
                S.events.doc.resize.callback.add(div, this.windows[item.name], null,
                    function () { S.editor.window.callback.resize(this.vars); },
                    function () { S.editor.window.callback.resize(this.vars); });
            }

            if (S.editor.dashboard.visible == true) { S.editor.dashboard.callback.resize(); }

            this.callback.windowResize();
        }

        //request data from server to load into window
        var post = true;
        if (win.length > 0) {
            if (a.postOnce == 'pageid') {
                if (a.pageId == S.page.id) { post = false; }
            } else if (a.postOnce === true) {
                post = false;
            }
        }
        if (url != '' && url != null && post == true) {
            S.ajax.post('/api/' + url, data, S.editor.window.callback.ajax);
        } else {
            if (data != '') {
                //load content from string
                $(div).find('.content').append(data);
            }
        }

        this.loadclick = div;

        //change url link
        if (a.url != '' && S.editor.dashboard.visible == true) {
            var t = S.util.str.Capitalize(a.url.replace('-', ' ')).replace(' ', '-');
            var u = 'Dashboard/' + t;
            document.title = S.website.title + ' - ' + t + ' - Dashboard';
            if (location.href.indexOf(S.url.domain() + u) < 0) {
                S.url.push(S.website.title + ' - ' + t, u);
            }
        }


        S.editor.events.doc.resize();

        setTimeout(function () { S.editor.window.loadclick = null; }, 200);
    },

    reposition: function (item) {
        //if(S.editor.dashboard.visible == true && item.noDashboard != true){return;}
        if (item.align != null) {
            //align window to the target
            item.addResize = true;
            S.window.pos();
            var targ, win = S.window;
            if (item.target != null) {
                targ = { target: $(item.target), item: null, spacing: 0 };
                targ.pos = S.elem.pos(targ.target[0]);
                targ.spacing = item.spacing;
                if (item.arrow == true) { targ.spacing += 10; }
            }


            switch (item.align) {
                case 'bottom-center':
                    item.x = (targ.pos.x + (targ.pos.w / 2)) - (item.w / 2);
                    item.y = targ.pos.y + targ.pos.h + targ.spacing;
                    break;
                case 'center':
                    item.x = (win.w / 2) - (item.w / 2);
            }
        }
        return item;
    },

    callback: {
            ajax: function (data) {
                if (data.type == 'Websilk.Inject') {
                    S.ajax.callback.inject(data);
                } else {
                    if (data.d.window != null && data.d.html != null) {
                        $('.editor .window.win' + data.d.window + ' > .content')[0].innerHTML = data.d.html;
                    }

                    //finally, execute callback javascript
                    if (data.d.js != '' && data.d.js != null) {
                        var js = new Function(data.d.js);
                        js();
                    }
                }
                if (S.editor.dashboard.visible == true) { S.editor.dashboard.callback.resize(); }
            },

            resize: function (item) {
                if(item.elem.style.display == 'none'){return;}
                item = S.editor.window.reposition(item);
                var pos = S.elem.pos(item.elem);
                if (item.resizealign == 'minimize') {
                    if (item.target == null) { item.x = pos.x; }
                    if (item.w.toString().indexOf('%') < 0) { item.w = pos.w; }
                    if (item.h.toString().indexOf('%') < 0) { item.h = pos.h; }
                }
                $(item.elem).css({ top: item.y })
                if (item.r != null) {
                    //right-aligned
                    $(item.elem).css({ left: (S.window.w - item.r - item.w) });
                } else {
                    //left-aligned
                    $(item.elem).css({ left: item.x });
                }
                if (item.h.toString().indexOf('%') > -1) {
                    item.elem.style.minHeight = (((S.window.h - item.y) / 100) * parseInt(item.h.replace('%', ''))) + 'px';
                }

                if (item.w.toString().indexOf('%') > -1) {
                    item.elem.style.width = (((S.window.w - item.x) / 100) * parseInt(item.w.replace('%', ''))) + 'px';
                }

                S.editor.window.resize.callback.execute(null, 'onResize');
            },

            click: function (target, type) {
                //hide window popups
                var hidepopups = false;
                var exclude = null;
                if (type != 'window') {
                    hidepopups = true;
                } else {
                    var t = $(target)
                    if ($(target).hasClass('window') == false) {
                        t = $(target).parents('.window');
                    }
                    var c = t[0].className.split(' ');
                    for (x = 0; x < c.length; x++) {
                        if (c[x].indexOf('win') == 0 && c[x] != 'window') {
                            exclude = $('.window.' + c[x])[0]; break;
                        }
                    }
                    hidepopups = true;
                }
                if (hidepopups == true && S.editor.window.popupshown == true) {
                    S.editor.window.popupshown = false;
                    var win;
                    for (c in S.editor.window.windows) {
                        win = S.editor.window.windows[c];
                        if (win.elem != exclude && win.popup == true && S.editor.window.loadclick != win.elem) {
                            $(win.elem).hide();
                        }
                    }
                    S.editor.components.disabled = false;
                }

            },

            windowResize: function () {
                $('.editor .window > .content').css({ maxHeight: S.window.h - 30 - S.editor.toolbar.height });
                $('.editor .window.dashboard > .content').css({ maxHeight: S.window.h - S.editor.toolbar.height });
                S.editor.window.resize.callback.execute(null, 'onResize');
            }
    },

    open: {
            timeline: function () {
                S.editor.window.load('DashboardTimeline', 'Dashboard/Timeline/Load', {}, { x: 155, y: S.editor.toolbar.height, w: 250, h: '100%', toolbar: false, isDashboard: S.editor.dashboard.visible, url: '' })
            },

            pages: function () {
                S.editor.window.load('WebPages', 'Dashboard/Pages/LoadPages', {}, { x: 0, align: 'center', y: 0, w: 600, h: 200, spacing: 50, postOnce: true, isDashboard: S.editor.dashboard.visible, title: 'Web Pages for \'' + S.website.title + '\'', url: 'pages' })
            },

            pageSettings: function (pageId) {
                S.editor.pages.settings.show(pageId);
            },

            photoLibrary: function (type) {
                S.editor.photos.show(null, type);
            },

            analytics: function () {
                S.editor.window.load('Analytics', 'Dashboard/Analytics/LoadAnalytics', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: true, isDashboard: S.editor.dashboard.visible, title: 'Website Analytics for \'' + S.website.title + '\'', url: 'analytics' })
            },

            designer: function () {
                S.editor.window.load('Design', 'Dashboard/Design/LoadDesigner', {}, { w: 200, h: 100, target: '.editor .toolbar .menu .grid', align: 'bottom-center', arrow: true, spacing: 10, toolbar: false, autoHide: true, popup: true, postOnce: true, isDashboard: S.editor.dashboard.visible })
            },

            users: function () {
                S.editor.window.load('Users', 'Dashboard/Users/LoadUsers', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: true, isDashboard: S.editor.dashboard.visible, title: 'User Security for \'' + S.website.title + '\'', url: 'users' })
            },

            apps: function () {
                S.editor.window.load('Apps', 'Dashboard/Apps/LoadApps', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: true, isDashboard: S.editor.dashboard.visible, title: 'Apps Installed onto \'' + S.website.title + '\'', url: 'apps' })
            },

            websiteSettings: function () {
                S.editor.window.load('WebsiteSettings', 'Dashboard/Website/LoadSettings', {}, { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, isDashboard: S.editor.dashboard.visible, postOnce: true, title: 'Website Settings for \'' + S.website.title + '\'', url: 'settings' })
            },

            tests: function (test) {
                S.editor.window.load('Tests', 'Dashboard/Tests/' + test, {}, { x: 0, align: 'center', y: 0, w: 600, h: 200, spacing: 50, postOnce: true, isDashboard: true, title: 'Tests - ' + test, url: 'tests/' + test })
            }
    },

    draggable: function () {
        $(".editor .windows > .window").draggable({
            handle: '.grip', scroll: false, snap: ".editor .window:not(.popup)", snapMode: "outer", drag: function (e, ui) {
                var h = S.editor.toolbar.height;
                if (ui.position.left >= S.window.w - $(this).width()) { ui.position.left = S.window.w - $(this).width(); }
                if (ui.position.top >= S.window.h - $(this).height()) { ui.position.top = S.window.h - $(this).height(); }
                if (ui.position.top <= h) { ui.position.top = h; }
                if (ui.position.left < 0) { ui.position.left = 0; }
            }
        });
    },

    resize: {
            leftSide: function (name) {
                var h = S.editor.toolbar.height;
                var window = $('.windows .win' + name),
                    item = S.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = S.elem.pos(window[0]); }
                item.resizealign = 'leftside';
                window.css({ left: 0, top: h, width: S.window.w / 2, height: S.window.h - h });
                window.find('.resize-leftside').hide();
                window.find('.resize-minimize, .resize-maximize, .resize-rightside').show();
                S.editor.window.windows[name] = item;
                S.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            rightSide: function (name) {
                var h = S.editor.toolbar.height;
                var window = $('.windows .win' + name),
                    item = S.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = S.elem.pos(window[0]); }
                item.resizealign = 'rightside';
                window.css({ left: S.window.w / 2, top: h, width: S.window.w / 2, height: S.window.h - h });
                window.find('.resize-rightside').hide();
                window.find('.resize-minimize, .resize-leftside, .resize-maximize').show();
                S.editor.window.windows[name] = item;
                S.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            maximize: function (name) {
                var h = S.editor.toolbar.height;
                var window = $('.windows .win' + name),
                    item = S.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = S.elem.pos(window[0]); }
                item.resizealign = 'maximize';
                window.css({ left: 0, top: h, width: S.window.w, height: S.window.h - h });
                window.find('.resize-maximize').hide();
                window.find('.resize-minimize, .resize-leftside, .resize-rightside').show();
                S.editor.window.windows[name] = item;
                S.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            minimize: function (name) {
                var window = $('.windows .win' + name),
                    item = S.editor.window.windows[name];
                item.resizealign = 'minimize';
                window.css({ left: item.curPos.x, top: item.curPos.y, width: item.curPos.w, maxHeight: item.curPos.h, height: 'auto' });
                window.find('.resize-minimize').hide();
                window.find('.resize-maximize, .resize-leftside, .resize-rightside').show();
                S.editor.window.windows[name] = item;
                S.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            callback: {
                //register & execute callbacks for when the editor window resizes
                items: [],

                add: function (elem, vars, onResize) {
                    this.items.push({ elem: elem, vars: vars, onResize: onResize });
                },

                remove: function (elem) {
                    for (var x = 0; x < this.items.length; x++) {
                        if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                    }
                },

                execute: function (elem, type) {
                    if (this.items.length > 0) {
                        switch (type) {
                            case '': case null: case 'onResize':
                                for (var x = 0; x < this.items.length; x++) {
                                    if (this.items[x].elem == elem || elem == null) {
                                        if (typeof this.items[x].onResize == 'function') {
                                            this.items[x].onResize();
                                        }
                                    }
                                } break;
                        }
                    }
                }
            }
    },

        getItem(div) {
            for (var item in this.windows) {
                if (this.windows[item].elem == div) { return this.windows[item]; }
            }
        },

    hide: function (e) {
        var c = null;
        //get window div
        if (typeof e.target != 'undefined') {
            c = $(e.target);
        } else {
            c = $(e);
        }
        if (c.hasClass('window') == false) {
            c = $(c.parents('.window'));
        }

        //get window info
        var item = S.editor.window.getItem(c[0]);

        //check for dialog
        if (item.dialog == true) {
            $('.dialog-bg').hide();
        }

        //finally, hide window
        c.hide();

    },

    hidePopUps: function () {
        S.editor.window.callback.click(null, 'bg');
    }
};