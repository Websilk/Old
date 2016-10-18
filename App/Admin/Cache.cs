using System.IO;
using System.Collections.Generic;

namespace Websilk.Services.Dashboard
{
    public class AdminCache : Service
    {
        private string wwwroot = "wwwroot";

        public AdminCache(Core WebsilkCore) : base(WebsilkCore)
        {
        }

        public Inject Load()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("admin/cache", 0) == false) { return response; }

            //setup response
            response.element = ".winAdminCache > .content";

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/admin/cache.html");
            scaffold.Data["test"] = S.Page.websiteTitle;

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }
        
    }
}
