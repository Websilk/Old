S.editor.events = {
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
};