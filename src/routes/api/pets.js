const express = require('express');
const db = require('../../db');
const verifyToken = require('../../middleware/verifyToken');

const router = express.Router();

// method to get pet info, by default gets own pet but an "userId" parameter can
// be used a specific users id
router.get('/', verifyToken, async (req, res, next) => {
    try {
        const queryUserId = parseInt(req.query.id);
        const result = await db.getUserPet(queryUserId || req.user.id);
        res.send(result);
    } catch (err) {
        return next(err);
    }
});

router.put('/', verifyToken, async (req, res, next) => {
    try {
        await db.modifyUserPet(req.user.id, req.body);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
