using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace Websilk.Services.Dashboard
{
    public class Tests : Service
    {

        public Tests (Core WebsilkCore) : base(WebsilkCore)
        {
        }

        public Response ui()
        {
            if (S.isSessionLost()) { return lostResponse(); }
            Response response = new Response();
            response.window = "Tests";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/dashboard/tests/ui.html");

            //finally, scaffold Websilk platform HTML
            var htm = new StringBuilder();
            var data = new Dictionary<string, string>();
            data.Add("size", "sm");
            data.Add("name", "Small");
            htm.Append(scaffold.Render(data));
            data = new Dictionary<string, string>();
            data.Add("size", "med");
            data.Add("name", "Medium");
            htm.Append(scaffold.Render(data));
            data = new Dictionary<string, string>();
            data.Add("size", "lg");
            data.Add("name", "Large");
            htm.Append(scaffold.Render(data));
            response.html = htm.ToString();
            response.js = CompileJs();
            return response;
        }
    }
}
