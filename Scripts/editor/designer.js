S.editor.designer = {

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
};