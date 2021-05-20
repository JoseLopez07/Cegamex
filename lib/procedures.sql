-- MUST BE RUN AFTER DB SCRIPT

CREATE UNIQUE INDEX idx_email
ON [dbo].[usuarios] (correo)
GO

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
	INSERT [dbo].[usuarios] ([nombre], [apellido], [userName], [correo], [pass],
		[adm]) VALUES (@firstName, @lastName, @userName, @email, @passHash, 0);
GO

CREATE OR ALTER PROCEDURE setUserAdmin
	@id int,
	@adm int
AS
	SET NOCOUNT ON;
	UPDATE [dbo].[usuarios]
	SET adm = @adm
	WHERE idUser = @id;
GO

-- as NULL is accepted in some columns, an empty string denotes an optional
-- parameter in such cases
CREATE OR ALTER PROCEDURE modifyUser
	@id int,
	@firstName nvarchar(255) = NULL,
	@lastName nvarchar(255) = NULL,
	@userName nvarchar(255) = NULL,
	@email nvarchar(255) = NULL,
	@passHash nvarchar(255) = NULL,
	@twitter nvarchar(255) = '',
	@picture nvarchar(255) = '',
	@companyRole nvarchar(255) = ''
AS
	SET NOCOUNT ON;
	UPDATE [dbo].[usuarios]
	SET nombre = ISNULL(@firstName, nombre),
	apellido = ISNULL(@lastName, apellido),
	userName = ISNULL(@userName, userName),
	correo = ISNULL(@email, correo),
	pass = ISNULL(@passHash, pass),
	twitter = IIF(@twitter IS NULL OR @twitter > '', @twitter, twitter),
	foto = IIF(@picture IS NULL OR @picture > '', @picture, foto),
	rol = IIF(@companyRole IS NULL OR @companyRole > '', @companyRole, rol)
	WHERE idUser = @id;
GO

CREATE OR ALTER PROCEDURE removeUser
	@id int
AS
	SET NOCOUNT ON;
	BEGIN
		DELETE m
        FROM [dbo].[mascotas] m
		JOIN [dbo].[usuarios] u
		ON m.idMascota = u.idMascota
		WHERE idUser = @id;

		DELETE FROM [dbo].[usuarios]
		WHERE idUser = @id;
	END
GO

CREATE OR ALTER PROCEDURE isUserAdmin
	@id int
AS
	SET NOCOUNT ON;
	SELECT ISNULL(adm, 0) AS adm FROM [dbo].[usuarios]
	WHERE idUser = @id;
GO

CREATE OR ALTER PROCEDURE getSingleUserInfo
	@id int
AS
	SET NOCOUNT ON;
	SELECT idUser, nombre AS firstName, apellido AS lastName, userName,
		correo AS email, twitter, foto AS picture, rol AS companyRole
	FROM [dbo].[usuarios]
	WHERE idUser = @id
GO

-- https://stackoverflow.com/a/18480166/13215978
CREATE OR ALTER PROCEDURE getMultipleUsersInfo
	@idList nvarchar(max)
AS
	SET NOCOUNT ON;
	BEGIN
		DECLARE @data xml;
		SELECT @data = CAST('<id>' + REPLACE(@idList, ',', '</id><id>') +
			'</id>' AS xml);

		SELECT TOP 100 idUser, nombre AS firstName, apellido AS lastName,
			userName, correo AS email, twitter, foto AS picture,
			rol AS companyRole
		FROM [dbo].[usuarios]
		WHERE idUser IN
		(
			SELECT t.c.value('.', 'INT')
			FROM @data.nodes('id') AS t(c)
		);
	END
GO

--------------------
-- on pet procedures, columns names are left as-is
--------------------

CREATE OR ALTER PROCEDURE getUserPet
	@userId int
AS
	SET NOCOUNT ON;
	SELECT m.idMascota, m.nombre, m.nivel, m.upgradeP, m.experiencia, m.ptsAtaque,
		m.ptsDefensa, m.ptsVelocidad, m.ptsMaxVida, m.skill, m.[type]
	FROM [dbo].[mascotas] m
	JOIN [dbo].[usuarios] u
	ON m.idMascota = u.idMascota
	WHERE u.idUser = @userId;
GO

CREATE OR ALTER PROCEDURE createUserPet
	@userId int,
	@nivel int,
	@upgradeP float,
	@experiencia float,
	@ptsAtaque float,
	@ptsDefensa float,
	@ptsVelocidad float,
	@ptsMaxVida float,
	@skill float
AS
	BEGIN
		SET NOCOUNT ON;
		
        DECLARE @petId int;
		DECLARE @newPet TABLE(idMascota int);

		INSERT [dbo].[mascotas] ([nivel], [upgradeP], [experiencia],
			[ptsAtaque], [ptsDefensa], [ptsVelocidad], [ptsMaxVida], [skill])
		OUTPUT INSERTED.idMascota INTO @newPet
		VALUES (@nivel, @upgradeP, @experiencia, @ptsAtaque,
			@ptsDefensa, @ptsVelocidad, @ptsMaxVida, @skill);

        SELECT @petId = idMascota FROM @newPet;

		UPDATE [dbo].[usuarios]
		SET idMascota = @petId
		WHERE idUser = @userId;
	END
GO

CREATE OR ALTER PROCEDURE modifyUserPet
	@userId int,
	@nombre nvarchar(255) = '',
	@nivel int = NULL,
	@upgradeP float = NULL,
	@experiencia float = NULL,
	@ptsAtaque float = NULL,
	@ptsDefensa float = NULL,
	@ptsVelocidad float = NULL,
	@ptsMaxVida float = NULL,
	@skill float = NULL,
	@type int = 0
AS
	SET NOCOUNT ON;

	UPDATE m
	SET m.nombre = IIF(@nombre IS NULL OR @nombre > '', @nombre, m.nombre),
	nivel = ISNULL(@nivel, nivel),
	upgradeP = ISNULL(@upgradeP, upgradeP),
	experiencia = ISNULL(@experiencia, experiencia),
	ptsAtaque = ISNULL(@ptsAtaque, ptsAtaque),
	ptsDefensa = ISNULL(@ptsDefensa, ptsDefensa),
	ptsVelocidad = ISNULL(@ptsVelocidad, ptsVelocidad),
	ptsMaxVida = ISNULL(@ptsMaxVida, ptsMaxVida),
	skill = ISNULL(@skill, skill),
	[type] = IIF(@type IS NULL OR @type > 0, @type, [type])
    FROM [dbo].[mascotas] m
	JOIN [dbo].[usuarios] u
	ON m.idMascota = u.idMascota
	WHERE u.idUser = @userId;
GO

CREATE OR ALTER PROCEDURE removeUserPet
	@userId int
AS
	DELETE m
    FROM [dbo].[mascotas] m
	JOIN [dbo].[usuarios] u
	ON m.idMascota = u.idMascota
	WHERE u.idUser = @userId;
GO


-- TEST USERS

-- INSERT INTO Usuarios VALUES('John', 'Doe', 'john.doe', 'john.doe@cemex.mx', '$2a$10$VQkTCGn3c1BDGBQGgCxeGucQ/DTZqUQpen.tdu2tbZP1JHi4wKVsG', 1, NULL, NULL, NULL, NULL) -- password
-- INSERT INTO Usuarios VALUES('Mary', 'Sue', 'mary.sue', 'mary.sue@cemex.mx', '$2a$10$fPM5jtJnBijMPRBKO0e3U.BU0mFg3K2ng1yWbF386HoA3ir9eP2N6', 0, NULL, NULL, NULL, NULL) -- 12345
-- INSERT INTO Usuarios VALUES('Test', 'Foo', 'test.foo', 'test.foo@cemex.mx', '$2a$10$KkhBaY3oIlxmdqPo8FL5le7zTEAAVI5Gdfd1YzXjOD9i1gsG10jO2', 0, NULL, NULL, NULL, NULL) -- qwerty
-- GO
