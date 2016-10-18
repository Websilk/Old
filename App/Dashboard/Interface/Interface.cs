using System.Collections.Generic;

namespace Websilk.Services.Dashboard
{
    public class Interface : Service
    {
        public Interface(Core WebsilkCore) : base(WebsilkCore)
        {
        }

        public Inject Load()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            
            //setup response
            response.element = ".winDashboardInterface > .content";

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/dashboard/interface/interface.html");
            scaffold.Data["website-title"] = S.Page.websiteTitle;

            //load a list of menu items into dashboard menu
            Scaffold menuItem = new Scaffold(S, "/app/dashboard/interface/menu-item.html");
            var htm = generateMenuItem(menuItem, "Timeline", "timeline", "javascript:S.editor.window.open.timeline()") + "\n" +
                    generateMenuItem(menuItem, "Pages", "pages", "javascript:S.editor.window.open.pages()") + "\n" +
                    generateMenuItem(menuItem, "Photos", "photos", "javascript:S.editor.window.open.photoLibrary('dashboard')") + "\n" +
                    generateMenuItem(menuItem, "Uploads", "folder", "javascript:") + "\n" +
                    generateMenuItem(menuItem, "Analytics", "analytics", "javascript:S.editor.window.open.analytics()") + "\n" +
                    generateMenuItem(menuItem, "Users", "users", "javascript:S.editor.window.open.users()") + "\n" +
                    generateMenuItem(menuItem, "Apps", "apps", "javascript:S.editor.window.open.apps()") + "\n" +
                    generateMenuItem(menuItem, "Settings", "settings", "javascript:S.editor.window.open.websiteSettings()");
            scaffold.Data["menu"] = htm;

            //load list of apps into dashboard menu
            scaffold.Data["apps-list"] = "";

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }

        private string generateMenuItem(Scaffold scaffold, string name, string icon, string href)
        {
            scaffold.Data["name"] = name;
            scaffold.Data["icon"] = icon;
            scaffold.Data["href"] = href;
            return scaffold.Render();
        }
    }
}
