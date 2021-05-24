const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db');
const verifyToken = require('../../middleware/verifyToken');
const verifyAdminToken = require('../../middleware/verifyAdminToken');
const verifyParams = require('../../middleware/verifyParams');
const { RequestError } = require('mssql');

// used for generating the salt to encrypt passwords
const SALT_ROUNDS = 10;

const router = express.Router();

// method to register new user, email and username have to be unique
router.post(
    '/',
    // verifyAdminToken,
    verifyParams('firstName', 'lastName', 'userName', 'email', 'password'),
    async (req, res, next) => {
        try {
            const email = req.body.email;
            const userName = req.body.userName;

            // verify that the email isn't used already
            const isValidEmail = (await db.getIdFromEmail(email)) == undefined;
            if (!isValidEmail) {
                return res.status(409).send({
                    error: 'Email is already registered to an existing user',
                });
            }

            const isValidUserName =
                (await db.getIdFromUserName(userName)) == undefined;
            if (!isValidUserName) {
                return res.status(409).send({
                    error: 'Username is already registered to an existing user',
                });
            }

            const passHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

            await db.createUser({ ...req.body, passHash });
            return res.status(201).send();
        } catch (err) {
            return next(err);
        }
    }
);

async function modifyUserInfo(req, res, next) {
    try {
        let passHash;
        if (req.body.password) {
            passHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        }

        await db.modifyUser(req.userId, { ...req.body, passHash });
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
}

// method to change OWN user info
router.put('/', verifyToken, useTokenId, modifyUserInfo);

// method to change ANY user info (only accesible to admins)
router.put('/:userId', verifyAdminToken, parseUserId, modifyUserInfo);

async function deleteUser(req, res, next) {
    try {
        await db.removeUser(req.userId);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
}

// method to delete OWN account
router.delete('/', verifyToken, useTokenId, deleteUser);

// method to delete ANY account (only accessible to admins)
router.delete('/:userId', verifyAdminToken, parseUserId, deleteUser);

async function getUserAdmin(req, res, next) {
    try {
        const adm = await db.isUserAdmin(req.userId);
        return res.send({ adm });
    } catch (err) {
        return next(err);
    }
}

// method to check if OWN user is an admin (returned as {adm: <int>})
router.get('/admins', verifyToken, useTokenId, getUserAdmin);

// method to check if ANY user is an admin (returned as {adm: <int>}, only for admins)
router.get('/admins/:userId', verifyAdminToken, parseUserId, getUserAdmin);

// method to make/remove an admin (only accesible to other admins)
router.put(
    '/admins/:userId',
    verifyAdminToken,
    verifyParams('adm'),
    parseUserId,
    async (req, res, next) => {
        try {
            await db.setUserAdmin(req.userId, req.body.adm);

            return res.status(204).send();
        } catch (err) {
            return next(err);
        }
    }
);

// by default returns OWN user info returning a single object, but an "userIds"
// parameter can be used to speify multiple ids (sepparated by commas) and
// returns an array of objects
router.get('/', verifyToken, useTokenId, async (req, res, next) => {
    try {
        const queryIds = req.query.userIds;
        const result = await db.getMultipleUsersInfo(queryIds || req.user.id);
        res.send(result);
    } catch (err) {
        if (err instanceof RequestError) {
            // console.error(err.message);
            return res
                .status(400)
                .send({ error: 'Invalid id query parameter' });
        }
        return next(err);
    }
});

// by default returns OWN friends info, but an optional "userId" parameter can
// can be used to get any user's friends
router.get('/friends', verifyToken, async (req, res, next) => {
    try {
        const queryId = parseInt(req.query.userId);
        const result = await db.getUserFriendsInfo(queryId || req.user.id);
        return res.send(result);
    } catch (err) {
        return next(err);
    }
});

// method to add a friend (single way relationship)
router.post(
    '/friends/:userId',
    verifyToken,
    parseUserId,
    async (req, res, next) => {
        try {
            await db.createFriendship(req.user.id, req.userId);
            res.status(201).send();
        } catch (err) {
            return next(err);
        }
    }
);

// method to remove a friend (single way relationship)
router.delete(
    '/friends/:userId',
    verifyToken,
    parseUserId,
    async (req, res, next) => {
        try {
            await db.endFriendship(req.user.id, req.userId);
            res.status(204).send();
        } catch (err) {
            return next(err);
        }
    }
);

// middlware for parsing a URL user id
function parseUserId(req, res, next) {
    const parsedId = parseInt(req.params.userId);
    if (isNaN(parsedId) || parsedId === 0) {
        return res.status(400).send({ error: 'Invalid user id' });
    }

    req.userId = parsedId;
    return next();
}

// middelware for using token user id
function useTokenId(req, _, next) {
    req.userId = req.user.id;
    return next();
}

module.exports = router;
