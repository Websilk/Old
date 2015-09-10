-- =============================================
-- Author:		Mark Entingh
-- Create date: 6/9/2015 3:44 AM
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[GetPagePath] 
(
	@pageId int
)
RETURNS nvarchar(MAX)
AS
BEGIN
	DECLARE 
		@Result nvarchar(MAX),
		@title nvarchar(250),
		@pageTitle nvarchar(250),
		@parentId int = 0

	SELECT @title=title, @parentId=parentId FROM pages WHERE pageid=@pageId 
	SELECT @pageTitle = value FROM dbo.SplitArray(@title,' - ') WHERE Position=2
	
	IF @parentId is not null AND @parentId > 0 BEGIN
		DECLARE @parentTitle nvarchar(250)
		SELECT @parentTitle=title FROM pages WHERE pageid=@parentId 
		SET @Result = dbo.GetPagePath(@parentId) + '/' + REPLACE(@title, @parentTitle, '')
	END 
	ELSE BEGIN
		SET @Result = @pageTitle
	END

	-- Return the result of the function
	RETURN @Result

END
