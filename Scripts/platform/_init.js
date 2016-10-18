/*/////////////////////////////////////
Initialize Websilk Platform
/////////////////////////////////////*/

//setup jQuery //////////////////////////////////////////////////////////////////////////////////////
$.ajaxSetup({ 'cache': true });

// Window Events ////////////////////////////////////////////////////////////////////////////////////'
$(document).on('ready', function () { S.events.doc.ready(); });
$(document.body).on('click', function (e) { S.events.doc.click.trigger(e.target); });
$(window).on('resize', function () { S.events.doc.resize.trigger(); });
$(window).on('scroll', function () { S.events.doc.scroll.trigger(); });
$('iframe').load(function () { S.events.iframe.loaded(); });
window.addEventListener('popstate', S.events.url.change);


// start timers /////////////////////////////////////////////////////////////////////////////////
if (typeof document.getElementsByClassName('component') != 'undefined') {
    setTimeout(function () { S.ajax.keepAlive(); }, 100);
}

//record initial page load in history API
if (history) {
    history.replaceState(document.location.href.replace(S.url.domain(), ''), document.title, document.location.href);
}

//raise event after document is loaded
S.events.doc.load();