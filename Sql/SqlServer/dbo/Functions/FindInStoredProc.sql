-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/9/2015 4:10 am
-- Description:	
-- =============================================
CREATE FUNCTION FindInStoredProc 
(	
	-- Add the parameters for the function here
	@search nvarchar(250)
)
RETURNS TABLE 
AS
RETURN 
(
	-- Add the SELECT statement with parameter references here
	SELECT DISTINCT 
       o.name AS Object_Name,
       o.type_desc
  FROM sys.sql_modules m 
       INNER JOIN 
       sys.objects o 
         ON m.object_id = o.object_id
 WHERE m.definition Like '%'+@search+'%'
)
