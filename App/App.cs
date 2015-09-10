using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Websilk.Services
{
    public class App: Service
    {
        public App(Core WebsilkCore, string[] paths):base(WebsilkCore, paths)
        {
        }

        public PageRequest LoadPage(string title)
        {
            if (R.isSessionLost() == true) { return lostPageRequest(); } //check session

            R.Page.Url.path = title.Replace("-", " ");
            R.Page.pageTitle = R.Util.Str.GetWebsiteTitle(R.Page.pageTitle) + " - " + title;
            R.Page.GetPageId();
            R.Page.LoadPageFromId(R.Page.pageId);
            R.Page.Render();
            return R.Page.PageRequest;
        }

        public PageRequest Hash(string url)
        {
            if(R.isSessionLost() == true) { return lostPageRequest(); } //check session
            Console.WriteLine("Parse Hash: " + url);
            return ParseHash(url);
        }

        private PageRequest ParseHash(string url, bool again = false)
        {
             if (string.IsNullOrEmpty(url) | url.IndexOf("dashboard") == 0)
            {
                //load current page with no url
                string pageName = "Home";
                if (url.IndexOf("dashboard") == 0 & R.User.userId < 1) { pageName = "Login"; }
                R.Page.PageRequest = new PageRequest();
                R.Page.Url.path = "";
                if ((R.Page.isEditorLoaded == false & url.IndexOf("dashboard") == 0) | url.IndexOf("dashboard") < 0)
                {
                    R.Page.Url.path = pageName.ToLower().Replace("-", " ");
                    R.Page.pageTitle = R.Page.pageTitle.Split(new char[] { '-', ' ', '\"' })[0] + " - " + pageName.Replace("-", " ");
                    R.Page.GetPageId();
                    R.Page.LoadPageFromId(R.Page.pageId);
                }

                if (url.IndexOf("dashboard") == 0)
                {
                    R.Page.RegisterJS("dashhash", "setTimeout(function(){if(R.editor.dashboard){R.editor.dashboard.show();}},1000);");
                }
                R.Page.Render();
                Console.WriteLine("Load page from no url");
                return R.Page.PageRequest;
            }

            string[] arrHash = url.Split('\"');
            int oldPageId = R.Page.pageId;

            if (arrHash[0].IndexOf("+") < 0)
            {
                //found page with no query in url
                R.Page.Url.path = arrHash[0].Replace("-", " ");
                R.Page.pageTitle = R.Page.pageTitle.Split(new char[] { '-', ' ', '\"' })[0] + " - " + arrHash[0].Replace("-", " ");
                R.Page.GetPageId();
                R.Page.LoadPageFromId(R.Page.pageId);
                R.Page.Render();
                Console.WriteLine("Load page: " + R.Page.pageTitle);
                return R.Page.PageRequest;
            }

            return new PageRequest();
        }

        public string KeepAlive(string save = "")
        {
            if (R.isSessionLost() == true) { return "lost"; } //check session

            if (!string.IsNullOrEmpty(save))
            { 
                SaveWebPage(save);
            }
            return "";
        }

        public void SaveWebPage(string save = "")
        {
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
                    for (int x = 0; x < R.Page.ComponentViews.Count; x++)
                    {
                        if (R.Page.ComponentViews[x].id == id) { index = x; break; }
                    }
                    switch (type)
                    {
                        case "position":
                            //update position data for a component
                            R.Page.ComponentViews[index].positionField = (string)item["data"];
                            break;
                        case "data":
                            //update data field for a component
                            R.Page.ComponentViews[index].dataField = (string)item["data"];
                            break;
                        case "arrangement":
                            //rearrange components within a panel
                            List<ComponentView> views = new List<ComponentView>();
                            List<string> comps = new List<string>();
                            foreach(string comp in item["data"])
                            {
                                comps.Add(comp);
                            }
                            int step = 0;
                            for(var i = 0; i < R.Page.ComponentViews.Count; i++)
                            {
                                if (step == 0)
                                { 
                                    //find first matching component
                                    for (var e = 0; e < comps.Count; e++)
                                    {
                                        if (comps[e] == R.Page.ComponentViews[i].id)
                                        {
                                            step = 1;
                                            break;
                                        }
                                    }
                                    if (step == 0)
                                    {
                                        //add view to new array
                                        views.Add(R.Page.ComponentViews[i]);
                                    }
                                }

                                if (step == 1)
                                {  
                                    //find matching component views and add to new array
                                    for (var e = 0; e < comps.Count; e++)
                                    {
                                        for (var u = 0; u < R.Page.ComponentViews.Count; u++)
                                        {
                                            if (R.Page.ComponentViews[u].id == comps[e])
                                            {
                                                views.Add(R.Page.ComponentViews[u]);
                                                break;
                                            }
                                        }
                                    }
                                    step = 2;
                                }

                                if(step == 2)
                                {
                                    //add rest of component views to new array
                                    matched = false;
                                    for (var e = 0; e < comps.Count; e++)
                                    {
                                        if (comps[e] == R.Page.ComponentViews[i].id)
                                        {
                                            matched = true;
                                            break;
                                        }
                                    }
                                    if (matched == false)
                                    {
                                        views.Add(R.Page.ComponentViews[i]);
                                    }
                                }
                                
                            }

                            R.Page.ComponentViews = views;
                            break;
                    }
                }

                //save page
                R.Page.Save(true);
            }
        }
    }
}
