S.editor.layers = {
    show: function () {
        S.editor.window.load('Layers', 'Editor/Layers', {}, { r: 0, y: 0, w: 250, h: 100, loadOnce: true });
    },

    refresh: function () {
        $('.winLayers .layers-list').off('.row', 'mouseenter mouseleave');
        var layers = S.layers.cache, comps = S.components.cache,
            htm = '', i = [2, 2, 2, 2, 2], pageId, p, p2, rowTitle = '', rowColor = 'blue', hasSubs = false, img, itemId,
            panels = $('.ispanel:not(.istheme)'), laypanels = $('.ispanel.istheme'), comps, comps2, comp, classes;
        for (l = 0; l < layers.length; l++) {
            //load each layer ///////////////////////////////////////////////////////////////////////////////////////////////
            i[0] = i[0] == 2 ? 1 : 2;
            rowTitle = layers[l].title;
            if (layers[l].pageType == 1) { rowTitle = 'Page'; }
            itemId = rowTitle.replace(/ /g, '') + 'Layer';
            htm += '<div class="row hover' + (i[0] == 2 ? '-alt' : '') + ' page-layer-row item-' + itemId + '">' +
                    '<div class="expander purple"><div class="column right icon icon-expand"><a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a></div></div>' +
                    '<div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-layers" x="0" y="0" width="36" height="36" /></svg></div>' +
                    '<div class="column left title">' + rowTitle + ' Layer</div>';
            pageId = layers[l].pageId;

            i[1] = 2;
            for (s = 0; s < laypanels.length; s++) {
                //load each web page panel //////////////////////////////////////////////////////////////////////////////////
                p = $(laypanels[s]);
                comps = p.find('.component').filter(function (index, elem) { if ($(elem).parents('.ispanel:not(.istheme)').length > 0) { return false; } return true; });
                hasSubs = false;
                //make sure there are components within this panel that belong to the current layer
                for (c = 0; c < comps.length; c++) {
                    if (S.components.cache[comps[c].id].pageId == pageId) { hasSubs = true; break; }
                }

                //this panel contains components that are a part of the current layer
                i[1] = i[1] == 2 ? 1 : 2;
                rowColor = 'blue';
                rowTitle = S.util.str.Capitalize(p[0].className.split(' ')[0].replace('panel', '')) + ' Area';
                itemId = rowTitle.replace(/ /g, '');
                htm += '<div class="sub" style="display:none;">' +
                    '<div class="row hover' + (i[1] == 2 ? '-alt' : '') + ' page-panel-row item-' + itemId + '">' +
                    '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';

                if (hasSubs == true) {
                    htm += '<a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a>';
                }

                htm += '</div></div><div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-panel" x="0" y="0" width="36" height="36"></use></svg></div>' +
                    '<div class="column left title">' + rowTitle + '</div>';

                if (hasSubs == true) {
                    i[2] = 2;
                    for (c = 0; c < comps.length; c++) {
                        //load each component that belongs to the web page panel ///////////////////////////////////////////////
                        i[2] = i[2] == 2 ? 1 : 2;
                        comp = $(comps[c]);
                        rowColor = '';
                        classes = comp[0].className.split(' ');
                        rowTitle = S.util.str.Capitalize(classes[S.util.array.indexOfPartialString(classes, 'type-')].replace('type-', ''));

                        hasSubs = false;
                        if (comp.find('.ispanel').length > 0) { hasSubs = true; }
                        itemId = comps[c].id;

                        htm += '<div class="sub" style="display:none;">' +
                            '<div class="row hover' + (i[1] == 2 ? '-alt' : '') + ' component-row item-' + itemId + '">' +
                            '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';

                        if (hasSubs == true) {
                            htm += '<a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a>';
                        }
                        img = S.components.cache[comps[c].id].type;
                        htm += '</div></div><div class="column left icon-img"><img src="/components/' + img + '/iconsm.png"/></div>' +
                            '<div class="column left title">' + rowTitle + '</div>';

                        if (hasSubs == true) {
                            i[3] = 2;
                            panels = comp.find('.ispanel');
                            for (s2 = 0; s2 < panels.length; s2++) {
                                //load each component panel cell /////////////////////////////////////////////////////////////////////
                                p2 = $(panels[s2]);
                                if (p2.hasClass('istheme') == false) {
                                    //make sure this panel belongs to the current web page panel                                    

                                    hasSubs = false;
                                    //make sure there are components within this panel that belong to the current layer
                                    //for (c = 0; c < stacks[s2].data.length; c++) {
                                    //if (S.components.cache[stacks[s2].data[c].c.id].pageId == pageId) { hasSubs = true; break; }
                                    //}

                                    //this panel contains components that are a part of the current layer
                                    i[3] = i[3] == 2 ? 1 : 2;
                                    rowTitle = 'Cell';
                                    rowColor = 'green';
                                    itemId = panels[s2].id;
                                    htm += '<div class="sub" style="display:none;">' +
                                        '<div class="row hover' + (i[2] == 2 ? '-alt' : '') + ' panel-cell-row item-' + itemId + '">' +
                                        '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand"><a href="javascript:" onclick="S.editor.layers.expand(\'' + itemId + '\')"><svg viewBox="0 0 15 15" style="width:15px; height:15px;"><use xlink:href="#icon-expand" x="0" y="0" width="15" height="15"></use></svg></a></div></div>' +
                                        '<div class="column left icon"><svg viewBox="0 0 36 36" style="width:20px; height:20px;"><use xlink:href="#icon-panel" x="0" y="0" width="36" height="36"></use></svg></div>' +
                                        '<div class="column left title">' + rowTitle + '</div>';

                                    comps2 = p2.find('.component');
                                    i[4] = 2;
                                    for (c2 = 0; c2 < comps2.length; c2++) {
                                        //load each component that belongs to the panel cell ///////////////////////////////////////////////
                                        i[4] = i[4] == 2 ? 1 : 2;
                                        comp = $(comps2[c2]);
                                        rowColor = '';
                                        classes = comp[0].className.split(' ');
                                        rowTitle = S.util.str.Capitalize(classes[S.util.array.indexOfPartialString(classes, 'type-')].replace('type-', ''));

                                        hasSubs = false;
                                        if (comp.find('.ispanel').length > 0) { hasSubs = true; rowColor = 'green'; }
                                        itemId = comps2[c2].id;

                                        htm += '<div class="sub" style="display:none;">' +
                                            '<div class="row hover' + (i[1] == 2 ? '-alt' : '') + ' component-row item-' + itemId + '">' +
                                            '<div class="expander ' + rowColor + '"><div class="column right icon icon-expand">';

                                        img = S.components.cache[comps2[c2].id].type;
                                        htm += '</div></div><div class="column left icon-img"><img src="/components/' + img + '/iconsm.png"/></div>' +
                                            '<div class="column left title">' + rowTitle + '</div><div class="clear"></div></div></div>';
                                    }

                                    htm += '</div></div>'; // end component panel row
                                }
                            }
                        }

                        htm += '</div></div>'; // end component row
                    }
                    if (1 == 0) {

                    }

                    i[1] = 2;
                    for (c = 0; c < comps.length; c++) {
                        //load each component that belongs to the web page panel
                        i[1] = i[1] == 2 ? 1 : 2;
                    }
                }
                htm += '</div></div>'; // end web page panel row
            }

            htm += '</div>'; //end layer row
        }
        $('.winLayers .layers-list').html(htm);
        setTimeout(function () {
            $('.winLayers .layers-list').on('mouseenter', '.row', S.editor.layers.mouseEnter.row);
            $('.winLayers .layers-list').on('mouseleave', '.row', S.editor.layers.mouseLeave.row);
        }, 200);
    },

    expand: function (itemId) {
        $('.winLayers .content .item-' + itemId + ' > .sub').show();
        $('.winLayers .content .item-' + itemId + ' > .expander > .column a').attr('onclick', 'S.editor.layers.collapse(\'' + itemId + '\')');
        $('.winLayers .content .item-' + itemId + ' > .expander > .column a use').attr('xlink:href', '#icon-collapse');
    },

    collapse: function (itemId) {
        $('.winLayers .content .item-' + itemId + ' > .sub').hide();
        $('.winLayers .content .item-' + itemId + ' > .expander > .column a').attr('onclick', 'S.editor.layers.expand(\'' + itemId + '\')');
        $('.winLayers .content .item-' + itemId + ' > .expander > .column a use').attr('xlink:href', '#icon-expand');
    },

    mouseEnter: {
            row: function () {
                var classes = this.className.split(' ');
                var itemId = classes[S.util.array.indexOfPartialString(classes, 'item-')].replace('item-', '');
                var rowType = classes[S.util.array.indexOfPartialString(classes, '-row')];
                switch (rowType) {
                    case 'page-panel-row':
                        S.editor.layers.mouseEnter.showPagePanel(itemId.toLowerCase().replace('area', ''));
                        break;
                    case 'component-row':
                        S.editor.layers.mouseEnter.showComponent(itemId);
                        break;
                    case 'panel-cell-row':
                        S.editor.layers.mouseEnter.showPanelCell(itemId);
                        break;
                }
            },

            showPagePanel: function (itemId) {
                var pos = S.elem.pos($('#panel' + itemId)[0]);
                var div = document.createElement('div');
                div.className = 'page-panel-border item-' + itemId;
                div.innerHTML = '&nbsp;';
                $(div).css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                $('.tools .borders').append(div);
                S.util.scrollIntoView($('#panel' + itemId)[0]);
            },

            showComponent: function (itemId) {
                S.editor.components.selected = null;
                S.editor.components.hovered = null;
                S.editor.components.disabled = false;
                S.editor.components.mouseEnter($('#' + itemId)[0]);
                S.util.scrollIntoView($('#' + itemId)[0]);
            },

            showPanelCell: function (itemId) {
                var pos = S.elem.pos($('#' + itemId)[0]);
                var div = document.createElement('div');
                div.className = 'panel-cell-border item-' + itemId;
                div.innerHTML = '&nbsp;';
                $(div).css({ left: pos.x, top: pos.y, width: pos.w, height: pos.h });
                $('.tools .borders').append(div);
                S.util.scrollIntoView($('#' + itemId)[0]);
            }
    },

    mouseLeave: {
            row: function () {
                var classes = this.className.split(' ');
                var itemId = classes[S.util.array.indexOfPartialString(classes, 'item-')].replace('item-', '');
                var rowType = classes[S.util.array.indexOfPartialString(classes, '-row')];
                switch (rowType) {
                    case 'page-panel-row':
                        S.editor.layers.mouseLeave.hidePagePanel(itemId.toLowerCase().replace('area', ''));
                        break;
                    case 'component-row':
                        S.editor.layers.mouseLeave.hideComponent(itemId);
                        break;
                    case 'panel-cell-row':
                        S.editor.layers.mouseLeave.hidePanelCell(itemId);
                        break;
                }

            },

            hidePagePanel: function (itemId) {
                $('.tools .borders .page-panel-border.item-' + itemId).remove();
            },

            hideComponent: function (itemId) {
                S.editor.components.mouseLeave();
            },

            hidePanelCell: function (itemId) {
                $('.tools .borders .panel-cell-border.item-' + itemId).remove();
            }
    },

    add: {
            show: function () {

            },

            typeTitle: function (e) {

            },

            submit: function () {

            }
    },

    load: {
            show: function () {

            },

            select: function () {

            }
    },

    remove: function () {

    }
};