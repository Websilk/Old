//hide some component select menu items for panel cell
S.editor.components.menu.items.addRule('cell', '.menu-position, .menu-layer, .menu-options');

//add arrangement item to component select menu for panel & cell
var htm = '<div style="width:17px; height:17px;">' +
        '<svg viewBox="0 0 17 17" style="width:17px; height:17px; padding-top:5px;"><use xlink:href="#icon-panelgrid" x="0" y="0" width="17" height="17"></use></svg>' +
        '</div>';
S.editor.components.menu.items.add('panel', 'arrangement', htm, 3, 'S.components.calls.panel.arrangement.show()');
S.editor.components.menu.items.add('cell', 'arrangement', htm, 3, 'S.components.calls.panel.arrangement.show()');

//add custom options item to component select menu to replace original, only for panel cell
htm = '<div style="width:17px; height:17px;">' +
        '<svg viewBox="0 0 17 17" style="width:17px; height:17px; padding-top:5px;"><use xlink:href="#icon-options" x="0" y="0" width="17" height="17"></use></svg>' +
        '</div>';
S.editor.components.menu.items.add('cell', 'cell-options', htm, 'before', 'S.components.calls.panel.properties.showFromCell()');

//set up special component functions
S.components.calls.panel = {
    duplicateCell: function (c) {
        var comp = S.components.cache[c.id];
        var selector = '#' + c.id;
        var hovered = S.editor.components.hovered;
        var aboveId = 'last';
        if (c.id == 'inner') {
            //specific panel cell
            var p = S.elem.panelCell(c);
            if (p != null) {
                var next = p.nextSibling;
                if (next != null) { if (next.nodeName == '#text') { next = next.nextSibling; } }
                if (next == null) {
                    aboveId = 'last';
                } else {
                    aboveId = next.id;
                }
            }
            var index = 0;
            var childs = $('#' + p.parentNode.id + ' > .ispanel');
            for (i = 0; i < childs.length; i++) {
                if (childs[i].id == p.id) {
                    index = i; break;
                }
            }
            //set up options for panel cell
            var options = { id: p.parentNode.id.substr(1), aboveId: aboveId, duplicate: index };

        } else {
            //set up options for panel
            var index = c.childNodes.length - 1;
            if (index < 0) { index = 0; }
            var options = { id: c.id.substr(1), aboveId: aboveId, duplicate: 0 };

        }

        //first, send an AJAX request to save page changes, then create new panel cell
        S.editor.save.click(function () {
            //then duplicate component
            S.ajax.post('/websilk/Components/Panel/DuplicateCell', options, S.ajax.callback.inject);
        });

    },

    properties: {
        showFromCell: function () {
            //show component properties for a panel cell
            var inner = S.editor.components.hovered;
            var p = S.elem.panelCell(inner);
            var c = p.parentNode;
            S.editor.components.properties.show(c, p.id.substr(5));
        },
    },

    arrangement: {
        current: '',
        show: function () {
            S.components.calls.panel.arrangement.$show();
        },

        $show: function () {
            var c = S.editor.components.hovered;
            if (c.id == 'inner') {
                //get component from panel cell
                c = S.elem.panelCell(c).parentNode;
            }
            //load arrangement settings for panel
            if (c.id != this.current) {
                //data isn't loaded yet
                this.current = c.id;
                S.ajax.post('websilk/Components/Panel/Arrangement', { id: c.id.substr(1) }, this.callback);
                //hide previously loaded data
                $('.component-select .arrange-details > div, .component-select .arrange-type').hide();
                $('.component-select .section-arrangement .loading').show();
            }

            S.editor.components.menu.show("arrangement");
        },

        callback: function (data) {
            if (data.d != '') {
                //load arrangement data
                var d = data.d.split(',');
                var name = '';
                console.log(d);
                if (d.length > 0) {
                    var htm = '';
                    switch (d[0]) {
                        case 'grid':
                            name = 'Grid';
                            S.components.calls.panel.arrangement.grid.changeWidth();
                            break;
                        case 'rows':
                            name = 'Rows';
                            break;
                        case 'slideshow':
                            name = 'Slideshow';
                            break;
                        case 'book':
                            name = 'Book';
                            break;
                    }
                    htm +=  '<div class="left">' +
                            '<svg viewBox="0 0 32 32" style="width:25px;"><use xlink:href="#icon-panel' + d[0] + '" x="0" y="0" width="32" height="32" /></svg>' +
                            '</div>' +
                            '<div class="left" style="padding: 3px 0px 11px 10px;"><h4>' + name + '</h4></div>' +
                            '<div class="right" style="padding:5px 5px 0px 0px">' +
                            '<svg viewBox="0 0 16 5" style="width:17px;"><use xlink:href="#icon-arrow-down" x="0" y="0" width="16" height="5" /></svg>' +
                            '</div>';

                    $('#divArrangeType').html(htm);
                    $('.component-select #divArrangeDetails' + name).show();
                    $('.component-select .section-arrangement .arrange-type, .component-select .section-arrangement .arrange-details').show();
                    
                }

                $('.component-select .section-arrangement .loading').hide();
            }
            
        },

        grid: {
            changeWidth: function () {
                var type = $('#lstArrangeGridWidth').val();
                switch (type) {
                    case 'px':
                        $('#gridWidthPixels').show();
                        $('#gridWidthResponsive').hide();
                        break;
                    case 'r':
                        $('#gridWidthResponsive').show();
                        $('#gridWidthPixels').hide();
                        break;
                }
            }
        }
    }
}