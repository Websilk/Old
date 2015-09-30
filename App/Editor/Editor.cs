using System;

namespace Websilk
{
    public class Editor
    {
        private Core S;

        public Editor(Core WebsilkCore)
        {
            S = WebsilkCore;
        }

        public string[] LoadEditor()
        {
            string htm = "";
            string js = "$('.svgicons').load('/images/editor/icons.svg');";
            Scaffold Scaffold = new Scaffold(S, "/app/editor/editor.html", "", new string[] { "photo" });

            //setup scaffolding variables
            if(S.User.photo == "")
            {
                Scaffold.Data["photo"] = "<img src=\"/images/editor/userphoto.jpg\"/>";
            }
            else
            {
                Scaffold.Data["photo"] = "<img src=\"/content/users/" + S.Util.Str.DateFolders(S.User.signupDate) + "/" + S.User.userId + "/portrait/s_" + S.User.photo + "\"/>";
            }

            //load grid sides
            js += "(function(){var htm = '" +
                      "<div class=\"grid-leftside\"></div>" +
                      "<div class=\"grid-rightside\"></div>';" +
                      "$('.webpage').prepend(htm);" +
                      "})();";

            if (S.isFirstLoad == true)
            {//first load
                S.App.scaffold.Data["editor-css"] = 
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/websilk-edit.css?v=" + S.Version + "\"/>" +
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/colors/" + S.User.editorColor + ".css?v=" + S.Version + "\"/>";
            }
            else
            {//web service
                js += "$('head').append('<link rel=\"stylesheet\" href=\"/css/websilk-edit.css?v=" + S.Version + "\" type=\"text/css\" />');" +
                      "$('head').append('<link rel=\"stylesheet\" href=\"/css/colors/" + S.User.editorColor + ".css?v=" + S.Version + "\" type=\"text/css\" />');";

                if (S.isLocal == true)
                {
                    Random rnd = new Random();
                    int ran = rnd.Next(1, 9999);
                    js += "$.when(" +
                        "$.getScript('/scripts/editor/utility.js?v=" + ran + "')," +
                        "$.getScript('/scripts/editor/editor.js?v=" + ran + "')," +
                        "$.getScript('/scripts/editor/rangy.js?v=" + ran + "')," +
                        "$.getScript('/scripts/editor/dropzone.js?v=" + ran + "')," + 
                        "$.Deferred(function(deferred){$(deferred.resolve);})" + 
                        ").done(function(){ S.editor.load(); });";
                }else
                {
                    js += "$.getScript('/scripts/editor.js?v=" + S.Version + "', function(){S.editor.load();});";
                }
                
            }

            //finally, scaffold Editor HTML
            htm = Scaffold.Render();

            S.Page.isEditorLoaded = true;

            return new string[] { htm, js };
        }
    }
}
