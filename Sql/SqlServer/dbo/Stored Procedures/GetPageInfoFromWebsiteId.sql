

-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/22/2012 11:11 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromWebsiteId]
	@pageId int = 0, 
	@websiteId int = 0
AS
BEGIN
	SET NOCOUNT ON;

    SELECT w.title AS websitetitle, p.parentid, w.pagedenied, w.page404, w.status, w.icon, p.ownerId, p.security, 
    p.title, (CASE WHEN p.parentid IS NOT NULL THEN (SELECT title FROM pages WHERE pageid=p.parentid) ELSE NULL END) AS parenttitle,
	p.description, p.datecreated, w.theme,
    (SELECT TOP 1 googlewebpropertyid FROM websitedomains WHERE websiteid=@websiteId ORDER BY datecreated ASC) AS googlewebpropertyid
    FROM pages p LEFT JOIN websites w ON w.websiteid=@websiteId WHERE p.pageid=@pageId
END



