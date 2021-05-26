const express = require('express');
const db = require('../../db');
const verifyParams = require('../../../middleware/verifyParams');

const router = express.Router();

// by default returns OWN friends info, but an optional "userId" parameter can
// can be used to get any user's friends
router.get('/', async (req, res, next) => {
    try {
        const queryId = parseInt(req.query.userId);
        const result = await db.getUserFriendsInfo(queryId || req.user.id);
        return res.send(result);
    } catch (err) {
        return next(err);
    }
});

// method to add a friend (single way relationship)
router.post('/', verifyParams('userId'), async (req, res, next) => {
    try {
        await db.createFriendship(req.user.id, req.body.userId);
        return res.status(201).send();
    } catch (err) {
        return next(err);
    }
});

// method to remove a friend (single way relationship)
router.delete('/:userId', selectUserId('params'), async (req, res, next) => {
    try {
        await db.endFriendship(req.user.id, req.userId);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
