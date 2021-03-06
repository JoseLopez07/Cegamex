/****** Object:  Table [dbo].[amistades]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[amistades](
	[idUser1] [int] NOT NULL,
	[idUser2] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idUser1] ASC,
	[idUser2] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[amistadesConfirmadas]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   VIEW [dbo].[amistadesConfirmadas]
AS
    SELECT idUser1, idUser2
    FROM amistades
    INTERSECT
    SELECT idUser2, idUser1
    FROM amistades;
GO
/****** Object:  Table [dbo].[empleados]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[empleados](
	[idEmpleado] [nvarchar](255) NOT NULL,
	[nombre] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[idEmpleado] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[equipos]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[equipos](
	[idEquipo] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](255) NULL,
	[puntos] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[idEquipo] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gimnasios]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gimnasios](
	[idGimnasio] [int] IDENTITY(1,1) NOT NULL,
	[idLiderGimnasio] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[idGimnasio] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[issues]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[issues](
	[idIssue] [int] NOT NULL,
	[tipo] [nvarchar](255) NOT NULL,
	[nombre] [nvarchar](255) NOT NULL,
	[idCreador] [nvarchar](255) NULL,
	[idLider] [nvarchar](255) NULL,
	[idReporter] [nvarchar](255) NULL,
	[estado] [nvarchar](255) NOT NULL,
	[fecha_inicio] [datetime] NOT NULL,
	[fecha_fin] [datetime] NULL,
	[idEncargado] [int] NULL,
	[prioridad] [nvarchar](255) NULL,
	[procesado] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[idIssue] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[logros]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[logros](
	[idLogro] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](255) NULL,
	[descripcion] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[idLogro] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mascotas]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mascotas](
	[idMascota] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](255) NULL,
	[nivel] [int] NOT NULL,
	[upgradeP] [int] NOT NULL,
	[experiencia] [int] NOT NULL,
	[ptsAtaque] [int] NOT NULL,
	[ptsDefensa] [int] NOT NULL,
	[ptsVelocidad] [int] NOT NULL,
	[ptsMaxVida] [int] NOT NULL,
	[skill] [int] NOT NULL,
	[idMovimiento1] [int] NOT NULL,
	[idMovimiento2] [int] NOT NULL,
	[idMovimiento3] [int] NOT NULL,
	[type] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idMascota] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[registroLogros]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[registroLogros](
	[idLogro] [int] NOT NULL,
	[idUser] [int] NOT NULL,
	[fechaHora] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idLogro] ASC,
	[idUser] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[subtareas]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[subtareas](
	[idSubtarea] [int] NOT NULL,
	[idIssue] [int] NOT NULL,
	[nombre] [nvarchar](255) NOT NULL,
	[idCreador] [nvarchar](255) NULL,
	[idLider] [nvarchar](255) NULL,
	[idReporter] [nvarchar](255) NULL,
	[estado] [nvarchar](255) NOT NULL,
	[fecha_inicio] [datetime] NOT NULL,
	[fecha_fin] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idSubtarea] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 11/06/2021 6:59:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[idUser] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](255) NOT NULL,
	[apellido] [nvarchar](255) NOT NULL,
	[userName] [nvarchar](255) NOT NULL,
	[correo] [nvarchar](255) NOT NULL,
	[pass] [nvarchar](255) NOT NULL,
	[adm] [int] NULL,
	[twitter] [nvarchar](255) NULL,
	[foto] [nvarchar](255) NULL,
	[rol] [nvarchar](255) NULL,
	[idMascota] [int] NOT NULL,
	[victorias] [int] NULL,
	[derrotas] [int] NULL,
	[puntos] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[idUser] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[registroLogros] ADD  DEFAULT (getutcdate()) FOR [fechaHora]
GO
ALTER TABLE [dbo].[amistades]  WITH CHECK ADD FOREIGN KEY([idUser1])
REFERENCES [dbo].[usuarios] ([idUser])
GO
ALTER TABLE [dbo].[amistades]  WITH CHECK ADD FOREIGN KEY([idUser2])
REFERENCES [dbo].[usuarios] ([idUser])
GO
ALTER TABLE [dbo].[gimnasios]  WITH CHECK ADD FOREIGN KEY([idLiderGimnasio])
REFERENCES [dbo].[usuarios] ([idUser])
GO
ALTER TABLE [dbo].[issues]  WITH CHECK ADD FOREIGN KEY([idCreador])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[issues]  WITH NOCHECK ADD FOREIGN KEY([idCreador])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[issues]  WITH NOCHECK ADD FOREIGN KEY([idEncargado])
REFERENCES [dbo].[usuarios] ([idUser])
GO
ALTER TABLE [dbo].[issues]  WITH CHECK ADD FOREIGN KEY([idEncargado])
REFERENCES [dbo].[usuarios] ([idUser])
GO
ALTER TABLE [dbo].[issues]  WITH CHECK ADD FOREIGN KEY([idLider])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[issues]  WITH NOCHECK ADD FOREIGN KEY([idLider])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[issues]  WITH CHECK ADD FOREIGN KEY([idReporter])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[issues]  WITH NOCHECK ADD FOREIGN KEY([idReporter])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[registroLogros]  WITH CHECK ADD FOREIGN KEY([idLogro])
REFERENCES [dbo].[logros] ([idLogro])
GO
ALTER TABLE [dbo].[registroLogros]  WITH CHECK ADD FOREIGN KEY([idUser])
REFERENCES [dbo].[usuarios] ([idUser])
GO
ALTER TABLE [dbo].[subtareas]  WITH CHECK ADD FOREIGN KEY([idCreador])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[subtareas]  WITH NOCHECK ADD FOREIGN KEY([idCreador])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[subtareas]  WITH CHECK ADD FOREIGN KEY([idIssue])
REFERENCES [dbo].[issues] ([idIssue])
GO
ALTER TABLE [dbo].[subtareas]  WITH CHECK ADD FOREIGN KEY([idLider])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[subtareas]  WITH NOCHECK ADD FOREIGN KEY([idLider])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[subtareas]  WITH CHECK ADD FOREIGN KEY([idReporter])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[subtareas]  WITH NOCHECK ADD FOREIGN KEY([idReporter])
REFERENCES [dbo].[empleados] ([idEmpleado])
GO
ALTER TABLE [dbo].[usuarios]  WITH CHECK ADD FOREIGN KEY([idMascota])
REFERENCES [dbo].[mascotas] ([idMascota])
GO
