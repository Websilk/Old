-- =============================================
-- Author:		Mark Entingh
-- Create date: 3/21/2012
-- Description:	create a new website theme
-- =============================================
CREATE PROCEDURE [dbo].[AddTheme] 
	@userId int = 0, 
	@designId int = 0,
	@schemeId int = 0,
	@title nvarchar(50) = '',
	@price int = 0,
	@rating int = 0,
	@ratingcount int = 0,
	@ratingtotal int = 0,
	@datecreated datetime,
	@approved bit = 0,
	@private bit = 0,
	@enabled bit = 0,
	@deleted bit = 0,
	@license bit = 0,
	@licensetype smallint = 0,
	@description nvarchar(200) = ''
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Themes (themeid,userId, designId, schemeId, title, price, rating, ratingcount,
	ratingtotal, datecreated, approved, [private], [enabled], deleted, license, licensetype, [description])
	VALUES(NEXT VALUE FOR SequenceThemes, @userId, @designId, @schemeId, @title, @price, @rating, @ratingcount, 
	@ratingtotal, @datecreated, @approved, @private, @enabled, @deleted, @license, @licensetype, @description)
	
	SELECT TOP 1 themeid FROM Themes WHERE userId=@userId AND title=@title ORDER BY datecreated DESC
END
