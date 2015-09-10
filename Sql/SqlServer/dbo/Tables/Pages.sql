CREATE TABLE [dbo].[Pages] (
    [pageId]             INT            NOT NULL,
    [ownerId]            INT            NOT NULL,
    [themeId]           INT            NOT NULL,
    [websiteId]          INT            NOT NULL,
    [parentId]           INT            NULL,
    [schemeId]           INT            NULL, 
    [pagetype]			 SMALLINT		NULL, 
    [title]              NVARCHAR (250) NOT NULL,
    [path]               NVARCHAR (MAX) NOT NULL,
    [pathIds]            NVARCHAR (MAX) NOT NULL,
    [photo]              NVARCHAR (100) NULL,
    [datecreated]        DATETIME       NOT NULL,
    [datemodified]       DATETIME       NOT NULL,
    [datefirstpublished] DATETIME       NULL,
    [datepublished]      DATETIME       NULL,
    [favorite]           BIT            NULL,
    [security]           BIT            NULL,
    [usersonly]        BIT            NULL,
    [published]          BIT            NOT NULL,
    [enabled]            BIT            NOT NULL,
    [deleted]            BIT            NOT NULL,
    [rating]             INT            NULL,
    [ratingtotal]        INT            NULL,
    [ratedcount]         INT            NULL,
    [background]         NVARCHAR (250) NULL,
    [description]        NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_Pages] PRIMARY KEY ([pageId])
);


GO

CREATE INDEX [index_pages] ON [dbo].[Pages] (websiteId, pageId)
