﻿using System;
using System.Collections.Generic;

namespace Websilk.Components.Properties
{
    public class Photo: ComponentProperties
    {
        public override int Width
        {
            get
            {
                return 450;
            }
        }

        public Photo(Core WebsilkCore, ComponentView c, string Section) : base(WebsilkCore, c, Section)
        {
            //file|hover-file|orig-width|orig-height|url|new-window|window-name|alt-text|speed (0 - 8)
            //use-bg|bg-size|bg-position|use-tile|use-parallax|parallax-speed|parallax-offset (9 - 15)
            if(Component.dataField == "")
            {
                Component.dataField = "|||||||||||||||";
            }

            string[] data = Component.dataField.Split('|');
            if(data.Length == 0) { return; }
            string photo = "/components/photo/icon.png";
            if(data[0] != "")
            {
                string[] paths = data[0].Split('/');
                if(paths.Length == 2)
                {
                    photo = "/content/websites/" + S.Page.websiteId + "/photos/" + paths[0] + "/" + "tiny" + paths[1];
                }
                else
                {
                    photo = "/content/websites/" + S.Page.websiteId + "/photos/" + "tiny" + data[0];
                }
            }

            //load properties into input fields via javascript
            string js =
                "$('#propsTxtLink').val('" + data[4] + "');" +
                "$('#propsLstTarget').val('" + (data[5] == "1" ? "_blank" : "") + "');" +
                "$('#propsTxtWindowName').val('" + data[6] + "');" +
                "$('#propsTxtAlt').val('" + data[7] + "');" +
                "S.editor.components.properties.current.load();";

            if(data[1] == "") { js += "$('.winProperties .remove-hover-photo').hide();"; }

            S.Page.RegisterJS("photoprops", js);
            
            Data["preview-photo"] = photo;
            Data["helpicon-hover"] = "";
            Data["helpicon-link"] = "";
            Data["helpicon-alt"] = "";
            Data["helpicon-window"] = "";
        }

    }
}
