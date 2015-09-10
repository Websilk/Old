-- =============================================
-- Author:		Mark Entingh
-- Create date: 01/14/2010 7:00 PM
-- Description:	get a list of uploaded website themes
-- =============================================
CREATE PROCEDURE [dbo].[GetThemesUploaded]
	@userId int = 0, 
	@start int = 0,
	@length int = 0
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY l.datecreated DESC) AS rownum, 
	 l.* FROM Themes l
	WHERE l.userId=@userId
	AND l.approved = 1 AND l.enabled = 1 AND l.deleted = 0
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END
