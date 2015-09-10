using System.Collections.Generic;

namespace Websilk.Services.Dashboard
{
    public class Users : Service
    {
        public Users(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        public Inject Load()
        {
            if (R.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (R.User.Website(R.Page.websiteId).getWebsiteSecurityItem("dashboard/users", 0) == false) { return response; }

            //setup response
            response.element = ".winDashboardUsers > .content";

            //setup scaffolding variables
            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(R, "/app/dashboard/users.html", "", new string[] { "test" });
            scaffold.Data["test"] = R.Page.websiteTitle;

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }
    }
}
