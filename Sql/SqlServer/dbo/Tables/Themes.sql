CREATE TABLE [dbo].[Themes] (
    [themeId]		 INT	NOT NULL,
    [userId]		 INT			NOT NULL,
    [designId]       INT            NULL,
    [schemeId]       INT            NULL,
    [websiteId]		 INT            NULL, 
	[title]          NVARCHAR (50)  NOT NULL,
    [name]           NVARCHAR (50)  NOT NULL,
    [price]          FLOAT (53)     NULL,
    [rating]         INT            NULL,
    [ratingcount]    INT            NULL,
    [ratingtotal]    INT            NULL,
    [datecreated]    DATETIME       NULL,
    [approved]       BIT            NOT NULL,
    [private]        BIT            NOT NULL,
    [enabled]        BIT            NOT NULL,
    [deleted]        BIT            NOT NULL,
    [license]        BIT            NOT NULL,
    [licensetype]    SMALLINT       NULL,
    [description]    NVARCHAR (200) NOT NULL,
    CONSTRAINT [PK_Themes] PRIMARY KEY ([themeId])
);


GO

CREATE INDEX [index_themes] ON [dbo].[Themes] (themeId)
