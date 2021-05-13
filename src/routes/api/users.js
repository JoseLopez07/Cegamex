const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db');
const verifyToken = require('../../middleware/verifyToken');
const verifyAdminToken = require('../../middleware/verifyAdminToken');
const verifyParams = require('../../middleware/verifyParams');

// used for generating the salt to encrypt passwords
const SALT_ROUNDS = 10;

const router = express.Router();

// method to register new user, email and username have to be unique
router.post(
    '/',
    // verifyToken,
    verifyParams('firstName', 'lastName', 'userName', 'email', 'password'),
    async (req, res, next) => {
        try {
            const email = req.body.email;
            const userName = req.body.userName;

            // verify that the email isn't used already
            const isValidEmail = db.getIdFromEmail(email) == undefined;
            if (!isValidEmail) {
                res.status(409).send({
                    error: 'Email is already registered to an existing user',
                });
            }

            const isValidUserName = db.getIdFromUserName(userName) == undefined;
            if (!isValidUserName) {
                res.status(409).send({
                    error: 'Username is already registered to an existing user',
                });
            }

            const passHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
            const data = req.body;

            await db.createUser({
                firstName: data.firstName,
                lastName: data.lastName,
                userName: data.userName,
                email: data.email,
                passHash,
            });
            return res.status(201).send();
        } catch (err) {
            next(err);
        }
    }
);

// method to change OWN user info
router.put('/', verifyToken, async (req, res, next) => {
    try {
        await db.modifyUser(req.user.id, req.body);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
});

// method to change ANY user info (only accesible to admins)
router.put('/:userId', verifyAdminToken, async (req, res, next) => {
    try {
        const parsedId = parseInt(req.params.userId);
        if (isNaN(parsedId) || parsedId === 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        await db.modifyUser(parsedId, req.body);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
});

router.delete('/', verifyToken, async (req, res, next) => {
    try {
        await db.removeUser(req.user.id);
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
});

router.delete('/:userId', verifyAdminToken, async (req, res, next) => {
    try {
        const parsedId = parseInt(req.params.userId);
        if (isNaN(parsedId) || parsedId === 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        await db.removeUser(parsedId);
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
