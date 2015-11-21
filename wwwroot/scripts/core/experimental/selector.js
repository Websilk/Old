//Websilk Selector Framework (replaces jQuery)

//private selector object
(function(){
    //main function that (usually) returns a list of DOM objects /////////////////////////////////////
    function select(sel) {
        var self = this;
        var elems = [];

        function getSelectorType(val) {
            if (val.substr(0, 1) == '#') {
                //find element by ID
                return 0;
            } else if (val.substr(0, 1) == '.') {
                //find elements by class name
                return 1;
            } else if (val.length == 0) {
                //find any element
                return 3;
            } else {
                //find elements by tag name
                return 2;
            }
        }

        function getElems(elem, val) {
            var hasExt = false;
            var sels = [val];
            var candids = [];
            if (sels[0].indexOf(':') >= 0) {
                //separate extension from selector
                hasExt = true;
                sels = val.split(':');
            }
            switch (getSelectorType(sels[0])) {
                case 0: //id
                    candids = document.getElementById(sels[0].replace('#', '')) || [];
                    break;
                case 1: //class name
                    candids = elem.getElementsByClassName(sels[0].replace('.', ' ')) || [];
                    break;
                case 2: //tag name
                    candids = elem.getElementsByTagName(sels[0]) || [];
                    break;
                case 3: //all elements (irrelevant selector)
                    return 'all';
            }

            if (candids.length > 0) {
                if (sels.length == 2) {
                    candids = getElemsFromExtension(candids, sels[1]);
                }

            }
            return candids;
        }

        function getElemsFromExtension(elems, ext) {
            //filter extensions from extension
            var args = [sels[1]];
            if (sels[1].indexOf('(') > 0) {
                args = sels[1].replace('(', '|').replace(')', '').split('|');
            }
            switch (args[0]) {
                case 'not':
                    break;
                case 'visible':
                    break;
            }
            for (i in candids) {

            }

            //TODO: finish function
            return elems;
        }

        function findParent(elem, sel) {
            var p = elem;
            var hasExt = false;
            var sels = [sel];
            var found = false;
            if (sels[0].indexOf(':') >= 0) {
                //separate extension from selector
                hasExt = true;
                sels = sel.split(':');
            }
            var type = getSelectorType(sels[0]);
            var classes = [];
            if (type == 0) {
                sels[0] = sels[0].substr(1);
            }
            else if (type == 1) {
                //split class names
                classes = sels[0].split('.');
            }

            //traverse down DOM tree
            while (typeof p == 'object' && p != null) {
                found = false;
                switch (type) {
                    case 0: //id
                        if (p.id) {
                            if (p.id == sels[0]) { found = true; }
                        }

                        break;

                    case 1: //class name(s)
                        //make sure element contains all classes within selector
                        var hasall = true;
                        var pclss = p.className.split(' ');
                        for (i = 0; i < classes.length; i++) {
                            var has = false;
                            for (u = 0; u < pclss.length; u++) {
                                if (pclss[u] == classes[i]) {
                                    has = true; break;
                                }
                            }
                            if (has == false) { hasall = false; }
                        }
                        if (hasall == true) { found = true; }
                        break;

                    case 2: //tag name
                        if (p.tagName.toLowerCase() == sels[0]) { found = true; }
                        break;

                    case 3: //all elements (irrelevant selector)
                        found = true;
                }

                if (found == true) {
                    if (sels.length == 2) {
                        //found match, check match from selector extension
                        var candids = getElemsFromExtension([p], sels[1]);
                        if (candids.length > 0) { return true; }
                    }
                    return true;

                } else {
                    //traverse down DOM tree
                    p = p.parentNode;
                }
            }
            return false;
        }

        //get array of elements based on selector //////////////////////////////////////////////////////////
        if (sel != null && typeof sel != 'object') {
            //first, sort out the selector into an array
            var sels = sel.split(' '), i = -1, i2 = 0, selitem, s, e;
            do {
                i++;
                if (getSelectorType(sels[i]) == 1) {
                    //combine class names together
                    i2 = i + 1; selitem = sels[i];
                    while (sels.length > i2) {
                        if (getSelectorType(sels[i2]) == 1) {
                            selitem += ' ' + sels[i2];
                        }
                        i2 += 1;
                    };
                    sels.splice(i + 1, i2 - (i));
                    sels[i] = selitem;
                }
            } while (i < sels.length - 2);

            //next, get result candidates from last index in selector array
            var candids = [];
            i = sels.length - 1;
            while ((candids.length == 0 || candids == 'all') && i >= 0) {
                candids = getElems(document.documentElement, sels[i]);
                i--;
            }
            if (candids == 'all') {
                elems = document.all;
            } else {
                //remove candidates based on selectors
                if (candids.length > 0) {
                    var finals = []; var good = true; var i2 = i;
                    for (x = 0; x < candids.length; x++) {
                        good = true;
                        i = i2;
                        while (i >= 0) {
                            s = sels[i];
                            //traverse down the DOM tree to find match
                            if (findParent(candids[x], sels[i]) == false) {
                                good = false;
                                break;
                            }
                            i--;
                        }
                        if (good == true) {
                            //candidate passed selector conditions
                            finals.push(candids[x]);
                        }
                    }
                    //move final candidates to the return object
                    elems = finals;
                }
            }

        } else if (typeof sel == 'object') {
            //elements are already defined instead of using a selector /////////////////////////////////////
            if (sel.length > 1) {
                elems = sel;
            } else {
                elems = [sel];
            }
        } else {
            elems.length = 0;
        }

        this.elems = elems;
    }

    //functions that are accessable by return object ////////
    select.prototype.addClass = function(classes) {
        //Add class name to each of the elements in the collection. 
        //Multiple class names can be given in a space-separated string.
        
        return this;
    }

    select.prototype.after = function(content) {
        //Add content to the DOM after each elements in the collection. 
        //The content can be an HTML string, a DOM node or an array of nodes.
        return this;
    }

    select.prototype.append = function (content) {
        //Append content to the DOM inside each individual element in the collection. 
        //The content can be an HTML string, a DOM node or an array of nodes.
        return this;
    }

    select.prototype.appendTo = function(target) {
        //Append elements from the current collection to the target element. 
        //This is like append, but with reversed operands.
        return this;
    }

    select.prototype.attr = function(name) {
        //Read or set DOM attributes. When no value is given, reads 
        //specified attribute from the first element in the collection. 
        //When value is given, sets the attribute to that value on each element 
        //in the collection. When value is null, the attribute is removed  = function(like with removeAttr). 
        //Multiple attributes can be set by passing an object with name-value pairs.
        return this;
    }

    select.prototype.before = function(content) {
        //Add content to the DOM before each element in the collection. 
        //The content can be an HTML string, a DOM node or an array of nodes.
        return this;
    }

    select.prototype.children = function(selector) {
        //Get immediate children of each element in the current collection. 
        //If selector is given, filter the results to only include ones matching the CSS select.
        return this;
    }

    select.prototype.closest = function(selector) {
        //Traverse upwards from the current element to find the first element that matches the select. 
        return this;
    }

    select.prototype.css = function(params) {
        //Read or set CSS properties on DOM elements. When no value is given, 
        //returns the CSS property from the first element in the collection. 
        //When a value is given, sets the property to that value on each element of the collection.

        //Multiple properties can be retrieved at once by passing an array of property names. 
        //Multiple properties can be set by passing an object to the method.

        //When a value for a property is blank  = function(empty string, null, or undefined), that property is removed. 
        //When a unitless number value is given, “px” is appended to it for properties that require units.
        return this;
    }

    select.prototype.each = function(func) {
        //Iterate through every element of the collection. Inside the iterator function, 
        //this keyword refers to the current item  = function(also passed as the second argument to the function). 
        //If the iterator select.prototype.returns false, iteration stops.
        return this;
    }

    select.prototype.empty = function(func) {
        //Clear DOM contents of each element in the collection.
        return this;
    }

    select.prototype.filter = function(selector) {
        //Filter the collection to contain only items that match the CSS select. 
        //If a select.prototype.is given, return only elements for which the select.prototype.returns a truthy value. 
        //Inside the function, the this keyword refers to the current element.
        return this;
    }

    select.prototype.find = function(selector) {
        //Find elements that match CSS selector executed in scope of nodes in the current collection.
        return this;
    }

    select.prototype.get = function(index) {
        //Get all elements or a single element from the current collection. 
        //When no index is given, returns all elements in an ordinary array. 
        //When index is specified, return only the element at that position. 
        return this.elems[index];
    }

    select.prototype.has = function(selector) {
        //Filter the current collection to include only elements that have 
        //any number of descendants that match a selector, or that contain a specific DOM node.
        return this;
    }

    select.prototype.hasClass = function(classes) {
        //Check if any elements in the collection have the specified class.
        return this;
    }

    select.prototype.height = function(val) {
        //Get the height of the first element in the collection; 
        //or set the height of all elements in the collection.
        return this;
    }

    select.prototype.hide = function() {
        //Hide elements in this collection by setting their display CSS property to none.
        return this;
    }

    select.prototype.html = function(content) {
        //Get or set HTML contents of elements in the collection. 
        //When no content given, returns innerHTML of the first element. 
        //When content is given, use it to replace contents of each element. 
        return this;
    }

    select.prototype.index = function() {
        //Get the position of an element. When no element is given, 
        //returns position of the current element among its siblings. 
        //When an element is given, returns its position in the current collection. 
        //Returns -1 if not found.
        return this;
    }

    select.prototype.insertAfter = function(target) {
        //Insert elements from the current collection after the target element in the DOM. 
        //This is like after, but with reversed operands.
        return this;
    }

    select.prototype.insertBefore = function(target) {
        //Insert elements from the current collection before each of the target elements in the DOM. 
        //This is like before, but with reversed operands.
        return this;
    }

    select.prototype.is = function(selector) {
        //Check if the first element of the current collection matches the CSS select.
        return this;
    }

    select.prototype.last = function() {
        //Get the last element of the current collection.
        return this;
    }

    select.prototype.map = function(func) {
        //Iterate through every element of the collection. Inside the iterator function, 
        //this keyword refers to the current item  = function(also passed as the second argument to the function). 
        //If the iterator select.prototype.returns false, iteration stops.
        return this;
    }

    select.prototype.next = function(selector) {
        //Get the next sibling–optionally filtered by selector–of each element in the collection.
        return this;
    }

    select.prototype.not = function(selector) {
        //Filter the current collection to get a new collection of elements that don’t match the CSS select. 
        //If another collection is given instead of selector, return only elements not present in it. 
        //If a select.prototype.is given, return only elements for which the select.prototype.returns a falsy value. 
        //Inside the function, the this keyword refers to the current element.
        return this;
    }

    select.prototype.offset = function(coordinates) {
        //Get position of the element in the document. 
        //Returns an object with properties: top, left, width and height.

        //When given an object with properties left and top, use those values to 
        //position each element in the collection relative to the document.
        return this;
    }

    select.prototype.offsetParent = function() {
        //Find the first ancestor element that is positioned, 
        //meaning its CSS position value is “relative”, “absolute” or “fixed”.
        return this;
    }

    select.prototype.parent = function(selector) {
        //Get immediate parents of each element in the collection. 
        //If CSS selector is given, filter results to include only ones matching the select.
        return this;
    }

    select.prototype.parents = function(selector) {
        //Get all ancestors of each element in the collection. 
        //If CSS selector is given, filter results to include only ones matching the select.
        return this;
    }

    select.prototype.pluck = function(property) {
        //Get values from a named property of each element in the collection, 
        //with null and undefined values filtered out.
        return this;
    }

    select.prototype.position = function() {
        //Get the position of the first element in the collection, relative to the offsetParent. 
        //This information is useful when absolutely positioning an element to appear aligned with another.
        return this;
    }

    select.prototype.prepend = function(content) {
        //Prepend content to the DOM inside each element in the collection. 
        //The content can be an HTML string, a DOM node or an array of nodes.
        return this;
    }

    select.prototype.prependTo = function(target) {
        //Prepend elements of the current collection inside each of the target elements. 
        //This is like prepend, only with reversed operands.
        return this;
    }

    select.prototype.prev = function(selector) {
        //Get the previous sibling–optionally filtered by selector–of each element in the collection.
        return this;
    }

    select.prototype.prop = function(name, val) {
        //Read or set properties of DOM elements. This should be preferred over attr in case of 
        //reading values of properties that change with user interaction over time, such as checked and selected.
        return this;
    }

    select.prototype.push = function(elems) {
        //Add elements to the end of the current collection.
        return this;
    }

    //public selector object //////////////////////////////////////////////////////////////////////////////////////////
    window.$ = function(selector) {
        return new select(selector);
    }


    //add functionality to the $ object ///////////////////////////////////////////////////////////////////////////////
    $.array = {
        removeDuplicates: function (array) {

        }
    }

})();


//add functions to the public selector object ($)
//$.grep = function (items, func) {
    //Get a new array containing only the items 
    //for which the callback function returned true.
//}