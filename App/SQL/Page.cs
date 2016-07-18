using System;

namespace Websilk.SqlClasses
{
    public class Page: SqlMethods
    {
        public Page(Core WebsilkCore) : base(WebsilkCore)
        {
        }

        #region "PageId"
        public int GetHomePageIdFromDomain(string Domain)
        {
            int pageid = 0;
            if (dataType == enumSqlDataTypes.SqlClient) {
                pageid = (int)S.Sql.ExecuteScalar("SELECT p.pageid FROM websitedomains w LEFT JOIN pages p ON p.pageid=(SELECT w2.pagehome FROM websites w2 WHERE w2.websiteid=w.websiteid) WHERE w.domain = '" + Domain + "' AND p.deleted=0");
            }
            return pageid;
        }

        public int GetHomePageIdFromSubDomain(string domain, string subDomain)
        {
            int pageid = 0;
            if (dataType == enumSqlDataTypes.SqlClient)
            {
                pageid = (int)S.Sql.ExecuteScalar("SELECT p.pageid FROM websitesubdomains w LEFT JOIN pages p ON p.pageid=(SELECT w2.pagehome FROM websites w2 WHERE w2.websiteid=w.websiteid) WHERE w.domain = '" + domain + "' AND w.subdomain='" + subDomain + "' AND p.deleted <> 1");
            }
            return pageid;
        }

        public int GetPageIdFromDomainAndTitle(string domain, string title)
        {
            int pageid = 0;
            if (dataType == enumSqlDataTypes.SqlClient)
            {
                pageid = (int)S.Sql.ExecuteScalar("EXEC GetPageIdFromDomainAndTitle @domainname='" + domain + "', @pagetitle='" + title + "'");
            }
            return pageid;
        }

        public int GetPageIdFromSubDomainAndTitle(string domain, string subDomain, string title)
        {
            int pageid = 0;
            if (dataType == enumSqlDataTypes.SqlClient)
            {
                pageid = (int)S.Sql.ExecuteScalar("EXEC GetPageIdFromSubDomainAndTitle @domainname='" + domain + "', @subdomain='" + subDomain + "', @pagetitle='" + title + "'");
            }
            return pageid;
        }
        #endregion

        #region "Page Info"
        public SqlReader GetPageInfoFromDomain(string domain)
        {
            SqlReader reader = new SqlReader();
            if(S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetPageInfoFromDomain @domain='" + domain + "'"));
            }
            return reader;
        }

        public SqlReader GetPageInfoFromDomainAndTitle(string domain, string title)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("GetPageInfoFromDomainAndTitle @domain='" + domain + "', @title='" + title + "'"));
            }
            return reader;
        }

        public SqlReader GetPageInfoFromSubDomain(string domain, string subDomain)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetPageInfoFromSubDomain @domain = '" + domain + "', @subdomain='" + subDomain + "'"));
            }
            return reader;
        }

        public SqlReader GetPageInfoFromSubDomainAndTitle(string domain, string subDomain, string title)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetPageInfoFromSubDomainAndTitle @domain='" + domain + "', @subdomain='" + subDomain + "', @title='" + title + "'"));
            }
            return reader;
        }

        public SqlReader GetPageInfoFromPageId(int pageId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetPageInfoFromPageId @pageId=" + pageId));
            }
            return reader;
        }

        public SqlReader GetPageTitle(int parentId, int websiteId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("SELECT p.title, p.parentid, p.path, p.pathids, (SELECT title FROM pages WHERE pageid=p.parentId) AS parenttitle FROM pages p WHERE p.pageid=" + parentId + " AND p.websiteid=" + websiteId));
            }
            return reader;
        }

        public SqlReader GetParentInfo(int pageId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("SELECT TOP 1 p2.title AS parenttitle, p.title, p.security, p.description FROM pages p LEFT JOIN pages p2 ON p2.pageid=p.parentid WHERE p.pageid=" + pageId));
            }
            return reader;
            //
        }
        #endregion

        #region "Login"
        public void SaveLoginForAuth(string salt, string email, string loginId)
        {
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                S.Sql.ExecuteNonQuery("EXEC savelogin @hash='" + salt + "', @email='" + email + "', @loginid='" + loginId + "'");
            }
        }

        public string AuthLoginForScreenshot(string auth, int websiteId, int kill)
        {
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                return (string)S.Sql.ExecuteScalar("EXEC authenticateScreenshot @auth='" + auth + "', @websiteid=" + websiteId + ",@kill=" + (kill == 0 ? "0" : "1"));
                //should return "pass"
            }
            return "";
        }

        public SqlReader AuthLogin(string auth)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC authenticatelogin @loginid='" + auth + "'"));
            }
            return reader;
            
        }

        public void SaveLoginTime(int userId)
        {
            S.Sql.ExecuteNonQuery("UPDATE users SET lastlogin='" + DateTime.Now + "' WHERE userid=" + userId);
        }

        #endregion

        #region "User Security"
        public SqlReader GetUserSecurity(int userId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("SELECT DISTINCT websiteid FROM websitesecurity WHERE userid=" + userId));
            }
            return reader;
        }

        public bool HasUserSecurityForWebsite(int userId, int websiteId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("SELECT DISTINCT websiteid FROM websitesecurity WHERE userid=" + userId + " AND websiteId=" + websiteId));
            }
            return reader.Rows.Count > 0;
        }

        public SqlReader GetUserSecurityForWebsite(int websiteId, int userId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetSecurityForWebsite @websiteid=" + websiteId + ", @userid=" + userId));
            }
            return reader;
        }

        public SqlReader GetUserSecurtyForWebsitesOwned(int userId)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("SELECT websiteid FROM websites WHERE ownerid=" + userId));
            }
            return reader;
        }

        public int GetUserSecurtyOwnerForWebsite(int websiteId)
        {
            int owner = 0;
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                owner = (int)S.Sql.ExecuteScalar("SELECT ownerid FROM websites WHERE websiteid=" + websiteId);
            }
            return owner;
        }

        //
        #endregion
    }
}
