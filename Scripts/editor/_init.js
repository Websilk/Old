/*/////////////////////////////////////
Initialize Websilk Editor
/////////////////////////////////////*/

document.onkeydown = S.hotkeys.keydown;
document.onkeyup = S.hotkeys.keyup;
S.events.doc.resize.callback.add($('.editor')[0], null, null, null, S.editor.events.doc.resize);
S.events.doc.click.callback.add($('.editor')[0], null, S.editor.window.callback.click);
S.events.doc.click.callback.add($('.editor')[0], null, S.editor.components.click);
S.events.url.callback.add($('.editor')[0], null, S.editor.events.url.change);
$('.webpage').delegate('.component', 'mouseenter', S.editor.components.mouseEnter);
$('.webpage').delegate('.inner-panel', 'mouseenter', S.editor.components.mouseEnter);
$('.component-select').delegate('.resize-bar', 'mousedown', S.editor.components.resize.start);
$('.component-select .btn-duplicate > .submenu').hover(
    function () { $('.component-select .btn-duplicate .label').show(); },
    function () { $('.component-select .btn-duplicate .label').hide(); });