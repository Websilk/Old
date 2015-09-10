using System.Collections.Generic;

namespace Websilk.Services.Dashboard
{
    public class Interface : Service
    {
        public Interface(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        public Inject Load()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            
            //setup response
            response.element = ".winDashboardInterface > .content";

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/dashboard/interface.html", "", 
                new string[] { "website-title", "apps-list", "menu-pages", "menu-photos",
                "menu-analytics", "menu-users", "menu-apps", "menu-settings"});
            scaffold.Data["website-title"] = S.Page.websiteTitle;

            //check security
            //if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == true) { }
            scaffold.Data["menu-pages"] = "true";
            scaffold.Data["menu-photos"] = "true";
            scaffold.Data["menu-analytics"] = "true";
            scaffold.Data["menu-users"] = "true";
            scaffold.Data["menu-apps"] = "true";
            scaffold.Data["menu-settings"] = "true";

            //load list of apps into dashboard menu
            scaffold.Data["apps-list"] = "";

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }
    }
}
