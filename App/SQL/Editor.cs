
namespace Websilk.SqlClasses
{
    public class Editor: SqlMethods
    {
        public Editor(Core WebsilkCore) : base(WebsilkCore)
        {
        }

        #region "Components Window"
        public SqlReader GetComponentsList(int category, int start, int length)
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetComponents @start=" +start + ", @length=" + length + ", @category=" + category));
            }
            return reader;
        }

        public SqlReader GetComponentCategories()
        {
            SqlReader reader = new SqlReader();
            if (S.Sql.dataType == enumSqlDataTypes.SqlClient)
            {
                reader.ReadFromSqlClient(S.Sql.ExecuteReader("EXEC GetComponentCategories @ownerId=" + S.Page.ownerId + ", @websiteId=" + S.Page.websiteId));
            }
            return reader;
            //
        }
        #endregion

    }
}
