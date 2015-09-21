using System;
using System.Collections.Generic;

namespace Websilk.Services
{
    public class Debug:Service
    {
        public Debug(Core WebsilkCore, string[] path):base(WebsilkCore, path)
        {
        }

        public WebRequest GetSession()
        {
            WebRequest wr = new WebRequest();

            //Scaffold scaffold = new Scaffold(S, "/app/debug/debug.html", "", new string[] { "body" });
            //string jsonVs = S.Util.Str.GetString(S.Session.Get("viewstates"));
            //string jsonUser = S.Util.Serializer.WriteObjectAsString(S.User);
            //ViewStates vss = (ViewStates)S.Util.Serializer.ReadObject(jsonVs, Type.GetType("Websilk.ViewStates"));
            //List<string> body = new List<string>();
            //double totalLen = S.Session.Get("viewstates").Length;
            //double len = 0;
            //
            //body.Add("<h1>User (" + (jsonUser.Length * 2) + " bytes)</h1>" + jsonUser);
            //body.Add("<h1>Viewstates (" + totalLen.ToString("N0") + " bytes)</h1>" + jsonVs);
            //
            //foreach(structViewStateInfo item in vss.Views)
            //{
            //    ViewState vssItem = (ViewState)S.Util.Serializer.ReadObject(S.Util.Str.GetString(S.Session.Get("viewstate-" + item.id)), Type.GetType("Websilk.ViewState"));
            //    len = S.Session.Get("viewstate-" + item.id).Length;
            //    totalLen += len;
            //    body.Add("<h1>Viewstate \"" + item.id + "\" (" + len.ToString("N0") + " bytes)</h1>" + S.Util.Serializer.WriteObjectAsString(vssItem));
            //    
            //}
            //
            //body.Add("<h1>Total Memory Used: " + totalLen.ToString("N0") + " bytes");
            //
            //scaffold.Data["body"] = ("<pre>" + string.Join("</pre></div><div><pre>", body.ToArray()).Replace("\\\"", "\"").Replace("\\n", "").Replace("},", "},\n").Replace("],", "],\n") + "</pre>");
            //
            ////finally, scaffold debug HTML
            //wr.html = scaffold.Render();
            return wr;
        }
    }
}
