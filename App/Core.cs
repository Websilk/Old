using System;
using System.Collections.Generic;
using Microsoft.AspNet.Http;

namespace Websilk
{
    public class Core
    {
        public String Version = "7.15.6.14";
        // #.#.#.#.#.# =  years since websilk.com domain registration (12/27/2007) [#]
        //                current year, month, day of release [#.#.#]
        //                revision of the day (optional) [#]

        public Server Server;
        public Pipeline.App App;
        public Pipeline.WebService WebService;
        public Utility.Util Util;
        public Sql Sql;
        public User User;
        public Page Page;
        public HttpContext Context;
        public HttpRequest Request;
        public HttpResponse Response;
        public ISessionCollection Session;
        public Elements Elements;

        public bool isFirstLoad = false;
        public bool isLocal = false;
        public bool isWebService = false;
        public bool useViewState = true;
        public string ViewStateId = "";

        public Core(Server server, HttpContext context, string viewstate = "", string type = "")
        {
            Server = server;
            Context = context;
            Request = context.Request;
            Response = context.Response;
            Session = context.Session;
            Sql = new Sql(this);
            Util = new Utility.Util(this);
            User = new User();

            //load viewstate
            if (useViewState == true)
            {
                ViewStateId = viewstate;
                if(ViewStateId == "") { ViewStateId = Util.Str.CreateID(); }
                if (Session["viewstate-" + ViewStateId] != null)
                {
                    ViewState vs = new ViewState();
                    vs = (ViewState)Util.Serializer.ReadObject(Util.Str.GetString(Session["viewstate-" + ViewStateId]), vs.GetType());
                    Page = vs.Page;
                    Elements = new Elements(this, Page.themeFolder);

                }
                else { Page = new Page(); }
            }else { Page = new Page(); }

            if (Session["user"] != null)
            {
                User = (User)Util.Serializer.ReadObject(Util.Str.GetString(Session["user"]), User.GetType());
            }

            //load references to Core S
            Sql.Load();
            Page.Load(this);
            User.Load(this);
            if (Session["user"] == null) {
                //initialize session (to prevent bug where session tries to initialize 
                //within S.Unload() after the response is sent to the client)
                Session["user"] = Util.Serializer.WriteObject(User);
            }

                //generate visitor id
                if (User.visitorId == "" || User.visitorId == null) { User.visitorId = Util.Str.CreateID(); }

            //detect request type & host type
            if (type == "service") { isWebService = true; }
            if (Request.Host.Value.IndexOf("localhost") >= 0 || Request.Host.Value.IndexOf("192.168.") >= 0) { isLocal = true; }
        }

        public void Unload()
        {
            Session["user"] = Util.Serializer.WriteObject(User);
            SaveViewState();
            Sql.Close();
        }

        public void SaveViewState()
        {
            if(useViewState == false) { return; }
            //save viewstate data into session, then add/update viewstate details in viewstates list
            ViewState vs = new ViewState();
            vs.Load(this);
            Session["viewstate-" + ViewStateId] = Util.Serializer.WriteObject(vs);
            
            //set default values for unused variables
            if(Page.ComponentViews == null) { Page.ComponentViews = new List<ComponentView>(); }
            if (Page.PanelViews == null) { Page.PanelViews = new List<PanelView>(); }
            if (Page.Layers == null) { Page.Layers = new List<Layer>(); }

            //get list of viewstates to update details
            structViewStateInfo vsd = new structViewStateInfo();
            ViewStates vss = new ViewStates();
            bool isfound = false;

            vsd.dateCreated = DateTime.Now;
            vsd.dateModified = DateTime.Now;
            vsd.id = ViewStateId;

            if (Util.IsEmpty(Session["viewstates"]) == false)
            {
                vss = (ViewStates)Util.Serializer.ReadObject(Util.Str.GetString(Session["viewstates"]), vss.GetType());
                if (vss.Views.Count >= 0)
                {
                    List<int> removes = new List<int>();
                    for (int x = 0; x <= vss.Views.Count - 1; x++)
                    {
                        if ((vss.Views[x].id == ViewStateId))
                        {
                            //update current vewstate modified date
                            vsd = vss.Views[x]; 
                            vsd.dateModified = DateTime.Now;
                            vss.Views[x] = vsd;
                            isfound = true;
                        }
                        else
                        {
                            //clean up expired viewstates
                            TimeSpan ts = DateTime.Now - vss.Views[x].dateModified;
                            if (ts.Minutes > 10)
                            {
                                removes.Add(x);
                                Session.Remove("viewstate-" + vss.Views[x].id);
                            }
                        }
                    }

                    if (removes.Count > 0)
                    {
                        //remove expired viewstates from list
                        int offset = 0;
                        foreach (int x in removes)
                        {
                            vss.Views.Remove(vss.Views[x - offset]);
                            offset += 1;
                        }
                    }
                }
            }

            if (isfound == false)
            {
                vss.Views.Add(vsd);
            }
            Session["viewstates"] = Util.Serializer.WriteObject(vss);
        }

        public bool isSessionLost()
        {
            if(Page.websiteTitle == "") { return true; }
            return false;
        }
    }
}
