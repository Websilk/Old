S.editor.photos = {
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
                                list.scrollTop(list.prop('scrollHeight') + S.editor.toolbar.height);
                            }, 500);
                        });

                        this.on('queuecomplete', function () {
                            $('.winPhotos .dropzone').animate({ height: 0, minHeight: 0 }, 300);
                            var list = $('.winPhotos .photo-list');
                            S.editor.photos.listInfo();
                            setTimeout(function () {
                                list.scrollTop(list.prop('scrollHeight') + S.editor.toolbar.height);
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
};