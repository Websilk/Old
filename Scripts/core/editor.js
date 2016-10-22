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

        //initialize any dialog windows
        S.editor.dialogs.url.init();

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
        S.editor.toolbar.show();
        $('.editor > .windows, .tools').show();
        $('.editor > .tab').hide();
        $('.body').css({ top: S.editor.toolbar.height });
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

    toolbar: {
        height: 50,

        show: function () {
            $('.editor .toolbar').show();
            S.editor.toolbar.height = 50;
        },

        hide: function () {
            $('.editor .toolbar').hide();
            S.editor.toolbar.height = 0;
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