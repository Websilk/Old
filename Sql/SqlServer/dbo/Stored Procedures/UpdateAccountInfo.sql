-- =============================================
-- Author:		Mark Entingh
-- Create date: 4/28/2012 1:43 PM
-- Description:	
-- =============================================
CREATE PROCEDURE UpdateAccountInfo
	@userid int = 0,
	@firstname nvarchar(25) = '', 
	@lastname nvarchar(25) = '',
	@email nvarchar(75) = '',
	@gender smallint = 1,
	@bday datetime,
	@zipcode nvarchar(10)
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE Users SET firstname=@firstname, lastname=@lastname, gender=@gender, bday=@bday, zipcode=@zipcode WHERE userId=@userid
	IF @email <> ''
	BEGIN
		UPDATE Users SET email=@email WHERE userId=@userid
	END
	
END
