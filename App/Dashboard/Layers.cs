﻿using System.Collections.Generic;

namespace Websilk.Services.Dashboard
{
    public class Layers : Service
    {
        public Layers(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        public Inject Load()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/layers", 0) == false) { return response; }

            //setup response
            response.element = ".winDashboardDesign > .content";

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/dashboard/layers.html", "", new string[] { "test" });
            scaffold.Data["test"] = S.Page.websiteTitle;

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }
    }
}
