

-- =============================================
-- Author:		Mark Entingh
-- Create date: 10/13/2011 11:33 AM
-- Description:	Adds a user to the platform
-- =============================================
CREATE PROCEDURE [dbo].[AddUser] 
	@firstname nvarchar(25) = '', 
	@lastname nvarchar(25) = '',
	@email nvarchar(75) = '',
	@password nvarchar(100) = '',
	@displayname nvarchar(25) = '',
	@photo nvarchar(30) = '',
	@gender smallint = 0,
	@bday datetime = '1/1/1983',
	@zipcode nvarchar(10) = '',
	@city nvarchar(25) = '',
	@state nvarchar(2) = '',
	@country nvarchar(3) = '',
	@twitter nvarchar(25) = '',
	@status int = 0,
	@signupip nvarchar(15) = '',
	@referrer nvarchar(250) = '',
	@activation nchar(20) = '',
	@deleted bit = 0,
	@tutorial bit = 0
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @date datetime = GETDATE()

    INSERT INTO Users (userId, firstname, lastname, email, [password], displayname, photo,
    gender, bday, zipcode, city, [state], country, twitter, lastlogin, datecreated, [status],
    signupip, referrer, [activation], deleted, tutorial)
    VALUES
    (NEXT VALUE FOR SequenceUsers, @firstname, @lastname, @email, @password, @displayname, @photo,
	@gender, @bday, @zipcode, @city, @state, @country, @twitter, @date, @date, @status,
    @signupip, @referrer, @activation, @deleted, @tutorial)
    
    DECLARE @userId int = 0
    SELECT @userId = userId FROM Users WHERE email=@email
    SELECT @userId as userId
END
