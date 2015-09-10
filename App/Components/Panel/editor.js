R.components.calls.duplicatePanelCell = function (c) {
    var comp = R.components.cache[c.id];
    var selector = '#' + c.id;
    var hovered = R.editor.components.hovered;
    var aboveId = 'last';
    if ($(hovered).hasClass('component') == false) {
        //specific panel cell
        var next = hovered.nextSibling;
        if (next != null) { if (next.nodeName == '#text') { next = next.nextSibling; } }
        if (next == null) {
            aboveId = 'last';
        } else {
            aboveId = next.id.substr(1);
        }
    }

    var options = { id: c.id.substr(1), aboveId: aboveId, duplicate: 0 };
    //first, send an AJAX request to save page changes
    R.editor.save.click(function () {
        //then duplicate component
        R.ajax.post('/websilk/Components/Panel/DuplicateCell', options, R.ajax.callback.inject);
    });
    return;
    
    

}