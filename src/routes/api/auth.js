const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('../../db');
const verifyToken = require('../../middleware/verifyToken');
const verifyParams = require('../../middleware/verifyParams');

// import env vars
require('dotenv').config();

// optional env
const ACCESS_EXPIRATON = parseInt(process.env.ACCESS_EXPIRATON) || 1800;
const REFRESH_EXPIRATION = parseInt(process.env.REFRESH_EXPIRATION) || 259200;

// required env
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const router = express.Router();

router.get('/', verifyToken, (_, res) => res.status(204).send());

router.post(
    '/login',
    verifyParams('email', 'password'),
    async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const hash = (await db.getPasswordFromEmail(email)) || '';
            if (!hash || !(await bcrypt.compare(password, hash))) {
                return res.status(403).send({
                    error: 'Invalid login credentials',
                });
            }

            const id = (await db.getIdFromEmail(email)) || '';
            if (!id) {
                throw `User with email ${email} has no id`;
            }

            const tokens = generateTokens(id);
            return res
                .cookie('refresh_token', tokens.refresh, {
                    maxAge: REFRESH_EXPIRATION * 1000,
                    httpOnly: true,
                })
                .status(201)
                .send({ access_token: tokens.access });
        } catch (err) {
            return next(err);
        }
    }
);

router.get('/refresh', cookieParser(), async (req, res, next) => {
    try {
        const token = req.cookies.refresh_token || '';
        if (!token) {
            return res.status(400).send({ error: 'No refresh token provided' });
        }

        const decoded = jwt.verify(token, TOKEN_SECRET);

        const tokens = generateTokens(decoded.id);
        return res
            .cookie('refresh_token', tokens.refresh, {
                maxAge: REFRESH_EXPIRATION * 1000,
                httpOnly: true,
            })
            .send({ access_token: tokens.access });
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(410).send({ error: 'Expired refresh token' });
        }
        return next(err);
    }
});

router.get('/logout', (req, res) => {
    return res.clearCookie('refresh_token').status(204).send();
});

await function generateTokens(id) {
    const adm = await db.isUserAdmin(id);
    return {
        access: jwt.sign({ id, adm }, TOKEN_SECRET, {
            expiresIn: ACCESS_EXPIRATON,
        }),
        refresh: jwt.sign({ id, adm }, TOKEN_SECRET, {
            expiresIn: REFRESH_EXPIRATION,
        }),
    };
};

module.exports = router;
