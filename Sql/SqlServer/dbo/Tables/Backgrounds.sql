CREATE TABLE [dbo].[Backgrounds] (
    [backgroundId]  INT            NOT NULL,
    [ownerId]       INT            NOT NULL,
    [name]          NVARCHAR (50)  NOT NULL,
    [orderindex]         INT            NOT NULL,
    [colorsortbody] NVARCHAR (6)   NULL,
    [colorsort]     NVARCHAR (6)   NULL,
    [intsortbody]   INT            NULL,
    [intsort]       INT            NULL,
    [background]    NVARCHAR (25)  NULL,
    [colors]        NVARCHAR (250) NULL,
    [datecreated]   DATETIME       NULL,
    [datesaved]     DATETIME       NULL,
    [datepublished] DATETIME       NULL,
    [colorR]        INT            NULL,
    [colorG]        INT            NULL,
    [colorB]        INT            NULL,
    [colorbodyR]    INT            NULL,
    [colorbodyG]    INT            NULL,
    [colorbodyB]    INT            NULL, 
    CONSTRAINT [PK_Backgrounds] PRIMARY KEY ([backgroundId])
);


GO

CREATE INDEX [index_backgrounds] ON [dbo].[Backgrounds] (backgroundId, orderindex)
