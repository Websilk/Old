using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Xml;
using Newtonsoft.Json;

namespace Websilk
{
    public class Page
    {
        #region "Properties"
        [JsonIgnore]
        private Core S;

        //Global Variables
        public bool useAJAX = true;
        public bool isEditable = false;
        public bool isEditorLoaded = false;
        public bool isDemo = false;
        public bool isTemplate = false;
        public bool isBot = false;
        public bool isMobile = false;
        public bool isTablet = false;
        public bool is404 = false;
        public string pageFolder = ""; //the page folder to use, either page or template folder
        public string workFolder = "";
        public int pageId = 0;
        public int demoId = 0;
        public int pageParentId = 0;
        public int pageType = 1; //1 = page, 2 = layer
        public string pageTitle = "";
        public string PageTitleForUrl = "";
        public string PageTitleForBrowserTab = "";
        public string parentTitle = "";
        public string pageKeywords = "";
        public string pageDescription = "";
        public string pageFavIcon = "";
        public DateTime pageCreated;
        public int pageSecurity = 0;
        public int pageUsersOnly = 0;
        public string pageVersion = ""; //either empty or an A/B Test id
        public bool pageLoaded = false;
        public string pageBackground = "";
        public string pageFacebook = "";
        public int websiteId = 0;
        public string websiteTitle = "";
        public int websiteType = 0;
        public bool websiteTrial = false;
        public int websitePageAccessDenied = 0;
        public int websitePage404 = 0;
        public bool accessDenied = false;
        public int ownerId = 0;
        public int themeId = 0;
        public int themeOwner = 0;
        public string themeName = "";
        public string themeFolder = "";
        public string prevThemeFolder = "";
        public string googleWebPropertyId = "";


        //Javascript
        [JsonIgnore]
        protected string[] postJSnames = new string[] { }; //used so duplicate JS doesn't get added to the page
        [JsonIgnore]
        public string[] postJScode = new string[] { }; //array of javascript to add
        public string[] postJSonce = new string[] { }; //used so duplicate JS that loads only once doesn't get added to the page
        [JsonIgnore]
        public string postJS = ""; //used to compile javascript for postback response
        [JsonIgnore]
        public string postJSLast = ""; //added to the end of postJS

        //CSS
        [JsonIgnore]
        public string[] postCSS = new string[] { }; //array of CSS to add
        [JsonIgnore]
        protected string[] postCSSnames = new string[] { }; //used so duplicate CSS doesn't get added to the page

        //Validation
        [JsonIgnore]
        private bool pageCssChanged = false;
        [JsonIgnore]
        private bool isPageLoaded = false;

        //HTML
        [JsonIgnore]
        private string themeHtml = ""; //generated HTML for the theme

        //Page Title
        [JsonIgnore]
        private string pageEditorTitle = ""; //beginning of title (in edit-mode)
        [JsonIgnore]
        private string pageEditorTitleEnd = " - Websilk Page Editor"; //end of title (in edit-mode)

        //Request Url Info
        public struct structUrl
        {
            public string path;
            public string host;
            public string query;
        }
        public structUrl Url;

        //Page Elements
        [JsonIgnore]
        private List<Panel> bodyPanels;
        [JsonIgnore]
        private List<Component> Components = new List<Component>();
        public List<Layer> Layers;
        public List<ComponentView> ComponentViews;
        public List<PanelView> PanelViews;

        //Web Services
        [JsonIgnore]
        public PageRequest PageRequest;

        //SQL
        [JsonIgnore]
        public SqlClasses.Page SqlPage;

        //initialize class
        public Page()
        {
        }

        public void Load(Core WebsilkCore)
        {
            S = WebsilkCore;
            SqlPage = (SqlClasses.Page)S.Sql.Class["Page"];
        }
        #endregion

        #region "Web Page"

        public void GetPageUrl()
        {
            Url.query = "";
            string path = S.Request.Path.ToString().ToLower().Replace(" ", "+");
            string[] arr = null;
            if(path.Substring(0,1) == "/") { path = path.Substring(1); }
            if(path != "")
            {
                arr = path.Split(new char[] { '/' });
                Url.path = arr[0].Replace("-", " ");
                if(arr.Length > 1)
                {
                    Url.query = path.Split(new char[] { '/' }, 2)[1]; ;
                }
            }else
            {
                Url.path = "home";
            }

            //get host
            Url.host = S.Request.Host.ToString();
            int start = 0;
            start = Url.host.IndexOf("//");
            if (start >= 0)
            {
                start = Url.host.IndexOf('/', start + 3);
                if (start >= 0)
                {
                    Url.host = Url.host.Substring(0, start);
                }
            }
        }

        public void GetPageId(bool skipDomain = false)
        {
            string domain = S.Util.Str.GetDomainName(S.Request.Host.ToString());
            string pid = S.Request.Query["pageid"];
            if (!String.IsNullOrEmpty(pid))
            {
                pageId = int.Parse(S.Request.Query["pageid"].ToString());
                return;
            }
            if(skipDomain == false)
            {
                pageId = GetPageIdByDomainName(Url.host, Url.path);
            }
        }

        public int GetPageIdByDomainName(string domainName, string pagetitle = "")
        {
            //try to get the sub domain name
            {
                string Domain = "";
                string subDomain = "";
                string[] domains = S.Util.Str.GetDomainParts(domainName);
                Domain = domains[1];
                subDomain = domains[0];
                if (string.IsNullOrEmpty(Domain)) {Domain = domainName; }
                object pid;
                

                //try to get pageId based on domain name
                if (!string.IsNullOrEmpty(pagetitle))
                {
                    if (pagetitle == "websilk")
                    {
                        //get pageid from web site home page
                        pid = SqlPage.GetHomePageIdFromDomain(Domain);
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(subDomain))
                        {
                            //get pageid from web site domain name & page title
                            pid = SqlPage.GetPageIdFromDomainAndTitle(Domain, pagetitle);
                        }
                        else
                        {
                            //get pageid from web site domain & sub domain & page title
                            pid = SqlPage.GetPageIdFromSubDomainAndTitle(Domain, subDomain, pagetitle);
                        }
                    }

                }
                else
                {
                    if (string.IsNullOrEmpty(subDomain))
                    {
                        //get pageid from web site home page
                        pid = SqlPage.GetHomePageIdFromDomain(Domain);
                    }
                    else
                    {
                        //get pageid from web site sub domain home page
                        pid = SqlPage.GetHomePageIdFromSubDomain(Domain, subDomain);

                    }
                }
                if (S.Util.IsEmpty(pid) == false && S.Util.Str.IsNumeric(pid))
                {
                    return (int)pid;
                }else {
                    return 0;
                }
            }
        }

        public SqlReader GetPageInfoByDomainName(string domainName, string pagetitle = "")
        {
            //try to get the sub domain name
            {
                string Domain = "";
                string subDomain = "";
                string[] domains = S.Util.Str.GetDomainParts(domainName);
                Domain = domains[1];
                subDomain = domains[0];
                if (string.IsNullOrEmpty(Domain)) { Domain = domainName; }
                string title = pagetitle;
                if(title.ToLower() == "dashboard") {
                    if(S.User.userId == 0)
                    {
                        title = "login";
                    }
                    else
                    {
                        title = "home";
                    }
                }

                //try to get pageId based on domain name
                if (!string.IsNullOrEmpty(pagetitle))
                {
                    if (title == "websilk")
                    {
                        //get pageid from web site home page
                        return SqlPage.GetPageInfoFromDomain(Domain);
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(subDomain))
                        {
                            //get pageid from web site domain name & page title
                            return SqlPage.GetPageInfoFromDomainAndTitle(Domain, title);
                        }
                        else
                        {
                            //get pageid from web site domain & sub domain & page title
                            return SqlPage.GetPageInfoFromSubDomainAndTitle(Domain, subDomain, title);
                        }
                    }

                }
                else
                {
                    if (string.IsNullOrEmpty(subDomain))
                    {
                        //get pageid from web site home page
                        return SqlPage.GetPageInfoFromDomain(Domain);
                    }
                    else
                    {
                        //get pageid from web site sub domain home page
                        return SqlPage.GetPageInfoFromSubDomain(Domain, subDomain);
                    }
                }
            }
        }

        public SqlReader GetPageInfoByPageId()
        {
            return SqlPage.GetPageInfoFromPageId(pageId);
        }

        public SqlReader GetPageInfoFromUrlPath()
        {
            GetPageId(true);
            if(pageId == 0)
            {
                //get page Id AND page Info in one query
                return GetPageInfoByDomainName(Url.host, Url.path);

            }else
            {
                //get page Info from pageId
                return GetPageInfoByPageId();
            };
        }

        public void LoadPageInfo(int pId)
        {
            if(pId <= 0) { return; }
            LoadPageInfo(SqlPage.GetPageInfoFromPageId(pId));
        }

        public void LoadPageInfo(SqlReader reader)
        {
            int oldThemeId = themeId;

            if (reader.Rows.Count > 0)
            {
                reader.Read();
                pageId = reader.GetInt("pageId");
                ownerId = reader.GetInt("ownerId");
                pageSecurity = reader.GetInt("security");
                pageUsersOnly = reader.GetInt("usersonly");
                pageTitle = reader.Get("title");
                pageCreated = reader.GetDateTime("datecreated");
                themeId = reader.GetInt("themeid");
                themeOwner = reader.GetInt("themeowner");
                themeName = reader.Get("themename");
                websiteId = reader.GetInt("websiteid");
                websiteTitle = reader.Get("websitetitle");
                websiteType = reader.GetInt("websitetype");
                if (websiteType < 0) { websiteType = 1; }

                websitePageAccessDenied = reader.GetInt("pagedenied");
                websitePage404 = reader.GetInt("page404");
                pageDescription = S.Sql.Decode(reader.Get("description"));
                //websiteTrial = reader.GetBool("statustype");
                googleWebPropertyId = reader.Get("googlewebpropertyid");
                //LoadBackground(reader.Get("pagebackground"])); //page
                //else LoadBackground(reader.Get("background"])); //website
                pageParentId = reader.GetInt("parentid");
                if (pageParentId < 0) { pageParentId = 0; }
                parentTitle = reader.Get("parenttitle");

                string pageCss = "";
                //get CSS for whole web site
                if (isPageLoaded == false | pageCssChanged == true)
                {
                    pageCss = reader.Get("websitecss");
                }
                pageCss = reader.Get("css");

                string favIcon = reader.Get("icon");
                if (S.isWebService == true)
                {
                    if (favIcon != pageFavIcon)
                    {
                        //change favicon via JS
                    }
                }
                else
                {
                    pageFavIcon = favIcon;
                }

                pageFacebook = "";
                if (reader.Get("photo") != "")
                {
                    pageFacebook = "<meta id=\"metafbimg\" property=\"og:image\" content=\"" + Url.host + reader.Get("photo") + "\" />";
                }
                pageFacebook += "<meta id=\"metafbtitle\" property=\"og:title\" content=\"" + S.Util.Str.GetPageTitle(pageTitle) + "\" />" +
                                "<meta id=\"metafbsite\" property=\"og:site_name\" content=\"" + S.Util.Str.GetWebsiteTitle(pageTitle) + "\" />";
            }

            if (pageId <= 0)
            {
                //no page loaded, show 404
                LoadPage("404");
            }

            if (reader.Rows.Count > 0)
            {
                //finished loading page information, so check for security & core changes made from info
                if (demoId > 0)
                {
                    if (demoId == pageId && S.Request.QueryString.ToString().IndexOf("?demo") >= 0)
                    {
                        isDemo = true;
                        S.User.viewerId = ownerId;
                        isEditable = true;
                    }
                    else
                    {
                        demoId = 0;
                        isEditable = false;
                    }

                }
                else if (S.Request.QueryString.ToString().IndexOf("?demo") >= 0)
                {
                    //no demo was launched from WebsilkScript, 
                    //so check to see if this website is a template website 
                    //(which supports demo of any public page)
                    if (websiteType == 2)
                    {
                        isDemo = true;
                        S.User.viewerId = ownerId;
                        isEditable = true;
                        isTemplate = true;
                    }
                    else
                    {
                        demoId = 0;
                        isEditable = false;
                    }
                }

                if (isDemo == true)
                {
                    //load demo tutorial
                }
                else
                {
                    if (S.User.userId > 0)
                    {
                        //user is logged in, check security for page editing
                        S.User.viewerId = S.User.userId;
                        if (S.User.Website(websiteId).getWebsiteSecurityItem("dashboard/pages", 4))
                        {
                            isEditable = true;
                        }
                    }
                }

                //don't let bot / crawler edit page
                if (isBot == true) { isEditable = false; }


                if (!string.IsNullOrEmpty(S.Request.Query["a"]) & S.User.viewerId < 1)
                {
                    //authenticate login for taking a screenshot
                    if (S.Page.SqlPage.AuthLoginForScreenshot(S.Request.Query["a"], websiteId, (S.Request.Query["ak"] == "0" ? 0 : 1)) == "pass")
                    {
                        S.User.viewerId = ownerId;
                        S.User.userId = ownerId;
                        RegisterJS("authjs2", "var evscreenshot = 1;");
                    }
                }

                if (pageSecurity == 1 && (ownerId != S.User.viewerId || isDemo == true))
                {
                    //don't allow anyone but the website owner to view this page

                }

                if (isEditable == true || isDemo == true)
                {
                    PageTitleForBrowserTab = pageEditorTitle + websiteTitle + pageEditorTitleEnd;
                }

                if (themeFolder == "")
                {
                    //load website theme from request query string
                    if (!string.IsNullOrEmpty(S.Request.Query["lid"]))
                    {
                        //LoadThemeIdFromQuery();
                    }
                    themeFolder = "/content/themes/" + themeName + "/";
                    if (S.isFirstLoad == true)
                    {
                        LoadTheme();
                    }
                }
                else
                {
                    if (oldThemeId != themeId && S.isFirstLoad == false)
                    {
                        themeFolder = "/content/themes/" + themeName + "/";
                    }
                }

                //setup page folder
                if (pageType == 1)
                {
                    pageFolder = "/content/websites/" + websiteId + "/pages/" + pageId + "/";
                }
                else
                {
                    pageFolder = "/content/websites/" + websiteId + "/layers/" + pageId + "/";
                }

                //setup work folder
                workFolder = pageFolder;

            }
        }

        public void LoadTheme()
        {
            //load website theme into Websilk
            if (themeFolder == prevThemeFolder) { return; }
            prevThemeFolder = themeFolder;

            S.Elements = new Elements(S, themeFolder);

            if (S.isFirstLoad == true)
            {
                //load CSS for theme
                S.App.scaffold.Data["theme-css"] = themeFolder + "style.css?v=" + S.Version;
            }
            else
            {
                //load CSS via javascript instead
                RegisterJS("cssfile", "$('#themeCss').href = '" + themeFolder + "style.css?v=" + S.Version + "';");
            }

            int[] start = new int[3];
            string fileHtml = null;
            string fileWebsite = "";
            string headWebsite = "";
            string footWebsite = "";
            string urlDefaultHtm = S.Server.path(themeFolder + "theme.html");
            string urlWebsiteHtm = S.Server.path("/content/websites/" + websiteId + "/website.html");

            //get theme HTML
            if (S.Server.Cache.ContainsKey(themeFolder + "theme.html") == true)
            {
                fileHtml = S.Server.Cache[themeFolder + "theme.html"].ToString();
            }
            else
            {
                fileHtml = File.ReadAllText(urlDefaultHtm);
                S.Server.Cache[themeFolder + "theme.html"] = fileHtml;
            }

            //get website HTML
            if (S.Server.Cache.ContainsKey("/content/websites/" + websiteId + "/website.html") == true)
            {
                fileWebsite = S.Server.Cache["/content/websites/" + websiteId + "/website.html"].ToString();
            }
            else
            {
                if (File.Exists(urlWebsiteHtm) == true)
                {
                    fileWebsite = File.ReadAllText(urlWebsiteHtm);
                }
                S.Server.Cache["/content/websites/" + websiteId + "/website.html"] = fileWebsite;
            }
            if (!string.IsNullOrEmpty(fileWebsite))
            {
                start[0] = fileWebsite.IndexOf("{{body}}");
                if (start[0] >= 0)
                {
                    headWebsite = fileWebsite.Substring(0, start[0]);
                    footWebsite = fileWebsite.Substring(start[0] + 8);
                }
                fileHtml = headWebsite + fileHtml + footWebsite;
            }

            int i = -1;
            List<string> themeHtm = new List<string>();
            start[2] = 0;
            do
            {
                start[0] = fileHtml.IndexOf("{{", start[2]);
                if (start[0] >= 0)
                {
                    //found a panel
                    start[1] = fileHtml.IndexOf("}}", start[0] + 2);
                    if (start[1] >= 0)
                    {
                        i += 1;

                        //add chunck of theme html to the page
                        string htm = "";
                        htm = fileHtml.Substring(start[2], start[0] - start[2]);
                        start[2] = start[1] + 2;

                        //create new panel
                        Panel newPanel = new Panel(S);

                        string name = fileHtml.Substring(start[0] + 2, start[1] - (start[0] + 2));
                        newPanel.name = name;
                        newPanel.id = "panel" + newPanel.name.Replace(" ", "");

                        //add attributes to the panel
                        newPanel.isPartOfTheme = true;

                        htm += "{{panel-" + newPanel.name.ToLower().Replace(" ", "") + "}}";

                        themeHtm.Add(htm);

                        //add panel to list
                        AddPanel(newPanel);

                        //add panel view to list
                        newPanel.AddPanelView();
                    }
                    else
                    {
                        break;
                    }
                }
                else
                {
                    break;
                }
            } while (true);

            themeHtm.Add(fileHtml.Substring(start[2]));
            themeHtml = String.Join("", themeHtm.ToArray());
        }

        public XmlDocument LoadPageXml(int pid, string pFolder, XmlDocument pageLoadedXml = null)
        {
            if (pid <= 0) { return null; }
            XmlDocument myXmlPage = new XmlDocument();
            string pageName = "page";
            if (!string.IsNullOrEmpty(pageVersion))
                pageName = "page_" + pageVersion;
            string pageFilePath = pFolder + pageName + ".xml";

            if ((pageLoadedXml == null) == false)
            {
                myXmlPage = pageLoadedXml;
            }
            else
            {
                if (File.Exists(S.Server.path(pageFilePath)) == false & File.Exists(S.Server.path(pFolder + "page.xml")) == true)
                {
                    File.Copy(S.Server.path(pFolder + "page.xml"), S.Server.path(pageFilePath));
                }


                if (ownerId == S.User.userId | S.User.Website(websiteId).getWebsiteSecurityItem("dashboard/pages", 4) == true)
                {
                    //attempt to load the unpublished version of this page
                    if (S.Server.Cache.ContainsKey(pFolder + pageName + "_edit.xml"))
                    {
                        //load from memory
                        myXmlPage =(XmlDocument)S.Server.Cache[pFolder + pageName + "_edit.xml"];
                    }
                    else
                    {
                        if (File.Exists(S.Server.path(pFolder + pageName + "_edit.xml")) == true)
                        {
                            //load from disc
                            myXmlPage.LoadXml(File.ReadAllText(S.Server.path(pFolder + pageName + "_edit.xml")));
                            S.Server.Cache[pFolder + pageName + "_edit.xml"] = myXmlPage;
                        }
                        else
                        {
                            if (S.Server.Cache.ContainsKey(pageFilePath))
                            {
                                //load from memory
                                myXmlPage =(XmlDocument)S.Server.Cache[pageFilePath];
                            }
                            else
                            {
                                //load from disc
                                if (File.Exists(S.Server.path(pageFilePath)) == true)
                                {
                                    myXmlPage.LoadXml(File.ReadAllText(S.Server.path(pageFilePath)));
                                    S.Server.Cache[pageFilePath] = myXmlPage;
                                }

                            }
                        }
                    }
                }
                else
                {
                    if (S.Server.Cache.ContainsKey(pageFilePath))
                    {
                        //load from memory
                        myXmlPage = (XmlDocument)S.Server.Cache[pageFilePath];
                    }
                    else
                    {
                        //load from disc
                        if (File.Exists(S.Server.path(pageFilePath)) == false)
                        {
                            //create new page
                            myXmlPage.LoadXml("<theme></theme>");
                            FileStream fs = new FileStream(S.Server.path(pageFilePath), FileMode.CreateNew);
                            myXmlPage.Save(fs);
                        }
                        else
                        {
                            myXmlPage.LoadXml(File.ReadAllText(S.Server.path(pageFilePath)));
                        }

                        S.Server.Cache[pageFilePath] = myXmlPage;
                    }
                }
            }
            return myXmlPage;
        }

        public void LoadPage(string pageFile, int ptype, int pid, string pname, bool saveInterface = true, bool noloadLayers = false, bool keepPreviousPageLoaded = false, XmlDocument pageLoadedXml = null)
        {
            string myJs = "";

            if (pid <= 0) { return; }
            if (string.IsNullOrEmpty(pname)) { return; }

            if (pageUsersOnly == 1 & S.User.userId > 1 & ptype == 1)
            {
                //check to see if this user is a user of the web site
                if (S.User.Website(websiteId).getWebsiteSecurityItem("dashboard/pages", 4) == false)
                {
                    //user doesn't have permission
                    LoadPage("Access Denied");
                    return;
                }
            }
            else if (pageUsersOnly == 1 & ptype == 1)
            {
                //user not logged in
                LoadPage("Access Denied");
                return;
            }
            
            if (ptype == 2)
            {
                if (!string.IsNullOrEmpty(S.Request.Query["noload"]))
                {
                    string[] nl = S.Request.Query["noload"].ToString().ToLower().Split('\"');
                    for (int x = 0; x <= nl.Length - 1; x++)
                    {
                        //don't load this content layer, since the querystring says not to
                        if (nl[x] == pname.ToLower())
                            return;
                    }
                }
            }

            //check to see if page is already loaded
            if ((Layers == null) == false)
            {
                for (var x = 0; x <= Layers.Count - 1; x++)
                {
                    if (Layers[x].Id == pid)
                    {
                        return; //page already loaded
                    }
                }
            }


            //////////////////////////////////////////////////////
            //update  page settings
            string pFolder = pageFile.Replace("page.xml", "");
            if (ptype == 1)
            {
                //setup page request
                PageRequest = new PageRequest();
                PageRequest.pageId = pid;

                //setup page title
                string pt = S.Util.Str.GetPageTitle(pageTitle).Replace("-", " ");
                string wt = S.Util.Str.GetWebsiteTitle(pageTitle);
                pageId = pid;
                pageFolder = pFolder;
                pageTitle = wt + " - " + pt;
                Url.path = pt.Trim().ToLower();
                myJs += "S.website.title = \"" + wt + "\"; S.website.id=" + websiteId + ";";
                if(S.isWebService == false)
                {
                    myJs += "S.page.title = \"" + pt.ToLower() + "\"; S.page.id=" + pageId + ";";
                }

                //hide page loading div
                string newTitle = pageTitle;
                if (isEditable == true)
                {
                    newTitle = pageEditorTitle + pageTitle + pageEditorTitleEnd;
                }
                if (S.isWebService == true)
                {
                    PageRequest.pageTitle = pageTitle;
                }
                else
                {
                    S.App.scaffold.Data["title"] = pageTitle;
                }

            }

            //////////////////////////////////////////////////////
            //initialize page editor (rare occurance)
            if (isEditable == true)
            {
                if (isEditorLoaded == false)
                {
                    if (S.isWebService == true)
                    {
                        Editor editor = new Editor(S);
                        string[] result = editor.LoadEditor();
                        PageRequest.editor = result[0];
                        PageRequest.js += result[1];
                    }
                }
            }


            //////////////////////////////////////////////////////
            //Load XML page
            XmlDocument myXmlPage = LoadPageXml(pid, pFolder);

            if (myXmlPage == null)
            {
                //page.xml does not exist, wipe the page clean
                if (ptype == 1)
                    CleanLayers(null, pid);
            }

            //////////////////////////////////////////////////////
            //load custom CSS onto the page
            if (ptype == 1)
            {
                if (!string.IsNullOrEmpty(googleWebPropertyId))
                {
                    //GoogleLogPageRequest()
                }
                string myCSS = "";
                XmlNode nodeCSS = myXmlPage.SelectSingleNode("//CSS");
                if ((nodeCSS == null) == false)
                {
                    myCSS = nodeCSS.FirstChild.InnerText + "\n";

                    if (S.isWebService == true)
                    {
                        PageRequest.css += myCSS;
                    }
                    else
                    {
                        RegisterCSS("pageCss", myCSS);
                    }

                }

                //reset undo redo engine
                if (isEditable == true)
                {
                    //myJs &= "undoRedo = [];AddUndoRedoAction('','all');"
                    //ClearUndoRedo()
                }

                if (S.isFirstLoad == true) {
                    
                }
                else
                {

                }
            }

            //reset JS layers cache
            myJs += "S.layers.cache = [];S.layers.add(" + pid + ",'" + pageTitle.Split(new char[] { '-', ' ', '\"' })[1] + "'," + ptype + ");";

            //////////////////////////////////////////////////////
            //add page to the list of layers
            if (saveInterface == true)
            {
                string newtitle = pageTitle.Split(new char[] { '-', ' ', '\"' })[1];
                if (string.IsNullOrEmpty(pname) & ptype == 2 & isEditable == true)
                {
                    //get the lost layer name
                    newtitle = S.Sql.ExecuteScalar("SELECT title from pageinterfaces WHERE interfaceid=" + pid).ToString().Split(new char[] { '-', ' ', '\"' })[1];
                }
                else if (!string.IsNullOrEmpty(pname) & ptype == 2)
                {
                    newtitle = pname;
                }
                Layer newItem = new Layer();
                newItem.Id = pid;
                newItem.Title = newtitle;
                if ((Layers == null) == true) { Layers = new List<Layer>(); }
                Layers.Add(newItem);
            }

            ////////////////////////////////////////////////////
            //Load Layers from page.xml
            XmlNodeList myLayers = myXmlPage.SelectNodes("//layer");
            if (noloadLayers == false)
            {
                int intId = 0;
                bool doesExist = false;
                string newtitle = "";
                if (myLayers.Count > 0)
                {
                    for (int i = 0; i <= myLayers.Count - 1; i++)
                    {
                        intId = int.Parse(myLayers[i].Attributes["id"].Value);
                        doesExist = false;
                        if (Layers.Count > 0)
                        {
                            for (int x = 0; x <= Layers.Count - 1; x++)
                            {
                                if (intId == Layers[x].Id)
                                    doesExist = true;
                            }
                        }
                        newtitle = S.Util.Str.Capitalize(myLayers[i].Attributes["name"].Value.Replace("-", " "));

                        //add layer to JS layers cache
                        myJs += "S.layers.add(" + intId + ",'" + newtitle + "',2);";

                        if (doesExist == false)
                        {
                            //layer hasn't been loaded yet, so load it
                            LoadLayer(intId, newtitle);
                        }
                    }
                }
            }

            ////////////////////////////////////////////////////
            //Next, Load Components for each  Panel from page.xml
            XmlNodeList myPanels = myXmlPage.SelectNodes("//panel");
            if (myPanels.Count >= 0)
            {
                //Load components for this page
                for (int i = 0; i <= myPanels.Count - 1; i++)
                {
                    LoadPageComponents(myPanels[i], i + 1, myXmlPage, pageFile, ptype, 1, pid);
                }
            }
            else if (myPanels.Count >= 0)
            {
                //refresh components already loaded on this page
                //RefreshComponents(pid);
            }

            if (ptype == 2)
            {
                //add interface to the log
                //S.Log.AddInterface();
            }

            ////////////////////////////////////////////////////
            //Remove Unused Layers
            //if any components are loaded from an interface that isn't a part of this page,
            //remove those components immediately, and clean up the interface array
            if (ptype == 1)
            {
                CleanLayers(myLayers, pid);
                isPageLoaded = true;
                pageLoaded = true;
                //inform any components that were NOT just loaded
                GetAllComponents();
                if (Components.Count >= 0)
                {
                    for (int x = 0; x <= Components.Count - 1; x++)
                    {
                        if ((Components[x] == null) == false)
                        {
                            if (Components[x].justLoaded == false)
                            {
                                Components[x].LoadedNewPage();
                            }
                        }
                    }
                }
            }

            //////////////////////////////////////////////////////
            //update the Editor
            if (ptype == 1 & S.isWebService == false)
            {
                myJs += "S.editor.selectedLayerId = '" + pageId + "';";
            }


            if (!string.IsNullOrEmpty(myJs))
            {
                RegisterJS("loadpage" + pageId, myJs);
            }

            if (ptype == 1)
            {
                //execute Page Load Complete event for all components
                GetAllComponents();
                foreach (Component c in Components)
                {
                    if ((c == null) == false)
                        c.PageLoadComplete();
                }
            }
        }

        public void LoadPage(string pageName)
        {
            switch (pageName)
            {
                case "Access Denied":
                    break;

                case "404":
                    break;
            }
        }

        public void LoadPageFromId(int id)
        {
            LoadPageInfo(id);
            LoadPage("/content/websites/" + websiteId + "/pages/" + id + "/page.xml", 1, id, pageTitle);
        }

        protected void LoadPageComponents(XmlNode panelXml, int panelIndex, XmlDocument myXmlPage, string pageFile, int ptype, int panelType, int pid)
        {
            if (panelXml == null){ return; }
            string panelName = S.Util.Xml.GetAttribute("name", panelXml);

            //get panel object that will load the list of components from xml
            Panel myPanel;
            if (string.IsNullOrEmpty(panelName))
            {
                myPanel = GetPanelByName("body");
            }
            else
            {
                myPanel = GetPanelByName(panelName);
            }

            //find all the components within the  panel
            XmlNodeList myComponents = panelXml.ChildNodes;
            Component comp = default(Component);
            bool wasDenied = accessDenied;
            string compName = "";
            string position = "";
            string css = "";
            string content = "";
            string design = "";
            string js = "";
            string wf = pageFile.Replace("/page.xml", "/"); //work folder
            int zIndex = 1;
            int finalIndex = 1;
            accessDenied = false;
            if (myComponents.Count > 0)
            {
                foreach (XmlNode c in myComponents)
                {
                    string id = "";
                    //component id
                    if ((c.Attributes["id"] == null) == false)
                    {
                        id = c.Attributes["id"].Value;
                    }
                    else
                    {
                        id = S.Util.Str.CreateID();
                    }

                    //z-index
                    if ((c.Attributes["index"] == null) == false)
                    {
                        finalIndex = int.Parse(c.Attributes["index"].Value);
                    }
                    else
                    {
                        finalIndex = zIndex;
                    }

                    compName = c.Attributes["name"].Value;
                    position = c.SelectSingleNode("position").FirstChild.InnerText;
                    css = c.SelectSingleNode("css").FirstChild.InnerText;
                    content = c.SelectSingleNode("content").FirstChild.InnerText;
                    design = c.SelectSingleNode("design").FirstChild.InnerText;

                    comp = LoadComponent(compName, content, design, id, myPanel, wf, zIndex, pid, ptype, false , position, css);
                    if(comp != null)
                    {
                        if (comp != null)
                        {
                            PageComponent newC = new PageComponent();
                            newC.id = comp.id;
                            newC.panelClassId = panelName;
                            newC.Component = comp;
                            PageRequest.components.Add(newC);
                        }
                        myPanel.Components.Add(comp);
                    }
                    zIndex += 1;
                }

            }
            accessDenied = wasDenied;
            if(js != "")
            {
                RegisterJS("components" + pid + panelName, js);
            }
        }

        public Component LoadComponent
            (string componentId, string content = "", string design = "", string id = "", Panel myPanel = null, string workFolder = "", 
            int cIndex = 1, int pageid = 0, int pageType = 1, bool isDropped = false, string position = "", string customCss = "", int addIndex = -1, string duplicateId = "")
        {
            if (myPanel == null){return null;}

            //load component from class
            string cFolder = S.Util.Str.Capitalize(componentId.Replace("-", "/"));
            string className = "Websilk.Components." + cFolder.Replace("/",".");
            Type type = Type.GetType(className, false, true);
            if(type == null) { return null; }
            Component component = (Component)Activator.CreateInstance(type, new object[] { S });
            if (component == null) { return null; }
            string css = "";
            string newCss = customCss;
            string newPos = position;

            if (string.IsNullOrEmpty(id))
            {
                id = S.Util.Str.CreateID();
            }

            if (duplicateId != "")
            {
                //duplicate existing component
                ComponentView viewDup = S.Page.GetComponentViewById(duplicateId);
                if(viewDup == null) { return null; }
                component.LoadFromComponentView(viewDup);
                component.id = id;
                newPos = component.positionField;
                newCss = component.cssField;
            }
            else
            {
                //load component data fields
                component.dataField = content;
                component.designField = design;
                component.positionField = newPos;
                component.cssField = newCss;

                //set up component properties
                component.panelId = myPanel.name;
                component.index = cIndex;
                component.layerId = pageid;
                component.pageId = pageid;
                component.type = enumComponentType.component;
                component.id = id;
                component.isDropped = isDropped;
                component.justLoaded = true;

                if (pageType == 1)
                {
                    component.workfolder = "/content/websites/" + websiteId + "/pages/" + pageid + "/";
                }
                else
                {
                    component.workfolder = "/content/websites/" + websiteId + "/layers/" + pageid + "/";
                }

                if (componentId.ToLower() == "panel")
                {
                    component.type = enumComponentType.panel;
                }
                else if (myPanel.isPartOfTheme == false)
                {
                    component.type = enumComponentType.child;
                }
            }
            
            //load position CSS properties
            if (string.IsNullOrEmpty(newPos))
            {
                //generate position (for HD screen size) if position is empty
                //x-type, x-offset, x-extra, y-type, y-offset, y-extra, width, width-type, height, height-type, padding
                newPos = "||||c,0,,t,0,," + 
                    component.defaultWidth + "," + component.defaultWidthType + "," + 
                    component.defaultHeight + "," + component.defaultHeightType + "," +
                    "20px 20px 20px 20px";
                component.positionField = newPos;
            }

            if (!string.IsNullOrEmpty(newPos))
            {
                string[] pos = newPos.Split('|');
                string[] cCss = { "","","","","" };
                if (!string.IsNullOrEmpty(newCss))
                {
                    cCss = newCss.Split('|');
                }

                if(pos.Length == 5)
                { 
                    //HD screen first
                    if(pos[4] != "" || cCss[4] != "")
                    {
                        css += GetCssForPosition(component, 4, pos[4]);
                    }

                    //Desktop screen
                    if (pos[3] != "" || cCss[3] != "")
                    {
                        css += GetCssForPosition(component, 3, pos[3]);
                    }

                    //Tablet screen
                    if (pos[2] != "" || cCss[2] != "")
                    {
                        css += GetCssForPosition(component, 2, pos[2]);
                    }

                    //Mobile screen
                    if (pos[1] != "" || cCss[1] != "")
                    {
                        css += GetCssForPosition(component, 1, pos[1]);
                    }

                    //Cell screen
                    if (pos[0] != "" || cCss[0] != "")
                    {
                        css += GetCssForPosition(component, 0, pos[0]);
                    }

                }
            }

            if(css != ""){
                RegisterCSS("c" + id, css);
            }

            RegisterJS("compload" + id,
                "S.components.add('" +
                        id + "', '" +
                        componentId + "', '" +
                        newPos + "', '" +
                        newCss + "', '" +
                        component.contentName + "'" +
                        (component.instanceLimit > 0 ? "," + component.instanceLimit : ",null") +
                        (component.jsDuplicate != "" ? "," + component.jsDuplicate : "") +
                        ");");

            //finish loading component
            component.LoadDataArrays();
            component.Load();

            //load component.js once
            string jsname = "compjs-";
            string jsp = "";
            if (CheckJSOnceIfLoaded(jsname + cFolder) == false)
            {
                if (S.Server.Cache.ContainsKey(jsname + cFolder) == true & S.isLocal == false) //only cache if on live server
                {
                    //load from cache
                    jsp = S.Server.Cache[jsname + cFolder].ToString();
                }
                else
                {
                    //load from file
                    jsp = File.ReadAllText(S.Server.path("/app/components/" + cFolder + "/component.js"));
                    if (S.isLocal == false)
                    {
                        //save to cache
                        S.Server.Cache[jsname + cFolder] = jsp;
                    }
                }
                if(jsp != "")
                {
                    S.Page.RegisterJSonce(jsname + cFolder, jsp);
                    jsp = "";
                }
            }

            if(S.Page.isEditable == true)
            {
                //load editor.js once
                jsname = "compeditorjs-";
                if (CheckJSOnceIfLoaded(jsname + cFolder) == false)
                {
                    if (S.Server.Cache.ContainsKey(jsname + cFolder) == true & S.isLocal == false) //only cache if on live server
                    {
                        //load from cache
                        jsp = S.Server.Cache[jsname + cFolder].ToString();
                    }
                    else
                    {
                        //load from file
                        jsp = File.ReadAllText(S.Server.path("/app/components/" + cFolder + "/editor.js"));
                        
                        if (S.isLocal == false)
                        {
                            //save to cache
                            S.Server.Cache[jsname + cFolder] = jsp;
                        }
                    }
                    if(jsp != "")
                    {
                        S.Page.RegisterJSonce(jsname + cFolder + "editor", jsp);
                        jsp = "";
                    }
                }
            }
            

            GetAllComponents();

            if(addIndex >= 0)
            {
                //add component at specific index within arrays
                //Components.Insert(addIndex, component);
                ComponentViews.Insert(addIndex, component.GetComponentView());
            }
            else
            {
                //add component to end of arrays
                //Components.Add(component);
                ComponentViews.Add(component.GetComponentView());
            }
            
            
            return component;
        }

        public Component LoadComponentFromView(ComponentView view)
        {
            string className = "Websilk.Components." + view.name.Replace("-", ".");
            Type type = Type.GetType(className, false, true);
            if (type == null) { return null; }
            Component component = (Component)Activator.CreateInstance(type, new object[] { S });
            component.LoadFromComponentView(view);
            component.LoadDataArrays();
            component.Load();
            return component;
        }

        private string GetCssForPosition(Component component, int level, string position, string extraCss = "")
        {
            string css = "";
            if (!string.IsNullOrEmpty(position))
            {
                string[] pos = position.Split(',');
                //x-type, x-offset, x-extra, y-type, y-offset, y-extra, width, width-type, height, height-type, padding
                switch (pos[0]) //x-type
                {
                    case "l":
                        css += "float:left; display:block;";
                        break;

                    case "c":
                        if (pos[2] != "1") {
                          css += "float:none; display:inline-block;";
                        } else {
                          css += "float:none; display:block;";
                        }
                        break;

                    case "r":
                        css += "float:right; display:block;";
                        break;
                }
                //x-offset
                if(!string.IsNullOrEmpty(pos[1])) {
                    css += "left:" + pos[1] + "px; ";
                }
                else
                {
                    css += "left:0px; ";
                }

                //x-extra (force new line)
                if (pos[2] == "1")
                {
                    css += "position:relative; margin:0px auto; ";
                }

                switch (pos[3]) //y-type
                {
                    case "f":
                        if (pos[2] != "1") { css += "position:fixed; "; }
                        break;
                    default:
                        if (pos[2] != "1") { css += "position:relative; "; }
                        break;
                }

                //y-offset
                if (!string.IsNullOrEmpty(pos[4]))
                {
                    css += "top:" + pos[4] + "px; ";
                }
                else
                {
                    css += "top:0px; ";
                }

                switch (pos[5]) //fixed-type
                {
                    case "m":
                        css += "top:50%; bottom:50%; ";
                        break;

                    case "b":
                        css += "top: auto; bottom:0px;";
                        break;
                    default:
                        css += "top: auto; bottom:auto;";
                        break;
                }

                switch (pos[7]) //width-type
                {
                    case "px":
                        css += "max-width:" + pos[6] + "px; ";
                        break;

                    case "%":
                        css += "max-width:" + pos[6] + "%; ";
                        break;

                    case "win":
                        css += "max-width:100%; ";
                        break;
                }

                switch (pos[9]) //height-type
                {
                    case "px":
                        css += "height:" + pos[8] + "px; ";
                        break;

                    case "auto":
                        css += "height:auto; ";
                        break;
                    case "win":
                        css += "height:auto; ";
                        break;
                }

                //padding
                if (!string.IsNullOrEmpty(pos[10]))
                {
                    string[] pad = pos[10].Replace("px", "").Split(' ');
                    css += "padding:" + pos[10] + "; width:100%; ";
                }
                else
                {
                    css += "padding: 0px 0px 0px 0px; width:100%;";
                }

                string id = "c" + component.id;

                if(position != "")
                {
                    switch (level)
                    {
                        case 0: //cell
                            return ".s-cell #" + id + "{" + css + extraCss + "}";
                        case 1: //mobile
                            return ".s-mobile #" + id + ", .s-cell #" + id + "{" + css + extraCss + "}";
                        case 2: //tablet
                            return ".s-tablet #" + id + ", .s-mobile #" + id + ", .s-cell #" + id + "{" + css + extraCss + "}";
                        case 3: //desktop
                            return ".s-desktop #" + id + ", .s-tablet #" + id + ", .s-mobile #" + id + ", .s-cell #" + id + "{" + css + extraCss + "}";
                        case 4: //HD
                            return ".s-hd #" + id + ",  .s-desktop #" + id + ", .s-tablet #" + id + ", .s-mobile #" + id + ", .s-cell #" + id + "{" + css + extraCss + "}";
                    }
                }
                
            }
            return css;
        }

        public String Render()
        {
            //finish loading all panels
            if (bodyPanels != null & S.isWebService == false)
            {
                //render all body panels
                if (bodyPanels.Count > 0)
                {
                    for (int x = 0; x <= bodyPanels.Count - 1; x++)
                    {
                        if(themeHtml.IndexOf("{{panel-" + bodyPanels[x].name.ToLower().Replace(" ", "") + "}}") < 0) { break; }
                        themeHtml = themeHtml.Replace("{{panel-" + bodyPanels[x].name.ToLower().Replace(" ","") + "}}",bodyPanels[x].Render());
                    }
                }

                S.App.scaffold.Data["head-css"] = string.Join("\n", S.Page.postCSS);
            }
            if (!string.IsNullOrEmpty(themeHtml))
            {
                Regex rgx = new Regex(@"\{\{.*?\}\}");
                themeHtml = rgx.Replace(themeHtml, "");
            }

            //compile Javascript
            //render Javascript
            if (S.Page.postJScode != null)
            {
                S.Page.postJS += string.Join("\n", S.Page.postJScode) + S.Page.postJSLast;
            }

            if (S.isWebService == true & PageRequest != null)
            {
                //render all components that have been loaded
                List<PageComponent> remove = new List<PageComponent>();
                foreach (PageComponent comp in PageRequest.components)
                {
                    if(comp.Component.rendered == false)
                    {
                        comp.html = S.Util.Str.CleanHtml(comp.Component.Render());
                    }else
                    {
                        remove.Add(comp);
                    }
                }

                //remove any components from PageRequest that was 
                //rendered inside of a panel component (removing duplicates)
                foreach(PageComponent comp in remove)
                {
                    PageRequest.components.Remove(comp);
                }

                //render Javascript
                PageRequest.js += S.Page.postJS;

                //render CSS
                PageRequest.css += string.Join("\n", S.Page.postCSS);
            }
            return themeHtml;
        }

        public void Save(bool saveToDisk = false)
        {
            XmlDocument xml;
            XmlNode nodeLayout;
            XmlNode nodePanel;
            XmlNode nodeComponent;
            XmlNode nodePosition;
            XmlNode nodeCss;
            XmlNode nodeContent;
            XmlNode nodeDesign;
            XmlCDataSection cdata;
            string pageName = "";
            string pagePath = "";
            int pageType = 1;
            bool added = false;

            //check security first
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return; }

            //go through each layer & save components to XML
            foreach(Layer layer in Layers)
            {
                xml = new XmlDocument();
                nodeLayout = xml.CreateElement("layout");

                //save each panel that belongs to this layer
                foreach(PanelView panel in PanelViews)
                {
                    if(panel.pageId == layer.Id || panel.pageId == 0)
                    {
                        nodePanel = xml.CreateElement("panel");
                        S.Util.Xml.SetAttribute("name", panel.name, nodePanel, xml);
                        added = false;

                        //save each component that belongs to this panel
                        foreach(ComponentView c in ComponentViews)
                        {
                            if(c.panelId == panel.name && c.pageId == layer.Id)
                            {
                                added = true;
                                //component
                                nodeComponent = xml.CreateElement("component");
                                S.Util.Xml.SetAttribute("name", c.name.ToLower(), nodeComponent, xml);
                                S.Util.Xml.SetAttribute("id", c.id, nodeComponent, xml);
                                S.Util.Xml.SetAttribute("index", c.index.ToString(), nodeComponent, xml);

                                //position
                                nodePosition = xml.CreateElement("position");
                                cdata = xml.CreateCDataSection(c.positionField);
                                nodePosition.AppendChild(cdata);
                                nodeComponent.AppendChild(nodePosition);
                                //css
                                nodeCss = xml.CreateElement("css");
                                cdata = xml.CreateCDataSection(c.cssField);
                                nodeCss.AppendChild(cdata);
                                nodeComponent.AppendChild(nodeCss);
                                //content
                                nodeContent = xml.CreateElement("content");
                                cdata = xml.CreateCDataSection(c.dataField);
                                nodeContent.AppendChild(cdata);
                                nodeComponent.AppendChild(nodeContent);
                                //design
                                nodeDesign = xml.CreateElement("design");
                                cdata = xml.CreateCDataSection(c.designField);
                                nodeDesign.AppendChild(cdata);
                                nodeComponent.AppendChild(nodeDesign);

                                nodePanel.AppendChild(nodeComponent);
                            }
                        }

                        if (added == true)
                        {
                            nodeLayout.AppendChild(nodePanel);
                        }
                    }
                }

                //add a list of layers that belong to the page
                if(layer.Id == pageId)
                {
                    XmlNode nodeLayers = xml.CreateElement("layers");
                    XmlNode nodeLayer;
                    foreach(Layer pageLayer in Layers)
                    {
                        if(pageLayer.Id != pageId)
                        {
                            nodeLayer = xml.CreateElement("layer");
                            S.Util.Xml.SetAttribute("id", pageLayer.Id.ToString(), nodeLayer, xml);
                            S.Util.Xml.SetAttribute("name", pageLayer.Title, nodeLayer, xml);
                            nodeLayers.AppendChild(nodeLayer);
                        }
                    }
                    nodeLayout.AppendChild(nodeLayers);
                }

                xml.AppendChild(nodeLayout);

                //setup page information
                pageName = "page";
                if(pageVersion != ""){ pageName += "_" + pageVersion; }
                if(layer.Id != pageId) { pageType = 2; }

                //setup page folder
                if(pageType == 1)
                {
                    pagePath = "/content/websites/" + websiteId + "/pages/" + layer.Id.ToString() + "/";
                }
                else if(pageType == 2)
                {
                    pagePath = "/content/websites/" + websiteId + "/layers/" + layer.Id.ToString() + "/";
                }

                //save xml to memory
                if (S.Server.Cache.ContainsKey(pagePath + pageName + "_edit.xml") == false)
                {
                    S.Server.Cache.Add(pagePath + pageName + "_edit.xml", xml);
                }
                else
                {
                    S.Server.Cache[pagePath + pageName + "_edit.xml"] = xml;
                }

                //save xml to disk
                if (saveToDisk == true)
                {
                    if (Directory.Exists(S.Server.MapPath(pagePath)) == false)
                    {
                        Directory.CreateDirectory(S.Server.MapPath(pagePath));
                    }
                    FileStream fs = new FileStream(S.Server.MapPath(pagePath + pageName + "_edit.xml"), FileMode.Create);
                    xml.Save(fs);
                    fs.Flush();
                    fs.Dispose();
                }
            }

        }

        #endregion

        #region "Panels"
        public void AddPanel(Panel panel)
        {
            if (bodyPanels == null)
            {
                bodyPanels = new List<Panel>();
            }
            bodyPanels.Add(panel);
            if (PanelViews == null)
            {
                PanelViews = new List<PanelView>();
            }
        }

        public Panel GetPanelByName(string name)
        {

            //get panel on first page load
            if ((bodyPanels == null) == false)
            {
                for (int x = 0; x <= bodyPanels.Count - 1; x++)
                {
                    if (bodyPanels[x].name == name)
                        return bodyPanels[x];
                }
            }


            //get panel from viewstate
            if ((PanelViews == null) == false)
            {
                foreach (PanelView pv in PanelViews)
                {
                    if (pv.name == name | pv.className == name)
                    {
                        Panel panel = new Panel(S);
                        panel.LoadFromPanelView(pv);
                        return panel;
                    }
                }
            }

            

            return new Panel(S);
        }
        #endregion

        #region "Components"
        public List<Component> GetAllComponents()
        {
            if ((Components == null) == true)
                Components = new List<Component>();
            if ((ComponentViews == null) == true)
                ComponentViews = new List<ComponentView>();
            return Components;
        }

        public Component GetComponentById(string id)
        {
            GetAllComponents();
            if ((Components == null) == false)
            {
                for (int x = 0; x <= Components.Count - 1; x++)
                {
                    if (Components[x].id == id)
                        return Components[x];
                }
            }
            return null;
        }

        public ComponentView GetComponentViewById(string id)
        {
            GetAllComponents();
            if ((ComponentViews == null) == false)
            {
                for (int x = 0; x <= ComponentViews.Count - 1; x++)
                {
                    if (ComponentViews[x].id == id)
                        return ComponentViews[x];
                }
            }
            return null;
        }

        public int GetComponentViewIndexById(string id)
        {
            GetAllComponents();
            if ((ComponentViews == null) == false)
            {
                for (int x = 0; x <= ComponentViews.Count - 1; x++)
                {
                    if (ComponentViews[x].id == id)
                        return x;
                }
            }
            return -1;
        }

        public void DeleteComponent(string id)
        {
            if ((Components == null) == true)
                return;
            if (Components.Count == 0)
                return;
            for (int x = 0; x <= Components.Count - 1; x++)
            {
                if (Components[x].id == id)
                {
                    Components.RemoveAt(x);
                    break;
                }
            }
        }

        #endregion

        #region "Layers"
        public void LoadLayer(int id, string name, bool saveLayer = true)
        {
            //loads components from within an interface's xml file
            LoadPage("/content/websites/" + websiteId + "/layers/" + id.ToString() + "/page.xml", 2, id, name, saveLayer);
        }

        public void CleanLayers(XmlNodeList myLayers, int myPageId)
        {
            if (myLayers == null)
                return;
            if (S.isWebService == true)
            {
                GetAllComponents();
                if (ComponentViews.Count == 0)
                    return;
                //find out which layers belong to each component, and remove any components that are part of an old interface
                List<int> pageids = new List<int>();
                List<int> comps = new List<int>();
                List<int> panels = new List<int>();

                //first, get a list of pageIds loaded on the page
                pageids.Add(myPageId);
                pageids.Add(0);
                if (myLayers.Count > 0)
                {
                    for (int i = 0; i <= myLayers.Count - 1; i++)
                    {
                        if ((myLayers[i].Attributes["id"] == null) == false)
                            pageids.Add(int.Parse(myLayers[i].Attributes["id"].Value));
                    }
                }
                for (int y = Layers.Count - 1; y >= 0; y += -1)
                {
                    if (pageids.Contains(Layers[y].Id) == false)
                        pageids.Add(Layers[y].Id);
                    if (Layers[y].Id == myPageId)
                        break; // TODO: might not be correct. Was : Exit For
                }

                //build list of components to remove
                for (int x = 0; x <= ComponentViews.Count - 1; x++)
                {
                    if (pageids.Contains(ComponentViews[x].pageId) == false)
                    {
                        if (S.isWebService == true)
                            PageRequest.remove.Add(ComponentViews[x].id);
                        comps.Add(x);
                    }
                }

                //build list of panels to remove
                for (int x = 0; x <= PanelViews.Count - 1; x++)
                {
                    if (pageids.Contains(PanelViews[x].pageId) == false)
                        panels.Add(x);
                }

                //remove any unused layers from the interface array
                List<int> removefaces = new List<int>();
                for (int x = 0; x <= Layers.Count - 1; x++)
                {
                    if (pageids.Contains(Layers[x].Id) == false)
                        removefaces.Add(x);
                }

                //remove components from viewstate
                int removeOffset = 0;
                foreach (int x in comps)
                {
                    ComponentViews.RemoveAt(x - removeOffset);
                    removeOffset += 1;
                }

                //remove panels from viewstate
                removeOffset = 0;
                foreach (int x in panels)
                {
                    PanelViews.RemoveAt(x - removeOffset);
                    removeOffset += 1;
                }

                //remove layers from viewstate
                removeOffset = 0;
                foreach (int x in removefaces)
                {
                    Layers.RemoveAt(x - removeOffset);
                    removeOffset += 1;
                }
            }
        }
        #endregion

        #region "Javascript & CSS"
        /// <summary>
        /// <para>Adds your Javascript code to a variable that generates a javascript block at the bottom of the page on Page_Websilk, 
        /// either directly on the page, or at the end of an AJAX postback response</para>
        /// <para>No duplicate names are allowed per page or AJAX S.Request.Query, which protects Websilk from generating duplicate Javascript code on the page</para>
        /// </summary>
        /// <param name="name"></param>
        /// <param name="js"></param>
        /// <remarks></remarks>
        public virtual void RegisterJS(string name, string js, bool overwrite = false, bool last = false)
        {
            //register non-duplicated javascript with 
            bool addJs = true;
            //check for duplicate name
            if (postJSnames.Length > 0)
            {
                for (int x = 0; x <= postJSnames.Length - 1; x++)
                {
                    if (postJSnames[x] == name)
                    {
                        if (overwrite == true & last == false)
                        {
                            postJScode[x] = js;
                        }
                        return;
                    }
                }
            }

            Array.Resize(ref postJSnames, postJSnames.Length + 1);
            Array.Resize(ref postJScode, postJScode.Length + 1);

            postJSnames[postJSnames.Length - 1] = name;
            if (last == false)
            {
                postJScode[postJSnames.Length - 1] = js;
            }
            else
            {
                if (addJs == true)
                {
                    postJSLast += js;
                }
            }

        }

        /// <summary>
        /// <para>Adds your Javascript code to a variable that generates a javascript block at the bottom of the page on Page_Render, 
        /// either directly on the page, or at the end of an AJAX postback response.</para>
        /// 
        /// <para>No duplicate names are allowed within the entire page life and view state (page load and all AJAX requests), which 
        /// protects Websilk from generating duplicate Javascript code on the page at any given time.</para>
        /// </summary>
        /// <param name="name"></param>
        /// <param name="js"></param>
        /// <returns></returns>
        /// <remarks></remarks>
        public bool RegisterJSonce(string name, string js)
        {
            //register javascript so it only loads once
            //throughout the entire viewstate life

            int i = 0;
            if (postJSonce == null)
            {
                postJSonce = new string[] { };
            }
            else
            {
                for (int x = 0; x <= postJSonce.Length - 1; x++)
                {
                    if (postJSonce[x] == name)
                        return false;
                }
                i = postJSonce.Length;
                Array.Resize(ref postJSonce, i + 1);
            }
            postJSonce[i] = name;
            postJS += js + "\n";
            return true;
        }

        public bool CheckJSOnceIfLoaded(string name)
        {
            if ((postJSonce == null) == false)
            {
                for (int x = 0; x <= postJSonce.Length - 1; x++)
                {
                    if (postJSonce[x] == name)
                        return true;
                }
            }
            return false;
        }

        public void RegisterJSfile(string file, string callback = "")
        {
            string myJs = "$.when(" + "$.getScript('" + file + "')," +
                          "$.Deferred(function(deferred){$(deferred.resolve);})" + ").done(function(){" + callback + "});";
            RegisterJSonce(file, myJs);
        }

        public void RegisterCSS(string name, string css, bool overwrite = false)
        {
            //register non-duplicated css
            if (postCSSnames.Length > 0)
            {
                for (int x = 0; x <= postCSSnames.Length - 1; x++)
                {
                    if (postCSSnames[x] == name)
                    {
                        if (overwrite == true)
                        {
                            postCSS[x] = css;
                        }
                        return;
                    }
                }
            }

            Array.Resize(ref postCSSnames, postCSSnames.Length + 1);
            Array.Resize(ref postCSS, postCSS.Length + 1);

            postCSSnames[postCSSnames.Length - 1] = name;
            postCSS[postCSSnames.Length - 1] = css;
        }

        public void RegisterCSSfile(string file)
        {
            string myJs = "(function(){var f=document.createElement(\"link\");" + "f.setAttribute(\"rel\", \"stylesheet\");" + 
                          "f.setAttribute(\"type\", \"text/css\");" + "f.setAttribute(\"href\", \"" + file + "\");" + 
                          "document.getElementsByTagName(\"head\")[0].appendChild(f);})();";
            RegisterJSonce(file, myJs);
        }
        #endregion


    }
}
