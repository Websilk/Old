

-- =============================================
-- Author:		Mark Entingh
-- Create date: 2/22/2012 11:11 AM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageInfoFromPageId] 
	@pageId int = 0
AS
BEGIN
	SET NOCOUNT ON;

    SELECT p.pageid, p.websiteid, w.title AS websitetitle, p.parentid, w.pagedenied, w.page404, w.websitetype, w.statustype, w.icon, p.ownerId, p.security,
    p.usersonly, p.title, (CASE WHEN p.parentid IS NOT NULL THEN (SELECT title FROM pages WHERE pageid=p.parentid) ELSE NULL END) AS parenttitle,
	p.photo, p.description, p.datecreated, p.themeid, 
    t.userid AS themeowner, t.name AS themename,
    (SELECT TOP 1 d.googlewebpropertyid FROM websitedomains d WHERE d.websiteid=p.websiteId ORDER BY d.datecreated ASC) AS googlewebpropertyid,
	w.background, p.background AS pagebackground
    FROM pages p 
	LEFT JOIN websites w ON w.websiteid=p.websiteId
	LEFT JOIN themes t ON t.themeid=p.themeid
	WHERE p.pageid=@pageId
END
