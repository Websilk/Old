using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Linq;

namespace Websilk.Services.Dashboard
{
    public class Pages : Service
    {
        public Pages(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        #region "Load Pages"

        public Inject LoadPages()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffold
            Scaffold scaffold = new Scaffold(S, "/app/dashboard/pages/pages.html", "", new string[] { "page-title", "page-list", "help" });
            scaffold.Data["page-title"] = "";
            scaffold.Data["page-list"] = LoadPagesList();
            //scaffold.Data["help"] = RenderHelpColumn("/App/Help/dashboard/pages.html");

            //setup response
            response.element = ".winWebPages > .content";
            response.html = scaffold.Render();
            response.js = CompileJs();

            return response;
        }

        public Inject LoadSubPages(int parentId)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup response
            response.element = ".winWebPages > .content .pages-list";
            response.html = LoadPagesList(parentId, false);
            response.js = CompileJs();

            return response;
        }

        private string LoadPagesList(int pageId = 0, bool layout = true, int orderBy = -1, string viewType = "", string search = "")
        {

            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return ""; }
            int start = 1;
            int length = 100;
            int parentId = 0;
            string pageTitle = "";
            string parentTitle = "";
            string parentPath = "";
            string parentPathIds = "";
            if (pageId > 0)
            {
                SqlReader reader2 = S.Page.Sql.GetPageTitle(pageId, S.Page.websiteId);
                if (reader2.Rows.Count > 0)
                {
                    reader2.Read();
                    pageTitle = reader2.Get("title");
                    parentId = reader2.GetInt("parentid");
                    parentTitle = reader2.Get("parenttitle");
                    parentPath = reader2.Get("path");
                    parentPathIds = reader2.Get("pathids");
                }
            }

            //get page list from database
            SqlClasses.Dashboard SqlDash = new SqlClasses.Dashboard(S);
            SqlReader reader = SqlDash.GetPageList(S.Page.websiteId, S.Page.ownerId, pageId, start, length, orderBy, search);
            string htm = "";
            if (viewType == "list" | viewType == "")
            {
                htm = LoadLayoutForList(reader, layout, pageId, pageTitle, parentId, parentTitle, parentPath, parentPathIds);

            }

            return htm;
        }

        private string LoadLayoutForList(SqlReader reader, bool layout, int pageId, string pageTitle, int parentId, string parentTitle, string parentPath, string parentPathIds)
        {
            List<string> htm = new List<string>();
            htm.Add("<div class=\"pages-title\">" + LoadPagesTitleRow(parentPathIds, parentPath) + "</div>");
            if (reader.Rows.Count > 0)
            {
                bool secureEdit = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 4);
                bool secureSettings = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 3);
                bool secureDelete = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 2);
                bool secureCreate = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 1);
                string i = "";
                bool hasDelete = false;
                string subpageTitle = "";
                string pagePath = "";
                string pageLink = "";
                int subpageId = 0;
                string options = "";
                bool hasCreate = false;
                int hasChildren = 0;
                string color = "";

                htm.Add("<ul class=\"columns-list\">");

                if (pageId > 0)
                {
                    //page folder icon
                    i = (i == "-alt" ? "" : "-alt");

                    htm.Add(LoadPageColumn(i, "empty", parentId, parentTitle, "..", "", true, "Go back to the parent folder"));
                }

                while (reader.Read() == true)
                {
                    //i = (i == "-alt" ? "" : "-alt");
                    i = "";
                    color = "empty";
                    subpageTitle = reader.Get("title");
                    pagePath = reader.Get("path");
                    subpageId = reader.GetInt("pageid");
                    hasChildren = reader.GetInt("haschildren");
                    hasDelete = true;
                    hasCreate = true;
                    pageLink = "";
                    options = "";

                    //disable delete button
                    switch (subpageTitle.ToLower())
                    {
                        case "home":
                        case "login":
                        case "error 404":
                        case "access denied":
                        case "about":
                        case "contact":
                            hasDelete = false;
                            break;
                    }

                    //disable sub-page creation
                    switch (subpageTitle.ToLower())
                    {
                        case "login":
                        case "error 404":
                        case "access denied":
                            hasCreate = false;
                            break;
                    }

                    //change row color
                    switch (subpageTitle.ToLower())
                    {
                        case "login":
                        case "about":
                        case "contact":
                            color = "yellow";
                            break;
                        case "error 404":
                        case "access denied":
                            color = "red";
                            break;
                        case "home":
                            color = "turqoise";
                            break;
                    }

                    //setup page link

                    pageLink = "/" + (pagePath).Replace(" ", "-");

                    //setup options
                    if (secureDelete == true & hasDelete == true)
                    {
                        //remove link
                        options += "<div class=\"col icon-xs right\"><a href=\"javascript:\" onclick=\"S.editor.pages.remove('" + subpageId + "');return false\" title=\"Permanently delete the page '" + subpageTitle + "' and all of its sub-pages\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-close\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureSettings == true)
                    {
                        //settings link
                        options += "<div class=\"col icon-xs right\"><a href=\"javascript:\" onclick=\"S.editor.pages.settings.show('" + subpageId + "');return false\" title=\"Page Settings for '" + subpageTitle + "'\"><svg viewBox=\"0 0 36 36\"><use xlink:href=\"#icon-settings\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureCreate == true & hasCreate == true)
                    {
                        //add sub-page link
                        options += "<div class=\"col icon-xs right\"><a href=\"javascript:\" onclick=\"S.editor.pages.add.show('" + subpageId + "','" + pagePath + "');return false\" title=\"Create a new Sub-Page for '" + subpageTitle + "'\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";
                    }

                    //page link
                    options += "<div class=\"col icon-xs right\"><a href=\"" + pageLink + "\" title=\"View Web Page\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-openwindow\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";

                    htm.Add("<li>" + LoadPageColumn(i, color, subpageId, subpageTitle, subpageTitle, options, hasChildren > 0, "View a list of sub-pages for '" + subpageTitle + "'") + "</li>");
                }

                htm.Add("</ul>");
            }
            return string.Join("\n", htm);
        }

        private string LoadPageColumn(string columnName, string color, int pageId, string pageTitle, string label, string options, bool onclick = false, string folderTooltip = "")
        {
            return "<div class=\"row hover" + columnName + " item page-" + pageId + "\">" +
                        "<div class=\"color-tag " + color + "\"><div class=\"bg dark\">&nbsp;</div></div><div class=\"color-contents clear\">" +
                            "<div class=\"col" + (onclick == true ? " has-folder\" onclick=\"S.editor.pages.load(" + pageId + ",'" + pageTitle + "','down')\" style=\"cursor:pointer\"" : "\"") + ">" +
                                "<div class=\"col icon-xs\">" +
                                    (onclick == true ?
                                    "<a href=\"javascript:\" title=\"" + folderTooltip + "\">" +
                                        "<svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-folder\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg>" +
                                    "</a>" : " ") +
                                "</div>" +
                                "<div class=\"col label file-label\">" + label + "</div>" +
                            "</div>" +
                            "<div class=\"col hover-only right pad-right\">" + options + "</div>" +
                        "</div>" +
                    "</div>";
        }

        private string LoadPagesTitleRow(string pageIds, string pagePath)
        {
            string[] ids;
            string[] titles;
            string link = "";
            string options = "";
            string htm = "";
            string domain = "Website";//S.Page.Url.host.Replace("/","");
            string pageId = "0";

            if (pageIds != "")
            {

                ids = pageIds.Split('/');
                titles = pagePath.Split('/');

                for (var x = 0; x < ids.Length; x++)
                {
                    if (x == 0)
                    {
                        link = "<a href=\"javascript:\" onclick=\"S.editor.pages.load(0,'','down')\" style=\"cursor:pointer;\">" + domain + "</a>";
                    }
                    link += "/<a href=\"javascript:\" onclick=\"S.editor.pages.load(" + ids[x] + ",'" + titles[x] + "','up')\" style=\"cursor:pointer;\">" + titles[x] + "</a>";

                    if (x == ids.Length - 1)
                    {
                        pageId = ids[x];
                    }
                }
            }

            options =
                "<div class=\"col icon-xs right\">" +
                    "<a href=\"javascript:\" onclick=\"S.editor.pages.showSearch()\" title=\"Search for pages within your website\">" +
                        "<svg viewBox=\"0 0 25 25\" style=\"width:15px; height:15px;\">" +
                            "<use xlink:href=\"#icon-search\" x=\"0\" y=\"0\" width=\"25\" height=\"25\" />" +
                        "</svg>" +
                    "</a>" +
                "</div>" +

                "<div class=\"col icon-xs right\" style=\"padding-right:7px;\">" +
                    "<a href=\"javascript:\" onclick=\"S.editor.pages.add.show(" + pageId + ",'" + pagePath + "')\" title=\"Add a new page to your website\">" +
                        "<svg viewBox=\"0 0 15 15\" style=\"width:15px; height:15px;\">" +
                            "<use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" />" +
                        "</svg>" +
                    "</a>" +
                "</div>";

            htm = "<div class=\"row hover-alt\"><div class=\"col label\">" + (pagePath == "" ? domain : link) + "</div>" +
                "<div class=\"col hover-only right pad-right\">" + options + "</div>" +
                "</div>";
            return htm;
        }

        #endregion

        #region "Interfaces"
        public structResponse NewPage(int parentId, string path)
        {
            if (S.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "NewPage";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/dashboard/pages/newpage.html", "", new string[] { "url", "data-page", "data-pagename" });
            scaffold.Data["url"] = S.Page.Url.host.Replace("http://", "").Replace("https://", "") + path;
            scaffold.Data["data-page"] = "";
            scaffold.Data["data-pagename"] = "";

            S.Page.RegisterJS("newpage", "S.editor.pages.add.item.url = '" + scaffold.Data["url"] + "';");

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();
            return response;
        }

        public structResponse PageSettings(int pageId)
        {
            if (S.isSessionLost() == true) { return lostResponse(); }
            structResponse response = new structResponse();
            response.window = "PageSettings";
            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }

            //setup scaffolding variables
            Scaffold scaffold = new Scaffold(S, "/app/dashboard/pages/pagesettings.html", "",
                new string[] { "url", "page-title", "description", "secure", "page-type", "type" });

            string parentTitle = "";
            SqlReader reader = S.Page.Sql.GetPageTitle(pageId, S.Page.websiteId);
            if (reader.Rows.Count > 0)
            {
                reader.Read();
                parentTitle = reader.Get("parenttitle");
                scaffold.Data["page-title"] = reader.Get("title");
                scaffold.Data["page-path"] = reader.Get("path");
                if (reader.GetBool("security") == true)
                {
                    scaffold.Data["secure"] = "true";
                }
                scaffold.Data["description"] = reader.Get("description");
            }

            scaffold.Data["url"] = S.Page.Url.host.Replace("http://", "").Replace("https://", "") + 
                (scaffold.Data["page-path"].ToLower() == "home" ? "" : scaffold.Data["page-path"].Replace(" ", "-") + "/");

            if (!string.IsNullOrEmpty(parentTitle))
            {
                scaffold.Data["page-type"] = "true";
                scaffold.Data["type"] = "A sub-page for \"" + parentTitle + "\"";
            }

            //get top 20 page history versions
            scaffold.Data["page-history"] = GetHistory(pageId, 1, 20);

            //finally, scaffold Websilk platform HTML
            response.html = scaffold.Render();
            response.js = CompileJs();
            return response;
        }
        #endregion

        #region "Page History"
        private string GetHistory(int pageId, int start, int length)
        {
            StringBuilder htm = new StringBuilder();
            int len = 0;
            int skip = 1;
            string hov = "-alt";
            string[] yr;
            string[] mnth;
            string[] f;
            string[] years;
            string[] months;
            string[] files;
            string path = "/content/websites/" + S.Page.websiteId + "/pages/" + pageId + "/history/";
            string[] fileparts;
            string[] dateparts;
            DateTime date;
            string pagePath = (string)S.Sql.ExecuteScalar("SELECT path FROM pages WHERE pageid=" + pageId + " AND websiteid=" + S.Page.websiteId);

            //get a list of years
            if (Directory.Exists(S.Server.MapPath(path))){
                years = Directory.GetDirectories(S.Server.MapPath(path)).OrderBy(a => a).Reverse().ToArray();
                foreach (string year in years)
                {
                    yr = year.Split('\\');
                    //get a list of months for current year
                    months = Directory.GetDirectories(year).OrderBy(a => a).Reverse().ToArray();
                    foreach (string month in months)
                    {
                        mnth = month.Split('\\');
                        //get all files for each year / month
                        files = Directory.GetFiles(month).OrderBy(a => a).Reverse().ToArray();
                        foreach (string file in files)
                        {
                            //parse file name
                            if (file.IndexOf(".xml") == file.Length - 4)
                            {
                                f = file.Split('\\');
                                if (skip < start)
                                {
                                    skip++;
                                }
                                else
                                {
                                    hov = hov == "-alt" ? "" : "-alt";
                                    fileparts = f[f.Length - 1].Replace(".xml", "").Split('_');
                                    dateparts = fileparts[1].Split('-');
                                    date = DateTime.Parse(yr[yr.Length - 1] + "-" + mnth[mnth.Length - 1] + "-" + dateparts[0] + " " + dateparts[1] + ":" + dateparts[2]);
                                    htm.Append(
                                        "<div class=\"row hover" + hov + "\">" +
                                            "<div class=\"col one pad-sm\">" + fileparts[0] + "</div>" +
                                            "<div class=\"col nine pad-sm\">" + date.ToString("MMMM d, yyyy") + " at " + date.ToString("h:mm tt") + " </div>" +
                                            "<div class=\"col two pad-sm text-right\"><a href=\"/" + pagePath + "?history=v" + fileparts[0] + "-" + yr[yr.Length - 1] + "-" + mnth[mnth.Length - 1] + "\">View</a></div>" +
                                        "</div>"
                                        );

                                    len++;
                                }
                            }
                            if (len == length) { break; }
                        }
                        if (len == length) { break; }
                    }
                    if (len == length) { break; }
                }
            }
            

            return htm.ToString();
        }
        #endregion

        #region "Manage Pages"



        public Inject Create(string title, string description, int parentId, bool isSecure, bool isDataPage)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return response; }


            string myTitle = title;
            string myKeywords = "";
            string myDescription = description;
            string err = "";

            myKeywords = myKeywords.Replace(",", " ").Replace("  ", " ");

            //check user input for malicious code
            if (myTitle.Length > 100)
            {
                err = "Your title can only be 100 characters in length.";
                goto skipCreate;
            }

            //check for incorrect user input
            if (S.Util.Str.OnlyLettersAndNumbers(myTitle, new string[] { ".", " " }) == false)
            {
                err = "Your title can only contain letters, numbers, periods, and spaces.";
                goto skipCreate;
            }

            if (myTitle.Length > 100)
            {
                err = "Your title can only be 100 characters in length.";
                goto skipCreate;
            }

            if (myTitle.Replace(" ", "").Length == 0)
            {
                err = "Please specify a title for your web site.";
                goto skipCreate;
            }


            if (S.Util.Str.OnlyLettersAndNumbers(myKeywords, new string[] { " ", ".", ",", "&" }) == false)
            {
                err = "Your keywords can only contain letters, numbers, spaces, and some special characters.";
                goto skipCreate;
            }

            if (myKeywords.Length > 250)
            {
                err = "Your keywords can only be 250 characters in length.";
                goto skipCreate;
            }
            var arrChars = new string[] { " ", "!", "@", "#", "$", "%", "^", "&", "*", "'", ",", ".", "?", "-", "(", ")", "/", "\\", "+", "=", ":", ";", "~", "\"" };

            if (S.Util.Str.OnlyLettersAndNumbers(myDescription, arrChars) == false)
            {
                err = "Your description can only contain recognized characters.";
                goto skipCreate;
            }

            if (myDescription.Length > 1000)
            {
                err = "Your description can only be 1000 max characters in length.";
                goto skipCreate;
            }

            if (myDescription.Replace(" ", "").Length == 0)
            {
                err = "Please write a small description for your web site.";
                goto skipCreate;
            }

            //check for malicious user input
            if (S.Util.Secure.isMalicious(myTitle, 100, "", "", new string[] { }, new string[] { }) == true ||
                S.Util.Secure.isMalicious(myKeywords, 250, "", "", new string[] { }, new string[] { }) == true ||
                S.Util.Secure.isMalicious(myDescription, 1000, "", "", new string[] { }, new string[] { }) == true)
            {
                err = "An error occured due to your user input.";
                goto skipCreate;
            }

            //check for existing page title
            string parentPath = "";
            if (parentId > 0)
            {
                parentPath = (string)S.Sql.ExecuteScalar("SELECT path FROM pages WHERE pageid=" + parentId);
                if (parentPath.Length > 0) { parentPath += "/"; }
            }
            int p = (int)S.Sql.ExecuteScalar("SELECT COUNT(*) FROM pages WHERE websiteid=" + S.Page.websiteId + " AND path='" + parentPath + myTitle + "'");
            if (p > 0)
            {
                err = "There is already a page titled '" + title + "' within your web site.";
                goto skipCreate;
            }

            //create web page in SQL
            string useParentId = "";
            if (parentId > 0)
            {
                useParentId = ", @parentid=" + parentId;
            }
            int ownerId = (int)S.Sql.ExecuteScalar("SELECT ownerid FROM websites WHERE websiteid=" + S.Page.websiteId);

            SqlReader myPage = new SqlReader();
            myPage.ReadFromSqlClient(S.Sql.ExecuteReader(
                "EXEC AddWebsitePage @ownerId=" + ownerId + ", @themeId=0 , @websiteid=" + S.Page.websiteId + useParentId + ", @schemeId=0" +
                ", @title='" + S.Sql.Encode(myTitle) + "', @description='" + S.Sql.Encode(myDescription) +
                "', @security=" + (isSecure == true ? 1 : 0) + ", @usersonly=0, @enabled=1"));

            if (myPage.Rows.Count > 0)
            {
                myPage.Read();
                int pId = myPage.GetInt("pageid");
                string pageFolder = "/content/websites/" + S.Page.websiteId + "/pages/" + pId + "/";
                //create folder for web page
                if (Directory.Exists(S.Server.MapPath(pageFolder)) == false)
                {
                    Directory.CreateDirectory(S.Server.MapPath(pageFolder));
                }

                //copy template page.xml if it exists
                //if (parentId > 0) {
                //    int tempId = (int)S.Sql.ExecuteScalar("SELECT CASE WHEN templateid IS NOT null THEN templateid ELSE 0 END FROM pages WHERE pageid=" + parentId);
                //    if (tempId > 0) {
                //        string tempFolder = "/content/websites/" + S.Page.websiteId + "/pages/" + tempId + "/";
                //        if (File.Exists(S.Server.MapPath(tempFolder + "/page.xml")) == true) {
                //	        File.Copy(S.Server.MapPath(tempFolder + "/page.xml"), S.Server.MapPath(pageFolder + "/page.xml"));
                //        }
                //        if (File.Exists(S.Server.MapPath(tempFolder + "/page_edit.xml")) == true) {
                //	        File.Copy(S.Server.MapPath(tempFolder + "/page_edit.xml"), S.Server.MapPath(pageFolder + "/page_edit.xml"));
                //        }
                //    }
                //}

                //clear form fields & show message
                string js = "$('#newPageTitle').val('');$('#newPageDescription').val('');$('#newPageSecure').prop('checked',false);S.editor.pages.add.typeTitle();" +
                    "(function(){var e = S.elem.get('newPageAlert');" +
                    "e.innerHTML = 'Your new web page, \"" + myTitle.Replace("'", "\\'").Replace("\"", "") + "\" has been created!';$(e).show();})();";

                S.Page.RegisterJS("newpage", js);

                //load list of sub pages
                response = LoadSubPages(parentId);

                //regenerate the sitemap file
                //Rennder.Utility.SiteMap SiteMap = new Rennder.Utility.SiteMap(R);
                //SiteMap.GenerateSiteMap(websiteId);

            }
            else
            {
                err = "An error occured while trying to create your new page.";
                goto skipCreate;
            }

        skipCreate:
            if (err != "")
            {
                string js = "(function(){var e = S.elem.get('newPageError');" +
                    "e.innerHTML = '" + err.Replace("'", "\\'") + "';$(e).show();})();";
                S.Page.RegisterJS("err", js);
                response.js = CompileJs();
            }

            return response;
        }

        public Inject Remove(int pageId)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 2) == false) { return response; }
            if (pageId > 0)
            {
                SqlReader reader = S.Page.Sql.GetPageTitle(pageId, S.Page.websiteId);
                if (reader.Rows.Count > 0)
                {
                    //get info about page that will be removed
                    reader.Read();
                    int parentId = reader.GetInt("parentid");
                    string title = S.Sql.Decode(reader.Get("title"));

                    //remove page
                    switch (title)
                    {
                        case "home":
                        case "login":
                        case "error 404":
                        case "access denied":
                        case "about":
                        case "contact":
                        case "support":
                            break;
                        default:
                            var sqlDash = new SqlClasses.Dashboard(S);
                            sqlDash.DeletePage(S.Page.websiteId, pageId, S.Page.ownerId);
                            S.Page.RegisterJS("del", "S.util.message.show($('#pagesAlert'),'Your web page, \"" + title + "\" has been deleted successfully. <a href=\"javascript:\" onclick=\"S.editor.pages.undoRemove(" + pageId + ")\">Undo</a>');");
                            response = LoadSubPages(parentId);
                            break;
                    }

                }
            }

            return response;
        }

        public Inject UndoRemove(int pageId)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 2) == false) { return response; }

            if (pageId > 0)
            {
                SqlReader reader = S.Page.Sql.GetPageTitle(pageId, S.Page.websiteId);
                if (reader.Rows.Count > 0)
                {
                    //get info about page that will be removed
                    reader.Read();
                    int parentId = reader.GetInt("parentid");
                    string title = S.Sql.Decode(reader.Get("title"));

                    //restore page
                    var sqlDash = new SqlClasses.Dashboard(S);
                    sqlDash.RestorePage(S.Page.websiteId, pageId, S.Page.ownerId);
                    S.Page.RegisterJS("del", "S.util.message.show($('#pagesAlert'),'Your web page, \"" + title + "\" has been restored successfully. <a href=\"javascript:\" onclick=\"S.editor.pages.remove(" + pageId + ")\">Remove</a>');");
                    response = LoadSubPages(parentId);

                }
            }

            return response;
        }
        #endregion
    }
}
