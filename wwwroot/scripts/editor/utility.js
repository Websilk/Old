/*! jQuery UI - v1.10.2 - 2013-03-22
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.sortable.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function(e,t){function i(t,i){var a,n,r,o=t.nodeName.toLowerCase();return"area"===o?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&s(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var a=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,a,n=e(this[0]);n.length&&n[0]!==document;){if(s=n.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(a=parseInt(n.css("zIndex"),10),!isNaN(a)&&0!==a))return a;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++a)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),a=isNaN(s);return(a||s>=0)&&i(t,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function a(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===s?["Left","Right"]:["Top","Bottom"],r=s.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?o["inner"+s].call(this):this.each(function(){e(this).css(r,a(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?o["outer"+s].call(this,t):this.each(function(){e(this).css(r,a(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i){var s,a=e.plugins[t];if(a&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;a.length>s;s++)e.options[a[s][0]]&&a[s][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",a=!1;return t[s]>0?!0:(t[s]=1,a=t[s]>0,t[s]=0,a)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],a=u+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(i,n){return e.isFunction(n)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,a=this._superApply;return this._super=e,this._superApply=t,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),t):(l[i]=n,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:a}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var n,a,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(n in r[o])a=r[o][n],r[o].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[r])&&"_"!==r.charAt(0)?(s=n[r].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(r||{})._init():e.data(this,a,new n(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},n=i.split("."),i=n.shift(),n.length){for(a=o[i]=e.widget.extend({},this.options[i]),r=0;n.length-1>r;r++)a[n[r]]=a[n[r]]||{},a=a[n[r]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,r=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var r,o=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),r=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),r&&e.effects&&e.effects.effect[o]?s[t](n):o!==t&&s[o]?s[o](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}})})(jQuery);(function(e){var t=!1;e(document).mouseup(function(){t=!1}),e.widget("ui.mouse",{version:"1.10.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?e(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===e.data(i.target,this.widgetName+".preventClickEvent")&&e.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return s._mouseMove(e)},this._mouseUpDelegate=function(e){return s._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)):!0}},_mouseMove:function(t){return e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button?this._mouseUp(t):this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(e){e.widget("ui.draggable",e.ui.mouse,{version:"1.10.2",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(t){var i=this.options;return this.helper||i.disabled||e(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),this.handle?(e(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){e("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var i=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),i.containment&&this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,i){if(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",t,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i,s=this,n=!1,a=!1;for(e.ui.ddmanager&&!this.options.dropBehaviour&&(a=e.ui.ddmanager.drop(this,t)),this.dropped&&(a=this.dropped,this.dropped=!1),i=this.element[0];i&&(i=i.parentNode);)i===document&&(n=!0);return n||"original"!==this.options.helper?("invalid"===this.options.revert&&!a||"valid"===this.options.revert&&a||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,a)?e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){s._trigger("stop",t)!==!1&&s._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1):!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!e(t.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return s.parents("body").length||s.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s[0]===this.element[0]||/(fixed|absolute)/.test(s.css("position"))||s.css("position","absolute"),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.element.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,n=this.options;if("parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=["document"===n.containment?0:e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,"document"===n.containment?0:e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,("document"===n.containment?0:e(window).scrollLeft())+e("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,("document"===n.containment?0:e(window).scrollTop())+(e("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||n.containment.constructor===Array)n.containment.constructor===Array&&(this.containment=n.containment);else{if(i=e(n.containment),s=i[0],!s)return;t="hidden"!==e(s).css("overflow"),this.containment=[(parseInt(e(s).css("borderLeftWidth"),10)||0)+(parseInt(e(s).css("paddingLeft"),10)||0),(parseInt(e(s).css("borderTopWidth"),10)||0)+(parseInt(e(s).css("paddingTop"),10)||0),(t?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(e(s).css("borderRightWidth"),10)||0)-(parseInt(e(s).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(t?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(e(s).css("borderBottomWidth"),10)||0)-(parseInt(e(s).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i}},_convertPositionTo:function(t,i){i||(i=this.position);var s="absolute"===t?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,a=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():a?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():a?0:n.scrollLeft())*s}},_generatePosition:function(t){var i,s,n,a,o=this.options,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName),l=t.pageX,u=t.pageY;return this.originalPosition&&(this.containment&&(this.relative_container?(s=this.relative_container.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(u=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(u=i[3]+this.offset.click.top)),o.grid&&(n=o.grid[1]?this.originalPageY+Math.round((u-this.originalPageY)/o.grid[1])*o.grid[1]:this.originalPageY,u=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-o.grid[1]:n+o.grid[1]:n,a=o.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/o.grid[0])*o.grid[0]:this.originalPageX,l=i?a-this.offset.click.left>=i[0]||a-this.offset.click.left>i[2]?a:a-this.offset.click.left>=i[0]?a-o.grid[0]:a+o.grid[0]:a)),{top:u-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(t,i,s){return s=s||this._uiHash(),e.ui.plugin.call(this,t,[i,s]),"drag"===t&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,i){var s=e(this).data("ui-draggable"),n=s.options,a=e.extend({},i,{item:s.element});s.sortables=[],e(n.connectToSortable).each(function(){var i=e.data(this,"ui-sortable");i&&!i.options.disabled&&(s.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",t,a))})},stop:function(t,i){var s=e(this).data("ui-draggable"),n=e.extend({},i,{item:s.element});e.each(s.sortables,function(){this.instance.isOver?(this.instance.isOver=0,s.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,"original"===s.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,n))})},drag:function(t,i){var s=e(this).data("ui-draggable"),n=this;e.each(s.sortables,function(){var a=!1,o=this;this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(a=!0,e.each(s.sortables,function(){return this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this!==o&&this.instance._intersectsWith(this.instance.containerCache)&&e.contains(o.instance.element[0],this.instance.element[0])&&(a=!1),a})),a?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=s.offset.click.top,this.instance.offset.click.left=s.offset.click.left,this.instance.offset.parent.left-=s.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=s.offset.parent.top-this.instance.offset.parent.top,s._trigger("toSortable",t),s.dropped=this.instance.element,s.currentItem=s.element,this.instance.fromOutside=s),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),s._trigger("fromSortable",t),s.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(){var t=e("body"),i=e(this).data("ui-draggable").options;t.css("cursor")&&(i._cursor=t.css("cursor")),t.css("cursor",i.cursor)},stop:function(){var t=e(this).data("ui-draggable").options;t._cursor&&e("body").css("cursor",t._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,i){var s=e(i.helper),n=e(this).data("ui-draggable").options;s.css("opacity")&&(n._opacity=s.css("opacity")),s.css("opacity",n.opacity)},stop:function(t,i){var s=e(this).data("ui-draggable").options;s._opacity&&e(i.helper).css("opacity",s._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(){var t=e(this).data("ui-draggable");t.scrollParent[0]!==document&&"HTML"!==t.scrollParent[0].tagName&&(t.overflowOffset=t.scrollParent.offset())},drag:function(t){var i=e(this).data("ui-draggable"),s=i.options,n=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(s.axis&&"x"===s.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-t.pageY<s.scrollSensitivity?i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop+s.scrollSpeed:t.pageY-i.overflowOffset.top<s.scrollSensitivity&&(i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop-s.scrollSpeed)),s.axis&&"y"===s.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-t.pageX<s.scrollSensitivity?i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft+s.scrollSpeed:t.pageX-i.overflowOffset.left<s.scrollSensitivity&&(i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft-s.scrollSpeed))):(s.axis&&"x"===s.axis||(t.pageY-e(document).scrollTop()<s.scrollSensitivity?n=e(document).scrollTop(e(document).scrollTop()-s.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<s.scrollSensitivity&&(n=e(document).scrollTop(e(document).scrollTop()+s.scrollSpeed))),s.axis&&"y"===s.axis||(t.pageX-e(document).scrollLeft()<s.scrollSensitivity?n=e(document).scrollLeft(e(document).scrollLeft()-s.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<s.scrollSensitivity&&(n=e(document).scrollLeft(e(document).scrollLeft()+s.scrollSpeed)))),n!==!1&&e.ui.ddmanager&&!s.dropBehaviour&&e.ui.ddmanager.prepareOffsets(i,t)}}),e.ui.plugin.add("draggable","snap",{start:function(){var t=e(this).data("ui-draggable"),i=t.options;t.snapElements=[],e(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=e(this),s=i.offset();this!==t.element[0]&&t.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:s.top,left:s.left})})},drag:function(t,i){var s,n,a,o,r,h,l,u,c,d,p=e(this).data("ui-draggable"),f=p.options,m=f.snapTolerance,g=i.offset.left,v=g+p.helperProportions.width,y=i.offset.top,b=y+p.helperProportions.height;for(c=p.snapElements.length-1;c>=0;c--)r=p.snapElements[c].left,h=r+p.snapElements[c].width,l=p.snapElements[c].top,u=l+p.snapElements[c].height,g>r-m&&h+m>g&&y>l-m&&u+m>y||g>r-m&&h+m>g&&b>l-m&&u+m>b||v>r-m&&h+m>v&&y>l-m&&u+m>y||v>r-m&&h+m>v&&b>l-m&&u+m>b?("inner"!==f.snapMode&&(s=m>=Math.abs(l-b),n=m>=Math.abs(u-y),a=m>=Math.abs(r-v),o=m>=Math.abs(h-g),s&&(i.position.top=p._convertPositionTo("relative",{top:l-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:u,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r-p.helperProportions.width}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h}).left-p.margins.left)),d=s||n||a||o,"outer"!==f.snapMode&&(s=m>=Math.abs(l-y),n=m>=Math.abs(u-b),a=m>=Math.abs(r-g),o=m>=Math.abs(h-v),s&&(i.position.top=p._convertPositionTo("relative",{top:l,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:u-p.helperProportions.height,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[c].snapping&&(s||n||a||o||d)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[c].item})),p.snapElements[c].snapping=s||n||a||o||d):(p.snapElements[c].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[c].item})),p.snapElements[c].snapping=!1)}}),e.ui.plugin.add("draggable","stack",{start:function(){var t,i=this.data("ui-draggable").options,s=e.makeArray(e(i.stack)).sort(function(t,i){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(i).css("zIndex"),10)||0)});s.length&&(t=parseInt(e(s[0]).css("zIndex"),10)||0,e(s).each(function(i){e(this).css("zIndex",t+i)}),this.css("zIndex",t+s.length))}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,i){var s=e(i.helper),n=e(this).data("ui-draggable").options;s.css("zIndex")&&(n._zIndex=s.css("zIndex")),s.css("zIndex",n.zIndex)},stop:function(t,i){var s=e(this).data("ui-draggable").options;s._zIndex&&e(i.helper).css("zIndex",s._zIndex)}})})(jQuery);(function(t){function e(t,e,i){return t>e&&e+i>t}function i(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))}t.widget("ui.sortable",t.ui.mouse,{version:"1.10.2",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var t=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===t.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_setOption:function(e,i){"disabled"===e?(this.options[e]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):t.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(e,i){var s=null,n=!1,a=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,a.widgetName+"-item")===a?(s=t(this),!1):undefined}),t.data(e.target,a.widgetName+"-item")===a&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,a,o=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),o.containment&&this._setContainment(),o.cursor&&"auto"!==o.cursor&&(a=this.document.find("body"),this.storedCursor=a.css("cursor"),a.css("cursor",o.cursor),this.storedStylesheet=t("<style>*{ cursor: "+o.cursor+" !important; }</style>").appendTo(a)),o.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",o.opacity)),o.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",o.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,a,o=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<o.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+o.scrollSpeed:e.pageY-this.overflowOffset.top<o.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-o.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<o.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+o.scrollSpeed:e.pageX-this.overflowOffset.left<o.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-o.scrollSpeed)):(e.pageY-t(document).scrollTop()<o.scrollSensitivity?r=t(document).scrollTop(t(document).scrollTop()-o.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<o.scrollSensitivity&&(r=t(document).scrollTop(t(document).scrollTop()+o.scrollSpeed)),e.pageX-t(document).scrollLeft()<o.scrollSensitivity?r=t(document).scrollLeft(t(document).scrollLeft()-o.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<o.scrollSensitivity&&(r=t(document).scrollLeft(t(document).scrollLeft()+o.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],a=this._intersectsWithPointer(s),a&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===a?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===a?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),a=this.options.axis,o={};a&&"x"!==a||(o.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),a&&"y"!==a||(o.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(o,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,a=t.left,o=a+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u=s+l>r&&h>s+l&&e+c>a&&o>e+c;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?u:e+this.helperProportions.width/2>a&&o>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var i="x"===this.options.axis||e(this.positionAbs.top+this.offset.click.top,t.top,t.height),s="y"===this.options.axis||e(this.positionAbs.left+this.offset.click.left,t.left,t.width),n=i&&s,a=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();return n?this.floating?o&&"right"===o||"down"===a?2:1:a&&("down"===a?2:1):!1},_intersectsWithSides:function(t){var i=e(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),s=e(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),n=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return this.floating&&a?"right"===a&&s||"left"===a&&!s:n&&("down"===n&&i||"up"===n&&!i)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){var i,s,n,a,o=[],r=[],h=this._connectWith();if(h&&e)for(i=h.length-1;i>=0;i--)for(n=t(h[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&r.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(r.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=r.length-1;i>=0;i--)r[i][0].each(function(){o.push(this)});return t(o)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,a,o,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&(u.push([t.isFunction(a.options.items)?a.options.items.call(a.element[0],e,{item:this.currentItem}):t(a.options.items,a.element),a]),this.containers.push(a));for(i=u.length-1;i>=0;i--)for(o=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",o),c.push({item:h,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,a;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),a=n.offset(),s.left=a.left,s.top=a.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)a=this.containers[i].element.offset(),this.containers[i].containerCache.left=a.left,this.containers[i].containerCache.top=a.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t(e.document[0].createElement(s)).addClass(i||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?n.append("<td colspan='99'>&#160;</td>"):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_contactContainers:function(s){var n,a,o,r,h,l,c,u,d,p,f=null,m=null;for(n=this.containers.length-1;n>=0;n--)if(!t.contains(this.currentItem[0],this.containers[n].element[0]))if(this._intersectsWith(this.containers[n].containerCache)){if(f&&t.contains(this.containers[n].element[0],f.element[0]))continue;f=this.containers[n],m=n}else this.containers[n].containerCache.over&&(this.containers[n]._trigger("out",s,this._uiHash(this)),this.containers[n].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[m].containerCache.over||(this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1);else{for(o=1e4,r=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",c=this.positionAbs[h]+this.offset.click[h],a=this.items.length-1;a>=0;a--)t.contains(this.containers[m].element[0],this.items[a].item[0])&&this.items[a].item[0]!==this.currentItem[0]&&(!p||e(this.positionAbs.top+this.offset.click.top,this.items[a].top,this.items[a].height))&&(u=this.items[a].item.offset()[h],d=!1,Math.abs(u-c)>Math.abs(u+this.items[a][l]-c)&&(d=!0,u+=this.items[a][l]),o>Math.abs(u-c)&&(o=Math.abs(u-c),r=this.items[a],this.direction=d?"up":"down"));if(!r&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[m])return;r?this._rearrange(s,r,null,!0):this._rearrange(s,null,this.containers[m].element,!0),this._trigger("change",s,this._uiHash()),this.containers[m]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[m],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,t("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(t("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,a=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():a?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():a?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,a=e.pageX,o=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(a=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(a=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1],o=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((a-this.originalPageX)/n.grid[0])*n.grid[0],a=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&s.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||s.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(s.push(function(t){this._trigger("remove",t,this._uiHash())}),s.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)e||s.push(function(t){return function(e){t._trigger("deactivate",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(t){return function(e){t._trigger("out",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!e){for(this._trigger("beforeStop",t,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}if(e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!e){for(i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})})(jQuery);

/*!used for adding !important to css properties
found at http://stackoverflow.com/questions/2655925/apply-important-css-style-using-jquery
by Aram Kocharyan (http://stackoverflow.com/users/549848/aram-kocharyan) */

// For those who need them (< IE 9), add support for CSS functions
var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function (a) {
        return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function (styleName, value, priority) {
        this.setAttribute(styleName, value);
        var priority = typeof priority != 'undefined' ? priority : '';
        if (priority != '') {
            // Add priority manually
            var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*' + RegExp.escape(value) + '(\\s*;)?', 'gmi');
            this.cssText = this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
        }
    }
    CSSStyleDeclaration.prototype.removeProperty = function (a) {
        return this.removeAttribute(a);
    }
    CSSStyleDeclaration.prototype.getPropertyPriority = function (styleName) {
        var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
        return rule.test(this.cssText) ? 'important' : '';
    }
}

// Escape regex chars with \
RegExp.escape = function (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// The style function
jQuery.fn.style = function (styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node 
    if (typeof node == 'undefined') {
        return;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
        if (typeof value != 'undefined') {
            // Set style property
            var priority = typeof priority != 'undefined' ? priority : '';
            style.setProperty(styleName, value, priority);
        } else {
            // Get style property
            return style.getPropertyValue(styleName);
        }
    } else {
        // Get CSSStyleDeclaration
        return style;
    }
}

/*!
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

/*!
* Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
* Licensed under MIT
* @author Ariel Flesler
* @version 1.4.7
*/
(function (d) { function h(b) { return "object" == typeof b ? b : { top: b, left: b} } var n = d.scrollTo = function (b, c, a) { return d(window).scrollTo(b, c, a) }; n.defaults = { axis: "xy", duration: 1.3 <= parseFloat(d.fn.jquery) ? 0 : 1, limit: !0 }; n.window = function (b) { return d(window)._scrollable() }; d.fn._scrollable = function () { return this.map(function () { if (this.nodeName && -1 == d.inArray(this.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"])) return this; var b = (this.contentWindow || this).document || this.ownerDocument || this; return /webkit/i.test(navigator.userAgent) || "BackCompat" == b.compatMode ? b.body : b.documentElement }) }; d.fn.scrollTo = function (b, c, a) { "object" == typeof c && (a = c, c = 0); "function" == typeof a && (a = { onAfter: a }); "max" == b && (b = 9E9); a = d.extend({}, n.defaults, a); c = c || a.duration; a.queue = a.queue && 1 < a.axis.length; a.queue && (c /= 2); a.offset = h(a.offset); a.over = h(a.over); return this._scrollable().each(function () { function q(b) { k.animate(e, c, a.easing, b && function () { b.call(this, g, a) }) } if (null != b) { var l = this, k = d(l), g = b, p, e = {}, s = k.is("html,body"); switch (typeof g) { case "number": case "string": if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(g)) { g = h(g); break } g = d(g, this); if (!g.length) return; case "object": if (g.is || g.style) p = (g = d(g)).offset() } d.each(a.axis.split(""), function (b, d) { var c = "x" == d ? "Left" : "Top", m = c.toLowerCase(), f = "scroll" + c, h = l[f], r = n.max(l, d); p ? (e[f] = p[m] + (s ? 0 : h - k.offset()[m]), a.margin && (e[f] -= parseInt(g.css("margin" + c)) || 0, e[f] -= parseInt(g.css("border" + c + "Width")) || 0), e[f] += a.offset[m] || 0, a.over[m] && (e[f] += g["x" == d ? "width" : "height"]() * a.over[m])) : (c = g[m], e[f] = c.slice && "%" == c.slice(-1) ? parseFloat(c) / 100 * r : c); a.limit && /^\d+$/.test(e[f]) && (e[f] = 0 >= e[f] ? 0 : Math.min(e[f], r)); !b && a.queue && (h != e[f] && q(a.onAfterFirst), delete e[f]) }); q(a.onAfter) } }).end() }; n.max = function (b, c) { var a = "x" == c ? "Width" : "Height", h = "scroll" + a; if (!d(b).is("html,body")) return b[h] - d(b)[a.toLowerCase()](); var a = "client" + a, l = b.ownerDocument.documentElement, k = b.ownerDocument.body; return Math.max(l[h], k[h]) - Math.min(l[a], k[a]) } })(jQuery);

/*!
* jQuery Masonry v2.1.08
* A dynamic layout plugin for jQuery
* The flip-side of CSS Floats
* http://masonry.desandro.com
*
* Licensed under the MIT license.
* Copyright 2012 David DeSandro
*/

/*jshint browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function (window, $, undefined) {

    'use strict';

    /*
    * smartresize: debounced resize event for jQuery
    *
    * latest version and complete README available on Github:
    * https://github.com/louisremi/jquery.smartresize.js
    *
    * Copyright 2011 @louis_remi
    * Licensed under the MIT license.
    */

    var $event = $.event,
      resizeTimeout;

    $event.special.smartresize = {
        setup: function () {
            $(this).bind("resize", $event.special.smartresize.handler);
        },
        teardown: function () {
            $(this).unbind("resize", $event.special.smartresize.handler);
        },
        handler: function (event, execAsap) {
            // Save the context
            var context = this,
          args = arguments;

            // set correct event type
            event.type = "smartresize";

            if (resizeTimeout) { clearTimeout(resizeTimeout); }
            resizeTimeout = setTimeout(function () {
                $event.dispatch.apply(context, args);

            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartresize = function (fn) {
        return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
    };



    // ========================= Masonry ===============================


    // our "Widget" object constructor
    $.Mason = function (options, element) {
        this.element = $(element);

        this._create(options);
        this._init();
    };

    $.Mason.settings = {
        isResizable: true,
        isAnimated: false,
        animationOptions: {
            queue: false,
            duration: 500
        },
        gutterWidth: 0,
        isRTL: false,
        isFitWidth: false,
        containerStyle: {
            position: 'relative'
        }
    };

    $.Mason.prototype = {

        _filterFindBricks: function ($elems) {
            var selector = this.options.itemSelector;
            // if there is a selector
            // filter/find appropriate item elements
            return !selector ? $elems : $elems.filter(selector).add($elems.find(selector));
        },

        _getBricks: function ($elems) {
            var $bricks = this._filterFindBricks($elems)
        .css({ position: 'absolute' })
        .addClass('masonry-brick');
            return $bricks;
        },

        // sets up widget
        _create: function (options) {

            this.options = $.extend(true, {}, $.Mason.settings, options);
            this.styleQueue = [];

            // get original styles in case we re-apply them in .destroy()
            var elemStyle = this.element[0].style;
            this.originalStyle = {
                // get height
                height: elemStyle.height || ''
            };
            // get other styles that will be overwritten
            var containerStyle = this.options.containerStyle;
            for (var prop in containerStyle) {
                this.originalStyle[prop] = elemStyle[prop] || '';
            }

            this.element.css(containerStyle);

            this.horizontalDirection = this.options.isRTL ? 'right' : 'left';

            var x = this.element.css('padding-' + this.horizontalDirection);
            var y = this.element.css('padding-top');
            this.offset = {
                x: x ? parseInt(x, 10) : 0,
                y: y ? parseInt(y, 10) : 0
            };

            this.isFluid = this.options.columnWidth && typeof this.options.columnWidth === 'function';

            // add masonry class first time around
            var instance = this;
            setTimeout(function () {
                instance.element.addClass('masonry');
            }, 0);

            // bind resize method
            if (this.options.isResizable) {
                $(window).bind('smartresize.masonry', function () {
                    instance.resize();
                });
            }


            // need to get bricks
            this.reloadItems();

        },

        // _init fires when instance is first created
        // and when instance is triggered again -> $el.masonry();
        _init: function (callback) {
            this._getColumns();
            this._reLayout(callback);
        },

        option: function (key, value) {
            // set options AFTER initialization:
            // signature: $('#foo').bar({ cool:false });
            if ($.isPlainObject(key)) {
                this.options = $.extend(true, this.options, key);
            }
        },

        // ====================== General Layout ======================

        // used on collection of atoms (should be filtered, and sorted before )
        // accepts atoms-to-be-laid-out to start with
        layout: function ($bricks, callback) {

            // place each brick
            for (var i = 0, len = $bricks.length; i < len; i++) {
                this._placeBrick($bricks[i]);
            }

            // set the size of the container
            var containerSize = {};
            containerSize.height = Math.max.apply(Math, this.colYs);
            if (this.options.isFitWidth) {
                var unusedCols = 0;
                i = this.cols;
                // count unused columns
                while (--i) {
                    if (this.colYs[i] !== 0) {
                        break;
                    }
                    unusedCols++;
                }
                // fit container to columns that have been used;
                containerSize.width = (this.cols - unusedCols) * this.columnWidth - this.options.gutterWidth;
            }
            this.styleQueue.push({ $el: this.element, style: containerSize });

            // are we animating the layout arrangement?
            // use plugin-ish syntax for css or animate
            var styleFn = !this.isLaidOut ? 'css' : (
            this.options.isAnimated ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions;

            // process styleQueue
            var obj;
            for (i = 0, len = this.styleQueue.length; i < len; i++) {
                obj = this.styleQueue[i];
                obj.$el[styleFn](obj.style, animOpts);
            }

            // clear out queue for next time
            this.styleQueue = [];

            // provide $elems as context for the callback
            if (callback) {
                callback.call($bricks);
            }

            this.isLaidOut = true;
        },

        // calculates number of columns
        // i.e. this.columnWidth = 200
        _getColumns: function () {
            var container = this.options.isFitWidth ? this.element.parent() : this.element,
          containerWidth = container.width();

            // use fluid columnWidth function if there
            this.columnWidth = this.isFluid ? this.options.columnWidth(containerWidth) :
            // if not, how about the explicitly set option?
                    this.options.columnWidth ||
            // or use the size of the first item
                    this.$bricks.outerWidth(true) ||
            // if there's no items, use size of container
                    containerWidth;

            this.columnWidth += this.options.gutterWidth;

            this.cols = Math.floor((containerWidth + this.options.gutterWidth) / this.columnWidth);
            this.cols = Math.max(this.cols, 1);

        },

        // layout logic
        _placeBrick: function (brick) {
            var $brick = $(brick),
          colSpan, groupCount, groupY, groupColY, j;

            //how many columns does this brick span
            colSpan = Math.ceil($brick.outerWidth(true) / this.columnWidth);
            colSpan = Math.min(colSpan, this.cols);

            if (colSpan === 1) {
                // if brick spans only one column, just like singleMode
                groupY = this.colYs;
            } else {
                // brick spans more than one column
                // how many different places could this brick fit horizontally
                groupCount = this.cols + 1 - colSpan;
                groupY = [];

                // for each group potential horizontal position
                for (j = 0; j < groupCount; j++) {
                    // make an array of colY values for that one group
                    groupColY = this.colYs.slice(j, j + colSpan);
                    // and get the max value of the array
                    groupY[j] = Math.max.apply(Math, groupColY);
                }

            }

            // get the minimum Y value from the columns
            var minimumY = Math.min.apply(Math, groupY),
          shortCol = 0;

            // Find index of short column, the first from the left
            for (var i = 0, len = groupY.length; i < len; i++) {
                if (groupY[i] === minimumY) {
                    shortCol = i;
                    break;
                }
            }

            // position the brick
            var position = {
                top: minimumY + this.offset.y
            };
            // position.left or position.right
            position[this.horizontalDirection] = this.columnWidth * shortCol + this.offset.x;
            this.styleQueue.push({ $el: $brick, style: position });

            // apply setHeight to necessary columns
            var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.cols + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.colYs[shortCol + i] = setHeight;
            }

        },


        resize: function () {
            var prevColCount = this.cols;
            // get updated colCount
            this._getColumns();
            if (this.isFluid || this.cols !== prevColCount) {
                // if column count has changed, trigger new layout
                this._reLayout();
            }
        },


        _reLayout: function (callback) {
            // reset columns
            var i = this.cols;
            this.colYs = [];
            while (i--) {
                this.colYs.push(0);
            }
            // apply layout logic to all bricks
            this.layout(this.$bricks, callback);
        },

        // ====================== Convenience methods ======================

        // goes through all children again and gets bricks in proper order
        reloadItems: function () {
            this.$bricks = this._getBricks(this.element.children());
        },


        reload: function (callback) {
            this.reloadItems();
            this._init(callback);
        },


        // convienence method for working with Infinite Scroll
        appended: function ($content, isAnimatedFromBottom, callback) {
            if (isAnimatedFromBottom) {
                // set new stuff to the bottom
                this._filterFindBricks($content).css({ top: this.element.height() });
                var instance = this;
                setTimeout(function () {
                    instance._appended($content, callback);
                }, 1);
            } else {
                this._appended($content, callback);
            }
        },

        _appended: function ($content, callback) {
            var $newBricks = this._getBricks($content);
            // add new bricks to brick pool
            this.$bricks = this.$bricks.add($newBricks);
            this.layout($newBricks, callback);
        },

        // removes elements from Masonry widget
        remove: function ($content) {
            this.$bricks = this.$bricks.not($content);
            $content.remove();
        },

        // destroys widget, returns elements and container back (close) to original style
        destroy: function () {

            this.$bricks
        .removeClass('masonry-brick')
        .each(function () {
            this.style.position = '';
            this.style.top = '';
            this.style.left = '';
        });

            // re-apply saved container styles
            var elemStyle = this.element[0].style;
            for (var prop in this.originalStyle) {
                elemStyle[prop] = this.originalStyle[prop];
            }

            this.element
        .unbind('.masonry')
        .removeClass('masonry')
        .removeData('masonry');

            $(window).unbind('.masonry');

        }

    };


    // ======================= imagesLoaded Plugin ===============================
    /*!
    * jQuery imagesLoaded plugin v1.1.0
    * http://github.com/desandro/imagesloaded
    *
    * MIT License. by Paul Irish et al.
    */


    // $('#my-container').imagesLoaded(myFunction)
    // or
    // $('img').imagesLoaded(myFunction)

    // execute a callback when all images have loaded.
    // needed because .load() doesn't work on cached images

    // callback function gets image collection as argument
    //  `this` is the container

    $.fn.imagesLoaded = function (callback) {
        var $this = this,
        $images = $this.find('img').add($this.filter('img')),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

        function triggerCallback() {
            callback.call($this, $images);
        }

        function imgLoaded(event) {
            var img = event.target;
            if (img.src !== blank && $.inArray(img, loaded) === -1) {
                loaded.push(img);
                if (--len <= 0) {
                    setTimeout(triggerCallback);
                    $images.unbind('.imagesLoaded', imgLoaded);
                }
            }
        }

        // if no images, trigger immediately
        if (!len) {
            triggerCallback();
        }

        $images.bind('load.imagesLoaded error.imagesLoaded', imgLoaded).each(function () {
            // cached images don't fire load sometimes, so we reset src.
            var src = this.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            this.src = blank;
            this.src = src;
        });

        return $this;
    };


    // helper function for logging errors
    // $.error breaks jQuery chaining
    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    // =======================  Plugin bridge  ===============================
    // leverages data method to either create or return $.Mason constructor
    // A bit from jQuery UI
    //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
    // A bit from jcarousel 
    //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

    $.fn.masonry = function (options) {
        if (typeof options === 'string') {
            // call method
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var instance = $.data(this, 'masonry');
                if (!instance) {
                    logError("cannot call methods on masonry prior to initialization; " +
            "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for masonry instance");
                    return;
                }
                // apply method
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'masonry');
                if (instance) {
                    // apply options & init
                    instance.option(options || {});
                    instance._init();
                } else {
                    // initialize new instance
                    $.data(this, 'masonry', new $.Mason(options, this));
                }
            });
        }
        return this;
    };

})(window, jQuery);

/*! MSDropDown - jquery.dd.js
 author: Marghoob Suleman - http://www.marghoobsuleman.com/
 Date: 10 Nov, 2012 
 Version: 3.5.2
 Revision: 27
 web: www.marghoobsuleman.com

 msDropDown is free jQuery Plugin: you can redistribute it and/or modify
 it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
*/
var msBeautify = msBeautify || {};
(function ($) {
    msBeautify = {
        version: { msDropdown: '3.5.2' },
        author: "Marghoob Suleman",
        counter: 20,
        debug: function (v) {
            if (v !== false) {
                $(".ddOutOfVision").css({ height: 'auto', position: 'relative' });
            } else {
                $(".ddOutOfVision").css({ height: '0px', position: 'absolute' });
            }
        },
        oldDiv: '',
        create: function (id, settings, type) {
            type = type || "dropdown";
            var data;
            switch (type.toLowerCase()) {
                case "dropdown":
                case "select":
                    data = $(id).msDropdown(settings).data("dd");
                    break;
            }
            return data;
        }
    };

    $.msDropDown = {}; //Legacy
    $.msDropdown = {}; //camelCaps
    $.extend(true, $.msDropDown, msBeautify);
    $.extend(true, $.msDropdown, msBeautify);
    // make compatibiliy with old and new jquery
    if ($.fn.prop === undefined) { $.fn.prop = $.fn.attr; }
    if ($.fn.on === undefined) { $.fn.on = $.fn.bind; $.fn.off = $.fn.unbind; }
    if (typeof $.expr.createPseudo === 'function') {
        //jQuery 1.8  or greater
        $.expr[':'].Contains = $.expr.createPseudo(function (arg) { return function (elem) { return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; });
    } else {
        //lower version
        $.expr[':'].Contains = function (a, i, m) { return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; };
    }
    //dropdown class
    function dd(element, settings) {
        var settings = $.extend(true,
		{ byJson: { data: null, selectedIndex: 0, name: null, size: 0, multiple: false, width: 250 },
		    mainCSS: 'dd',
		    height: 220, //not using currently
		    visibleRows: 7,
		    rowHeight: 30,
		    showIcon: true,
		    zIndex: 9999,
		    useSprite: false,
		    animStyle: 'slideDown',
		    event: 'click',
		    openDirection: 'auto', //auto || alwaysUp || alwaysDown
		    jsonTitle: true,
		    style: '',
		    disabledOpacity: 0.7,
		    disabledOptionEvents: true,
		    childWidth: 0,
		    enableCheckbox: false, //this needs to multiple or it will set element to multiple
		    checkboxNameSuffix: '_mscheck',
		    append: '',
		    prepend: '',
		    reverseMode: true, //it will update the msdropdown UI/value if you update the original dropdown - will be usefull if are using knockout.js or playing with original dropdown
		    roundedCorner: true,
		    enableAutoFilter: true,
		    on: { create: null, open: null, close: null, add: null, remove: null, change: null, blur: null, click: null, dblclick: null, mousemove: null, mouseover: null, mouseout: null, focus: null, mousedown: null, mouseup: null }
		}, settings);
        var $this = this; //this class	 
        var holderId = { postElementHolder: '_msddHolder', postID: '_msdd', postTitleID: '_title', postTitleTextID: '_titleText', postChildID: '_child' };
        var css = { dd: settings.mainCSS, ddTitle: 'ddTitle', arrow: 'ddArrow arrowoff', ddChild: 'ddChild', ddTitleText: 'ddTitleText', disabled: 'disabled', enabled: 'enabled', ddOutOfVision: 'ddOutOfVision', borderTop: 'borderTop', noBorderTop: 'noBorderTop', selected: 'selected', divider: 'divider', optgroup: "optgroup", optgroupTitle: "optgroupTitle", description: "description", label: "ddlabel", hover: 'hover', disabledAll: 'disabledAll' };
        var css_i = { li: '_msddli_', borderRadiusTp: 'borderRadiusTp', ddChildMore: 'border shadow', fnone: "fnone" };
        var isList = false, isMultiple = false, isDisabled = false, cacheElement = {}, element, orginial = {}, isOpen = false;
        var DOWN_ARROW = 40, UP_ARROW = 38, LEFT_ARROW = 37, RIGHT_ARROW = 39, ESCAPE = 27, ENTER = 13, ALPHABETS_START = 47, SHIFT = 16, CONTROL = 17, BACKSPACE = 8, DELETE = 46;
        var shiftHolded = false, controlHolded = false, lastTarget = null, forcedTrigger = false, oldSelected, isCreated = false;
        var doc = document, ua = window.navigator.userAgent, isIE = ua.match(/msie/i);
        settings.reverseMode = settings.reverseMode.toString();
        settings.roundedCorner = settings.roundedCorner.toString();
        var isArray = function (obj) {
            return (Object.prototype.toString.call(obj) == "[object Array]") ? true : false;
        };
        var msieversion = function () {
            var msie = ua.indexOf("MSIE");
            if (msie > 0) {      // If Internet Explorer, return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
            } else {                // If another browser, return 0
                return 0;
            };
        };
        var checkDataSetting = function () {
            settings.mainCSS = $("#" + element).data("maincss") || settings.mainCSS;
            settings.visibleRows = $("#" + element).data("visiblerows") || settings.visibleRows;
            if ($("#" + element).data("showicon") == false) { settings.showIcon = $("#" + element).data("showicon"); };
            settings.useSprite = $("#" + element).data("usesprite") || settings.useSprite;
            settings.animStyle = $("#" + element).data("animstyle") || settings.animStyle;
            settings.event = $("#" + element).data("event") || settings.event;
            settings.openDirection = $("#" + element).data("opendirection") || settings.openDirection;
            settings.jsonTitle = $("#" + element).data("jsontitle") || settings.jsonTitle;
            settings.disabledOpacity = $("#" + element).data("disabledopacity") || settings.disabledOpacity;
            settings.childWidth = $("#" + element).data("childwidth") || settings.childWidth;
            settings.enableCheckbox = $("#" + element).data("enablecheckbox") || settings.enableCheckbox;
            settings.checkboxNameSuffix = $("#" + element).data("checkboxnamesuffix") || settings.checkboxNameSuffix;
            settings.append = $("#" + element).data("append") || settings.append;
            settings.prepend = $("#" + element).data("prepend") || settings.prepend;
            settings.reverseMode = $("#" + element).data("reversemode") || settings.reverseMode;
            settings.roundedCorner = $("#" + element).data("roundedcorner") || settings.roundedCorner;
            settings.enableAutoFilter = $("#" + element).data("enableautofilter") || settings.enableAutoFilter;

            //make string
            settings.reverseMode = settings.reverseMode.toString();
            settings.roundedCorner = settings.roundedCorner.toString();
            settings.enableAutoFilter = settings.enableAutoFilter.toString();
        };
        var getElement = function (ele) {
            if (cacheElement[ele] === undefined) {
                cacheElement[ele] = doc.getElementById(ele);
            }
            return cacheElement[ele];
        };
        var getIndex = function (opt) {
            var childid = getPostID("postChildID");
            return $("#" + childid + " li." + css_i.li).index(opt);
        };
        var createByJson = function () {
            if (settings.byJson.data) {
                var validData = ["description", "image", "title"];
                try {
                    if (!element.id) {
                        element.id = "dropdown" + msBeautify.counter;
                    };
                    settings.byJson.data = eval(settings.byJson.data);
                    //change element
                    var id = "msdropdown" + (msBeautify.counter++);
                    var obj = {};
                    obj.id = id;
                    obj.name = settings.byJson.name || element.id; //its name
                    if (settings.byJson.size > 0) {
                        obj.size = settings.byJson.size;
                    };
                    obj.multiple = settings.byJson.multiple;
                    var oSelect = createElement("select", obj);
                    for (var i = 0; i < settings.byJson.data.length; i++) {
                        var current = settings.byJson.data[i];
                        var opt = new Option(current.text, current.value);
                        for (var p in current) {
                            if (p.toLowerCase() != 'text') {
                                var key = ($.inArray(p.toLowerCase(), validData) != -1) ? "data-" : "";
                                opt.setAttribute(key + p, current[p]);
                            };
                        };
                        oSelect.options[i] = opt;
                    };
                    getElement(element.id).appendChild(oSelect);
                    oSelect.selectedIndex = settings.byJson.selectedIndex;
                    $(oSelect).css({ width: settings.byJson.width + 'px' });
                    //now change element for access other things
                    element = oSelect;
                } catch (e) {
                    throw "There is an error in json data.";
                };
            };
        };
        var init = function () {
            //set properties
            createByJson();
            if (!element.id) {
                element.id = "msdrpdd" + (msBeautify.counter++);
            };
            element = element.id;
            $this.element = element;
            checkDataSetting();
            isDisabled = getElement(element).disabled;
            var useCheckbox = settings.enableCheckbox;
            if (useCheckbox.toString() === "true") {
                getElement(element).multiple = true;
                settings.enableCheckbox = true;
            };
            isList = (getElement(element).size > 1 || getElement(element).multiple == true) ? true : false;
            //trace("isList "+isList);
            if (isList) { isMultiple = getElement(element).multiple; };
            mergeAllProp();
            //create layout
            createLayout();
            //set ui prop
            updateProp("uiData", getDataAndUI());
            updateProp("selectedOptions", $("#" + element + " option:selected"));
            var childid = getPostID("postChildID");
            oldSelected = $("#" + childid + " li." + css.selected);

            if (settings.reverseMode === "true") {
                $("#" + element).on("change", function () {
                    setValue(this.selectedIndex);
                });
            };
            //add refresh method
            getElement(element).refresh = function (e) {
                $("#" + element).msDropdown().data("dd").refresh();
            };

        };
        /********************************************************************************************/
        var getPostID = function (id) {
            return element + holderId[id];
        };
        var getInternalStyle = function (ele) {
            var s = (ele.style === undefined) ? "" : ele.style.cssText;
            return s;
        };
        var parseOption = function (opt) {
            var imagePath = '', title = '', description = '', value = -1, text = '', className = '', imagecss = '', index;
            if (opt !== undefined) {
                var attrTitle = opt.title || "";
                //data-title
                if (attrTitle != "") {
                    var reg = /^\{.*\}$/;
                    var isJson = reg.test(attrTitle);
                    if (isJson && settings.jsonTitle) {
                        var obj = eval("[" + attrTitle + "]");
                    };
                    title = (isJson && settings.jsonTitle) ? obj[0].title : title;
                    description = (isJson && settings.jsonTitle) ? obj[0].description : description;
                    imagePath = (isJson && settings.jsonTitle) ? obj[0].image : attrTitle;
                    imagecss = (isJson && settings.jsonTitle) ? obj[0].imagecss : imagecss;
                    index = opt.index;
                };

                text = opt.text || '';
                value = opt.value || '';
                className = opt.className || "";
                //ignore title attribute if playing with data tags
                title = $(opt).prop("data-title") || $(opt).data("title") || (title || "");
                description = $(opt).prop("data-description") || $(opt).data("description") || (description || "");
                imagePath = $(opt).prop("data-image") || $(opt).data("image") || (imagePath || "");
                imagecss = $(opt).prop("data-imagecss") || $(opt).data("imagecss") || (imagecss || "");
                index = $(opt).index();
            };
            var o = { image: imagePath, title: title, description: description, value: value, text: text, className: className, imagecss: imagecss, index: index };
            return o;
        };
        var createElement = function (nm, attr, html) {
            var tag = doc.createElement(nm);
            if (attr) {
                for (var i in attr) {
                    switch (i) {
                        case "style":
                            tag.style.cssText = attr[i];
                            break;
                        default:
                            tag[i] = attr[i];
                            break;
                    };
                };
            };
            if (html) {
                tag.innerHTML = html;
            };
            return tag;
        };
        /********************************************************************************************/
        /*********************** <layout> *************************************/
        var hideOriginal = function () {
            var hidid = getPostID("postElementHolder");
            if ($("#" + hidid).length == 0) {
                var obj = { style: 'height: 0px;overflow: hidden;position: absolute;', className: css.ddOutOfVision };
                obj.id = hidid;
                var oDiv = createElement("div", obj);
                $("#" + element).after(oDiv);
                $("#" + element).appendTo($("#" + hidid));
            } else {
                $("#" + hidid).css({ height: 0, overflow: 'hidden', position: 'absolute' });
            };
            getElement(element).tabIndex = -1;
        };
        var createWrapper = function () {
            var brdRds = (settings.roundedCorner == "true") ? " borderRadius" : "";
            var obj = {
                className: css.dd + " ddcommon" + brdRds
            };
            var intcss = getInternalStyle(getElement(element));
            var w = $("#" + element).outerWidth();
            obj.style = "width: " + w + "px;";
            if (intcss.length > 0) {
                obj.style = obj.style + "" + intcss;
            };
            obj.id = getPostID("postID");
            obj.tabIndex = getElement(element).tabIndex;
            var oDiv = createElement("div", obj);
            return oDiv;
        };
        var createTitle = function () {
            var selectedOption;
            if (getElement(element).selectedIndex >= 0) {
                selectedOption = getElement(element).options[getElement(element).selectedIndex];
            } else {
                selectedOption = { value: '', text: '' };
            }
            var spriteClass = "", selectedClass = "";
            //check sprite
            var useSprite = $("#" + element).data("usesprite");
            if (useSprite) { settings.useSprite = useSprite; };
            if (settings.useSprite != false) {
                spriteClass = " " + settings.useSprite;
                selectedClass = " " + selectedOption.className;
            };
            var brdRdsTp = (settings.roundedCorner == "true") ? " " + css_i.borderRadiusTp : "";
            var oTitle = createElement("div", { className: css.ddTitle + spriteClass + brdRdsTp });
            //divider
            var oDivider = createElement("span", { className: css.divider });
            //arrow
            var oArrow = createElement("span", { className: css.arrow });
            //title Text
            var titleid = getPostID("postTitleID");
            var oTitleText = createElement("span", { className: css.ddTitleText + selectedClass, id: titleid });

            var parsed = parseOption(selectedOption);
            var arrowPath = parsed.image;
            var sText = parsed.text || "";
            if (arrowPath != "" && settings.showIcon) {
                var oIcon = createElement("img");
                oIcon.src = arrowPath;
                if (parsed.imagecss != "") {
                    oIcon.className = parsed.imagecss + " ";
                };
            };
            var oTitleText_in = createElement("span", { className: css.label }, sText);
            oTitle.appendChild(oDivider);
            oTitle.appendChild(oArrow);
            if (oIcon) {
                oTitleText.appendChild(oIcon);
            };
            oTitleText.appendChild(oTitleText_in);
            oTitle.appendChild(oTitleText);
            var oDescription = createElement("span", { className: css.description }, parsed.description);
            oTitleText.appendChild(oDescription);
            return oTitle;
        };
        var createFilterBox = function () {
            var tid = getPostID("postTitleTextID");
            var brdRds = (settings.roundedCorner == "true") ? "borderRadius" : "";
            var sText = createElement("input", { id: tid, type: 'text', value: '', autocomplete: 'off', className: 'text shadow ' + brdRds, style: 'display: none' });
            return sText;
        };
        var createChild = function (opt) {
            var obj = {};
            var intcss = getInternalStyle(opt);
            if (intcss.length > 0) { obj.style = intcss; };
            var css2 = (opt.disabled) ? css.disabled : css.enabled;
            css2 = (opt.selected) ? (css2 + " " + css.selected) : css2;
            css2 = css2 + " " + css_i.li;
            obj.className = css2;
            if (settings.useSprite != false) {
                obj.className = css2 + " " + opt.className;
            };
            var li = createElement("li", obj);
            var parsed = parseOption(opt);
            if (parsed.title != "") {
                li.title = parsed.title;
            };
            var arrowPath = parsed.image;
            if (arrowPath != "" && settings.showIcon) {
                var oIcon = createElement("img");
                oIcon.src = arrowPath;
                if (parsed.imagecss != "") {
                    oIcon.className = parsed.imagecss + " ";
                };
            };
            if (parsed.description != "") {
                var oDescription = createElement("span", {
                    className: css.description
                }, parsed.description);
            };
            var sText = opt.text || "";
            var oTitleText = createElement("span", {
                className: css.label
            }, sText);
            //checkbox
            if (settings.enableCheckbox === true) {
                var chkbox = createElement("input", {
                    type: 'checkbox', name: element + settings.checkboxNameSuffix + '[]', value: opt.value || "", className: "checkbox"
                }); //this can be used for future
                li.appendChild(chkbox);
                if (settings.enableCheckbox === true) {
                    chkbox.checked = (opt.selected) ? true : false;
                };
            };
            if (oIcon) {
                li.appendChild(oIcon);
            };
            li.appendChild(oTitleText);
            if (oDescription) {
                li.appendChild(oDescription);
            } else {
                if (oIcon) {
                    oIcon.className = oIcon.className + css_i.fnone;
                };
            };
            var oClear = createElement("div", { className: 'clear' });
            li.appendChild(oClear);
            return li;
        };
        var createChildren = function () {
            var childid = getPostID("postChildID");
            var obj = { className: css.ddChild + " ddchild_ " + css_i.ddChildMore, id: childid };
            if (isList == false) {
                obj.style = "z-index: " + settings.zIndex;
            } else {
                obj.style = "z-index:1";
            };
            var childWidth = $("#" + element).data("childwidth") || settings.childWidth;
            if (childWidth) {
                obj.style = (obj.style || "") + ";width:" + childWidth;
            };
            var oDiv = createElement("div", obj);
            var ul = createElement("ul");
            if (settings.useSprite != false) {
                ul.className = settings.useSprite;
            };
            var allOptions = getElement(element).children;
            for (var i = 0; i < allOptions.length; i++) {
                var current = allOptions[i];
                var li;
                if (current.nodeName.toLowerCase() == "optgroup") {
                    //create ul
                    li = createElement("li", { className: css.optgroup });
                    var span = createElement("span", { className: css.optgroupTitle }, current.label);
                    li.appendChild(span);
                    var optChildren = current.children;
                    var optul = createElement("ul");
                    for (var j = 0; j < optChildren.length; j++) {
                        var opt_li = createChild(optChildren[j]);
                        optul.appendChild(opt_li);
                    };
                    li.appendChild(optul);
                } else {
                    li = createChild(current);
                };
                ul.appendChild(li);
            };
            oDiv.appendChild(ul);
            return oDiv;
        };
        var childHeight = function (val) {
            var childid = getPostID("postChildID");
            if (val) {
                if (val == -1) { //auto
                    $("#" + childid).css({ height: "auto", overflow: "auto" });
                } else {
                    $("#" + childid).css("height", val + "px");
                };
                return false;
            };
            //else return height
            var iHeight;
            var totalOptions = getElement(element).options.length;
            if (totalOptions > settings.visibleRows || settings.visibleRows) {
                var firstLI = $("#" + childid + " li:first");
                var margin = parseInt(firstLI.css("padding-bottom")) + parseInt(firstLI.css("padding-top"));
                if (settings.rowHeight === 0) {
                    $("#" + childid).css({ visibility: 'hidden', display: 'block' }); //hack for first child
                    settings.rowHeight = Math.ceil(firstLI.height());
                    $("#" + childid).css({ visibility: 'visible' });
                    if (!isList || settings.enableCheckbox === true) {
                        $("#" + childid).css({ display: 'none' });
                    };
                };
                iHeight = ((settings.rowHeight + margin) * Math.min(settings.visibleRows, totalOptions)) + 3;
            } else if (isList) {
                iHeight = $("#" + element).height(); //get height from original element
            };
            return iHeight;
        };
        var applyChildEvents = function () {
            var childid = getPostID("postChildID");
            $("#" + childid).on("click", function (e) {
                if (isDisabled === true) return false;
                //prevent body click
                e.preventDefault();
                e.stopPropagation();
                if (isList) {
                    bind_on_events();
                };
            });
            $("#" + childid + " li." + css.enabled).on("click", function (e) {
                if (e.target.nodeName.toLowerCase() !== "input") {
                    close(this);
                };
            });
            $("#" + childid + " li." + css.enabled).on("mousedown", function (e) {
                if (isDisabled === true) return false;
                oldSelected = $("#" + childid + " li." + css.selected);
                lastTarget = this;
                e.preventDefault();
                e.stopPropagation();
                //select current input
                if (settings.enableCheckbox === true) {
                    if (e.target.nodeName.toLowerCase() === "input") {
                        controlHolded = true;
                    };
                };
                if (isList === true) {
                    if (isMultiple) {
                        if (shiftHolded === true) {
                            $(this).addClass(css.selected);
                            var selected = $("#" + childid + " li." + css.selected);
                            var lastIndex = getIndex(this);
                            if (selected.length > 1) {
                                var items = $("#" + childid + " li." + css_i.li);
                                var ind1 = getIndex(selected[0]);
                                var ind2 = getIndex(selected[1]);
                                if (lastIndex > ind2) {
                                    ind1 = (lastIndex);
                                    ind2 = ind2 + 1;
                                };
                                for (var i = Math.min(ind1, ind2); i <= Math.max(ind1, ind2); i++) {
                                    var current = items[i];
                                    if ($(current).hasClass(css.enabled)) {
                                        $(current).addClass(css.selected);
                                    };
                                };
                            };
                        } else if (controlHolded === true) {
                            $(this).toggleClass(css.selected); //toggle
                            if (settings.enableCheckbox === true) {
                                var checkbox = this.childNodes[0];
                                checkbox.checked = !checkbox.checked; //toggle
                            };
                        } else {
                            $("#" + childid + " li." + css.selected).removeClass(css.selected);
                            $("#" + childid + " input:checkbox").prop("checked", false);
                            $(this).addClass(css.selected);
                            if (settings.enableCheckbox === true) {
                                this.childNodes[0].checked = true;
                            };
                        };
                    } else {
                        $("#" + childid + " li." + css.selected).removeClass(css.selected);
                        $(this).addClass(css.selected);
                    };
                    //fire event on mouseup
                } else {
                    $("#" + childid + " li." + css.selected).removeClass(css.selected);
                    $(this).addClass(css.selected);
                };
            });
            $("#" + childid + " li." + css.enabled).on("mouseenter", function (e) {
                if (isDisabled === true) return false;
                e.preventDefault();
                e.stopPropagation();
                if (lastTarget != null) {
                    if (isMultiple) {
                        $(this).addClass(css.selected);
                        if (settings.enableCheckbox === true) {
                            this.childNodes[0].checked = true;
                        };
                    };
                };
            });

            $("#" + childid + " li." + css.enabled).on("mouseover", function (e) {
                if (isDisabled === true) return false;
                $(this).addClass(css.hover);
            });
            $("#" + childid + " li." + css.enabled).on("mouseout", function (e) {
                if (isDisabled === true) return false;
                $("#" + childid + " li." + css.hover).removeClass(css.hover);
            });

            $("#" + childid + " li." + css.enabled).on("mouseup", function (e) {
                if (isDisabled === true) return false;
                e.preventDefault();
                e.stopPropagation();
                if (settings.enableCheckbox === true) {
                    controlHolded = false;
                };
                var selected = $("#" + childid + " li." + css.selected).length;
                forcedTrigger = (oldSelected.length != selected || selected == 0) ? true : false;
                fireAfterItemClicked();
                unbind_on_events(); //remove old one
                bind_on_events();
                lastTarget = null;
            });

            /* options events */
            if (settings.disabledOptionEvents == false) {
                $("#" + childid + " li." + css_i.li).on("click", function (e) {
                    if (isDisabled === true) return false;
                    fireOptionEventIfExist(this, "click");
                });
                $("#" + childid + " li." + css_i.li).on("mouseenter", function (e) {
                    if (isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseenter");
                });
                $("#" + childid + " li." + css_i.li).on("mouseover", function (e) {
                    if (isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseover");
                });
                $("#" + childid + " li." + css_i.li).on("mouseout", function (e) {
                    if (isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseout");
                });
                $("#" + childid + " li." + css_i.li).on("mousedown", function (e) {
                    if (isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mousedown");
                });
                $("#" + childid + " li." + css_i.li).on("mouseup", function (e) {
                    if (isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseup");
                });
            };
        };
        var removeChildEvents = function () {
            var childid = getPostID("postChildID");
            $("#" + childid).off("click");
            $("#" + childid + " li." + css.enabled).off("mouseenter");
            $("#" + childid + " li." + css.enabled).off("click");
            $("#" + childid + " li." + css.enabled).off("mouseover");
            $("#" + childid + " li." + css.enabled).off("mouseout");
            $("#" + childid + " li." + css.enabled).off("mousedown");
            $("#" + childid + " li." + css.enabled).off("mouseup");
        };
        var triggerBypassingHandler = function (id, evt_n, handler) {
            $("#" + id).off(evt_n, handler);
            $("#" + id).trigger(evt_n);
            $("#" + id).on(evt_n, handler);
        };
        var applyEvents = function () {
            var id = getPostID("postID");
            var tid = getPostID("postTitleTextID");
            var childid = getPostID("postChildID");
            $("#" + id).on(settings.event, function (e) {
                if (isDisabled === true) return false;
                fireEventIfExist(settings.event);
                //prevent body click
                e.preventDefault();
                e.stopPropagation();
                open(e);
            });
            $("#" + id).on("keydown", function (e) {
                var k = e.which;
                if (!isOpen && (k == ENTER || k == UP_ARROW || k == DOWN_ARROW ||
				k == LEFT_ARROW || k == RIGHT_ARROW ||
				(k >= ALPHABETS_START && !isList))) {
                    open(e);
                    if (k >= ALPHABETS_START) {
                        showFilterBox();
                    } else {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    };
                };
            });
            $("#" + id).on("focus", wrapperFocusHandler);
            $("#" + id).on("blur", wrapperBlurHandler);
            $("#" + tid).on("blur", function (e) {
                //return focus to the wrapper without triggering the handler
                triggerBypassingHandler(id, "focus", wrapperFocusHandler);
            });
            applyChildEvents();
            $("#" + id).on("dblclick", on_dblclick);
            $("#" + id).on("mousemove", on_mousemove);
            $("#" + id).on("mouseenter", on_mouseover);
            $("#" + id).on("mouseleave", on_mouseout);
            $("#" + id).on("mousedown", on_mousedown);
            $("#" + id).on("mouseup", on_mouseup);
        };
        var wrapperFocusHandler = function (e) {
            fireEventIfExist("focus");
        };
        var wrapperBlurHandler = function (e) {
            fireEventIfExist("blur");
        };
        //after create
        var fixedForList = function () {
            var id = getPostID("postID");
            var childid = getPostID("postChildID");
            if (isList === true && settings.enableCheckbox === false) {
                $("#" + id + " ." + css.ddTitle).hide();
                $("#" + childid).css({ display: 'block', position: 'relative' });
                //open();
            } else {
                if (settings.enableCheckbox === false) {
                    isMultiple = false; //set multiple off if this is not a list
                };
                $("#" + id + " ." + css.ddTitle).show();
                $("#" + childid).css({ display: 'none', position: 'absolute' });
                //set value
                var first = $("#" + childid + " li." + css.selected)[0];
                $("#" + childid + " li." + css.selected).removeClass(css.selected);
                var index = getIndex($(first).addClass(css.selected));
                setValue(index);
            };
            childHeight(childHeight()); //get and set height 
        };
        var fixedForDisabled = function () {
            var id = getPostID("postID");
            var opc = (isDisabled == true) ? settings.disabledOpacity : 1;
            if (isDisabled === true) {
                $("#" + id).addClass(css.disabledAll);
            } else {
                $("#" + id).removeClass(css.disabledAll);
            };
        };
        var fixedSomeUI = function () {
            //auto filter
            var tid = getPostID("postTitleTextID");
            if (settings.enableAutoFilter == "true") {
                $("#" + tid).on("keyup", applyFilters);
            };
            //if is list
            fixedForList();
            fixedForDisabled();
        };
        var createLayout = function () {
            var oDiv = createWrapper();
            var oTitle = createTitle();
            oDiv.appendChild(oTitle);
            //auto filter box
            var oFilterBox = createFilterBox();
            oDiv.appendChild(oFilterBox);

            var oChildren = createChildren();
            oDiv.appendChild(oChildren);
            $("#" + element).after(oDiv);
            hideOriginal(); //hideOriginal
            fixedSomeUI();
            applyEvents();

            var childid = getPostID("postChildID");
            //append
            if (settings.append != '') {
                $("#" + childid).append(settings.append);
            };
            //prepend
            if (settings.prepend != '') {
                $("#" + childid).prepend(settings.prepend);
            };
            if (typeof settings.on.create == "function") {
                settings.on.create.apply($this, arguments);
            };
        };
        var selectUI_LI = function (indexes) {
            var childid = getPostID("postChildID");
            $("#" + childid + " li." + css_i.li).removeClass(css.selected);
            if (settings.enableCheckbox === true) {
                $("#" + childid + " li." + css_i.li + " input.checkbox").prop("checked", false);
            };
            if (isArray(indexes) === true) {
                for (var i = 0; i < indexes.length; i++) {
                    updateNow(indexes[i]);
                };
            } else {
                updateNow(indexes);
            };
            function updateNow(index) {
                $($("#" + childid + " li." + css_i.li)[index]).addClass(css.selected);
                if (settings.enableCheckbox === true) {
                    $($("#" + childid + " li." + css_i.li)[index]).find("input.checkbox").prop("checked", "checked");
                };

            };
        };
        var selectMutipleOptions = function (bySelected, useIndexes) {
            var childid = getPostID("postChildID");
            var selected = bySelected || $("#" + childid + " li." + css.selected); //bySelected or by argument
            for (var i = 0; i < selected.length; i++) {
                var ind = (useIndexes === true) ? selected[i] : getIndex(selected[i]);
                getElement(element).options[ind].selected = "selected";
            };
            setValue(selected);
        };
        var fireAfterItemClicked = function () {
            var childid = getPostID("postChildID");
            var selected = $("#" + childid + " li." + css.selected);
            if (isMultiple && (shiftHolded || controlHolded) || forcedTrigger) {
                getElement(element).selectedIndex = -1; //reset old
            };
            var index;
            if (selected.length == 0) {
                index = -1;
            } else if (selected.length > 1) {
                //selected multiple
                selectMutipleOptions(selected);
            } else {
                //if one selected
                index = getIndex($("#" + childid + " li." + css.selected));
            };
            if ((getElement(element).selectedIndex != index || forcedTrigger) && selected.length <= 1) {
                forcedTrigger = false;
                var evt = has_handler("change");
                getElement(element).selectedIndex = index;
                setValue(index);
                //local
                if (typeof settings.on.change == "function") {
                    var d = getDataAndUI();
                    settings.on.change(d.data, d.ui);
                };
                $("#" + element).trigger("change");
            };
        };
        var setValue = function (index, byvalue) {
            if (index !== undefined) {
                var selectedIndex, value, selectedText;
                if (index == -1) {
                    selectedIndex = -1;
                    value = "";
                    selectedText = "";
                    updateTitleUI(-1);
                } else {
                    //by index or byvalue
                    if (typeof index != "object") {
                        var opt = getElement(element).options[index];
                        getElement(element).selectedIndex = index;
                        selectedIndex = index;
                        value = parseOption(opt);
                        selectedText = (index >= 0) ? getElement(element).options[index].text : "";
                        updateTitleUI(undefined, value);
                        value = value.value; //for bottom
                    } else {
                        //this is multiple or by option
                        selectedIndex = (byvalue && byvalue.index) || getElement(element).selectedIndex;
                        value = (byvalue && byvalue.value) || getElement(element).value;
                        selectedText = (byvalue && byvalue.text) || getElement(element).options[getElement(element).selectedIndex].text || "";
                        updateTitleUI(selectedIndex);
                        //check if this is multiple checkbox					
                    };
                };
                updateProp("selectedIndex", selectedIndex);
                updateProp("value", value);
                updateProp("selectedText", selectedText);
                updateProp("children", getElement(element).children);
                updateProp("uiData", getDataAndUI());
                updateProp("selectedOptions", $("#" + element + " option:selected"));
            };
        };
        var has_handler = function (name) {
            //True if a handler has been added in the html.
            var evt = { byElement: false, byJQuery: false, hasEvent: false };
            var obj = $("#" + element);
            try {
                if (obj.prop("on" + name) !== null) {
                    evt.hasEvent = true;
                    evt.byElement = true;
                };
            } catch (e) {
            }
            // True if a handler has been added using jQuery.
            var evs;
            if (typeof $._data == "function") { //1.8
                evs = $._data(obj[0], "events");
            } else {
                evs = obj.data("events");
            };
            if (evs && evs[name]) {
                evt.hasEvent = true;
                evt.byJQuery = true;
            };
            return evt;
        };
        var bind_on_events = function () {
            unbind_on_events();
            $("body").on("click", close);
            //bind more events		 
            $(document).on("keydown", on_keydown);
            $(document).on("keyup", on_keyup);
            //focus will work on this	 		 
        };
        var unbind_on_events = function () {
            $("body").off("click", close);
            //bind more events
            $(document).off("keydown", on_keydown);
            $(document).off("keyup", on_keyup);
        };
        var applyFilters = function (e) {
            if (e.keyCode < ALPHABETS_START && e.keyCode != BACKSPACE && e.keyCode != DELETE) {
                return false;
            };
            var childid = getPostID("postChildID");
            var tid = getPostID("postTitleTextID");
            var sText = getElement(tid).value;
            if (sText.length == 0) {
                $("#" + childid + " li:hidden").show(); //show if hidden
                childHeight(childHeight());
            } else {
                $("#" + childid + " li").hide();
                var items = $("#" + childid + " li:Contains('" + sText + "')").show();
                if ($("#" + childid + " li:visible").length <= settings.visibleRows) {
                    childHeight(-1); //set autoheight
                };
                if (items.length > 0 && !isList || !isMultiple) {
                    $("#" + childid + " ." + css.selected).removeClass(css.selected);
                    $(items[0]).addClass(css.selected);
                };
            };
            if (!isList) {
                adjustOpen();
            };
        };
        var showFilterBox = function () {
            if (settings.enableAutoFilter == "true") {
                var id = getPostID("postID");
                var tid = getPostID("postTitleTextID");
                if ($("#" + tid + ":hidden").length > 0 && controlHolded == false) {
                    $("#" + tid + ":hidden").show().val("");
                    //blur the wrapper without triggering the handler
                    triggerBypassingHandler(id, "blur", wrapperBlurHandler);
                    getElement(tid).focus();
                };
            };
        };
        var hideFilterBox = function () {
            var tid = getPostID("postTitleTextID");
            if ($("#" + tid + ":visible").length > 0) {
                $("#" + tid + ":visible").hide();
                getElement(tid).blur();
            };
        };
        var on_keydown = function (evt) {
            var tid = getPostID("postTitleTextID");
            var childid = getPostID("postChildID");
            switch (evt.keyCode) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    //hideFilterBox();
                    next();
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    //hideFilterBox();
                    previous();
                    break;
                case ESCAPE:
                case ENTER:
                    evt.preventDefault();
                    evt.stopPropagation();
                    close();
                    var selected = $("#" + childid + " li." + css.selected).length;
                    forcedTrigger = (oldSelected.length != selected || selected == 0) ? true : false;
                    fireAfterItemClicked();
                    unbind_on_events(); //remove old one				
                    lastTarget = null;
                    break;
                case SHIFT:
                    shiftHolded = true;
                    break;
                case CONTROL:
                    controlHolded = true;
                    break;
                default:
                    if (evt.keyCode >= ALPHABETS_START && isList === false) {
                        showFilterBox();
                    };
                    break;
            };
            if (isDisabled === true) return false;
            fireEventIfExist("keydown");
        };
        var on_keyup = function (evt) {
            switch (evt.keyCode) {
                case SHIFT:
                    shiftHolded = false;
                    break;
                case CONTROL:
                    controlHolded = false;
                    break;
            };
            if (isDisabled === true) return false;
            fireEventIfExist("keyup");
        };
        var on_dblclick = function (evt) {
            if (isDisabled === true) return false;
            fireEventIfExist("dblclick");
        };
        var on_mousemove = function (evt) {
            if (isDisabled === true) return false;
            fireEventIfExist("mousemove");
        };

        var on_mouseover = function (evt) {
            if (isDisabled === true) return false;
            evt.preventDefault();
            fireEventIfExist("mouseover");
        };
        var on_mouseout = function (evt) {
            if (isDisabled === true) return false;
            evt.preventDefault();
            fireEventIfExist("mouseout");
        };
        var on_mousedown = function (evt) {
            if (isDisabled === true) return false;
            fireEventIfExist("mousedown");
        };
        var on_mouseup = function (evt) {
            if (isDisabled === true) return false;
            fireEventIfExist("mouseup");
        };
        var option_has_handler = function (opt, name) {
            //True if a handler has been added in the html.
            var evt = { byElement: false, byJQuery: false, hasEvent: false };
            if ($(opt).prop("on" + name) != undefined) {
                evt.hasEvent = true;
                evt.byElement = true;
            };
            // True if a handler has been added using jQuery.
            var evs = $(opt).data("events");
            if (evs && evs[name]) {
                evt.hasEvent = true;
                evt.byJQuery = true;
            };
            return evt;
        };
        var fireOptionEventIfExist = function (li, evt_n) {
            if (settings.disabledOptionEvents == false) {
                var opt = getElement(element).options[getIndex(li)];
                //check if original has some
                if (option_has_handler(opt, evt_n).hasEvent === true) {
                    if (option_has_handler(opt, evt_n).byElement === true) {
                        opt["on" + evt_n]();
                    };
                    if (option_has_handler(opt, evt_n).byJQuery === true) {
                        switch (evt_n) {
                            case "keydown":
                            case "keyup":
                                //key down/up will check later
                                break;
                            default:
                                $(opt).trigger(evt_n);
                                break;
                        };
                    };
                    return false;
                };
            };
        };
        var fireEventIfExist = function (evt_n) {
            //local
            if (typeof settings.on[evt_n] == "function") {
                settings.on[evt_n].apply(this, arguments);
            };
            //check if original has some
            if (has_handler(evt_n).hasEvent === true) {
                if (has_handler(evt_n).byElement === true) {
                    getElement(element)["on" + evt_n]();
                } else if (has_handler(evt_n).byJQuery === true) {
                    switch (evt_n) {
                        case "keydown":
                        case "keyup":
                            //key down/up will check later
                            break;
                        default:
                            $("#" + element).triggerHandler(evt_n);
                            break;
                    };
                };
                return false;
            };
        };
        /******************************* navigation **********************************************/
        var scrollToIfNeeded = function (opt) {
            var childid = getPostID("postChildID");
            //if scroll is needed
            opt = (opt !== undefined) ? opt : $("#" + childid + " li." + css.selected);
            if (opt.length > 0) {
                var pos = parseInt(($(opt).position().top));
                var ch = parseInt($("#" + childid).height());
                if (pos > ch) {
                    var top = pos + $("#" + childid).scrollTop() - (ch / 2);
                    $("#" + childid).animate({ scrollTop: top }, 500);
                };
            };
        };
        var next = function () {
            var childid = getPostID("postChildID");
            var items = $("#" + childid + " li:visible." + css_i.li);
            var selected = $("#" + childid + " li:visible." + css.selected);
            selected = (selected.length == 0) ? items[0] : selected;
            var index = $("#" + childid + " li:visible." + css_i.li).index(selected);
            if ((index < items.length - 1)) {
                index = getNext(index);
                if (index < items.length) { //check again - hack for last disabled 
                    if (!shiftHolded || !isList || !isMultiple) {
                        $("#" + childid + " ." + css.selected).removeClass(css.selected);
                    };
                    $(items[index]).addClass(css.selected);
                    updateTitleUI(index);
                    if (isList == true) {
                        fireAfterItemClicked();
                    };
                    scrollToIfNeeded($(items[index]));
                };
                if (!isList) {
                    adjustOpen();
                };
            };
            function getNext(ind) {
                ind = ind + 1;
                if (ind > items.length) {
                    return ind;
                };
                if ($(items[ind]).hasClass(css.enabled) === true) {
                    return ind;
                };
                return ind = getNext(ind);
            };
        };
        var previous = function () {
            var childid = getPostID("postChildID");
            var selected = $("#" + childid + " li:visible." + css.selected);
            var items = $("#" + childid + " li:visible." + css_i.li);
            var index = $("#" + childid + " li:visible." + css_i.li).index(selected[0]);
            if (index >= 0) {
                index = getPrev(index);
                if (index >= 0) { //check again - hack for disabled 
                    if (!shiftHolded || !isList || !isMultiple) {
                        $("#" + childid + " ." + css.selected).removeClass(css.selected);
                    };
                    $(items[index]).addClass(css.selected);
                    updateTitleUI(index);
                    if (isList == true) {
                        fireAfterItemClicked();
                    };
                    if (parseInt(($(items[index]).position().top + $(items[index]).height())) <= 0) {
                        var top = ($("#" + childid).scrollTop() - $("#" + childid).height()) - $(items[index]).height();
                        $("#" + childid).animate({ scrollTop: top }, 500);
                    };
                };
                if (!isList) {
                    adjustOpen();
                };
            };

            function getPrev(ind) {
                ind = ind - 1;
                if (ind < 0) {
                    return ind;
                };
                if ($(items[ind]).hasClass(css.enabled) === true) {
                    return ind;
                };
                return ind = getPrev(ind);
            };
        };
        var adjustOpen = function () {
            var id = getPostID("postID");
            var childid = getPostID("postChildID");
            var pos = $("#" + id).offset();
            var mH = $("#" + id).height();
            var wH = $(window).height();
            var st = $(window).scrollTop();
            var cH = $("#" + childid).height();
            var top = $("#" + id).height(); //this close so its title height
            var direction = settings.openDirection.toLowerCase();
            if (((wH + st) < Math.floor(cH + mH + pos.top) || direction == 'alwaysup') && direction != 'alwaysdown') {
                top = cH;
                $("#" + childid).css({ top: "-" + top + "px", display: 'block', zIndex: settings.zIndex });
                if (settings.roundedCorner == "true") {
                    $("#" + id).removeClass("borderRadius borderRadiusTp").addClass("borderRadiusBtm");
                };
                var top = $("#" + childid).offset().top;
                if (top < -10) {
                    $("#" + childid).css({ top: (parseInt($("#" + childid).css("top")) - top + 20 + st) + "px", zIndex: settings.zIndex });
                    if (settings.roundedCorner == "true") {
                        $("#" + id).removeClass("borderRadiusBtm borderRadiusTp").addClass("borderRadius");
                    };
                };
            } else {
                $("#" + childid).css({ top: top + "px", zIndex: settings.zIndex });
                if (settings.roundedCorner == "true") {
                    $("#" + id).removeClass("borderRadius borderRadiusBtm").addClass("borderRadiusTp");
                };
            };
            //hack for ie zindex
            //i hate ie :D
            if (isIE) {
                if (msieversion() <= 7) {
                    $('div.ddcommon').css("zIndex", settings.zIndex - 10);
                    $("#" + id).css("zIndex", settings.zIndex + 5);
                };
            };
        };
        var open = function (e) {
            if (isDisabled === true) return false;
            var id = getPostID("postID");
            var childid = getPostID("postChildID");
            if (!isOpen) {
                isOpen = true;
                if (msBeautify.oldDiv != '') {
                    $("#" + msBeautify.oldDiv).css({ display: "none" }); //hide all 
                };
                msBeautify.oldDiv = childid;
                $("#" + childid + " li:hidden").show(); //show if hidden
                adjustOpen();
                var animStyle = settings.animStyle;
                if (animStyle == "" || animStyle == "none") {
                    $("#" + childid).css({ display: "block" });
                    scrollToIfNeeded();
                    if (typeof settings.on.open == "function") {
                        var d = getDataAndUI();
                        settings.on.open(d.data, d.ui);
                    };
                } else {
                    $("#" + childid)[animStyle]("fast", function () {
                        scrollToIfNeeded();
                        if (typeof settings.on.open == "function") {
                            var d = getDataAndUI();
                            settings.on.open(d.data, d.ui);
                        };
                    });
                };
                bind_on_events();
            } else {
                if (settings.event !== 'mouseover') {
                    close();
                };
            };
        };
        var close = function (e) {
            isOpen = false;
            var id = getPostID("postID");
            var childid = getPostID("postChildID");
            if (isList === false || settings.enableCheckbox === true) {
                $("#" + childid).css({ display: "none" });
                if (settings.roundedCorner == "true") {
                    $("#" + id).removeClass("borderRadiusTp borderRadiusBtm").addClass("borderRadius");
                };
            };
            unbind_on_events();
            if (typeof settings.on.close == "function") {
                var d = getDataAndUI();
                settings.on.close(d.data, d.ui);
            };
            //rest some old stuff
            hideFilterBox();
            childHeight(childHeight()); //its needed after filter applied
            $("#" + childid).css({ zIndex: 1 });
            //update the title in case the user clicked outside
            updateTitleUI(getElement(element).selectedIndex);
        };
        /*********************** </layout> *************************************/
        var mergeAllProp = function () {
            try {
                orginial = $.extend(true, {}, getElement(element));
                for (var i in orginial) {
                    if (typeof orginial[i] != "function") {
                        $this[i] = orginial[i]; //properties
                    };
                };
            } catch (e) {
                //silent
            };
            $this.selectedText = (getElement(element).selectedIndex >= 0) ? getElement(element).options[getElement(element).selectedIndex].text : "";
            $this.version = msBeautify.version.msDropdown;
            $this.author = msBeautify.author;
        };
        var getDataAndUIByOption = function (opt) {
            if (opt != null && typeof opt != "undefined") {
                var childid = getPostID("postChildID");
                var data = parseOption(opt);
                var ui = $("#" + childid + " li." + css_i.li + ":eq(" + (opt.index) + ")");
                return { data: data, ui: ui, option: opt, index: opt.index };
            };
            return null;
        };
        var getDataAndUI = function () {
            var childid = getPostID("postChildID");
            var ele = getElement(element);
            var data, ui, option, index;
            if (ele.selectedIndex == -1) {
                data = null;
                ui = null;
                option = null;
                index = -1;
            } else {
                ui = $("#" + childid + " li." + css.selected);
                if (ui.length > 1) {
                    var d = [], op = [], ind = [];
                    for (var i = 0; i < ui.length; i++) {
                        var pd = getIndex(ui[i]);
                        d.push(pd);
                        op.push(ele.options[pd]);
                    };
                    data = d;
                    option = op;
                    index = d;
                } else {
                    option = ele.options[ele.selectedIndex];
                    data = parseOption(option);
                    index = ele.selectedIndex;
                };
            };
            return { data: data, ui: ui, index: index, option: option };
        };
        var updateTitleUI = function (index, byvalue) {
            var titleid = getPostID("postTitleID");
            var value = {};
            if (index == -1) {
                value.text = "&nbsp;";
                value.className = "";
                value.description = "";
                value.image = "";
            } else if (typeof index != "undefined") {
                var opt = getElement(element).options[index];
                value = parseOption(opt);
            } else {
                value = byvalue;
            };
            //update title and current
            $("#" + titleid).find("." + css.label).html(value.text);
            getElement(titleid).className = css.ddTitleText + " " + value.className;
            //update desction
            if (value.description != "") {
                $("#" + titleid).find("." + css.description).html(value.description).show();
            } else {
                $("#" + titleid).find("." + css.description).html("").hide();
            };
            //update icon
            var img = $("#" + titleid).find("img");
            if (img.length > 0) {
                $(img).remove();
            };
            if (value.image != "" && settings.showIcon) {
                img = createElement("img", { src: value.image });
                $("#" + titleid).prepend(img);
                if (value.imagecss != "") {
                    img.className = value.imagecss + " ";
                };
                if (value.description == "") {
                    img.className = img.className + css_i.fnone;
                };
            };
        };
        var updateProp = function (p, v) {
            $this[p] = v;
        };
        var updateUI = function (a, opt, i) { //action, index, opt
            var childid = getPostID("postChildID");
            var wasSelected = false;
            switch (a) {
                case "add":
                    var li = createChild(opt || getElement(element).options[i]);
                    var index;
                    if (arguments.length == 3) {
                        index = i;
                    } else {
                        index = $("#" + childid + " li." + css_i.li).length - 1;
                    };
                    if (index < 0 || !index) {
                        $("#" + childid + " ul").append(li);
                    } else {
                        var at = $("#" + childid + " li." + css_i.li)[index];
                        $(at).before(li);
                    };
                    removeChildEvents();
                    applyChildEvents();
                    if (settings.on.add != null) {
                        settings.on.add.apply(this, arguments);
                    };
                    break;
                case "remove":
                    wasSelected = $($("#" + childid + " li." + css_i.li)[i]).hasClass(css.selected);
                    $("#" + childid + " li." + css_i.li + ":eq(" + i + ")").remove();
                    var items = $("#" + childid + " li." + css.enabled);
                    if (wasSelected == true) {
                        if (items.length > 0) {
                            $(items[0]).addClass(css.selected);
                            var ind = $("#" + childid + " li." + css_i.li).index(items[0]);
                            setValue(ind);
                        };
                    };
                    if (items.length == 0) {
                        setValue(-1);
                    };
                    if ($("#" + childid + " li." + css_i.li).length < settings.visibleRows && !isList) {
                        childHeight(-1); //set autoheight
                    };
                    if (settings.on.remove != null) {
                        settings.on.remove.apply(this, arguments);
                    };
                    break;
            };
        };
        /************************** public methods/events **********************/
        this.act = function () {
            var action = arguments[0];
            Array.prototype.shift.call(arguments);
            switch (action) {
                case "add":
                    $this.add.apply(this, arguments);
                    break;
                case "remove":
                    $this.remove.apply(this, arguments);
                    break;
                default:
                    try {
                        getElement(element)[action].apply(getElement(element), arguments);
                    } catch (e) {
                        //there is some error.
                    };
                    break;
            };
        };

        this.add = function () {
            var text, value, title, image, description;
            var obj = arguments[0];
            if (typeof obj == "string") {
                text = obj;
                value = text;
                opt = new Option(text, value);
            } else {
                text = obj.text || '';
                value = obj.value || text;
                title = obj.title || '';
                image = obj.image || '';
                description = obj.description || '';
                //image:imagePath, title:title, description:description, value:opt.value, text:opt.text, className:opt.className||""
                opt = new Option(text, value);
                $(opt).data("description", description);
                $(opt).data("image", image);
                $(opt).data("title", title);
            };
            arguments[0] = opt; //this option
            getElement(element).add.apply(getElement(element), arguments);
            updateProp("children", getElement(element)["children"]);
            updateProp("length", getElement(element).length);
            updateUI("add", opt, arguments[1]);
        };
        this.remove = function (i) {
            getElement(element).remove(i);
            updateProp("children", getElement(element)["children"]);
            updateProp("length", getElement(element).length);
            updateUI("remove", undefined, i);
        };
        this.set = function (prop, val) {
            if (typeof prop == "undefined" || typeof val == "undefined") return false;
            prop = prop.toString();
            try {
                updateProp(prop, val);
            } catch (e) { /*this is ready only */ };
            switch (prop) {
                case "size":
                    getElement(element)[prop] = val;
                    if (val == 0) {
                        getElement(element).multiple = false; //if size is zero multiple should be false
                    };
                    isList = (getElement(element).size > 1 || getElement(element).multiple == true) ? true : false;
                    fixedForList();
                    break;
                case "multiple":
                    getElement(element)[prop] = val;
                    isList = (getElement(element).size > 1 || getElement(element).multiple == true) ? true : false;
                    isMultiple = getElement(element).multiple;
                    fixedForList();
                    updateProp(prop, val);
                    break;
                case "disabled":
                    getElement(element)[prop] = val;
                    isDisabled = val;
                    fixedForDisabled();
                    break;
                case "selectedIndex":
                case "value":
                    if (prop == "selectedIndex" && isArray(val) === true) {
                        $("#" + element + " option").prop("selected", false);
                        selectMutipleOptions(val, true);
                        selectUI_LI(val); //setValue is being called from selectMutipleOptions
                    } else {
                        getElement(element)[prop] = val;
                        selectUI_LI(getElement(element).selectedIndex);
                        setValue(getElement(element).selectedIndex);
                    };
                    break;
                case "length":
                    var childid = getPostID("postChildID");
                    if (val < getElement(element).length) {
                        getElement(element)[prop] = val;
                        if (val == 0) {
                            $("#" + childid + " li." + css_i.li).remove();
                            setValue(-1);
                        } else {
                            $("#" + childid + " li." + css_i.li + ":gt(" + (val - 1) + ")").remove();
                            if ($("#" + childid + " li." + css.selected).length == 0) {
                                $("#" + childid + " li." + css.enabled + ":eq(0)").addClass(css.selected);
                            };
                        };
                        updateProp(prop, val);
                        updateProp("children", getElement(element)["children"]);
                    };
                    break;
                case "id":
                    //please i need this. so preventing to change it. will work on this later
                    break;
                default:
                    //check if this is not a readonly properties
                    try {
                        getElement(element)[prop] = val;
                        updateProp(prop, val);
                    } catch (e) {
                        //silent
                    };
                    break;
            };
        };
        this.get = function (prop) {
            return $this[prop] || getElement(element)[prop]; //return if local else from original
        };
        this.visible = function (val) {
            var id = getPostID("postID");
            if (val === true) {
                $("#" + id).show();
            } else if (val === false) {
                $("#" + id).hide();
            } else {
                return ($("#" + id).css("display") == "none") ? false : true;
            };
        };
        this.debug = function (v) {
            msBeautify.debug(v);
        };
        this.close = function () {
            close();
        };
        this.open = function () {
            open();
        };
        this.showRows = function (r) {
            if (typeof r == "undefined" || r == 0) {
                return false;
            };
            settings.visibleRows = r;
            childHeight(childHeight());
        };
        this.visibleRows = this.showRows;
        this.on = function (type, fn) {
            $("#" + element).on(type, fn);
        };
        this.off = function (type, fn) {
            $("#" + element).off(type, fn);
        };
        this.addMyEvent = this.on;
        this.getData = function () {
            return getDataAndUI()
        };
        this.namedItem = function () {
            var opt = getElement(element).namedItem.apply(getElement(element), arguments);
            return getDataAndUIByOption(opt);
        };
        this.item = function () {
            var opt = getElement(element).item.apply(getElement(element), arguments);
            return getDataAndUIByOption(opt);
        };
        //v 3.2
        this.setIndexByValue = function (val) {
            this.set("value", val);
        };
        this.destroy = function () {
            var hidid = getPostID("postElementHolder");
            var id = getPostID("postID");
            $("#" + id + ", #" + id + " *").off();
            getElement(element).tabIndex = getElement(id).tabIndex;
            $("#" + id).remove();
            $("#" + element).parent().replaceWith($("#" + element));
            $("#" + element).data("dd", null);
        };
        this.refresh = function () {
            setValue(getElement(element).selectedIndex);
        };
        //Create msDropDown	
        init();
    };
    //bind in jquery
    $.fn.extend({
        msDropDown: function (settings) {
            return this.each(function () {
                if (!$(this).data('dd')) {
                    var mydropdown = new dd(this, settings);
                    $(this).data('dd', mydropdown);
                };
            });
        }
    });
    $.fn.msDropdown = $.fn.msDropDown; //make a copy
})(jQuery);

/*!
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function ($) {
    var $window = $(window);
    var windowHeight = $window.height();

    $window.resize(function () {
        windowHeight = $window.height();
    });

    $.fn.parallax = function (xpos, speedFactor, outerHeight, offsetY, offsetBgY) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;
        var offY = 0;
        var offBgY = 0;

        //get the starting position of each element to have parallax applied to it		
        $this.each(function () {
            firstTop = elementPos(this).y;
        });

        if (outerHeight) {
            getHeight = function (jqo) {
                return jqo.outerHeight(true);
            };
        } else {
            getHeight = function (jqo) {
                return jqo.height();
            };
        }
        if (offsetY) { offY = offsetY; }
        if (offsetBgY) { offBgY = offsetBgY; }

        // setup defaults if arguments aren't specified
        if (arguments.length < 1 || xpos === null) xpos = "50%";
        if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
        if (arguments.length < 3 || outerHeight === null) outerHeight = true;

        // function to be called whenever the window is scrolled or resized
        function update() {
            var pos = $window.scrollTop() + offY;

            $this.each(function () {
                var $element = $(this);
                var top = elementPos(this).y;
                var height = getHeight($element);

                // Check if totally above or totally below viewport
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }
                if (top < windowHeight) {
                    $this.css('backgroundPosition', xpos + " " + Math.round((0 - (pos + offBgY)) * speedFactor) + "px");
                } else {
                    $this.css('backgroundPosition', xpos + " " + Math.round((top - windowHeight - (pos + offBgY) + offY) * speedFactor) + "px");
                }
            });
        }

        $window.bind('scroll', update).resize(update);
        update();
    };
})(jQuery);

/*!
 * jQuery Nearest plugin v1.3.0
 *
 * Finds elements closest to a single point based on screen location and pixel dimensions
 * http://gilmoreorless.github.io/jquery-nearest/
 * Open source under the MIT licence: http://gilmoreorless.mit-license.org/2011/
 *
 * Requires jQuery 1.4 or above
 * Also supports Ben Alman's "each2" plugin for faster looping (if available)
 */
!function (t, e) { function n(e, n, h) { e || (e = "div"); var a, i, o, s = t(n.container), c = s.offset() || { left: 0, top: 0 }, f = [s.width() || 0, s.height() || 0], u = { x: [c.left, c.left + f[0]], y: [c.top, c.top + f[1]], w: [0, f[0]], h: [0, f[1]] }; for (a in u) u.hasOwnProperty(a) && (o = r.exec(n[a]), o && (i = u[a], n[a] = (i[1] - i[0]) * o[1] / 100 + i[0])); n.sameX === !1 && n.checkHoriz === !1 && (n.sameX = !n.checkHoriz), n.sameY === !1 && n.checkVert === !1 && (n.sameY = !n.checkVert); var l = s.find(e), d = [], p = !!n.furthest, m = !n.sameX, y = !n.sameY, v = !!n.onlyX, x = !!n.onlyY, g = p ? 0 : 1 / 0, k = parseFloat(n.x) || 0, w = parseFloat(n.y) || 0, X = parseFloat(k + n.w) || k, Y = parseFloat(w + n.h) || w, F = parseFloat(n.tolerance) || 0, S = !!t.fn.each2, H = Math.min, M = Math.max; !n.includeSelf && h && (l = l.not(h)), 0 > F && (F = 0), l[S ? "each2" : "each"](function (e, n) { var r, h, a, i, o = S ? n : t(this), s = o.offset(), c = s.left, f = s.top, u = o.outerWidth(), l = o.outerHeight(), j = c + u, z = f + l, O = M(c, k), P = H(j, X), V = M(f, w), W = H(z, Y), b = P >= O, q = W >= V; (m && y || !m && !y && b && q || m && q || y && b || m && v || y && x) && (r = b ? 0 : O - P, h = q ? 0 : V - W, a = v || x ? v ? r : h : b || q ? M(r, h) : Math.sqrt(r * r + h * h), i = p ? a >= g - F : g + F >= a, i && (g = p ? M(g, a) : H(g, a), d.push({ node: this, dist: a }))) }); var j, z, O, P, V = d.length, W = []; if (V) for (p ? (j = g - F, z = g) : (j = g, z = g + F), O = 0; V > O; O++) P = d[O], P.dist >= j && P.dist <= z && W.push(P.node); return W } var r = /^([\d.]+)%$/; t.each(["nearest", "furthest", "touching"], function (r, h) { var a = { x: 0, y: 0, w: 0, h: 0, tolerance: 1, container: document, furthest: "furthest" == h, includeSelf: !1, sameX: "touching" === h, sameY: "touching" === h, onlyX: !1, onlyY: !1 }; t[h] = function (r, h, i) { if (!r || r.x === e || r.y === e) return t([]); var o = t.extend({}, a, r, i || {}); return t(n(h, o)) }, t.fn[h] = function (e, r) { if (!this.length) return this.pushStack([]); var h; if (e && t.isPlainObject(e)) return h = t.extend({}, a, e, r || {}), this.pushStack(n(this, h)); var i = this.offset(), o = { x: i.left, y: i.top, w: this.outerWidth(), h: this.outerHeight() }; return h = t.extend({}, a, o, r || {}), this.pushStack(n(e, h, this)) } }) }(jQuery);

function sizeof(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (var key in obj) {
                            if (!obj.hasOwnProperty(key)) continue;
                            sizeOf(obj[key]);
                        }
                    } else bytes += obj.toString().length * 2;
                    break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
        else return (bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function ($) { $.fn.hoverIntent = function (handlerIn, handlerOut, selector) { var cfg = { interval: 100, sensitivity: 6, timeout: 0 }; if (typeof handlerIn === "object") { cfg = $.extend(cfg, handlerIn) } else { if ($.isFunction(handlerOut)) { cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector }) } else { cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut }) } } var cX, cY, pX, pY; var track = function (ev) { cX = ev.pageX; cY = ev.pageY }; var compare = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); if (Math.sqrt((pX - cX) * (pX - cX) + (pY - cY) * (pY - cY)) < cfg.sensitivity) { $(ob).off("mousemove.hoverIntent", track); ob.hoverIntent_s = true; return cfg.over.apply(ob, [ev]) } else { pX = cX; pY = cY; ob.hoverIntent_t = setTimeout(function () { compare(ev, ob) }, cfg.interval) } }; var delay = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); ob.hoverIntent_s = false; return cfg.out.apply(ob, [ev]) }; var handleHover = function (e) { var ev = $.extend({}, e); var ob = this; if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t) } if (e.type === "mouseenter") { pX = ev.pageX; pY = ev.pageY; $(ob).on("mousemove.hoverIntent", track); if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout(function () { compare(ev, ob) }, cfg.interval) } } else { $(ob).off("mousemove.hoverIntent", track); if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout(function () { delay(ev, ob) }, cfg.timeout) } } }; return this.on({ "mouseenter.hoverIntent": handleHover, "mouseleave.hoverIntent": handleHover }, cfg.selector) } })(jQuery);

