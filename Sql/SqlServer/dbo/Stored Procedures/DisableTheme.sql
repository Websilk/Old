-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2013 2:09 PM
-- Description:	disable a theme
-- =============================================
CREATE PROCEDURE [dbo].[DisableTheme] 
	@themeid int = 0
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE Themes SET enabled=0 WHERE themeid=@themeid
END

