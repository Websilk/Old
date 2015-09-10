-- =============================================
-- Author:		Mark Entingh
-- Create date: 7/10/2009
-- Description:	Create a new web page
-- =============================================
CREATE PROCEDURE [dbo].[AddWebsitePage] 
	@ownerId int = 0, 
	@themeId int = 0,
	@websiteId int = 0,
	@parentid int = 0,
	@schemeId int = null,
	@title nvarchar(250) = '',
	@background nvarchar(250) = '',
	@description nvarchar(MAX) = '',
	@security bit = 0,
	@usersonly int = 0,
	@enabled bit = 1
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @pageId int, 
			@websiteTitle nvarchar(250), 
			@websiteOwnerId int = 0, 
			@path nvarchar(MAX), 
			@pathIds nvarchar(MAX),
			@datenow datetime,
			@newThemeId int, 
			@bg nvarchar(250)

	SET @datenow = GETDATE()
	(SELECT @websiteTitle = title, @newThemeId = themeId, @websiteOwnerId = ownerId
	FROM WebSites WHERE websiteId=@websiteId)
	IF @themeId > 0
	BEGIN
		SET @newThemeId = @themeId
	END
	IF @websiteTitle <> ''
	BEGIN
		SET @pageId = NEXT VALUE FOR SequencePages
		SET @bg = @background
		IF @bg = 'null' BEGIN SET @bg = NULL END

		INSERT INTO Pages (pageId, ownerId, parentid, themeId, websiteId, schemeId, title, path, pathIds,
		datecreated, datemodified, datepublished, security, usersonly, published,
		rating, ratingtotal, ratedcount, background, description, enabled, deleted) 
		VALUES(@pageId, @websiteOwnerId, @parentid, @newThemeId, @websiteId, @schemeId, @websiteTitle + ' - ' + @title, '', '',
		@datenow, @datenow, @datenow, @security, @usersonly, 0, 
		0, 0, 0, @bg, @description, @enabled, 0)

		/* update page heirarchy paths for title & ids */
		IF @parentId > 0 BEGIN
			UPDATE pages SET path=dbo.GetPagePath(@pageId), pathIds=dbo.GetPagePathIds(@pageId) WHERE pageid=@pageid
		END
		
		SELECT TOP 1 p.pageid, p.datecreated, p.datemodified, p.themeId, l.userId AS themeowner FROM Pages p, Themes l WHERE p.ownerId=@websiteOwnerId AND p.websiteId=@websiteId AND l.themeId=p.themeid ORDER BY p.datecreated DESC
	END
END
