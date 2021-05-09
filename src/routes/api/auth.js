const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('express-jwt');
const jwtMiddleware = require('express-jwt');
const sql = require('mssql');
const cookieParser = require('cookie-parser');
const verifyToken = require('../../middleware/verifyToken');

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const ACCESS_EXPIRATON = parseInt(process.env.ACCESS_EXPIRATON) || 1800;
const REFRESH_EXPIRATION = parseInt(process.env.REFRESH_EXPIRATION) || 259200;

const router = express.Router();

router.get(
    '/',
    jwtMiddleware({ secret: TOKEN_SECRET, algorithms: ['HS256'] }),
    verifyToken,
    (_, res) => res.status(204).send()
);

router.get('/login', async (req, res, next) => {
    try {
        const data = req.body.body;
        const email = data.email || '';
        const password = data.password || '';
        if (!email || !password) {
            return res.status(400).send({
                error: 'No password or no password given',
            });
        }

        const hash = await queryPasswordHash(email, req.app.locals);
        if (hash == undefined) {
            // invalid email
            return res.status(403).send({
                error: 'Invalid login credentials',
            });
        }

        return bcrypt.compare(password, hash, async (err, match) => {
            if (err) {
                return next(err);
            } else if (!match) {
                // invalid password
                return res.status(403).send({
                    error: 'Invalid login credentials',
                });
            } else {
                const id = (await queryUserId(email, req.app.locals)) || '';
                if (!id) {
                    return next(
                        new Error(`User with email ${email} has no id`)
                    );
                }

                const tokens = generateTokens(id);
                return res
                    .cookie('refresh_token', tokens.refresh, {
                        maxAge: REFRESH_EXPIRATION * 1000,
                        httpOnly: true,
                    })
                    .send({ access_token: tokens.access });
            }
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/refresh', cookieParser(), async (req, res, next) => {
    try {
        const token = req.cookies.refresh_token || '';
        if (!token) {
            return res.status(400).send({ error: 'No refresh token provided' });
        }

        return jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    return res
                        .status(410)
                        .send({ error: 'Expired refresh token' });
                } else {
                    return next(err);
                }
            } else {
                const tokens = generateTokens(decoded.id);
                return res
                    .cookie('refresh_token', tokens.refresh, {
                        maxAge: REFRESH_EXPIRATION * 1000,
                        httpOnly: true,
                    })
                    .send({ access_token: tokens.access });
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res) => {
    return res.clearCookie('refresh_token').status(204).send();
});

// TODO: change the query for a procedure?
async function queryPasswordHash(email, locals) {
    await locals.dbPoolConnect;
    const result = await locals.dbPool
        .request()
        .input('email', sql.VarChar, email)
        .query('SELECT pass FROM Usuario WHERE correo = @email');

    return result.recordset[0] && result.recordset[0].pwHash;
}

async function queryUserId(email, locals) {
    await locals.dbPoolConnect;
    const result = await locals.dbPool
        .request()
        .input('email', sql.VarChar, email)
        .query('SELECT idUser FROM Usuario WHERE correo = @email');

    return result.recordset[0] && result.recordset[0].idUser;
}

function generateTokens(id) {
    return {
        access: jwt.sign({ id: id }, TOKEN_SECRET, {
            expiresIn: ACCESS_EXPIRATON,
        }),
        refresh: jwt.sign({ id: id }, TOKEN_SECRET, {
            expiresIn: REFRESH_EXPIRATION,
        }),
    };
}

module.exports = router;
