S.components.calls.duplicatePanelCell = function (c) {
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
        if (index < 0) { index = 0;}
        var options = { id: c.id.substr(1), aboveId: aboveId, duplicate: 0 };

    }

    //first, send an AJAX request to save page changes, then create new panel cell
    S.editor.save.click(function () {
        //then duplicate component
        S.ajax.post('/websilk/Components/Panel/DuplicateCell', options, S.ajax.callback.inject);
    });

}