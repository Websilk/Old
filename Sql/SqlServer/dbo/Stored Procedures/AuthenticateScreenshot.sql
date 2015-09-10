-- =============================================
-- Author:		Mark Entingh
-- Create date: 11/28/2012 1:33 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AuthenticateScreenshot] 
	@auth nvarchar(20) = '',
	@websiteid int = 0,
	@kill int = 1
AS
BEGIN
	SET NOCOUNT ON;
	IF (SELECT COUNT(*) FROM screenshots WHERE websiteid=@websiteid AND auth=@auth) = 1
	BEGIN
		IF @kill=1 BEGIN
			DELETE FROM screenshots WHERE websiteid=@websiteid AND auth=@auth
		END
		SELECT 'pass'
	END
END
