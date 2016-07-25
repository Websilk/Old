-- =============================================
-- Author:		Mark Entingh
-- Create date: 5/13/2009 5:39 PM
-- Description:	Create a new website
-- =============================================
CREATE PROCEDURE [dbo].[AddWebsite] 
	@ownerId int = 0, 
	@themeId int = 0,
	@title nvarchar(100) = '',
	@icon bit = 0,
	@description nvarchar(100) = '',
	@security bit = 0,
	@enabled bit = 0,
	@domainname nvarchar(25) = '',
    @subdomain nvarchar(25) = '',
	@googletoken varchar(max)='',
	@googleprofileId varchar(20) = '',
	@googlewebpropertyId varchar(20) = '',
	@statustype int = 1,
	@platformDomain nvarchar(100) = 'websilk.com'
AS
BEGIN
	SET NOCOUNT ON;
    DECLARE @websiteId int, 
    @templateId int,
    @homeId int,
    @dashId int,
    @loginId int,
    @deniedId int,
    @404Id int,
    @themeownerid int,
    @myDate datetime = GETDATE()
    
    SET @templateId = CAST(RAND() * 1000 AS INT)
    
    -- first create the web site
    INSERT INTO WebSites (websiteid, ownerId, title, pagetemplate, pagehome, 
	themeId, dateCreated, enabled, deleted, statustype, 
	websitetype, license, licensetype, price) 
	VALUES(NEXT VALUE FOR SequenceWebsites, @ownerId, @title, @templateId, 0, 
	@themeId, @myDate, @enabled, 0, @statustype, 0,0,0,0)
    
    SELECT TOP 1 @websiteId = websiteId FROM WebSites WHERE ownerId=@ownerId ORDER BY websiteId DESC
    
    -- then create the page layer for the web site
    INSERT INTO PageLayers (layerId, title, websiteId, datecreated) 
	VALUES(@templateId, 'Default', @websiteId, GETDATE())
	
	SELECT @themeownerid = userId FROM Themes WHERE themeId=@themeid

	-- include a domain name
	IF @domainname <> ''
	BEGIN
		INSERT INTO WebsiteDomains (websiteid, domain, datecreated, googletoken, googleprofileId, googlewebpropertyId)
		VALUES (@websiteId, @domainname, GETDATE(),@googletoken, @googleprofileId, @googlewebpropertyId)
	END
	
	-- include a sub domain
	IF @subdomain <> ''
	BEGIN
		INSERT INTO WebsiteSubDomains (websiteid, subdomain, domain, datecreated)
		VALUES (@websiteId, @subdomain, @platformDomain, GETDATE())
	END
	
	
	-- return the website ID
	SELECT @websiteId
END
