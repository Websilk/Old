S.editor.pages = {
    tree: {
            items: [],

            add: function (pageId, title) {
                S.editor.pages.tree.items.push({ pageId: pageId, title: title });
            },

            remove: function (pageId) {
                var found = false;
                for (var x = 0; x < S.editor.pages.tree.items.length; x++) {
                    if (S.editor.pages.tree.items[x].pageId == pageId) { found = true; break; }
                }
                S.editor.pages.tree.items.splice(x - 1, 1);
            },

            updateTitle: function () {
                var htm = '';
                for (x = 0; x < S.editor.pages.tree.items.length; x++) {
                    if (x > 0) { htm += '/'; }
                    htm += S.editor.pages.tree.items[x].title;
                }
                //if (htm == '') { htm = 'root';}
                //$('.winWebPages .pages-title .page-title')[0].innerHTML = '/' + htm;
            }
    },

    add: {
            item: { parentId: 0, title: '', description: '' },
            show: function (parentId, path) {
                S.editor.pages.add.item = { parentId: parentId, title: '', description: '' };
                S.editor.window.load('NewPage', 'Dashboard/Pages/NewPage', { parentId: parentId || 0, path: path },
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', dialog:true, spacing: 50, loadOnce: true, noDashboard: true, title: 'New Web Page' });
            },

            typeTitle: function () {
                var title = $('#newPageTitle').val(), err = false;
                if (err == false) { if (title == '') { err = true; } }
                if (err == false) { err = S.util.str.isAlphaNumeric(title, true, '.'); }
                if (err == false) { err = S.util.str.hasCurseWords(title); }
                title = title.replace(/ /g, '-');
                if (err == true) {
                    $('#newpage-url').html('<div class="font-error" style="text-decoration:line-through">' + S.editor.pages.add.item.url + '/' + title + '</div>');
                } else {
                    $('#newpage-url').html(S.editor.pages.add.item.url + '/' + title);
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
                    err = S.util.str.isAlphaNumeric(title, true, '.');
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
                S.editor.window.load('PageSettings', 'Dashboard/Pages/PageSettings', { pageId: pageId },
                    { x: 'center', y: 0, w: 400, h: 200, align: 'center', spacing: 50, loadOnce: true, title: 'Web Page Settings', url: 'page-settings?id=' + pageId });
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
        S.ajax.post('/api/Dashboard/Pages/Remove', { pageId: pageId }, S.ajax.callback.inject);
    },

    undoRemove: function(pageId){
        S.ajax.post('/api/Dashboard/Pages/UndoRemove', { pageId: pageId }, S.ajax.callback.inject);
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
};