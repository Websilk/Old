

-- =============================================
-- Author:		Mark Entingh
-- Create date: 01/14/2010 7:00 PM
-- Description:	get a list of free website themes
-- =============================================
CREATE PROCEDURE [dbo].[GetThemesForFree]
	@userId int,
	@start int = 0,
	@length int = 0,
	@category int = 0
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY l.datecreated DESC) AS rownum, 
	 l.*, (SELECT pagehome FROM WebSites WHERE websiteId=l.websiteId) AS pagehome
	FROM Themes l
	WHERE l.price=0 AND l.private = 0
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	AND NOT l.userId = @userId
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END
