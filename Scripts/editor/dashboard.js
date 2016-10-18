S.editor.dashboard = {
    visible: false, init: false,

    show: function (url, query) {
        S.editor.toolbar.hide();
        $('.webpage, .window').hide();
        $('body').addClass('dashboard');
        S.window.changed = true;
        S.window.pos();

        //if ($('.editor > .toolbar')[0].style.display == 'none') { S.editor.show(); }
        $('.toolbar > .menu, .toolbar > .rightside > .savepage, .toolbar > .rightside > .close > a').hide();
        S.editor.dashboard.visible = true;

        //add callback for the url
        if (S.editor.dashboard.init == false) {
            S.editor.dashboard.init = true;
        }

        if ($('.winDashboardInterface').length == 0) {

            //load interface window
            S.editor.window.load('DashboardInterface', 'Dashboard/Interface/Load', {}, { x: 0, y: 0, w: '100%', h: '100%', toolbar: false });
                
            //load from url with a delay
                
        } else {
            $('.winDashboardInterface').addClass('dashboard').show();
                
        }
        S.editor.dashboard.loadFromUrl(url, query);
            

        S.events.doc.resize.callback.add('dashboardresize', null, null, S.editor.dashboard.callback.resize, S.editor.dashboard.callback.resize);
        S.editor.dashboard.callback.resize();
    },

    hide: function () {
        S.editor.toolbar.show();
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
                var h = S.editor.toolbar.height;
                var pos = S.elem.pos($('.winDashboardInterface .dash-body')[0]);
                $('.window.interface.dashboard:not(.winDashboardInterface)').css({ top: h, left: pos.x, width: pos.w, height: S.window.h - h }).find('.grip').hide();
                $('.dash-menu').css({ height: S.window.h - h });
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

    loadFromUrl: function (url, query) {
        if (url.indexOf('dashboard/') == 0) {
            var arrurl = url.split('/', 3);
            switch (arrurl[1].toLowerCase()) {
                case 'timeline':
                    S.editor.window.open.timeline();
                    break;

                case 'pages':
                    S.editor.window.open.pages();
                    break;

                case 'page-settings':
                    S.editor.window.open.pageSettings(query.id.toString());
                    break;

                case 'photos':
                    S.editor.window.open.photoLibrary(S.editor.dashboard.visible ? 'dashboard' : null);
                    break;

                case 'analytics':
                    S.editor.window.open.analytics();
                    break;

                case 'designer':
                    S.editor.window.open.designer();
                    break;

                case 'users':
                    S.editor.window.open.users();
                    break;

                case 'apps':
                    S.editor.window.open.apps();
                    break;

                case 'settings':
                    S.editor.window.open.websiteSettings();
                    break;

                case 'tests':
                    if (arrurl.length >= 3) {
                        S.editor.window.open.tests(arrurl[2]);
                    }
                    break;

                default:
                    S.editor.window.open.timeline();
            }
        } else if (url == 'dashboard') {
            S.editor.window.open.timeline();
        }
    }
};