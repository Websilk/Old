using System;
using System.IO;

namespace Websilk
{
    public class Editor
    {
        private Core S;

        public Editor(Core WebsilkCore)
        {
            S = WebsilkCore;
        }

        public string[] LoadEditor()
        {
            string htm = "";
            string js = "$('.svgicons').load('/images/editor/icons.svg');";
            Scaffold Scaffold = new Scaffold(S, "/app/editor/editor.html");

            //setup scaffolding variables
            if(S.User.photo == "")
            {
                Scaffold.Data["photo"] = "<img src=\"/images/editor/userphoto.jpg\"/>";
            }
            else
            {
                Scaffold.Data["photo"] = "<img src=\"/content/users/" + S.Util.Str.DateFolders(S.User.signupDate) + "/" + S.User.userId + "/portrait/s_" + S.User.photo + "\"/>";
            }

            //load grid sides
            js += "(function(){var htm = '" +
                      "<div class=\"grid-leftside\"></div>" +
                      "<div class=\"grid-rightside\"></div>';" +
                      "$('.webpage').prepend(htm);" +
                      "})();";

            if (S.isFirstLoad == true)
            {//first load
                S.App.scaffold.Data["editor-css"] = 
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/editor.css?v=" + S.Version + "\"/>" +
                    "<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/colors/" + S.User.editorColor + ".css?v=" + S.Version + "\"/>";
            }
            else
            {//web service
                js += "$('head').append('<link rel=\"stylesheet\" href=\"/css/editor.css?v=" + S.Version + "\" type=\"text/css\" />');" +
                      "$('head').append('<link rel=\"stylesheet\" href=\"/css/colors/" + S.User.editorColor + ".css?v=" + S.Version + "\" type=\"text/css\" />');";
                var min = "";
                var v = S.Version;
                if (S.isLocal == true)
                {
                    Random rnd = new Random();
                    v = rnd.Next(1, 9999).ToString();
                }else
                {
                    min = ".min";
                }
                js += "$.getScript('/js/editor" + min + ".js?v=" + v + "', function(){S.editor.load();});";

            }

            //finally, scaffold Editor HTML
            htm = Scaffold.Render();

            S.Page.isEditorLoaded = true;

            return new string[] { htm, js };
        }
    }
}

namespace Websilk.Services
{
    public class Editor : Service
    {
        public Editor(Core WebsilkCore) : base(WebsilkCore)
        {
        }

        public Response Dashboard()
        {
            if (S.isSessionLost() == true) { return lostResponse(); }
            Response response = new Response();
            response.window = "Dashboard";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/editor/dashboard.html");
            scaffold.Data["website-title"] = S.Page.websiteTitle;
            scaffold.Data["page-title"] = S.Page.pageTitle;
            scaffold.Data["pageid"] = S.Page.pageId.ToString();

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();
            return response;
        }

        public Response Options()
        {
            if (S.isSessionLost() == true) { return lostResponse(); }
            Response response = new Response();
            response.window = "Options";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/editor/options.html");
            scaffold.Data["helpicon-grid"] = "";
            scaffold.Data["helpicon-dragfrompanel"] = "";
            scaffold.Data["helpicon-guidelines"] = "";

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();
            return response;
        }

        public Response Profile()
        {
            if (S.isSessionLost() == true) { return lostResponse(); }
            Response response = new Response();
            response.window = "Profile";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/editor/profile.html");
            if (S.User.userId == 1) { scaffold.Data["admin"] = "true"; }

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();
            return response;
        }

        public Response Layers()
        {
            if (S.isSessionLost() == true) { return lostResponse(); }
            Response response = new Response();
            response.window = "Layers";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/editor/layers.html");

            S.Page.RegisterJS("layers", "S.editor.layers.refresh();");

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();
            return response;
        }

        #region "Components"
        public Response Components()
        {
            if (S.isSessionLost() == true) { return lostResponse(); }
            Response response = new Response();
            response.window = "Components";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/editor/components.html");

            //get a list of components
            scaffold.Data["components"] = GetComponentsList();

            //get a list of categories
            scaffold.Data["categories"] = GetComponentCategories();

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();
            return response;
        }

        public Inject ComponentsFromCategory(int category)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = "#component-list";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            response.html = GetComponentsList(category);
            response.js = CompileJs();
            return response;
        }

        private string GetComponentsList(int category = 1)
        {
            int start = 0;
            int length = 12;
            string htm = "";
            SqlClasses.Editor SqlEditor = new SqlClasses.Editor(S);
            SqlReader reader = SqlEditor.GetComponentsList(category, start, length);
            if (reader.Rows.Count > 0)
            {
                while (reader.Read() != false)
                {
                    htm += "<div class=\"list-item\" cname=\"" + reader.Get("title") + "\" ctitle=\"" + reader.Get("description") + "\" onmousedown=\"S.editor.components.dragNew.start(event)\" onmouseover=\"S.editor.components.toolbar.mouseEnter(this)\" onmouseout=\"S.editor.components.toolbar.mouseLeave()\" >";
                    htm += "<img src=\"/components/" + reader.Get("componentid").Replace("-", "/") + "/icon.png\" alt=\"" + reader.Get("title") + "\" cid=\"" + reader.Get("componentid") + "\" /></div>";
                }
            }
            return htm;
        }

        private string AddCategory(int id, string title, string description, string iconFolder)
        {
            return "<div class=\"row column\"><div class=\"button-outline\" onclick=\"S.editor.components.category.load(" + id + ")\" title=\"" + description + "\">" +
                "<div class=\"left\" style=\"padding-right:10px;\"><img src=\"/" + iconFolder + "/iconsm.png\"/></div><div style=\"padding-top:7px;\">" + title + "</div></div></div>";
        }

        private string GetComponentCategories()
        {
            string htm = "";
            htm = "";
            htm += AddCategory(1, "General", "All the tools you need to create content, including text, photos, videos, panels, menus, lists, and buttons.", "components/textbox");
            htm += AddCategory(2, "Page", "Add the title of your page, a list of relavent pages, user comments & ratings, and other page-specific content.", "components/page/title");
            if (S.Page.isDemo == false)
            {
                SqlClasses.Editor SqlEditor = new SqlClasses.Editor(S);
                SqlReader reader = SqlEditor.GetComponentCategories();
                if (reader.Rows.Count > 0)
                {
                    while (reader.Read() != false)
                    {
                        htm += AddCategory(reader.GetInt("componentcategory"), reader.Get("title"), reader.Get("description"), "/apps/" + reader.Get("name"));
                    }
                }
            }
            return htm;
        }

        public Inject NewComponent(string componentId, string panelId, string selector, string aboveId, string duplicate)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup response
            response.element = selector;
            response.inject = enumInjectTypes.append;

            //setup default properties for component
            string className = "Websilk.Components." + componentId.Replace("/", ".").Replace("-", ".");
            Type type = Type.GetType(className, false, true);
            if (type == null) { return response; }
            Component comp = (Component)Activator.CreateInstance(type, new object[] { S });
            if (comp == null) { return response; }
            Panel panel = S.Page.GetPanelByName(panelId);

            //find component to insert new component above
            int addIndex = -1;
            if (aboveId != "" && aboveId != "last")
            {
                for (int i = 0; i < S.Page.ComponentViews.Count; i++)
                {
                    if (S.Page.ComponentViews[i].id == aboveId)
                    {
                        addIndex = i;
                        response.inject = enumInjectTypes.before;
                        response.element = "#c" + aboveId;
                        ; break;
                    }
                }
            }

            //render new component
            comp = S.Page.LoadComponent(componentId, "", "", "", panel, "/content/websites/" + S.Page.ownerId + "/pages/" + S.Page.pageId, 1, S.Page.pageId, 1, true, "", "", addIndex, duplicate);
            if (comp == null) { return response; }

            response.html = comp.Render();

            //add JS to align component on page correctly
            string js = "(function(){var c = $('#c" + comp.id + "'); })(); S.editor.components.saveArrangement($S('" + panel.id + "'));";

            S.Page.RegisterJS("newcomp", js);
            response.js = CompileJs();
            response.css = CompileCss();
            response.cssid = "stylefor_c" + comp.id;

            return response;

        }

        public Inject RemoveComponent(string componentId)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            for (int x = 0; x <= S.Page.ComponentViews.Count - 1; x++)
            {
                if (S.Page.ComponentViews[x].id == componentId)
                {
                    S.Page.ComponentViews.Remove(S.Page.ComponentViews[x]);
                    break;
                }
            }

            SaveEnable();
            response.js = CompileJs();
            return response;
        }

        public Inject ComponentProperties(string id, string section)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();
            response.element = ".winProperties .props-content";

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //load dependencies for properties window
            ComponentView comp = S.Page.GetComponentViewById(id);
            string cid = comp.name.Replace(" ", ".");
            string className = "Websilk.Components.Properties." + cid;
            Type type = Type.GetType(className, false, true);
            if (type == null || comp == null) { return response; }

            //load properties.js
            string js = "";

            if (S.Server.Cache.ContainsKey("props-" + cid) == true & S.isLocal == false)
            {
                //load from cache
                js = (string)S.Server.Cache["props-" + cid];
            }
            else
            {
                //load from file
                string jsp = File.ReadAllText(S.Server.MapPath("/app/components/" + cid + "/properties.js"));
                js = jsp;
                if (S.isLocal == false)
                {
                    //save to cache
                    S.Server.Cache.Add("props-" + cid, jsp);
                }
            }
            S.Page.RegisterJS("loadprops", js);

            //load properties window
            ComponentProperties properties = (ComponentProperties)Activator.CreateInstance(type, new object[] { S, comp, section });
            S.Page.RegisterJS("props", "S.editor.components.properties.loaded('" + comp.name + "'," + properties.Width + ");");

            //finally, render properties window
            response.html = properties.Render();
            response.js = CompileJs();
            response.css = CompileCss();
            response.cssid = "windowprops";
            return response;
        }
        #endregion




    }
}
