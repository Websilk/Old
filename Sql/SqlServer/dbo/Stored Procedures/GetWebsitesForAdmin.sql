-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/22/2009 10:55 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsitesForAdmin] 
	@start int = 1,
	@length int = 10,
	@search nvarchar(100)='',
	@orderby int = 1
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @cursor1 CURSOR,
    @rownum int,
    @websiteid int,
    @title nvarchar(100),
    @pagehome int,
	@websitetype int,
	@license bit, 
	@licensetype int, 
	@statustype bit,
	@deleted bit,
    @datecreated datetime,
    @lastmodified datetime,
    @security int,
    @published bit,
    @ratingtotal int,
    @ratedcount int,
    @datemodified datetime,
    @description nvarchar(250),
    @pageDate datetime,
    @pageMonth nvarchar(2),
    @pageDay nvarchar(2),
    @pageHour nvarchar(2),
    @pageMod datetime,
    @pageId int,
    @domain nvarchar(25),
    @subdomain nvarchar(50)
    
    DECLARE  @tblWebsites TABLE(
		rownum int,
		websiteid int,
		title nvarchar(100),
		pagehome int,
		websitetype int,
		license bit, 
		licensetype int, 
		statustype bit,
		deleted bit,
		datecreated datetime,
		lastmodified datetime,
		[security] int,
		published bit,
		ratingtotal int,
		ratedcount int,
		datemodified datetime,
		[description] nvarchar(250),
		domain nvarchar(25),
		subdomain nvarchar(50),
		screenshot nvarchar(50)
    ) 
    
    
    
    SET @cursor1 = CURSOR FOR
	SELECT a.*,(SELECT TOP 1 datemodified FROM pages WHERE websiteid=a.websiteid AND pageid=a.pagehome) AS lastmodified,
	(SELECT TOP 1 domain FROM websitedomains WHERE websiteid=a.websiteid) AS domain,
	(SELECT TOP 1 subdomain+'.'+domain FROM websitesubdomains WHERE websiteid=a.websiteid) AS subdomain
		 FROM (
		SELECT TOP (@start+@length) ROW_NUMBER() OVER(ORDER BY
			CASE WHEN @orderby = 1 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 2 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 3 THEN w.title END ASC,
			CASE WHEN @orderby = 4 THEN w.title END DESC,
			CASE WHEN @orderby = 5 THEN w.title END ASC,
			CASE WHEN @orderby = 6 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 7 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 8 THEN w.title END ASC,
			CASE WHEN @orderby = 9 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 10 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 11 THEN w.title END ASC,
			CASE WHEN @orderby = 12 THEN w.datecreated END DESC
		) AS rownum, 
		w.websiteid, w.title, w.pagehome, w.websitetype, w.license, w.licensetype, w.statustype, 
		w.deleted, p.datecreated, p.[security], p.published, p.ratingtotal, p.ratedcount, 
		p.datemodified, p.[description]
		
		FROM websites w, pages p 
		WHERE p.pageid=w.pagehome
		AND (
			w.title LIKE '%' + @search + '%'
			OR p.description LIKE '%' + @search + '%' 
		)

		AND w.websitetype = CASE WHEN @orderby = 5 THEN 2 ELSE 
							CASE WHEN @orderby = 6 THEN 2 ELSE
							CASE WHEN @orderby = 7 THEN 2 ELSE
							CASE WHEN @orderby = 8 THEN w.websitetype ELSE 
							CASE WHEN @orderby = 9 THEN w.websitetype ELSE
							CASE WHEN @orderby = 10 THEN w.websitetype ELSE 0
							END END END END END END
		AND w.deleted = CASE WHEN @orderby = 8 THEN 1 ELSE 
						CASE WHEN @orderby = 9 THEN 1 ELSE
						CASE WHEN @orderby = 10 THEN 1 ELSE w.deleted 
						END END END

		AND w.statustype = CASE WHEN @orderby = 11 THEN 0 ELSE
						CASE WHEN @orderby = 12 THEN 0 ELSE w.statustype
						END END


	)AS a WHERE rownum >= @start AND rownum <= @start + @length
	
	OPEN @cursor1
	
	FETCH FROM @cursor1 INTO
	@rownum, @websiteid, @title,  @pagehome, @websitetype, @license, @licensetype, 
	@statustype, @deleted, @datecreated, @security, @published, 
    @ratingtotal, @ratedcount, @datemodified, @description, @lastmodified, @domain, @subdomain
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
    
		SELECT TOP 1 @pageDate=datecreated, @pageMod=datemodified, @pageId=pageId FROM Pages WHERE websiteId=@websiteid AND pageid=@pagehome
		SET @pageMonth = MONTH(@pageDate)
		SET @pageDay = DAY(@pageDate)
		SET @pageHour = DATEPART(hour, @pageMod)
		IF @pageHour > 12
		BEGIN
		SET @pageHour = @pageHour - 12
		END
		IF @pageHour = 0
		BEGIN
		SET @pageHour = 12
		END
		
		IF LEN(@pageMonth) = 1
		BEGIN
		SET @pageMonth = '0' + CONVERT(nvarchar(1), @pageMonth)
		END
		IF LEN(@pageDay) = 1
		BEGIN
		PRINT LEN(@pageDay)
		SET @pageDay = '0' + CONVERT(nvarchar(1), @pageDay)
		END
		
		INSERT INTO @tblWebsites (rownum, websiteid, title, pagehome, websitetype, license, licensetype, 
		statustype, deleted, datecreated, lastmodified, [security], published, 
		ratingtotal, ratedcount, datemodified, [description], domain, subdomain, screenshot) 
		VALUES
		(@rownum, @websiteid, @title, @pagehome, @websitetype, @license, @licensetype, 
		@statustype, @deleted, @datecreated, @lastmodified, @security, @published,
		@ratingtotal, @ratedcount, @datemodified, @description, @domain, @subdomain,
		CONVERT(nvarchar(10), @pageId) + '/' + CONVERT(nvarchar(10), @pageId) + '_' + CONVERT(nvarchar(2), @pageHour) + CONVERT(nvarchar(2), DATEPART(minute, @pageMod)) +  '.jpg'
		)

		FETCH FROM @cursor1 INTO
		@rownum, @websiteid, @title,  @pagehome, @websitetype, @license, @licensetype, 
		@statustype, @deleted, @datecreated, @security, @published, 
		@ratingtotal, @ratedcount, @datemodified, @description, @lastmodified, @domain, @subdomain
    END
    
    CLOSE @cursor1
	DEALLOCATE @cursor1
	
	SELECT * FROM @tblWebsites
END
