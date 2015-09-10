

-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/21/2012 1:50 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetUsersForAdmin] 
	@start int = 0, 
	@length int = 0,
	@orderby int = 1,
	@keywords nvarchar(50) = ''
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @rownum int, 
		@userId int,
		@firstname nvarchar(25),
		@lastname nvarchar(25),
		@email nvarchar(50),
		@photo nvarchar(25),
		@gender bit,
		@zipcode nvarchar(11),
		@city nvarchar(25),
		@state nvarchar(4),
		@country nvarchar(4),
		@datecreated datetime,
		@status int,
		@deleted bit,
		@websiteid int,
		@title nvarchar(100),
		@pagehome int
		
    DECLARE  @tUsers TABLE (
		userId int,
		firstname nvarchar(25),
		lastname nvarchar(25),
		email nvarchar(50),
		photo nvarchar(25),
		gender bit,
		zipcode nvarchar(11),
		city nvarchar(25),
		state nvarchar(4),
		country nvarchar(4),
		datecreated datetime,
		status int,
		deleted bit,
		websiteid int,
		domain nvarchar(25),
		subdomain nvarchar(50),
		title nvarchar(100),
		pagehome int
    )
    
    DECLARE @cursor1 CURSOR
    
    SET @cursor1 = CURSOR FOR
	SELECT a.*
	FROM (
		SELECT TOP (@start+@length) ROW_NUMBER() OVER (
			ORDER BY 
			m.deleted ASC,
			CASE WHEN @orderby = 1 THEN m.datecreated END DESC,
			CASE WHEN @orderby = 2 THEN m.datecreated END ASC,
			CASE WHEN @orderby = 3 THEN m.datecreated END ASC,
			CASE WHEN @orderby = 4 THEN m.firstname END ASC,
			CASE WHEN @orderby = 5 THEN m.lastname END ASC,
			CASE WHEN @orderby = 6 THEN m.lastlogin END DESC,
			CASE WHEN @orderby = 7 THEN m.lastlogin END DESC,
			CASE WHEN @orderby = 8 THEN m.lastlogin END DESC
		) AS rownum, m.userId, m.firstname, m.lastname, m.email,
		m.photo, m.gender, m.zipcode, m.city, m.[state], m.country,
		m.datecreated, m.status, m.deleted FROM Users m 
		WHERE 
		(m.firstname = CASE WHEN @keywords <> '' THEN @keywords ELSE m.firstname END
		OR m.lastname = CASE WHEN @keywords <> '' THEN @keywords ELSE m.lastname END
		OR m.zipcode = CASE WHEN @keywords <> '' THEN @keywords ELSE m.zipcode END
		OR m.email = CASE WHEN @keywords <> '' THEN @keywords ELSE m.email END
		)
		AND m.status = CASE WHEN @orderby = 3 THEN 0 ELSE m.status END
		AND m.firstname <> CASE WHEN (@orderby = 4 OR @orderby = 5) THEN '' ELSE '!' END
		AND m.lastlogin <= CASE WHEN @orderby = 6 THEN DATEADD(DAY, -30, GETDATE()) ELSE 
		CASE WHEN @orderby = 7 THEN DATEADD(DAY, -90, GETDATE()) ELSE m.lastlogin END END
		
		AND m.deleted = CASE WHEN @orderby = 8 THEN 1 ELSE m.deleted END
	) AS a 
	WHERE a.rownum >= @start AND a.rownum <= @start + @length 
	
	OPEN @cursor1
	
	FETCH FROM @cursor1 INTO
	@rownum, @userid, @firstname, @lastname, @email, @photo, @gender, @zipcode, @city,
	@state, @country, @datecreated, @status, @deleted
	
	WHILE @@FETCH_STATUS = 0
	BEGIN
	
	SET @websiteid=0
	SET @title=''
	SET @pagehome=0
	SELECT TOP 1 @websiteid=w.websiteid, @title=w.title, @pagehome=pagehome FROM websites w WHERE w.ownerid=@userid
	
	INSERT INTO @tUsers (userId, firstname, lastname, email, photo, gender, zipcode, city, [state],
							country, datecreated, [status], deleted, websiteid, title, pagehome, domain, subdomain)
	VALUES(@userId, @firstname, @lastname, @email, @photo, @gender, @zipcode, @city, @state, 
			@country, @datecreated, @status, @deleted, @websiteid, @title, @pagehome,
			(SELECT TOP 1 domain FROM WebsiteDomains WHERE websiteId=@websiteid),
			(SELECT TOP 1 subdomain+'.'+domain FROM WebsiteSubDomains WHERE websiteId=@websiteid)
	)
	
	FETCH FROM @cursor1 INTO
	@rownum, @userid, @firstname, @lastname, @email, @photo, @gender, @zipcode, @city,
	@state, @country, @datecreated, @status, @deleted
	END
	
	CLOSE @cursor1
	DEALLOCATE @cursor1
	
	SELECT * FROM @tUsers
	
	END
