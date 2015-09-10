using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNet.Http;
using Microsoft.Net.Http.Headers;

namespace Websilk.Services.Dashboard
{
    public class Photos : Service
    {
        public Photos(Core WebsilkCore, string[] paths) : base(WebsilkCore, paths)
        {
        }

        public Inject LoadPhotos()
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos > .content";

            //finally, scaffold Websilk platform HTML
            response.html = GetPhotos();
            response.js = CompileJs();

            return response;
        }

        public Inject LoadPhotoList(int start, string folder, string search, int orderby)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .photo-list";

            //finally, scaffold Websilk platform HTML
            response.html = GetPhotos(start, 100, folder, search, orderby);
            response.js = CompileJs();

            return response;
        }

        private string GetPhotos(int start = 1, int length = 100, string folder = "", string search = "", int orderby = 1, List<string> fileTypes = null)
        {
            string htm = "";
            List<string> lstTypes = new List<string>();
            int len = 0; int x = 0;
            bool allowed = true;
            string folderurl = "";
            if (fileTypes != null)
                lstTypes = fileTypes;

            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);
            SqlReader reader = sqlDash.GetPhotos(S.Page.websiteId, start, length, folder, orderby);
            if (reader.Rows.Count > 0)
            {
                while (reader.Read() == true)
                {
                    allowed = true;
                    if (folder != "!")
                    {
                        if (reader.Get("foldername") != folder && folder != "")
                            allowed = false;
                    }
                    

                    if (allowed == true)
                    {
                        if (x >= start - 1)
                        {
                            if (x >= start + length - 1) { break; }
                            len += 1;
                            folderurl = reader.Get("foldername");
                            if (folderurl != "") { folderurl += "/"; }
                            htm += "<div class=\"photo\"><div class=\"check hover-only\"><input type=\"checkbox\" id=\"chkPhoto" + x + "\" filename=\"" + reader.Get("filename") + "\" /></div><div class=\"tbl-cell\"><div class=\"img\"><img src=\"/content/websites/" + S.Page.websiteId + "/photos/" + folderurl + "tiny" + reader.Get("filename") + "\"/></div></div></div>" + "\n";
                        }
                        x += 1;
                    }
                }

            }
            else {
                htm = "<div class=\"no-photos font-faded\">No photos have been uploaded to this folder yet. Drag & Drop photos from your hard drive to this web page to upload them.</div>";
            }

            string js = "S.editor.photos.bind(); S.editor.photos.info = {start:" + (reader.Rows.Count == 0 ? 0 : start) + ", total:" + reader.Rows.Count + ", len:" + len + "};" + "S.editor.photos.listInfo(" + reader.Rows.Count + ");S.editor.photos.folders.hide();S.editor.photos.folders.change('" + folder + "');";
            S.Page.RegisterJS("photos", js);

            return htm;
        }

        public Inject LoadFolders(string type)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .folder-list";

            //finally, scaffold Websilk platform HTML
            response.html = GetFolders(type);
            response.js = CompileJs();

            return response;
        }

        public Inject AddFolder(string name)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .folder-list";

            //execute SQL
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);
            sqlDash.AddPhotoFolder(S.Page.websiteId, name);
            S.Page.RegisterJS("addfolder", "S.editor.photos.folders.hideAdd();");

            //finally, scaffold Websilk platform HTML
            response.html = GetFolders();
            response.js = CompileJs();

            return response;
        }

        public Inject MoveTo(string folder, string files)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .photo-list";

            //get list of files from database
            string[] filelist = files.Split(',');
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);
            SqlReader reader = sqlDash.GetPhotos(S.Page.websiteId, filelist);
            
            //move files on disk into target folder
            if(reader.Rows.Count > 0)
            {
                string oldfolder = ""; string newfolder = folder; string newname = "";
                string[] sizes = new string[] { "", "xl", "lg", "med", "sm", "tiny", "icon" };
                string path = "/wwwroot/content/websites/" + S.Page.websiteId + "/photos/";
                if (newfolder != "") { newfolder += "/"; }
                if(Directory.Exists(S.Server.MapPath(path + newfolder)) == false)
                {
                    //create target folder if it doesn't exist
                    Directory.CreateDirectory(S.Server.MapPath(path + newfolder));
                }
                while (reader.Read() == true)
                {
                    //move each file into the target folder
                    oldfolder = reader.Get("foldername");
                    newname = reader.Get("filename");
                    if(oldfolder != "") { oldfolder += "/"; }
                    for(var x = 0; x < sizes.Length; x++)
                    {
                        if(S.Server.MapPath("/wwwroot/content/websites/" + S.Page.websiteId + "/photos/" + oldfolder + sizes[x] + newname) !=
                              S.Server.MapPath("/wwwroot/content/websites/" + S.Page.websiteId + "/photos/" + newfolder + sizes[x] + newname))
                        {
                            if (File.Exists(S.Server.MapPath("/wwwroot/content/websites/" + S.Page.websiteId + "/photos/" + oldfolder + sizes[x] + newname)) == true)
                            {
                                File.Move(S.Server.MapPath("/wwwroot/content/websites/" + S.Page.websiteId + "/photos/" + oldfolder + sizes[x] + newname),
                                  S.Server.MapPath("/wwwroot/content/websites/" + S.Page.websiteId + "/photos/" + newfolder + sizes[x] + newname));
                            }
                        }
                    }
                }
            }

            //execute SQL
            sqlDash.MovePhotos(S.Page.websiteId, filelist, folder);

            //finally, get a new list of photos
            response.html = GetPhotos(1, 100, folder);
            response.js = CompileJs();

            return response;
        }

        public Inject Remove(string files)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = "";

            //execute SQL
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);
            sqlDash.DeletePhotos(S.Page.websiteId, files.Split(','));

            //finally, scaffold Websilk platform HTML
            response.html = "";
            response.js = CompileJs();

            return response;
        }

        public Inject RemoveFolder(string folder)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            Inject response = new Inject();

            //check security
            if (S.User.Website(S.Page.websiteId).getWebsiteSecurityItem("dashboard/photos", 0) == false) { return response; }

            //setup response
            response.element = ".winPhotos .folder-list";

            //execute SQL
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);
            sqlDash.DeletePhotoFolder(S.Page.websiteId, folder);

            //finally, scaffold Websilk platform HTML
            response.html = GetFolders();
            response.js = CompileJs();

            return response;
        }

        private string GetFolders(string loadType = "")
        {
            string htm = "";
            int i = 2;
            int e = 0;
            SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);
            SqlReader reader = sqlDash.GetPhotoFolders(S.Page.websiteId);
            htm += "<div class=\"folder-column\">";
            htm += "<div class=\"row color1\"><div class=\"column-row item\">[All Photos]</div></div>";
            htm += "<div class=\"row color2\"><div class=\"column-row item\">[Unorganized Photos]</div></div>";
            while (reader.Read() == true)
            {
                i = (i == 2 ? 1 : 2);
                e += 1;
                if (e > 8)
                {
                    e = 0;
                    i = 1;
                    htm += "</div><div class=\"folder-column\">";
                }

                htm += "<div class=\"row color" + i + "\"><div class=\"column-row item\">" + reader.Get("name") + 
                    "<div class=\"right hover-only icon-close\" style=\"padding-top:3px;\"><a href=\"javascript:\">" +
                    "<svg viewBox=\"0 0 15 15\" style=\"width:12px;\"><use xlink:href=\"#icon-close\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" /></svg>" + 
                    "</a></div></div></div>";
            }
            htm += "</div>";
            if (loadType == "move")
            {
                S.Page.RegisterJS("photos", "S.editor.photos.folders.bindForMove();");
            }
            else
            {
                S.Page.RegisterJS("photos", "S.editor.photos.folders.bind();");
            }

            return htm;
        }

        public WebRequest Upload()
        {
            WebRequest wr = new WebRequest();
            if(Files.Count > 0)
            {
                string folder = S.Request.Query["folder"];
                if (folder == null) { folder = ""; }
                if(folder != "") { folder += "/"; }
                string path = "/wwwroot/content/websites/" + S.Page.websiteId + "/photos/" + folder;
                folder = folder.Replace("/", "");
                string ext = ""; string name = ""; string filename = ""; string filenew = ""; bool generated = false;
                Utility.Images image = new Utility.Images(S);
                SqlClasses.Dashboard sqlDash = new SqlClasses.Dashboard(S);

                foreach (IFormFile file in Files)
                {
                    filename = S.Util.Str.replaceAll(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"'), "", 
                        new string[] { "-", "_", "!", "@", "#", "$", "%", "&", "*", "+", "=", ",", "?", " " });

                    name = S.Util.Str.CreateID(7).ToLower();
                    ext = S.Util.Str.getFileExtension(filename).ToLower();
                    generated = false;

                    switch (ext)
                    {
                        case "jpg": case "jpeg": case "png": case "gif":
                            if (!Directory.Exists(S.Server.MapPath(path))) {
                                //create directory
                                Directory.CreateDirectory(S.Server.MapPath(path));
                            }

                            //save original photo to disk
                            filenew = name + "." + ext;
                            file.SaveAs(S.Server.MapPath(path + filenew));

                            if(ext != "gif") {
                                // create 7 image sizes: [original (max 4096)], xl (1920), lg (800), med (400), sm (200), tiny (100), icon (50)
                                try
                                {
                                    image.GeneratePhotos(path, filenew);
                                    generated = true;
                                }
                                catch (Exception ex)
                                {
                                    S.Page.RegisterJS("err", "alert('Error: " + ex.Message.Replace("'", "\\'") + ");");
                                }

                            }else { generated = true; }

                            if(generated == true)
                            {
                                //get photo dimensions
                                Utility.structImage photo = image.Load(path, filenew);

                                //save photo to database
                                sqlDash.AddPhoto(S.Page.websiteId, folder, filenew, filename, photo.width, photo.height);
                            }
                            break;
                    }
                    
                }
            }
            return wr;
        }

        public Inject Save(string folder)
        {
            if (S.isSessionLost() == true) { return lostInject(); }
            return LoadPhotoList(1, folder, "", 1);
        }
    }
}
