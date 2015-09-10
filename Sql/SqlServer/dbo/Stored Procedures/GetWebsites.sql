

-- =============================================
-- Author:		Mark Entingh
-- Create date: 8/22/2009 10:55 PM
-- Description:	get a list of websites
-- =============================================
CREATE PROCEDURE [dbo].[GetWebsites] 
	@userId int = 0, 
	@start int = 1,
	@length int = 10,
	@search nvarchar(100),
	@orderby int = 1
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @cursor1 CURSOR,
    @rownum int,
    @websiteid int,
    @title nvarchar(100),
    @pagehome int,
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
    @googletoken varchar(max),
    @googleprofileId varchar(20),
    @googlewebpropertyId varchar(20)
    
    DECLARE  @tblWebsites TABLE(
		rownum int,
		websiteid int,
		title nvarchar(100),
		pagehome int,
		datecreated datetime,
		lastmodified datetime,
		[security] int,
		published bit,
		ratingtotal int,
		ratedcount int,
		datemodified datetime,
		[description] nvarchar(250),
		domain nvarchar(25),
		screenshot2 nvarchar(50),
		googletoken varchar(max),
		googleprofileId varchar(20),
		googlewebpropertyId varchar(20)
    ) 
    
    
    
    SET @cursor1 = CURSOR FOR
	SELECT * FROM (
		SELECT ROW_NUMBER() OVER(ORDER BY
			CASE WHEN @orderby = 1 THEN w.datecreated END ASC,
			CASE WHEN @orderby = 2 THEN w.datecreated END DESC,
			CASE WHEN @orderby = 3 THEN w.title END ASC,
			CASE WHEN @orderby = 4 THEN w.title END DESC
		) AS rownum, 
		w.websiteid, w.title, w.pagehome, p.datecreated, 
		(SELECT TOP 1 datemodified FROM pages WHERE websiteid=w.websiteid ORDER BY datemodified DESC) AS lastmodified,  
		p.[security], p.published,  p.ratingtotal, p.ratedcount, p.datemodified, p.[description], 
		d.domain, d.googletoken, d.googleprofileId, d.googlewebpropertyId
		FROM websites w LEFT JOIN pages p ON p.pageid=w.pagehome 
		LEFT JOIN websitedomains d ON d.websiteid=w.websiteid
		WHERE (w.ownerid=@userId OR w.websiteid IN 
			(SELECT websiteid FROM websitesecurity WHERE userid=@userId))
		AND w.deleted=0 AND w.enabled=1
		AND (w.websitetype <> 2  -- 2 = web site template for a design
		OR w.websitetype IS null)
		AND (
			w.title LIKE '%' + @search + '%'
			OR p.[description] LIKE '%' + @search + '%' 
		)
	)AS mytbl WHERE rownum >= @start AND rownum <= @start + @length
	
	OPEN @cursor1
	
	FETCH FROM @cursor1 INTO
	@rownum, @websiteid, @title, @pagehome, @datecreated, @lastmodified, @security, 
	@published, @ratingtotal, @ratedcount, @datemodified, @description, 
	@domain, @googletoken, @googleprofileId, @googlewebpropertyId
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
    
		SELECT TOP 1 @pageDate=datecreated, @pageMod=datemodified, @pageId=pageId FROM Pages WHERE websiteId=@websiteid ORDER BY datecreated DESC
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
		
		INSERT INTO @tblWebsites (rownum, websiteid, title, pagehome, datecreated, 
		lastmodified, [security], published, ratingtotal, ratedcount, datemodified, [description], 
		domain, screenshot2, googletoken, googleprofileId, googlewebpropertyId) 
		VALUES
		(@rownum, @websiteid, @title, @pagehome, @datecreated,
		@lastmodified, @security, @published, 
		@ratingtotal, @ratedcount, @datemodified, @description, @domain,
		CONVERT(nvarchar(4), YEAR(@pageDate)) + CONVERT(nvarchar(2), @pageMonth) + '/'  + CONVERT(nvarchar(2), @pageDay) + '/' + CONVERT(nvarchar(10), @pageId) + '/' + CONVERT(nvarchar(10), @pageId) + '_' + CONVERT(nvarchar(2), @pageHour) + CONVERT(nvarchar(2), DATEPART(minute, @pageMod)) +  '.jpg', 
		@googletoken, @googleprofileId, @googlewebpropertyId
		)
		FETCH FROM @cursor1 INTO
		@rownum, @websiteid, @title, @pagehome, @datecreated, @lastmodified, @security, 
		@published, @ratingtotal, @ratedcount, @datemodified, @description, 
		@domain, @googletoken, @googleprofileId, @googlewebpropertyId
    END
    
    CLOSE @cursor1
	DEALLOCATE @cursor1
	
	SELECT * FROM @tblWebsites
END
