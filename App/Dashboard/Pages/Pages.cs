using System;
using System.Collections.Generic;
using System.IO;

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
            scaffold.Data["help"] = RenderHelpColumn("/App/Help/dashboard/pages.html");

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
            response.html = LoadPagesList(parentId,false);
            response.js = CompileJs();

            return response;
        }

        private string LoadPagesList(int pageId = 0, bool layout = true, int orderBy = -1, string viewType = "", string search = "")
        {
            
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 0) == false) { return ""; }
            int start = 1;
            int length = 100;
            int parentId = 0;
            string parentTitle = "";
            string parentPath = "";
            string parentPathIds = "";
            if (pageId > 0)
            {
                SqlReader reader2 = S.Page.Sql.GetPageTitle(pageId, S.Page.websiteId);
                if (reader2.Rows.Count > 0)
                {
                    reader2.Read();
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
            if (viewType == "treeview")
            {
                htm = LoadLayoutForTreeView(reader, parentId, parentTitle);

            }
            else if (viewType == "list" | viewType == "")
            {
                htm = LoadLayoutForList(reader, layout, pageId, parentId, parentTitle, parentPath, parentPathIds);

            }

            return htm;
        }

        private string LoadLayoutForList(SqlReader reader, bool layout, int pageId, int parentId, string parentTitle, string parentPath, string parentPathIds)
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
                string pageTitle = "";
                string pagePath = "";
                string pageLink = "";
                int subpageId = 0;
                string options = "";
                bool hasCreate = false;
                int hasChildren = 0;
                string color = "";
                string folderIcon = "";
                string folderDiv = "";
                
                htm.Add("<ul class=\"columns-list\">");

                if (pageId > 0)
                {
                    //page folder icon
                    i = (i == "-alt" ? "" : "-alt");
                    folderIcon = "<div class=\"left icon icon-folder\"><a href=\"javascript:\" title=\"Go back to the parent folder\">" + "<svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-folder\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";

                    htm.Add("<li><div class=\"row color" + i + " item\"><div class=\"column-row\">" + "<div class=\"hover-title left\" onclick=\"S.editor.pages.load(" + parentId + ",'" + parentTitle + "','down')\" style=\"cursor:pointer\">" + folderIcon + "..</div>" + "<div class=\"hover-only right\">" + options + "</div>" + "</div><div class=\"clear\"></div></div></li>");
                }

                while (reader.Read() == true)
                {
                    //i = (i == "-alt" ? "" : "-alt");
                    i = "";
                    color = "empty";
                    pageTitle = reader.Get("title");
                    pagePath = reader.Get("path");
                    subpageId = reader.GetInt("pageid");
                    hasChildren = reader.GetInt("haschildren");
                    hasDelete = true;
                    hasCreate = true;
                    pageLink = "";
                    options = "";
                    folderDiv = "";

                    //disable delete button
                    switch (pageTitle.ToLower())
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
                    switch (pageTitle.ToLower())
                    {
                        case "login":
                        case "error 404":
                        case "access denied":
                            hasCreate = false;
                            break;
                    }

                    //change row color
                    switch (pageTitle.ToLower())
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
                        options += "<div class=\"right icon icon-delete\"><a href=\"javascript:\" onclick=\"S.editor.pages.remove('" + subpageId + "');return false\" title=\"Permanently delete the page '" + pageTitle + "' and all of its sub-pages\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-close\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureSettings == true)
                    {
                        //settings link
                        options += "<div class=\"right icon icon-settings\"><a href=\"javascript:\" onclick=\"S.editor.pages.settings.show('" + subpageId + "');return false\" title=\"Page Settings for '" + pageTitle + "'\"><svg viewBox=\"0 0 36 36\"><use xlink:href=\"#icon-settings\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureCreate == true & hasCreate == true)
                    {
                        //add sub-page link
                        options += "<div class=\"right icon icon-add\"><a href=\"javascript:\" onclick=\"S.editor.pages.add.show('" + subpageId + "','" + pagePath + "');return false\" title=\"Create a new Sub-Page for '" + pageTitle + "'\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";
                    }

                    //page link
                    options += "<div class=\"right icon icon-add\"><a href=\"" + pageLink + "\" title=\"View Web Page\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-openwindow\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";

                    //page folder icon
                    folderIcon = "<div class=\"left icon icon-folder\">";
                    if (hasChildren > 0)
                    {
                        //has sub pages
                        folderIcon += "<a href=\"javascript:\" title=\"View a list of sub-pages for '" + pageTitle + "'\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-folder\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a>";
                        folderDiv = " onclick=\"S.editor.pages.load(" + subpageId + ",'" + pageTitle + "','up')\" style=\"cursor:pointer;\"";
                    }
                    folderIcon += "</div>";

                    htm.Add("<li><div class=\"row hover" + i + " item page-" + subpageId + "\"><div class=\"column-row\"><div class=\"" + color + " color-code\"><div class=\"bg\">&nbsp;</div></div><div class=\"" + (!string.IsNullOrEmpty(folderDiv) ? "hover-title " : "") + "left\"" + folderDiv + ">" + folderIcon + pageTitle + "</div>" + "<div class=\"hover-only right space-right\">" + options + "</div>" + "</div><div class=\"clear\"></div></div></li>");
                }

                htm.Add("</ul>");
            }
            return string.Join("\n", htm);
        }

        private string LoadPagesTitleRow(string pageIds, string pagePath)
        {
            string[] ids;
            string[] titles;
            string link = "";
            string options = "";
            string htm = "";
            string domain = S.Page.Url.host.Replace("/","");

            if(pageIds != "")
            {

                ids = pageIds.Split('/');
                titles = pagePath.Split('/');

                for(var x = 0; x < ids.Length; x++)
                {
                    if (x == 0) {
                        link = "<a href=\"javascript:\" onclick=\"S.editor.pages.load(0,'','down')\" style=\"cursor:pointer;\">" + domain  + "</a>";
                    }
                    link+= "/<a href=\"javascript:\" onclick=\"S.editor.pages.load(" + ids[x] + ",'" + titles[x] + "','up')\" style=\"cursor:pointer;\">" + titles[x] + "</a>";
                }
            }

            options = 
                "<div class=\"right\">" +
                    "<a href=\"javascript:\" onclick=\"S.editor.pages.showSearch()\" title=\"Search for pages within your website\">" +
                        "<svg viewBox=\"0 0 25 25\" style=\"width:15px; height:15px;\">" +
                            "<use xlink:href=\"#icon-search\" x=\"0\" y=\"0\" width=\"25\" height=\"25\" />" +
                        "</svg>" + 
                    "</a>" + 
                "</div>" +

                "<div class=\"right\" style=\"padding-right:7px;\">" +
                    "<a href=\"javascript:\" onclick=\"S.editor.pages.add.show(0,'')\" title=\"Add a new page to your website\">" +
                        "<svg viewBox=\"0 0 15 15\" style=\"width:15px; height:15px;\">" +
                            "<use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" />" +
                        "</svg>" + 
                    "</a>" + 
                "</div>";

            htm = "<div class=\"row hover-alt\"><div class=\"column-row\"><div class=\"left page-title\">" + (pagePath == "" ? domain : link)  + "</div>" + 
                "<div class=\"hover-only right\">" + options + "</div>" + 
                "<div class=\"clear\"></div></div></div>";
            return htm;
        }

        private string LoadLayoutForTreeView(SqlReader reader, int parentId, string parentTitle)
        {
            List<string> htm = new List<string>();
            if (reader.Rows.Count > 0)
            {
                bool secureEdit = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 4);
                bool secureSettings = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 3);
                bool secureDelete = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 2);
                bool secureCreate = S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/pages", 1);
                string i = "-alt";
                bool hasDelete = false;
                string pageTitle = "";
                string pageLink = "";
                int pageId = 0;
                string options = "";
                string expander = "";
                bool hasCreate = false;
                int hasChildren = 0;
                string color = "";

                if (parentId > 0)
                {
                    htm.Add("<div class=\"sub\">");
                }
                else
                {
                    htm.Add("<div class=\"pages-treeview\">");
                }



                while (reader.Read() == true)
                {
                    i = (i == "-alt" ? "" : "-alt");
                    color = "empty";
                    pageTitle = reader.Get("title");
                    pageId = reader.GetInt("pageid");
                    hasChildren = reader.GetInt("haschildren");
                    hasDelete = true;
                    hasCreate = true;
                    pageLink = "";
                    options = "";

                    //disable delete button
                    switch (pageTitle.ToLower())
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
                    switch (pageTitle.ToLower())
                    {
                        case "login":
                        case "error 404":
                        case "access denied":
                        case "about":
                        case "contact":
                            hasCreate = false;
                            break;
                    }

                    //change row color
                    switch (pageTitle.ToLower())
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
                    if (S.isLocal == true)
                    {
                        if (S.Page.websiteId > 1)
                        {
                            pageLink = "/?pageid=" + pageId;
                        }
                    }
                    if (string.IsNullOrEmpty(pageLink))
                    {
                        pageLink = "/" + ((!string.IsNullOrEmpty(parentTitle) ? parentTitle + "/" : "") + pageTitle).Replace(" ", "-");
                    }

                    //setup options
                    if (secureDelete == true & hasDelete == true)
                    {
                        options += "<div class=\"right icon icon-delete\"><a href=\"javascript:\" onclick=\"S.editor.pages.remove('" + pageId + "')\" title=\"Permanently delete this page\"><svg viewBox=\"0 0 15 15\" style=\"width:12px;\"><use xlink:href=\"#icon-close\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureSettings == true)
                    {
                        options += "<div class=\"right icon icon-settings\"><a href=\"javascript:\" onclick=\"S.editor.pages.settings.show('" + pageId + "')\" title=\"Page Settings\"><svg viewBox=\"0 0 36 36\"><use xlink:href=\"#icon-settings\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg></a></div>";
                    }
                    if (secureCreate == true & hasCreate == true)
                    {
                        options += "<div class=\"right icon icon-add\"><a href=\"javascript:\" onclick=\"S.editor.pages.add.show('" + pageId + "','" + pageTitle + "')\" title=\"Create New Sub-Page\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-add\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";
                    }

                    //setup expander
                    expander = "<div class=\"expander " + color + "\">";
                    if (hasChildren > 0)
                    {
                        expander += "<div class=\"column right icon icon-expand\"><a href=\"javascript:\" onclick=\"S.editor.pages.expand('" + pageId + "')\"><svg viewBox=\"0 0 15 15\"><use xlink:href=\"#icon-expand\" x=\"0\" y=\"0\" width=\"15\" height=\"15\" /></svg></a></div>";
                    }
                    else
                    {
                        expander += "<div class=\"column\">&nbsp;</div>";
                    }
                    expander += "</div>";


                    htm.Add("<div class=\"row hover" + i + " item page-" + pageId + "\">" + expander + "<div class=\"column\"><a href=\"" + pageLink + "\">" + pageTitle + "</a>" + "<div class=\"hover-only right\">" + options + "</div>" + "</div><div class=\"clear\"></div></div>");
                }
                if (parentId > 0)
                {
                    htm.Add("</div>");
                }
                else
                {
                    htm.Add("</div>");
                }

            }
            return string.Join("\n", htm);
        }

        #endregion

        #region "Create Page"
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
            if (S.Util.Str.OnlyLettersAndNumbers(myTitle, " ") == false)
            {
                err = "Your title can only contain letters, numbers, and spaces.";
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


            if (S.Util.Str.OnlyLettersAndNumbers(myKeywords, new string[]{ " ", ".", ",", "&" }) == false) {
                err = "Your keywords can only contain letters, numbers, spaces, and some special characters.";
                goto skipCreate;
            }

            if (myKeywords.Length > 250)
            {
                err = "Your keywords can only be 250 characters in length.";
                goto skipCreate;
            }
            var arrChars = new string[] { " ", "!", "@", "#", "$", "%", "^", "&", "*", "'", ",", ".", "?", "-", "(", ")", "/", "\\", "+", "=", ":", ";", "~", "\"" };

            if (S.Util.Str.OnlyLettersAndNumbers(myDescription, arrChars) == false) {
                err = "Your description can only contain recognized characters.";
                goto skipCreate;
            }

            if (myDescription.Length > 1000) {
                err = "Your description can only be 1000 max characters in length.";
                goto skipCreate;
            }

	        if (myDescription.Replace(" ", "").Length == 0) {
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
                if (parentId > 0) {
                parentPath = (string)S.Sql.ExecuteScalar("SELECT path FROM pages WHERE pageid=" + parentId);
                if(parentPath.Length > 0) { parentPath += "/"; }
            }
            int p = (int)S.Sql.ExecuteScalar("SELECT COUNT(*) FROM pages WHERE websiteid=" + S.Page.websiteId + " AND path='" + parentPath + myTitle + "'");
	        if (p > 0) {
                err = "There is already a page titled '" + title + "' within your web site.";
                goto skipCreate;
            }
            
            //create web page in SQL
            string useParentId = "";
            if (parentId > 0) {
	            useParentId = ", @parentid=" + parentId;
            }
            int ownerId = (int)S.Sql.ExecuteScalar("SELECT ownerid FROM websites WHERE websiteid=" + S.Page.websiteId);

            SqlReader myPage = new SqlReader();
            myPage.ReadFromSqlClient(S.Sql.ExecuteReader(
                "EXEC AddWebsitePage @ownerId=" + ownerId + ", @themeId=0 , @websiteid=" + S.Page.websiteId + useParentId + ", @schemeId=0" +
                ", @title='" + S.Sql.Encode(myTitle) + "', @description='" + S.Sql.Encode(myDescription) + 
                "', @security=" + (isSecure == true ? 1 : 0) + ", @usersonly=0, @enabled=1"));

            if (myPage.Rows.Count > 0) {
	            myPage.Read();
	            int pId = myPage.GetInt("pageid");
                string pageFolder = "/content/websites/" + S.Page.websiteId + "/pages/" + pId + "/";
	            //create folder for web page
		        if (Directory.Exists(S.Server.MapPath(pageFolder)) == false) {
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
                string js = "$('#newPageTitle').val('');$('#newPageDescription').val('');$('#newPageSecure').prop('checked',false);" +
                    "(function(){var e = S.elem.get('newPageAlert');" +
                    "e.innerHTML = 'Your new web page, \"" + myTitle.Replace("'","\\'").Replace("\"","") + "\" has been created!';$(e).show();})();";

                S.Page.RegisterJS("newpage", js);

                //load list of sub pages
                response = LoadSubPages(parentId);

	            //regenerate the sitemap file
		        //Rennder.Utility.SiteMap SiteMap = new Rennder.Utility.SiteMap(R);
                //SiteMap.GenerateSiteMap(websiteId);
	            
            } else {
                err = "An error occured while trying to create your new page.";
                goto skipCreate;
            }

skipCreate: 
            if(err != "")
            {
                string js = "(function(){var e = S.elem.get('newPageError');" +
                    "e.innerHTML = '" + err.Replace("'","\\'") + "';$(e).show();})();";
                S.Page.RegisterJS("err", js);
                response.js = CompileJs();
            }

            return response;
        }
        #endregion

        #region "Page Settings"

        #endregion
    }
}
