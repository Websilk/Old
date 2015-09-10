-- =============================================
-- Author:		Mark Entingh
-- Create date: 2:00 AM 12/7/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteTemplatesForUser]
	@userId int = 0, 
	@galaxyId int = 0,
	@keywords nvarchar(25) = '',
	@start int = 1,
	@length int = 10,
	@orderby int = 2
AS
BEGIN
	SET NOCOUNT ON;
    
	SELECT * FROM (
	SELECT ROW_NUMBER() OVER(ORDER BY 
		CASE WHEN @orderby = 1 THEN w.datecreated END ASC,
		CASE WHEN @orderby = 2 THEN w.datecreated END DESC,
		CASE WHEN @orderby = 3 THEN w.title END ASC,
		CASE WHEN @orderby = 4 THEN w.title END DESC,
		CASE WHEN @orderby = 5 THEN d.title END ASC,
		CASE WHEN @orderby = 5 THEN w.datecreated END DESC) AS rownum, 
	w.websiteid, w.title, w.pagehome, w.datecreated, w.license, w.licensetype,
	(SELECT datemodified FROM pages WHERE pageid=w.pagehome) AS datemodified, w.price, 
	(SELECT CASE WHEN COUNT(*) > 0 THEN 
		(SELECT CASE WHEN [description] IS NOT NULL THEN [description] ELSE 'no description' END FROM pages where pageid=w.pagehome) 
	ELSE '' END FROM pages where pageid=w.pagehome) AS [description],
	d.title as themetitle
	FROM websites w LEFT JOIN themes d ON d.themeid=w.themeid
	WHERE ownerid=@userid AND w.websitetype=2 AND w.[enabled]=1 AND w.deleted=0
	) as mytbl1 WHERE rownum >= @start AND rownum <= @start + @length
	
END
