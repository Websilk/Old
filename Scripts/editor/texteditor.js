S.editor.textEditor = {
    selected: false, pressing:false,

    init: function () {
        //setup callbacks
        var htm = '';
        S.editor.components.callback.add($('.editor')[0], null, null, this.show, null, this.hide);

        //generate toolbar
        var toolbar = document.createElement('div'),
            btnSelect = document.createElement('div');

        toolbar.className = 'texteditor-toolbar';
        toolbar.style.display = 'none';

        btnSelect.className = 'texteditor-btnselect skin';
        btnSelect.style.display = 'none';

        //create buttons for toolbar
        var buttons = [
            [
                { title: 'bold', cssName: 'tool-bold', svg: 'bold', click: 'S.editor.textEditor.commands.bold()' },
                { title: 'italic', cssName: 'tool-italic', svg: 'italic', click: 'S.editor.textEditor.commands.italic()' },
                { title: 'strike-thru', cssName: 'tool-linethru', svg: 'strikethru', click: 'S.editor.textEditor.commands.strikethru()' },
                { title: 'underline', cssName: 'tool-underline', svg: 'underline', click: 'S.editor.textEditor.commands.underline()' },
                { title: 'font family', cssName: 'tool-font', classes: 'dropdown', html: '<select id="textEditorFontFamily" onchange="S.editor.textEditor.commands.fontFamily()" style="width:150px;">' + S.editor.textEditor.fonts.list() + '</select>' },
                { title: 'font size', cssName: 'tool-fontsize', classes: 'dropdown', html: '<select id="textEditorFontSize" onchange="S.editor.textEditor.commands.fontSize()" style="width:55px;">' + S.editor.textEditor.fonts.size() + '</select>' },
                { title: 'more', svg: 'more', click: 'S.editor.textEditor.commands.more(2)' }
            ],
            [
                { title: 'bullet list', cssName: 'tool-bulletlist', svg: 'bullet', click: 'S.editor.textEditor.commands.list()' },
                { title: 'number list', cssName: 'tool-numberlist', svg: 'numbers', click: 'S.editor.textEditor.commands.list(\'decimal\')' },
                { title: 'indent', cssName: 'tool-indent', svg: 'indent', click: 'S.editor.textEditor.commands.indent()' },
                { title: 'align left', cssName: 'tool-alignleft', svg: 'left', click: 'S.editor.textEditor.commands.alignLeft()' },
                { title: 'align center', cssName: 'tool-aligncenter', svg: 'center', click: 'S.editor.textEditor.commands.alignCenter()' },
                { title: 'align right', cssName: 'tool-alignright', svg: 'right', click: 'S.editor.textEditor.commands.alignRight()' },
                { title: 'photo', cssName: 'tool-photo', svg: 'photo', click: 'S.editor.textEditor.commands.photo.show()' },
                { title: 'table', cssName: 'tool-table', svg: 'table', click: 'S.editor.textEditor.commands.table.show()' },
                { title: 'anchor link', cssName: 'tool-anchor', svg: 'link', click: 'S.editor.textEditor.commands.link.show()' },
                { title: 'source code', cssName: 'tool-source', svg: 'source', click: 'S.editor.textEditor.commands.source.show()' },
                { title: 'font color', cssName: 'tool-color', svg: 'color', click: 'S.editor.textEditor.commands.colors.show("color")' },
                { title: 'highlight color', cssName: 'tool-bgcolor', svg: 'bgcolor', click: 'S.editor.textEditor.commands.colors.show("highlight")' },
                { title: 'more', svg: 'more', click: 'S.editor.textEditor.commands.more(1)' }
            ]
        ];

        //render buttons
        for (x = 0; x < buttons.length; x++) {
            htm += '<div class="buttons b' + (x + 1) + ' skin"' + (x == 0 ? ' style="display:block;"' : '') + '>';
            for (y = 0; y < buttons[x].length; y++) {
                if (buttons[x][y].html) {
                    htm += '<div class="button ' + buttons[x][y].cssName + (buttons[x][y].classes ? ' ' + buttons[x][y].classes : '') +
                        '" title="' + buttons[x][y].title + '">' + buttons[x][y].html + '</div>';
                } else {
                    htm += '<div class="button ' + buttons[x][y].cssName + '"><a href="javascript:" onmousedown="' + buttons[x][y].click + ';return false" title="' + buttons[x][y].title + '">' +
                    '<svg viewBox="0 0 18 18"><use xlink:href="#icon-text' + buttons[x][y].svg + '" x="0" y="0" width="18" height="18"></use></svg></a></div>';
                }
            }
            htm += '</div>';
        }


        //add toolbar to the tools div
        toolbar.innerHTML = htm;
        $('.tools').append(toolbar);
        htm = '';

        //create button for viewing the component select
        var btns = [{ title: 'View the Component Box & Options Menu for this Textbox', svg: 'componentselect', click: 'S.editor.textEditor.commands.componentSelect()' }];
        for (x = 0; x < btns.length; x++) {
            htm += '<div class="button"><a href="javascript:" onmousedown="' + btns[x].click + ';return false" title="' + btns[x].title + '">' +
                '<svg viewBox="0 0 22 19" style="width:22px"><use xlink:href="#icon-' + btns[x].svg + '" x="0" y="0" width="22" height="19"></use></svg></a></div>';
        }


        //add button to the tools div
        btnSelect.innerHTML = htm;
        $('.tools').append(btnSelect);
        htm = '';

        //create button for viewing the text editor
        htm = '<div style="width:17px; height:17px;">' +
              '<svg viewBox="0 0 17 17" style="width:17px; height:17px; padding-top:5px;"><use xlink:href="#icon-options" x="0" y="0" width="17" height="17"></use></svg>' +
              '</div>';

        //add text editor button to the component select menu
        S.editor.components.menu.items.add('textbox', 'texteditor', htm, 'before', 'S.editor.components.click($(".component-select")[0], "component-select")');



        //configure rangy
        rangy.config.preferTextRange = true;
        rangy.createMissingNativeApi();
    },

    show: function (target) {
        if ($(target).hasClass('type-textbox') == true) {
            var editor = S.editor.textEditor;
            var textedit = $(target).find('.textedit');
            textedit.addClass('editing')[0].contentEditable = "true";

            //setup events
            S.hotkeys.callback.add('texteditor', null, null, editor.keyUp);
            textedit.bind('mousedown', editor.mouseDown);
            textedit.bind('mouseup', editor.mouseUp);
            S.events.doc.scroll.callback.add($('.tools .texteditor-toolbar')[0], target, editor.reposition, editor.reposition, editor.reposition);
            S.events.doc.resize.callback.add($('.tools .texteditor-toolbar')[0], target, editor.reposition, editor.reposition, editor.reposition);

            //reposition the text editor toolbar
            editor.reposition(target);
            editor.selected = true;
            S.editor.components.disabled = true;

            //focus text
            var range = document.createRange();
            var sel = window.getSelection();
            try {
                range.setStart(textedit[0].lastChild, 1);
            } catch (ex) { }
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            textedit.focus();
            editor.info();
        }
    },

    reposition: function (target) {
        var t = this.vars ? this.vars : target;
        var pos = S.elem.pos(t);
        var tPos = { x: pos.x, y: pos.y - 45 };
        if (pos.y - S.window.scrolly < 105) {
            tPos.y = pos.y + pos.h + 10;
        }
        $('.tools .texteditor-toolbar').css({ top: tPos.y, left: tPos.x - 12 }).show();

        pos = S.elem.pos(t);
        if (pos.x + pos.w + 60 > S.window.w) { pos.x -= (40); }
        if (pos.y - S.window.scrolly < 105) { pos.y += pos.h - 12; }
        $('.tools .texteditor-btnselect').css({ top: pos.y - 12, left: pos.x + pos.w + 10 }).show();
    },

    hide: function (target, clicked) {
        if (target == null) {
            S.editor.components.hovered = null;
            S.editor.components.selected = null;
            S.editor.textEditor.selected = false;
            S.editor.components.disabled = false;
            return;
        }
        if ($(target).parents('.isdialog').length > 0) { return;}
        if ($(target).hasClass('type-textbox') == true) {
            if ($(clicked).parents('.textedit.editing, .texteditor-toolbar').length >= 1 || 
                target == clicked || $(clicked).hasClass('textedit editing') ||
                S.editor.textEditor.pressing == true) {
                S.editor.components.disabled = true;
                S.editor.textEditor.pressing = false;
                return;
            }
            if ($(target).find('.textedit.editing').length == 1) {
                var textedit = $(target).find('.textedit');
                textedit.removeClass('editing')[0].contentEditable = "false";
                S.hotkeys.callback.remove('texteditor', null, null, S.editor.textEditor.keyUp);
                textedit.unbind('mousedown', S.editor.textEditor.mouseDown);
                textedit.unbind('mouseup', S.editor.textEditor.mouseUp);
                //S.editor.textEditor.save.finish(target);
            }
            $('.tools .texteditor-toolbar, .tools .texteditor-btnselect').hide();
            S.events.doc.scroll.callback.remove($('.tools .texteditor-toolbar')[0]);
            S.events.doc.resize.callback.remove($('.tools .texteditor-toolbar')[0]);
            if (S.editor.components.disabled == true) {
                S.editor.components.hovered = null;
                S.editor.components.selected = null;
                S.editor.textEditor.selected = false;
                S.editor.components.disabled = false;
            }
        }
    },

    keyUp: function () {
        S.editor.textEditor.reposition(S.editor.components.selected);
        S.editor.textEditor.save.start();
        S.editor.textEditor.info();
    },

    mouseDown: function () {
        S.editor.textEditor.pressing = true;
    },

    mouseUp: function () {
        //update toolbar
        setTimeout(function () { S.editor.textEditor.info(); }, 50);
    },

    info: function(changeInputs){
        //get info about selection and update toolbar buttons & form fields
        var editor = S.editor.textEditor;
        var r = editor.getRange();
        var nodes = $(r.nodes);
        if (nodes == null) { nodes = $(r.parent); }
        //add all child elements to nodes list
        var childs = nodes.find('span');
        var classes = null;
        var cls = '';
        var dups = [[], [], []];
        var i = 0;
        nodes = nodes.add(childs);

        //reset all toolbar buttons
        $('.texteditor-toolbar a').removeClass('selected');
        $('#textEditorFontFamily').val('font-none');
        $('#textEditorFontSize').val('');

        //get all classes from all nodes
        nodes.each(function () {
            classes = null;
            var node = $(this);
            if (node[0].nodeName == '#text') { node = $(node[0]).parent(); }
            cls = $(node).attr('class');
            if (cls != null && cls != '') {
                classes = cls.split(' ');
            } else if(classes == null) {
                classes = [];
            }
            //also get classes of parent nodes
            node.parentsUntil('.editing').each(function () {
                var pclass = $(this).attr('class');
                if (pclass != null && pclass != '') {
                    classes = classes.concat(pclass.split(' '));
                }
            });

            //find classes that match toolbar buttons & form fields
            if (classes != null) {
                for (x = 0; x < classes.length; x++) {
                    if (changeInputs !== false) {
                        if (classes[x].indexOf('font-') >= 0) {
                            //font-family ///////////////////////////////////////////////////
                            if (dups[0].length > 0) {
                                if (i > 0) {
                                    //more than one font-family in the group of nodes
                                    $('#textEditorFontFamily').val('font-none');
                                }
                            } else {
                                dups[0].push(classes[x]);
                                $('#textEditorFontFamily').val(classes[x]);
                            }
                        }
                        if (classes[x].indexOf('fontsize-') >= 0) {
                            //font-size //////////////////////////////////////////////////////
                            if (dups[1].length > 0) {
                                if (i > 0) {
                                    //more than one font-size in the group of nodes
                                    $('#textEditorFontSize').val('');
                                }
                            } else {
                                dups[1].push(classes[x]);
                                $('#textEditorFontSize').val(classes[x].replace('fontsize-', ''));
                            }

                        }
                    }
                    if (classes[x].indexOf('bold') >= 0) {
                        //bold ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-bold a').addClass('selected');
                    }
                    if (classes[x].indexOf('italic') >= 0) {
                        //italic ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-italic a').addClass('selected');
                    }
                    if (classes[x].indexOf('linethru') >= 0) {
                        //strike thru ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-linethru a').addClass('selected');
                    }
                    if (classes[x].indexOf('underline') >= 0) {
                        //underline ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-underline a').addClass('selected');
                    }
                    if (classes[x].indexOf('alignleft') >= 0) {
                        //align left ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-alignleft a').addClass('selected');
                    }
                    if (classes[x].indexOf('aligncenter') >= 0) {
                        //align center ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-aligncenter a').addClass('selected');
                    }
                    if (classes[x].indexOf('alignright') >= 0) {
                        //align right ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-alignright a').addClass('selected');
                    }
                    if (classes[x].indexOf('indent') >= 0) {
                        //indent ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-indent a').addClass('selected');
                    }
                    if (classes[x].indexOf('bulletlist') >= 0) {
                        //bulleted list ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-bulletlist a').addClass('selected');
                    }
                    if (classes[x].indexOf('numberlist') >= 0) {
                        //numbered list ///////////////////////////////////////////////////////////
                        dups[2].push(classes[x]);
                        $('.texteditor-toolbar .button.tool-numberlist a').addClass('selected');
                    }
                }
            }
            i++;
        });
            
    },

    alterRange: function (name, tag, attributes, remove, outerOnly, styles) {
        var sel = rangy.getSelection(), range, el, f, container, r,
            hasremove = false, hasclass = false;
        r = this.getRange();
        if (r.sel.isCollapsed == true) { return; }

        //select children if there is no selection made ///////////////////////
        if (sel.isCollapsed == true) {
            sel.selectAllChildren(sel.anchorNode);
        }

        sel.refresh(true);
        range = r.range;
        container = r.parent;

        if (outerOnly == true) {
            //create outer node
            el = document.createElement(tag);
            $(r.nodes).wrapAll(el);
            var el2 = $(el).find('.' + name);
            if (el2.length == 0 && remove != null) {
                for (x = 0; x < remove.length; x++) {
                    el2 = $(el).find('.' + remove[x]).contents().unwrap();
                }
            }
            $(container).find('span:not([class])').contents().unwrap();
            //range.normalizeBoundaries();
            sel.refresh(true);
            //sel.setSingleRange(range);
                
        }


        //apply attributes & class (name) to all elements within the select ///
        var applier = rangy.createClassApplier(name, {
            elementTagName: tag,
            elementAttributes: attributes,
            elementProperties:{'style':styles}
        }, tag);
        applier.toggleSelection();
            

        //remove any classes from the selection that don't belong /////////////
        if (remove != null) {
            if (remove.length > 0) {
                //remove classes from range
                for (x = 0; x < remove.length; x++) {
                    applier = rangy.createClassApplier(remove[x], {
                        elementTagName: tag,
                        elementAttributes: attributes
                    }, tag);
                    applier.undoToSelection();
                }
            }
        }

        //replace trailing spaces with &nbsp; /////////////////////////////////
        sel.refresh(true);
        var nodes = [];
        //get all nodes within the selection
        for (x = 0; x < sel.rangeCount; x++) {
            nodes = nodes.concat(sel.getRangeAt(x).getNodes());
        }
        //find each text node and replace trailing spaces with &nbsp;
        for (x = 0; x < nodes.length; x++) {
            if (nodes[x].nodeType == 3) {
                nodes[x].nodeValue = nodes[x].nodeValue.replace(/\s+$/g, '\u00a0');
            }
        }

        this.cleanUp();

        this.save.start();
    },

    getRange: function () {
        var sel = rangy.getSelection();
        if (sel.rangeCount > 0) {
            var range = sel.getRangeAt(0);
            var nodes = range.getNodes();
            var parent = range.commonAncestorContainer;
            if (nodes[0] == parent) { parent = parent.parentNode; }
            var roots = $(nodes).filter(function () { if (this.parentNode != parent) { return false; } return true; });
            if (nodes.length == 1) { roots = nodes; }
            return { range: range, nodes: roots, parent: parent, sel: sel };
        }
        return { range: null, nodes: [], parent: null, sel:sel };
    },

    cleanUp: function () {
        var r = S.editor.textEditor.getRange();
        $('.textedit.editing').find('[class=""]').contents().unwrap();

        //remove unwanted styles
        var nodes = $('.textedit.editing [style!=""]');
        var styles = [];
        for (var x = 0; x < nodes.length; x++) {
            var style = nodes[x].getAttribute('style') || '';
            if (style != '') {
                styles = nodes[x].getAttribute('style').replace(/; /g, ';').split(';');
                for (var y = 0; y < styles.length; y++) {
                    if (styles[y].indexOf('font-size') < 0) {
                        styles[y] = '';
                    }
                }
                styles = styles.filter(function (n) { return n != ''; });
                nodes[x].setAttribute('style', styles.join('; '));
            }
                
        }

        //clean up text (remove &nbsp;)
        $('.textedit.editing *').each(
            function () {
                if (this.children.length == 0) {
                    var htm = $(this).html();
                    htm = htm.replace(/&nbsp;/g, ' ');
                    $(this).html(htm);
                }
                    
            }
        );

        //combine nested tags //////////////////////////////////////
        var changed = true;
        var found = false;
        var node;
        var nested = [];
        var classes = [];
            
        var i = 0;

        //loop until there are no more nested tags
        while (changed == true) {
            nodes = $('.textedit.editing div, .textedit.editing span, .textedit.editing p');
            changed = false;
            for (var x = 0; x < nodes.length; x++) {
                if (nodes[x].children.length == 1) {
                    nested = [nodes[x]];
                    classes = [];
                    styles = [];
                    node = nodes[x];
                    found = false;
                    while (found == false) {
                        //traverse heirarchy to find nested nodes
                        if (node.children.length == 1) {
                            if (node.firstChild.tagName == node.tagName) {
                                node = node.firstChild;
                                nested.push(node);
                            } else { found = true; }
                        } else { found = true;}
                    }
                    if (nested.length > 1) {
                        //combine nested nodes
                        for (var y = 0; y < nested.length; y++) {
                            //get classes & styles from nested nodes
                            if (nested[y].className != '') {
                                classes = classes.concat(nested[y].className.split(' '));
                            }
                            if (nested[y].getAttribute('style') != '') {
                                var style = nested[y].getAttribute('style') || '';
                                if (style != '') {
                                    styles = styles.concat(style.replace(/; /g, ';').split(';'));
                                }
                                    
                            }
                        }
                            
                        //get contents from last nested node
                        var contents = $(nested[nested.length - 1])[0].innerHTML.replace(/&nbsp;/g,' ');
                        //replace contents of first node with new contents
                        $(nested[0]).attr('class',classes.join(' ')).attr('style',styles.join('; ')).html(contents);
                        changed = true;
                        break;
                    }
                }
            }
            i++;
            if (i > 100) { break;}
        }
        r.range.refresh(true);
    },

        removeClass(selector, matching){
            $(selector).removeClass(function (index, css) { if (css) { return (css.match(matching) || []).join(' '); } else { return css } });
        },

    isCollapsed: function () {
        var r = editor.getRange();
        if (r.sel.isCollapsed == true) { return; }
    },

    commands: {
            fontFamily: function () {
                var editor = S.editor.textEditor;
                var r = editor.getRange();
                var val = $('#textEditorFontFamily').val();
                var els = $(r.nodes);
                var istext = false;
                if (r.sel.isCollapsed == true) { return;}
                if (r.nodes.length == 1) {
                    if (r.nodes[0].nodeName == '#text') {
                        els = $(r.nodes[0].parentNode);
                        istext = true;
                    }
                }
                if (r.sel.anchorOffset == 0) {
                    editor.removeClass($(els), /(^|\s)font-\S+/g);
                    editor.removeClass($(els).find('[class*="font-"]'), /(^|\s)font-\S+/g);
                } else {
                    //editor.removeClass($(r.nodes).find('[class*="font-"]'), /(^|\s)font-\S+/g);
                }
                S.editor.textEditor.alterRange(val, 'span', {});
                $('.textedit.editing [class*="font-none"]').removeClass('font-none');
                editor.cleanUp();
            },

            fontSize: function () {
                var editor = S.editor.textEditor;
                var val = $('#textEditorFontSize').val();
                var r = editor.getRange();
                var els = $(r.nodes);
                var istext = false;
                if (r.sel.isCollapsed == true) { return; }
                if (els.length == 1) {
                    if (els[0].nodeName == '#text') {
                        els = $(els[0].parentNode);
                        istext = true;
                    }
                }
                els = els.add(els.find('span'));
                if (istext == false) {
                    //remove font-sizes from multiple nodes
                    editor.removeClass(els.css({ 'font-size': '' }), /(^|\s)fontsize-\S+/g);
                } else {
                    if (els.find('[class*="fontsize-"]').length > 0) {
                        //remove font-sizes from single text node that has child nodes with font sizes
                        els.css({ 'font-size': '' }).each(function () {
                            editor.removeClass($(this).find('[class*="fontsize-"]'), /(^|\s)fontsize-\S+/g);
                        });
                    }
                }
                
                if (r.sel.anchorOffset == 0) {
                    //selected beginning of node, remove font-sizes from parent
                    if ($(r.parent).is('[class*="fontsize-"]') && $(r.parent.parentNode).is('.textedit')) {
                        //remove font-sizes from selected root node
                        editor.removeClass($(r.parent).css({ 'font-size': '' }), /(^|\s)fontsize-\S+/g);
                    }
                    //remove font-sizes from each node in the list
                    els.css({ 'font-size': '' }).each(function () {
                        editor.removeClass($(this).find('[class*="fontsize-"]'), /(^|\s)fontsize-\S+/g);
                    });
                }
                
                if (val != '') {
                    editor.alterRange('fontsize-' + val, 'span', {}, {}, null, { 'font-size': val + 'px' });
                }
                r.range.refresh(true);
                editor.cleanUp();
            },

            bold: function () {
                S.editor.textEditor.alterRange('bold', 'span', {});
                S.editor.textEditor.info(false);
            },

            italic: function () {
                S.editor.textEditor.alterRange('italic', 'span', {});
                S.editor.textEditor.info(false);
            },

            strikethru: function () {
                S.editor.textEditor.alterRange('linethru', 'span', {});
                S.editor.textEditor.info(false);
            },

            underline: function () {
                S.editor.textEditor.alterRange('underline', 'span', {});
                S.editor.textEditor.info(false);
            },

            list: function (type) {
                var editor = S.editor.textEditor;
                var r = S.editor.textEditor.getRange();
                if (r.range != null) {
                    var range = r.range;
                    var nodes = r.nodes;
                    var parent = r.parent;

                    //check first to see if I should remove the bullet list
                    if ($(nodes).is('ul') || $(parent).is('ul') || $(parent).is('li')) {
                        //remove bullet list
                        if ($(parent).is('li')) {
                            var ul = $(parent.parentNode)
                            $(parent).contents().unwrap();
                            ul.contents().unwrap();
                        } else {
                            $(nodes).find('li').contents().unwrap();
                            $(nodes).contents().unwrap();
                            $(parent).find('ul').contents().unwrap();
                        }
                        if ($(parent).is('ul')) {
                            $(parent).contents().unwrap();
                        }
                    } else {
                        //generate bullet list
                        var ul = document.createElement('ul');
                        ul.className = type + 'list' || 'bulletlist';
                        ul.style.listStyleType = type || '';
                        $(nodes).wrapAll(ul).wrap('<li></li>');
                    }
                }
                r.range.normalizeBoundaries();
                r.sel.refresh();
                r.sel.setSingleRange(r.range);
                S.editor.textEditor.info(false);
                editor.cleanUp();
            },

            outdent: function () {
            },

            indent: function () {
                S.editor.textEditor.alterRange('indent', 'span', {}, {}, true);
                S.editor.textEditor.info(false);
            },

            alignLeft: function () {
                S.editor.textEditor.alterRange('alignleft', 'span', {}, ['aligncenter', 'alignright'], true);
                S.editor.textEditor.info(false);
            },

            alignCenter: function () {
                S.editor.textEditor.alterRange('aligncenter', 'span', {}, ['alignleft', 'alignright'], true);
                S.editor.textEditor.info(false);
            },

            alignRight: function () {
                S.editor.textEditor.alterRange('alignright', 'span', {}, ['aligncenter', 'alignleft'], true);
                S.editor.textEditor.info(false);
            },

            photo: {
                show: function () {

                },

                add: function (file) {

                }
            },

        table: {
                show: function () {

                },

                add: function (rows, columns) {

                }
        },

        link: {
                selection: null,

                show: function () {
                    var editor = S.editor.textEditor;
                    var r = S.editor.textEditor.getRange();
                    editor.commands.link.selection = r.sel.saveRanges();
                    var a = $(r.parent);
                    if (!a.is('a')) { a = a.find('a[href]');}
                    var href = '';
                    if (a.length > 0) {
                        href = a[0].getAttribute('href');
                    }
                    S.editor.dialogs.url.show(S.editor.textEditor.commands.link.add, href);
                },

                add: function (url) {
                    var editor = S.editor.textEditor;
                    var r = S.editor.textEditor.getRange();
                    r.sel.restoreRanges(editor.commands.link.selection);
                    r = S.editor.textEditor.getRange();
                    editor.alterRange('link', 'a', {'href':url}, {}, null);
                }
        },

        colors: {
                type: 'color',

                show: function (type) {

                },

                add: function (color) {

                }
        },

        source: {
                show: function () {

                },

                hide: function () {

                }
        },
            
        more:function(index){
            $('.texteditor-toolbar .buttons').hide();
            $('.texteditor-toolbar .b' + index).show();
        },

        componentSelect: function () {
            S.editor.components.hovered = S.editor.components.selected;
            S.editor.components.selected = null;
            $('.component-select').show();
            S.editor.components.resizeSelectBox();
            S.editor.textEditor.hide(S.editor.components.hovered);

        }
    },

    fonts:{
            families: [
                {title:'[Select A Font]',className:'font-none'},
                {title:'Georgia',className:'font-georgia'},
                {title:'Book Antiqua',className:'font-book'},
                {title:'Times New Roman',className:'font-times'},
                {title:'Arial',className:'font-arial'},
                {title:'Arial Black',className:'font-arial-black'},
                {title:'Impact',className:'font-impact'},
                {title:'Lucida Sans',className:'font-lucida'},
                {title:'Tahoma',className:'font-tahoma'},
                {title:'Trebuchet MS',className:'font-trebuchet'},
                {title:'Verdana',className:'font-verdana'},
                {title:'Courier New',className:'font-courier-new'},
                {title:'Lucida Console',className:'font-lucida-console'}
            ],

            list:function(){
                var htm = "";
                var fam = S.editor.textEditor.fonts.families;
                for(x=0;x<fam.length;x++){
                    htm += '<option value="' + fam[x].className + '">' + fam[x].title + '</option>';
                }
                return htm;
            },

            sizes:[
                7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
                41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,62,65,70,72,75,80,85,90,95,100,110,120,
                130,140,150,160,170,180,190,200,250],

            size: function () {
                var htm = '<option value="">Auto</option>';;
                var siz = S.editor.textEditor.fonts.sizes;
                for (x = 0; x < siz.length; x++) {
                    htm += '<option value="' + siz[x] + '">' + siz[x] + '</option>';
                }
                return htm;
            },
        },

    save: {
            timer: null,

            start: function () {
                //wait 1.5 seconds after the user is done typeing before saving text
                if (this.timer != null) { clearTimeout(this.timer); }
                var fin = 'S.editor.textEditor.save.finish($("#' + S.editor.components.selected.id + '")[0]);';
                this.timer = setTimeout(fin, 1500);
            },

            finish: function (c) {
                var val = $(c).find('> .textedit')[0].innerHTML;
                S.editor.save.add(c.id.substr(1), 'data', val);
            }
    }
};