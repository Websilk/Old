-- =============================================
-- Author:		Mark Entingh
-- Create date: 10:45 AM 11/19/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[AddColorScheme] 
	@name nvarchar(50) = '',
	@colorsortbody nvarchar(6) = 'FFFFFF',
	@colorsort nvarchar(6) = 'FFFFFF',
	@colors nvarchar(MAX) = '',
	@ownerId int = 1,
	@published bit = 0,
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
	SET NOCOUNT ON;

	IF (SELECT COUNT(*) FROM ColorSchemes WHERE name=@name) > 0 BEGIN
		UPDATE ColorSchemes SET colorsortbody=@colorsortbody, colorsort=@colorsort, ownerid=@ownerid, colors=@colors, 
		colorR=@colorR, colorG=@colorG, colorB=@colorB, colorBodyR=@colorBodyR, colorBodyG=@colorBodyG, colorBodyB=@colorBodyB, 
		 intsort=@intsort,intsortbody=@intsortbody
		WHERE name=@name 
	END ELSE BEGIN
		INSERT INTO ColorSchemes (schemeid, name, colorsortbody, colorsort, intsort, intsortbody, colors, colorR, colorG, colorB, colorBodyR, colorBodyG, colorBodyB, 
		ownerid, datecreated, datesaved, datepublished, published)
		VALUES ((SELECT MAX(schemeid) FROM ColorSchemes)+1, @name, @colorsortbody, @colorsort, @intsort, @intsortbody, @colors, @colorR, @colorG, @colorB, @colorBodyR, @colorBodyG, @colorBodyB, 
		@ownerId, GETDATE(), GETDATE(), GETDATE(), @published)
	END

	SELECT TOP 1 schemeid FROM colorschemes WHERE name=@name ORDER BY schemeid DESC
END
