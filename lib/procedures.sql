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
	BEGIN
		SET NOCOUNT ON;

		-- pet creation
		DECLARE @petId int;
        DECLARE @userId int;
		DECLARE @newPet TABLE(idMascota int);
        DECLARE @newUser TABLE(idUser int);

		INSERT [dbo].[mascotas] ([nivel], [upgradeP], [experiencia],
			[ptsAtaque], [ptsDefensa], [ptsVelocidad], [ptsMaxVida], [skill],
			[type])
		OUTPUT INSERTED.idMascota INTO @newPet
		VALUES (1, 0, 0, 5, 5, 5, 50, 0, 3); -- default values

        SELECT @petId = idMascota FROM @newPet;

		-- user creation
		INSERT [dbo].[usuarios] ([nombre], [apellido], [userName], [correo], [pass],
			[adm], [idMascota])
        OUTPUT INSERTED.idUser INTO @newUser
        VALUES (@firstName, @lastName, @userName, @email, @passHash, 0, @petId);
	END
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

		DELETE FROM [dbo].[amistades]
		WHERE idUser1 = @id OR idUser2 = @id;
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

CREATE OR ALTER PROCEDURE getUserPet
	@userId int
AS
	SET NOCOUNT ON;
	SELECT m.nombre AS [name], m.nivel AS [level], m.upgradeP AS upgradePoints,
		m.experiencia AS experience, m.ptsAtaque AS attack,
		m.ptsDefensa AS defense, m.ptsVelocidad AS speed,
		m.ptsMaxVida AS maxHealth, m.idMovimiento1 AS move1,
		m.idMovimiento2 AS move2, m.idMovimiento3 AS move3, m.skill, m.[type]
	FROM [dbo].[mascotas] m
	JOIN [dbo].[usuarios] u
	ON m.idMascota = u.idMascota
	WHERE u.idUser = @userId;
GO

CREATE OR ALTER PROCEDURE modifyUserPet
	@userId int,
	@name nvarchar(255) = '',
	@level int = NULL,
	@upgradePoints int = NULL,
	@experience int = NULL,
	@attack int = NULL,
	@defense int = NULL,
	@speed int = NULL,
	@maxHealth int = NULL,
	@move1 int = 0,
	@move2 int = 0,
	@move3 int = 0,
	@skill int = NULL,
	@type int = NULL
AS
	SET NOCOUNT ON;

	UPDATE m
	SET m.nombre = IIF(@name IS NULL OR @name > '', @name, m.nombre),
	nivel = ISNULL(@level, nivel),
	upgradeP = ISNULL(@upgradePoints, upgradeP),
	experiencia = ISNULL(@experience, experiencia),
	ptsAtaque = ISNULL(@attack, ptsAtaque),
	ptsDefensa = ISNULL(@defense, ptsDefensa),
	ptsVelocidad = ISNULL(@speed, ptsVelocidad),
	ptsMaxVida = ISNULL(@maxHealth, ptsMaxVida),
	idMovimiento1 = IIF(@move1 IS NULL OR @move1 > 0, @move1, idMovimiento1),
	idMovimiento2 = IIF(@move2 IS NULL OR @move2 > 0, @move2, idMovimiento2),
	idMovimiento3 = IIF(@move3 IS NULL OR @move3 > 0, @move3, idMovimiento3),
	skill = ISNULL(@skill, skill),
	[type] = IIF(@type IS NULL OR @type > 0, @type, [type])
    FROM [dbo].[mascotas] m
	JOIN [dbo].[usuarios] u
	ON m.idMascota = u.idMascota
	WHERE u.idUser = @userId;
GO

CREATE OR ALTER PROCEDURE getFechasIssues
AS
	SET NOCOUNT ON;
	SELECT fecha_fin
	FROM issues
	WHERE fecha_fin IS NOT NULL;
GO


CREATE OR ALTER PROCEDURE getUserFriendsInfo
	@userId int
AS
	SET NOCOUNT ON;
    SELECT idUser, nombre AS firstName, apellido AS lastName, userName,
		correo AS email, twitter, foto AS picture, rol AS companyRole
	FROM [dbo].[usuarios] u
    JOIN (
    	SELECT idUser2
        FROM [dbo].amistadesConfirmadas
        WHERE idUser1 = @userId
    ) f
    ON u.idUser = f.idUser2;
GO

CREATE OR ALTER PROCEDURE createFriendship
	@userId1 int,
	@userId2 int
AS
	SET NOCOUNT ON;
	INSERT [dbo].[amistades] ([idUser1], [idUser2])
	VALUES (@userId1, @userId2);
GO

CREATE OR ALTER PROCEDURE endFriendship
	@userId1 int,
	@userId2 int
AS
	SET NOCOUNT ON;
	DELETE FROM [dbo].[amistades]
	WHERE idUser1 = @userId1 AND idUser2 = @userId2;
GO


-- ======== WARNING! RUNNING BELOW WILL DELETE USERS, PETS AND FRIENDS =========

-- DELETE FROM amistades
-- DELETE FROM usuarios
-- DELETE FROM mascotas

-- DBCC CHECKIDENT (usuarios, RESEED, 0)
-- DBCC CHECKIDENT (mascotas, RESEED, 0)

-- EXEC createUser 'John', 'Doe', 'john.doe', 'john.doe@cemex.mx', '$2a$10$VQkTCGn3c1BDGBQGgCxeGucQ/DTZqUQpen.tdu2tbZP1JHi4wKVsG' -- password
-- EXEC modifyUser 1, @picture = 'https://i.imgur.com/BwVJBLs.png', @companyRole = 'Arquitecto de Inteligencia de Negocio'
-- EXEC setUserAdmin 1, 1

-- EXEC createUser 'Mary', 'Sue', 'mary.sue', 'mary.sue@cemex.mx', '$2a$10$fPM5jtJnBijMPRBKO0e3U.BU0mFg3K2ng1yWbF386HoA3ir9eP2N6' -- 12345
-- EXEC modifyUser 2, @picture = 'https://i.imgur.com/tnFuqvt.jpg', @companyRole = 'Ingeniera DevOps', @twitter = '@MerrySioux'

-- EXEC createUser 'Test', 'Foo', 'test.foo', 'test.foo@cemex.mx', '$2a$10$KkhBaY3oIlxmdqPo8FL5le7zTEAAVI5Gdfd1YzXjOD9i1gsG10jO2' -- qwerty

-- EXEC createFriendship 1, 2
-- EXEC createFriendship 2, 1
-- EXEC createFriendship 1, 3
-- EXEC createFriendship 3, 1
-- EXEC createFriendship 3, 2

-- SELECT * FROM usuarios

-- SELECT * FROM amistades

-- GO

-- ======== WARNING! RUNNING ABOVE WILL DELETE USERS, PETS AND FRIENDS =========
