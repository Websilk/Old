using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Websilk.Services
{
    public class App: Service
    {
        public App(Core WebsilkCore):base(WebsilkCore)
        {
        }

        public PageRequest Url(string url)
        {
            //load a web page
            if (S.isSessionLost()) { return lostPageRequest(); } //check session

            string pageName = "";
            if (string.IsNullOrEmpty(url))
            {
                //load home page (no url)
                pageName = "Home";
            }
            else if (url.ToLower().IndexOf("dashboard") == 0)
            {
                //load dashboard
                if (S.User.userId < 1)
                {
                    pageName = "Login";
                }
                else
                {
                    pageName = "Dashboard";
                }
            }

            if (pageName != "")
            {
                //load either home page or dashboard
                S.Page.PageRequest = new PageRequest();
                S.Page.Url.path = "";
                if ((S.Page.isEditorLoaded == false & url.ToLower().IndexOf("dashboard") == 0) | url.ToLower().IndexOf("dashboard") < 0)
                {
                    S.Page.Url.path = pageName.ToLower().Replace("-", " ");
                    S.Page.pageTitle = pageName.Replace("-", " ");
                    S.Page.GetPageId();
                    S.Page.LoadPageFromId(S.Page.pageId);
                }
                S.Page.PageRequest.url = url;
                if (url.ToLower().IndexOf("dashboard") == 0)
                {
                    S.Page.RegisterJS("dashload", "if(S.editor.dashboard){S.editor.dashboard.show('" + url + "');}");
                    S.Page.PageRequest.pageTitle = S.Page.websiteTitle + S.Page.websiteTitleSeparator + "Dashboard";
                }
                S.Page.Render();
                Console.WriteLine("Load page from no url");
                return S.Page.PageRequest;
            }

            string[] arrUrl = url.Split('\"');
            int oldPageId = S.Page.pageId;

            if (arrUrl[0].IndexOf("+") < 0)
            {
                //found page with no query in url
                S.Page.Url.path = arrUrl[0].Replace("-", " ");
                S.Page.pageTitle = arrUrl[0].Replace("-", " ");
                S.Page.GetPageId();
                S.Page.LoadPageFromId(S.Page.pageId);
                S.Page.Render();
                Console.WriteLine("Load page: " + S.Page.pageTitle);
                if (S.Page.PageRequest == null)
                {
                    S.Page.PageRequest = new PageRequest();
                    S.Page.PageRequest.components = new List<PageComponent>();
                    S.Page.PageRequest.css = "";
                    S.Page.PageRequest.editor = "";
                    S.Page.PageRequest.js = "";
                    S.Page.PageRequest.pageTitle = S.Page.pageTitle;
                    S.Page.PageRequest.url = url;
                    S.Page.PageRequest.pageId = S.Page.pageId;
                    S.Page.PageRequest.already = true;

                }
                S.Page.PageRequest.url = url;
                return S.Page.PageRequest;
            }

            return new PageRequest();
        }

        public string KeepAlive(string save = "")
        {
            //save = json object representing the contents of a web page

            if (S.isSessionLost()) { return "lost"; } //check session

            if (!string.IsNullOrEmpty(save))
            { 
                SaveWebPage(save);
            }
            return "";
        }

        public void SaveWebPage(string save = "")
        {
            //update existing components with json data changes, then save the page to memory & disk
            Console.WriteLine("Save Web Page: " + save);
            JArray data = JsonConvert.DeserializeObject<JArray>(save);
            if(data != null)
            {
                string id = "";
                string type = "";
                int index = 0;
                bool matched = false;

                //process each change
                foreach(JObject item in data)
                {
                    //get component info
                    id = (string)item["id"];
                    type = (string)item["type"];

                    //find componentView match
                    matched = false;
                    for (int x = 0; x < S.Page.ComponentViews.Count; x++)
                    {
                        if (S.Page.ComponentViews[x].id == id) { index = x; matched = true; break; }
                    }
                    if(matched == true)
                    {
                        switch (type)
                        {
                            case "position":
                                //update position data for a component
                                S.Page.ComponentViews[index].positionField = (string)item["data"];
                                break;
                            case "data":
                                //update data field for a component
                                S.Page.ComponentViews[index].dataField = (string)item["data"];
                                break;
                            case "arrangement":
                                //rearrange components within a panel
                                List<ComponentView> views = new List<ComponentView>();
                                List<string> comps = new List<string>();
                                foreach (string comp in item["data"])
                                {
                                    comps.Add(comp);
                                }
                                int step = 0;
                                for (var i = 0; i < S.Page.ComponentViews.Count; i++)
                                {
                                    if (step == 0)
                                    {
                                        //find first matching component
                                        for (var e = 0; e < comps.Count; e++)
                                        {
                                            if (comps[e] == S.Page.ComponentViews[i].id)
                                            {
                                                step = 1;
                                                break;
                                            }
                                        }
                                        if (step == 0)
                                        {
                                            //add view to new array
                                            views.Add(S.Page.ComponentViews[i]);
                                        }
                                    }

                                    if (step == 1)
                                    {
                                        //find matching component views and add to new array
                                        for (var e = 0; e < comps.Count; e++)
                                        {
                                            for (var u = 0; u < S.Page.ComponentViews.Count; u++)
                                            {
                                                if (S.Page.ComponentViews[u].id == comps[e])
                                                {
                                                    views.Add(S.Page.ComponentViews[u]);
                                                    break;
                                                }
                                            }
                                        }
                                        step = 2;
                                    }

                                    if (step == 2)
                                    {
                                        //add rest of component views to new array
                                        matched = false;
                                        for (var e = 0; e < comps.Count; e++)
                                        {
                                            if (comps[e] == S.Page.ComponentViews[i].id)
                                            {
                                                matched = true;
                                                break;
                                            }
                                        }
                                        if (matched == false)
                                        {
                                            views.Add(S.Page.ComponentViews[i]);
                                        }
                                    }

                                }

                                S.Page.ComponentViews = views;
                                break;
                        }
                    }
                    
                }

                //save page
                string version = (int)S.Sql.ExecuteScalar("SELECT version FROM pages WHERE pageid=" + S.Page.pageId + " AND websiteid=" + S.Page.websiteId) + 
                                    "_" + string.Format("{0:dd-HH-mm}", DateTime.Now);
                S.Page.Save(version, true);
            }
        }
    }
}
