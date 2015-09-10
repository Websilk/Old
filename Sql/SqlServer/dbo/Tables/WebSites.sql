CREATE TABLE [dbo].[WebSites] (
    [websiteId]    INT            NOT NULL,
    [ownerId]      INT            NOT NULL,
    [themeId]     INT            NOT NULL,
    [designId]     INT            NULL,
    [schemeId]     INT            NULL,
    [title]        NVARCHAR (100) NOT NULL,
    [icon]         BIT            NULL,
    [pagetemplate] INT            NULL,
    [pagehome]     INT            NOT NULL,
    [pagelogin]    INT            NOT NULL,
    [pageabout]    INT            NULL,
    [pagecontact]  INT            NULL,
    [pagesupport]  INT            NULL,
    [page404]      INT            NULL,
    [pagedenied]   INT            NULL,
    [datecreated]  DATETIME       NOT NULL,
    [websitetype]  SMALLINT       NOT NULL,
    [license]      BIT            NULL,
    [licensetype]  SMALLINT       NULL,
    [price]        FLOAT (53)     NULL,
    [enabled]      BIT            NULL,
    [deleted]      BIT            NULL,
    [statustype]        INT            NULL,
    [background]   NVARCHAR (250) NULL,
    CONSTRAINT [PK_WebSites] PRIMARY KEY ([websiteId])
);


GO

CREATE INDEX [index_websites] ON [dbo].[WebSites] (websiteId)
