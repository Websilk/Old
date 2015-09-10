CREATE TABLE [dbo].[ThemesOwned] (
    [userId]    INT        NOT NULL,
    [themeId]    INT        NOT NULL,
    [price]       FLOAT (53) NULL,
    [datecreated] DATETIME   NOT NULL, 
    CONSTRAINT [PK_ThemesOwned] PRIMARY KEY ([userId])
);


GO

CREATE INDEX [index_themesOwned] ON [dbo].[ThemesOwned] (userId, themeId)
