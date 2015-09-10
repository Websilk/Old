using System.Collections.Generic;

namespace Websilk.Services.Dashboard
{
    public class Apps : Service
    {
        public Apps(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        public Inject Load()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/apps", 0) == false) { return response; }

            //setup response
            response.element = ".winDashboardApps > .content";

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(R, "/app/dashboard/apps.html", "", new string[] { "test" });
            scaffold.Data["test"] = R.Page.websiteTitle;

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }
    }
}
