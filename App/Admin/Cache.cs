using System.IO;
using System.Collections.Generic;

namespace Websilk.Services.Dashboard
{
    public class AdminCache : Service
    {
        private string wwwroot = "wwwroot";

        public AdminCache(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
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
            Scaffold scaffold = new Scaffold(S, "/app/admin/cache.html", "", new string[] { "test" });
            scaffold.Data["test"] = S.Page.websiteTitle;

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }

        public Inject CompileCoreJs()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("admin/cache", 0) == false) { return response; }

            //compile javascript files for production
            List<string> files = new List<string>();
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery-2.1.3.min.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/core/global.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/core/view.js")).ReadToEnd());

            StreamWriter sw = File.CreateText(S.Server.MapPath(wwwroot + "/scripts/websilk.js"));
            sw.Write(string.Join("\n\n", files.ToArray()));
            sw.Dispose();

            //finally, return response
            response.js = CompileJs();
            return response;
        }

        public Inject CompileUtilityJs()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("admin/cache", 0) == false) { return response; }

            //compile javascript files for production
            List<string> files = new List<string>();
            //files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery-ui-1.10.2.custom.min.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery.style.js")).ReadToEnd());
            //files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery.easing.1.3.js")).ReadToEnd());
            //files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery.scrollTo.min.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery.masonry.min.js")).ReadToEnd());
            //files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery.dd.js")).ReadToEnd());
            //files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery.parallax.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/jquery.nearest.min.js")).ReadToEnd());
            //files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/sizeof.js")).ReadToEnd());

            StreamWriter sw = File.CreateText(S.Server.MapPath(wwwroot + "/scripts/utility.js"));
            sw.Write(string.Join("\n\n", files.ToArray()));
            sw.Dispose();

            //finally, return response
            response.js = CompileJs();
            return response;
        }

        public Inject CompileEditorJs()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("admin/cache", 0) == false) { return response; }

            //compile javascript files for production
            List<string> files = new List<string>();
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/core/editor.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/rangy/lib/rangy-core.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/rangy/lib/rangy-classapplier.js")).ReadToEnd());
            files.Add(File.OpenText(S.Server.MapPath(wwwroot + "/scripts/utility/dropzone.js")).ReadToEnd());

            StreamWriter sw = File.CreateText(S.Server.MapPath(wwwroot + "/scripts/editor.js"));
            sw.Write(string.Join("\n\n", files.ToArray()));
            sw.Dispose();

            //finally, return response
            response.js = CompileJs();
            return response;
        }
    }
}
