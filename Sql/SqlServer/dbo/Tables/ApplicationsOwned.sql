CREATE TABLE [dbo].[ApplicationsOwned] (
    [ownerId]       INT        NOT NULL,
    [applicationId] INT        NOT NULL,
    [websiteId]     INT        NOT NULL,
    [price]         FLOAT (53) NULL,
    [pricetype]     INT        NULL,
    [datecreated]   DATETIME   NOT NULL, 
    CONSTRAINT [PK_ApplicationsOwned] PRIMARY KEY ([websiteId]) 
);


GO

CREATE INDEX [index_appsOwned] ON [dbo].[ApplicationsOwned] (websiteId)
