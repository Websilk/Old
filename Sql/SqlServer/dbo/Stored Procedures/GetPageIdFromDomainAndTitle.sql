-- =============================================
-- Author:		Mark Entingh
-- Create date: 12/17/2011 4:11 PM
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPageIdFromDomainAndTitle] 
	@domainname nvarchar(50) = '', 
	@pagetitle nvarchar(100) = ''
AS
BEGIN
	SET NOCOUNT ON;

   SELECT p.pageid FROM pages p LEFT JOIN websites ws 
	ON ws.websiteid=p.websiteid 
	WHERE p.websiteid=(
		SELECT w.websiteid FROM websitedomains w WHERE w.domain = @domainname
	) 
	AND p.title=ws.title + ' - ' + @pagetitle AND p.deleted =0
END
