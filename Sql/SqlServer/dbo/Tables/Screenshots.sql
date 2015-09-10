CREATE TABLE [dbo].[Screenshots] (
    [auth]      NVARCHAR (20) NOT NULL,
    [websiteid] INT           NOT NULL,
    [expire]    INT           NOT NULL, 
    CONSTRAINT [PK_Screenshots] PRIMARY KEY ([websiteid])
);


GO

CREATE INDEX [index_screenshots] ON [dbo].[Screenshots] (websiteid)
