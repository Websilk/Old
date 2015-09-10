-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/5/2008
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsitesForUser] 
	@userId int = 0, 
	@start int = 0,
	@length int = 12,
	@search nvarchar(50),
	@orderby int = 0
AS
BEGIN
	SET NOCOUNT ON;
	SELECT websiteId, ownerId, title, pagetemplate, pagehome,
	themeId, dateCreated, datemodified, 
	security, description, published  
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN w.datecreated END DESC,
	CASE WHEN @orderby = 1 THEN p.datemodified END DESC,
	CASE WHEN @orderby = 2 THEN w.title END ASC
) as rownum, 
	w.websiteId, w.ownerId, w.title, w.pagetemplate, w.pagehome,
	w.themeId, w.dateCreated, p.datemodified, p.description, 
	p.published, p.[security]
	FROM WebSites AS w LEFT JOIN Pages AS p ON p.pageid=w.pagehome
	WHERE w.ownerId = @userId
	AND w.websitetype <> 2 -- 2 = template web site for a design
	AND w.deleted=0
	AND w.enabled=1
	AND (
		w.title LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.title END
		OR p.description LIKE CASE WHEN @search <> '' THEN '%' + @search + '%' ELSE p.description END
	)) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END
