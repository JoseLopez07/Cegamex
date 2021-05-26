const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../../db');
const verifyToken = require('../../../middleware/verifyToken');
const verifyAdmin = require('../../../middleware/verifyAdmin');
const verifyParams = require('../../../middleware/verifyParams');
const selectUserId = require('../../../middleware/selectUserId');
const { RequestError } = require('mssql');

const achievsRoutes = require('./achievements');
const adminsRoutes = require('./admins');
const friendsRoutes = require('./friends');
const petsRoutes = require('./pets');

// used for generating the salt to encrypt passwords
const SALT_ROUNDS = 10;

const router = express.Router();

// method to register new user, email and username have to be unique
router.post(
    '/',
    // verifyToken, verifyAdmin,
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

// IMPORTANT:
// use token for EVERY OTHER ROUTE!!!
router.use(verifyToken);

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
router.put('/', selectUserId('token'), modifyUserInfo);

// method to change ANY user info (only accesible to admins)
router.put('/:userId', verifyAdmin, selectUserId('params'), modifyUserInfo);

async function deleteUser(req, res, next) {
    try {
        await db.removeUser(req.userId);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
}

// method to delete OWN account
router.delete('/', selectUserId('token'), deleteUser);

// method to delete ANY account (only accessible to admins)
router.delete('/:userId', verifyAdmin, selectUserId('params'), deleteUser);

// by default returns OWN user info returning a single object, but an "userIds"
// parameter can be used to speify multiple ids (sepparated by commas) and
// returns an array of objects
router.get('/', async (req, res, next) => {
    try {
        const queryIds = req.query.userIds;
        const result = queryIds
            ? await db.getMultipleUsersInfo(queryIds)
            : await db.getSingleUserInfo(req.user.id);
        return res.send(result);
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

// use every other users routes:
router.use('/achievements', achievsRoutes);
router.use('/admins', adminsRoutes);
router.use('/friends', friendsRoutes);
router.use('/pets', petsRoutes);

module.exports = router;
