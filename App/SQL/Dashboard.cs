using System.IO;

namespace Websilk.SqlClasses
{
    public class Dashboard: SqlMethods
    {
        public Dashboard(Core WebsilkCore) : base(WebsilkCore)
        {
        }

        #region "Pages"
        public SqlReader GetPageList(int websiteId, int ownerId, int parentId, int start, int length, int orderBy, string search)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                string sql = "";
                sql = "SELECT * FROM (SELECT ROW_NUMBER() OVER(";
                switch (orderBy)
                {
                    case 1:
                    case -1:
                        sql += "ORDER BY datecreated ASC";
                        break;
                    case 2:
                        sql += "ORDER BY datecreated DESC";
                        break;
                    case 3:
                        sql += "ORDER BY datemodified ASC";
                        break;
                    case 4:
                        sql += "ORDER BY datemodified DESC";
                        break;
                    case 5:
                        sql += "ORDER BY title ASC";
                        break;
                    case 6:
                        sql += "ORDER BY title DESC";
                        break;
                    case 7:
                        sql += "ORDER BY usersonly DESC, datecreated ASC";
                        break;
                }
                sql += ") AS rownum, p.pageid, p.title, p.datecreated, p.datemodified, p.favorite, p.security, p.published, p.ratingtotal, p.ratedcount, p.description";
                sql += ", (SELECT COUNT(*) FROM pages WHERE websiteid=" + websiteId + " AND parentid=p.pageid) AS haschildren ";
                sql += "FROM pages p WHERE p.websiteid=" + websiteId + " AND p.ownerid=" + ownerId + " AND p.deleted=0 AND p.enabled=1";
                if (!string.IsNullOrEmpty(search))
                {
                    sql += " AND (p.title LIKE '%" + search + "%' OR p.description LIKE '%" + search + "%')";
                }
                if (orderBy == 7)
                {
                    sql += " AND p.usersonly=1";
                }
                if (parentId > -1)
                {
                    if (parentId == 0)
                    {
                        sql += " AND (p.parentid=0 OR p.parentid is null)";
                    }
                    else
                    {
                        sql += " AND p.parentid=" + parentId;
                    }
                }
                else if (parentId == -1)
                {
                    //favorites only
                    sql += " AND p.favorite=1";
                }
                sql += ") AS mytbl WHERE rownum >= " + start + " AND rownum < " + (start + (length + 1));
                sql += " ORDER BY haschildren DESC";

                reader.ReadFromSqlClient(S.Sql.ExecuteReader(sql));
            }
            return reader;
        }
        #endregion

        #region "Photos"
        public SqlReader GetPhotos(int websiteId, int start, int length, string folder = "", int orderBy = 1)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                string sql = "EXEC GetPhotos @websiteId=" + websiteId + ", @folder='" + folder + "'" + 
                             ", @start=" + start + ", @length=" + length + ", @orderby=" + orderBy;
                reader.ReadFromSqlClient(S.Sql.ExecuteReader(sql));
            }
            return reader;
        }

        public SqlReader GetPhotos(int websiteId, string[] filenames)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                string sql = "EXEC GetPhotos @websiteId=" + websiteId + ", @filenames='" + string.Join(",", filenames) + "'";
                reader.ReadFromSqlClient(S.Sql.ExecuteReader(sql));
            }
            return reader;
        }

        public SqlReader GetPhoto(int websiteId, string filename)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                string sql = "EXEC GetPhoto @websiteId=" + websiteId + ", @filename='" + filename + "'";
                reader.ReadFromSqlClient(S.Sql.ExecuteReader(sql));
            }
            return reader;
        }

        public void AddPhoto(int websiteId, string folder, string filename, string uploadname, int width, int height)
        {
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                S.Sql.ExecuteNonQuery("EXEC AddPhoto @websiteId=" + websiteId + ", @filename='" + filename + "', @folder='" + folder + "'" +
                ", @uploadname='" + uploadname + "', @width=" + width + ", @height=" + height);
            }
                
        }

        public void DeletePhoto(int websiteId, string filename)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                //get photo info first
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetPhoto @websiteId=" + websiteId + ", @filename='" + filename + "'"));
                string folder = "";
                if(reader.Rows.Count > 0)
                {
                    reader.Read();
                    folder = reader.Get("foldername");
                    if (folder != "") { folder += "/"; }
                    string path = "/wwwroot/content/websites/" + S.Page.websiteId + "/photos/" + folder;
                    folder = folder.Replace("/", "");

                    //delete physical file on disk
                    if (File.Exists(S.Server.MapPath(path + filename)) == true) { File.Delete(S.Server.MapPath(path + filename)); }
                    if (File.Exists(S.Server.MapPath(path + "xl" + filename)) == true) { File.Delete(S.Server.MapPath(path + "xl" + filename)); }
                    if (File.Exists(S.Server.MapPath(path + "lg" + filename)) == true) { File.Delete(S.Server.MapPath(path + "lg" + filename)); }
                    if (File.Exists(S.Server.MapPath(path + "med" + filename)) == true) { File.Delete(S.Server.MapPath(path + "med" + filename)); }
                    if (File.Exists(S.Server.MapPath(path + "sm" + filename)) == true) { File.Delete(S.Server.MapPath(path + "sm" + filename)); }
                    if (File.Exists(S.Server.MapPath(path + "tiny" + filename)) == true) { File.Delete(S.Server.MapPath(path + "tiny" + filename)); }
                    if (File.Exists(S.Server.MapPath(path + "icon" + filename)) == true) { File.Delete(S.Server.MapPath(path + "icon" + filename)); }

                    //remove record from database
                    S.Sql.ExecuteNonQuery("EXEC DeletePhoto @websiteId=" + websiteId + ", @filename='" + filename + "'");
                }



                
            }
                

        }

        public void DeletePhotos(int websiteId, string[] filenames)
        {
            for(int x = 0;x < filenames.Length; x++)
            {
                DeletePhoto(websiteId, filenames[x]);
            }
        }

        public void MovePhotos(int websiteId, string[] filenames, string folder)
        {
            S.Sql.ExecuteNonQuery("EXEC MovePhotos @websiteId=" + websiteId + ", @filenames='" + string.Join(",",filenames) + "', @folder='" + folder + "'");
        }

        public SqlReader GetPhotoFolders(int websiteId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                string sql = "EXEC GetPhotoFolders @websiteId=" + websiteId;
                reader.ReadFromSqlClient(S.Sql.ExecuteReader(sql));
            }
            return reader;
        }

        public void AddPhotoFolder(int websiteId, string name)
        {
            S.Sql.ExecuteNonQuery("EXEC AddPhotoFolder @websiteId=" + websiteId + ", @name='" + name + "'");
        }

        public void DeletePhotoFolder(int websiteId, string folder)
        {
            S.Sql.ExecuteNonQuery("EXEC DeletePhotoFolder @websiteId=" + websiteId + ", @folder='" + folder + "'");
        }

        #endregion
    }
}
