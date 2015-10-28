/// Websilk Platform : editor.js ///
/// <reference path="core/global.js" />
/// <reference path="core/view.js" />

S.editor = {
    enabled: false,

    load: function () {
        var htm = '';

        //initialize text editor
        S.editor.textEditor.init();

        //load photo library window in the background to initialize the body drop-zone
        S.editor.photos.init();
        setTimeout(function () { S.editor.photos.dropzone.init(); }, 100);

        //init component select custom menus
        S.editor.components.menu.items.addRule('textbox', '.menu-options');
        

        //add special words for URL
        S.url.special.add('dashboard', S.editor.dashboard.callback.url);

        //show editor
        if (arguments[0] === true) {
            this.show();
        }
    },

    hide: function () {
        if (S.editor.dashboard.visible == true) { return; }
        $('.editor > .toolbar, .editor > .windows, .tools').hide();
        $('.editor > .tab').show();
        $('.body').css({ top: 0 });
        $('body').removeClass('editing');
        this.enabled = false;

        //disable event callbacks
        S.events.doc.scroll.callback.remove('editor-scroll');
    },

    show: function (dashboard) {
        if (S.editor.dashboard.visible == true) { return; }
        $('.editor > .toolbar, .editor > .windows, .tools').show();
        $('.editor > .tab').hide();
        $('.body').css({ top: 50 });
        $('body').addClass('editing');
        this.enabled = true;
        S.editor.components.hideSelect();
        if (dashboard === true) {
            S.editor.dashboard.show('dashboard');
        } else {
            if (S.editor.dashboard.visible == true) {
                S.editor.dashboard.hide();
            }
        }

        //enable event callbacks
        S.events.doc.scroll.callback.add('editor-scroll', null, null, S.editor.events.doc.scroll.paint, S.editor.events.doc.scroll.end);
    },

    events: {
        url: {
            change: function () {
                var url = location.href.toLowerCase();
                //reload layers window
                if ($('.winLayers').length == 1) {
                    S.editor.layers.refresh();
                }

                //update dashboard
                if (S.editor.dashboard.visible == true) {
                    if (url.indexOf('dashboard') < 0) {
                        S.editor.dashboard.hide();
                    }
                }
            }
        },

        doc: {
            resize: function () {
                S.editor.components.resizeSelectBox();
                S.editor.window.callback.windowResize();
                if (S.editor.dashboard.visible == true) {
                    S.editor.dashboard.callback.resize();
                }
            },

            scroll: {
                paint: function () {
                    S.editor.components.resizeSelectBox();
                },

                end: function () {
                    S.editor.components.resizeSelectBox();
                }
            }
        }
    },

    dashboard: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        visible: false, init: false,

        show: function (url) {
            $('.webpage, .window').hide();
            $('body').addClass('dashboard');
            S.window.changed = true;
            S.window.pos();

            if ($('.editor > .toolbar')[0].style.display == 'none') { S.editor.show(); }
            $('.toolbar > .menu, .toolbar > .rightside > .savepage, .toolbar > .rightside > .close > a').hide();
            S.editor.dashboard.visible = true;

            //add callback for the url
            if (S.editor.dashboard.init == false) {
                S.editor.dashboard.init = true;
            }

            if ($('.winDashboardInterface').length == 0) {

                //load interface window
                S.editor.window.load('DashboardInterface', 'Dashboard/Interface/Load', {}, { x: 0, y: 50, w: '100%', h: '100%', toolbar: false });
                
                //load from url with a delay
                
            } else {
                $('.winDashboardInterface').addClass('dashboard').show();
                
            }
            S.editor.dashboard.loadFromUrl(url.toLowerCase());
            

            S.events.doc.resize.callback.add('dashboardresize', null, null, S.editor.dashboard.callback.resize, S.editor.dashboard.callback.resize);
            S.editor.dashboard.callback.resize();
        },

        hide: function () {
            $('.toolbar > .menu, .toolbar > .rightside > .savepage, .toolbar > .rightside > .close > a, .webpage').show();
            $('.winDashboardInterface, .winDashboardTimeline').hide();
            $('body, .interface').removeClass('dashboard');
            S.editor.dashboard.hideAllWindows();
            S.editor.dashboard.visible = false;
            S.window.changed = true;
            S.window.pos();
            for (win in S.editor.window.windows) {
                var item = S.editor.window.windows[win];
                if (item.w.toString().indexOf('%') < 0) {
                    $(item.elem).css({ width: item.w });
                }
                if (item.h.toString().indexOf('%') < 0) {
                    $(item.elem).css({ height: item.h });
                }
            }
        },

        hideAllWindows: function () {
            $('.window:not(.winDashboardInterface)').hide();
        },

        callback: {
            resize: function () {
                var pos = S.elem.pos($('.winDashboardInterface .dash-body')[0]);
                $('.window.interface.dashboard:not(.winDashboardInterface)').css({ top: 50, left: pos.x, width: pos.w, height: S.window.absolute.h - 50 }).find('.grip').hide();
                $('.dash-menu').css({ minHeight: S.window.absolute.h - 50 });
                $('ul.columns-first').each(function () {
                    this.style.width = '';
                    var pos = S.elem.offset($(this).find('li:last-child')[0]);
                    this.style.width = (pos.x + pos.w) + 'px';
                });
            },

            url: function (url) {
                if (S.editor.dashboard.visible == true) {
                    if (url.toLowerCase().indexOf('dashboard') == 0) {
                        S.editor.dashboard.loadFromUrl(url.toLowerCase());
                    }
                } else {
                    if (url.toLowerCase().indexOf('dashboard') == 0) {
                        S.editor.dashboard.show(url.toLowerCase());
                    }
                }
            }
        },

        loadFromUrl: function (url) {
            if (url.indexOf('dashboard/') == 0) {
                var arrurl = url.split('/');
                switch (arrurl[1]) {
                    case 'timeline':
                        S.editor.window.open.timeline(S.website.title);
                        break;

                    case 'pages':
                        S.editor.window.open.pages(S.website.title);
                        break;

                    case 'page-settings':
                        S.editor.window.open.pageSettings(arrurl[2], S.website.title);
                        break;

                    case 'photos':
                        S.editor.window.open.photoLibrary(S.editor.dashboard.visible ? 'dashboard' : null);
                        break;

                    case 'analytics':
                        S.editor.window.open.analytics(S.website.title);
                        break;

                    case 'designer':
                        S.editor.window.open.designer(S.website.title);
                        break;

                    case 'users':
                        S.editor.window.open.users(S.website.title);
                        break;

                    case 'apps':
                        S.editor.window.open.apps(S.website.title);
                        break;

                    case 'settings':
                        S.editor.window.open.websiteSettings(S.website.title);
                        break;

                    default:
                        S.editor.window.open.timeline(S.website.title);
                }
            } else if (url == 'dashboard') {
                S.editor.window.open.timeline(S.website.title);
            }
        }
    },

    window: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                div = win[0];
                if (autoHide == true && win[0].style.display != 'none') {
                    win.hide();
                } else {
                    S.editor.window.hidePopUps();
                    if (S.editor.dashboard.visible == true) {
                        if (win.hasClass('dashboard') == false) { win.addClass('dashboard'); }
                        S.editor.dashboard.hideAllWindows();
                        S.editor.dashboard.callback.resize();
                    }
                    win.show();
                }
            } else {
                //create new window
                S.editor.window.hidePopUps();
                var item = {
                    title: name, name: name.replace(/ /g, ''), x: 0, y: 50, w: 320, h: 240, maxh: 0, r: null, target: null,
                    align: null, arrow: null, spacing: 0, toolbar: true, classes: '', addResize: false, resizable: false,
                    popup: false, visible: true, zIndex: 0, resizealign: 'minimize', noDashboard: false, url: ''
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
                    if (options.target != null) { item.target = options.target; }
                    if (options.align != null) { item.align = options.align; }
                    if (options.arrow != null) { item.arrow = options.arrow; }
                    if (options.spacing != null) { item.spacing = options.spacing; }
                    if (options.toolbar != null) { item.toolbar = options.toolbar; }
                    if (options.popup != null) { item.popup = options.popup; item.classes += ' popup' }
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

                if (item.y < 50) { item.y = 50; }
                item = this.reposition(item);

                //create window using options
                div = document.createElement('div');
                div.className = 'window win' + item.name + ' draggable interface' + item.classes;

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
                    div.style.minHeight = (((S.window.absolute.h - item.y) / 100) * parseInt(item.h.replace('%', ''))) + 'px';
                    item.addResize = true;
                }
                if (item.w.toString().indexOf('%') < 0) { div.style.width = item.w + 'px'; } else {
                    div.style.width = (((S.window.absolute.w - item.x) / 100) * parseInt(item.w.replace('%', ''))) + 'px';
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
                        item.x = (win.absolute.w / 2) - (item.w / 2);
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
                item = S.editor.window.reposition(item);
                var pos = S.elem.pos(item.elem);
                if (item.resizealign == 'minimize') {
                    item.x = pos.x;
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
                    item.elem.style.minHeight = (((S.window.absolute.h - item.y) / 100) * parseInt(item.h.replace('%', ''))) + 'px';
                }

                if (item.w.toString().indexOf('%') > -1) {
                    item.elem.style.width = (((S.window.absolute.w - item.x) / 100) * parseInt(item.w.replace('%', ''))) + 'px';
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
                $('.editor .window > .content').css({ maxHeight: S.window.absolute.h - 80 });
                $('.editor .window.dashboard > .content').css({ maxHeight: S.window.absolute.h - 50 });
                S.editor.window.resize.callback.execute(null, 'onResize');
            }
        },

        open: {
            timeline: function () {
                S.editor.window.load('DashboardTimeline', 'Dashboard/Timeline/Load', {}, { x: 155, y: 50, w: 250, h: '100%', toolbar: false, isDashboard: S.editor.dashboard.visible, url: '' })
            },

            pages: function () {
                S.editor.window.load('WebPages', 'Dashboard/Pages/LoadPages', {}, { x: 0, align: 'center', y: 0, w: 600, h: 200, spacing: 50, postOnce: true, isDashboard: S.editor.dashboard.visible, title: 'Web Pages for \'' + S.website.title + '\'', url: 'pages' })
            },

            pageSettings: function (pageId) {
                S.editor.window.load('PageSettings', 'Dashboard/Pages/LoadSettings', { pageId: pageId },
                    { x: 0, align: 'center', y: 0, w: 400, h: 400, spacing: 50, postOnce: 'pageid', title: 'Page Settings for \'' + S.website.title + '\'', url: 'page-settings' });
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
            }
        },

        draggable: function () {
            $(".editor .windows > .window").draggable({
                handle: '.grip', scroll: false, snap: ".editor .window:not(.popup)", snapMode: "outer", drag: function (e, ui) {
                    if (ui.position.left >= S.window.absolute.w - $(this).width()) { ui.position.left = S.window.absolute.w - $(this).width(); }
                    if (ui.position.top >= S.window.absolute.h - $(this).height()) { ui.position.top = S.window.absolute.h - $(this).height(); }
                    if (ui.position.top <= 50) { ui.position.top = 50; }
                    if (ui.position.left < 0) { ui.position.left = 0; }
                }
            });
        },

        resize: {
            leftSide: function (name) {
                var window = $('.windows .win' + name),
                    item = S.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = S.elem.pos(window[0]); }
                item.resizealign = 'leftside';
                window.css({ left: 0, top: 50, width: S.window.absolute.w / 2, height: S.window.absolute.h - 50 });
                window.find('.resize-leftside').hide();
                window.find('.resize-minimize, .resize-maximize, .resize-rightside').show();
                S.editor.window.windows[name] = item;
                S.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            rightSide: function (name) {
                var window = $('.windows .win' + name),
                    item = S.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = S.elem.pos(window[0]); }
                item.resizealign = 'rightside';
                window.css({ left: S.window.absolute.w / 2, top: 50, width: S.window.absolute.w / 2, height: S.window.absolute.h - 50 });
                window.find('.resize-rightside').hide();
                window.find('.resize-minimize, .resize-leftside, .resize-maximize').show();
                S.editor.window.windows[name] = item;
                S.editor.window.resize.callback.execute(window[0], 'onResize');
            },

            maximize: function (name) {
                var window = $('.windows .win' + name),
                    item = S.editor.window.windows[name];
                if (item.resizealign == 'minimize') { item.curPos = S.elem.pos(window[0]); }
                item.resizealign = 'maximize';
                window.css({ left: 0, top: 50, width: S.window.absolute.w, height: S.window.absolute.h - 50 });
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
                //register & execute callbacks when the window resizes
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
                                    if (typeof this.items[x].onResize == 'function' && (this.items[x].elem == elem || elem == null)) {
                                        this.items[x].onResize();
                                    }
                                } break;
                        }
                    }
                }
            }
        },

        hide: function (e) {
            var c = null;
            if (typeof e.target != 'undefined') {
                c = $(e.target);
            } else {
                c = e;
            }
            if (c.hasClass('window') == true) {
                c.hide();
            } else {
                c.parents('.window').hide();
            }
        },

        hidePopUps: function () {
            S.editor.window.callback.click(null, 'bg');
        }
    },

    components: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        selected: null, hovered: null, hideTimer: null,
        selbox: $('.tools > .component-select'), disabled: false,
        posStart: { x: 0, y: 0, w: 0, h: 0 },

        //events

        dragNew: {
            item: {
                elem: null, pos: { x: 0, y: 0, w: 0, h: 0 }, curPos: { x: 0, y: 0 },
                cursorStart: { x: 0, y: 0 }, cursor: { x: 0, y: 0 }, winPos: null
            },
            timer: null, hasStarted: false, painting: false, moved: false,
            target: null, panel: null, above: null,

            start: function (e) {
                var elem = S.elem.fromEvent(e);
                var pos = S.elem.pos(elem);
                var mPos = { x: e.pageX, y: e.pageY };
                var win = S.window.pos(true);

                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                S.editor.components.dragNew.moved = false;
                S.editor.components.dragNew.hasStarted = true;
                S.editor.components.dragNew.item.elem = elem;
                S.editor.components.dragNew.item.pos = S.elem.offset(elem);
                S.editor.components.posStart = S.elem.offset(elem);
                S.editor.components.dragNew.item.cursorStart = {
                    x: mPos.x,
                    y: mPos.y,
                    scrolly: S.window.scrolly,
                    offset: { x: mPos.x - (pos.x + S.window.scrollx), y: mPos.y - (pos.y + S.window.scrolly) }
                };
                S.editor.components.dragNew.item.cursor = {
                    x: mPos.x + win.scrollx,
                    y: mPos.y + win.scrolly
                };
                S.editor.components.dragNew.item.wPos = S.elem.pos($('.winComponents')[0]);

                //get positions of panels
                S.panels.get();

                //bind document mouse events
                $(document).bind('mousemove', S.editor.components.dragNew.go);
                $(document).bind('mouseup', S.editor.components.dragNew.end);
            },

            started: function () {
                if (this.hasStarted == true && this.painting == false) {
                    S.editor.components.disabled = true;
                    this.painting = true;

                    //clone target icon
                    var div = document.createElement('div');
                    div.className = 'target';
                    $(div).append($(this.item.elem).clone());
                    $('.tools').before(div);
                    this.target = div;

                    //create panel border   
                    var div = document.createElement('div');
                    div.className = 'page-panel-border';
                    div.innerHTML = '&nbsp;';
                    $('.tools .borders').append(div);

                    //start paint timer
                    S.editor.components.dragNew.paint();
                }
            },

            go: function (e) {
                var parent = S.editor.components.dragNew;
                if (parent.painting == false) {
                    parent.started();
                }
                S.editor.components.dragNew.item.cursor.x = e.pageX;
                S.editor.components.dragNew.item.cursor.y = e.pageY;

                var mDiff = {
                    x: (parent.item.cursor.x - parent.item.cursorStart.x),
                    y: (parent.item.cursor.y - parent.item.cursorStart.y)
                };
                var x = parent.item.pos.x + mDiff.x + parent.item.wPos.x,
                    y = parent.item.pos.y + mDiff.y + parent.item.cursorStart.scrolly + parent.item.wPos.y;
                $(parent.target).css({ left: x, top: y });
            },

            paint: function () {
                var mDiff = {
                    x: (this.item.cursor.x - this.item.cursorStart.x),
                    y: (this.item.cursor.y - this.item.cursorStart.y)
                }, wPos = this.item.wPos;
                var x = this.item.pos.x + mDiff.x + wPos.x,
                    y = this.item.pos.y + mDiff.y + this.item.cursorStart.scrolly + wPos.y;

                if (this.item.curPos.x != x || this.item.curPos.y != y) {
                    this.item.curPos = { x: x, y: y, w: this.item.pos.w };

                    if (mDiff.x != 0 || mDiff.y != 0) { this.moved = true; }


                    //find nearest panel 
                    var offset = { x: x + this.item.cursorStart.offset.x, y: y + this.item.cursorStart.offset.y }
                    var panels = $.nearest(offset, '.ispanel');
                    var max = 0, len, panel, novis = false;
                    for (z = 0; z < panels.length; z++) {
                        //make sure panel is visible
                        novis = false;
                        if (panels[z].style.display == 'none') { novis = false; }
                        else {
                            if ($(panels[z].parentNode).hasClass('slide') == true) {
                                var slides = $(panels[z]).parents('.slides')[0];
                                var sPos = S.elem.offset(slides);
                                var pPos = S.elem.offset(panels[z]);
                                if (pPos.x >= sPos.w || pPos.x + pPos.w <= 0) { novis = true; }
                                if (pPos.y >= sPos.h || pPos.y + pPos.h <= 0) { novis = true; }
                            }
                        }
                        if (novis == false) {
                            len = $(panels[z]).parentsUntil('.webpage').length;
                            if (len > max) { max = len; panel = panels[z]; }
                        }

                    }

                    if (panel != undefined) {
                        var pos = S.elem.pos(panel);
                        $('.tools .borders .page-panel-border').css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                        this.panel = panel;

                        //find nearest component within the panel
                        //offset.tolerance = 50;
                        var comps = $.nearest(offset, '.inner' + panel.id + ' > .component');
                        if (comps.length > 0) {
                            //check if mouse pos is above/left or below/right of component
                            var isabove = false;
                            var isfirst = false;
                            var comp = comps[0];
                            var cPos = S.elem.pos(comp);
                            if (offset.y < cPos.y + (cPos.h / 4)) {
                                isabove = true;
                            }
                            if (offset.x < cPos.x + (cPos.w / 4)) {
                                isabove = true;
                            }
                            if (comp.previousSibling == null && isabove == true) {
                                isfirst = true;
                            }
                            cPos = S.elem.pos(comp);

                            if ((this.above != comp && typeof comp != 'undefined') || (isabove == false && this.above != (comp.nextSibling || 1))) {
                                //destroy border
                                $('.tools .borders .left-border').remove();
                                //create new box placeholder
                                var div = document.createElement('div');
                                div.className = 'left-border';
                                div.innerHTML = '&nbsp;';
                                var border = { x: 0, y: 0, h: 0 };
                                if (isfirst == true && isabove == true) {
                                    border.x = cPos.x;
                                    border.y = cPos.y + 3;
                                    border.h = cPos.h;
                                    this.above = comp;
                                } else if (isabove == true) {
                                    border.x = cPos.x;
                                    border.y = cPos.y;
                                    border.h = cPos.h;
                                    this.above = comp;
                                } else {
                                    border.x = cPos.x + cPos.w;
                                    border.y = cPos.y;
                                    border.h = cPos.h;
                                    this.above = comp.nextSibling || 1;
                                    if (this.above.nodeName == '#text') { this.above = this.above.nextSibling || 1; }
                                }
                                $(div).css({ left: border.x, top: border.y, height: border.h, width: 1 });
                                $('.tools .borders').append(div);

                            }
                        } else {
                            this.above = 2;
                            //destroy border
                            $('.tools .borders .left-border').remove();
                        }
                    }
                }



                if (this.hasStarted == true) {
                    setTimeout(function () { S.editor.components.dragNew.paint(); }, 100);
                }
            },

            end: function () {
                var d = S.editor.components.dragNew;
                S.editor.components.dragNew.hasStarted = false;

                //unbind document mouse up event
                $(document).unbind('mousemove', d.go);
                $(document).unbind('mouseup', d.end);

                if (d.painting == true && d.moved == true) {
                    //drop component into panel
                    var cid = d.item.elem.getAttribute('cid'),
                        panel = d.panel;
                    var pid = panel.id.substr(5), selector = '#' + panel.id + ' .inner' + panel.id;
                    var pPos = S.elem.pos(panel),
                        pos = d.item.curPos;
                    var x = pos.x - pPos.x - S.window.scrollx,
                        y = pos.y - pPos.y - S.window.scrolly;
                    var tc = (x - (Math.round((pPos.w - pos.w) / 2)));
                    var responsive = 'px,px,px,,<tc>,' + x + ',' + y + ',<w>,,,,,px';
                    var pContain = $(panel).parents('.component');
                    var zIndex = parseInt(pContain.length > 0 ? pContain[0].style.zIndex : 99 || 99) + $(pid + ' > .component').length + 1;
                    var aboveId = '';
                    //get id of component to drop component above
                    if (d.above != null) {
                        if (d.above == 1 || d.above == 2) {
                            aboveId = 'last';
                        } else {
                            aboveId = d.above.id.substr(1);
                        }
                    }

                    //send request to server for new component
                    var options = { componentId: cid, panelId: pid, selector: selector, aboveId: aboveId, duplicate: '' };
                    S.ajax.post('/api/Editor/NewComponent', options, S.ajax.callback.inject);

                } else if (d.moved == false) {
                    //cancel drag
                }
                $(d.target).remove();
                $('.tools .borders .page-panel-border, .tools .borders .left-border').remove();
                S.editor.components.dragNew.painting = false;
                S.editor.components.disabled = false;

            }
        },

        drag: {
            item: {
                elem: null, pos: { x: 0, y: 0, w: 0, h: 0 },
                cursorStart: { x: 0, y: 0 }, cursor: { x: 0, y: 0 }
            },
            timer: null, hasStarted: false, startedTime: null, painting: false, disabled: false, vertical: false, moved: false,
            start: function (e) {
                //execute $start function in order to change global variable 'this'
                //to point to S.editor.components.drag
                S.editor.components.drag.$start(e);
            },

            $start: function (e) {
                var comp = S.editor.components.hovered;
                this.startedTime = new Date();
                if (S.editor.enabled == false) { return; }
                if (comp) { if (comp.id == 'inner') { return; } }
                if ($(e.target).hasClass('component-select') == false && $(e.target).parents('.arrow-down').length == 0) { return; }
                if (this.disabled == true) { return; }
                this.panel = S.elem.panel(comp);
                this.panelPos = S.elem.pos(this.panel);
                this.moved = false;
                this.hasStarted = true;
                this.above = -1;
                this.item.elem = comp;
                S.editor.components.posStart = S.elem.pos(comp);
                this.item.pos = S.elem.pos(comp);
                this.item.offset = S.elem.offset(comp);
                this.item.offset.x = parseInt($(comp).css('left')) || 0;
                this.item.offset.y = parseInt($(comp).css('top')) || 0;
                this.item.left = parseInt(comp.style.left.replace('px', '')) || 0;
                this.item.top = parseInt(comp.style.top.replace('px', '')) || 0;
                this.item.absolute = {
                    x: this.item.pos.x - this.item.left,
                    y: this.item.pos.y - this.item.top,
                }

                var mPos = { x: e.pageX, y: e.pageY };
                var win = S.window;
                this.item.cursorStart = {
                    x: mPos.x,
                    y: mPos.y,
                    comp: {
                        x: mPos.x - this.item.pos.x,
                        y: mPos.y - this.item.pos.y
                    }
                };
                this.item.cursor = {
                    x: mPos.x + win.scrollx,
                    y: mPos.y + win.scrolly
                };
                if ($(e.target).hasClass('arrow-down') == true || $(e.target).parents('.arrow-down').length > 0) {
                    this.vertical = true;
                } else {
                    this.vertical = false;
                }

                //bind document mouse events
                $(document).bind('mousemove', this.go);
                $(document).bind('mouseup', this.end);
            },

            started: function () {
                if (this.disabled == true) { return; }
                if (this.hasStarted == true && this.painting == false) {
                    S.editor.components.disabled = true;
                    this.painting = true;

                    //modify component select
                    $('.component-select').css({ opacity: 0 });

                    //create barrier on page
                    var div = document.createElement('div');
                    div.className = 'barrier';
                    div.style.width = S.window.absolute.w + 'px';
                    div.style.height = S.window.absolute.h + 'px';
                    $('.editor').append(div);

                    //start paint timer
                    this.paint();
                }
            },

            go: function (e) {
                if (new Date() - S.editor.components.drag.startedTime < 200) { return; }
                if (S.editor.components.drag.disabled == true) { return; }
                if (S.editor.components.drag.painting == false) {
                    S.editor.components.drag.started();
                }
                S.editor.components.drag.item.cursor.x = e.pageX;
                S.editor.components.drag.item.cursor.y = e.pageY;
            },

            paint: function () {
                if (this.painting == false) { return; }
                if (this.disabled == true) { return; }
                var mDiff = {
                    x: (this.item.cursor.x - this.item.cursorStart.x),
                    y: (this.item.cursor.y - this.item.cursorStart.y)
                }

                if (this.vertical == true) { mDiff.x = 0; }

                var pos = {
                    x: this.item.offset.x + mDiff.x,
                    y: this.item.offset.y + mDiff.y
                }

                var offset = { x: this.item.pos.x + mDiff.x + this.item.cursorStart.comp.x, y: this.item.pos.y + mDiff.y + this.item.cursorStart.comp.y };

                if (mDiff.x != 0 || mDiff.y != 0) { this.moved = true; }
                $(this.item.elem).css({ left: pos.x, top: pos.y });

                //check if new placeholder should be made if cursor is in range
                //find nearest component within the panel
                //offset.tolerance = 50;
                var comps = $.nearest(offset, '.' + this.item.elem.parentNode.className.replace(/\s/g, '.') + ' > .component:not(#' + this.item.elem.id + ')');
                if (comps.length > 0) {
                    //check if mouse pos is above/left or below/right of component
                    var isabove = false;
                    var isfirst = false;
                    var comp = comps[0];
                    if (comp == this.item.elem) {
                        if (comps.length > 1) { comp = comps[1]; }
                    }
                    var cPos = S.elem.pos(comp);
                    if (offset.y < cPos.y + (cPos.h / 4)) {
                        isabove = true;
                    }
                    if (offset.x < cPos.x + (cPos.w / 4)) {
                        isabove = true;
                    }
                    if (comp.previousSibling == null && isabove == true) {
                        isfirst = true;
                    }
                    cPos = S.elem.pos(comp);

                    if ((this.above != comp && typeof comp != 'undefined') || (isabove == false && this.above != (comp.nextSibling || 1))) {
                        //destroy border
                        $('.tools .borders .left-border').remove();
                        //create new box placeholder
                        var div = document.createElement('div');
                        div.className = 'left-border';
                        div.innerHTML = '&nbsp;';
                        var border = { x: 0, y: 0, h: 0 };
                        if (isfirst == true && isabove == true) {
                            border.x = cPos.x;
                            border.y = cPos.y + 3;
                            border.h = cPos.h;
                            this.above = comp;
                        } else if (isabove == true) {
                            border.x = cPos.x;
                            border.y = cPos.y;
                            border.h = cPos.h;
                            this.above = comp;
                        } else {
                            border.x = cPos.x + cPos.w;
                            border.y = cPos.y;
                            border.h = cPos.h;
                            this.above = comp.nextSibling || 1;
                        }
                        $(div).css({ left: border.x, top: border.y, height: border.h, width: 1 });
                        $('.tools .borders').append(div);
                        this.moved = true;

                    }
                } else {
                    this.above = 2;
                    //destroy border
                    $('.tools .borders .left-border').remove();
                }

                S.editor.components.resizeSelectBox();

                if (this.hasStarted == true) {
                    setTimeout(function () { S.editor.components.drag.paint(); }, 33);
                }
            },

            end: function () {
                var drag = S.editor.components.drag;
                S.editor.components.drag.hasStarted = false;

                //unbind document mouse up event
                $(document).unbind('mousemove', drag.go);
                $(document).unbind('mouseup', drag.end);
                if (drag.painting == true && drag.disabled == false && drag.moved == true) {
                    S.editor.components.drag.painting = false;

                    //rearrange components in DOM
                    var arranged = false;
                    if (drag.above != -1 && drag.above != null) {
                        if (drag.above != 2 && drag.above != 1) {
                            //move component above the target
                            if ($(drag.above).prev('div')[0] != drag.item.elem) {
                                $(drag.item.elem).insertBefore(drag.above);
                                arranged = true;
                            }
                        } else if (drag.above == 1) {
                            //move to very bottom
                            if (drag.item.elem.parentNode.lastChild != drag.item.elem) {
                                $(drag.item.elem).insertAfter(drag.item.elem.parentNode.lastChild);
                                arranged = true;
                            }
                        } else if (drag.above == 2) {
                            //move component to top
                            if (drag.item.elem.parentNode.firstChild != drag.item.elem) {
                                $(drag.item.elem).insertBefore(drag.item.elem.parentNode.firstChild);
                                arranged = true;
                            }
                        }
                    } else {
                        if (drag.panel.firstChild != drag.item.elem) {
                            //move component to top
                            if (drag.item.elem.parentNode.firstChild != drag.item.elem) {
                                $(drag.item.elem).insertBefore(drag.item.elem.parentNode.firstChild);
                                arranged = true;
                            }
                        }
                    }
                    if (arranged == true) {
                        //save new arrangement of components for server-side
                        S.editor.components.saveArrangement(drag.panel);
                    }

                    $(drag.item.elem).css({ left: '', top: '' });
                    $('.tools .borders .left-border').remove();

                    //show component select
                    setTimeout(function () {
                        //S.editor.components.selected = null;
                        S.editor.components.disabled = false;
                        S.editor.components.mouseEnter(S.editor.components.drag.item.elem);

                        //save position
                        S.editor.components.menu.save.position();

                        $('.component-select').animate({ opacity: 1 }, 300);
                    }, 10);

                } else if (drag.moved == false) {
                    //cancel drag & click instead
                    $('.component-select').css({ opacity: 1 });
                    S.editor.components.hideSelect('drag');
                    S.editor.components.disabled = false;
                }
                S.editor.components.drag.painting = false;

                $('.editor > .barrier').remove();

            }
        },

        resize: {
            options: {
                pad: { left: 0, right: 0, top: 0, bottom: 0 }, inner: { left: false, right: false, top: false },
                side: 't', cursor: { x: 0, y: 0 }, cursorStart: { x: 0, y: 0 }, elemStart: { x: 0, y: 0, w: 0, h: 0 }, offset: { x: 0, y: 0 },
                elemPos: { x: 0, y: 0, w: 0, h: 0 }, panelPos: { x: 0, y: 0, w: 0, h: 0 }, elem: null, timer: null, hasStarted: false,
                corner: 20, border: 5, autoHeight: false, autoResize: false, rIndex: 0, isPanel: false, startTimer: null
            },

            start: function (e) {
                //execute $start function in order to change global variable 'this'
                //to point to S.editor.components.resize
                S.editor.components.resize.$start(e, $(this));
            },

            $start: function (e, bar) {
                if (S.editor.enabled == false) { return; }
                if (S.editor.components.disabled == true) { return; }
                if (S.editor.components.hovered.id == 'inner') { return; }

                var c = S.editor.components.hovered;
                var mPos = { x: e.pageX + S.window.scrollx, y: e.pageY + S.window.scrolly };
                var p = S.elem.panel(c);
                var position = S.components.cache[c.id].position[S.viewport.level];

                //setup options
                S.editor.components.disabled = true;
                this.options.hasStarted = true;
                S.editor.components.drag.disabled = true;
                S.editor.components.posStart = S.elem.offset(S.editor.components.hovered);
                this.options.elem = c;
                this.options.cursor.x = mPos.x;
                this.options.cursor.y = mPos.y;
                this.options.cursorStart.x = mPos.x;
                this.options.cursorStart.y = mPos.y;
                this.options.elemPos = S.elem.pos(c);
                this.options.panelPos = S.elem.pos(p);
                this.options.elemStart = {
                    x: this.options.elemPos.x - this.options.offset.x,
                    y: this.options.elemPos.y - this.options.offset.y,
                    w: this.options.elemPos.w,
                    h: this.options.elemPos.h
                }
                this.options.autoHeight = true;
                this.options.autoResize = false;
                if (position != '' && position != null) {
                    var arr = position.split(',');
                    if (arr[9] != 'auto') {
                        this.options.autoHeight = false;
                    }
                }
                this.options.left = parseInt(c.style.left.replace('px', '')) || 0;
                this.options.top = parseInt(c.style.top.replace('px', '')) || 0;
                this.options.absolute = {
                    x: this.options.elemPos.x - this.options.left,
                    y: this.options.elemPos.y - this.options.top,
                }
                this.options.classes = S.util.css.objects($(c));
                this.options.margin = this.options.classes['margin-right'];


                //get selected resize side or corner
                if (bar.hasClass('resize-top') == true) {
                    this.options.side = 't';
                } else if (bar.hasClass('resize-top-right') == true) {
                    this.options.side = 'tr';
                } else if (bar.hasClass('resize-right-top') == true) {
                    this.options.side = 'tr';
                } else if (bar.hasClass('resize-right') == true) {
                    this.options.side = 'r';
                } else if (bar.hasClass('resize-right-bottom') == true) {
                    this.options.side = 'br';
                } else if (bar.hasClass('resize-bottom-right') == true) {
                    this.options.side = 'br';
                } else if (bar.hasClass('resize-bottom') == true) {
                    this.options.side = 'b';
                } else if (bar.hasClass('resize-bottom-left') == true) {
                    this.options.side = 'bl';
                } else if (bar.hasClass('resize-left-bottom') == true) {
                    this.options.side = 'bl';
                } else if (bar.hasClass('resize-left') == true) {
                    this.options.side = 'l';
                } else if (bar.hasClass('resize-left-top') == true) {
                    this.options.side = 'tl';
                } else if (bar.hasClass('resize-top-left') == true) {
                    this.options.side = 'tl';
                }

                //modify component select
                $('.component-select .menu, .component-select .properties, .component-select .arrow-down, .editor .windows').hide();
                $('.component-select').stop().css({ opacity: 0.3 });

                //create barrier on page
                var div = document.createElement('div');
                div.className = 'barrier';
                div.style.width = S.window.absolute.w + 'px';
                div.style.height = S.window.absolute.h + 'px';
                $('.editor').append(div);

                //bind document mouse events
                $(document).bind('mousemove', this.go);
                $(document).bind('mouseup', this.end);

                //start timer
                this.timer = setTimeout(function () { S.editor.components.resize.paint(); }, 50);
            },

            go: function (e) {
                S.editor.components.resize.options.cursor.x = e.pageX + S.window.scrollx;
                S.editor.components.resize.options.cursor.y = e.pageY + S.window.scrolly;
            },

            paint: function () {
                if (this.options.hasStarted == false) { return; }
                var pos = { w: this.options.elemStart.w, h: this.options.elemStart.h };
                var mDiff = {
                    x: this.options.cursor.x - this.options.cursorStart.x,
                    y: this.options.cursor.y - this.options.cursorStart.y
                }
                var perc = false;
                var center = 1;
                if ($(this.options.elem).css('display').indexOf('inline-block') == 0 ||
                    this.options.margin.indexOf('auto') >= 0) { center = 2; }
                if (this.options.elem.style.width.indexOf('%') >= 0) { perc = true; }
                if (perc == true) {
                    //find new percentage value
                } else {
                    switch (this.options.side) {
                        case 't'://top
                            pos.h -= mDiff.y;
                            break;
                        case 'tr'://top-right
                            pos.h -= mDiff.y;
                            pos.w += (mDiff.x * center);
                            break;
                        case 'r'://right
                            pos.w += (mDiff.x * center);
                            break;
                        case 'br'://bottom-right
                            pos.h += mDiff.y;
                            pos.w += (mDiff.x * center);
                            break;
                        case 'b'://bottom
                            pos.h += mDiff.y;
                            break;
                        case 'bl'://bottom-left
                            pos.w -= (mDiff.x * center);
                            break;
                        case 'l'://left
                            pos.w -= (mDiff.x * center);
                            break;
                        case 'tl'://top-left
                            pos.h -= mDiff.y;
                            pos.w -= (mDiff.x * center);
                            break;
                    }
                }

                if (this.options.autoHeight == false) {
                    $(this.options.elem).css({ height: pos.h });
                }
                if (this.options.autoResize == false) {
                    $(this.options.elem).css({ maxWidth: pos.w });
                }
                S.editor.components.resizeSelectBox();
                if (this.options.hasStarted == true) {
                    setTimeout(function () { S.editor.components.resize.paint(); }, 33);
                }
            },

            end: function () {
                S.editor.components.resize.options.hasStarted = false;
                $('.editor > .barrier').remove();

                //unbind document mouse move event
                $(document).unbind('mousemove', S.editor.components.resize.go);
                $(document).unbind('mouseup', S.editor.components.resize.end);

                //modify component select
                $('.component-select .menu, .component-select  .arrow-down, .editor .windows').show();
                $('.component-select').stop().css({ opacity: 1 });
                setTimeout(function () {
                    S.editor.components.drag.disabled = false;
                    S.editor.components.disabled = false;
                    //S.editor.components.selected = null;
                    //S.editor.components.hovered = null;
                    S.editor.components.drag.painting = false;
                    S.editor.components.mouseEnter(S.editor.components.resize.options.elem);

                    //save component position
                    var side = S.editor.components.resize.options.side;
                    //var s = 0;
                    //if (side == 'b' || side == 'br' || side == 'bl') { s = 1;}
                    S.editor.components.menu.save.position(1);//, s);
                }, 10);


            }
        },

        mouseEnter: function () {
            var comps = S.editor.components;
            if (S.editor.enabled == false) { return; }
            if (comps.disabled == true) { return; }
            comps.menu.hideAll();
            $('.component-select .properties').hide();
            var c = this, selectType = '', isalsopanel = false, sel = comps.selected, reselect = false;
            if (comps.hovered != null) {
                $('.tools > .component-select').stop();
            }
            if (typeof arguments[0].id != 'undefined') {
                c = arguments[0];
            }
            if (arguments.length > 1) {
                if (arguments[1] == 1) { reselect = true; }
            }
            if (c == sel) { return; }

            //check if hovered element is inner panel cell
            if (c.id == 'inner') {
                //cancel if hovered element is not a panel cell from a panel component
                if (sel == null && reselect == false) { return; }
                var p = S.elem.panelCell(c);
                if (p == null) { return; }
                var parentId = p.id;
                //check if there is a selected element
                if (sel != null) {
                    //check if hovered element is inside selected element
                    if (sel.id != 'inner') {
                        if ($('#' + sel.id + ' .' + c.className.replace(' ', '.')).length == 0) {
                            if ($(sel).parents('.ispanel').find(c).length == 0) {
                                //cancel if selected element 
                                return;
                            }
                        }
                    }
                    //check if hovered panel cell element has siblings
                    var parent = $('#' + parentId).parent();
                    if (parent.hasClass('arrange-grid') == true || parent.hasClass('arrange-rows') == true) {
                        //cancel if panel cell has no siblings
                        if ($('#' + p.parentNode.id + ' > .ispanel').length == 1) { return; }
                    } else {
                        //no grid, no need for showing panel cell
                        return;
                    }
                }
                selectType = 'cell';
            }

            //check selected element
            if (sel != null) {
                if (sel.id == 'inner') {
                    if (c.id != 'inner') {
                        //check if hovered element is a panel
                        if ($(c).hasClass('type-panel') == true) {
                            if ($(sel).closest('.type-panel')[0] == c) {
                                if (arguments[0].stopPropagation) { arguments[0].stopPropagation(); }
                                return;
                            }
                        }

                    }
                } else if (c.id != 'inner') {
                    if ($(sel).parents('#' + c.id).length > 0) { return; }
                } else if (c.id == 'inner') {
                    if ($(c).find(sel).length > 0) { return; }
                }

                //cancel if selected element is a child of hovered element
                if ($(c).find(sel).length > 0) { return; }
            }


            if (sel != c) {
                //setup & show component select
                if (sel == null) {
                    var p = $(c).parents('.component.type-panel');
                    if (p.length > 0) {
                        S.editor.components.selected = p[0];
                    }
                }
                S.editor.components.hovered = c;

                $('.tools > .component-select').show().stop().css({ opacity: 1 });

                if (S.components.cache[c.id] != undefined) {
                    comps.menu.items.load(S.components.cache[c.id].type.replace('/', '-'));
                } else {
                    comps.menu.items.load('cell');
                }

                comps.resizeSelectBox();

                //remove all special classes
                $('.tools > .component-select').removeClass('isalsopanel isalsocell');

                //update component select class for color change
                if ($(c).hasClass('type-panel') == true) {
                    //check if hovered panel cell element has siblings
                    selectType = 'cell';
                    isalsopanel = true;
                } else if ($(c).hasClass('inner-panel') == true) {
                    selectType = 'cell';
                    var p = S.elem.panelCell(c);
                    if (p == null) { return; }
                    p = p.parentNode;
                    if ($('#' + p.id + ' > .ispanel').Length == 1) {
                        isalsopanel = true;
                    }
                }

                if (selectType == 'cell') {
                    $('.tools > .component-select').addClass('forpanel');
                    if (isalsopanel == false) {
                        $('.tools > .component-select').addClass('isalsocell');
                        $('.tools > .component-select .arrow-down').hide();
                    } else {
                        $('.tools > .component-select').addClass('isalsopanel');
                        $('.tools > .component-select .arrow-down').show();
                    }

                    //add custom quickmenus
                    //comps.quickmenu.show(comps.hovered, 'cell');

                } else {
                    $('.tools > .component-select').removeClass('forpanel');
                    $('.tools > .component-select .arrow-down').show();
                    $('.tools > .component-select .quickmenu').show();

                    //add custom quickmenu
                    //if ($(c).hasClass('type-panel') == true) {
                    //    comps.quickmenu.show(comps.hovered, 'panel');
                    //}else{
                    //    comps.quickmenu.show(comps.hovered, 'component');
                    //}

                }
                comps.callback.execute('onHover', comps.hovered);

            }
            $('.tools > .component-select').css({ opacity: 1 }).off('mouseleave').on('mouseleave', null, comps.hovered, comps.mouseLeave);

            //load menu
            comps.menu.load();

            //cancel leave timer
            clearTimeout(comps.hideTimer);
        },

        mouseLeave: function (e) {
            if (S.editor.enabled == false) { return; }
            if (S.editor.components.disabled == true) { return; }

            if (e.data == S.editor.components.hovered) {

                //fix for IE ---------
                var hide = true;
                if (e.relatedTarget) {
                    if (e.relatedTarget.tagName == 'path') { hide = false; }
                }
                // end fix for IE ----
                if (hide == true) {
                    S.editor.components.hideTimer = setTimeout(function () {
                        S.editor.components.hideSelect('leave');
                    }, 10);
                }
            }

        },

        click: function (target, type) {
            var comps = S.editor.components;
            if (S.editor.enabled == false) { return; }
            if (comps.disabled == true) {
                comps.callback.execute('onHide', comps.selected, target);
                return;
            }
            if (type == 'component-select') {
                //select component
                if ($(target).hasClass('component-select') == false) { return; }
                if (comps.selected != comps.hovered) {
                    if (comps.selected != null) { comps.callback.execute('onHide', comps.selected); }
                    S.editor.components.selected = comps.hovered;
                    comps.hideSelect('select');
                    comps.callback.execute('onClick', comps.selected);
                }
            } else {
                if (type != 'window' && type != 'toolbar' && type != 'tools') {
                    //deselect component
                    var t = target, hide = false;
                    if (type == 'component') {
                        if ($(t).hasClass('component') == true) {
                            if ($(t).hasClass('type-panel') == true || $(t).hasClass('inner-panel') == true) {
                                //mouseEnter only if the component is a panel
                                t = $(t).parent('.component')[0];
                            }
                        }
                    }
                    if (t == comps.selected || comps.selected == null || $(t).find(comps.selected).length > 0) {
                        //clicked selected panel to allow mouseEnter
                        comps.callback.execute('onHide', comps.selected, target);
                        S.editor.components.selected = null;
                        comps.hideSelect();
                        comps.mouseEnter(t, 1);
                        hide = false;
                    } else {
                        if (comps.selected != null) {
                            if ($(t).parents(comps.selected).length == 0) {
                                hide = true;
                            }
                        } else { hide = true; }
                    }
                    if (type == 'bg') {
                        hide = true;
                        if (comps.hovered == null) { S.editor.components.hovered = comps.selected; }
                    }
                    if (hide == true) {
                        //completely deselect component
                        comps.callback.execute('onHide', comps.hovered, target);
                        S.editor.components.selected = null;
                        comps.hideSelect();
                    }
                }

            }

        },

        nudge: function (dir, speed) {
            if (this.hovered != null) {
                var c = this.hovered;
                if (c.style.top == '') { c.style.top = "0px"; }
                if (c.style.left == '') { c.style.left = "0px"; }
                switch (dir) {
                    case 'up':
                        $(c).css({ top: "-=" + speed });
                        break;
                    case 'right':
                        $(c).css({ left: "+=" + speed });
                        break;
                    case 'down':
                        $(c).css({ top: "+=" + speed });
                        break;
                    case 'left':
                        $(c).css({ left: "-=" + speed });
                        break;
                }
                this.resizeSelectBox();
                //delay, save position into responsive design settings
                setTimeout(function () {
                    var c = S.editor.components.hovered;
                    if (c != null) {
                        S.editor.components.menu.save.position();
                    }
                }, 100);
            }
        },

        callback: {
            items: [],

            add: function (elem, vars, onHover, onClick, onResize, onHide) {
                this.items.push({ elem: elem, vars: vars, onHover: onHover, onClick: onClick, onResize: onResize, onHide: onHide });
            },

            remove: function (elem) {
                for (var x = 0; x < this.items.length; x++) {
                    if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
                }
            },

            execute: function (type, target, extra) {
                if (this.items.length > 0) {
                    for (var x = 0; x < this.items.length; x++) {
                        //if (this.items[x].elem == target) {
                        switch (type) {
                            case '': case null: case 'onHover':
                                if (typeof this.items[x].onHover == 'function') {
                                    this.items[x].onHover(target);
                                }
                                break;

                            case 'onClick':
                                if (typeof this.items[x].onClick == 'function') {
                                    this.items[x].onClick(target);
                                }
                                break;

                            case 'onResize':
                                if (typeof this.items[x].onResize == 'function') {
                                    this.items[x].onResize(target, extra);
                                }
                                break;

                            case 'onHide':
                                if (typeof this.items[x].onHide == 'function') {
                                    this.items[x].onHide(target, extra);
                                }
                                break;
                        }
                        //break;
                        //}
                    }
                }
            }
        },

        //component window

        toolbar: {
            mouseEnter: function (elem) {
                //show tooltip for component
                $('.winComponents #component-info')[0].innerHTML =
                    "<h4>" + elem.getAttribute("cname") + "</h4>" +
                    "<div class=\"info\">" + elem.getAttribute("ctitle") + "</div>";
            },

            mouseLeave: function () {
                //hide tooltip
                $('.winComponents #component-info')[0].innerHTML = "&nbsp;";
            }
        },

        category: {
            load: function (id) {
                S.ajax.post('/api/Editor/ComponentsFromCategory', { category: id },
                    function (data) {
                        S.ajax.callback.inject(data);
                        $('.window.winComponents #component-categories').hide();
                        $('.window.winComponents #components').show();
                    });
            }
        },

        //component select

        menu: {
            showing: null,

            show: function (tab) {
                var p = $('.component-select .properties');
                var ishidden = true;
                if ($('.component-select .section-' + tab)[0].style.display != 'none' && p[0].style.display != 'none' && arguments[1] == null) {
                    this.hideAll(); return;
                }
                if (p[0].style.display != 'none') { ishidden = false; }
                this.hideAll();
                $('.component-select .section-' + tab).show();
                p.css({ opacity: 0, width: '' }).show();
                var cPos = S.elem.pos(S.editor.components.hovered),
                    pPos = S.elem.offset(p[0]),
                    mPos = S.elem.offset($('.component-select .menu')[0]),
                    options = S.editor.components.resize.options;
                var pos = { x: mPos.x + mPos.w, y: 0 }
                if (pPos.w < 200) { pPos.w = 200; }

                if (options.inner.right == true) {
                    //display window inside component select next to menu
                    pos.x = mPos.x + 3;
                    p.css({ opacity: 1, left: pos.x - pPos.w});
                } else {
                    
                    if (cPos.x + mPos.x + pPos.w + 40 >= S.window.w) {
                        //display window inside component select next to resize bar
                        pos.x = mPos.x - options.border;    
                        p.css({ opacity: 1, left: pos.x - pPos.w});
                    } else {
                        //display window outside component next to menu
                        p.css({ opacity: 1, left: pos.x - options.border + 2});
                    }

                }
                if (ishidden == true) { this.load(); }
                S.editor.components.resizeSelectBox();
            },

            hideAll: function () {
                $('.component-select .properties > .box > div').hide();
                $('.component-select .properties').hide();
                $('.component-select .menu .item').css({ left: 0, paddingLeft: 0, paddingRight: 0 });
            },

            items: {
                rules: [],

                addRule: function (componentName, hideItems) {
                    //adds a rule to hide certain items when displaying custom menu items for a specific component type
                    //hideItems is selector of items to hide, example: ".menu-options, .menu-layer"
                    this.rules.push({ componentName: componentName, hideItems: hideItems });
                },

                add: function (componentName, menuName, iconHtm, append, onclick, onenter, onleave) {
                    //add a custom menu item to the list of items
                    var div = document.createElement('div');
                    div.className = 'item menu-' + menuName + ' for-' + componentName;
                    if (onclick != null) { div.setAttribute('onclick', onclick); }
                    if (onenter != null && onleave != null) {
                        $(div).mouseenter(onenter);
                        $(div).mouseleave(onleave);
                    }
                    div.innerHTML = iconHtm;
                    if (append == null || append == 'after') {
                        $('.component-select .menu').append(div);
                    } else if (append == 'before') {
                        $('.component-select .menu').prepend(div);
                    } else if (isNumeric(append) == true) {
                        $('.component-select .menu > div:nth-child(' + append + ')').after(div);
                    }
                },

                load: function (componentName) {
                    //executed when the user hovers over a component to display the component select & menu item list
                    //determines which menu items to show & hide

                    //first, hide all menu items
                    $('.component-select .menu > .item').hide().removeClass('first last');

                    //next, show all matching menu items
                    $('.component-select .menu > .item.for-all, .component-select .menu > .item.for-' + componentName).show();

                    //find matching rule & hide menu items within the matching rule
                    for (x = 0; x < this.rules.length; x++) {
                        if (this.rules[x].componentName == componentName) {
                            $('.component-select .menu').find(this.rules[x].hideItems).hide();
                            break;
                        }
                    }

                    //hide style icon (perminently)
                    $('.component-select .menu .item.menu-style').hide();

                    //show either one or two columns with 6 menu items for each column
                    var items = $('.component-select .menu > .item:visible');

                    if (items.length > 6) {
                        $('.component-select .menu').css({ width: 83 });
                        $(items[1]).addClass('first');
                        $(items[items.length - 1]).addClass('last');
                    } else {
                        $('.component-select .menu').css({ width: 43 });
                        if (items.length > 0) {
                            $(items[0]).addClass('first');
                            $(items[items.length - 1]).addClass('last');
                        }
                    }


                    $('.component-select .btn-duplicate').show();

                    //hide duplicate button
                    var c = S.editor.components.hovered;
                    var comp = S.components.cache[c.id];
                    if (comp != null) {
                        if (comp.limit > 0) {
                            if ($('.component.type-' + comp.type).length >= comp.limit) {
                                $('.component-select .btn-duplicate').hide();
                            }
                        }
                    }

                },
            },

            load: function () {
                //load component settings into menu tabs
                var comp = S.components.cache[S.editor.components.hovered.id];
                if (comp != null) {
                    var lvl = S.viewport.level;
                    //load position settings
                    var pos = '';
                    var levels = S.viewport.getLevelOrder();
                    var c = $('#c' + comp.id)[0];
                    var cPos = S.elem.pos(c);
                    var padding = $(c).css('padding').toString();
                    var padlist = padding.split(' ');
                    if (padlist.length == 1) {
                        padding = padding + ' ' + padding + ' ' + padding + ' ' + padding;
                    }
                    if (padlist.length == 2) {
                        padding = padding + ' ' + padding
                    }
                    if (padlist.length == 3) {
                        padding = padding + ' 0px';
                    }
                    for (i = 0; i < levels.length; i++) {
                        pos = comp.position[levels[i]];
                        if (pos != '' && pos != null) { break; }
                    }
                    if (pos == '' || pos == null) {
                        pos = 'c,0,,t,0,' + comp.id + ',' + cPos.w + ',px,' + cPos.h + ',auto,' + padding;
                    }
                    var vals = pos.split(',');
                    $('#lstPropsAlignX').val(vals[0]);
                    $('#chkPropsAlignXNewline').prop('checked', vals[2] == '1' ? true : false);
                    $('#lstPropsAlignY').val(vals[3]);
                    $('#lstPropsFixed').val(vals[5]);
                    $('#lstPropsPosWidth').val(vals[7]);
                    $('#lstPropsPosHeight').val(vals[9]);
                    var pad = '0px 0px 0px 0px';
                    if (vals[10] != '') { pad = vals[10]; }
                    $('#divPropsPadding a')[0].innerHTML = pad;
                    var pads = pad.split(' ');
                    $('#txtPosPadTop').val(pads[0].replace('px', ''));
                    $('#txtPosPadRight').val(pads[1].replace('px', ''));
                    $('#txtPosPadBottom').val(pads[2].replace('px', ''));
                    $('#txtPosPadLeft').val(pads[3].replace('px', ''));

                }
            },

            save: {
                position: function () {
                    //get values from component menu
                    var c = S.editor.components.hovered;
                    var alignx = $('#lstPropsAlignX').val();
                    var left = $(c).css('left');
                    var extrax = $('#chkPropsAlignXNewline').is(':checked') == true ? 1 : 0;
                    var aligny = $('#lstPropsAlignY').val();
                    var top = $(c).css('top');
                    var extray = $('#lstPropsFixed').val() || '';
                    var width = $(c).css('maxWidth');
                    var widthtype = $('#lstPropsPosWidth').val();
                    var height = $(c).css('height'); if (height == '0') { height = ''; }
                    var heighttype = $('#lstPropsPosHeight').val();
                    var lvl = S.viewport.level;

                    if (arguments[1] == 1) {
                        //force pixel height when resizing component
                        heighttype = 'px';
                        $('#lstPropsPosHeight').val('px');
                    }

                    //check position for valid numbers
                    if (left != null && left != '') { left = left.replace('px', '').replace('%', ''); }
                    if (top != null && top != '') { top = top.replace('px', '').replace('%', ''); }
                    if (width != null && width != '') { width = width.replace('px', '').replace('%', ''); }
                    if (height != null && height != '') { height = height.replace('px', '').replace('%', ''); }
                    var pad = [$('#txtPosPadTop').val(), $('#txtPosPadRight').val(), $('#txtPosPadBottom').val(), $('#txtPosPadLeft').val()];
                    for (x = 0; x < 4; x++) {
                        //check padding for valid numbers
                        if (pad[x] == null || pad[x] == '') { pad[x] = '0'; }
                        if (isNumeric(pad[x]) == false) { pad[x] = '0'; }
                    }

                    //compile values into a string array
                    var val = alignx + ',' + left + ',' + extrax + ',' + aligny + ',' + top + ',' + extray + ',' +
                              width + ',' + widthtype + ',' + height + ',' + heighttype + ',' +
                              pad.join('px ') + 'px';

                    //update position
                    S.components.cache[c.id].position[lvl] = val;

                    //generate style element in DOM to update component on page
                    S.editor.components.loadPositionCss(c);

                    //prep data for page save 
                    S.editor.save.add(c.id.substr(1), 'position', S.components.cache[c.id].position.join('|'));

                    if (arguments[0] == null) {
                        S.editor.components.resizeSelectBox();

                        if ($('.component-select .section-position')[0].style.display != 'none') {
                            S.editor.components.menu.show('position', 1);
                        } else if ($('.component-select .section-padding')[0].style.display != 'none') {
                            S.editor.components.menu.show('padding', 1);
                        }
                    }

                },

                layer: function () {

                },

                zindex: function () {

                },

                opacity: function () {

                },

                locked: function () {

                }
            },

            remove: function () {
                var comps = S.editor.components;
                var id = comps.hovered.id;
                if (id == 'inner') {
                    //remove panel cell
                    var p = S.elem.panelCell(comps.hovered);
                    var pid = p.id.substr(5);
                    id = p.parentNode.id.substr(1);
                    p.parentNode.removeChild(p);
                    comps.hideSelect();
                    S.ajax.post('/api/Components/Panel/RemoveCell', { id: id, panelId: pid }, S.ajax.callback.inject);
                } else {
                    //remove component
                    comps.hovered.parentNode.removeChild(comps.hovered);
                    comps.hideSelect();
                    S.ajax.post('/api/Editor/RemoveComponent', { componentId: id.substr(1) }, S.ajax.callback.inject);
                }

            },

            special: {
                //custom functions used for special menu items
            }
        },

        quickmenu: {
            items: [],

            add: function (componentType, menuHtm, onInit) {
                //add a custom menu for each component type
                this.items.push({ componentType: componentType, menuHtm: menuHtm, onInit: onInit });
            },

            show: function (innerPanel, type) {
                //executed when the user hovers over a component to display the component select & menu item list
                //determines where to load custom quick menus for each component within an inner panel cell, 
                //then generates them & repositions them intelligently within the component select's transparent area

                //find all possible components
                $('.component-select .quickmenu')[0].innerHTML = '';

                var matching = [];
                for (c in S.components.cache) {
                    var exists = false;
                    for (x = 0; x < matching.length; x++) {
                        if (matching[x] == S.components.cache[c].type.toLowerCase()) { exists = true; break; }
                    }
                    if (exists == false) { matching.push(S.components.cache[c].type.toLowerCase()); }
                }
                var components = [];
                switch (type) {
                    case 'cell': case 'panel':
                        components = $(innerPanel).find('.component');
                        break;
                    case 'component':
                        components = $(innerPanel);
                        return;
                        break;
                }
                var innerPos = S.elem.offset(innerPanel);

                for (c in components) {
                    if (components[c]) {
                        if (components[c].className) {
                            var carr = components[c].className.split(' '),
                                cPos = S.elem.offset(components[c]),
                                iPos = { x: 0, y: 0, w: 0, h: 0 };
                            if (type == 'panel') {
                                var inner = $(components[c]).parents('#inner')[0];
                                iPos = S.elem.offset(inner);

                                var gridpanel = $(inner).parents('.item-cell');
                                if (gridpanel.length > 0) {
                                    iPos = S.elem.offset(gridpanel[0]);
                                    cPos.x += iPos.x;
                                    cPos.y += iPos.y;
                                }
                            }
                            for (a = 0; a < carr.length; a++) {
                                if (carr[a].indexOf('type-') == 0) {
                                    var componentType = carr[a].replace('type-', '');

                                    //find associated quick menu item for this component type
                                    var item = null, items = S.editor.components.quickmenu.items;
                                    for (x = 0; x < items.length; x++) {
                                        item = items[x];
                                        if (item.componentType == componentType) {
                                            var div = document.createElement('div'), arrow = 'arrow-top';
                                            div.className = 'quickmenu-item for-' + componentType;
                                            div.innerHTML = this.items[x].menuHtm;
                                            $('.component-select .quickmenu').append(div);
                                            var dPos = S.elem.offset(div);

                                            if (type == 'cell' || type == 'panel') {
                                                var newy = (cPos.y + ((cPos.h / 2) - (dPos.h / 2)));
                                                if (newy < cPos.y + 20) { newy += 15; }
                                                div.style.top = newy + 'px';

                                                if ((cPos.x < (cPos.w / 5) || cPos.x - iPos.x < 300) && innerPos.h > 200) {
                                                    //align to left-hand side
                                                    if ((cPos.x - iPos.x - dPos.w - 10) < 30) {
                                                        //align to far left-hand side
                                                        div.style.left = (10 + iPos.x) + 'px';
                                                        arrow = 'arrow-right';
                                                    } else {
                                                        //align to left of component
                                                        div.style.left = ((cPos.x - iPos.x - dPos.w - 10) > 10 ? (cPos.x - dPos.w - 10) : 10 + iPos.x) + 'px';
                                                        arrow = 'arrow-right';
                                                    }
                                                } else {
                                                    div.style.left = cPos.x + ((cPos.w / 2) - (dPos.w / 2)) + 'px';
                                                }

                                            } else if (type == 'component') {
                                                div.style.top = (cPos.h / 7) + 'px';
                                                div.style.left = ((cPos.w / 2) - (dPos.w / 2)) + 'px';
                                            }


                                            div.style.opacity = '0';

                                            $(div).css({ opacity: 0 }).addClass(arrow).show().stop().delay(0).animate({ opacity: 1 }, 500);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }

            }
        },

        hideSelect: function () {
            if (S.editor.components.disabled == true) { return false;}
            var type = arguments[0] || '';
            if (type == 'leave') {
                S.editor.components.hovered = null;
            }
            var sel = S.editor.components.selected;
            if (sel == null) {
                if (type == '' || type == 'leave') {
                    $('.tools > .component-select').hide();
                }
                return;
            }
            var ctype = S.components.cache[sel.id];
            var hide = true;
            if (sel.id != 'inner' && ctype != null) {
                hide = false;
                switch (ctype.type) {
                    case 'panel': case 'textbox':
                        hide = true;
                        break;
                }
            }
            $('.tools > .component-select').hide();
            $('.component-select .menu .item').css({ paddingRight: 0 });
        },

        resizeSelectBox: function () {
            if (this.hovered == null) { return; }
            var cPos = S.elem.pos(this.hovered),
                pad = { left: 12, right: 12, top: 12, bottom: 12 },
                corner = this.resize.options.corner,
                border = this.resize.options.border,
                inner = { left: false, right: false, top: false },
                menu = this.selbox.find('.menu'), menuy = 0;
            var menuPos = S.elem.offset(menu[0]);

            //check padding for window edges
            if (cPos.x + cPos.w + border + menuPos.w >= S.window.absolute.w) {
                //right edge
                if (cPos.x + cPos.w + border >= S.window.absolute.w) {
                    pad.right = 0 - ((cPos.x + cPos.w) - S.window.absolute.w);
                } else {
                    pad.right = 12;
                }
                inner.right = true;
            }
            if (cPos.x - border <= 0) {
                //left edge
                pad.left = 0 + (cPos.x);
                inner.left = true;
            }
            if (cPos.y - border < 50) {
                //top edge
                pad.top = 0 - (50 - (cPos.y));
                inner.top = true;
            }

            //reposition container
            if (this.selected != this.hovered) {
                this.selbox.css({ left: cPos.x - pad.left, top: cPos.y - pad.top, width: cPos.w + (pad.left + pad.right), height: cPos.h + (pad.top + pad.bottom) });
            } else {
                this.selbox.css({ left: cPos.x - pad.left, top: cPos.y - pad.top, width: 0, height: 0 });
            }

            cPos.w += (pad.left + pad.right);
            cPos.h += (pad.top + pad.bottom);
            this.resize.options.pad = pad;
            this.resize.options.inner = inner;

            //repostion resize bars
            if (this.posStart.w != cPos.w || this.posStart.h != cPos.h) {
                this.selbox.find('.resize-top').css({ top: 0, left: border + corner, width: cPos.w - (border * 2) - (corner * 2), height: border });
                this.selbox.find('.resize-top-right').css({ top: 0, left: cPos.w - border - corner, width: corner + border, height: border });
                this.selbox.find('.resize-right-top').css({ top: border, left: cPos.w - border, width: border, height: corner });
                this.selbox.find('.resize-right').css({ top: border + corner, left: cPos.w - border, width: border, height: cPos.h - (border * 2) - (corner * 2) });
                this.selbox.find('.resize-right-bottom').css({ top: cPos.h - border - corner, left: cPos.w - border, width: border, height: corner });
                this.selbox.find('.resize-bottom-right').css({ top: cPos.h - border, left: cPos.w - border - corner, width: corner + border, height: border });
                this.selbox.find('.resize-bottom').css({ top: cPos.h - border, left: border + corner, width: cPos.w - (border * 2) - (corner * 2), height: border });
                this.selbox.find('.resize-bottom-left').css({ top: cPos.h - border, left: 0, width: border + corner, height: border });
                this.selbox.find('.resize-left-bottom').css({ top: cPos.h - border - corner, left: 0, width: border, height: corner + border });
                this.selbox.find('.resize-left').css({ top: border + corner, left: 0, width: border, height: cPos.h - (border * 2) - (corner * 2) });
                this.selbox.find('.resize-left-top').css({ top: border, left: 0, width: border, height: corner });
                this.selbox.find('.resize-top-left').css({ top: 0, left: 0, width: border + corner, height: border });
            }

            //reposition vertical drag button
            if (inner.top == false) {
                this.selbox.find('.arrow-down').css({ left: (cPos.w / 2) - 20, top: -15 + border }).removeClass('below').addClass('above');
            } else {
                this.selbox.find('.arrow-down').css({ left: (cPos.w / 2) - 20, top: 0 }).removeClass('above').addClass('below');
            }

            //reposition menu
            if (inner.right == false) {
                menuy = 0;
                menu.css({ left: cPos.w }).removeClass('inside').addClass('outside');
                $('.component-select .menu .item').css({ marginLeft: 0 });
            } else {
                menuy = border;
                menu.css({ left: cPos.w - menuPos.w - border }).removeClass('outside').addClass('inside');
                $('.component-select .menu .item').css({ marginLeft: 3 });
            }
            if (cPos.y < S.window.scrolly + 70) {
                menuy = S.window.scrolly + 70 - cPos.y;
            }
            $('.component-select .menu, .component-select .properties > .box').css({ top: menuy });
            var bh = S.elem.height($('.component-select .menu, .component-select .properties > .box').get());
            $('.component-select .properties > .barrier').css({ top: menuy + bh });
            //reposition duplicate button
            if (cPos.y + cPos.h - 70 > S.window.absolute.h + S.window.scrolly) {
                $('.component-select .btn-duplicate').css({
                    left: (inner.right == true ? cPos.w - 45 : cPos.w) - 62,
                    top: cPos.h - ((cPos.y + cPos.h) - (S.window.absolute.h + S.window.scrolly)) - 62
                });
            } else {
                $('.component-select .btn-duplicate').css({
                    left: (inner.right == true ? cPos.w - 45 : cPos.w) - 62,
                    top: cPos.h - 62
                });
            }

            var comp = S.components.cache[this.hovered.id];
            var type = 'Panel Cell';
            if (comp != null) {
                type = S.components.cache[this.hovered.id].label;
            }

            var label = type;
            if (type == 'panel') { label = 'Panel Cell'; }
            label = label.replace('-', ' ');//S.util.str.Capitalize(label.replace('-',' '));
            $('.component-select .btn-duplicate .label span')[0].innerHTML = 'Add a ' + label;

            //execute callback
            this.callback.execute('onResize', this.hovered, cPos);
        },

        //properties window

        properties: {
            //current = object loaded from component properties.js
            selected: null, current: null, options: {}, section: '',

            show: function () {
                if ($('.winProperties').length == 0) {
                    //load the window first
                    var htm =
                        '<div class="top-menu"><div class="tabs"></div></div><div class="props-content"></div>' +
                        '<div class="props-save">' +
                            '<div class="button apply center">Apply Changes</div>' +
                        '</div>';
                    S.editor.window.load('Properties', '', htm, { x: 0, align: 'center', y: 0, w: 600, h: 100, spacing: 50, postOnce: true, visible: false, title: 'Component Properties' });

                }
                var element = arguments[0] || S.editor.components.hovered;
                var section = arguments[1] || '';
                if (S.editor.components.properties.selected != element) {
                    $('.winProperties .props-content')[0].innerHTML = '';
                    S.ajax.post('/api/Editor/ComponentProperties', { id: element.id.substr(1), section: section }, S.ajax.callback.inject);
                    S.editor.components.properties.section = section;
                } else {
                    $('.winProperties').show();
                }
                $('.winProperties .props-save').css('opacity', 0.2);
                $('.winProperties .props-save > .button').off('click');

                //remove previous delegations
                $('.winProperties .props-content').undelegate('input[type="text"], textarea', 'keyup');
                $('.winProperties .props-content').undelegate('select', 'change');
                $('.winProperties .props-content').undelegate('input[type="checkbox"]', 'click');

                //add new delegations
                $('.winProperties .props-content').delegate('input[type="text"], textarea', 'keyup', S.editor.components.properties.changed);
                $('.winProperties .props-content').delegate('select', 'change', S.editor.components.properties.changed);
                $('.winProperties .props-content').delegate('input[type="checkbox"]', 'click', S.editor.components.properties.changed);

                S.editor.components.properties.selected = S.editor.components.hovered;
            },

            changed: function () {
                $('.winProperties .props-save').css('opacity', 1);
                $('.winProperties .props-save > .button').off('click').on('click', S.editor.components.properties.save);
            },

            save: function () {
                $('.winProperties .props-save').css('opacity', 0.2);
                $('.winProperties .props-save > .button').off('click');
                S.editor.components.properties.current.save();
            },

            loaded: function (name, w) {
                $('.winProperties .grip .title')[0].innerHTML = name + ' Properties';
                $('.winProperties').css({ width: w });
                $('.winProperties').show();
            },

            menu: {
                total: 0,

                add: function (title, parent, index) {
                    this.total += 1;
                    var div = document.createElement('div');
                    div.className = 'item';
                    div.setAttribute('onclick', 'S.editor.components.properties.menu.select(\'' + parent + '\',' + index + ')');
                    div.innerHTML = title;
                    $('.winProperties .top-menu .tabs').append(div);
                },

                select: function (parent, index) {
                    $('.winProperties ' + parent + ' > div').hide();
                    $('.winProperties ' + parent + ' > div:nth-child(' + index + ')').show();
                    $('.winProperties .top-menu .tabs .item').removeClass('selected');
                    $('.winProperties .top-menu .tabs .item:nth-child(' + index + ')').addClass('selected');
                },

                clear: function () {
                    S.editor.components.properties.menu.total = 0;
                    $('.winProperties .top-menu .tabs .item').remove();
                }
            }
        },

        //functions

        hoveredComponent: function(){
            var c = this.hovered;
            if (c.id == 'inner') {
                var p = S.elem.panelCell(c);
                return p.parentNode;
            }
            return c;
        },

        inRange: function (cPos, ePos) {
            //cPos = target
            //ePos = element that may be in range
            var pad = 10;
            if (arguments[2] != undefined) { pad = arguments[2]; } // padding
            if (ePos.x >= cPos.x - pad && ePos.x < cPos.x + cPos.w + pad) {
                //in range #1 & #3
                return true;
            }
            if (ePos.x < cPos.x - pad && ePos.x + ePos.w >= cPos.x) {
                //in range #2 & #4
                return true;
            }
            return false;

        },

        getPositionCss: function (c, level, position) {
            var css = '';
            var cssBefore = '';
            var id = c.id;
            if (position != '' && position != null) {
                var pos = position.split(',');
                //x-type, x-offset, y-type, y-offset, fixed-type, width, width-type, height, height-type, padding
                switch (pos[0]) //x-type
                {
                    case 'l':
                        css += 'float:left; display:block; ';
                        break;

                    case 'c':
                        if (pos[2] != '1') {
                            css += 'float:none; display:inline-block; '
                        } else {
                            css += 'float:none; display:block; '
                        };
                        break;

                    case 'r':
                        css += 'float:right; display:block; ';
                        break;
                }
                //x-offset
                if (pos[1].length > 0 && pos[1] != 'auto') {
                    css += 'left:' + pos[1] + 'px; ';
                } else {
                    css += 'left:0px; ';
                }

                //x-extra (force new line)
                if (pos[2] == '1') {
                    css += 'position:relative; margin:0px auto; ';
                }

                switch (pos[3]) //y-type
                {
                    case 'f':
                        if (pos[2] != '1') { css += 'position:fixed; '; }
                        break;
                    default:
                        if (pos[2] != '1') { css += 'position:relative; '; }
                        break;
                }



                //y-offset
                if (pos[4].length > 0 && pos[4] != 'auto') {
                    css += 'top:' + pos[4] + 'px; ';
                } else {
                    css += 'top:0px; ';
                }

                switch (pos[5]) //fixed-type
                {
                    case 'm':
                        css += 'top:50%; bottom:50%; ';
                        break;

                    case 'b':
                        css += 'top:auto; bottom:0px; ';
                        break;

                    default:
                        css += 'bottom:auto; ';
                }

                switch (pos[7]) //width-type
                {
                    case 'px':
                        css += 'max-width:' + pos[6] + 'px; ';
                        break;

                    case '%':
                        css += 'max-width:' + pos[6] + '%; ';
                        break;

                    case 'win':
                        css += 'max-width:100%; ';
                        break;
                }

                switch (pos[9]) //height-type
                {
                    case 'px':
                        css += 'height:' + pos[8] + 'px; ';
                        break;
                    case 'auto':
                        css += 'height:auto; ';
                        break;
                }

                //padding
                if (pos[10].length > 0) {
                    var pad = pos[10].replace(/px/g, '').split(' ');
                    css += 'padding:' + pos[10] + '; width:100%; ';
                } else {
                    css += 'padding:0px; width:100%;';
                }


            }
            var before = ':before{content:""; display:block; height:0px; width:100%;}';
            if (position != '') {
                switch (level) {
                    case 0: //cell
                        return '.s-cell #' + id + '{' + css + '}';
                    case 1: //mobile
                        return '.s-mobile #' + id + ', .s-cell #' + id + '{' + css + '}';
                    case 2: //tablet
                        return '.s-tablet #' + id + ', .s-mobile #' + id + ', .s-cell #' + id + '{' + css + '}';
                    case 3: //desktop
                        return '.s-desktop #' + id + ', .s-tablet #' + id + ', .s-mobile #' + id + ', .s-cell #' + id + '{' + css + '}';
                    case 4: //HD
                        return '.s-hd #' + id + ',  .s-desktop #' + id + ', .s-tablet #' + id + ', .s-mobile #' + id + ', .s-cell #' + id + '{' + css + '}';
                }
            }

            return '';
        },

        loadPositionCss: function (c) {
            //generate styling CSS for component from position settings
            var exists = false;
            var lvlpos = S.components.cache[c.id].position
            var style = $('#stylefor_' + c.id);
            if ($('#stylefor_' + c.id).length > 0) { exists = true; }
            var styling =
                S.editor.components.getPositionCss(c, 4, lvlpos[4]) + '\n' +
                S.editor.components.getPositionCss(c, 3, lvlpos[3]) + '\n' +
                S.editor.components.getPositionCss(c, 2, lvlpos[2]) + '\n' +
                S.editor.components.getPositionCss(c, 1, lvlpos[1]) + '\n' +
                S.editor.components.getPositionCss(c, 0, lvlpos[0]);
            if (exists == false) {
                style = document.createElement('style');
                style.id = 'stylefor_' + c.id;
                style.innerHTML = styling;
                $('#customCSS').append(style);
            } else {
                style = style[0];
                style.innerHTML = styling;
            }
            //reset inline-styling for component
            $(c).css({ maxWidth: '', height: '', top: '', left: '' });
        },

        saveArrangement: function (panel) {
            var comps = $('.inner' + panel.id + ' > .component');
            var d = [];
            if (comps.length > 0) {
                for (i = 0; i < comps.length; i++) {
                    d.push(comps[i].id.substr(1));
                }
            }
            S.editor.save.add(panel.id, 'arrangement', d);
        },

        duplicate: function (c) {
            //send request to server for new component
            var comp = S.components.cache[c.id];
            var hascomp = (comp != null) ? true : false;
            var compType = 'panel';
            var execCustom = false;
            var panel = S.elem.panel(c);
            var pid = panel.id.substr(5);
            var selector = '#' + panel.id + ' .inner' + panel.id
            var aboveId = c.id.substr(1);
            var next = c.nextSibling;
            if (next != null) { if (next.nodeName == '#text') { next = next.nextSibling; } }
            if (next == null) {
                aboveId = 'last';
            } else {
                aboveId = next.id.substr(1);
            }

            if (hascomp == true) {
                compType = comp.type;
                if (comp.duplicate != null) {
                    //execute custom duplicate command
                    comp.duplicate(c);
                    return;
                }
            } else {
                //duplicate panel cell
                var p = S.elem.panelCell(c);
                if (p != null) {
                    comp = S.components.cache[p.parentNode.id];
                    if (comp != null) {
                        comp.duplicate(c);
                        return;
                    }
                }
            }

            //duplicate component
            var options = { componentId: compType, panelId: pid, selector: selector, aboveId: aboveId, duplicate: c.id.substr(1) };
            //first, send an AJAX request to save page changes
            S.editor.save.click(function () {
                //then duplicate component
                S.ajax.post('/api/Editor/NewComponent', options, S.ajax.callback.inject);
            });
        },
    },

    textEditor: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        selected: false, pressing:false,

        init: function () {
            //setup callbacks
            var htm = '';
            S.editor.components.callback.add($('.editor')[0], null, null, this.show, null, this.hide);

            //generate toolbar
            var toolbar = document.createElement('div'),
                btnSelect = document.createElement('div');

            toolbar.className = 'texteditor-toolbar';
            toolbar.style.display = 'none';

            btnSelect.className = 'texteditor-btnselect';
            btnSelect.style.display = 'none';

            //create buttons for toolbar
            var buttons = [
                { title: 'bold', svg: 'bold', click: 'S.editor.textEditor.commands.bold()' },
                { title: 'italic', svg: 'italic', click: 'S.editor.textEditor.commands.italic()' },
                { title: 'strike-thru', svg: 'strikethru', click: 'S.editor.textEditor.commands.strikethru()' },
                { title: 'underline', svg: 'underline', click: 'S.editor.textEditor.commands.underline()' },
                { title: 'bullet list', svg: 'bullet', click: 'S.editor.textEditor.commands.list()' },
                { title: 'number list', svg: 'numbers', click: 'S.editor.textEditor.commands.list(\'decimal\')' },
                //{ title: 'outdent', svg: 'outdent', click: 'S.editor.textEditor.commands.outdent()' },
                { title: 'indent', svg: 'indent', click: 'S.editor.textEditor.commands.indent()' },
                { title: 'align left', svg: 'left', click: 'S.editor.textEditor.commands.alignLeft()' },
                { title: 'align center', svg: 'center', click: 'S.editor.textEditor.commands.alignCenter()' },
                { title: 'align right', svg: 'right', click: 'S.editor.textEditor.commands.alignRight()' },
                { title: 'photo', svg: 'photo', click: 'S.editor.textEditor.commands.photo.show()' },
                { title: 'table', svg: 'table', click: 'S.editor.textEditor.commands.table.show()' },
                { title: 'anchor link', svg: 'link', click: 'S.editor.textEditor.commands.link.show()' },
                { title: 'font color', svg: 'color', click: 'S.editor.textEditor.commands.colors.show("color")' },
                { title: 'highlight color', svg: 'bgcolor', click: 'S.editor.textEditor.commands.colors.show("highlight")' },
                { title: 'source code', svg: 'source', click: 'S.editor.textEditor.commands.source.show()' }
            ];

            for (x = 0; x < buttons.length; x++) {
                htm += '<div class="button"><a href="javascript:" onmousedown="' + buttons[x].click + ';return false" title="' + buttons[x].title + '">' +
                    '<svg viewBox="0 0 18 18"><use xlink:href="#icon-text' + buttons[x].svg + '" x="0" y="0" width="18" height="18"></use></svg></a></div>';
            }


            //add toolbar to the tools div
            toolbar.innerHTML = htm;
            $('.tools').append(toolbar);
            htm = '';

            //create button for viewing the component select
            var btns = [{ title: 'View the Component Box & Options Menu for this Textbox', svg: 'componentselect', click: 'S.editor.textEditor.commands.componentSelect()' }];
            for (x = 0; x < btns.length; x++) {
                htm += '<div class="button"><a href="javascript:" onmousedown="' + btns[x].click + ';return false" title="' + btns[x].title + '">' +
                    '<svg viewBox="0 0 22 19" style="width:22px"><use xlink:href="#icon-' + btns[x].svg + '" x="0" y="0" width="22" height="19"></use></svg></a></div>';
            }


            //add button to the tools div
            btnSelect.innerHTML = htm;
            $('.tools').append(btnSelect);
            htm = '';

            //create button for viewing the text editor
            htm = '<div style="width:17px; height:17px;">' +
                  '<svg viewBox="0 0 17 17" style="width:17px; height:17px; padding-top:5px;"><use xlink:href="#icon-options" x="0" y="0" width="17" height="17"></use></svg>' +
                  '</div>';

            //add text editor button to the component select menu
            S.editor.components.menu.items.add('textbox', 'texteditor', htm, 'before', 'S.editor.components.click($(".component-select")[0], "component-select")');



            //configure rangy
            rangy.config.preferTextRange = true;
            rangy.createMissingNativeApi();
        },

        show: function (target) {
            if ($(target).hasClass('type-textbox') == true) {
                var textedit = $(target).find('.textedit');
                textedit.addClass('editing')[0].contentEditable = "true";

                //setup events
                S.hotkeys.callback.add('texteditor', null, null, S.editor.textEditor.keyUp);
                textedit.bind('mousedown', S.editor.textEditor.mouseDown);
                textedit.bind('mouseup', S.editor.textEditor.mouseUp);
                S.events.doc.scroll.callback.add($('.tools .texteditor-toolbar')[0], target, S.editor.textEditor.reposition, S.editor.textEditor.reposition, S.editor.textEditor.reposition);
                S.events.doc.resize.callback.add($('.tools .texteditor-toolbar')[0], target, S.editor.textEditor.reposition, S.editor.textEditor.reposition, S.editor.textEditor.reposition);

                //reposition the text editor toolbar
                S.editor.textEditor.reposition(target);
                S.editor.textEditor.selected = true;
                S.editor.components.disabled = true;

                //focus text
                var range = document.createRange();
                var sel = window.getSelection();
                try {
                    range.setStart(textedit[0].lastChild, 1);
                } catch (ex) { }
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                textedit.focus();
            }
        },

        reposition: function (target) {
            var t = this.vars ? this.vars : target;
            var pos = S.elem.pos(t);
            var tPos = { x: pos.x, y: pos.y - 45 };
            if (pos.y - S.window.scrolly < 105) {
                tPos.y = pos.y + pos.h + 10;
            }
            $('.tools .texteditor-toolbar').css({ top: tPos.y, left: tPos.x - 12 }).show();

            pos = S.elem.pos(t);
            if (pos.x + pos.w + 60 > S.window.absolute.w) { pos.x -= (40); }
            if (pos.y - S.window.scrolly < 105) { pos.y += pos.h - 12; }
            $('.tools .texteditor-btnselect').css({ top: pos.y - 12, left: pos.x + pos.w + 10 }).show();
        },

        hide: function (target, clicked) {
            if (target == null) {
                S.editor.components.hovered = null;
                S.editor.components.selected = null;
                S.editor.textEditor.selected = false;
                S.editor.components.disabled = false;
                return;
            }
            if ($(target).hasClass('type-textbox') == true) {
                if ($(clicked).parents('.textedit.editing, .texteditor-toolbar').length >= 1 || 
                    target == clicked || $(clicked).hasClass('textedit editing') ||
                    S.editor.textEditor.pressing == true) {
                    S.editor.components.disabled = true;
                    S.editor.textEditor.pressing = false;
                    return;
                }
                if ($(target).find('.textedit.editing').length == 1) {
                    var textedit = $(target).find('.textedit');
                    textedit.removeClass('editing')[0].contentEditable = "false";
                    S.hotkeys.callback.remove('texteditor', null, null, S.editor.textEditor.keyUp);
                    textedit.unbind('mousedown', S.editor.textEditor.mouseDown);
                    textedit.unbind('mouseup', S.editor.textEditor.mouseUp);
                    //S.editor.textEditor.save.finish(target);
                }
                $('.tools .texteditor-toolbar, .tools .texteditor-btnselect').hide();
                S.events.doc.scroll.callback.remove($('.tools .texteditor-toolbar')[0]);
                S.events.doc.resize.callback.remove($('.tools .texteditor-toolbar')[0]);
                if (S.editor.components.disabled == true) {
                    S.editor.components.hovered = null;
                    S.editor.components.selected = null;
                    S.editor.textEditor.selected = false;
                    S.editor.components.disabled = false;
                }
            }
        },

        keyUp: function () {
            S.editor.textEditor.reposition(S.editor.components.selected);
            S.editor.textEditor.save.start();
        },

        mouseDown: function () {
            S.editor.textEditor.pressing = true;
            //S.editor.components.disabled = true;
        },

        mouseUp: function () {
            //setTimeout(function () { S.editor.components.disabled = false; }, 100);
        },

        alterRange: function (name, tag, attributes, remove, outerOnly) {
            var sel = rangy.getSelection(), range, el, f, container, r,
                hasremove = false, hasclass = false;

            //select children if there is no selection made ///////////////////////
            if (sel.isCollapsed == true) {
                sel.selectAllChildren(sel.anchorNode);
            }

            if (outerOnly == true) {
                //create outer node
                sel.refresh();
                r = this.getRange();
                range = r.range;
                container = r.parent;
                el = document.createElement(tag);
                $(r.nodes).wrapAll(el);
                var el2 = $(el).find('.' + name);
                if (el2.length == 0 && remove != null) {
                    for (x = 0; x < remove.length; x++) {
                        el2 = $(el).find('.' + remove[x]).contents().unwrap();
                    }
                }
                $(container).find('span:not([class])').contents().unwrap();
                range.normalizeBoundaries();
                sel.refresh();
                sel.setSingleRange(range);
                
            }


            //apply attributes & class (name) to all elements within the select ///
            var applier = rangy.createClassApplier(name, {
                elementTagName: tag,
                elementAttributes: attributes
            }, tag);
            applier.toggleSelection();

            //remove any classes from the selection that don't belong /////////////
            if (remove != null) {
                if (remove.length > 0) {
                    //remove classes from range
                    for (x = 0; x < remove.length; x++) {
                        applier = rangy.createClassApplier(remove[x], {
                            elementTagName: tag,
                            elementAttributes: attributes
                        }, tag);
                        applier.undoToSelection();
                    }
                }
            }

            //replace trailing spaces with &nbsp; /////////////////////////////////
            sel.refresh();
            var nodes = [];
            //get all nodes within the selection
            for (x = 0; x < sel.rangeCount; x++) {
                nodes = nodes.concat(sel.getRangeAt(x).getNodes());
            }
            //find each text node and replace trailing spaces with &nbsp;
            for (x = 0; x < nodes.length; x++) {
                if (nodes[x].nodeType == 3) {
                    nodes[x].nodeValue = nodes[x].nodeValue.replace(/\s+$/g, '\u00a0');
                }
            }

            S.editor.textEditor.save.start();
        },

        getRange: function () {
            var sel = rangy.getSelection();
            if (sel.rangeCount > 0) {
                var range = sel.getRangeAt(0);
                var nodes = range.getNodes();
                var parent = range.commonAncestorContainer;
                if (nodes[0] == parent) { parent = parent.parentNode; }
                //if (parent.nodeName == '#text') { parent = parent.parentNode; }
                var roots = $(nodes).filter(function () { if (this.parentNode != parent) { return false; } return true; });
                if (nodes.length == 1) { roots = nodes; }
                return { range: range, nodes: roots, parent: parent, sel: sel };
            }
            return { range: null, nodes: [], parent: null, sel:null };
        },

        commands: {
            bold: function () {
                S.editor.textEditor.alterRange('bold', 'span', {});
            },

            italic: function () {
                S.editor.textEditor.alterRange('italic', 'span', {});
            },

            strikethru: function () {
                S.editor.textEditor.alterRange('linethru', 'span', {});
            },

            underline: function () {
                S.editor.textEditor.alterRange('underline', 'span', {});
            },

            list: function (type) {
                var r = S.editor.textEditor.getRange();
                if (r.range != null) {
                    var range = r.range;
                    var nodes = r.nodes;
                    var parent = r.parent;

                    //check first to see if I should remove the bullet list
                    if ($(nodes).is('ul') || $(parent).is('ul') || $(parent).is('li')) {
                        //remove bullet list
                        if ($(parent).is('li')) {
                            var ul = $(parent.parentNode)
                            $(parent).contents().unwrap();
                            ul.contents().unwrap();
                        } else {
                            $(nodes).find('li').contents().unwrap();
                            $(nodes).contents().unwrap();
                            $(parent).find('ul').contents().unwrap();
                        }
                        if ($(parent).is('ul')) {
                            $(parent).contents().unwrap();
                        }
                    } else {
                        //generate bullet list
                        var ul = document.createElement('ul');
                        ul.style.listStyleType = type || '';
                        $(nodes).wrapAll(ul).wrap('<li></li>');
                    }
                }
                r.range.normalizeBoundaries();
                r.sel.refresh();
                r.sel.setSingleRange(r.range);
            },

            outdent: function () {
            },

            indent: function () {
                S.editor.textEditor.alterRange('indent', 'span', {}, {}, true);
            },

            alignLeft: function () {
                S.editor.textEditor.alterRange('alignleft', 'span', {}, ['aligncenter', 'alignright'], true);
            },

            alignCenter: function () {
                S.editor.textEditor.alterRange('aligncenter', 'span', {}, ['alignleft', 'alignright'], true);
            },

            alignRight: function () {
                S.editor.textEditor.alterRange('alignright', 'span', {}, ['aligncenter', 'alignleft'], true);
            },

            photo: {
                show: function () {

                },

                add: function (file) {

                }
            },

            table: {
                show: function () {

                },

                add: function (rows, columns) {

                }
            },

            link: {
                show: function () {

                },

                add: function () {

                }
            },

            colors: {
                type: 'color',

                show: function (type) {

                },

                add: function (color) {

                }
            },

            source: {
                show: function () {

                },

                hide: function () {

                }
            },

            componentSelect: function () {
                S.editor.components.hovered = S.editor.components.selected;
                S.editor.components.selected = null;
                $('.component-select').show();
                S.editor.components.resizeSelectBox();
                S.editor.textEditor.hide(S.editor.components.hovered);

            }
        },

        save: {
            timer: null,

            start: function () {
                //wait 1.5 seconds after the user is done typeing before saving text
                if (this.timer != null) { clearTimeout(this.timer); }
                var fin = 'S.editor.textEditor.save.finish($("#' + S.editor.components.selected.id + '")[0]);';
                this.timer = setTimeout(fin, 1500);
            },

            finish: function (c) {
                var val = $(c).find('> .textedit')[0].innerHTML;
                S.editor.save.add(c.id.substr(1), 'data', val);
            }
        }
    },

    pages: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        tree: {
            items: [],

            add: function (pageId, title) {
                S.editor.pages.tree.items.push({ pageId: pageId, title: title });
                S.editor.pages.tree.updateTitle();
            },

            remove: function (pageId) {
                var found = false;
                for (var x = 0; x < S.editor.pages.tree.items.length; x++) {
                    if (S.editor.pages.tree.items[x].pageId == pageId) { found = true; break; }
                }
                S.editor.pages.tree.items.splice(x - 1, 1);
                S.editor.pages.tree.updateTitle();
            },

            updateTitle: function () {
                var htm = '';
                for (x = 0; x < S.editor.pages.tree.items.length; x++) {
                    if (x > 0) { htm += '/'; }
                    htm += S.editor.pages.tree.items[x].title;
                }
                //if (htm == '') { htm = 'root';}
                $('.winWebPages .pages-title .page-title')[0].innerHTML = '/' + htm;
            }
        },

        add: {
            item: { parentId: 0, title: '', description: '' },
            show: function (parentId) {
                S.editor.pages.add.item = { parentId: parentId, title: '', description: '' };
                S.editor.window.load('NewPage', 'Editor/NewPage', { parentId: parentId || 0, title: S.website.title },
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', spacing: 50, loadOnce: true, noDashboard: true, title: 'New Web Page' });
            },

            typeTitle: function (e) {
                var title = $('#newPageTitle').val(), err = false;
                if (err == false) { if (title == '') { err = true; } }
                if (err == false) { err = S.util.str.isAlphaNumeric(title, true); }
                if (err == false) { err = S.util.str.hasCurseWords(title); }
                title = title.replace(/ /g, '-');
                if (err == true) {
                    $('#newpage-url').html('<div class="font-error" style="text-decoration:line-through">' + S.editor.pages.add.item.url + title + '</div>');
                } else {
                    $('#newpage-url').html(S.editor.pages.add.item.url + title);
                }

            },

            submit: function () {
                var title = $('#newPageTitle').val(), desc = $('#newPageDescription').val(), err = false, secure = false, datapage = false;
                if (err == false) {
                    if (title == '') {
                        S.util.message.show($('#newPageError'), 'Please include a title for your page.'); return false;
                    }
                }
                if (err == false) {
                    err = S.util.str.isAlphaNumeric(title, true);
                    if (err == true) {
                        S.util.message.show($('#newPageError'), 'Remove special characters from the page title.'); return false;
                    }
                }
                if (err == false) {
                    err = S.util.str.hasCurseWords(title);
                    if (err == true) {
                        S.util.message.show($('#newPageError'), 'Remove bad words from the page title.'); return false;
                    }
                }
                if (err == false) {
                    if (desc == '') {
                        S.util.message.show($('#newPageError'), 'Please include a description for your new page.'); return false;
                    }
                }
                if (err == false) {
                    err = S.util.str.hasCurseWords(desc);
                    if (err == true) {
                        S.util.message.show($('#newPageError'), 'Remove bad words from the page description.'); return false;
                    }
                }
                $(this).hide();
                secure = $('#newPageSecure').is(':checked');
                if ($('#newPageData')) { datapage = $('#newPageData').is(':checked'); }
                var data = { title: title, description: desc, parentId: S.editor.pages.add.item.parentId, isSecure: secure, isDataPage: datapage };
                S.ajax.post('/api/Dashboard/Pages/Create', data, S.ajax.callback.inject);
            },
        },

        settings: {
            item: { pageId: 0 },
            show: function (pageId) {
                S.editor.pages.settings.item = { pageId: pageId };
                S.editor.window.load('PageSettings', 'Editor/PageSettings', { pageId: pageId },
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', spacing: 50, loadOnce: true, title: 'Web Page Settings', url: 'page-settings' });
            },

            submit: function () {
                var desc = $('#pageSettingsDescription').val(), err = false, secure = false;

                if (err == false) {
                    if (desc == '') {
                        S.util.message.show($('#pageSettingsError'), 'Please include a description for your page settings.'); return false;
                    }
                }
                if (err == false) {
                    err = S.util.str.hasCurseWords(desc);
                    if (err == true) {
                        S.util.message.show($('#pageSettingsError'), 'Remove bad words from the page description.'); return false;
                    }
                }
                $(this).hide();
                secure = $('#pageSettingsSecure').is(':checked');
                var data = { pageId: S.editor.pages.settings.item.pageId, description: desc, isSecure: secure };
                S.ajax.post('/api/Dashboard/Pages/Update', data, S.ajax.callback.inject);
            },
        },

        remove: function (pageId) {
            if (confirm('Do you really want to delete this web page? This cannot be undone.') == true) {
                S.ajax.post('/api/Dashboard/Pages/Remove', { pageId: pageId }, S.ajax.callback.inject);
            }
        },

        load: function (pageId, title, updown) {
            if (updown == null || updown == 'up' || updown == true) {
                S.editor.pages.tree.add(pageId, title);
            } else {
                S.editor.pages.tree.remove(pageId);
            }
            S.ajax.post('/api/Dashboard/Pages/LoadSubPages', { parentId: pageId }, S.ajax.callback.inject);
        },

        expand: function (pageId) {
            if ($('.winWebPages .content .page-' + pageId).children().length == 3) {
                //load sub pages
                S.ajax.post('/api/Dashboard/Pages/LoadSubPages', { parentId: pageId }, S.ajax.callback.inject);
            } else {
                //view sub pages
                $('.winWebPages .content .page-' + pageId + ' > .sub').show();
            }
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a').attr('onclick', 'S.editor.pages.collapse(\'' + pageId + '\')');
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a use').attr('xlink:href', '#icon-collapse');
        },

        collapse: function (pageId) {
            $('.winWebPages .content .page-' + pageId + ' > .sub').hide();
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a').attr('onclick', 'S.editor.pages.expand(\'' + pageId + '\')');
            $('.winWebPages .content .page-' + pageId + ' > .expander > .column a use').attr('xlink:href', '#icon-expand');
        }
    },

    layers: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        show: function () {
            S.editor.window.load('Layers', 'Editor/Layers', {}, { r: 0, y: 0, w: 250, h: 100, loadOnce: true });
        },

        refresh: function () {
            $('.winLayers .layers-list').off('.row', 'mouseenter mouseleave');
            var layers = S.layers.cache, comps = S.components.cache,
                htm = '', i = [2, 2, 2, 2, 2], pageId, p, p2, rowTitle = '', rowColor = 'blue', hasSubs = false, img, itemId,
                panels = $('.ispanel:not(.istheme)'), laypanels = $('.ispanel.istheme'), comps, comps2, comp, classes;
            for (l = 0; l < layers.length; l++) {
                //load each layer ///////////////////////////////////////////////////////////////////////////////////////////////
                i[0] = i[0] == 2 ? 1 : 2;
                rowTitle = layers[l].title;
                if (layers[l].pageType == 1) { rowTitle = 'Page'; }
                itemId = rowTitle.replace(/ /g, '') + 'Layer';
                htm += '<div class="row color' + i[0] + ' page-layer-row item-' + itemId + '">' +
                        '<div class="expander purple"><div class="column right icon icon-expand"><a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a></div></div>' +
                        '<div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-layers" x="0" y="0" width="36" height="36" /></svg></div>' +
                        '<div class="column left title">' + rowTitle + ' Layer</div><div class="clear"></div>';
                pageId = layers[l].pageId;

                i[1] = 2;
                for (s = 0; s < laypanels.length; s++) {
                    //load each web page panel //////////////////////////////////////////////////////////////////////////////////
                    p = $(laypanels[s]);
                    comps = p.find('.component').filter(function (index, elem) { if ($(elem).parents('.ispanel:not(.istheme)').length > 0) { return false; } return true; });
                    hasSubs = false;
                    //make sure there are components within this panel that belong to the current layer
                    for (c = 0; c < comps.length; c++) {
                        if (S.components.cache[comps[c].id].pageId == pageId) { hasSubs = true; break; }
                    }

                    //this panel contains components that are a part of the current layer
                    i[1] = i[1] == 2 ? 1 : 2;
                    rowColor = 'blue';
                    rowTitle = S.util.str.Capitalize(p[0].className.split(' ')[0].replace('panel', '')) + ' Area';
                    itemId = rowTitle.replace(/ /g, '');
                    htm += '<div class="sub" style="display:none;">' +
                        '<div class="row color' + i[1] + ' page-panel-row item-' + itemId + '">' +
                        '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';

                    if (hasSubs == true) {
                        htm += '<a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a>';
                    }

                    htm += '</div></div><div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-panel" x="0" y="0" width="36" height="36"></use></svg></div>' +
                        '<div class="column left title">' + rowTitle + '</div><div class="clear"></div>';

                    if (hasSubs == true) {
                        i[2] = 2;
                        for (c = 0; c < comps.length; c++) {
                            //load each component that belongs to the web page panel ///////////////////////////////////////////////
                            i[2] = i[2] == 2 ? 1 : 2;
                            comp = $(comps[c]);
                            rowColor = '';
                            classes = comp[0].className.split(' ');
                            rowTitle = S.util.str.Capitalize(classes[S.util.array.indexOfPartialString(classes, 'type-')].replace('type-', ''));

                            hasSubs = false;
                            if (comp.find('.ispanel').length > 0) { hasSubs = true; }
                            itemId = comps[c].id;

                            htm += '<div class="sub" style="display:none;">' +
                                '<div class="row color' + i[1] + ' component-row item-' + itemId + '">' +
                                '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';

                            if (hasSubs == true) {
                                htm += '<a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a>';
                            }
                            img = S.components.cache[comps[c].id].type;
                            htm += '</div></div><div class="column left icon-img"><img src="/components/' + img + '/iconsm.png"/></div>' +
                                '<div class="column left title">' + rowTitle + '</div><div class="clear"></div>';

                            if (hasSubs == true) {
                                i[3] = 2;
                                panels = comp.find('.ispanel');
                                for (s2 = 0; s2 < panels.length; s2++) {
                                    //load each component panel cell /////////////////////////////////////////////////////////////////////
                                    p2 = $(panels[s2]);
                                    if (p2.hasClass('istheme') == false) {
                                        //make sure this panel belongs to the current web page panel                                    

                                        hasSubs = false;
                                        //make sure there are components within this panel that belong to the current layer
                                        //for (c = 0; c < stacks[s2].data.length; c++) {
                                        //if (S.components.cache[stacks[s2].data[c].c.id].pageId == pageId) { hasSubs = true; break; }
                                        //}

                                        //this panel contains components that are a part of the current layer
                                        i[3] = i[3] == 2 ? 1 : 2;
                                        rowTitle = 'Cell';
                                        rowColor = 'green';
                                        itemId = panels[s2].id;
                                        htm += '<div class="sub" style="display:none;">' +
                                            '<div class="row color' + i[2] + ' panel-cell-row item-' + itemId + '">' +
                                            '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand"><a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a></div></div>' +
                                            '<div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-panel" x="0" y="0" width="36" height="36"></use></svg></div>' +
                                            '<div class="column left title">' + rowTitle + '</div><div class="clear"></div>';

                                        comps2 = p2.find('.component');
                                        i[4] = 2;
                                        for (c2 = 0; c2 < comps2.length; c2++) {
                                            //load each component that belongs to the panel cell ///////////////////////////////////////////////
                                            i[4] = i[4] == 2 ? 1 : 2;
                                            comp = $(comps2[c2]);
                                            rowColor = '';
                                            classes = comp[0].className.split(' ');
                                            rowTitle = S.util.str.Capitalize(classes[S.util.array.indexOfPartialString(classes, 'type-')].replace('type-', ''));

                                            hasSubs = false;
                                            if (comp.find('.ispanel').length > 0) { hasSubs = true; rowColor = 'green'; }
                                            itemId = comps2[c2].id;

                                            htm += '<div class="sub" style="display:none;">' +
                                                '<div class="row color' + i[1] + ' component-row item-' + itemId + '">' +
                                                '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';

                                            img = S.components.cache[comps2[c2].id].type;
                                            htm += '</div></div><div class="column left icon-img"><img src="/components/' + img + '/iconsm.png"/></div>' +
                                                '<div class="column left title">' + rowTitle + '</div><div class="clear"></div></div></div>';
                                        }

                                        htm += '</div></div>'; // end component panel row
                                    }
                                }
                            }

                            htm += '</div></div>'; // end component row
                        }
                        if (1 == 0) {

                        }

                        i[1] = 2;
                        for (c = 0; c < comps.length; c++) {
                            //load each component that belongs to the web page panel
                            i[1] = i[1] == 2 ? 1 : 2;
                        }
                    }
                    htm += '</div></div>'; // end web page panel row
                }

                htm += '</div>'; //end layer row
            }
            $('.winLayers .layers-list').html(htm);
            setTimeout(function () {
                $('.winLayers .layers-list').on('mouseenter', '.row', S.editor.layers.mouseEnter.row);
                $('.winLayers .layers-list').on('mouseleave', '.row', S.editor.layers.mouseLeave.row);
            }, 200);
        },

        expand: function (itemId) {
            $('.winLayers .content .item-' + itemId + ' > .sub').show();
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a').attr('onclick', 'S.editor.layers.collapse(\'' + itemId + '\')');
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a use').attr('xlink:href', '#icon-collapse');
        },

        collapse: function (itemId) {
            $('.winLayers .content .item-' + itemId + ' > .sub').hide();
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a').attr('onclick', 'S.editor.layers.expand(\'' + itemId + '\')');
            $('.winLayers .content .item-' + itemId + ' > .expander > .column a use').attr('xlink:href', '#icon-expand');
        },

        mouseEnter: {
            row: function () {
                var classes = this.className.split(' ');
                var itemId = classes[S.util.array.indexOfPartialString(classes, 'item-')].replace('item-', '');
                var rowType = classes[S.util.array.indexOfPartialString(classes, '-row')];
                switch (rowType) {
                    case 'page-panel-row':
                        S.editor.layers.mouseEnter.showPagePanel(itemId.toLowerCase().replace('area', ''));
                        break;
                    case 'component-row':
                        S.editor.layers.mouseEnter.showComponent(itemId);
                        break;
                    case 'panel-cell-row':
                        S.editor.layers.mouseEnter.showPanelCell(itemId);
                        break;
                }
            },

            showPagePanel: function (itemId) {
                var pos = S.elem.pos($('#panel' + itemId)[0]);
                var div = document.createElement('div');
                div.className = 'page-panel-border item-' + itemId;
                div.innerHTML = '&nbsp;';
                $(div).css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                $('.tools .borders').append(div);
                S.util.scrollIntoView($('#panel' + itemId)[0]);
            },

            showComponent: function (itemId) {
                S.editor.components.selected = null;
                S.editor.components.hovered = null;
                S.editor.components.disabled = false;
                S.editor.components.mouseEnter($('#' + itemId)[0]);
                S.util.scrollIntoView($('#' + itemId)[0]);
            },

            showPanelCell: function (itemId) {
                var pos = S.elem.pos($('#' + itemId)[0]);
                var div = document.createElement('div');
                div.className = 'panel-cell-border item-' + itemId;
                div.innerHTML = '&nbsp;';
                $(div).css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                $('.tools .borders').append(div);
                S.util.scrollIntoView($('#' + itemId)[0]);
            }
        },

        mouseLeave: {
            row: function () {
                var classes = this.className.split(' ');
                var itemId = classes[S.util.array.indexOfPartialString(classes, 'item-')].replace('item-', '');
                var rowType = classes[S.util.array.indexOfPartialString(classes, '-row')];
                switch (rowType) {
                    case 'page-panel-row':
                        S.editor.layers.mouseLeave.hidePagePanel(itemId.toLowerCase().replace('area', ''));
                        break;
                    case 'component-row':
                        S.editor.layers.mouseLeave.hideComponent(itemId);
                        break;
                    case 'panel-cell-row':
                        S.editor.layers.mouseLeave.hidePanelCell(itemId);
                        break;
                }

            },

            hidePagePanel: function (itemId) {
                $('.tools .borders .page-panel-border.item-' + itemId).remove();
            },

            hideComponent: function (itemId) {
                S.editor.components.mouseLeave();
            },

            hidePanelCell: function (itemId) {
                $('.tools .borders .panel-cell-border.item-' + itemId).remove();
            }
        },

        add: {
            show: function () {

            },

            typeTitle: function (e) {

            },

            submit: function () {

            }
        },

        load: {
            show: function () {

            },

            select: function () {

            }
        },

        remove: function () {

        }
    },

    designer: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        show: function () {
            S.editor.window.hidePopUps();
            if ($('.windows .winDesigner').length == 0) {
                var htm =
                    '<div class="side-menu">' +
                        '<div class="column-icon">' +
                            '<a href="javascript:" onclick="S.editor.designer.backgrounds.show()" title="Backgrounds">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-background" x="0" y="0" width="25" height="25"></use>' +
                            '</svg></a>' +
                        '</div>' +
                            '<div class="column-icon">' +
                            '<a href="javascript:" onclick="S.editor.designer.fonts.show()" title="Custom Fonts">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-fonts" x="0" y="0" width="25" height="25"></use>' +
                            '</svg></a>' +
                        '</div>' +
                            '<div class="column-icon">' +
                            '<a href="javascript:" onclick="S.editor.designer.colors.show()" title="Color Schemes">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-colorschemes" x="0" y="0" width="25" height="25"></use>' +
                            '</svg></a>' +
                        '</div>' +
                            '<div class="column-icon">' +
                            '<a href="javascript:" onclick="S.editor.designer.code.show()" title="Source Code">' +
                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                '<use xlink:href="#icon-sourcecode" x="0" y="0" width="25" height="25"></use>' +
                            '</svg></a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ide">' +
                        '<div class="backgrounds-content"></div>' +
                        '<div class="fonts-content"></div>' +
                        '<div class="colorschemes-content"></div>' +
                        '<div class="code-content">' +
                            '<div class="top-menu">' +

                            '</div>' +
                            '<div class="code-files">' +
                                '<div class="code-filelist"></div>' +
                            '</div>' +
                            '<div class="code-editor">' +
                                '<div class="code-ace-files tabs">' +
                                    '<div class="code-ace-save">' +
                                        '<a href="javascript:" onclick="S.editor.designer.code.file.save()" title="save file changes">' +
                                            '<svg viewBox="0 0 25 25" style="width:25px; height:25px;">' +
                                                '<use xlink:href="#icon-save" x="0" y="0" width="25" height="25"></use>' +
                                            '</svg>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="code-ace">' +
                                    '<div id="ace-editor"></div>' +
                                '</div>' +
                                '<div class="code-ace-info"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                S.editor.window.load('Designer', '', htm, { x: 0, align: 'center', y: 0, w: 780, h: 400, spacing: 50, postOnce: true, resizable: true, title: 'Designer Tools', url: 'designer' });
            } else {
                $('.windows .winDesigner').show();
            }

        },

        hideContent: function () {
            $('.winDesigner .backgrounds-content, .winDesigner .fonts-content, .winDesigner .colorschemes-content, .winDesigner .code-content').hide();
        },

        backgrounds: {
            show: function () {
                S.editor.designer.show();
                S.editor.designer.hideContent();
                $('.winDesigner .backgrounds-content').show();
            }
        },

        fonts: {
            show: function () {
                S.editor.designer.show();
                S.editor.designer.hideContent();
                $('.winDesigner .fonts-content').show();
            }
        },

        colors: {
            show: function () {
                S.editor.designer.show();
                S.editor.designer.hideContent();
                $('.winDesigner .colorschemes-content').show();
            }
        },

        code: {
            ace: null, sessions: [], selected: 0,

            show: function () {
                S.editor.designer.show();
                S.editor.designer.hideContent();
                $('.winDesigner .code-content').show();
                if ($('.winDesigner .code-content #ace-editor > div').length == 0) {
                    $.when(
                        $.getScript('/scripts/ace/builds/src-min-noconflict/ace.js'),
                        $.Deferred(function (deferred) { $(deferred.resolve); })
                    ).done(function () {
                        //configure Ace Editor
                        ace.config.set("basePath", "/scripts/ace/builds/src-min-noconflict/");
                        S.editor.designer.code.ace = ace.edit("ace-editor");
                        S.editor.designer.code.ace.setTheme("ace/theme/twilight");
                        S.editor.designer.code.ace.commands.addCommand({
                            name: 'saveFile',
                            bindKey: {
                                win: 'Ctrl-S',
                                mac: 'Command-S',
                                sender: 'editor|cli'
                            },
                            exec: function (env, args, request) {
                                S.editor.designer.code.file.save();
                            }
                        });

                        //load website folder list of files
                        S.ajax.post('/api/Dashboard/Designer/Code/LoadFolder', { type: 'website', folder: '' },
                            function (data) {
                                S.ajax.callback.inject(data);
                                //then load page CSS code for this web page
                                S.editor.designer.code.file.load('page', '')

                                //callback for resizing window
                                S.editor.window.resize.callback.add($('.winDesigner')[0], null, S.editor.designer.code.resizeAce);
                                S.editor.designer.code.resizeAce();
                            }
                        );

                    });
                }
            },

            file: {
                load: function (type, file) {
                    //load file into Ace Editor
                    $('.winDesigner .code-ace-files .item').removeClass('selected');
                    var s = S.editor.designer.code.sessions, found = false;
                    if (s.length > 0) {
                        for (x = 0; x < s.length; x++) {
                            if (s[x].type == type && s[x].file == file) {
                                found = true;
                                //show tab
                                $('.winDesigner .code-ace-files .item[data-filetype="' + type + '"][data-file="' + file + '"]').addClass('selected');
                                //load session into Ace Editor
                                S.editor.designer.code.selected = x;
                                S.editor.designer.code.file.modified(s[x].modified);
                                S.editor.designer.code.ace.setSession(s[x].session);
                                S.editor.designer.code.ace.focus();
                            }
                        }
                    }
                    if (found == false) {
                        //load file from server
                        S.editor.designer.code.ace.focus();
                        S.ajax.post('/api/Dashboard/Designer/code/LoadFile', { type: type, file: file },
                            function (data) {
                                //get file name
                                var f = file;
                                if (f == '') {
                                    switch (type) {
                                        case 'page':
                                            f = 'page.css'; break;
                                    }
                                }

                                //create tab
                                var div = document.createElement('div');
                                div.className = "item selected";
                                div.setAttribute('data-filetype', type);
                                div.setAttribute('data-file', file);
                                div.setAttribute('onclick', "S.editor.designer.code.file.load('" + type + "','" + file + "')");
                                div.innerHTML = f;
                                $('.winDesigner .code-ace-files').append(div);

                                //add session
                                var textmode = 'ace/mode/css', ext = S.util.file.extension(f);
                                switch (ext) {
                                    case 'htm':
                                    case 'html':
                                        textmode = 'ace/mode/html'; break;
                                    case 'rml':
                                        textmode = 'ace/mode/html'; break;
                                }
                                //create new session
                                var session = ace.createEditSession(data.d.html, textmode);
                                session.on("change", S.editor.designer.code.file.change, 'test');
                                //load session into Ace Editor
                                S.editor.designer.code.ace.setSession(session);
                                //save session to array
                                S.editor.designer.code.sessions.push({ type: type, file: file, session: session, modified: false });
                                S.editor.designer.code.selected = S.editor.designer.code.sessions.length - 1;
                                S.editor.designer.code.file.modified(false);
                            }
                        );
                    }
                },

                change: function (e, p) {
                    S.editor.designer.code.sessions[S.editor.designer.code.selected].modified = true;
                    S.editor.designer.code.file.modified(true);
                },

                modified: function (ismodified) {
                    if (ismodified == true) {
                        $('.winDesigner .code-ace-files .code-ace-save').css({ opacity: 1 }).attr('onclick', 'S.editor.designer.code.file.save()').removeClass('nosave');
                    } else {
                        $('.winDesigner .code-ace-files .code-ace-save').css({ opacity: 0.3 }).attr('onclick', '').addClass('nosave');
                    }
                },

                save: function () {
                    var s = S.editor.designer.code.sessions[S.editor.designer.code.selected];
                    if (s.modified == true) {
                        var t = s.session.getValue();
                        s.modified = false;
                        S.editor.designer.code.sessions[S.editor.designer.code.selected] = s;
                        $('.winDesigner .code-ace-files .code-ace-save').addClass('saving');
                        S.ajax.post('/api/Dashboard/Designer/code/SaveFile', { type: s.type, file: s.file, value: t },
                            function (data) {
                                $('.winDesigner .code-ace-files .code-ace-save').removeClass('saving').addClass('nosave');
                                S.editor.designer.code.file.modified(false);
                            }
                        );

                        if (s.type == 'page' && s.file == '') {
                            //update page CSS
                            $('#customCSS')[0].innerHTML = '<style rel="stylesheet/css" type="text/css">' + t + '</style>';
                        }
                    }
                },

                close: function () {

                }
            },

            folder: {
                load: function (type, folder) {
                    S.ajax.post('/api/Dashboard/Designer/code/LoadFolder', { type: type, folder: folder }, S.ajax.callback.inject);
                }
            },

            resizeAce: function () {
                var h = S.elem.height($('.winDesigner')[0]);
                var infoh = S.elem.height($('.winDesigner .code-ace-info')[0]);
                $('.winDesigner .code-editor').css({ height: h - 60 - infoh });
                S.editor.designer.code.ace.resize();
            }

        }
    },

    photos: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        info: { total: 0, start: 1, len: 0 },
        folder: '', selected: null, ismoving: false,

        init: function () {
            Dropzone.autoDiscover = false;
            var htm =
                '<div class="top-menu">' +
                    '<div class="folder">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-folder">' +
                            '<a href="javascript:" onclick="S.editor.photos.folders.show()">' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-folderfiles" x="0" y="0" width="25" height="25"></use></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label"></div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="folder-add" style="display:none;">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-folder-add relative">' +
                            '<a href="javascript:" onclick="S.editor.photos.folders.showAdd()" title="Add a new folder to put photos into">' +
                                '<div class="absolute icon-plus"><svg viewBox="0 0 25 25" style="width:9px;"><use xlink:href="#icon-plus" x="0" y="0" width="25" height="25" /></svg></div>' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-folderfiles" x="0" y="0" width="25" height="25"></use></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label"></div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="move-photos" style="display:none;">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-move">' +
                            '<a href="javascript:" onclick="S.editor.photos.buttons.move()" title="Move selected photos into another folder">' +
                                '<svg viewBox="0 0 31 25" style="width:31px;"><use xlink:href="#icon-movefolder" x="0" y="0" width="31" height="25"></use></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label">Move</div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="remove-photos" style="display:none;">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-remove">' +
                            '<a href="javascript:" onclick="S.editor.photos.buttons.remove()" title="Remove selected photos permanently">' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-remove" x="0" y="0" width="25" height="25"></use></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label">Remove</div>' +
                    '</div></div>' +
                    '</div>' +
                    '<div class="dropzone"></div>' +
                    '<div class="msg-movephotos" style="display:none;">Choose a folder to move your photos into. &nbsp;&nbsp;&nbsp;<a href="javascript:" onclick="S.editor.photos.buttons.moveCancel()">Cancel</a></div>' +
                    '<div class="upload">' +
                    '<div class="section-icons"><div class="column small">' +
                        '<div class="icon icon-upload">' +
                            '<a href="javascript:">' +
                                '<svg viewBox="0 0 25 25" style="width:25px;"><use xlink:href="#icon-upload" x="0" y="0" width="25" height="25"></use></svg>' +
                            '</a>' +
                        '</div>' +
                        '<div class="label">Upload</div>' +
                    '</div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="info-bar"><div class="selected-folder font-faded">Folder: All Photos</div><div class="folder-info font-faded"></div></div>' +
                '<div class="dialog-bar" style="display:none"></div>' +
                '<div class="folder-addbar" style="display:none">' +
                    '<div class="folder-create">' +
                    '<div class="row">' +
                        '<div class="column-label with-buttons">New Folder</div>' +
                        '<div class="column-input with-buttons"><input type="text" id="txtNewFolder"/></div>' +
                        '<div class="column-buttons">' +
                            '<div class="button" onclick="S.editor.photos.folders.add()">Create Folder</div>' +
                            '<div class="button cancel" onclick="S.editor.photos.folders.hideAdd()">Cancel</div></div>' +
                    '</div></div>' +
                '</div>' +
                '<div class="photo-list"></div>' +
                '<div class="folder-list"></div>';
            S.editor.window.load('Photos', '', htm, { x: 0, align: 'center', y: 0, w: 780, h: 400, spacing: 50, postOnce: true, title: 'Photo Library', visible: false, zIndex: 40, url: 'photos' });
        },

        show: function (dialog, type) {
            if (type == 'dashboard') {
                $('.winPhotos').addClass('dashboard');
                S.editor.dashboard.hideAllWindows();
                S.editor.dashboard.callback.resize();
                document.title = S.website.title + ' - Photos - Dashboard';
                S.url.push(S.website.title + ' - ' + 'Photos - Dashboard', 'Dashboard/Photos');
            }
            S.editor.window.hidePopUps();
            if ($('.winPhotos .photo-list')[0].children.length == 0) {
                S.ajax.post("/api/Dashboard/Photos/LoadPhotoList", { start: '1', folder: '', search: '', orderby: '0' },
                    function (data) {
                        S.ajax.callback.inject(data);
                        //change onclick 
                        if (dialog == 'select' || dialog == 'multiple') {
                            S.editor.photos.dialog.init();
                        }
                    }
                );
            } else if (dialog == 'select' || dialog == 'multiple') {
                S.editor.photos.dialog.init();
            }
            $('.winPhotos .dialog-bar').hide();
            $('.winPhotos').show();
            S.editor.show();
            S.editor.photos.folders.hide();
            S.editor.photos.buttons.hide();
        },

        bind: function () {
            $('.winPhotos .photo-list').off('click').on('click', 'input', function () {
                if ($(this).prop('checked') == true) {
                    $(this).parents('.check').removeClass('hover-only');
                    S.editor.photos.buttons.show();
                } else {
                    $(this).parents('.check').addClass('hover-only');
                    if ($('.winPhotos .photo-list :checked').length == 0) {
                        S.editor.photos.buttons.hide();
                    }
                }
            });
            if (S.editor.photos.dialog.type != '') {
                S.editor.photos.dialog.init();
            }
            S.editor.photos.folders.hide();
        },

        buttons: {
            show: function () {
                $('.winPhotos .move-photos, .winPhotos .remove-photos').show();
                $('.winPhotos .dropzone').hide();
            },

            hide: function () {
                $('.winPhotos .move-photos, .winPhotos .remove-photos').hide();
                $('.winPhotos .dropzone').show();
                $('.winPhotos .photo-list :checked').prop('checked', '').parents('.check').addClass('hover-only');
            },

            move: function () {
                //get a list of files
                var files = [], lst = $('.winPhotos .photo-list');
                var chks = $('.winPhotos .photo-list :checked');
                for (x = 0; x < chks.length; x++) {
                    files.push(chks[x].getAttribute("filename"));
                }
                S.editor.photos.selected = files;

                //load folders list
                S.editor.photos.folders.show('move');
                $('.winPhotos .top-menu .msg-movephotos').show();
                $('.winPhotos .top-menu .folder, .winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(1), .winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(2)').hide();
                S.editor.photos.ismoving = true;
            },

            moveCancel: function () {
                S.editor.photos.folders.bind();
                S.editor.photos.folders.hide();
                $('.winPhotos .top-menu .msg-movephotos').hide();
                $('.winPhotos .top-menu .show').hide();
            },

            remove: function () {
                if (confirm("Do you really want to remove these photos from your library? This cannot be undone.") == true) {
                    var files = [], lst = $('.winPhotos .photo-list');
                    var chks = $('.winPhotos .photo-list :checked');
                    S.editor.photos.info.len -= chks.length;
                    for (x = 0; x < chks.length; x++) {
                        files.push(chks[x].getAttribute("filename"));
                        $(chks).parents('.photo').remove();
                    }

                    S.ajax.post('/api/Dashboard/Photos/Remove', { files: files.join(',') }, S.ajax.callback.inject);
                }
            }
        },

        folders: {
            show: function (type) {
                S.ajax.post('/api/Dashboard/Photos/LoadFolders', { type: type != null ? type : '' }, S.ajax.callback.inject);
                $('.winPhotos .icon-folder use').attr('xlink:href', '#icon-grid');
                $('.winPhotos .icon-folder a').attr('onclick', 'S.editor.photos.folders.hide()');
                $('.winPhotos .photo-list, .winPhotos .info-bar, .winPhotos .dropzone, .winPhotos .upload').hide();
                $('.winPhotos .folder-list, .winPhotos .folder-add').show();
                S.editor.photos.buttons.hide();
            },

            hide: function () {
                $('.winPhotos .icon-folder use').attr('xlink:href', '#icon-folderfiles');
                $('.winPhotos .icon-folder a').attr('onclick', 'S.editor.photos.folders.show()');
                $('.winPhotos .folder-list, .winPhotos .folder-add, .winPhotos .folder-addbar, .winPhotos .top-menu .msg-movephotos').hide();
                $('.winPhotos .photo-list, .winPhotos .info-bar, .winPhotos .dropzone, .winPhotos .upload, .winPhotos .top-menu .folder, .winPhotos .folder-list .folder-column > .row').show();
                S.editor.photos.ismoving = false;
            },

            showAdd: function () {
                $('.winPhotos .folder-list').hide();
                $('.winPhotos .folder-addbar').show();
            },

            hideAdd: function () {
                $('.winPhotos .folder-addbar').hide();
                $('.winPhotos .folder-list').show();
            },

            add: function () {
                S.ajax.post('/api/Dashboard/Photos/AddFolder', { name: $('.winPhotos #txtNewFolder').val() }, S.ajax.callback.inject);
            },

            addCallback: function (name) {
                if (S.editor.photos.ismoving == true) {
                    S.editor.photos.folders.hideAdd();
                } else {
                    $('.winPhotos .folder-info')[0].innerHTML = ''; S.editor.photos.folders.hide();
                    $('.winPhotos .photo-list')[0].innerHTML = '<div class=""no-photos font-faded"">No photos in this folder yet. Drag & Drop your photos here.</div>';
                    S.editor.photos.folders.change(name);
                }
            },

            bind: function () {
                $('.winPhotos .folder-list').off('click').on('click', '.item', function (e) {
                    var name = $(this)[0].firstChild.textContent;
                    if (name == '[All Photos]') { name = ''; }
                    if (name == '[Unorganized Photos]') { name = '!'; }
                    S.editor.photos.folders.select(name);

                }).on('click', '.icon-close a', function (e) {
                    if ($(this).parents('.column-row.item')[0]) {
                        S.editor.photos.folders.remove($(this).parents('.column-row.item')[0].firstChild.textContent);
                    } return false;
                }).parent('.icon-close').addClass('hover-only').css({ 'display': '' });

            },

            bindForMove: function () {
                $('.winPhotos .folder-list').off('click').on('click', '.item', function (e) {
                    S.editor.photos.folders.moveTo($(this)[0].firstChild.textContent);
                }).find('.icon-close').removeClass('hover-only').hide();
                $('.winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(1), .winPhotos .folder-list .folder-column:nth-child(1) > .row:nth-child(2)').hide();
            },

            remove: function (name) {
                if (confirm("Do you really want to delete the folder '" + name + "' and all the photos that belong within the folder? This cannot be undone.") == true) {
                    S.ajax.post('/api/Dashboard/Photos/RemoveFolder', { folder: name }, S.ajax.callback.inject);
                }
            },

            select: function (name) {
                //if ($(e.target).parents('.icon-close').length > 0) { return; }
                S.ajax.post('/api/Dashboard/Photos/LoadPhotoList', { start: "1", folder: name, search: '', orderby: '0' }, S.ajax.callback.inject);
            },

            change: function (name) {
                var n = name.toString();
                if (n == '') { n = 'All Photos'; }
                if (n == '!') { n = 'Unorganized Photos'; }
                $('.winPhotos .selected-folder')[0].innerHTML = 'Folder: ' + n;
                S.editor.photos.folder = name;
                S.editor.photos.folders.bind();
                S.editor.photos.dropzone.body.options.url = '/api/Dashboard/Photos/Upload?v=' + S.ajax.viewstateId + '&folder=' + encodeURIComponent(S.editor.photos.folder);
            },

            moveTo: function (name) {
                S.ajax.post('/api/Dashboard/Photos/MoveTo', { folder: name, files: S.editor.photos.selected.join(',') }, S.ajax.callback.inject);
            }
        },

        dropzone: {
            body: null,

            init: function () {
                S.editor.photos.dropzone.body = new Dropzone(document.body, {
                    url: '/api/Dashboard/Photos/Upload?v=' + S.ajax.viewstateId,
                    previewsContainer: ".winPhotos .dropzone",
                    clickable: ".winPhotos .top-menu .upload a",
                    paramName: 'file',
                    maxFilesize: 4,
                    uploadMultiple: true,
                    thumbnailWidth: 50,
                    thumbnailHeight: 40,
                    parallelUploads: 1
                    , init: function () {
                        this.on('drop', function () {
                            $('.winPhotos .dropzone').animate({ height: 60 }, 300);
                            if (S.editor.dashboard.visible == true) {
                                S.editor.window.open.photoLibrary('dashboard');
                            } else {
                                S.editor.window.open.photoLibrary();
                            }

                        });

                        this.on('complete', function (file) {
                            this.removeFile(file);
                        });

                        this.on('successmultiple', function (f, data) {
                            var d = data.split(','), htm = '';
                            for (x = 1; x < d.length; x++) {
                                htm += '<div class="photo"><div class="check hover-only"><input type="checkbox" id="chkPhoto' + (S.editor.photos.info.start + S.editor.photos.info.len + x - 2) + '" /></div><div class="tbl-cell"><div class="img"><img src="' + d[0] + 'tiny' + d[x] + '"/></div></div></div>'
                            }
                            var list = $('.winPhotos .photo-list');
                            list.append(htm);
                            list.find('.no-photos').remove();
                            S.editor.photos.listInfo();
                            setTimeout(function () {
                                list.scrollTop(list.prop('scrollHeight') + 50);
                            }, 500);
                        });

                        this.on('queuecomplete', function () {
                            $('.winPhotos .dropzone').animate({ height: 0, minHeight: 0 }, 300);
                            var list = $('.winPhotos .photo-list');
                            S.editor.photos.listInfo();
                            setTimeout(function () {
                                list.scrollTop(list.prop('scrollHeight') + 50);
                            }, 1000);
                            S.ajax.post('/api/Dashboard/Photos/Save', { folder: S.editor.photos.folder }, S.ajax.callback.inject);
                        });
                    }
                });
            }
        },

        dialog: {
            exec: null, photos: [], type: '',

            init: function () {
                $('.winPhotos .photo-list').off('click', '.photo').on('click', '.photo', S.editor.photos.dialog.click);
                $('.winPhotos .photo-list .photo').css({ cursor: 'pointer' });
            },

            selectPhoto: function (serviceType, imageType, msg, callback) {
                //serviceType: null or 'photos', 'icons', 'webstorage' (dropbox, google drive, etc)
                //imageType: null or 'photo', 'icon', 'button', 'background', 'tile', 'person'
                S.editor.photos.show('select');
                $('.winPhotos .dialog-bar').show()[0].innerHTML = 'Please select a photo to use ' + msg + '&nbsp;&nbsp;<a href="javascript:" onclick="S.editor.photos.dialog.close()">Cancel</a>';
                S.editor.photos.dialog.exec = callback;
                S.editor.photos.dialog.type = 'select';
            },

            selectMultiple: function (serviceType, imageType, msg, callback) {
                //serviceType: null or 'photos', 'icons', 'webstorage' (dropbox, google drive, etc)
                //imageType: null or 'photo', 'icon', 'button', 'background', 'tile', 'person'
                S.editor.photos.show('multiple');
                $('.winPhotos .dialog-bar').show()[0].innerHTML = 'Please select one or more photos to use ' + msg +
                    '&nbsp;&nbsp;<a href="javascript:" onclick="S.editor.photos.dialog.close()">Done</a>'
                '&nbsp;&nbsp;&nbsp;<a href="javascript:" onclick="S.editor.photos.dialog.close()">Cancel</a>';
                S.editor.photos.dialog.exec = callback;
                S.editor.photos.dialog.type = 'multiple';
            },

            click: function (e) {
                if ($(e.target).parents('.check').length > 0 || $(e.target).hasClass('check')) { return; }
                var src = $(this).find('img')[0].getAttribute('src');

                if (src.indexOf('/') > -1) {
                    var path = src.split('/');
                    src = path[path.length - 1].replace('tiny', '');
                }
                S.editor.photos.dialog.exec(src);
                if (S.editor.photos.dialog.type == 'select') {
                    S.editor.photos.dialog.close();
                }
            },

            close: function () {
                S.editor.photos.dialog.exec = null;
                S.editor.photos.dialog.photos = null;
                S.editor.photos.dialog.type = '';
                $('.winPhotos .photo-list').off('click', '.photo');
                $('.winPhotos .photo-list .photo').css({ cursor: 'default' });
                $('.winPhotos').hide();
            },

            callback: function (photos) {
                var dialog = S.editor.photos.dialog;
                if (dialog.exec != null) {
                    //execute callback
                }
            }

        },

        listInfo: function () {
            var end = 0, total = $('.winPhotos .photo-list > .photo').length;
            if (arguments[0]) {
                end = arguments[0];
                S.editor.photos.info.len = total;
                S.editor.photos.info.total = end;
            } else {
                end = S.editor.photos.info.len + S.editor.photos.info.start - 1;
                if (total + S.editor.photos.info.start - 1 > end) {
                    S.editor.photos.info.len = total;
                    S.editor.photos.info.total += ((total + S.editor.photos.info.start - 1) - end);
                }
            }
            if (arguments[1]) { S.editor.photos.info.start = arguments[1]; }
            if (S.editor.photos.info.len > 0 && S.editor.photos.info.start == 0) { S.editor.photos.info.start = 1; }
            var a = S.editor.photos.info;
            $('.winPhotos .folder-info')[0].innerHTML = 'Viewing ' + a.start + ' to ' + a.len + ' of ' + a.total + ' photos';
        }
    },

    save: { ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        cache: [],

        add: function (id, type, obj) {
            var i = -1;
            for (x = 0; x < this.cache.length; x++) {
                if (this.cache[x].id == id && this.cache[x].type == type) {
                    i = x; break;
                }
            }
            if (i == -1) {
                i = this.cache.length;
            }
            this.cache[i] = { id: id, type: type, data: obj };
            $('.editor .toolbar .savepage').removeClass('nosave');
        },

        enable: function () {
            $('.editor .toolbar .savepage').removeClass('nosave');
        },

        click: function (callback) {
            if ($('.editor .toolbar .savepage').hasClass('saving') == false && $('.editor .toolbar .savepage').hasClass('nosave') == false) {
                var options = {};
                options.save = JSON.stringify(S.editor.save.cache);
                S.editor.save.cache = [];
                $('.editor .toolbar .savepage').addClass('saving');
                clearTimeout(S.ajax.timerKeep);
                S.ajax.post("/api/App/KeepAlive", options, function () {
                    if (callback != null) { callback(); }
                    $('.editor .toolbar .savepage').removeClass('saving').addClass('nosave');
                    S.ajax.expire = new Date();
                    S.ajax.keepAlive();
                });
            } else { if (callback != null) { callback(); } }
        }
    },

    logout: function () {
        S.editor.hide();

        //unbind events
        delete document.onkeydown;
        S.events.doc.click.callback.remove($('.editor')[0]);
        $('.webpage').delegate('.component', 'mouseenter');
        $('.component-select').delegate('.resize-bar', 'mousedown');
        $('.component-select').unbind('mouseleave');

        for (e in this.window.windows) {
            S.events.doc.resize.callback.remove(this.window.windows[e].elem);
        }

        //remove DOM elements
        var editor = $('body > .editor')[0]; editor.parentNode.removeChild(editor);
        var gridleft = $('.webpage > .grid-leftside')[0]; gridleft.parentNode.removeChild(gridleft);
        var gridright = $('.webpage > .grid-rightside')[0]; gridright.parentNode.removeChild(gridright);
    }
}

S.hotkeys = {
    keyhold: '',
    keydown: function (e) {
        if ($("input, textarea").is(":focus") == false && $('.textedit.editing').length == 0) {
            var k = e.keyCode, itemId = '', isPanel = false, c = null;
            if (S.editor.components.hovered != null) {
                c = S.editor.components.hovered;
                itemId = c.id.substr(1);
                if ($(c).hasClass('type-stackpanel') == true) { isPanel = true; }
            }

            if (e.shiftKey == true) {//shift pressed
                S.hotkeys.keyhold = 'shift';
                S.hotkeys.callback.execute('onKeyDown', k, 'shift');
                var a, lbl;
                switch (k) { //setup variables for groups of keys
                    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: case 48:
                        //a = $S('aResponsiveSpeed'); lbl = $S('spanResponsiveSpeed');
                }
                switch (k) { //execute code for single key + shift press
                    case 38: //up
                        S.editor.components.nudge('up', 10);
                        break;
                    case 39: //right
                        S.editor.components.nudge('right', 10);
                        break;
                    case 40: //down
                        S.editor.components.nudge('down', 10);
                        break;
                    case 37: //left
                        S.editor.components.nudge('left', 10);
                        break;
                    case 49: //1
                        //a.innerHTML = 'fast';
                        //lbl.innerHTML = "On instant";
                        S.viewport.speed = 0;
                        break;
                    case 50: //2
                        //a.innerHTML = 'slow';
                        //lbl.innerHTML = "On fast";
                        S.viewport.speed = 1;
                        break;
                    case 51: //3
                        //a.innerHTML = 'slower';
                        //lbl.innerHTML = "On slow";
                        S.viewport.speed = 3;
                        break;
                    case 52: //4
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slower";
                        S.viewport.speed = 9;
                        break;
                    case 53: //5
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x2";
                        S.viewport.speed = 12;
                        break;
                    case 54: //6
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x3";
                        S.viewport.speed = 18;
                        break;
                    case 55: //7
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x4";
                        S.viewport.speed = 25;
                        break;
                    case 56: //8
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x5";
                        S.viewport.speed = 35;
                        break;
                    case 57: //9
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x6";
                        S.viewport.speed = 50;
                        break;
                    case 48: //0
                        //a.innerHTML = 'instant';
                        //lbl.innerHTML = "On slow x7";
                        S.viewport.speed = 100;
                        break;
                }

            } else if (e.ctrlKey == true) {
                S.hotkeys.keyhold = 'ctrl';
                S.hotkeys.callback.execute('onKeyDown', k, 'ctrl');
                switch (k) {
                    case 67: //c (copy)

                        return false;
                        break;
                    case 86: //v (paste)
                        
                        return false;
                        break;
                    case 88: //x (cut)
                        //postWebsilkAjax('8', itemId + ',' + winPos.scrolly);
                        break;
                    case 89: //y (redo)
                        //RedoAction();
                        break;
                    case 90: //z (undo);
                        //UndoAction();
                        break;

                }

            } else { //no shift, ctrl, or alt pressed
                S.hotkeys.keyhold = '';
                S.hotkeys.callback.execute('onKeyDown', k, '');
                switch (k) {
                    case 27: //escape
                        if ($('.editor .toolbar')[0].style.display == 'none') {
                            S.editor.show();
                        } else {
                            S.editor.hide();
                        }
                        break;
                    case 38: //up
                        S.editor.components.nudge('up', 1);
                        break;
                    case 39: //right
                        S.editor.components.nudge('right', 1);
                        break;
                    case 40: //down
                        S.editor.components.nudge('down', 1);
                        break;
                    case 37: //left
                        S.editor.components.nudge('left', 1);
                        break;
                    case 46: //backspace
                        S.editor.components.remove();
                        break;
                    case 49: //1
                        S.viewport.view(0);
                        break;
                    case 50: //2
                        S.viewport.view(1);
                        break;
                    case 51: //3
                        S.viewport.view(2);
                        break;
                    case 52: //4
                        S.viewport.view(3);
                        break;
                    case 53: //5
                        S.viewport.view(4);
                        break;
                }
            }

            if (k >= 37 && k <= 40) { //arrow keys
                if ($('.type-textbox .textedit.editing').length == 0) {
                    return false;
                }

            }

        }
    },

    keyup: function (e) {
        var k = e.keyCode;
        S.hotkeys.keyhold = '';
        if (e.shiftKey == true) {//shift pressed
            S.hotkeys.callback.execute('onKeyUp', k, 'shift');

        } else if (e.ctrlKey == true) {
            S.hotkeys.callback.execute('onKeyUp', k, 'ctrl');

        } else {
            S.hotkeys.callback.execute('onKeyUp', k, '');
        }
    },

    callback: {
        //register & execute callbacks when the window resizes
        items: [],

        add: function (elem, vars, onKeyDown, onKeyUp) {
            this.items.push({ elem: elem, vars: vars, onKeyDown: onKeyDown, onKeyUp: onKeyUp });
        },

        remove: function (elem) {
            for (var x = 0; x < this.items.length; x++) {
                if (this.items[x].elem == elem) { this.items.splice(x, 1); x--; }
            }
        },

        execute: function (type, key, keyHeld) {
            if (this.items.length > 0) {
                switch (type) {
                    case '': case null: case 'onKeyDown':
                        for (var x = 0; x < this.items.length; x++) {
                            if (typeof this.items[x].onKeyDown == 'function') {
                                this.items[x].onKeyDown(key, keyHeld);
                            }
                        } break;

                    case 'onKeyUp':
                        for (var x = 0; x < this.items.length; x++) {
                            if (typeof this.items[x].onKeyUp == 'function') {
                                this.items[x].onKeyUp(key, keyHeld);
                            }
                        } break;
                }
            }
        }
    }
}

//Viewport (editor-specific) functions //////////////////////////////////////////////////////////////
S.viewport.resize = function (width) {
    var webpage = $('.webpage');
    if (webpage.css('maxWidth') == '' || webpage.css('maxWidth') == 'none') {
        webpage.css({ 'maxWidth': webpage.width() });
    }
    webpage.stop().animate({ maxWidth: width }, {
        duration: this.speed * 1000,
        progress: function () {
            if (S.viewport.getLevel() == true) {
                S.viewport.levelChanged(S.viewport.level);
            }
            S.events.doc.resize.trigger();
        },
        complete: function () {
            S.events.doc.resize.trigger();
            S.viewport.getLevel();
            if (S.viewport.isChanging == true) {
                S.viewport.isChanging = false;
                if (S.editor.enabled == true) { S.editor.components.disabled = false; }
                S.viewport.levelChanged(S.viewport.level);
            } else {
                if (S.editor.enabled == true) { S.editor.components.resizeSelectBox(); }
            }
        }
    });
}

S.viewport.view = function (level) {
    //hide selected components
    S.editor.components.hideSelect();
    S.editor.components.disabled = true;
    switch (level) {
        case 4: //HD
            S.viewport.resize(1920); break;

        default: //all other screen sizes
            S.viewport.resize(S.viewport.levels[level]); break;
    }
    S.viewport.isChanging = false;
    S.viewport.levelChanged(level)
    S.viewport.isChanging = true;
}

S.viewport.levelChanged = function (level) {
    if (S.viewport.isChanging == true) { return; }
    S.viewport.sizeIndex = level;
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
}

S.viewport.nextLevel = function () {
    if (S.editor.enabled == false) { return; }
    S.viewport.speed = 2;
    var sizeIndex = S.viewport.sizeIndex;
    if (sizeIndex == -1) {
        sizeIndex = S.viewport.level;
    }
    var next = sizeIndex > 0 ? sizeIndex - 1 : 4;
    S.viewport.view(next);
}

S.viewport.previousLevel = function () {
    if (S.editor.enabled == false) { return; }
    S.viewport.speed = 2;
    var sizeIndex = S.viewport.sizeIndex;
    if (sizeIndex == -1) {
        sizeIndex = S.viewport.level;
    }
    var prev = sizeIndex < 4 ? sizeIndex + 1 : 0;
    S.viewport.view(prev);
}

S.viewport.getLevelOrder = function () {
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

//Utility classes ///////////////////////////////////////////////////////////////////////////////////
S.util.str = {
    Capitalize: function (str) {
        return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    },

    isAlphaNumeric: function (str, spaces, exchars) {
        var ex = [], chr, sub, err = false;
        if (exchars) { if (exchars.length > 0) { ex.concat(exchars); } }
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
    show: function (div, msg) {
        $(div).css({ opacity: 0, height: 'auto' }).show().html(msg);
        var h = S.elem.height($(div)[0]);
        $(div).css({ height: 0, overflow: 'hidden' }).show().animate({ height: h - 9, opacity: 1 }, 1000).delay(10000).animate({ opacity: 0, height: 0 }, 1000, function () { $(this).hide(); });
    }
}

S.util.css = {
    objects: function(a){
        var sheets = document.styleSheets, o = {};
        for(var i in sheets) {
            var rules = sheets[i].rules || sheets[i].cssRules;
            for(var r in rules) {
                if(a.is(rules[r].selectorText)) {
                    o = $.extend(o,
                        S.util.css.convert(rules[r].style),
                        S.util.css.convert(a.attr('style')
                        ));
                }
            }
        }
        return o;
    },

    convert: function (css){
        var s = {};
        if(!css) return s;
        if(css instanceof CSSStyleDeclaration) {
            for(var i in css) {
                if((css[i]).toLowerCase) {
                    s[(css[i]).toLowerCase()] = (css[css[i]]);
                }
            }
        } else if(typeof css == "string") {
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
    var pos = S.elem.pos(elem);
    var options = { offset: -100 }
    if (arguments[1] != null) {
        var arg = arguments[1];
        if (arg.offset != null) { options.offset = arg.offset; }
    }
    if (pos.y < S.window.scrolly - 50 || pos.y + pos.h > S.window.h + S.window.scrolly + 10) {
        $(document.body).scrollTo($(elem), options);
    }
}

// Window Events ////////////////////////////////////////////////////////////////////////////////////
document.onkeydown = S.hotkeys.keydown;
document.onkeyup = S.hotkeys.keyup;
S.events.doc.resize.callback.add($('.editor')[0], null, null, null, S.editor.events.doc.resize);
S.events.doc.click.callback.add($('.editor')[0], null, S.editor.window.callback.click);
S.events.doc.click.callback.add($('.editor')[0], null, S.editor.components.click);
S.events.url.callback.add($('.editor')[0], null, S.editor.events.url.change);
$('.webpage').delegate('.component', 'mouseenter', S.editor.components.mouseEnter);
$('.webpage').delegate('.inner-panel', 'mouseenter', S.editor.components.mouseEnter);
$('.component-select').delegate('.resize-bar', 'mousedown', S.editor.components.resize.start);
$('.component-select .btn-duplicate > .submenu').hover(
    function () { $('.component-select .btn-duplicate .label').show(); },
    function () { $('.component-select .btn-duplicate .label').hide(); });
