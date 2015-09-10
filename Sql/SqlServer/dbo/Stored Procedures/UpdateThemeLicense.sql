-- =============================================
-- Author:		Mark Entingh
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE UpdateThemeLicense
	@themeid int = 0, 
	@licensetype int = 0,
	@price int = 0
AS
BEGIN
	SET NOCOUNT ON;
	IF @licensetype = 0 BEGIN -- Private License
		UPDATE themes SET private=1, license=0, licensetype=0, price=0 WHERE themeid=@themeid
	END
	ELSE IF @licensetype = 1 BEGIN -- Public Free License
		UPDATE themes SET private=0, license=1, licensetype=1, price=0 WHERE themeid=@themeid
	END
	ELSE IF @licensetype = 2 BEGIN -- Professional License
		UPDATE themes SET private=0, license=1, licensetype=2, price=@price WHERE themeid=@themeid
	END

END
