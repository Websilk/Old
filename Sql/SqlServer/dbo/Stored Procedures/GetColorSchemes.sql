-- =============================================
-- Author:		Mark Entingh
-- Create date: 11:00 am 11/19/2013
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetColorSchemes] 
	@start int = 0, 
	@length int = 10,
	@orderby int = 1,
	@published bit = 0,
	@search nvarchar(50) = '',
	@primaryR int = -1,
	@primaryG int = -1,
	@primaryB int = -1,
	@backgroundR int = -1,
	@backgroundG int = -1,
	@backgroundB int = -1
AS
BEGIN
	SET NOCOUNT ON;

	IF @primaryR = -1 AND  @backgroundR = -1 BEGIN
	-- no color search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY 
			CASE WHEN @orderby = 1 THEN name END ASC,
			CASE WHEN @orderby = 2 THEN name END DESC,
			CASE WHEN @orderby = 3 THEN colorsortbody END DESC,
			CASE WHEN @orderby = 4 THEN colorsortbody END ASC,
			CASE WHEN @orderby = 5 THEN colorsort END DESC,
			CASE WHEN @orderby = 6 THEN colorsort END ASC
			) AS rownum, name, schemeid, colors FROM colorschemes WHERE published >= @published ) 
		 AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
	IF @primaryR >= 0 AND @backgroundR = -1 BEGIN
		-- primary color only search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors,
				FLOOR(SQRT(POWER((colorR - @primaryR)*0.8,2)+POWER((colorG - @primaryG)*0.5,2)+POWER((colorB - @primaryB)*1,2))) AS distance
				FROM colorschemes WHERE published >= @published) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
	IF @primaryR = -1 AND @backgroundR >= 0 BEGIN
		-- background color only search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors,
				FLOOR(SQRT(POWER((colorbodyR - @backgroundR)*0.8,2)+POWER((colorbodyG - @backgroundG)*0.5,2)+POWER((colorbodyB - @backgroundB)*1,2))) AS distance
				FROM colorschemes WHERE published >= @published) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END

	IF @primaryR >= 0 AND @backgroundR >= 0 BEGIN
		-- primary & background color search ////////////////////////////////////////////////////////////////
		SELECT name, schemeid, colors, distance, colorbodyR, colorbodyG, colorbodyB INTO #tbl FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors, colorbodyR, colorbodyG, colorbodyB,
				FLOOR(SQRT(POWER((colorR - @primaryR)*0.8,2)+POWER((colorG - @primaryG)*0.5,2)+POWER((colorB - @primaryB)*1,2))) AS distance
				FROM colorschemes WHERE published >= @published) 
			AS tbl WHERE distance < 90)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length

		SELECT name, schemeid, colors, distance FROM (
			SELECT ROW_NUMBER() OVER(ORDER BY distance ASC) AS rownum, * FROM 
				(SELECT name, schemeid, colors,
				FLOOR(SQRT(POWER((colorbodyR - @backgroundR)*0.8,2)+POWER((colorbodyG - @backgroundG)*0.5,2)+POWER((colorbodyB - @backgroundB)*1,2))) AS distance
				FROM #tbl) 
			AS tbl WHERE distance < 80)
		AS tbl WHERE rownum >= @start AND rownum <= @start + @length
	END
END
