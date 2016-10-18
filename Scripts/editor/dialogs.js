S.editor.dialogs = {
    url: {
            _callback: null,

            init: function () {
                htm =
                '<div class="row">' +
                    '<div class="column-left islabel">' +
                        '<div class="icon icon-folder">' +
                            '<a href="javascript:" onclick="S.editor.dialogs.url.folders.show()">' +
                                '<svg viewBox="0 0 18 18" style="width:18px; height:18px;"><use xlink:href="#icon-folderfiles" x="0" y="0" width="18" height="18"></use></svg>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="column-left islabel" style="width:100%; max-width:370px;"><input type="text" id="txtDialogUrl" style="width:100%; max-width:370px;"/></div>' +
                    '<div class="column-left">' +
                        '<div class="button apply" onclick="S.editor.dialogs.url.select()">Select</div>' +
                    '</div>' +
                '</div>';
                S.editor.window.load('Url', '', htm, { x: 0, align: 'center', y: 0, w: 500, h: 80, spacing: 50, postOnce: true, title: 'Choose a URL', zIndex: 40, visible:false, url: 'photos', classes:'isdialog' });
            },

            show:function(callback, url){
                S.editor.dialogs.url._callback = callback;
                $('#txtDialogUrl').val(url || '');
                $('.winUrl').show();
            },

            select: function () {
                S.editor.dialogs.url._callback($('#txtDialogUrl').val());
                $('.windows > .winUrl').hide();
            }
    }
}