const express = require('express');
const db = require('../../../db');
const verifyParams = require('../../../middleware/verifyParams');
const selectUserId = require('../../../middleware/selectUserId');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const queryId = parseInt(req.query.userId);
        const result = await db.getUserAchievs(queryId || req.user.id);
        return res.send(result);
    } catch (err) {
        return next(err);
    }
});

router.post('/', verifyParams('achievId'), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const achievId = req.body.achievId;

        if (await db.hasUserAchiev(userId, achievId)) {
            return res
                .status(400)
                .send({ error: 'User already has achievement' });
        }

        await db.giveUserAchiev(userId, achievId);
        return res.status(201).send();
    } catch (err) {
        return next(err);
    }
});

router.get('/:achievId', async (req, res, next) => {
    try {
        const parsedId = parseInt(req.params.achievId);
        if (isNaN(parsedId) || parsedId === 0) {
            return res.status(400).send({ error: 'Invalid achievement id' });
        }

        const result = await db.hasUserAchiev(req.user.id, parsedId);
        if (!result) {
            return res
                .status(404)
                .send({ error: 'User does not have achievement' });
        }

        return res.send(result);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
