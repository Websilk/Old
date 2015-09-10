-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/6/2009
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteTemplatesForDesign]
	@userId int = 0, 
	@themeId int = 0,
	@galaxyId int = 0,
	@keywords nvarchar(25) = '',
	@start int = 1,
	@length int = 10,
	@orderby int = 1
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM (
	SELECT ROW_NUMBER() OVER(ORDER BY 
	CASE WHEN @orderby = 1 THEN datecreated END ASC,
	CASE WHEN @orderby = 2 THEN datecreated END DESC) AS rownum, 
	w.websiteid, w.title, w.pagehome, w.datecreated, w.license, w.licensetype,
	(SELECT datemodified FROM pages WHERE pageid=w.pagehome) as datemodified,
	w.price, 
	(SELECT CASE WHEN COUNT(*) > 0 THEN 
		(SELECT CASE WHEN description IS NOT NULL THEN [description] ELSE 'no description' END 
		FROM pages where pageid=w.pagehome) 
	ELSE '' END FROM pages where pageid=w.pagehome) AS description
	FROM websites w 
	WHERE themeid=@themeid AND ownerid=@userid AND websitetype=2 AND enabled=1 AND deleted=0
	) as mytbl1 WHERE rownum >= @start AND rownum <= @start + @length
	
END
