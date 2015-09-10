

-- =============================================
-- Author:		Mark Entingh
-- Create date: 01/14/2010 7:00 PM
-- Description:	get a list of website themes
-- =============================================
CREATE PROCEDURE [dbo].[GetThemesForAdmin]
	@start int = 0,
	@length int = 10,
	@orderby int = 1,
	@keywords nvarchar(25) = '',
	@designtype int = 0
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM 
	(SELECT ROW_NUMBER() OVER(ORDER BY
	deleted ASC,
	enabled DESC,
	CASE WHEN @orderby = 1 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 2 THEN l.datecreated END ASC,
	CASE WHEN @orderby = 3 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 4 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 5 THEN l.datecreated END DESC,
	CASE WHEN @orderby = 6 THEN l.datecreated END DESC 
	) AS rownum, 
	 l.*
	FROM Themes l
	WHERE title LIKE CASE WHEN @keywords <> '' THEN '%' + @keywords + '%' ELSE title END
	AND licensetype = CASE WHEN @orderby = 3 THEN 0 
							WHEN @orderby = 4 THEN 1
							WHEN @orderby = 5 THEN 2
							ELSE licensetype END
	AND	enabled = CASE WHEN @orderby = 6 THEN 0 ELSE enabled END
	) as mytbl WHERE rownum >= @start AND rownum <= @start + @length
END

