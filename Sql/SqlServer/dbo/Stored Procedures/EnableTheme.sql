-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2013 2:09 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[EnableTheme] 
	@themeid int = 0
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE Themes SET enabled=1, deleted=0 WHERE themeid=@themeid
END

