CREATE TABLE [dbo].[Applications] (
    [applicationId]     INT            IDENTITY (1, 1) NOT NULL,
    [title]             NVARCHAR (25)  NOT NULL,
    [name]              NVARCHAR (15)  NOT NULL,
    [category]			INT			   NOT NULL,
    [price]             FLOAT (53)     NULL,
    [pricetype]         INT            NOT NULL,
    [description]       NVARCHAR (200) NOT NULL,
    [datecreated]       DATETIME       NOT NULL,
    [orderindex]        INT            NOT NULL,
    [companyName]       NVARCHAR (100) NOT NULL,
    [companyUrl]		NVARCHAR (100) NULL, 
    [componentcategory] INT            NOT NULL,
    [approved]          BIT            NOT NULL,  
    CONSTRAINT [PK_Applications] PRIMARY KEY ([applicationId])
);


GO

CREATE INDEX [index_applications] ON [dbo].[Applications] (applicationId)
