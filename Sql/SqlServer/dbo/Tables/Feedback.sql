CREATE TABLE [dbo].[Feedback] (
    [feedbackId]  INT            IDENTITY (1, 1) NOT NULL,
    [ftype]       INT            NOT NULL,
    [email]       NVARCHAR (100) NOT NULL,
    [datecreated] DATETIME       NOT NULL,
    [feedback]    NVARCHAR (MAX) NOT NULL, 
    CONSTRAINT [PK_Feedback] PRIMARY KEY ([datecreated])
);


GO

CREATE INDEX [index_feedback] ON [dbo].[Feedback] (feedbackId)
