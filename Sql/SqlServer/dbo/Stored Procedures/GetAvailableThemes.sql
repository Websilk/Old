-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/21/2008
-- Description:	get a list of website themes
-- that a user has access to, including free & paid
-- =============================================
CREATE PROCEDURE [dbo].[GetAvailableThemes] 
	@userId int = 0, 
	@start int = 0,
	@length int = 9
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM (
		SELECT ROW_NUMBER() OVER (ORDER BY o.datecreated DESC, e.datecreated DESC) AS rownum, e.*, m.displayname, m.photo 
		FROM Themes e 
		LEFT JOIN Users m ON m.userid = e.userId
		LEFT JOIN ThemesOwned o ON o.userId=@userId
		WHERE e.price = 0 
		OR e.userId=@userId
		OR (NOT o.userid IS NULL AND e.price > 0)
	) as myTbl WHERE rownum >= @start AND rownum <= @start + @length
	
END
