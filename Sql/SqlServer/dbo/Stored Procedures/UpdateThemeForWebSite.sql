-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/27/2012
-- Description:	
-- =============================================
CREATE PROCEDURE UpdateThemeForWebSite 
	@websiteId int = 0, 
	@themeId int = 0
AS
BEGIN
	UPDATE WebSites SET themeId=@themeId WHERE websiteId=@websiteId
	UPDATE Pages SET themeId=@themeId WHERE websiteId=@websiteId 
END
