using System;
using System.Collections.Generic;

namespace Websilk
{
    public class Editor
    {
        private Core R;

        public Editor(Core WebsilkCore)
        {
            R = WebsilkCore;
        }

        public string[] LoadEditor()
        {
            string htm = "";
            string js = "$('.svgicons').load('/images/editor/icons.svg');";
            Scaffold Scaffold = new Scaffold(R, "/app/editor/editor.html", "", new string[] { "photo" });

            //setup scaffolding variables
            if(R.User.photo == "")
            {
                Scaffold.Data["photo"] = "<img src=\"/images/editor/userphoto.jpg\"/>";
            }
            else
            {
                Scaffold.Data["photo"] = "<img src=\"/content/users/" + R.Util.Str.DateFolders(R.User.signupDate) + "/" + R.User.userId + "/portrait/s_" + R.User.photo + "\"/>";
            }

            //load grid sides
            js += "(function(){var htm = '" +
                      "<div class=\"grid-leftside\"></div>" +
                      "<div class=\"grid-rightside\"></div>';" +
                      "$('.webpage').prepend(htm);" +
                      "})();";

            if (R.isFirstLoad == true)
            {//first load
                R.App.scaffold.Data["editor-css"] = 
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/websilk-edit.css?v=" + R.Version + "\"/>" +
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/colors/" + R.User.editorColor + ".css?v=" + R.Version + "\"/>";
            }
            else
            {//web service
                js += "$('head').append('<link rel=\"stylesheet\" href=\"/css/websilk-edit.css?v=" + R.Version + "\" type=\"text/css\" />');" +
                      "$('head').append('<link rel=\"stylesheet\" href=\"/css/colors/" + R.User.editorColor + ".css?v=" + R.Version + "\" type=\"text/css\" />');";

                if (R.isLocal == true)
                {
                    Random rnd = new Random();
                    int ran = rnd.Next(1, 9999);
                    js += "$.when(" + "$.getScript('/scripts/core/editor.js?v=" + ran + "')," + 
                        "$.getScript('/scripts/rangy/rangy-compiled.js?v=" + ran + "')," + 
                        "$.getScript('/scripts/utility/dropzone.js?v=" + ran + "')," + 
                        "$.Deferred(function(deferred){$(deferred.resolve);})" + 
                        ").done(function(){ R.editor.load(); });";
                }else
                {
                    js += "$.getScript('/scripts/editor.js?v=" + R.Version + "', function(){R.editor.load();});";
                }
                
            }

            //finally, scaffold Editor HTML
            htm = Scaffold.Render();

            R.Page.isEditorLoaded = true;

            return new string[] { htm, js };
        }
    }
}
