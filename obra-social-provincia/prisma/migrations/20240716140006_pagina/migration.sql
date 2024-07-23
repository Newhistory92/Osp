BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Afiliado] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] VARCHAR(50) NOT NULL,
    [email] VARCHAR(200) NOT NULL,
    [password] VARCHAR(200) NOT NULL,
    [imageUrl] VARCHAR(800) NOT NULL,
    [dni] VARCHAR(8) NOT NULL,
    [phone] VARCHAR(13) NOT NULL,
    [address] VARCHAR(200),
    [coordinatesLat] INT,
    [coordinatesLon] INT,
    [dependencia] NVARCHAR(1000),
    [role] NVARCHAR(1000) CONSTRAINT [Afiliado_role_df] DEFAULT 'USER',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Afiliado_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Afiliado_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Afiliado_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Afiliado_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Afiliado_dni_key] UNIQUE NONCLUSTERED ([dni])
);

-- CreateTable
CREATE TABLE [dbo].[Prestador] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] VARCHAR(50) NOT NULL,
    [email] VARCHAR(200) NOT NULL,
    [password] VARCHAR(200) NOT NULL,
    [phone] VARCHAR(13) NOT NULL,
    [checkedPhone] BIT CONSTRAINT [Prestador_checkedPhone_df] DEFAULT 0,
    [phoneOpc] VARCHAR(13),
    [imageUrl] VARCHAR(800) NOT NULL,
    [matricula] VARCHAR(5) NOT NULL,
    [especialidad] VARCHAR(100) NOT NULL,
    [especialidad2] VARCHAR(100),
    [especialidad3] VARCHAR(100),
    [descripcion] VARCHAR(600),
    [role] NVARCHAR(1000) CONSTRAINT [Prestador_role_df] DEFAULT 'PROVIDER',
    [tipo] NVARCHAR(1000),
    [address] VARCHAR(200),
    [coordinatesLat] INT,
    [coordinatesLon] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Prestador_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Prestador_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Prestador_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Prestador_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Operador] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] VARCHAR(50) NOT NULL,
    [email] VARCHAR(200) NOT NULL,
    [password] VARCHAR(200) NOT NULL,
    [phone] VARCHAR(13) NOT NULL,
    [imageUrl] VARCHAR(800) NOT NULL,
    [numeroOperador] VARCHAR(5) NOT NULL,
    [role] NVARCHAR(1000) CONSTRAINT [Operador_role_df] DEFAULT 'EMPLOYEE',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Operador_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Operador_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Operador_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Operador_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Operador_numeroOperador_key] UNIQUE NONCLUSTERED ([numeroOperador])
);

-- CreateTable
CREATE TABLE [dbo].[Publicacion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [titulo] NVARCHAR(1000) NOT NULL,
    [published] NVARCHAR(1000) NOT NULL,
    [contenido] TEXT,
    [imagen] VARBINARY(max),
    [autorId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Publicacion_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Publicacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Opinion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [contenido] TEXT NOT NULL,
    [autorId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Opinion_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Opinion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Denuncia] (
    [id] INT NOT NULL IDENTITY(1,1),
    [motivo] TEXT NOT NULL,
    [autorId] NVARCHAR(1000) NOT NULL,
    [prestadorId] NVARCHAR(1000)  NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Denuncia_status_df] DEFAULT 'Nuevo',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Denuncia_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Denuncia_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notificacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [titulo] NVARCHAR(1000) NOT NULL,
    [contenido] TEXT NOT NULL,
    [autorId] NVARCHAR(1000) NOT NULL,
    [receptorId] NVARCHAR(1000) NOT NULL,
    [receptorPrestadorId] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Notificacion_status_df] DEFAULT 'No_leido',
    [url] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Notificacion_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Notificacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Carrusel] (
    [id] NVARCHAR(1000) NOT NULL,
    [tituloprincipal] NVARCHAR(1000) NOT NULL,
    [titulosecundario] NVARCHAR(1000) NOT NULL,
    [contenido] NVARCHAR(1000) NOT NULL,
    [urlImagen] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Carrusel_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Publicacion] ADD CONSTRAINT [Publicacion_autorId_fkey] FOREIGN KEY ([autorId]) REFERENCES [dbo].[Operador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Opinion] ADD CONSTRAINT [Opinion_autorId_fkey] FOREIGN KEY ([autorId]) REFERENCES [dbo].[Afiliado]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Denuncia] ADD CONSTRAINT [Denuncia_autorId_fkey] FOREIGN KEY ([autorId]) REFERENCES [dbo].[Afiliado]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Denuncia] ADD CONSTRAINT [Denuncia_prestadorId_fkey] FOREIGN KEY ([prestadorId]) REFERENCES [dbo].[Prestador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notificacion] ADD CONSTRAINT [Notificacion_autorId_fkey] FOREIGN KEY ([autorId]) REFERENCES [dbo].[Operador]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notificacion] ADD CONSTRAINT [Notificacion_receptorId_fkey] FOREIGN KEY ([receptorId]) REFERENCES [dbo].[Afiliado]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notificacion] ADD CONSTRAINT [Notificacion_receptorPrestadorId_fkey] FOREIGN KEY ([receptorPrestadorId]) REFERENCES [dbo].[Prestador]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;

-- Levantar el error capturado
DECLARE @ErrorMessage NVARCHAR(4000);
DECLARE @ErrorSeverity INT;
DECLARE @ErrorState INT;

SELECT 
    @ErrorMessage = ERROR_MESSAGE(),
    @ErrorSeverity = ERROR_SEVERITY(),
    @ErrorState = ERROR_STATE();

RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);

END CATCH;