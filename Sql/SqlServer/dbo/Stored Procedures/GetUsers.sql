-- =============================================
-- Author:		Mark Entingh
-- Create date: ? 2008 ?
-- Description:	Get a list of users based on a search filter
-- =============================================
CREATE PROCEDURE [dbo].[GetUsers]
	@userId int = 0, 
	@start int = 1,
	@length int = 10,
	@firstname nvarchar(100) = '',
	@lastname nvarchar(100) = '',
	@email nvarchar(75) = '',
	@displayname nvarchar(25) = '',
	@city nvarchar(25) = '',
	@state nvarchar(2) = '',
	@Country nvarchar(3) = '',
	@zipcode nvarchar(10) = '',
	@orderby int = 1
AS
BEGIN
	SET NOCOUNT ON;
	SELECT userId, firstname, lastname, email, displayname, photo, city, state, country, zipcode, status, datecreated
	FROM (SELECT ROW_NUMBER() 
	OVER (ORDER BY
	CASE WHEN @orderby = 0 THEN p.tutorial END DESC,
	CASE WHEN @orderby = 1 THEN p.firstname END DESC,
	CASE WHEN @orderby = 2 THEN p.lastname END ASC,
	CASE WHEN @orderby = 3 THEN p.email END DESC,
	CASE WHEN @orderby = 4 THEN p.displayname END ASC 
	) as rownum, p.*
	FROM Users AS p
	WHERE 
	p.userId = CASE WHEN @userId > 0 THEN @userId ELSE p.userId END
	AND (
		p.firstname LIKE CASE WHEN @firstname <> '' THEN '%' + @firstname + '%' ELSE p.firstname END
		AND p.lastname LIKE CASE WHEN @lastname <> '' THEN '%' + @lastname + '%' ELSE p.lastname END
		AND p.displayname LIKE CASE WHEN @displayname <> '' THEN '%' + @displayname + '%' ELSE p.displayname END
		)
		
	AND p.email LIKE CASE WHEN @email <> '' THEN '%' + @email + '%' ELSE p.email END
	AND p.city LIKE CASE WHEN @city <> '' THEN '%' + @city + '%' ELSE p.city END
	AND p.state = CASE WHEN @state <> '' THEN @state ELSE p.state END
	AND p.country = CASE WHEN @country <> '' THEN @country ELSE p.country END
	AND p.zipcode = CASE WHEN @zipcode <> '' THEN @zipcode ELSE p.zipcode END
	) as myTable
	WHERE rownum >= @start AND  rownum <= @start + @length
END
