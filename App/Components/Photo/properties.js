var props = R.editor.components.properties;
props.menu.clear();
props.menu.add('Photo', '.props-pages', 1);
//props.menu.add('Advanced', '.props-pages', 2);
props.menu.select('.props-pages', 1);


//set up current properties object functionality
R.editor.components.properties.current = {
    photo: {
        update: function (src) {
            var id = R.editor.components.properties.selected.id.substr(1);
            R.ajax.post('/websilk/Components/Photo/UpdatePhoto', { id: id, photo: src, type: 1 }, R.ajax.callback.inject);
        }
    },

    photoHover: {
        update: function (src) {
            var id = R.editor.components.properties.selected.id.substr(1);
            R.ajax.post('/websilk/Components/Photo/UpdatePhoto', { id: id, photo: src, type: 2 }, R.ajax.callback.inject);
        },

        remove: function () {
            if (confirm('Do you really want to remove the photo that is used when the mouse hovers over the component?') == true) {
                var id = R.editor.components.properties.selected.id.substr(1);
                $('.winProperties .remove-hover-photo').hide();
                R.ajax.post('/websilk/Components/Photo/RemoveHover', { id: id }, R.ajax.callback.inject);
            }
            
        }
    },

    changeTarget: function () {
        if ($('#propsLstTarget').val() == '_blank') {
            $('.winProperties .props-window-name').show();
        } else { $('.winProperties .props-window-name').hide(); }
    },

    load: function () {
        //executed when the properties window first loads
        this.changeTarget();
    },

    save: function () {
        //save component properties when the user presses the "apply changes" button
        var options = {
            id: R.editor.components.properties.selected.id.substr(1),
            url: $('#propsTxtLink').val(),
            alt: $('#propsTxtAlt').val(),
            target: $('#propsLstTarget').val(),
            win: $('#propsTxtWindowName').val()
        };
        R.ajax.post('/websilk/Components/Photo/SaveProperties', options, R.ajax.callback.inject);
    }
}