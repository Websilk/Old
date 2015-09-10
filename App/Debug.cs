using System;
using System.Collections.Generic;

namespace Websilk.Services
{
    public class Debug:Service
    {
        public Debug(Core WebsilkCore, string[] path):base(WebsilkCore, path)
        {
        }

        public WebRequest Session()
        {
            WebRequest wr = new WebRequest();

            Scaffold scaffold = new Scaffold(R, "/app/debug/debug.html", "", new string[] { "body" });
            string jsonVs = R.Util.Str.GetString(R.Session["viewstates"]);
            string jsonUser = R.Util.Serializer.WriteObjectAsString(R.User);
            ViewStates vss = (ViewStates)R.Util.Serializer.ReadObject(jsonVs, Type.GetType("Websilk.ViewStates"));
            List<string> body = new List<string>();
            double totalLen = R.Session["viewstates"].Length;
            double len = 0;

            body.Add("<h1>User (" + (jsonUser.Length * 2) + " bytes)</h1>" + jsonUser);
            body.Add("<h1>Viewstates (" + totalLen.ToString("N0") + " bytes)</h1>" + jsonVs);

            foreach(structViewStateInfo item in vss.Views)
            {
                ViewState vssItem = (ViewState)R.Util.Serializer.ReadObject(R.Util.Str.GetString(R.Session["viewstate-" + item.id]), Type.GetType("Websilk.ViewState"));
                len = R.Session["viewstate-" + item.id].Length;
                totalLen += len;
                body.Add("<h1>Viewstate \"" + item.id + "\" (" + len.ToString("N0") + " bytes)</h1>" + R.Util.Serializer.WriteObjectAsString(vssItem));
                
            }

            body.Add("<h1>Total Memory Used: " + totalLen.ToString("N0") + " bytes");
            
            scaffold.Data["body"] = ("<pre>" + string.Join("</pre></div><div><pre>", body.ToArray()).Replace("\\\"", "\"").Replace("\\n", "").Replace("},", "},\n").Replace("],", "],\n") + "</pre>");

            //finally, scaffold debug HTML
            wr.html = scaffold.Render();
            return wr;
        }
    }
}
