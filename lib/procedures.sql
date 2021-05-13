-- MUST BE RUN AFTER DB SCRIPT

CREATE OR ALTER PROCEDURE getPasswordFromEmail
	@email nvarchar(255)
AS
	SET NOCOUNT ON;
	SELECT pass FROM [dbo].[usuarios] WHERE correo = @email;
GO

CREATE OR ALTER PROCEDURE getIdFromEmail
	@email nvarchar(255)
AS
	SET NOCOUNT ON;
	SELECT idUser FROM [dbo].[usuarios] WHERE correo = @email;
GO

CREATE OR ALTER PROCEDURE getIdFromUserName
	@userName nvarchar(255)
AS
	SET NOCOUNT ON;
	SELECT idUser FROM [dbo].[usuarios] WHERE userName = @userName;
GO

CREATE OR ALTER PROCEDURE createUser
	@firstName nvarchar(255),
	@lastName nvarchar(255),
	@userName nvarchar(255),
	@email nvarchar(255),
	@passHash nvarchar(255)
AS
	SET NOCOUNT ON;
	INSERT [dbo].[usuarios] ([nombre], [apellido], [userName], [correo], [pass], [adm]) VALUES (@firstName, @lastName, @userName, @email, @passHash, 0);
GO

CREATE OR ALTER PROCEDURE setUserAdmin
	@id int,
	@adm int
AS
	SET NOCOUNT ON;
	UPDATE [dbo].[usuarios]
	SET adm = @adm
	WHERE idUser = @id
GO

CREATE OR ALTER PROCEDURE modifyUser
	@id int,
	@firstName nvarchar(255) = NULL,
	@lastName nvarchar(255) = NULL,
	@userName nvarchar(255) = NULL,
	@email nvarchar(255) = NULL,
	@passHash nvarchar(255) = NULL
AS
	SET NOCOUNT ON;
	UPDATE [dbo].[usuarios]
	SET nombre = ISNULL(@firstName, nombre),
	apellido = ISNULL(@lastName, apellido),
	userName = ISNULL(@userName, userName),
	correo = ISNULL(@email, correo),
	pass = ISNULL(@passHash, pass)
	WHERE idUser = @id;
GO

CREATE OR ALTER PROCEDURE removeUser
	@id int
AS
	SET NOCOUNT ON;
	DELETE FROM [dbo].[usuarios]
	WHERE idUser = @id;
GO

CREATE OR ALTER PROCEDURE isUserAdmin
	@id int
AS
	SET NOCOUNT ON;
	SELECT ISNULL(adm, 0) AS adm FROM [dbo].[usuarios]
	WHERE idUser = @id;
GO

-- TEST USERS

-- INSERT INTO Usuarios VALUES('John', 'Doe', 'john.doe', 'john.doe@cemex.mx', '$2a$10$VQkTCGn3c1BDGBQGgCxeGucQ/DTZqUQpen.tdu2tbZP1JHi4wKVsG', NULL) -- password
-- INSERT INTO Usuarios VALUES('Mary', 'Sue', 'mary.sue', 'mary.sue@cemex.mx', '$2a$10$fPM5jtJnBijMPRBKO0e3U.BU0mFg3K2ng1yWbF386HoA3ir9eP2N6', NULL) -- 12345
-- INSERT INTO Usuarios VALUES('Test', 'Foo', 'test.foo', 'test.foo@cemex.mx', '$2a$10$KkhBaY3oIlxmdqPo8FL5le7zTEAAVI5Gdfd1YzXjOD9i1gsG10jO2', NULL) -- qwerty
-- GO
