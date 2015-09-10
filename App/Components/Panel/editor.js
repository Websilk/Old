S.components.calls.duplicatePanelCell = function (c) {
    var comp = S.components.cache[c.id];
    var selector = '#' + c.id;
    var hovered = S.editor.components.hovered;
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

    console.log(options);

    S.editor.save.click(function () {
        //then duplicate component
        S.ajax.post('/websilk/Components/Panel/DuplicateCell', options, S.ajax.callback.inject);
    });
    return;
    
    

}