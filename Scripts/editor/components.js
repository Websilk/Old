S.editor.components = {
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
            if (comp) { if (S.elem.isInnerPanel(comp) == true) { return; } }
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
                div.style.width = S.window.w + 'px';
                div.style.height = S.window.h + 'px';
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
            if (S.elem.isInnerPanel(S.editor.components.hovered) == true) { return; }

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
            div.style.width = S.window.w + 'px';
            div.style.height = S.window.h + 'px';
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
        if (S.elem.isInnerPanel(c) == true) {
            //cancel if hovered element is not a panel cell from a panel component
            if (sel == null && reselect == false) { return; }
            var p = S.elem.panelCell(c);
            if (p == null) { return; }
            var parentId = p.id;
            //check if there is a selected element
            if (sel != null) {
                //check if hovered element is inside selected element
                if (S.elem.isInnerPanel(sel) == true) {
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
            if (S.elem.isInnerPanel(sel) == true) {
                if (S.elem.isInnerPanel(c) == true) {
                    //check if hovered element is a panel
                    if ($(c).hasClass('type-panel') == true) {
                        if ($(sel).closest('.type-panel')[0] == c) {
                            if (arguments[0].stopPropagation) { arguments[0].stopPropagation(); }
                            return;
                        }
                    }

                }
            } else if (S.elem.isInnerPanel(c) == true) {
                if ($(sel).parents('#' + c.id).length > 0) { return; }
            } else if (S.elem.isInnerPanel(c) == true) {
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
            } else if (S.elem.isInnerPanel(c) == true) {
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
        if ($(target).parents('.isdialog').length > 0) { return;}
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
                        if ($(t).hasClass('type-panel') == true || S.elem.isInnerPanel(t) == true) {
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
            if (S.elem.isInnerPanel(comps.hovered) == true) {
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
        if (S.elem.isInnerPanel(sel) == false && ctype != null) {
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
            h = S.editor.toolbar.height,
            pad = { left: 12, right: 12, top: 12, bottom: 12 },
            corner = this.resize.options.corner,
            border = this.resize.options.border,
            inner = { left: false, right: false, top: false },
            menu = this.selbox.find('.menu'), menuy = 0;
        var menuPos = S.elem.offset(menu[0]);

        //check padding for window edges
        if (cPos.x + cPos.w + border + menuPos.w >= S.window.w) {
            //right edge
            if (cPos.x + cPos.w + border >= S.window.w) {
                pad.right = 0 - ((cPos.x + cPos.w) - S.window.w);
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
        if (cPos.y - border < h) {
            //top edge
            pad.top = 0 - (h - (cPos.y));
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
        if (cPos.y + cPos.h - 70 > S.window.h + S.window.scrolly) {
            $('.component-select .btn-duplicate').css({
                left: (inner.right == true ? cPos.w - 45 : cPos.w) - 62,
                top: cPos.h - ((cPos.y + cPos.h) - (S.window.h + S.window.scrolly)) - 62
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
        if (S.elem.isInnerPanel(c) == true) {
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
    };