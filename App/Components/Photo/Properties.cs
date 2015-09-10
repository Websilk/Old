using System;
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

        public Photo(Core WebsilkCore, ComponentView c) : base(WebsilkCore, c)
        {
            //file|hover-file|orig-width|orig-height|url|new-window|window-name|alt-text|speed (0 - 8)
            //use-bg|bg-size|bg-position|use-tile|use-parallax|parallax-speed|parallax-offset (9 - 15)

            string[] data = Component.dataField.Split('|');
            if(data.Length == 0) { return; }
            string photo = "/components/photo/icon.png";
            if(data[0] != "")
            {
                string[] paths = data[0].Split('/');
                if(paths.Length == 2)
                {
                    photo = "/content/websites/" + R.Page.websiteId + "/photos/" + paths[0] + "/" + "tiny" + paths[1];
                }
                else
                {
                    photo = "/content/websites/" + R.Page.websiteId + "/photos/" + "tiny" + data[0];
                }
            }

            //load properties into input fields via javascript
            string js =
                "$('#propsTxtLink').val('" + data[4] + "');" +
                "$('#propsLstTarget').val('" + (data[5] == "1" ? "_blank" : "") + "');" +
                "$('#propsTxtWindowName').val('" + data[6] + "');" +
                "$('#propsTxtAlt').val('" + data[7] + "');" +
                "R.editor.components.properties.current.load();";

            if(data[1] == "") { js += "$('.winProperties .remove-hover-photo').hide();"; }

            R.Page.RegisterJS("photoprops", js);

            scaffold.Setup(new string[] { "preview-photo", "helpicon-hover", "helpicon-link", "helpicon-alt", "helpicon-window" });
            Data["preview-photo"] = photo;
            Data["helpicon-hover"] = "";
            Data["helpicon-link"] = "";
            Data["helpicon-alt"] = "";
            Data["helpicon-window"] = "";
        }

    }
}
