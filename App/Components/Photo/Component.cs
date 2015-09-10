using System;
using System.Collections.Generic;

namespace Websilk.Components
{
    public class Photo: Component
    {
        public Photo(Core WebsilkCore):base(WebsilkCore)
        {
            
            
        }

        public override string name
        {
            get
            {
                return "Photo";
            }
        }

        public override string contentName
        {
            get { return "Photo"; }
        }

        public override int defaultWidth
        {
            get
            {
                return 56;
            }
        }

        public override string Render()
        {
            if (dataField == "")
            {
                innerHTML = "<img src=\"/components/photo/icon.png\" border=\"0\" style=\"width:100%;\">";
            }else
            {
                innerHTML = GetPhoto();
            }

            return base.Render();
        }

        private string GetPhoto()
        {

            //the contents should look similar to this:
            //file|hover-file|orig-width|orig-height|url|new-window|window-name|alt-text|speed (0 - 8)
            //use-bg|bg-size|bg-position|use-tile|use-parallax|parallax-speed|parallax-offset (9 - 15)

            {
                if (!string.IsNullOrEmpty(dataField))
                {
                    LoadDataArrays();
                    if(data.Length == 0) { data = new string[15]; }

                    bool useBg = false;
                    string alt = "";
                    string htmLit = "";
                    string js = "";

                    if (data[8] == "1") { useBg = true; }
                    alt = data[7];

                    if (useBg == false)
                    {
                        //add url link if it exists
                        if (!string.IsNullOrEmpty(data[4]))
                        {
                            string myContent = S.Util.Str.GenerateURL(data[4]);
                            if (myContent.IndexOf("javascript:") >= 0)
                            {
                                myContent = "javascript:\" onclick=\"" + myContent.Replace("javascript:", "");
                            }
                            htmLit += "<a href=\"" + myContent + "\"";

                            if (!string.IsNullOrEmpty(data[1]))
                            {
                                //add mouse hover class
                                htmLit += " class=\"hover\"";
                            }
                            if(data[5] == "1")
                            {
                                if (!string.IsNullOrEmpty(data[6]) && S.Util.Str.IsNumeric(data[6]) == false)
                                {
                                    htmLit += " target=\"" + data[6] + "\"";
                                }
                                else
                                {
                                    htmLit += " target=\"_blank\"";
                                }
                            }
                            

                            htmLit += ">";
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(data[1]))
                            {
                                htmLit += "<a href=\"javascript:\" class=\"hover\">";
                            }
                        }

                        //add photo
                        htmLit += "<img src=\"/content/websites/" + S.Page.websiteId + "/photos/" + data[0] + "\" alt=\"" + alt + "\"";

                        //add mouseover photo if it exists
                        if (!string.IsNullOrEmpty(data[1]))
                        {
                            double speed = 0.5;
                            if(S.Util.Str.IsNumeric(data[8]) == true) { speed = double.Parse(data[8]); }
                            htmLit += "class=\"absolute\" style=\"transition: opacity " + speed + "s ease-in-out;\"><img src=\"/content/websites/" + S.Page.websiteId + "/photos/" + data[1] + "\" alt=\"" + alt + "\" class=\"over\" style=\"transition: opacity " + speed + "s ease-in-out;\" />";
                        }
                        else
                        {
                            htmLit += " />";
                        }

                        //add url closing tag if it exists
                        if (!string.IsNullOrEmpty(data[4]))
                        {
                            htmLit += "</a>";
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(data[1]))
                            {
                                htmLit += "</a>";
                            }
                        }
                    }
                    else
                    {
                        //use background-image on a div element instead of using an img element
                        string[] filepath = data[0].Split('/');
                        string path = "";
                        string file = "";
                        if(filepath.Length == 2) {
                            path = filepath[0] + "/"; file = filepath[1];
                        }
                        else
                        {
                            file = filepath[0];
                        }
                        string img = path + data[10] + file;
                        int topOffset = 0;
                        string backgroundPos = "";
                        if (S.Util.Str.IsNumeric(data[12]) == true)
                        {
                            topOffset = -1 * int.Parse(data[12]);
                        }
                        string repeat = "no-repeat";
                        if (data[12] != "") { repeat = data[12]; }
                        if(data[11] != "") { backgroundPos = "background-position:" + data[11]; }

                        htmLit = "<div id=\"divPhoto" + id + "\" style=\"background-image:url(/content/websites/" + S.Page.websiteId + "/photos/" + img + ");background-repeat:" + repeat + ";" + backgroundPos + "width:100%;height:100%;overflow:hidden;\"></div>";

                    }

                    if (!string.IsNullOrEmpty(js)) { S.Page.RegisterJS("updatephoto" + id, js); }

                    //finally, insert html into the literal control
                    return htmLit;
                }
            }
            return "";
        }
    }
}
