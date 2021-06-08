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

CREATE OR ALTER PROCEDURE getTopUsers
AS
	SET NOCOUNT ON;
	SELECT top(5) u.nombre AS firstName, u.apellido AS lastName,
                  u.foto AS picture, m.nivel AS [level], u.puntos AS score
	FROM usuarios u
	JOIN mascotas m on u.idMascota = m.idMascota
	ORDER BY [level] DESC, score DESC;
GO

CREATE OR ALTER PROCEDURE getIdFromEmail
	@email nvarchar(255)
AS
	SET NOCOUNT ON;
	SELECT idUser AS userId FROM [dbo].[usuarios] WHERE correo = @email;
GO

CREATE OR ALTER PROCEDURE getIdFromUserName
	@userName nvarchar(255)
AS
	SET NOCOUNT ON;
	SELECT idUser AS userId FROM [dbo].[usuarios] WHERE userName = @userName;
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
			[type], idMovimiento1, idMovimiento2, idMovimiento3)
		OUTPUT INSERTED.idMascota INTO @newPet
		VALUES (1, 0, 0, 5, 5, 5, 50, 0, 3, 0, 1, 2); -- default values

        SELECT @petId = idMascota FROM @newPet;

		-- user creation
		INSERT [dbo].[usuarios] ([nombre], [apellido], [userName], [correo], [pass],
			[adm], [idMascota], victorias, derrotas, puntos)
        OUTPUT INSERTED.idUser INTO @newUser
        VALUES (@firstName, @lastName, @userName, @email, @passHash, 0, @petId,
            0, 0, 0);

		SELECT @userId = idUser FROM @newUser;

		-- base achievement
		INSERT [dbo].[registroLogros] ([idUser], [idLogro])
		VALUES (@userId, 1);
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
	@companyRole nvarchar(255) = '',
    @victories int = NULL,
    @defeats int = NULL,
    @score int = NULL
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
	rol = IIF(@companyRole IS NULL OR @companyRole > '', @companyRole, rol),
    victorias = ISNULL(@victories, victorias),
    derrotas = ISNULL(@defeats, derrotas),
    puntos = ISNULL(@score, puntos)
    WHERE idUser = @id;
GO

CREATE OR ALTER PROCEDURE removeUser
	@id int
AS
	SET NOCOUNT ON;
	BEGIN
		DELETE FROM [dbo].[amistades]
		WHERE idUser1 = @id OR idUser2 = @id;

		DELETE FROM [dbo].[registroLogros]
		WHERE idUser = @id;

		DELETE FROM [dbo].[usuarios]
		WHERE idUser = @id;

		DELETE m
        FROM [dbo].[mascotas] m
		JOIN [dbo].[usuarios] u
		ON m.idMascota = u.idMascota
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
	SELECT idUser AS userId, nombre AS firstName, apellido AS lastName,
        userName, correo AS email, twitter, foto AS picture, rol AS companyRole,
        victorias AS victories, derrotas AS defeats, puntos AS score
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

		SELECT TOP 100 idUser AS userId, nombre AS firstName, apellido AS
            lastName, userName, correo AS email, twitter, foto AS picture,
			rol AS companyRole, victorias AS victories, derrotas AS defeats,
            puntos AS score
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
	@move1 int = -1,
	@move2 int = -1,
	@move3 int = -1,
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
	idMovimiento1 = IIF(@move1 IS NULL OR @move1 >= 0, @move1, idMovimiento1),
	idMovimiento2 = IIF(@move2 IS NULL OR @move2 >= 0, @move2, idMovimiento2),
	idMovimiento3 = IIF(@move3 IS NULL OR @move3 >= 0, @move3, idMovimiento3),
	skill = ISNULL(@skill, skill),
	[type] = ISNULL(@type, [type])
    FROM [dbo].[mascotas] m
	JOIN [dbo].[usuarios] u
	ON m.idMascota = u.idMascota
	WHERE u.idUser = @userId;
GO

CREATE OR ALTER PROCEDURE getCountFechasIssues
AS
	SET NOCOUNT ON;
	SELECT
	(SELECT Count(fecha_fin) FROM issues WHERE month(fecha_fin) = 1) AS enero,
	(SELECT Count(fecha_fin) FROM issues WHERE month(fecha_fin) = 2) AS febrero,
	(SELECT Count(fecha_fin) FROM issues WHERE month(fecha_fin) = 3) AS marzo,
	(SELECT Count(*) FROM issues WHERE month(fecha_fin) is null) AS nulls
GO

CREATE OR ALTER PROCEDURE getUserFriendsInfo
	@userId int
AS
	SET NOCOUNT ON;
    SELECT idUser AS userId, nombre AS firstName, apellido AS lastName,
        userName, correo AS email, twitter, foto AS picture, rol AS companyRole,
        victorias AS victories, derrotas AS defeats, puntos AS score
	FROM [dbo].[usuarios] u
    JOIN (
    	SELECT idUser2
        FROM [dbo].amistadesConfirmadas
        WHERE idUser1 = @userId
    ) f
    ON u.idUser = f.idUser2;
GO

CREATE OR ALTER PROCEDURE areUsersFriends
    @userId1 int,
    @userId2 int
AS
    SET NOCOUNT ON;
    SELECT COUNT(*) AS [status]
    FROM [dbo].amistadesConfirmadas
    WHERE idUser1 = @userId1 AND idUser2 = @userId2;
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

CREATE OR ALTER PROCEDURE getUserAchievs
	@userId int
AS
	SET NOCOUNT ON;
	SELECT a.idLogro AS achievId, nombre as [name], descripcion as [desc],
		fechaHora AS [dateTime]
	FROM [dbo].[logros] a
	JOIN
	(
		SELECT idLogro, fechaHora
		FROM [dbo].[registroLogros]
		WHERE idUser = @userId
	) x
	ON a.idLogro = x.idLogro;
GO

CREATE OR ALTER PROCEDURE giveUserAchiev
	@userId int,
	@achievId int
AS
	INSERT [dbo].[registroLogros] ([idUser], [idLogro])
	VALUES (@userId, @achievId);
GO

CREATE OR ALTER PROCEDURE hasUserAchiev
	@userId int,
	@achievId int
AS
	SELECT fechaHora AS [dateTime]
	FROM [dbo].[registroLogros]
	WHERE idUser = @userId AND idLogro = @achievId;
GO



-- https://stackoverflow.com/a/66659077/5699112
CREATE OR ALTER PROCEDURE queryIssues
    @limit int,
    @page int = 1,
    @orderBy nvarchar(255) = NULL,
    @orderAsc int = 0,

    @id int = NULL,
    @type nvarchar(255) = NULL,
    @name nvarchar(255) = NULL,
    @creatorEId nvarchar(255) = '',
    @leadEId nvarchar(255) = '',
    @reporterEId nvarchar(255) = '',
    @asigneeId int = 0,
    @state nvarchar(255) = NULL,
    @from datetime = NULL,
    @to datetime = NULL
AS
	SET NOCOUNT ON;

    SELECT idIssue AS issueId, tipo AS [type], nombre AS [name],
		idCreador AS creatorEId, idLider AS leadEId, idReporter AS reporterEId,
		estado AS [state], fecha_inicio AS startDate, fecha_fin AS endDate,
		idEncargado AS asigneeId
    INTO #results
    FROM [dbo].[issues]
    WHERE (idIssue = @id OR @id IS NULL) AND
    (tipo = @type OR @type IS NULL) AND
    (nombre = @name OR @name IS NULL) AND
    (idCreador = @creatorEId OR @creatorEId = '') AND
    (idLider = @leadEId OR @leadEId = '') AND
    (idReporter = @reporterEId OR @reporterEId = '') AND
    (idEncargado = @asigneeId OR @asigneeId = 0) AND
    (estado = @state OR @state IS NULL) AND
    (fecha_inicio >= @from OR @from IS NULL) AND
    (fecha_fin < @to OR @to IS NULL);

    IF (@orderAsc = 1 AND @orderBy = 'issueId')
        SELECT * FROM #results
		ORDER BY issueId ASC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'issueId')
        SELECT * FROM #results
		ORDER BY issueId DESC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;
    
    ELSE IF (@orderAsc = 1 AND @orderBy = 'name')
        SELECT * FROM #results
        ORDER BY [name] ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'name')
        SELECT * FROM #results
        ORDER BY [name] DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    
    ELSE IF (@orderAsc = 1 AND @orderBy = 'creatorEId')
        SELECT * FROM #results
        ORDER BY creatorEId ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'creatorEId')
        SELECT * FROM #results
        ORDER BY creatorEId DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    
    ELSE IF (@orderAsc = 1 AND @orderBy = 'leadEId')
        SELECT * FROM #results
        ORDER BY leadEId ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'leadEId')
        SELECT * FROM #results
        ORDER BY leadEId DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'state')
        SELECT * FROM #results
        ORDER BY [state] ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'state')
        SELECT * FROM #results
        ORDER BY [state] DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
        
    ELSE IF (@orderAsc = 1 AND @orderBy = 'startDate')
        SELECT * FROM #results
        ORDER BY startDate ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'startDate')
        SELECT * FROM #results
        ORDER BY startDate DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'endDate')
        SELECT * FROM #results
        ORDER BY endDate ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'endDate')
        SELECT * FROM #results
        ORDER BY endDate DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'asigneeId')
        SELECT * FROM #results
        ORDER BY asigneeId ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'asigneeId')
        SELECT * FROM #results
        ORDER BY asigneeId DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    
    -- default ordering
    ELSE
        SELECT * FROM #results
        ORDER BY issueId OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
GO

CREATE OR ALTER PROCEDURE querySubtasks
    @limit int,
    @page int = 1,
    @orderBy nvarchar(255) = NULL,
    @orderAsc int = 0,

    @id int = NULL,
    @issueId int = NULL,
    @name nvarchar(255) = NULL,
    @creatorEId nvarchar(255) = '',
    @leadEId nvarchar(255) = '',
    @reporterEId nvarchar(255) = '',
    @state nvarchar(255) = NULL,
    @from datetime = NULL,
    @to datetime = NULL
AS
	SET NOCOUNT ON;

    SELECT idSubtarea AS subtaskId, idIssue AS issueId, nombre AS [name],
		idCreador AS creatorEId, idLider AS leadEId, idReporter AS reporterEId,
		estado AS [state], fecha_inicio AS startDate, fecha_fin AS endDate
    INTO #results
    FROM [dbo].[subtareas]
    WHERE (idSubtarea = @id OR @id IS NULL) AND
    (idIssue = @issueId OR @issueId IS NULL) AND
    (nombre = @name OR @name IS NULL) AND
    (idCreador = @creatorEId OR @creatorEId = '') AND
    (idLider = @leadEId OR @leadEId = '') AND
    (idReporter = @reporterEId OR @reporterEId = '') AND
    (estado = @state OR @state IS NULL) AND
    (fecha_inicio >= @from OR @from IS NULL) AND
    (fecha_fin < @to OR @to IS NULL);

    IF (@orderAsc = 1 AND @orderBy = 'subtaskId')
        SELECT * FROM #results
		ORDER BY subtaskId ASC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'subtaskId')
        SELECT * FROM #results
		ORDER BY subtaskId DESC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'issueId')
        SELECT * FROM #results
		ORDER BY issueId ASC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'issueId')
        SELECT * FROM #results
		ORDER BY issueId DESC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'name')
        SELECT * FROM #results
		ORDER BY [name] ASC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'name')
        SELECT * FROM #results
		ORDER BY [name] DESC OFFSET @limit * (@page - 1) ROWS
		FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'creatorEId')
        SELECT * FROM #results
        ORDER BY creatorEId ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'creatorEId')
        SELECT * FROM #results
        ORDER BY creatorEId DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    
    ELSE IF (@orderAsc = 1 AND @orderBy = 'leadEId')
        SELECT * FROM #results
        ORDER BY leadEId ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'leadEId')
        SELECT * FROM #results
        ORDER BY leadEId DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'state')
        SELECT * FROM #results
        ORDER BY [state] ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'state')
        SELECT * FROM #results
        ORDER BY [state] DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
        
    ELSE IF (@orderAsc = 1 AND @orderBy = 'startDate')
        SELECT * FROM #results
        ORDER BY startDate ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'startDate')
        SELECT * FROM #results
        ORDER BY startDate DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;

    ELSE IF (@orderAsc = 1 AND @orderBy = 'endDate')
        SELECT * FROM #results
        ORDER BY endDate ASC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
    ELSE IF (@orderAsc = 0 AND @orderBy = 'endDate')
        SELECT * FROM #results
        ORDER BY endDate DESC OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;

    -- default ordering
    ELSE
        SELECT * FROM #results
        ORDER BY subtaskId OFFSET @limit * (@page - 1) ROWS
        FETCH NEXT @limit ROWS ONLY;
GO

CREATE OR ALTER PROCEDURE insertIssue
    @id int,
    @type nvarchar(255),
    @name nvarchar(255),
    @creatorEId nvarchar(255) = NULL,
    @leadEId nvarchar(255) = NULL,
    @reporterEId nvarchar(255) = NULL,
    @asigneeId int = NULL,
    @state nvarchar(255),
    @startDate datetime,
    @endDate datetime = NULL
AS
    INSERT [dbo].[issues] (idIssue, tipo, nombre, idCreador, idLider,
		idReporter, idEncargado, estado, fecha_inicio, fecha_fin)
    VALUES (@id, @type, @name, @creatorEId, @leadEId, @reporterEId, @asigneeId,
		@state, @startDate, @endDate);
GO

CREATE OR ALTER PROCEDURE insertSubtask
    @id int,
    @issueId int,
    @name nvarchar(255),
    @creatorEId nvarchar(255) = NULL,
    @leadEId nvarchar(255) = NULL,
    @reporterEId nvarchar(255) = NULL,
    @state nvarchar(255),
    @startDate datetime,
    @endDate datetime
AS
    INSERT [dbo].[subtareas] (idSubtarea, idIssue, nombre, idCreador, idLider,
		idReporter, estado, fecha_inicio, fecha_fin)
    VALUES (@id, @issueId, @name, @creatorEId, @leadEId, @reporterEId, @state,
		@startDate, @endDate);
GO

-- ==== WARNING! RUNNING BELOW WILL DELETE USERS, PETS, FRIENDS AND ACHIEVS ====

-- DELETE FROM amistades
-- DELETE FROM registroLogros
-- DELETE FROM usuarios
-- DELETE FROM mascotas
-- DELETE FROM logros

-- DBCC CHECKIDENT (usuarios, RESEED, 0)
-- DBCC CHECKIDENT (mascotas, RESEED, 0)
-- DBCC CHECKIDENT (logros, RESEED, 0)

-- INSERT INTO [dbo].[logros] (nombre, descripcion) VALUES ('Hello, world!', 'Crea una cuenta en Cegamex');

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

-- ==== WARNING! RUNNING ABOVE WILL DELETE USERS, PETS, FRIENDS AND ACHIEVS ====
