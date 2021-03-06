﻿S.hotkeys = {
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
};