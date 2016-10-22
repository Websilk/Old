using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Websilk
{
    public class User
    {
        [JsonIgnore]
        public Core S;

        public struct structSecurity
        {
            public int websiteId;
            public string feature; //"full" = full control
            public enumSecurity security;
        }

        public enum enumSecurity
        {
            readwrite = 1,
            read = 2
        }

        public int userId = 0;
        public int viewerId = 0;
        public string visitorId = "";
        public string email = "";
        public string fullName = "";
        public string photo = "";
        public DateTime signupDate;
        public string displayName = "";
        public int defaultPageId = 0;
        public string editorColor = "modern";

        public List<structSecurity> security;
        public List<WebsiteSecurity> websiteSecurity = new List<WebsiteSecurity>();

        public User()
        {
        }

        public void Load(Core WebsilkCore)
        {
            S = WebsilkCore;
        }


        public bool LogIn(string authId)
        {
            //IHttpConnectionFeature ip = S.Context.GetFeature<IHttpConnectionFeature>();
            SqlReader reader = S.Page.Sql.AuthLogin(authId);
            if (reader.Rows.Count > 0)
            {
                reader.Read();
                userId = reader.GetInt("userid");
                displayName = reader.Get("displayname");
                fullName = reader.Get("fullname");
                photo = reader.Get("photo");
                email = reader.Get("email");
                signupDate = reader.GetDateTime("datecreated");
                defaultPageId = reader.GetInt("defaultcp");
                viewerId = userId;


                //get user security for current website (mostly because the user might have access to over 100 websites)
                List<int> sites = new List<int>();
                if (S.Page.Sql.HasUserSecurityForWebsite(userId, S.Page.websiteId) == true){
                    sites.Add(S.Page.websiteId);
                }

                //get all security for this user (for all sites the user belongs to)
                //SqlReader reader2 = S.Page.Sql.GetUserSecurity(userId);
                //if (reader2.Rows.Count > 0)
                //{
                //    while (reader2.Read() != false)
                //    {
                //        sites.Add(reader2.GetInt("websiteid"));
                //    }
                //}
                //

                foreach (int s in sites)
                {
                    GetSecurityForWebsite(s, userId);
                }

                if (S.Page.ownerId == userId)
                {
                    //add full control security (of this website) for the user
                    SqlReader reader2 = S.Page.Sql.GetUserSecurtyForWebsitesOwned(userId);
                    if (reader2.Rows.Count > 0)
                    {
                        while (reader2.Read() != false)
                        {
                            sites.Add(reader.GetInt("websiteid"));
                        }
                    }

                    foreach (int s in sites)
                    {
                        S.User.AddSecurity(s, "full", User.enumSecurity.readwrite);
                    }

                    //check for Websilk Platform administrator (very unsafe)
                    switch (userId)
                    {
                        case 1:
                            S.User.AddSecurity(0, "full", User.enumSecurity.readwrite);
                            break;
                    }
                }

                //update database
                S.Page.Sql.SaveLoginTime(userId);
                return true;
            }
            else
            {
                return false;
            }

        }

        public void LogOut()
        {
            userId = 0;
            visitorId = "";
            email = "";
            fullName = "";
            photo = "";
            signupDate = System.DateTime.Now;
            displayName = "";
            defaultPageId = 0;
            security = new List<structSecurity>();
            websiteSecurity = new List<WebsiteSecurity>();
            S.Page.isEditable = false;
            S.Page.isDemo = false;
            S.Page.isEditorLoaded = false;
        }

        public void AddSecurity(int websiteId, string feature, enumSecurity securityLevel)
        {
            structSecurity s = new structSecurity();
            s.websiteId = websiteId;
            s.feature = feature;
            s.security = securityLevel;
            if ((security == null) == true)
                security = new List<structSecurity>();
            if (security.Exists((structSecurity x) => x.feature == feature & x.websiteId == websiteId) == false)
            {
                security.Add(s);
            }

        }

        public bool CheckSecurity(double websiteId, string feature = "full", bool nofull = false)
        {
            if ((security == null) == true)
                security = new List<structSecurity>();
            if (security.Count > 0)
            {
                foreach (structSecurity s in security)
                {
                    if (s.websiteId == websiteId)
                    {
                        if ((s.feature == "full" & nofull == false) == true | s.feature == feature)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        public WebsiteSecurity Website(int websiteId)
        {
            if (websiteSecurity.Count > 0)
            {
                for (int x = 0; x <= websiteSecurity.Count - 1; x++)
                {
                    if (websiteSecurity[x].websiteId == websiteId)
                    {
                        websiteSecurity[x].Init(this);
                        return websiteSecurity[x];
                    }

                }
            }

            //last resort, create a new website security object
            WebsiteSecurity ws = new WebsiteSecurity(this);
            ws.websiteId = websiteId;
            websiteSecurity.Add(ws);
            return websiteSecurity[websiteSecurity.Count - 1];
        }

        public void GetSecurityForWebsite(int websiteId, int userId)
        {
            SqlReader reader = S.Page.Sql.GetUserSecurityForWebsite(websiteId, userId);
            if (reader.Rows.Count > 0)
            {
                while (reader.Read() != false)
                {
                    string[] sec = reader.Get("security").Split(',');
                    List<bool> secList = new List<bool>();
                    foreach (string s in sec)
                    {
                        if (s == "1") { secList.Add(true); }
                        else { secList.Add(false); }
                    }
                    Website(websiteId).addWebsiteSecurityItem(reader.Get("feature"), secList);
                }
            }
        }

    }

    public class WebsiteSecurity
    {
        public struct structSecurityFeature
        {
            public string feature;
            public List<bool> security;
        }

        [JsonIgnore]
        private User myUser;
        public int websiteId = 0;
        public int ownerId = 0;
        public List<structSecurityFeature> securityItems;

        public struct AccessTypes
        {
            public enum Dashboard
            {
                login = 0
            }

            public enum DashboardPages
            {
                view = 0,
                edit = 1,
                create = 4
            }
        }

        public WebsiteSecurity(User u)
        {
            myUser = u;
            securityItems = new List<structSecurityFeature>();
        }

        public void Init(User u)
        {
            myUser = u;
        }

        public void addWebsiteSecurityItem(string feature, List<bool> security)
        {
            structSecurityFeature s = new structSecurityFeature();
            for (int x = 0; x <= securityItems.Count - 1; x++)
            {
                if (securityItems[x].feature == feature)
                {
                    s = securityItems[x];
                    s.security = security;
                    securityItems[x] = s;
                    return;
                }
            }
            s.feature = feature;
            s.security = security;
            securityItems.Add(s);
        }

        public bool getWebsiteSecurityItem(string feature, int index, bool tryAgain = true, bool nofull = false)
        {
            if (websiteId == 0)
                return false;
            if (ownerId == 0)
            {
                //get ownerId
                ownerId = myUser.S.Page.Sql.GetUserSecurtyOwnerForWebsite(websiteId);
            }
            if (ownerId == myUser.userId & nofull == false)
                return true;
            if (myUser.CheckSecurity(websiteId) == true & nofull == false)
                return true;
            int offset = 0;
            string f = feature;
            if (f.IndexOf("/") >= 0)
            {
                string[] arrf = feature.Split('/');
                if (arrf[0] == "dashboard")
                    f = arrf[0];
                switch (arrf[0])
                {
                    case "dashboard":
                        switch (arrf[1])
                        {
                            case "pages":
                                offset = 2;
                                break;
                            case "media":
                                offset = 8;
                                break;
                            case "analytics":
                                offset = 12;
                                break;
                            case "security":
                                offset = 13;
                                break;
                            case "settings":
                                offset = 17;
                                break;
                            case "installapps":
                                offset = 22;
                                break;
                            case "designs":
                                offset = 24;
                                break;
                        }
                        break;
                }
            }

            //check for user access
            for (int x = 0; x <= securityItems.Count - 1; x++)
            {
                if (securityItems[x].feature == f)
                {
                    return securityItems[x].security[index + offset];
                }
            }

            if (tryAgain == true & myUser.userId > 0)
            {
                //get user access from database and try to authenticate again if it fails the first time
                myUser.GetSecurityForWebsite(websiteId, myUser.userId);
                if (ownerId == myUser.userId)
                {
                    //user is owner of website and has full access
                    myUser.AddSecurity(websiteId, "full", Websilk.User.enumSecurity.readwrite);
                }
                return getWebsiteSecurityItem(feature, index, false);
            }
            return (nofull == false ? myUser.CheckSecurity(websiteId) : false);
            //last resort, check for admin access
        }
    }
}
