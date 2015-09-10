-- =============================================
-- Author:		Mark Entingh
-- Create date: 9:07 AM 11/22/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[UpdateColorScheme] 
	@schemeId int = 0, 
	@colorsortbody nvarchar(6) = '',
	@colorsort nvarchar(6) = '',
	@colors nvarchar(MAX) = '',
	@colorR int = 0,
	@colorG int = 0,
	@colorB int = 0,
	@colorBodyR int = 0,
	@colorBodyG int = 0,
	@colorBodyB int = 0,
	@intsort int = 0,
	@intsortbody int = 0
AS
BEGIN
	UPDATE ColorSchemes SET colorsortbody=@colorsortbody, colorsort=@colorsort, colors=@colors,
	colorR=@colorR, colorG=@colorG, colorB=@colorB, colorBodyR=@colorBodyR, colorBodyG=@colorBodyG, colorBodyB=@colorBodyB,
	intsort=@intsort,intsortbody=@intsortbody
	WHERE schemeid=@schemeId
END
