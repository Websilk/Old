-- =============================================
-- Author:		Mark Entingh
-- Create date: 07/19/2013 4:50 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsiteTemplatesForFree]
	@userId int,
	@start int = 0,
	@length int = 0,
	@category int = 0
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY w.datecreated DESC) AS rownum, 
	 w.websiteid, w.ownerid as userid, w.title, w.pagehome, 
	(SELECT description FROM pages WHERE pageid=w.pagehome) AS description
	FROM websites w
	WHERE w.price=0 AND license=1 AND licensetype=1
	AND w.enabled = 1 AND w.deleted = 0
	AND NOT w.ownerId = @userId
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END
