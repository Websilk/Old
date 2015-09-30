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
        var hovered = S.editor.components.hoveredComponent();
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
            S.ajax.post('/api/Components/Panel/DuplicateCell', options, S.ajax.callback.inject);
        });

    },

    properties: {
        showFromCell: function () {
            //show component properties for a panel cell
            var inner = S.editor.components.hoveredComponent();
            var p = S.elem.panelCell(inner);
            var c = p.parentNode;
            S.editor.components.properties.show(c, p.id.substr(5));
        },
    },

    arrangement: {
        current: '', timer: null,
        init: function () {
            $('.component-select .section-arrangement').delegate('select', 'change', this.onChange);
            $('.component-select .section-arrangement').delegate('input', 'keyup', this.onChange);
        },

        show: function () {
            S.components.calls.panel.arrangement.$show();
        },

        $show: function () {
            var c = S.editor.components.hoveredComponent();
            if (c.id == 'inner') {
                //get component from panel cell
                c = S.elem.panelCell(c).parentNode;
            }
            //load arrangement settings for panel
            if (c.id != this.current) {
                //data isn't loaded yet
                this.current = c.id;
                if (S.components.cache[c.id].arrangement != null) {
                    this.load(S.components.cache[c.id].arrangement);
                } else {
                    S.ajax.post('/api/Components/Panel/Arrangement', { id: c.id.substr(1) }, this.callback);
                    //hide previously loaded data
                    $('.component-select #divArrangeDetails > div, .component-select #divArrangeType, .component-select #divArrangeTypes').hide();
                    $('.component-select .section-arrangement .loading').show();
                }
            }

            S.editor.components.menu.show("arrangement");
        },

        callback: function (data) {
            var c = S.editor.components.hoveredComponent();
            if (c == null) { return; }
            if (data.d != '') {
                //load arrangement data
                if (data.d == 'lost') { location.reload();}
                var d = data.d.split(',');
                S.components.cache[c.id].arrangement = d;
                //instead of using load function, use change function
                //just in case the arrangement settings are empty,
                //we can reset to default settings
                S.components.calls.panel.arrangement.change(d[0]);
            }
            
        },

        load: function(d){
            var c = S.editor.components.hoveredComponent();
            if (c == null) { return; }
            $('.component-select #divArrangeDetails > div, .component-select #divArrangeType, .component-select #divArrangeTypes').hide();
            var name = '';
            if (d.length > 0) {
                var htm = '';
                switch (d[0]) {
                    case 'grid': // Grid ///////////////////////////////////
                        //arrange-settings = width-type (fixed or responsive), fixed-width, 
                        //                   responsive-max-columns, responsive-min-width, 
                        //                   height-type (auto or fixed), fixed-height, 
                        //                   auto-height-mosaic, spacing
                        name = 'Grid';
                        if (d.length > 1) {
                            $('#lstArrangeGridWidth').val(d[1]);
                        }
                        if (d.length > 2) {
                            $('#txtGridWidthFixed').val(d[2]);
                        }
                        if (d.length > 3) {
                            $('#lstArrangeGridColumns').val(d[3]);
                        }
                        if (d.length > 4) {
                            $('#txtGridWidthMin').val(d[4]);
                        }
                        if (d.length > 5) {
                            $('#lstArrangeGridHeight').val(d[5]);
                        }
                        if (d.length > 6) {
                            $('#txtGridHeightFixed').val(d[6]);
                        }
                        if (d.length > 7) {
                            $('#chkGridMosaic').val(d[7]);
                        }
                        if (d.length > 8) {
                            $('#txtGridSpacing').val(d[8]);
                        }
                        S.components.calls.panel.arrangement.grid.changeWidth();
                        S.components.calls.panel.arrangement.grid.changeHeight();
                        break;

                    case 'rows': // Rows ////////////////////////////////////
                        //arrange-settings = height-type (auto or fixed), fixed-height, spacing
                        name = 'Rows';
                        if (d.length > 1) {
                            $('#lstArrangeRowsHeight').val(d[1]);
                        }
                        if (d.length > 2) {
                            $('#txtRowsHeightFixed').val(d[2]);
                        }
                        if (d.length > 3) {
                            $('#txtRowsSpacing').val(d[3]);
                        }
                        S.components.calls.panel.arrangement.rows.changeHeight();
                        break;

                    case 'slideshow': // Slideshow //////////////////////////
                        //arrange-settings = transition, easing-type, transition-time, auto-play, auto-play-delay
                        name = 'Slideshow';
                        if (d.length > 1) {
                            $('#lstArrangeSlideTransition').val(d[1]);
                        }
                        if (d.length > 2) {
                            $('#lstArrangeSlideEasing').val(d[2]);
                        }
                        if (d.length > 3) {
                            $('#txtSlideSpeed').val(d[3]);
                        }
                        if (d.length > 4) {
                            $('#chkSlideAutoPlay').val(d[4]);
                        }
                        if (d.length > 5) {
                            $('#txtSlideDelay').val(d[5]);
                        }
                        S.components.calls.panel.arrangement.slideshow.changeAutoPlay();
                        break;
                    case 'book': // Book ////////////////////////////////////
                        //arrange-settings = paper-material (matte, laminant, textured, plain, ancient), starting-page (0=book cover, 1=page #1)
                        name = 'Book';
                        if (d.length > 1) {
                            $('#lstArrangeBookPaper').val(d[1]);
                        }
                        if (d.length > 2) {
                            $('#lstArrangeBookStart').val(d[2]);
                        }
                        break;
                }
                htm +=  '<div class="left">' +
                        '<svg viewBox="0 0 32 32" style="width:25px;"><use xlink:href="#icon-panel' + d[0] + '" x="0" y="0" width="32" height="32" /></svg>' +
                        '</div>' +
                        '<div class="left" style="padding: 3px 0px 11px 10px;"><h4>' + name + '</h4></div>' +
                        '<div class="right" style="padding:5px 5px 0px 0px">' +
                        '<svg viewBox="0 0 16 5" style="width:17px;"><use xlink:href="#icon-arrow-down" x="0" y="0" width="16" height="5" /></svg>' +
                        '</div>';

                $('.component-select .arrange-type').html(htm);
                $('.component-select #divArrangeDetails' + name).show();
                $('.component-select #divArrangeType, .component-select #divArrangeDetails').show();
            }
            S.components.cache[c.id].arrangement = d;
            $('.component-select .section-arrangement .loading').hide();
        },

        list: function(){
            $('#divArrangeType, #divArrangeDetails').hide();
            $('#divArrangeTypes').show();
        },

        change: function (type) {
            var c = S.editor.components.hoveredComponent();
            if (c == null) { return; }
            var d = S.components.cache[c.id].arrangement || ['rows'];
            var reset = false;
            //check if arrangement settings need to be reset
            if (d.length > 0) {
                if (d[0] != type) {
                    reset = true;
                }
                if (d.length > 1) {
                    if (d[1] == '') {
                        reset = true;
                    }
                }
                if (d.le == 1) { reset = true; }
            }
            if (reset == true) {
                //setup default arrangement settings
                switch (type) {
                    case 'grid':
                        //arrange-settings = width-type (fixed or responsive), fixed-width, 
                        //                   responsive-max-columns, responsive-min-width, 
                        //                   height-type (auto or fixed), fixed-height, 
                        //                   auto-height-mosaic, spacing
                        d = [type, 'r', 300, 3, 250, 'a', 200, 0, 0];
                        break;

                    case 'rows':
                        //arrange-settings = height-type (auto or fixed), fixed-height, spacing
                        d = [type, 'a', 150, 0];
                        break;

                    case 'slideshow':
                        //arrange-settings = transition, easing-type, transition-time, auto-play, auto-play-delay
                        d = [type, 'h', 'easeInOutQuad', 700, 0, 5];
                        break;

                    case 'book':
                        //arrange-settings = paper-material (matte, laminant, textured, plain, ancient), starting-page (0=book cover, 1=page #1)
                        d = [type, 'm', 0];
                        break;
                }
                S.components.cache[c.id].arrangement = d;
                this.update();
            }
            
            S.components.calls.panel.arrangement.load(d);
        },

        update: function(){
            //update panel CSS classes
            var c = S.editor.components.hoveredComponent();
            if (c == null) { return; }
            var d = S.components.cache[c.id].arrangement;
            var $c = $(c);
            var $p = $('#' + c.id + ' > .ispanel'); // list of panels inside component
            console.log('update');
            $c.removeClass('columns2 columns3 columns4 columns5 columns6 columns7 columns8 columns9 column10 columns11 columns12');
            $p.each(function () { $(this).removeClass('item-cell item-slide item-page').css({ minWidth: '', maxWidth: '', padding: '', height: '', paddingBottom: '' }); });
            switch (d[0]) {
                case 'grid':
                    if($c.hasClass('arrange-grid') == false){
                        this.removeCss($c, $p);
                        $c.addClass('arrange-grid');
                        $p.each(function () { $(this).addClass('item-cell'); });
                    }
                    if (d[1] == 'r') {
                        $c.addClass('columns' + d[3]);
                        $p.each(function () { $(this).css({ minWidth: d[4] }); });
                    } else if (d[1] == 'f') {
                        $p.each(function () { $(this).css({ maxWidth: d[2] }); });
                    }
                    if (d[5] == 'f') {
                        $p.each(function () { $(this).css({ height: d[6] }); });
                    }
                    if (d[8] != '0') {
                        var pad = (parseInt(d[8]) / 2);
                        $p.each(function () { $(this).css({ padding: '0px ' + pad + 'px ' + pad + 'px ' + pad + 'px' }); });
                    }
                    break;

                case 'rows':
                    if ($c.hasClass('arrange-rows') == false) {
                        this.removeCss($c, $p);
                        $c.addClass('arrange-rows');
                        $p.each(function () { $(this).addClass('item-cell'); });
                    }
                    if (d[3] != '0') {
                        $p.each(function () { $(this).css({ paddingBottom: d[3] + 'px' }); });
                    }
                    break;

                case 'slideshow':
                    if ($c.hasClass('arrange-slideshow') == false) {
                        this.removeCss($c, $p);
                        $c.addClass('arrange-slideshow');
                        $p.each(function () { $(this).addClass('item-slide'); });
                    }
                    break;

                case 'book':
                    if ($c.hasClass('arrange-book') == false) {
                        this.removeCss($c, $p);
                        $c.addClass('arrange-book');
                        $p.each(function () { $(this).addClass('item-page'); });
                    }
                    break;
            }
        },

        removeCss: function (c, p) {
            c.removeClass('arrange-grid arrange-rows arrange-slideshow arrange-book');
            p.each(function () { $(this).removeClass('item-cell item-slide item-page'); });
        },

        onChange: function (e) {
            var ms = 1000;
            if (e.currentTarget.tagName == 'SELECT' || e.currentTarget.getAttribute('type') == 'checkbox') { ms = 1; }
            clearTimeout(S.components.calls.panel.timer);
            S.components.calls.panel.timer = setTimeout(function () { S.components.calls.panel.arrangement.$onChange(); }, ms);
        },

        $onChange: function(){
            var c = S.editor.components.hoveredComponent();
            if (c == null) { return; }
            var d = S.components.cache[c.id].arrangement;
            var type = d[0];
            switch (type) {
                case 'grid':
                    //arrange-settings = width-type (fixed or responsive), fixed-width, 
                    //                   responsive-max-columns, responsive-min-width, 
                    //                   height-type (auto or fixed), fixed-height, 
                    //                   auto-height-mosaic, spacing
                    d = [type,
                        $('#lstArrangeGridWidth').val(),
                        parseInt($('#txtGridWidthFixed').val()) || 300,
                        $('#lstArrangeGridColumns').val(),
                        parseInt($('#txtGridWidthMin').val()) || 3,
                        $('#lstArrangeGridHeight').val(),
                        parseInt($('#txtGridHeightFixed').val()) || 200,
                        parseInt($('#chkGridMosaic').val()),
                        parseInt($('#txtGridSpacing').val()) || 0];
                    break;

                case 'rows':
                    //arrange-settings = height-type (auto or fixed), fixed-height, spacing
                    d = [type,
                        $('#lstArrangeRowsHeight').val(),
                        parseInt($('#txtRowsHeightFixed').val()) || 200,
                        parseInt($('#txtRowsSpacing').val()) || 0];
                    break;

                case 'slideshow':
                    //arrange-settings = transition, easing-type, transition-time, auto-play, auto-play-delay
                    d = [type,
                        $('#lstArrangeSlideTransition').val(),
                        $('#lstArrangeSlideEasing').val(),
                        parseInt($('#txtSlideSpeed').val()) || 700,
                        parseInt($('#chkSlideAutoPlay').val()),
                        parseInt($('#txtSlideDelay').val()) || 5];
                    break;

                case 'book':
                    //arrange-settings = paper-material (matte, laminant, textured, plain, ancient), starting-page (0=book cover, 1=page #1)
                    d = [type,
                        $('#lstArrangeBookPaper').val(),
                        $('#lstArrangeBookStart').val()];
                    break;
            }
            S.components.cache[c.id].arrangement = d;
            this.update();

        },

        grid: {
            changeWidth: function () {
                var type = $('#lstArrangeGridWidth').val();
                switch (type) {
                    case 'f':
                        $('#gridWidthFixed').show();
                        $('#gridWidthResponsive, #gridWidthResponsiveMin').hide();
                        break;
                    case 'r':
                        $('#gridWidthResponsive, #gridWidthResponsiveMin').show();
                        $('#gridWidthFixed').hide();
                        break;
                }
            },

            changeHeight: function () {
                var type = $('#lstArrangeGridHeight').val();
                switch (type) {
                    case 'a':
                        $('#gridHeightFixed').hide();
                        $('#gridHeightAuto').show();
                        break;
                    case 'f':
                        $('#gridHeightFixed').show();
                        $('#gridHeightAuto').hide();
                        break;
                }
            }
        },

        rows: {
            changeHeight: function () {
                var type = $('#lstArrangeRowsHeight').val();
                switch (type) {
                    case 'a':
                        $('#rowsHeightFixed').hide();
                        break;
                    case 'f':
                        $('#rowsHeightFixed').show();
                        break;
                }
            }
        },

        slideshow: {
            changeAutoPlay: function () {

            }
        },

        book: {}
    }
}

//set up events
S.components.calls.panel.arrangement.init();