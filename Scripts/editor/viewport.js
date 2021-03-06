﻿S.viewport.resize = function (width) {
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