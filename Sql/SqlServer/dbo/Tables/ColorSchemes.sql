CREATE TABLE [dbo].[ColorSchemes] (
    [schemeId]      INT            NOT NULL,
    [ownerId]       INT            NOT NULL,
    [name]          NVARCHAR (50)  NOT NULL,
    [colorsortbody] NVARCHAR (6)   NULL,
    [colorsort]     NVARCHAR (6)   NULL,
    [intsortbody]   INT            NULL,
    [intsort]       INT            NULL,
    [colors]        NVARCHAR (MAX) NULL,
    [datecreated]   DATETIME       NOT NULL,
    [datesaved]     DATETIME       NULL,
    [datepublished] DATETIME       NULL,
    [published]     BIT            NOT NULL,
    [colorR]        INT            NULL,
    [colorG]        INT            NULL,
    [colorB]        INT            NULL,
    [colorbodyR]    INT            NULL,
    [colorbodyG]    INT            NULL,
    [colorbodyB]    INT            NULL, 
    CONSTRAINT [PK_ColorSchemes] PRIMARY KEY ([schemeId]) 
);


GO

CREATE INDEX [index_colorschemes] ON [dbo].[ColorSchemes] (schemeId)
